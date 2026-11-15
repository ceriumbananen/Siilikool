#!/usr/bin/env python3
"""Genererar svenska ljudklipp med Microsoft Azure (rösten Sofie, sv-SE-SofieNeural) för
estniskt läge, där estniska barn lär sig svenska.

Samma format som Mari-klippen (tools/generate_audio.py): mp3, 16 kHz, mono, 40 kbit/s, ca
0,25 s tystnad före/efter, en vanlig och en långsam version. Klippen hamnar i
public/audio/clips/sv/normal/ och .../sv/slow/, ljuddelen i public/audio/sv/<del>.js
(formatet window.addAudio("sv/<del>", {normal, slow})) och vilken del varje text ligger i i
public/audio/sv/index.json. Texter som redan har ljud hoppas över, så det går att köra om.

Azure-nyckeln läses från .env (gitignorerad, hamnar aldrig i appen):
    AZURE_SPEECH_KEY=...
    AZURE_SPEECH_REGION=swedencentral   (regionen där Speech-resursen skapades)
Gratisnivån (F0) ger 500 000 tecken per månad - hela appens innehåll är en bråkdel av det.
Skriptet räknar tecknen före och stannar om en körning skulle gå över gränsen nedan.

Kräver macOS (afconvert) och:  pip install lameenc numpy
Kör från repots rot:
    python3 tools/generate_audio_sv.py --dry-run ord "hund" "katt"     # räknar bara tecken
    python3 tools/generate_audio_sv.py ord "hund" "katt" "Jag har en stor hund."
    python3 tools/generate_audio_sv.py ord --file ord.txt              # en text per rad
"""
import json
import os
import sys
import time
import urllib.request
from xml.sax.saxutils import escape

sys.path.insert(0, os.path.dirname(__file__))
from extract_audio import slug  # noqa: E402
from generate_audio import shape, to_mp3, to_pcm16k  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC = os.path.join(ROOT, "public")
VOICE = "sv-SE-SofieNeural"
RATE = {"normal": "-5%", "slow": "-35%"}  # Sofie pratar lite fort för små barn
MAX_CHARS_PER_RUN = 150_000  # säkerhetsmarginal mot gratisnivåns 500 000 tecken/månad


def env():
    vals = {}
    path = os.path.join(ROOT, ".env")
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            if "=" in line and not line.lstrip().startswith("#"):
                k, v = line.split("=", 1)
                vals[k.strip()] = v.strip().strip('"').strip("'")
    vals.update({k: v for k, v in os.environ.items() if k.startswith("AZURE_")})
    return vals


def synth(text, kind, key, region):
    ssml = (
        "<speak version='1.0' xml:lang='sv-SE'>"
        f"<voice name='{VOICE}'><prosody rate='{RATE[kind]}'>{escape(text)}</prosody></voice></speak>"
    ).encode("utf-8")
    req = urllib.request.Request(
        f"https://{region}.tts.speech.microsoft.com/cognitiveservices/v1",
        data=ssml,
        headers={
            "Ocp-Apim-Subscription-Key": key,
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
            "User-Agent": "siilikool-audio",
        },
    )
    for attempt in range(5):
        try:
            return urllib.request.urlopen(req, timeout=60).read()
        except urllib.error.HTTPError as e:
            if e.code in (401, 403):
                raise SystemExit("Azure nekade nyckeln (%s) - kolla AZURE_SPEECH_KEY och AZURE_SPEECH_REGION." % e.code)
            print("  försöker igen (%s): %s" % (e.code, text))
        except Exception as e:  # nätverk
            print("  försöker igen (%s): %s" % (e, text))
        time.sleep(3 * (attempt + 1))
    raise SystemExit("Azure svarar inte för: " + text)


def main():
    args = sys.argv[1:]
    dry = "--dry-run" in args
    args = [a for a in args if a != "--dry-run"]
    if not args:
        raise SystemExit(__doc__)
    part, rest = args[0], args[1:]
    if rest[:1] == ["--file"]:
        rest = [l.strip() for l in open(rest[1], encoding="utf-8") if l.strip()]
    texts = list(dict.fromkeys(rest))

    os.chdir(PUBLIC)
    index_path = "audio/sv/index.json"
    index = json.load(open(index_path, encoding="utf-8")) if os.path.exists(index_path) else {}
    partfile = "audio/sv/%s.js" % part
    data = {"normal": {}, "slow": {}}
    if os.path.exists(partfile):
        raw = open(partfile, encoding="utf-8").read()
        data = json.loads(raw[raw.index(",") + 1 : raw.rindex(")")])

    todo = [t for t in texts if t not in index]
    chars = sum(len(t) for t in todo) * 2  # vanlig + långsam
    print("%d texter, %d saknar ljud, %d tecken hos Azure" % (len(texts), len(todo), chars))
    if dry or not todo:
        return
    if chars > MAX_CHARS_PER_RUN:
        raise SystemExit("För många tecken i en körning (%d) - dela upp listan." % chars)

    os.makedirs("audio/sv", exist_ok=True)
    e = env()
    key, region = e.get("AZURE_SPEECH_KEY"), e.get("AZURE_SPEECH_REGION")
    if not key or not region:
        raise SystemExit("Saknar AZURE_SPEECH_KEY / AZURE_SPEECH_REGION i .env")

    for t in todo:
        for kind in ("normal", "slow"):
            base = "audio/clips/sv/%s/%s" % (kind, slug(t))
            out, n = base + ".mp3", 2
            while os.path.exists(out):
                out, n = "%s-%d.mp3" % (base, n), n + 1
            a = shape(to_pcm16k(synth(t, kind, key, region)), kind)
            os.makedirs(os.path.dirname(out), exist_ok=True)
            open(out, "wb").write(to_mp3(a))
            data.setdefault(kind, {})[t] = out
        index[t] = part
        print("  %-28s %s" % (t, data["normal"][t]))
        # sparas efter varje text, så att ett avbrott inte kastar bort det som redan gjorts
        with open(partfile, "w", encoding="utf-8") as f:
            f.write("window.addAudio(%s,%s);" % (json.dumps("sv/" + part), json.dumps(data, ensure_ascii=False)))
        json.dump(index, open(index_path, "w", encoding="utf-8"), ensure_ascii=False, indent=0, sort_keys=True)
    print("Klart: public/%s och public/%s uppdaterade." % (partfile, index_path))


if __name__ == "__main__":
    main()
