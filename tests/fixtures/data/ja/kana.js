// Test fixture (tests/smoke.html).
TLAP_ADD("ja", {
  "group": {"id": "g-kana", "level": "beginner", "icon": "あ", "title": {"en": "Hiragana & katakana", "he": "היראגנה וקטקנה"}},
  "lessons": [
    {"id": "hira1", "kind": "alphabet", "icon": "あ", "title": {"en": "Hiragana: あ to く", "he": "היראגנה: あ עד く"},
     "intro": {"en": "Hiragana (ひらがな) is for native words.", "he": "היראגנה (ひらがな) משמשת למילים יפניות."},
     "items": [
       ["あ", "a", "a", false, "あめ", "ame", "rain", "גשם"],
       ["い", "i", "i", false, "いぬ", "inu", "dog", "כלב"],
       ["う", "u", "u", false, "うみ", "umi", "sea", "ים"],
       ["え", "e", "e", false, "えき", "eki", "station", "תחנה"],
       ["お", "o", "o", false, "おかし", "okashi", "sweets", "ממתקים"],
       ["か", "ka", "ka", false, "かさ", "kasa", "umbrella", "מטרייה"],
       ["き", "ki", "ki", false, "きた", "kita", "north", "צפון"],
       ["く", "ku", "ku", false, "くつ", "kutsu", "shoes", "נעליים"]
     ]},
    {"id": "kata1", "kind": "alphabet", "icon": "ア", "title": {"en": "Katakana: first steps", "he": "קטקנה: צעדים ראשונים"},
     "items": [
       ["ア", "a", "a", false, "アイス", "aisu", "ice cream", "גלידה"],
       ["イ", "i", "i", false, "イルカ", "iruka", "dolphin", "דולפין"],
       ["カ", "ka", "ka", false, "カメラ", "kamera", "camera", "מצלמה"],
       ["コ", "ko", "ko", false, "コーヒー", "kōhī", "coffee", "קפה"],
       ["テ", "te", "te", false, "テレビ", "terebi", "television", "טלוויזיה"],
       ["パ", "pa", "pa", false, "パン", "pan", "bread", "לחם"]
     ]}
  ]
});
