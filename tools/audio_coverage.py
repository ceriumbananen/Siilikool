#!/usr/bin/env python3
"""Täckningskoll: hittar estniska ord/fraser som faktiskt läses upp av Siiri men saknar
förinspelat Mari-ljud (Neurokõne) - de orden faller tyst tillbaka på webbläsarens egen,
mycket sämre systemröst (se speak()/pickEstonian() i public/legacy/app.js och sayWord()/
findWordClip() i app/composables/useSiiriVoice.ts + app/utils/word-audio.ts, som läser
exakt samma ljudkartor).

Till skillnad från självtestet i adminläget (runSelfTest() i app.js, bara SENTENCES/
THEMES/TRIP/SHOP) täcker den här även samtalen (chats.ts) och beröm/pikar (praise.ts) -
text som faktiskt sägs högt men aldrig kollats förut.

Rör inga filer. Skriver en sammanfattning till terminalen och en fullständig lista per
kategori till tools/audio_coverage_report.txt, plus en färdig generate_audio.py-rad för
varje kategori med saknat ljud.

Kör från repots rot:  python3 tools/audio_coverage.py
"""
import glob
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_audio import CORE, PUBLIC, banks_in  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
UTILS = os.path.join(ROOT, "app", "utils")
APP_JS = os.path.join(ROOT, "public", "legacy", "app.js")
REPORT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio_coverage_report.txt")

ET_RE = re.compile(r'\bet:\s*"((?:[^"\\]|\\.)*)"')
ARRSTR_RE = re.compile(r'"((?:[^"\\]|\\.)*)"')


def unescape(s):
    return s.replace('\\"', '"').replace("\\\\", "\\")


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def block(text, name):
    """Texten för 'export const NAME = ...' till nästa 'export const' (eller filslutet)."""
    start = text.index("export const %s" % name)
    rest = text[start + len("export const %s" % name):]
    m = re.search(r"\nexport const ", rest)
    return rest[: m.start()] if m else rest


def et_fields(text):
    return [unescape(m.group(1)) for m in ET_RE.finditer(text)]


def word_tiles(sentences_block):
    """SENTENCES w: ["Mul", "on", ...] - orden som visas som lösa brickor i meningsleken."""
    out = []
    for m in re.finditer(r"w:\s*\[([^\]]*)\]", sentences_block):
        out.extend(unescape(s.group(1)) for s in ARRSTR_RE.finditer(m.group(1)))
    return out


def load_have():
    """Alla et-strängar som redan har ljud: data.js + varje ljuddel i public/audio/*.js."""
    have = {"normal": set(), "slow": set()}
    files = [os.path.join(PUBLIC, CORE)] + sorted(glob.glob(os.path.join(PUBLIC, "audio", "*.js")))
    for path in files:
        rel = os.path.relpath(path, PUBLIC)
        banks = banks_in(rel, read(path))
        have["normal"].update(banks.get("normal", {}).keys())
        have["slow"].update(banks.get("slow", {}).keys())
    return have


def js_block(text, var_name):
    """Texten för 'var NAME = [' till matchande ']' - för datalistor i app.js självt
    (inte app/utils/*.ts), t.ex. MODES. Enkel parentesräkning, inte en riktig JS-parser,
    men datalistorna här är aldrig så komplexa att det behövs mer."""
    start = text.index("var %s = [" % var_name) + len("var %s = [" % var_name) - 1
    depth = 0
    for i in range(start, len(text)):
        if text[i] == "[":
            depth += 1
        elif text[i] == "]":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    raise ValueError("okänt slut på %s i app.js" % var_name)


def categories():
    themes = read(os.path.join(UTILS, "themes.ts"))
    sentences_full = read(os.path.join(UTILS, "sentences.ts"))
    sentences = block(sentences_full, "SENTENCES")
    chats = read(os.path.join(UTILS, "chats.ts"))
    trip = block(read(os.path.join(UTILS, "trip.ts")), "TRIP")
    shop = block(read(os.path.join(UTILS, "shop.ts")), "SHOP")
    praise = read(os.path.join(UTILS, "praise.ts"))
    praise_taunt = block(praise, "PRAISE") + block(praise, "TAUNT")
    modes = js_block(read(APP_JS), "MODES")
    return [
        ("teman (THEMES)", "theme", sorted(set(et_fields(themes)))),
        ("meningar (SENTENCES, hela fraser)", "sent", sorted(set(et_fields(sentences)))),
        ("ordbrickor i meningsleken (SENTENCES w[])", "sent", sorted(set(word_tiles(sentences)))),
        ("samtalen (CHATS)", "chat", sorted(set(et_fields(chats)))),
        ("orter (TRIP)", "trip", sorted(set(et_fields(trip)))),
        ("marknaden (SHOP)", "shop", sorted(set(et_fields(shop)))),
        ("beröm & pikar (PRAISE/TAUNT)", "praise", sorted(set(et_fields(praise_taunt)))),
        ("spellägenas namn (MODES, app.js)", "chat", sorted(set(et_fields(modes)))),
    ]


def main():
    have = load_have()
    report_lines = []
    total_words = total_missing = 0
    print("Täckningskoll: estniskt tal mot förinspelat Mari-ljud\n" + "=" * 56)
    for title, part, words in categories():
        missing_normal = [w for w in words if w and w not in have["normal"]]
        missing_slow = [w for w in words if w and w not in have["slow"]]
        total_words += len(words)
        total_missing += len(missing_normal)
        pct = 100 * (len(words) - len(missing_normal)) / len(words) if words else 100
        print(
            "%-42s %4d ord · %3d utan ljud (%.0f%% täckt) · %3d utan långsamt"
            % (title, len(words), len(missing_normal), pct, len(missing_slow))
        )
        report_lines.append("## %s\n" % title)
        if missing_normal:
            report_lines.append("Utan ljud alls (%d):\n" % len(missing_normal))
            report_lines.extend("  - %s" % w for w in missing_normal)
            report_lines.append(
                '\nFixa:\n  python3 tools/generate_audio.py %s %s\n'
                % (part, " ".join('"%s"' % w.replace('"', '\\"') for w in missing_normal))
            )
        only_slow_missing = [w for w in missing_slow if w not in missing_normal]
        if only_slow_missing:
            report_lines.append("Har normal men inget långsamt (%d):\n" % len(only_slow_missing))
            report_lines.extend("  - %s" % w for w in only_slow_missing)
            report_lines.append("")
        if not missing_normal and not only_slow_missing:
            report_lines.append("(inget saknas)\n")
        report_lines.append("")
    print("-" * 56)
    print(
        "Totalt: %d uppläsbara strängar, %d helt utan förinspelat ljud (%.0f%% täckt överlag)"
        % (total_words, total_missing, 100 * (total_words - total_missing) / total_words if total_words else 100)
    )
    print("Full lista + färdiga generate_audio.py-kommandon: %s" % os.path.relpath(REPORT, ROOT))
    with open(REPORT, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))


if __name__ == "__main__":
    main()
