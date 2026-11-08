// City & travel: places, transport, directions, hotel & airport, getting around, conversation.
TLAP_ADD({
  "group": {"id": "g-city", "level": "intermediate", "icon": "🏙️", "title": {"en": "City & travel", "he": "עיר וטיולים"}},
  "lessons": [
    {
      "id": "places", "kind": "vocab", "icon": "🏛️",
      "title": {"en": "Places in the city", "he": "מקומות בעיר"},
      "intro": {
        "en": "Iranian cities are built around big squares (meydân) and long streets (khiyâbân). The small side streets are called kuche, and an address usually lists them in order: street, then side street, then house number.",
        "he": "ערים באיראן בנויות סביב כיכרות גדולות (meydân) ורחובות ארוכים (khiyâbân). הרחובות הצדדיים הקטנים נקראים kuche, וכתובת בדרך כלל מפרטת אותם לפי הסדר: רחוב, אחר כך רחוב צדדי, ואז מספר הבית."
      },
      "items": [
        ["بانک", "bânk", "bank", "בנק"],
        ["اداره‌ی پست", "edâre-ye post", "post office", "סניף דואר"],
        ["مسجد", "masjed", "mosque", "מסגד"],
        ["پارک", "pârk", "park", "פארק"],
        ["موزه", "muze", "museum", "מוזיאון"],
        ["سینما", "sinamâ", "cinema", "קולנוע"],
        ["نانوایی", "nânvâyi", "bakery", "מאפייה"],
        ["مغازه", "maghâze", "shop", "חנות"],
        ["کلانتری", "kalântari", "police station", "תחנת משטרה"],
        ["کتابخانه", "ketâbkhâne", "library", "ספרייה"],
        ["میدان", "meydân", "square (in a city)", "כיכר"],
        ["پل", "pol", "bridge", "גשר"],
        ["کافه", "kâfe", "café", "בית קפה"],
        ["شهر", "shahr", "city", "עיר"],
        ["کوچه", "kuche", "alley / side street", "סמטה"],
        ["پمپ بنزین", "pomp-e benzin", "gas station", "תחנת דלק"]
      ]
    },
    {
      "id": "transport", "kind": "vocab", "icon": "🚆",
      "title": {"en": "Transport", "he": "תחבורה"},
      "intro": {
        "en": "To ask a taxi driver to stop, just say: haminjâ piyâde mishavam (\"I'll get off right here\"). savâr shodan means to get on (a bus, a taxi, a horse...), and piyâde shodan means to get off.",
        "he": "כדי לבקש מנהג המונית לעצור, פשוט אומרים: haminjâ piyâde mishavam (\"אני יורד כאן\"). savâr shodan פירושו לעלות (על אוטובוס, מונית, סוס...), ו-piyâde shodan פירושו לרדת."
      },
      "items": [
        ["قطار", "ghatâr", "train", "רכבת"],
        ["هواپیما", "havâpeymâ", "airplane", "מטוס"],
        ["تاکسی", "tâksi", "taxi", "מונית"],
        ["مترو", "metro", "metro / subway", "רכבת תחתית"],
        ["دوچرخه", "docharkhe", "bicycle", "אופניים"],
        ["موتورسیکلت", "motorsiklet", "motorcycle", "אופנוע"],
        ["کشتی", "kashti", "ship", "ספינה"],
        ["قایق", "ghâyegh", "boat", "סירה"],
        ["کامیون", "kâmiyon", "truck", "משאית"],
        ["جاده", "jâdde", "road (between towns)", "כביש (בין ערים)"],
        ["مسافر", "mosâfer", "passenger / traveler", "נוסע"],
        ["ترافیک", "terâfik", "traffic jam", "פקק תנועה"],
        ["پیاده", "piyâde", "on foot", "ברגל"],
        ["سوار شدن", "savâr shodan", "to get on / to ride", "לעלות (על כלי רכב)", {"form": ["سوار می‌شوم", "savâr mishavam"]}],
        ["پیاده شدن", "piyâde shodan", "to get off", "לרדת (מכלי רכב)", {"form": ["پیاده می‌شوم", "piyâde mishavam"]}],
        ["رانندگی کردن", "rânandegi kardan", "to drive", "לנהוג", {"form": ["رانندگی می‌کنم", "rânandegi mikonam"]}]
      ]
    },
    {
      "id": "directions", "kind": "vocab", "icon": "🧭",
      "title": {"en": "Directions", "he": "כיוונים"},
      "intro": {
        "en": "Words like kenâr (next to), posht (behind) and jelo (in front) link to the next word with ezâfe: kenâr-e hotel = next to the hotel, jelo-ye bânk = in front of the bank.",
        "he": "מילים כמו kenâr (ליד), posht (מאחורי) ו-jelo (מקדימה) מתחברות למילה הבאה באזאפה: kenâr-e hotel = ליד המלון, jelo-ye bânk = מול הבנק."
      },
      "items": [
        ["نزدیک", "nazdik", "near", "קרוב"],
        ["دور", "dur", "far", "רחוק"],
        ["کنار", "kenâr", "next to / beside", "ליד"],
        ["پشت", "posht", "behind", "מאחורי"],
        ["جلو", "jelo", "in front (of)", "לפני / מקדימה"],
        ["بالا", "bâlâ", "up / upstairs", "למעלה"],
        ["پایین", "pâyin", "down / downstairs", "למטה"],
        ["داخل", "dâkhel", "inside", "בפנים"],
        ["بیرون", "birun", "outside", "בחוץ"],
        ["گوشه", "gushe", "corner", "פינה"],
        ["روبه‌رو", "ruberu", "opposite / across from", "ממול"],
        ["بین", "beyn", "between", "בין"],
        ["چهارراه", "chahârrâh", "intersection", "צומת"],
        ["بانک کنار هتل است", "bânk kenâr-e hotel ast", "The bank is next to the hotel", "הבנק ליד המלון"],
        ["مستقیم بروید", "mostaghim beravid", "Go straight ahead", "לך ישר"],
        ["به چپ بپیچید", "be chap bepichid", "Turn left", "פנה שמאלה"]
      ]
    },
    {
      "id": "hotel_airport", "kind": "vocab", "icon": "🛄",
      "title": {"en": "Hotel & airport", "he": "מלון ושדה תעופה"},
      "intro": {
        "en": "The official word for passport is gozarnâme, but most people simply say pâsport. Both are understood everywhere.",
        "he": "המילה הרשמית לדרכון היא gozarnâme, אבל רוב האנשים פשוט אומרים pâsport. שתיהן מובנות בכל מקום."
      },
      "items": [
        ["گذرنامه", "gozarnâme", "passport", "דרכון"],
        ["چمدان", "chamedân", "suitcase", "מזוודה"],
        ["اتاق یک‌نفره", "otâgh-e yeknafare", "single room", "חדר ליחיד"],
        ["اتاق دونفره", "otâgh-e donafare", "double room", "חדר זוגי"],
        ["رزرو", "rezerv", "reservation", "הזמנה (של מקום)"],
        ["پذیرش", "paziresh", "reception (desk)", "קבלה (במלון)"],
        ["پرواز", "parvâz", "flight", "טיסה"],
        ["کارت پرواز", "kârt-e parvâz", "boarding pass", "כרטיס עלייה למטוס"],
        ["ورود", "vorud", "arrival / entry", "הגעה / כניסה"],
        ["خروج", "khoruj", "departure / exit", "יציאה"],
        ["ویزا", "vizâ", "visa", "ויזה"],
        ["گمرک", "gomrok", "customs", "מכס"],
        ["من رزرو دارم", "man rezerv dâram", "I have a reservation", "יש לי הזמנה"],
        ["یک اتاق برای دو شب می‌خواهم", "yek otâgh barâye do shab mikhâham", "I want a room for two nights", "אני רוצה חדר לשני לילות"],
        ["پرواز ساعت چند است؟", "parvâz sâ'at-e chand ast?", "What time is the flight?", "באיזו שעה הטיסה?"],
        ["پرواز تأخیر دارد", "parvâz ta'khir dârad", "The flight is delayed", "הטיסה מתעכבת"]
      ]
    },
    {
      "id": "travel", "kind": "vocab", "icon": "✈️",
      "title": {"en": "Getting around", "he": "בדרכים"},
      "items": [
        ["خیابان", "khiyâbân", "street", "רחוב"],
        ["فرودگاه", "forudgâh", "airport", "שדה תעופה"],
        ["هتل", "hotel", "hotel", "מלון"],
        ["بازار", "bâzâr", "market", "שוק"],
        ["رستوران", "resturân", "restaurant", "מסעדה"],
        ["بیمارستان", "bimârestân", "hospital", "בית חולים"],
        ["ایستگاه", "istgâh", "station", "תחנה"],
        ["ماشین", "mâshin", "car", "מכונית"],
        ["اتوبوس", "otobus", "bus", "אוטובוס"],
        ["بلیط", "belit", "ticket", "כרטיס"],
        ["چپ", "chap", "left", "שמאל"],
        ["راست", "râst", "right", "ימין"],
        ["مستقیم", "mostaghim", "straight ahead", "ישר"],
        ["کجا", "kojâ", "where", "איפה"]
      ]
    },
    {
      "id": "conversation", "kind": "phrases", "icon": "🗣️",
      "title": {"en": "Everyday conversation", "he": "שיחה יומיומית"},
      "items": [
        ["شما اهل کجا هستید؟", "shomâ ahl-e kojâ hastid?", "Where are you from?", "מאיפה אתה?"],
        ["من فارسی کمی صحبت می‌کنم.", "man fârsi kami sohbat mikonam.", "I speak a little Farsi.", "אני מדבר קצת פרסית."],
        ["لطفاً آهسته‌تر صحبت کنید.", "lotfan âheste-tar sohbat konid.", "Please speak more slowly.", "בבקשה דבר לאט יותר."],
        ["ساعت چند است؟", "sâ'at chand ast?", "What time is it?", "מה השעה?"],
        ["فرودگاه کجاست؟", "forudgâh kojâst?", "Where is the airport?", "איפה שדה התעופה?"],
        ["یک بلیط به شیراز می‌خواهم.", "yek belit be shirâz mikhâham.", "I want a ticket to Shiraz.", "אני רוצה כרטיס לשיראז."],
        ["صورتحساب لطفاً.", "surat-hesâb lotfan.", "The bill, please.", "החשבון, בבקשה."],
        ["من گرسنه هستم.", "man gorosne hastam.", "I am hungry.", "אני רעב."],
        ["فردا می‌بینمت.", "fardâ mibinamat.", "See you tomorrow.", "נתראה מחר."]
      ]
    }
  ]
});
