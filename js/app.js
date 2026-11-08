/* Talk like a Persian — app logic (no frameworks, no build step). */
(function () {
  'use strict';

  const DATA = window.TLAP_DATA;
  const STR = window.TLAP_STRINGS;
  const STORE_KEY = 'tlap-v1';
  const LEVELS = ['beginner', 'intermediate', 'advanced'];
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const ZWJ = '‍';

  /* ------------------------------------------------------------------ *
   * Data
   * ------------------------------------------------------------------ */
  const fixFa = (s) => s.replace(/ي/g, 'ی').replace(/ك/g, 'ک');

  const TOPICS = DATA.topics.map((tp) => {
    const topic = Object.assign({}, tp);
    topic.items = tp.items.map((raw, i) => {
      const id = tp.id + ':' + i;
      if (tp.kind === 'alphabet') {
        const [letter, name, sound, joins, exFa, exTr, exEn, exHe] = raw;
        return {
          id, topic: tp.id, isLetter: true, fa: fixFa(letter), tr: name, name, sound, joins,
          ex: { fa: fixFa(exFa), tr: exTr, en: exEn, he: exHe },
        };
      }
      const [fa, tr, en, he, extra] = raw;
      const item = { id, topic: tp.id, fa: fixFa(fa), tr, en, he, extra: extra || null };
      if (item.extra && item.extra.form) item.extra.form = [fixFa(item.extra.form[0]), item.extra.form[1]];
      return item;
    });
    return topic;
  });
  const TOPIC_BY_ID = {};
  const ITEM_BY_ID = {};
  TOPICS.forEach((t) => {
    TOPIC_BY_ID[t.id] = t;
    t.items.forEach((it) => (ITEM_BY_ID[it.id] = it));
  });
  const ALL_LETTERS = TOPICS.filter((t) => t.kind === 'alphabet').flatMap((t) => t.items);
  const ALL_WORDS = TOPICS.filter((t) => t.kind !== 'alphabet').flatMap((t) => t.items);

  /* ------------------------------------------------------------------ *
   * Saved state (localStorage)
   * ------------------------------------------------------------------ */
  const freshState = () => ({
    settings: null, topics: {}, words: {}, xp: 0, streak: { count: 0, last: null }, speedBest: 0,
  });

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return Object.assign(freshState(), JSON.parse(raw));
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
  function wordBlock(it, size) {
    const a = isReader() ? faS(it.fa, 'primary') : trS(it.tr, 'primary');
    const b = isReader() ? trS(it.tr, 'secondary') : faS(it.fa, 'secondary');
    return `<div class="word ${size || 'lg'}">${a}${b}</div>`;
  }
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
      const label = it.topic === 'spoken' ? t('written') : t('presentI');
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

  /** Pick n other items whose key differs from the item's (and from each other). */
  function distractors(item, n, keyFn) {
    const seen = new Set([keyFn(item)]);
    const out = [];
    const take = (pool) => {
      for (const x of shuffle(pool)) {
        if (out.length >= n) return;
        const k = keyFn(x);
        if (x.id !== item.id && !seen.has(k)) { seen.add(k); out.push(x); }
      }
    };
    take(TOPIC_BY_ID[item.topic].items);
    if (out.length < n) take(item.isLetter ? ALL_LETTERS : ALL_WORDS);
    return out;
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
  function render(html, withBar = true) {
    applyLang();
    app.innerHTML = (withBar ? topBar() : '') + html;
    $$('[data-go]', app).forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
    window.scrollTo(0, 0);
  }
  function go(where) {
    if (where === 'menu') renderMenu();
    else if (where === 'settings') renderSettings();
  }
  function confetti() {
    const colors = ['#1aa39a', '#f2a900', '#c8102e', '#2456a6', '#7b3fa0'];
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
          <div class="hero-fa">${faS('مثل یک ایرانی حرف بزن')}</div>
          <h1>Talk like a Persian</h1>
          <p class="muted">${esc(t('tagline'))}</p>
        </div>
        ${step === 0 ? `<p class="center">${esc(t('welcome'))} ${esc(t('welcomeSub'))}</p>` : ''}
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
  function visibleTopics() {
    return TOPICS.filter((tp) => tp.kind !== 'alphabet' || isReader());
  }
  function stars(n) {
    return `<span class="stars" aria-label="${n}/3">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : ''}">★</i>`).join('')}</span>`;
  }
  function topicCard(tp) {
    const rec = S.topics[tp.id] || {};
    const icon = tp.kind === 'alphabet' ? faS(tp.icon, 'icon-fa') : esc(tp.icon);
    return `<button class="topic ${rec.stars ? 'done' : ''}" data-topic="${tp.id}">
      <span class="topic-icon">${icon}</span>
      <span class="topic-body"><strong>${esc(tp.title[lang()])}</strong>
      <small>${tp.items.length} ${esc(t('items'))}</small></span>
      ${stars(rec.stars || 0)}
    </button>`;
  }
  function renderMenu() {
    if (!S.settings) return renderOnboarding();
    const mine = S.settings.level;
    const sections = [];
    if (isReader()) sections.push({ key: 'alphabet', title: '✍️ ' + t('alphabetSection'), topics: TOPICS.filter((x) => x.kind === 'alphabet'), open: mine === 'beginner' });
    LEVELS.forEach((l) => sections.push({
      key: l, title: t(l), topics: TOPICS.filter((x) => x.level === l && x.kind !== 'alphabet'), open: l === mine, mine: l === mine,
    }));
    // The learner's own level goes first (keeping the alphabet next to beginner).
    const order = (s) => (s.key === mine || (s.key === 'alphabet' && mine === 'beginner') ? (s.key === 'alphabet' ? 0 : 1) : 2 + LEVELS.indexOf(s.key === 'alphabet' ? 'beginner' : s.key));
    sections.sort((a, b) => order(a) - order(b));

    render(`<main class="menu">
      <h1 class="page-title">${esc(t('menuTitle'))}</h1>
      <div class="modes">
        <button class="mode review" id="m-review"><span class="mode-icon">🔁</span>
          <span><strong>${esc(t('review'))}</strong><small>${esc(t('reviewDesc'))}</small></span></button>
        <button class="mode speed" id="m-speed"><span class="mode-icon">⚡</span>
          <span><strong>${esc(t('speed'))}</strong><small>${esc(t('speedDesc'))}${S.speedBest ? ` · ${esc(t('best'))}: ${S.speedBest}` : ''}</small></span></button>
      </div>
      ${sections.map((s) => `<details class="section" ${s.open ? 'open' : ''}>
        <summary><span>${esc(s.title)}</span>${s.mine ? `<em class="badge">${esc(t('yourLevel'))}</em>` : ''}</summary>
        <div class="topics">${s.topics.map(topicCard).join('')}</div>
      </details>`).join('')}
    </main>`);
    $$('[data-topic]', app).forEach((b) => b.addEventListener('click', () => renderLearn(TOPIC_BY_ID[b.dataset.topic])));
    $('#m-review', app).addEventListener('click', startReview);
    $('#m-speed', app).addEventListener('click', startSpeed);
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
      front: `${wordBlock(it, 'xl')}<div class="muted">${esc(t('tapToFlip'))}</div>`,
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
          <button class="icon-btn" data-go="menu" aria-label="${esc(t('exit'))}">✕</button>
          <h1>${esc(topic.title[lang()])}</h1>
          <button class="btn small" id="go-practice">${esc(t('startPractice'))} →</button>
        </div>
        ${i === 0 && topic.intro ? `<div class="intro">💡 ${esc(topic.intro[lang()])}</div>` : ''}
        <div class="progress"><i style="width:${((i + 1) / items.length) * 100}%"></i></div>
        <div class="counter">${i + 1} / ${items.length}</div>
        <div class="card-wrap"><button class="card" id="card" aria-live="polite">
          <div class="face front">${f.front}</div><div class="face back">${f.back}</div>
        </button></div>
        <div class="row">
          <button class="btn ghost" id="prev" ${i === 0 ? 'disabled' : ''}>${esc(t('prev'))}</button>
          <button class="btn primary" id="next" data-enter>${esc(i === items.length - 1 ? t('startPractice') : t('next'))}</button>
        </div>
      </main>`);
      $('#card', app).addEventListener('click', () => $('#card', app).classList.toggle('flipped'));
      $('#prev', app).addEventListener('click', () => { if (i > 0) { i--; draw(); } });
      $('#next', app).addEventListener('click', () => {
        if (i < items.length - 1) { i++; draw(); } else startTopic(topic);
      });
      $('#go-practice', app).addEventListener('click', () => startTopic(topic));
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
  function startTopic(topic) {
    session = { mode: 'topic', topic, queue: buildQueue(topic.items), idx: 0, first: 0, firstRight: 0, xp: 0 };
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
    fb.innerHTML = `<div class="fb-text"><strong>${result ? '✓ ' : result === false ? '✗ ' : ''}${esc(title)}</strong>
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
    $('#quit', app).addEventListener('click', () => { if (confirm(t('confirmQuit'))) renderMenu(); });
    mount($('.q-body', app));
  }

  /** Multiple-choice helper. options: [{html, correct}] */
  function choiceQuestion(q, prompt, stem, options, correctHTML, extraCls = '') {
    const opts = shuffle(options);
    return {
      prompt,
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
        [it, ...others].map((x) => ({ html: esc(meaning(x)), correct: x === it })), esc(meaning(it)));
    },
    mcReverse(q) {
      const it = q.item;
      const others = distractors(it, 3, (x) => x.tr);
      return choiceQuestion(q, t('qReverse'), `<div class="meaning big">${esc(meaning(it))}</div>`,
        [it, ...others].map((x) => ({ html: wordShort(x), correct: x === it })), answerWord(it));
    },
    readScript(q) {
      const it = q.item;
      const others = distractors(it, 3, (x) => x.tr);
      return choiceQuestion(q, t('qRead'), `<div class="word xl">${faS(it.fa, 'primary')}</div>`,
        [it, ...others].map((x) => ({ html: trS(x.tr), correct: x === it })), `${trS(it.tr)} = ${esc(meaning(it))}`);
    },
    trueFalse(q) {
      const it = q.item;
      const honest = Math.random() < 0.5;
      const shown = honest ? it : distractors(it, 1, meaning)[0] || it;
      const isTrue = shown === it;
      return {
        prompt: t('qTrueFalse'),
        html: `<div class="stem">${wordBlock(it, 'lg')}<div class="equals">=</div><div class="meaning big">${esc(meaning(shown))}</div></div>
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
        : `<div class="meaning big">${esc(meaning(it))}</div>`;
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
        html: `<div class="stem"><div class="meaning big">${esc(meaning(it))}</div></div>
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
        html: `<div class="stem"><div class="meaning big">${esc(meaning(it))}</div><div class="muted">${trS(it.tr)}</div></div>
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
        [it, ...others].map((x) => ({ html: `${trS(x.name)} <span class="opt-sub">${trS(x.sound)}</span>`, correct: x === it })),
        `${trS(it.name)} (${trS(it.sound)})`);
    },
    soundLetter(q) {
      const it = q.item;
      const others = distractors(it, 3, (x) => x.fa);
      return choiceQuestion(q, t('qSoundLetter'), `<div class="meaning big">${trS(it.name)}</div><div class="muted">${esc(t('sound'))}: ${trS(it.sound)}</div>`,
        [it, ...others].map((x) => ({ html: faS(x.fa, 'opt-letter'), correct: x === it })), faS(it.fa), 'letters-4');
    },
    formLetter(q) {
      const it = q.item;
      const which = it.joins ? pick(['initial', 'medial', 'final']) : 'final';
      const others = distractors(it, 3, (x) => x.fa);
      return choiceQuestion(q, t('qForm'), `<div class="letter-big form-shown">${faS(letterForm(it, which))}</div><div class="muted">(${esc(t(which))})</div>`,
        [it, ...others].map((x) => ({ html: faS(x.fa, 'opt-letter'), correct: x === it })), `${faS(it.fa)} ${trS(it.name)}`, 'letters-4');
    },
    exampleRead(q) {
      const it = q.item;
      const others = distractors(it, 3, (x) => x.ex.tr);
      return choiceQuestion(q, t('qExample'), `<div class="word xl">${faS(it.ex.fa, 'primary')}</div>`,
        [it, ...others].map((x) => ({ html: trS(x.ex.tr), correct: x === it })), `${trS(it.ex.tr)} = ${esc(it.ex[lang()])}`);
    },
  };

  function finishSession() {
    const pct = session.first ? Math.round((session.firstRight / session.first) * 100) : 100;
    const starCount = pct >= 90 ? 3 : pct >= 70 ? 2 : 1;
    const bonus = 20 + (pct === 100 ? 10 : 0);
    const xp = session.xp + bonus;
    S.xp += xp;
    bumpStreak();
    let nextTopic = null;
    if (session.mode === 'topic') {
      const rec = S.topics[session.topic.id] || { stars: 0, best: 0 };
      rec.stars = Math.max(rec.stars, starCount);
      rec.best = Math.max(rec.best, pct);
      S.topics[session.topic.id] = rec;
      const list = visibleTopics();
      nextTopic = list[list.indexOf(session.topic) + 1] || null;
    }
    saveState();
    const msg = pct === 100 ? t('perfect') : pct >= 70 ? t('great') : t('keepGoing');
    render(`<main class="results">
      <div class="big-emoji">${pct === 100 ? '🏆' : pct >= 70 ? '🎉' : '💪'}</div>
      <h1>${esc(session.mode === 'review' ? t('reviewDone') : t('lessonDone'))}</h1>
      <p class="lead">${esc(msg)}</p>
      <div class="result-stars">${stars(starCount)}</div>
      <div class="result-grid">
        <div><strong>${pct}%</strong><small>${esc(t('score'))}</small></div>
        <div><strong>+${xp}</strong><small>${esc(t('xpEarned'))}</small></div>
        <div><strong>🔥 ${currentStreak()}</strong><small>${esc(t('streak'))}</small></div>
      </div>
      <div class="stack">
        ${nextTopic ? `<button class="btn primary" id="next-topic" data-enter>${esc(t('nextTopic'))}: ${esc(nextTopic.title[lang()])}</button>` : ''}
        <button class="btn ${nextTopic ? 'ghost' : 'primary'}" id="again" ${nextTopic ? '' : 'data-enter'}>${esc(t('again'))}</button>
        <button class="btn ghost" data-go="menu">${esc(t('menu'))}</button>
      </div>
    </main>`);
    if (starCount >= 2) confetti();
    const done = session;
    $('#again', app).addEventListener('click', () => (done.mode === 'topic' ? startTopic(done.topic) : startReview()));
    if (nextTopic) $('#next-topic', app).addEventListener('click', () => renderLearn(nextTopic));
  }

  /* ------------------------------------------------------------------ *
   * Speed round
   * ------------------------------------------------------------------ */
  function startSpeed() {
    const maxLevel = LEVELS.indexOf(S.settings.level);
    const pool = ALL_WORDS.filter((it) => LEVELS.indexOf(TOPIC_BY_ID[it.topic].level) <= maxLevel && normTr(it.tr).length <= 18);
    let score = 0; let timeLeft = 60; let timer = null; let ended = false;

    function end() {
      if (ended) return;
      ended = true;
      clearInterval(timer);
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
      if (ended) return;
      const it = pick(pool);
      const tf = Math.random() < 0.4;
      let stemHTML; let opts;
      if (tf) {
        const shown = Math.random() < 0.5 ? it : distractors(it, 1, meaning)[0];
        stemHTML = `${wordBlock(it, 'md')}<div class="equals">=</div><div class="meaning big">${esc(meaning(shown))}</div>`;
        opts = [{ html: '✓ ' + esc(t('yes')), correct: shown === it }, { html: '✗ ' + esc(t('no')), correct: shown !== it }];
      } else {
        stemHTML = wordBlock(it, 'md');
        opts = shuffle([it, ...distractors(it, 3, meaning)].map((x) => ({ html: esc(meaning(x)), correct: x === it })));
      }
      render(`<main class="practice speed-round">
        <div class="lesson-head">
          <button class="icon-btn" id="quit" aria-label="${esc(t('exit'))}">✕</button>
          <div class="timer"><i id="timebar" style="width:${(timeLeft / 60) * 100}%"></i></div>
          <span class="speed-score">✓ ${score}</span>
        </div>
        <div class="stem">${stemHTML}</div>
        <div class="options ${tf ? 'two' : ''}">${opts.map((o, i) => `<button class="opt" data-i="${i}">${o.html}</button>`).join('')}</div>
      </main>`);
      $('#quit', app).addEventListener('click', () => { ended = true; clearInterval(timer); renderMenu(); });
      $$('.opt', app).forEach((b) => b.addEventListener('click', () => {
        const ok = opts[+b.dataset.i].correct;
        b.classList.add(ok ? 'right' : 'wrong');
        $$('.opt', app).forEach((x) => (x.disabled = true));
        strengthen(it, ok);
        if (ok) score++;
        setTimeout(question, ok ? 250 : 700);
      }));
    }
    timer = setInterval(() => {
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
    TOPICS, QUESTIONS, buildQueue, compareTr, speechMatches,
    setSettings(s) { S = freshState(); S.settings = s; },
    startTopic, renderLearn, renderMenu, renderSettings, startReview,
    session: () => session,
    renderAt(i) { session.idx = i; renderQuestion(); },
    finish: finishSession,
  };
})();
