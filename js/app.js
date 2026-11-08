/* Talk like a Persian — app logic (no frameworks, no build step). */
(function () {
  'use strict';

  // js/registry.js fills TLAP_DATA = {groups, topics}. A data file that is missing or fails
  // to load simply never calls TLAP_ADD, so whatever did load is used.
  const DATA = window.TLAP_DATA || {};
  const STR = window.TLAP_STRINGS;
  const STORE_KEY = 'tlap-v1';
  const LEVELS = ['beginner', 'intermediate', 'advanced'];
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const ZWJ = '‍';

  /* ------------------------------------------------------------------ *
   * Data: groups ("topics" on the menu) contain lessons ("sub-topics").
   * ------------------------------------------------------------------ */
  const fixFa = (s) => s.replace(/ي/g, 'ی').replace(/ك/g, 'ک');
  const levelOk = (l) => LEVELS.indexOf(l) >= 0;

  /** Turn one raw lesson into the app's lesson object. Broken items are skipped (ids keep their index). */
  function buildLesson(tp) {
    const topic = Object.assign({}, tp);
    topic.items = [];
    tp.items.forEach((raw, i) => {
      try {
        const id = tp.id + ':' + i;
        if (tp.kind === 'alphabet') {
          const [letter, name, sound, joins, exFa, exTr, exEn, exHe] = raw;
          topic.items.push({
            id, topic: tp.id, isLetter: true, fa: fixFa(letter), tr: name, name, sound, joins,
            ex: { fa: fixFa(exFa), tr: exTr, en: exEn, he: exHe },
          });
          return;
        }
        const [fa, tr, en, he, extra] = raw;
        if (![fa, tr, en, he].every((x) => typeof x === 'string')) return;
        const item = { id, topic: tp.id, fa: fixFa(fa), tr, en, he, extra: extra || null };
        if (item.extra && item.extra.form) item.extra.form = [fixFa(item.extra.form[0]), item.extra.form[1]];
        topic.items.push(item);
      } catch (e) { /* skip a broken item */ }
    });
    return topic;
  }

  const LESSON_POOL = {};
  (Array.isArray(DATA.topics) ? DATA.topics : []).forEach((tp) => {
    try {
      if (!tp || !tp.id || LESSON_POOL[tp.id] || !tp.title || !Array.isArray(tp.items)) return;
      const topic = buildLesson(tp);
      if (!levelOk(topic.level)) topic.level = 'beginner';
      if (topic.items.length) LESSON_POOL[tp.id] = topic;
    } catch (e) { /* skip a broken lesson */ }
  });
  const GROUPS = [];
  const GROUP_BY_ID = {};
  (Array.isArray(DATA.groups) ? DATA.groups : []).forEach((g) => {
    if (!g || !g.id || GROUP_BY_ID[g.id] || !g.title) return;
    const lessons = (Array.isArray(g.lessons) ? g.lessons : [])
      .map((id) => LESSON_POOL[id]).filter((tp) => tp && tp.group === g.id);
    if (!lessons.length) return;
    const group = Object.assign({}, g, { level: levelOk(g.level) ? g.level : 'beginner', lessons });
    group.items = lessons.flatMap((tp) => tp.items);
    GROUPS.push(group);
    GROUP_BY_ID[g.id] = group;
  });
  /** Every lesson, in menu order. */
  const TOPICS = GROUPS.flatMap((g) => g.lessons);
  const TOPIC_BY_ID = {};
  const ITEM_BY_ID = {};
  TOPICS.forEach((tp) => {
    TOPIC_BY_ID[tp.id] = tp;
    tp.items.forEach((it) => (ITEM_BY_ID[it.id] = it));
  });
  const ALL_LETTERS = TOPICS.filter((tp) => tp.kind === 'alphabet').flatMap((tp) => tp.items);
  const ALL_WORDS = TOPICS.filter((tp) => tp.kind !== 'alphabet').flatMap((tp) => tp.items);
  const groupOf = (tp) => GROUP_BY_ID[tp.group];

  /* ------------------------------------------------------------------ *
   * Saved state (localStorage)
   * ------------------------------------------------------------------ */
  const freshState = () => ({
    settings: null, topics: {}, words: {}, xp: 0, streak: { count: 0, last: null }, speedBest: 0,
  });

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const st = Object.assign(freshState(), JSON.parse(raw));
        // v1 saved one star rating per topic; it now belongs to the "Mix of everything" exercise.
        Object.values(st.topics).forEach((rec) => {
          if (!rec.stages) rec.stages = rec.stars ? { mix: rec.stars } : {};
        });
        return st;
      }
    } catch (e) { /* storage unavailable or corrupt: start fresh */ }
    return freshState();
  }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
  }
  let S = loadState();

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
    const s = S.words[item.id] || 0;
    S.words[item.id] = correct ? Math.min(5, s + 1) : Math.max(0, s - 2);
  }

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */
  let pendingLang = 'en';
  const lang = () => (S.settings ? S.settings.uiLang : pendingLang);
  const t = (k) => (STR[lang()] && STR[lang()][k] !== undefined ? STR[lang()][k] : STR.en[k] !== undefined ? STR.en[k] : k);
  const isReader = () => !!(S.settings && S.settings.track === 'full');
  const speechOn = () => !!(SR && S.settings && S.settings.speech);

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const faS = (s, cls = '') => `<span class="fa ${cls}" lang="fa" dir="rtl">${esc(s)}</span>`;
  const trS = (s, cls = '') => `<span class="tr ${cls}" dir="ltr">${esc(s)}</span>`;
  /** Fill {name} placeholders in a UI string. */
  const fmt = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
  /** A {en, he} text in the UI language. */
  const tx = (o) => (o ? o[lang()] || o.en || '' : '');
  const HAS_FA = /[؀-ۿ]/;
  // Farsi letters (and ZWNJ), but not the digits ۰-۹ / ٠-٩: digits read left to right.
  const FA_L = '[\\u0600-\\u065F\\u066A-\\u06EF\\u06FA-\\u06FF\\u200C]';
  const MIXED_RE = new RegExp(`(${FA_L}+(?:[\\s\\u06F0-\\u06F9\\u0660-\\u0669]+${FA_L}+)*)|([\\u06F0-\\u06F9\\u0660-\\u0669]+)`, 'g');
  /**
   * Text that mixes English/Hebrew with Farsi: isolate each Farsi run (right to left) so the order stays
   * right. Digit runs on their own (e.g. "۰ ۱ ۲") get the Farsi font but follow the surrounding direction.
   */
  const mixed = (s) => esc(s).replace(MIXED_RE, (m, word) => (word
    ? `<span class="fa" lang="fa" dir="rtl">${m}</span>`
    : `<span class="fa num" lang="fa">${m}</span>`));
  /** An icon that may be an emoji or a Farsi letter. */
  const iconHTML = (icon) => (HAS_FA.test(icon || '') ? faS(icon, 'icon-fa') : esc(icon || '📘'));
  const backArrow = () => (lang() === 'he' ? '→' : '←');
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const PUNCT = /[.,!?؟،:;]/g;
  const tokens = (s) => s.split(/\s+/).map((w) => w.replace(PUNCT, '')).filter(Boolean);

  function meaning(it) {
    if (it.isLetter) return it.name + ' (' + it.sound + ')';
    return it[lang()];
  }
  /** The word as the main thing on screen: Farsi first for readers, Latin first for speakers. */
  /** Long words and sentences get a smaller font so they fit cards and question boxes. */
  const lenCls = (s) => { const n = String(s).length; return n > 30 ? 'xlong' : n > 16 ? 'long' : ''; };
  function wordBlock(it, size) {
    const a = isReader() ? faS(it.fa, 'primary') : trS(it.tr, 'primary');
    const b = isReader() ? trS(it.tr, 'secondary') : faS(it.fa, 'secondary');
    return `<div class="word ${size || 'lg'} ${lenCls(isReader() ? it.fa : it.tr)}">${a}${b}</div>`;
  }
  /** Farsi script alone, as the thing to read. */
  const faBlock = (s) => `<div class="word xl ${lenCls(s)}">${faS(s, 'primary')}</div>`;
  /** A meaning shown big in a question. */
  const meaningBig = (s, inner) => `<div class="meaning big ${String(s).length > 34 ? 'long' : ''}">${inner === undefined ? esc(s) : inner}</div>`;
  /** Compact word for answer buttons. */
  function wordShort(it) {
    return isReader()
      ? `${faS(it.fa, 'opt-main')}<span class="opt-sub">${trS(it.tr)}</span>`
      : `${trS(it.tr, 'opt-main')}<span class="opt-sub">${faS(it.fa)}</span>`;
  }
  function extraHTML(it) {
    const x = it.extra;
    if (!x) return '';
    if (x.digit) return `<div class="extra"><span class="label">${t('persianDigit')}:</span> ${faS(x.digit, 'digit')}</div>`;
    if (x.form) {
      // In spoken-Farsi lessons the form is the written version; elsewhere it is the present "I" form.
      const tp = TOPIC_BY_ID[it.topic];
      const spoken = /spoken|colloq/i.test(it.topic + ' ' + ((tp && tp.title && tp.title.en) || ''));
      const label = spoken ? t('written') : t('presentI');
      const w = isReader() ? `${faS(x.form[0])} · ${trS(x.form[1])}` : `${trS(x.form[1])} · ${faS(x.form[0])}`;
      return `<div class="extra"><span class="label">${label}:</span> ${w}</div>`;
    }
    if (x.lit) return `<div class="extra"><span class="label">${t('literally')}:</span> “${esc(x.lit[lang() === 'he' ? 1 : 0])}”</div>`;
    return '';
  }

  /** Lenient comparison of typed Latin letters. */
  function normTr(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/x/g, 'kh').replace(/q/g, 'gh').replace(/w/g, 'v')
      .replace(/aa/g, 'a').replace(/ee/g, 'i').replace(/oo|ou/g, 'u')
      .replace(/[^a-z]/g, '');
  }
  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  function compareTr(input, target) {
    const a = normTr(input), b = normTr(target);
    if (!a) return 'no';
    if (a === b) return 'exact';
    const d = lev(a, b);
    if ((b.length >= 4 && d <= 1) || (b.length >= 10 && d <= 2)) return 'almost';
    return 'no';
  }
  function normFa(s) {
    return fixFa(s).replace(/[ً-ٰٟ‌‍]/g, '').replace(/[آأإ]/g, 'ا').replace(/ة/g, 'ه')
      .replace(PUNCT, '').replace(/\s+/g, '');
  }
  function speechMatches(heard, target) {
    const a = normFa(heard), b = normFa(target);
    if (!a) return false;
    if (a === b || a.includes(b)) return true;
    return lev(a, b) <= Math.max(1, Math.floor(b.length * 0.25));
  }

  const low = (s) => (s === undefined || s === null ? '' : String(s).trim().toLowerCase());
  /** True if x could also be a right answer for item: same Farsi, Latin, English or Hebrew. */
  function sameAnswer(item, x) {
    return ['fa', 'tr', 'en', 'he'].some((k) => {
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
  /** Pishi the Persian cat, our mascot. mood: happy | cheer | sad */
  function pishi(mood = 'happy', cls = '') {
    const eyes = mood === 'cheer'
      ? '<path d="M41 52q6-8 12 0M67 52q6-8 12 0" stroke="#2b2d42" stroke-width="4" fill="none" stroke-linecap="round"/>'
      : '<circle cx="47" cy="51" r="5.5" fill="#2b2d42"/><circle cx="73" cy="51" r="5.5" fill="#2b2d42"/>'
        + '<circle cx="49" cy="49" r="1.8" fill="#fff"/><circle cx="75" cy="49" r="1.8" fill="#fff"/>';
    const brows = mood === 'sad' ? '<path d="M40 41l11 4M80 41l-11 4" stroke="#b5651d" stroke-width="3" stroke-linecap="round"/>' : '';
    const mouth = mood === 'sad'
      ? '<path d="M53 72q7-5 14 0" stroke="#2b2d42" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
      : mood === 'cheer'
        ? '<path d="M52 66q8 12 16 0z" fill="#e5546f" stroke="#2b2d42" stroke-width="2" stroke-linejoin="round"/>'
        : '<path d="M60 65q-4 6-9 3M60 65q4 6 9 3" stroke="#2b2d42" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
    return `<svg class="pishi mood-${mood} ${cls}" viewBox="0 0 120 120" aria-hidden="true">
      <path class="pishi-tail" d="M86 98q30-4 22-34" stroke="#f4a259" stroke-width="11" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="99" rx="31" ry="19" fill="#f4a259"/>
      <ellipse cx="60" cy="103" rx="17" ry="11" fill="#fff3e3"/>
      <path d="M27 42L33 10 54 30Z" fill="#f4a259"/><path d="M93 42L87 10 66 30Z" fill="#f4a259"/>
      <path d="M33 34l3-15 10 11Z" fill="#ff9eb5"/><path d="M87 34l-3-15-10 11Z" fill="#ff9eb5"/>
      <circle cx="60" cy="53" r="33" fill="#f4a259"/>
      <path d="M60 21v10M49 23l3 8M71 23l-3 8" stroke="#d9822b" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="60" cy="66" rx="16" ry="12" fill="#fff3e3"/>
      ${eyes}${brows}
      <circle cx="38" cy="63" r="5" fill="#ff9eb5" opacity=".7"/><circle cx="82" cy="63" r="5" fill="#ff9eb5" opacity=".7"/>
      <path d="M56 60h8l-4 5z" fill="#ff6b8b"/>
      ${mouth}
      <path d="M44 66l-16-3M44 70l-15 3M76 66l16-3M76 70l15 3" stroke="#b5651d" stroke-width="1.6" stroke-linecap="round"/>
    </svg>`;
  }
  function pishiSays(text, mood = 'happy') {
    return `<div class="pishi-row">${pishi(mood)}<div class="bubble">${esc(text)}</div></div>`;
  }

  function letterForm(it, which) {
    if (which === 'initial') return it.fa + ZWJ;
    if (which === 'medial') return ZWJ + it.fa + ZWJ;
    if (which === 'final') return ZWJ + it.fa;
    return it.fa;
  }

  /* ------------------------------------------------------------------ *
   * Shell
   * ------------------------------------------------------------------ */
  const app = document.getElementById('app');

  function applyLang() {
    document.documentElement.lang = lang();
    document.documentElement.dir = lang() === 'he' ? 'rtl' : 'ltr';
  }
  function topBar() {
    return `<header class="topbar">
      <button class="brand" data-go="menu" aria-label="Talk like a Persian">
        <span class="brand-mark" aria-hidden="true">${faS('ف')}</span>
        <span class="brand-text">Talk like a Persian</span>
      </button>
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
    applyLang();
    app.innerHTML = (withBar ? topBar() : '') + html;
    $$('[data-go]', app).forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
    window.scrollTo(0, 0);
  }
  function go(where) {
    if (where === 'menu') renderMenu();
    else if (where === 'settings') renderSettings();
    else if (where === 'dictionary') renderDictionary();
  }
  function confetti() {
    const colors = ['#58cc02', '#ffc93c', '#ff6b6b', '#38b6ff', '#9b5de5', '#f15bb5', '#ff9f1c'];
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
   * Onboarding
   * ------------------------------------------------------------------ */
  function renderOnboarding() {
    const choice = { uiLang: pendingLang, level: null, track: null, speech: null };
    const steps = ['uiLang', 'level', 'track'];
    if (SR) steps.push('speech');
    let step = 0;

    const opts = {
      uiLang: () => [
        { v: 'en', title: 'English', desc: 'Learn Farsi in English' },
        { v: 'he', title: 'עברית', desc: 'ללמוד פרסית בעברית' },
      ],
      level: () => LEVELS.map((l) => ({ v: l, title: t(l), desc: t(l + 'Desc') })),
      track: () => [
        { v: 'speak', title: '🗣️ ' + t('trackSpeak'), desc: t('trackSpeakDesc') },
        { v: 'full', title: '✍️ ' + t('trackFull'), desc: t('trackFullDesc') },
      ],
      speech: () => [
        { v: true, title: '🎤 ' + t('speechOn'), desc: t('speechDesc') },
        { v: false, title: t('speechOff'), desc: '' },
      ],
    };
    const titles = { uiLang: 'chooseLang', level: 'chooseLevel', track: 'chooseTrack', speech: 'chooseSpeech' };

    function draw() {
      const key = steps[step];
      pendingLang = choice.uiLang;
      const list = opts[key]();
      render(`<main class="onboard">
        <div class="hero">
          ${pishi(step === steps.length - 1 ? 'cheer' : 'happy', 'hero-cat')}
          <div class="hero-fa">${faS('مثل یک ایرانی حرف بزن')}</div>
          <h1>Talk like a Persian</h1>
          <p class="muted">${esc(t('tagline'))}</p>
        </div>
        ${step === 0 ? `<div class="bubble wide">${esc(t('pishiIntro'))}<br>${esc(t('welcome'))} ${esc(t('welcomeSub'))}</div>` : ''}
        <div class="dots">${steps.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>
        <h2>${esc(t(titles[key]))}</h2>
        <div class="choices">
          ${list.map((o, i) => `<button class="choice ${choice[key] === o.v ? 'selected' : ''}" data-i="${i}">
            <strong>${esc(o.title)}</strong>${o.desc ? `<span>${esc(o.desc)}</span>` : ''}</button>`).join('')}
        </div>
        <div class="row">
          ${step > 0 ? `<button class="btn ghost" id="ob-back">${esc(t('back'))}</button>` : '<span></span>'}
          <button class="btn primary" id="ob-next" data-enter ${choice[key] === null ? 'disabled' : ''}>
            ${esc(step === steps.length - 1 ? t('start') : t('next'))}</button>
        </div>
      </main>`, false);
      $$('.choice', app).forEach((b) => b.addEventListener('click', () => {
        choice[key] = list[+b.dataset.i].v;
        draw();
      }));
      const back = $('#ob-back', app);
      if (back) back.addEventListener('click', () => { step--; draw(); });
      $('#ob-next', app).addEventListener('click', () => {
        if (step < steps.length - 1) { step++; draw(); return; }
        S.settings = { uiLang: choice.uiLang, level: choice.level, track: choice.track, speech: !!choice.speech };
        saveState();
        renderMenu();
      });
    }
    draw();
  }

  /* ------------------------------------------------------------------ *
   * Menu
   * ------------------------------------------------------------------ */
  function stars(n) {
    return `<span class="stars" aria-label="${n}/3">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : ''}">★</i>`).join('')}</span>`;
  }
  /** Lessons of a group this learner can see (no alphabet in the speaking-only track). */
  const visibleLessons = (g) => (isReader() ? g.lessons : g.id === 'g-alphabet' ? [] : g.lessons.filter((tp) => tp.kind !== 'alphabet'));
  const visibleGroups = () => GROUPS.filter((g) => visibleLessons(g).length);
  /** Exercises that count toward finishing a lesson. Speaking is an optional bonus, so it never counts. */
  const countedStages = (tp) => stagesFor(tp).filter((s) => s !== 'speaking');
  function stageProgress(tp) {
    const rec = S.topics[tp.id] || {};
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
  function renderMenu() {
    if (!S.settings) return renderOnboarding();
    const mine = levelOk(S.settings.level) ? S.settings.level : 'beginner';
    // The learner's own level goes first, then the others in order.
    const sections = [mine, ...LEVELS.filter((l) => l !== mine)]
      .map((l) => ({ level: l, groups: visibleGroups().filter((g) => g.level === l) }))
      .filter((s) => s.groups.length);

    render(`<main class="menu">
      ${pishiSays(pick(t('pishiGreet')))}
      <h1 class="page-title">${esc(t('menuTitle'))}</h1>
      <div class="modes">
        <button class="mode review" id="m-review"><span class="mode-icon">🔁</span>
          <span><strong>${esc(t('review'))}</strong><small>${esc(t('reviewDesc'))}</small></span></button>
        <button class="mode speed" id="m-speed"><span class="mode-icon">⚡</span>
          <span><strong>${esc(t('speed'))}</strong><small>${esc(t('speedDesc'))}${S.speedBest ? ` · ${esc(t('best'))}: ${S.speedBest}` : ''}</small></span></button>
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
      ${pishiSays(t('pishiGroup'))}
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
    const st = S.settings;
    const seg = (name, options) => `<div class="seg" data-name="${name}">${options.map(([v, label]) =>
      `<button class="${String(st[name]) === String(v) ? 'selected' : ''}" data-v="${v}">${esc(label)}</button>`).join('')}</div>`;
    render(`<main class="settings">
      <h1 class="page-title">⚙️ ${esc(t('settings'))}</h1>
      <label>${esc(t('language'))}</label>${seg('uiLang', [['en', 'English'], ['he', 'עברית']])}
      <label>${esc(t('level'))}</label>${seg('level', LEVELS.map((l) => [l, t(l)]))}
      <label>${esc(t('track'))}</label>${seg('track', [['speak', t('trackSpeak')], ['full', t('trackFull')]])}
      <label>${esc(t('speechSetting'))}</label>
      ${SR ? seg('speech', [[true, t('on')], [false, t('off')]]) : `<p class="muted">${esc(t('speechUnsupported'))}</p>`}
      <div class="row"><button class="btn danger" id="reset">${esc(t('resetProgress'))}</button>
      <button class="btn primary" data-go="menu" data-enter>${esc(t('done'))}</button></div>
    </main>`);
    $$('.seg', app).forEach((g) => $$('button', g).forEach((b) => b.addEventListener('click', () => {
      let v = b.dataset.v;
      if (g.dataset.name === 'speech') v = v === 'true';
      st[g.dataset.name] = v;
      saveState();
      renderSettings();
    })));
    $('#reset', app).addEventListener('click', () => {
      if (!confirm(t('confirmReset'))) return;
      const settings = S.settings;
      S = freshState();
      S.settings = settings;
      saveState();
      renderMenu();
    });
  }

  /* ------------------------------------------------------------------ *
   * Topic page: every exercise type, open in any order
   * ------------------------------------------------------------------ */
  const STAGE_ICONS = {
    learn: '📖', choice: '🔘', truefalse: '✅', match: '🧩', typing: '⌨️', order: '🔀', reading: '👀',
    spelling: '🔤', speaking: '🎤', letters: '🔠', shapes: '🌀', words: '📝', mix: '🏆',
  };
  const typingOk = (it) => normTr(it.tr).length <= 30;
  const orderOk = (it) => tokens(it.tr).length >= 3;

  function stagesFor(topic) {
    if (topic.kind === 'alphabet') return ['learn', 'letters', 'shapes', 'words', 'match', 'mix'];
    const items = topic.items;
    const st = ['learn', 'choice', 'truefalse', 'match'];
    if (items.filter(typingOk).length >= 3) st.push('typing');
    if (items.filter(orderOk).length >= 3) st.push('order');
    if (isReader()) {
      st.push('reading');
      if (items.filter(canSpell).length >= 3) st.push('spelling');
    }
    if (speechOn()) st.push('speaking');
    st.push('mix');
    return st;
  }

  function renderTopic(topic) {
    const rec = S.topics[topic.id] || {};
    const g = groupOf(topic);
    const p = stageProgress(topic);
    render(`<main class="topic-page">
      <div class="lesson-head">
        <button class="icon-btn back-btn" id="to-group" aria-label="${esc(g ? tx(g.title) : t('menu'))}">${backArrow()}</button>
        <h1><span class="title-icon">${iconHTML(topic.icon)}</span><span class="title-text">${mixed(tx(topic.title))}</span></h1>
      </div>
      ${topic.intro ? `<div class="intro">💡 ${mixed(tx(topic.intro))}</div>` : ''}
      ${pishiSays(t('pishiTopic'))}
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
      return {
        front: `<div class="letter-big">${faS(it.fa)}</div><div class="muted">${esc(t('tapToFlip'))}</div>`,
        back: `<div class="letter-name">${trS(it.name)} <span class="muted">· ${esc(t('sound'))}: ${trS(it.sound)}</span></div>
          <div class="forms-title">${esc(t('letterForms'))}</div>
          <div class="forms">${forms.map((f) => `<div class="form">${faS(letterForm(it, f))}<small>${esc(t(f))}</small></div>`).join('')}</div>
          ${it.joins ? '' : `<p class="note">${esc(t('nonJoining'))}</p>`}
          <div class="example"><span class="label">${esc(t('example'))}:</span> ${faS(it.ex.fa, 'ex-fa')} ${trS(it.ex.tr)} = ${esc(it.ex[lang()])}</div>`,
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

  function canSpell(it) {
    if (it.isLetter || /[\s‌]/.test(it.fa)) return false;
    const n = Array.from(it.fa.replace(PUNCT, '')).length;
    return n >= 2 && n <= 7;
  }
  function typesFor(it) {
    if (it.isLetter) return ['letterName', 'soundLetter', 'formLetter', 'exampleRead'];
    const ts = ['mcMeaning', 'mcReverse', 'trueFalse'];
    if (normTr(it.tr).length <= 22) ts.push('typeTr');
    if (tokens(it.tr).length >= 3) ts.push('order', 'order');
    if (isReader()) {
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
    const rec = S.topics[topic.id] || (S.topics[topic.id] = { best: 0, stages: {} });
    if (!rec.stages) rec.stages = {};
    return rec;
  }
  function startStage(topic, stage) {
    session = { mode: 'topic', topic, stage, queue: stageQueue(topic, stage), idx: 0, first: 0, firstRight: 0, xp: 0 };
    renderQuestion();
  }
  function startReview() {
    const ids = Object.keys(S.words).filter((id) => ITEM_BY_ID[id] && (isReader() || !ITEM_BY_ID[id].isLetter));
    if (ids.length < 4) {
      render(`<main class="center-page"><div class="big-emoji">🔁</div><p>${esc(t('reviewEmpty'))}</p>
        <button class="btn primary" data-go="menu" data-enter>${esc(t('menu'))}</button></main>`);
      return;
    }
    const weakest = shuffle(ids).sort((a, b) => (S.words[a] || 0) - (S.words[b] || 0)).slice(0, 12).map((id) => ITEM_BY_ID[id]);
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
    const title = result === null ? t('skipped') : result ? (note === 'almost' ? t('almost') : pick(t('praise'))) : t('wrong');
    fb.className = 'feedback ' + cls;
    fb.innerHTML = `${pishi(result === false ? 'sad' : result ? 'cheer' : 'happy', 'fb-cat')}<div class="fb-text"><strong>${result ? '✓ ' : result === false ? '✗ ' : ''}${esc(title)}</strong>
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
  const answerWord = (it) => (isReader() ? `${faS(it.fa)} (${trS(it.tr)})` : `${trS(it.tr)} (${faS(it.fa)})`);

  const QUESTIONS = {
    mcMeaning(q) {
      const it = q.item;
      const others = distractors(it, 3, meaning);
      return choiceQuestion(q, t('qMeaning'), wordBlock(it, 'lg'),
        [it, ...others].map((x) => ({ html: esc(meaning(x)), correct: x === it, item: x })), esc(meaning(it)));
    },
    mcReverse(q) {
      const it = q.item;
      const others = distractors(it, 3, (x) => x.tr);
      return choiceQuestion(q, t('qReverse'), meaningBig(meaning(it)),
        [it, ...others].map((x) => ({ html: wordShort(x), correct: x === it, item: x })), answerWord(it));
    },
    readScript(q) {
      const it = q.item;
      const others = distractors(it, 3, (x) => x.tr);
      return choiceQuestion(q, t('qRead'), faBlock(it.fa),
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
      const stem = isReader()
        ? `<div class="word lg">${faS(it.fa, 'primary')}</div><div class="meaning">${esc(meaning(it))}</div>`
        : meaningBig(meaning(it));
      return {
        prompt: t('qType'),
        html: `<div class="stem">${stem}</div>
          <input class="type-in" id="type-in" dir="ltr" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(t('typePlaceholder'))}">
          <p class="muted small">${esc(t('typeTip'))}</p>
          <div class="row"><button class="btn ghost" id="hint">💡 ${esc(t('hint'))}</button>
          <button class="btn primary" id="check" data-enter>${esc(t('check'))}</button></div>`,
        mount(root) {
          const input = $('#type-in', root);
          input.focus();
          let hints = 0;
          $('#hint', root).addEventListener('click', () => {
            hints++;
            const n = Math.ceil((it.tr.length * hints) / 3);
            input.value = it.tr.slice(0, n);
            input.focus();
          });
          $('#check', root).addEventListener('click', () => {
            const r = compareTr(input.value, it.tr);
            input.classList.add(r === 'no' ? 'wrong' : 'right');
            answer(q, r !== 'no', trS(it.tr), r === 'almost' ? 'almost' : null);
          });
        },
      };
    },
    order(q) {
      const it = q.item;
      const target = isReader() ? tokens(it.fa) : tokens(it.tr);
      let bank = shuffle(target.map((w, i) => ({ w, i })));
      if (bank.every((b, k) => b.i === k)) bank = bank.reverse();
      const placed = [];
      const tile = (b, where) => `<button class="tile" data-where="${where}" data-i="${b.i}">${isReader() ? faS(b.w) : trS(b.w)}</button>`;
      return {
        prompt: t('qOrder'),
        html: `<div class="stem">${meaningBig(meaning(it))}</div>
          <div class="answer-line" id="line" dir="${isReader() ? 'rtl' : 'ltr'}"></div>
          <div class="bank" id="bank" dir="${isReader() ? 'rtl' : 'ltr'}"></div>
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
            const ok = placed.map((b) => b.w).join(' ') === target.join(' ');
            $('#line', root).classList.add(ok ? 'right' : 'wrong');
            answer(q, ok, isReader() ? faS(it.fa) : trS(it.tr));
          });
        },
      };
    },
    spell(q) {
      const it = q.item;
      const letters = Array.from(it.fa.replace(PUNCT, ''));
      const decoys = shuffle(ALL_LETTERS.map((l) => l.fa).filter((l) => !letters.includes(l))).slice(0, 2);
      const bank = shuffle([...letters, ...decoys]).map((ch, i) => ({ ch, i }));
      const built = [];
      return {
        prompt: t('qSpell'),
        html: `<div class="stem">${meaningBig(meaning(it))}<div class="muted">${trS(it.tr)}</div></div>
          <div class="spell-out" id="out">${faS('')}</div>
          <div class="bank letters" id="bank" dir="rtl"></div>
          <div class="row"><button class="btn ghost" id="undo">⌫</button>
          <button class="btn primary" id="check" data-enter disabled>${esc(t('check'))}</button></div>`,
        mount(root) {
          const draw = () => {
            $('#out', root).innerHTML = faS(built.map((b) => b.ch).join('') || ' ');
            $('#bank', root).innerHTML = bank.map((b) =>
              `<button class="tile letter ${built.includes(b) ? 'used' : ''}" data-i="${b.i}" ${built.includes(b) ? 'disabled' : ''}>${faS(b.ch)}</button>`).join('');
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
            answer(q, ok, faS(it.fa));
          });
        },
      };
    },
    match(q) {
      const items = q.items;
      const left = shuffle(items);
      const right = shuffle(items);
      const leftHTML = (it) => (it.isLetter ? faS(it.fa, 'match-letter') : isReader() ? faS(it.fa) : trS(it.tr));
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
          $('#skip', root).addEventListener('click', () => { try { rec && rec.abort(); } catch (e) { /* ignore */ } answer(q, null); });
          $('#mic', root).addEventListener('click', () => {
            try {
              rec = new SR();
              rec.lang = 'fa-IR';
              rec.maxAlternatives = 5;
              rec.interimResults = false;
            } catch (e) { status.textContent = t('micError'); return; }
            $('#mic', root).classList.add('live');
            status.textContent = t('listening');
            rec.onresult = (ev) => {
              const alts = Array.from(ev.results[0]).map((a) => a.transcript);
              if (alts.some((a) => speechMatches(a, it.fa))) answer(q, true, null);
              else status.innerHTML = `${esc(t('heard'))} ${faS(alts[0] || '…')}<br>${esc(t('notMatched'))}`;
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
      return choiceQuestion(q, t('qLetterName'), `<div class="letter-big">${faS(it.fa)}</div>`,
        [it, ...others].map((x) => ({ html: `${trS(x.name)} <span class="opt-sub">${trS(x.sound)}</span>`, correct: x === it, item: x })),
        `${trS(it.name)} (${trS(it.sound)})`);
    },
    soundLetter(q) {
      const it = q.item;
      const others = distractors(it, 3, (x) => x.fa);
      return choiceQuestion(q, t('qSoundLetter'), `<div class="meaning big">${trS(it.name)}</div><div class="muted">${esc(t('sound'))}: ${trS(it.sound)}</div>`,
        [it, ...others].map((x) => ({ html: faS(x.fa, 'opt-letter'), correct: x === it, item: x })), faS(it.fa), 'letters-4');
    },
    formLetter(q) {
      const it = q.item;
      const which = it.joins ? pick(['initial', 'medial', 'final']) : 'final';
      const others = distractors(it, 3, (x) => x.fa);
      return choiceQuestion(q, t('qForm'), `<div class="letter-big form-shown">${faS(letterForm(it, which))}</div><div class="muted">(${esc(t(which))})</div>`,
        [it, ...others].map((x) => ({ html: faS(x.fa, 'opt-letter'), correct: x === it, item: x })), `${faS(it.fa)} ${trS(it.name)}`, 'letters-4');
    },
    exampleRead(q) {
      const it = q.item;
      const others = distractors(it, 3, (x) => x.ex.tr);
      return choiceQuestion(q, t('qExample'), faBlock(it.ex.fa),
        [it, ...others].map((x) => ({ html: trS(x.ex.tr), correct: x === it, item: x })), `${trS(it.ex.tr)} = ${esc(it.ex[lang()])}`);
    },
  };

  function finishSession() {
    const done = session;
    // Speaking is optional: if every speaking exercise was skipped, there is nothing to score.
    if (done.first === 0 && done.stage === 'speaking') {
      render(`<main class="results">${pishi('happy', 'result-cat')}
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
      ${pishi(pct >= 70 ? 'cheer' : 'happy', 'result-cat')}
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
   * Dictionary: every word, searchable in Farsi, Latin, English and Hebrew
   * ------------------------------------------------------------------ */
  const DICT_MAX = 200;
  const dict = { q: '', filter: 'all', group: '', timer: null };
  let DICT_INDEX = null;
  const normText = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-֑ͯ-ׇ]/g, '').replace(/\s+/g, ' ').trim();
  function dictIndex() {
    if (!DICT_INDEX) {
      DICT_INDEX = ALL_WORDS.map((it) => ({
        it, lesson: TOPIC_BY_ID[it.topic], fa: normFa(it.fa), tr: normTr(it.tr), en: normText(it.en), he: normText(it.he),
      }));
    }
    return DICT_INDEX;
  }
  function wordStatus(it) {
    const s = S.words[it.id];
    if (s === undefined) return 'new';
    return s >= 3 ? 'learned' : 'learning';
  }
  /** Search the dictionary. Returns {rows (ranked), counts per status, learned, total}. */
  function dictSearch(q, filter, groupId) {
    const raw = String(q || '').trim();
    const qFa = HAS_FA.test(raw) ? normFa(raw) : '';
    const qTr = /[a-z]/i.test(raw) ? normTr(raw) : '';
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
        const keys = [[qFa, e.fa], [qTr, e.tr], [qTx, e.en], [qTx, e.he]].filter(([a]) => a);
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
    const word = isReader()
      ? `${faS(it.fa, 'dict-main')} ${trS(it.tr, 'dict-sub')}`
      : `${trS(it.tr, 'dict-main')} ${faS(it.fa, 'dict-sub')}`;
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
      : `<div class="dict-empty">${pishiSays(t('dictNone'), 'sad')}</div>`;
  }
  function renderDictionary() {
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
          ${groups.map((g) => `<option value="${esc(g.id)}" ${dict.group === g.id ? 'selected' : ''}>${esc(g.icon && !HAS_FA.test(g.icon) ? g.icon + ' ' : '')}${esc(tx(g.title))}</option>`).join('')}
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
  /** Words for the speed round: every non-alphabet lesson up to the learner's level. */
  function speedPool() {
    const maxLevel = LEVELS.indexOf(S.settings.level);
    return TOPICS.filter((tp) => tp.kind !== 'alphabet' && LEVELS.indexOf(tp.level) <= maxLevel)
      .flatMap((tp) => tp.items).filter((it) => normTr(it.tr).length <= 18);
  }
  function startSpeed() {
    stopSpeed();
    let pool = speedPool();
    if (pool.length < 4) pool = ALL_WORDS.filter((it) => normTr(it.tr).length <= 18);
    if (pool.length < 4) return renderMenu();
    let score = 0; let timeLeft = 60;
    // Module-level handle: render() of any other screen calls stopSpeed(), so leaving through the
    // top bar can never leave the timer running.
    const run = { timer: null, ended: false };
    speed = run;

    function end() {
      if (run.ended) return;
      run.ended = true;
      clearInterval(run.timer);
      if (speed === run) speed = null;
      const record = score > S.speedBest;
      if (record) S.speedBest = score;
      S.xp += score * 2;
      if (score > 0) bumpStreak();
      saveState();
      render(`<main class="results">
        <div class="big-emoji">⚡</div>
        <h1>${esc(t('timesUp'))}</h1>
        ${record && score > 0 ? `<p class="lead">${esc(t('newBest'))}</p>` : ''}
        <div class="result-grid">
          <div><strong>${score}</strong><small>${esc(t('speedScore'))}</small></div>
          <div><strong>${S.speedBest}</strong><small>${esc(t('best'))}</small></div>
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
   * Start
   * ------------------------------------------------------------------ */
  if (S.settings && !STR[S.settings.uiLang]) S.settings.uiLang = 'en';
  if (S.settings) renderMenu(); else renderOnboarding();

  // Small hook used by the automated test page (tests/smoke.html).
  window.__TLAP_TEST__ = {
    TOPICS, GROUPS, QUESTIONS, buildQueue, compareTr, speechMatches, distractors, sameAnswer,
    setSettings(s) { S = freshState(); S.settings = s; },
    state: () => S,
    startStage, stagesFor, countedStages, stageProgress, stageQueue, visibleGroups, visibleLessons,
    renderTopic, renderGroup, renderLearn, renderMenu, renderSettings, renderDictionary, startReview, startSpeed,
    dictSearch, dictUpdate: updateDictionary, mixed, nextLessonAfter,
    speedRunning: () => !!speed,
    session: () => session,
    renderAt(i) { session.idx = i; renderQuestion(); },
    finish: finishSession,
  };
})();
