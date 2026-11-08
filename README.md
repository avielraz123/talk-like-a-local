# Talk like a Persian · مثل یک ایرانی حرف بزن

A free, playful web app for learning **Farsi (Persian)**, for English and Hebrew speakers. Pishi the cat (پیشی, Farsi for "kitty") learns with you.

**▶ Try it:** https://avielraz123.github.io/talk-like-a-persian/

## Features

- **English or Hebrew interface.** The whole app switches language, and Hebrew is shown right to left.
- **Choose your level:** beginner, intermediate or advanced.
- **Choose what to learn:**
  - **Speaking only:** words and phrases in Latin letters (like *salâm*), with the Farsi script shown small next to them.
  - **Speak, read & write:** also the full Farsi alphabet, letter shapes, reading and spelling.
- **1,081 words and phrases, plus the 32 letters.** They're organized in 20 topics and 79 sub-topics, for example Animals → Birds and Food & drink → Fruits. Topics include basics, people, food, animals, home, clothes, the body, time and weather, city and travel, nature, school and work, shopping, feelings, hobbies, verbs, grammar, Persian culture, ta'ârof politeness and spoken Tehran Farsi.
- **Pick any exercise, in any order.** Every sub-topic has its own exercise menu, and nothing is locked:
  - learn cards
  - multiple choice
  - true or false
  - matching game
  - typing
  - word order
  - reading the Farsi script
  - spelling
  - letter drills
  - mix of everything
- **Optional speaking practice.** Say the word into your microphone and the browser checks it (Chrome or Edge). It's a bonus exercise: you can always skip it or turn it off in Settings, and you never need it to finish anything.
- **Dictionary:** search every word in Farsi, Latin letters, English or Hebrew, and see which ones you've learned.
- **Review mode** brings back the words you get wrong most often.
- **Speed round:** how many can you answer in 60 seconds?
- **Progress is saved in your browser:** stars per exercise, XP points and a daily streak.

## Running it on your computer

It's a plain website with no installation or build step. Either:

- open `index.html` in a browser, or
- run a small local server from the project folder: `python -m http.server`, then go to http://localhost:8000

## Project structure

```
index.html                    the page
css/style.css                 design (light & dark mode, phone-friendly)
js/registry.js                collects the lesson files
js/data/*.js                  lesson content, one file per topic (Farsi, Latin letters, English, Hebrew)
js/strings.js                 interface text in English and Hebrew
js/app.js                     the app logic
tools/check_data.py           checks the lesson content for mistakes
tests/smoke.html              automated test: open it in a browser, it plays every lesson and prints PASS/FAIL
docs/native-speaker-review.md items a Persian speaker should double-check
```

## Adding or fixing content

Each topic is one file in [`js/data/`](js/data/), and each word is one line:

```
["سلام", "salâm", "hello", "שלום"]
```

To add or fix words:

1. Edit the file.
2. Run `python tools/check_data.py` to check for mistakes.
3. Open `tests/smoke.html` to make sure everything still works.

In existing sub-topics, add new words at the **end** of the list, because saved progress depends on each word's position.

The Farsi was written and cross-checked by AI and hasn't been reviewed by a native speaker yet, so corrections are very welcome. [`docs/native-speaker-review.md`](docs/native-speaker-review.md) lists the items that most need a native speaker's check. Please open an issue or a pull request.
