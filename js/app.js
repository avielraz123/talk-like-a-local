/* Talk like a local — app logic (no frameworks, no build step). */
(function () {
  'use strict';

  const STR = window.TLAP_STRINGS;
  // Optional overrides (used by tests/smoke.html): { files: {lang: [...]}, base: {lang: 'path/'}, dataBase, timeout }
  const CFG = window.TLAP_CONFIG || {};
  const BRAND = 'Talk like a local';
  const STORE_KEY = 'tlap-local-v2';
  const OLD_KEY = 'tlap-v1'; // the single-language "Talk like a Persian" save, migrated into langs.fa
  const LEVELS = ['beginner', 'intermediate', 'advanced'];
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const ZWJ = '‍';

  /* ------------------------------------------------------------------ *
   * Languages
   * ------------------------------------------------------------------ */
  /** Lesson files per language, in menu order (js/data/<lang>/<file>.js). Loaded on demand. */
  const TOPIC_FILES = ['basics', 'people', 'food', 'colors', 'animals', 'body', 'home', 'clothes', 'time', 'city',
    'nature', 'school', 'shopping', 'feelings', 'hobbies', 'verbs', 'grammar', 'culture', 'talk'];
  const MANIFEST = {
    fa: ['alphabet'].concat(TOPIC_FILES),
    es: ['sounds'].concat(TOPIC_FILES),
    ja: ['kana'].concat(TOPIC_FILES),
    ar: ['alphabet'].concat(TOPIC_FILES),
  };
  /**
   * Per-language behaviour.
   *  script: has a non-Latin script, so the learner picks "speaking only" or "read & write".
   *  shapes: letters have 4 contextual forms (shown with ZWJ).  digits: extra.digit is shown.
   *  latin:  what the 2nd item field is called.  mark: glyph in the logo tile.
   *  name/native/flag: fallbacks when the theme file is missing.
   */
  const LANGS = {
    fa: {
      code: 'fa', dir: 'rtl', speech: 'fa-IR', script: true, shapes: true, digits: true, mark: 'ف', hello: 'سلام',
      name: { en: 'Farsi', he: 'פרסית' }, native: 'فارسی', flag: '🌹',
      variety: { en: 'Persian, as spoken in Tehran', he: 'פרסית כפי שמדברים בטהרן' },
      latin: { en: 'Latin letters', he: 'אותיות לטיניות' },
    },
    es: {
      code: 'es', dir: 'ltr', speech: 'es-MX', script: false, shapes: false, digits: false, mark: 'ñ', hello: '¡Hola!',
      name: { en: 'Spanish', he: 'ספרדית' }, native: 'Español', flag: '🌵',
      variety: { en: 'Latin American Spanish', he: 'ספרדית של אמריקה הלטינית' },
      latin: { en: 'syllables', he: 'הברות' },
    },
    ja: {
      code: 'ja', dir: 'ltr', speech: 'ja-JP', script: true, shapes: false, digits: true, mark: 'あ', hello: 'こんにちは',
      name: { en: 'Japanese', he: 'יפנית' }, native: '日本語', flag: '🌸',
      variety: { en: 'Standard Tokyo Japanese', he: 'יפנית תקנית (טוקיו)' },
      latin: { en: 'rōmaji', he: 'רומאג׳י' },
    },
    ar: {
      code: 'ar', dir: 'rtl', speech: 'ar-JO', script: true, shapes: true, digits: true, mark: 'ض', hello: 'مرحبا',
      name: { en: 'Arabic', he: 'ערבית' }, native: 'عربي', flag: '🫒',
      variety: { en: 'Spoken Levantine Arabic', he: 'ערבית מדוברת (לבנטינית)' },
      latin: { en: 'Latin letters', he: 'אותיות לטיניות' },
    },
  };
  const LANG_CODES = Object.keys(LANGS);

  /** The language being learned right now, its config, and its built lessons. */
  let cur = null;
  let L = null;
  let DB = null;
  let GROUPS = [], GROUP_BY_ID = {}, TOPICS = [], TOPIC_BY_ID = {}, ITEM_BY_ID = {}, ALL_LETTERS = [], ALL_WORDS = [];

  /* ------------------------------------------------------------------ *
   * Text normalization per language
   * ------------------------------------------------------------------ */
  const PUNCT = /[.,!?؟،:;¿¡。、！？「」『』…・〜~"“”«»()（）]/g;
  const HARAKAT = /[ً-ٰٟـ]/g; // short vowels, shadda, sukun, dagger alef, tatweel
  const ARABIC_RE = /[؀-ۿ]/;
  const JA_RE = /[぀-ヿ㐀-䶿一-鿿々]/;
  const KANJI_RE = /[㐀-䶿一-鿿々]/;
  const KANA_ONLY = /^[぀-ヿー・]+$/;
  const HIRA = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
  const KATA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const toHira = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
  const stripMarks = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

  /** Fix common keyboard mix-ups in the target script (Persian ی ک vs Arabic ي ك). */
  function fixTarget(s, code) {
    s = String(s);
    if (code === 'fa') return s.replace(/ي/g, 'ی').replace(/ك/g, 'ک');
    if (code === 'ar') return s.replace(/ی/g, 'ي').replace(/ک/g, 'ك');
    return s.normalize('NFC');
  }
  /** Target-script text reduced for lenient comparison (speech, typing in the script, search). */
  const NORM = {
    fa: (s) => fixTarget(s, 'fa').replace(/[ً-ٰٟ‌‍]/g, '').replace(/[آأإ]/g, 'ا').replace(/ة/g, 'ه')
      .replace(PUNCT, '').replace(/\s+/g, ''),
    ar: (s) => fixTarget(s, 'ar').normalize('NFC').replace(HARAKAT, '').replace(/[‌‍]/g, '')
      .replace(/[آأإٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
      .replace(PUNCT, '').replace(/\s+/g, ''),
    ja: (s) => toHira(String(s).normalize('NFKC')).replace(PUNCT, '').replace(/[\s　]+/g, ''),
    es: (s) => stripMarks(String(s).toLowerCase()).replace(/[^a-z0-9]/g, ''),
  };
  const normTarget = (s, code = cur) => (NORM[code] || NORM.es)(String(s || ''));
  /** Latin-letter text (transliteration / rōmaji / syllables) reduced for lenient comparison. */
  const NORM_LATIN = {
    fa: (s) => stripMarks(s.toLowerCase()).replace(/x/g, 'kh').replace(/q/g, 'gh').replace(/w/g, 'v')
      .replace(/aa/g, 'a').replace(/ee/g, 'i').replace(/oo|ou/g, 'u').replace(/[^a-z]/g, ''),
    ar: (s) => stripMarks(s.toLowerCase()).replace(/7/g, 'h').replace(/5/g, 'kh')
      .replace(/aa/g, 'a').replace(/ee/g, 'i').replace(/oo|ou/g, 'u').replace(/[^a-z]/g, ''),
    ja: (s) => stripMarks(s.toLowerCase()).replace(/n'/g, 'n').replace(/m(?=[bp])/g, 'n')
      .replace(/ou|oo/g, 'o').replace(/uu/g, 'u').replace(/aa/g, 'a').replace(/ee/g, 'e').replace(/[^a-z]/g, ''),
    es: (s) => stripMarks(s.toLowerCase()).replace(/[^a-z]/g, ''),
  };
  const normLatin = (s, code = cur) => (NORM_LATIN[code] || NORM_LATIN.fa)(String(s || ''));
  const normText = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-֑ͯ-ׇ]/g, '').replace(/\s+/g, ' ').trim();

  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const row = [i];
      for (let j = 1; j <= n; j++) row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = row;
    }
    return prev[n];
  }
  function compareNorm(a, b) {
    if (!a) return 'no';
    if (a === b) return 'exact';
    const d = lev(a, b);
    if ((b.length >= 4 && d <= 1) || (b.length >= 10 && d <= 2)) return 'almost';
    return 'no';
  }
  /** Lenient comparison of typed Latin letters (transliteration / rōmaji). */
  const compareTr = (input, target, code = cur) => compareNorm(normLatin(input, code), normLatin(target, code));
  const accentKey = (s) => String(s).normalize('NFC').toLowerCase().replace(PUNCT, '').replace(/\s+/g, ' ').trim();
  /** Check what the learner typed for an item: 'exact' | 'almost' (counts as right) | 'no'. */
  function checkTyped(input, it, code = cur) {
    if (code === 'es') {
      // The Spanish word itself: case, accents, ñ and ¿¡ are forgiven (an accent slip shows the exact spelling).
      const r = compareNorm(normTarget(input, 'es'), normTarget(it.tg, 'es'));
      return r === 'exact' && accentKey(input) !== accentKey(it.tg) ? 'almost' : r;
    }
    if (code === 'ja' && JA_RE.test(input)) {
      const a = normTarget(input, 'ja');
      return a && (a === normTarget(it.tg, 'ja') || (it.kana && a === normTarget(it.kana, 'ja'))) ? 'exact' : 'no';
    }
    return compareTr(input, it.tr, code);
  }
  /** Did the speech recognizer hear the target (or its kana reading)? */
  function speechMatches(heard, target, alt, code = cur) {
    const a = normTarget(heard, code);
    if (!a) return false;
    return [target, alt].filter(Boolean).some((tg) => {
      const b = normTarget(tg, code);
      if (!b) return false;
      if (a === b || a.includes(b)) return true;
      return lev(a, b) <= Math.max(1, Math.floor(b.length * 0.25));
    });
  }

  /* ------------------------------------------------------------------ *
   * Data: groups ("topics" on the menu) contain lessons ("sub-topics").
   * ------------------------------------------------------------------ */
  const levelOk = (l) => LEVELS.indexOf(l) >= 0;
  const isKana = (s) => KANA_ONLY.test(String(s).replace(PUNCT, '').replace(/\s+/g, ''));

  /** Turn one raw lesson into the app's lesson object. Broken items are skipped (ids keep their index). */
  function buildLesson(tp, code) {
    const fx = (s) => fixTarget(s, code);
    const topic = Object.assign({}, tp);
    topic.items = [];
    tp.items.forEach((raw, i) => {
      try {
        const id = tp.id + ':' + i;
        if (tp.kind === 'alphabet') {
          const [letter, name, sound, joins, exTg, exTr, exEn, exHe] = raw;
          if (![letter, name, exTg].every((x) => typeof x === 'string' && x)) return;
          topic.items.push({
            id, topic: tp.id, isLetter: true, tg: fx(letter), tr: name, name, sound: sound || name, joins: !!joins,
            kana: code === 'ja' ? letter : null,
            ex: { tg: fx(exTg), tr: exTr || '', en: exEn || '', he: exHe || '' },
          });
          return;
        }
        const [tg, tr, en, he, extra] = raw;
        if (![tg, tr, en, he].every((x) => typeof x === 'string' && x)) return;
        const x = extra && typeof extra === 'object' ? Object.assign({}, extra) : null;
        const item = { id, topic: tp.id, tg: fx(tg), tr, en, he, extra: x, kana: null };
        if (x && Array.isArray(x.form) && x.form.length === 2) x.form = [fx(x.form[0]), x.form[1]];
        else if (x) delete x.form;
        if (code === 'ja') {
          if (x && typeof x.kana === 'string' && x.kana) item.kana = x.kana;
          else if (isKana(item.tg)) item.kana = item.tg.replace(PUNCT, '').replace(/\s+/g, '');
        }
        topic.items.push(item);
      } catch (e) { /* skip a broken item */ }
    });
    return topic;
  }

  /** Build the lessons of one language from window.TLAP_DATA.langs[code]. */
  function buildDB(code) {
    const raw = ((window.TLAP_DATA || {}).langs || {})[code] || {};
    const pool = {};
    (Array.isArray(raw.topics) ? raw.topics : []).forEach((tp) => {
      try {
        if (!tp || !tp.id || pool[tp.id] || !tp.title || !Array.isArray(tp.items)) return;
        const topic = buildLesson(tp, code);
        if (!levelOk(topic.level)) topic.level = 'beginner';
        if (topic.items.length) pool[tp.id] = topic;
      } catch (e) { /* skip a broken lesson */ }
    });
    // Files load in parallel; put the groups back in manifest order.
    const ord = (g) => (g && typeof g._order === 'number' ? g._order : -1);
    const rawGroups = (Array.isArray(raw.groups) ? raw.groups : []).slice().sort((a, b) => ord(a) - ord(b));
    const db = { code, GROUPS: [], GROUP_BY_ID: {}, TOPICS: [], TOPIC_BY_ID: {}, ITEM_BY_ID: {}, dict: null };
    rawGroups.forEach((g) => {
      if (!g || !g.id || db.GROUP_BY_ID[g.id] || !g.title) return;
      const lessons = (Array.isArray(g.lessons) ? g.lessons : []).map((id) => pool[id]).filter((tp) => tp && tp.group === g.id);
      if (!lessons.length) return;
      const group = Object.assign({}, g, { level: levelOk(g.level) ? g.level : 'beginner', lessons });
      group.items = lessons.flatMap((tp) => tp.items);
      db.GROUPS.push(group);
      db.GROUP_BY_ID[g.id] = group;
    });
    db.TOPICS = db.GROUPS.flatMap((g) => g.lessons);
    db.TOPICS.forEach((tp) => {
      db.TOPIC_BY_ID[tp.id] = tp;
      tp.items.forEach((it) => (db.ITEM_BY_ID[it.id] = it));
    });
    db.ALL_LETTERS = db.TOPICS.filter((tp) => tp.kind === 'alphabet').flatMap((tp) => tp.items);
    db.ALL_WORDS = db.TOPICS.filter((tp) => tp.kind !== 'alphabet').flatMap((tp) => tp.items);
    return db;
  }
  function useDB(db) {
    DB = db;
    ({ GROUPS, GROUP_BY_ID, TOPICS, TOPIC_BY_ID, ITEM_BY_ID, ALL_LETTERS, ALL_WORDS } = db || {
      GROUPS: [], GROUP_BY_ID: {}, TOPICS: [], TOPIC_BY_ID: {}, ITEM_BY_ID: {}, ALL_LETTERS: [], ALL_WORDS: [],
    });
  }
  const groupOf = (tp) => GROUP_BY_ID[tp.group];

  /* ------------------------------------------------------------------ *
   * Lazy loading: inject a language's <script> files when it's first needed
   * ------------------------------------------------------------------ */
  const ME = (document.currentScript && document.currentScript.src) || '';
  const DATA_BASE = CFG.dataBase || (ME ? ME.replace(/[^/]*$/, '') + 'data/' : 'js/data/');
  const LOADS = {};       // code -> Promise of the current load
  const FILE_OK = {};     // 'code/file' -> true once that file called TLAP_ADD
  const LOAD_REPORT = {}; // code -> { loaded: [...], failed: [...] }
  const DBS = {};         // code -> built lessons

  // Note which file each pack came from, so groups keep menu order and broken files are detected.
  const registryAdd = window.TLAP_ADD;
  window.TLAP_ADD = function (lang, pack) {
    const cs = document.currentScript;
    const p = typeof lang === 'string' ? pack : lang;
    if (cs && cs.dataset && cs.dataset.tlapFile) {
      FILE_OK[cs.dataset.tlapLang + '/' + cs.dataset.tlapFile] = true;
      if (p && p.group && typeof p.group === 'object') p.group._order = +cs.dataset.tlapOrder;
    }
    return registryAdd.apply(this, arguments);
  };

  const filesOf = (code) => (CFG.files && CFG.files[code]) || MANIFEST[code] || [];
  const baseOf = (code) => (CFG.base && CFG.base[code]) || DATA_BASE + code + '/';

  /** Load every file of a language that hasn't loaded yet. Missing or broken files are skipped. */
  function ensureLoaded(code) {
    if (LOADS[code]) return LOADS[code];
    const files = filesOf(code);
    const todo = files.filter((f) => !FILE_OK[code + '/' + f]);
    const report = LOAD_REPORT[code] = { loaded: files.filter((f) => FILE_OK[code + '/' + f]), failed: [] };
    LOADS[code] = new Promise((resolve) => {
      let left = todo.length;
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        delete DBS[code];
        resolve(report);
      };
      const timer = setTimeout(() => {
        todo.forEach((f) => { if (!report.loaded.includes(f) && !report.failed.includes(f)) report.failed.push(f); });
        finish();
      }, CFG.timeout || 20000);
      if (!left) { finish(); return; }
      todo.forEach((f) => {
        const s = document.createElement('script');
        s.async = false; // execute in order, even though they download in parallel
        s.src = baseOf(code) + f + '.js';
        s.dataset.tlapLang = code;
        s.dataset.tlapFile = f;
        s.dataset.tlapOrder = String(files.indexOf(f));
        const done = () => {
          if (settled) return;
          (FILE_OK[code + '/' + f] ? report.loaded : report.failed).push(f);
          if (--left <= 0) finish();
        };
        s.onload = done;
        s.onerror = () => { s.remove(); done(); };
        document.head.appendChild(s);
      });
    });
    return LOADS[code];
  }
  /** Built lessons of a language (after loading). */
  function dbFor(code) {
    if (!DBS[code]) DBS[code] = buildDB(code);
    return DBS[code];
  }

  /* ------------------------------------------------------------------ *
   * Saved state (localStorage)
   *  S = { v, settings: {uiLang, lang, speech}, xp, streak,                 <- global
   *        langs: { <code>: {level, track, topics, words, speedBest} } }    <- per language
   * ------------------------------------------------------------------ */
  const freshLangState = () => ({ level: null, track: null, topics: {}, words: {}, speedBest: 0 });
  const freshState = () => ({ v: 2, settings: null, xp: 0, streak: { count: 0, last: null }, langs: {} });
  const obj = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
  /** A finite number clamped to lo..hi (anything else becomes lo). Saved data may come from an imported code, so never trust it. */
  const num = (x, lo, hi) => { const n = +x; return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo; };
  /** Keep only the entries of a map whose value is a number, clamped to lo..hi. */
  function numMap(m, lo, hi) {
    const out = {};
    Object.keys(obj(m)).forEach((k) => {
      const v = m[k];
      if (k === '__proto__' || (typeof v !== 'number' && typeof v !== 'string') || v === '' || !Number.isFinite(+v)) return;
      out[k] = num(v, lo, hi);
    });
    return out;
  }
  function normStreak(sk) {
    sk = obj(sk);
    return { count: Math.floor(num(sk.count, 0, 1e6)), last: typeof sk.last === 'string' && /^\d{4}-\d{1,2}-\d{1,2}$/.test(sk.last) ? sk.last : null };
  }

  /** Own keys of a saved map, without '__proto__' (Object.assign would turn it into a prototype). */
  const ownCopy = (m) => { const out = {}; Object.keys(obj(m)).forEach((k) => { if (k !== '__proto__') out[k] = m[k]; }); return out; };
  /** v1 saved one star rating per topic; it now belongs to the "Mix of everything" exercise. */
  function migrateTopics(topics) {
    topics = obj(topics);
    const out = {};
    Object.keys(topics).forEach((k) => {
      if (k === '__proto__') return;
      const rec = obj(topics[k]);
      const stages = rec.stages ? rec.stages : rec.stars ? { mix: rec.stars } : {};
      out[k] = Object.assign(ownCopy(rec), { best: num(rec.best, 0, 100), stages: numMap(stages, 0, 3) });
    });
    return out;
  }
  function normLangState(ls) {
    ls = Object.assign(freshLangState(), ownCopy(ls));
    ls.topics = migrateTopics(ls.topics);
    ls.words = numMap(ls.words, 0, 5);
    ls.speedBest = Math.floor(num(ls.speedBest, 0, 1e6));
    if (!levelOk(ls.level)) ls.level = null;
    if (ls.track !== 'speak' && ls.track !== 'full') ls.track = null;
    return ls;
  }
  /** Codes from saved or imported data: only real ones count, never inherited names like 'constructor'. */
  const isLangCode = (k) => LANG_CODES.includes(k);
  const isUiLang = (k) => typeof k === 'string' && Object.prototype.hasOwnProperty.call(STR, k);
  function normalizeState(st) {
    st = Object.assign(freshState(), ownCopy(st));
    st.v = 2;
    st.xp = Math.floor(num(st.xp, 0, 1e9));
    st.streak = normStreak(st.streak);
    const langs = obj(st.langs);
    st.langs = {};
    Object.keys(langs).forEach((k) => { if (isLangCode(k)) st.langs[k] = normLangState(langs[k]); });
    if (st.settings) {
      st.settings = Object.assign({ uiLang: 'en', lang: null, speech: false }, ownCopy(st.settings));
      if (!isUiLang(st.settings.uiLang)) st.settings.uiLang = 'en';
      if (!isLangCode(st.settings.lang)) st.settings.lang = null;
      st.settings.speech = !!st.settings.speech;
    }
    return st;
  }
  /** The old single-language (Farsi) save: {settings:{uiLang, level, track, speech}, topics, words, xp, streak, speedBest}. */
  function migrateOld(old) {
    old = obj(old);
    const st = freshState();
    st.xp = old.xp;
    st.streak = old.streak;
    const fa = freshLangState();
    fa.topics = old.topics;
    fa.words = old.words;
    fa.speedBest = old.speedBest;
    if (old.settings) {
      const s = obj(old.settings);
      fa.level = s.level; fa.track = s.track;
      st.settings = { uiLang: s.uiLang, lang: 'fa', speech: !!s.speech };
    }
    st.langs.fa = fa;
    return normalizeState(st);
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return normalizeState(JSON.parse(raw));
      const old = localStorage.getItem(OLD_KEY);
      if (old) {
        const st = migrateOld(JSON.parse(old));
        try { localStorage.setItem(STORE_KEY, JSON.stringify(st)); } catch (e) { /* ignore */ }
        return st;
      }
    } catch (e) { /* storage unavailable or corrupt: start fresh */ }
    return freshState();
  }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
  }
  let S = loadState();

  /** Progress and setup of one language (created on first use). */
  const langState = (code) => S.langs[code] || (S.langs[code] = freshLangState());
  const LS = () => langState(cur);
  const langReady = (code) => !!(S.langs[code] && levelOk(S.langs[code].level) && (!LANGS[code].script || S.langs[code].track));

  const dayKey = (d) => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  function currentStreak() {
    const today = dayKey(new Date());
    const y = new Date(); y.setDate(y.getDate() - 1);
    return S.streak.last === today || S.streak.last === dayKey(y) ? S.streak.count : 0;
  }
  function bumpStreak() {
    const today = dayKey(new Date());
    if (S.streak.last === today) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    S.streak.count = S.streak.last === dayKey(y) ? S.streak.count + 1 : 1;
    S.streak.last = today;
  }
  function strengthen(item, correct) {
    if (!item) return;
    const w = LS().words;
    const s = w[item.id] || 0;
    w[item.id] = correct ? Math.min(5, s + 1) : Math.max(0, s - 2);
  }

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */
  let pendingUi = 'en';
  const ui = () => (S.settings && STR[S.settings.uiLang] ? S.settings.uiLang : pendingUi);
  const MISSING = new Set();
  const langName = (code) => (LANGS[code] ? LANGS[code].name[ui()] || LANGS[code].name.en : '');
  const latinName = (code) => (LANGS[code] ? LANGS[code].latin[ui()] || LANGS[code].latin.en : '');
  /**
   * A UI string. A language-specific version "<key>_<lang>" wins when it exists (e.g. qType_es).
   * {lang} and {latin} are filled in with the language's name and its Latin-letters label.
   */
  function t(k, code) {
    code = code || cur;
    const d = STR[ui()] || STR.en;
    let v;
    if (code) {
      const kk = k + '_' + code;
      if (d[kk] !== undefined) v = d[kk];
      else if (STR.en[kk] !== undefined) { MISSING.add(ui() + ':' + kk); v = STR.en[kk]; }
    }
    if (v === undefined) v = d[k];
    if (v === undefined) { MISSING.add(ui() + ':' + k); v = STR.en[k]; }
    if (v === undefined) return k;
    if (!code) return v;
    const fill = (s) => (typeof s === 'string' ? s.replace(/\{(lang|latin)\}/g, (m, x) => (x === 'lang' ? langName(code) : latinName(code))) : s);
    return Array.isArray(v) ? v.map(fill) : fill(v);
  }
  /** "Speak, read & write": the target script comes first. Spanish is always shown as itself. */
  const readerMode = () => !!L && (!L.script || LS().track === 'full');
  const scriptTrack = () => !!L && L.script && LS().track === 'full';
  const speechOn = () => !!(SR && S.settings && S.settings.speech && L && L.speech);

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /** Text in a given language being learned: its font, language tag and direction. */
  const tgFor = (code, s, cls = '') => `<span class="tg ${cls}" lang="${code}" dir="${LANGS[code].dir}">${esc(s)}</span>`;
  /** Text in the current target language. */
  const tgS = (s, cls = '') => tgFor(cur || 'fa', s, cls);
  const trS = (s, cls = '') => `<span class="tr ${cls}" dir="ltr">${esc(s)}</span>`;
  /** Fill {name} placeholders in a UI string. */
  const fmt = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
  /** A {en, he} text in the UI language. */
  const tx = (o) => (o ? o[ui()] || o.en || '' : '');
  // Arabic-script letters (and ZWNJ), but not the digits ۰-۹ / ٠-٩: digits read left to right.
  const AR_L = '[\\u0600-\\u065F\\u066A-\\u06EF\\u06FA-\\u06FF\\u200C]';
  const JA_L = '[\\u3040-\\u30FF\\u3400-\\u4DBF\\u4E00-\\u9FFF\\u3005\\u3001\\u3002\\u300C-\\u300F\\uFF01\\uFF1F]';
  const MIXED_RE = new RegExp(`(${AR_L}+(?:[\\s\\u06F0-\\u06F9\\u0660-\\u0669]+${AR_L}+)*)|([\\u06F0-\\u06F9\\u0660-\\u0669]+)|(${JA_L}+)`, 'g');
  /**
   * Text that mixes English/Hebrew with the target script: isolate each Arabic-script run (right to left)
   * or Japanese run (left to right) so the order stays right. Digit runs on their own (e.g. "۰ ۱ ۲") get the
   * target font but follow the surrounding direction.
   */
  const mixed = (s) => {
    const ar = cur === 'ar' ? 'ar' : 'fa';
    return esc(s).replace(MIXED_RE, (m, word, digits) => (word
      ? `<span class="tg" lang="${ar}" dir="rtl">${m}</span>`
      : digits ? `<span class="tg num" lang="${ar}">${m}</span>`
        : `<span class="tg" lang="ja" dir="ltr">${m}</span>`));
  };
  /** An icon that may be an emoji or a letter of the target language. */
  const isGlyph = (s) => /\p{L}/u.test(s || '');
  const iconHTML = (icon) => (isGlyph(icon) ? tgS(icon, 'icon-tg') : esc(icon || '📘'));
  const backArrow = () => (ui() === 'he' ? '→' : '←');
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const tokens = (s) => String(s).split(/\s+/).map((w) => w.replace(PUNCT, '')).filter(Boolean);

  function meaning(it) {
    if (it.isLetter) return it.sound && it.sound !== it.name ? it.name + ' (' + it.sound + ')' : it.name;
    return it[ui()];
  }
  /** Japanese and Chinese characters are about twice as wide as Latin letters. */
  const visualLen = (s) => Array.from(String(s)).reduce((n, c) => n + (JA_RE.test(c) ? 1.8 : 1), 0);
  /** Long words and sentences get a smaller font so they fit cards and question boxes. */
  const lenCls = (s) => { const n = visualLen(s); return n > 30 ? 'xlong' : n > 16 ? 'long' : ''; };
  /** The kana reading of a Japanese word that has kanji (shown under it when reading). */
  const readingOf = (it) => (cur === 'ja' && it.kana && KANJI_RE.test(it.tg) ? it.kana : '');
  /** The word as the main thing on screen: the target first for readers (and Spanish), Latin first for speakers. */
  function wordBlock(it, size) {
    const tgFirst = readerMode();
    const kana = tgFirst ? readingOf(it) : '';
    const a = tgFirst ? tgS(it.tg, 'primary') : trS(it.tr, 'primary');
    const b = tgFirst ? trS(it.tr, 'secondary') : tgS(it.tg, 'secondary');
    return `<div class="word ${size || 'lg'} ${lenCls(tgFirst ? it.tg : it.tr)}">${a}${kana ? tgS(kana, 'reading') : ''}${b}</div>`;
  }
  /** Target script alone, as the thing to read. */
  const tgBlock = (s) => `<div class="word xl ${lenCls(s)}">${tgS(s, 'primary')}</div>`;
  /** A meaning shown big in a question. */
  const meaningBig = (s, inner) => `<div class="meaning big ${String(s).length > 34 ? 'long' : ''}">${inner === undefined ? esc(s) : inner}</div>`;
  /** Compact word for answer buttons. */
  function wordShort(it) {
    return readerMode()
      ? `${tgS(it.tg, 'opt-main')}<span class="opt-sub">${trS(it.tr)}</span>`
      : `${trS(it.tr, 'opt-main')}<span class="opt-sub">${tgS(it.tg)}</span>`;
  }
  const answerWord = (it) => (readerMode() ? `${tgS(it.tg)} (${trS(it.tr)})` : `${trS(it.tr)} (${tgS(it.tg)})`);
  function extraHTML(it) {
    const x = it.extra;
    if (!x) return '';
    if (x.digit && L.digits) return `<div class="extra"><span class="label">${esc(t('digitLabel'))}:</span> ${tgS(x.digit, 'digit')}</div>`;
    if (x.form) {
      // In spoken-Farsi lessons the form is the written version; elsewhere it is the present "I" form.
      const tp = TOPIC_BY_ID[it.topic];
      const spoken = cur === 'fa' && /spoken|colloq/i.test(it.topic + ' ' + ((tp && tp.title && tp.title.en) || ''));
      const label = spoken ? t('written') : t('presentI');
      const w = readerMode() ? `${tgS(x.form[0])} · ${trS(x.form[1])}` : `${trS(x.form[1])} · ${tgS(x.form[0])}`;
      return `<div class="extra"><span class="label">${esc(label)}:</span> ${w}</div>`;
    }
    if (x.lit && Array.isArray(x.lit)) return `<div class="extra"><span class="label">${esc(t('literally'))}:</span> “${esc(x.lit[ui() === 'he' ? 1 : 0])}”</div>`;
    return '';
  }

  const low = (s) => (s === undefined || s === null ? '' : String(s).trim().toLowerCase());
  /** True if x could also be a right answer for item: same target, Latin, English or Hebrew. */
  function sameAnswer(item, x) {
    return ['tg', 'tr', 'en', 'he'].some((k) => {
      const a = low(item[k]);
      return a !== '' && a === low(x[k]);
    });
  }
  /**
   * Pick n wrong options for item: never one that could also be right, and no two with the same key.
   * Prefer the same lesson, then the same group, then everything of the same kind (letters vs words).
   */
  function distractors(item, n, keyFn) {
    const seen = new Set([low(keyFn(item))]);
    const out = [];
    const take = (pool) => {
      for (const x of shuffle(pool)) {
        if (out.length >= n) return;
        if (x.id === item.id || !!x.isLetter !== !!item.isLetter || sameAnswer(item, x)) continue;
        const k = low(keyFn(x));
        if (!seen.has(k)) { seen.add(k); out.push(x); }
      }
    };
    const tp = TOPIC_BY_ID[item.topic];
    const g = tp && groupOf(tp);
    if (tp) take(tp.items);
    if (out.length < n && g) take(g.items);
    if (out.length < n) take(item.isLetter ? ALL_LETTERS : ALL_WORDS);
    return out;
  }

  /* ------------------------------------------------------------------ *
   * Themes (css/themes/<lang>.css + js/themes/<lang>.js, see docs/theme-format.md)
   * ------------------------------------------------------------------ */
  const theme = (code = cur) => {
    const th = code && window.TLAP_THEMES && window.TLAP_THEMES[code];
    return th && typeof th === 'object' ? th : null;
  };
  /** Built-in fallback mascot: Koko the parrot. mood: happy | cheer | sad */
  function fallbackMascot(mood) {
    const eyes = mood === 'cheer'
      ? '<path d="M45 42q5-7 10 0M65 42q5-7 10 0" stroke="#2b2d42" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
      : '<circle cx="50" cy="42" r="5" fill="#2b2d42"/><circle cx="70" cy="42" r="5" fill="#2b2d42"/>'
        + '<circle cx="51.6" cy="40.4" r="1.6" fill="#fff"/><circle cx="71.6" cy="40.4" r="1.6" fill="#fff"/>';
    const brows = mood === 'sad' ? '<path d="M43 31l10 4M77 31l-10 4" stroke="#2b2d42" stroke-width="3" stroke-linecap="round"/>' : '';
    const beak = mood === 'cheer'
      ? '<path d="M52 50q8-6 16 0q-2 12-8 14q-6-2-8-14z" fill="#ff9f1c" stroke="#db7f00" stroke-width="2"/><path d="M55 55q5 4 10 0" fill="#e5546f"/>'
      : mood === 'sad'
        ? '<path d="M53 52q7-4 14 0q-2 10-7 12q-5-2-7-12z" fill="#ff9f1c" stroke="#db7f00" stroke-width="2"/>'
        : '<path d="M52 50q8-5 16 0q-1 10-8 13q-7-3-8-13z" fill="#ff9f1c" stroke="#db7f00" stroke-width="2"/>';
    const wings = mood === 'cheer'
      ? '<path class="m-wag" d="M32 70q-20-14-18-34q14 10 22 26z" fill="#46a302"/><path d="M88 70q20-14 18-34q-14 10-22 26z" fill="#46a302"/>'
      : '<path class="m-wag" d="M33 66q-10 18 2 32q8-14-2-32z" fill="#46a302"/><path d="M87 66q10 18-2 32q-8-14 2-32z" fill="#46a302"/>';
    return `<svg viewBox="0 0 120 120" class="fallback-mascot">
      <g class="m-bob">
        <path d="M52 100q-4 16 8 18q12-2 8-18z" fill="#38b6ff"/>
        <ellipse cx="60" cy="74" rx="28" ry="30" fill="#58cc02"/>
        <ellipse cx="60" cy="82" rx="17" ry="19" fill="#d7ffb8"/>
        ${wings}
        <circle cx="60" cy="44" r="25" fill="#58cc02"/>
        <path d="M54 21q-2-14 8-17q-1 9 4 15zM62 20q4-12 15-10q-5 6-6 13z" fill="#ffc93c"/>
        <circle cx="42" cy="52" r="5" fill="#ff9eb5" opacity=".7"/><circle cx="78" cy="52" r="5" fill="#ff9eb5" opacity=".7"/>
        ${eyes}${brows}${beak}
        <path d="M50 104h7M63 104h7" stroke="#ff9f1c" stroke-width="4" stroke-linecap="round"/>
      </g></svg>`;
  }
  function mascotSVG(mood, code = cur) {
    const th = theme(code);
    if (th && th.mascot && typeof th.mascot.svg === 'function') {
      try {
        const s = th.mascot.svg(mood);
        if (typeof s === 'string' && /<svg[\s>]/i.test(s)) return s;
      } catch (e) { /* fall back */ }
    }
    return fallbackMascot(mood);
  }
  /** The mascot, sized by CSS: <div class="mascot mood-<mood> <cls>"><svg/></div>. */
  const mascot = (mood = 'happy', cls = '', code = cur) => `<div class="mascot mood-${mood} ${cls}" aria-hidden="true">${mascotSVG(mood, code)}</div>`;
  const mascotName = (code = cur) => {
    const th = theme(code);
    return (th && th.mascot && tx(th.mascot.name)) || t('m_name');
  };
  /** What the mascot says (theme lines, in the UI language; built-in lines as a fallback). */
  function themeLine(key, code = cur) {
    const th = theme(code);
    const v = th && th.lines && th.lines[key];
    let x = v && (v[ui()] || v.en);
    if (Array.isArray(x)) x = x.filter((s) => typeof s === 'string' && s).length ? pick(x.filter((s) => typeof s === 'string' && s)) : null;
    if (typeof x === 'string' && x) return x;
    const fb = t('m_' + key, code);
    return Array.isArray(fb) ? pick(fb) : fb;
  }
  const mascotSays = (text, mood = 'happy') => `<div class="mascot-row">${mascot(mood)}<div class="bubble">${esc(text)}</div></div>`;
  /** A theme decoration (banner | corner | results | ambient) wrapped in <div class="theme-deco <spot>">. */
  function deco(spot, code = cur) {
    const th = theme(code);
    const svg = th && th.decorations && th.decorations[spot];
    return typeof svg === 'string' && svg.trim() ? `<div class="theme-deco ${spot}" aria-hidden="true">${svg}</div>` : '';
  }
  const themeName = (code) => { const th = theme(code); return (th && tx(th.name)) || langName(code); };
  const themeNative = (code) => { const th = theme(code); return (th && typeof th.native === 'string' && th.native) || LANGS[code].native; };
  const themeFlag = (code) => { const th = theme(code); return (th && typeof th.flag === 'string' && th.flag) || LANGS[code].flag; };
  const DEFAULT_CONFETTI = ['#58cc02', '#ffc93c', '#ff6b6b', '#38b6ff', '#9b5de5', '#f15bb5', '#ff9f1c'];
  const confettiColors = (code = cur) => {
    const th = theme(code);
    const c = th && Array.isArray(th.confetti) ? th.confetti.filter((x) => typeof x === 'string' && x) : [];
    return c.length ? c : DEFAULT_CONFETTI;
  };

  /** Put data-lang on <html> and fill the fixed decoration layer (corner motif + ambient layer). */
  function applyTheme(code) {
    const root = document.documentElement;
    if (code) root.setAttribute('data-lang', code); else root.removeAttribute('data-lang');
    root.classList.toggle('theme-fallback', !!code && !theme(code));
    let layer = document.getElementById('theme-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'theme-layer';
      layer.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(layer, document.body.firstChild);
    }
    // Back to front: sky (sun/moon, clouds), scene (landscape along the bottom), objects, corner, ambient (moving bits).
    layer.innerHTML = code ? ['sky', 'scene', 'objects', 'corner', 'ambient'].map((spot) => deco(spot, code)).join('') : '';
    try {
      const meta = document.querySelector('meta[name="theme-color"]');
      const sun = getComputedStyle(root).getPropertyValue('--sun').trim();
      if (meta && sun) meta.setAttribute('content', sun);
    } catch (e) { /* ignore */ }
  }

  function letterForm(it, which) {
    if (which === 'initial') return it.tg + ZWJ;
    if (which === 'medial') return ZWJ + it.tg + ZWJ;
    if (which === 'final') return ZWJ + it.tg;
    return it.tg;
  }

  /* ------------------------------------------------------------------ *
   * Shell
   * ------------------------------------------------------------------ */
  const app = document.getElementById('app');

  function applyUiLang() {
    document.documentElement.lang = ui();
    document.documentElement.dir = ui() === 'he' ? 'rtl' : 'ltr';
  }
  function topBar() {
    const code = cur;
    return `<header class="topbar">
      <div class="topbar-start">
        <button class="brand" data-go="menu" aria-label="${esc(BRAND)}">
          <span class="brand-mark" aria-hidden="true">${code ? tgS(L.mark) : '💬'}</span>
          <span class="brand-text">${esc(BRAND)}</span>
        </button>
        ${code ? `<button class="lang-chip" data-go="langs" aria-label="${esc(t('changeLang') + ': ' + langName(code))}" title="${esc(t('changeLang'))}">
          <span class="lang-chip-flag" aria-hidden="true">${esc(themeFlag(code))}</span>
          <span class="lang-chip-name font-${code}" lang="${code}" dir="${L.dir}">${esc(themeNative(code))}</span>
          <span class="caret" aria-hidden="true">▾</span></button>` : ''}
      </div>
      <div class="stats">
        <span class="stat" title="${esc(t('streak'))}">🔥 ${esc(currentStreak())}</span>
        <span class="stat" title="XP">⭐ ${esc(S.xp)}</span>
        <button class="icon-btn" data-go="settings" aria-label="${esc(t('settings'))}">⚙️</button>
      </div>
    </header>`;
  }
  /** The running speed round, if any: {timer, ended}. Any other screen stops it. */
  let speed = null;
  function stopSpeed() {
    if (!speed) return;
    speed.ended = true;
    clearInterval(speed.timer);
    speed = null;
  }
  function render(html, withBar = true, keepSpeed = false) {
    if (!keepSpeed) stopSpeed();
    applyUiLang();
    app.innerHTML = (withBar ? topBar() : '') + html;
    // Tell the background which screen is showing: it calms down while the learner is answering.
    const main = app.querySelector('main');
    const screen = main ? main.classList[0] || '' : '';
    document.documentElement.setAttribute('data-screen', screen);
    document.documentElement.classList.toggle('calm', screen === 'practice' || screen === 'learn');
    $$('[data-go]', app).forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
    window.scrollTo(0, 0);
  }
  function go(where) {
    if (where === 'menu') renderMenu();
    else if (where === 'settings') renderSettings();
    else if (where === 'dictionary') renderDictionary();
    else if (where === 'langs') renderLangPicker();
  }
  function confetti() {
    const colors = confettiColors();
    const box = document.createElement('div');
    box.className = 'confetti';
    for (let i = 0; i < 70; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.background = pick(colors);
      p.style.animationDelay = Math.random() * 0.6 + 's';
      p.style.animationDuration = 2 + Math.random() * 1.5 + 's';
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 4000);
  }

  // Enter key presses the main button on screen.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if ($('.xfer-modal', app)) return; // a dialog is open: never press the screen behind it
    const tag = document.activeElement && document.activeElement.tagName;
    if (['BUTTON', 'A', 'TEXTAREA', 'SELECT'].includes(tag)) return; // let focused controls handle Enter themselves (typed answers still use it)
    const btn = $('[data-enter]:not([disabled])', app);
    if (btn && tag) { e.preventDefault(); btn.click(); }
  });

  /* ------------------------------------------------------------------ *
   * Switching language (with a loading screen the first time)
   * ------------------------------------------------------------------ */
  let openToken = 0;
  function setCur(code) {
    cur = code;
    L = LANGS[code] || null;
    useDB(null);
    dict.q = ''; dict.filter = 'all'; dict.group = '';
    applyTheme(code);
  }
  /** Make code the language being learned, load it if needed, then show `then` (default: the menu). */
  function openLang(code, then) {
    if (!LANGS[code]) return Promise.resolve();
    const tok = ++openToken;
    if (S.settings) { S.settings.lang = code; saveState(); }
    if (cur !== code || !DB) setCur(code);
    const show = () => { if (tok === openToken) (then || renderMenu)(); };
    if (DBS[code] && LOADS[code]) { useDB(DBS[code]); show(); return Promise.resolve(); }
    renderLoading(code);
    return ensureLoaded(code).then(() => {
      if (tok !== openToken) return;
      useDB(dbFor(code));
      show();
    });
  }
  /** Choose a language to learn: set it up first if it's new. */
  function pickLang(code) {
    if (!LANGS[code]) return Promise.resolve();
    if (code === cur && DB && langReady(code)) { renderMenu(); return Promise.resolve(); }
    if (!langReady(code)) { renderOnboarding({ lang: code }); return Promise.resolve(); }
    return openLang(code);
  }
  function renderLoading(code) {
    render(`<main class="center-page loading-page" aria-busy="true">
      ${mascot('happy', 'mascot-hero', code)}
      <h1>${esc(t('loading', code))}</h1>
      <p class="lead">${esc(t('loadingSub', code))}</p>
      <div class="loading-dots" aria-hidden="true"><i></i><i></i><i></i></div>
    </main>`, !!S.settings);
  }

  /* ------------------------------------------------------------------ *
   * Onboarding
   *  first run:           app language -> language to learn -> level -> track (not Spanish) -> speaking
   *  {lang}: a new language picked later: level -> track
   *  {start: 'lang'}:     settings exist but no language: language -> level -> track
   * ------------------------------------------------------------------ */
  function langCard(code, selected) {
    const th = theme(code);
    const colors = confettiColors(code);
    const tag = th && th.tagline ? th.tagline : null;
    const ls = S.langs[code];
    const done = ls ? Object.values(ls.topics).reduce((n, r) => n + Object.keys(obj(r.stages)).length, 0) : 0;
    const status = code === cur && langReady(code) ? t('learningNow')
      : done ? (done === 1 ? t('progOne') : fmt(t('progN'), { n: done })) : t('langNew');
    return `<button class="lang-card ${selected ? 'selected' : ''}" data-pick="${code}" aria-pressed="${!!selected}"
      style="--lc1:${esc(colors[0])};--lc2:${esc(colors[1] || colors[0])}">
      <span class="lang-mascot">${mascot(selected ? 'cheer' : 'happy', '', code)}</span>
      <span class="lang-info">
        <span class="lang-title"><span class="lang-flag" aria-hidden="true">${esc(themeFlag(code))}</span>
          <strong>${esc(themeName(code))}</strong>
          <span class="lang-native font-${code}" lang="${code}" dir="${LANGS[code].dir}">${esc(themeNative(code))}</span></span>
        <small class="lang-variety">${esc(tx(LANGS[code].variety))}</small>
        ${tag ? `<span class="lang-tagline"><span class="font-${code}" lang="${code}" dir="${LANGS[code].dir}">${esc(tag.target || '')}</span>
          <span class="muted">${esc(tx(tag))}</span></span>` : ''}
        <span class="lang-status">${esc(status)} · ${esc(mascotName(code))}</span>
      </span>
    </button>`;
  }
  function renderOnboarding(mode = {}) {
    const setupOnly = !!mode.lang;
    const choice = {
      uiLang: ui(),
      lang: setupOnly ? mode.lang : (S.settings && S.settings.lang) || null,
      level: setupOnly ? (S.langs[mode.lang] && S.langs[mode.lang].level) || null : null,
      track: setupOnly ? (S.langs[mode.lang] && S.langs[mode.lang].track) || null : null,
      speech: S.settings ? S.settings.speech : null,
    };
    const stepsNow = () => {
      const st = setupOnly ? [] : mode.start === 'lang' ? ['lang'] : ['uiLang', 'lang'];
      st.push('level');
      if (!choice.lang || LANGS[choice.lang].script) st.push('track');
      if (!setupOnly && !S.settings && SR) st.push('speech');
      return st;
    };
    let step = 0;
    if (choice.lang) applyTheme(choice.lang);

    const opts = {
      uiLang: () => [
        { v: 'en', title: 'English', desc: 'Learn in English' },
        { v: 'he', title: 'עברית', desc: 'ללמוד בעברית' },
      ],
      level: () => LEVELS.map((l) => ({ v: l, title: t(l, choice.lang), desc: t(l + 'Desc', choice.lang) })),
      track: () => [
        { v: 'speak', title: '🗣️ ' + t('trackSpeak', choice.lang), desc: t('trackSpeakDesc', choice.lang) },
        { v: 'full', title: '✍️ ' + t('trackFull', choice.lang), desc: t('trackFullDesc', choice.lang) },
      ],
      speech: () => [
        { v: true, title: '🎤 ' + t('speechOn'), desc: choice.lang ? t('speechDesc', choice.lang) : '' },
        { v: false, title: t('speechOff'), desc: '' },
      ],
    };
    const titles = { uiLang: 'chooseLang', lang: 'chooseLearn', level: 'chooseLevel', track: 'chooseTrack', speech: 'chooseSpeech' };

    function draw() {
      const steps = stepsNow();
      const key = steps[step];
      pendingUi = choice.uiLang;
      if (S.settings && !setupOnly) S.settings.uiLang = choice.uiLang;
      const code = choice.lang;
      const last = step === steps.length - 1;
      const tag = code && theme(code) && theme(code).tagline;
      const hello = LANG_CODES.map((c) => tgFor(c, LANGS[c].hello, `font-${c}`)).join('<span class="sep"> · </span>');
      const bubble = key === 'uiLang' ? `${esc(t('m_intro'))}<br>${esc(t('welcome'))} ${esc(t('welcomeSub'))}`
        : key === 'level' && code ? esc(themeLine('intro', code)) : '';
      const choices = key === 'lang'
        ? `<div class="lang-cards">${LANG_CODES.map((c) => langCard(c, c === choice.lang)).join('')}</div>`
        : `<div class="choices">${opts[key]().map((o, i) => `<button class="choice ${choice[key] === o.v ? 'selected' : ''}" data-i="${i}">
            <strong>${esc(o.title)}</strong>${o.desc ? `<span>${esc(o.desc)}</span>` : ''}</button>`).join('')}</div>`;
      render(`<main class="onboard">
        <div class="hero">
          ${mascot(last ? 'cheer' : 'happy', 'mascot-hero', code)}
          <div class="hero-tg">${code && tag && tag.target ? tgFor(code, tag.target) : hello}</div>
          <h1>${esc(BRAND)}</h1>
          <p class="muted">${esc(code && tag ? tx(tag) || t('tagline') : t('tagline'))}</p>
        </div>
        ${bubble ? `<div class="bubble wide">${bubble}</div>` : ''}
        <div class="dots">${steps.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>
        <h2>${esc(t(titles[key], code))}</h2>
        ${key === 'lang' ? `<p class="muted center sub">${esc(t('chooseLearnSub'))}</p>` : ''}
        ${choices}
        ${key === 'level' && code ? placeOfferHTML(code, placeFailed === code) : ''}
        <div class="row">
          ${step > 0 || setupOnly ? `<button class="btn ghost" id="ob-back">${esc(t('back'))}</button>` : '<span></span>'}
          <button class="btn primary" id="ob-next" data-enter ${choice[key] === null ? 'disabled' : ''}>
            ${esc(last ? t('start') : t('next'))}</button>
        </div>
      </main>`, false);
      $$('.choice', app).forEach((b) => b.addEventListener('click', () => {
        choice[key] = opts[key]()[+b.dataset.i].v;
        draw();
      }));
      $$('[data-pick]', app).forEach((b) => b.addEventListener('click', () => {
        choice.lang = b.dataset.pick;
        const prev = S.langs[choice.lang];
        choice.level = prev && prev.level ? prev.level : null;
        choice.track = prev && prev.track ? prev.track : null;
        applyTheme(choice.lang); // preview the language's theme right away
        draw();
      }));
      const back = $('#ob-back', app);
      if (back) back.addEventListener('click', () => {
        if (step > 0) { step--; draw(); return; }
        // Leaving the set-up of a new language: back to the language picker, in the current theme.
        applyTheme(cur);
        if (cur && DB) renderLangPicker(); else boot();
      });
      const place = $('#place-start', app);
      if (place) place.addEventListener('click', () => renderPlacement(code, {
        onPick: (lv) => { placeFailed = null; choice.level = lv; advance(); },
        onBack: () => { placeFailed = null; draw(); },
        onFail: () => { placeFailed = code; draw(); },
      }));
      $('#ob-next', app).addEventListener('click', advance);
    }
    let placeFailed = null; // the language whose test couldn't load (the note shows only for it)
    /** Next step, or finish. Also used by the placement test's "Use <level>". */
    function advance() {
      const key = stepsNow()[step];
      if (key === 'lang' && choice.lang) ensureLoaded(choice.lang); // start fetching its lessons while the learner answers the rest
      if (step < stepsNow().length - 1) { step++; draw(); return; }
      if (!S.settings) S.settings = { uiLang: choice.uiLang, lang: choice.lang, speech: !!choice.speech };
      S.settings.uiLang = choice.uiLang;
      S.settings.lang = choice.lang;
      const ls = langState(choice.lang);
      ls.level = choice.level;
      ls.track = LANGS[choice.lang].script ? choice.track : 'full';
      saveState();
      openLang(choice.lang);
    }
    draw();
  }

  /** The language picker (from the language chip in the top bar, or Settings). */
  function renderLangPicker() {
    if (!S.settings) return renderOnboarding();
    applyTheme(cur);
    render(`<main class="lang-page">
      <div class="lesson-head">
        ${cur && DB ? `<button class="icon-btn back-btn" data-go="menu" aria-label="${esc(t('menu'))}">${backArrow()}</button>` : ''}
        <h1><span class="title-icon">🌍</span><span class="title-text">${esc(t('chooseLearn'))}</span></h1>
      </div>
      <p class="muted">${esc(t('chooseLearnSub'))}</p>
      <div class="lang-cards">${LANG_CODES.map((c) => langCard(c, c === cur)).join('')}</div>
    </main>`, !!cur);
    $$('[data-pick]', app).forEach((b) => b.addEventListener('click', () => pickLang(b.dataset.pick)));
  }

  /* ------------------------------------------------------------------ *
   * Menu
   * ------------------------------------------------------------------ */
  function stars(n) {
    return `<span class="stars" aria-label="${esc(n)}/3">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : ''}">★</i>`).join('')}</span>`;
  }
  /** Lessons of a group this learner can see (no script lessons in the speaking-only track). */
  const visibleLessons = (g) => (readerMode() ? g.lessons : g.lessons.filter((tp) => tp.kind !== 'alphabet'));
  const visibleGroups = () => GROUPS.filter((g) => visibleLessons(g).length);
  /** Exercises that count toward finishing a lesson. Speaking is an optional bonus, so it never counts. */
  const countedStages = (tp) => stagesFor(tp).filter((s) => s !== 'speaking');
  function stageProgress(tp) {
    const rec = LS().topics[tp.id] || {};
    const list = countedStages(tp);
    const done = list.filter((s) => rec.stages && rec.stages[s]).length;
    return { done, total: list.length };
  }
  const lessonDone = (tp) => { const p = stageProgress(tp); return p.done === p.total; };
  function groupProgress(g) {
    return visibleLessons(g).reduce((acc, tp) => {
      const p = stageProgress(tp);
      return { done: acc.done + p.done, total: acc.total + p.total };
    }, { done: 0, total: 0 });
  }
  const pctOf = (p) => (p.total ? (p.done / p.total) * 100 : 0);
  const countText = (n, base) => (n === 1 ? t(base + 'One') : fmt(t(base + 'N'), { n }));
  const trophy = '<span class="done-badge" aria-hidden="true">🏆</span>';

  function groupCard(g) {
    const lessons = visibleLessons(g);
    const p = groupProgress(g);
    const done = p.total > 0 && p.done === p.total;
    const words = lessons.reduce((n, tp) => n + tp.items.length, 0);
    const letters = lessons.every((tp) => tp.kind === 'alphabet');
    return `<button class="topic group-card c${GROUPS.indexOf(g) % 6} ${done ? 'done' : ''}" data-group="${esc(g.id)}">
      <span class="topic-icon">${iconHTML(g.icon)}</span>
      <span class="topic-body"><strong>${mixed(tx(g.title))}</strong>
      <small>${esc(countText(lessons.length, 'subTopic'))} · ${esc(countText(words, letters ? 'letter' : 'word'))}</small>
      <span class="mini-bar"><i style="width:${pctOf(p)}%"></i></span></span>
      ${done ? trophy : ''}
    </button>`;
  }
  function lessonCard(tp, i) {
    const g = groupOf(tp);
    const p = stageProgress(tp);
    const done = p.done === p.total;
    const chip = g && tp.level !== g.level ? `<em class="level-chip lv-${tp.level}">${esc(t(tp.level))}</em>` : '';
    return `<button class="topic c${i % 6} ${done ? 'done' : ''}" data-topic="${esc(tp.id)}">
      <span class="topic-icon">${iconHTML(tp.icon)}</span>
      <span class="topic-body"><strong>${mixed(tx(tp.title))}</strong>${chip}
      <small>${esc(countText(tp.items.length, tp.kind === 'alphabet' ? 'letter' : 'word'))} · ${p.done}/${p.total} ${esc(t('stagesDone'))}</small>
      <span class="mini-bar"><i style="width:${pctOf(p)}%"></i></span></span>
      ${done ? trophy : ''}
    </button>`;
  }
  function renderNoContent() {
    render(`<main class="center-page">${mascot('sad', 'mascot-hero')}
      <p class="lead">${esc(t('noContent'))}</p>
      <div class="stack"><button class="btn primary" id="retry" data-enter>${esc(t('retry'))}</button>
      <button class="btn ghost" data-go="langs">${esc(t('changeLang'))}</button></div></main>`);
    $('#retry', app).addEventListener('click', () => {
      const code = cur;
      delete LOADS[code];
      delete DBS[code];
      useDB(null);
      openLang(code);
    });
  }
  function renderMenu() {
    if (!S.settings) return renderOnboarding();
    if (!cur) return boot();
    if (!DB) return openLang(cur);
    if (!langReady(cur)) return renderOnboarding({ lang: cur });
    if (!GROUPS.length) return renderNoContent();
    const mine = levelOk(LS().level) ? LS().level : 'beginner';
    // The learner's own level goes first, then the others in order.
    const sections = [mine, ...LEVELS.filter((l) => l !== mine)]
      .map((l) => ({ level: l, groups: visibleGroups().filter((g) => g.level === l) }))
      .filter((s) => s.groups.length);
    const best = LS().speedBest;

    render(`<main class="menu">
      ${deco('banner')}
      ${mascotSays(themeLine('greet'))}
      <h1 class="page-title">${esc(t('menuTitle'))}</h1>
      <div class="modes">
        <button class="mode review" id="m-review"><span class="mode-icon">🔁</span>
          <span><strong>${esc(t('review'))}</strong><small>${esc(t('reviewDesc'))}</small></span></button>
        <button class="mode speed" id="m-speed"><span class="mode-icon">⚡</span>
          <span><strong>${esc(t('speed'))}</strong><small>${esc(t('speedDesc'))}${best ? ` · ${esc(t('best'))}: ${best}` : ''}</small></span></button>
        <button class="mode dict" id="m-dict" data-go="dictionary"><span class="mode-icon">📖</span>
          <span><strong>${esc(t('dictionary'))}</strong><small>${esc(t('dictionaryDesc'))}</small></span></button>
      </div>
      ${sections.length ? '' : `<p class="muted center">${esc(t('noContent'))}</p>`}
      ${sections.map((s) => `<details class="section" ${s.level === mine ? 'open' : ''} data-level="${s.level}">
        <summary><span>${esc(t(s.level))}</span>${s.level === mine ? `<em class="badge">${esc(t('yourLevel'))}</em>` : ''}</summary>
        <div class="topics">${s.groups.map(groupCard).join('')}</div>
      </details>`).join('')}
    </main>`);
    $$('[data-group]', app).forEach((b) => b.addEventListener('click', () => renderGroup(GROUP_BY_ID[b.dataset.group])));
    $('#m-review', app).addEventListener('click', startReview);
    $('#m-speed', app).addEventListener('click', startSpeed);
  }

  /* ------------------------------------------------------------------ *
   * Group page: the sub-topics of one topic
   * ------------------------------------------------------------------ */
  function renderGroup(g) {
    if (!g) return renderMenu();
    const lessons = visibleLessons(g);
    const p = groupProgress(g);
    render(`<main class="group-page">
      <div class="lesson-head">
        <button class="icon-btn back-btn" data-go="menu" aria-label="${esc(t('menu'))}">${backArrow()}</button>
        <h1><span class="title-icon">${iconHTML(g.icon)}</span><span class="title-text">${mixed(tx(g.title))}</span></h1>
      </div>
      ${mascotSays(themeLine('group'))}
      <div class="topic-progress"><div class="progress grow"><i style="width:${pctOf(p)}%"></i></div>
        <span dir="ltr">${p.done}/${p.total}</span></div>
      <h2 class="section-title">${esc(t('chooseLesson'))} <small>${esc(t('chooseLessonSub'))}</small></h2>
      <div class="topics lessons">${lessons.map(lessonCard).join('')}</div>
    </main>`);
    $$('[data-topic]', app).forEach((b) => b.addEventListener('click', () => renderTopic(TOPIC_BY_ID[b.dataset.topic])));
  }
  /** The sub-topic to suggest after finishing tp: the next unfinished one in its group, else simply the next one. */
  function nextLessonAfter(tp) {
    const g = groupOf(tp);
    if (!g) return null;
    const list = visibleLessons(g);
    const at = list.indexOf(tp);
    const order = list.slice(at + 1).concat(list.slice(0, Math.max(0, at)));
    return order.find((x) => !lessonDone(x)) || list[at + 1] || null;
  }

  /* ------------------------------------------------------------------ *
   * Settings
   * ------------------------------------------------------------------ */
  function renderSettings() {
    if (!S.settings || !cur) return boot();
    const st = S.settings;
    const ls = LS();
    const val = (name) => (name === 'level' || name === 'track' ? ls[name] : st[name]);
    const seg = (name, options) => `<div class="seg" data-name="${name}">${options.map(([v, label]) =>
      `<button class="${String(val(name)) === String(v) ? 'selected' : ''}" data-v="${v}">${esc(label)}</button>`).join('')}</div>`;
    render(`<main class="settings">
      <h1 class="page-title">⚙️ ${esc(t('settings'))}</h1>
      <label>${esc(t('learnLang'))}</label>
      <div class="seg lang-seg">${LANG_CODES.map((c) => `<button class="${c === cur ? 'selected' : ''}" data-pick="${c}">
        <span aria-hidden="true">${esc(themeFlag(c))}</span> ${esc(langName(c))}</button>`).join('')}</div>
      <label>${esc(t('language'))}</label>${seg('uiLang', [['en', 'English'], ['he', 'עברית']])}
      <label>${esc(t('level'))} <small class="muted">· ${esc(langName(cur))}</small></label>${seg('level', LEVELS.map((l) => [l, t(l)]))}
      ${L.script ? `<label>${esc(t('track'))} <small class="muted">· ${esc(langName(cur))}</small></label>${seg('track', [['speak', t('trackSpeak')], ['full', t('trackFull')]])}` : ''}
      <label>${esc(t('speechSetting'))}</label>
      ${SR ? seg('speech', [[true, t('on')], [false, t('off')]]) : `<p class="muted">${esc(t('speechUnsupported'))}</p>`}
      ${xferHTML()}
      <div class="row wrap"><button class="btn danger" id="reset-lang">${esc(t('resetLang'))}</button>
      <button class="btn ghost" id="reset">${esc(t('resetProgress'))}</button></div>
      <div class="row"><span></span><button class="btn primary" data-go="menu" data-enter>${esc(t('done'))}</button></div>
    </main>`);
    $$('.seg[data-name]', app).forEach((g) => $$('button', g).forEach((b) => b.addEventListener('click', () => {
      let v = b.dataset.v;
      const name = g.dataset.name;
      if (name === 'speech') v = v === 'true';
      if (name === 'level' || name === 'track') ls[name] = v; else st[name] = v;
      saveState();
      renderSettings();
    })));
    $$('[data-pick]', app).forEach((b) => b.addEventListener('click', () => pickLang(b.dataset.pick)));
    mountXfer($('.xfer', app));
    $('#reset-lang', app).addEventListener('click', () => {
      if (!confirm(t('confirmResetLang'))) return;
      Object.assign(ls, { topics: {}, words: {}, speedBest: 0 });
      saveState();
      renderMenu();
    });
    $('#reset', app).addEventListener('click', () => {
      if (!confirm(t('confirmReset'))) return;
      const ui0 = st.uiLang;
      S = freshState();
      pendingUi = ui0;
      saveState();
      setCur(null);
      renderOnboarding();
    });
  }

  /* ------------------------------------------------------------------ *
   * Topic page: every exercise type, open in any order
   * ------------------------------------------------------------------ */
  const STAGE_ICONS = {
    learn: '📖', choice: '🔘', truefalse: '✅', match: '🧩', typing: '⌨️', order: '🔀', reading: '👀',
    spelling: '🔤', speaking: '🎤', letters: '🔠', shapes: '🌀', words: '📝', mix: '🏆',
  };
  /** What the typing exercise asks for: the Spanish word itself, otherwise the Latin letters. */
  const typedAnswer = (it) => (cur === 'es' ? it.tg : it.tr);
  const typingOk = (it) => normLatin(typedAnswer(it)).length <= 30;
  const orderOk = (it) => tokens(cur === 'es' ? it.tg : it.tr).length >= 3;
  /** Tiles for the word-order exercise. Japanese has no spaces, so read & write uses extra.parts. */
  function orderWords(it) {
    if (cur === 'ja') {
      const parts = it.extra && Array.isArray(it.extra.parts) ? it.extra.parts.filter((p) => typeof p === 'string' && p) : [];
      if (readerMode() && parts.length >= 2) return { words: parts, script: true };
      return { words: tokens(it.tr), script: false };
    }
    return readerMode() ? { words: tokens(it.tg), script: true } : { words: tokens(it.tr), script: false };
  }
  /** The characters to build in the spelling exercise: the word's letters, or a Japanese word's kana. */
  function spellWord(it) {
    if (it.isLetter || !L || !L.script) return null;
    if (cur === 'ja') return it.kana && !/\s/.test(it.kana) ? it.kana.replace(PUNCT, '') : null;
    if (/[\s‌]/.test(it.tg)) return null;
    return it.tg.replace(HARAKAT, '').replace(PUNCT, '');
  }
  function canSpell(it) {
    const w = spellWord(it);
    if (!w) return false;
    const n = Array.from(w).length;
    return n >= 2 && n <= 7;
  }

  function stagesFor(topic) {
    if (topic.kind === 'alphabet') return L.shapes ? ['learn', 'letters', 'shapes', 'words', 'match', 'mix'] : ['learn', 'letters', 'words', 'match', 'mix'];
    const items = topic.items;
    const st = ['learn', 'choice', 'truefalse', 'match'];
    if (items.filter(typingOk).length >= 3) st.push('typing');
    if (items.filter(orderOk).length >= 3) st.push('order');
    if (scriptTrack()) {
      st.push('reading');
      if (items.filter(canSpell).length >= 3) st.push('spelling');
    }
    if (speechOn()) st.push('speaking');
    st.push('mix');
    return st;
  }

  function renderTopic(topic) {
    const rec = LS().topics[topic.id] || {};
    const g = groupOf(topic);
    const p = stageProgress(topic);
    render(`<main class="topic-page">
      <div class="lesson-head">
        <button class="icon-btn back-btn" id="to-group" aria-label="${esc(g ? tx(g.title) : t('menu'))}">${backArrow()}</button>
        <h1><span class="title-icon">${iconHTML(topic.icon)}</span><span class="title-text">${mixed(tx(topic.title))}</span></h1>
      </div>
      ${topic.intro ? `<div class="intro">💡 ${mixed(tx(topic.intro))}</div>` : ''}
      ${mascotSays(themeLine('topic'))}
      <div class="topic-progress"><div class="progress grow"><i style="width:${pctOf(p)}%"></i></div>
        <span dir="ltr">${p.done}/${p.total}</span></div>
      <h2 class="section-title">${esc(t('chooseExercise'))} <small>${esc(t('chooseExerciseSub'))}</small></h2>
      <div class="stages">
        ${stagesFor(topic).map((s, i) => {
          const got = (rec.stages && rec.stages[s]) || 0;
          const bonus = s === 'speaking';
          return `<button class="stage s${i % 6} ${got ? 'done' : ''} ${s === 'mix' ? 'mix' : ''} ${bonus ? 'bonus' : ''}" data-stage="${s}">
            ${bonus ? `<em class="bonus-chip">✨ ${esc(t('bonus'))}</em>` : ''}
            <span class="stage-icon">${STAGE_ICONS[s]}</span>
            <span class="stage-text"><strong>${esc(t('st_' + s))}</strong>
            <small>${esc(t('st_' + s + '_d'))}</small></span>
            ${stars(got)}
          </button>`;
        }).join('')}
      </div>
    </main>`);
    $('#to-group', app).addEventListener('click', () => (g ? renderGroup(g) : renderMenu()));
    $$('[data-stage]', app).forEach((b) => b.addEventListener('click', () => {
      if (b.dataset.stage === 'learn') renderLearn(topic);
      else startStage(topic, b.dataset.stage);
    }));
  }

  /* ------------------------------------------------------------------ *
   * Learn (flashcards)
   * ------------------------------------------------------------------ */
  function cardFaces(it) {
    if (it.isLetter) {
      const forms = it.joins ? ['isolated', 'initial', 'medial', 'final'] : ['isolated', 'final'];
      const sound = it.sound && it.sound !== it.name ? ` <span class="muted">· ${esc(t('sound'))}: ${trS(it.sound)}</span>` : '';
      return {
        front: `<div class="letter-big">${tgS(it.tg)}</div><div class="muted">${esc(t('tapToFlip'))}</div>`,
        back: `<div class="letter-name">${trS(it.name)}${sound}</div>
          ${L.shapes ? `<div class="forms-title">${esc(t('letterForms'))}</div>
          <div class="forms">${forms.map((f) => `<div class="form">${tgS(letterForm(it, f))}<small>${esc(t(f))}</small></div>`).join('')}</div>
          ${it.joins ? '' : `<p class="note">${esc(t('nonJoining'))}</p>`}` : `<div class="letter-big small">${tgS(it.tg)}</div>`}
          <div class="example"><span class="label">${esc(t('example'))}:</span> ${tgS(it.ex.tg, 'ex-tg')} ${it.ex.tr && it.ex.tr !== it.ex.tg ? trS(it.ex.tr) : ''} = ${esc(it.ex[ui()])}</div>`,
      };
    }
    return {
      front: `${wordBlock(it, 'xl')}<div class="muted small">${esc(t('tapToFlip'))}</div>`,
      back: `${wordBlock(it, 'md')}<div class="meaning">${esc(meaning(it))}</div>${extraHTML(it)}`,
    };
  }
  function renderLearn(topic) {
    let i = 0;
    const items = topic.items;
    function draw() {
      const it = items[i];
      const f = cardFaces(it);
      render(`<main class="learn">
        <div class="lesson-head">
          <button class="icon-btn" id="exit-learn" aria-label="${esc(t('backToTopic'))}">✕</button>
          <h1><span class="title-text">${esc(t('st_learn'))} · ${mixed(tx(topic.title))}</span></h1>
        </div>
        ${i === 0 && topic.intro ? `<div class="intro">💡 ${mixed(tx(topic.intro))}</div>` : ''}
        <div class="progress"><i style="width:${((i + 1) / items.length) * 100}%"></i></div>
        <div class="counter" dir="ltr">${i + 1} / ${items.length}</div>
        <div class="card-wrap"><button class="card" id="card" aria-live="polite">
          <div class="face front">${f.front}</div><div class="face back">${f.back}</div>
        </button></div>
        <div class="report-row">${reportLink(it, 'learn')}</div>
        <div class="row">
          <button class="btn ghost" id="prev" ${i === 0 ? 'disabled' : ''}>${esc(t('prev'))}</button>
          <button class="btn primary" id="next" data-enter>${esc(i === items.length - 1 ? t('learnDone') + ' 🎉' : t('next'))}</button>
        </div>
      </main>`);
      $('#card', app).addEventListener('click', () => $('#card', app).classList.toggle('flipped'));
      $('#exit-learn', app).addEventListener('click', () => renderTopic(topic));
      $('#prev', app).addEventListener('click', () => { if (i > 0) { i--; draw(); } });
      $('#next', app).addEventListener('click', () => {
        if (i < items.length - 1) { i++; draw(); return; }
        const rec = topicRecord(topic);
        if (!rec.stages.learn) S.xp += 10;
        rec.stages.learn = 3;
        bumpStreak();
        saveState();
        renderTopic(topic);
        confetti();
      });
    }
    draw();
  }

  /* ------------------------------------------------------------------ *
   * Practice sessions
   * ------------------------------------------------------------------ */
  let session = null;

  function typesFor(it) {
    if (it.isLetter) return L.shapes ? ['letterName', 'soundLetter', 'formLetter', 'exampleRead'] : ['letterName', 'soundLetter', 'exampleRead'];
    const ts = ['mcMeaning', 'mcReverse', 'trueFalse'];
    if (normLatin(typedAnswer(it)).length <= 22) ts.push('typeTr');
    if (orderOk(it)) ts.push('order', 'order');
    if (scriptTrack()) {
      ts.push('readScript');
      if (canSpell(it)) ts.push('spell');
    }
    return ts;
  }
  function buildQueue(items) {
    const qs = [];
    let last = null;
    shuffle(items).forEach((it) => {
      let ts = typesFor(it).filter((x) => x !== last);
      if (!ts.length) ts = typesFor(it);
      const type = pick(ts);
      last = type;
      qs.push({ type, item: it });
    });
    if (speechOn()) {
      const speakable = shuffle(items.filter((it) => !it.isLetter)).slice(0, 2);
      speakable.forEach((it) => qs.splice(1 + Math.floor(Math.random() * qs.length), 0, { type: 'speak', item: it }));
    }
    const nMatch = items.length >= 10 ? 2 : items.length >= 4 ? 1 : 0;
    for (let k = 0; k < nMatch; k++) {
      const pos = Math.floor(((k + 1) * qs.length) / (nMatch + 1));
      qs.splice(pos, 0, { type: 'match', items: shuffle(items).slice(0, 5) });
    }
    return qs;
  }
  /** Split items into balanced groups of at most 5 for the matching game. */
  function chunk(items) {
    const n = Math.ceil(items.length / 5);
    const base = Math.floor(items.length / n);
    const extra = items.length % n; // the first `extra` groups get one more item
    const out = [];
    for (let g = 0, i = 0; g < n; g++) {
      const size = base + (g < extra ? 1 : 0);
      out.push(items.slice(i, i + size));
      i += size;
    }
    return out;
  }
  const STAGE_TYPE = {
    choice: () => pick(['mcMeaning', 'mcReverse']),
    truefalse: () => 'trueFalse',
    typing: () => 'typeTr',
    order: () => 'order',
    reading: () => 'readScript',
    spelling: () => 'spell',
    speaking: () => 'speak',
    letters: () => pick(['letterName', 'soundLetter']),
    shapes: () => 'formLetter',
    words: () => 'exampleRead',
  };
  const STAGE_FILTER = { typing: typingOk, order: orderOk, spelling: canSpell, speaking: (it) => !it.isLetter };

  function stageQueue(topic, stage) {
    if (stage === 'mix') return buildQueue(topic.items);
    if (stage === 'match') return chunk(shuffle(topic.items)).map((g) => ({ type: 'match', items: g }));
    const pool = topic.items.filter(STAGE_FILTER[stage] || (() => true));
    let last = null;
    return shuffle(pool).map((it) => {
      let type = STAGE_TYPE[stage](it);
      if (stage === 'choice' && type === last) type = type === 'mcMeaning' ? 'mcReverse' : 'mcMeaning';
      last = type;
      return { type, item: it };
    });
  }
  function topicRecord(topic) {
    const topics = LS().topics;
    const rec = topics[topic.id] || (topics[topic.id] = { best: 0, stages: {} });
    if (!rec.stages) rec.stages = {};
    return rec;
  }
  function startStage(topic, stage) {
    session = { mode: 'topic', topic, stage, queue: stageQueue(topic, stage), idx: 0, first: 0, firstRight: 0, xp: 0 };
    renderQuestion();
  }
  function startReview() {
    const words = LS().words;
    const ids = Object.keys(words).filter((id) => ITEM_BY_ID[id] && (readerMode() || !ITEM_BY_ID[id].isLetter));
    if (ids.length < 4) {
      render(`<main class="center-page">${mascot('happy', 'mascot-hero')}<p class="lead">${esc(t('reviewEmpty'))}</p>
        <div class="stack"><button class="btn primary" data-go="menu" data-enter>${esc(t('menu'))}</button></div></main>`);
      return;
    }
    const weakest = shuffle(ids).sort((a, b) => (words[a] || 0) - (words[b] || 0)).slice(0, 12).map((id) => ITEM_BY_ID[id]);
    session = { mode: 'review', queue: buildQueue(weakest), idx: 0, first: 0, firstRight: 0, xp: 0 };
    renderQuestion();
  }

  function sessionShell(inner, prompt) {
    const total = session.queue.length;
    return `<main class="practice">
      <div class="lesson-head">
        <button class="icon-btn" id="quit" aria-label="${esc(t('exit'))}">✕</button>
        <div class="progress grow"><i style="width:${(session.idx / total) * 100}%"></i></div>
      </div>
      <h2 class="prompt">${esc(prompt)}</h2>
      <div class="q-body">${inner}</div>
      <div class="feedback" id="feedback" hidden></div>
    </main>`;
  }

  /** Called once per question. result: true / false / null (skipped). */
  function answer(q, result, correctHTML, note) {
    if (q.answered) return;
    q.answered = true;
    const items = q.items || [q.item];
    if (result !== null) {
      items.forEach((it) => strengthen(it, result));
      if (!q.retry) { session.first++; if (result) session.firstRight++; }
      if (result) session.xp += q.type === 'match' ? 15 : 10;
      if (!result && !q.retry && q.type !== 'match') session.queue.push({ type: q.type, item: q.item, retry: true });
    }
    const fb = $('#feedback', app);
    const cls = result === null ? 'neutral' : result ? 'ok' : 'bad';
    const title = result === null ? t('skipped') : result ? (note === 'almost' ? t('almost') : themeLine('right')) : themeLine('wrong');
    fb.className = 'feedback ' + cls;
    fb.innerHTML = `${mascot(result === false ? 'sad' : result ? 'cheer' : 'happy', 'mascot-fb')}<div class="fb-text"><strong>${result ? '✓ ' : result === false ? '✗ ' : ''}${esc(title)}</strong>
      ${correctHTML && (result === false || note === 'almost') ? `<div>${note === 'almost' ? '' : esc(t('correctAnswer')) + ' '}${correctHTML}</div>` : ''}
      ${q.item ? reportLink(q.item, 'exercise (' + q.type + ')') : ''}</div>
      <button class="btn ${result === false ? 'danger' : 'primary'}" id="continue" data-enter>${esc(t('continue'))}</button>`;
    fb.hidden = false;
    $$('.q-body button, .q-body input', app).forEach((el) => { if (!el.closest('.feedback')) el.disabled = true; });
    $('#continue', app).addEventListener('click', nextQuestion);
    $('#continue', app).focus();
  }
  function nextQuestion() {
    session.idx++;
    if (session.idx >= session.queue.length) finishSession();
    else renderQuestion();
  }

  function renderQuestion() {
    const q = session.queue[session.idx];
    const builder = QUESTIONS[q.type];
    const { prompt, html, mount } = builder(q);
    render(sessionShell(html, prompt));
    $('#quit', app).addEventListener('click', () => {
      if (!confirm(t('confirmQuit'))) return;
      if (session.mode === 'topic') renderTopic(session.topic); else renderMenu();
    });
    mount($('.q-body', app));
  }

  /** Multiple-choice helper. options: [{html, correct}] */
  function choiceQuestion(q, prompt, stem, options, correctHTML, extraCls = '') {
    const opts = shuffle(options);
    return {
      prompt,
      options: opts,
      html: `<div class="stem">${stem}</div><div class="options ${extraCls}">${opts.map((o, i) =>
        `<button class="opt" data-i="${i}">${o.html}</button>`).join('')}</div>`,
      mount(root) {
        $$('.opt', root).forEach((b) => b.addEventListener('click', () => {
          const o = opts[+b.dataset.i];
          $$('.opt', root).forEach((x, i) => { if (opts[i].correct) x.classList.add('right'); });
          if (!o.correct) b.classList.add('wrong');
          answer(q, o.correct, correctHTML);
        }));
      },
    };
  }
  /** Characters that can be offered as wrong tiles in the spelling exercise. */
  function spellDecoys(letters) {
    let pool;
    if (cur === 'ja') pool = Array.from(/[゠-ヿ]/.test(letters.join('')) ? KATA : HIRA);
    else {
      pool = ALL_LETTERS.map((l) => l.tg).filter((l) => Array.from(l).length === 1);
      if (pool.length < 6) pool = pool.concat(Array.from(cur === 'fa' ? 'ابپتسشکگلمنوهی' : 'ابتسشكلمنوهي'));
    }
    return shuffle(Array.from(new Set(pool)).filter((l) => !letters.includes(l))).slice(0, 2);
  }

  const QUESTIONS = {
    mcMeaning(q) {
      const it = q.item;
      const others = distractors(it, 3, meaning);
      return choiceQuestion(q, t('qMeaning'), wordBlock(it, 'lg'),
        [it, ...others].map((x) => ({ html: esc(meaning(x)), correct: x === it, item: x })), esc(meaning(it)));
    },
    mcReverse(q) {
      const it = q.item;
      const others = distractors(it, 3, (x) => (readerMode() ? x.tg : x.tr));
      return choiceQuestion(q, t('qReverse'), meaningBig(meaning(it)),
        [it, ...others].map((x) => ({ html: wordShort(x), correct: x === it, item: x })), answerWord(it));
    },
    readScript(q) {
      const it = q.item;
      const others = distractors(it, 3, (x) => x.tr);
      return choiceQuestion(q, t('qRead'), tgBlock(it.tg),
        [it, ...others].map((x) => ({ html: trS(x.tr), correct: x === it, item: x })), `${trS(it.tr)} = ${esc(meaning(it))}`);
    },
    trueFalse(q) {
      const it = q.item;
      const honest = Math.random() < 0.5;
      const shown = honest ? it : distractors(it, 1, meaning)[0] || it;
      const isTrue = shown === it;
      return {
        prompt: t('qTrueFalse'),
        shown,
        isTrue,
        html: `<div class="stem">${wordBlock(it, 'lg')}<div class="equals">=</div>${meaningBig(meaning(shown))}</div>
          <div class="options two"><button class="opt yes" data-v="1">✓ ${esc(t('yes'))}</button>
          <button class="opt no" data-v="0">✗ ${esc(t('no'))}</button></div>`,
        mount(root) {
          $$('.opt', root).forEach((b) => b.addEventListener('click', () => {
            const ok = (b.dataset.v === '1') === isTrue;
            b.classList.add(ok ? 'right' : 'wrong');
            answer(q, ok, `${answerWord(it)} = ${esc(meaning(it))}`);
          }));
        },
      };
    },
    typeTr(q) {
      const it = q.item;
      const es = cur === 'es';
      const want = typedAnswer(it);
      const stem = scriptTrack()
        ? `<div class="word lg">${tgS(it.tg, 'primary')}</div><div class="meaning">${esc(meaning(it))}</div>`
        : meaningBig(meaning(it));
      return {
        prompt: t('qType'),
        html: `<div class="stem">${stem}</div>
          <input class="type-in ${es ? 'tg' : ''}" id="type-in" dir="ltr" ${es ? 'lang="es"' : ''} autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(t('typePlaceholder'))}">
          <p class="muted small">${esc(t('typeTip'))}</p>
          <div class="row"><button class="btn ghost" id="hint">💡 ${esc(t('hint'))}</button>
          <button class="btn primary" id="check" data-enter>${esc(t('check'))}</button></div>`,
        mount(root) {
          const input = $('#type-in', root);
          input.focus();
          let hints = 0;
          $('#hint', root).addEventListener('click', () => {
            hints++;
            const chars = Array.from(want);
            input.value = chars.slice(0, Math.ceil((chars.length * hints) / 3)).join('');
            input.focus();
          });
          $('#check', root).addEventListener('click', () => {
            const r = checkTyped(input.value, it);
            input.classList.add(r === 'no' ? 'wrong' : 'right');
            answer(q, r !== 'no', es ? tgS(it.tg) : trS(it.tr), r === 'almost' ? 'almost' : null);
          });
        },
      };
    },
    order(q) {
      const it = q.item;
      const { words: target, script } = orderWords(it);
      const dir = script ? L.dir : 'ltr';
      let bank = shuffle(target.map((w, i) => ({ w, i })));
      if (bank.length > 1 && bank.every((b, k) => b.i === k)) bank = bank.reverse();
      const placed = [];
      const tile = (b, where) => `<button class="tile" data-where="${where}" data-i="${b.i}">${script ? tgS(b.w) : trS(b.w)}</button>`;
      return {
        prompt: t('qOrder'),
        html: `<div class="stem">${meaningBig(meaning(it))}</div>
          <div class="answer-line ${cur === 'ja' && script ? 'joined' : ''}" id="line" dir="${dir}"></div>
          <div class="bank" id="bank" dir="${dir}"></div>
          <div class="row"><span></span><button class="btn primary" id="check" data-enter disabled>${esc(t('check'))}</button></div>`,
        mount(root) {
          const draw = () => {
            $('#line', root).innerHTML = placed.map((b) => tile(b, 'line')).join('');
            $('#bank', root).innerHTML = bank.map((b) => tile(b, 'bank')).join('');
            $('#check', root).disabled = bank.length > 0;
            $$('.tile', root).forEach((el) => el.addEventListener('click', () => {
              const i = +el.dataset.i;
              const [from, to] = el.dataset.where === 'bank' ? [bank, placed] : [placed, bank];
              const k = from.findIndex((b) => b.i === i);
              to.push(from.splice(k, 1)[0]);
              draw();
            }));
          };
          draw();
          $('#check', root).addEventListener('click', () => {
            const ok = placed.map((b) => b.w).join('\u0001') === target.join('\u0001');
            $('#line', root).classList.add(ok ? 'right' : 'wrong');
            answer(q, ok, script ? tgS(it.tg) : trS(it.tr));
          });
        },
      };
    },
    spell(q) {
      const it = q.item;
      const letters = Array.from(spellWord(it) || it.tg);
      const bank = shuffle([...letters, ...spellDecoys(letters)]).map((ch, i) => ({ ch, i }));
      const built = [];
      const reading = cur === 'ja' && it.kana !== it.tg ? `<div class="muted">${tgS(it.tg)}</div>` : '';
      return {
        prompt: t('qSpell'),
        html: `<div class="stem">${meaningBig(meaning(it))}<div class="muted">${trS(it.tr)}</div>${reading}</div>
          <div class="spell-out" id="out">${tgS('')}</div>
          <div class="bank letters" id="bank" dir="${L.dir}"></div>
          <div class="row"><button class="btn ghost" id="undo" aria-label="${esc(t('clear'))}">⌫</button>
          <button class="btn primary" id="check" data-enter disabled>${esc(t('check'))}</button></div>`,
        mount(root) {
          const draw = () => {
            $('#out', root).innerHTML = tgS(built.map((b) => b.ch).join('') || ' ');
            $('#bank', root).innerHTML = bank.map((b) =>
              `<button class="tile letter ${built.includes(b) ? 'used' : ''}" data-i="${b.i}" ${built.includes(b) ? 'disabled' : ''}>${tgS(b.ch)}</button>`).join('');
            $('#check', root).disabled = built.length !== letters.length;
            $$('.tile', root).forEach((el) => el.addEventListener('click', () => {
              if (built.length >= letters.length) return;
              built.push(bank.find((b) => b.i === +el.dataset.i));
              draw();
            }));
          };
          draw();
          $('#undo', root).addEventListener('click', () => { built.pop(); draw(); });
          $('#check', root).addEventListener('click', () => {
            const ok = built.map((b) => b.ch).join('') === letters.join('');
            $('#out', root).classList.add(ok ? 'right' : 'wrong');
            answer(q, ok, cur === 'ja' && it.kana !== it.tg ? `${tgS(it.kana)} (${tgS(it.tg)})` : tgS(it.tg));
          });
        },
      };
    },
    match(q) {
      const items = q.items;
      const left = shuffle(items);
      const right = shuffle(items);
      const leftHTML = (it) => (it.isLetter ? tgS(it.tg, 'match-letter') : readerMode() ? tgS(it.tg) : trS(it.tr));
      const rightHTML = (it) => (it.isLetter ? trS(it.name) : esc(meaning(it)));
      return {
        prompt: t('qMatch'),
        html: `<div class="match">
          <div class="col">${left.map((it) => `<button class="m-btn" data-side="l" data-id="${it.id}">${leftHTML(it)}</button>`).join('')}</div>
          <div class="col">${right.map((it) => `<button class="m-btn" data-side="r" data-id="${it.id}">${rightHTML(it)}</button>`).join('')}</div>
        </div>`,
        mount(root) {
          let sel = null; let mistakes = 0; let matched = 0;
          $$('.m-btn', root).forEach((b) => b.addEventListener('click', () => {
            if (b.classList.contains('matched')) return;
            if (!sel || sel.dataset.side === b.dataset.side) {
              if (sel) sel.classList.remove('sel');
              sel = b; b.classList.add('sel');
              return;
            }
            const a = sel; sel = null; a.classList.remove('sel');
            if (a.dataset.id === b.dataset.id) {
              a.classList.add('matched'); b.classList.add('matched');
              a.disabled = b.disabled = true;
              if (++matched === items.length) answer(q, mistakes <= 1, null);
            } else {
              mistakes++;
              [a, b].forEach((x) => { x.classList.add('wrong'); setTimeout(() => x.classList.remove('wrong'), 500); });
            }
          }));
        },
      };
    },
    speak(q) {
      const it = q.item;
      return {
        prompt: t('qSpeak'),
        html: `<div class="stem">${wordBlock(it, 'lg')}<div class="meaning">${esc(meaning(it))}</div></div>
          <button class="mic" id="mic" aria-label="${esc(t('tapMic'))}">🎤</button>
          <p class="center muted" id="mic-status">${esc(t('tapMic'))}</p>
          <div class="row center-row"><button class="btn ghost" id="skip">${esc(t('skipSpeak'))}</button></div>`,
        mount(root) {
          const status = $('#mic-status', root);
          let rec = null;
          $('#skip', root).addEventListener('click', () => { try { if (rec) rec.abort(); } catch (e) { /* ignore */ } answer(q, null); });
          $('#mic', root).addEventListener('click', () => {
            try {
              rec = new SR();
              rec.lang = L.speech;
              rec.maxAlternatives = 5;
              rec.interimResults = false;
            } catch (e) { status.textContent = t('micError'); return; }
            $('#mic', root).classList.add('live');
            status.textContent = t('listening');
            rec.onresult = (ev) => {
              const alts = Array.from(ev.results[0]).map((a) => a.transcript);
              if (alts.some((a) => speechMatches(a, it.tg, it.kana))) answer(q, true, null);
              else status.innerHTML = `${esc(t('heard'))} ${tgS(alts[0] || '…')}<br>${esc(t('notMatched'))}`;
            };
            rec.onerror = () => { status.textContent = t('micError'); };
            rec.onend = () => { const m = $('#mic', root); if (m) m.classList.remove('live'); };
            try { rec.start(); } catch (e) { status.textContent = t('micError'); }
          });
        },
      };
    },
    letterName(q) {
      const it = q.item;
      const others = distractors(it, 3, (x) => x.name);
      const label = (x) => `${trS(x.name)}${x.sound && x.sound !== x.name ? ` <span class="opt-sub">${trS(x.sound)}</span>` : ''}`;
      return choiceQuestion(q, t('qLetterName'), `<div class="letter-big">${tgS(it.tg)}</div>`,
        [it, ...others].map((x) => ({ html: label(x), correct: x === it, item: x })), label(it));
    },
    soundLetter(q) {
      const it = q.item;
      const others = distractors(it, 3, (x) => x.tg);
      const sound = it.sound && it.sound !== it.name ? `<div class="muted">${esc(t('sound'))}: ${trS(it.sound)}</div>` : '';
      return choiceQuestion(q, t('qSoundLetter'), `<div class="meaning big">${trS(it.name)}</div>${sound}`,
        [it, ...others].map((x) => ({ html: tgS(x.tg, 'opt-letter'), correct: x === it, item: x })), tgS(it.tg), 'letters-4');
    },
    formLetter(q) {
      const it = q.item;
      const which = it.joins ? pick(['initial', 'medial', 'final']) : 'final';
      const others = distractors(it, 3, (x) => x.tg);
      return choiceQuestion(q, t('qForm'), `<div class="letter-big form-shown">${tgS(letterForm(it, which))}</div><div class="muted">(${esc(t(which))})</div>`,
        [it, ...others].map((x) => ({ html: tgS(x.tg, 'opt-letter'), correct: x === it, item: x })), `${tgS(it.tg)} ${trS(it.name)}`, 'letters-4');
    },
    exampleRead(q) {
      const it = q.item;
      if (!L.script) {
        // Spanish: the example is already in Latin letters, so ask what it means.
        const others = distractors(it, 3, (x) => x.ex[ui()]);
        return choiceQuestion(q, t('qExample'), `${tgBlock(it.ex.tg)}<div class="muted">${trS(it.ex.tr)}</div>`,
          [it, ...others].map((x) => ({ html: esc(x.ex[ui()]), correct: x === it, item: x })), `${tgS(it.ex.tg)} = ${esc(it.ex[ui()])}`);
      }
      const others = distractors(it, 3, (x) => x.ex.tr);
      return choiceQuestion(q, t('qExample'), tgBlock(it.ex.tg),
        [it, ...others].map((x) => ({ html: trS(x.ex.tr), correct: x === it, item: x })), `${trS(it.ex.tr)} = ${esc(it.ex[ui()])}`);
    },
  };

  /** The mascot on a results screen, with the theme's results decoration behind it. */
  const resultsHero = (mood) => `<div class="results-hero">${deco('results')}${mascot(mood, 'mascot-result')}</div>`;

  function finishSession() {
    const done = session;
    // Speaking is optional: if every speaking exercise was skipped, there is nothing to score.
    if (done.first === 0 && done.stage === 'speaking') {
      render(`<main class="results">${resultsHero('happy')}
        <p class="lead">${esc(t('speakAllSkipped'))}</p>
        <div class="stack"><button class="btn primary" id="to-topic" data-enter>${esc(t('backToTopic'))}</button></div></main>`);
      $('#to-topic', app).addEventListener('click', () => renderTopic(done.topic));
      return;
    }
    const pct = done.first ? Math.round((done.firstRight / done.first) * 100) : 100;
    const starCount = pct >= 90 ? 3 : pct >= 70 ? 2 : 1;
    const bonus = 20 + (pct === 100 ? 10 : 0);
    const xp = done.xp + bonus;
    S.xp += xp;
    bumpStreak();
    let nextStage = null;
    let nextLesson = null;
    if (done.mode === 'topic') {
      const rec = topicRecord(done.topic);
      rec.stages[done.stage] = Math.max(rec.stages[done.stage] || 0, starCount);
      rec.best = Math.max(rec.best || 0, pct);
      // Suggest the next exercise in this lesson that hasn't been done yet (wrapping around).
      // Speaking is a bonus and is never suggested.
      const list = countedStages(done.topic);
      const at = list.indexOf(done.stage);
      for (let k = 1; k <= list.length; k++) {
        const s = list[(at + k + list.length) % list.length];
        if (s !== done.stage && !rec.stages[s]) { nextStage = s; break; }
      }
      // Every exercise done: move on to the next sub-topic of the same topic.
      if (!nextStage) nextLesson = nextLessonAfter(done.topic);
    }
    saveState();
    const msg = pct === 100 ? t('perfect') : pct >= 70 ? t('great') : t('keepGoing');
    const title = done.mode === 'review' ? t('reviewDone') : `${STAGE_ICONS[done.stage]} ${t('st_' + done.stage)}`;
    render(`<main class="results">
      ${resultsHero(pct >= 70 ? 'cheer' : 'happy')}
      <h1>${esc(title)}</h1>
      <p class="lead">${esc(msg)}</p>
      <div class="result-stars">${stars(starCount)}</div>
      <div class="result-grid">
        <div><strong>${pct}%</strong><small>${esc(t('score'))}</small></div>
        <div><strong>+${xp}</strong><small>${esc(t('xpEarned'))}</small></div>
        <div><strong>🔥 ${currentStreak()}</strong><small>${esc(t('streak'))}</small></div>
      </div>
      <div class="stack">
        ${nextStage ? `<button class="btn primary" id="next-stage" data-next="${nextStage}" data-enter>${esc(t('nextStage'))}: ${STAGE_ICONS[nextStage]} ${esc(t('st_' + nextStage))}</button>` : ''}
        ${nextLesson ? `<button class="btn primary" id="next-lesson" data-next="${esc(nextLesson.id)}" data-enter>${esc(t('nextLesson'))}: <span class="nowrap">${iconHTML(nextLesson.icon)}</span> ${mixed(tx(nextLesson.title))}</button>` : ''}
        <button class="btn ${nextStage || nextLesson ? 'ghost' : 'primary'}" id="again" ${nextStage || nextLesson ? '' : 'data-enter'}>${esc(t('again'))}</button>
        ${done.mode === 'topic' ? `<button class="btn ghost" id="to-topic">${esc(t('backToTopic'))}</button>` : ''}
        ${done.mode === 'topic' && groupOf(done.topic)
          ? `<button class="btn ghost" id="to-group">${iconHTML(groupOf(done.topic).icon)} ${mixed(tx(groupOf(done.topic).title))}</button>`
          : `<button class="btn ghost" data-go="menu">${esc(t('menu'))}</button>`}
      </div>
    </main>`);
    if (starCount >= 2) confetti();
    $('#again', app).addEventListener('click', () => (done.mode === 'topic' ? startStage(done.topic, done.stage) : startReview()));
    if (done.mode === 'topic') $('#to-topic', app).addEventListener('click', () => renderTopic(done.topic));
    if ($('#to-group', app)) $('#to-group', app).addEventListener('click', () => renderGroup(groupOf(done.topic)));
    if (nextStage) {
      $('#next-stage', app).addEventListener('click', () => (nextStage === 'learn' ? renderLearn(done.topic) : startStage(done.topic, nextStage)));
    }
    if (nextLesson) $('#next-lesson', app).addEventListener('click', () => renderTopic(nextLesson));
  }

  /* ------------------------------------------------------------------ *
   * Dictionary: every word, searchable in the target script, Latin letters (and kana), English and Hebrew
   * ------------------------------------------------------------------ */
  const DICT_MAX = 200;
  const dict = { q: '', filter: 'all', group: '', timer: null };
  function dictIndex() {
    if (!DB) return [];
    if (!DB.dict) {
      DB.dict = ALL_WORDS.map((it) => ({
        it, lesson: TOPIC_BY_ID[it.topic],
        tg: normTarget(it.tg), kana: it.kana ? normTarget(it.kana) : '',
        tr: cur === 'es' ? normTarget(it.tr) : normLatin(it.tr), en: normText(it.en), he: normText(it.he),
      }));
    }
    return DB.dict;
  }
  function wordStatus(it) {
    const s = LS().words[it.id];
    if (s === undefined) return 'new';
    return s >= 3 ? 'learned' : 'learning';
  }
  /** Search the dictionary. Returns {rows (ranked), counts per status, learned, total}. */
  function dictSearch(q, filter, groupId) {
    const raw = String(q || '').trim();
    let qTg = '';
    let qTr = '';
    if (cur === 'es') { if (/\p{L}/u.test(raw)) qTg = normTarget(raw); }
    else {
      if (cur === 'ja' ? JA_RE.test(raw) : ARABIC_RE.test(raw)) qTg = normTarget(raw);
      if (/[a-z]/i.test(raw)) qTr = normLatin(raw);
    }
    const qTx = normText(raw);
    const counts = { all: 0, learned: 0, learning: 0, new: 0 };
    const rows = [];
    let learned = 0;
    const all = dictIndex();
    all.forEach((e, n) => {
      const st = wordStatus(e.it);
      if (st === 'learned') learned++;
      if (groupId && e.lesson.group !== groupId) return;
      let rank = 3;
      if (raw) {
        const keys = [[qTg, e.tg], [qTg, e.kana], [qTg, e.tr], [qTr, e.tr], [qTx, e.en], [qTx, e.he]].filter(([a, b]) => a && b);
        if (!keys.some(([a, b]) => b.includes(a))) return;
        rank = keys.some(([a, b]) => a === b) ? 0 : keys.some(([a, b]) => b.startsWith(a)) ? 1 : 2;
      }
      counts.all++;
      counts[st]++;
      if (filter === 'all' || filter === st) rows.push({ e, st, rank, n });
    });
    rows.sort((a, b) => a.rank - b.rank || a.n - b.n);
    return { rows, counts, learned, total: all.length };
  }
  function dictRow({ e, st }) {
    const it = e.it;
    const kana = readerMode() ? readingOf(it) : '';
    const word = readerMode()
      ? `${tgS(it.tg, 'dict-main')} ${kana ? tgS(kana, 'dict-sub') + ' ' : ''}${trS(it.tr, 'dict-sub')}`
      : `${trS(it.tr, 'dict-main')} ${tgS(it.tg, 'dict-sub')}`;
    return `<button class="dict-row" data-lesson="${esc(e.lesson.id)}" data-id="${esc(it.id)}">
      <span class="dot st-${st}" title="${esc(t('f_' + st))}" aria-label="${esc(t('f_' + st))}"></span>
      <span class="dict-body"><span class="dict-word">${word}</span>
      <span class="dict-meaning">${esc(meaning(it))}</span>
      <small class="dict-lesson">${iconHTML(e.lesson.icon)} ${mixed(tx(e.lesson.title))}</small></span>
    </button>`;
  }
  function updateDictionary() {
    clearTimeout(dict.timer);
    dict.timer = null;
    const list = $('#dict-list', app);
    if (!list) return;
    const res = dictSearch(dict.q, dict.filter, dict.group);
    $('#dict-learned', app).textContent = fmt(t('dictLearned'), { x: res.learned, y: res.total });
    $('#dict-filters', app).innerHTML = ['all', 'learned', 'learning', 'new'].map((f) =>
      `<button class="chip-btn ${dict.filter === f ? 'selected' : ''}" data-filter="${f}" aria-pressed="${dict.filter === f}">
        ${f === 'all' ? '' : `<span class="dot st-${f}"></span>`}${esc(t('f_' + f))} <span class="count" dir="ltr">${res.counts[f]}</span></button>`).join('');
    const shown = res.rows.slice(0, DICT_MAX);
    list.innerHTML = shown.length
      ? shown.map(dictEntry).join('') + (res.rows.length > DICT_MAX ? `<p class="dict-more muted">${esc(fmt(t('dictMore'), { n: DICT_MAX, total: res.rows.length }))}</p>` : '')
      : `<div class="dict-empty">${mascotSays(themeLine('empty'), 'sad')}</div>`;
  }
  function renderDictionary() {
    if (!DB) return renderMenu();
    const groups = visibleGroups().filter((g) => g.lessons.some((tp) => tp.kind !== 'alphabet'));
    if (dict.group && !groups.some((g) => g.id === dict.group)) dict.group = '';
    render(`<main class="dictionary">
      <div class="lesson-head">
        <button class="icon-btn back-btn" data-go="menu" aria-label="${esc(t('menu'))}">${backArrow()}</button>
        <h1><span class="title-icon">📖</span><span class="title-text">${esc(t('dictionary'))}</span></h1>
      </div>
      <p class="dict-learned" id="dict-learned"></p>
      <div class="dict-search">
        <span aria-hidden="true">🔎</span>
        <input type="search" id="dict-q" dir="auto" autocomplete="off" autocapitalize="off" spellcheck="false"
          placeholder="${esc(t('dictSearch'))}" aria-label="${esc(t('dictSearch'))}" value="${esc(dict.q)}">
      </div>
      <div class="dict-tools">
        <div class="chips" id="dict-filters" role="group"></div>
        <select id="dict-group" aria-label="${esc(t('dictGroup'))}">
          <option value="">${esc(t('allGroups'))}</option>
          ${groups.map((g) => `<option value="${esc(g.id)}" ${dict.group === g.id ? 'selected' : ''}>${esc(g.icon && !isGlyph(g.icon) ? g.icon + ' ' : '')}${esc(tx(g.title))}</option>`).join('')}
        </select>
      </div>
      <div class="dict-list" id="dict-list"></div>
    </main>`);
    const input = $('#dict-q', app);
    input.addEventListener('input', () => {
      dict.q = input.value;
      clearTimeout(dict.timer);
      dict.timer = setTimeout(updateDictionary, 120);
    });
    $('#dict-group', app).addEventListener('change', (e) => { dict.group = e.target.value; updateDictionary(); });
    $('#dict-filters', app).addEventListener('click', (e) => {
      const b = e.target.closest('[data-filter]');
      if (!b) return;
      dict.filter = b.dataset.filter;
      updateDictionary();
    });
    $('#dict-list', app).addEventListener('click', (e) => {
      const b = e.target.closest('[data-lesson]');
      if (b && TOPIC_BY_ID[b.dataset.lesson]) renderTopic(TOPIC_BY_ID[b.dataset.lesson]);
    });
    updateDictionary();
  }

  /* ------------------------------------------------------------------ *
   * Speed round
   * ------------------------------------------------------------------ */
  /** What a speed-round question shows first. */
  const mainText = (it) => (readerMode() ? it.tg : it.tr);
  /** Words for the speed round: every non-alphabet lesson up to the learner's level. */
  function speedPool() {
    const maxLevel = LEVELS.indexOf(LS().level);
    return TOPICS.filter((tp) => tp.kind !== 'alphabet' && LEVELS.indexOf(tp.level) <= maxLevel)
      .flatMap((tp) => tp.items).filter((it) => visualLen(mainText(it)) <= 18);
  }
  function startSpeed() {
    stopSpeed();
    let pool = speedPool();
    if (pool.length < 4) pool = ALL_WORDS.filter((it) => visualLen(mainText(it)) <= 18);
    if (pool.length < 4) pool = ALL_WORDS.slice();
    if (pool.length < 4) return renderMenu();
    let score = 0; let timeLeft = 60;
    // Module-level handle: render() of any other screen calls stopSpeed(), so leaving through the
    // top bar can never leave the timer running.
    const run = { timer: null, ended: false };
    speed = run;
    const ls = LS();

    function end() {
      if (run.ended) return;
      run.ended = true;
      clearInterval(run.timer);
      if (speed === run) speed = null;
      const record = score > ls.speedBest;
      if (record) ls.speedBest = score;
      S.xp += score * 2;
      if (score > 0) bumpStreak();
      saveState();
      render(`<main class="results">
        ${resultsHero(record && score > 0 ? 'cheer' : 'happy')}
        <h1>⚡ ${esc(t('timesUp'))}</h1>
        ${record && score > 0 ? `<p class="lead">${esc(t('newBest'))}</p>` : ''}
        <div class="result-grid">
          <div><strong>${score}</strong><small>${esc(t('speedScore'))}</small></div>
          <div><strong>${ls.speedBest}</strong><small>${esc(t('best'))}</small></div>
          <div><strong>+${score * 2}</strong><small>${esc(t('xpEarned'))}</small></div>
        </div>
        <div class="stack"><button class="btn primary" id="again" data-enter>${esc(t('play'))}</button>
        <button class="btn ghost" data-go="menu">${esc(t('menu'))}</button></div>
      </main>`);
      if (record && score > 0) confetti();
      $('#again', app).addEventListener('click', startSpeed);
    }
    function question() {
      if (run.ended) return;
      const it = pick(pool);
      const tf = Math.random() < 0.4;
      let stemHTML; let opts;
      if (tf) {
        const shown = (Math.random() < 0.5 ? it : distractors(it, 1, meaning)[0]) || it;
        stemHTML = `${wordBlock(it, 'md')}<div class="equals">=</div>${meaningBig(meaning(shown))}`;
        opts = [{ html: '✓ ' + esc(t('yes')), correct: shown === it }, { html: '✗ ' + esc(t('no')), correct: shown !== it }];
      } else {
        stemHTML = wordBlock(it, 'md');
        opts = shuffle([it, ...distractors(it, 3, meaning)].map((x) => ({ html: esc(meaning(x)), correct: x === it, item: x })));
      }
      render(`<main class="practice speed-round">
        <div class="lesson-head">
          <button class="icon-btn" id="quit" aria-label="${esc(t('exit'))}">✕</button>
          <div class="timer"><i id="timebar" style="width:${(timeLeft / 60) * 100}%"></i></div>
          <span class="speed-score">✓ ${score}</span>
        </div>
        <div class="stem">${stemHTML}</div>
        <div class="options ${tf ? 'two' : ''}">${opts.map((o, i) => `<button class="opt" data-i="${i}">${o.html}</button>`).join('')}</div>
      </main>`, true, true);
      $('#quit', app).addEventListener('click', () => { stopSpeed(); renderMenu(); });
      $$('.opt', app).forEach((b) => b.addEventListener('click', () => {
        const ok = opts[+b.dataset.i].correct;
        b.classList.add(ok ? 'right' : 'wrong');
        $$('.opt', app).forEach((x) => (x.disabled = true));
        strengthen(it, ok);
        if (ok) score++;
        setTimeout(question, ok ? 250 : 700);
      }));
    }
    run.timer = setInterval(() => {
      if (run.ended) return;
      timeLeft--;
      const bar = document.getElementById('timebar');
      if (bar) bar.style.width = (timeLeft / 60) * 100 + '%';
      if (timeLeft <= 0) end();
    }, 1000);
    question();
  }

  /* ------------------------------------------------------------------ *
   * Report a mistake: a mailto: link with everything needed to find and fix one item
   * ------------------------------------------------------------------ */
  const REPORT_TO = 'avielraz123@gmail.com';
  const appUrl = () => String(location.href).split(/[?#]/)[0];
  /**
   * mailto: link that reports a mistake in one item (a word, phrase or letter).
   * context: the screen name ('learn', 'dictionary', ...) or {screen, lang} (lang defaults to the current language).
   */
  function reportHref(item, context) {
    const c = typeof context === 'string' ? { screen: context } : obj(context);
    const code = LANGS[c.lang] ? c.lang : cur;
    const db = code === cur && DB ? DB : DBS[code];
    const it = obj(item);
    const lesson = db && it.topic ? db.TOPIC_BY_ID[it.topic] : null;
    const ex = obj(it.ex);
    const lines = [
      'Language: ' + (LANGS[code] ? LANGS[code].name.en + ' (' + code + ')' : String(code || '')),
      'Lesson: ' + (lesson ? ((lesson.title && lesson.title.en) || '') + ' (' + lesson.id + ')' : String(it.topic || '')),
      'Item: ' + String(it.id || ''),
      'Target: ' + String(it.tg || ''),
    ];
    if (it.kana && it.kana !== it.tg) lines.push('Kana: ' + it.kana);
    lines.push('Latin: ' + String(it.tr || ''), 'English: ' + String(it.en || ''), 'Hebrew: ' + String(it.he || ''));
    if (it.isLetter) lines.push('Sound: ' + String(it.sound || ''), 'Example: ' + [ex.tg, ex.tr, ex.en, ex.he].filter(Boolean).join(' / '));
    lines.push('Screen: ' + String(c.screen || ''), 'App language: ' + ui(), 'App URL: ' + appUrl(), '', 'What is wrong? / מה לא נכון?', '');
    const subject = BRAND + ' — mistake report (' + (code || '') + ')';
    return 'mailto:' + REPORT_TO + '?subject=' + encodeURIComponent(subject) + '&body=' + lines.map(encodeURIComponent).join('%0D%0A');
  }
  /** The small "🚩 Report a mistake" link under a card or in the answer panel. */
  const reportLink = (it, screen) => `<a class="report-link" href="${esc(reportHref(it, screen))}"><span aria-hidden="true">🚩</span> ${esc(t('report_link'))}</a>`;
  /** A dictionary row plus its small report flag (a sibling: links can't sit inside the row's button). */
  function dictEntry(row) {
    const it = row.e.it;
    const word = readerMode() ? it.tg : it.tr;
    return `<div class="report-entry">${dictRow(row)}<a class="report-flag" href="${esc(reportHref(it, 'dictionary'))}"
      aria-label="${esc(fmt(t('report_aria'), { word }))}" title="${esc(t('report_link'))}"><span aria-hidden="true">🚩</span></a></div>`;
  }

  /* ------------------------------------------------------------------ *
   * Move progress to another device (Settings): a copy-paste code or a .json file.
   *  code: "TLL1." + base64url(gzip(state JSON)), or "TLL0." + base64url(UTF-8 state JSON) without CompressionStream.
   *  A file holds the state JSON (a pasted code inside a file works too).
   * ------------------------------------------------------------------ */
  const XFER_GZ = 'TLL1.';
  const XFER_RAW = 'TLL0.';
  function b64urlEncode(bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64urlDecode(s) {
    s = s.replace(/=+$/, '').replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  const streamBytes = (bytes, transform) => new Response(new Blob([bytes]).stream().pipeThrough(transform))
    .arrayBuffer().then((b) => new Uint8Array(b));
  /** The progress code for a state (gzip when the browser can, plain otherwise). */
  async function progressCode(st = S, gzip = true) {
    const bytes = new TextEncoder().encode(JSON.stringify(st));
    if (gzip && typeof CompressionStream === 'function') {
      try { return XFER_GZ + b64urlEncode(await streamBytes(bytes, new CompressionStream('gzip'))); } catch (e) { /* plain code instead */ }
    }
    return XFER_RAW + b64urlEncode(bytes);
  }
  /** A parsed save as a complete state: a v2 state, or an old single-language (v1) save migrated. null if neither. */
  function importState(raw) {
    const isObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
    if (!isObj(raw)) return null;
    if (raw.v === 2) return isObj(raw.langs) ? normalizeState(raw) : null;
    const v1 = raw.v === undefined && !('langs' in raw)
      && (isObj(raw.topics) || isObj(raw.words) || (isObj(raw.settings) && ('level' in raw.settings || 'track' in raw.settings)));
    return v1 ? migrateOld(raw) : null;
  }
  /** Read a pasted code, or a file's text (JSON or a code). Resolves to a normalized state; rejects with 'empty' | 'nogzip' | 'bad'. */
  async function readProgress(text) {
    // Chat and mail apps (Hebrew ones above all) may add invisible direction marks, zero-width spaces or a BOM.
    let s = String(text == null ? '' : text).replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF]+/g, '').trim();
    if (!s) throw new Error('empty');
    let json = s;
    if (s[0] !== '{') {
      s = s.replace(/\s+/g, '');
      const head = s.slice(0, 5).toUpperCase();
      const body = s.slice(5);
      if ((head !== XFER_GZ && head !== XFER_RAW) || !/^[A-Za-z0-9_-]+=*$/.test(body)) throw new Error('bad');
      if (head === XFER_GZ && typeof DecompressionStream !== 'function') throw new Error('nogzip');
      try {
        let bytes = b64urlDecode(body);
        if (head === XFER_GZ) bytes = await streamBytes(bytes, new DecompressionStream('gzip'));
        json = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      } catch (e) { throw new Error('bad'); }
    }
    let raw;
    try { raw = JSON.parse(json); } catch (e) { throw new Error('bad'); }
    const st = importState(raw);
    if (!st) throw new Error('bad');
    return st;
  }
  /** Swap in a whole new state at once, then show the right first screen for it. */
  function replaceProgress(st) {
    stopSpeed();
    session = null;
    S = st;
    saveState();
    if (S.settings) pendingUi = S.settings.uiLang;
    applyUiLang();
    return boot();
  }
  const progressFileName = (d = new Date()) => {
    const p = (n) => String(n).padStart(2, '0');
    return `talk-like-a-local-progress-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.json`;
  };
  function downloadProgress() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = progressFileName();
    a.hidden = true;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  /**
   * Copy to the clipboard; if that's not allowed, show the code selected in its box (and try the old copy command).
   * src is the text, or a promise of it. Call this right inside the tap: Safari only allows clipboard writes
   * that start there, so a ready text is written at once, and a promised one goes through a ClipboardItem.
   */
  function copyText(src, box) {
    const textP = Promise.resolve(src);
    const bySelecting = (text) => {
      box.value = text;
      box.hidden = false;
      box.focus();
      box.select();
      try { box.setSelectionRange(0, text.length); } catch (e) { /* ignore */ }
      try { return document.execCommand('copy'); } catch (e) { return false; }
    };
    const clip = navigator.clipboard;
    let write = null;
    try {
      if (clip && clip.writeText && typeof src === 'string') write = clip.writeText(src);
      else if (clip && clip.write && typeof ClipboardItem === 'function') {
        write = clip.write([new ClipboardItem({ 'text/plain': textP.then((c) => new Blob([c], { type: 'text/plain' })) })]);
      } else if (clip && clip.writeText) write = textP.then((c) => clip.writeText(c));
    } catch (e) { write = null; }
    if (!write) return textP.then(bySelecting);
    const late = new Promise((r) => setTimeout(() => r(false), 1500));
    return Promise.race([Promise.resolve(write).then(() => true, () => false), late])
      .then((ok) => ok || textP.then(bySelecting));
  }
  function xferHTML() {
    return `<section class="xfer" aria-labelledby="xfer-h">
      <h2 class="xfer-title" id="xfer-h"><span aria-hidden="true">📦</span> ${esc(t('xfer_title'))}</h2>
      <p class="muted xfer-sub">${esc(t('xfer_sub'))}</p>
      <div class="xfer-actions">
        <button class="btn ghost small" id="xfer-copy"><span aria-hidden="true">📋</span> ${esc(t('xfer_copy'))}</button>
        <button class="btn ghost small" id="xfer-download"><span aria-hidden="true">💾</span> ${esc(t('xfer_download'))}</button>
      </div>
      <textarea class="xfer-code" id="xfer-code" rows="3" dir="ltr" readonly hidden spellcheck="false" aria-label="${esc(t('xfer_codeLabel'))}"></textarea>
      <p class="xfer-status" id="xfer-status" role="status" aria-live="polite"></p>
      <h3 class="xfer-subtitle">${esc(t('xfer_loadTitle'))}</h3>
      <label class="xfer-label" for="xfer-paste">${esc(t('xfer_pasteLabel'))}</label>
      <textarea class="xfer-code" id="xfer-paste" rows="3" dir="ltr" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="TLL1.…"></textarea>
      <div class="xfer-actions">
        <button class="btn primary small" id="xfer-load">${esc(t('xfer_load'))}</button>
        <button class="btn ghost small" id="xfer-file-btn"><span aria-hidden="true">📂</span> ${esc(t('xfer_openFile'))}</button>
        <input type="file" id="xfer-file" accept=".json,application/json,text/plain" hidden>
      </div>
      <p class="xfer-error" id="xfer-error" role="alert" hidden></p>
    </section>`;
  }
  function mountXfer(root) {
    if (!root) return;
    const status = $('#xfer-status', root);
    const codeBox = $('#xfer-code', root);
    const errBox = $('#xfer-error', root);
    const paste = $('#xfer-paste', root);
    const file = $('#xfer-file', root);
    const fail = (msg) => { errBox.textContent = msg || ''; errBox.hidden = !msg; };
    // Make the code ahead of time, so a tap on "Copy" can write it to the clipboard straight away.
    let ready = null; // { json, code }
    const prepare = () => {
      const json = JSON.stringify(S);
      progressCode(S).then((code) => { if (JSON.stringify(S) === json) ready = { json, code }; }, () => {});
    };
    prepare();
    $('#xfer-copy', root).addEventListener('click', async () => {
      status.textContent = '';
      const json = JSON.stringify(S);
      const codeP = ready && ready.json === json ? ready.code : progressCode(S);
      const okP = copyText(codeP, codeBox); // synchronously inside the tap
      const code = await codeP;
      codeBox.value = code;
      codeBox.hidden = false;
      const ok = await okP;
      status.textContent = ok ? t('xfer_copied') : t('xfer_copyManual');
      if (!ready || ready.json !== json) ready = { json, code };
    });
    $('#xfer-download', root).addEventListener('click', () => {
      downloadProgress();
      status.textContent = t('xfer_downloaded');
    });
    const tryLoad = async (text, fromFile, back) => {
      fail('');
      let st;
      try { st = await readProgress(text); } catch (e) {
        const why = e && e.message;
        fail(why === 'nogzip' ? t('xfer_noGzip') : fromFile ? t('xfer_badFile') : why === 'empty' ? t('xfer_empty') : t('xfer_bad'));
        return;
      }
      if (root.isConnected) confirmReplace(st, back);
    };
    $('#xfer-load', root).addEventListener('click', () => tryLoad(paste.value, false, $('#xfer-load', root)));
    // Enter in these boxes must not press the screen's main button ("Done").
    [paste, codeBox].forEach((el) => el.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.stopPropagation();
      if (el === paste) { e.preventDefault(); tryLoad(paste.value, false, paste); }
    }));
    $('#xfer-file-btn', root).addEventListener('click', () => file.click());
    file.addEventListener('change', async () => {
      const f = file.files && file.files[0];
      file.value = '';
      if (!f) return;
      if (f.size > 5e6) { fail(t('xfer_badFile')); return; }
      let text;
      try { text = await f.text(); } catch (e) { fail(t('xfer_badFile')); return; }
      tryLoad(text, true, $('#xfer-file-btn', root));
    });
  }
  /** In-app confirmation before replacing this device's progress. */
  function confirmReplace(st, back) {
    $$('.xfer-modal', app).forEach((m) => (m.xferShut ? m.xferShut() : m.remove()));
    const langs = Object.keys(st.langs).filter((c) => LANGS[c]);
    const what = esc(langs.length ? langs.map(langName).join(', ') : t('xfer_noLangs')) + ` · <bdi class="xfer-xp" dir="ltr">${esc(st.xp)} XP</bdi>`;
    const box = document.createElement('div');
    box.className = 'xfer-modal';
    box.innerHTML = `<div class="xfer-dialog" role="alertdialog" aria-modal="true" aria-labelledby="xfer-c-h" aria-describedby="xfer-c-p">
      <h2 id="xfer-c-h">${esc(t('xfer_confirmTitle'))}</h2>
      <p id="xfer-c-p">${esc(t('xfer_confirmText'))}</p>
      <p class="muted xfer-found">${fmt(esc(t('xfer_found')), { what })}</p>
      <div class="row"><button class="btn ghost" id="xfer-cancel">${esc(t('xfer_cancel'))}</button>
      <button class="btn danger" id="xfer-replace">${esc(t('xfer_replace'))}</button></div>
    </div>`;
    // Everything behind the dialog is inert (no focus, no clicks, hidden from screen readers) while it is open.
    const behind = Array.from(app.children).filter((el) => !el.inert);
    behind.forEach((el) => { el.inert = true; });
    app.appendChild(box);
    const cancel = $('#xfer-cancel', box);
    const replace = $('#xfer-replace', box);
    // Keys are handled on the whole page, so Escape and Tab still work after a click on the dialog's text.
    const onKey = (e) => {
      if (!box.isConnected) { unhook(); return; }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      else if (e.key === 'Tab') { e.preventDefault(); (document.activeElement === cancel ? replace : cancel).focus(); }
    };
    const onFocus = (e) => {
      if (!box.isConnected) { unhook(); return; }
      if (!box.contains(e.target)) cancel.focus();
    };
    function unhook() {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('focusin', onFocus, true);
      behind.forEach((el) => { el.inert = false; });
    }
    const shut = () => { unhook(); box.remove(); };
    box.xferShut = shut;
    const close = () => { shut(); if (back && back.isConnected) back.focus(); };
    cancel.addEventListener('click', close);
    replace.addEventListener('click', () => { shut(); replaceProgress(st); });
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('focusin', onFocus, true);
    cancel.focus();
  }

  /* ------------------------------------------------------------------ *
   * Placement test (from the onboarding level step): 4 beginner, then 4 intermediate, then 4 advanced
   * questions "what does this mean?". Nothing is saved except the level the learner then picks.
   * ------------------------------------------------------------------ */
  const PLACE_KINDS = ['vocab', 'phrases', 'grammar'];
  const PLACE_PER_LEVEL = 4;
  let placeRun = null;
  let placeDelay = 650; // how long the right answer stays on screen (ms)
  const placeMeaning = (it) => it[ui()] || it.en || '';
  const placeFits = (it) => !it.isLetter && visualLen(it.tg) <= 32 && String(placeMeaning(it)).length <= 60;
  /** Plain lowercase words of 4+ letters, without accents (rōmaji macrons, ʿ, á ...). */
  const placeWords = (s, min = 4) => String(s || '').normalize('NFD').replace(/[\p{M}\p{Lm}]/gu, '').toLowerCase()
    .split(/[^\p{L}]+/u).filter((w) => w.length >= min);
  /** True if the answer gives itself away: a loanword or name whose reading is in the meaning ("tatami", "fujisan" = Mount Fuji). */
  /**
   * A word's consonant skeleton, with common spelling differences between rōmaji/transliteration and English
   * evened out: "resutoran" and "restaurant" -> rstrn / rstrnt, "doraiyā" and "dryer" -> dr, "imeyl" and "email" -> mr.
   */
  const placeSkeleton = (w) => w.replace(/x/g, 'ks').replace(/ph/g, 'f').replace(/[sc]h/g, 's').replace(/ck|q|c/g, 'k').replace(/l/g, 'r')
    .replace(/v/g, 'b').replace(/z/g, 's').replace(/[aeiouyw']/g, '').replace(/(.)\1+/g, '$1');
  function placeEdits(a, b) {
    let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      const row = [i];
      for (let j = 1; j <= b.length; j++) row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = row;
    }
    return prev[b.length];
  }
  /** Do these two words sound alike (a loanword and its English source)? loose: for katakana words, which are mostly loanwords. */
  function placeAlike(a, b, loose) {
    if (a.startsWith(b) || b.startsWith(a)) return true;
    const x = placeSkeleton(a);
    const y = placeSkeleton(b);
    const n = Math.max(x.length, y.length);
    return Math.min(x.length, y.length) >= (loose ? 1 : 2) && placeEdits(x, y) / n <= (loose ? 0.5 : 0.3);
  }
  /** Japanese written only in katakana: nearly always a loanword ("sētā" = sweater, "doa" = door). */
  const placeKatakana = (it) => /^[゠-ヿ\s・。、！？!?.]+$/.test(it.tg || '');
  /** True if the answer gives itself away: a loanword or name whose reading is in the meaning ("tatami", "resutoran" = restaurant). */
  function placeGiveaway(it) {
    const loose = placeKatakana(it);
    const words = (s) => (loose ? placeWords(s, 3) : placeWords(s));
    const said = words((it.tr || '') + ' ' + (it.tg || ''));
    const meant = words(it.en + ' ' + placeMeaning(it));
    return said.some((a) => meant.some((b) => placeAlike(a, b, loose)));
  }
  const placeAskable = (it) => placeFits(it) && !placeGiveaway(it);
  /** A meaning without its notes in brackets: "two hundred (200)" -> "two hundred". */
  const placeBare = (m) => String(m || '').replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  /** Each separate gloss of a meaning ("money / cash" -> money, cash), lowercased and without notes. */
  const placeGlosses = (it) => [placeMeaning(it), it.en].flatMap((m) => placeBare(m).split(/\s*[\/;,]\s*/))
    .map((g) => low(g).replace(/[.?!؟]+$/, '').trim()).filter(Boolean);
  /** A whole sentence or a short word/phrase? Wrong options get the same shape as the answer, so the shape gives nothing away. */
  const placeSentence = (it) => {
    const m = String(placeMeaning(it)).trim();
    return /[.?!؟]$/.test(m) || placeBare(m).split(/\s+/).length >= 4;
  };
  /** Lessons a question may come from: words, phrases and grammar of one level (never letters or stories). */
  const placeLessons = (db, level) => db.TOPICS.filter((tp) => tp.level === level && PLACE_KINDS.includes(tp.kind));
  /**
   * Four options with different meanings: the answer and three like it, as distractors() picks them:
   * the same lesson, then the same group, then the whole level, always the same shape (sentence or word) first.
   */
  function placeOptions(it, pool, all, lessonOf) {
    const seen = new Set([low(placeMeaning(it))]);
    const glosses = new Set(placeGlosses(it)); // a wrong option may not share a meaning with the answer ("money" / "money (colloquial)")
    const out = [];
    const shape = placeSentence(it);
    const same = (p) => p.filter((x) => placeSentence(x) === shape);
    const tp = lessonOf.get(it);
    const lesson = pool.filter((x) => lessonOf.get(x) === tp);
    const group = pool.filter((x) => lessonOf.get(x).group === tp.group);
    [same(lesson), same(group), same(pool), same(all), pool, all].forEach((p) => shuffle(p).forEach((x) => {
      if (out.length >= 3 || x === it || sameAnswer(it, x)) return;
      const k = low(placeMeaning(x));
      if (seen.has(k) || placeGlosses(x).some((g) => glosses.has(g))) return;
      seen.add(k);
      out.push(x);
    }));
    return shuffle([it, ...out]).map((x) => ({ item: x, correct: x === it }));
  }
  /** The questions, easiest level first. Each level takes its items from as many different lessons and groups as it can. */
  function placementQuestions(db) {
    const lessonOf = new Map();
    LEVELS.forEach((lv) => placeLessons(db, lv).forEach((tp) => tp.items.forEach((x) => lessonOf.set(x, tp))));
    const all = Array.from(lessonOf.keys()).filter(placeFits);
    const asked = [];
    const qs = [];
    LEVELS.forEach((level) => {
      const lessons = shuffle(placeLessons(db, level));
      const pool = lessons.flatMap((tp) => tp.items).filter(placeFits);
      const firsts = lessons.filter((tp, i) => lessons.findIndex((x) => x.group === tp.group) === i);
      const order = firsts.concat(lessons.filter((tp) => !firsts.includes(tp)));
      let n = 0;
      for (let k = 0; n < PLACE_PER_LEVEL && k < order.length * PLACE_PER_LEVEL; k++) {
        const tp = order[k % order.length];
        const it = shuffle(tp.items).find((x) => placeAskable(x)
          && !asked.some((y) => sameAnswer(x, y) || low(placeMeaning(x)) === low(placeMeaning(y))));
        if (!it) continue;
        asked.push(it);
        n++;
        qs.push({ level, item: it, options: placeOptions(it, pool, all, lessonOf) });
      }
    });
    return qs;
  }
  /** right = correct answers per level (out of 4). */
  function placementLevel(right) {
    const r = obj(right);
    if ((r.intermediate || 0) >= 3 && (r.advanced || 0) >= 3) return 'advanced';
    if ((r.beginner || 0) >= 3 && (r.intermediate || 0) >= 2) return 'intermediate';
    return 'beginner';
  }
  const placeOfferHTML = (code, failed) => `<div class="place-offer">
      <button class="btn ghost place-open" id="place-start"><span aria-hidden="true">🧭</span> ${esc(t('place_open', code))}</button>
      ${failed ? `<p class="place-note" role="status">${esc(t('place_fail', code))}</p>` : ''}
    </div>`;
  /**
   * Run the placement test for a language. cb: {onPick(level), onBack(), onFail()}; exactly one of them is
   * called, unless the learner leaves some other way.
   */
  function renderPlacement(code, cb) {
    const run = { code, cb, qs: [], i: 0, locked: false,
      right: { beginner: 0, intermediate: 0, advanced: 0 }, asked: { beginner: 0, intermediate: 0, advanced: 0 } };
    placeRun = run;
    const leave = (fn) => { if (placeRun !== run) return; placeRun = null; fn(); };
    // If files failed to load (e.g. no network), forget that load so the next try fetches them again.
    const fail = () => {
      const report = LOAD_REPORT[code];
      if (placeRun === run && (!report || report.failed.length)) { delete LOADS[code]; delete DBS[code]; }
      leave(cb.onFail);
    };
    const start = () => {
      if (placeRun !== run) return;
      let qs = [];
      try { qs = placementQuestions(dbFor(code)); } catch (e) { qs = []; }
      if (qs.length < PLACE_PER_LEVEL) { fail(); return; }
      run.qs = qs;
      drawPlaceQuestion(run);
    };
    // An earlier load that is over and got nothing at all (e.g. while offline): try again now.
    const prev = LOAD_REPORT[code];
    if (LOADS[code] && prev && !prev.loaded.length && prev.failed.length >= filesOf(code).length) { delete LOADS[code]; delete DBS[code]; }
    if (DBS[code] && LOADS[code]) { start(); return; }
    render(`<main class="center-page loading-page place-loading" aria-busy="true">
      ${mascot('happy', 'mascot-hero', code)}
      <h1>${esc(t('loading', code))}</h1>
      <p class="lead">${esc(t('loadingSub', code))}</p>
      <div class="loading-dots" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="stack"><button class="btn ghost" id="place-cancel">${esc(t('place_exit', code))}</button></div>
    </main>`, false);
    $('#place-cancel', app).addEventListener('click', () => leave(cb.onBack));
    ensureLoaded(code).then(start, fail);
  }
  function drawPlaceQuestion(run) {
    const { code } = run;
    const q = run.qs[run.i];
    const it = q.item;
    // The track isn't chosen yet, so show the script and the Latin reading (plus kana under kanji).
    const kana = code === 'ja' && it.kana && KANJI_RE.test(it.tg) ? it.kana : '';
    const word = `<div class="word lg ${lenCls(it.tg)}">${tgFor(code, it.tg, 'primary')}${kana ? tgFor(code, kana, 'reading') : ''}${it.tr && it.tr !== it.tg ? trS(it.tr, 'secondary') : ''}</div>`;
    render(`<main class="practice placement">
      <div class="lesson-head">
        <button class="icon-btn" id="place-exit" aria-label="${esc(t('place_exit', code))}">✕</button>
        <div class="progress grow"><i style="width:${(run.i / run.qs.length) * 100}%"></i></div>
      </div>
      <div class="place-meta"><span class="place-count">${esc(fmt(t('place_count', code), { n: run.i + 1, total: run.qs.length }))}</span>
        <em class="level-chip lv-${q.level}">${esc(t(q.level, code))}</em></div>
      <h2 class="prompt">${esc(t('qMeaning', code))}</h2>
      <div class="q-body">
        <div class="stem">${word}</div>
        <div class="options">${q.options.map((o, k) => `<button class="opt" data-i="${k}">${esc(placeMeaning(o.item))}</button>`).join('')}</div>
        <div class="row center-row"><button class="btn ghost" id="place-idk">${esc(t('place_dontKnow', code))}</button></div>
      </div>
    </main>`, false);
    $('#place-exit', app).addEventListener('click', () => { if (placeRun !== run) return; placeRun = null; run.cb.onBack(); });
    const choose = (k) => {
      if (run.locked || placeRun !== run) return;
      run.locked = true;
      const ok = k >= 0 && q.options[k].correct;
      run.asked[q.level]++;
      if (ok) run.right[q.level]++;
      $$('.q-body .opt', app).forEach((b, j) => {
        b.disabled = true;
        if (q.options[j].correct) { b.classList.add('right'); b.insertAdjacentText('afterbegin', '✓ '); }
        else if (j === k) { b.classList.add('wrong'); b.insertAdjacentText('afterbegin', '✗ '); }
      });
      $('#place-idk', app).disabled = true;
      setTimeout(() => {
        if (placeRun !== run || !$('.placement', app)) return;
        run.locked = false;
        run.i++;
        const next = run.qs[run.i];
        // Stop after the intermediate block if it was too hard (0-1 of 4 right).
        const stop = q.level === 'intermediate' && (!next || next.level !== 'intermediate') && run.right.intermediate <= 1;
        if (!next || stop) drawPlaceResult(run); else drawPlaceQuestion(run);
      }, placeDelay);
    };
    $$('.q-body .opt', app).forEach((b) => b.addEventListener('click', () => choose(+b.dataset.i)));
    $('#place-idk', app).addEventListener('click', () => choose(-1));
  }
  function drawPlaceResult(run) {
    const { code } = run;
    const level = placementLevel(run.right);
    const got = LEVELS.reduce((n, l) => n + run.right[l], 0);
    const asked = LEVELS.reduce((n, l) => n + run.asked[l], 0);
    const name = t(level, code);
    run.result = level;
    render(`<main class="results place-result">
      <div class="results-hero">${deco('results', code)}${mascot(level === 'beginner' ? 'happy' : 'cheer', 'mascot-result', code)}</div>
      <p class="muted place-done">${esc(t('place_done', code))}</p>
      <h1>${esc(fmt(t('place_suggest', code), { level: name }))}</h1>
      <p class="lead">${esc(fmt(t('place_score', code), { x: got, y: asked }))}</p>
      <ul class="place-scores">${LEVELS.filter((l) => run.asked[l]).map((l) => `<li><span>${esc(t(l, code))}</span>
        <strong dir="ltr">${run.right[l]}/${run.asked[l]}</strong></li>`).join('')}</ul>
      <p class="muted small">${esc(t('place_note', code))}</p>
      <div class="stack">
        <button class="btn primary" id="place-use" data-level="${level}" data-enter>${esc(fmt(t('place_use', code), { level: name }))}</button>
        <button class="btn ghost" id="place-self">${esc(t('place_self', code))}</button>
      </div>
    </main>`, false);
    $('#place-use', app).addEventListener('click', () => { if (placeRun !== run) return; placeRun = null; run.cb.onPick(level); });
    $('#place-self', app).addEventListener('click', () => { if (placeRun !== run) return; placeRun = null; run.cb.onBack(); });
  }

  /* ------------------------------------------------------------------ *
   * Start
   * ------------------------------------------------------------------ */
  /** Show the right first screen for the saved state. Returns a promise that settles when it's on screen. */
  function boot() {
    if (!S.settings) { setCur(null); renderOnboarding(); return Promise.resolve(); }
    const code = S.settings.lang;
    if (!LANGS[code]) { setCur(null); renderOnboarding({ start: 'lang' }); return Promise.resolve(); }
    if (!langReady(code)) { setCur(code); renderOnboarding({ lang: code }); ensureLoaded(code); return Promise.resolve(); }
    return openLang(code);
  }
  const booted = boot();

  // Small hook used by the automated test page (tests/smoke.html) and screenshot pages.
  window.__TLAP_TEST__ = {
    get TOPICS() { return TOPICS; },
    get GROUPS() { return GROUPS; },
    get ALL_WORDS() { return ALL_WORDS; },
    QUESTIONS, LANGS, MANIFEST, STORE_KEY, OLD_KEY,
    ready: () => booted,
    cur: () => cur,
    buildQueue, compareTr, checkTyped, speechMatches, normTarget, normLatin, distractors, sameAnswer,
    migrateOld, loadState, normalizeState,
    reload() { S = loadState(); return boot(); },
    /** Fresh state with one language set up; loads it if needed. */
    setSettings(s) {
      S = freshState();
      S.settings = { uiLang: s.uiLang || 'en', lang: s.lang || cur || 'fa', speech: !!s.speech };
      const ls = langState(S.settings.lang);
      ls.level = s.level || 'beginner';
      ls.track = LANGS[S.settings.lang].script ? s.track || 'full' : 'full';
      return openLang(S.settings.lang);
    },
    /** Change settings without resetting progress. */
    patchSettings(s) {
      Object.keys(s).forEach((k) => { if (k === 'level' || k === 'track') LS()[k] = s[k]; else S.settings[k] = s[k]; });
    },
    state: () => S,
    openLang, pickLang, ensureLoaded, loadReport: (code) => LOAD_REPORT[code], loaded: (code) => !!LOADS[code],
    theme: (code) => theme(code || cur), applyTheme, themeLine, mascotSVG,
    missingStrings: () => Array.from(MISSING),
    readerMode, scriptTrack, canSpell, spellWord, orderWords, typedAnswer, typesFor,
    startStage, stagesFor, countedStages, stageProgress, stageQueue, visibleGroups, visibleLessons,
    renderTopic, renderGroup, renderLearn, renderMenu, renderSettings, renderDictionary, renderLangPicker, renderOnboarding,
    startReview, startSpeed,
    dictSearch, dictUpdate: updateDictionary, mixed, nextLessonAfter,
    speedRunning: () => !!speed,
    session: () => session,
    renderAt(i) { session.idx = i; renderQuestion(); },
    finish: finishSession,
    // Report a mistake / move progress / placement test
    reportHref, progressCode, readProgress, importState, replaceProgress, progressFileName, confirmReplace,
    placementQuestions, placementLevel, renderPlacement, dbFor, placeGiveaway, placeSentence,
    placement: () => placeRun,
    setPlaceDelay(ms) { placeDelay = ms; },
  };
})();
