# Talk like a Persian · مثل یک ایرانی حرف بزن

A free web app for learning **Farsi (Persian)**, for English and Hebrew speakers.

**▶ Try it:** https://avielraz123.github.io/talk-like-a-persian/

## Features

- **English or Hebrew interface.** The whole app switches language, and Hebrew is shown right to left.
- **Choose your level:** beginner, intermediate or advanced.
- **Choose what to learn:**
  - **Speaking only:** words and phrases in Latin letters (like *salâm*), with the Farsi script shown small next to them.
  - **Speak, read & write:** also the full Farsi alphabet, letter shapes and reading practice.
- **26 topics, about 275 words, letters and phrases.** The alphabet, greetings, numbers, family, food, colors, the body, days and time, travel, verbs, grammar (present, past and future tense, negation, ezâfe), ta'ârof politeness, celebrations, spoken Tehran-style Farsi, and longer sentences.
- **Many kinds of exercises:**
  - flip cards
  - multiple choice
  - true / false
  - a matching game
  - typing the pronunciation
  - putting the words of a sentence in order
  - building a Farsi word from letters
  - reading Farsi script
  - letter-shape drills
- **Optional speaking practice.** Say the word into your microphone and the browser checks it (Chrome or Edge). Every speaking exercise has a skip button, and you can turn speaking practice off in Settings. You never need it to make progress.
- **Review mode** brings back the words you get wrong most often.
- **Speed round:** how many can you answer in 60 seconds?
- **Progress is saved in your browser:** stars per topic, XP points and a daily streak.

## Running it on your computer

It's a plain website with no installation or build step. Either:

- open `index.html` in a browser, or
- run a small local server from the project folder: `python -m http.server`, then go to http://localhost:8000

## Project structure

```
index.html          the page
css/style.css       design (light & dark mode, phone-friendly)
js/data.js          all lesson content (Farsi, Latin letters, English, Hebrew)
js/strings.js       interface text in English and Hebrew
js/app.js           the app logic
tools/check_data.py checks the lesson content for mistakes
tests/smoke.html    automated test: open it in a browser, it plays every lesson and prints PASS/FAIL
```

## Adding or fixing content

All the lessons are in [`js/data.js`](js/data.js). Each word is one line:

```
["سلام", "salâm", "hello", "שלום"]
```

After editing, run `python tools/check_data.py` to check for mistakes, and open `tests/smoke.html` to make sure everything still works.

The Farsi content hasn't been reviewed by a native speaker yet, so corrections are very welcome. Please open an issue or a pull request.
