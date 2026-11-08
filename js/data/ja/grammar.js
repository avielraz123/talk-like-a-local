// Grammar: particles, です, the -masu form, negative, past, adjectives, requests, counters.
TLAP_ADD("ja", {
  "group": {"id": "g-grammar", "level": "intermediate", "icon": "📚", "title": {"en": "Grammar", "he": "דקדוק"}},
  "lessons": [
    {
      "id": "particles_wa_ga", "kind": "grammar", "icon": "🏷️",
      "title": {"en": "Particles は and が", "he": "המיליות は ו-が"},
      "intro": {
        "en": "Japanese uses small words called particles after a word to show its role in the sentence. は marks the topic, like \"as for...\": it's written with the kana は (ha) but read wa. が marks who does something or what exists, often new information or the answer to \"who?\" or \"what?\". It goes with 好き (like), with いる/ある (there is) and with question words like だれ (who). A sentence can have both: 象は鼻が長い = \"As for elephants, the nose is long\".",
        "he": "ביפנית יש מילים קטנות שנקראות מיליות, שבאות אחרי מילה ומראות מה התפקיד שלה במשפט. は מסמנת את מה שמדברים עליו, כמו \"לגבי...\": כותבים אותה בתו は (ha) אבל קוראים wa. が מסמנת את מי שעושה משהו או את מה שקיים, לרוב מידע חדש או תשובה לשאלה \"מי?\" או \"מה?\". היא באה עם 好き (אוהב), עם いる/ある (יש) ועם מילות שאלה כמו だれ (מי). משפט יכול לכלול את שתיהן: 象は鼻が長い = \"לגבי פילים, האף ארוך\"."
      },
      "level": "beginner",
      "items": [
        ["私は学生です。", "watashi wa gakusei desu.", "I'm a student.", "אני סטודנט.", {"kana": "わたしはがくせいです", "parts": ["私", "は", "学生", "です"]}],
        ["これは本です。", "kore wa hon desu.", "This is a book.", "זה ספר.", {"kana": "これはほんです", "parts": ["これ", "は", "本", "です"]}],
        ["今日は暑いです。", "kyō wa atsui desu.", "It's hot today.", "היום חם.", {"kana": "きょうはあついです", "parts": ["今日", "は", "暑い", "です"]}],
        ["銀行はどこですか？", "ginkō wa doko desu ka?", "Where is the bank?", "איפה הבנק?", {"kana": "ぎんこうはどこですか", "parts": ["銀行", "は", "どこ", "です", "か"]}],
        ["私は日本語が好きです。", "watashi wa nihongo ga suki desu.", "I like Japanese.", "אני אוהב יפנית.", {"kana": "わたしはにほんごがすきです", "parts": ["私", "は", "日本語", "が", "好き", "です"]}],
        ["日本語がわかります。", "nihongo ga wakarimasu.", "I understand Japanese.", "אני מבין יפנית.", {"kana": "にほんごがわかります", "parts": ["日本語", "が", "わかります"]}],
        ["誰が来ましたか？", "dare ga kimashita ka?", "Who came?", "מי בא?", {"kana": "だれがきましたか", "parts": ["誰", "が", "来ました", "か"]}],
        ["弟がいます。", "otōto ga imasu.", "I have a younger brother.", "יש לי אח קטן.", {"kana": "おとうとがいます", "parts": ["弟", "が", "います"]}],
        ["象は鼻が長いです。", "zō wa hana ga nagai desu.", "Elephants have long trunks.", "לפילים יש חדק ארוך.", {"kana": "ぞうははながながいです", "parts": ["象", "は", "鼻", "が", "長い", "です"], "lit": ["As for elephants, the nose is long.", "לגבי פילים, האף ארוך."]}]
      ]
    },
    {
      "id": "particles_o_ni_de", "kind": "grammar", "icon": "🎯",
      "title": {"en": "Particles を, に, で", "he": "המיליות を, に, で"},
      "intro": {
        "en": "を (written wo, read o) marks the object, the thing the action is done to: 水を飲みます = \"water-を drink\". に points to a destination (学校に行きます), a time (七時に) or the place where someone or something is (部屋に猫がいます). で marks the place where an action happens (図書館で勉強します) or the tool or means (電車で, お箸で). The verb always comes last.",
        "he": "を (נכתבת wo ונקראת o) מסמנת את המושא, הדבר שעליו עושים את הפעולה: 水を飲みます = \"מים-を שותה\". に מצביעה על יעד (学校に行きます), על זמן (七時に) או על המקום שבו מישהו או משהו נמצא (部屋に猫がいます). で מסמנת את המקום שבו הפעולה קורית (図書館で勉強します) או את הכלי והאמצעי (電車で, お箸で). הפועל תמיד בא בסוף."
      },
      "items": [
        ["水を飲みます。", "mizu o nomimasu.", "I drink water.", "אני שותה מים.", {"kana": "みずをのみます", "parts": ["水", "を", "飲みます"]}],
        ["日本語で話します。", "nihongo de hanashimasu.", "I speak in Japanese.", "אני מדבר ביפנית.", {"kana": "にほんごではなします", "parts": ["日本語", "で", "話します"]}],
        ["学校に行きます。", "gakkō ni ikimasu.", "I go to school.", "אני הולך לבית הספר.", {"kana": "がっこうにいきます", "parts": ["学校", "に", "行きます"]}],
        ["七時に起きます。", "shichiji ni okimasu.", "I get up at seven.", "אני קם בשבע.", {"kana": "しちじにおきます", "parts": ["七時", "に", "起きます"]}],
        ["部屋に猫がいます。", "heya ni neko ga imasu.", "There's a cat in the room.", "יש חתול בחדר.", {"kana": "へやにねこがいます", "parts": ["部屋", "に", "猫", "が", "います"]}],
        ["友達に電話します。", "tomodachi ni denwa shimasu.", "I'll call a friend.", "אני אתקשר לחבר.", {"kana": "ともだちにでんわします", "parts": ["友達", "に", "電話", "します"]}],
        ["家で晩ご飯を食べます。", "ie de bangohan o tabemasu.", "I eat dinner at home.", "אני אוכל ארוחת ערב בבית.", {"kana": "いえでばんごはんをたべます", "parts": ["家", "で", "晩ご飯", "を", "食べます"]}],
        ["図書館で勉強します。", "toshokan de benkyō shimasu.", "I study at the library.", "אני לומד בספרייה.", {"kana": "としょかんでべんきょうします", "parts": ["図書館", "で", "勉強", "します"]}],
        ["電車で行きます。", "densha de ikimasu.", "I go by train.", "אני נוסע ברכבת.", {"kana": "でんしゃでいきます", "parts": ["電車", "で", "行きます"]}],
        ["お箸で食べます。", "ohashi de tabemasu.", "I eat with chopsticks.", "אני אוכל עם מקלות אכילה.", {"kana": "おはしでたべます", "parts": ["お箸", "で", "食べます"]}]
      ]
    },
    {
      "id": "desu", "kind": "grammar", "icon": "🙋",
      "title": {"en": "です and じゃないです", "he": "です ו-じゃないです"},
      "intro": {
        "en": "です works like \"am / is / are\" after a noun, and it's polite. It's the same for I, you, he and they, and \"I\" is usually left out: 学生です = \"(I'm) a student\". The negative is じゃないです (ja nai desu); in formal speech and writing you'll hear ではありません (de wa arimasen). To ask a question, just add か (ka) at the end.",
        "he": "です באה אחרי שם עצם ומשמשת כמו \"הוא/היא\" במשפט \"דני הוא מורה\", והיא מנומסת. היא זהה לכל הגופים, ובדרך כלל משמיטים את ה\"אני\": 学生です = \"(אני) סטודנט\". השלילה היא じゃないです (ja nai desu), ובדיבור ובכתיבה רשמיים שומעים ではありません (de wa arimasen). כדי לשאול שאלה, פשוט מוסיפים か (ka) בסוף."
      },
      "level": "beginner",
      "items": [
        ["イスラエル人です。", "isuraerujin desu.", "I'm Israeli.", "אני ישראלי.", {"kana": "イスラエルじんです"}],
        ["学生じゃないです。", "gakusei ja nai desu.", "I'm not a student.", "אני לא סטודנט.", {"kana": "がくせいじゃないです", "parts": ["学生", "じゃ", "ない", "です"]}],
        ["先生ですか？", "sensei desu ka?", "Are you a teacher?", "אתה מורה?", {"kana": "せんせいですか", "parts": ["先生", "です", "か"]}],
        ["はい、学生です。", "hai, gakusei desu.", "Yes, I'm a student.", "כן, אני סטודנט.", {"kana": "はいがくせいです", "parts": ["はい", "学生", "です"]}],
        ["いいえ、先生じゃないです。", "iie, sensei ja nai desu.", "No, I'm not a teacher.", "לא, אני לא מורה.", {"kana": "いいえせんせいじゃないです", "parts": ["いいえ", "先生", "じゃ", "ない", "です"]}],
        ["それは何ですか？", "sore wa nan desu ka?", "What is that?", "מה זה?", {"kana": "それはなんですか", "parts": ["それ", "は", "何", "です", "か"]}],
        ["今日は日曜日です。", "kyō wa nichiyōbi desu.", "Today is Sunday.", "היום יום ראשון.", {"kana": "きょうはにちようびです", "parts": ["今日", "は", "日曜日", "です"]}],
        ["明日は休みじゃないです。", "ashita wa yasumi ja nai desu.", "Tomorrow isn't a day off.", "מחר זה לא יום חופש.", {"kana": "あしたはやすみじゃないです", "parts": ["明日", "は", "休み", "じゃ", "ない", "です"]}],
        ["日本人ではありません。", "nihonjin de wa arimasen.", "I'm not Japanese (formal).", "אני לא יפני (רשמי).", {"kana": "にほんじんではありません", "parts": ["日本人", "で", "は", "ありません"]}]
      ]
    },
    {
      "id": "masu", "kind": "grammar", "icon": "🏃",
      "title": {"en": "Verbs: the -masu form", "he": "פעלים: צורת ます"},
      "intro": {
        "en": "Polite verbs end in -ます (-masu), and the same form means both present and future: 行きます = \"I go\" or \"I'll go\". To build it: ru-verbs drop る and add ます (食べる → 食べます); u-verbs change the last -u sound to -i and add ます (飲む → 飲みます, 書く → 書きます); and there are two irregulars: する → します, 来る → 来ます (kimasu). The verb comes at the end of the sentence.",
        "he": "פעלים מנומסים מסתיימים ב-ます (masu), ואותה צורה משמשת גם להווה וגם לעתיד: 行きます = \"אני הולך\" או \"אני אלך\". איך בונים אותה: בפעלי る מורידים את る ומוסיפים ます (食べる ← 食べます); בפעלי う הופכים את צליל ה-u האחרון ל-i ומוסיפים ます (飲む ← 飲みます, 書く ← 書きます); ויש שני פעלים חריגים: する ← します, 来る ← 来ます (kimasu). הפועל בא בסוף המשפט."
      },
      "items": [
        ["食べます", "tabemasu", "I eat", "אני אוכל", {"kana": "たべます"}],
        ["飲みます", "nomimasu", "I drink", "אני שותה", {"kana": "のみます"}],
        ["行きます", "ikimasu", "I go", "אני הולך", {"kana": "いきます"}],
        ["書きます", "kakimasu", "I write", "אני כותב", {"kana": "かきます"}],
        ["話します", "hanashimasu", "I speak", "אני מדבר", {"kana": "はなします"}],
        ["します", "shimasu", "I do", "אני עושה"],
        ["来ます", "kimasu", "I come", "אני בא", {"kana": "きます"}],
        ["明日、東京に行きます。", "ashita, tōkyō ni ikimasu.", "I'll go to Tokyo tomorrow.", "מחר אני נוסע לטוקיו.", {"kana": "あしたとうきょうにいきます", "parts": ["明日", "東京", "に", "行きます"]}],
        ["毎日コーヒーを飲みます。", "mainichi kōhī o nomimasu.", "I drink coffee every day.", "אני שותה קפה כל יום.", {"kana": "まいにちコーヒーをのみます", "parts": ["毎日", "コーヒー", "を", "飲みます"]}],
        ["何時に寝ますか？", "nanji ni nemasu ka?", "What time do you go to bed?", "באיזו שעה אתה הולך לישון?", {"kana": "なんじにねますか", "parts": ["何時", "に", "寝ます", "か"]}]
      ]
    },
    {
      "id": "negative", "kind": "grammar", "icon": "🚫",
      "title": {"en": "Negative: -masen", "he": "שלילה: ません"},
      "intro": {
        "en": "To say \"don't\" or \"won't\", change -ます to -ません: 食べます → 食べません. Japanese often leaves out \"I\" and \"it\", so わかりません on its own means \"I don't understand\". Tip: a negative question with か becomes a friendly invitation: 一緒に行きませんか？ = \"Won't you come along?\"",
        "he": "כדי לומר \"לא\", מחליפים את ます ב-ません: 食べます ← 食べません. ביפנית משמיטים לעתים קרובות את \"אני\" ואת \"זה\", ולכן わかりません לבד פירושו \"אני לא מבין\". טיפ: שאלה בשלילה עם か בסוף הופכת להזמנה ידידותית: 一緒に行きませんか？ = \"רוצה לבוא איתי?\""
      },
      "items": [
        ["漢字がわかりません。", "kanji ga wakarimasen.", "I don't understand kanji.", "אני לא מבין קאנג'י.", {"kana": "かんじがわかりません", "parts": ["漢字", "が", "わかりません"]}],
        ["車を運転しません。", "kuruma o unten shimasen.", "I don't drive.", "אני לא נוהג.", {"kana": "くるまをうんてんしません", "parts": ["車", "を", "運転", "しません"]}],
        ["肉を食べません。", "niku o tabemasen.", "I don't eat meat.", "אני לא אוכל בשר.", {"kana": "にくをたべません", "parts": ["肉", "を", "食べません"]}],
        ["お酒を飲みません。", "osake o nomimasen.", "I don't drink alcohol.", "אני לא שותה אלכוהול.", {"kana": "おさけをのみません", "parts": ["お酒", "を", "飲みません"]}],
        ["たばこを吸いません。", "tabako o suimasen.", "I don't smoke.", "אני לא מעשן.", {"kana": "たばこをすいません", "parts": ["たばこ", "を", "吸いません"]}],
        ["テレビを見ません。", "terebi o mimasen.", "I don't watch TV.", "אני לא רואה טלוויזיה.", {"kana": "テレビをみません", "parts": ["テレビ", "を", "見ません"]}],
        ["今日は学校に行きません。", "kyō wa gakkō ni ikimasen.", "I'm not going to school today.", "היום אני לא הולך לבית הספר.", {"kana": "きょうはがっこうにいきません", "parts": ["今日", "は", "学校", "に", "行きません"]}],
        ["お金がありません。", "okane ga arimasen.", "I don't have money.", "אין לי כסף.", {"kana": "おかねがありません", "parts": ["お金", "が", "ありません"]}],
        ["一緒に行きませんか？", "issho ni ikimasen ka?", "Would you like to come along?", "רוצה לבוא איתי?", {"kana": "いっしょにいきませんか", "parts": ["一緒", "に", "行きません", "か"], "lit": ["Won't you go together?", "לא תלך ביחד?"]}]
      ]
    },
    {
      "id": "past", "kind": "grammar", "icon": "⏪",
      "title": {"en": "Past: -mashita", "he": "עבר: ました"},
      "intro": {
        "en": "For the past, change -ます to -ました: 食べます → 食べました (I ate). The negative past is -ませんでした: 食べませんでした (I didn't eat). After a noun, です becomes でした. Some past forms describe how you are now: 疲れました (\"I got tired\") is how you say \"I'm tired\", and わかりました means \"Got it!\"",
        "he": "בעבר מחליפים את ます ב-ました: 食べます ← 食べました (אכלתי). עבר בשלילה הוא ませんでした: 食べませんでした (לא אכלתי). אחרי שם עצם, です הופכת ל-でした. יש צורות עבר שמתארות מצב של עכשיו: 疲れました (\"התעייפתי\") זו הדרך לומר \"אני עייף\", ו-わかりました פירושו \"הבנתי!\""
      },
      "items": [
        ["食べました", "tabemashita", "I ate", "אכלתי", {"kana": "たべました"}],
        ["買いました", "kaimashita", "I bought", "קניתי", {"kana": "かいました"}],
        ["財布をなくしました。", "saifu o nakushimashita.", "I lost my wallet.", "איבדתי את הארנק.", {"kana": "さいふをなくしました", "parts": ["財布", "を", "なくしました"]}],
        ["疲れました。", "tsukaremashita.", "I'm tired.", "אני עייף.", {"kana": "つかれました", "lit": ["I got tired.", "התעייפתי."]}],
        ["昨日、映画を見ました。", "kinō, eiga o mimashita.", "I saw a movie yesterday.", "אתמול ראיתי סרט.", {"kana": "きのうえいがをみました", "parts": ["昨日", "映画", "を", "見ました"]}],
        ["京都に行きました。", "kyōto ni ikimashita.", "I went to Kyoto.", "נסעתי לקיוטו.", {"kana": "きょうとにいきました", "parts": ["京都", "に", "行きました"]}],
        ["日本語を勉強しました。", "nihongo o benkyō shimashita.", "I studied Japanese.", "למדתי יפנית.", {"kana": "にほんごをべんきょうしました", "parts": ["日本語", "を", "勉強", "しました"]}],
        ["朝ご飯を食べませんでした。", "asagohan o tabemasen deshita.", "I didn't eat breakfast.", "לא אכלתי ארוחת בוקר.", {"kana": "あさごはんをたべませんでした", "parts": ["朝ご飯", "を", "食べません", "でした"]}],
        ["昨日は雨でした。", "kinō wa ame deshita.", "It rained yesterday.", "אתמול ירד גשם.", {"kana": "きのうはあめでした", "parts": ["昨日", "は", "雨", "でした"], "lit": ["Yesterday was rain.", "אתמול היה גשם."]}]
      ]
    },
    {
      "id": "adjectives_i_na", "kind": "grammar", "icon": "🎨",
      "title": {"en": "い- and な-adjectives", "he": "שמות תואר מסוג い ו-な"},
      "intro": {
        "en": "い-adjectives end in い (高い, おいしい). For the negative, drop the い and add くない: 高い → 高くないです. Watch out: いい (good) becomes よくないです. な-adjectives (静か, 有名, きれい) take な before a noun: 静かな町, and their negative is じゃないです, just like nouns. Careful: きれい ends in い, but it's a な-adjective!",
        "he": "שמות תואר מסוג い מסתיימים ב-い (高い, おいしい). בשלילה מורידים את ה-い ומוסיפים くない: 高い ← 高くないです. שים לב: いい (טוב) הופך ל-よくないです. שמות תואר מסוג な (静か, 有名, きれい) מקבלים な לפני שם עצם: 静かな町, והשלילה שלהם היא じゃないです, בדיוק כמו בשמות עצם. זהירות: きれい מסתיים ב-い, אבל הוא שם תואר מסוג な!"
      },
      "items": [
        ["高いです。", "takai desu.", "It's expensive.", "זה יקר.", {"kana": "たかいです"}],
        ["高くないです。", "takakunai desu.", "It's not expensive.", "זה לא יקר.", {"kana": "たかくないです"}],
        ["おいしいです。", "oishii desu.", "It's delicious.", "זה טעים."],
        ["今日は寒くないです。", "kyō wa samukunai desu.", "It's not cold today.", "היום לא קר.", {"kana": "きょうはさむくないです", "parts": ["今日", "は", "寒くない", "です"]}],
        ["この映画は面白いです。", "kono eiga wa omoshiroi desu.", "This movie is interesting.", "הסרט הזה מעניין.", {"kana": "このえいがはおもしろいです", "parts": ["この", "映画", "は", "面白い", "です"]}],
        ["よくないです。", "yokunai desu.", "It's not good.", "זה לא טוב."],
        ["大きい犬", "ōkii inu", "a big dog", "כלב גדול", {"kana": "おおきいいぬ"}],
        ["静かな町", "shizuka na machi", "a quiet town", "עיר שקטה", {"kana": "しずかなまち", "parts": ["静か", "な", "町"]}],
        ["有名なレストラン", "yūmei na resutoran", "a famous restaurant", "מסעדה מפורסמת", {"kana": "ゆうめいなレストラン", "parts": ["有名", "な", "レストラン"]}],
        ["部屋はきれいじゃないです。", "heya wa kirei ja nai desu.", "The room isn't clean.", "החדר לא נקי.", {"kana": "へやはきれいじゃないです", "parts": ["部屋", "は", "きれい", "じゃ", "ない", "です"]}]
      ]
    },
    {
      "id": "te_form", "kind": "grammar", "icon": "🙏",
      "title": {"en": "Requests: 〜てください", "he": "בקשות: 〜てください"},
      "intro": {
        "en": "To ask someone to do something, use the て-form + ください. ru-verbs: 見る → 見て. For u-verbs it depends on the last sound: う/つ/る → って (待つ → 待って), む/ぶ/ぬ → んで (読む → 読んで), く → いて (書く → 書いて), す → して (話す → 話して). 行く is the exception: 行って. And する → して, 来る → 来て. Start with ちょっと or すみません to sound even softer.",
        "he": "כדי לבקש ממישהו לעשות משהו, משתמשים בצורת て + ください. פעלי る: 見る ← 見て. בפעלי う זה תלוי בצליל האחרון: う/つ/る ← って (待つ ← 待って), む/ぶ/ぬ ← んで (読む ← 読んで), く ← いて (書く ← 書いて), す ← して (話す ← 話して). 行く הוא היוצא מן הכלל: 行って. וגם する ← して, 来る ← 来て. כדי להישמע רך עוד יותר, פותחים ב-ちょっと או ב-すみません."
      },
      "level": "advanced",
      "items": [
        ["ちょっと待ってください。", "chotto matte kudasai.", "Please wait a moment.", "תחכה רגע, בבקשה.", {"kana": "ちょっとまってください", "parts": ["ちょっと", "待って", "ください"]}],
        ["見てください。", "mite kudasai.", "Please look.", "תסתכל, בבקשה.", {"kana": "みてください"}],
        ["もう一度言ってください。", "mō ichido itte kudasai.", "Please say that again.", "תגיד את זה שוב, בבקשה.", {"kana": "もういちどいってください", "parts": ["もう", "一度", "言って", "ください"]}],
        ["ゆっくり話してください。", "yukkuri hanashite kudasai.", "Please speak slowly.", "תדבר לאט, בבקשה.", {"kana": "ゆっくりはなしてください", "parts": ["ゆっくり", "話して", "ください"]}],
        ["名前を書いてください。", "namae o kaite kudasai.", "Please write your name.", "תכתוב את השם שלך, בבקשה.", {"kana": "なまえをかいてください", "parts": ["名前", "を", "書いて", "ください"]}],
        ["読んでください。", "yonde kudasai.", "Please read it.", "תקרא את זה, בבקשה.", {"kana": "よんでください"}],
        ["座ってください。", "suwatte kudasai.", "Please have a seat.", "שב, בבקשה.", {"kana": "すわってください"}],
        ["入ってください。", "haitte kudasai.", "Please come in.", "תיכנס, בבקשה.", {"kana": "はいってください"}],
        ["手伝ってください。", "tetsudatte kudasai.", "Please help me.", "תעזור לי, בבקשה.", {"kana": "てつだってください"}],
        ["駅まで行ってください。", "eki made itte kudasai.", "To the station, please.", "לתחנה, בבקשה.", {"kana": "えきまでいってください", "parts": ["駅", "まで", "行って", "ください"], "lit": ["Please go as far as the station.", "סע עד התחנה, בבקשה."]}],
        ["写真を撮ってください。", "shashin o totte kudasai.", "Please take a photo (of us).", "תצלם אותנו, בבקשה.", {"kana": "しゃしんをとってください", "parts": ["写真", "を", "撮って", "ください"]}]
      ]
    },
    {
      "id": "counters", "kind": "grammar", "icon": "🔢",
      "title": {"en": "Counting things: つ, 人, 本, 枚", "he": "ספירת דברים: つ, 人, 本, 枚"},
      "intro": {
        "en": "Japanese counts things with a counter added to the number, and the counter depends on the shape or kind of thing. For general objects, use the native words: ひとつ, ふたつ, みっつ (1, 2, 3 things). For people: ひとり, ふたり (irregular), then さんにん. 本 (hon) is for long, thin things like bottles, pens and umbrellas, and its sound changes: いっぽん, にほん, さんぼん. 枚 (mai) is for flat things like tickets, paper and shirts: いちまい, にまい. The number usually comes right before the verb: りんごを二つください.",
        "he": "ביפנית סופרים דברים בעזרת \"מסווג\" שמצטרף למספר, והוא תלוי בצורה או בסוג של הדבר. לחפצים כלליים משתמשים במילים היפניות המקוריות: ひとつ, ふたつ, みっつ (חפץ אחד, שניים, שלושה). לאנשים: ひとり, ふたり (חריגים), ואחר כך さんにん. 本 (hon) משמש לדברים ארוכים ודקים כמו בקבוקים, עטים ומטריות, והצליל שלו משתנה: いっぽん, にほん, さんぼん. 枚 (mai) משמש לדברים שטוחים כמו כרטיסים, דפים וחולצות: いちまい, にまい. המספר בא בדרך כלל ממש לפני הפועל: りんごを二つください."
      },
      "level": "advanced",
      "items": [
        ["一つ", "hitotsu", "one (thing)", "אחד (חפץ)", {"kana": "ひとつ"}],
        ["三つ", "mittsu", "three (things)", "שלושה (חפצים)", {"kana": "みっつ"}],
        ["一人", "hitori", "one person", "אדם אחד", {"kana": "ひとり"}],
        ["二人", "futari", "two people", "שני אנשים", {"kana": "ふたり"}],
        ["三人", "sannin", "three people", "שלושה אנשים", {"kana": "さんにん"}],
        ["一本", "ippon", "one (bottle, pen...)", "אחד (בקבוק, עט...)", {"kana": "いっぽん"}],
        ["三本", "sanbon", "three (bottles, pens...)", "שלושה (בקבוקים, עטים...)", {"kana": "さんぼん"}],
        ["一枚", "ichimai", "one (ticket, sheet...)", "אחד (כרטיס, דף...)", {"kana": "いちまい"}],
        ["りんごを二つください。", "ringo o futatsu kudasai.", "Two apples, please.", "שני תפוחים, בבקשה.", {"kana": "りんごをふたつください", "parts": ["りんご", "を", "二つ", "ください"]}],
        ["ビールを二本ください。", "bīru o nihon kudasai.", "Two bottles of beer, please.", "שני בקבוקי בירה, בבקשה.", {"kana": "ビールをにほんください", "parts": ["ビール", "を", "二本", "ください"]}],
        ["切符を一枚ください。", "kippu o ichimai kudasai.", "One ticket, please.", "כרטיס אחד, בבקשה.", {"kana": "きっぷをいちまいください", "parts": ["切符", "を", "一枚", "ください"]}],
        ["二人です。", "futari desu.", "There are two of us.", "אנחנו שניים.", {"kana": "ふたりです"}]
      ]
    }
  ]
});
