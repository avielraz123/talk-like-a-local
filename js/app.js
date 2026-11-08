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
  /* Progress additions (spaced repetition, daily goal, badges):
   *  S.settings.goal = 30 | 50 | 100 (XP per day)    S.daily = {day: <dayKey>, xp}    S.goalLog = [<dayKey>, ...]
   *  S.badges = {<badgeId>: <dayKey unlocked>}       langs[code].srs = {<itemId>: [stepIndex, dueDay]}
   * dueDay = whole days since 1970-01-01 in local time. */
  const SRS_STEPS = [1, 3, 7, 16, 35, 90];
  const GOALS = [30, 50, 100];
  const GOAL_DEFAULT = 50;
  const GOAL_LOG_MAX = 400;
  let dayShift = 0; // test hook: pretend it is n days later (SRS, daily goal and badges only)
  function shiftedNow() { const d = new Date(); if (dayShift) d.setDate(d.getDate() + dayShift); return d; }
  /** Whole days since 1970-01-01, counted in local time. */
  function dayNum(d) { return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }
  function todayNum() { return dayNum(shiftedNow()); }
  function hashId(id) { let h = 0; for (const c of String(id)) h = (h * 31 + c.codePointAt(0)) >>> 0; return h; }
  /** Saves from before spaced repetition: give known words a review schedule (words themselves stay untouched). */
  function seedSrs(words) {
    const srs = {};
    const today = todayNum();
    Object.keys(words).forEach((id) => {
      const st = +words[id] || 0;
      if (st >= 5) srs[id] = [2, today + 1 + (hashId(id) % 7)];
      else if (st >= 3) srs[id] = [1, today + 1 + (hashId(id) % 3)];
      else if (st >= 1) srs[id] = [0, today];
    });
    return srs;
  }
  function cleanSrs(srs) {
    const out = {};
    Object.keys(srs).forEach((id) => {
      const e = srs[id];
      if (!Array.isArray(e) || !Number.isFinite(+e[0]) || !Number.isFinite(+e[1])) return;
      out[id] = [Math.max(0, Math.min(SRS_STEPS.length - 1, Math.round(+e[0]))), Math.round(+e[1])];
    });
    return out;
  }
  const freshLangState = () => ({ level: null, track: null, topics: {}, words: {}, speedBest: 0, srs: {} });
  const freshState = () => ({ v: 2, settings: null, xp: 0, streak: { count: 0, last: null }, langs: {},
    daily: { day: null, xp: 0 }, goalLog: [], badges: {} });
  const obj = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});

  /** v1 saved one star rating per topic; it now belongs to the "Mix of everything" exercise. */
  function migrateTopics(topics) {
    topics = obj(topics);
    Object.keys(topics).forEach((k) => {
      const rec = obj(topics[k]);
      if (!rec.stages) rec.stages = rec.stars ? { mix: rec.stars } : {};
      topics[k] = rec;
    });
    return topics;
  }
  function normLangState(ls) {
    const hadSrs = !!obj(ls).srs && typeof obj(ls).srs === 'object' && !Array.isArray(obj(ls).srs);
    ls = Object.assign(freshLangState(), obj(ls));
    ls.topics = migrateTopics(ls.topics);
    ls.words = obj(ls.words);
    ls.srs = hadSrs ? cleanSrs(ls.srs) : seedSrs(ls.words);
    ls.speedBest = +ls.speedBest || 0;
    if (!levelOk(ls.level)) ls.level = null;
    if (ls.track !== 'speak' && ls.track !== 'full') ls.track = null;
    return ls;
  }
  function normalizeState(st) {
    st = Object.assign(freshState(), obj(st));
    st.v = 2;
    st.xp = +st.xp || 0;
    st.streak = Object.assign({ count: 0, last: null }, obj(st.streak));
    st.langs = obj(st.langs);
    Object.keys(st.langs).forEach((k) => { if (LANGS[k]) st.langs[k] = normLangState(st.langs[k]); else delete st.langs[k]; });
    const daily = obj(st.daily);
    st.daily = { day: typeof daily.day === 'string' ? daily.day : null, xp: Math.max(0, +daily.xp || 0) };
    st.goalLog = Array.isArray(st.goalLog) ? Array.from(new Set(st.goalLog.filter((d) => typeof d === 'string'))).slice(-GOAL_LOG_MAX) : [];
    const badges = obj(st.badges);
    st.badges = {};
    Object.keys(badges).forEach((id) => { if (typeof badges[id] === 'string') st.badges[id] = badges[id]; });
    if (st.settings) {
      st.settings = Object.assign({ uiLang: 'en', lang: null, speech: false, goal: GOAL_DEFAULT }, obj(st.settings));
      st.settings.goal = GOALS.includes(+st.settings.goal) ? +st.settings.goal : GOAL_DEFAULT;
      if (!STR[st.settings.uiLang]) st.settings.uiLang = 'en';
      if (!LANGS[st.settings.lang]) st.settings.lang = null;
      st.settings.speech = !!st.settings.speech;
    }
    return st;
  }
  /** The old single-language (Farsi) save: {settings:{uiLang, level, track, speech}, topics, words, xp, streak, speedBest}. */
  function migrateOld(old) {
    old = obj(old);
    const st = freshState();
    st.xp = +old.xp || 0;
    st.streak = Object.assign({ count: 0, last: null }, obj(old.streak));
    const fa = freshLangState();
    delete fa.srs; // seeded from the word strengths by normalizeState
    fa.topics = migrateTopics(old.topics);
    fa.words = obj(old.words);
    fa.speedBest = +old.speedBest || 0;
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
   * Spaced repetition: each item has a step (interval index) and a day when it is due again.
   * ------------------------------------------------------------------ */
  /** Update an item's review schedule after an answer (speaking never comes here). */
  function srsAnswer(item, correct) {
    if (!item || !item.id) return;
    const srs = LS().srs || (LS().srs = {});
    const today = todayNum();
    const e = srs[item.id];
    if (!correct) { srs[item.id] = [0, today]; return; }      // comes back in today's review
    if (!e) { srs[item.id] = [0, today + SRS_STEPS[0]]; return; } // new: due tomorrow
    if (e[1] > today) return;                                  // right, but not due yet: no change
    const step = Math.min(SRS_STEPS.length - 1, e[0] + 1);
    srs[item.id] = [step, today + SRS_STEPS[step]];
  }
  /** Items the learner can see in their track (no alphabet letters when speaking only). */
  const srsVisible = (it) => !!it && (readerMode() || !it.isLetter);
  /** Items due today or earlier: most overdue first, then the weakest. */
  function srsDue() {
    const srs = LS().srs || {};
    const words = LS().words;
    const today = todayNum();
    return Object.keys(srs)
      .filter((id) => srs[id][1] <= today && srsVisible(ITEM_BY_ID[id]))
      .sort((a, b) => srs[a][1] - srs[b][1] || (words[a] || 0) - (words[b] || 0))
      .map((id) => ITEM_BY_ID[id]);
  }

  /* ------------------------------------------------------------------ *
   * Daily goal (XP per local day)
   * ------------------------------------------------------------------ */
  let goalJustReached = false; // set when the goal is first reached; celebrated once on the next results screen / menu
  const goalTarget = () => (S.settings && GOALS.includes(+S.settings.goal) ? +S.settings.goal : GOAL_DEFAULT);
  const todayKey = () => dayKey(shiftedNow());
  /** Today's XP record (a new day starts at 0). */
  function goalToday() {
    const k = todayKey();
    if (!S.daily || S.daily.day !== k) S.daily = { day: k, xp: 0 };
    return S.daily;
  }
  /** Note today in the goal log once the goal is reached. Returns true the first time. */
  function goalSync() {
    const d = goalToday();
    if (d.xp < goalTarget() || S.goalLog.includes(d.day)) return false;
    S.goalLog.push(d.day);
    if (S.goalLog.length > GOAL_LOG_MAX) S.goalLog.splice(0, S.goalLog.length - GOAL_LOG_MAX);
    return true;
  }
  /** Every XP gain goes through here: the global total and today's goal. */
  function addXP(n) {
    n = +n || 0;
    S.xp += n;
    goalToday().xp += n;
    if (goalSync()) goalJustReached = true;
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

  /* ------------------------------------------------------------------ *
   * Playing with the background world: tap a sky or side object to make it react.
   * Themes mark pokeable parts with data-poke="<name>" and animate them with the .poked class;
   * an optional theme.onPoke(name, info) adds surprises. Not while answering (calm mode).
   * ------------------------------------------------------------------ */
  const POKE_BLOCK = 'button, a, input, textarea, select, label, summary, [role="button"], [contenteditable], .confetti';
  const isClear = (cs) => cs.backgroundImage === 'none' && (cs.backgroundColor === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(cs.backgroundColor));
  /** The pokeable world object under (x, y), if the tap landed on an empty part of the page. */
  function pokeTargetAt(x, y, target) {
    const root = document.documentElement;
    if (!cur || root.classList.contains('calm')) return null;
    for (let el = target; el && el !== document.body && el !== root; el = el.parentElement) {
      if (el.id === 'theme-layer') break;
      if (el.matches && el.matches(POKE_BLOCK)) return null;
      if (el !== app && el.tagName !== 'MAIN' && !isClear(getComputedStyle(el))) return null; // a card, bubble or panel
    }
    const hit = (document.elementsFromPoint ? document.elementsFromPoint(x, y) : [])
      .find((e) => e.closest && e.closest('#theme-layer [data-poke]'));
    return hit ? hit.closest('[data-poke]') : null;
  }
  const pokes = new WeakMap();
  function poke(el) {
    const now = Date.now();
    const rec = pokes.get(el) || { taps: 0, total: 0, last: 0, timer: 0 };
    rec.taps = now - rec.last < 2000 ? rec.taps + 1 : 1; // taps in a row (each within 2 s of the last)
    rec.total += 1;
    rec.last = now;
    pokes.set(el, rec);
    el.setAttribute('data-taps', String(rec.taps));
    el.classList.remove('poked');
    void el.getBoundingClientRect(); // restart the CSS animation
    el.classList.add('poked');
    clearTimeout(rec.timer);
    rec.timer = setTimeout(() => el.classList.remove('poked'), 2500);
    const th = theme();
    if (th && typeof th.onPoke === 'function') {
      try {
        th.onPoke(el.getAttribute('data-poke'), {
          el, taps: rec.taps, total: rec.total,
          layer: document.getElementById('theme-layer'),
          dark: !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches),
          reduced: !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches),
        });
      } catch (e) { /* a theme surprise must never break the app */ }
    }
  }
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button) return;
    const el = pokeTargetAt(e.clientX, e.clientY, e.target);
    if (el) poke(el);
  });
  let pokeHoverQueued = false;
  document.addEventListener('mousemove', (e) => {
    if (pokeHoverQueued) return;
    pokeHoverQueued = true;
    requestAnimationFrame(() => {
      pokeHoverQueued = false;
      document.body.classList.toggle('poke-hover', !!pokeTargetAt(e.clientX, e.clientY, e.target));
    });
  });

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
        <span class="stat" title="${esc(t('streak'))}">🔥 ${currentStreak()}</span>
        <span class="stat" title="XP">⭐ ${S.xp}</span>
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
    else if (where === 'badges') renderBadges();
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
    const btn = $('[data-enter]:not([disabled])', app);
    if (btn && document.activeElement && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); btn.click(); }
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
      $('#ob-next', app).addEventListener('click', () => {
        if (key === 'lang' && choice.lang) ensureLoaded(choice.lang); // start fetching its lessons while the learner answers the rest
        if (step < stepsNow().length - 1) { step++; draw(); return; }
        if (!S.settings) S.settings = { uiLang: choice.uiLang, lang: choice.lang, speech: !!choice.speech, goal: GOAL_DEFAULT };
        S.settings.uiLang = choice.uiLang;
        S.settings.lang = choice.lang;
        const ls = langState(choice.lang);
        ls.level = choice.level;
        ls.track = LANGS[choice.lang].script ? choice.track : 'full';
        saveState();
        openLang(choice.lang);
      });
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
    return `<span class="stars" aria-label="${n}/3">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : ''}">★</i>`).join('')}</span>`;
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
    // Badges earned by progress made before they existed (or elsewhere): one combined message.
    // The goal can also be reached here (e.g. after lowering it in Settings), so log it before the badges look.
    if (goalSync()) goalJustReached = true;
    const newBadges = checkBadges();
    // The goal card itself shows the reached goal, so on the menu it gets the celebration instead of a banner.
    const goalCele = goalJustReached;
    goalJustReached = false;
    if (goalCele || newBadges.length) saveState();
    const due = srsDue().length;
    // A learner who has never reviewed (nothing scheduled yet) sees what Review is, not "All caught up".
    const srsAny = Object.keys(LS().srs || {}).some((id) => srsVisible(ITEM_BY_ID[id]));

    render(`<main class="menu">
      ${deco('banner')}
      ${mascotSays(themeLine('greet'))}
      <h1 class="page-title">${esc(t('menuTitle'))}</h1>
      ${celebrationHTML(newBadges, true)}
      ${goalCard(goalCele)}
      <div class="modes">
        <button class="mode review" id="m-review"><span class="mode-icon">🔁${due ? `<em class="srs-count" aria-hidden="true">${due > 99 ? '99+' : due}</em>` : ''}</span>
          <span><strong>${esc(t('review'))}</strong><small class="srs-due">${esc(due ? countText(due, 'srsDue') : srsAny ? t('srsCaughtUp') : t('reviewDesc'))}</small></span></button>
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
    bindCelebration();
    if (goalCele) confetti();
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
      ${goalSetting()}
      <div class="row wrap"><button class="btn danger" id="reset-lang">${esc(t('resetLang'))}</button>
      <button class="btn ghost" id="reset">${esc(t('resetProgress'))}</button></div>
      <div class="row"><span></span><button class="btn primary" data-go="menu" data-enter>${esc(t('done'))}</button></div>
    </main>`);
    $$('.seg[data-name]', app).forEach((g) => $$('button', g).forEach((b) => b.addEventListener('click', () => {
      let v = b.dataset.v;
      const name = g.dataset.name;
      if (name === 'speech') v = v === 'true';
      if (name === 'goal') v = GOALS.includes(+v) ? +v : GOAL_DEFAULT;
      if (name === 'level' || name === 'track') ls[name] = v; else st[name] = v;
      saveState();
      renderSettings();
    })));
    $$('[data-pick]', app).forEach((b) => b.addEventListener('click', () => pickLang(b.dataset.pick)));
    $('#reset-lang', app).addEventListener('click', () => {
      if (!confirm(t('confirmResetLang'))) return;
      Object.assign(ls, { topics: {}, words: {}, speedBest: 0, srs: {} });
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

  /** cele: celebration banners to show (after finishing the flashcards). */
  function renderTopic(topic, cele = '') {
    const rec = LS().topics[topic.id] || {};
    const g = groupOf(topic);
    const p = stageProgress(topic);
    render(`<main class="topic-page">
      <div class="lesson-head">
        <button class="icon-btn back-btn" id="to-group" aria-label="${esc(g ? tx(g.title) : t('menu'))}">${backArrow()}</button>
        <h1><span class="title-icon">${iconHTML(topic.icon)}</span><span class="title-text">${mixed(tx(topic.title))}</span></h1>
      </div>
      ${cele}
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
    bindCelebration();
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
        if (!rec.stages.learn) addXP(10);
        rec.stages.learn = 3;
        bumpStreak();
        const fresh = checkBadges();
        saveState();
        renderTopic(topic, celebrationHTML(fresh, fresh.length >= 3));
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
  const SRS_SESSION_MAX = 15;
  /** Review = the words due today (spaced repetition): up to 15, most overdue first. */
  function startReview() {
    const due = srsDue().slice(0, SRS_SESSION_MAX);
    if (!due.length) { renderReviewNone(); return; }
    session = { mode: 'review', queue: buildQueue(due), idx: 0, first: 0, firstRight: 0, xp: 0 };
    renderQuestion();
  }
  /** Words the hardest-words practice can use (seen, and visible in this track). */
  const hardIds = () => Object.keys(LS().words).filter((id) => srsVisible(ITEM_BY_ID[id]));
  /** Nothing due today: say so kindly and offer the hardest words instead. */
  function renderReviewNone() {
    const known = Object.keys(LS().srs || {}).some((id) => srsVisible(ITEM_BY_ID[id]));
    const hardOk = hardIds().length >= 4;
    render(`<main class="center-page srs-none">${mascot(known ? 'cheer' : 'happy', 'mascot-hero')}
      ${known ? `<h1>${esc(t('srsNoneTitle'))}</h1><p class="lead">${esc(t('srsNoneText'))}</p>`
        : `<p class="lead">${esc(t('reviewEmpty'))}</p>`}
      <div class="stack">
        ${hardOk ? `<button class="btn primary" id="srs-hardest" data-enter>💪 ${esc(t('srsHardest'))}</button>` : ''}
        <button class="btn ${hardOk ? 'ghost' : 'primary'}" data-go="menu" ${hardOk ? '' : 'data-enter'}>${esc(t('menu'))}</button>
      </div></main>`);
    if (hardOk) $('#srs-hardest', app).addEventListener('click', startHardReview);
  }
  /** Practice the weakest words (what Review did before spaced repetition). */
  function startHardReview() {
    const words = LS().words;
    const ids = Object.keys(words).filter((id) => ITEM_BY_ID[id] && (readerMode() || !ITEM_BY_ID[id].isLetter));
    if (ids.length < 4) {
      render(`<main class="center-page">${mascot('happy', 'mascot-hero')}<p class="lead">${esc(t('reviewEmpty'))}</p>
        <div class="stack"><button class="btn primary" data-go="menu" data-enter>${esc(t('menu'))}</button></div></main>`);
      return;
    }
    const weakest = shuffle(ids).sort((a, b) => (words[a] || 0) - (words[b] || 0)).slice(0, 12).map((id) => ITEM_BY_ID[id]);
    session = { mode: 'review', hard: true, queue: buildQueue(weakest), idx: 0, first: 0, firstRight: 0, xp: 0 };
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
      // Spaced repetition: speaking is an optional bonus and never counts; a right retry of a missed
      // question doesn't move the word on (it stays due today). A failed match game only sets back the
      // words that were in a wrong pair; the pairs matched right first time count as right.
      const srsOk = (it) => result || (q.type === 'match' && q.missed ? !q.missed.has(it.id) : false);
      if (q.type !== 'speak' && !(q.retry && result)) items.forEach((it) => srsAnswer(it, srsOk(it)));
      if (!q.retry) { session.first++; if (result) session.firstRight++; }
      if (result) session.xp += q.type === 'match' ? 15 : 10;
      if (!result && !q.retry && q.type !== 'match') session.queue.push({ type: q.type, item: q.item, retry: true });
    }
    const fb = $('#feedback', app);
    const cls = result === null ? 'neutral' : result ? 'ok' : 'bad';
    const title = result === null ? t('skipped') : result ? (note === 'almost' ? t('almost') : themeLine('right')) : themeLine('wrong');
    fb.className = 'feedback ' + cls;
    fb.innerHTML = `${mascot(result === false ? 'sad' : result ? 'cheer' : 'happy', 'mascot-fb')}<div class="fb-text"><strong>${result ? '✓ ' : result === false ? '✗ ' : ''}${esc(title)}</strong>
      ${correctHTML && (result === false || note === 'almost') ? `<div>${note === 'almost' ? '' : esc(t('correctAnswer')) + ' '}${correctHTML}</div>` : ''}</div>
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
          q.missed = new Set(); // ids that were part of a wrong pair (for spaced repetition)
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
              q.missed.add(a.dataset.id); q.missed.add(b.dataset.id);
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
    addXP(xp);
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
    const newBadges = checkBadges({ finished: true, pct });
    const cele = celebrationHTML(newBadges, newBadges.length >= 3);
    saveState();
    const msg = pct === 100 ? t('perfect') : pct >= 70 ? t('great') : t('keepGoing');
    const title = done.mode === 'review' ? t('reviewDone') : `${STAGE_ICONS[done.stage]} ${t('st_' + done.stage)}`;
    // After a due-today review: words still due (missed ones stay due today, and more than 15 may be waiting).
    const srsLeft = done.mode === 'review' && !done.hard ? srsDue().length : 0;
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
      ${srsLeft ? `<p class="muted srs-left">🔁 ${esc(countText(srsLeft, 'srsLeft'))}</p>` : ''}
      ${cele}
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
    if (starCount >= 2 || cele) confetti();
    bindCelebration();
    $('#again', app).addEventListener('click', () => (done.mode === 'topic' ? startStage(done.topic, done.stage) : done.hard ? startHardReview() : startReview()));
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
      ? shown.map(dictRow).join('') + (res.rows.length > DICT_MAX ? `<p class="dict-more muted">${esc(fmt(t('dictMore'), { n: DICT_MAX, total: res.rows.length }))}</p>` : '')
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
      addXP(score * 2);
      if (score > 0) bumpStreak();
      const newBadges = checkBadges({ finished: score > 0, speed: score });
      const cele = celebrationHTML(newBadges, newBadges.length >= 3);
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
        ${cele}
        <div class="stack"><button class="btn primary" id="again" data-enter>${esc(t('play'))}</button>
        <button class="btn ghost" data-go="menu">${esc(t('menu'))}</button></div>
      </main>`);
      if ((record && score > 0) || cele) confetti();
      bindCelebration();
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
        srsAnswer(it, ok);
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
   * Daily goal card, badges, and the celebration banners
   * ------------------------------------------------------------------ */
  /** The compact daily-goal card on the menu (with the way to the badges page). */
  function goalCard(just) {
    const target = goalTarget();
    const xp = goalToday().xp;
    const done = xp >= target;
    const pct = Math.min(100, Math.round((xp / target) * 100));
    const got = BADGES.filter((b) => S.badges[b.id]).length;
    return `<section class="goal-card ${done ? 'done' : ''} ${done && just ? 'just' : ''}" aria-label="${esc(t('goalTitle'))}">
      <div class="goal-ring" role="img" aria-label="${esc(fmt(t('goalRingLabel'), { x: xp, y: target }))}">
        <svg viewBox="0 0 44 44" aria-hidden="true"><circle class="goal-ring-bg" cx="22" cy="22" r="18"/>
          <circle class="goal-ring-fg" cx="22" cy="22" r="18" pathLength="100" stroke-dasharray="${pct} 100"/></svg>
        <span class="goal-ring-icon" aria-hidden="true">${done ? '🎉' : '🎯'}</span>
      </div>
      <div class="goal-body">
        <strong class="goal-title">${esc(done ? t('goalDone') : t('goalTitle'))}</strong>
        <span class="goal-num">${fmt(esc(t('goalProgress')), { n: `<span class="goal-xp" dir="ltr">${xp} / ${target} XP</span>` })}</span>
      </div>
      <button class="goal-badges" data-go="badges" aria-label="${esc(t('badgeTitle') + ': ' + fmt(t('badgeCount'), { x: got, y: BADGES.length }))}">
        <span aria-hidden="true">🏅</span> <span class="goal-badges-label">${esc(t('badgeLink'))}</span> <span class="goal-badges-n" dir="ltr">${got}/${BADGES.length}</span></button>
    </section>`;
  }
  /** Settings: the daily goal, as a segmented control (handled with the other .seg[data-name] controls). */
  function goalSetting() {
    const names = { 30: 'goalCasual', 50: 'goalRegular', 100: 'goalSerious' };
    return `<label>${esc(t('goalSetting'))}</label>
      <div class="seg goal-seg" data-name="goal">${GOALS.map((g) => `<button class="${goalTarget() === g ? 'selected' : ''}" data-v="${g}" aria-pressed="${goalTarget() === g}">
        <strong>${esc(t(names[g]))}</strong><small dir="ltr">${g} XP</small></button>`).join('')}</div>`;
  }

  /** Badges are global (all languages). test(stats) unlocks; prog(stats) = [now, needed] for the locked card. */
  const BADGES = [
    { id: 'first', icon: '🐣', test: (s) => s.exercises },
    { id: 'streak3', icon: '🔥', test: (s) => s.streak >= 3, prog: (s) => [s.streak, 3] },
    { id: 'streak7', icon: '☄️', test: (s) => s.streak >= 7, prog: (s) => [s.streak, 7] },
    { id: 'streak30', icon: '🏔️', test: (s) => s.streak >= 30, prog: (s) => [s.streak, 30] },
    { id: 'goal1', icon: '🎯', test: (s) => s.goalDays >= 1 },
    { id: 'goal7', icon: '📅', test: (s) => s.goalDays >= 7, prog: (s) => [s.goalDays, 7] },
    { id: 'words50', icon: '🌱', test: (s) => s.learned >= 50, prog: (s) => [s.learned, 50] },
    { id: 'words200', icon: '🌳', test: (s) => s.learned >= 200, prog: (s) => [s.learned, 200] },
    { id: 'words500', icon: '📚', test: (s) => s.learned >= 500, prog: (s) => [s.learned, 500] },
    { id: 'perfect', icon: '💯', test: (s) => s.perfect },
    { id: 'speed15', icon: '⚡', test: (s) => s.speed >= 15, prog: (s) => [s.speed, 15] },
    { id: 'group', icon: '🏆', test: (s) => s.group },
    { id: 'story', icon: '📜', test: (s) => s.story },
    { id: 'polyglot', icon: '🌍', test: (s) => s.langsUsed >= 2, prog: (s) => [s.langsUsed, 2] },
    { id: 'xp1000', icon: '⭐', test: (s) => s.xp >= 1000, prog: (s) => [s.xp, 1000] },
    { id: 'xp5000', icon: '🌟', test: (s) => s.xp >= 5000, prog: (s) => [s.xp, 5000] },
  ];
  /** A whole topic (every sub-topic) finished in the current language. */
  const groupFinished = () => !!(DB && L) && visibleGroups().some((g) => { const p = groupProgress(g); return p.total > 0 && p.done === p.total; });
  /** What the badges look at. ev: what just happened ({finished, pct, speed}). */
  function badgeStats(ev = {}) {
    const langs = Object.keys(S.langs).map((k) => S.langs[k]);
    const recsOf = (ls) => Object.keys(obj(ls.topics)).map((k) => obj(ls.topics[k]));
    const recs = langs.flatMap(recsOf);
    const anyStage = (r, skip) => Object.keys(obj(r.stages)).some((k) => k !== skip && (+r.stages[k] || 0) > 0);
    return {
      exercises: !!ev.finished || recs.some((r) => anyStage(r, 'learn')), // flashcards alone aren't an exercise
      streak: currentStreak(),
      goalDays: S.goalLog.length,
      learned: langs.reduce((n, ls) => n + Object.keys(obj(ls.srs)).filter((id) => ls.srs[id][0] >= 2).length, 0),
      perfect: ev.pct === 100 || recs.some((r) => +r.best >= 100),
      speed: Math.max(+ev.speed || 0, ...langs.map((ls) => +ls.speedBest || 0)),
      group: groupFinished(),
      story: recs.some((r) => +obj(r.stages).story > 0),
      langsUsed: langs.filter((ls) => Object.keys(obj(ls.words)).length > 0 || recsOf(ls).some((r) => anyStage(r))).length,
      xp: S.xp,
    };
  }
  /** Unlock every badge whose condition is met. Returns the newly unlocked ones (the caller saves). */
  function checkBadges(ev) {
    if (!S.settings) return [];
    const st = badgeStats(ev);
    const fresh = BADGES.filter((b) => !S.badges[b.id] && b.test(st));
    fresh.forEach((b) => (S.badges[b.id] = todayKey()));
    return fresh;
  }
  /** "2026-11-8" -> a short date in the UI language. */
  function fmtDay(key) {
    const [y, m, d] = String(key).split('-').map(Number);
    try { return new Date(y, m - 1, d).toLocaleDateString(ui() === 'he' ? 'he-IL' : 'en-GB', { day: 'numeric', month: ui() === 'he' ? 'numeric' : 'short', year: 'numeric' }); }
    catch (e) { return String(key); }
  }
  /**
   * Banners for the daily goal (reached for the first time today) and new badges.
   * combined: several badges become one "You earned N badges" banner (used on the menu).
   */
  function celebrationHTML(fresh, combined) {
    const parts = [];
    if (goalJustReached) {
      goalJustReached = false;
      parts.push(`<div class="goal-toast"><span class="cele-icon" aria-hidden="true">🎯</span>
        <span class="cele-text"><strong>${esc(t('goalReached'))}</strong><small>${fmt(esc(t('goalReachedMsg')), { y: `<span dir="ltr">${goalTarget()} XP</span>` })}</small></span></div>`);
    }
    const list = fresh || [];
    if (combined && list.length > 1) {
      parts.push(`<button class="badge-toast" data-go="badges"><span class="cele-icon" aria-hidden="true">${list.slice(0, 3).map((b) => b.icon).join('')}</span>
        <span class="cele-text"><strong>${esc(fmt(t('badgeNewN'), { n: list.length }))}</strong><small>${list.map((b) => esc(t('badge_' + b.id))).join(' · ')}</small></span></button>`);
    } else {
      list.forEach((b) => parts.push(`<button class="badge-toast" data-go="badges"><span class="cele-icon" aria-hidden="true">${b.icon}</span>
        <span class="cele-text"><small>${esc(t('badgeNew'))}</small><strong>${esc(t('badge_' + b.id))}</strong></span></button>`));
    }
    return parts.length ? `<div class="celebrate" role="status">${parts.join('')}
      <button class="icon-btn cele-close" aria-label="${esc(t('badgeClose'))}">✕</button></div>` : '';
  }
  function bindCelebration() {
    const box = $('.celebrate', app);
    if (box) $('.cele-close', box).addEventListener('click', () => box.remove());
  }
  function badgeCard(b, st) {
    const day = S.badges[b.id];
    const p = !day && b.prog ? b.prog(st) : null;
    return `<li class="badge-card ${day ? 'unlocked' : 'locked'}" data-badge="${b.id}">
      <span class="badge-icon" aria-hidden="true">${b.icon}</span>
      <strong class="badge-name">${esc(t('badge_' + b.id))}</strong>
      <span class="badge-desc">${esc(t('badge_' + b.id + '_d'))}</span>
      ${day ? `<span class="badge-date">✓ ${esc(fmt(t('badgeEarned'), { date: fmtDay(day) }))}</span>`
        : `<span class="badge-lock"><span aria-hidden="true">🔒</span> ${esc(t('badgeLocked'))}${p ? ` · <span dir="ltr">${Math.min(p[0], p[1])}/${p[1]}</span>` : ''}</span>`}
    </li>`;
  }
  /** The badges page: unlocked in color with their date, locked greyed with how to earn them. */
  function renderBadges() {
    if (!S.settings || !cur || !DB) return renderMenu();
    if (checkBadges().length) saveState();
    const st = badgeStats();
    const got = BADGES.filter((b) => S.badges[b.id]).length;
    render(`<main class="badges-page">
      <div class="lesson-head">
        <button class="icon-btn back-btn" data-go="menu" aria-label="${esc(t('menu'))}">${backArrow()}</button>
        <h1><span class="title-icon">🏅</span><span class="title-text">${esc(t('badgeTitle'))}</span></h1>
      </div>
      <div class="badge-summary"><span>${esc(fmt(t('badgeCount'), { x: got, y: BADGES.length }))}</span>
        <div class="progress grow"><i style="width:${(got / BADGES.length) * 100}%"></i></div></div>
      <ul class="badge-grid">${BADGES.map((b) => badgeCard(b, st)).join('')}</ul>
      <p class="muted badge-note">${esc(t('badgeWordsNote'))}</p>
    </main>`);
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
    // Progress: spaced repetition, daily goal, badges
    srsAnswer, srsDue, startHardReview, renderReviewNone, seedSrs, dayNum, todayNum, todayKey, SRS_STEPS,
    shiftDays(n) { dayShift = n; }, addXP, goalTarget, goalToday, goalCard, checkBadges, badgeStats, renderBadges, BADGES,
  };
})();
