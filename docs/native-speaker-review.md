# Notes for native speakers

All lesson content was written and cross-checked by AI. No native speaker has reviewed it yet, for any language.
The AI reviewers flagged the items below as worth a second look: they're correct as far as the AI could tell, but a native speaker should confirm them.
If you can help, open an issue or a pull request. Each lesson is in `js/data/<language>/<file>.js`.

## Farsi: js/data/fa/: basics.js, people.js

- [ ] The 'relatives' lesson has only two cousin words (pesar-amu and dokhtar-khâle). That is correct but not complete; there are 8 combinations, which the intro explains. The latin is written with a hyphen (pesar-amu) but is said as one word without an ezâfe, which is correct.
- [ ] The Hebrew for the nephew/niece items is only masculine ('אחיין (ילד של האח)'), while the English is 'nephew / niece'. This follows the masculine-default rule, but a native speaker might prefer 'אחיין / אחיינית'.
- [ ] 'آخر' (âkhar) is translated as 'last' / 'אחרון'. Before a noun, standard Persian uses آخرین (âkharin, 'the last'). آخر comes after a noun (روز آخر). I left it because it is not wrong.
- [ ] 'مهم نیست' is written 'mohem nist' with a single m. The word has a final doubled consonant (mohemm), but it is usually not heard at the end of a word, so I left it.
- [ ] 'کمک کنید!' is translated as 'Help!'. Iranians shouting for help usually say just 'کمک!'. The longer form is also correct.
- [ ] 'خوشگل' and 'کچل' are rather colloquial or informal for a vocabulary lesson that should be formal. Both are very common, standard everyday words, so I kept them.

## Farsi: js/data/fa/: food.js, home.js, clothes.js, colors.js

- [ ] vegetables/gojefarangi: the lit 'European plum' is right (gowje = plum, farangi = Frankish/European). But in English 'European plum' is also the name of a real fruit (Prunus domestica). 'foreign plum' would avoid the mix-up. I left it as it is.
- [ ] kitchen/ماشین ظرفشویی and objects/خمیردندان, drinks/آبمیوه: the joined spellings are common. The Academy-preferred spellings are ظرف‌شویی, خمیر دندان and آب‌میوه. All of them are in normal use, so I made no change.
- [ ] dishes/قورمه سبزی: also often written قورمه‌سبزی. Both are fine, and 'ghorme sabzi' (no ezâfe) is right. 'zereshk polo' without ezâfe is also right.
- [ ] shapes/خط 'khat': the word is geminated in theory (khatt), but at the end of a word it is said 'khat'. I kept it.
- [ ] rooms/پله 'pelle' = stairs: strictly it means 'step', but people use it for stairs. Hebrew מדרגות is fine.
- [ ] colors/سرمه‌ای → Hebrew 'כחול כהה' (dark blue): fine, but it overlaps with the intro's âbi-ye tire = dark blue. 'כחול נייבי' would be more exact. I left it.
- [ ] Every other item checked out: spelling, ی/ک, ZWNJ, transliteration, English/Hebrew meanings, the lit notes (لوزی from Arabic lawz = almond is correct; یخچال = ice pit; سرمه = kohl), and the cultural facts in the intros. The existing lessons food (14 items) and colors (11 items) keep their ids and their items in the original order, and the new items come only after them.

## Farsi: js/data/fa/: animals.js, nature.js, body.js

- [ ] Hebrew עיט for عقاب (eagle): this is the zoologically correct word. In everyday Hebrew, though, people often say נשר for 'eagle'. I kept עיט.
- [ ] Hebrew מרפאה for مطب (doctor's office): acceptable. Some speakers would say קליניקה or 'מרפאה פרטית'. I kept it.
- [ ] Transliteration of final ع before the ezâfe: 'tolu'-e âftâb' fits the rob' / jam' style in time.js and culture.js. Other shards drop the final ع instead (verbs.js 'shoru kardan', feelings.js 'shojâ', 'sari'). The project should pick one convention across all files. This is not an error in shard C.
- [ ] خرگوش = خر + گوش ('donkey ear'): this explanation is widely given and plausible, but it is a folk etymology rather than an established scholarly one. I kept the lit gloss.
- [ ] Zero-width non-joiners in animals.js (8) and body.js (5) are literal U+200C characters, not the ‌ escape the brief asks for. The JSON means the same thing and check_data.py passes. My attempts to switch them to escapes did not stick: the Edit tool turned my ‌ back into the real character, and the files did not change after the shell scripts that rewrote them, although those scripts reported success. Run a one-line replace yourself if you want the escapes for readability.
- [ ] Cross-shard Farsi repeats that involve this shard: شیر (lion vs milk in food) and ماه (moon vs month in time) have different meanings and are explained in the intros, so they are intentional. مرغ (hen vs chicken in food) is allowed by the brief. ستاره (star) appears in both sky and colors.js 'shapes' with the same meaning. The shapes lesson is the natural place for the star shape, so I kept it in sky and leave the choice to the shapes shard's owner.
- [ ] The face lesson also has گردن (neck) and پوست (skin), which are not strictly parts of the face. They are correct words, so I made no change (it would only be a taste change).

## Farsi: js/data/fa/: time.js, city.js, shopping.js

- [ ] city.js, places: پمپ بنزین is written "pomp-e benzin" (with ezâfe). In everyday speech I think it is more often said "pomp benzin", as a compound with no ezâfe. Both are heard, so I left it as it is. A native speaker should confirm.
- [ ] shopping.js, shopping intro: it says "Iran's official money is the rial". In 2025 Iran's parliament passed a law to remove four zeros and make the toman the official unit. During the changeover the rial is still in use. The intro is fine for now but may need updating later.
- [ ] city.js, hotel_airport: خروج is glossed "departure / exit". At Iranian airports, departures are often signed پروازهای خروجی or عزیمت. The gloss is acceptable, but a native speaker may want to check it.
- [ ] city.js, directions: جلو has the Hebrew "לפני / מקדימה". Using "לפני" for a place (rather than a time) is a little unusual in Hebrew. I kept it because "ממול" is already used for روبه‌رو in the same lesson.
- [ ] shopping_phrases: "می‌توانم امتحانش کنم؟" is used for "Can I try it on?". This is natural colloquially. For clothes, "می‌توانم پرو کنم؟" is also common. I left it because it is not wrong.
- [ ] The checker flags کشتی in both transport (kashti, ship) and sports (koshti, wrestling). These are two different words that are spelled the same. The ماه warning (month in time, moon in sky) is also correct in both places. I changed neither.

## Farsi: js/data/fa/: school.js, feelings.js, hobbies.js, verbs.js

- [ ] ناامید (nâomid) is glossed 'disappointed / מאוכזב'. Its literal meaning is 'hopeless / without hope'. It is very often used for 'disappointed' (ناامید شدم), and it pairs with امیدوار in the same lesson, so I kept it. A native speaker could decide whether to gloss it 'disappointed / hopeless'.
- [ ] hobbies: 'در وقت آزاد چه کار می‌کنید؟' is correct. 'در وقت آزادتان …' (vaght-e âzâdetân) or 'در اوقات فراغت' might sound a little more natural. I did not change it because the difference is only one of style.
- [ ] تکلیف (taklif) for 'homework' is correct standard Persian. Iranian schoolchildren also say مشق (mashgh) colloquially.
- [ ] ایستادن → می‌ایستم is written 'miistam' (formal). In speech it is usually 'mistam'. I kept the formal form, as the rules ask for vocabulary.
- [ ] Leftover cross-file warning: کشتی appears in sports (koshti, wrestling) and in transport (kashti, ship). These are two different words that share a spelling, and each belongs in its lesson, so I left both.
- [ ] The ZWNJ in these files is written as the literal character, not the ‌ escape. The JSON result is identical and the checker accepts it.
- [ ] No native speaker has checked any of this content.

## Farsi: js/data/fa/: alphabet.js, grammar.js, culture.js, talk.js

- [ ] Spelling of the ow sound: I switched noruz, molavi and ferdosi to 'o' so they match the existing 'sâl-e no' and other shards' 'moz'. A native speaker may prefer the more careful pronunciation nowruz / mowlavi / ferdowsi. Whichever is chosen, it should be applied across all files.
- [ ] In the slang lesson, the intro promises that the formal written form is shown wherever it differs. 'قربونت برم' (ghorbunet beram) has no form (written: قربانت بروم, ghorbânat beravam), because its one allowed extra field is already used by its literal meaning. I kept the literal meaning.
- [ ] In 'خیلی باحاله', the 'form' 'خیلی باحال است' is only half-formal, because باحال is itself a slang word. It is acceptable, but a native speaker may prefer a different word.
- [ ] Hebrew spellings of proper names: הפת-סין (some write הפט-סין), אספהאן (also written איספהאן), גזל for ghazal (the same letters as the Hebrew word for robbery, but this is the usual spelling). All are acceptable; I left them.
- [ ] The existing tobe intro (copied from data.js, not changed) glosses the word order in Hebrew as "אני טוב הנני", which sounds odd in Hebrew. It is not wrong, so I left it.

## Spanish (Latin American): js/data/es/

- [ ] The user's actual request, a separate visual theme for each language, has not been done. It needs changes to css/style.css, js/app.js and probably index.html, js/registry.js or js/strings.js, which no content shard or this editor pass may edit. A separate UI step must build it.
- [ ] Syllable-guide convention (stressed one-syllable words in capitals, lowercase atonic articles, prepositions and pronouns, lowercase 'un', U-na with a capital) is now applied the same way in all es files. docs/content-format.md does not state it, and its example 'bue-nos DÍ-as' leaves the first word unmarked. The workflow may want to write the rule into the doc.
- [ ] Remaining duplicate warnings kept on purpose: viejo (describing: old person, זקן; adjectives: old thing, ישן). A native speaker could decide whether one copy should become another word, for example anciano or antiguo.
- [ ] clock: 'Son las seis menos cuarto.' is taught as the main form. Mexico and Colombia mostly say 'Son cuarto para las seis', which the intro mentions. Someone should decide which form to teach first.
- [ ] Regional vocabulary to check (all are widely understood): rosado (Mexico says rosa), dormitorio (Mexico: recámara), fregadero, calcetines (Argentina: medias), aretes (Argentina: aros), estrecho (angosto is more common), ligero (liviano in South America), bolígrafo, currículum (Colombia: hoja de vida), reserva (Mexico: reservación, now in the intro), cambio (vuelto in Argentina, Chile and Peru), resfriado (resfrío, catarro), barbilla (mentón), agua mineral (sparkling in Mexico).
- [ ] guapo (describing): 'good-looking' in most countries, but it can mean 'brave' or 'tough' in Colombia and the Caribbean.
- [ ] prima (relatives): the Hebrew is 'בת דודה'. The more standard form is 'בת דוד'.
- [ ] con gusto as a reply to gracias is regional (Colombia, Central America, parts of Mexico). The intro says 'Many Latin Americans', which is accurate.
- [ ] shopping_phrases: '¿Cuánto es?' is glossed 'How much is it altogether?' / 'כמה זה יוצא בסך הכול?'. That is narrower than real use, where it also just means 'How much is it?'. I kept it so it differs from '¿Cuánto cuesta?' in basics.
- [ ] body: estómago is now 'בטן / קיבה'. Please confirm that order is the best one for learners.
- [ ] gustar: 'Me encanta la playa.' is translated 'אני מת על הים'. The Hebrew is slangy but natural, and a reviewer may prefer 'אני מאוד אוהב את החוף'.
- [ ] talk.js: '¡Pa'lante!' has the guide '¡pa-LAN-te!' without the apostrophe, and 'palante' is also a common spelling. 'pa' que sepas' has the guide "PA' que SE-pas", with pa' in capitals although it is an atonic preposition. güey is also written wey. vos is also used in Paraguay and much of Central America, not only Argentina and Uruguay.
- [ ] culture.js: cempasúchil is the spelling used (variant: cempazúchitl).
- [ ] food.js: lentejas (lentils, a legume) is in the vegetables lesson, which is a matter of taste. '¡Buen provecho!' is now only in table.

## Japanese: js/data/ja/

- [ ] Visual theme request ('each language has its own visual theme'): the content pass does not cover it. Theme files already exist (css/themes/ja.css, js/themes/ja.js, per docs/theme-format.md). Someone should confirm they are finished and wired into js/app.js, because no content agent can check that.
- [ ] 魚 is in both animals/sea_insects and food/food. I kept it in both on purpose (animal vs food). Drop one copy if exercises should never repeat a word.
- [ ] people.js relatives: 甥/姪 are written in kanji (not jōyō, dense for beginners). おい/めい in kana may suit this level better.
- [ ] people.js describing: 年を取った for 'old (person)' is mainly used before a noun. 年配の or 年を取っている could be preferred.
- [ ] people.js relatives intro: saying おじさん/おばさん work as 'mister/ma'am' for any middle-aged stranger is a simplification, and these words can sound unflattering.
- [ ] clothes.js: I changed イヤリング to ピアス ('earrings (pierced)'). Please check this is the preferred everyday word.
- [ ] colors.js intro lists only 赤い/青い/白い/黒い as color adjectives. 黄色い and 茶色い also exist.
- [ ] food.js dishes: 抹茶 is mostly a drink or flavour but sits in 'Japanese dishes' (the drinks lesson is full at 16).
- [ ] food.js dishes intro he: 'לשאוב בקול אטריות' is slightly stiff.
- [ ] home.js / school.js / city.js: kana fields mix scripts for mixed words (でんしレンジ, けしゴム, バスてい, ゴミばこ, はブラシ). This is now consistent across the folder; please confirm the reading exercises handle it well.
- [ ] home.js objects: the lesson icon is 🔑, but 鍵 is in city.js/hotel_airport, not in this lesson (cosmetic).
- [ ] nature.js landscape intro: says 山 in mountain names is 'usually' read さん. There are exceptions (立山, 嵐山), so 'often' may be safer.
- [ ] body.js: 頬 is given as hō (ほお). ほほ is also standard.
- [ ] animals.js: オウム 'parrot' (small parrots are インコ). チョウ is the textbook form; ちょうちょ is common in speech.
- [ ] nature.js: 夕日 is glossed 'sunset (evening sun)'. Strictly it is the setting sun; 日の入り is the event.
- [ ] time.js intro: weekday names are said to come from 'the moon, the sun and five elements'. Strictly, they come from the seven luminaries (the planets named with element kanji).
- [ ] city.js: 出発 Hebrew 'המראה / יציאה לדרך' starts with 'takeoff'. よい旅を！ is more a written or sign phrase; in speech people say 気をつけて.
- [ ] shopping.js: お客さん is glossed only as 'customer' (it also means 'guest').
- [ ] school.js: 生徒 is used broadly in speech; officially elementary pupils are 児童.
- [ ] verbs.js verbs3: 知る and 住む are given as 知っています / 住んでいます (on purpose). The negative of 知る is 知りません.
- [ ] hobbies.js sports intro: 'baseball is Japan's favorite sport' is arguable. Check the Hebrew transliteration 'קושיאן' for Kōshien.
- [ ] feelings.js: na-adjectives are listed with な attached (便利な, 大切な…). This is a convention choice that differs from dictionary headwords.
- [ ] grammar.js: the Hebrew intros use ← for 'becomes' around Japanese text (e.g. 食べる ← 食べます). This is project-wide; check how it looks in RTL.
- [ ] grammar.js: the past intro still cites わかりました and the negative intro cites わかりません as examples. Both now appear only in basics.js, which is fine but worth knowing.
- [ ] grammar.js: takakunai/samukunai are written as one word, while 'ja nai desu' is split. Both are common textbook conventions.
- [ ] grammar.js te_form intro leaves out ぐ → いで (泳いで).
- [ ] talk.js: ありがとね is 'arigato ne' (no macron, correct for ありがと). ううん is 'ūn' ('uun' is also seen). 恐れ入ります is one word, 'osoreirimasu'.
- [ ] talk.js keigo: 召し上がる / いらっしゃる have no 'form' field on purpose (the 'I … (present)' label would be wrong for honorific verbs).
- [ ] culture.js / talk.js: both groups are 'advanced'. Basic culture words (お祭り, 花火) could fit intermediate.
- [ ] kana.js: the Hebrew for ココア is שוקו (the drink sense). The kata5 Hebrew intro '(カ ← ガ)' should be checked in the real RTL UI.

## Arabic (spoken Levantine): js/data/ar/

- [ ] About the user's request (a separate visual theme for each language): this content pass could not handle it and did not try. docs/theme-format.md assigns it to each language's theme designer, and css/themes/ar.css and js/themes/ar.js already exist. I did not open or review them.
- [ ] Project convention: emphatic consonants (ص ض ط ظ) are written as plain s/d/t/z in the latin field, as the format doc allows, so learners cannot tell ص from س. The alphabet lesson's letter names and sound descriptions do use dots (ṣād, ṭā).
- [ ] Latin style I standardized: Palestinian/Jordanian ba- for the present 'I' form (baktob, ba3rif, bashrab, bat3allam), i in past forms (shirib, 3irif), short ma for negation, -it for possessive phrases (ōdit nōm). Lebanese/Syrian speakers would often say bektob / be3ref / ōdet nōm. A native speaker should confirm this house style.
- [ ] New items from this pass need a native check: وصفة wasfe 'prescription' (Syria/Lebanon often say روشتة), ليموناضة lēmūnāda (līmonāda is also heard), برنيطة burnēta 'hat', طابق tābi' 'floor', طلوع الشمس tlū3 ish-shams, قديش صرلك هون؟, ممكن تكتبلي ياه؟ (yāh), يلا، أنا ماشي.
- [ ] Two forms of the 'light/heavy blood' expression are taught: خفيف دم / تقيل دم in people and feelings, and دمه خفيف / دمه تقيل in slang. The other common form is خفيف الدم.
- [ ] people.js: كنة kinne (Syrian/Lebanese; Palestinians and Jordanians often say kanne). أيّ ayy for 'which' (Lebanese ayya, also anu/ani). كهربجي kahrabji vs كهربائي. صيدلاني vs صيدلي. The family intro gives abūy/akhūy, and Syrian/Lebanese bayyi/khayyi only partly.
- [ ] basics.js: the Hebrew literal meaning for مع السلامة, 'בשלום ובבטחה', is loose.
- [ ] food/home/clothes: شاي بمرمية maramiyye vs ميرمية mēramiyye. rakwe is mainly Syrian/Lebanese (Palestinians say ibrī' or dalle). جارور vs دُرج. قشاط 'shāt vs حزام ḥzām. The clothes intro's claim about kundara is simplified. منقوشة (singular) is glossed with the plural 'manakish'.
- [ ] animals/nature/body: وجه wijh (Lebanese/Syrian closer to wišš). ثعلب ta3lab vs sa3lab. ببغاء could be written ببغا. Is يا عصفوري a common pet name for a child? عشب vs حشيش for lawn grass.
- [ ] time/city/shopping: day names have variants (it-tanēn / it-tnēn), plus servīs/sarvīs and janb/jamb. Month names are spelled الثاني while the latin says it-tāni. موتور is glossed only as 'motorcycle' but also means 'engine'. مركز الشرطة vs المخفر.
- [ ] school/hobbies/verbs: غنا ghina (ghinē?). إجا form باجي bāji (Pal./Jor.) vs بجي. عطى 3ata vs أعطى a3ṭa. فرصة/وظيفة are not what Lebanese schools say. The school intro's claim about galam/kalam. نادي vs جيم for a gym.
- [ ] grammar.js: هدوليك hadolīk vs هدولاك hadolāk. الولد هاد vs hal-walad. هم humme can also be written همه.
- [ ] culture/alphabet/talk: is دايمة after coffee also usual in Lebanon and Syria? عزومة vs عزيمة. يا رايح كتر ملايح vs كتّر الملايح. عقبال عندك vs عقبالك. سنة حلوة keeps the song's sene while elsewhere it is sane. ى is set to joinsToNext false (fine for teaching). Proverb مفتاح is miftāḥ while objects has the everyday muftāḥ (kept on purpose). ما فهمت عليك is close to grammar's ما فهمت.
- [ ] The numbers 0-20 lesson has 21 items, above the doc's 10-16 guideline. The checker accepts it, so I left it.
