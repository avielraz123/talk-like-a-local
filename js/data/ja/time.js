// Time: days, months & seasons, telling the time, weather.
TLAP_ADD("ja", {
  "group": {"id": "g-time", "level": "intermediate", "icon": "📅", "title": {"en": "Time", "he": "זמן"}},
  "lessons": [
    {
      "id": "time", "kind": "vocab", "icon": "📅",
      "title": {"en": "Days & time", "he": "ימים וזמן"},
      "intro": {
        "en": "Japanese day names come from the moon, the sun and five elements: 月曜日 getsuyōbi (Monday) is \"moon day\", then fire (火), water (水), wood (木), gold (金) and earth (土), and 日曜日 nichiyōbi (Sunday) is \"sun day\". In speech the final 日 is often dropped: getsuyō, kayō...",
        "he": "שמות הימים ביפנית באים מהירח, מהשמש ומחמישה יסודות: 月曜日 getsuyōbi (יום שני) הוא \"יום הירח\", אחריו אש (火), מים (水), עץ (木), זהב (金) ואדמה (土), ו-日曜日 nichiyōbi (יום ראשון) הוא \"יום השמש\". בדיבור מורידים לעתים קרובות את ה-日 בסוף: getsuyō, kayō..."
      },
      "items": [
        ["月曜日", "getsuyōbi", "Monday", "יום שני", {"kana": "げつようび"}],
        ["火曜日", "kayōbi", "Tuesday", "יום שלישי", {"kana": "かようび"}],
        ["水曜日", "suiyōbi", "Wednesday", "יום רביעי", {"kana": "すいようび"}],
        ["木曜日", "mokuyōbi", "Thursday", "יום חמישי", {"kana": "もくようび"}],
        ["金曜日", "kin'yōbi", "Friday", "יום שישי", {"kana": "きんようび"}],
        ["土曜日", "doyōbi", "Saturday", "שבת", {"kana": "どようび"}],
        ["日曜日", "nichiyōbi", "Sunday", "יום ראשון", {"kana": "にちようび"}],
        ["今日", "kyō", "today", "היום", {"kana": "きょう"}],
        ["明日", "ashita", "tomorrow", "מחר", {"kana": "あした"}],
        ["昨日", "kinō", "yesterday", "אתמול", {"kana": "きのう"}],
        ["あさって", "asatte", "the day after tomorrow", "מחרתיים"],
        ["週", "shū", "week", "שבוע", {"kana": "しゅう"}],
        ["毎日", "mainichi", "every day", "כל יום", {"kana": "まいにち"}],
        ["年", "toshi", "year", "שנה", {"kana": "とし"}],
        ["週末", "shūmatsu", "weekend", "סוף שבוע", {"kana": "しゅうまつ"}],
        ["来週", "raishū", "next week", "השבוע הבא", {"kana": "らいしゅう"}]
      ]
    },
    {
      "id": "months", "kind": "vocab", "icon": "🗓️",
      "title": {"en": "Months & seasons", "he": "חודשים ועונות"},
      "intro": {
        "en": "Japanese months are simply numbered: number + 月 (gatsu). 一月 ichigatsu is \"month one\", January. Three to watch: April is shigatsu (not yon), July is shichigatsu (not nana) and September is kugatsu (not kyū). In everyday writing you'll usually see Arabic numerals: 1月, 4月.",
        "he": "החודשים ביפנית פשוט ממוספרים: מספר + 月 (gatsu). 一月 ichigatsu הוא \"חודש אחד\", ינואר. שלושה ששווה לשים לב אליהם: אפריל הוא shigatsu (לא yon), יולי הוא shichigatsu (לא nana) וספטמבר הוא kugatsu (לא kyū). בכתיבה יומיומית רואים בדרך כלל ספרות רגילות: 1月, 4月."
      },
      "items": [
        ["一月", "ichigatsu", "January", "ינואר", {"kana": "いちがつ"}],
        ["二月", "nigatsu", "February", "פברואר", {"kana": "にがつ"}],
        ["三月", "sangatsu", "March", "מרץ", {"kana": "さんがつ"}],
        ["四月", "shigatsu", "April", "אפריל", {"kana": "しがつ"}],
        ["五月", "gogatsu", "May", "מאי", {"kana": "ごがつ"}],
        ["六月", "rokugatsu", "June", "יוני", {"kana": "ろくがつ"}],
        ["七月", "shichigatsu", "July", "יולי", {"kana": "しちがつ"}],
        ["八月", "hachigatsu", "August", "אוגוסט", {"kana": "はちがつ"}],
        ["九月", "kugatsu", "September", "ספטמבר", {"kana": "くがつ"}],
        ["十月", "jūgatsu", "October", "אוקטובר", {"kana": "じゅうがつ"}],
        ["十一月", "jūichigatsu", "November", "נובמבר", {"kana": "じゅういちがつ"}],
        ["十二月", "jūnigatsu", "December", "דצמבר", {"kana": "じゅうにがつ"}],
        ["春", "haru", "spring", "אביב", {"kana": "はる"}],
        ["夏", "natsu", "summer", "קיץ", {"kana": "なつ"}],
        ["秋", "aki", "autumn", "סתיו", {"kana": "あき"}],
        ["冬", "fuyu", "winter", "חורף", {"kana": "ふゆ"}]
      ]
    },
    {
      "id": "clock", "kind": "vocab", "icon": "🕒",
      "title": {"en": "Telling the time", "he": "מה השעה"},
      "intro": {
        "en": "Say the hour + 時 (ji), then です: 三時です (sanji desu) = it's three o'clock. Half past is 半 (han): 二時半 = 2:30. Watch out: 4 o'clock is yoji, 7 is shichiji and 9 is kuji. 午前 (a.m.) and 午後 (p.m.) go before the time: 午後三時 = 3 p.m.",
        "he": "אומרים את השעה + 時 (ji), ואחר כך です: 三時です (sanji desu) = השעה שלוש. \"וחצי\" זה 半 (han): 二時半 = 2:30. שימו לב: ארבע זה yoji, שבע זה shichiji ותשע זה kuji. 午前 (לפני הצהריים) ו-午後 (אחר הצהריים) באים לפני השעה: 午後三時 = שלוש אחר הצהריים."
      },
      "items": [
        ["時間", "jikan", "time / hours", "זמן / שעות", {"kana": "じかん"}],
        ["分", "fun", "minute", "דקה", {"kana": "ふん"}],
        ["秒", "byō", "second (time)", "שנייה", {"kana": "びょう"}],
        ["半", "han", "half (past)", "חצי", {"kana": "はん"}],
        ["午前", "gozen", "a.m. / morning", "לפני הצהריים", {"kana": "ごぜん"}],
        ["午後", "gogo", "p.m. / afternoon", "אחר הצהריים", {"kana": "ごご"}],
        ["朝", "asa", "morning", "בוקר", {"kana": "あさ"}],
        ["昼", "hiru", "noon / daytime", "צהריים", {"kana": "ひる"}],
        ["夕方", "yūgata", "early evening", "ערב (מוקדם)", {"kana": "ゆうがた"}],
        ["夜", "yoru", "night", "לילה", {"kana": "よる"}],
        ["時計", "tokei", "clock / watch", "שעון", {"kana": "とけい"}],
        ["今何時ですか？", "ima nanji desu ka?", "What time is it now?", "מה השעה עכשיו?", {"kana": "いまなんじですか", "parts": ["今", "何時", "です", "か"]}],
        ["三時です。", "sanji desu.", "It's three o'clock.", "השעה שלוש.", {"kana": "さんじです"}],
        ["二時半です。", "niji han desu.", "It's half past two.", "השעה שתיים וחצי.", {"kana": "にじはんです", "parts": ["二時", "半", "です"]}],
        ["四時十五分です。", "yoji jūgofun desu.", "It's a quarter past four.", "השעה ארבע ורבע.", {"kana": "よじじゅうごふんです", "parts": ["四時", "十五分", "です"]}],
        ["五時十分前です。", "goji juppun mae desu.", "It's ten to five.", "השעה עשרה לחמש.", {"kana": "ごじじゅっぷんまえです", "parts": ["五時", "十分", "前", "です"]}]
      ]
    },
    {
      "id": "weather", "kind": "vocab", "icon": "🌦️",
      "title": {"en": "Weather", "he": "מזג אוויר"},
      "intro": {
        "en": "In Japanese, rain and snow \"fall\": 雨が降っています (ame ga futte imasu) = it's raining. Hot weather is 暑い (atsui), but something hot to the touch is 熱い: same sound, different kanji. Small talk about the weather, ending in ね (ne, \"isn't it?\"), is the classic way to start a chat.",
        "he": "ביפנית גשם ושלג \"נופלים\": 雨が降っています (ame ga futte imasu) = יורד גשם. מזג אוויר חם הוא 暑い (atsui), אבל משהו חם למגע הוא 熱い: אותו צליל, קאנג'י אחר. שיחת חולין על מזג האוויר שמסתיימת ב-ね (ne, \"נכון?\") היא הדרך הקלאסית לפתוח שיחה."
      },
      "items": [
        ["天気", "tenki", "weather", "מזג אוויר", {"kana": "てんき"}],
        ["雨", "ame", "rain", "גשם", {"kana": "あめ"}],
        ["雪", "yuki", "snow", "שלג", {"kana": "ゆき"}],
        ["風", "kaze", "wind", "רוח", {"kana": "かぜ"}],
        ["晴れ", "hare", "sunny / clear weather", "שמשי / בהיר", {"kana": "はれ"}],
        ["曇り", "kumori", "cloudy weather", "מעונן", {"kana": "くもり"}],
        ["台風", "taifū", "typhoon", "טייפון", {"kana": "たいふう"}],
        ["傘", "kasa", "umbrella", "מטרייה", {"kana": "かさ"}],
        ["気温", "kion", "temperature (air)", "טמפרטורה", {"kana": "きおん"}],
        ["天気予報", "tenki yohō", "weather forecast", "תחזית מזג האוויר", {"kana": "てんきよほう"}],
        ["暑い", "atsui", "hot (weather)", "חם (מזג אוויר)", {"kana": "あつい"}],
        ["寒い", "samui", "cold (weather)", "קר (מזג אוויר)", {"kana": "さむい"}],
        ["暖かい", "atatakai", "warm", "חמים", {"kana": "あたたかい"}],
        ["涼しい", "suzushii", "cool (pleasantly)", "קריר", {"kana": "すずしい"}],
        ["雨が降っています。", "ame ga futte imasu.", "It's raining.", "יורד גשם.", {"kana": "あめがふっています", "parts": ["雨", "が", "降って", "います"]}],
        ["今日はいい天気ですね。", "kyō wa ii tenki desu ne.", "Nice weather today, isn't it?", "מזג אוויר יפה היום, נכון?", {"kana": "きょうはいいてんきですね", "parts": ["今日", "は", "いい", "天気", "です", "ね"]}]
      ]
    }
  ]
});
