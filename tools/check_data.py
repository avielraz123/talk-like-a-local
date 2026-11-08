"""Validate the lesson content in js/data/<lang>/*.js. See docs/content-format.md.

Run:  python tools/check_data.py                         (everything)
      python tools/check_data.py --lang ja               (one language)
      python tools/check_data.py js/data/es/food.js ...  (only these files; global checks still use the whole language)

Errors (exit code 1): bad structure, wrong script for the language, duplicate ids, lessons with
fewer than 6 items, two items in one lesson with the same English or Hebrew meaning, word-count
mismatches for the word-order exercise, missing/invalid Japanese "kana"/"parts", and for dialogues/stories (g-stories, stories.js): st_ ids, level,
intro, cast, 6-12 / 6-10 lines, 3-5 "me" turns with exactly 2 wrong replies, 3-4 questions with 3 options.
Warnings: the same target word appearing in more than one lesson of a language; stories not in level order.
"""
import json
import pathlib
import re
import sys
import unicodedata

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "js" / "data"
LEVELS = {"beginner", "intermediate", "advanced"}
KINDS = {"alphabet", "vocab", "phrases", "grammar", "dialogue", "story"}
# Dialogues and stories: their own group, file stories.js (see docs/content-format.md).
STORY_GROUP = "g-stories"
STORY_KINDS = {"dialogue", "story"}
LEVEL_ORDER = {"beginner": 0, "intermediate": 1, "advanced": 2}
PUNCT = re.compile(r"[.,!?؟،:;¿¡。、！？「」…]")
ARABIC_BLOCK = re.compile("[؀-ۿ]")
JAPANESE = re.compile("[぀-ヿ一-鿿々]")
KANJI = re.compile("[一-鿿々]")
KANA_ONLY = re.compile("^[぀-ヿー・]+$")
HEBREW_NIQQUD = re.compile("[֑-ׇֽֿׁׂׅׄ]")  # vowel/cantillation marks, not maqaf ־

LANGS = {
    "fa": {"extra": {"digit", "form", "lit"}, "tokens": True},
    "ar": {"extra": {"digit", "form", "lit"}, "tokens": True},
    "es": {"extra": {"form", "lit"}, "tokens": True},
    "ja": {"extra": {"digit", "form", "lit", "kana", "parts"}, "tokens": False},
}


def tokens(s):
    return [t for t in (PUNCT.sub("", w) for w in s.split()) if t]


def load(path):
    text = path.read_text(encoding="utf-8")
    calls = text.count("TLAP_ADD(")
    if calls != 1:
        raise ValueError(f"must contain exactly one TLAP_ADD( call, found {calls}")
    m = re.search(r'TLAP_ADD\(\s*"([a-z]{2})"\s*,', text)
    if not m:
        raise ValueError('call must start with TLAP_ADD("<lang>", {')
    start = text.index("{", m.end())
    end = text.rindex("}")
    return m.group(1), json.loads(text[start : end + 1])


def check_script(lang, s, where, errors, field="target"):
    """The target text must be written in the right script for its language."""
    if lang == "fa":
        if not ARABIC_BLOCK.search(s):
            errors.append(f"{where}: {field} has no Persian letters: {s}")
        if re.search("[يك]", s):
            errors.append(f"{where}: Farsi uses ی ک, not Arabic ي ك: {s}")
    elif lang == "ar":
        if not ARABIC_BLOCK.search(s):
            errors.append(f"{where}: {field} has no Arabic letters: {s}")
        if re.search("[یک]", s):
            errors.append(f"{where}: Arabic uses ي ك, not Persian ی ک: {s}")
    elif lang == "ja":
        if not JAPANESE.search(s):
            errors.append(f"{where}: {field} has no Japanese characters: {s}")
    elif lang == "es":
        if ARABIC_BLOCK.search(s) or JAPANESE.search(s) or not re.search("[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]", s):
            errors.append(f"{where}: {field} should be Spanish in Latin letters: {s}")


def check_word(lang, item, iw, errors, order_rules=True):
    """One [target, latin, en, he, extra?] item. Returns (en, he), or None when it is malformed.
    order_rules=False skips the word-order rules (word counts, ja "parts"), as for dialogue/story lines."""
    rules = LANGS[lang]
    if not isinstance(item, list) or len(item) not in (4, 5) or not all(isinstance(x, str) and x.strip() for x in item[:4]):
        errors.append(f"{iw}: word item must be [target, latin, en, he, extra?]")
        return None
    target, latin, en, he = item[:4]
    check_script(lang, target, iw, errors)
    if ARABIC_BLOCK.search(latin) or JAPANESE.search(latin):
        errors.append(f"{iw}: latin field contains non-Latin script: {latin}")
    if HEBREW_NIQQUD.search(he):
        errors.append(f"{iw}: Hebrew contains niqqud: {he}")
    extra = item[4] if len(item) == 5 else {}
    if not isinstance(extra, dict) or (len(item) == 5 and not extra):
        errors.append(f"{iw}: extra must be a non-empty object")
        extra = {}
    bad = set(extra) - rules["extra"]
    if bad:
        errors.append(f"{iw}: extra keys not allowed for {lang}: {sorted(bad)}")
    if "form" in extra:
        f = extra["form"]
        if not (isinstance(f, list) and len(f) == 2 and all(isinstance(x, str) and x for x in f)):
            errors.append(f"{iw}: form must be [target, latin]")
        else:
            check_script(lang, f[0], iw, errors, "form")
    if "lit" in extra:
        f = extra["lit"]
        if not (isinstance(f, list) and len(f) == 2 and all(isinstance(x, str) and x for x in f)):
            errors.append(f"{iw}: lit must be [english, hebrew]")
    if "digit" in extra and not isinstance(extra["digit"], str):
        errors.append(f"{iw}: digit must be a string")
    if lang == "ja":
        if KANJI.search(target) and not extra.get("kana"):
            errors.append(f"{iw}: target has kanji but no \"kana\" reading: {target}")
        if "kana" in extra and not KANA_ONLY.match(extra["kana"] or ""):
            errors.append(f"{iw}: kana must be only hiragana/katakana, no spaces: {extra['kana']}")
        rt = tokens(latin)
        if order_rules and len(rt) >= 3:
            parts = extra.get("parts")
            if not parts:
                errors.append(f"{iw}: phrase with {len(rt)} rōmaji words needs \"parts\"")
            elif len(parts) != len(rt):
                errors.append(f"{iw}: {len(parts)} parts vs {len(rt)} rōmaji words: {parts} / {latin}")
            elif "".join(parts) != PUNCT.sub("", target).replace(" ", ""):
                errors.append(f"{iw}: parts don't join to the target: {''.join(parts)} vs {target}")
        if latin != latin.lower():
            errors.append(f"{iw}: rōmaji must be lowercase: {latin}")
    if order_rules and rules["tokens"]:
        tt, lt = tokens(target), tokens(latin)
        if len(tt) >= 3 and len(tt) != len(lt):
            errors.append(f"{iw}: {len(tt)} target words vs {len(lt)} latin words: {target} / {latin}")
    if lang == "es" and "-" not in latin and not re.search("[A-ZÁÉÍÓÚÑ]", latin):
        errors.append(f"{iw}: Spanish syllable guide needs hyphens/CAPITAL stress: {latin}")
    return en, he


def is_emoji(s):
    """An emoji icon: no letters (so not a word or a letter of the target script)."""
    return isinstance(s, str) and bool(s.strip()) and not any(unicodedata.category(c).startswith("L") for c in s)


def check_bi(obj, w, what, errors):
    """A {"en": ..., "he": ...} text: both present, Hebrew without niqqud."""
    if not isinstance(obj, dict) or not all(isinstance(obj.get(lg), str) and obj.get(lg).strip() for lg in ("en", "he")):
        errors.append(f"{w}: {what} needs en and he")
        return
    if HEBREW_NIQQUD.search(obj["he"]):
        errors.append(f"{w}: Hebrew {what} contains niqqud")


def check_story(lang, g, lesson, lw, errors, warnings):
    """A dialogue or story lesson in g-stories: cast, lines, wrong replies, questions, items."""
    kind = lesson.get("kind")
    if g.get("id") != STORY_GROUP:
        errors.append(f"{lw}: dialogue/story lessons belong in the {STORY_GROUP} group (stories.js)")
    if kind not in STORY_KINDS:
        errors.append(f"{lw}: lessons in {STORY_GROUP} must be kind dialogue or story")
        return
    if not str(lesson.get("id", "")).startswith("st_"):
        errors.append(f"{lw}: story lesson ids start with st_")
    if lesson.get("level") not in LEVELS:
        errors.append(f"{lw}: every dialogue/story sets its own level")
    if "intro" not in lesson:
        errors.append(f"{lw}: intro (the scene) is required")
    if len(lesson.get("items", [])) > 12:
        errors.append(f"{lw}: 6-12 key words (has {len(lesson.get('items', []))})")
    lines = lesson.get("lines")
    if not isinstance(lines, list):
        errors.append(f"{lw}: lines must be a list")
        lines = []
    lo, hi = (6, 12) if kind == "dialogue" else (6, 10)
    if not lo <= len(lines) <= hi:
        errors.append(f"{lw}: a {kind} has {lo}-{hi} lines (has {len(lines)})")
    cast = lesson.get("cast")
    if kind == "dialogue":
        if not isinstance(cast, dict) or "a" not in cast or "me" not in cast:
            errors.append(f"{lw}: cast needs a and me")
            cast = cast if isinstance(cast, dict) else {}
        for k, c in cast.items():
            if k not in ("a", "b", "me"):
                errors.append(f"{lw}: unknown cast member {k} (a, b, me)")
                continue
            check_bi(c, lw, f"cast.{k}", errors)
            if k != "me" and not is_emoji(c.get("icon") if isinstance(c, dict) else None):
                errors.append(f"{lw}: cast.{k} needs an emoji icon")
            if k == "me" and isinstance(c, dict) and "icon" in c and not is_emoji(c["icon"]):
                errors.append(f"{lw}: cast.me icon must be an emoji")
    elif cast is not None:
        errors.append(f"{lw}: a story has no cast")
    me_turns = 0
    for i, line in enumerate(lines):
        w = f"{lw}.lines[{i}]"
        if not isinstance(line, dict):
            errors.append(f"{w}: a line is an object with say")
            continue
        got = check_word(lang, line.get("say"), w, errors, order_rules=False)
        if kind == "story":
            if set(line) - {"say"}:
                errors.append(f"{w}: story lines only have say (found {sorted(set(line) - {'say'})})")
            continue
        who = line.get("who")
        if who not in ("a", "b", "me") or (isinstance(cast, dict) and who not in cast):
            errors.append(f"{w}: who must be one of the cast ({who})")
        if who == "me":
            me_turns += 1
            wrong = line.get("wrong")
            if not isinstance(wrong, list) or len(wrong) != 2:
                errors.append(f"{w}: a me line needs exactly 2 wrong replies")
                wrong = wrong if isinstance(wrong, list) else []
            for j, x in enumerate(wrong):
                if check_word(lang, x, f"{w}.wrong[{j}]", errors, order_rules=False) and got and isinstance(line.get("say"), list):
                    if PUNCT.sub("", x[0]).strip() == PUNCT.sub("", line["say"][0]).strip():
                        errors.append(f"{w}.wrong[{j}]: same as the right reply")
        elif "wrong" in line:
            errors.append(f"{w}: only me lines have wrong replies")
    if kind == "dialogue" and not 3 <= me_turns <= 5:
        errors.append(f"{lw}: a dialogue has 3-5 me turns (has {me_turns})")
    qs = lesson.get("questions")
    if kind == "story":
        if not isinstance(qs, list) or not 3 <= len(qs) <= 4:
            errors.append(f"{lw}: a story has 3-4 questions (has {len(qs) if isinstance(qs, list) else 0})")
            qs = qs if isinstance(qs, list) else []
        for i, q in enumerate(qs):
            w = f"{lw}.questions[{i}]"
            if not isinstance(q, dict):
                errors.append(f"{w}: a question is an object with q, options, answer")
                continue
            check_bi(q.get("q"), w, "q", errors)
            opts = q.get("options")
            if not isinstance(opts, list) or len(opts) != 3:
                errors.append(f"{w}: exactly 3 options")
                opts = opts if isinstance(opts, list) else []
            for j, o in enumerate(opts):
                check_bi(o, w, f"options[{j}]", errors)
            ans = q.get("answer")
            if not isinstance(ans, int) or isinstance(ans, bool) or not 0 <= ans < max(len(opts), 1):
                errors.append(f"{w}: answer must be the index of an option (0-{max(len(opts) - 1, 0)})")
    elif qs is not None:
        errors.append(f"{lw}: a dialogue has no questions")


def check_pack(lang, pack, where, errors, warnings=None):
    warnings = [] if warnings is None else warnings
    rules = LANGS[lang]
    g = pack.get("group", {})
    for key in ("id", "level", "icon", "title"):
        if key not in g:
            errors.append(f"{where}: group missing {key}")
    if not str(g.get("id", "")).startswith("g-"):
        errors.append(f"{where}: group id must start with 'g-'")
    if g.get("level") not in LEVELS:
        errors.append(f"{where}: bad group level {g.get('level')}")
    for lg in ("en", "he"):
        if not g.get("title", {}).get(lg):
            errors.append(f"{where}: group missing title.{lg}")
    if not pack.get("lessons"):
        errors.append(f"{where}: no lessons")
    for lesson in pack.get("lessons", []):
        lid = lesson.get("id", "?")
        lw = f"{where}:{lid}"
        if not re.fullmatch(r"[a-z0-9_]+", str(lid)):
            errors.append(f"{lw}: lesson id must be lowercase letters/digits/_")
        if lesson.get("kind") not in KINDS:
            errors.append(f"{lw}: bad kind")
        if "level" in lesson and lesson["level"] not in LEVELS:
            errors.append(f"{lw}: bad level")
        if not lesson.get("icon"):
            errors.append(f"{lw}: missing icon")
        for lg in ("en", "he"):
            if not lesson.get("title", {}).get(lg):
                errors.append(f"{lw}: missing title.{lg}")
            if "intro" in lesson and not lesson["intro"].get(lg):
                errors.append(f"{lw}: missing intro.{lg}")
        for txt in (lesson.get("title", {}).get("he", ""), lesson.get("intro", {}).get("he", "")):
            if HEBREW_NIQQUD.search(txt):
                errors.append(f"{lw}: Hebrew title/intro contains niqqud")
        items = lesson.get("items", [])
        if len(items) < 6:
            errors.append(f"{lw}: needs at least 6 items (has {len(items)})")
        seen_en, seen_he = {}, {}
        for i, item in enumerate(items):
            iw = f"{lw}[{i}]"
            if lesson.get("kind") == "alphabet":
                if len(item) != 8 or not isinstance(item[3], bool) or not all(isinstance(x, str) and x for x in item[:3] + item[4:]):
                    errors.append(f"{iw}: alphabet item must be [char, name, sound, joins(bool), exTarget, exLatin, exEn, exHe]")
                    continue
                check_script(lang, item[0], iw, errors, "character")
                check_script(lang, item[4], iw, errors, "example")
                continue
            got = check_word(lang, item, iw, errors)
            if got is None:
                continue
            en, he = got
            for seen, val, lg in ((seen_en, en, "English"), (seen_he, he, "Hebrew")):
                k = unicodedata.normalize("NFC", val.strip().lower())
                if k in seen:
                    errors.append(f"{iw}: same {lg} meaning as item {seen[k]} in this lesson: {val}")
                seen[k] = i
        if g.get("id") == STORY_GROUP or lesson.get("kind") in STORY_KINDS:
            check_story(lang, g, lesson, lw, errors, warnings)
    if g.get("id") == STORY_GROUP:
        order = [LEVEL_ORDER.get(lesson.get("level"), 0) for lesson in pack.get("lessons", [])]
        if order != sorted(order):
            warnings.append(f"{where}: list the stories in level order (beginner, intermediate, advanced)")


def main():
    args = sys.argv[1:]
    only_lang = None
    if "--lang" in args:
        i = args.index("--lang")
        only_lang = args[i + 1]
        args = args[:i] + args[i + 2 :]
    errors, warnings = [], []
    packs = {}  # path -> (lang, pack)
    for path in sorted(DATA_DIR.glob("*/*.js")):
        folder = path.parent.name
        try:
            lang, pack = load(path)
        except Exception as e:  # noqa: BLE001
            errors.append(f"{folder}/{path.name}: cannot parse: {e}")
            continue
        if lang != folder:
            errors.append(f"{folder}/{path.name}: TLAP_ADD language \"{lang}\" doesn't match folder")
        if lang not in LANGS:
            errors.append(f"{folder}/{path.name}: unknown language {lang}")
            continue
        packs[path.resolve()] = (lang, pack)
    for stray in DATA_DIR.glob("*.js"):
        errors.append(f"{stray.name}: data files must be inside js/data/<lang>/")

    if args:
        chosen = [pathlib.Path(a).resolve() for a in args]
        for c in chosen:
            if c not in packs and not c.exists():
                errors.append(f"{c}: file not found")
    else:
        chosen = [p for p, (lg, _) in packs.items() if not only_lang or lg == only_lang]
    chosen_langs = {packs[p][0] for p in chosen if p in packs}
    for p in chosen:
        if p in packs:
            lang, pack = packs[p]
            check_pack(lang, pack, f"{lang}/{p.name}", errors, warnings)

    summary = []
    for lang in sorted(chosen_langs):
        group_ids, lesson_ids, where = {}, {}, {}
        words = letters = 0
        for p, (lg, pack) in packs.items():
            if lg != lang:
                continue
            gid = pack.get("group", {}).get("id")
            if gid in group_ids:
                errors.append(f"{lang}: duplicate group id {gid} in {p.name} and {group_ids[gid]}")
            group_ids[gid] = p.name
            for lesson in pack.get("lessons", []):
                lid = lesson.get("id")
                if lid in lesson_ids:
                    errors.append(f"{lang}: duplicate lesson id {lid} in {p.name} and {lesson_ids[lid]}")
                lesson_ids[lid] = p.name
                n = len(lesson.get("items", []))
                if lesson.get("kind") == "alphabet":
                    letters += n
                else:
                    words += n
                if lesson.get("kind") in ("vocab", "phrases"):
                    for item in lesson.get("items", []):
                        if isinstance(item, list) and item and isinstance(item[0], str):
                            where.setdefault(item[0], []).append(lid)
        for w, ls in where.items():
            if len(ls) > 1:
                warnings.append(f"{lang}: '{w}' appears in several lessons: {', '.join(ls)}")
        summary.append(f"{lang}: {len(group_ids)} groups, {len(lesson_ids)} lessons, {words} words/phrases, {letters} letters/characters")

    out = sys.stdout
    if warnings:
        print(f"{len(warnings)} warning(s):", file=out)
        print("\n".join("  " + w for w in warnings), file=out)
    if errors:
        print(f"{len(errors)} error(s):", file=out)
        print("\n".join("  " + e for e in errors), file=out)
        sys.exit(1)
    print("OK: " + " | ".join(summary), file=out)


if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:  # noqa: BLE001
        pass
    main()
