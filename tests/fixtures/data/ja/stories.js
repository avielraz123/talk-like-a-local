// Test fixture (tests/smoke.html): one dialogue and one story.
TLAP_ADD("ja", {
  "group": {"id": "g-stories", "level": "beginner", "icon": "💬", "title": {"en": "Dialogues & stories", "he": "שיחות וסיפורים"}},
  "lessons": [
    {
     "id": "st_kissa",
     "kind": "dialogue",
     "level": "beginner",
     "icon": "☕",
     "title": {"en": "At the coffee shop", "he": "בבית הקפה"},
     "intro": {"en": "You walk into a small coffee shop (喫茶店) in Tokyo.", "he": "אתה נכנס לבית קפה קטן (喫茶店) בטוקיו."},
     "cast": {"a": {"en": "Waiter", "he": "מלצר", "icon": "☕"}, "me": {"en": "You", "he": "אתה"}},
     "lines": [
       {"who": "a", "say": ["いらっしゃいませ！", "irasshaimase!", "Welcome!", "ברוכים הבאים!"]},
       {"who": "me", "say": ["こんにちは。", "konnichiwa.", "Hello.", "שלום."], "wrong": [["さようなら。", "sayōnara.", "Goodbye.", "להתראות."], ["わたしは学生です。", "watashi wa gakusei desu.", "I am a student.", "אני סטודנט.", {"kana": "わたしはがくせいです"}]]},
       {"who": "a", "say": ["ご注文は？", "go chūmon wa?", "What would you like to order?", "מה תרצה להזמין?", {"kana": "ごちゅうもんは"}]},
       {"who": "me", "say": ["コーヒーをください。", "kōhī o kudasai.", "A coffee, please.", "קפה, בבקשה."], "wrong": [["トイレはどこですか？", "toire wa doko desu ka?", "Where is the toilet?", "איפה השירותים?"], ["おはよう。", "ohayō.", "Good morning.", "בוקר טוב."]]},
       {"who": "a", "say": ["はい、どうぞ。", "hai, dōzo.", "Here you go.", "הנה, בבקשה."]},
       {"who": "me", "say": ["ありがとうございます。", "arigatō gozaimasu.", "Thank you very much.", "תודה רבה."], "wrong": [["いいえ。", "iie.", "No.", "לא."], ["日本語がわかりません。", "nihongo ga wakarimasen.", "I don't understand Japanese.", "אני לא מבין יפנית.", {"kana": "にほんごがわかりません"}]]}
     ],
     "items": [
       ["コーヒー", "kōhī", "coffee", "קפה"],
       ["ください", "kudasai", "please (give me)", "בבקשה (תן לי)"],
       ["ご注文", "go chūmon", "order", "הזמנה", {"kana": "ごちゅうもん"}],
       ["どうぞ", "dōzo", "here you go", "הנה, קח"],
       ["いらっしゃいませ", "irasshaimase", "welcome (in a shop)", "ברוכים הבאים (בחנות)"],
       ["ありがとうございます", "arigatō gozaimasu", "thank you very much", "תודה רבה"]
     ]},
    {
     "id": "st_neko",
     "kind": "story",
     "level": "intermediate",
     "icon": "🐈",
     "title": {"en": "Tama the cat", "he": "החתולה טמה"},
     "intro": {"en": "A day in the life of a small cat.", "he": "יום בחייה של חתולה קטנה."},
     "lines": [
       {"say": ["ねこのタマは小さいです。", "neko no tama wa chiisai desu.", "Tama the cat is small.", "החתולה טמה קטנה.", {"kana": "ねこのタマはちいさいです"}]},
       {"say": ["タマは魚が大好きです。", "tama wa sakana ga daisuki desu.", "Tama loves fish.", "טמה מאוד אוהבת דגים.", {"kana": "タマはさかながだいすきです"}]},
       {"say": ["朝、タマは公園に行きます。", "asa, tama wa kōen ni ikimasu.", "In the morning, Tama goes to the park.", "בבוקר טמה הולכת לפארק.", {"kana": "あさタマはこうえんにいきます"}]},
       {"say": ["公園で犬に会います。", "kōen de inu ni aimasu.", "At the park she meets a dog.", "בפארק היא פוגשת כלב.", {"kana": "こうえんでいぬにあいます"}]},
       {"say": ["犬とタマは友だちになります。", "inu to tama wa tomodachi ni narimasu.", "The dog and Tama become friends.", "הכלב וטמה נעשים חברים.", {"kana": "いぬとタマはともだちになります"}]},
       {"say": ["夜、タマはうちで寝ます。", "yoru, tama wa uchi de nemasu.", "At night, Tama sleeps at home.", "בלילה טמה ישנה בבית.", {"kana": "よるタマはうちでねます"}]}
     ],
     "questions": [
       {"q": {"en": "What does Tama love?", "he": "מה טמה אוהבת?"}, "options": [{"en": "Fish", "he": "דגים"}, {"en": "Rice", "he": "אורז"}, {"en": "Milk", "he": "חלב"}], "answer": 0},
       {"q": {"en": "Who does Tama meet at the park?", "he": "את מי טמה פוגשת בפארק?"}, "options": [{"en": "A bird", "he": "ציפור"}, {"en": "A dog", "he": "כלב"}, {"en": "A teacher", "he": "מורה"}], "answer": 1},
       {"q": {"en": "Where does Tama sleep?", "he": "איפה טמה ישנה?"}, "options": [{"en": "In the park", "he": "בפארק"}, {"en": "At school", "he": "בבית הספר"}, {"en": "At home", "he": "בבית"}], "answer": 2}
     ],
     "items": [
       ["ねこ", "neko", "cat", "חתול"],
       ["魚", "sakana", "fish", "דג", {"kana": "さかな"}],
       ["公園", "kōen", "park", "פארק", {"kana": "こうえん"}],
       ["犬", "inu", "dog", "כלב", {"kana": "いぬ"}],
       ["友だち", "tomodachi", "friend", "חבר", {"kana": "ともだち"}],
       ["夜", "yoru", "night", "לילה", {"kana": "よる"}]
     ]}
  ]
});
