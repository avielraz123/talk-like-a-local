# Content format (all languages)

"Talk like a local" teaches several languages to English and Hebrew speakers. Each language has the same structure:

- **groups**: the topics on the main menu, for example Animals
- **lessons**: each group's sub-topics, for example Birds
- **items**: the words and phrases in each lesson

## Languages

| code | language | variety taught | target script | "latin" field (2nd item field) | direction |
|---|---|---|---|---|---|
| `fa` | Farsi | standard Iranian (Tehran) | Persian script | transliteration | rtl |
| `es` | Spanish | **Latin American** | Latin (the Spanish word itself) | **syllable guide**, see below | ltr |
| `ja` | Japanese | standard (Tokyo) | Japanese as normally written (kanji + kana) | **rōmaji** (Hepburn) | ltr |
| `ar` | Arabic | **spoken Levantine / Palestinian** | Arabic script, colloquial spelling | transliteration | rtl |

## Files

Each language's lessons live in `js/data/<lang>/<group>.js`. Every file contains exactly ONE call, and its second argument must be strict JSON (double quotes, no comments inside, no trailing commas):

```
TLAP_ADD("es", {
  "group": {"id": "g-food", "level": "beginner", "icon": "🍎", "title": {"en": "Food & drink", "he": "אוכל ושתייה"}},
  "lessons": [
    {"id": "fruits", "kind": "vocab", "icon": "🍓", "title": {"en": "Fruits", "he": "פירות"},
     "intro": {"en": "...", "he": "..."},
     "level": "intermediate",
     "items": [ ... ]}
  ]
});
```

A one-line `//` comment above the call is fine.

### Groups and lessons

- **Group ids** start with `g-`.
- **Lesson ids** are lowercase letters, digits and `_`, and unique within the language. Different languages may reuse the same ids, for example `fruits`.
- **`level`** is one of `beginner`, `intermediate` or `advanced`. A lesson can set its own level only when it differs from its group's.
- **`kind`** is one of:
  - `vocab`: words and short expressions
  - `phrases`: sentences and expressions
  - `grammar`
  - `alphabet`: script and letter lessons
- **`intro`** is optional: a short, friendly, genuinely useful tip in both `en` and `he`.
- **Size:** each lesson has 10-16 items, and never fewer than 6.
- **No repeated meanings:** within one lesson, no two items may share the same English meaning or the same Hebrew meaning. Disambiguate with a note in parentheses, for example `"orange (fruit)"`.

## Word / phrase items

```
[target, latin, english, hebrew, extra?]
```

- **target**: the word or phrase in the language being taught.
- **latin**: how to read it in Latin letters. What this means differs per language, see below.
- **english**: short and natural.
- **hebrew**: natural modern Hebrew, with no niqqud. Use the masculine singular by default.
- **extra** (optional): an object with one or more of these keys:
  - `"form": [target, latin]` for **verbs**: the present-tense "I …" form (fa, es, ar) or the polite present (ja, for example `[ "食べます", "tabemasu" ]`).
  - `"lit": [english, hebrew]`: the literal meaning of an idiom, proverb or expression.
  - `"digit": "٣"`: the number written in the language's own digits, if it has them (fa: ۳, ar: ٣, ja: leave out or use 三 for kanji numerals).
  - `"kana": "ねこ"` (**ja only, required whenever the target contains kanji**): the full reading in hiragana (katakana for katakana words), with no spaces.
  - `"parts": ["わたしは", "がくせい", "です"]` (**ja only, required for phrases whose rōmaji has 3+ words**): the target split into chunks. There must be exactly as many chunks as rōmaji words, and joining the chunks must give the target without its final punctuation. This drives the "put the words in order" exercise, because Japanese doesn't put spaces between words.

**Word order rule (fa, es, ar):** a phrase with 3+ words must have the same number of space-separated words in the target and in the latin field. A Farsi word joined with a zero-width non-joiner counts as one word.

## Alphabet / script items (`kind: "alphabet"`)

```
[character, name, sound, joinsToNext, exampleTarget, exampleLatin, exampleEnglish, exampleHebrew]
```

- **fa / ar:**
  - `joinsToNext` is true when the letter connects to the next letter.
  - In ar, ا د ذ ر ز و don't join; in fa, ا د ذ ر ز ژ و don't.
  - The app shows each letter's four shapes.
- **ja:**
  - one kana per item, for example `["か", "ka", "ka", false, "かさ", "kasa", "umbrella", "מטרייה"]`.
  - `joinsToNext` is always `false`.
  - Use separate lessons for hiragana and katakana rows.
- **es:**
  - a "Sounds" group for every learner. Each item is a letter or letter combination and its sound, for example `["ñ", "eñe", "ny (as in canyon)", false, "niño", "NI-ño", "child", "ילד"]`.
  - `joinsToNext` is `false`.

## Per-language rules for the `latin` field and script

### Farsi (`fa`)

- Use Persian ی ک, never Arabic ي ك.
- Write the ZWNJ as `‌`.
- Transliteration:
  - â = long a, a = short a, e, o, i, u
  - kh, gh (for both غ and ق), sh, ch, zh
  - ' for a mid-word ع or ء
  - ezâfe is written -e after a consonant and -ye after a vowel

### Spanish (`es`)

- **Target:** correct Spanish spelling with all accents and ñ, ¿ ¡.
- **Latin American usage:**
  - ustedes, not vosotros
  - the common Latin American words, for example *carro* or *computadora*; mention a Spain variant in the intro or the English gloss only when it's useful
  - use the seseo (no Castilian "th" in syllable guides)
- **The latin field is a syllable guide:** split the word into syllables with hyphens and write the stressed syllable in CAPITALS, keeping Spanish spelling, for example `"GRA-cias"`, `"bue-nos DÍ-as"`, `"COM-pu-ta-DO-ra"`.
  - A secondary stress is not needed.
  - Phrases keep spaces between words, so the word counts match.
- The typing exercise asks for the Spanish word itself, and accents are forgiven.

### Japanese (`ja`)

- **Target:** natural written Japanese (kanji + kana) as a native writer would write it, at a level-appropriate kanji density. Write common words in kana when that's what natives do.
- Always include `kana` when the target has kanji.
- **Rōmaji (latin field):**
  - Use Hepburn with macrons: ō, ū; ei stays ei; ii stays ii.
  - Write the particles は/を/へ as wa/o/e.
  - Put spaces between words and particles: `watashi wa gakusei desu`.
  - Write everything in lowercase.
- Polite (です/ます) style by default. Casual speech belongs in its "talk like a local" lessons.

### Arabic (`ar`)

- **Spoken Levantine (Palestinian / Jordanian / Lebanese / Syrian common forms) in Arabic script,** spelled the way Levantine speakers commonly write their dialect. Use Arabic ي ك, never Persian ی ک.
- Short vowels (harakat) are usually omitted. Add them only when needed to avoid ambiguity.
- **Transliteration (latin field):**
  - ā ī ū for long vowels; a, i, u, e, o for short ones as pronounced
  - ḥ = ح, kh = خ, gh = غ, sh = ش, j = ج (or zh where pronounced so)
  - ' = ء and the glottal-stop ق of urban speech; 3 = ع (Arabizi convention familiar to Levantine learners)
  - doubled consonants are written double
  - Write it in lowercase except ḥ.
- Where Modern Standard Arabic differs a lot, you may mention the MSA word in the intro.

## Validate

```
python tools/check_data.py js/data/<lang>/<file>.js [more files]
python tools/check_data.py --lang es
python tools/check_data.py
```

The first form checks only the files you name, the second a whole language, and the third everything.
