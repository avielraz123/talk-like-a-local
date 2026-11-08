// Test fixture (tests/smoke.html).
TLAP_ADD("ar", {
  "group": {"id": "g-basics", "level": "beginner", "icon": "👋", "title": {"en": "Basics", "he": "בסיס"}},
  "lessons": [
    {"id": "greetings", "kind": "vocab", "icon": "👋", "title": {"en": "Greetings", "he": "ברכות"},
     "intro": {"en": "مرحبا (marḥaba) is the everyday hello.", "he": "مرحبا (marḥaba) היא ברכת השלום היומיומית."},
     "items": [
       ["مرحبا", "marḥaba", "hello", "שלום"],
       ["أهلا", "ahla", "hi", "היי"],
       ["شكرا", "shukran", "thank you", "תודה"],
       ["مع السلامة", "ma3 is-salāme", "goodbye", "להתראות"],
       ["إيه", "ē", "yes", "כן"],
       ["لا", "la", "no", "לא"],
       ["صباح الخير", "ṣabāḥ il-khēr", "good morning", "בוקר טוב"],
       ["كيفك؟", "kīfak?", "How are you?", "מה שלומך?"]
     ]},
    {"id": "numbers", "kind": "vocab", "icon": "🔢", "title": {"en": "Numbers ١ to ٦", "he": "מספרים ١ עד ٦"},
     "items": [
       ["واحد", "wāḥad", "one", "אחת", {"digit": "١"}],
       ["تنين", "tnēn", "two", "שתיים", {"digit": "٢"}],
       ["تلاتة", "tlēte", "three", "שלוש", {"digit": "٣"}],
       ["أربعة", "arba3a", "four", "ארבע", {"digit": "٤"}],
       ["خمسة", "khamse", "five", "חמש", {"digit": "٥"}],
       ["ستة", "sitte", "six", "שש", {"digit": "٦"}]
     ]},
    {"id": "first_phrases", "kind": "phrases", "icon": "💬", "title": {"en": "First phrases", "he": "משפטים ראשונים"},
     "items": [
       ["شو اسمك؟", "shū ismak?", "What's your name?", "איך קוראים לך?"],
       ["أنا من عمّان", "ana min 3ammān", "I'm from Amman", "אני מעמאן"],
       ["ما بحكي عربي", "ma baḥki 3arabi", "I don't speak Arabic", "אני לא מדבר ערבית"],
       ["بدي كاسة مي", "biddi kāset mayy", "I want a glass of water", "אני רוצה כוס מים"],
       ["كل شي تمام", "kull shi tamām", "Everything's fine", "הכול בסדר"],
       ["شو بتحب تاكل؟", "shū bitḥibb tākul?", "What do you like to eat?", "מה אתה אוהב לאכול?"],
       ["يلا نروح", "yalla nrūḥ", "Let's go", "יאללה הולכים"]
     ]}
  ]
});
