// Test fixture (tests/smoke.html).
TLAP_ADD("ja", {
  "group": {"id": "g-basics", "level": "beginner", "icon": "👋", "title": {"en": "Basics", "he": "בסיס"}},
  "lessons": [
    {"id": "greetings", "kind": "vocab", "icon": "👋", "title": {"en": "Greetings", "he": "ברכות"},
     "intro": {"en": "こんにちは (konnichiwa) is a daytime hello.", "he": "こんにちは (konnichiwa) היא ברכת שלום של היום."},
     "items": [
       ["こんにちは", "konnichiwa", "hello", "שלום"],
       ["ありがとう", "arigatō", "thank you", "תודה"],
       ["さようなら", "sayōnara", "goodbye", "להתראות"],
       ["はい", "hai", "yes", "כן"],
       ["いいえ", "iie", "no", "לא"],
       ["おはよう", "ohayō", "good morning", "בוקר טוב"],
       ["すみません", "sumimasen", "excuse me", "סליחה"],
       ["お元気ですか", "ogenki desu ka", "How are you?", "מה שלומך?", {"kana": "おげんきですか", "parts": ["お元気", "です", "か"]}]
     ]},
    {"id": "numbers", "kind": "vocab", "icon": "🔢", "title": {"en": "Numbers 一 to 六", "he": "מספרים 一 עד 六"},
     "items": [
       ["いち", "ichi", "one", "אחת", {"digit": "一"}],
       ["に", "ni", "two", "שתיים", {"digit": "二"}],
       ["さん", "san", "three", "שלוש", {"digit": "三"}],
       ["よん", "yon", "four", "ארבע", {"digit": "四"}],
       ["ご", "go", "five", "חמש", {"digit": "五"}],
       ["ろく", "roku", "six", "שש", {"digit": "六"}]
     ]},
    {"id": "first_phrases", "kind": "phrases", "icon": "💬", "title": {"en": "First phrases", "he": "משפטים ראשונים"},
     "items": [
       ["わたしは学生です。", "watashi wa gakusei desu", "I am a student.", "אני סטודנט.", {"kana": "わたしはがくせいです", "parts": ["わたし", "は", "学生", "です"]}],
       ["これはなんですか？", "kore wa nan desu ka?", "What is this?", "מה זה?", {"parts": ["これ", "は", "なん", "です", "か"]}],
       ["トイレはどこですか？", "toire wa doko desu ka?", "Where is the toilet?", "איפה השירותים?", {"parts": ["トイレ", "は", "どこ", "です", "か"]}],
       ["日本語がわかりません。", "nihongo ga wakarimasen", "I don't understand Japanese.", "אני לא מבין יפנית.", {"kana": "にほんごがわかりません", "parts": ["日本語", "が", "わかりません"]}],
       ["よろしくおねがいします。", "yoroshiku onegai shimasu", "Nice to meet you.", "נעים מאוד.", {"parts": ["よろしく", "おねがい", "します"]}],
       ["東京に住んでいます。", "tōkyō ni sunde imasu", "I live in Tokyo.", "אני גר בטוקיו.", {"kana": "とうきょうにすんでいます", "parts": ["東京", "に", "住んで", "います"]}]
     ]}
  ]
});
