/*
 * Lesson registry. Each file js/data/<lang>/<group>.js calls TLAP_ADD("<lang>", {group, lessons}) once.
 * A "group" is a topic on the main menu (e.g. Animals); its "lessons" are the sub-topics (e.g. Birds).
 * Lessons inherit the group's level unless they set their own.
 * A file that is missing or broken is simply skipped; the app uses whatever loaded.
 *
 * Result: window.TLAP_DATA.langs[lang] = { groups: [...], topics: [...] }
 */
window.TLAP_DATA = { langs: {} };

/* Visual themes: each js/themes/<lang>.js calls TLAP_THEME("<lang>", {...}). See docs/theme-format.md. */
window.TLAP_THEMES = {};
window.TLAP_THEME = function (lang, theme) {
  if (typeof lang === 'string' && theme && typeof theme === 'object') window.TLAP_THEMES[lang] = theme;
};
window.TLAP_ADD = function (lang, pack) {
  if (typeof lang !== 'string') { pack = lang; lang = 'fa'; } // old single-language files
  if (!pack || !pack.group || !Array.isArray(pack.lessons)) return;
  var store = window.TLAP_DATA.langs[lang] || (window.TLAP_DATA.langs[lang] = { groups: [], topics: [] });
  var g = pack.group;
  g.lessons = [];
  store.groups.push(g);
  pack.lessons.forEach(function (lesson) {
    if (!lesson || !lesson.id) return;
    lesson.group = g.id;
    if (!lesson.level) lesson.level = g.level;
    g.lessons.push(lesson.id);
    store.topics.push(lesson);
  });
};
