// Test fixture (tests/smoke.html): a few Persian letters.
TLAP_ADD("fa", {
  "group": {"id": "g-alphabet", "level": "beginner", "icon": "✍️", "title": {"en": "The alphabet", "he": "האלפבית"}},
  "lessons": [
    {"id": "alpha1", "kind": "alphabet", "icon": "ا", "title": {"en": "Alphabet 1: ا to ش", "he": "אלפבית 1: ا עד ش"},
     "intro": {"en": "Farsi is written from right to left. Digits ۱ ۲ ۳ go left to right.", "he": "פרסית נכתבת מימין לשמאל. הספרות ۱ ۲ ۳ משמאל לימין."},
     "items": [
       ["ا", "alef", "â / a", false, "آب", "âb", "water", "מים"],
       ["ب", "be", "b", true, "بابا", "bâbâ", "dad", "אבא"],
       ["پ", "pe", "p", true, "پدر", "pedar", "father", "אב"],
       ["ت", "te", "t", true, "توت", "tut", "mulberry", "תות"],
       ["د", "dâl", "d", false, "در", "dar", "door", "דלת"],
       ["ر", "re", "r", false, "روز", "ruz", "day", "יום"],
       ["س", "sin", "s", true, "سیب", "sib", "apple", "תפוח"],
       ["ش", "shin", "sh", true, "شب", "shab", "night", "לילה"]
     ]}
  ]
});
