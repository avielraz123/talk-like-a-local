// Test fixture (tests/smoke.html).
TLAP_ADD("fa", {
  "group": {"id": "g-basics", "level": "beginner", "icon": "👋", "title": {"en": "Basics", "he": "בסיס"}},
  "lessons": [
    {"id": "greetings", "kind": "vocab", "icon": "👋", "title": {"en": "Greetings", "he": "ברכות"},
     "intro": {"en": "Iranians say سلام (salâm) at any time of day.", "he": "איראנים אומרים سلام (salâm) בכל שעה."},
     "items": [
       ["سلام", "salâm", "hello", "שלום"],
       ["خداحافظ", "khodâhâfez", "goodbye", "להתראות"],
       ["ممنون", "mamnun", "thank you", "תודה"],
       ["لطفاً", "lotfan", "please", "בבקשה"],
       ["بله", "bale", "yes", "כן"],
       ["نه", "na", "no", "לא"],
       ["صبح بخیر", "sobh bekheyr", "good morning", "בוקר טוב"],
       ["به امید دیدار", "be omid-e didâr", "see you again", "עד הפגישה הבאה", {"lit": ["in hope of seeing (you)", "בתקווה להתראות"]}]
     ]},
    {"id": "numbers", "kind": "vocab", "icon": "🔢", "title": {"en": "Numbers ۱ to ۶", "he": "מספרים ۱ עד ۶"},
     "items": [
       ["یک", "yek", "one", "אחת", {"digit": "۱"}],
       ["دو", "do", "two", "שתיים", {"digit": "۲"}],
       ["سه", "se", "three", "שלוש", {"digit": "۳"}],
       ["چهار", "chahâr", "four", "ארבע", {"digit": "۴"}],
       ["پنج", "panj", "five", "חמש", {"digit": "۵"}],
       ["شش", "shesh", "six", "שש", {"digit": "۶"}]
     ]},
    {"id": "first_phrases", "kind": "phrases", "icon": "💬", "title": {"en": "First phrases", "he": "משפטים ראשונים"},
     "items": [
       ["اسم من سارا است", "esm-e man sârâ ast", "My name is Sara", "קוראים לי שרה"],
       ["حال شما چطور است؟", "hâl-e shomâ chetor ast?", "How are you?", "מה שלומך?"],
       ["من ایرانی هستم", "man irâni hastam", "I am Iranian", "אני איראני"],
       ["من فارسی بلد نیستم", "man fârsi balad nistam", "I don't know Farsi", "אני לא יודע פרסית"],
       ["خیلی خوشحال شدم", "kheyli khoshhâl shodam", "Nice to meet you", "נעים מאוד"],
       ["کجا زندگی می‌کنی؟", "kojâ zendegi mikoni?", "Where do you live?", "איפה אתה גר?"]
     ]}
  ]
});
