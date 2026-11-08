# Talk like a local

A free, playful web app for learning languages, for English and Hebrew speakers. Each language comes with its own culture, colors and mascot.

**▶ Try it:** https://avielraz123.github.io/talk-like-a-local/

| Language | Variety | Mascot | Words & phrases | Script |
|---|---|---|---|---|
| 🇮🇷 Farsi | Iranian (Tehran) | Shir the lion 🦁 | 1,081 | 32 letters |
| 🌎 Spanish | Latin American | Lupe the llama 🦙 | 1,114 | 34 sounds |
| 🇯🇵 Japanese | Standard (Tokyo) | Hana the shiba inu 🐕 | 1,106 | 107 hiragana & katakana |
| 🫒 Arabic | Spoken Levantine | Hudhud the hoopoe 🐦 | 1,103 | 35 letters & signs |

## Features

- **Pick a language.** Switch any time from the language button at the top. Progress is saved separately for each language.
- **Each language has its own theme:** colors, background patterns, cultural decorations, and a mascot who cheers you on with words in that language.
- **English or Hebrew interface.** Hebrew is shown right to left.
- **Choose your level:** beginner, intermediate or advanced, set separately for each language.
- **Speaking only, or also reading & writing.** Speaking only uses Latin letters (or rōmaji). Reading & writing adds the alphabets: the Farsi and Arabic letters with their shapes, and Japanese kana, with kana readings shown for kanji.
- **About 1,100 words and phrases per language,** in 20 topics and 77–84 sub-topics. They cover everyday life, grammar, culture and "talk like a local" slang and expressions.
- **Pick any exercise, in any order.** Every sub-topic has its own exercise menu, and nothing is locked:
  - learn cards
  - multiple choice
  - true or false
  - matching game
  - typing
  - word order
  - reading
  - spelling
  - letter drills
  - mix of everything
- **Optional speaking practice** with the microphone (Chrome or Edge). It's always skippable and never needed to finish anything.
- **Dictionary:** search every word in its own script, Latin letters, English or Hebrew.
- **Review mode** brings back the words you get wrong most often.
- **Speed round:** how many can you answer in 60 seconds?
- **Dialogues & stories:** short chats where you pick the right reply, and short stories with comprehension questions.
- **Progress is saved in your browser:** stars, XP points and a daily streak.

## Running it on your computer

It's a plain website with no installation or build step. Either:

- open `index.html` in a browser, or
- run a small local server from the project folder: `python -m http.server`, then go to http://localhost:8000

## Project structure

```
index.html                    the page
css/style.css                 shared playful design (light & dark mode, phone-friendly)
css/themes/<lang>.css         each language's colors, patterns and decorations
js/themes/<lang>.js           each language's mascot, its lines and decorations
js/registry.js                collects lesson and theme files
js/data/<lang>/*.js           lesson content, one file per topic; loaded only when that language is picked
js/strings.js                 interface text in English and Hebrew
js/app.js                     the app logic
tools/check_data.py           checks the lesson content for mistakes
tests/smoke.html              automated test (add ?lang=fa / es / ja / ar to test one language's real content)
docs/content-format.md        how lesson files are written, per language
docs/theme-format.md          how themes are written
docs/native-speaker-review.md items native speakers should double-check
```

## Adding or fixing content

Each topic is one file in `js/data/<lang>/`, and each word is one line, for example:

```
["hola", "HO-la", "hello", "שלום"]
```

Read [`docs/content-format.md`](docs/content-format.md) for the rules for each language. Then:

1. Run `python tools/check_data.py` to check for mistakes.
2. Open `tests/smoke.html?lang=<code>` to make sure everything still works.

In existing sub-topics, add new words at the **end** of the list, because saved progress depends on each word's position.

All content was written and cross-checked by AI. No native speakers have reviewed it yet, so corrections are very welcome. [`docs/native-speaker-review.md`](docs/native-speaker-review.md) lists the items that most need a native speaker's check, for every language. Please open an issue or a pull request.
