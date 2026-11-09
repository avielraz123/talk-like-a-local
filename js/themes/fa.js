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

  /* ---------- the world behind the screens (docs/theme-format.md section 3) ----------
     Day: a golden haze, Persian-miniature curly clouds and swallows (deliberately no sun disc).
     Night (Shab-e Yalda): a full moon and stars, the bridge arches and town windows lit gold.
     Landscape: Mount Damavand far away, the two-tier arches of Isfahan's Si-o-se-pol bridge
     mirrored in the river (center, the part phones see), Yazd windcatchers and mud-brick roofs
     (left), a garden pavilion, a long pool and cypress rows (right). Colors come from fa.css. */

  // Sky: day set and night set; fa.css shows one of them.
  // Curly miniature cloud: pale fill, a lapis-tinted underside, then a soft outline on top.
  var CLOUD = 'M14 50c-10 0-12-12-2-15-2-11 12-17 20-10 4-12 22-15 30-5 6-9 24-8 27 4 10-4 22 2 21 12 12 0 16 14 4 14z';
  var cloud = function (c) {
    return '<svg class="fa-cloud ' + c + '" data-poke="cloud" viewBox="0 0 160 60"><g class="fa-cg">'
      + '<path class="fa-cl" d="' + CLOUD + '"/>'
      + '<path class="fa-clu" d="M5 43c3 5 6 7 9 7h100c4 0 8-2 10-6-12 2-26 0-47 0S18 45 5 43z"/>'
      + '<path class="fa-clo" d="' + CLOUD + '"/>'
      + '<path class="fa-cls" d="M34 34q-6-8 2-11 6 0 4 6M70 26q-2-9 7-9 6 2 3 8M104 33q2-7 9-5 4 4-1 7" fill="none"/>'
      + '</g></svg>';
  };
  var STAR = 'M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2z';
  var twinkle = function (c) {
    // the flare runs on the wrapper (.fa-twg) so the twinkle on the star shape never jumps; .fa-twf is its bright flash
    return '<svg class="fa-tw ' + c + '" data-poke="star" viewBox="0 0 20 20"><g class="fa-twg"><path d="' + STAR + '"/><path class="fa-twf" d="' + STAR + '"/></g></svg>';
  };
  var SWALLOW = 'M20 11C15 5 8 3 1 4c6 2 11 5 14 9l-5 6 7-4 3 .8 3-.8 7 4-5-6c3-4 8-7 14-9-7-1-14 1-19 7z';
  var perched = function (c) { return '<svg class="fa-sw ' + c + '" data-poke="swallow" viewBox="0 0 40 20"><path d="' + SWALLOW + '"/></svg>'; };
  var sky = '<div class="fa-day"><div class="fa-warm"></div><div class="fa-haze"></div>' + cloud('fa-c1') + cloud('fa-c2') + cloud('fa-c3') + cloud('fa-c4')
    + perched('fa-sw1') + perched('fa-sw2') + perched('fa-sw3') + perched('fa-sw4') + '</div>'
    + '<div class="fa-night"><div class="fa-stars"></div><div class="fa-stars fa-stars2"></div>'
    + twinkle('fa-t1') + twinkle('fa-t2') + twinkle('fa-t3') + twinkle('fa-t4') + twinkle('fa-t5')
    + '<svg class="fa-moon" data-poke="moon" viewBox="0 0 100 100"><defs><radialGradient id="fa-mh"><stop offset=".55" stop-color="#fbe4aa" stop-opacity=".22"/><stop offset="1" stop-color="#fbe4aa" stop-opacity="0"/></radialGradient></defs><circle fill="url(#fa-mh)" cx="50" cy="50" r="50"/>'
    + '<circle cx="50" cy="50" r="30" fill="#fbf0d2"/>'
    + '<g fill="#eadbb4"><circle cx="40" cy="42" r="6"/><circle cx="60" cy="58" r="8"/><circle cx="58" cy="36" r="3.5"/><circle cx="40" cy="62" r="3"/></g>'
    + '</svg></div>';

  // Scene
  var cyp = function (x, y, k, c) {
    return '<path class="' + c + '" transform="translate(' + x + ' ' + y + ') scale(' + k + ')" d="M0 0C-9-12-11-40 1-68q1 4-.5 7C10-40 9-12 0 0z"/>';
  };
  var bush = function (x, y) {
    return '<ellipse class="fa-bush" cx="' + x + '" cy="' + y + '" rx="20" ry="9"/>'
      + '<g class="fa-rose"><circle cx="' + (x - 9) + '" cy="' + (y - 3) + '" r="2.6"/><circle cx="' + (x + 3) + '" cy="' + (y - 6) + '" r="2.6"/><circle cx="' + (x + 11) + '" cy="' + (y - 1) + '" r="2.3"/></g>';
  };
  var lowA = '', upA = '';
  for (var la = 0; la < 17; la++) lowA += 'M' + (341 + la * 31) + ' 163v-11q0-9 11-15 11 6 11 15v11z';
  for (var ua = 0; ua < 33; ua++) upA += 'M' + (339 + ua * 16) + ' 133v-5q0-5 5-8 5 3 5 8v5z';
  var vents = '';
  [[65, 100, 2], [172, 86, 3], [271, 106, 2]].forEach(function (w) {
    for (var v = 0; v < w[2]; v++) vents += 'M' + (w[0] + v * 6) + ' ' + w[1] + 'h2.6v14h-2.6z';
  });
  var scene = '<svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">'
    + '<defs><clipPath id="fa-dc"><path id="fa-dm" d="M300 170C420 130 520 76 584 40q16-9 32 0C680 76 780 130 900 170z"/></clipPath>'
    + '<g id="fa-br"><path style="fill:var(--fa-bridge)" d="M318 163L332 114H868L882 163z"/>'
    + '<path style="fill:var(--fa-bridge2)" d="M332 114H868v3H332zM333 134H867v2.5H333z"/>'
    + '<path class="fa-lit" fill="url(#fa-ag)" d="' + lowA + '"/><path class="fa-lit" fill="url(#fa-ag)" d="' + upA + '"/></g>'
    + '<linearGradient id="fa-ag" x2="0" y2="1"><stop offset="0" style="stop-color:var(--fa-arch)"/><stop offset=".75" style="stop-color:var(--fa-arch-b)"/></linearGradient></defs>'
    // far: Alborz ridge and Damavand with its snow cap
    + '<path class="fa-far" d="M0 200V118C50 102 100 96 160 106S260 86 330 98 430 114 480 108L720 108C780 112 830 96 900 90S1010 100 1070 86 1160 92 1200 98V200z"/>'
    + '<g class="fa-smoon"><circle cx="716" cy="50" r="26" fill="#fbe4aa" opacity=".12"/><circle cx="716" cy="50" r="15" fill="#fbf0d2"/><circle cx="711" cy="46" r="3.2" fill="#eadbb4"/><circle cx="721" cy="55" r="4" fill="#eadbb4"/></g>'
    + '<use class="fa-dmv" href="#fa-dm"/>'
    + '<path class="fa-snow" clip-path="url(#fa-dc)" d="M500 0H700V66l-14-8-11 10-12-9-11 8-12-10-11 9-12-8-12 9-13-8-11 9-12-9L500 68z"/>'
    // foothills
    + '<path class="fa-hill" d="M0 200V146C70 130 140 136 210 128S340 140 420 140 560 150 600 150 760 140 820 138 960 126 1040 132 1150 128 1200 134V200z"/>'
    // Yazd: mud-brick houses and windcatchers
    + '<path class="fa-town2" d="M0 160V126h34v-8h40v12h64v-14h58v8h74v-4h66v40z"/>'
    + '<path class="fa-town" d="M0 200V140h48v-8h44v14h56v-18h50v12h54v-6h46v16h40V200zM62 132V98h17v34zM168 128V84h24v44zM268 134V104h15v30zM59 98h23v-4H59zM165 84h30v-4h-30zM265 104h21v-4h-21z"/>'
    + '<path class="fa-win fa-vent" d="' + vents + '"/><path class="fa-win" d="M20 160v-7q0-4 3.5-5 3.5 1 3.5 5v7zM112 166v-7q0-4 3.5-5 3.5 1 3.5 5v7zM214 158v-7q0-4 3.5-5 3.5 1 3.5 5v7zM312 168v-6q0-3 3-4 3 1 3 4v6zM158 176v-10q0-5 5-7 5 2 5 7v10z"/>'
    // garden pavilion with slender columns, cypress rows, long pool
    + cyp(1192, 160, .8, 'fa-cyp2') + cyp(1170, 160, 1, 'fa-cyp2') + cyp(916, 160, .78, 'fa-cyp2') + cyp(1146, 162, .85, 'fa-cyp2')
    + '<path class="fa-pav" d="M996 162V106h116v56z"/><path class="fa-tile" d="M996 106h116v5H996z"/>'
    + '<path class="fa-arch2" d="M1041 162v-26q0-14 13-20 13 6 13 20v26zM1010 150v-12q0-6 6-8 6 2 6 8v12zM1086 150v-12q0-6 6-8 6 2 6 8v12z"/>'
    + '<path class="fa-pav2" d="M926 96h192v8H926zM933 104h3v58h-3zM966 104h3v58h-3zM999 104h3v58h-3zM1032 104h3v58h-3zM1073 104h3v58h-3zM1106 104h3v58h-3zM924 162h196v5H924z"/>'
    + '<path class="fa-tile" d="M926 104h192v2.5H926z"/>'
    + cyp(894, 166, 1, 'fa-cyp2')
    // the river and the bridge with its reflection
    + '<path class="fa-water" d="M0 162H1200V200H0z"/>'
    + '<use href="#fa-br" class="fa-refl" transform="matrix(1 0 0 -1 0 326)"/>'
    + '<use href="#fa-br"/>'
    + '<path class="fa-wline fa-shim" d="M430 182h30M520 190h40M640 184h26M700 194h34M560 176h18M760 178h22M470 196h28"/>'
    // near banks, rose bushes, pool, cypresses
    + '<path class="fa-bank" d="M0 200V176C70 168 150 170 230 174S350 180 410 184C450 186 476 190 488 200zM1200 200V174C1130 166 1050 168 980 172S850 180 790 184C750 186 724 190 712 200z"/>'
    // a riverside picnic, as families do under Si-o-se-pol: a little kilim, a samovar and tea (left), a bowl of pomegranates (right)
    + '<path class="fa-rug" d="M412 196l8-6h44l8 6z"/><path class="fa-rug2" d="M418 194.6l4.5-3.2h39l4.5 3.2z"/>'
    + '<path class="fa-brass2" d="M435 191h12l-1.6-3h-8.8z"/><path class="fa-brass" d="M434.6 188c-1.6-6-.6-10 1.8-12h9.2c2.4 2 3.4 6 1.8 12zM437 176l1-2.6h6l1 2.6zM437.6 173.4q3.4-5 6.8 0zM447 181.5h3.4v1.6H447z"/>'
    + '<path class="fa-tile" d="M434.4 180.4h13.2v1.6h-13.2z"/>'
    + '<path class="fa-tea" d="M424 192l-.8-5h3.6l-.8 5zM456 192l-.8-5h3.6l-.8 5z"/>'
    + '<path class="fa-rug" d="M742 197l7-5h38l7 5z"/><path class="fa-tile" d="M754 190h28c0 5-6 7.5-14 7.5s-14-2.5-14-7.5z"/>'
    + '<g class="fa-pomf"><circle cx="762" cy="187.5" r="4.6"/><circle cx="773.5" cy="187.5" r="4.6"/><circle cx="768" cy="183" r="4.4"/><path d="M766.6 179.4l1.4-2.4 1.4 2.4z"/></g>'
    + '<path class="fa-water" d="M930 171h184a6 6 0 0 1 0 14H930a6 6 0 0 1 0-14z"/>'
    + '<path class="fa-pav2 fa-prefl" d="M933 172h3v12h-3zM966 172h3v12h-3zM999 172h3v12h-3zM1032 172h3v12h-3zM1073 172h3v12h-3zM1106 172h3v12h-3z"/>'
    + bush(120, 186) + bush(250, 184) + bush(1010, 196) + bush(1166, 188)
    + '<g class="fa-sway fa-s1">' + cyp(362, 190, 1.3, 'fa-cyp') + '</g>' + cyp(386, 194, 1, 'fa-cyp') + cyp(28, 186, 1.1, 'fa-cyp')
    + '<g class="fa-sway fa-s2">' + cyp(840, 192, 1.35, 'fa-cyp') + '</g>' + cyp(814, 196, .95, 'fa-cyp') + cyp(1132, 198, .9, 'fa-cyp')
    + '</svg>';

  // Objects: small things from a Persian home, near the edges.
  var fringe = '';
  for (var fr = 0; fr < 9; fr++) fringe += 'M' + (12 + fr * 5) + ' 49v5M' + (12 + fr * 5) + ' 10v-5';
  // extra: parts drawn outside the hopping group (e.g. the bolbol's song notes)
  var obj = function (c, body, extra) {
    return '<svg class="fa-obj ' + c + '" data-poke="' + c.slice(5) + '" viewBox="0 0 64 64"><g class="fa-ob">' + body + '</g>' + (extra || '') + '</svg>';
  };
  var KILIM = '<path d="' + fringe + '" stroke="#e6d3ad" stroke-width="1.6"/>'
      + '<rect x="8" y="10" width="48" height="39" rx="2" fill="#c8483c"/><rect x="11.5" y="13.5" width="41" height="32" fill="none" stroke="#2f5aa8" stroke-width="3"/>'
      + '<path d="M32 17l11 12.5L32 42 21 29.5z" fill="#f2c35a"/><path d="M32 23l5.5 6.5L32 36l-5.5-6.5z" fill="#2f5aa8"/>'
      + '<path d="M16 29.5l3-3.5 3 3.5-3 3.5zM42 29.5l3-3.5 3 3.5-3 3.5z" fill="#f6ead0"/>';
  var NOTE = 'M0 0c-2.6-.6-4.6 1-4 2.6s3 1.6 4.4.2V-9q3 1 4.6 4.4-.4-3.8-5-6.4z';
  var SEED = function (x, y, dx, dy) {
    return '<circle class="fa-psd" style="--fa-dx:' + dx + 'px;--fa-dy:' + dy + 'px" cx="' + x + '" cy="' + y + '" r="2"/>';
  };
  var GLINT = 'M0-4l1 3 3 1-3 1-1 3-1-3-3-1 3-1z';
  var objects = obj('fa-o-kilim', KILIM)
    + obj('fa-o-bolbol', '<path d="M0 51.5C18 44 34 44 60 30" stroke="#8a6a4a" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
      + '<path d="M44 38q4-9 12-8-3 8-12 8zM16 46q-2-8-10-8 2 8 10 8z" fill="#6fb07c"/>'
      + '<circle cx="56" cy="30" r="7" fill="#e0566c"/><circle cx="56" cy="30" r="4" fill="#f08a9a"/><circle cx="56" cy="30" r="1.6" fill="#c23a52"/>'
      + '<path d="M14 40l-9 5 6 1z" fill="#7a6250"/>'
      + '<path d="M13 40c0-9 7-15 16-14 6 1 9 6 8 11-2 7-12 9-24 3z" fill="#9b7d64"/>'
      + '<path d="M18 40c5 2 12 2 17-2-1 5-9 7-17 2z" fill="#e6d2b4"/>'
      + '<circle cx="31" cy="30" r="1.6" fill="#2a1a12"/><path d="M36.5 30.5l5 1.5-5 1z" fill="#d79a3a"/>'
      + '<path d="M26 44v4M30 44v4" stroke="#7a6250" stroke-width="1.4" stroke-linecap="round"/>',
      '<g class="fa-notes" fill="#2f5aa8"><g class="fa-n1"><path transform="translate(45 24)" d="' + NOTE + '"/></g><g class="fa-n2"><path transform="translate(53 15) scale(.8)" d="' + NOTE + '"/></g></g>')
    + obj('fa-o-pom', '<path d="M-28 4.5C2 4 22 7 31.5 14" stroke="#8a6a4a" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
      + '<path d="M8 5.5q3-7 10-6.5-3 7-10 6.5z" fill="#7cbc86"/>'
      + '<path d="M31 18c-5-7-13-8-17-5 4 6 10 7 16 6z" fill="#6fb37e"/>'
      + '<circle cx="32" cy="39" r="19" fill="#d23d4d"/><path d="M14 44a19 19 0 0 0 35 3 21 21 0 0 1-35-3z" fill="#ad2b3c"/>'
      + '<path d="M25 21.5l2-7 3 4 2-6 2 6 3-4 2 7z" fill="#ad2b3c"/>'
      + '<ellipse cx="24" cy="32" rx="4.5" ry="7.5" transform="rotate(30 24 32)" fill="#f48190" opacity=".75"/>'
      // tapped three times in a row it cracks open: ruby seeds pop out and gold glints sparkle
      + '<g class="fa-pcrack"><path d="M17 38l3.75-3 3.75 3 3.75-3 3.75 3 3.75-3 3.75 3 3.75-3 3.75 3v2l-3.75 3.5-3.75-2-3.75 3.5-3.75-2-3.75 3.5-3.75-2-3.75 3.5-3.75-2.5z" fill="#fbe3c6"/>'
      + '<g fill="#b8102c"><circle cx="21" cy="39.5" r="1.6"/><circle cx="25" cy="41.5" r="1.6"/><circle cx="29" cy="39" r="1.6"/><circle cx="33" cy="41.5" r="1.6"/><circle cx="37" cy="39" r="1.6"/><circle cx="41" cy="41.5" r="1.6"/><circle cx="44.5" cy="39.5" r="1.5"/><circle cx="29" cy="43.5" r="1.4"/><circle cx="36" cy="43.5" r="1.4"/></g></g>'
      + '<g fill="#e0213f">' + SEED(26, 40, -13, -16) + SEED(32, 39, 0, -21) + SEED(38, 40, 13, -15) + SEED(24, 42, -15, -2) + SEED(40, 42, 15, -3) + SEED(32, 42, 4, 12) + '</g>'
      + '<g fill="#f5c84a"><g class="fa-glint"><path transform="translate(13 26)" d="' + GLINT + '"/></g><g class="fa-glint"><path transform="translate(52 23)" d="' + GLINT + '"/></g><g class="fa-glint"><path transform="translate(53 51) scale(.8)" d="' + GLINT + '"/></g></g>')
    + obj('fa-o-crocus', '<path d="M20 60c0-14 2-24 6-30M32 60c0-12 0-22-2-28M44 60c0-12-2-20-6-26M26 60c-2-8-6-14-12-18M38 60c2-8 6-12 12-16" stroke="#6aaa6e" stroke-width="2" fill="none" stroke-linecap="round"/>'
      + '<g transform="translate(26 32)"><path d="M0 0c-8-3-10-15-7-22 2 4 4 6 7 6s5-2 7-6c3 7 1 19-7 22z" fill="#9a7fd6"/><path d="M0 0c-4-4-4-12-2-17 1 3 1 4 2 4s1-1 2-4c2 5 2 13-2 17z" fill="#bba6ea"/><path d="M0-6l-4-12M0-6l0-14M0-6l4-12" stroke="#d8302f" stroke-width="1.4" stroke-linecap="round"/></g>'
      + '<g transform="translate(42 38) scale(.8)"><path d="M0 0c-8-3-10-15-7-22 2 4 4 6 7 6s5-2 7-6c3 7 1 19-7 22z" fill="#8a6dcc"/><path d="M0-6l-4-12M0-6l0-14M0-6l4-12" stroke="#d8302f" stroke-width="1.6" stroke-linecap="round"/></g>')
    + obj('fa-o-tea', '<path d="M27 16c-3-3 3-5 0-9M36 16c-3-3 3-5 0-9" class="fa-steam" stroke="#b6c3d6" stroke-width="2" fill="none" stroke-linecap="round"/>'
      + '<ellipse cx="32" cy="56" rx="22" ry="5" fill="#fbf3e0" stroke="#d9a63a" stroke-width="2"/>'
      + '<path d="M20 21h24c0 6-5 10-5 16s5 9 5 15H20c0-6 5-9 5-15s-5-10-5-16z" fill="#f4fafd" stroke="#9cc0cc" stroke-width="1.5"/>'
      + '<path d="M22 26h20c-2 4-4.6 7-4.6 11s3.6 8.5 4.4 13H22.2c.8-4.5 4.4-9 4.4-13s-2.6-7-4.6-11z" fill="#c4621f"/>'
      + '<path d="M25 28q3 4 2 9" stroke="#f3b27a" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M20 21h24" stroke="#d9a63a" stroke-width="2"/>'
      + '<rect class="fa-sugar" x="47" y="45" width="7" height="6" rx="1" fill="#fff" stroke="#d8cdb8"/>')
    + obj('fa-o-fish', '<circle cx="32" cy="37" r="21" fill="#cdeef3" stroke="#4aa6b4" stroke-width="2"/>'
      + '<path d="M12 39a20 20 0 0 0 40 0z" fill="#7fd0dc" opacity=".7"/><ellipse cx="32" cy="17" rx="11" ry="3" fill="#eaf8fa" stroke="#4aa6b4" stroke-width="2"/>'
      + '<g class="fa-gf"><g transform="translate(33 42)"><path d="M-9 0q4-6 10-5 5 1 7 5-2 4-7 5-6 1-10-5z" fill="#f07a1a"/><path d="M-8 0l-6-5q-1 5 0 10z" fill="#f7a23a"/><circle cx="3" cy="-1" r="1.3" fill="#2a1a12"/></g></g>'
      + '<path d="M18 28q3-6 9-8" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
      + '<g fill="#f2c35a"><circle cx="24" cy="54" r="2"/><circle cx="38" cy="55" r="1.8"/></g><circle cx="31" cy="55" r="2" fill="#c8483c"/>')
    + obj('fa-o-sabzeh', '<g class="fa-grass"><g stroke="#4fa35a" stroke-width="2" stroke-linecap="round" fill="none"><path d="M18 40q-3-10-6-16M24 40q-2-14-3-24M30 40q0-16 0-28M36 40q1-14 4-24M42 40q3-10 8-18M27 40q-1-10-5-18M33 40q1-12 3-22M46 40q4-8 10-12"/></g>'
      + '<g stroke="#7cc47e" stroke-width="1.8" stroke-linecap="round" fill="none"><path d="M21 40q-2-10-2-18M39 40q2-12 1-22"/></g></g>'
      + '<path d="M11 40h42c0 11-9 17-21 17S11 51 11 40z" fill="#1fa3b3"/><path d="M12.5 46h39" stroke="#d23a4c" stroke-width="3"/>'
      + '<path d="M32 46l-6-4v8zM32 46l6-4v8z" fill="#d23a4c"/><circle cx="32" cy="46" r="2" fill="#a51f30"/>');

  // Ambient: drifting rose petals and two gliding swallows (day only).
  var PETAL = '<path d="M10 2C15 4 18 10 14 16c-2 2-6 2-8 0C2 10 5 4 10 2z" fill="#f4a3b5"/><path d="M10 5q-1 6 0 10" stroke="#e57f97" stroke-width=".9" fill="none"/>';
  var petal = function (c) {
    return '<svg class="fa-petal ' + c + '" viewBox="0 0 20 20">' + PETAL + '</svg>';
  };
  var swallow = function (c) {
    return '<svg class="fa-bird ' + c + '" viewBox="0 0 40 20"><path d="' + SWALLOW + '"/></svg>';
  };
  var ambient = petal('fa-p1') + petal('fa-p2') + petal('fa-p3') + petal('fa-p4') + petal('fa-p5') + swallow('fa-b1') + swallow('fa-b2');

  /* ---------- hidden surprises (docs section 4): taps in a row on one piece ----------
     goldfish x3: it leaps out of the bowl with a somersault and splashes back in
     kilim x3: it takes off as a flying carpet across the sky
     moon x3 (night): shooting stars, as on Shab-e Yalda
     cloud x5 (day): a shower of rose petals
     Each lives a few seconds inside #theme-layer and is removed; only one copy of each at a time. */
  var busyUntil = {};
  // setup(d) runs before the piece is added, so its animations start with every custom property already set
  function spawn(key, layer, cls, html, ms, setup) {
    var now = Date.now();
    if (!layer || !layer.appendChild || (busyUntil[key] && now < busyUntil[key])) return null;
    busyUntil[key] = now + ms + 100;
    var d = document.createElement('div');
    d.className = 'fa-sp ' + cls;
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML = html;
    if (setup) setup(d);
    layer.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, ms);
    return d;
  }
  function px(d, name, v) { d.style.setProperty(name, Math.round(v) + 'px'); }
  // hide the original piece while its double is away, then let it fade back in
  function away(el, ms) {
    el.classList.add('fa-away');
    setTimeout(function () { el.classList.remove('fa-away'); }, ms);
  }

  function fishLeap(info) {
    var r = info.el.getBoundingClientRect(), k = r.width / 64;
    if (!r.width) return;
    var drops = function (c) {
      var s = '', dirs = [[-16, -18], [-8, -26], [0, -30], [8, -26], [16, -18], [-22, -8], [22, -8]];
      dirs.forEach(function (p) { s += '<i class="fa-drop ' + c + '" style="--fa-dx:' + Math.round(p[0] * k) + 'px;--fa-dy:' + Math.round(p[1] * k) + 'px"></i>'; });
      return s;
    };
    // measured before the leap is added, so nothing forces layout while its custom properties are unset
    var L = info.layer.getBoundingClientRect();
    var side = r.left + r.width / 2 > (window.innerWidth || 1000) / 2 ? -1 : 1;   // leap toward the middle
    var d = spawn('leap', info.layer, 'fa-leap',
      '<div class="fa-lx"><div class="fa-ly"><svg class="fa-lf" viewBox="-15 -7 30 14"><path d="M-9 0q4-6 10-5 5 1 7 5-2 4-7 5-6 1-10-5z" fill="#f07a1a"/><path d="M-8 0l-6-5q-1 5 0 10z" fill="#f7a23a"/><circle cx="3" cy="-1" r="1.3" fill="#2a1a12"/></svg></div></div>'
      + '<div class="fa-splash">' + drops('fa-dr1') + drops('fa-dr2') + '</div>', 2200, function (d) {
        // anchored to the bottom and side like the bowl itself, at the water surface in the bowl's mouth
        d.style.right = Math.round(L.right - (r.left + 32 * k)) + 'px';
        d.style.bottom = Math.round(L.bottom - (r.top + 17 * k)) + 'px';
        px(d, '--fa-w', 30 * k); px(d, '--fa-h', 14 * k);
        px(d, '--fa-in', 25 * k);                           // from the mouth down to where the fish swims
        px(d, '--fa-up', -Math.min(150 * k, Math.max(60, r.top - 20)));
        px(d, '--fa-sx', side * 26 * k);
        d.style.setProperty('--fa-flip', String(side));
      });
    if (d) away(info.el, 1500);
  }

  // time (0-1) at which an animation eased with cubic-bezier(x1, y1, x2, y2) reaches progress p
  function easeTime(x1, y1, x2, y2, p) {
    var lo = 0, hi = 1, u, v;
    for (var i = 0; i < 24; i++) {
      u = (lo + hi) / 2; v = 1 - u;
      if (3 * v * v * u * y1 + 3 * v * u * u * y2 + u * u * u < p) lo = u; else hi = u;
    }
    u = (lo + hi) / 2; v = 1 - u;
    return 3 * v * v * u * x1 + 3 * v * u * u * x2 + u * u * u;
  }

  function flyingCarpet(info) {
    var r = info.el.getBoundingClientRect();
    if (!r.width) return;
    var W = window.innerWidth || 1000, H = window.innerHeight || 800;
    var w = r.width * 1.5, toRight = r.left + r.width / 2 < W / 2;
    var x0 = r.left + r.width / 2 - w / 2, tx = toRight ? W - r.left + w : -(r.right + w);
    // it sails at the height of the page titles: while it is over the content column (max 760px wide)
    // it turns faint so the titles stay readable (fa-dim on .fa-fd, timed to the fa-cx easing)
    var colL = Math.max(0, (W - 760) / 2), colR = W - colL, pad = w * .3;
    var e1 = toRight ? (colL - pad - x0 - w) / tx : (colR + pad - x0) / tx;
    var e2 = toRight ? (colR + pad - x0) / tx : (colL - pad - x0 - w) / tx;
    var FLY = 3.8, dim = 'animation:none';
    e1 = Math.max(0, Math.min(1, e1)); e2 = Math.max(0, Math.min(1, e2));
    if (e2 > e1) {
      var t1 = easeTime(.45, 0, .7, 1, e1) * FLY, t2 = easeTime(.45, 0, .7, 1, e2) * FLY;
      dim = 'animation-delay:' + t1.toFixed(2) + 's;animation-duration:' + Math.max(.3, t2 - t1).toFixed(2) + 's';
    }
    var d = spawn('carpet', info.layer, 'fa-carpet',
      '<div class="fa-fx"><div class="fa-fy"><div class="fa-fd" style="' + dim + '"><div class="fa-fc"><svg viewBox="0 0 64 64">' + KILIM + '</svg></div></div></div></div>', 4200,
      function (d) {
        d.style.left = Math.round(x0) + 'px';
        d.style.top = Math.round(r.top + r.height / 2 - w / 2) + 'px';
        px(d, '--fa-w', w);
        px(d, '--fa-tx', tx);
        px(d, '--fa-ty', Math.min(-40, H * .07 - r.top));
      });
    if (d) away(info.el, 4000);
  }

  function shootingStars(info) {
    var W = window.innerWidth || 1000, H = window.innerHeight || 800;
    var r = info.el.getBoundingClientRect();
    var fromRight = r.left + r.width / 2 > W / 2;
    // they streak through the open sky beside the content column: two on the moon's side, one far side
    var g = Math.max(140, (W - 760) / 2);
    var paths = [[W - g * .1, .14, -g * .75, .15], [W - g * .25, .33, -g * .65, .13], [g * .95, .1, -g * .7, .12]], html = '';
    paths.forEach(function (p, i) {
      var x = fromRight ? p[0] : W - p[0], y = p[1] * H;
      var dx = (fromRight ? 1 : -1) * p[2], dy = H * p[3];
      var a = Math.atan2(dy, dx) * 180 / Math.PI, len = Math.sqrt(dx * dx + dy * dy);
      html += '<i class="fa-shoot fa-sh' + (i + 1) + '" style="left:' + Math.round(x - 120) + 'px;top:' + Math.round(y) + 'px;--fa-a:' + a.toFixed(1) + 'deg;--fa-d:' + Math.round(len) + 'px"></i>';
    });
    spawn('shoot', info.layer, 'fa-shower-st', html, 2500);
  }

  function petalShower(info) {
    var r = info.el.getBoundingClientRect();
    if (!r.width) return;
    // the left cloud has invisible hit padding on its right: rain only under the drawing
    var pad = parseFloat(getComputedStyle(info.el).paddingRight) || 0;
    r = { left: r.left, top: r.top, height: r.height, width: r.width - pad, right: r.right - pad };
    var spots = [[8, -30, 260, 0], [22, 24, -200, .25], [36, -14, 300, .1], [50, 30, -260, .4], [64, -26, 220, .15], [78, 18, -300, .35],
      [92, -20, 240, .05], [15, 34, -240, .55], [43, -36, 200, .6], [70, 26, -220, .7], [57, -10, 280, .5], [29, 12, -180, .8]];
    var html = '';
    spots.forEach(function (p) {
      html += '<svg class="fa-rp" viewBox="0 0 20 20" style="left:' + p[0] + '%;--fa-dx:' + p[1] + 'px;--fa-r:' + p[2] + 'deg;animation-delay:' + p[3] + 's">' + PETAL + '</svg>';
    });
    spawn('petals', info.layer, 'fa-rain', html, 3600, function (d) {
      d.style.left = Math.max(0, Math.round(r.left)) + 'px';
      d.style.top = Math.round(r.top + r.height * .75) + 'px';
      px(d, '--fa-w', Math.min(r.width, r.right));
      px(d, '--fa-fall', Math.max(160, (window.innerHeight || 800) * .5));
    });
  }

  function onPoke(name, info) {
    if (!info || !info.el) return;
    var n = info.taps || 0;
    // the pomegranate cracks open on every 3rd tap in a row (the CSS keys the crack on .fa-crk)
    if (name === 'pom' && info.el.classList) info.el.classList.toggle('fa-crk', n > 0 && n % 3 === 0);
    if (info.reduced) return;   // reduced motion: the CSS dim only, no moving surprises
    if (name === 'fish' && n % 3 === 0) fishLeap(info);
    else if (name === 'kilim' && n % 3 === 0) flyingCarpet(info);
    else if (name === 'moon' && n % 3 === 0 && info.dark) shootingStars(info);
    else if (name === 'cloud' && n % 5 === 0 && !info.dark) petalShower(info);
  }

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
      corner: '',
      results: results,
      ambient: ambient,
      sky: sky,
      scene: scene,
      objects: objects
    },
    confetti: ['#1fb5c4', '#2a5bc4', '#f5b82e', '#c42a3c', '#2e9e6e', '#e7743a'],
    onPoke: function (name, info) {
      try { onPoke(name, info); } catch (e) { /* a surprise must never break the app */ }
    }
  });
})();
