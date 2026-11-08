// City & travel: places, transport, directions, hotel & airport, getting around, conversation.
TLAP_ADD("ja", {
  "group": {"id": "g-city", "level": "intermediate", "icon": "🏙️", "title": {"en": "City & travel", "he": "עיר וטיולים"}},
  "lessons": [
    {
      "id": "places", "kind": "vocab", "icon": "🏛️",
      "title": {"en": "Places in the city", "he": "מקומות בעיר"},
      "intro": {
        "en": "Most Japanese streets have no names: addresses go by area, block and building number. So people give directions by landmarks, like a station, a convenience store or a traffic light. If you're lost, look for a 交番 (kōban), a small neighborhood police box: the officers there help with directions all day.",
        "he": "לרוב הרחובות ביפן אין שמות: כתובות נקבעות לפי אזור, גוש ומספר בניין. לכן מכווינים לפי ציוני דרך, כמו תחנה, מכולת 24 שעות או רמזור. אם הלכת לאיבוד, חפש 交番 (kōban), עמדת משטרה שכונתית קטנה: השוטרים שם עוזרים בהכוונה כל היום."
      },
      "items": [
        ["銀行", "ginkō", "bank", "בנק", {"kana": "ぎんこう"}],
        ["郵便局", "yūbinkyoku", "post office", "סניף דואר", {"kana": "ゆうびんきょく"}],
        ["公園", "kōen", "park", "פארק", {"kana": "こうえん"}],
        ["博物館", "hakubutsukan", "museum", "מוזיאון", {"kana": "はくぶつかん"}],
        ["美術館", "bijutsukan", "art museum", "מוזיאון לאמנות", {"kana": "びじゅつかん"}],
        ["映画館", "eigakan", "cinema", "קולנוע", {"kana": "えいがかん"}],
        ["図書館", "toshokan", "library", "ספרייה", {"kana": "としょかん"}],
        ["交番", "kōban", "police box", "עמדת משטרה", {"kana": "こうばん"}],
        ["スーパー", "sūpā", "supermarket", "סופרמרקט"],
        ["神社", "jinja", "Shinto shrine", "מקדש שינטו", {"kana": "じんじゃ"}],
        ["お寺", "otera", "Buddhist temple", "מקדש בודהיסטי", {"kana": "おてら"}],
        ["コンビニ", "konbini", "convenience store", "מכולת 24 שעות"],
        ["レストラン", "resutoran", "restaurant", "מסעדה"],
        ["カフェ", "kafe", "café", "בית קפה"],
        ["橋", "hashi", "bridge", "גשר", {"kana": "はし"}],
        ["町", "machi", "town / neighborhood", "עיירה / שכונה", {"kana": "まち"}]
      ]
    },
    {
      "id": "transport", "kind": "vocab", "icon": "🚆",
      "title": {"en": "Transport", "he": "תחבורה"},
      "intro": {
        "en": "You ride a vehicle with に: 電車に乗ります (densha ni norimasu) = I take the train. To get off, use を: 電車を降ります (densha o orimasu). Changing trains is 乗り換え (norikae), a word you'll hear in every big station.",
        "he": "עולים על כלי רכב עם に: 電車に乗ります (densha ni norimasu) = אני נוסע ברכבת. כדי לרדת משתמשים ב-を: 電車を降ります (densha o orimasu). החלפת רכבת היא 乗り換え (norikae), מילה שתשמע בכל תחנה גדולה."
      },
      "items": [
        ["電車", "densha", "train", "רכבת", {"kana": "でんしゃ"}],
        ["新幹線", "shinkansen", "bullet train", "רכבת קליע (שינקנסן)", {"kana": "しんかんせん"}],
        ["地下鉄", "chikatetsu", "subway", "רכבת תחתית", {"kana": "ちかてつ"}],
        ["バス", "basu", "bus", "אוטובוס"],
        ["タクシー", "takushī", "taxi", "מונית"],
        ["車", "kuruma", "car", "מכונית", {"kana": "くるま"}],
        ["自転車", "jitensha", "bicycle", "אופניים", {"kana": "じてんしゃ"}],
        ["バイク", "baiku", "motorcycle", "אופנוע"],
        ["飛行機", "hikōki", "airplane", "מטוס", {"kana": "ひこうき"}],
        ["船", "fune", "ship / boat", "ספינה / סירה", {"kana": "ふね"}],
        ["運転手", "untenshu", "driver", "נהג", {"kana": "うんてんしゅ"}],
        ["歩いて", "aruite", "on foot", "ברגל", {"kana": "あるいて"}],
        ["乗る", "noru", "to get on / to ride", "לעלות (על כלי רכב)", {"kana": "のる", "form": ["乗ります", "norimasu"]}],
        ["降りる", "oriru", "to get off", "לרדת (מכלי רכב)", {"kana": "おりる", "form": ["降ります", "orimasu"]}],
        ["乗り換える", "norikaeru", "to change (trains)", "להחליף (רכבת או קו)", {"kana": "のりかえる", "form": ["乗り換えます", "norikaemasu"]}],
        ["運転する", "unten suru", "to drive", "לנהוג", {"kana": "うんてんする", "form": ["運転します", "unten shimasu"]}]
      ]
    },
    {
      "id": "directions", "kind": "vocab", "icon": "🧭",
      "title": {"en": "Directions", "he": "כיוונים"},
      "intro": {
        "en": "Japanese puts the landmark first, then の and the position word: 駅の前 (eki no mae) = in front of the station, 銀行の隣 (ginkō no tonari) = next to the bank. Add にあります (ni arimasu) for \"is located\". Directions often count traffic lights: 二つ目の信号 = the second light.",
        "he": "ביפנית שמים קודם את ציון הדרך, אחר כך の ואז את מילת המיקום: 駅の前 (eki no mae) = מול התחנה, 銀行の隣 (ginkō no tonari) = ליד הבנק. מוסיפים にあります (ni arimasu) כדי לומר \"נמצא\". בהכוונה סופרים הרבה רמזורים: 二つ目の信号 = הרמזור השני."
      },
      "items": [
        ["近く", "chikaku", "nearby", "בסביבה / בקרבת מקום", {"kana": "ちかく"}],
        ["突き当たり", "tsukiatari", "end of the street", "סוף הרחוב", {"kana": "つきあたり"}],
        ["隣", "tonari", "next to", "ליד", {"kana": "となり"}],
        ["前", "mae", "in front (of)", "מקדימה / מול", {"kana": "まえ"}],
        ["後ろ", "ushiro", "behind", "מאחורי", {"kana": "うしろ"}],
        ["上", "ue", "on top / above", "למעלה / על", {"kana": "うえ"}],
        ["下", "shita", "under / below", "מתחת / למטה", {"kana": "した"}],
        ["中", "naka", "inside", "בתוך", {"kana": "なか"}],
        ["外", "soto", "outside", "בחוץ", {"kana": "そと"}],
        ["角", "kado", "corner", "פינה", {"kana": "かど"}],
        ["向かい", "mukai", "across from / opposite", "ממול", {"kana": "むかい"}],
        ["間", "aida", "between", "בין", {"kana": "あいだ"}],
        ["交差点", "kōsaten", "intersection", "צומת", {"kana": "こうさてん"}],
        ["信号", "shingō", "traffic light", "רמזור", {"kana": "しんごう"}],
        ["銀行はホテルの隣にあります。", "ginkō wa hoteru no tonari ni arimasu.", "The bank is next to the hotel.", "הבנק נמצא ליד המלון.", {"kana": "ぎんこうはホテルのとなりにあります", "parts": ["銀行", "は", "ホテル", "の", "隣", "に", "あります"]}],
        ["二つ目の信号を右に曲がってください。", "futatsume no shingō o migi ni magatte kudasai.", "Turn right at the second traffic light.", "פנה ימינה ברמזור השני.", {"kana": "ふたつめのしんごうをみぎにまがってください", "parts": ["二つ目", "の", "信号", "を", "右", "に", "曲がって", "ください"]}]
      ]
    },
    {
      "id": "hotel_airport", "kind": "vocab", "icon": "🛄",
      "title": {"en": "Hotel & airport", "he": "מלון ושדה תעופה"},
      "intro": {
        "en": "Many travel words are borrowed from English and written in katakana: パスポート (pasupōto), チェックイン (chekkuin). For a traditional stay, try a 旅館 (ryokan): you sleep on a futon on tatami mats and take off your shoes at the entrance.",
        "he": "הרבה מילים של נסיעות שאולות מאנגלית ונכתבות בקטקנה: パスポート (pasupōto), チェックイン (chekkuin). לחוויה מסורתית, נסה 旅館 (ryokan): ישנים על פוטון על מחצלות טטאמי וחולצים נעליים בכניסה."
      },
      "items": [
        ["パスポート", "pasupōto", "passport", "דרכון"],
        ["スーツケース", "sūtsukēsu", "suitcase", "מזוודה"],
        ["荷物", "nimotsu", "luggage", "מטען / כבודה", {"kana": "にもつ"}],
        ["予約", "yoyaku", "reservation", "הזמנה (של מקום)", {"kana": "よやく"}],
        ["フロント", "furonto", "front desk", "קבלה (במלון)"],
        ["一泊", "ippaku", "one night (stay)", "לילה אחד (לינה)", {"kana": "いっぱく"}],
        ["鍵", "kagi", "key", "מפתח", {"kana": "かぎ"}],
        ["チェックイン", "chekkuin", "check-in", "צ'ק-אין"],
        ["チェックアウト", "chekkuauto", "check-out", "צ'ק-אאוט"],
        ["旅館", "ryokan", "traditional Japanese inn", "פונדק יפני מסורתי", {"kana": "りょかん"}],
        ["空港", "kūkō", "airport", "שדה תעופה", {"kana": "くうこう"}],
        ["搭乗券", "tōjōken", "boarding pass", "כרטיס עלייה למטוס", {"kana": "とうじょうけん"}],
        ["出発", "shuppatsu", "departure", "המראה / יציאה לדרך", {"kana": "しゅっぱつ"}],
        ["到着", "tōchaku", "arrival", "הגעה / נחיתה", {"kana": "とうちゃく"}],
        ["予約しています。", "yoyaku shite imasu.", "I have a reservation.", "יש לי הזמנה.", {"kana": "よやくしています", "parts": ["予約", "して", "います"]}],
        ["チェックインをお願いします。", "chekkuin o onegaishimasu.", "I'd like to check in, please.", "אני רוצה לעשות צ'ק-אין, בבקשה.", {"kana": "チェックインをおねがいします", "parts": ["チェックイン", "を", "お願いします"]}]
      ]
    },
    {
      "id": "travel", "kind": "vocab", "icon": "✈️",
      "title": {"en": "Getting around", "he": "בדרכים"},
      "intro": {
        "en": "Big stations have many exits, each with a name like 東口 (higashiguchi, east exit) or 西口 (nishiguchi, west exit). When you meet someone at a station, always agree on the exit (出口, deguchi)!",
        "he": "לתחנות גדולות יש הרבה יציאות, ולכל אחת שם, כמו 東口 (higashiguchi, היציאה המזרחית) או 西口 (nishiguchi, היציאה המערבית). כשנפגשים עם מישהו בתחנה, תמיד קובעים באיזו יציאה (出口, deguchi)!"
      },
      "items": [
        ["道", "michi", "road / way", "דרך", {"kana": "みち"}],
        ["通り", "tōri", "street / avenue", "רחוב / שדרה", {"kana": "とおり"}],
        ["地図", "chizu", "map", "מפה", {"kana": "ちず"}],
        ["駅", "eki", "station", "תחנה (רכבת)", {"kana": "えき"}],
        ["切符", "kippu", "ticket", "כרטיס", {"kana": "きっぷ"}],
        ["改札", "kaisatsu", "ticket gate", "שער כרטיסים", {"kana": "かいさつ"}],
        ["ホーム", "hōmu", "platform", "רציף"],
        ["バス停", "basutei", "bus stop", "תחנת אוטובוס", {"kana": "バスてい"}],
        ["入口", "iriguchi", "entrance", "כניסה", {"kana": "いりぐち"}],
        ["出口", "deguchi", "exit", "יציאה", {"kana": "でぐち"}],
        ["右", "migi", "right", "ימין", {"kana": "みぎ"}],
        ["左", "hidari", "left", "שמאל", {"kana": "ひだり"}],
        ["まっすぐ", "massugu", "straight ahead", "ישר"],
        ["乗り場", "noriba", "boarding point (taxi, bus)", "עמדת עלייה (מוניות, אוטובוסים)", {"kana": "のりば"}],
        ["観光", "kankō", "sightseeing", "תיירות / סיורים", {"kana": "かんこう"}]
      ]
    },
    {
      "id": "conversation", "kind": "phrases", "icon": "🗣️",
      "title": {"en": "Everyday conversation", "he": "שיחה יומיומית"},
      "intro": {
        "en": "To turn a sentence into a question, just add か (ka) at the end: it works like a spoken question mark. Japanese people rarely say a direct \"no\": a hesitant ちょっと… (chotto, \"a little…\") that trails off usually means \"no, thanks\".",
        "he": "כדי להפוך משפט לשאלה, פשוט מוסיפים か (ka) בסוף: זה כמו סימן שאלה מדובר. יפנים כמעט לא אומרים \"לא\" ישיר: ちょっと… (chotto, \"קצת…\") מהוסס שנקטע באמצע פירושו בדרך כלל \"לא, תודה\"."
      },
      "items": [
        ["どこから来ましたか？", "doko kara kimashita ka?", "Where are you from?", "מאיפה אתה?", {"kana": "どこからきましたか", "parts": ["どこ", "から", "来ました", "か"]}],
        ["日本語が少し話せます。", "nihongo ga sukoshi hanasemasu.", "I can speak a little Japanese.", "אני יודע לדבר קצת יפנית.", {"kana": "にほんごがすこしはなせます", "parts": ["日本語", "が", "少し", "話せます"]}],
        ["日本は初めてです。", "nihon wa hajimete desu.", "It's my first time in Japan.", "זו הפעם הראשונה שלי ביפן.", {"kana": "にほんははじめてです", "parts": ["日本", "は", "初めて", "です"]}],
        ["もう少しゆっくり話してください。", "mō sukoshi yukkuri hanashite kudasai.", "Please speak a little more slowly.", "בבקשה דבר קצת יותר לאט.", {"kana": "もうすこしゆっくりはなしてください", "parts": ["もう", "少し", "ゆっくり", "話して", "ください"]}],
        ["駅はどこですか？", "eki wa doko desu ka?", "Where is the station?", "איפה התחנה?", {"kana": "えきはどこですか", "parts": ["駅", "は", "どこ", "です", "か"]}],
        ["近くにコンビニはありますか？", "chikaku ni konbini wa arimasu ka?", "Is there a convenience store nearby?", "יש מכולת בסביבה?", {"kana": "ちかくにコンビニはありますか", "parts": ["近く", "に", "コンビニ", "は", "あります", "か"]}],
        ["歩いて行けますか？", "aruite ikemasu ka?", "Can I walk there?", "אפשר ללכת לשם ברגל?", {"kana": "あるいていけますか", "parts": ["歩いて", "行けます", "か"]}],
        ["どのくらいかかりますか？", "dono kurai kakarimasu ka?", "How long does it take?", "כמה זמן זה לוקח?", {"parts": ["どの", "くらい", "かかります", "か"]}],
        ["道に迷いました。", "michi ni mayoimashita.", "I'm lost.", "הלכתי לאיבוד.", {"kana": "みちにまよいました", "parts": ["道", "に", "迷いました"]}],
        ["東京駅までお願いします。", "tōkyō eki made onegaishimasu.", "To Tokyo Station, please.", "לתחנת טוקיו, בבקשה.", {"kana": "とうきょうえきまでおねがいします", "parts": ["東京", "駅", "まで", "お願いします"]}],
        ["写真を撮ってもいいですか？", "shashin o totte mo ii desu ka?", "May I take a photo?", "מותר לצלם?", {"kana": "しゃしんをとってもいいですか", "parts": ["写真", "を", "撮って", "も", "いい", "です", "か"]}],
        ["ここに座ってもいいですか？", "koko ni suwatte mo ii desu ka?", "May I sit here?", "אפשר לשבת כאן?", {"kana": "ここにすわってもいいですか", "parts": ["ここ", "に", "座って", "も", "いい", "です", "か"]}],
        ["おすすめは何ですか？", "osusume wa nan desu ka?", "What do you recommend?", "מה אתה ממליץ?", {"kana": "おすすめはなんですか", "parts": ["おすすめ", "は", "何", "です", "か"]}],
        ["楽しかったです。", "tanoshikatta desu.", "I had a great time.", "היה כיף.", {"kana": "たのしかったです"}],
        ["よい旅を！", "yoi tabi o!", "Have a good trip!", "נסיעה טובה!", {"kana": "よいたびを", "parts": ["よい", "旅", "を"]}]
      ]
    }
  ]
});
