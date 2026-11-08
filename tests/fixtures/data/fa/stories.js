// Test fixture (tests/smoke.html): one dialogue and one story.
TLAP_ADD("fa", {
  "group": {"id": "g-stories", "level": "beginner", "icon": "💬", "title": {"en": "Dialogues & stories", "he": "שיחות וסיפורים"}},
  "lessons": [
    {
     "id": "st_nanvayi",
     "kind": "dialogue",
     "level": "beginner",
     "icon": "🍞",
     "title": {"en": "At the bakery", "he": "במאפייה"},
     "intro": {"en": "It's early morning and you're buying fresh bread in Tehran.", "he": "מוקדם בבוקר ואתה קונה לחם טרי בטהרן."},
     "cast": {"a": {"en": "Baker", "he": "אופה", "icon": "🍞"}, "me": {"en": "You", "he": "אתה"}},
     "lines": [
       {"who": "a", "say": ["سلام، صبح بخیر!", "salâm, sobh bekheyr!", "Hello, good morning!", "שלום, בוקר טוב!"]},
       {"who": "me", "say": ["سلام آقا.", "salâm âghâ.", "Hello, sir.", "שלום, אדוני."], "wrong": [["خداحافظ.", "khodâhâfez.", "Goodbye.", "להתראות."], ["من ایرانی هستم.", "man irâni hastam.", "I am Iranian.", "אני איראני."]]},
       {"who": "a", "say": ["چی می‌خواین؟", "chi mikhâyn?", "What would you like?", "מה תרצה?"]},
       {"who": "me", "say": ["دو تا نان، لطفاً.", "do tâ nân, lotfan.", "Two breads, please.", "שני לחמים, בבקשה."], "wrong": [["اسم من سارا است.", "esm-e man sârâ ast.", "My name is Sara.", "קוראים לי שרה."], ["حال شما چطور است؟", "hâl-e shomâ chetor ast?", "How are you?", "מה שלומך?"]]},
       {"who": "a", "say": ["بفرمایید. ده هزار تومان.", "befarmâyid. dah hezâr tomân.", "Here you are. Ten thousand tomans.", "בבקשה. עשרת אלפים תומאן."]},
       {"who": "me", "say": ["ممنون، خداحافظ!", "mamnun, khodâhâfez!", "Thanks, goodbye!", "תודה, להתראות!"], "wrong": [["صبح بخیر.", "sobh bekheyr.", "Good morning.", "בוקר טוב."], ["کجا زندگی می‌کنی؟", "kojâ zendegi mikoni?", "Where do you live?", "איפה אתה גר?"]]}
     ],
     "items": [
       ["نان", "nân", "bread", "לחם"],
       ["لطفاً", "lotfan", "please", "בבקשה"],
       ["بفرمایید", "befarmâyid", "here you are", "הנה, קח"],
       ["ده", "dah", "ten", "עשר", {"digit": "۱۰"}],
       ["تومان", "tomân", "toman (money)", "תומאן"],
       ["آقا", "âghâ", "sir", "אדוני"]
     ]},
    {
     "id": "st_gorbe",
     "kind": "story",
     "level": "intermediate",
     "icon": "🐈",
     "title": {"en": "The cat and the fish", "he": "החתול והדג"},
     "intro": {"en": "A short story about a cat who lives by a river.", "he": "סיפור קצר על חתול שגר ליד נהר."},
     "lines": [
       {"say": ["یک گربه کنار رود زندگی می‌کند.", "yek gorbe kenâr-e rud zendegi mikonad.", "A cat lives by the river.", "חתול גר ליד הנהר."]},
       {"say": ["اسم گربه ملوس است.", "esm-e gorbe malus ast.", "The cat's name is Malus.", "לחתול קוראים מלוס."]},
       {"say": ["ملوس ماهی خیلی دوست دارد.", "malus mâhi kheyli dust dârad.", "Malus loves fish.", "מלוס מאוד אוהב דגים."]},
       {"say": ["یک روز، یک ماهی بزرگ می‌بیند.", "yek ruz, yek mâhi-ye bozorg mibinad.", "One day, he sees a big fish.", "יום אחד הוא רואה דג גדול."]},
       {"say": ["ماهی می‌پرد و فرار می‌کند.", "mâhi miparad va farâr mikonad.", "The fish jumps and gets away.", "הדג קופץ ובורח."]},
       {"say": ["ملوس می‌خندد و به خانه می‌رود.", "malus mikhandad va be khâne miravad.", "Malus laughs and goes home.", "מלוס צוחק והולך הביתה."]}
     ],
     "questions": [
       {"q": {"en": "Where does the cat live?", "he": "איפה החתול גר?"}, "options": [{"en": "By the river", "he": "ליד הנהר"}, {"en": "In a shop", "he": "בחנות"}, {"en": "At school", "he": "בבית הספר"}], "answer": 0},
       {"q": {"en": "What does Malus love?", "he": "מה מלוס אוהב?"}, "options": [{"en": "Bread", "he": "לחם"}, {"en": "Fish", "he": "דגים"}, {"en": "Milk", "he": "חלב"}], "answer": 1},
       {"q": {"en": "What does the big fish do?", "he": "מה הדג הגדול עושה?"}, "options": [{"en": "It sleeps", "he": "ישן"}, {"en": "It sings", "he": "שר"}, {"en": "It gets away", "he": "בורח"}], "answer": 2}
     ],
     "items": [
       ["گربه", "gorbe", "cat", "חתול"],
       ["رود", "rud", "river", "נהר"],
       ["ماهی", "mâhi", "fish", "דג"],
       ["بزرگ", "bozorg", "big", "גדול"],
       ["روز", "ruz", "day", "יום"],
       ["خانه", "khâne", "house", "בית"]
     ]}
  ]
});
