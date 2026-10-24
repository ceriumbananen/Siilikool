/* Siiris röst med munrörelser - porterat från playSrc()/ensureGraph()/startJaw()/stopJaw() i
   public/legacy/app.js (rad 3573-3627, 3706-3772). Klippen spelas i kö genom ett gemensamt
   <audio>-element. Munnen (jaw, 0-1) följer ljudets styrka via en AnalyserNode; på iOS, där
   det inte går att koppla ett <audio>-element till Web Audio utan att ljudet tystnar, gungar
   munnen i takt i stället - precis som förut. SiiriPortrait läser jaw och talking. */

const jaw = ref(0);
const talking = ref(false);

let player: HTMLAudioElement | null = null;
let analyser: AnalyserNode | null = null;
let buf: Uint8Array<ArrayBuffer> | null = null;
let graphTried = false;
let raf: number | null = null;
let queue: string[] = [];
let rate = 1; /* uppspelningstakt för klippen i kön (långsamt utan egen långsam inspelning: 0,72) */
let playId = 0; /* vilket klipp som gäller - ett avbrutet äldre play() ska inte stoppa ett nyare */
let unlockInstalled = false;

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/* getVoices() ger ofta en tom lista första gången den anropas - rösterna laddas asynkront och
   blir klara först när "voiceschanged" triggas (ett vanligt fall: sidan hinner anropa
   getVoices() innan webbläsaren hunnit hämta dem, så en estnisk systemröst som faktiskt finns
   missas och ljudet blir tyst i onödan). Väntar därför in händelsen en gång, med en kort
   timeout som fallback om den aldrig triggas. */
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;
function getVoicesAsync(synth: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  const existing = synth.getVoices();
  if (existing.length) return Promise.resolve(existing);
  if (!voicesPromise) {
    voicesPromise = new Promise(resolve => {
      const done = () => resolve(synth.getVoices());
      synth.addEventListener("voiceschanged", done, { once: true });
      setTimeout(done, 500);
    });
  }
  return voicesPromise;
}

/* kopplar spelaren till en analysator en gång - bara när ljudmotorn är vaken, annars blir det tyst */
function ensureGraph() {
  if (graphTried || !player || isIOS()) return;
  const ac = siiriAudioContext();
  if (!ac || ac.state !== "running") return;
  graphTried = true;
  try {
    const src = ac.createMediaElementSource(player);
    analyser = ac.createAnalyser();
    analyser.fftSize = 512;
    buf = new Uint8Array(analyser.fftSize);
    src.connect(analyser);
    analyser.connect(ac.destination);
  } catch {
    analyser = null;
  }
}

/* live = munnen följer ljudet i <audio>-elementet; annars (systemrösten) gungar den i takt */
function startJaw(live = true) {
  stopJaw();
  talking.value = true;
  const t0 = performance.now();
  const step = (now: number) => {
    let v: number;
    if (live && analyser && buf) {
      analyser.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i += 2) {
        const d = (buf[i]! - 128) / 128;
        sum += d * d;
      }
      v = Math.min(1, Math.sqrt(sum / (buf.length / 2)) * 5.2);
    } else {
      const t = (now - t0) / 1000;
      v = Math.max(0, (Math.sin(t * 15.5) * 0.5 + 0.5) * (0.45 + 0.55 * Math.abs(Math.sin(t * 2.9))));
    }
    jaw.value = v;
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}

function stopJaw() {
  if (raf) cancelAnimationFrame(raf);
  raf = null;
  talking.value = false;
  jaw.value = 0;
}

function getPlayer(): HTMLAudioElement {
  if (!player) {
    player = new Audio();
    player.preload = "auto";
    /* nästa klipp i kön - också om ett klipp inte går att spela, i stället för att tystna */
    player.addEventListener("ended", next);
    player.addEventListener("error", next);
  }
  return player;
}

/* En tyst ljudsnutt (en tiondels sekund) som spelas vid första trycket på sidan. Safari (iPad,
   iPhone) släpper bara fram ljud från ett <audio>-element som har spelats under ett tryck, och
   bara en dryg sekund efter trycket - men "Kuldne Siiri" säger sin replik 1,1s efter att man
   tryckt ner, och kittlingen när man vickat klart. Är spelaren upplåst en gång går det sedan. */
function silentClip(): string {
  const n = 2205; /* 0,1s i 22,05 kHz, 8 bit mono */
  const b = new DataView(new ArrayBuffer(44 + n));
  const str = (o: number, t: string) => [...t].forEach((c, i) => b.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF");
  b.setUint32(4, 36 + n, true);
  str(8, "WAVE");
  str(12, "fmt ");
  b.setUint32(16, 16, true);
  b.setUint16(20, 1, true);
  b.setUint16(22, 1, true);
  b.setUint32(24, 22050, true);
  b.setUint32(28, 22050, true);
  b.setUint16(32, 1, true);
  b.setUint16(34, 8, true);
  str(36, "data");
  b.setUint32(40, n, true);
  for (let i = 0; i < n; i++) b.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([b.buffer], { type: "audio/wav" }));
}
function installUnlock() {
  if (unlockInstalled) return;
  unlockInstalled = true;
  const unlock = () => {
    document.removeEventListener("pointerdown", unlock, true);
    document.removeEventListener("keydown", unlock, true);
    siiriAudioContext()
      ?.resume()
      .catch(() => {});
    const p = getPlayer();
    if (!p.paused) return; /* spelar redan - då är den upplåst */
    p.src = silentClip();
    p.play().catch(() => {});
  };
  document.addEventListener("pointerdown", unlock, { capture: true, passive: true });
  document.addEventListener("keydown", unlock, { capture: true, passive: true });
}

function next() {
  const src = queue.shift();
  if (!src || !player) return stopJaw();
  const id = ++playId;
  const play = () => {
    if (id !== playId) return;
    ensureGraph();
    player!.src = src;
    player!.playbackRate = rate;
    player!
      .play()
      .then(() => id === playId && startJaw())
      .catch(() => {
        if (id !== playId) return; /* avbrutet av ett nyare klipp */
        if (queue.length) next();
        else stopJaw();
      });
  };
  /* vänta tills ljudmotorn är vaken - annars spelas klippet tyst */
  const ac = siiriAudioContext();
  if (ac && ac.state !== "running" && !isIOS()) ac.resume().then(play, play);
  else play();
}

export function useSiiriVoice() {
  const profile = useProfileStore();
  installUnlock();

  /** Spelar klippen i följd (sökvägar som "/audio/clips/normal/tere.mp3") och rör munnen.
   * playbackRate < 1 spelar dem långsammare. */
  function say(clips: string[], playbackRate = 1) {
    if (!profile.state.sound || !clips.length) return;
    getPlayer().pause();
    window.speechSynthesis?.cancel();
    rate = playbackRate;
    queue = [...clips];
    next();
  }

  /** Säger ett estniskt ord eller en fras med Siiris inspelning (som speak() i legacy). Saknas
   * inspelningen används en estnisk systemröst om enheten har en - annars blir det tyst. */
  async function sayWord(et: string, slow = false) {
    if (!profile.state.sound) return;
    const clip = await findWordClip(et, slow);
    if (clip) return say([clip.src], slow && !clip.isSlow ? 0.72 : 1);
    const synth = window.speechSynthesis;
    if (!synth) return;
    const etVoice = (await getVoicesAsync(synth)).find(v => /^et\b|^et-/i.test(v.lang));
    if (!etVoice) return;
    hush();
    const u = new SpeechSynthesisUtterance(et);
    u.voice = etVoice;
    u.lang = etVoice.lang;
    u.rate = slow ? 0.62 : 0.78;
    u.pitch = 1.1;
    u.onstart = () => startJaw(false);
    u.onend = u.onerror = () => stopJaw();
    synth.speak(u);
  }

  /** Hämtar klippen i förväg (de hamnar i service workerns cache), så att de spelas direkt. */
  function preload(clips: string[]) {
    for (const c of clips) fetch(c, { priority: "low" } as RequestInit).catch(() => {});
  }

  function hush() {
    queue = [];
    playId++;
    player?.pause();
    stopJaw();
  }

  return { jaw: readonly(jaw), talking: readonly(talking), say, sayWord, hush, preload };
}
