// Test fixture (tests/smoke.html).
TLAP_ADD("ar", {
  "group": {"id": "g-alphabet", "level": "beginner", "icon": "✍️", "title": {"en": "The alphabet", "he": "האלפבית"}},
  "lessons": [
    {"id": "alpha1", "kind": "alphabet", "icon": "ب", "title": {"en": "Alphabet 1: ا to س", "he": "אלפבית 1: ا עד س"},
     "items": [
       ["ا", "alif", "ā / a", false, "أرنب", "arnab", "rabbit", "ארנב"],
       ["ب", "bā", "b", true, "باب", "bāb", "door", "דלת"],
       ["ت", "tā", "t", true, "تفاح", "tuffāḥ", "apples", "תפוחים"],
       ["ج", "jīm", "j", true, "جمل", "jamal", "camel", "גמל"],
       ["ح", "ḥā", "ḥ", true, "حليب", "ḥalīb", "milk", "חלב"],
       ["د", "dāl", "d", false, "دار", "dār", "house", "בית"],
       ["ر", "rā", "r", false, "رز", "ruzz", "rice", "אורז"],
       ["س", "sīn", "s", true, "سمك", "samak", "fish", "דג"]
     ]}
  ]
});
