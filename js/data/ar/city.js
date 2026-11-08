// City & travel: places, transport, directions, hotel & airport, getting around, conversation (spoken Levantine Arabic).
TLAP_ADD("ar", {
  "group": {"id": "g-city", "level": "intermediate", "icon": "🏙️", "title": {"en": "City & travel", "he": "עיר וטיולים"}},
  "lessons": [
    {
      "id": "places", "kind": "vocab", "icon": "🏛️",
      "title": {"en": "Places in the city", "he": "מקומות בעיר"},
      "intro": {
        "en": "In the Levant people often give directions by landmarks rather than street names: \"next to the mosque\", \"after the bakery\", \"at the big roundabout\". Learn the places and you can find almost anything.",
        "he": "בלבנט אנשים נותנים הוראות דרך לפי ציוני דרך יותר מאשר לפי שמות רחובות: \"ליד המסגד\", \"אחרי המאפייה\", \"בכיכר הגדולה\". מי שמכיר את המקומות ימצא כמעט הכול."
      },
      "items": [
        ["بنك", "bank", "bank", "בנק"],
        ["البريد", "il-barīd", "post office", "סניף דואר"],
        ["جامع", "jāmi3", "mosque", "מסגד"],
        ["كنيسة", "knīse", "church", "כנסייה"],
        ["حديقة", "ḥadī'a", "park / garden", "פארק / גינה"],
        ["متحف", "matḥaf", "museum", "מוזיאון"],
        ["مول", "mōl", "mall", "קניון"],
        ["فرن", "furn", "bakery", "מאפייה"],
        ["دكانة", "dikkāne", "small grocery / corner shop", "מכולת"],
        ["جسر", "jisr", "bridge", "גשר"],
        ["مركز الشرطة", "markaz ish-shurta", "police station", "תחנת משטרה"],
        ["مكتبة", "maktabe", "library / bookshop", "ספרייה / חנות ספרים"],
        ["ساحة", "sāḥa", "square (in a city)", "כיכר"],
        ["كافيه", "kāfē", "café", "בית קפה"],
        ["محطة بنزين", "maḥattit banzīn", "gas station", "תחנת דלק"],
        ["مدينة", "madīne", "city", "עיר"]
      ]
    },
    {
      "id": "transport", "kind": "vocab", "icon": "🚆",
      "title": {"en": "Transport", "he": "תחבורה"},
      "intro": {
        "en": "The servīs is a shared taxi or minibus on a fixed route with a fixed fare, very common across the Levant. When you want to get out, just say hōn law samaḥt (\"here, please\"). Verbs are listed in the \"he\" past form (rikib = he got on), the usual dictionary form in Arabic.",
        "he": "ה-servīs היא מונית שירות או מיניבוס בקו קבוע ובמחיר קבוע, נפוץ מאוד בכל הלבנט. כשרוצים לרדת, פשוט אומרים hōn law samaḥt (\"כאן, בבקשה\"). הפעלים מופיעים בצורת העבר של \"הוא\" (rikib = הוא עלה), שהיא צורת המילון הרגילה בערבית."
      },
      "items": [
        ["سيارة", "sayyāra", "car", "מכונית"],
        ["باص", "bās", "bus", "אוטובוס"],
        ["تكسي", "taksi", "taxi", "מונית"],
        ["سرفيس", "servīs", "shared taxi", "מונית שירות"],
        ["قطار", "'atār", "train", "רכבת"],
        ["طيارة", "tayyāra", "airplane", "מטוס"],
        ["كميون", "kamyōn", "truck", "משאית"],
        ["موتور", "motōr", "motorcycle", "אופנוע"],
        ["باخرة", "bākhra", "ship", "ספינה"],
        ["موقف باص", "maw'af bās", "bus stop", "תחנת אוטובוס"],
        ["راكب", "rākib", "passenger", "נוסע"],
        ["زحمة", "zaḥme", "traffic / crowd", "פקק / עומס"],
        ["رصيف", "rasīf", "sidewalk / platform", "מדרכה / רציף"],
        ["ركب", "rikib", "to get on / to ride", "לעלות (על כלי רכב)", {"form": ["بركب", "barkab"]}],
        ["وصل", "wisil", "to arrive", "להגיע", {"form": ["بوصل", "bawsal"]}],
        ["ساق", "sā'", "to drive", "לנהוג", {"form": ["بسوق", "basū'"]}]
      ]
    },
    {
      "id": "directions", "kind": "vocab", "icon": "🧭",
      "title": {"en": "Directions", "he": "כיוונים"},
      "intro": {
        "en": "dughri (straight ahead) is a Turkish loanword you will hear all over the Levant, and in Amman directions often count roundabouts: \"after the second dawwār\". To give orders, liff = turn, dall = keep going.",
        "he": "dughri (ישר) היא מילה שאולה מטורקית שתשמעו בכל הלבנט, ובעמאן הוראות דרך סופרות הרבה פעמים כיכרות: \"אחרי ה-dawwār השני\". לפקודות: liff = פנה, dall = תמשיך."
      },
      "items": [
        ["قرنة", "'urne", "corner", "פינה"],
        ["آخر الشارع", "ākhir ish-shāri3", "end of the street", "סוף הרחוב"],
        ["جنب", "janb", "next to", "ליד"],
        ["ورا", "wara", "behind", "מאחורי"],
        ["قدام", "'uddām", "in front of", "מקדימה / לפני"],
        ["فوق", "fō'", "up / upstairs", "למעלה"],
        ["تحت", "taḥt", "down / downstairs", "למטה"],
        ["جوا", "juwwa", "inside", "בפנים"],
        ["برا", "barra", "outside", "בחוץ"],
        ["مقابل", "m'ābil", "opposite / across from", "ממול"],
        ["بين", "bēn", "between", "בין"],
        ["إشارة", "ishāra", "traffic light", "רמזור"],
        ["دوار", "dawwār", "roundabout", "כיכר תנועה"],
        ["لف يمين", "liff yamīn", "Turn right", "פנה ימינה"],
        ["ضل دغري", "dall dughri", "Keep going straight", "תמשיך ישר"],
        ["البنك جنب الجامع", "il-bank janb ij-jāmi3", "The bank is next to the mosque", "הבנק ליד המסגד"]
      ]
    },
    {
      "id": "hotel_airport", "kind": "vocab", "icon": "🛄",
      "title": {"en": "Hotel & airport", "he": "מלון ושדה תעופה"},
      "intro": {
        "en": "In everyday speech a passport is basbōr; on signs and forms you will see the standard Arabic جواز سفر (jawāz safar). Both are understood everywhere.",
        "he": "בדיבור יומיומי דרכון הוא basbōr; על שלטים ובטפסים תראו את המילה בערבית תקנית جواز سفر (jawāz safar). שתיהן מובנות בכל מקום."
      },
      "items": [
        ["باسبور", "basbōr", "passport", "דרכון"],
        ["شنطة سفر", "shantit safar", "suitcase", "מזוודה"],
        ["طابق", "tābi'", "floor (storey)", "קומה"],
        ["فندق", "fundu'", "hotel", "מלון"],
        ["حجز", "ḥajz", "reservation / booking", "הזמנה (של מקום)"],
        ["الاستقبال", "il-isti'bāl", "reception (desk)", "קבלה (במלון)"],
        ["مطار", "matār", "airport", "שדה תעופה"],
        ["بوابة", "bawwābe", "gate (at the airport)", "שער (בשדה התעופה)"],
        ["وصول", "wusūl", "arrivals", "נחיתות"],
        ["مغادرة", "mughādara", "departures", "המראות"],
        ["فيزا", "fīza", "visa", "ויזה"],
        ["جمرك", "jumruk", "customs", "מכס"],
        ["عندي حجز", "3indi ḥajz", "I have a reservation", "יש לי הזמנה"],
        ["بدي أوضة لليلتين", "biddi ōda la-lēltēn", "I want a room for two nights", "אני רוצה חדר לשני לילות"],
        ["إمتى الرحلة؟", "imta ir-riḥle?", "When is the flight?", "מתי הטיסה?"],
        ["الطيارة متأخرة", "it-tayyāra mit'akhkhra", "The plane is delayed", "המטוס מתעכב"]
      ]
    },
    {
      "id": "travel", "kind": "vocab", "icon": "✈️",
      "title": {"en": "Getting around", "he": "בדרכים"},
      "intro": {
        "en": "Careful: shmāl means both \"left\" and \"north\". To say \"to the left\" or \"to the right\", use 3a-sh-shmāl and 3a-l-yamīn (3a is short for 3ala, \"on\").",
        "he": "שימו לב: shmāl פירושו גם \"שמאל\" וגם \"צפון\". כדי לומר \"שמאלה\" או \"ימינה\" אומרים 3a-sh-shmāl ו-3a-l-yamīn (3a הוא קיצור של 3ala, \"על\")."
      },
      "items": [
        ["شارع", "shāri3", "street", "רחוב"],
        ["طريق", "tarī'", "road / way", "דרך / כביש"],
        ["عنوان", "3inwān", "address", "כתובת"],
        ["خريطة", "kharīta", "map", "מפה"],
        ["تذكرة", "tazkara", "ticket", "כרטיס"],
        ["محطة", "maḥatta", "station / stop", "תחנה"],
        ["سوق", "sū'", "market", "שוק"],
        ["مستشفى", "mustashfa", "hospital", "בית חולים"],
        ["شمال", "shmāl", "left", "שמאל"],
        ["يمين", "yamīn", "right", "ימין"],
        ["دغري", "dughri", "straight ahead", "ישר"],
        ["حارة", "ḥāra", "neighborhood", "שכונה"],
        ["سايح", "sāyiḥ", "tourist", "תייר"],
        ["صوّر", "sawwar", "to take photos", "לצלם", {"form": ["بصوّر", "bsawwir"]}],
        ["زار", "zār", "to visit", "לבקר", {"form": ["بزور", "bzūr"]}],
        ["ضاع", "dā3", "to get lost", "ללכת לאיבוד", {"form": ["بضيع", "bdī3"]}]
      ]
    },
    {
      "id": "conversation", "kind": "phrases", "icon": "🗣️",
      "title": {"en": "Everyday conversation", "he": "שיחה יומיומית"},
      "intro": {
        "en": "law samaḥt (\"if you allow\") is the everyday \"please\", said to a man; to a woman it's law samaḥti. And shwayy shwayy (\"a little, a little\") means \"slowly\", or \"take it easy\".",
        "he": "law samaḥt (\"אם תרשה\") הוא ה\"בבקשה\" היומיומי, כשפונים לגבר; לאישה אומרים law samaḥti. ו-shwayy shwayy (\"קצת, קצת\") פירושו \"לאט\", או \"לאט לאט, בנחת\"."
      },
      "items": [
        ["قديش صرلك هون؟", "'addēsh sarlak hōn?", "How long have you been here?", "כמה זמן אתה פה?"],
        ["وين ساكن؟", "wēn sākin?", "Where do you live?", "איפה אתה גר?"],
        ["أنا مش من هون.", "ana mish min hōn.", "I'm not from here.", "אני לא מפה."],
        ["وين أقرب صيدلية؟", "wēn a'rab saydaliyye?", "Where's the nearest pharmacy?", "איפה בית המרקחת הקרוב?"],
        ["معك حق.", "ma3ak ḥa'.", "You're right.", "אתה צודק."],
        ["شو يعني هاي الكلمة؟", "shū ya3ni hāy il-kilme?", "What does this word mean?", "מה פירוש המילה הזאת?"],
        ["ممكن تساعدني؟", "mumkin tsā3idni?", "Can you help me?", "אתה יכול לעזור לי?"],
        ["شو في؟", "shū fī?", "What's going on?", "מה קורה?"],
        ["كيف بوصل ع وسط البلد؟", "kīf bawsal 3a wasat il-balad?", "How do I get downtown?", "איך מגיעים למרכז העיר?"],
        ["بدي تذكرة لعمان.", "biddi tazkara la-3ammān.", "I want a ticket to Amman.", "אני רוצה כרטיס לעמאן."],
        ["الحساب لو سمحت.", "il-ḥsāb law samaḥt.", "The bill, please.", "החשבון, בבקשה."],
        ["أنا جوعان.", "ana jū3ān.", "I'm hungry.", "אני רעב."],
        ["شو رأيك؟", "shū ra'yak?", "What do you think?", "מה דעתך?"],
        ["يلا، أنا ماشي.", "yalla, ana māshi.", "OK, I'm off.", "יאללה, אני זז."]
      ]
    }
  ]
});
