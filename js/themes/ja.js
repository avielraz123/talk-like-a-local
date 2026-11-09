/* Japanese theme: Hana the shiba inu (花 = flower), sakura, indigo, vermilion, matcha.
   See docs/theme-format.md. Everything is inline SVG; no external assets. */
TLAP_THEME("ja", {
  name: { en: "Japanese", he: "יפנית" },
  native: "日本語",
  flag: "🌸",
  tagline: { target: "地元の人みたいに話そう！", en: "Talk like a local!", he: "לדבר כמו מקומי!" },

  mascot: {
    name: { en: "Hana the shiba inu", he: "האנה כלבת השיבה" },
    svg: function (mood) {
      var O = "#6b3518", F = "#ea8b40", C = "#fff5e6", D = "#2b2140", P = "#f7a9c4", PD = "#e0628f";
      var sad = mood === "sad", cheer = mood === "cheer";
      function petal(x, y, s, r, fill) {
        return '<path transform="translate(' + x + ' ' + y + ') rotate(' + r + ') scale(' + s + ')" fill="' + fill +
          '" d="M0 0C-4.6-2.6-5.8-7.6-3.2-10.4L0-8.6L3.2-10.4C5.8-7.6 4.6-2.6 0 0Z"/>';
      }
      function flower(x, y, s) {
        var out = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">';
        for (var i = 0; i < 5; i++) out += petal(0, 0, 1, i * 72, P).replace('fill="', 'stroke="#c94f7c" stroke-width=".8" fill="');
        return out + '<circle r="2.6" fill="' + PD + '"/><circle r="1" fill="#f6c146"/></g>';
      }
      var line = ' stroke="' + O + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';

      // curled tail, sitting body, chest, feet
      var tail = '<g class="m-wag ja-tail">' +
        '<path d="M84 103C99 104 110 92 106 79C102 69 89 70 89 79C89 86 97 87 98 81" fill="none" stroke="' + O + '" stroke-width="13" stroke-linecap="round"/>' +
        '<path d="M84 103C99 104 110 92 106 79C102 69 89 70 89 79C89 86 97 87 98 81" fill="none" stroke="' + F + '" stroke-width="8.2" stroke-linecap="round"/>' +
        '<path d="M92 75C95 73 99 74 101 77" fill="none" stroke="' + C + '" stroke-width="3" stroke-linecap="round"/></g>';
      var body = '<path d="M34 117C30 100 38 84 60 83C82 84 90 100 86 117Z" fill="' + F + '"' + line + '/>' +
        '<path d="M46.5 116C45 104 51 92 60 91C69 92 75 104 73.5 116Z" fill="' + C + '"/>';
      var feet = '<ellipse cx="48" cy="114.5" rx="7.5" ry="4.8" fill="' + C + '"' + line + '/>' +
        '<ellipse cx="72" cy="114.5" rx="7.5" ry="4.8" fill="' + C + '"' + line + '/>' +
        '<path d="M46 114.5v2M50 114.5v2M70 114.5v2M74 114.5v2" stroke="' + O + '" stroke-width="1.3" stroke-linecap="round" opacity=".5"/>';
      var arms = cheer
        ? '<path d="M43 97L29 83M77 97L91 83" stroke="' + O + '" stroke-width="11.5" stroke-linecap="round"/>' +
          '<path d="M43 97L29 83M77 97L91 83" stroke="' + F + '" stroke-width="7" stroke-linecap="round"/>' +
          '<circle cx="28" cy="82" r="5.2" fill="' + C + '"' + line + '/><circle cx="92" cy="82" r="5.2" fill="' + C + '"' + line + '/>'
        : '';
      // indigo bandana with a tiny seigaiha print
      var scarf = '<path d="M37 82Q60 95 83 82L63 104Q60 107 57 104Z" fill="#2d3f8f" stroke="#1b2660" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M48 90.5a4 4 0 0 1 8 0M64 90.5a4 4 0 0 1 8 0M56 97a4 4 0 0 1 8 0" fill="none" stroke="#a9b8f2" stroke-width="1.6" stroke-linecap="round"/>';

      // ears (droop outward when sad)
      var earL = '<path d="M29 48C25 34 27 19 33 10C41 14 49 22 54 31Z" fill="' + F + '"' + line + '/>' +
        '<path d="M33 41C31.5 32 32 23 35 17.5C40 21 44.5 26 48 31Z" fill="#ffd8c6"/>';
      var earR = '<path d="M91 48C95 34 93 19 87 10C79 14 71 22 66 31Z" fill="' + F + '"' + line + '/>' +
        '<path d="M87 41C88.5 32 88 23 85 17.5C80 21 75.5 26 72 31Z" fill="#ffd8c6"/>';
      var ears = sad
        ? '<g transform="rotate(-52 40 44)">' + earL + '</g><g transform="rotate(52 80 44)">' + earR + '</g>'
        : cheer
          ? '<g transform="rotate(-6 38 42)">' + earL + '</g><g transform="rotate(6 82 42)">' + earR + '</g>'
          : earL + earR;

      // head with the cream "urajiro" mask, then the outline on top
      var headD = "M22 60C20 40 38 27 60 27C82 27 100 40 98 60C97 76 82 86 60 86C38 86 23 76 22 60Z";
      var head = '<path d="' + headD + '" fill="' + F + '"/>' +
        '<path d="M24.5 64C27 54 39 51 49 57C53 59.7 56.5 61 60 61C63.5 61 67 59.7 71 57C81 51 93 54 95.5 64C94.5 77 81 86 60 86C39 86 25.5 77 24.5 64Z" fill="' + C + '"/>' +
        '<path d="' + headD + '" fill="none"' + line + '/>';
      var brows = sad
        ? '<ellipse cx="44" cy="42" rx="4.4" ry="2.6" fill="' + C + '" transform="rotate(-22 44 42)"/><ellipse cx="76" cy="42" rx="4.4" ry="2.6" fill="' + C + '" transform="rotate(22 76 42)"/>'
        : '<ellipse cx="44" cy="' + (cheer ? 40 : 42) + '" rx="4.4" ry="2.8" fill="' + C + '"/><ellipse cx="76" cy="' + (cheer ? 40 : 42) + '" rx="4.4" ry="2.8" fill="' + C + '"/>';
      var eyes = cheer
        ? '<path d="M39.5 56Q45 47.5 50.5 56M69.5 56Q75 47.5 80.5 56" fill="none" stroke="' + D + '" stroke-width="3.6" stroke-linecap="round"/>'
        : sad
          ? '<ellipse cx="45" cy="56" rx="4.2" ry="4.6" fill="' + D + '"/><ellipse cx="75" cy="56" rx="4.2" ry="4.6" fill="' + D + '"/>' +
            '<circle cx="46" cy="57.6" r="1.4" fill="#fff"/><circle cx="76" cy="57.6" r="1.4" fill="#fff"/>' +
            '<path d="M39.5 53.6Q44 50.4 50.5 50.8M80.5 53.6Q76 50.4 69.5 50.8" fill="none" stroke="' + D + '" stroke-width="2.4" stroke-linecap="round"/>'
          : '<ellipse cx="45" cy="54" rx="4.8" ry="5.6" fill="' + D + '"/><ellipse cx="75" cy="54" rx="4.8" ry="5.6" fill="' + D + '"/>' +
            '<circle cx="46.8" cy="51.8" r="1.9" fill="#fff"/><circle cx="76.8" cy="51.8" r="1.9" fill="#fff"/>' +
            '<circle cx="43.6" cy="56.6" r=".9" fill="#fff"/><circle cx="73.6" cy="56.6" r=".9" fill="#fff"/>';
      var blush = '<ellipse cx="33.5" cy="69" rx="5.4" ry="3.3" fill="#ff98b0" opacity="' + (sad ? '.45' : '.8') + '"/>' +
        '<ellipse cx="86.5" cy="69" rx="5.4" ry="3.3" fill="#ff98b0" opacity="' + (sad ? '.45' : '.8') + '"/>';
      var nose = '<path d="M53.5 64.2C53.5 61.4 66.5 61.4 66.5 64.2C66.5 66.8 62.5 69 60 69C57.5 69 53.5 66.8 53.5 64.2Z" fill="' + D + '"/>' +
        '<ellipse cx="57.6" cy="63.2" rx="2" ry="1" fill="#fff" opacity=".55"/>';
      var mouth = cheer
        ? '<path d="M50.5 71.5Q60 74.5 69.5 71.5Q68 83 60 83Q52 83 50.5 71.5Z" fill="#8a2440" stroke="' + D + '" stroke-width="2" stroke-linejoin="round"/>' +
          '<path d="M54.5 79.5Q60 75.5 65.5 79.5Q63.5 82.6 60 82.6Q56.5 82.6 54.5 79.5Z" fill="#ff7f9e"/>'
        : sad
          ? '<path d="M60 69v3M53.5 77.5Q60 72.5 66.5 77.5" fill="none" stroke="' + D + '" stroke-width="2.3" stroke-linecap="round"/>'
          : '<path d="M60 69v2.6M52 71.5Q56 76.5 60 71.6Q64 76.5 68 71.5" fill="none" stroke="' + D + '" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>';
      var tear = sad
        ? '<path d="M81.5 59.5C80 63 78 65 78 67A3.5 3.5 0 0 0 85 67C85 65 83 63 81.5 59.5Z" fill="#9fd6ff" stroke="#4a8fd0" stroke-width="1"/>'
        : '';
      var extra = cheer
        ? petal(13, 34, 1, -25, P) + petal(108, 26, .9, 35, "#f48fb1") + petal(110, 56, .75, 70, P) + petal(10, 62, .7, -60, "#f48fb1") +
          '<path d="M104 8l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z" fill="#f6c146"/>' +
          '<path d="M16 10l1.2 2.6 2.6 1.2-2.6 1.2-1.2 2.6-1.2-2.6-2.6-1.2 2.6-1.2z" fill="#f6c146"/>'
        : '';

      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="ja-hana" aria-hidden="true" focusable="false">' +
        extra +
        '<g class="m-bob">' + tail + body + arms + feet + scarf + ears + head + brows + eyes + blush + nose + mouth +
        '<g transform="rotate(' + (sad ? -52 : cheer ? -6 : 0) + ' 40 44)">' + flower(23, 33, 1.05) + '</g>' + tear + '</g></svg>';
    }
  },

  lines: {
    intro: {
      en: "Konnichiwa (hello)! I'm Hana the shiba inu. Hana (花) means \"flower\" in Japanese. Let's learn together, one petal at a time!",
      he: "קוניצ'יווה (שלום)! אני האנה, כלבת שיבה. \"האנה\" (花) ביפנית זה פרח. בוא נלמד יפנית ביחד, צעד אחרי צעד!"
    },
    greet: {
      en: [
        "Konnichiwa! Ready to learn? Ganbatte (you've got this)!",
        "Wan wan! That's \"woof\" in Japanese. Which topic today?",
        "Yōkoso (welcome)! A few words a day, and the sakura will bloom.",
        "Ikimashō (let's go)! Pick a topic and we'll start.",
        "Mainichi (every day) a little practice, and soon you'll talk like a local!"
      ],
      he: [
        "קוניצ'יווה! מוכן ללמוד? גאנבטה (אתה יכול)!",
        "וואן וואן! ככה אומרים \"הב הב\" ביפנית. איזה נושא היום?",
        "יוקוסו (ברוך הבא)! כמה מילים ביום, והסאקורה תפרח.",
        "איקימאשו (יאללה, בוא נצא לדרך)! בחר נושא ונתחיל.",
        "מאיניצ'י (כל יום) קצת תרגול, ובקרוב תדבר כמו מקומי!"
      ]
    },
    group: {
      en: "Pick a sub-topic. Ippo zutsu (one step at a time)!",
      he: "בחר תת-נושא. איפו זוצו (צעד אחרי צעד)!"
    },
    topic: {
      en: "Choose an exercise. Ganbatte (do your best)!",
      he: "בחר תרגיל. גאנבטה (תן את המיטב)!"
    },
    right: {
      en: ["Sugoi (amazing)!", "Yatta (yay, we did it)!", "Subarashii (wonderful)!", "Kanpeki (perfect)!", "Yoku dekimashita (well done)!", "Ii ne (nice one)!"],
      he: ["סוגוי (מדהים)!", "יאטה (יש, הצלחנו)!", "סובארשי (נפלא)!", "קנפקי (מושלם)!", "יוקו דקימשיטה (כל הכבוד)!", "אי נה (יפה מאוד)!"]
    },
    wrong: {
      en: ["Daijōbu (it's okay)! Let's try again.", "Almost! Mō ichido (one more time)!", "No worries, every sakura blooms in its own time.", "Ganbatte! You'll get it next time."],
      he: ["דאיג'ובו (זה בסדר)! ננסה שוב.", "כמעט! מו איצ'ידו (עוד פעם אחת)!", "לא נורא, כל סאקורה פורחת בזמן שלה.", "גאנבטה! בפעם הבאה תצליח."]
    },
    empty: {
      en: "I sniffed everywhere, but found nothing. Gomen ne (sorry)! Try another word?",
      he: "רחרחתי בכל מקום ולא מצאתי כלום. גומן נה (סליחה)! אולי מילה אחרת?"
    }
  },

  decorations: {
    // cherry-blossom branch across the top of the menu
    banner: '<svg viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin meet">' +
      '<defs>' +
        '<path id="ja-pt" d="M0 0C-4.6-2.6-5.8-7.6-3.2-10.4L0-8.6L3.2-10.4C5.8-7.6 4.6-2.6 0 0Z"/>' +
        '<g id="ja-bl"><g class="ja-petals" fill="#f7b3ca" stroke="#d9668f" stroke-width=".7">' +
          '<use href="#ja-pt"/><use href="#ja-pt" transform="rotate(72)"/><use href="#ja-pt" transform="rotate(144)"/><use href="#ja-pt" transform="rotate(216)"/><use href="#ja-pt" transform="rotate(288)"/></g>' +
          '<circle r="2.6" fill="#e0628f"/><g fill="#f6c146"><circle cx="0" cy="-4" r=".9"/><circle cx="3.8" cy="-1.2" r=".9"/><circle cx="2.4" cy="3.2" r=".9"/><circle cx="-2.4" cy="3.2" r=".9"/><circle cx="-3.8" cy="-1.2" r=".9"/></g></g>' +
        '<g id="ja-bd"><ellipse rx="3" ry="4.2" fill="#ec7fa6"/><path d="M-2.4 2.6L0 5.6 2.4 2.6" fill="#7aa33c"/></g>' +
      '</defs><g transform="translate(0 5)">' +
      '<g class="ja-branch" fill="none" stroke="#7a4a33" stroke-linecap="round">' +
        '<path d="M-6 9C40 6 80 22 130 18S230 4 280 12 360 20 406 6" stroke-width="5"/>' +
        '<path d="M58 13C66 22 78 28 92 32M150 16C160 26 170 30 186 34M232 8C244 18 256 22 268 22M300 15C312 26 326 30 338 31M96 19C102 12 110 8 118 6" stroke-width="2.6"/>' +
      '</g>' +
      '<g class="ja-leaf" fill="#8fb54a"><path d="M188 34c4-5 10-6 13-4-3 4-8 6-13 4z"/><path d="M118 6c3-4 8-5 11-3-3 3-7 5-11 3z"/><path d="M340 31c4-4 9-4 12-2-3 3-8 5-12 2z"/></g>' +
      '<use href="#ja-bl" x="24" y="10" transform="scale(1)"/>' +
      '<use href="#ja-bl" transform="translate(70 22) scale(1.15) rotate(20)"/>' +
      '<use href="#ja-bl" transform="translate(94 33) scale(.85)"/>' +
      '<use href="#ja-bl" transform="translate(122 17) scale(1.05) rotate(-15)"/>' +
      '<use href="#ja-bl" transform="translate(166 28) scale(1.2) rotate(10)"/>' +
      '<use href="#ja-bl" transform="translate(212 10) scale(.95) rotate(40)"/>' +
      '<use href="#ja-bl" transform="translate(252 21) scale(1.15)"/>' +
      '<use href="#ja-bl" transform="translate(296 13) scale(.9) rotate(-25)"/>' +
      '<use href="#ja-bl" transform="translate(322 28) scale(1.1) rotate(15)"/>' +
      '<use href="#ja-bl" transform="translate(372 13) scale(1) rotate(30)"/>' +
      '<use href="#ja-bd" transform="translate(46 15) rotate(-30)"/><use href="#ja-bd" transform="translate(142 25) rotate(25)"/>' +
      '<use href="#ja-bd" transform="translate(268 22) rotate(-70)"/><use href="#ja-bd" transform="translate(234 17) rotate(-15)"/><use href="#ja-bd" transform="translate(352 22) rotate(20)"/>' +
      '<g fill="#f7b3ca" opacity=".9"><use href="#ja-pt" transform="translate(40 44) rotate(-40) scale(.7)"/><use href="#ja-pt" transform="translate(140 52) rotate(60) scale(.6)"/>' +
        '<use href="#ja-pt" transform="translate(230 44) rotate(15) scale(.75)"/><use href="#ja-pt" transform="translate(350 50) rotate(-70) scale(.6)"/></g>' +
    '</g></svg>',

    // Mt Fuji now stands in the scene behind every screen, so no corner motif
    corner: '',

    // festival paper lanterns (chōchin) on a string, with blossoms
    results: '<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
        '<g id="ja-ln">' +
          '<path d="M0 -12v-6" stroke="currentColor" stroke-width="1.6"/>' +
          '<rect x="-7" y="-15" width="14" height="5" rx="1.5" fill="currentColor"/>' +
          '<ellipse cx="0" cy="6" rx="14" ry="17"/>' +
          '<g fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1.2"><path d="M-13 -3h26M-14 3h28M-14 9h28M-13 15h26"/><path d="M0 -11v34"/></g>' +
          '<ellipse cx="-6" cy="0" rx="3" ry="8" fill="#fff" opacity=".28"/>' +
          '<rect x="-7" y="21.5" width="14" height="5" rx="1.5" fill="currentColor"/>' +
          '<path d="M0 26.5v8" stroke="#f6c146" stroke-width="3" stroke-linecap="round"/>' +
        '</g>' +
        '<path id="ja-pt2" d="M0 0C-4.6-2.6-5.8-7.6-3.2-10.4L0-8.6L3.2-10.4C5.8-7.6 4.6-2.6 0 0Z"/>' +
      '</defs>' +
      '<path d="M-4 6Q100 46 204 6" fill="none" class="ja-string" stroke="#7a4a33" stroke-width="1.8"/>' +
      '<use href="#ja-ln" class="ja-cap" color="#2b2140" transform="translate(24 32) scale(.85)" fill="#e2452b"/>' +
      '<use href="#ja-ln" class="ja-cap" color="#2b2140" transform="translate(66 42)" fill="#f48fb1"/>' +
      '<use href="#ja-ln" class="ja-cap" color="#2b2140" transform="translate(134 42)" fill="#e2452b"/>' +
      '<use href="#ja-ln" class="ja-cap" color="#2b2140" transform="translate(176 32) scale(.85)" fill="#f48fb1"/>' +
      '<g fill="#f7b3ca" stroke="#d9668f" stroke-width=".6">' +
        '<use href="#ja-pt2" transform="translate(45 18)"/><use href="#ja-pt2" transform="translate(45 18) rotate(72)"/><use href="#ja-pt2" transform="translate(45 18) rotate(144)"/><use href="#ja-pt2" transform="translate(45 18) rotate(216)"/><use href="#ja-pt2" transform="translate(45 18) rotate(288)"/>' +
        '<use href="#ja-pt2" transform="translate(155 18)"/><use href="#ja-pt2" transform="translate(155 18) rotate(72)"/><use href="#ja-pt2" transform="translate(155 18) rotate(144)"/><use href="#ja-pt2" transform="translate(155 18) rotate(216)"/><use href="#ja-pt2" transform="translate(155 18) rotate(288)"/>' +
        '<use href="#ja-pt2" transform="translate(100 26) scale(.8)"/><use href="#ja-pt2" transform="translate(100 26) rotate(72) scale(.8)"/><use href="#ja-pt2" transform="translate(100 26) rotate(144) scale(.8)"/><use href="#ja-pt2" transform="translate(100 26) rotate(216) scale(.8)"/><use href="#ja-pt2" transform="translate(100 26) rotate(288) scale(.8)"/>' +
      '</g>' +
      '<g fill="#e0628f"><circle cx="45" cy="18" r="2.2"/><circle cx="155" cy="18" r="2.2"/><circle cx="100" cy="26" r="1.8"/></g>' +
      '<g fill="#f7b3ca" opacity=".9"><use href="#ja-pt2" transform="translate(12 84) rotate(-35) scale(.6)"/><use href="#ja-pt2" transform="translate(40 104) rotate(40) scale(.5)"/>' +
        '<use href="#ja-pt2" transform="translate(188 90) rotate(60) scale(.6)"/><use href="#ja-pt2" transform="translate(160 110) rotate(-20) scale(.5)"/></g>' +
    '</svg>',

    // a few sakura petals drifting down (styled and animated in css/themes/ja.css)
    ambient: '<i class="ja-petal"></i><i class="ja-petal"></i><i class="ja-petal"></i><i class="ja-petal"></i><i class="ja-petal"></i><i class="ja-petal"></i><i class="ja-petal"></i>',

    // ---- the world behind the screens (colors, positions and day/night switching in css/themes/ja.css) ----
    // sky: a golden sun and curly Japanese clouds by day; the tsukimi moon (with its rabbit) and stars by night
    sky: (function () {
      function kumo(n) {
        return '<div class="ja-cl ja-cl' + n + '" data-poke="cloud"><svg viewBox="0 0 200 64" xmlns="http://www.w3.org/2000/svg">' +
          '<path class="ja-cl-b" d="M16 52C5 52 3 40 13 38C11 26 27 22 35 30C39 16 59 12 67 24C75 8 103 6 111 22C119 12 139 14 141 28C151 20 169 24 167 36C181 34 191 46 181 52Z"/>' +
          '<path class="ja-cl-l" d="M58 40c-1-7 8-10 11-4c2 4-3 7-5 4M100 34c-1-8 10-11 13-4c2 5-4 8-6 4M140 42c0-6 8-8 10-3c1 4-4 5-5 3M22 46c0-5 7-6 8-2"/>' +
          '<rect class="ja-cl-b" x="118" y="49" width="80" height="7" rx="3.5"/><rect class="ja-cl-b" x="2" y="57" width="70" height="6" rx="3"/></svg></div>';
      }
      var stars = '';
      // every star can be tapped, except the two glints that sit in the moon's glow and beside the wind chime
      // (a tap there belongs to the moon / the chime)
      for (var i = 0; i < 12; i++) stars += i === 4 || i === 6 ? '<i class="ja-st"></i>' : '<i class="ja-st" data-poke="star"></i>';
      // tap reactions (css/themes/ja.css): the sun pulses and winks with a face that only shows when tapped,
      // the moon rabbit pounds its mochi, clouds puff, stars sparkle
      return '<div class="ja-day">' +
          '<div class="ja-sun" data-poke="sun"><svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
            '<defs><radialGradient id="ja-sung" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#fff3c4"/><stop offset=".55" stop-color="#ffd463"/><stop offset="1" stop-color="#f6b13a"/></radialGradient></defs>' +
            '<g class="ja-sun-h"><circle cx="50" cy="50" r="48" fill="#ffe9a6" opacity=".28"/><circle cx="50" cy="50" r="38" fill="#ffe39a" opacity=".38"/></g>' +
            '<g class="ja-sun-d"><circle cx="50" cy="50" r="28" fill="url(#ja-sung)"/>' +
              '<g class="ja-sun-f" fill="none" stroke="#b5651d" stroke-width="2.4" stroke-linecap="round">' +
                '<circle cx="41" cy="46" r="2.3" fill="#b5651d" stroke="none"/><path d="M55 46.5q3.5-3.5 7 0"/><path d="M42 56q8 6 16 0"/>' +
                '<ellipse cx="36" cy="54" rx="3.4" ry="2" fill="#ff9a8a" stroke="none" opacity=".7"/><ellipse cx="64" cy="54" rx="3.4" ry="2" fill="#ff9a8a" stroke="none" opacity=".7"/></g></g></svg></div>' +
          kumo(1) + kumo(2) + kumo(3) +
        '</div>' +
        '<div class="ja-night">' + stars +
          '<div class="ja-moon" data-poke="moon"><svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
            '<g class="ja-moon-h"><circle cx="50" cy="50" r="48" fill="#f6dd8f" opacity=".10"/><circle cx="50" cy="50" r="38" fill="#f6dd8f" opacity=".14"/></g>' +
            '<g class="ja-moon-d"><circle cx="50" cy="50" r="28" fill="#fcefc4"/>' +
            '<g fill="#ecd796"><circle cx="38" cy="38" r="4"/><circle cx="64" cy="66" r="3"/><circle cx="66" cy="36" r="2.2"/></g>' +
            // the moon rabbit (tsuki no usagi) and its mochi mortar; its mallet (kine) pounds when the moon is tapped
            '<g fill="#e3c97e"><ellipse cx="45" cy="60" rx="7.5" ry="6"/><circle cx="37.5" cy="61" r="2"/><circle cx="50.5" cy="52" r="4.6"/>' +
              '<path d="M48.5 49C46 41 47 37 49 38C51 40 50.5 45 50.5 49ZM51.5 49C53 41 56 38 57 40C57.5 43 54.5 46 53 49Z"/>' +
              '<path d="M56 61h12l-2 8h-8Z"/><g class="ja-moon-k"><path d="M52 55L61 49" stroke="#e3c97e" stroke-width="1.8" stroke-linecap="round"/><rect x="59" y="45" width="6" height="4" rx="1.5" transform="rotate(-34 62 47)"/></g></g>' +
            '<g class="ja-moon-m" fill="#fffaf0"><circle cx="60" cy="60" r="1.6"/><circle cx="66" cy="59" r="1.3"/><circle cx="63" cy="57" r="1.1"/></g></g>' +
          '</svg></div>' +
          kumo(4) + kumo(5) +
        '</div>';
    })(),

    // scene: Mt Fuji over misty hills; a castle and a sea of seigaiha waves on the left,
    // a red garden bridge, cherry trees, tiled-roof houses and bamboo on the right
    scene: (function () {
      // bamboo: all stalks, nodes and leaves as three compact paths (each leaf is a little lens shape)
      var R = Math.round, stalks = '', nodes = '', leaves = '', xs = [1110, 1122, 1135, 1149, 1162, 1176, 1190], tops = [74, 54, 84, 60, 76, 50, 68];
      function leaf(x, y, deg) {
        var a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), dx = R(c * 20), dy = R(s * 20);
        return 'M' + x + ' ' + y + 'q' + R(c * 10 - s * 4) + ' ' + R(s * 10 + c * 4) + ' ' + dx + ' ' + dy +
          'q' + R(-c * 10 + s * 4) + ' ' + R(-s * 10 - c * 4) + ' ' + (-dx) + ' ' + (-dy);
      }
      for (var i = 0; i < xs.length; i++) {
        var x = xs[i], t = tops[i];
        stalks += 'M' + x + ' 200V' + t;
        for (var y = 186; y > t + 10; y -= 20) nodes += 'M' + (x - 3) + ' ' + y + 'h6';
        leaves += leaf(x, t + 4, -30 - i * 7) + leaf(x, t + 22, i % 2 ? 20 : 160);
      }
      var bam = '<path class="ja-s-bam" d="' + stalks + '"/><path class="ja-s-bamn" d="' + nodes + '"/><path class="ja-s-bml" d="' + leaves + '"/>';
      return '<svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
          '<linearGradient id="ja-fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ja-s-fa"/><stop offset="1" class="ja-s-fb"/></linearGradient>' +
          '<g id="ja-sc"><path style="fill:var(--ja-sea)" d="M-12 0a12 12 0 0 1 24 0Z"/><path style="fill:none;stroke:var(--ja-sel);stroke-width:1.3" d="M-8.5 0a8.5 8.5 0 0 1 17 0M-5 0a5 5 0 0 1 10 0M-1.8 0a1.8 1.8 0 0 1 3.6 0"/></g>' +
          '<pattern id="ja-sp" width="24" height="12" patternUnits="userSpaceOnUse"><use href="#ja-sc" y="6"/><use href="#ja-sc" x="24" y="6"/><use href="#ja-sc" x="12" y="12"/><use href="#ja-sc" y="18"/><use href="#ja-sc" x="24" y="18"/><use href="#ja-sc" x="12" y="24"/></pattern>' +
          // koinobori: a carp streamer on its pole (families fly them in their gardens)
          '<g id="ja-cp"><path d="M0 0C12-5 30-4 38 0L46-5L43 3L46 11L38 6C30 10 12 11 0 6Z"/><path d="M13 0a3 3 0 0 1 0 6M21 0a3 3 0 0 1 0 6M29 1a2.5 2.5 0 0 1 0 5" fill="none" stroke="#fff" stroke-opacity=".55"/><circle cx="5" cy="2.6" r="1.6" fill="#fff"/></g>' +
          '<g id="ja-kb"><path style="stroke:var(--ja-trk);stroke-width:2.2" d="M0 2V124"/><circle r="2.6" style="fill:var(--sun)"/>' +
            '<use href="#ja-cp" x="1" y="6" style="fill:var(--ja-k1)"/><use href="#ja-cp" transform="translate(1 21) scale(.85)" style="fill:var(--ja-k2)"/><use href="#ja-cp" transform="translate(1 34) scale(.7)" style="fill:var(--ja-k3)"/></g>' +
          '<g id="ja-tr"><path style="fill:none;stroke:var(--ja-trk);stroke-width:3.5;stroke-linecap:round" d="M0 0C1-10-1-20-2-28M-1-22C-6-28-12-30-18-34M0-24C5-30 10-33 16-38"/>' +
            '<g style="fill:var(--ja-bl1)"><circle cx="-18" cy="-40" r="13"/><circle cy="-48" r="17"/><circle cx="17" cy="-42" r="13"/><circle cx="-6" cy="-33" r="10"/><circle cx="9" cy="-32" r="10"/></g>' +
            '<g style="fill:var(--ja-bl2)"><circle cx="-21" cy="-44" r="6.5"/><circle cx="-3" cy="-55" r="8.5"/><circle cx="14" cy="-47" r="6.5"/><circle cx="2" cy="-38" r="4"/></g></g>' +
          '<g id="ja-ca"><path style="fill:var(--ja-stone)" d="M-40 0L-32-14H32L40 0Z"/>' +
            '<g style="fill:var(--ja-wall)"><rect x="-28" y="-27" width="56" height="13"/><rect x="-19" y="-44" width="38" height="11"/><rect x="-11" y="-60" width="22" height="10"/></g>' +
            '<g style="fill:var(--ja-roof)"><path d="M-38-25Q-30-27-25-34H25Q30-27 38-25Z"/><path d="M-28-42Q-21-44-17-51H17Q21-44 28-42Z"/><path d="M-19-58Q-13-60-10-67H10Q13-60 19-58Z"/><path d="M-10-67L-6-71H6L10-67Z"/></g>' +
            '<path style="fill:var(--ja-wall)" d="M-7-46L0-52L7-46Z"/>' +
            '<g style="fill:var(--ja-win)"><rect x="-21" y="-23" width="5" height="4"/><rect x="-9" y="-23" width="5" height="4"/><rect x="4" y="-23" width="5" height="4"/><rect x="16" y="-23" width="5" height="4"/><rect x="-11" y="-41" width="4" height="4"/><rect x="7" y="-41" width="4" height="4"/><rect x="-2" y="-57" width="4" height="4"/></g></g>' +
          '<g id="ja-hs"><rect style="fill:var(--ja-hw)" x="-18" y="-20" width="36" height="20"/><path style="fill:var(--ja-roof)" d="M-26-18Q-20-20-16-30H16Q20-20 26-18Z"/>' +
            '<rect style="fill:var(--ja-win)" x="-12" y="-14" width="10" height="7"/><rect style="fill:var(--ja-door)" x="3" y="-14" width="9" height="14"/></g>' +
        '</defs>' +
        // far hills, Fuji, mist
        '<path class="ja-s-far" d="M0 128C60 112 120 106 180 108Q222 96 234 82Q240 77 246 82Q262 98 318 110C380 116 460 124 520 128H700C760 120 820 110 880 112Q930 104 960 86Q967 80 974 86Q1000 104 1060 104C1120 108 1160 116 1200 112V200H0Z"/>' +
        '<path class="ja-s-snow" d="M230 86Q240 75 250 86L245 85L240 89L235 85ZM956 90Q967 77 978 90L973 88L967 93L961 88Z"/>' +
        '<path fill="url(#ja-fg)" d="M330 160C430 120 520 70 572 32Q600 24 628 32C680 70 770 120 870 160Z"/>' +
        '<path class="ja-s-snow" d="M572 32Q600 24 628 32C640 41 652 50 664 59L652 56L644 66L632 58L620 70L608 60L598 72L588 61L576 69L566 57L556 63L548 56L536 59C548 50 560 41 572 32Z"/>' +
        '<path class="ja-s-snow2" d="M601 27L603 68L608 60L620 70L632 58L644 66L652 56L664 59C652 50 640 41 628 32Q615 28 601 27Z"/>' +
        '<g class="ja-s-mist"><rect x="430" y="100" width="150" height="7" rx="3.5"/><rect x="646" y="92" width="120" height="6" rx="3"/><rect x="520" y="118" width="190" height="8" rx="4"/><rect x="300" y="122" width="120" height="6" rx="3"/><rect x="800" y="120" width="140" height="6" rx="3"/></g>' +
        // middle hills with a castle, cherry trees, houses and bamboo
        '<path class="ja-s-mid" d="M0 148C70 140 150 128 240 130C320 132 380 146 470 150C560 154 640 150 720 148C820 145 880 132 980 132C1060 132 1120 140 1200 138V200H0Z"/>' +
        '<use href="#ja-ca" transform="translate(94 137) scale(.55)"/><use href="#ja-ca" transform="translate(152 132)"/>' +
        '<use href="#ja-tr" transform="translate(44 144) scale(.55)"/><use href="#ja-tr" transform="translate(212 134) scale(.6)"/><use href="#ja-tr" transform="translate(318 136) scale(.6)"/><use href="#ja-tr" transform="translate(500 152) scale(.5)"/>' +
        '<use href="#ja-tr" transform="translate(770 147) scale(.62)"/><use href="#ja-tr" transform="translate(880 138) scale(.55)"/>' +
        '<use href="#ja-hs" transform="translate(928 135)"/><use href="#ja-hs" transform="translate(970 133) scale(1.2)"/><use href="#ja-hs" transform="translate(1014 133)"/><use href="#ja-hs" transform="translate(1052 135) scale(.9)"/>' +
        '<g class="ja-s-lan"><rect x="989" y="104" width="1.2" height="5"/><ellipse cx="989.6" cy="112" rx="3.2" ry="4"/></g>' +
        bam +
        // two koinobori: one beside the houses (wide screens), one on the left of Fuji (phones and tablets only)
        '<use href="#ja-kb" transform="translate(1090 30) scale(-1 1)"/><use class="ja-s-ph" href="#ja-kb" x="432" y="30"/>' +
        // a festival string of paper lanterns over the bridge
        '<path class="ja-s-trk" style="stroke-width:2" d="M600 118V184M770 118V184"/><path class="ja-s-str" d="M600 120Q685 150 770 120"/>' +
        '<g class="ja-s-lan"><ellipse cx="625" cy="132" rx="3.4" ry="4.2"/><ellipse cx="655" cy="137.5" rx="3.4" ry="4.2"/><ellipse cx="685" cy="139.5" rx="3.4" ry="4.2"/><ellipse cx="715" cy="137.5" rx="3.4" ry="4.2"/><ellipse cx="745" cy="132" rx="3.4" ry="4.2"/></g>' +
        // near bank, seigaiha sea, pond and the red arched bridge
        '<path class="ja-s-near" d="M0 176C120 166 250 168 380 174C470 178 540 172 600 176C700 182 800 170 900 172C1000 174 1100 164 1200 168V200H0Z"/>' +
        '<path fill="url(#ja-sp)" d="M0 156C60 158 130 164 176 178C196 185 206 193 212 200H0Z"/>' +
        '<path class="ja-s-foam" d="M0 156C60 158 130 164 176 178C196 185 206 193 212 200"/>' +
        '<path class="ja-s-water" d="M598 200C606 188 640 182 685 182C730 182 764 188 772 200Z"/>' +
        '<path class="ja-s-rip" d="M630 192h22M700 189h30M664 197h40"/>' +
        '<path class="ja-s-br ja-s-ref" d="M612 199Q685 214 758 199"/>' +
        '<path class="ja-s-br" d="M609 170V181M647 158V168M685 154V164M723 158V168M761 170V181M628 176V200M742 176V200"/>' +
        '<path class="ja-s-br ja-s-deck" d="M585 192Q685 136 785 192"/><path class="ja-s-br" d="M587 182Q685 126 783 182"/>' +
        '<g class="ja-s-cap"><circle cx="609" cy="169" r="2.2"/><circle cx="647" cy="157" r="2.2"/><circle cx="685" cy="153" r="2.2"/><circle cx="723" cy="157" r="2.2"/><circle cx="761" cy="169" r="2.2"/></g>' +
        '<use class="ja-s-n" href="#ja-tr" transform="translate(442 180) scale(1.25)"/><use class="ja-s-n" href="#ja-tr" transform="translate(300 178) scale(.9)"/><use class="ja-s-n" href="#ja-tr" transform="translate(868 176) scale(1.05)"/><use class="ja-s-n" href="#ja-tr" transform="translate(1080 172) scale(.95)"/>' +
        '<g class="ja-s-bl1"><ellipse cx="410" cy="190" rx="3" ry="1.6"/><ellipse cx="480" cy="193" rx="2.6" ry="1.4"/><ellipse cx="560" cy="190" rx="2.4" ry="1.3"/></g>' +
      '</svg>';
    })(),

    // objects (wide screens only): a paper lantern and a wind chime (furin) hanging on strings from above,
    // a pair of origami cranes, a folding fan (sensu) and a hanami picnic of onigiri and green tea on the river bank
    // Tap reactions (css/themes/ja.css): the lantern swings, the wind chime rings, the cranes flap (3 taps: a loop),
    // the fan folds shut and opens again, the onigiri hops with a happy face. Surprises in onPoke below.
    objects: '<div class="ja-o ja-o-hang ja-o-lan" data-poke="lantern"><svg viewBox="0 0 60 84" xmlns="http://www.w3.org/2000/svg">' +
        '<g><circle class="ja-glow" cx="30" cy="44" r="28" fill="#ffb347"/>' +
          '<path d="M30 0V14" stroke="#7a4a33" stroke-width="1.6"/><rect x="21" y="12" width="18" height="6" rx="2" fill="#2b2140"/>' +
          '<ellipse cx="30" cy="44" rx="20" ry="26" fill="#e2452b"/>' +
          '<path d="M11 34h38M10 44h40M11 54h38M14 25h32M14 63h32" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="1.3"/>' +
          '<ellipse cx="30" cy="44" rx="8" ry="10" fill="#fff4e6" opacity=".9"/><circle cx="30" cy="44" r="3.4" fill="#f48fb1"/>' +
          '<ellipse cx="21" cy="38" rx="3.5" ry="11" fill="#fff" opacity=".25"/>' +
          '<rect x="21" y="68" width="18" height="6" rx="2" fill="#2b2140"/><path d="M30 74v9" stroke="#f4bf3e" stroke-width="3" stroke-linecap="round"/></g></svg></div>' +
      '<div class="ja-o ja-o-crane" data-poke="crane"><svg viewBox="0 0 100 64" xmlns="http://www.w3.org/2000/svg"><g id="ja-cr" transform="translate(34 14)">' +
        '<g class="ja-cr-w1"><path d="M32 26L50 3L42 30Z" fill="#f9cbd9"/><path d="M42 30L50 3L46 31Z" fill="#f3a8c0"/></g>' +
        '<path d="M20 31L32 24L46 31L33 37Z" fill="#ec8fb0"/><path d="M33 37L46 31L60 17L50 33Z" fill="#f3a8c0"/>' +
        '<path d="M22 31L11 13L15 13L27 30Z" fill="#f3a8c0"/><path d="M11 13L4 17L13 15Z" fill="#e2759b"/>' +
        '<path class="ja-cr-w2" d="M30 27L16 5L36 29Z" fill="#fbd9e4"/><path d="M33 37L32 24" stroke="#e2759b" stroke-width=".8"/></g><use href="#ja-cr" transform="translate(-14 -6) scale(.6)" opacity=".8"/></svg></div>' +
      '<div class="ja-o ja-o-hang ja-o-furin" data-poke="furin"><svg viewBox="0 0 40 76" xmlns="http://www.w3.org/2000/svg">' +
        '<g><path d="M20 0V14M20 30V44" stroke="#7a4a33" stroke-width="1.2"/>' +
          '<path d="M7 31C7 18 12 13 20 13C28 13 33 18 33 31Z" fill="#e7f0ff" stroke="#9fb3e6" stroke-width="1.4"/>' +
          '<path d="M10 27c3-2 5 1 8-1M22 21c3-2 5 1 8-1" fill="none" stroke="#5a73d0" stroke-width="1.4" stroke-linecap="round"/>' +
          '<circle cx="15" cy="21" r="2.4" fill="#f48fb1"/><circle cx="26" cy="27" r="2" fill="#e8674d"/><circle cx="20" cy="31" r="2" fill="#f4bf3e"/>' +
          '<g class="ja-fu-tz"><rect x="13" y="44" width="14" height="30" rx="2" fill="#fde3ec" stroke="#f3a8c0" stroke-width="1.2"/>' +
          '<path d="M17 52h6M17 58h6M17 64h4" stroke="#c84d81" stroke-width="1.4" stroke-linecap="round"/></g></g>' +
        // the "ring": tiny sparkles that only show when the chime is tapped
        '<g class="ja-fu-sp" fill="#f4bf3e"><path d="M3 12l1.2 3.3 3.3 1.2-3.3 1.2L3 21l-1.2-3.3L-1.5 16.5l3.3-1.2Z"/>' +
          '<path d="M38 18l1 2.6 2.6 1-2.6 1L38 25.2l-1-2.6-2.6-1 2.6-1Z"/><path d="M33 4l.8 2 2 .8-2 .8L33 9.6l-.8-2-2-.8 2-.8Z"/></g></svg></div>' +
      '<div class="ja-o ja-o-fan" data-poke="fan"><svg viewBox="0 0 64 44" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M3.8 27.7A30 30 0 0 1 60.2 27.7L39.5 35.3A8 8 0 0 0 24.5 35.3Z" fill="#fff4e6" stroke="#c79a7e" stroke-width="1.2"/>' +
        '<path d="M10.4 22.4A23 23 0 0 1 53.6 22.4" fill="none" stroke="#5a73d0" stroke-width="5" opacity=".75"/>' +
        '<path d="M32 38L3.8 27.7M32 38L9 18.7M32 38L18 12.2M32 38L32 8M32 38L46 12.2M32 38L55 18.7M32 38L60.2 27.7" stroke="#c79a7e" stroke-width=".9" opacity=".7"/>' +
        '<circle cx="24" cy="16" r="3.2" fill="#f48fb1"/><circle cx="40" cy="14" r="2.6" fill="#f7b3ca"/><circle cx="44" cy="22" r="2" fill="#f48fb1"/>' +
        '<rect x="29" y="34" width="6" height="9" rx="2" fill="#7a4a33"/></svg></div>' +
      '<div class="ja-o ja-o-pic" data-poke="picnic"><svg viewBox="0 0 76 46" xmlns="http://www.w3.org/2000/svg"><path d="M2 44L13 31H74L65 44Z" fill="#f29a8f"/><path d="M12 32.5L13 31H74L72.8 32.5Z" fill="#fff" opacity=".45"/><g transform="translate(14 3) scale(.7)">' +
        '<path class="ja-pic-st" d="M48 14c-3-4 3-6 0-10M55 14c-3-4 3-6 0-10" fill="none" stroke="#c9b8d8" stroke-width="1.6" stroke-linecap="round"/>' +
        '<path d="M42 19H62L59 44Q58 48 54 48H50Q46 48 45 44Z" fill="#8fb54a"/><ellipse cx="52" cy="19" rx="10" ry="2.6" fill="#d7ebc0"/>' +
        '<path d="M44 30H60" stroke="#6f9a32" stroke-width="1.4"/>' +
        '<g class="ja-pic-oni"><path d="M20 8C24 8 38 32 36 40C35 45 30 47 20 47C10 47 5 45 4 40C2 32 16 8 20 8Z" fill="#fffaf2" stroke="#dccbbb" stroke-width="1.4"/>' +
        '<path d="M10 36H30V46.6Q20 47.5 10 46.6Z" fill="#2f4a3e"/>' +
        '<g class="ja-pic-eo"><circle cx="15" cy="28" r="1.5" fill="#2b2140"/><circle cx="25" cy="28" r="1.5" fill="#2b2140"/></g>' +
        // happy closed eyes (^ ^) and a big open smile, shown only while the onigiri hops
        '<g class="ja-pic-eh" fill="none" stroke="#2b2140" stroke-width="1.3" stroke-linecap="round"><path d="M13 29q2-3 4 0M23 29q2-3 4 0"/><path d="M17.5 31.2h5q-.4 3-2.5 3t-2.5-3Z" fill="#e5596f" stroke-width="1"/></g>' +
        '<path class="ja-pic-sm" d="M18 31q2 2 4 0" fill="none" stroke="#2b2140" stroke-width="1.2" stroke-linecap="round"/>' +
        '<ellipse cx="12" cy="31.5" rx="2.2" ry="1.3" fill="#ff98b0" opacity=".7"/><ellipse cx="28" cy="31.5" rx="2.2" ry="1.3" fill="#ff98b0" opacity=".7"/></g></g></svg></div>'
  },

  // Hidden surprises when a world piece is tapped several times in a row (taps within 2 s of each other):
  //   moon x3    -> shooting stars (nagareboshi) streak across the night sky
  //   cloud x5   -> the cloud lets go a shower of sakura petals (hanafubuki)
  //   lantern x3 -> two hanabi fireworks burst in the side skies
  //   crane x3   -> a flock of paper cranes flies across the sky
  // Each one is a temporary element in #theme-layer that is removed when it ends; only one copy of each at a time.
  // Skipped entirely when the learner prefers reduced motion.
  onPoke: (function () {
    var busy = {};
    // the flock's crane: the same folds as the objects' crane, with tone classes (ja-sp-t1..t4) so the light
    // world can give it deeper rose paper that stands out on the pink sky (css/themes/ja.css)
    var CRANE = '<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2 1)">' +
      '<g class="ja-sp-w1"><path class="ja-sp-t1" d="M32 26L50 3L42 30Z" fill="#f9cbd9"/><path class="ja-sp-t2" d="M42 30L50 3L46 31Z" fill="#f3a8c0"/></g>' +
      '<path class="ja-sp-t3" d="M20 31L32 24L46 31L33 37Z" fill="#ec8fb0"/><path class="ja-sp-t2" d="M33 37L46 31L60 17L50 33Z" fill="#f3a8c0"/>' +
      '<path class="ja-sp-t2" d="M22 31L11 13L15 13L27 30Z" fill="#f3a8c0"/><path class="ja-sp-t4" d="M11 13L4 17L13 15Z" fill="#e2759b"/>' +
      '<path class="ja-sp-w2 ja-sp-t0" d="M30 27L16 5L36 29Z" fill="#fbd9e4"/></g></svg>';
    function r(a, b) { return a + Math.random() * (b - a); }
    function px(n) { return Math.round(n) + 'px'; }
    // add a temporary surprise layer, removed (and unlocked) after ms
    function spawn(name, layer, cls, html, ms) {
      busy[name] = true;
      var box = document.createElement('div');
      box.className = 'ja-sp ' + cls;
      box.setAttribute('aria-hidden', 'true');
      box.innerHTML = html;
      layer.appendChild(box);
      setTimeout(function () {
        if (box.parentNode) box.parentNode.removeChild(box);
        busy[name] = false;
      }, ms);
    }
    function shootingStars(layer) {
      var W = window.innerWidth, H = window.innerHeight, h = '';
      for (var i = 0; i < 4; i++) {
        h += '<i class="ja-sp-ss" style="left:' + px(W * r(.45, .92)) + ';top:' + px(H * r(.02, .2)) +
          ';width:' + px(r(90, 150)) + ';animation-delay:' + (i * .42).toFixed(2) + 's"></i>';
      }
      return h;
    }
    function petals(el) {
      var b = el.getBoundingClientRect(), h = '';
      for (var i = 0; i < 18; i++) {
        var s = r(10, 16);
        h += '<i class="ja-sp-pt" style="left:' + px(b.left + b.width * r(.08, .92)) + ';top:' + px(b.top + b.height * r(.45, .8)) +
          ';width:' + px(s) + ';height:' + px(s) + ';--ja-dx:' + px(r(-70, 70)) + ';--ja-dy:' + px(window.innerHeight * r(.22, .42)) +
          ';--ja-rt:' + Math.round(r(-320, 320)) + 'deg;animation-duration:' + r(2.1, 2.8).toFixed(2) + 's;animation-delay:' + r(0, .6).toFixed(2) + 's"></i>';
      }
      return h;
    }
    function hanabi(layer, dark) {
      // each burst is centred in the free side margin (window edge to the 728px card column) and shrunk to fit it,
      // so on narrow desktops (about 900-1100px) no spark disappears behind a card
      var W = layer.clientWidth || window.innerWidth, H = window.innerHeight, h = '';
      var side = Math.max(60, (W - 728) / 2), s = Math.min(1, Math.max(.45, (side / 2 - 6) / 81));
      var sets = dark ? [['#ffb347', '#ffe08a'], ['#ff8fb8', '#9fb3ff']] : [['#e2452b', '#f4bf3e'], ['#e0628f', '#5a73d0']];
      var spots = [[W - side / 2, H * .44, 0], [side / 2, H * .24, .7]];
      for (var k = 0; k < 2; k++) {
        var x = spots[k][0], y = spots[k][1], d = spots[k][2], c = sets[k];
        h += '<div class="ja-sp-hb" style="left:' + px(x) + ';top:' + px(y) + '">' +
          '<i class="ja-sp-rk" style="background:' + c[1] + ';--ja-rise:' + px(H * .8 - y) + ';animation-delay:' + d + 's"></i>';
        // an outer ring of streaks and an inner ring of round sparks: a kiku (chrysanthemum) burst
        for (var j = 0; j < 16; j++) {
          h += '<i class="ja-sp-ray" style="transform:rotate(' + (j * 22.5) + 'deg)"><b style="background:' + c[j % 2] +
            ';--ja-sp-r:' + px((j % 2 ? 50 : 66) * s) + ';animation-delay:' + (d + .55) + 's"></b></i>';
        }
        for (j = 0; j < 8; j++) {
          h += '<i class="ja-sp-ray" style="transform:rotate(' + (j * 45 + 22.5) + 'deg)"><b class="ja-sp-dot" style="background:' + c[1 - j % 2] +
            ';--ja-sp-r:' + px(28 * s) + ';animation-delay:' + (d + .62) + 's"></b></i>';
        }
        h += '</div>';
      }
      return h;
    }
    function flock() {
      var H = window.innerHeight, top = H * r(.07, .11), h = '';
      var v = [[0, 0], [.28, -22], [.28, 22], [.56, -44], [.56, 44]];
      for (var i = 0; i < v.length; i++) {
        h += '<i class="ja-sp-cr" style="top:' + px(top + v[i][1]) + ';animation-delay:' + v[i][0] + 's"><span style="animation-delay:-' + (i * .2).toFixed(1) + 's">' + CRANE + '</span></i>';
      }
      return h;
    }
    return function (name, info) {
      if (!info || info.reduced || !info.layer || busy[name]) return;
      var want = { moon: 3, cloud: 5, lantern: 3, crane: 3 };
      if (!want[name] || info.taps !== want[name]) return;
      if (name === 'moon') spawn(name, info.layer, 'ja-sp-stars', shootingStars(info.layer), 2800);
      else if (name === 'cloud') spawn(name, info.layer, 'ja-sp-fubuki', petals(info.el), 3700);
      else if (name === 'lantern') spawn(name, info.layer, 'ja-sp-hanabi', hanabi(info.layer, info.dark), 3200);
      else if (name === 'crane') spawn(name, info.layer, 'ja-sp-flock', flock(), 4800);
    };
  })(),

  confetti: ["#f48fb1", "#e2452b", "#2d3f8f", "#f6c146", "#5f9a3a", "#9a7fd0"]
});
