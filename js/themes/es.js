// Spanish theme: Lupe the llama, papel picado, cacti, maracas and Andean textile stripes. See docs/theme-format.md.
(function () {
  var INK = '#5b3a2e';      // soft brown outline
  var WOOL = '#fbeedd';     // cream wool
  var MUZZLE = '#fff9f1';

  // Blanket geometry: bands follow the shoulder curve y = 95 - 22 t (1 - t) + offset, for x from 31 to 89.
  function cy(x, off) { var t = (x - 31) / 58; return 95 - 22 * t * (1 - t) + off; }
  function r1(n) { return Math.round(n * 10) / 10; }
  function band(a, b, fill) {
    return '<path d="M31 ' + r1(cy(31, a)) + 'Q60 ' + (84 + a) + ' 89 ' + r1(cy(89, a)) +
      'L89 ' + r1(cy(89, b)) + 'Q60 ' + (84 + b) + ' 31 ' + r1(cy(31, b)) + 'Z" fill="' + fill + '"/>';
  }
  var zig = '', fringe = '';
  for (var i = 0; i <= 12; i++) {
    var x = 31 + i * 58 / 12;
    zig += (i ? 'L' : 'M') + r1(x) + ' ' + r1(cy(x, 6.8) + (i % 2 ? 2 : -2));
  }
  var fc = ['#ec2f8f', '#ffc928', '#0f9e98'];
  for (var j = 0; j < 12; j++) {
    var fx = 33.5 + j * 53 / 11;
    fringe += '<path d="M' + r1(fx) + ' ' + r1(cy(fx, 14.5)) + 'v3.4" stroke="' + fc[j % 3] + '"/>';
  }
  var BLANKET =
    '<path d="M31 95Q60 84 89 95L89 109.5Q60 98.5 31 109.5Z" fill="#f57a10" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
    band(0, 3.2, '#ec2f8f') +
    '<path d="' + zig + '" fill="none" stroke="#ffc928" stroke-width="2.2" stroke-linejoin="round"/>' +
    band(10, 12, '#0f9e98') + band(12, 13.3, '#17844a') +
    '<path d="M31 95Q60 84 89 95L89 109.5Q60 98.5 31 109.5Z" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<g stroke-width="2" stroke-linecap="round">' + fringe + '</g>';

  // One ear with its yarn tassel. side = -1 (left) or 1 (right); tilt = mood rotation in degrees.
  // The right ear is the left one mirrored; its m-wag group sits inside the mirror, so both ears wag outward together.
  function ear(side, tilt, c1, c2) {
    var m = side < 0 ? '' : ' transform="translate(120 0) scale(-1 1)"';
    var bx = side < 0 ? 44 : 76;
    return '<g transform="rotate(' + (tilt * side) + ' ' + bx + ' 35)">' +
      '<g' + m + '>' +
      '<g class="m-wag" style="transform-box:view-box;transform-origin:44px 35px">' +
      '<path d="M40 37C32.5 25 32.5 12 38.5 5.5C46 11.5 50 24 48.5 35Z" fill="' + WOOL + '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M41.6 31.5C37.5 24 37.2 16 39.2 11C43 15.5 45.4 23 45.3 31Z" fill="#f6a5b6"/>' +
      '<path d="M36 15.5Q31 18 30.5 22.5" fill="none" stroke="' + INK + '" stroke-width="1.4" stroke-linecap="round"/>' +
      '<circle cx="35.8" cy="15.4" r="2" fill="#ffc928" stroke="' + INK + '" stroke-width="1"/>' +
      '<circle cx="30" cy="26.5" r="4.6" fill="' + c1 + '" stroke="' + INK + '" stroke-width="1.4"/>' +
      '<circle cx="28.6" cy="25" r="1.5" fill="#fff" opacity=".55"/>' +
      '<path d="M30 31.1v2.8" stroke="' + INK + '" stroke-width="1.2" stroke-linecap="round"/>' +
      '<circle cx="30" cy="36.4" r="3" fill="' + c2 + '" stroke="' + INK + '" stroke-width="1.2"/>' +
      '</g></g></g>';
  }

  // Woolly fringe on top of the head: outlined bumps, then the same bumps unoutlined to merge them.
  var TUFT_C = [[49, 29, 6.5], [60, 25.5, 7.5], [71, 29, 6.5], [54.5, 32, 6], [65.5, 32, 6]];
  function tuft(stroke) {
    var s = '';
    TUFT_C.forEach(function (c) {
      s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="' + WOOL + '"' +
        (stroke ? ' stroke="' + INK + '" stroke-width="2.2"' : '') + '/>';
    });
    return s;
  }

  function svg(mood) {
    var cheer = mood === 'cheer', sad = mood === 'sad';
    var tilt = cheer ? 14 : sad ? 46 : 0;   // outward ear tilt
    var eyes, brows = '', mouth, extra = '', blush = cheer ? '.9' : '.6';
    if (cheer) {
      eyes = '<path d="M46 51q5-7 10 0M64 51q5-7 10 0" stroke="#2b1d1a" stroke-width="2.8" fill="none" stroke-linecap="round"/>';
      mouth = '<path d="M60 61.2v1.6" stroke="#2b1d1a" stroke-width="1.8" stroke-linecap="round"/>' +
        '<path d="M53 62.8Q60 75 67 62.8Z" fill="#9b2d3f" stroke="#2b1d1a" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M56 67.6Q60 64.8 64 67.6Q60 71.4 56 67.6Z" fill="#ff7b9c"/>';
      extra =
        '<g fill="#ffc928" stroke="#e0a100" stroke-width=".8" stroke-linejoin="round">' +
        '<path d="M15 50l1.8 4 4 1.8-4 1.8-1.8 4-1.8-4-4-1.8 4-1.8z"/>' +
        '<path d="M104 44l1.5 3.3 3.3 1.5-3.3 1.5-1.5 3.3-1.5-3.3-3.3-1.5 3.3-1.5z"/></g>' +
        '<path d="M99 64l7-2M100 71l6 2M21 66l-6 2" stroke="#ec2f8f" stroke-width="2.2" stroke-linecap="round"/>';
    } else if (sad) {
      eyes = '<ellipse cx="51" cy="51" rx="3.6" ry="4.2" fill="#2b1d1a"/><ellipse cx="69" cy="51" rx="3.6" ry="4.2" fill="#2b1d1a"/>' +
        '<circle cx="52.2" cy="52.4" r="1.2" fill="#fff"/><circle cx="70.2" cy="52.4" r="1.2" fill="#fff"/>';
      brows = '<path d="M45.5 44.5L54.5 41.5M74.5 44.5L65.5 41.5" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>';
      mouth = '<path d="M60 61.2v2.6" stroke="#2b1d1a" stroke-width="1.8" stroke-linecap="round"/>' +
        '<path d="M54.5 68.4Q60 63.6 65.5 68.4" stroke="#2b1d1a" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
      extra = '<path d="M44.5 56.5Q41 62 44.5 64Q48 62 44.5 56.5Z" fill="#5ec8f0" stroke="#2c8fbf" stroke-width="1"/>';
    } else {
      eyes = '<ellipse cx="51" cy="49.5" rx="4.2" ry="5.3" fill="#2b1d1a"/><ellipse cx="69" cy="49.5" rx="4.2" ry="5.3" fill="#2b1d1a"/>' +
        '<circle cx="52.6" cy="47.5" r="1.7" fill="#fff"/><circle cx="70.6" cy="47.5" r="1.7" fill="#fff"/>' +
        '<circle cx="50" cy="52" r=".8" fill="#fff"/><circle cx="68" cy="52" r=".8" fill="#fff"/>';
      mouth = '<path d="M60 61.2v2.4M54.6 63.4q2.7 3.2 5.4 0q2.7 3.2 5.4 0" stroke="#2b1d1a" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    // eyelashes (llamas have lovely lashes); lower on the sad face
    var ly = sad ? 2 : 0;
    var lashes = '<path d="M47 ' + (46 + ly) + 'l-3-2M46.6 ' + (49.2 + ly) + 'l-3.4-.6M73 ' + (46 + ly) + 'l3-2M73.4 ' + (49.2 + ly) + 'l3.4-.6" stroke="#2b1d1a" stroke-width="1.5" stroke-linecap="round"/>';

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
      '<ellipse cx="60" cy="117.5" rx="28" ry="2.8" fill="#2b1d1a" opacity=".14"/>' +
      '<g class="m-bob">' +
      // legs and body
      '<g fill="' + WOOL + '" stroke="' + INK + '" stroke-width="2.2">' +
      '<rect x="42.5" y="98" width="11" height="19" rx="4.5"/><rect x="66.5" y="98" width="11" height="19" rx="4.5"/></g>' +
      '<path d="M42.5 112.6h11v1.4a3.4 3.4 0 0 1-3.4 3h-4.2a3.4 3.4 0 0 1-3.4-3zM66.5 112.6h11v1.4a3.4 3.4 0 0 1-3.4 3h-4.2a3.4 3.4 0 0 1-3.4-3z" fill="#9a6a52"/>' +
      '<path d="M48 113v3.6M72 113v3.6" stroke="' + INK + '" stroke-width="1.2"/>' +
      '<path d="M33 107C31 94 40 86 60 86C80 86 89 94 87 107Q60 112 33 107Z" fill="' + WOOL + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      // neck
      '<path d="M48 66V94H72V66" fill="' + WOOL + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<path d="M52 80q2 2 4 0M63 86q2 2 4 0" stroke="#e3cbb0" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      BLANKET +
      // ears (behind the head)
      ear(-1, tilt, '#ec2f8f', '#0f9e98') + ear(1, tilt, '#f57a10', '#9b4dca') +
      // head
      tuft(true) +
      '<ellipse cx="60" cy="50" rx="23" ry="24.5" fill="' + WOOL + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      tuft(false) +
      '<path d="M53 27q3-3 6 0M62 25q3-3 6 0" stroke="#e3cbb0" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="60" cy="63.5" rx="14.5" ry="11.5" fill="' + MUZZLE + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<ellipse cx="44" cy="59.5" rx="4.6" ry="2.8" fill="#ff8fa8" opacity="' + blush + '"/>' +
      '<ellipse cx="76" cy="59.5" rx="4.6" ry="2.8" fill="#ff8fa8" opacity="' + blush + '"/>' +
      '<ellipse cx="56.4" cy="58.6" rx="1.3" ry="1.8" transform="rotate(-30 56.4 58.6)" fill="#2b1d1a"/><ellipse cx="63.6" cy="58.6" rx="1.3" ry="1.8" transform="rotate(30 63.6 58.6)" fill="#2b1d1a"/>' +
      eyes + lashes + brows + mouth +
      '</g>' + extra +
      '</svg>';
  }

  /* ---------- The world: an Andean valley with a pastel hillside town ----------
     Day: snowy peaks, green terraces, llamas, cacti, sun and clouds. Night: the same valley,
     lit windows, string lights, moon and stars. Colors live in css/themes/es.css (es-* classes). */
  function pt(p) { return r1(p[0]) + ' ' + r1(p[1]); }
  function line(pts) { return 'M' + pts.map(pt).join('L'); }
  function smooth(pts) {   // soft curve through the points (midpoint quadratics)
    var d = 'M' + pt(pts[0]);
    for (var i = 1; i < pts.length - 1; i++) d += 'Q' + pt(pts[i]) + ' ' + pt([(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]);
    return d + 'L' + pt(pts[pts.length - 1]);
  }
  function q2(p, dy) {     // two joined quadratics, shifted down by dy (terraces follow the hill)
    function s(a) { return a[0] + ' ' + (a[1] + dy); }
    return 'M' + s(p[0]) + 'Q' + s(p[1]) + ' ' + s(p[2]) + 'Q' + s(p[3]) + ' ' + s(p[4]);
  }
  function use(id, x, y, cls, k) {
    return '<use href="#' + id + '"' + (cls ? ' class="' + cls + '"' : '') +
      (k ? ' transform="translate(' + x + ' ' + y + ') scale(' + k + ')"' : ' x="' + x + '" y="' + y + '"') + '/>';
  }

  var FAR = [[0, 118], [70, 90], [120, 100], [180, 58], [230, 84], [275, 72], [335, 44], [390, 76], [440, 66], [505, 90], [560, 56], [604, 30], [652, 58], [700, 46], [760, 84], [820, 70], [875, 44], [935, 80], [990, 62], [1050, 36], [1110, 72], [1160, 56], [1200, 70]];
  var SNOW = '';
  [3, 6, 11, 13, 16, 19].forEach(function (k) {
    var p = FAR[k], l = FAR[k - 1], r = FAR[k + 1], d = k === 11 ? 19 : 13;
    var a = [p[0] + (l[0] - p[0]) * d / (l[1] - p[1]), p[1] + d], b = [p[0] + (r[0] - p[0]) * d / (r[1] - p[1]), p[1] + d];
    var zz = [a];
    for (var s = 1; s < 4; s++) zz.push([a[0] + (b[0] - a[0]) * s / 4, p[1] + d + (s % 2 ? -4 : 1)]);
    SNOW += 'M' + [p].concat(zz, [b]).map(function (q) { return Math.round(q[0]) + ' ' + Math.round(q[1]); }).join('L') + 'Z';
  });
  var MID = [[0, 150], [60, 118], [150, 134], [240, 104], [330, 132], [420, 112], [500, 136], [560, 120], [640, 122], [720, 138], [800, 112], [880, 132], [960, 100], [1050, 126], [1130, 108], [1200, 124]];
  var HL = [[0, 146], [130, 104], [260, 112], [380, 120], [480, 168]], HR = [[720, 168], [840, 112], [980, 108], [1100, 106], [1200, 132]];
  var TER = '';
  for (var t = 11; t < 55; t += 13) TER += q2(HL, t) + q2(HR, t);

  // Houses: each group is drawn as one set of paths, so rows that overlap go in separate groups (top row first).
  // Row = [baseline y, first x, houses, spacing, color/height seed]. Windows and doors are dashed lines.
  function town(groups) {
    var out = '';
    groups.forEach(function (G) {
      var body = ['', '', '', '', ''], roof = '', trim = '', dim = '', win = '', door = '', S = G[0][3], w = S - 2;
      G.forEach(function (R) {
        var ri = R[4], x0 = R[1], end = x0 + S * R[2];
        for (var i = 0; i < R[2]; i++) {
          var x = x0 + i * S, h = 15 + ((i * 7 + ri * 3) % 4) * 2, y = R[0] - h;
          body[(i * 2 + ri) % 5] += 'M' + Math.round(x + w / 2) + ' ' + y + 'V' + (R[0] + 6);   // a wall = one thick stroke
          if ((i + ri) % 3 === 0) trim += 'M' + (x - 1) + ' ' + (y - 1) + 'h' + (w + 2);   // flat roof trim = a 4px stroke
          else roof += 'M' + (x - 2) + ' ' + y + 'l' + (w / 2 + 2) + '-6 ' + (w / 2 + 2) + ' 6z';
          if ((i * 5 + ri) % 4 === 1) dim += 'M' + (x + 5) + ' ' + (R[0] - 11) + 'v5';
        }
        win += 'M' + (x0 + 3) + ' ' + (R[0] - 9) + 'H' + end;
        if (ri > 1) door += 'M' + (x0 + w / 2 - 2) + ' ' + (R[0] - 3) + 'H' + end;
      });
      out += '<g stroke-width="' + w + '">';
      body.forEach(function (d, c) { if (d) out += '<path class="es-c' + c + '" d="' + d + '"/>'; });
      out += '</g>';
      out += '<path class="es-rf" d="' + roof + '"/><path class="es-tm" d="' + trim + '"/>' +
        '<path class="es-wn" d="' + win + '" stroke-dasharray="4 ' + (S - 16) + ' 4 8"/>' +
        '<path class="es-wd" d="' + dim + '"/>' +
        (door ? '<path class="es-dr" d="' + door + '" stroke-dasharray="4 ' + (S - 4) + '"/>' : '');
    });
    return out;
  }

  // Strings of festival bulbs (dots = zero-length round-capped lines). Span = [ax, ay, bx, by, sag, bulbs].
  function lights(spans) {
    var wire = '', bulbs = ['', '', '', ''], k = 0;
    spans.forEach(function (s) {
      var m = (s[0] + s[2]) / 2, cy = (s[1] + s[3]) / 2 + s[4], n = s[5] + 1;
      wire += 'M' + s[0] + ' ' + s[1] + 'Q' + m + ' ' + cy + ' ' + s[2] + ' ' + s[3];
      for (var i = 1; i < n; i++) {
        var u = i / n, v = 1 - u;
        bulbs[k++ % 4] += 'M' + Math.round(v * v * s[0] + 2 * u * v * m + u * u * s[2]) + ' ' + Math.round(v * v * s[1] + 2 * u * v * cy + u * u * s[3] + 2.4) + 'h0';
      }
    });
    return '<path class="es-wire" d="' + wire + '"/><g class="es-bulbs">' +
      bulbs.map(function (d, c) { return '<path class="es-b' + c + '" d="' + d + '"/>'; }).join('') + '</g>';
  }

  var FG = [[0, 180], [100, 168], [220, 176], [330, 184], [420, 176], [520, 170], [600, 178], [700, 184], [800, 176], [900, 166], [1000, 176], [1100, 184], [1200, 172]];
  var MG = ['', ''];
  [[205, 177], [352, 184], [500, 174], [612, 180], [688, 185], [856, 170], [962, 175], [1122, 182], [44, 181]].forEach(function (m, i) {
    MG[i % 2] += 'M' + m[0] + ' ' + m[1] + 'h0'; MG[(i + 1) % 2] += 'M' + (m[0] + 5) + ' ' + (m[1] + 2) + 'h0';
  });
  var MARI = '<g class="es-mg"><path class="es-mg0" d="' + MG[0] + '"/><path class="es-mg1" d="' + MG[1] + '"/></g>';

  var SCENE = '<svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice"><defs>' +
    '<path id="es-hp" d="' + q2(HL, 0) + 'V200H0Z' + q2(HR, 0) + 'V200H720Z"/><clipPath id="es-hc"><use href="#es-hp"/></clipPath>' +
    '<g id="es-ll"><ellipse cx="7" cy="-10" rx="8" ry="4.6"/><path d="M10.5-10V-21.5h4.6V-10zM12.2-22.5l.6-3.6 1.4 3.2zM14.6-22.5l.9-3.6 1.1 3.4zM-1.2-11.5a1.8 2.2 0 1 0 2 0z"/><path d="M2-8v8M5.5-8v8M10-8v8M13.3-8v8" stroke-width="2.2"/><ellipse cx="15.4" cy="-21" rx="3.8" ry="2.3"/></g>' +
    '<g id="es-sg"><path d="M0 0V-34M0-12H-6q-3 0-3-3v-8M0-18H5q3 0 3-3v-6" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle fill="currentColor" cy="-38.5" r="2.6"/></g>' +
    '<g id="es-np"><ellipse cy="-9" rx="6.5" ry="9.5"/><ellipse cx="-7" cy="-22" rx="5" ry="7.5" transform="rotate(-25 -7 -22)"/><ellipse cx="6" cy="-24" rx="5" ry="7.5" transform="rotate(20 6 -24)"/><g fill="currentColor"><ellipse cx="-10" cy="-30" rx="1.8" ry="2.4"/><ellipse cx="8" cy="-32" rx="1.8" ry="2.4"/><ellipse cx="3" cy="-31" rx="1.8" ry="2.4"/></g></g>' +
    '<g id="es-ag"><path d="M0 0Q-5-9-16-14Q-7-6-3 0ZM0 0Q-4-14-9-25Q-1-12 1 0ZM0 0Q3-15 9-26Q4-11 3 0ZM0 0Q7-9 17-13Q7-4 3 0ZM-1 0Q0-16 0-28Q2-15 2 0Z"/></g>' +
    '<g id="es-pm"><path d="M0 0Q5-26-1-52" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/><path d="M-1-52Q-18-66-31-45Q-15-56-1-52ZM-1-52Q-11-74-25-69Q-13-63-1-52ZM-1-52Q16-66 29-44Q13-55-1-52ZM-1-52Q10-74 23-70Q11-63-1-52ZM-1-52Q-7-68 0-78Q3-64-1-52Z"/><circle fill="currentColor" cx="-3" cy="-49" r="2.2"/><circle fill="currentColor" cx="1.5" cy="-48.5" r="2.2"/></g>' +
    '</defs>' +
    '<path class="es-m1" d="' + line(FAR) + 'L1200 200L0 200Z"/><path class="es-sn" d="' + SNOW + '"/>' +
    '<path class="es-m2" d="' + smooth(MID) + 'L1200 200L0 200Z"/>' +
    '<use href="#es-hp" class="es-hl"/>' +
    '<g clip-path="url(#es-hc)" fill="none"><g class="es-tr"><path id="es-tp" d="' + TER + '"/></g><use href="#es-tp" class="es-ri" y="3"/></g>' +
    // little casitas on the side hills (seen on desktop beside the content), strung with lights from the palms
    town([[[166, 150, 5, 22, 2], [172, 996, 5, 22, 4]]]) + lights([[136, 121, 226, 139, 6, 6], [1014, 122, 1104, 150, 6, 5]]) +
    '<path class="es-th" d="M380 200V182Q460 128 560 104Q604 94 648 104Q748 128 820 182V200Z"/><g class="es-mt">' +
    town([[[110, 563, 4, 22, 0]], [[127, 517, 8, 22, 1]], [[146, 471, 11, 24, 2]], [[166, 436, 12, 25, 3]]]) +
    lights([[446, 139, 604, 139, 24, 8], [604, 139, 762, 139, 24, 8]]) + '</g>' +
    '<g class="es-lm">' + use('es-ll', 228, 113) + use('es-ll', 250, 112) + use('es-ll', 270, 114, '', '.65') + use('es-ll', 930, 109, '', '-1 1') + use('es-ll', 952, 108, '', '-.65 .65') +
    use('es-ll', 740, 142) + use('es-ll', 765, 150, '', '.62') + '</g>' +
    '<path class="es-fg" d="' + smooth(FG) + 'L1200 200L0 200Z"/>' +
    use('es-pm', 132, 172, 'es-p') + use('es-pm', 1012, 174, 'es-p', '-1 1') +
    '<g class="es-cac">' + use('es-sg', 300, 182) + use('es-sg', 784, 180) + use('es-sg', 906, 170, '', 1.1) + '</g>' +
    '<g class="es-npl">' + use('es-np', 424, 179, '', 1.1) + use('es-np', 104, 173) + use('es-np', 1128, 181) + '</g>' +
    '<g class="es-agv">' + use('es-ag', 470, 175) + use('es-ag', 724, 184, '', .9) + use('es-ag', 182, 177) + use('es-ag', 1062, 181) + '</g>' +
    MARI + '</svg>';

  // Sky: a friendly folk-art sun and puffy clouds by day; a sleepy moon and twinkling stars by night.
  var RAYS = '';
  for (var a = 0; a < 12; a++) {
    var an = a * Math.PI / 6, r0 = 41, rr = a % 2 ? 49 : 55;
    RAYS += 'M' + r1(60 + r0 * Math.cos(an)) + ' ' + r1(60 + r0 * Math.sin(an)) + 'L' + r1(60 + rr * Math.cos(an)) + ' ' + r1(60 + rr * Math.sin(an));
  }
  var SUN = '<svg class="es-sun" data-poke="sun" viewBox="0 0 120 120"><g class="es-pk"><circle cx="60" cy="60" r="58" fill="#fff4c7" opacity=".55"/>' +
    '<g class="es-rw"><path class="es-rays" d="' + RAYS + '" stroke="#ffc94f" stroke-width="5.5" stroke-linecap="round"/></g>' +
    '<circle cx="60" cy="60" r="34" fill="#ffd55c"/><circle cx="60" cy="60" r="28" fill="#ffdf78"/>' +
    '<path d="M46 57q4-4.5 8 0M66 57q4-4.5 8 0M52 66q8 7 16 0" stroke="#e0892e" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
    '<path class="es-grin" d="M50.5 64.5Q60 66.5 69.5 64.5Q68 76 60 76Q52 76 50.5 64.5Z" fill="#e0892e" stroke="#e0892e" stroke-width="1.6" stroke-linejoin="round" opacity="0"/>' +
    '<ellipse class="es-chk" cx="44" cy="65" rx="4.5" ry="3" fill="#ff9a7a" opacity=".55"/><ellipse class="es-chk" cx="76" cy="65" rx="4.5" ry="3" fill="#ff9a7a" opacity=".55"/></g></svg>';
  var CLOUD = '<svg viewBox="0 0 100 46"><path d="M14 44Q2 44 4 34Q6 25 16 27Q18 14 32 15Q40 3 55 9Q67 5 73 18Q85 15 89 26Q99 28 97 37Q96 44 86 44Z" fill="#fff"/><path d="M10 40Q50 47 92 40Q92 44 86 44H14Q9 44 10 40Z" fill="#fde3ec"/></svg>';
  var MOON = '<svg class="es-moon" data-poke="moon" viewBox="0 0 120 120"><defs><mask id="es-mm"><rect width="120" height="120" fill="#fff"/><circle cx="80" cy="46" r="31" fill="#000"/></mask>' +
    '<radialGradient id="es-mh"><stop offset=".4" stop-color="#ffe3a0" stop-opacity=".2"/><stop offset="1" stop-color="#ffe3a0" stop-opacity="0"/></radialGradient></defs>' +
    '<g class="es-pk"><circle cx="58" cy="62" r="60" fill="url(#es-mh)"/>' +
    '<circle cx="58" cy="62" r="35" fill="#fff0c4" mask="url(#es-mm)"/>' +
    '<path class="es-lid" d="M36 64q5 4 10 0" stroke="#c9a65a" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
    '<g class="es-eye" opacity="0"><circle cx="41" cy="64.5" r="3.4" fill="#8a6a3a"/><circle cx="42.2" cy="63.4" r="1.1" fill="#fff"/></g><ellipse cx="38" cy="73" rx="4" ry="2.6" fill="#ffb0a0" opacity=".5"/></g></svg>';
  // Stars only where no text sits: a thin band above the top bar on every screen, plus (class es-g, wide screens
  // only) the side gutters beside the content column. On phones a star near the 16px edge would read as a bullet,
  // so those stay hidden there. [x%, y%, px, twinkle, gutter-only]
  // Each star has an invisible 40px tap box just before it (es-sw), so it is big enough to tap. In the top band the box
  // reaches up into the empty strip above the top bar (its center stays above the buttons there).
  var STARS = '';
  [[10, 1.6, 7, 1], [27, 2.2, 5], [46, 1.2, 6], [58, 2.4, 5, 1], [83, 1.4, 6], [1.2, 16, 6, 0, 1], [98, 31, 5, 1, 1], [1.6, 44, 5, 0, 1], [97.6, 55, 6, 0, 1], [1, 68, 5, 1, 1],
    [5, 21, 8, 0, 1], [8, 36, 5, 0, 1], [4, 58, 7, 1, 1], [9, 71, 5, 0, 1], [6, 47, 5, 0, 1], [92, 43, 6, 0, 1], [95, 63, 8, 1, 1], [90, 74, 5, 0, 1]].forEach(function (s) {
    var g = s[4] ? ' es-g' : '', h = s[2] / 2;
    STARS += '<span class="es-sw' + g + '" data-poke="star" style="left:calc(' + s[0] + '% + ' + (h - 20) + 'px);top:' +
      (s[4] ? 'calc(' + s[1] + '% + ' + (h - 20) + 'px)' : 'max(-19px,calc(' + s[1] + '% + ' + (h - 34) + 'px))') + '"></span>' +
      '<i class="es-st' + (s[3] ? ' es-tw' : '') + g + '" style="left:' + s[0] + '%;top:' + s[1] + '%;width:' + s[2] + 'px;height:' + s[2] + 'px"></i>';
  });
  var CW = [[60, 12], [52, 13], [34, 9], [16, 9], [2, 6], [13, 12], [3, 11], [13, 15], [5, 16], [14, 18], [9, 21], [19, 20], [34, 21], [50, 22], [56, 23], [57, 30], [60, 31]];
  var CONDOR = '<svg class="es-condor" data-poke="condor" viewBox="0 0 120 34"><g class="es-cb"><g class="es-cw"><path d="M' + CW.concat(CW.slice(0, -1).reverse().map(function (p) { return [120 - p[0], p[1]]; })).join('L') + 'Z" fill="#a8809f"/></g>' +
    '<ellipse cx="60" cy="21" rx="3.4" ry="9" fill="#a8809f"/><ellipse cx="60" cy="15.5" rx="5.5" ry="2.4" fill="#fff8fb"/><circle cx="60" cy="11.5" r="2.8" fill="#c99a92"/></g></svg>';
  var SKY = '<div class="es-day">' + SUN + CONDOR + '<div class="es-cl es-cl1" data-poke="cloud">' + CLOUD + '</div><div class="es-cl es-cl2" data-poke="cloud">' + CLOUD + '</div><div class="es-cl es-cl3" data-poke="cloud">' + CLOUD + '</div></div>' +
    '<div class="es-night">' + MOON + STARS + '</div>';

  // Objects: little Latin American things near the edges. o5 (hummingbird) by day, o8 (paper lantern) by night.
  var MARACA = function (c1, c2) {
    return '<rect x="-2.6" y="10" width="5.2" height="20" rx="2.6" fill="#c9875a"/><ellipse rx="10.5" ry="12.5" fill="' + c1 + '"/>' +
      '<path d="M-10-2l3.3-3.5 3.3 3.5 3.3-3.5 3.3 3.5 3.3-3.5 3.3 3.5" stroke="' + c2 + '" stroke-width="2.4" fill="none" stroke-linejoin="round"/>' +
      '<path d="M-9.5 5h19" stroke="#fff" stroke-width="2" stroke-dasharray="2 2.6" stroke-linecap="round"/><ellipse cx="-4" cy="-6" rx="2.6" ry="4" fill="#fff" opacity=".45"/>';
  };
  var STAR = '', TS = ['', ''];
  ['#ffc928', '#0f9e98', '#f57a10', '#9b4dca', '#17844a'].forEach(function (c, k) {
    var an = (-90 + k * 72) * Math.PI / 180, d1 = .42;
    var tip = [32 + 27 * Math.cos(an), 36 + 27 * Math.sin(an)];
    STAR += '<path d="M' + pt([32 + 10 * Math.cos(an - d1), 36 + 10 * Math.sin(an - d1)]) + 'L' + pt(tip) + 'L' + pt([32 + 10 * Math.cos(an + d1), 36 + 10 * Math.sin(an + d1)]) + 'Z" fill="' + c + '"/>';
    if (k) TS[k % 2] += 'M' + pt(tip) + 'l-2 6m2-6l2 6';
  });
  STAR += TS.map(function (d, k) { return '<path d="' + d + '" stroke="' + (k ? '#ec2f8f' : '#ffc928') + '" stroke-width="1.8" stroke-linecap="round"/>'; }).join('');
  var RISTRA = '<path d="M20 0v84" stroke="#b08a5a" stroke-width="1.6"/>';   // a string of dried red chilis
  for (var c = 0; c < 9; c++) {
    var cyy = 6 + c * 8.5, sd = c % 2 ? 1 : -1;
    var X = function (dx) { return r1(20 + dx * sd); };
    RISTRA += '<path d="M20 ' + cyy + 'C' + X(6) + ' ' + cyy + ' ' + X(10.5) + ' ' + (cyy + 6) + ' ' + X(10) + ' ' + (cyy + 17) + 'C' + X(7) + ' ' + (cyy + 11) + ' ' + X(3) + ' ' + (cyy + 6.5) + ' 20 ' + (cyy + 5) + 'Z" fill="' + ['#e8443a', '#cf2e2b', '#f05a36'][c % 3] + '"/>' +
      '<circle cx="20" cy="' + cyy + '" r="2" fill="#5a9a4a"/>';
  }
  RISTRA += '<path d="M20 82l-4 12M20 82l4 12M20 82v13" stroke="#e0b25a" stroke-width="1.6" stroke-linecap="round"/>';
  var SH = function (x, y, r) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="2.4" fill="#5b3a2e" opacity=".14"/>'; };
  function obj(n, vb, inner, poke) { return '<div class="es-o es-o' + n + '" data-poke="' + poke + '"><svg viewBox="' + vb + '">' + inner + '</svg></div>'; }
  var OBJECTS =
    obj(1, '0 0 64 64', SH(33, 54, 13) + '<g transform="translate(22 26) rotate(-24)"><g class="es-mk">' + MARACA('#ec2f8f', '#ffc928') + '</g></g><g transform="translate(43 24) rotate(22)"><g class="es-mk es-mk2">' + MARACA('#f57a10', '#0f9e98') + '</g></g>', 'maracas') +
    obj(2, '0 0 64 70', '<path d="M32 0v9" stroke="#8a6a5a" stroke-width="1.4"/>' + STAR + '<circle cx="32" cy="36" r="12.5" fill="#ec2f8f"/><path d="M20.5 33l2.9-3 2.9 3 2.9-3 2.9 3 2.9-3 2.9 3 2.9-3 2.9 3" stroke="#ffc928" stroke-width="2.2" fill="none"/><path d="M20 40h24" stroke="#fff" stroke-width="2" stroke-dasharray="2 2.4" stroke-linecap="round"/><circle cx="27" cy="30" r="3" fill="#fff" opacity=".4"/>', 'pinata') +
    obj(3, '0 0 64 64', SH(37, 58, 14) + '<g transform="rotate(-28 32 32)"><rect x="29.5" y="2" width="5" height="26" rx="1.5" fill="#9a6a52"/><rect x="28" y="0" width="8" height="7" rx="2" fill="#7a4a36"/><circle cx="32" cy="30" r="10" fill="#f0ad62"/><circle cx="32" cy="46" r="13" fill="#f0ad62"/><circle cx="32" cy="36" r="4.2" fill="#6b3f2a" stroke="#ec2f8f" stroke-width="1.6"/><rect x="26" y="49" width="12" height="3" rx="1.5" fill="#7a4a36"/><path class="es-gs" d="M31 6v44M33 6v44" stroke="#fff6e6" stroke-width=".6"/><circle cx="23" cy="46" r="2" fill="#ec2f8f"/><circle cx="41" cy="46" r="2" fill="#0f9e98"/><circle cx="32" cy="55" r="1.8" fill="#ffc928"/></g><g class="es-gn" fill="#9b4dca" stroke="#9b4dca" stroke-width="1.5" stroke-linecap="round"><ellipse cx="49" cy="17" rx="2.9" ry="2.1" stroke="none"/><path d="M51.7 16.6V7l4.6-1.6" fill="none"/><ellipse cx="57" cy="29" rx="2.5" ry="1.8" stroke="none"/><path d="M59.3 28.6V21" fill="none"/></g>', 'guitar') +
    obj(4, '0 0 64 64', SH(32, 62.6, 15) + '<path d="M24 46Q22 36 18 28M32 46Q32 30 34 18M40 46Q45 38 48 30" stroke="#4fae6e" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M26 44q-9-2-11-9q8 1 11 9zM40 42q8-4 12-1q-6 6-12 1z" fill="#5fbf7c"/>' +
      '<path d="M19 47h26l-3 16H22z" fill="#e08a52"/><rect x="16" y="43" width="32" height="6" rx="2" fill="#f0a368"/><path d="M21 55l3.5-3 3.5 3 3.5-3 3.5 3 3.5-3 3.5 3 3.5-3" stroke="#0f9e98" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M23 59.5h18" stroke="#fff3e0" stroke-width="1.6" stroke-dasharray="1.6 2.4" stroke-linecap="round"/>' +
      [[18, 28, 9], [34, 18, 11], [48, 30, 8]].map(function (f) {
        return '<g class="es-fh"><circle cx="' + f[0] + '" cy="' + f[1] + '" r="' + f[2] + '" fill="#ffa43a" stroke="#f57a10" stroke-width="3" stroke-dasharray="2.4 1.6" stroke-linecap="round"/><circle cx="' + f[0] + '" cy="' + f[1] + '" r="' + r1(f[2] * .6) + '" fill="#ffc23d"/><circle cx="' + f[0] + '" cy="' + f[1] + '" r="' + r1(f[2] * .28) + '" fill="#f08a1a"/></g>';
      }).join(''), 'flowers') +
    obj(5, '0 0 64 64', '<g class="es-hb"><path d="M15 33L30 29" stroke="#3b3040" stroke-width="1.4" stroke-linecap="round"/><path d="M44 36l12 6-3-8z" fill="#127a68"/><ellipse cx="41" cy="31" rx="10" ry="6" transform="rotate(18 41 31)" fill="#1fae8f"/><circle cx="32" cy="27" r="5.4" fill="#1fae8f"/><path d="M30 31q4 4 8 1q-2 4-7 3z" fill="#ec2f8f"/><circle cx="31" cy="26" r="1.3" fill="#2b1d1a"/><circle cx="30.6" cy="25.6" r=".45" fill="#fff"/><path class="es-wing" d="M38 26Q40 6 54 4Q50 16 44 28z" fill="#bff1e6" opacity=".8"/></g>', 'hummingbird') +
    obj(6, '0 0 40 96', RISTRA, 'ristra') +
    obj(7, '0 0 64 64', '<path d="M9 7L32 .5L55 7" stroke="#b08a5a" stroke-width="1.3" fill="none"/><g><rect x="10" y="12" width="44" height="40" rx="2" fill="#f57a10"/><path d="M10 17h44M10 47h44" stroke="#ec2f8f" stroke-width="3.5"/><path d="M10 22l5.5 4 5.5-4 5.5 4 5.5-4 5.5 4 5.5-4 5.5 4 5.5-4M10 42l5.5-4 5.5 4 5.5-4 5.5 4 5.5-4 5.5 4 5.5-4 5.5 4" stroke="#ffc928" stroke-width="2" fill="none"/><path d="M32 26l6 6-6 6-6-6z" fill="#0f9e98"/><path d="M32 29.5l2.5 2.5-2.5 2.5-2.5-2.5z" fill="#fff"/><path d="M12.2 55H50M12.2 9H50" stroke="#9b4dca" stroke-width="7.2" stroke-dasharray="1.6 2.4"/></g><rect x="7" y="5" width="50" height="3.4" rx="1.7" fill="#9a6a52"/>', 'textile') +
    obj(8, '0 0 64 64', '<radialGradient id="es-lh"><stop offset=".25" stop-color="#ffe3a0"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient><circle class="es-lg" cx="32" cy="36" r="27" fill="url(#es-lh)"/><path d="M32 0v10" stroke="#b9a0c0" stroke-width="1.4"/><rect x="25" y="9" width="14" height="4" rx="1.5" fill="#9b4dca"/><path d="M24 13h16q8 12 0 34H24q-8-22 0-34z" fill="#ec2f8f"/><path d="M32 13v34M27 13q-4 17 0 34M37 13q4 17 0 34" stroke="#ffb3d6" stroke-width="1.2" fill="none"/><ellipse class="es-lw" cx="32" cy="30" rx="6" ry="9" fill="#ffd27a" opacity=".5"/><rect x="25" y="47" width="14" height="4" rx="1.5" fill="#9b4dca"/><path d="M30 51v8M34 51v6" stroke="#ffc928" stroke-width="1.6" stroke-linecap="round"/>', 'lantern');

  // Hidden surprises (theme-format.md section 4), all inside #theme-layer, one copy at a time, removed when done:
  // the pinata tapped 3 times in a row bursts into papel picado and candy, the guitar 3 times sends music notes up,
  // the sun 5 times brings a rainbow over the Andes, the moon 3 times sends shooting stars across the night.
  var FX = {};
  var PICADO = ['#ec2f8f', '#ffc928', '#0f9e98', '#f57a10', '#9b4dca', '#17844a'];
  var CANDY = '<svg viewBox="0 0 24 12"><path d="M6 6L0 1.5v9zM18 6l6-4.5v9z" fill="currentColor" opacity=".75"/><ellipse cx="12" cy="6" rx="7" ry="5" fill="currentColor"/><path d="M8.6 3l3 6M12.6 2.6l3 6.4" stroke="#fff" stroke-width="1.4" opacity=".65"/></svg>';
  var NOTES = [
    '<svg viewBox="0 0 20 26"><ellipse cx="6" cy="21" rx="5" ry="3.6" transform="rotate(-20 6 21)" fill="currentColor"/><path d="M10.4 20V2q5 1.5 7.5 6.5" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 26 26"><ellipse cx="5.6" cy="21" rx="4.6" ry="3.4" transform="rotate(-20 5.6 21)" fill="currentColor"/><ellipse cx="19.6" cy="18" rx="4.6" ry="3.4" transform="rotate(-20 19.6 18)" fill="currentColor"/><path d="M9.8 20.5V4.4M23.8 17.5V1.4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M9.8 4.4L23.8 1.4" stroke="currentColor" stroke-width="4"/></svg>'
  ];
  var RAINBOW = '<svg viewBox="0 0 200 100">' + ['#ff9fc8', '#ffb877', '#ffe08a', '#a9dca2', '#8fd9cf', '#c8a9ec'].map(function (c, k) {
    var r = 96 - k * 5.4;
    return '<path d="M' + r1(100 - r) + ' 100A' + r1(r) + ' ' + r1(r) + ' 0 0 1 ' + r1(100 + r) + ' 100" stroke="' + c + '" style="animation-delay:' + (k * .14).toFixed(2) + 's"/>';
  }).join('') + '</svg>';
  function rnd(a, b) { return Math.round(a + Math.random() * (b - a)); }
  /** Adds one temporary surprise to the layer (unless that one is still running) and removes it after `ms`. */
  function surprise(key, layer, cls, html, ms, style, before) {
    if (FX[key] || !layer || !document.createElement) return;
    var d = document.createElement('div');
    d.className = 'es-fx ' + cls;
    d.setAttribute('aria-hidden', 'true');
    if (style) d.setAttribute('style', style);
    d.innerHTML = html;
    if (before && before.parentNode === layer) layer.insertBefore(d, before); else layer.appendChild(d);
    FX[key] = d;
    watchCalm();
    setTimeout(function () { drop(key, d); }, ms);
  }
  function drop(key, d) {
    if (d.parentNode) d.parentNode.removeChild(d);
    if (FX[key] === d) FX[key] = null;
  }
  var watching = false;
  function watchCalm() {   // es.css already hides .es-fx under html.calm; this also removes them
    if (watching || typeof MutationObserver !== 'function') return;
    watching = true;
    new MutationObserver(function () {
      if (!document.documentElement.classList.contains('calm')) return;
      for (var k in FX) if (FX[k]) drop(k, FX[k]);
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
  function onPoke(name, info) {
    try {
      var layer = info && info.layer, el = info && info.el;
      if (!layer || !el || !el.getBoundingClientRect || document.documentElement.classList.contains('calm')) return;
      var r = el.getBoundingClientRect(), html = '', i, W = window.innerWidth || 1000;
      if (name === 'pinata' && info.taps === 3 && !info.reduced) {
        html = '<b class="es-ring"></b>';
        for (i = 0; i < 21; i++) {
          var candy = i % 3 === 2, side = i % 2 ? 1 : -1;
          html += '<i class="' + (candy ? 'es-candy' : 'es-bit') + '" style="' + (candy ? 'color:' : 'background:') + PICADO[i % 6] +
            ';--dx:' + side * rnd(14, 96) + 'px;--up:' + -rnd(30, 86) + 'px;--fall:' + rnd(140, 230) + 'px;--r:' + side * rnd(200, 560) + 'deg' +
            ';animation-delay:' + (i % 4) * 0.03 + 's">' + (candy ? CANDY : '') + '</i>';
        }
        surprise('pinata', layer, 'es-fx-burst', html, 2700, 'left:' + Math.round(r.left + r.width / 2) + 'px;top:' + Math.round(r.top + r.height * .55) + 'px');
      } else if (name === 'guitar' && info.taps === 3 && !info.reduced) {
        for (i = 0; i < 6; i++) {
          html += '<i style="color:' + PICADO[i * 5 % 6] + ';--sx:' + (i % 2 ? 1 : -1) * rnd(8, 18) + 'px;--tilt:' + (i % 2 ? -1 : 1) * rnd(8, 18) + 'deg;--rise:' + -rnd(130, 190) +
            'px;animation-delay:' + (i * .26).toFixed(2) + 's">' + NOTES[i % 2] + '</i>';
        }
        surprise('guitar', layer, 'es-fx-notes', html, 3800, 'left:' + Math.round(r.left + r.width * .72) + 'px;top:' + Math.round(r.top + r.height * .3) + 'px');
      } else if (name === 'sun' && info.taps === 5) {   // a still fade-in under reduced motion
        surprise('sun', layer, 'es-fx-rainbow', RAINBOW, 5600, '', layer.querySelector('.theme-deco.scene'));
      } else if (name === 'moon' && info.taps === 3 && !info.reduced) {
        [[.94, 5, 0], [.8, 13, .55], [.99, 21, 1.1]].forEach(function (s) {
          html += '<i style="left:' + Math.round(s[0] * W) + 'px;top:' + s[1] + 'vh;animation-delay:' + s[2] + 's"></i>';
        });
        // the shooting stars start on the moon's side and fly across the sky
        surprise('moon', layer, 'es-fx-shoot' + (r.left + r.width / 2 < W / 2 ? ' es-fx-flip' : ''), html, 2800);
      }
    } catch (e) { /* a surprise must never break the app */ }
  }

  // Spanish phrases inside Hebrew lines are wrapped in LRI...PDI so their punctuation stays put in RTL.
  function es(s) { return '⁦' + s + '⁩'; }

  TLAP_THEME("es", {
    name: { en: "Spanish", he: "ספרדית" },
    native: "Español",
    flag: "🌎",
    tagline: { target: "¡Habla como un nativo!", en: "Speak like a local!", he: "לדבר כמו מקומי!" },
    mascot: {
      name: { en: "Lupe the llama", he: "לופה הלאמה" },
      svg: svg
    },
    lines: {
      intro: {
        en: "¡Hola! (Hi!) I'm Lupe the llama. We'll learn real, everyday Spanish together, poco a poco (little by little). ¡Vamos! (Let's go!)",
        he: es("¡Hola!") + " (שלום!) אני לופה הלאמה. נלמד ביחד ספרדית אמיתית של היומיום, " + es("poco a poco") + " (לאט לאט). " + es("¡Vamos!") + " (יאללה!)"
      },
      greet: {
        en: [
          "¡Hola, amigo! (Hi, friend!) Ready to practice?",
          "¡Vamos! (Let's go!) Pick a topic and let's chat.",
          "¿Qué tal? (How's it going?) A few minutes a day works wonders.",
          "¡Qué gusto verte! (So good to see you!) Every new word is a little fiesta."
        ],
        he: [
          es("¡Hola, amigo!") + " (שלום, חבר!) מוכן לתרגל?",
          es("¡Vamos!") + " (יאללה!) בחר נושא ובוא נדבר.",
          es("¿Qué tal?") + " (מה נשמע?) כמה דקות ביום עושות פלאים.",
          es("¡Qué gusto verte!") + " (כמה כיף לראות אותך!) כל מילה חדשה היא פיאסטה קטנה."
        ]
      },
      group: {
        en: "Pick a sub-topic. Poco a poco (little by little), you'll get there!",
        he: "בחר תת-נושא. " + es("Poco a poco") + " (לאט לאט), תגיע לשם!"
      },
      topic: {
        en: "Choose an exercise. ¡Tú puedes! (You can do it!)",
        he: "בחר תרגיל. " + es("¡Tú puedes!") + " (אתה יכול!)"
      },
      right: {
        en: ["¡Muy bien! (Very good!)", "¡Excelente! (Excellent!)", "¡Eso es! (That's it!)", "¡Qué bien! (Great!)", "¡Perfecto! (Perfect!)"],
        he: [es("¡Muy bien!") + " (טוב מאוד!)", es("¡Excelente!") + " (מצוין!)", es("¡Eso es!") + " (בדיוק!)", es("¡Qué bien!") + " (איזה יופי!)", es("¡Perfecto!") + " (מושלם!)"]
      },
      wrong: {
        en: [
          "¡Ánimo! (Chin up!) You'll get it next time.",
          "¡Casi! (Almost!) Try once more.",
          "No pasa nada. (No worries.) Let's keep going.",
          "Tranquilo. (Easy does it.) Mistakes help you learn."
        ],
        he: [
          es("¡Ánimo!") + " (ראש למעלה!) בפעם הבאה זה יצליח.",
          es("¡Casi!") + " (כמעט!) נסה עוד פעם.",
          es("No pasa nada.") + " (לא נורא.) ממשיכים.",
          es("Tranquilo.") + " (בלי לחץ.) טעויות עוזרות ללמוד."
        ]
      },
      empty: {
        en: "¡Nada! (Nothing!) Try a different word.",
        he: es("¡Nada!") + " (כלום!) נסה מילה אחרת."
      }
    },
    decorations: {
      banner: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 60'><defs><path id='es-pp' fill-rule='evenodd' d='M0 0H36V31a3 3 0 0 1-6 0a3 3 0 0 1-6 0a3 3 0 0 1-6 0a3 3 0 0 1-6 0a3 3 0 0 1-6 0a3 3 0 0 1-6 0ZM18 9l6 7.5-6 7.5-6-7.5zM4.8 7a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0-4.4 0zM26.8 7a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0-4.4 0zM4.8 22a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0-4.4 0zM26.8 22a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0-4.4 0zM12.5 13.5l2 2.5-2 2.5-2-2.5zM23.5 13.5l2 2.5-2 2.5-2-2.5zM4 28.2a1 1 0 1 0 2 0a1 1 0 1 0-2 0zM8 28.2a1 1 0 1 0 2 0a1 1 0 1 0-2 0zM12 28.2a1 1 0 1 0 2 0a1 1 0 1 0-2 0zM16 28.2a1 1 0 1 0 2 0a1 1 0 1 0-2 0zM20 28.2a1 1 0 1 0 2 0a1 1 0 1 0-2 0zM24 28.2a1 1 0 1 0 2 0a1 1 0 1 0-2 0zM28 28.2a1 1 0 1 0 2 0a1 1 0 1 0-2 0zM6 3h24v1.6H6z'/></defs><path d='M-4 5Q200 30 404 5' fill='none' stroke='#8a6a5a' stroke-width='1.6' opacity='.7'/><g transform='translate(22.2 6.6) rotate(6.2)'><g><use href='#es-pp' x='-18' fill='#ec2f8f'/></g></g><g transform='translate(66.7 10.9) rotate(4.7)'><g class='es-sway'><use href='#es-pp' x='-18' fill='#f57a10'/></g></g><g transform='translate(111.1 14) rotate(3.1)'><g><use href='#es-pp' x='-18' fill='#ffc928'/></g></g><g transform='translate(155.6 15.9) rotate(1.6)'><g class='es-sway'><use href='#es-pp' x='-18' fill='#0f9e98'/></g></g><g transform='translate(200 16.5) rotate(0)'><g><use href='#es-pp' x='-18' fill='#9b4dca'/></g></g><g transform='translate(244.4 15.9) rotate(-1.6)'><g class='es-sway'><use href='#es-pp' x='-18' fill='#17844a'/></g></g><g transform='translate(288.9 14) rotate(-3.1)'><g><use href='#es-pp' x='-18' fill='#ea3d64'/></g></g><g transform='translate(333.3 10.9) rotate(-4.7)'><g class='es-sway'><use href='#es-pp' x='-18' fill='#f57a10'/></g></g><g transform='translate(377.8 6.6) rotate(-6.2)'><g><use href='#es-pp' x='-18' fill='#0f9e98'/></g></g></svg>",
      corner: '',   // the cactus and sun now live in the scene and sky
      results: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 120'><defs><radialGradient id='es-burst-fade' gradientUnits='userSpaceOnUse' cx='100' cy='64' r='56'><stop offset='.3' stop-color='#fff'/><stop offset='1' stop-color='#fff' stop-opacity='0'/></radialGradient><mask id='es-burst-mask'><rect x='-10' y='-10' width='220' height='140' fill='url(#es-burst-fade)'/></mask></defs><g mask='url(#es-burst-mask)' opacity='.55'><path d='M100 64L158 64L157.1 74.1Z' fill='#ffc928'/><path d='M100 64L154.5 83.8L150.2 93Z' fill='#ffa53a'/><path d='M100 64L144.4 101.3L137.3 108.4Z' fill='#ffc928'/><path d='M100 64L129 114.2L119.8 118.5Z' fill='#ffa53a'/><path d='M100 64L110.1 121.1L100 122Z' fill='#ffc928'/><path d='M100 64L89.9 121.1L80.2 118.5Z' fill='#ffa53a'/><path d='M100 64L71 114.2L62.7 108.4Z' fill='#ffc928'/><path d='M100 64L55.6 101.3L49.8 93Z' fill='#ffa53a'/><path d='M100 64L45.5 83.8L42.9 74.1Z' fill='#ffc928'/><path d='M100 64L42 64L42.9 53.9Z' fill='#ffa53a'/><path d='M100 64L45.5 44.2L49.8 35Z' fill='#ffc928'/><path d='M100 64L55.6 26.7L62.7 19.6Z' fill='#ffa53a'/><path d='M100 64L71 13.8L80.2 9.5Z' fill='#ffc928'/><path d='M100 64L89.9 6.9L100 6Z' fill='#ffa53a'/><path d='M100 64L110.1 6.9L119.8 9.5Z' fill='#ffc928'/><path d='M100 64L129 13.8L137.3 19.6Z' fill='#ffa53a'/><path d='M100 64L144.4 26.7L150.2 35Z' fill='#ffc928'/><path d='M100 64L154.5 44.2L157.1 53.9Z' fill='#ffa53a'/></g><circle cx='100' cy='64' r='34' fill='#ffc928' opacity='.35'/><g transform='translate(30 58) rotate(-28)'><g class='es-shake'><rect x='-3.5' y='14' width='7' height='26' rx='3.5' fill='#b8743f' stroke='#7a4a26' stroke-width='1.5'/><path d='M-3.5 32h7M-3.5 36h7' stroke='#7a4a26' stroke-width='1.2'/><ellipse cx='0' cy='0' rx='14' ry='17' fill='#ec2f8f' stroke='#00000033' stroke-width='1.5'/><path d='M-13 -4l3.25 -4l3.25 4l3.25 -4l3.25 4l3.25 -4l3.25 4l3.25 -4l3.25 4' fill='none' stroke='#ffc928' stroke-width='3' stroke-linejoin='round'/><path d='M-13 4h26' stroke='#fff' stroke-width='2.4' stroke-dasharray='2.4 3' stroke-linecap='round'/><ellipse cx='-5' cy='-8' rx='3.5' ry='5' fill='#fff' opacity='.4'/></g></g><g transform='translate(170 58) rotate(28)'><g class='es-shake'><rect x='-3.5' y='14' width='7' height='26' rx='3.5' fill='#b8743f' stroke='#7a4a26' stroke-width='1.5'/><path d='M-3.5 32h7M-3.5 36h7' stroke='#7a4a26' stroke-width='1.2'/><ellipse cx='0' cy='0' rx='14' ry='17' fill='#f57a10' stroke='#00000033' stroke-width='1.5'/><path d='M-13 -4l3.25 -4l3.25 4l3.25 -4l3.25 4l3.25 -4l3.25 4l3.25 -4l3.25 4' fill='none' stroke='#0f9e98' stroke-width='3' stroke-linejoin='round'/><path d='M-13 4h26' stroke='#fff' stroke-width='2.4' stroke-dasharray='2.4 3' stroke-linecap='round'/><ellipse cx='-5' cy='-8' rx='3.5' ry='5' fill='#fff' opacity='.4'/></g></g><path d='M10 36q-5 6-2 13M18 30q-7 4-8 11M190 36q5 6 2 13M182 30q7 4 8 11' stroke='#f59a1a' stroke-width='2.4' fill='none' stroke-linecap='round'/><path d='M18 17l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#ec2f8f'/><path d='M182 21l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#0f9e98'/><path d='M60 5l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#f57a10'/><path d='M142 7l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#17844a'/><path d='M10 87l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#9b4dca'/><path d='M190 91l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#ec2f8f'/><path d='M52 107l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#ffc928'/><path d='M150 107l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#f57a10'/></svg>",
      ambient: '<i></i><i></i><i></i><i></i><i></i><b></b><b></b><b></b>',
      sky: SKY,
      scene: SCENE,
      objects: OBJECTS
    },
    confetti: ["#ec2f8f", "#f57a10", "#ffc928", "#17844a", "#0f9e98", "#9b4dca"],
    onPoke: onPoke
  });
})();
