/* Arabic (spoken Levantine) theme. Mascot: Hudhud the hoopoe (هدهد). See docs/theme-format.md. */
TLAP_THEME("ar", {
  name: { en: "Arabic", he: "ערבית" },
  native: "العربية",
  flag: "🫒",
  tagline: { target: "احكي زي أهل البلد!", en: "Talk like a local!", he: "לדבר כמו מקומי!" },
  mascot: {
    name: { en: "Hudhud the hoopoe", he: "הודהוד הדוכיפת" },
    svg: function (mood) {
      var INK = '#4a2e1c', BODY = '#e9a066', BELLY = '#f8dcb4', WING = '#2f2724', BAR = '#fbf1dc', BEAK = '#3b302b';
      var cheer = mood === 'cheer', sad = mood === 'sad';
      var ROOT_X = 61, ROOT_Y = 30;

      /* one crest feather: cinnamon, then a white band, then a black tip */
      function feather(a, L) {
        function finger(len, fill) {
          var w = 5, n = function (v) { return Math.round(v * 10) / 10; };
          return '<path fill="' + fill + '" d="M' + n(-w * 0.5) + ' 3C' + n(-w * 0.6) + ' ' + n(-len * 0.4) + ' ' + (-w) + ' ' + n(-len * 0.55) + ' ' + (-w) + ' ' + n(-len * 0.8) +
            'C' + (-w) + ' ' + n(-len * 1.03) + ' ' + w + ' ' + n(-len * 1.03) + ' ' + w + ' ' + n(-len * 0.8) +
            'C' + w + ' ' + n(-len * 0.55) + ' ' + n(w * 0.6) + ' ' + n(-len * 0.4) + ' ' + n(w * 0.5) + ' 3Z"/>';
        }
        return '<g transform="translate(' + ROOT_X + ' ' + ROOT_Y + ') rotate(' + a + ')">' +
          finger(L, WING) + finger(L * 0.85, BAR) + finger(L * 0.74, BODY) + '</g>';
      }
      var crestSet = cheer
        ? [[-84, 25], [-62, 31], [-40, 35], [-18, 36], [4, 34], [26, 28], [46, 20]]
        : sad
          ? [[-112, 21], [-102, 25], [-92, 27], [-82, 24]]
          : [[-70, 25], [-50, 30], [-30, 32], [-10, 31], [10, 26], [28, 19]];
      var crest = '';
      crestSet.forEach(function (c) { crest += feather(c[0], c[1]); });
      crest = '<g class="' + (sad ? '' : 'm-wag') + '" style="transform-origin:' + ROOT_X + 'px ' + (ROOT_Y + 2) + 'px;transform-box:view-box">' +
        '<g stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round">' + crest.replace(/fill="[^"]+"/g, 'fill="' + INK + '"') + '</g>' +
        crest.replace(new RegExp('fill="' + BODY + '"', 'g'), 'fill="' + BODY + '" stroke="#c97c45" stroke-width=".9"') + '</g>';

      /* tail and wing (striped, like a real hoopoe) */
      var tail = '<g class="' + (cheer || sad ? '' : 'm-wag') + '" style="transform-origin:38px 92px;transform-box:view-box">' +
        '<path fill="' + WING + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round" d="M40 86L12 90C7 95 7 102 12 106L42 100Z"/>' +
        '<path fill="none" stroke="' + BAR + '" stroke-width="4.2" d="M22 88.6L22.6 104.6"/></g>';
      var wingShape = 'M60 70C45 64 30 71 24 90C34 97 50 96 62 89C66 81 65 74 60 70Z';
      var wingBars = '<path fill="none" stroke="' + BAR + '" stroke-width="3.6" stroke-linecap="round" d="M33 77Q37 84 36 93M43 71Q48 80 47 94M53 69.5Q58 78 57 91"/>';
      var wingBody = '<path fill="' + WING + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round" d="' + wingShape + '"/>' + wingBars;
      var wing = sad ? '<g transform="rotate(-6 60 74)">' + wingBody + '</g>' : cheer ? '' : wingBody;
      /* cheer: the wing opens up and waves, showing its bold black and white bars */
      var openWing = !cheer ? '' :
        '<g class="m-wag" style="transform-origin:48px 80px;transform-box:view-box">' +
        '<path fill="' + WING + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round" d="M52 82C42 66 28 52 9 41Q9 49 14 53Q11 58 18 62Q16 67 24 70Q24 76 32 78Q34 83 42 86Z"/>' +
        '<path fill="none" stroke="' + BAR + '" stroke-width="4" stroke-linecap="round" d="M17.5 49.5L13.5 55M25.5 56L20.5 63M33.5 63L28.5 71M41.5 70L37 78.5"/></g>';
      /* face */
      var eyes;
      if (cheer) {
        eyes = '<path fill="none" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round" d="M57 48Q62.5 41 68 48M73.5 48Q79.5 40.5 85.5 48"/>';
      } else if (sad) {
        eyes = '<circle fill="#fff" cx="63" cy="48" r="7"/><circle fill="#fff" cx="79" cy="48" r="7.6"/>' +
          '<circle fill="#2b2220" cx="63.5" cy="50" r="4.2"/><circle fill="#2b2220" cx="79.5" cy="50" r="4.6"/>' +
          '<circle fill="#fff" cx="65" cy="48.6" r="1.3"/><circle fill="#fff" cx="81.2" cy="48.6" r="1.4"/>' +
          '<path fill="' + BODY + '" d="M55 46.5Q63 39 71 45.5V39H55ZM71.5 45Q79.5 38.5 87.5 46.5V38H71.5Z"/>' +
          '<path fill="none" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" d="M56 44.5Q62 41 69 41.5M89 44.5Q83 41 76 41.5"/>' +
          '<path class="ar-tear" fill="#5fb3e8" stroke="#2a76ad" stroke-width=".8" d="M76 57c1.8 3 2.6 4.3 2.6 5.4a2.6 2.6 0 0 1-5.2 0c0-1.1.8-2.4 2.6-5.4Z"/>';
      } else {
        eyes = '<circle fill="#fff" cx="63" cy="47" r="7.4"/><circle fill="#fff" cx="79" cy="47" r="8"/>' +
          '<circle fill="#2b2220" cx="64.6" cy="47.4" r="4.6"/><circle fill="#2b2220" cx="81" cy="47.4" r="5"/>' +
          '<circle fill="#fff" cx="66.2" cy="45.4" r="1.6"/><circle fill="#fff" cx="82.8" cy="45.3" r="1.8"/>';
      }
      var upper = '<path fill="' + BEAK + '" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round" d="M84 52Q101 52 116 64Q101 59 86 59Z"/>';
      var beak = cheer
        ? '<path fill="#e5546f" d="M86 58L110 63L86 62Z"/>' +
          '<g transform="rotate(-9 86 55)">' + upper + '</g>' +
          '<path fill="' + BEAK + '" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round" d="M86 59Q99 62 110 70Q98 67 86 64Z"/>'
        : '<g transform="rotate(' + (sad ? 14 : 0) + ' 86 55)">' + upper + '</g>';
      var cheeks = '<ellipse fill="#f27a7a" opacity=".45" cx="' + (cheer ? 82 : 84) + '" cy="58" rx="5" ry="3"/><ellipse fill="#f27a7a" opacity=".45" cx="58.5" cy="57" rx="3.6" ry="2.6"/>';

      var head = '<g transform="' + (sad ? 'rotate(8 66 66) translate(0 3)' : cheer ? 'rotate(-4 66 66)' : '') + '">' +
        crest +
        '<circle fill="' + BODY + '" stroke="' + INK + '" stroke-width="2" cx="70" cy="50" r="22"/>' +
        '<path fill="' + BODY + '" d="M' + (ROOT_X - 6) + ' ' + (ROOT_Y + 3) + 'Q' + ROOT_X + ' ' + (ROOT_Y - 4) + ' ' + (ROOT_X + 7) + ' ' + (ROOT_Y + 2) + 'L' + (ROOT_X + 4) + ' ' + (ROOT_Y + 7) + 'Z"/>' +
        cheeks + eyes + beak + '</g>';

      var legs = '<path fill="none" stroke="#7d6656" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M51 103V112M47 113.5H55M65 103V112M61 113.5H69"/>';
      var body = '<ellipse fill="' + BODY + '" stroke="' + INK + '" stroke-width="2" cx="57" cy="84" rx="28" ry="22"/>' +
        '<ellipse fill="' + BELLY + '" cx="64" cy="90" rx="16.5" ry="13"/>';

      var inner = tail + openWing + legs + body + wing + head;
      var bodyGroup = sad ? '<g transform="translate(0 2)">' + inner + '</g>' : '<g class="m-bob">' + inner + '</g>';
      return '<svg class="ar-hudhud mood-' + mood + '" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<g transform="translate(5 8) scale(.9)"><ellipse fill="#2f2a22" opacity=".12" cx="58" cy="114" rx="26" ry="3.6"/>' + bodyGroup + '</g></svg>';
    }
  },
  lines: {
    intro: {
      en: "مرحبا marḥaba (hello)! I'm Hudhud the hoopoe. When my feather crown goes up, I'm happy, and I'm always happy to teach real spoken Arabic, the way people chat over a finjān of coffee. Yalla (let's go)!",
      he: "مرحبا (מרחבא, שלום)! אני הודהוד הדוכיפת. כשכתר הנוצות שלי מזדקף, אני שמח, ואני תמיד שמח ללמד ערבית מדוברת אמיתית, כמו שמדברים על פינג'אן קפה. יאללה!"
    },
    greet: {
      en: [
        "Ahlan w sahlan (welcome)! Pour yourself some coffee and pick a topic.",
        "Yalla, yalla! A few minutes a day and you'll be chatting in no time.",
        "Shwayy shwayy (little by little). Every word counts!",
        "Marḥaba! My crest is up, so you know I'm excited. What are we learning today?",
        "Tamām (great), you're back! Let's keep going."
      ],
      he: [
        "אהלן וסהלן (ברוך הבא)! תמזוג לעצמך קפה ותבחר נושא.",
        "יאללה, יאללה! כמה דקות ביום ותתחיל לדבר בלי לשים לב.",
        "שוי שוי (לאט לאט). כל מילה חשובה!",
        "מרחבא! כתר הנוצות שלי זקוף, אז אתה יודע שאני מתרגש. מה לומדים היום?",
        "תמאם (מעולה), חזרת! בוא נמשיך."
      ]
    },
    group: {
      en: "Pick a sub-topic. Shwayy shwayy, one small lesson at a time!",
      he: "בחר תת-נושא. שוי שוי, שיעור קטן אחד בכל פעם!"
    },
    topic: {
      en: "Choose an exercise. Yalla, let's practice!",
      he: "בחר תרגיל. יאללה, בוא נתרגל!"
    },
    right: {
      en: ["Brāvo! (well done)", "Ya salām! (wow!)", "Tamām! Perfect.", "Shātir! (clever!)", "Brāvo 3aleik! My crest is dancing!"],
      he: ["בראבו! (כל הכבוד)", "יא סלאם! (וואו!)", "תמאם! מושלם.", "שאטר! (חכם!)", "בראבו עליך! כתר הנוצות שלי רוקד!"]
    },
    wrong: {
      en: ["Wala yhimmak (never mind). Try again!", "Ma3lesh (it's okay), you'll get it next time.", "Almost! Kamān marra (one more time)?", "Shwayy shwayy. Every mistake teaches us something."],
      he: ["ולא יהמך (לא נורא). נסה שוב!", "מעלש (זה בסדר), בפעם הבאה תצליח.", "כמעט! כמאן מרה (עוד פעם)?", "שוי שוי. כל טעות מלמדת אותנו משהו."]
    },
    empty: {
      en: "Wala yhimmak! I couldn't find that word. Maybe try another spelling?",
      he: "ולא יהמך! לא מצאתי את המילה. אולי לנסות איות אחר?"
    }
  },
  decorations: {
    banner: '<svg viewBox="0 0 400 60" preserveAspectRatio="xMidYMin meet"><path class="ar-stem" d="M186 17Q100 40 4 12 M214 17Q300 40 396 12"/><path class="ar-twig" d="M147.7 24.7l-3.4 6"/><ellipse class="ar-olive" cx="144.3" cy="35.2" rx="3.9" ry="5"/><circle fill="#fff" opacity=".55" cx="143" cy="33.3" r="1.2"/><path class="ar-twig" d="M147.7 24.7l5.4 5"/><ellipse class="ar-olive2" cx="153.1" cy="34.1" rx="3.5" ry="4.5"/><circle fill="#fff" opacity=".5" cx="152" cy="32.4" r="1"/><path class="ar-twig" d="M97.5 27.2l-3.4 6"/><ellipse class="ar-olive2" cx="94.1" cy="37.8" rx="3.9" ry="5"/><circle fill="#fff" opacity=".55" cx="92.8" cy="35.9" r="1.2"/><path class="ar-twig" d="M45.8 21.9l-3.4 6"/><ellipse class="ar-olive" cx="42.4" cy="32.4" rx="3.9" ry="5"/><circle fill="#fff" opacity=".55" cx="41.1" cy="30.5" r="1.2"/><path class="ar-twig" d="M45.8 21.9l5.4 5"/><ellipse class="ar-olive2" cx="51.2" cy="31.3" rx="3.5" ry="4.5"/><circle fill="#fff" opacity=".5" cx="50.1" cy="29.6" r="1"/><path class="ar-twig" d="M252.3 24.7l3.4 6"/><ellipse class="ar-olive" cx="255.7" cy="35.2" rx="3.9" ry="5"/><circle fill="#fff" opacity=".55" cx="254.4" cy="33.3" r="1.2"/><path class="ar-twig" d="M252.3 24.7l-5.4 5"/><ellipse class="ar-olive2" cx="246.9" cy="34.1" rx="3.5" ry="4.5"/><circle fill="#fff" opacity=".5" cx="245.8" cy="32.4" r="1"/><path class="ar-twig" d="M302.5 27.2l3.4 6"/><ellipse class="ar-olive2" cx="305.9" cy="37.8" rx="3.9" ry="5"/><circle fill="#fff" opacity=".55" cx="304.6" cy="35.9" r="1.2"/><path class="ar-twig" d="M354.2 21.9l3.4 6"/><ellipse class="ar-olive" cx="357.6" cy="32.4" rx="3.9" ry="5"/><circle fill="#fff" opacity=".55" cx="356.3" cy="30.5" r="1.2"/><path class="ar-twig" d="M354.2 21.9l-5.4 5"/><ellipse class="ar-olive2" cx="348.8" cy="31.3" rx="3.5" ry="4.5"/><circle fill="#fff" opacity=".5" cx="347.7" cy="29.6" r="1"/><path class="ar-leaf" transform="translate(177.4 19.2) rotate(130.7)" d="M0 0Q8.5 -4.6 18.8 0Q8.5 4.6 0 0Z"/><path class="ar-leaf2" transform="translate(165.8 21.7) rotate(204.9)" d="M0 0Q7.4 -4.6 16.5 0Q7.4 4.6 0 0Z"/><path class="ar-leaf" transform="translate(154.2 23.7) rotate(135.2)" d="M0 0Q7.3 -4.6 16.3 0Q7.3 4.6 0 0Z"/><path class="ar-leaf" transform="translate(142.5 25.3) rotate(209.4)" d="M0 0Q8.1 -4.6 18 0Q8.1 4.6 0 0Z"/><path class="ar-leaf2" transform="translate(130.7 26.4) rotate(139.6)" d="M0 0Q7.1 -4.6 15.7 0Q7.1 4.6 0 0Z"/><path class="ar-leaf" transform="translate(118.8 27.1) rotate(213.8)" d="M0 0Q7 -4.6 15.5 0Q7 4.6 0 0Z"/><path class="ar-leaf" transform="translate(106.8 27.4) rotate(143.9)" d="M0 0Q7.7 -4.6 17.2 0Q7.7 4.6 0 0Z"/><path class="ar-leaf2" transform="translate(94.8 27.2) rotate(-141.9)" d="M0 0Q6.7 -4.6 14.9 0Q6.7 4.6 0 0Z"/><path class="ar-leaf" transform="translate(82.6 26.5) rotate(-211.9)" d="M0 0Q6.6 -4.6 14.7 0Q6.6 4.6 0 0Z"/><path class="ar-leaf" transform="translate(70.4 25.4) rotate(-137.8)" d="M0 0Q7.4 -4.6 16.4 0Q7.4 4.6 0 0Z"/><path class="ar-leaf2" transform="translate(58 23.8) rotate(-207.8)" d="M0 0Q6.4 -4.6 14.1 0Q6.4 4.6 0 0Z"/><path class="ar-leaf" transform="translate(45.6 21.8) rotate(-133.8)" d="M0 0Q6.2 -4.6 13.9 0Q6.2 4.6 0 0Z"/><path class="ar-leaf" transform="translate(33.1 19.4) rotate(-203.9)" d="M0 0Q7 -4.6 15.6 0Q7 4.6 0 0Z"/><path class="ar-leaf2" transform="translate(20.5 16.5) rotate(-130.1)" d="M0 0Q6 -4.6 13.3 0Q6 4.6 0 0Z"/><path class="ar-leaf" transform="translate(7.8 13.1) rotate(-200.3)" d="M0 0Q5.9 -4.6 13.1 0Q5.9 4.6 0 0Z"/><path class="ar-leaf" transform="translate(222.6 19.2) rotate(-22.7)" d="M0 0Q8.5 -4.6 18.8 0Q8.5 4.6 0 0Z"/><path class="ar-leaf2" transform="translate(234.2 21.7) rotate(47.1)" d="M0 0Q7.4 -4.6 16.5 0Q7.4 4.6 0 0Z"/><path class="ar-leaf" transform="translate(245.8 23.7) rotate(-27.2)" d="M0 0Q7.3 -4.6 16.3 0Q7.3 4.6 0 0Z"/><path class="ar-leaf" transform="translate(257.5 25.3) rotate(42.6)" d="M0 0Q8.1 -4.6 18 0Q8.1 4.6 0 0Z"/><path class="ar-leaf2" transform="translate(269.3 26.4) rotate(-31.6)" d="M0 0Q7.1 -4.6 15.7 0Q7.1 4.6 0 0Z"/><path class="ar-leaf" transform="translate(281.2 27.1) rotate(38.2)" d="M0 0Q7 -4.6 15.5 0Q7 4.6 0 0Z"/><path class="ar-leaf" transform="translate(293.2 27.4) rotate(-35.9)" d="M0 0Q7.7 -4.6 17.2 0Q7.7 4.6 0 0Z"/><path class="ar-leaf2" transform="translate(305.2 27.2) rotate(33.9)" d="M0 0Q6.7 -4.6 14.9 0Q6.7 4.6 0 0Z"/><path class="ar-leaf" transform="translate(317.4 26.5) rotate(-40.1)" d="M0 0Q6.6 -4.6 14.7 0Q6.6 4.6 0 0Z"/><path class="ar-leaf" transform="translate(329.6 25.4) rotate(29.8)" d="M0 0Q7.4 -4.6 16.4 0Q7.4 4.6 0 0Z"/><path class="ar-leaf2" transform="translate(342 23.8) rotate(-44.2)" d="M0 0Q6.4 -4.6 14.1 0Q6.4 4.6 0 0Z"/><path class="ar-leaf" transform="translate(354.4 21.8) rotate(25.8)" d="M0 0Q6.2 -4.6 13.9 0Q6.2 4.6 0 0Z"/><path class="ar-leaf" transform="translate(366.9 19.4) rotate(-48.1)" d="M0 0Q7 -4.6 15.6 0Q7 4.6 0 0Z"/><path class="ar-leaf2" transform="translate(379.5 16.5) rotate(22.1)" d="M0 0Q6 -4.6 13.3 0Q6 4.6 0 0Z"/><path class="ar-leaf" transform="translate(392.2 13.1) rotate(-51.7)" d="M0 0Q5.9 -4.6 13.1 0Q5.9 4.6 0 0Z"/><path fill="#1f6aa0" class="ar-med" d="M200 3L204.4 7.4L210.6 7.4L210.6 13.6L215 18L210.6 22.4L210.6 28.6L204.4 28.6L200 33L195.6 28.6L189.4 28.6L189.4 22.4L185 18L189.4 13.6L189.4 7.4L195.6 7.4Z"/><path fill="#ecbc4f" d="M204 8.3L205.7 12.3L209.7 14L208 18L209.7 22L205.7 23.7L204 27.7L200 26L196 27.7L194.3 23.7L190.3 22L192 18L190.3 14L194.3 12.3L196 8.3L200 10Z"/><path fill="#c4553a" d="M204.2 19.8L201.8 22.2L198.2 22.2L195.8 19.8L195.8 16.2L198.2 13.8L201.8 13.8L204.2 16.2Z"/></svg>',
    corner: '<svg viewBox="0 0 120 120"><ellipse class="ar-shadow" cx="62" cy="111" rx="46" ry="5"/><path fill="#c48d33" stroke="#7a5320" stroke-width="1.6" stroke-linejoin="round" d="M42 74C30 70 24 60 19 48L11 41C10 39 12 37 14 38L24 44C29 53 35 60 45 64Z"/><path fill="#d9a441" stroke="#7a5320" stroke-width="1.4" stroke-linejoin="round" d="M11 41.5C7 37 8 32 12.5 30.5C11.5 34 13.5 37.5 17 40Z"/><path fill="none" stroke="#f6d78a" stroke-width="1.6" stroke-linecap="round" d="M23 49c4 7 9 13 16 16" opacity=".8"/><path fill="none" stroke="#7a5320" stroke-width="6.5" stroke-linecap="round" d="M58 57C75 56 81 71 72 84C68 90 66 95 65 100"/><path fill="none" stroke="#c48d33" stroke-width="3.6" stroke-linecap="round" d="M58 57C75 56 81 71 72 84C68 90 66 95 65 100"/><path fill="#d9a441" stroke="#7a5320" stroke-width="1.8" stroke-linejoin="round" d="M33 106C29 92 36 81 45 74H55C64 81 71 92 67 106Z"/><path fill="none" stroke="#a8742a" stroke-width="1.4" d="M32.5 96H67.5M31.5 100H68.5"/><path fill="#a8742a" d="M50 79l3 4-3 4-3-4z" opacity=".8"/><path fill="none" stroke="#fbe3a2" stroke-width="2.6" stroke-linecap="round" d="M40 85c-2 4-3 8-2.5 12" opacity=".9"/><rect fill="#a8742a" stroke="#7a5320" stroke-width="1.6" x="31" y="105" width="38" height="5" rx="2.5"/><rect fill="#a8742a" stroke="#7a5320" stroke-width="1.4" x="43" y="70" width="14" height="5" rx="2"/><path fill="#d9a441" stroke="#7a5320" stroke-width="1.8" stroke-linejoin="round" d="M44 71C37 67 36 60 40 56H60C64 60 63 67 56 71Z"/><path fill="none" stroke="#fbe3a2" stroke-width="2" stroke-linecap="round" d="M42.5 60c0 3 1 5 3 7" opacity=".9"/><rect fill="#a8742a" stroke="#7a5320" stroke-width="1.4" x="39" y="51.5" width="22" height="5" rx="2.5"/><path fill="#d9a441" stroke="#7a5320" stroke-width="1.8" stroke-linejoin="round" d="M42.5 51.5C42.5 43 45.5 37 50 34.5C54.5 37 57.5 43 57.5 51.5Z"/><path fill="none" stroke="#fbe3a2" stroke-width="1.8" stroke-linecap="round" d="M46 48c0-4 1-7 3-9" opacity=".9"/><circle fill="#c48d33" stroke="#7a5320" stroke-width="1.4" cx="50" cy="32" r="3.2"/><path fill="#d9a441" stroke="#7a5320" stroke-width="1.3" stroke-linejoin="round" d="M47.6 29.5L50 17.5 52.4 29.5Z"/><circle fill="#c48d33" stroke="#7a5320" stroke-width="1.2" cx="50" cy="16.5" r="2.1"/><g class="ar-steam" fill="none" stroke="#b8a68a" stroke-width="2" stroke-linecap="round" opacity=".7"><path d="M89 88c-3-4 3-6 0-10s3-6 0-9"/><path d="M96 89c-3-4 3-6 0-10"/></g><path fill="#fffaf0" stroke="#7a5320" stroke-width="1.6" stroke-linejoin="round" d="M81 95H103C102 103 98 109.5 92 109.5S82 103 81 95Z"/><path fill="#1f6aa0" d="M82 98.5H102C101.7 100 101.3 101 101 102H83C82.7 101 82.3 100 82 98.5Z"/><path fill="#c4553a" d="M89.5 105l2.5-2 2.5 2-2.5 2z"/><ellipse fill="#7a4a24" stroke="#7a5320" stroke-width="1.2" cx="92" cy="95" rx="11" ry="2.4"/></svg>',
    results: '<svg viewBox="0 0 200 120"><path class="ar-cord" fill="none" d="M2 3Q50 16 100 8T198 3"/><g class="ar-sway" style="transform-origin:16px 6px;animation-delay:0s"><path class="ar-cord" d="M16 6V12"/><g transform="translate(16 12)"><circle class="ar-glow" cy="25" r="21"/><circle class="ar-glow" cy="25" r="16"/><circle class="ar-glow" cy="25" r="11"/><path fill="#c4553a" d="M-9 13H-3.5V38H-9L-11.5 26Z"/><path fill="#1f6aa0" d="M3.5 13H9L11.5 26 9 38H3.5Z"/><path fill="#fff3c4" d="M-3.5 13H3.5V38H-3.5Z"/><path fill="#ecbc4f" d="M0 22.6L1 23.6L2.4 23.6L2.4 25L3.4 26L2.4 27L2.4 28.4L1 28.4L0 29.4L-1 28.4L-2.4 28.4L-2.4 27L-3.4 26L-2.4 25L-2.4 23.6L-1 23.6Z"/><g stroke="#7a5320" stroke-width="1.3" stroke-linejoin="round"><circle fill="none" cy="1.5" r="2"/><path fill="none" d="M-9 13H9L11.5 26 9 38H-9L-11.5 26ZM-3.5 13V38M3.5 13V38M-11.5 26H11.5"/><path fill="#c48d33" d="M-7 10Q0-1 7 10ZM-7 41H7L0 49Z"/><path fill="#a8742a" d="M-9.5 9.5h19v3.5h-19zM-9.5 37.5h19v3.5h-19z"/></g><path stroke="#c4553a" stroke-width="2" stroke-linecap="round" d="M0 49V55"/><circle fill="#c4553a" cy="56" r="2"/></g></g><g class="ar-sway" style="transform-origin:46px 10px;animation-delay:-1.1s"><path class="ar-cord" d="M46 10V34"/><g transform="translate(46 34)"><circle class="ar-glow" cy="25" r="21"/><circle class="ar-glow" cy="25" r="16"/><circle class="ar-glow" cy="25" r="11"/><path fill="#1f6aa0" d="M-9 13H-3.5V38H-9L-11.5 26Z"/><path fill="#5b7a1e" d="M3.5 13H9L11.5 26 9 38H3.5Z"/><path fill="#fff3c4" d="M-3.5 13H3.5V38H-3.5Z"/><path fill="#ecbc4f" d="M0 22.6L1 23.6L2.4 23.6L2.4 25L3.4 26L2.4 27L2.4 28.4L1 28.4L0 29.4L-1 28.4L-2.4 28.4L-2.4 27L-3.4 26L-2.4 25L-2.4 23.6L-1 23.6Z"/><g stroke="#7a5320" stroke-width="1.3" stroke-linejoin="round"><circle fill="none" cy="1.5" r="2"/><path fill="none" d="M-9 13H9L11.5 26 9 38H-9L-11.5 26ZM-3.5 13V38M3.5 13V38M-11.5 26H11.5"/><path fill="#c48d33" d="M-7 10Q0-1 7 10ZM-7 41H7L0 49Z"/><path fill="#a8742a" d="M-9.5 9.5h19v3.5h-19zM-9.5 37.5h19v3.5h-19z"/></g><path stroke="#c4553a" stroke-width="2" stroke-linecap="round" d="M0 49V55"/><circle fill="#c4553a" cy="56" r="2"/></g></g><g class="ar-sway" style="transform-origin:156px 10px;animation-delay:-0.6s"><path class="ar-cord" d="M156 10V30"/><g transform="translate(156 30)"><circle class="ar-glow" cy="25" r="21"/><circle class="ar-glow" cy="25" r="16"/><circle class="ar-glow" cy="25" r="11"/><path fill="#a3243d" d="M-9 13H-3.5V38H-9L-11.5 26Z"/><path fill="#1f6aa0" d="M3.5 13H9L11.5 26 9 38H3.5Z"/><path fill="#fff3c4" d="M-3.5 13H3.5V38H-3.5Z"/><path fill="#ecbc4f" d="M0 22.6L1 23.6L2.4 23.6L2.4 25L3.4 26L2.4 27L2.4 28.4L1 28.4L0 29.4L-1 28.4L-2.4 28.4L-2.4 27L-3.4 26L-2.4 25L-2.4 23.6L-1 23.6Z"/><g stroke="#7a5320" stroke-width="1.3" stroke-linejoin="round"><circle fill="none" cy="1.5" r="2"/><path fill="none" d="M-9 13H9L11.5 26 9 38H-9L-11.5 26ZM-3.5 13V38M3.5 13V38M-11.5 26H11.5"/><path fill="#c48d33" d="M-7 10Q0-1 7 10ZM-7 41H7L0 49Z"/><path fill="#a8742a" d="M-9.5 9.5h19v3.5h-19zM-9.5 37.5h19v3.5h-19z"/></g><path stroke="#c4553a" stroke-width="2" stroke-linecap="round" d="M0 49V55"/><circle fill="#c4553a" cy="56" r="2"/></g></g><g class="ar-sway" style="transform-origin:185px 5px;animation-delay:-1.7s"><path class="ar-cord" d="M185 5V9"/><g transform="translate(185 9)"><circle class="ar-glow" cy="25" r="21"/><circle class="ar-glow" cy="25" r="16"/><circle class="ar-glow" cy="25" r="11"/><path fill="#5b7a1e" d="M-9 13H-3.5V38H-9L-11.5 26Z"/><path fill="#c4553a" d="M3.5 13H9L11.5 26 9 38H3.5Z"/><path fill="#fff3c4" d="M-3.5 13H3.5V38H-3.5Z"/><path fill="#ecbc4f" d="M0 22.6L1 23.6L2.4 23.6L2.4 25L3.4 26L2.4 27L2.4 28.4L1 28.4L0 29.4L-1 28.4L-2.4 28.4L-2.4 27L-3.4 26L-2.4 25L-2.4 23.6L-1 23.6Z"/><g stroke="#7a5320" stroke-width="1.3" stroke-linejoin="round"><circle fill="none" cy="1.5" r="2"/><path fill="none" d="M-9 13H9L11.5 26 9 38H-9L-11.5 26ZM-3.5 13V38M3.5 13V38M-11.5 26H11.5"/><path fill="#c48d33" d="M-7 10Q0-1 7 10ZM-7 41H7L0 49Z"/><path fill="#a8742a" d="M-9.5 9.5h19v3.5h-19zM-9.5 37.5h19v3.5h-19z"/></g><path stroke="#c4553a" stroke-width="2" stroke-linecap="round" d="M0 49V55"/><circle fill="#c4553a" cy="56" r="2"/></g></g><path class="ar-twinkle" style="animation-delay:0s;transform-origin:30px 92px" fill="#ecbc4f" d="M30 87.5L31.3 88.8L33.2 88.8L33.2 90.7L34.5 92L33.2 93.3L33.2 95.2L31.3 95.2L30 96.5L28.7 95.2L26.8 95.2L26.8 93.3L25.5 92L26.8 90.7L26.8 88.8L28.7 88.8Z"/><path class="ar-twinkle" style="animation-delay:0.8s;transform-origin:75px 22px" fill="#ecbc4f" d="M75 18.5L76 19.5L77.5 19.5L77.5 21L78.5 22L77.5 23L77.5 24.5L76 24.5L75 25.5L74 24.5L72.5 24.5L72.5 23L71.5 22L72.5 21L72.5 19.5L74 19.5Z"/><path class="ar-twinkle" style="animation-delay:1.6s;transform-origin:128px 20px" fill="#ecbc4f" d="M128 16L129.2 17.2L130.8 17.2L130.8 18.8L132 20L130.8 21.2L130.8 22.8L129.2 22.8L128 24L126.8 22.8L125.2 22.8L125.2 21.2L124 20L125.2 18.8L125.2 17.2L126.8 17.2Z"/><path class="ar-twinkle" style="animation-delay:2.2s;transform-origin:172px 96px" fill="#ecbc4f" d="M172 91.5L173.3 92.8L175.2 92.8L175.2 94.7L176.5 96L175.2 97.3L175.2 99.2L173.3 99.2L172 100.5L170.7 99.2L168.8 99.2L168.8 97.3L167.5 96L168.8 94.7L168.8 92.8L170.7 92.8Z"/><path class="ar-twinkle" style="animation-delay:1.1s;transform-origin:100px 112px" fill="#ecbc4f" d="M100 109L100.9 109.9L102.1 109.9L102.1 111.1L103 112L102.1 112.9L102.1 114.1L100.9 114.1L100 115L99.1 114.1L97.9 114.1L97.9 112.9L97 112L97.9 111.1L97.9 109.9L99.1 109.9Z"/></svg>',
    ambient: '<i class="ar-amb" style="left:6%;top:18%;width:18px;height:18px;animation-delay:-0s"><svg viewBox="0 0 20 20"><path fill="#ecbc4f" d="M10 0.5L12.8 3.3L16.7 3.3L16.7 7.2L19.5 10L16.7 12.8L16.7 16.7L12.8 16.7L10 19.5L7.2 16.7L3.3 16.7L3.3 12.8L0.5 10L3.3 7.2L3.3 3.3L7.2 3.3Z"/></svg></i><i class="ar-amb" style="left:88%;top:12%;width:14px;height:14px;animation-delay:-2.5s"><svg viewBox="0 0 20 20"><path fill="#1f6aa0" d="M10 0.5L12.8 3.3L16.7 3.3L16.7 7.2L19.5 10L16.7 12.8L16.7 16.7L12.8 16.7L10 19.5L7.2 16.7L3.3 16.7L3.3 12.8L0.5 10L3.3 7.2L3.3 3.3L7.2 3.3Z"/></svg></i><i class="ar-amb" style="left:14%;top:62%;width:12px;height:12px;animation-delay:-5s"><svg viewBox="0 0 20 20"><path fill="#c4553a" d="M10 0.5L12.8 3.3L16.7 3.3L16.7 7.2L19.5 10L16.7 12.8L16.7 16.7L12.8 16.7L10 19.5L7.2 16.7L3.3 16.7L3.3 12.8L0.5 10L3.3 7.2L3.3 3.3L7.2 3.3Z"/></svg></i><i class="ar-amb" style="left:92%;top:48%;width:20px;height:20px;animation-delay:-1.2s"><svg viewBox="0 0 20 20"><path fill="#5b7a1e" d="M10 0.5L12.8 3.3L16.7 3.3L16.7 7.2L19.5 10L16.7 12.8L16.7 16.7L12.8 16.7L10 19.5L7.2 16.7L3.3 16.7L3.3 12.8L0.5 10L3.3 7.2L3.3 3.3L7.2 3.3Z"/></svg></i><i class="ar-amb" style="left:50%;top:86%;width:13px;height:13px;animation-delay:-3.6s"><svg viewBox="0 0 20 20"><path fill="#a3243d" d="M10 0.5L12.8 3.3L16.7 3.3L16.7 7.2L19.5 10L16.7 12.8L16.7 16.7L12.8 16.7L10 19.5L7.2 16.7L3.3 16.7L3.3 12.8L0.5 10L3.3 7.2L3.3 3.3L7.2 3.3Z"/></svg></i><i class="ar-amb" style="left:78%;top:80%;width:16px;height:16px;animation-delay:-6.2s"><svg viewBox="0 0 20 20"><path fill="#ecbc4f" d="M10 0.5L12.8 3.3L16.7 3.3L16.7 7.2L19.5 10L16.7 12.8L16.7 16.7L12.8 16.7L10 19.5L7.2 16.7L3.3 16.7L3.3 12.8L0.5 10L3.3 7.2L3.3 3.3L7.2 3.3Z"/></svg></i><i class="ar-amb" style="left:30%;top:36%;width:11px;height:11px;animation-delay:-4.4s"><svg viewBox="0 0 20 20"><path fill="#1f6aa0" d="M10 0.5L12.8 3.3L16.7 3.3L16.7 7.2L19.5 10L16.7 12.8L16.7 16.7L12.8 16.7L10 19.5L7.2 16.7L3.3 16.7L3.3 12.8L0.5 10L3.3 7.2L3.3 3.3L7.2 3.3Z"/></svg></i>'
  },
  confetti: ["#56751b", "#c35238", "#ecbc4f", "#1f6aa0", "#a3243d", "#93a86a"]
});
