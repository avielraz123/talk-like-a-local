# Theme format (one visual theme per language)

Each language in "Talk like a local" has its own cultural theme: colors, background pattern, decorations, a mascot and its lines. The layout and components (playful, chunky rounded buttons, cards, bouncy animations) are shared; themes change how they *look and feel*.

A theme is two files, written only by that language's theme designer:

- `css/themes/<lang>.css`
- `js/themes/<lang>.js`

The app (js/app.js) puts `data-lang="<lang>"` on `<html>` for the language being learned, and loads every theme file up front. Switching language switches theme instantly.

## 1. `css/themes/<lang>.css`

Every rule must be scoped under `html[data-lang="<lang>"]`, so themes never affect each other. A theme sets **only** these variables, which the shared css/style.css uses everywhere. It must set all of them, for light mode and again for dark mode:

```css
html[data-lang="es"] {
  --bg; --surface; --surface-2; --text; --muted; --line; --line-strong;
  /* 7 accent colors, each with a darker "-d" shade used for the chunky 3D bottom edge.
     The names are historical: give them ANY hues that fit your culture, but keep the roles:
     --green = primary action buttons (Continue/Check/Next), must stay clearly "go" and readable with white text;
     --sun   = highlight/badges/logo tile (text on it is dark #2b2d42);
     the other five decorate cards, topic icons and stage icons (white text and emoji sit on them). */
  --green; --green-d; --sun; --sun-d; --coral; --coral-d; --sky; --sky-d;
  --grape; --grape-d; --pink; --pink-d; --orange; --orange-d;
  --ok; --ok-bg; --bad; --bad-bg; --neutral-bg;          /* right/wrong feedback: keep green-ish ok, red-ish bad */
  --font-target: "Zen Maru Gothic", sans-serif;           /* font for the language being taught (see fonts below) */
  --theme-pattern: url("data:image/svg+xml,...");         /* small repeating background tile (inline SVG data URI) */
  --theme-pattern-size: 120px;
  --theme-pattern-opacity: .10;                           /* keep it subtle, so text stays readable */
}
@media (prefers-color-scheme: dark) {
  html[data-lang="es"] { /* dark values for every color variable above */ }
}
```

You may also add a few **decorative, scoped** extras:

- styles for `.theme-deco` elements (see `decorations` below)
- styles for `.mascot` (the mascot SVG wrapper)
- a gentle themed animation, for example falling sakura petals inside `.theme-deco.ambient`

Rules for these extras:

- Don't restyle layout or components (no changes to sizes, grids or positions of app elements).
- Respect `@media (prefers-reduced-motion: reduce)`: no animations.
- **Contrast:**
  - body text on `--bg` and `--surface` must be at least 4.5:1, in light and dark mode;
  - white button text on `--green` should be at least 3:1, and as high as the palette allows;
  - dark `#2b2d42` text on `--sun` must be at least 4.5:1.
- No external images: everything is inline SVG (data URIs or markup from the JS file).

**Fonts.** index.html loads these Google Fonts for every language:

- Fredoka (the interface, en/he)
- Vazirmatn (Farsi)
- Noto Naskh Arabic and Baloo Bhaijaan 2 (Arabic)
- Zen Maru Gothic (Japanese)

Spanish uses Fredoka. Set `--font-target` to one of these.

## 2. `js/themes/<lang>.js`

Exactly one call:

```js
TLAP_THEME("es", {
  name: { en: "Spanish", he: "ספרדית" },           // language name for the language picker
  native: "Español",                                // the language's own name
  flag: "🌎",                                       // emoji shown in the picker (avoid political symbols)
  tagline: { target: "¡Habla como un local!", en: "Speak like a local!", he: "לדבר כמו מקומי!" },
  mascot: {
    name: { en: "Lupe the llama", he: "לופה הלאמה" },
    // Returns an <svg> string, viewBox "0 0 120 120", no width/height attributes (CSS sizes it).
    // mood is "happy" (gentle idle), "cheer" (excited: right answer, results) or "sad" (wrong answer).
    // The three moods must look clearly different (eyes/mouth/pose).
    // Animated parts: give them classes "m-bob" (whole body idle), "m-wag" (tail/ears/wing).
    // The shared CSS animates those classes.
    svg: function (mood) { return '<svg viewBox="0 0 120 120" ...>...</svg>'; }
  },
  lines: {        // what the mascot says. Friendly, short, culturally flavored. Sprinkle in words from the target language with a translation.
    intro:   { en: "¡Hola! I'm Lupe the llama. ...", he: "..." },           // first screen of onboarding
    greet:   { en: ["...", "...", "...", "..."], he: ["...", "...", "...", "..."] },  // menu, random
    group:   { en: "...", he: "..." },                                       // topic page ("pick a sub-topic")
    topic:   { en: "...", he: "..." },                                       // sub-topic page ("pick an exercise")
    right:   { en: ["¡Muy bien!", "..."], he: ["...", "..."] },              // shown after a correct answer
    wrong:   { en: ["...", "..."], he: ["...", "..."] },                     // shown after a wrong answer, kind
    empty:   { en: "...", he: "..." }                                        // dictionary: no results
  },
  decorations: {
    // Inline SVG strings the app places in fixed spots, each wrapped in <div class="theme-deco <spot>">.
    // Purely decorative (the app adds aria-hidden). Keep each under ~6 KB.
    banner:  '<svg ...>',   // wide strip at the top of the main menu, e.g. papel picado bunting / sakura branch / tile frieze. viewBox ~ "0 0 400 60"
    corner:  '<svg ...>',   // small motif placed at a bottom corner of every screen, e.g. a cactus / Mt Fuji / pomegranate / olive branch. viewBox ~ "0 0 120 120"
    results: '<svg ...>',   // shown behind/around the mascot on results screens, e.g. a sun burst / lanterns / fireworks. viewBox ~ "0 0 200 120"
    ambient: ''             // optional: markup for a light animated layer (e.g. a few falling petals); '' if none
  },
  confetti: ["#hex", "#hex", "#hex", "#hex", "#hex", "#hex"]   // celebration colors from your palette
});
```

## Cultural guidance

- Celebrate everyday, positive culture: food, nature, crafts, festivals, architecture and art.
- Avoid politics, religion-specific symbols, flags of contested states, and stereotypes or caricatures of people.
- Animals and objects are great; avoid drawing human characters.

| lang | mascot | palette | motifs |
|---|---|---|---|
| fa | **Shir the lion** (شیر), friendly cartoon lion with a fluffy mane. **NOT** the historic "lion and sun" emblem: no sun behind it, no sword | turquoise, lapis blue, saffron gold, pomegranate red | Persian tile/girih patterns, pomegranates, arches (Isfahan), Nowruz goldfish |
| es | **Lupe the llama** (Latin American Spanish) | fiesta pink, orange, sunny yellow, cactus green, turquoise | papel picado bunting, cacti, sun, maracas, Andean textile stripes |
| ja | **Hana the shiba inu** (花 = flower) | sakura pink, indigo, vermilion (torii red), soft cream | cherry blossoms, seigaiha wave pattern, Mt Fuji, paper lanterns, a falling-petal ambient layer |
| ar | **Hudhud the hoopoe** (هدهد), the Levantine/Arab-world bird with its crest | olive green, terracotta, sand, deep Mediterranean blue | geometric mosaic star patterns, olive branches, the dallah coffee pot, lanterns (fanous), Levantine tiles |

## Preview

Before finishing, build a throwaway preview page in your **own temp folder**, never in the project. It should load `css/style.css`, your theme CSS and your theme JS, and show:

- the mascot in all 3 moods
- palette swatches with white or dark text
- a few `.btn.primary` / `.opt` / `.stage` elements
- the background pattern
- the decorations

Screenshot it in light and dark mode using headless Edge. The saved image is ~72px narrower than the viewport, so wrap the page in a 390px iframe for phone width. Look at the screenshots carefully, fix anything ugly or unreadable, then finish.
