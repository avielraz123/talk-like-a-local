// Test fixture (tests/smoke.html): one dialogue and one story.
TLAP_ADD("es", {
  "group": {"id": "g-stories", "level": "beginner", "icon": "💬", "title": {"en": "Dialogues & stories", "he": "שיחות וסיפורים"}},
  "lessons": [
    {
     "id": "st_gato",
     "kind": "story",
     "level": "intermediate",
     "icon": "🐈",
     "title": {"en": "Pancho the cat", "he": "החתול פנצ'ו"},
     "intro": {"en": "Lupe and her cat live in a small town in Mexico.", "he": "לופה והחתול שלה גרים בעיירה קטנה במקסיקו."},
     "lines": [
       {"say": ["Lupe tiene un gato negro.", "LU-pe TIE-ne un GA-to NE-gro.", "Lupe has a black cat.", "ללופה יש חתול שחור."]},
       {"say": ["El gato se llama Pancho.", "el GA-to se LLA-ma PAN-cho.", "The cat is called Pancho.", "לחתול קוראים פנצ'ו."]},
       {"say": ["Cada mañana, Pancho come pescado.", "CA-da ma-ÑA-na, PAN-cho CO-me pes-CA-do.", "Every morning, Pancho eats fish.", "כל בוקר פנצ'ו אוכל דג."]},
       {"say": "broken line"},
       {"say": ["Un día, Pancho no está en casa.", "un DÍ-a, PAN-cho no es-TÁ en CA-sa.", "One day, Pancho isn't at home.", "יום אחד פנצ'ו לא בבית."]},
       {"say": ["Lupe lo busca en el jardín.", "LU-pe lo BUS-ca en el jar-DÍN.", "Lupe looks for him in the garden.", "לופה מחפשת אותו בגינה."]},
       {"say": ["¡Pancho está arriba del árbol!", "¡PAN-cho es-TÁ a-RRI-ba del ÁR-bol!", "Pancho is up in the tree!", "פנצ'ו למעלה על העץ!"]}
     ],
     "questions": [
       {"q": {"en": "What color is the cat?", "he": "מה הצבע של החתול?"}, "options": [{"en": "Black", "he": "שחור"}, {"en": "White", "he": "לבן"}, {"en": "Orange", "he": "כתום"}], "answer": 0},
       {"q": {"en": "What does Pancho eat in the morning?", "he": "מה פנצ'ו אוכל בבוקר?"}, "options": [{"en": "Bread", "he": "לחם"}, {"en": "Fish", "he": "דג"}, {"en": "Rice", "he": "אורז"}], "answer": 1},
       {"q": {"en": "Broken question"}, "options": [{"en": "only one"}], "answer": 4},
       {"q": {"en": "Where is Pancho in the end?", "he": "איפה פנצ'ו בסוף?"}, "options": [{"en": "In the house", "he": "בבית"}, {"en": "In the car", "he": "במכונית"}, {"en": "Up in the tree", "he": "על העץ"}], "answer": 2}
     ],
     "items": [
       ["gato", "GA-to", "cat", "חתול"],
       ["negro", "NE-gro", "black", "שחור"],
       ["pescado", "pes-CA-do", "fish (food)", "דג"],
       ["casa", "CA-sa", "house", "בית"],
       ["jardín", "jar-DÍN", "garden", "גינה"],
       ["árbol", "ÁR-bol", "tree", "עץ"]
     ]},
    {
     "id": "st_cafe",
     "kind": "dialogue",
     "level": "beginner",
     "icon": "☕",
     "title": {"en": "At the café", "he": "בבית הקפה"},
     "intro": {"en": "You're ordering a coffee at a café in Bogotá.", "he": "אתה מזמין קפה בבית קפה בבוגוטה."},
     "cast": {"a": {"en": "Waiter", "he": "מלצר", "icon": "☕"}, "me": {"en": "You", "he": "אתה"}},
     "lines": [
       {"who": "a", "say": ["¡Hola! Buenos días.", "¡HO-la! BUE-nos DÍ-as.", "Hi! Good morning.", "היי! בוקר טוב."]},
       {"who": "me", "say": ["Buenos días.", "BUE-nos DÍ-as.", "Good morning.", "בוקר טוב."], "wrong": [["Hasta mañana.", "AS-ta ma-ÑA-na.", "See you tomorrow.", "להתראות מחר."], ["Tengo dos hermanos.", "TEN-go DOS her-MA-nos.", "I have two brothers.", "יש לי שני אחים."]]},
       {"who": "x", "say": ["Hola", "HO-la", "hello", "שלום"]},
       {"who": "a", "say": ["¿Qué quiere tomar?", "¿QUÉ QUIE-re to-MAR?", "What would you like to drink?", "מה תרצה לשתות?"]},
       {"who": "me", "say": ["Un café con leche, por favor.", "un ca-FÉ con LE-che, por fa-VOR.", "A coffee with milk, please.", "קפה עם חלב, בבקשה."], "wrong": [["Soy de México.", "SOY de MÉ-xi-co.", "I'm from Mexico.", "אני ממקסיקו."], ["Mucho gusto.", "MU-cho GUS-to.", "Nice to meet you.", "נעים מאוד."]]},
       {"who": "a", "say": ["Aquí tiene. Son dos dólares.", "a-QUÍ TIE-ne. SON DOS DÓ-la-res.", "Here you go. That's two dollars.", "בבקשה. זה שני דולר."]},
       {"who": "me", "say": ["Gracias. ¡Hasta luego!", "GRA-cias. ¡AS-ta LUE-go!", "Thanks. See you later!", "תודה. להתראות!"], "wrong": [["¿Cómo te llamas?", "CÓ-mo te LLA-mas?", "What's your name?", "איך קוראים לך?"], ["Buenas noches.", "BUE-nas NO-ches.", "Good night.", "לילה טוב."]]}
     ],
     "items": [
       ["café", "ca-FÉ", "coffee", "קפה"],
       ["leche", "LE-che", "milk", "חלב"],
       ["por favor", "por fa-VOR", "please", "בבקשה"],
       ["aquí tiene", "a-QUÍ TIE-ne", "here you go", "הנה, קח"],
       ["dólar", "DÓ-lar", "dollar", "דולר"],
       ["hasta luego", "AS-ta LUE-go", "see you later", "נתראה אחר כך"]
     ]}
  ]
});
