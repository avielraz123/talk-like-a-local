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
      corner: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><g stroke='#f59a1a' stroke-width='4' stroke-linecap='round'><path d='M111 26L118 26'/><path d='M108.7 34.5L114.8 38'/><path d='M102.5 40.7L106 46.8'/><path d='M94 43L94 50'/><path d='M85.5 40.7L82 46.8'/><path d='M79.3 34.5L73.2 38'/><path d='M77 26L70 26'/><path d='M79.3 17.5L73.2 14'/><path d='M85.5 11.3L82 5.2'/><path d='M94 9L94 2'/><path d='M102.5 11.3L106 5.2'/><path d='M108.7 17.5L114.8 14'/></g><circle cx='94' cy='26' r='12' fill='#ffc928'/><circle cx='90' cy='22' r='4' fill='#fff' opacity='.45'/><path d='M42 109V50M42 88H31q-6 0-6-6V68M42 78H52q6 0 6-6V60' stroke='#0e5f34' stroke-width='19' fill='none' stroke-linecap='round' stroke-linejoin='round'/><path d='M42 109V50M42 88H31q-6 0-6-6V68M42 78H52q6 0 6-6V60' stroke='#2fa25d' stroke-width='14' fill='none' stroke-linecap='round' stroke-linejoin='round'/><path d='M38 108V52M46 108V52M25 82V68M58 70V60' stroke='#6cc98d' stroke-width='1.6' fill='none' stroke-linecap='round'/><path d='M34 60l-3-1M50 66l3-1M34 96l-3-1M50 100l3-1M21 74l-3-1M62 66l3-1' stroke='#0e5f34' stroke-width='1.3' stroke-linecap='round'/><circle cx='42' cy='39' r='3.3' fill='#ec2f8f'/><circle cx='45.8' cy='41.8' r='3.3' fill='#ec2f8f'/><circle cx='44.4' cy='46.2' r='3.3' fill='#ec2f8f'/><circle cx='39.6' cy='46.2' r='3.3' fill='#ec2f8f'/><circle cx='38.2' cy='41.8' r='3.3' fill='#ec2f8f'/><circle cx='42' cy='43' r='2.2' fill='#ffc928'/><path d='M0 120V110Q26 98 56 106Q86 98 120 108V120Z' fill='#f2c48a'/><path d='M10 114q6-2 10 0M60 114q5-2 9 0' stroke='#d9a066' stroke-width='2' fill='none' stroke-linecap='round'/><ellipse cx='84' cy='103' rx='14' ry='12' fill='#2fa25d' stroke='#0e5f34' stroke-width='2.5'/><path d='M77 93q-3 10 0 20M84 91v24M91 93q3 10 0 20' stroke='#6cc98d' stroke-width='1.6' fill='none'/><circle cx='84' cy='87.6' r='2.8' fill='#f57a10'/><circle cx='87.2' cy='89.9' r='2.8' fill='#f57a10'/><circle cx='86' cy='93.8' r='2.8' fill='#f57a10'/><circle cx='82' cy='93.8' r='2.8' fill='#f57a10'/><circle cx='80.8' cy='89.9' r='2.8' fill='#f57a10'/><circle cx='84' cy='91' r='1.8' fill='#ffc928'/></svg>",
      results: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 120'><defs><radialGradient id='es-burst-fade' gradientUnits='userSpaceOnUse' cx='100' cy='64' r='56'><stop offset='.3' stop-color='#fff'/><stop offset='1' stop-color='#fff' stop-opacity='0'/></radialGradient><mask id='es-burst-mask'><rect x='-10' y='-10' width='220' height='140' fill='url(#es-burst-fade)'/></mask></defs><g mask='url(#es-burst-mask)' opacity='.55'><path d='M100 64L158 64L157.1 74.1Z' fill='#ffc928'/><path d='M100 64L154.5 83.8L150.2 93Z' fill='#ffa53a'/><path d='M100 64L144.4 101.3L137.3 108.4Z' fill='#ffc928'/><path d='M100 64L129 114.2L119.8 118.5Z' fill='#ffa53a'/><path d='M100 64L110.1 121.1L100 122Z' fill='#ffc928'/><path d='M100 64L89.9 121.1L80.2 118.5Z' fill='#ffa53a'/><path d='M100 64L71 114.2L62.7 108.4Z' fill='#ffc928'/><path d='M100 64L55.6 101.3L49.8 93Z' fill='#ffa53a'/><path d='M100 64L45.5 83.8L42.9 74.1Z' fill='#ffc928'/><path d='M100 64L42 64L42.9 53.9Z' fill='#ffa53a'/><path d='M100 64L45.5 44.2L49.8 35Z' fill='#ffc928'/><path d='M100 64L55.6 26.7L62.7 19.6Z' fill='#ffa53a'/><path d='M100 64L71 13.8L80.2 9.5Z' fill='#ffc928'/><path d='M100 64L89.9 6.9L100 6Z' fill='#ffa53a'/><path d='M100 64L110.1 6.9L119.8 9.5Z' fill='#ffc928'/><path d='M100 64L129 13.8L137.3 19.6Z' fill='#ffa53a'/><path d='M100 64L144.4 26.7L150.2 35Z' fill='#ffc928'/><path d='M100 64L154.5 44.2L157.1 53.9Z' fill='#ffa53a'/></g><circle cx='100' cy='64' r='34' fill='#ffc928' opacity='.35'/><g transform='translate(30 58) rotate(-28)'><g class='es-shake'><rect x='-3.5' y='14' width='7' height='26' rx='3.5' fill='#b8743f' stroke='#7a4a26' stroke-width='1.5'/><path d='M-3.5 32h7M-3.5 36h7' stroke='#7a4a26' stroke-width='1.2'/><ellipse cx='0' cy='0' rx='14' ry='17' fill='#ec2f8f' stroke='#00000033' stroke-width='1.5'/><path d='M-13 -4l3.25 -4l3.25 4l3.25 -4l3.25 4l3.25 -4l3.25 4l3.25 -4l3.25 4' fill='none' stroke='#ffc928' stroke-width='3' stroke-linejoin='round'/><path d='M-13 4h26' stroke='#fff' stroke-width='2.4' stroke-dasharray='2.4 3' stroke-linecap='round'/><ellipse cx='-5' cy='-8' rx='3.5' ry='5' fill='#fff' opacity='.4'/></g></g><g transform='translate(170 58) rotate(28)'><g class='es-shake'><rect x='-3.5' y='14' width='7' height='26' rx='3.5' fill='#b8743f' stroke='#7a4a26' stroke-width='1.5'/><path d='M-3.5 32h7M-3.5 36h7' stroke='#7a4a26' stroke-width='1.2'/><ellipse cx='0' cy='0' rx='14' ry='17' fill='#f57a10' stroke='#00000033' stroke-width='1.5'/><path d='M-13 -4l3.25 -4l3.25 4l3.25 -4l3.25 4l3.25 -4l3.25 4l3.25 -4l3.25 4' fill='none' stroke='#0f9e98' stroke-width='3' stroke-linejoin='round'/><path d='M-13 4h26' stroke='#fff' stroke-width='2.4' stroke-dasharray='2.4 3' stroke-linecap='round'/><ellipse cx='-5' cy='-8' rx='3.5' ry='5' fill='#fff' opacity='.4'/></g></g><path d='M10 36q-5 6-2 13M18 30q-7 4-8 11M190 36q5 6 2 13M182 30q7 4 8 11' stroke='#f59a1a' stroke-width='2.4' fill='none' stroke-linecap='round'/><path d='M18 17l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#ec2f8f'/><path d='M182 21l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#0f9e98'/><path d='M60 5l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#f57a10'/><path d='M142 7l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#17844a'/><path d='M10 87l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#9b4dca'/><path d='M190 91l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#ec2f8f'/><path d='M52 107l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#ffc928'/><path d='M150 107l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z' fill='#f57a10'/></svg>",
      ambient: '<i></i><i></i><i></i><i></i><i></i><i></i>'
    },
    confetti: ["#ec2f8f", "#f57a10", "#ffc928", "#17844a", "#0f9e98", "#9b4dca"]
  });
})();
