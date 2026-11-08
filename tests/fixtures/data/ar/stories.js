// Test fixture (tests/smoke.html): one dialogue and one story.
TLAP_ADD("ar", {
  "group": {"id": "g-stories", "level": "beginner", "icon": "💬", "title": {"en": "Dialogues & stories", "he": "שיחות וסיפורים"}},
  "lessons": [
    {
     "id": "st_falafel",
     "kind": "dialogue",
     "level": "beginner",
     "icon": "🧆",
     "title": {"en": "At the falafel stand", "he": "בדוכן הפלאפל"},
     "intro": {"en": "You're hungry and stop at a falafel stand in Amman.", "he": "אתה רעב ועוצר בדוכן פלאפל בעמאן."},
     "cast": {"a": {"en": "Falafel seller", "he": "מוכר הפלאפל", "icon": "🧆"}, "me": {"en": "You", "he": "אתה"}},
     "lines": [
       {"who": "a", "say": ["أهلا وسهلا! شو بدك؟", "ahla w sahla! shū biddak?", "Welcome! What would you like?", "ברוך הבא! מה אתה רוצה?"]},
       {"who": "me", "say": ["بدي سندويشة فلافل.", "biddi sandwīshet falāfel.", "I'd like a falafel sandwich.", "אני רוצה כריך פלאפל."], "wrong": [["أنا من عمّان.", "ana min 3ammān.", "I'm from Amman.", "אני מעמאן."], ["مع السلامة.", "ma3 is-salāme.", "Goodbye.", "להתראות."]]},
       {"who": "a", "say": ["بدك حمص كمان؟", "biddak ḥummuṣ kamān?", "Do you want hummus too?", "אתה רוצה גם חומוס?"]},
       {"who": "me", "say": ["إيه، أكيد!", "ē, akīd!", "Yes, sure!", "כן, בטח!"], "wrong": [["شو اسمك؟", "shū ismak?", "What's your name?", "איך קוראים לך?"], ["صباح الخير.", "ṣabāḥ il-khēr.", "Good morning.", "בוקר טוב."]]},
       {"who": "a", "say": ["تفضل. عشرة شيكل.", "tfaḍḍal. 3ashra shēkel.", "Here you go. Ten shekels.", "בבקשה. עשרה שקל."]},
       {"who": "me", "say": ["شكرا كتير!", "shukran ktīr!", "Thanks a lot!", "תודה רבה!"], "wrong": [["ما بحكي عربي.", "ma baḥki 3arabi.", "I don't speak Arabic.", "אני לא מדבר ערבית."], ["كيفك؟", "kīfak?", "How are you?", "מה שלומך?"]]}
     ],
     "items": [
       ["فلافل", "falāfel", "falafel", "פלאפל"],
       ["حمص", "ḥummuṣ", "hummus", "חומוס"],
       ["كمان", "kamān", "also", "גם"],
       ["أكيد", "akīd", "sure", "בטח"],
       ["تفضل", "tfaḍḍal", "here you go", "הנה, קח"],
       ["كتير", "ktīr", "a lot", "הרבה"]
     ]},
    {
     "id": "st_jamal",
     "kind": "story",
     "level": "advanced",
     "icon": "🐪",
     "title": {"en": "Saeed the camel", "he": "סעיד הגמל"},
     "intro": {"en": "A camel, the desert and a lot of water.", "he": "גמל, מדבר והרבה מים."},
     "lines": [
       {"say": ["في جمل اسمه سعيد.", "fī jamal ismo sa3īd.", "There's a camel named Saeed.", "יש גמל ששמו סעיד."]},
       {"say": ["سعيد ساكن بالصحرا.", "sa3īd sāken bi-ṣ-ṣaḥra.", "Saeed lives in the desert.", "סעיד גר במדבר."]},
       {"say": ["كل يوم بيمشي لحد البير.", "kull yōm bimshi la-ḥadd il-bīr.", "Every day he walks to the well.", "כל יום הוא הולך עד הבאר."]},
       {"say": ["بيشرب مي كتير.", "bishrab mayy ktīr.", "He drinks a lot of water.", "הוא שותה הרבה מים."]},
       {"say": ["بالليل بيقعد تحت النجوم.", "bil-lēl bi'3od taḥt in-njūm.", "At night he sits under the stars.", "בלילה הוא יושב מתחת לכוכבים."]},
       {"say": ["سعيد جمل مبسوط.", "sa3īd jamal mabsūṭ.", "Saeed is a happy camel.", "סעיד הוא גמל מאושר."]}
     ],
     "questions": [
       {"q": {"en": "Where does Saeed live?", "he": "איפה סעיד גר?"}, "options": [{"en": "In the city", "he": "בעיר"}, {"en": "In the desert", "he": "במדבר"}, {"en": "By the sea", "he": "ליד הים"}], "answer": 1},
       {"q": {"en": "What does he drink?", "he": "מה הוא שותה?"}, "options": [{"en": "Water", "he": "מים"}, {"en": "Coffee", "he": "קפה"}, {"en": "Tea", "he": "תה"}], "answer": 0},
       {"q": {"en": "What does he do at night?", "he": "מה הוא עושה בלילה?"}, "options": [{"en": "He works", "he": "עובד"}, {"en": "He sits under the stars", "he": "יושב מתחת לכוכבים"}, {"en": "He eats falafel", "he": "אוכל פלאפל"}], "answer": 1}
     ],
     "items": [
       ["جمل", "jamal", "camel", "גמל"],
       ["صحرا", "ṣaḥra", "desert", "מדבר"],
       ["بير", "bīr", "well (water)", "באר"],
       ["مي", "mayy", "water", "מים"],
       ["ليل", "lēl", "night", "לילה"],
       ["نجوم", "njūm", "stars", "כוכבים"],
       ["مبسوط", "mabsūṭ", "happy", "שמח"]
     ]}
  ]
});
