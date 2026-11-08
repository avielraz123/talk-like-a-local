"""Validate the lesson content in js/data/<lang>/*.js. See docs/content-format.md.

Run:  python tools/check_data.py                         (everything)
      python tools/check_data.py --lang ja               (one language)
      python tools/check_data.py js/data/es/food.js ...  (only these files; global checks still use the whole language)

Errors (exit code 1): bad structure, wrong script for the language, duplicate ids, lessons with
fewer than 6 items, two items in one lesson with the same English or Hebrew meaning, word-count
mismatches for the word-order exercise, missing/invalid Japanese "kana"/"parts".
Warnings: the same target word appearing in more than one lesson of a language.
"""
import json
import pathlib
import re
import sys
import unicodedata

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "js" / "data"
LEVELS = {"beginner", "intermediate", "advanced"}
KINDS = {"alphabet", "vocab", "phrases", "grammar"}
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


def check_pack(lang, pack, where, errors):
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
            if len(item) not in (4, 5) or not all(isinstance(x, str) and x.strip() for x in item[:4]):
                errors.append(f"{iw}: word item must be [target, latin, en, he, extra?]")
                continue
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
                if len(rt) >= 3:
                    parts = extra.get("parts")
                    if not parts:
                        errors.append(f"{iw}: phrase with {len(rt)} rōmaji words needs \"parts\"")
                    elif len(parts) != len(rt):
                        errors.append(f"{iw}: {len(parts)} parts vs {len(rt)} rōmaji words: {parts} / {latin}")
                    elif "".join(parts) != PUNCT.sub("", target).replace(" ", ""):
                        errors.append(f"{iw}: parts don't join to the target: {''.join(parts)} vs {target}")
                if latin != latin.lower():
                    errors.append(f"{iw}: rōmaji must be lowercase: {latin}")
            if rules["tokens"]:
                tt, lt = tokens(target), tokens(latin)
                if len(tt) >= 3 and len(tt) != len(lt):
                    errors.append(f"{iw}: {len(tt)} target words vs {len(lt)} latin words: {target} / {latin}")
            if lang == "es" and "-" not in latin and not re.search("[A-ZÁÉÍÓÚÑ]", latin):
                errors.append(f"{iw}: Spanish syllable guide needs hyphens/CAPITAL stress: {latin}")
            for seen, val, lg in ((seen_en, en, "English"), (seen_he, he, "Hebrew")):
                k = unicodedata.normalize("NFC", val.strip().lower())
                if k in seen:
                    errors.append(f"{iw}: same {lg} meaning as item {seen[k]} in this lesson: {val}")
                seen[k] = i


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
            check_pack(lang, pack, f"{lang}/{p.name}", errors)

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
