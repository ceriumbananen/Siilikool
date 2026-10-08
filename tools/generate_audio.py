#!/usr/bin/env python3
"""Genererar nya ljudklipp med Neurokõne (Tartu universitet), rösten Mari.

Skapar för varje ord en vanlig och en långsam version i samma format som de
befintliga klippen (mp3, 16 kHz, mono, 40 kbit/s, ca 0,25 s tystnad före/efter),
lägger dem i public/audio/clips/normal/ och .../slow/, skriver ljuddelen
public/audio/<del>.js och pekar ut orden i window.PARTMAP i public/legacy/data.js.
Ord som redan har ljud någonstans hoppas över.

Kräver macOS (afconvert) och:  pip install lameenc numpy
Kör från repots rot:
    python3 tools/generate_audio.py furn "Tugitool" "Voodi" ...
"""
import glob
import io
import json
import os
import subprocess
import sys
import tempfile
import time
import urllib.request
import wave

import lameenc
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from extract_audio import CORE, PUBLIC, banks_in, slug  # noqa: E402

API = "https://api.tartunlp.ai/text-to-speech/v2"
SPEAKER = "mari"
SPEED = {"normal": 0.95, "slow": 0.6}    # uppmätt mot de befintliga klippen
SR = 16000
PAD = 0.25                                # sekunder tystnad före och efter
RMS = {"normal": 0.148, "slow": 0.12}     # ljudnivå som de befintliga klippen


def synth(text, speed):
    # utan avslutande skiljetecken tappar rösten sista ljudet ("Sinakas" -> "sinaka")
    if text[-1:].isalnum():
        text += "."
    body = json.dumps({"text": text, "speaker": SPEAKER, "speed": speed}).encode()
    req = urllib.request.Request(API, data=body, headers={"Content-Type": "application/json", "Accept": "audio/wav"})
    for attempt in range(5):
        try:
            return urllib.request.urlopen(req, timeout=90).read()
        except Exception as e:
            print("  försöker igen (%s): %s" % (e, text))
            time.sleep(3 * (attempt + 1))
    raise SystemExit("Neurokõne svarar inte för: " + text)


def to_pcm16k(wav_bytes):
    """Konverterar API:ts wav (float, 22 kHz) till 16 kHz mono via afconvert."""
    with tempfile.TemporaryDirectory() as d:
        src, dst = os.path.join(d, "in.wav"), os.path.join(d, "out.wav")
        open(src, "wb").write(wav_bytes)
        subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16@%d" % SR, "-c", "1", src, dst], check=True)
        w = wave.open(dst)
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0


def shape(a, kind):
    """Klipper bort tystnaden, lägger till lika mycket som originalen har och jämnar ut nivån."""
    idx = np.where(np.abs(a) > 0.02 * np.abs(a).max())[0]
    a = a[idx[0]:idx[-1] + 1]
    a = a * (RMS[kind] / max(1e-6, float(np.sqrt((a ** 2).mean()))))
    a = np.clip(a, -0.98, 0.98)
    pad = np.zeros(int(PAD * SR), dtype=np.float32)
    return np.concatenate([pad, a, pad])


def to_mp3(a):
    enc = lameenc.Encoder()
    enc.set_bit_rate(40)
    enc.set_in_sample_rate(SR)
    enc.set_channels(1)
    enc.set_quality(2)
    pcm = (a * 32767).astype("<i2").tobytes()
    return enc.encode(pcm) + enc.flush()


def existing_banks():
    have = {"normal": {}, "slow": {}}
    for f in [CORE] + sorted(glob.glob("audio/*.js")):
        o = banks_in(f, open(f, encoding="utf-8").read())
        for k in have:
            have[k].update(o.get(k, {}))
    return have


def add_to_partmap(words, part):
    text = open(CORE, encoding="utf-8").read()
    start = text.index("window.PARTMAP = ") + len("window.PARTMAP = ")
    pm, end = json.JSONDecoder().raw_decode(text, start)
    add = [w for w in words if pm.get(w) != part]
    if not add:
        return
    extra = "".join(', %s: "%s"' % (json.dumps(w, ensure_ascii=False), part) for w in add)
    close = end - 1                      # sista "}" i PARTMAP
    text = text[:close].rstrip() + extra + " " + text[close:]
    open(CORE, "w", encoding="utf-8").write(text)


def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    part, words = sys.argv[1], list(dict.fromkeys(sys.argv[2:]))
    os.chdir(PUBLIC)
    have = existing_banks()
    partfile = "audio/%s.js" % part
    data = {"normal": {}, "slow": {}}
    if os.path.exists(partfile):
        data = banks_in(partfile, open(partfile, encoding="utf-8").read())
    todo = [w for w in words if w not in have["normal"] or w not in have["slow"]]
    print("%d ord, %d saknar ljud" % (len(words), len(todo)))
    for w in todo:
        for kind in ("normal", "slow"):
            if w in have[kind]:
                continue
            base = "audio/clips/%s/%s" % (kind, slug(w))
            out, n = base + ".mp3", 2
            while os.path.exists(out):
                out, n = "%s-%d.mp3" % (base, n), n + 1
            a = shape(to_pcm16k(synth(w, SPEED[kind])), kind)
            os.makedirs(os.path.dirname(out), exist_ok=True)
            open(out, "wb").write(to_mp3(a))
            data.setdefault(kind, {})[w] = out
        print("  %-20s %s" % (w, data["normal"].get(w, "")))
    with open(partfile, "w", encoding="utf-8") as f:
        f.write("window.addAudio(%s,%s);" % (json.dumps(part), json.dumps(data, ensure_ascii=False)))
    add_to_partmap(list(data.get("normal", {}).keys()), part)
    print("Klart: public/%s och PARTMAP i public/%s uppdaterade." % (partfile, CORE))


if __name__ == "__main__":
    main()
