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

  return { tone, buzz, sndLvl, fanfare };
}
