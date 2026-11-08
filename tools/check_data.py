"""Validate js/data.js.

Run:  python tools/check_data.py

Checks that every item has the right fields, that Arabic-only letters (ي ك)
weren't used instead of the Persian ones (ی ک), that IDs are unique, and that
multi-word phrases have the same number of words in Farsi and in Latin letters
(the "put the words in order" exercise depends on this).
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
text = (ROOT / "js" / "data.js").read_text(encoding="utf-8")
start = text.index("{", text.index("window.TLAP_DATA"))
end = text.rindex("}")
data = json.loads(text[start : end + 1])

errors = []
LEVELS = {"beginner", "intermediate", "advanced"}
KINDS = {"alphabet", "vocab", "phrases", "grammar"}
ARABIC_ONLY = re.compile("[يك]")  # ي ك
PUNCT = re.compile(r"[.,!?؟،:;]")

def tokens(s):
    return [t for t in (PUNCT.sub("", w) for w in s.split()) if t]

ids = set()
for topic in data["topics"]:
    tid = topic["id"]
    if tid in ids:
        errors.append(f"duplicate topic id {tid}")
    ids.add(tid)
    if topic["level"] not in LEVELS:
        errors.append(f"{tid}: bad level")
    if topic["kind"] not in KINDS:
        errors.append(f"{tid}: bad kind")
    for key in ("en", "he"):
        if not topic["title"].get(key):
            errors.append(f"{tid}: missing title.{key}")
        if "intro" in topic and not topic["intro"].get(key):
            errors.append(f"{tid}: missing intro.{key}")
    if len(topic["items"]) < 4:
        errors.append(f"{tid}: needs at least 4 items")
    for i, item in enumerate(topic["items"]):
        where = f"{tid}[{i}]"
        if topic["kind"] == "alphabet":
            if len(item) != 8 or not isinstance(item[3], bool):
                errors.append(f"{where}: alphabet item must have 8 fields")
                continue
            farsi = [item[0], item[4]]
        else:
            if len(item) not in (4, 5) or not all(isinstance(x, str) and x for x in item[:4]):
                errors.append(f"{where}: word item must be [fa, tr, en, he, extra?]")
                continue
            farsi = [item[0]]
            if len(item) == 5:
                extra = item[4]
                if not (set(extra) <= {"digit", "form", "lit"}) or len(extra) != 1:
                    errors.append(f"{where}: bad extra {extra}")
                if "form" in extra:
                    farsi.append(extra["form"][0])
            fa_t, tr_t = tokens(item[0]), tokens(item[1])
            if len(fa_t) >= 3 and len(fa_t) != len(tr_t):
                errors.append(f"{where}: {len(fa_t)} Farsi words vs {len(tr_t)} Latin words: {item[0]} / {item[1]}")
        for s in farsi:
            if ARABIC_ONLY.search(s):
                errors.append(f"{where}: uses Arabic ي/ك instead of Persian ی/ک: {s}")

count = sum(len(t["items"]) for t in data["topics"])
if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"OK: {len(data['topics'])} topics, {count} items")
