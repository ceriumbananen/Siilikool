/* Små ljud och vibration - porterat från tone()/buzz()/sndLvl()/fanfare() i public/legacy/app.js
   (rad 3123-3147, 3348-3383). Fristående Web Audio: ingen legacy-motor behövs. En gemensam
   AudioContext för hela sidan (webbläsare begränsar hur många som får finnas). */

let audioCtx: AudioContext | null = null;

/** Sidans gemensamma AudioContext (skapas vid första behov) - också för Siiris röst. */
export function siiriAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    return audioCtx;
  } catch {
    return null;
  }
}

export function useSiiriSound() {
  const profile = useProfileStore();

  function tone(freq: number, dur: number, when = 0, type: OscillatorType = "sine") {
    if (!profile.state.sound) return;
    try {
      const audioCtx = siiriAudioContext();
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") audioCtx.resume();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type;
      o.frequency.value = freq;
      o.connect(g);
      g.connect(audioCtx.destination);
      const t = audioCtx.currentTime + when;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t);
      o.stop(t + dur + 0.03);
    } catch {
      /* ljud är en bonus, aldrig kritiskt */
    }
  }

  function buzz(pattern: number) {
    try {
      if (profile.state.sound && navigator.vibrate) navigator.vibrate(pattern);
    } catch {
      /* vibration saknas på många enheter/webbläsare - strunta i det då */
    }
  }

  /** Fyra stigande toner - nytt märke, gyllene Siiri. */
  function sndLvl() {
    tone(523, 0.14, 0);
    tone(659, 0.14, 0.12);
    tone(784, 0.14, 0.24);
    tone(1047, 0.3, 0.36);
  }

  /** Fanfar i tre storlekar (1 = liten, 3 = störst). */
  function fanfare(tier: number) {
    if (!profile.state.sound) return;
    const N = [523.25, 659.25, 783.99, 1046.5, 1318.5] as const;
    if (tier >= 3) {
      tone(261.6, 0.5, 0, "triangle");
      tone(392, 0.5, 0, "triangle");
      tone(N[0], 0.16, 0.05);
      tone(N[1], 0.16, 0.2);
      tone(N[2], 0.16, 0.35);
      tone(N[3], 0.5, 0.52);
      tone(N[2], 0.5, 0.52);
      tone(N[4], 0.7, 0.7);
      tone(130.8, 0.7, 0.7, "triangle");
      setTimeout(() => {
        tone(N[3], 0.18, 0);
        tone(N[4], 0.5, 0.16);
      }, 1200);
    } else if (tier === 2) {
      tone(N[0], 0.14, 0);
      tone(N[1], 0.14, 0.13);
      tone(N[2], 0.14, 0.26);
      tone(N[3], 0.45, 0.4);
      tone(N[1], 0.45, 0.4);
    } else {
      tone(N[1], 0.12, 0);
      tone(N[2], 0.12, 0.11);
      tone(N[3], 0.3, 0.23);
    }
  }

  /** Rätt svar: tre stigande toner. */
  function sndOk() {
    tone(660, 0.14, 0);
    tone(880, 0.16, 0.11);
    tone(1180, 0.22, 0.22);
  }

  /** Fel svar: två mjuka, sjunkande toner. */
  function sndNo() {
    tone(300, 0.16, 0, "triangle");
    tone(210, 0.22, 0.13, "triangle");
  }

  /** Katten i rummet spinner: pulserande brus genom ett lågpassfilter (purr() i legacy). */
  function purr(dur = 1.1) {
    if (!profile.state.sound) return;
    try {
      const ac = siiriAudioContext();
      if (!ac) return;
      if (ac.state === "suspended") ac.resume();
      const t = ac.currentTime,
        sr = ac.sampleRate,
        n = Math.ceil(sr * dur),
        buf = ac.createBuffer(1, n, sr),
        data = buf.getChannelData(0);
      for (let i = 0; i < n; i++) {
        const pulse = Math.pow(Math.max(0, Math.sin(2 * Math.PI * 28 * (i / sr))), 1.6);
        data[i] = (Math.random() * 2 - 1) * pulse;
      }
      const src = ac.createBufferSource();
      src.buffer = buf;
      const f1 = ac.createBiquadFilter();
      f1.type = "lowpass";
      f1.frequency.value = 260;
      f1.Q.value = 1;
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(1.6, t + 0.15);
      g.gain.setValueAtTime(1.6, t + dur - 0.3);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f1);
      f1.connect(g);
      g.connect(ac.destination);
      src.start(t);
      src.stop(t + dur + 0.02);
    } catch {
      /* ljud är en bonus */
    }
  }

  return { tone, buzz, sndLvl, fanfare, sndOk, sndNo, purr };
}
