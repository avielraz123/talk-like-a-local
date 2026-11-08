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

    // Mt Fuji with mist bands and little waves
    corner: '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="ja-fuji" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ja-fuji-a" stop-color="#4a63c4"/><stop offset="1" class="ja-fuji-b" stop-color="#2d3f8f"/></linearGradient></defs>' +
      '<circle cx="92" cy="30" r="10" class="ja-moon" fill="#f6c146" opacity=".85"/>' +
      '<path d="M4 108L46 44C52 36 66 36 72 44L116 108Z" fill="url(#ja-fuji)"/>' +
      '<path d="M46 44C52 36 66 36 72 44L80.3 56.5L75 53.5L70 60L64.5 54.5L59 61L53.5 54.5L48 60L43.5 53.6L38 56.6Z" fill="#fbf7f4"/>' +
      '<path d="M54 40.5C57 38.6 61 38.6 64 40.5" fill="none" stroke="#dfe5fb" stroke-width="1.6" stroke-linecap="round"/>' +
      '<g class="ja-mist" fill="#f7b3ca"><rect x="12" y="74" width="44" height="7" rx="3.5"/><rect x="62" y="84" width="46" height="7" rx="3.5"/><rect x="26" y="88" width="24" height="5" rx="2.5" opacity=".8"/></g>' +
      '<path d="M0 110h120v10H0z" class="ja-sea" fill="#2d3f8f"/>' +
      '<g fill="none" class="ja-wave" stroke="#a9b8f2" stroke-width="1.8" stroke-linecap="round">' +
        '<path d="M2 112a8 8 0 0 1 16 0M22 112a8 8 0 0 1 16 0M42 112a8 8 0 0 1 16 0M62 112a8 8 0 0 1 16 0M82 112a8 8 0 0 1 16 0M102 112a8 8 0 0 1 16 0"/>' +
        '<path d="M6 112a4 4 0 0 1 8 0M26 112a4 4 0 0 1 8 0M46 112a4 4 0 0 1 8 0M66 112a4 4 0 0 1 8 0M86 112a4 4 0 0 1 8 0M106 112a4 4 0 0 1 8 0"/></g>' +
      '<g fill="#f48fb1"><path transform="translate(22 30) rotate(-30) scale(.7)" d="M0 0C-4.6-2.6-5.8-7.6-3.2-10.4L0-8.6L3.2-10.4C5.8-7.6 4.6-2.6 0 0Z"/>' +
        '<path transform="translate(108 58) rotate(50) scale(.6)" d="M0 0C-4.6-2.6-5.8-7.6-3.2-10.4L0-8.6L3.2-10.4C5.8-7.6 4.6-2.6 0 0Z"/></g>' +
    '</svg>',

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
    ambient: '<i class="ja-petal"></i><i class="ja-petal"></i><i class="ja-petal"></i><i class="ja-petal"></i><i class="ja-petal"></i><i class="ja-petal"></i><i class="ja-petal"></i>'
  },

  confetti: ["#f48fb1", "#e2452b", "#2d3f8f", "#f6c146", "#5f9a3a", "#9a7fd0"]
});
