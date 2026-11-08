// The Arabic alphabet, with everyday Levantine example words.
TLAP_ADD("ar", {
  "group": {"id": "g-alphabet", "level": "beginner", "icon": "ع", "title": {"en": "The Arabic alphabet", "he": "האלפבית הערבי"}},
  "lessons": [
    {"id": "alpha1", "kind": "alphabet", "icon": "ب",
     "title": {"en": "Alphabet 1: ا to خ", "he": "אלפבית 1: ا עד خ"},
     "intro": {"en": "Arabic is written from right to left, like Hebrew, and both are Semitic alphabets, so many letters are relatives: ب is like ב, ت like ת, ج like ג and ح like ח. Most letters connect to the next letter, so each one changes its shape a little depending on where it is in the word.", "he": "ערבית נכתבת מימין לשמאל, כמו עברית, ושני האלפביתים שמיים, ולכן הרבה אותיות הן קרובות משפחה: ب מקבילה ל-ב, ت ל-ת, ج ל-ג ו-ح ל-ח. רוב האותיות מתחברות לאות שאחריהן, ולכן צורת האות משתנה מעט לפי מקומה במילה."},
     "items": [
       ["ا", "alif", "ā (long a)", false, "باب", "bāb", "door", "דלת"],
       ["ب", "bā", "b", true, "بيت", "bēt", "house", "בית"],
       ["ت", "tā", "t", true, "تفاحة", "tuffāḥa", "apple", "תפוח"],
       ["ث", "thā", "th (as in think); in city speech often t or s", true, "ثوم", "tūm", "garlic", "שום"],
       ["ج", "jīm", "j (zh in Lebanon and Syria)", true, "جبنة", "jibne", "cheese", "גבינה"],
       ["ح", "ḥā", "ḥ (a breathy h from deep in the throat, like a Mizrahi ח)", true, "حليب", "ḥalīb", "milk", "חלב"],
       ["خ", "khā", "kh (like ח or כ in modern Hebrew)", true, "خبز", "khubz", "bread", "לחם"]
     ]},
    {"id": "alpha2", "kind": "alphabet", "icon": "س",
     "title": {"en": "Alphabet 2: د to ص", "he": "אלפבית 2: د עד ص"},
     "intro": {"en": "The letters د ذ ر ز never connect to the letter after them. More Hebrew relatives: د is ד, ر is ר, ز is ז, and ش is ש (شمس = שמש). ص is one of Arabic's \"heavy\" (emphatic) letters, said with the tongue pulled back.", "he": "האותיות د ذ ر ز אף פעם לא מתחברות לאות שאחריהן. עוד קרובות מהעברית: د היא ד, ر היא ר, ز היא ז, ו-ش היא ש (شمس = שמש). ص היא אחת האותיות ה\"כבדות\" (הנחציות) של הערבית, שנהגות כשהלשון נמשכת לאחור."},
     "items": [
       ["د", "dāl", "d", false, "دفتر", "daftar", "notebook", "מחברת"],
       ["ذ", "dhāl", "dh (as in this); in city speech often d or z", false, "ذهب", "dahab", "gold", "זהב"],
       ["ر", "rā", "r (rolled)", false, "رمان", "rummān", "pomegranate", "רימון"],
       ["ز", "zāy", "z", false, "زيتون", "zētūn", "olives", "זיתים"],
       ["س", "sīn", "s", true, "سمك", "samak", "fish", "דג"],
       ["ش", "shīn", "sh", true, "شمس", "shams", "sun", "שמש"],
       ["ص", "ṣād", "ṣ (a heavy, emphatic s)", true, "صابون", "sābūn", "soap", "סבון"]
     ]},
    {"id": "alpha3", "kind": "alphabet", "icon": "ع",
     "title": {"en": "Alphabet 3: ض to ق", "he": "אלפבית 3: ض עד ق"},
     "intro": {"en": "ض ط ظ are more heavy (emphatic) letters. ط is a relative of ט, ع of ע (عين = עין), ف of פ and ق of ק. In cities, ق is usually said as a short stop in the throat ('), so قلب is 'alb; in villages you may hear k or g instead.", "he": "ض ط ظ הן עוד אותיות כבדות (נחציות). ط קרובה ל-ט, ع ל-ע (عين = עין), ف ל-פ ו-ق ל-ק. בערים, ق נהגית בדרך כלל כעצירה קצרה בגרון ('), כך ש-قلب נשמע 'alb; בכפרים אפשר לשמוע במקומה k או g."},
     "items": [
       ["ض", "ḍād", "ḍ (a heavy, emphatic d)", true, "ضو", "daww", "light", "אור"],
       ["ط", "ṭā", "ṭ (a heavy, emphatic t)", true, "طاولة", "tāwle", "table", "שולחן"],
       ["ظ", "ẓā", "ẓ (a heavy z; in some areas a heavy dh)", true, "ظرف", "zarf", "envelope", "מעטפה"],
       ["ع", "3ayn", "3 (a deep squeeze in the throat, like a Mizrahi ע)", true, "عين", "3ēn", "eye", "עין"],
       ["غ", "ghayn", "gh (like a French r)", true, "غرفة", "ghurfe", "room", "חדר"],
       ["ف", "fā", "f", true, "فلافل", "falāfel", "falafel", "פלאפל"],
       ["ق", "qāf", "q; in cities a glottal stop ('), in villages often k or g", true, "قلب", "'alb", "heart", "לב"]
     ]},
    {"id": "alpha4", "kind": "alphabet", "icon": "ي",
     "title": {"en": "Alphabet 4: ك to ي", "he": "אלפבית 4: ك עד ي"},
     "intro": {"en": "The last group, and almost all of them have a Hebrew twin: ك כ (كلب = כלב), ل ל, م מ, ن נ, ه ה, و ו, ي י. Just like ו and י in Hebrew, و and ي also write long vowels: و for ū or ō, ي for ī or ē. Short vowels are usually not written at all.", "he": "הקבוצה האחרונה, וכמעט לכל אות יש תאומה בעברית: ك כ (كلب = כלב), ل ל, م מ, ن נ, ه ה, و ו, ي י. בדיוק כמו ו ו-י בעברית, גם و ו-ي כותבות תנועות ארוכות: و ל-ū או ō, ي ל-ī או ē. תנועות קצרות בדרך כלל לא נכתבות בכלל."},
     "items": [
       ["ك", "kāf", "k", true, "كلب", "kalb", "dog", "כלב"],
       ["ل", "lām", "l", true, "ليمون", "lēmūn", "lemon", "לימון"],
       ["م", "mīm", "m", true, "مي", "mayy", "water", "מים"],
       ["ن", "nūn", "n", true, "نار", "nār", "fire", "אש"],
       ["ه", "hā", "h", true, "هوا", "hawa", "air, weather", "אוויר, מזג אוויר"],
       ["و", "wāw", "w / ū / ō", false, "ورد", "ward", "roses", "ורדים"],
       ["ي", "yā", "y / ī / ē", true, "يوم", "yōm", "day", "יום"]
     ]},
    {"id": "alpha5", "kind": "alphabet", "icon": "ة",
     "title": {"en": "Extra signs", "he": "סימנים נוספים"},
     "intro": {"en": "A few extra signs you'll meet everywhere. ة ends most feminine words, much like ה in Hebrew ילדה. Hamza ء is a glottal stop, like א; it often sits on a \"seat\": أ إ (on alif), ؤ (on wāw) or ئ (on yā). And when ل meets ا, they merge into one special shape: لا.", "he": "כמה סימנים נוספים שתפגשו בכל מקום. ة מסיימת את רוב המילים בלשון נקבה, בדומה ל-ה במילה ילדה. ההמזה ء היא עצירה בגרון, כמו א; לעיתים קרובות היא יושבת על \"כיסא\": أ إ (על אליף), ؤ (על ואו) או ئ (על יא). וכש-ل פוגשת את ا, הן מתמזגות לצורה מיוחדת אחת: لا."},
     "items": [
       ["ة", "tā marbūṭa", "-a / -e at the end of a word", false, "مدرسة", "madrase", "school", "בית ספר"],
       ["ى", "alif maqṣūra", "a at the end of a word (like ي without dots)", false, "مستشفى", "mustashfa", "hospital", "בית חולים"],
       ["ء", "hamza", "' (a glottal stop, like א)", false, "سؤال", "su'āl", "question", "שאלה"],
       ["أ", "alif with hamza above", "a or u at the start of a word", false, "أحمر", "aḥmar", "red", "אדום"],
       ["إ", "alif with hamza below", "i at the start of a word", false, "إيد", "īd", "hand", "יד"],
       ["آ", "alif madda", "ā (a long a at the start of a word)", false, "آخر", "ākhir", "last", "אחרון"],
       ["لا", "lām-alif", "lā (ل + ا joined)", false, "سلام", "salām", "peace, hello", "שלום"]
     ]}
  ]
});
