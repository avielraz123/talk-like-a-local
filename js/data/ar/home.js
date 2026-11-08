// Home: rooms, furniture, in the kitchen, everyday objects.
TLAP_ADD("ar", {
  "group": {"id": "g-home", "level": "beginner", "icon": "🏠", "title": {"en": "Home", "he": "בית"}},
  "lessons": [
    {
      "id": "rooms", "kind": "vocab", "icon": "🚪",
      "title": {"en": "Rooms", "he": "חדרים"},
      "intro": {
        "en": "A room is ōda, from Turkish oda (MSA: ghurfa). Many houses have a flat roof, the sateḥ, used for water tanks, drying laundry and cool summer evenings.",
        "he": "חדר הוא ōda, מהטורקית oda (בערבית ספרותית: ghurfa). לבתים רבים יש גג שטוח, sateḥ, שמשמש לדודי מים, לייבוש כביסה ולערבי קיץ קרירים."
      },
      "items": [
        ["بيت", "bēt", "house / home", "בית"],
        ["شقة", "sha''a", "apartment", "דירה"],
        ["أوضة", "ōda", "room", "חדר"],
        ["أوضة نوم", "ōdit nōm", "bedroom", "חדר שינה"],
        ["صالون", "sālōn", "living room", "סלון"],
        ["مطبخ", "matbakh", "kitchen", "מטבח"],
        ["حمام", "ḥammām", "bathroom", "חדר אמבטיה"],
        ["برندة", "baranda", "balcony", "מרפסת"],
        ["درج", "daraj", "stairs", "מדרגות"],
        ["سطح", "sateḥ", "roof", "גג"],
        ["باب", "bāb", "door", "דלת"],
        ["شباك", "shubbāk", "window", "חלון"],
        ["حيط", "ḥēt", "wall", "קיר"],
        ["أرض", "ard", "floor", "רצפה"],
        ["سقف", "sa'f", "ceiling", "תקרה"],
        ["تواليت", "twalēt", "toilet", "שירותים"]
      ]
    },
    {
      "id": "furniture", "kind": "vocab", "icon": "🛋️",
      "title": {"en": "Furniture", "he": "רהיטים"},
      "intro": {
        "en": "A sofa is kanabāye (from French canapé) and a bed is takht, a word borrowed from Persian. When guests stay the night, extra mattresses (farshe) and pillows (mkhadde) come out.",
        "he": "ספה היא kanabāye (מהצרפתית canapé) ומיטה היא takht, מילה שאולה מפרסית. כשאורחים נשארים לישון, מוציאים מזרנים (farshe) וכריות (mkhadde) נוספים."
      },
      "items": [
        ["كنباية", "kanabāye", "sofa", "ספה"],
        ["كرسي", "kursi", "chair", "כיסא"],
        ["طاولة", "tāwle", "table", "שולחן"],
        ["تخت", "takht", "bed", "מיטה"],
        ["خزانة", "khzāne", "closet / wardrobe", "ארון"],
        ["جارور", "jārūr", "drawer", "מגירה"],
        ["رف", "raff", "shelf", "מדף"],
        ["مراية", "mrāye", "mirror", "מראה"],
        ["مخدة", "mkhadde", "pillow", "כרית"],
        ["حرام", "ḥrām", "blanket", "שמיכה"],
        ["فرشة", "farshe", "mattress", "מזרן"],
        ["سجادة", "sijjāde", "rug / carpet", "שטיח"],
        ["برداية", "bardāye", "curtain", "וילון"],
        ["لمبة", "lamba", "lamp / light bulb", "מנורה / נורה"],
        ["تلفزيون", "talfizyōn", "TV", "טלוויזיה"],
        ["مكيف", "mkayyif", "air conditioner", "מזגן"]
      ]
    },
    {
      "id": "kitchen", "kind": "vocab", "icon": "🍳",
      "title": {"en": "In the kitchen", "he": "במטבח"},
      "intro": {
        "en": "Careful, Hebrew speakers: the Israeli \"finjan\" is the little coffee pot, but in Arabic that pot is a rakwe, and a finjān is the small cup you drink from. In Lebanon and Syria the fridge is usually barrād.",
        "he": "זהירות, דוברי עברית: ה\"פינג'אן\" הישראלי הוא קנקן הקפה הקטן, אבל בערבית הקנקן הזה נקרא rakwe, ו-finjān הוא הספל הקטן שממנו שותים. בלבנון ובסוריה המקרר נקרא בדרך כלל barrād."
      },
      "items": [
        ["تلاجة", "tallāje", "fridge", "מקרר", {"lit": ["ice box (from talj = ice)", "ארגז קרח (מ-talj = קרח)"]}],
        ["غاز", "ghāz", "stove", "כיריים", {"lit": ["gas", "גז"]}],
        ["فرن", "furn", "oven", "תנור"],
        ["طنجرة", "tanjara", "pot", "סיר"],
        ["مقلاية", "ma'lāye", "frying pan", "מחבת"],
        ["إبريق", "ibrī'", "kettle / teapot", "קומקום"],
        ["ركوة", "rakwe", "coffee pot (for Arabic coffee)", "פינג'אן (קנקן לקפה)"],
        ["مجلى", "majla", "kitchen sink", "כיור"],
        ["حنفية", "ḥanafiyye", "tap / faucet", "ברז"],
        ["صينية", "sēniyye", "tray", "מגש"],
        ["مصفاية", "misfāye", "strainer", "מסננת"],
        ["خلاط", "khallāt", "blender", "בלנדר"],
        ["غسالة صحون", "ghassālit sḥūn", "dishwasher", "מדיח כלים"],
        ["سلة زبالة", "sallit zbāle", "trash can", "פח אשפה"]
      ]
    },
    {
      "id": "objects", "kind": "vocab", "icon": "🔑",
      "title": {"en": "Everyday objects", "he": "חפצים יומיומיים"},
      "intro": {
        "en": "Many everyday words are borrowed and given an Arabic shape: tilifōn, rīmōt, battāriyye. To turn on the light say walli3 id-daww, and to turn it off, taffi id-daww.",
        "he": "הרבה מילים יומיומיות שאולות משפות אחרות וקיבלו צורה ערבית: tilifōn, rīmōt, battāriyye. כדי לבקש להדליק את האור אומרים walli3 id-daww, וכדי לכבות, taffi id-daww."
      },
      "items": [
        ["مفتاح", "muftāḥ", "key", "מפתח"],
        ["تلفون", "tilifōn", "phone", "טלפון"],
        ["شاحن", "shāḥin", "charger", "מטען"],
        ["صابون", "sābūn", "soap", "סבון"],
        ["منشفة", "minshafe", "towel", "מגבת"],
        ["فرشاية سنان", "furshāyit snān", "toothbrush", "מברשת שיניים"],
        ["معجون سنان", "ma3jūn snān", "toothpaste", "משחת שיניים"],
        ["مشط", "misht", "comb", "מסרק"],
        ["شمسية", "shamsiyye", "umbrella", "מטרייה"],
        ["شمعة", "sham3a", "candle", "נר"],
        ["ولاعة", "wallā3a", "lighter", "מצית"],
        ["مقص", "ma'ass", "scissors", "מספריים"],
        ["بطارية", "battāriyye", "battery", "סוללה"],
        ["ريموت", "rīmōt", "remote control", "שלט"],
        ["علبة", "3ilbe", "box / can", "קופסה"],
        ["مكنسة", "maknase", "broom", "מטאטא"]
      ]
    }
  ]
});
