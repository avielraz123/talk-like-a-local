"""Validate the lesson content in js/data/*.js.

Run:  python tools/check_data.py              (all files)
      python tools/check_data.py js/data/food.js   (only some files; global checks still use all files)

Each data file must contain exactly one call:  TLAP_ADD({...JSON...});
  group:   {"id": "g-...", "level": beginner|intermediate|advanced, "icon": "...", "title": {"en","he"}}
  lessons: [{"id", "kind": vocab|phrases|grammar|alphabet, "icon", "title": {"en","he"},
             "intro"?: {"en","he"}, "level"?: ..., "items": [...]}]

Word/phrase items:  [farsi, latin, english, hebrew, extra?]
  extra: {"digit": "۱"} | {"form": [farsi, latin]} | {"lit": [english, hebrew]}
Alphabet items:     [letter, name, sound, joinsToNext, exampleFarsi, exampleLatin, exampleEnglish, exampleHebrew]

Errors (exit code 1): bad structure, Arabic-only letters ي ك instead of Persian ی ک, duplicate ids,
lessons with fewer than 6 items, two items in one lesson with the same English or Hebrew meaning,
multi-word phrases whose Farsi and Latin word counts differ.
Warnings: the same Farsi word appearing in more than one lesson.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "js" / "data"
LEVELS = {"beginner", "intermediate", "advanced"}
KINDS = {"alphabet", "vocab", "phrases", "grammar"}
ARABIC_ONLY = re.compile("[يك]")  # ي ك
FARSI_CHARS = re.compile("[؀-ۿ]")
PUNCT = re.compile(r"[.,!?؟،:;]")


def tokens(s):
    return [t for t in (PUNCT.sub("", w) for w in s.split()) if t]


def load(path):
    text = path.read_text(encoding="utf-8")
    calls = text.count("TLAP_ADD(")
    if calls != 1:
        raise ValueError(f"must contain exactly one TLAP_ADD( call, found {calls}")
    start = text.index("{", text.index("TLAP_ADD("))
    end = text.rindex("}")
    return json.loads(text[start : end + 1])


def check_pack(pack, where, errors):
    g = pack.get("group", {})
    for key in ("id", "level", "icon", "title"):
        if key not in g:
            errors.append(f"{where}: group missing {key}")
    if not str(g.get("id", "")).startswith("g-"):
        errors.append(f"{where}: group id must start with 'g-'")
    if g.get("level") not in LEVELS:
        errors.append(f"{where}: bad group level {g.get('level')}")
    for lang in ("en", "he"):
        if not g.get("title", {}).get(lang):
            errors.append(f"{where}: group missing title.{lang}")
    if not pack.get("lessons"):
        errors.append(f"{where}: no lessons")
    for lesson in pack.get("lessons", []):
        lid = lesson.get("id", "?")
        lw = f"{where}:{lid}"
        if lesson.get("kind") not in KINDS:
            errors.append(f"{lw}: bad kind")
        if "level" in lesson and lesson["level"] not in LEVELS:
            errors.append(f"{lw}: bad level")
        if not lesson.get("icon"):
            errors.append(f"{lw}: missing icon")
        for lang in ("en", "he"):
            if not lesson.get("title", {}).get(lang):
                errors.append(f"{lw}: missing title.{lang}")
            if "intro" in lesson and not lesson["intro"].get(lang):
                errors.append(f"{lw}: missing intro.{lang}")
        items = lesson.get("items", [])
        if len(items) < 6:
            errors.append(f"{lw}: needs at least 6 items (has {len(items)})")
        seen_en, seen_he = {}, {}
        for i, item in enumerate(items):
            iw = f"{lw}[{i}]"
            if lesson.get("kind") == "alphabet":
                if len(item) != 8 or not isinstance(item[3], bool):
                    errors.append(f"{iw}: alphabet item must have 8 fields")
                    continue
                farsi = [item[0], item[4]]
            else:
                if len(item) not in (4, 5) or not all(isinstance(x, str) and x.strip() for x in item[:4]):
                    errors.append(f"{iw}: word item must be [fa, tr, en, he, extra?]")
                    continue
                fa, tr, en, he = item[:4]
                farsi = [fa]
                if not FARSI_CHARS.search(fa):
                    errors.append(f"{iw}: Farsi field has no Farsi letters: {fa}")
                if FARSI_CHARS.search(tr):
                    errors.append(f"{iw}: Latin field contains Farsi letters: {tr}")
                if len(item) == 5:
                    extra = item[4]
                    if not isinstance(extra, dict) or len(extra) != 1 or not set(extra) <= {"digit", "form", "lit"}:
                        errors.append(f"{iw}: bad extra {extra}")
                    elif "form" in extra:
                        farsi.append(extra["form"][0])
                fa_t, tr_t = tokens(fa), tokens(tr)
                if len(fa_t) >= 3 and len(fa_t) != len(tr_t):
                    errors.append(f"{iw}: {len(fa_t)} Farsi words vs {len(tr_t)} Latin words: {fa} / {tr}")
                for seen, val, lang in ((seen_en, en, "English"), (seen_he, he, "Hebrew")):
                    k = val.strip().lower()
                    if k in seen:
                        errors.append(f"{iw}: same {lang} meaning as item {seen[k]} in this lesson: {val}")
                    seen[k] = i
            for s in farsi:
                if ARABIC_ONLY.search(s):
                    errors.append(f"{iw}: uses Arabic ي/ك instead of Persian ی/ک: {s}")


def main():
    all_files = sorted(DATA_DIR.glob("*.js"))
    chosen = [pathlib.Path(a).resolve() for a in sys.argv[1:]] or all_files
    errors, warnings = [], []
    packs = {}
    for path in all_files:
        try:
            packs[path.resolve()] = load(path)
        except Exception as e:  # noqa: BLE001
            errors.append(f"{path.name}: cannot parse: {e}")
    for path in chosen:
        if path in packs:
            check_pack(packs[path], path.name, errors)
        elif path.exists():
            pass  # parse error already reported
        else:
            errors.append(f"{path}: file not found")

    # Global checks across every file.
    group_ids, lesson_ids, farsi_where = {}, {}, {}
    for path, pack in packs.items():
        gid = pack.get("group", {}).get("id")
        if gid in group_ids:
            errors.append(f"duplicate group id {gid} in {path.name} and {group_ids[gid]}")
        group_ids[gid] = path.name
        for lesson in pack.get("lessons", []):
            lid = lesson.get("id")
            if lid in lesson_ids:
                errors.append(f"duplicate lesson id {lid} in {path.name} and {lesson_ids[lid]}")
            lesson_ids[lid] = path.name
            if lesson.get("kind") in ("vocab", "phrases"):
                for item in lesson.get("items", []):
                    if isinstance(item, list) and item and isinstance(item[0], str):
                        farsi_where.setdefault(item[0], []).append(lid)
    for fa, where in farsi_where.items():
        if len(where) > 1:
            warnings.append(f"'{fa}' appears in several lessons: {', '.join(where)}")

    words = sum(len(l.get("items", [])) for p in packs.values() for l in p.get("lessons", []) if l.get("kind") != "alphabet")
    letters = sum(len(l.get("items", [])) for p in packs.values() for l in p.get("lessons", []) if l.get("kind") == "alphabet")
    if warnings:
        print(f"{len(warnings)} warning(s):")
        print("\n".join("  " + w for w in warnings))
    if errors:
        print(f"{len(errors)} error(s):")
        print("\n".join("  " + e for e in errors))
        sys.exit(1)
    print(f"OK: {len(packs)} groups, {len(lesson_ids)} lessons, {words} words/phrases, {letters} letters")


if __name__ == "__main__":
    main()
