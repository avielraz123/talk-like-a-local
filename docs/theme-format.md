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
  - dark `#2b2d42` text on `--sun` must be at least 4.5:1;
  - the main-menu mode buttons (Review on `--sky`, Speed on `--pink`, Dictionary on `--grape`, Dialogues & stories on `--coral`) carry a small white subtitle, which needs 4.5:1. If an accent is too light for that, set the optional `--mode-review`, `--mode-speed`, `--mode-dict` or `--mode-stories` (face) with `--mode-review-d` etc. (its darker 3D edge) to a deeper shade of the same hue, in light and/or dark mode; the accents themselves stay as they are everywhere else.
  - the three big numbers on the results screens (score, XP, streak) use `--sky-d`, `--grape` and `--orange-d` on `--surface`. Where those fall under 4.5:1 (usually in dark mode), set the optional `--res-1`, `--res-2`, `--res-3` to lighter shades of the same hues.
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
    // The "world" behind every screen (see section 3). Each is optional; '' if none.
    sky:     '<div ...>',   // sun + clouds in light mode, moon + stars in dark mode
    scene:   '<svg ...>',   // the landscape along the bottom of the screen. viewBox "0 0 1200 200", preserveAspectRatio="xMidYMax slice"
    objects: '<div ...>',   // small cultural objects scattered near the edges
  },
  confetti: ["#hex", "#hex", "#hex", "#hex", "#hex", "#hex"]   // celebration colors from your palette
});
```

## 3. The world behind the screens

Each language should feel like stepping into a different place. The fixed layer `#theme-layer` sits behind the whole app and holds, back to front:

1. **`sky`**: a full-screen layer (`position: absolute; inset: 0`). Put the sun and soft clouds in it for light mode, and the moon and stars for dark mode. Include both sets and switch them with your own scoped CSS under `@media (prefers-color-scheme: dark)`. Position each piece yourself with absolutely positioned child elements, using percentages and `vw`/`vh` units.
2. **`scene`**: a strip along the bottom, full width, `clamp(120px, max(22vh, 100vw / 6), 300px)` tall, holding one wide SVG with `viewBox="0 0 1200 200"` and `preserveAspectRatio="xMidYMax slice"`.
   - On a phone only about the middle third (x ≈ 400–800) is visible, so put the main landmark there.
   - On a wide desktop screen the top ~10% may be cut off, so keep peaks below y ≈ 25.
   - Fill the whole width, so wide screens have no empty ends.
   - Give it 2–3 depth layers (far, middle, near), in soft tints of the palette that blend into the background like a painted backdrop. It must not look like a dark band.
3. **`objects`**: a full-screen layer with 4–8 small cultural objects (single small SVGs, about 28–64px) placed near the left and right edges and corners. On a phone the content column is full width, so they sit behind and around the cards.
4. **`corner`**: the existing corner motif. Keep it only if it works in front of your scene; otherwise set it to `''`.
5. **`ambient`**: gentle movement (petals, leaves, birds, drifting clouds or confetti bits).

Rules for the world:

- **Readability first.** Text sits directly on the background in some places: page titles, the mascot's speech bubble edges, small labels. Anything behind those must be soft and low-contrast. The test: every screen must be as easy to read as before.
- **Light and dark:** a day world in light mode and a night world in dark mode (moon, stars, lit windows or lanterns), both fitting the palette.
- **Movement:** slow and gentle (8s or longer per cycle), animating only `transform` and `opacity`, with at most about 15 moving elements in all. Under `@media (prefers-reduced-motion: reduce)`, nothing may move: stop all your animations in sky, objects and scene, not just ambient.
- **Calm mode.** During exercises and learn cards the app adds `class="calm"` to `<html>` (and `data-screen="practice"` or `"learn"`):
  - the shared CSS fades `sky` to 45%, `scene` to 40% and `corner` to 35%;
  - it hides `objects` and `ambient`;
  - it lowers the pattern.

  You may tune this inside your scope (e.g. `html[data-lang="ja"].calm ...`), but exercise screens must stay calm.
- **Size:** keep each spot under ~8 KB of markup, and use shared `<symbol>`/`<use>` or repeated small paths, not huge drawings.
- **Namespacing:** prefix every class with your language code (`.ja-sun`, `.fa-dome`) and scope every rule under `html[data-lang="<lang>"]`.
- **Shared circles:** you may drop the shared round color circles behind the page if they clash with your world: `html[data-lang="<lang>"] body { background-image: var(--theme-wash, none); }`.
- **Positioning:** never position anything relative to app elements. The world is independent of the layout.

## 4. Playing with the world (tap to react)

Learners can tap the **sky** pieces (sun, moon, clouds, stars) and the side **objects**. They react with a fun animation, and some hide a surprise. The user asked for exactly these two things, and **not** for words or collecting.

- **Marking pieces:** give each pokeable element (an element or SVG `<g>` inside `sky` or `objects`) `data-poke="<name>"`, e.g. `data-poke="moon"` or `data-poke="lantern"`. The landscape `scene` and the moving `ambient` bits are not pokeable.
- **How taps reach them:** the shared code makes `[data-poke]` elements clickable and forwards taps on empty parts of the page (not on buttons, cards or bubbles) to the object underneath. It also shows a pointer cursor over them. Nothing is pokeable in calm mode (exercises).
- **Reaction:** on every tap the app restarts the class `poked` on the element (removed again after 2.5 s) and sets `data-taps="<n>"` (taps in a row, each within 2 s of the previous).
  - Write the reaction as a CSS animation on `html[data-lang="<lang>"] .<lang>-thing.poked`, lasting 0.6–1.5 s, e.g. the lantern swings, the goldfish jumps, the sun winks, a cloud puffs, the moon wobbles.
  - Use `data-taps` for escalating reactions if you like.
  - Use transform-box/transform-origin so SVG parts move around their own center or top.
- **Surprises:** optionally add `onPoke: function (name, info) { ... }` to the theme object. `info = {el, taps, total, layer, dark, reduced}`, where `layer` is `#theme-layer`, `dark` is true in dark mode, and `reduced` means the user prefers reduced motion.
  - Use it for 2–4 hidden surprises per world, e.g. tap the moon 3 times in a row and shooting stars cross the sky, a cloud tapped 5 times rains sakura petals, or a cat appears in a window.
  - Make a surprise by appending temporary elements to `info.layer` (namespaced classes, `aria-hidden`, `pointer-events: none`) that animate and are **removed** after they finish (setTimeout). Never more than one copy of a surprise at a time.
  - It must never throw. The app catches errors, but don't rely on that.
  - It must not touch anything outside `#theme-layer`.
- **Reduced motion:** when `info.reduced` is true, or under `@media (prefers-reduced-motion: reduce)`, keep reactions to a gentle opacity or color change with no movement, and skip moving surprises.
- **Size:** pokeable things should be large enough to hit with a finger, at least ~36px, or give them an invisible larger hit area.

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
