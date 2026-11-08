/*
 * Lesson registry. Each file in js/data/ calls TLAP_ADD({group, lessons}) once.
 * A "group" is a topic on the main menu (e.g. Animals); its "lessons" are the
 * sub-topics (e.g. Birds). Lessons inherit the group's level unless they set their own.
 * A file that is missing or broken is simply skipped; the app uses whatever loaded.
 */
window.TLAP_DATA = { groups: [], topics: [] };
window.TLAP_ADD = function (pack) {
  if (!pack || !pack.group || !Array.isArray(pack.lessons)) return;
  var g = pack.group;
  g.lessons = [];
  window.TLAP_DATA.groups.push(g);
  pack.lessons.forEach(function (lesson) {
    if (!lesson || !lesson.id) return;
    lesson.group = g.id;
    if (!lesson.level) lesson.level = g.level;
    g.lessons.push(lesson.id);
    window.TLAP_DATA.topics.push(lesson);
  });
};
