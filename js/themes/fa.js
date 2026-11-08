/*
 * Farsi theme: "Shir the lion" (شیر), a cuddly lion cub with a fluffy mane.
 * Turquoise, lapis blue, saffron gold, pomegranate red and cream; Kashan star tiles,
 * an Isfahan arch frieze, a pomegranate and a Nowruz goldfish bowl. See docs/theme-format.md.
 * (Deliberately NOT the historic "lion and sun" emblem: no sun, no sword, no flag.)
 */
(function () {
  var INK = '#7a3a12';      // warm outline
  var MANE = '#d9661f';     // outer mane
  var MANE2 = '#f08c2c';    // inner mane
  var FUR = '#f8c35a';      // face, body, paws
  var CREAM = '#fff0cf';    // muzzle, belly
  var EYE = '#2a1a12';

  // Scalloped ring of circles. First pass draws only the outline (stroke), second pass the fill,
  // so the outline follows the outer edge of the whole fluffy shape.
  function ring(cx, cy, R, r, n, offset) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + offset;
      out.push('<circle cx="' + (cx + R * Math.cos(a)).toFixed(1) + '" cy="' + (cy + R * Math.sin(a)).toFixed(1) + '" r="' + r + '"/>');
    }
    return out.join('');
  }
  var MANE_OUT = ring(60, 48, 29.5, 9, 16, 0) + '<circle cx="60" cy="48" r="31"/>';
  var MANE_IN = ring(60, 49, 22.5, 7, 16, Math.PI / 16) + '<circle cx="60" cy="49" r="24"/>';

  function lion(mood) {
    var sad = mood === 'sad', cheer = mood === 'cheer';
    var s = [];
    s.push('<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">');

    // cheer: little twinkles (not part of the bobbing body)
    if (cheer) {
      s.push('<g fill="#f5b82e" stroke="' + INK + '" stroke-width="1.2" stroke-linejoin="round">'
        + '<path d="M13 22l2.2 5.3 5.3 2.2-5.3 2.2-2.2 5.3-2.2-5.3-5.3-2.2 5.3-2.2z"/>'
        + '<path d="M107 16l1.8 4.2 4.2 1.8-4.2 1.8-1.8 4.2-1.8-4.2-4.2-1.8 4.2-1.8z"/>'
        + '<circle cx="104" cy="44" r="2.2"/><circle cx="18" cy="50" r="1.8"/></g>');
    }

    s.push('<g class="m-bob">');

    // tail with fluffy tuft (wags): up and curly (happy), straight up (cheer), drooping on the floor (sad)
    var tail = cheer ? 'M88 106C103 106 111 99 110 90' : sad ? 'M88 111C96 115 103 115 107 110' : 'M88 107C104 108 110 96 106 83';
    var tuft = cheer ? [110, 86] : sad ? [108, 106] : [106, 79];
    s.push('<g class="m-wag" style="transform-box:view-box;transform-origin:88px 107px">'
      + '<path d="' + tail + '" fill="none" stroke="' + INK + '" stroke-width="8.5" stroke-linecap="round"/>'
      + '<path d="' + tail + '" fill="none" stroke="' + FUR + '" stroke-width="5" stroke-linecap="round"/>'
      + '<g transform="translate(' + tuft[0] + ' ' + tuft[1] + ')' + (sad ? ' rotate(70)' : '') + '">'
      + '<path d="M0-8C5-8 8-3 7 1 8 5 4 9 0 8-4 9-8 5-7 1-8-3-5-8 0-8z" fill="' + MANE + '" stroke="' + INK + '" stroke-width="2"/>'
      + '<path d="M-2-3q2 3 0 6M2.5-2q1.5 2.5 0 5" stroke="' + INK + '" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".55"/>'
      + '</g></g>');

    // body, haunches, hind feet, belly
    s.push('<g fill="' + FUR + '" stroke="' + INK + '" stroke-width="2.3">'
      + '<ellipse cx="60" cy="96" rx="23" ry="19"/>'
      + '<circle cx="39" cy="103" r="11"/><circle cx="81" cy="103" r="11"/>'
      + '<ellipse cx="33" cy="113" rx="8.5" ry="5.5"/><ellipse cx="87" cy="113" rx="8.5" ry="5.5"/></g>');
    s.push('<path d="M30 111.5v3M35 111v3M85 111v3M90 111.5v3" stroke="' + INK + '" stroke-width="1.3" stroke-linecap="round" opacity=".6"/>');
    s.push('<ellipse cx="60" cy="100" rx="12" ry="12" fill="' + CREAM + '"/>');

    // front legs: down (happy), raised "hooray" (cheer), tucked close together (sad)
    var leg = function (d, w) {
      return '<path d="' + d + '" stroke="' + INK + '" stroke-width="' + (w + 4.4) + '" fill="none" stroke-linecap="round"/>'
        + '<path d="' + d + '" stroke="' + FUR + '" stroke-width="' + w + '" fill="none" stroke-linecap="round"/>';
    };
    if (cheer) {
      s.push(leg('M44 90L25 72M76 90L95 72', 8.5)
        + '<g fill="' + FUR + '" stroke="' + INK + '" stroke-width="2.2"><circle cx="22" cy="69" r="7"/><circle cx="98" cy="69" r="7"/></g>'
        + '<g fill="#f2a38a"><circle cx="22" cy="70" r="2.6"/><circle cx="98" cy="70" r="2.6"/></g>');
    } else {
      var px = sad ? [55, 65] : [52, 68];
      s.push(leg('M' + px[0] + ' 94V106M' + px[1] + ' 94V106', 9)
        + '<g fill="' + FUR + '" stroke="' + INK + '" stroke-width="2.2">'
        + '<ellipse cx="' + px[0] + '" cy="110" rx="6.6" ry="5.6"/><ellipse cx="' + px[1] + '" cy="110" rx="6.6" ry="5.6"/></g>'
        + '<path d="M' + (px[0] - 2.2) + ' 108.5v3M' + (px[0] + 2.2) + ' 108.5v3M' + (px[1] - 2.2) + ' 108.5v3M' + (px[1] + 2.2) + ' 108.5v3" stroke="' + INK + '" stroke-width="1.3" stroke-linecap="round" opacity=".6"/>');
    }

    // head group (sad: drooped a little)
    s.push('<g' + (sad ? ' transform="translate(0 3) rotate(-5 60 50)"' : '') + '>');

    // mane: outline pass, outer fill, inner fill, a few fur strokes
    s.push('<g fill="none" stroke="' + INK + '" stroke-width="4.4">' + MANE_OUT + '</g>');
    s.push('<g fill="' + MANE + '">' + MANE_OUT + '</g>');
    s.push('<g fill="' + MANE2 + '">' + MANE_IN + '</g>');
    s.push('<path d="M31 40q4 2 5 6M89 40q-4 2-5 6M30 60q4-1 7 2M90 60q-4-1-7 2M42 80q2-4 6-5M78 80q-2-4-6-5" stroke="#b44f14" stroke-width="1.6" fill="none" stroke-linecap="round"/>');

    // ears (sad: droop sideways)
    var ears = sad
      ? [[31, 30, -30], [89, 30, 30]]
      : [[37, 22, 0], [83, 22, 0]];
    ears.forEach(function (e) {
      s.push('<g transform="translate(' + e[0] + ' ' + e[1] + ') rotate(' + e[2] + ')">'
        + '<circle r="8.5" fill="' + FUR + '" stroke="' + INK + '" stroke-width="2.2"/>'
        + '<circle r="4.6" cy="0.8" fill="#f2a38a"/></g>');
    });

    // face
    s.push('<ellipse cx="60" cy="51" rx="22" ry="20.5" fill="' + FUR + '" stroke="' + INK + '" stroke-width="2"/>');
    s.push('<path d="M54 32q2-6 6-4 4-3 6 3-3-2-6 1-3-3-6 0z" fill="' + MANE + '" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>');

    // cheeks
    s.push('<circle cx="43" cy="59" r="4.2" fill="#f27b7b" opacity=".55"/><circle cx="77" cy="59" r="4.2" fill="#f27b7b" opacity=".55"/>');

    // eyes + brows
    if (cheer) {
      s.push('<path d="M45 50q5-7 10 0M65 50q5-7 10 0" stroke="' + EYE + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>');
    } else if (sad) {
      s.push('<ellipse cx="50" cy="51" rx="3.6" ry="4.2" fill="' + EYE + '"/><ellipse cx="70" cy="51" rx="3.6" ry="4.2" fill="' + EYE + '"/>'
        + '<circle cx="51" cy="52.6" r="1.3" fill="#fff"/><circle cx="71" cy="52.6" r="1.3" fill="#fff"/>'
        + '<path d="M44 44.5l9-3.5M76 44.5l-9-3.5" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>'
        + '<path d="M45.6 55.2q-3.2 4.8 0 7.4 3.2-2.6 0-7.4z" fill="#7fd3ea" stroke="#2c86a8" stroke-width="1"/>'
        + '<circle cx="44.9" cy="59.6" r=".8" fill="#fff"/>');
    } else {
      s.push('<ellipse cx="50" cy="49" rx="3.8" ry="4.6" fill="' + EYE + '"/><ellipse cx="70" cy="49" rx="3.8" ry="4.6" fill="' + EYE + '"/>'
        + '<circle cx="51.3" cy="47.3" r="1.5" fill="#fff"/><circle cx="71.3" cy="47.3" r="1.5" fill="#fff"/>'
        + '<path d="M45 41.5q5-2.5 9 0M66 41.5q4-2.5 9 0" stroke="' + INK + '" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7"/>');
    }

    // muzzle, nose, whisker dots
    s.push('<ellipse cx="54.5" cy="61" rx="6.6" ry="5" fill="' + CREAM + '"/><ellipse cx="65.5" cy="61" rx="6.6" ry="5" fill="' + CREAM + '"/>');
    s.push('<g fill="' + INK + '" opacity=".55"><circle cx="51" cy="60" r=".9"/><circle cx="53.5" cy="63" r=".9"/><circle cx="69" cy="60" r=".9"/><circle cx="66.5" cy="63" r=".9"/></g>');
    s.push('<path d="M55.5 55.5q4.5-2 9 0 0 3-4.5 5-4.5-2-4.5-5z" fill="#6b3324"/>');

    // mouth
    if (cheer) {
      s.push('<path d="M53 62.5q7 2 14 0 0 9-7 9.5-7-.5-7-9.5z" fill="#8a2433" stroke="' + EYE + '" stroke-width="1.4" stroke-linejoin="round"/>'
        + '<path d="M55.5 68.5q4.5-3.4 9 0-1.5 3-4.5 3t-4.5-3z" fill="#f27b8b"/>');
    } else if (sad) {
      s.push('<path d="M60 60.5v2.5M55.5 67q4.5-3.6 9 0" stroke="' + EYE + '" stroke-width="1.9" fill="none" stroke-linecap="round"/>');
    } else {
      s.push('<path d="M60 60.5v2M60 62.5q-2.8 3.6-6 1.4M60 62.5q2.8 3.6 6 1.4" stroke="' + EYE + '" stroke-width="1.9" fill="none" stroke-linecap="round"/>');
    }

    s.push('</g></g></svg>');
    return s.join('');
  }

  /* ---------- decorations ---------- */

  // Isfahan-style tile frieze: lapis wall, turquoise pointed arches with cream niches and gold stars.
  var STAR8 = 'M0-5.5L1.6-3.8 3.9-3.9 3.8-1.6 5.5 0 3.8 1.6 3.9 3.9 1.6 3.8 0 5.5-1.6 3.8-3.9 3.9-3.8 1.6-5.5 0-3.8-1.6-3.9-3.9-1.6-3.8z';
  var banner = '<svg viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">'
    + '<defs><g id="fa-arch">'
    + '<path d="M5 50V30C5 21 15 17 20 9 25 17 35 21 35 30V50z" fill="#1fa3b3" stroke="#f2b33d" stroke-width="1.6"/>'
    + '<path d="M10 50V32C10 26 16.5 23 20 17.5 23.5 23 30 26 30 32V50z" fill="#fbf1dc"/>'
    + '<path transform="translate(20 36)" d="' + STAR8 + '" fill="#f2b33d" stroke="#c98a12" stroke-width=".8"/>'
    + '<circle cx="20" cy="36" r="1.7" fill="#c42a3c"/>'
    + '<path d="M0 10l3 4-3 4-3-4z" fill="#f2b33d"/>'
    + '<path d="M17 50q3-5 6 0" fill="#1fa3b3"/>'
    + '<path d="M0 50a5 5 0 0 0 10 0zM10 50a5 5 0 0 0 10 0zM20 50a5 5 0 0 0 10 0zM30 50a5 5 0 0 0 10 0z" fill="#1d4596"/>'
    + '<circle cx="5" cy="52.5" r="1.3" fill="#f2b33d"/><circle cx="15" cy="52.5" r="1.3" fill="#c42a3c"/><circle cx="25" cy="52.5" r="1.3" fill="#f2b33d"/><circle cx="35" cy="52.5" r="1.3" fill="#c42a3c"/>'
    + '</g></defs>'
    + '<rect x="0" y="0" width="400" height="50" rx="6" fill="#1d4596"/>'
    + '<rect x="0" y="0" width="400" height="5" rx="2.5" fill="#f2b33d"/>'
    + '<rect x="0" y="47" width="400" height="3" fill="#f2b33d"/>';
  for (var i = 0; i < 10; i++) banner += '<use href="#fa-arch" x="' + (i * 40) + '"/>';
  banner += '<path d="M400 10l3 4-3 4-3-4z" fill="#f2b33d"/></svg>';

  // Pomegranate (anar) with leaves and a few loose ruby seeds.
  var corner = '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">'
    + '<path d="M60 30C72 20 90 18 98 24 90 34 74 36 62 33z" fill="#3f9a5a" stroke="#22663a" stroke-width="1.6"/>'
    + '<path d="M64 31q14-6 30-6" stroke="#22663a" stroke-width="1.2" fill="none"/>'
    + '<path d="M56 32C46 20 30 18 24 24 32 33 46 36 56 34z" fill="#4fae69" stroke="#22663a" stroke-width="1.6"/>'
    + '<circle cx="60" cy="70" r="36" fill="#c42a3c" stroke="#7a1422" stroke-width="2.4"/>'
    + '<path d="M30 84a36 36 0 0 0 60 6 40 40 0 0 1-60-6z" fill="#9a1b2c" opacity=".7"/>'
    + '<path d="M44 40q-12 28 0 63M76 40q12 28 0 63" stroke="#9a1b2c" stroke-width="1.6" fill="none" opacity=".45"/>'
    + '<ellipse cx="45" cy="55" rx="9" ry="13" transform="rotate(35 45 55)" fill="#ef6a78" opacity=".75"/>'
    + '<circle cx="40" cy="50" r="3" fill="#ffd0d4"/>'
    + '<path d="M47 37l2-12 5 7 6-10 6 10 5-7 2 12z" fill="#a51f30" stroke="#7a1422" stroke-width="2" stroke-linejoin="round"/>'
    + '<ellipse cx="60" cy="37" rx="13" ry="3" fill="#7a1422"/>'
    + '<g fill="#e23a50" stroke="#7a1422" stroke-width="1.2">'
    + '<path d="M14 110q4-10 8 0-4 5-8 0z"/><path d="M96 112q4-10 8 0-4 5-8 0z"/><path d="M106 101q4-10 8 0-4 5-8 0z"/></g>'
    + '<g fill="#fff" opacity=".85"><circle cx="16.5" cy="108" r="1.2"/><circle cx="98.5" cy="110" r="1.2"/><circle cx="108.5" cy="99" r="1.2"/></g>'
    + '</svg>';

  // Results: Nowruz goldfish bowl (left), sabzeh sprouts in a turquoise pot (right),
  // gold tile stars above and a little tile floor for Shir to stand on. Center kept clear for the mascot.
  var star = function (x, y, k, c) {
    return '<path transform="translate(' + x + ' ' + y + ') scale(' + k + ')" d="' + STAR8 + '" fill="' + c + '"/>';
  };
  var floor = '';
  for (var t = 0; t < 20; t++) {
    floor += '<path d="M' + (t * 10 + 5) + ' 110l5 5-5 5-5-5z" fill="' + (t % 2 ? '#1d4596' : '#1fa3b3') + '"/>';
  }
  var results = '<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">'
    + star(70, 16, 1, '#f2b33d') + star(132, 12, .8, '#1fa3b3') + star(16, 22, .7, '#c42a3c')
    + star(186, 28, .9, '#f2b33d') + star(100, 6, .55, '#c42a3c') + star(48, 40, .45, '#1fa3b3') + star(156, 44, .5, '#c42a3c')
    // goldfish bowl
    + '<circle cx="32" cy="82" r="24" fill="#bfeaf0" fill-opacity=".75" stroke="#1d7f8e" stroke-width="2.2"/>'
    + '<path d="M10.5 86a22 22 0 0 0 43 0z" fill="#5cc4d3" fill-opacity=".6"/>'
    + '<ellipse cx="32" cy="59" rx="12" ry="3.2" fill="#e8f8fa" stroke="#1d7f8e" stroke-width="2"/>'
    + '<path d="M19 74q3-6 9-8" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>'
    + '<g class="fa-fish"><g transform="translate(34 84)"><path d="M-9 0q4-6 10-5 5 1 7 5-2 4-7 5-6 1-10-5z" fill="#f07a1a" stroke="#a94a0a" stroke-width="1.2"/>'
    + '<path d="M-8 0l-6-5q-1 5 0 10z" fill="#f7a23a" stroke="#a94a0a" stroke-width="1.1" stroke-linejoin="round"/>'
    + '<circle cx="3" cy="-1" r="1.3" fill="#2a1a12"/></g></g>'
    + '<g fill="none" stroke="#1d7f8e" stroke-width="1"><circle cx="44" cy="76" r="1.8"/><circle cx="47" cy="70" r="1.2"/></g>'
    + '<ellipse cx="32" cy="106" rx="16" ry="2.6" fill="#1d4596" opacity=".25"/>'
    // sabzeh pot
    + '<g stroke="#2f8a3e" stroke-width="2.2" stroke-linecap="round" fill="none">'
    + '<path d="M156 82q-6-14-10-24M160 82q-2-16-3-28M164 82q1-16 4-30M168 82q4-14 10-24M162 82q-5-12-12-18M166 82q6-12 14-14"/></g>'
    + '<g stroke="#52b25d" stroke-width="2" stroke-linecap="round" fill="none"><path d="M158 82q-4-12-4-22M163 82q0-14-1-24M167 82q3-12 6-20"/></g>'
    + '<path d="M146 82h36l-5 24h-26z" fill="#1597a6" stroke="#0d6370" stroke-width="2" stroke-linejoin="round"/>'
    + '<path d="M147.5 88h33" stroke="#f2b33d" stroke-width="3"/>'
    + '<path d="M164 88l-7-5v10zM164 88l7-5v10z" fill="#c42a3c" stroke="#7a1422" stroke-width="1" stroke-linejoin="round"/>'
    + '<circle cx="164" cy="88" r="2.2" fill="#c42a3c" stroke="#7a1422" stroke-width="1"/>'
    + '<path d="M162 90l-3 8M166 90l3 8" stroke="#c42a3c" stroke-width="1.8" stroke-linecap="round"/>'
    + floor
    + '</svg>';

  TLAP_THEME('fa', {
    name: { en: 'Farsi', he: 'פרסית' },
    native: 'فارسی',
    flag: '🦁',
    tagline: { target: 'مثل یه محلی حرف بزن!', en: 'Talk like a local!', he: 'לדבר כמו מקומי!' },
    mascot: {
      name: { en: 'Shir the lion', he: 'שיר האריה' },
      svg: lion
    },
    lines: {
      intro: {
        en: 'Salâm (سلام, hello)! I\'m Shir the lion. In Farsi, شیر "shir" means lion, and funnily enough also milk! Berim (let\'s go)! Let\'s learn together.',
        he: 'سلام (סָלָאם), שלום! אני שיר האריה. בפרסית, شیر ("שיר") זה אריה, וגם... חלב! מצחיק, נכון? ברים (יאללה), בואו נלמד ביחד!'
      },
      greet: {
        en: [
          'Salâm! What shall we learn today?',
          'Berim! (Let\'s go!) Pick a topic.',
          'A little Farsi every day, like a cup of chây (tea)!',
          'Roar-some to see you! Ready to learn?'
        ],
        he: [
          'סלאם! מה נלמד היום?',
          'ברים! (יאללה!) בחרו נושא.',
          'כל יום קצת פרסית, כמו כוס צ\'אי (תה)!',
          'איזה כיף לראות אתכם! מוכנים ללמוד?'
        ]
      },
      group: {
        en: 'Pick a sub-topic! Each one is another tile in your mosaic.',
        he: 'בחרו תת-נושא! כל אחד הוא עוד אריח בפסיפס שלכם.'
      },
      topic: {
        en: 'Pick any exercise you like. Berim (let\'s go)!',
        he: 'בחרו איזה תרגיל שתרצו. ברים (יאללה)!'
      },
      right: {
        en: [
          'Âfarin! (Well done!)',
          'آفرین Âfarin! That\'s it!',
          'Roar-some! 🦁',
          'Kheyli khub! (Very good!)',
          'Perfect, like a Persian tile!'
        ],
        he: [
          'אָפָרִין! (כל הכבוד!)',
          'آفرین אפרין! בדיוק!',
          'שאגה של הצלחה! 🦁',
          'חֵילי חוּב! (טוב מאוד!)',
          'מושלם, כמו אריח פרסי!'
        ]
      },
      wrong: {
        en: [
          'Oops! Even lions miss sometimes.',
          'Almost! Let\'s try again.',
          'No worries: yavâsh yavâsh (little by little).',
          'So close! You\'ll get it next time.'
        ],
        he: [
          'אופס! גם אריות מפספסים לפעמים.',
          'כמעט! ננסה שוב.',
          'לא נורא: יַוָאש יַוָאש (לאט לאט).',
          'כל כך קרוב! בפעם הבאה זה יצליח.'
        ]
      },
      empty: {
        en: 'Hmm, Shir found no words. Try another search!',
        he: 'הממ, שיר לא מצא מילים. נסו חיפוש אחר!'
      }
    },
    decorations: {
      banner: banner,
      corner: corner,
      results: results,
      ambient: ''
    },
    confetti: ['#1fb5c4', '#2a5bc4', '#f5b82e', '#c42a3c', '#2e9e6e', '#e7743a']
  });
})();
