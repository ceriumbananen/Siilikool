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

Utan Azure-nyckel: --edge hämtar samma röst via Microsoft Edges uppläsningstjänst (paketet
edge-tts). Det är en inofficiell väg utan konto - bra medan estniskt läge är i beta, men byt
gärna till Azure-klipp (kör om utan --edge efter att ha tömt public/audio/sv) innan läget
öppnas för alla.

Kräver macOS (afconvert) och:  pip install lameenc numpy   (för --edge även: pip install edge-tts)
Kör från repots rot:
    python3 tools/generate_audio_sv.py --dry-run ord "hund" "katt"     # räknar bara tecken
    python3 tools/generate_audio_sv.py ord "hund" "katt" "Jag har en stor hund."
    python3 tools/generate_audio_sv.py ord --file ord.txt              # en text per rad
    python3 tools/generate_audio_sv.py --edge ord --file ord.txt       # utan Azure-nyckel
"""
import asyncio
import json
import os
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
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


def synth_edge(text, kind):
    """Samma röst via edge-tts (mp3) - görs om till wav så att resten av kedjan är densamma."""
    import edge_tts

    # tjänsten svarar ibland "No audio was received", oftast för korta ord i långsam takt -
    # då hjälper det att vänta och, sista försöken, sänka takten lite mindre
    # och för enstaka korta ord ("hej") att skriva dem som ett utrop ("Hej!") - samma ord, men
    # då vill tjänsten läsa dem
    r = RATE[kind]
    excl = text[:1].upper() + text[1:] + "!" if text[-1:].isalnum() else text
    tries = [(text, r), (text, r), (excl, r), (text + ",", r), (excl, r)]
    if kind == "slow":
        tries += [(text, "-25%"), (excl, "-25%"), (text, "-15%")]
    with tempfile.TemporaryDirectory() as d:
        mp3, wav = os.path.join(d, "in.mp3"), os.path.join(d, "out.wav")
        for attempt, (say, rate) in enumerate(tries):
            try:
                asyncio.run(asyncio.wait_for(edge_tts.Communicate(say, VOICE, rate=rate).save(mp3), 30))  # hänger annars ibland
                if os.path.getsize(mp3) > 0:
                    break
            except Exception as e:  # nätverk / tillfälligt fel
                print("  försöker igen (%s): %s" % (str(e)[:40], text))
            time.sleep(1 + attempt)
        else:
            raise RuntimeError("edge-tts svarar inte för: " + text)
        subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16@24000", "-c", "1", mp3, wav], check=True)
        return open(wav, "rb").read()


def main():
    args = sys.argv[1:]
    dry = "--dry-run" in args
    edge = "--edge" in args
    args = [a for a in args if a not in ("--dry-run", "--edge")]
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
    print("%d texter, %d saknar ljud, %d tecken%s" % (len(texts), len(todo), chars, "" if edge else " hos Azure"))
    if dry or not todo:
        return
    if not edge and chars > MAX_CHARS_PER_RUN:
        raise SystemExit("För många tecken i en körning (%d) - dela upp listan." % chars)

    os.makedirs("audio/sv", exist_ok=True)
    if edge:
        get = synth_edge
    else:
        e = env()
        key, region = e.get("AZURE_SPEECH_KEY"), e.get("AZURE_SPEECH_REGION")
        if not key or not region:
            raise SystemExit("Saknar AZURE_SPEECH_KEY / AZURE_SPEECH_REGION i .env")
        get = lambda t, kind: synth(t, kind, key, region)  # noqa: E731

    def render(t):
        try:
            return {kind: to_mp3(shape(to_pcm16k(get(t, kind)), kind)) for kind in ("normal", "slow")}
        except RuntimeError as e:  # hoppa över - kör om skriptet senare, då görs bara det som saknas
            print("  HOPPAR ÖVER: %s" % e)
            return None

    # några texter åt gången (nätverket är flaskhalsen), men filerna skrivs i ordning här
    pool = ThreadPoolExecutor(max_workers=2)
    skipped = []
    for t, clips in zip(todo, pool.map(render, todo)):
        if clips is None:
            skipped.append(t)
            continue
        for kind in ("normal", "slow"):
            base = "audio/clips/sv/%s/%s" % (kind, slug(t))
            out, n = base + ".mp3", 2
            while os.path.exists(out):
                out, n = "%s-%d.mp3" % (base, n), n + 1
            os.makedirs(os.path.dirname(out), exist_ok=True)
            open(out, "wb").write(clips[kind])
            data.setdefault(kind, {})[t] = out
        index[t] = part
        print("  %-28s %s" % (t, data["normal"][t]))
        # sparas efter varje text, så att ett avbrott inte kastar bort det som redan gjorts
        with open(partfile, "w", encoding="utf-8") as f:
            f.write("window.addAudio(%s,%s);" % (json.dumps("sv/" + part), json.dumps(data, ensure_ascii=False)))
        json.dump(index, open(index_path, "w", encoding="utf-8"), ensure_ascii=False, indent=0, sort_keys=True)
    print("Klart: public/%s och public/%s uppdaterade." % (partfile, index_path))
    if skipped:
        print("%d texter saknar fortfarande ljud - kör samma kommando igen: %s" % (len(skipped), ", ".join(skipped)))


if __name__ == "__main__":
    main()
