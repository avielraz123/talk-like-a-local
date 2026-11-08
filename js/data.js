/*
 * Talk like a Persian — lesson content.
 *
 * Word/phrase items:  [farsi, latin, english, hebrew, extra?]
 *   extra may be: {"digit": "۱"}            Persian digit
 *                 {"form": [farsi, latin]}  related form (present "I…" form, or written form for spoken Farsi)
 *                 {"lit": [english, hebrew]} literal meaning
 * Alphabet items:     [letter, name, sound, joinsToNext, exampleFarsi, exampleLatin, exampleEnglish, exampleHebrew]
 *
 * The content below is plain JSON so tools/check_data.py can validate it.
 */
window.TLAP_DATA = {
  "topics": [
    {
      "id": "alpha1", "level": "beginner", "kind": "alphabet", "icon": "ا",
      "title": {"en": "Alphabet 1: ا to ح", "he": "אלפבית 1: ا עד ح"},
      "intro": {
        "en": "Farsi is written from right to left, like Hebrew. Most letters connect to the next letter, so each letter changes its shape a little depending on where it is in the word.",
        "he": "פרסית נכתבת מימין לשמאל, כמו עברית. רוב האותיות מתחברות לאות שאחריהן, ולכן צורת האות משתנה מעט לפי מקומה במילה."
      },
      "items": [
        ["ا", "alef", "â / a", false, "آب", "âb", "water", "מים"],
        ["ب", "be", "b", true, "بابا", "bâbâ", "dad", "אבא"],
        ["پ", "pe", "p", true, "پدر", "pedar", "father", "אב"],
        ["ت", "te", "t", true, "توت", "tut", "mulberry", "תות"],
        ["ث", "se", "s", true, "ثانیه", "sâniye", "second (time)", "שנייה"],
        ["ج", "jim", "j", true, "جوجه", "juje", "chick", "אפרוח"],
        ["چ", "che", "ch", true, "چای", "chây", "tea", "תה"],
        ["ح", "he-ye jimi", "h", true, "حال", "hâl", "mood, state", "מצב רוח"]
      ]
    },
    {
      "id": "alpha2", "level": "beginner", "kind": "alphabet", "icon": "س",
      "title": {"en": "Alphabet 2: خ to ش", "he": "אלפבית 2: خ עד ش"},
      "intro": {
        "en": "Notice the letters د ذ ر ز ژ: they never connect to the letter after them. Also, Farsi has several letters for the same sound (like z), because of words borrowed from Arabic.",
        "he": "שימו לב לאותיות د ذ ر ز ژ: הן אף פעם לא מתחברות לאות שאחריהן. בנוסף, בפרסית יש כמה אותיות לאותו צליל (כמו z), בגלל מילים שאולות מערבית."
      },
      "items": [
        ["خ", "khe", "kh", true, "خانه", "khâne", "house", "בית"],
        ["د", "dâl", "d", false, "در", "dar", "door", "דלת"],
        ["ذ", "zâl", "z", false, "ذرت", "zorrat", "corn", "תירס"],
        ["ر", "re", "r", false, "روز", "ruz", "day", "יום"],
        ["ز", "ze", "z", false, "زن", "zan", "woman", "אישה"],
        ["ژ", "zhe", "zh", false, "ژاپن", "zhâpon", "Japan", "יפן"],
        ["س", "sin", "s", true, "سیب", "sib", "apple", "תפוח"],
        ["ش", "shin", "sh", true, "شب", "shab", "night", "לילה"]
      ]
    },
    {
      "id": "alpha3", "level": "beginner", "kind": "alphabet", "icon": "ع",
      "title": {"en": "Alphabet 3: ص to ق", "he": "אלפבית 3: ص עד ق"},
      "intro": {
        "en": "Many of these letters come from Arabic. In Farsi, ص sounds like s, ض and ظ sound like z, and غ and ق both sound like gh.",
        "he": "רבות מהאותיות האלה מגיעות מערבית. בפרסית ص נשמעת כמו s, ض ו-ظ נשמעות כמו z, ו-غ ו-ق שתיהן נשמעות כמו gh."
      },
      "items": [
        ["ص", "sâd", "s", true, "صبح", "sobh", "morning", "בוקר"],
        ["ض", "zâd", "z", true, "ضعیف", "za'if", "weak", "חלש"],
        ["ط", "tâ", "t", true, "طلا", "talâ", "gold", "זהב"],
        ["ظ", "zâ", "z", true, "ظهر", "zohr", "noon", "צהריים"],
        ["ع", "eyn", "' (a short stop)", true, "عشق", "eshgh", "love", "אהבה"],
        ["غ", "gheyn", "gh", true, "غذا", "ghazâ", "food", "אוכל"],
        ["ف", "fe", "f", true, "فیل", "fil", "elephant", "פיל"],
        ["ق", "ghâf", "gh", true, "قند", "ghand", "sugar cube", "קוביית סוכר"]
      ]
    },
    {
      "id": "alpha4", "level": "beginner", "kind": "alphabet", "icon": "ک",
      "title": {"en": "Alphabet 4: ک to ی", "he": "אלפבית 4: ک עד ی"},
      "intro": {
        "en": "The last group! و can be v, u or o, and ی can be y or i. Short vowels (a, e, o) are usually not written at all, so you learn them with each word.",
        "he": "הקבוצה האחרונה! و יכולה להיות v, u או o, ו-ی יכולה להיות y או i. תנועות קצרות (a, e, o) בדרך כלל לא נכתבות בכלל, ולכן לומדים אותן עם כל מילה."
      },
      "items": [
        ["ک", "kâf", "k", true, "کتاب", "ketâb", "book", "ספר"],
        ["گ", "gâf", "g", true, "گل", "gol", "flower", "פרח"],
        ["ل", "lâm", "l", true, "لب", "lab", "lip", "שפה (של הפה)"],
        ["م", "mim", "m", true, "ماه", "mâh", "moon", "ירח"],
        ["ن", "nun", "n", true, "نان", "nân", "bread", "לחם"],
        ["و", "vâv", "v / u / o", false, "ورزش", "varzesh", "sport", "ספורט"],
        ["ه", "he", "h", true, "هوا", "havâ", "air, weather", "אוויר, מזג אוויר"],
        ["ی", "ye", "y / i", true, "یک", "yek", "one", "אחת"]
      ]
    },

    {
      "id": "greetings", "level": "beginner", "kind": "vocab", "icon": "👋",
      "title": {"en": "Greetings", "he": "ברכות"},
      "items": [
        ["سلام", "salâm", "hello", "שלום"],
        ["خداحافظ", "khodâhâfez", "goodbye", "להתראות"],
        ["ممنون", "mamnun", "thank you", "תודה"],
        ["مرسی", "mersi", "thanks (casual)", "תודה (יומיומי)"],
        ["لطفاً", "lotfan", "please", "בבקשה"],
        ["بله", "bale", "yes", "כן"],
        ["نه", "na", "no", "לא"],
        ["ببخشید", "bebakhshid", "excuse me / sorry", "סליחה"],
        ["خوبم", "khubam", "I'm fine", "אני בסדר"],
        ["صبح بخیر", "sobh bekheyr", "good morning", "בוקר טוב"],
        ["شب بخیر", "shab bekheyr", "good night", "לילה טוב"],
        ["خوش آمدید", "khosh âmadid", "welcome", "ברוכים הבאים"],
        ["حال شما چطور است؟", "hâl-e shomâ chetor ast?", "How are you? (polite)", "מה שלומך? (מנומס)"]
      ]
    },
    {
      "id": "numbers", "level": "beginner", "kind": "vocab", "icon": "🔢",
      "title": {"en": "Numbers", "he": "מספרים"},
      "intro": {
        "en": "Farsi has its own digits: ۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹. Funny fact: unlike the words, numbers are written left to right!",
        "he": "לפרסית יש ספרות משלה: ۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹. עובדה משעשעת: בניגוד למילים, מספרים נכתבים משמאל לימין!"
      },
      "items": [
        ["یک", "yek", "one (1)", "אחת (1)", {"digit": "۱"}],
        ["دو", "do", "two (2)", "שתיים (2)", {"digit": "۲"}],
        ["سه", "se", "three (3)", "שלוש (3)", {"digit": "۳"}],
        ["چهار", "chahâr", "four (4)", "ארבע (4)", {"digit": "۴"}],
        ["پنج", "panj", "five (5)", "חמש (5)", {"digit": "۵"}],
        ["شش", "shesh", "six (6)", "שש (6)", {"digit": "۶"}],
        ["هفت", "haft", "seven (7)", "שבע (7)", {"digit": "۷"}],
        ["هشت", "hasht", "eight (8)", "שמונה (8)", {"digit": "۸"}],
        ["نه", "noh", "nine (9)", "תשע (9)", {"digit": "۹"}],
        ["ده", "dah", "ten (10)", "עשר (10)", {"digit": "۱۰"}],
        ["یازده", "yâzdah", "eleven (11)", "אחת־עשרה (11)", {"digit": "۱۱"}],
        ["دوازده", "davâzdah", "twelve (12)", "שתים־עשרה (12)", {"digit": "۱۲"}],
        ["بیست", "bist", "twenty (20)", "עשרים (20)", {"digit": "۲۰"}],
        ["صد", "sad", "hundred (100)", "מאה (100)", {"digit": "۱۰۰"}],
        ["هزار", "hezâr", "thousand (1000)", "אלף (1000)", {"digit": "۱۰۰۰"}]
      ]
    },
    {
      "id": "family", "level": "beginner", "kind": "vocab", "icon": "👨‍👩‍👧",
      "title": {"en": "Family & people", "he": "משפחה ואנשים"},
      "items": [
        ["پدر", "pedar", "father", "אבא"],
        ["مادر", "mâdar", "mother", "אמא"],
        ["برادر", "barâdar", "brother", "אח"],
        ["خواهر", "khâhar", "sister", "אחות"],
        ["پسر", "pesar", "son / boy", "בן / ילד"],
        ["دختر", "dokhtar", "daughter / girl", "בת / ילדה"],
        ["پدربزرگ", "pedarbozorg", "grandfather", "סבא"],
        ["مادربزرگ", "mâdarbozorg", "grandmother", "סבתא"],
        ["خانواده", "khânevâde", "family", "משפחה"],
        ["شوهر", "shohar", "husband", "בעל"],
        ["زن", "zan", "wife / woman", "אישה"],
        ["بچه", "bachche", "child", "ילד"],
        ["دوست", "dust", "friend", "חבר"]
      ]
    },
    {
      "id": "food", "level": "beginner", "kind": "vocab", "icon": "🍚",
      "title": {"en": "Food & drink", "he": "אוכל ושתייה"},
      "items": [
        ["آب", "âb", "water", "מים"],
        ["نان", "nân", "bread", "לחם"],
        ["چای", "chây", "tea", "תה"],
        ["قهوه", "ghahve", "coffee", "קפה"],
        ["برنج", "berenj", "rice", "אורז"],
        ["گوشت", "gusht", "meat", "בשר"],
        ["مرغ", "morgh", "chicken", "עוף"],
        ["ماهی", "mâhi", "fish", "דג"],
        ["میوه", "mive", "fruit", "פרי"],
        ["سیب", "sib", "apple", "תפוח"],
        ["شیر", "shir", "milk", "חלב"],
        ["پنیر", "panir", "cheese", "גבינה"],
        ["تخم‌مرغ", "tokhm-e morgh", "egg", "ביצה", {"lit": ["chicken seed", "זרע של תרנגולת"]}],
        ["خوشمزه", "khoshmaze", "delicious", "טעים"]
      ]
    },
    {
      "id": "colors", "level": "beginner", "kind": "vocab", "icon": "🎨",
      "title": {"en": "Colors", "he": "צבעים"},
      "items": [
        ["قرمز", "ghermez", "red", "אדום"],
        ["آبی", "âbi", "blue", "כחול", {"lit": ["water-colored (from âb = water)", "בצבע מים (מ-âb = מים)"]}],
        ["سبز", "sabz", "green", "ירוק"],
        ["زرد", "zard", "yellow", "צהוב"],
        ["سفید", "sefid", "white", "לבן"],
        ["سیاه", "siyâh", "black", "שחור"],
        ["نارنجی", "nârenji", "orange", "כתום", {"lit": ["like a bitter orange (nârenj)", "כמו תפוז מר (nârenj)"]}],
        ["صورتی", "surati", "pink", "ורוד"],
        ["بنفش", "banafsh", "purple", "סגול"],
        ["قهوه‌ای", "ghahve'i", "brown", "חום", {"lit": ["coffee-colored", "בצבע קפה"]}],
        ["خاکستری", "khâkestari", "gray", "אפור", {"lit": ["ash-colored", "בצבע אפר"]}]
      ]
    },
    {
      "id": "body", "level": "beginner", "kind": "vocab", "icon": "🖐️",
      "title": {"en": "The body", "he": "הגוף"},
      "items": [
        ["سر", "sar", "head", "ראש"],
        ["چشم", "cheshm", "eye", "עין"],
        ["گوش", "gush", "ear", "אוזן"],
        ["دست", "dast", "hand", "יד"],
        ["پا", "pâ", "leg / foot", "רגל"],
        ["دهان", "dahân", "mouth", "פה"],
        ["بینی", "bini", "nose", "אף"],
        ["مو", "mu", "hair", "שיער"],
        ["دندان", "dandân", "tooth", "שן"],
        ["قلب", "ghalb", "heart", "לב"],
        ["صورت", "surat", "face", "פנים"]
      ]
    },
    {
      "id": "tobe", "level": "beginner", "kind": "grammar", "icon": "🧍",
      "title": {"en": "I, you, he & she + \"to be\"", "he": "אני, אתה, הוא והיא + \"להיות\""},
      "intro": {
        "en": "Farsi has no separate words for \"he\" and \"she\": او (u) means both! The verb \"to be\" comes at the END of the sentence: من خوب هستم (man khub hastam) = \"I good am\". شما (shomâ) means \"you\" for many people, and is also the polite \"you\".",
        "he": "בפרסית אין מילים נפרדות ל\"הוא\" ול\"היא\": او (u) פירושו שניהם! הפועל \"להיות\" בא בסוף המשפט: من خوب هستم (man khub hastam) = \"אני טוב הנני\". شما (shomâ) פירושו \"אתם\", והוא גם ה\"אתה/את\" המנומס."
      },
      "items": [
        ["من", "man", "I", "אני"],
        ["تو", "to", "you (one person, informal)", "אתה / את"],
        ["او", "u", "he / she", "הוא / היא"],
        ["ما", "mâ", "we", "אנחנו"],
        ["شما", "shomâ", "you (plural / polite)", "אתם / אתן (או בנימוס)"],
        ["آنها", "ânhâ", "they", "הם / הן"],
        ["من خوب هستم", "man khub hastam", "I am good", "אני בסדר"],
        ["تو خسته هستی", "to khaste hasti", "You are tired", "אתה עייף"],
        ["او معلم است", "u mo'allem ast", "He/She is a teacher", "הוא/היא מורה"],
        ["ما دوست هستیم", "mâ dust hastim", "We are friends", "אנחנו חברים"],
        ["آنها اینجا هستند", "ânhâ injâ hastand", "They are here", "הם כאן"]
      ]
    },
    {
      "id": "basics", "level": "beginner", "kind": "phrases", "icon": "💬",
      "title": {"en": "First phrases", "he": "משפטים ראשונים"},
      "items": [
        ["اسم من سارا است.", "esm-e man sârâ ast.", "My name is Sara.", "שמי שרה."],
        ["اسم شما چیست؟", "esm-e shomâ chist?", "What is your name?", "מה שמך?"],
        ["از آشنایی با شما خوشوقتم.", "az âshnâyi bâ shomâ khoshvaghtam.", "Nice to meet you.", "נעים להכיר."],
        ["من فارسی یاد می‌گیرم.", "man fârsi yâd migiram.", "I am learning Farsi.", "אני לומד פרסית."],
        ["متوجه نمی‌شوم.", "motevajjeh nemishavam.", "I don't understand.", "אני לא מבין."],
        ["دستشویی کجاست؟", "dastshuyi kojâst?", "Where is the bathroom?", "איפה השירותים?"],
        ["این چند است؟", "in chand ast?", "How much is this?", "כמה זה עולה?"],
        ["من چای می‌خواهم.", "man chây mikhâham.", "I want tea.", "אני רוצה תה."],
        ["خیلی ممنون.", "kheyli mamnun.", "Thank you very much.", "תודה רבה."]
      ]
    },

    {
      "id": "time", "level": "intermediate", "kind": "vocab", "icon": "📅",
      "title": {"en": "Days & time", "he": "ימים וזמן"},
      "intro": {
        "en": "The Iranian week starts on Saturday (shanbe), and the weekend is Friday. Many day names are just a number + shanbe: yek-shanbe (\"one-shanbe\") is Sunday.",
        "he": "השבוע האיראני מתחיל בשבת (shanbe), וסוף השבוע הוא ביום שישי. שמות רבים של ימים הם פשוט מספר + shanbe: yek-shanbe (\"אחת-שנבה\") הוא יום ראשון."
      },
      "items": [
        ["شنبه", "shanbe", "Saturday", "שבת"],
        ["یکشنبه", "yekshanbe", "Sunday", "יום ראשון"],
        ["دوشنبه", "doshanbe", "Monday", "יום שני"],
        ["سه‌شنبه", "seshanbe", "Tuesday", "יום שלישי"],
        ["چهارشنبه", "chahârshanbe", "Wednesday", "יום רביעי"],
        ["پنجشنبه", "panjshanbe", "Thursday", "יום חמישי"],
        ["جمعه", "jom'e", "Friday", "יום שישי"],
        ["امروز", "emruz", "today", "היום"],
        ["فردا", "fardâ", "tomorrow", "מחר"],
        ["دیروز", "diruz", "yesterday", "אתמול"],
        ["هفته", "hafte", "week", "שבוע"],
        ["ماه", "mâh", "month", "חודש"],
        ["سال", "sâl", "year", "שנה"],
        ["ساعت", "sâ'at", "hour / clock", "שעה / שעון"]
      ]
    },
    {
      "id": "travel", "level": "intermediate", "kind": "vocab", "icon": "✈️",
      "title": {"en": "Places & travel", "he": "מקומות וטיולים"},
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
      "id": "verbs", "level": "intermediate", "kind": "vocab", "icon": "🏃",
      "title": {"en": "Common verbs", "he": "פעלים נפוצים"},
      "intro": {
        "en": "Farsi verbs in the dictionary end in -an (\"to …\"). Under each verb you'll also see how to say \"I …\" in the present.",
        "he": "פעלים בפרסית מופיעים במילון עם הסיומת an- (\"ל…\"). מתחת לכל פועל תראו גם איך אומרים \"אני …\" בהווה."
      },
      "items": [
        ["رفتن", "raftan", "to go", "ללכת", {"form": ["می‌روم", "miravam"]}],
        ["آمدن", "âmadan", "to come", "לבוא", {"form": ["می‌آیم", "miâyam"]}],
        ["خوردن", "khordan", "to eat", "לאכול", {"form": ["می‌خورم", "mikhoram"]}],
        ["نوشیدن", "nushidan", "to drink", "לשתות", {"form": ["می‌نوشم", "minusham"]}],
        ["دیدن", "didan", "to see", "לראות", {"form": ["می‌بینم", "mibinam"]}],
        ["گفتن", "goftan", "to say", "לומר", {"form": ["می‌گویم", "miguyam"]}],
        ["خواستن", "khâstan", "to want", "לרצות", {"form": ["می‌خواهم", "mikhâham"]}],
        ["دانستن", "dânestan", "to know", "לדעת", {"form": ["می‌دانم", "midânam"]}],
        ["کردن", "kardan", "to do / to make", "לעשות", {"form": ["می‌کنم", "mikonam"]}],
        ["داشتن", "dâshtan", "to have", "שיהיה ל־ (to have)", {"form": ["دارم", "dâram"]}],
        ["خواندن", "khândan", "to read / to sing", "לקרוא / לשיר", {"form": ["می‌خوانم", "mikhânam"]}],
        ["نوشتن", "neveshtan", "to write", "לכתוב", {"form": ["می‌نویسم", "minevisam"]}],
        ["صحبت کردن", "sohbat kardan", "to speak", "לדבר", {"form": ["صحبت می‌کنم", "sohbat mikonam"]}],
        ["خوابیدن", "khâbidan", "to sleep", "לישון", {"form": ["می‌خوابم", "mikhâbam"]}]
      ]
    },
    {
      "id": "adjectives", "level": "intermediate", "kind": "vocab", "icon": "😊",
      "title": {"en": "Feelings & describing words", "he": "רגשות ותארים"},
      "items": [
        ["خوب", "khub", "good", "טוב"],
        ["بد", "bad", "bad", "רע"],
        ["بزرگ", "bozorg", "big", "גדול"],
        ["کوچک", "kuchak", "small", "קטן"],
        ["خوشحال", "khoshhâl", "happy", "שמח"],
        ["ناراحت", "nârâhat", "sad / upset", "עצוב"],
        ["خسته", "khaste", "tired", "עייף"],
        ["گرسنه", "gorosne", "hungry", "רעב"],
        ["تشنه", "teshne", "thirsty", "צמא"],
        ["گرم", "garm", "warm", "חם"],
        ["سرد", "sard", "cold", "קר"],
        ["زیبا", "zibâ", "beautiful", "יפה"],
        ["جدید", "jadid", "new", "חדש"],
        ["قدیمی", "ghadimi", "old (things)", "ישן"],
        ["گران", "gerân", "expensive", "יקר"],
        ["ارزان", "arzân", "cheap", "זול"]
      ]
    },
    {
      "id": "present", "level": "intermediate", "kind": "grammar", "icon": "⏳",
      "title": {"en": "Present tense", "he": "זמן הווה"},
      "intro": {
        "en": "Present tense = mi + present stem + ending. The present stem of raftan (to go) is rav: mi + rav + am = miravam (I go). The endings are: -am (I), -i (you), -ad (he/she), -im (we), -id (you pl.), -and (they). The verb comes at the end of the sentence.",
        "he": "זמן הווה = mi + גזע ההווה + סיומת. גזע ההווה של raftan (ללכת) הוא rav: ‏mi + rav + am = miravam (אני הולך). הסיומות: am- (אני), i- (אתה), ad- (הוא/היא), im- (אנחנו), id- (אתם), and- (הם). הפועל בא בסוף המשפט."
      },
      "items": [
        ["من می‌روم", "man miravam", "I go", "אני הולך"],
        ["تو می‌روی", "to miravi", "you go", "אתה הולך"],
        ["او می‌رود", "u miravad", "he/she goes", "הוא/היא הולך/ת"],
        ["ما می‌رویم", "mâ miravim", "we go", "אנחנו הולכים"],
        ["شما می‌روید", "shomâ miravid", "you (pl.) go", "אתם הולכים"],
        ["آنها می‌روند", "ânhâ miravand", "they go", "הם הולכים"],
        ["من نان می‌خورم", "man nân mikhoram", "I eat bread", "אני אוכל לחם"],
        ["او کتاب می‌خواند", "u ketâb mikhânad", "He/She reads a book", "הוא/היא קורא/ת ספר"],
        ["ما فارسی صحبت می‌کنیم", "mâ fârsi sohbat mikonim", "We speak Farsi", "אנחנו מדברים פרסית"]
      ]
    },
    {
      "id": "negation", "level": "intermediate", "kind": "grammar", "icon": "🚫",
      "title": {"en": "Saying \"not\"", "he": "שלילה: \"לא\""},
      "intro": {
        "en": "To say \"not\", add na- or ne- to the start of the verb: miravam → nemiravam (I don't go), dâram → nadâram (I don't have). \"To be\" is special: hastam (I am) → nistam (I am not).",
        "he": "כדי לשלול, מוסיפים -na או -ne בתחילת הפועל: miravam ← nemiravam (אני לא הולך), dâram ← nadâram (אין לי). \"להיות\" מיוחד: hastam (אני) ← nistam (אני לא)."
      },
      "items": [
        ["نمی‌روم", "nemiravam", "I don't go", "אני לא הולך"],
        ["نمی‌خواهم", "nemikhâham", "I don't want", "אני לא רוצה"],
        ["نمی‌دانم", "nemidânam", "I don't know", "אני לא יודע"],
        ["ندارم", "nadâram", "I don't have", "אין לי"],
        ["من خسته نیستم", "man khaste nistam", "I am not tired", "אני לא עייף"],
        ["او اینجا نیست", "u injâ nist", "He/She is not here", "הוא/היא לא כאן"],
        ["من گوشت نمی‌خورم", "man gusht nemikhoram", "I don't eat meat", "אני לא אוכל בשר"],
        ["ما وقت نداریم", "mâ vaght nadârim", "We don't have time", "אין לנו זמן"]
      ]
    },
    {
      "id": "ezafe", "level": "intermediate", "kind": "grammar", "icon": "🔗",
      "title": {"en": "Linking words (ezâfe)", "he": "חיבור מילים (אזאפה)"},
      "intro": {
        "en": "Ezâfe is a short \"-e\" sound that links a noun to its describing word or its owner: ketâb-e man = my book (\"book-of me\"). After a vowel it becomes \"-ye\": khâne-ye bozorg = big house. It is usually NOT written, so you have to hear it!",
        "he": "אזאפה היא תנועה קצרה e- שמחברת שם עצם לתואר שלו או לבעלים שלו: ketâb-e man = הספר שלי (\"ספר-של אני\"). אחרי תנועה היא הופכת ל-ye: ‏khâne-ye bozorg = בית גדול. בדרך כלל היא לא נכתבת, אז צריך לשמוע אותה!"
      },
      "items": [
        ["کتاب من", "ketâb-e man", "my book", "הספר שלי"],
        ["اسم شما", "esm-e shomâ", "your name", "השם שלך"],
        ["خانه‌ی بزرگ", "khâne-ye bozorg", "big house", "בית גדול"],
        ["چای داغ", "chây-e dâgh", "hot tea", "תה חם"],
        ["شهر زیبا", "shahr-e zibâ", "beautiful city", "עיר יפה"],
        ["دوست خوب", "dust-e khub", "good friend", "חבר טוב"],
        ["ماشین قرمز", "mâshin-e ghermez", "red car", "מכונית אדומה"],
        ["زبان فارسی", "zabân-e fârsi", "the Farsi language", "השפה הפרסית"]
      ]
    },
    {
      "id": "conversation", "level": "intermediate", "kind": "phrases", "icon": "🗣️",
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
    },

    {
      "id": "past", "level": "advanced", "kind": "grammar", "icon": "⏮️",
      "title": {"en": "Past tense", "he": "זמן עבר"},
      "intro": {
        "en": "Past tense = past stem + ending (no mi-). The past stem is the verb without -an: raftan → raft. raft + am = raftam (I went). \"He/she went\" is just raft, with no ending. For \"didn't\", add na-: nakhâbidam = I didn't sleep.",
        "he": "זמן עבר = גזע העבר + סיומת (בלי mi). גזע העבר הוא הפועל בלי an-: ‏raftan ← raft. ‏raft + am = raftam (הלכתי). \"הוא/היא הלך\" הוא פשוט raft, בלי סיומת. לשלילה מוסיפים -na: ‏nakhâbidam = לא ישנתי."
      },
      "items": [
        ["رفتم", "raftam", "I went", "הלכתי"],
        ["رفتی", "rafti", "you went", "הלכת"],
        ["رفت", "raft", "he/she went", "הוא/היא הלך/ה"],
        ["رفتیم", "raftim", "we went", "הלכנו"],
        ["رفتید", "raftid", "you (pl.) went", "הלכתם"],
        ["رفتند", "raftand", "they went", "הם הלכו"],
        ["دیروز به بازار رفتم", "diruz be bâzâr raftam", "Yesterday I went to the market", "אתמול הלכתי לשוק"],
        ["دیشب خوب نخوابیدم", "dishab khub nakhâbidam", "I didn't sleep well last night", "לא ישנתי טוב אתמול בלילה"],
        ["او یک کتاب خرید", "u yek ketâb kharid", "He/She bought a book", "הוא/היא קנה/תה ספר"],
        ["ما شام خوردیم", "mâ shâm khordim", "We ate dinner", "אכלנו ארוחת ערב"]
      ]
    },
    {
      "id": "future", "level": "advanced", "kind": "grammar", "icon": "⏭️",
      "title": {"en": "Future tense", "he": "זמן עתיד"},
      "intro": {
        "en": "Future = khâh + ending + past stem: khâham raft = I will go. In everyday speech, Iranians usually just use the present tense for the future: fardâ miravam = I'm going tomorrow.",
        "he": "עתיד = khâh + סיומת + גזע העבר: ‏khâham raft = אלך. בדיבור יומיומי איראנים בדרך כלל משתמשים בהווה גם לעתיד: fardâ miravam = אני הולך מחר."
      },
      "items": [
        ["خواهم رفت", "khâham raft", "I will go", "אלך"],
        ["خواهی رفت", "khâhi raft", "you will go", "תלך"],
        ["خواهد رفت", "khâhad raft", "he/she will go", "הוא/היא ילך/תלך"],
        ["خواهیم رفت", "khâhim raft", "we will go", "נלך"],
        ["فردا باران خواهد آمد", "fardâ bârân khâhad âmad", "It will rain tomorrow", "מחר ירד גשם"],
        ["سال آینده به ایران خواهم رفت", "sâl-e âyande be irân khâham raft", "Next year I will go to Iran", "בשנה הבאה אסע לאיראן"]
      ]
    },
    {
      "id": "taarof", "level": "advanced", "kind": "phrases", "icon": "🙏",
      "title": {"en": "Ta'ârof: Persian politeness", "he": "תעארוף: נימוס פרסי"},
      "intro": {
        "en": "Ta'ârof is the Iranian art of politeness: offering, refusing and insisting. A shopkeeper may say \"it's not worthy of you\" (ghâbeli nadârad), but you should still pay! These phrases will make you sound truly Persian.",
        "he": "תעארוף היא אומנות הנימוס האיראנית: להציע, לסרב ולהתעקש. מוכר עשוי לומר \"זה לא ראוי לך\" (ghâbeli nadârad), אבל עדיין צריך לשלם! הביטויים האלה יגרמו לך להישמע פרסי באמת."
      },
      "items": [
        ["خواهش می‌کنم", "khâhesh mikonam", "you're welcome / please", "על לא דבר / בבקשה"],
        ["بفرمایید", "befarmâyid", "please, go ahead / come in / help yourself", "בבקשה, תתכבד / היכנס"],
        ["خسته نباشید", "khaste nabâshid", "said to someone who worked hard", "נאמר למי שעבד קשה", {"lit": ["may you not be tired", "שלא תהיה עייף"]}],
        ["دستتان درد نکند", "dastetân dard nakonad", "thanks for your effort", "תודה על המאמץ", {"lit": ["may your hand not hurt", "שלא תכאב ידך"]}],
        ["قابلی ندارد", "ghâbeli nadârad", "it's nothing, be my guest", "זה כלום, בשמחה", {"lit": ["it's not worthy (of you)", "זה לא ראוי לך"]}],
        ["نوش جان", "nush-e jân", "enjoy your meal!", "בתיאבון!", {"lit": ["may it nourish your soul", "שיזין את נשמתך"]}],
        ["چشم", "cheshm", "sure, I'll do it", "בסדר, בשמחה", {"lit": ["(on my) eye", "(על) העין"]}],
        ["قربان شما", "ghorbân-e shomâ", "very polite \"thank you\" / at your service", "תודה (מנומס מאוד) / לשירותך", {"lit": ["I'd sacrifice myself for you", "אקריב את עצמי למענך"]}],
        ["زحمت کشیدید", "zahmat keshidid", "you went to so much trouble", "טרחת כל כך"],
        ["سلامت باشید", "salâmat bâshid", "stay healthy (a reply to thanks)", "תהיה בריא (תשובה לתודה)"],
        ["جای شما خالی", "jâ-ye shomâ khâli", "we missed you (there)", "חבל שלא היית שם", {"lit": ["your place was empty", "מקומך היה ריק"]}]
      ]
    },
    {
      "id": "celebrations", "level": "advanced", "kind": "phrases", "icon": "🎉",
      "title": {"en": "Celebrations & feelings", "he": "חגיגות ורגשות"},
      "items": [
        ["تولدت مبارک", "tavallodet mobârak", "Happy birthday!", "יום הולדת שמח!"],
        ["سال نو مبارک", "sâl-e no mobârak", "Happy New Year! (Nowruz)", "שנה טובה! (נורוז)"],
        ["مبارک باشد", "mobârak bâshad", "Congratulations!", "מזל טוב!"],
        ["به سلامتی", "be salâmati", "Cheers!", "לחיים!"],
        ["دلم برایت تنگ شده", "delam barâyat tang shode", "I miss you", "אני מתגעגע אליך", {"lit": ["my heart has become tight for you", "ליבי נעשה צר בשבילך"]}],
        ["دوستت دارم", "dustet dâram", "I love you", "אני אוהב אותך", {"lit": ["I have you as a friend", "יש לי אותך כחבר"]}],
        ["ان‌شاءالله", "enshâ'allâh", "hopefully (God willing)", "בעזרת השם / הלוואי"],
        ["خیلی خوش گذشت", "kheyli khosh gozasht", "I had a great time", "היה ממש כיף"],
        ["موفق باشی", "movaffagh bâshi", "Good luck!", "בהצלחה!"],
        ["عید شما مبارک", "eyd-e shomâ mobârak", "Happy holiday!", "חג שמח!"]
      ]
    },
    {
      "id": "spoken", "level": "advanced", "kind": "phrases", "icon": "🗨️",
      "title": {"en": "Spoken Farsi (like in Tehran)", "he": "פרסית מדוברת (כמו בטהרן)"},
      "intro": {
        "en": "Iranians, especially in Tehran, speak differently from how they write. Words get shorter: mikhâham → mikhâm, ast → -e. Here the Farsi is shown the way people SAY it, and the formal written form appears under it.",
        "he": "איראנים, במיוחד בטהרן, מדברים אחרת ממה שהם כותבים. מילים מתקצרות: mikhâham ← mikhâm, ‏ast ← e-. כאן הפרסית מוצגת כפי שאנשים אומרים אותה, והצורה הכתובה הרשמית מופיעה מתחתיה."
      },
      "items": [
        ["می‌خوام", "mikhâm", "I want", "אני רוצה", {"form": ["می‌خواهم", "mikhâham"]}],
        ["می‌رم", "miram", "I'm going", "אני הולך", {"form": ["می‌روم", "miravam"]}],
        ["خوبه", "khube", "it's good", "זה טוב", {"form": ["خوب است", "khub ast"]}],
        ["چطوری؟", "chetori?", "How are you? (informal)", "מה נשמע?", {"form": ["حالت چطور است؟", "hâlet chetor ast?"]}],
        ["نمی‌دونم", "nemidunam", "I don't know", "אני לא יודע", {"form": ["نمی‌دانم", "nemidânam"]}],
        ["آره", "âre", "yeah", "כן (יומיומי)", {"form": ["بله", "bale"]}],
        ["کجایی؟", "kojâyi?", "Where are you?", "איפה אתה?", {"form": ["کجا هستی؟", "kojâ hasti?"]}],
        ["چی؟", "chi?", "What?", "מה?", {"form": ["چه؟", "che?"]}],
        ["بریم", "berim", "Let's go!", "בוא נלך! / יאללה", {"form": ["برویم", "beravim"]}],
        ["دمت گرم", "damet garm", "well done! / thanks, buddy! (slang)", "כל הכבוד! / תודה אחי (סלנג)", {"lit": ["may your breath be warm", "שנשימתך תהיה חמה"]}]
      ]
    },
    {
      "id": "sentences", "level": "advanced", "kind": "phrases", "icon": "🧩",
      "title": {"en": "Longer sentences", "he": "משפטים ארוכים"},
      "items": [
        ["اگر وقت داشته باشم، به شما زنگ می‌زنم.", "agar vaght dâshte bâsham, be shomâ zang mizanam.", "If I have time, I'll call you.", "אם יהיה לי זמן, אתקשר אליך."],
        ["کتابی که خریدم خیلی جالب است.", "ketâbi ke kharidam kheyli jâleb ast.", "The book that I bought is very interesting.", "הספר שקניתי מעניין מאוד."],
        ["چند سال است که فارسی یاد می‌گیرید؟", "chand sâl ast ke fârsi yâd migirid?", "How many years have you been learning Farsi?", "כמה שנים אתה לומד פרסית?"],
        ["هوا امروز خیلی سرد است.", "havâ emruz kheyli sard ast.", "The weather is very cold today.", "מזג האוויר קר מאוד היום."],
        ["باید زودتر بیدار شوم.", "bâyad zudtar bidâr shavam.", "I have to wake up earlier.", "אני צריך להתעורר מוקדם יותר."],
        ["فکر می‌کنم که حق با شماست.", "fekr mikonam ke hagh bâ shomâst.", "I think that you are right.", "אני חושב שאתה צודק."],
        ["وقتی بچه بودم، در تهران زندگی می‌کردم.", "vaghti bachche budam, dar tehrân zendegi mikardam.", "When I was a child, I lived in Tehran.", "כשהייתי ילד, גרתי בטהרן."],
        ["اگر باران بیاید، در خانه می‌مانیم.", "agar bârân biyâyad, dar khâne mimânim.", "If it rains, we'll stay home.", "אם ירד גשם, נישאר בבית."]
      ]
    }
  ]
};
