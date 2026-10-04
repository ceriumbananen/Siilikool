#!/usr/bin/env python3
"""Plockar ut inbäddade ljudklipp (data:audio/...;base64) till riktiga mp3-filer.

Läser window.AUDIO i index.html och alla audio/*.js (window.addAudio(...)),
sparar varje klipp som audio/clips/<bank>/<namn>.mp3 och byter ut base64-texten
mot sökvägen. Identiska klipp sparas bara en gång. Kan köras flera gånger:
värden som redan är sökvägar lämnas orörda.

Kör från repots rot:  python3 tools/extract_audio.py
"""
import base64
import glob
import hashlib
import json
import os
import re
import unicodedata

CLIPS = "audio/clips"
DATA_RE = re.compile(r'"(data:audio/[a-z0-9]+;base64,[A-Za-z0-9+/=]+)"')

TRANSLIT = str.maketrans({"õ": "o", "ä": "a", "ö": "o", "ü": "u", "å": "a",
                          "š": "s", "ž": "z", "Õ": "o", "Ä": "a", "Ö": "o",
                          "Ü": "u", "Å": "a", "Š": "s", "Ž": "z"})


def slug(text):
    t = text.translate(TRANSLIT)
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    t = re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")
    return t[:60].rstrip("-") or "klipp"


def banks_in(path, text):
    """Returnerar {bank: {nyckel: värde}} för en fil."""
    if path == "index.html":
        start = text.index("window.AUDIO = ") + len("window.AUDIO = ")
        obj, _ = json.JSONDecoder().raw_decode(text, start)
        return obj
    m = re.match(r'\s*window\.addAudio\(\s*"[^"]*"\s*,', text)
    if not m:
        raise SystemExit("Okänt format i " + path)
    obj, _ = json.JSONDecoder().raw_decode(text, m.end())
    return obj


def main():
    files = ["index.html"] + sorted(glob.glob("audio/*.js"))
    by_content = {}   # sha1 -> sökväg
    used_paths = set(p.replace(os.sep, "/") for p in glob.glob(CLIPS + "/*/*.mp3"))
    total_before = total_after = written = 0

    for path in files:
        text = open(path, encoding="utf-8").read()
        mapping = {}  # data-URI -> sökväg
        for bank, entries in banks_in(path, text).items():
            if not isinstance(entries, dict):
                continue
            for key, val in entries.items():
                if not isinstance(val, str) or not val.startswith("data:audio/") or val in mapping:
                    continue
                raw = base64.b64decode(val.split(",", 1)[1])
                h = hashlib.sha1(raw).hexdigest()
                if h not in by_content:
                    base = "%s/%s/%s" % (CLIPS, bank, slug(key))
                    out, n = base + ".mp3", 2
                    while out in used_paths:
                        out, n = "%s-%d.mp3" % (base, n), n + 1
                    os.makedirs(os.path.dirname(out), exist_ok=True)
                    with open(out, "wb") as f:
                        f.write(raw)
                    used_paths.add(out)
                    by_content[h] = out
                    written += 1
                mapping[val] = by_content[h]

        if not mapping:
            continue
        new = DATA_RE.sub(lambda m: '"%s"' % mapping.get(m.group(1), m.group(1)), text)
        left = len(DATA_RE.findall(new))
        if left:
            raise SystemExit("%s: %d klipp kunde inte kopplas till en bank" % (path, left))
        total_before += len(text.encode("utf-8"))
        total_after += len(new.encode("utf-8"))
        with open(path, "w", encoding="utf-8") as f:
            f.write(new)
        print("%-26s %4d klipp" % (path, len(mapping)))

    print("\n%d nya mp3-filer i %s/" % (written, CLIPS))
    print("Textfilerna: %.1f MB -> %.1f MB" % (total_before / 1e6, total_after / 1e6))


if __name__ == "__main__":
    main()
