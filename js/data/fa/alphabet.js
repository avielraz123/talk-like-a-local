// The Persian alphabet (copied unchanged from the original data.js).
TLAP_ADD("fa", {
  "group": {"id": "g-alphabet", "level": "beginner", "icon": "✍️", "title": {"en": "The alphabet", "he": "האלפבית"}},
  "lessons": [
    {"id": "alpha1", "kind": "alphabet", "icon": "ا",
     "title": {"en": "Alphabet 1: ا to ح", "he": "אלפבית 1: ا עד ح"},
     "intro": {"en": "Farsi is written from right to left, like Hebrew. Most letters connect to the next letter, so each letter changes its shape a little depending on where it is in the word.", "he": "פרסית נכתבת מימין לשמאל, כמו עברית. רוב האותיות מתחברות לאות שאחריהן, ולכן צורת האות משתנה מעט לפי מקומה במילה."},
     "items": [
       ["ا", "alef", "â / a", false, "آب", "âb", "water", "מים"],
       ["ب", "be", "b", true, "بابا", "bâbâ", "dad", "אבא"],
       ["پ", "pe", "p", true, "پدر", "pedar", "father", "אב"],
       ["ت", "te", "t", true, "توت", "tut", "mulberry", "תות"],
       ["ث", "se", "s", true, "ثانیه", "sâniye", "second (time)", "שנייה"],
       ["ج", "jim", "j", true, "جوجه", "juje", "chick", "אפרוח"],
       ["چ", "che", "ch", true, "چای", "chây", "tea", "תה"],
       ["ح", "he-ye jimi", "h", true, "حال", "hâl", "mood, state", "מצב רוח"]
     ]},
    {"id": "alpha2", "kind": "alphabet", "icon": "س",
     "title": {"en": "Alphabet 2: خ to ش", "he": "אלפבית 2: خ עד ش"},
     "intro": {"en": "Notice the letters د ذ ر ز ژ: they never connect to the letter after them. Also, Farsi has several letters for the same sound (like z), because of words borrowed from Arabic.", "he": "שימו לב לאותיות د ذ ر ز ژ: הן אף פעם לא מתחברות לאות שאחריהן. בנוסף, בפרסית יש כמה אותיות לאותו צליל (כמו z), בגלל מילים שאולות מערבית."},
     "items": [
       ["خ", "khe", "kh", true, "خانه", "khâne", "house", "בית"],
       ["د", "dâl", "d", false, "در", "dar", "door", "דלת"],
       ["ذ", "zâl", "z", false, "ذرت", "zorrat", "corn", "תירס"],
       ["ر", "re", "r", false, "روز", "ruz", "day", "יום"],
       ["ز", "ze", "z", false, "زن", "zan", "woman", "אישה"],
       ["ژ", "zhe", "zh", false, "ژاپن", "zhâpon", "Japan", "יפן"],
       ["س", "sin", "s", true, "سیب", "sib", "apple", "תפוח"],
       ["ش", "shin", "sh", true, "شب", "shab", "night", "לילה"]
     ]},
    {"id": "alpha3", "kind": "alphabet", "icon": "ع",
     "title": {"en": "Alphabet 3: ص to ق", "he": "אלפבית 3: ص עד ق"},
     "intro": {"en": "Many of these letters come from Arabic. In Farsi, ص sounds like s, ض and ظ sound like z, and غ and ق both sound like gh.", "he": "רבות מהאותיות האלה מגיעות מערבית. בפרסית ص נשמעת כמו s, ض ו-ظ נשמעות כמו z, ו-غ ו-ق שתיהן נשמעות כמו gh."},
     "items": [
       ["ص", "sâd", "s", true, "صبح", "sobh", "morning", "בוקר"],
       ["ض", "zâd", "z", true, "ضعیف", "za'if", "weak", "חלש"],
       ["ط", "tâ", "t", true, "طلا", "talâ", "gold", "זהב"],
       ["ظ", "zâ", "z", true, "ظهر", "zohr", "noon", "צהריים"],
       ["ع", "eyn", "' (a short stop)", true, "عشق", "eshgh", "love", "אהבה"],
       ["غ", "gheyn", "gh", true, "غذا", "ghazâ", "food", "אוכל"],
       ["ف", "fe", "f", true, "فیل", "fil", "elephant", "פיל"],
       ["ق", "ghâf", "gh", true, "قند", "ghand", "sugar cube", "קוביית סוכר"]
     ]},
    {"id": "alpha4", "kind": "alphabet", "icon": "ک",
     "title": {"en": "Alphabet 4: ک to ی", "he": "אלפבית 4: ک עד ی"},
     "intro": {"en": "The last group! و can be v, u or o, and ی can be y or i. Short vowels (a, e, o) are usually not written at all, so you learn them with each word.", "he": "הקבוצה האחרונה! و יכולה להיות v, u או o, ו-ی יכולה להיות y או i. תנועות קצרות (a, e, o) בדרך כלל לא נכתבות בכלל, ולכן לומדים אותן עם כל מילה."},
     "items": [
       ["ک", "kâf", "k", true, "کتاب", "ketâb", "book", "ספר"],
       ["گ", "gâf", "g", true, "گل", "gol", "flower", "פרח"],
       ["ل", "lâm", "l", true, "لب", "lab", "lip", "שפה (של הפה)"],
       ["م", "mim", "m", true, "ماه", "mâh", "moon", "ירח"],
       ["ن", "nun", "n", true, "نان", "nân", "bread", "לחם"],
       ["و", "vâv", "v / u / o", false, "ورزش", "varzesh", "sport", "ספורט"],
       ["ه", "he", "h", true, "هوا", "havâ", "air, weather", "אוויר, מזג אוויר"],
       ["ی", "ye", "y / i", true, "یک", "yek", "one", "אחת"]
     ]}
  ]
});
