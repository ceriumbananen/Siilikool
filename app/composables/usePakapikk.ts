/* Päkapiku kirjad - spelets tillstånd och handlingar (datan i app/utils/pakapikk.ts). Delas
   mellan scenen i rummet (RoomPakapikkStage), brevet (RoomPakapikkLetter) och adventskalendern
   (RoomPakapikkCalendar), därför ligger tillståndet utanför funktionen: en jakt i taget.

   Flödet för ett brev: toffeln på fönsterbrädan → brevet öppnas och läses upp ("letter") →
   barnet letar i rummet ("search") → rätt ställe: nissen tittar fram och säger var saken låg
   ("peek") → nästa lapp ("note", tillbaka till "search") eller dagens sak ("done"). */

type Mode = "idle" | "letter" | "search" | "peek" | "note" | "done";

const mode = ref<Mode>("idle");
const day = ref(0); /* brevet som är öppet */
const step = ref(0); /* vilken lapp i dagens kedja */
const reread = ref(false); /* ett redan hittat brev som läses igen - ingen jakt */
const wrong = ref(0); /* fel tryck på den här lappen - efter två glimtar rätt ställe till */
const showSv = ref(false);
const miss = ref<{ x: number; y: number; n: number } | null>(null);
const reward = ref<{ stars: number; hat: boolean } | null>(null);
let missTimer: ReturnType<typeof setTimeout> | undefined;
let peekTimer: ReturnType<typeof setTimeout> | undefined;

export function usePakapikk() {
  const profile = useProfileStore();
  const s = profile.state;
  const voice = useSiiriVoice();
  const { tone, buzz, fanfare } = useSiiriSound();
  const { burst } = useConfetti();
  const { addXp } = useRewards();
  const route = useRoute();

  /* ?pakdate=2026-12-07 provar ett annat datum - bara under utveckling */
  const now = computed(() => {
    const q = import.meta.dev ? String(route.query.pakdate || "") : "";
    const d = q ? new Date(`${q}T12:00:00`) : new Date();
    return isNaN(d.getTime()) ? new Date() : d;
  });
  const phase = computed(() => pakPhase(now.value));
  const foundKeys = computed(() => new Set((s.pakFound as string[] | undefined) || []));
  const isFound = (d: number) => foundKeys.value.has(pakKey(phase.value.year, d));
  /** Det äldsta brevet som väntar i toffeln, eller 0. */
  const waiting = computed(() => {
    for (let d = 1; d <= phase.value.open; d++) if (!isFound(d)) return d;
    return 0;
  });
  const waitingCount = computed(() => {
    let n = 0;
    for (let d = 1; d <= phase.value.open; d++) if (!isFound(d)) n++;
    return n;
  });

  const current = computed(() => (day.value ? pakDay(day.value) : null));
  const target = computed(() => {
    const c = current.value;
    return c ? PAK_TARGETS[c.steps[Math.min(step.value, c.steps.length - 1)]!] : null;
  });
  const searching = computed(() => mode.value === "search" || mode.value === "peek");

  /* läser upp raderna i följd med Siiris inspelningar */
  async function sayLines(lines: string[]) {
    const clips = (await Promise.all(lines.map(l => findWordClip(l)))).filter(Boolean).map(c => c!.src);
    if (clips.length) voice.say(clips);
    else if (lines[0]) voice.sayWord(lines[0]);
  }
  function letterLines(): PakLine[] {
    const c = current.value;
    if (!c || !target.value) return [];
    return [PAK_GREETING, c.story, target.value.ask, PAK_SIGNOFF];
  }
  function readAloud() {
    if (mode.value === "note") return sayLines([PAK_WELL_DONE.et, target.value!.ask.et]);
    if (mode.value === "done" && current.value) return sayLines([current.value.gift.et]);
    sayLines(letterLines().map(l => l.et));
  }

  function jingle() {
    tone(1568, 0.1, 0, "triangle");
    tone(2093, 0.12, 0.09, "triangle");
    tone(2637, 0.18, 0.18, "triangle");
  }

  function openLetter(d: number) {
    if (searching.value) return;
    day.value = d;
    step.value = 0;
    wrong.value = 0;
    reread.value = isFound(d);
    showSv.value = s.diff === "latt";
    mode.value = "letter";
    jingle();
    readAloud();
  }
  function openWaiting() {
    if (waiting.value) openLetter(waiting.value);
  }
  function startSearch() {
    if (reread.value) return close();
    voice.hush();
    mode.value = "search";
    wrong.value = 0;
    tone(660, 0.07, 0);
  }
  function close() {
    clearTimeout(peekTimer);
    mode.value = "idle";
    day.value = 0;
    reward.value = null;
  }

  /** Ett tryck på en ruta i rummet under jakten. x/y = var (procent), för "Ei ole siin"-bubblan. */
  function tapTarget(id: PakTargetId, x: number, y: number) {
    if (mode.value !== "search" || !target.value) return;
    if (id === target.value.id) return hit();
    wrong.value++;
    buzz(12);
    tone(330, 0.08, 0);
    tone(262, 0.12, 0.07);
    voice.sayWord(PAK_WRONG.et);
    miss.value = { x, y, n: (miss.value?.n || 0) + 1 };
    clearTimeout(missTimer);
    missTimer = setTimeout(() => (miss.value = null), 1400);
  }
  /** Siiri vändes (room.vue) - rätt om lappen sa "Pööra Siiri ümber!". */
  function onSiiriFlip() {
    if (mode.value === "search" && target.value?.id === "siiri") setTimeout(hit, 450);
  }

  function hit() {
    const c = current.value,
      t = target.value;
    if (!c || !t) return;
    mode.value = "peek";
    miss.value = null;
    jingle();
    buzz(20);
    sayLines([PAK_FOUND.et, t.at.et]);
    clearTimeout(peekTimer);
    peekTimer = setTimeout(() => {
      if (step.value < c.steps.length - 1) {
        step.value++;
        wrong.value = 0;
        mode.value = "note";
        readAloud();
      } else finish();
    }, 2300);
  }

  function finish() {
    const c = current.value;
    if (!c) return;
    const list = (s.pakFound as string[] | undefined) || [];
    const key = pakKey(phase.value.year, c.day);
    let stars = 0,
      hat = false;
    if (!list.includes(key)) {
      s.pakFound = [...list, key];
      stars = Math.round((8 + 4 * c.steps.length) * starMult(s.xp || 0));
      s.stars = (s.stars || 0) + stars;
      const owned = (s.owned as string[] | undefined) || [];
      if (c.day === PAK_DAYS && !owned.includes(PAK_FINAL_ITEM)) {
        s.owned = [...owned, PAK_FINAL_ITEM];
        hat = true;
      }
      profile.save();
      addXp(10 + 5 * c.steps.length);
    }
    reward.value = { stars, hat };
    mode.value = "done";
    burst(c.day === PAK_DAYS ? 160 : 90);
    fanfare(c.day === PAK_DAYS ? 3 : 2);
    sayLines([c.gift.et]);
  }

  /** Vad den tomma toffeln säger: sista veckan i november kommer nissen snart, i december
   * kommer nästa brev i morgon, och efter julafton är det bara god jul. */
  const emptyLine = computed<PakLine>(() =>
    phase.value.phase === "soon" ? PAK_SOON : phase.value.open >= PAK_DAYS ? PAK_FINAL_WISH : PAK_TOMORROW,
  );
  function soon() {
    jingle();
    voice.sayWord(emptyLine.value.et);
  }

  return {
    mode: readonly(mode),
    day: readonly(day),
    step: readonly(step),
    reread: readonly(reread),
    wrong: readonly(wrong),
    miss: readonly(miss),
    reward: readonly(reward),
    showSv,
    phase,
    waiting,
    waitingCount,
    current,
    target,
    searching,
    isFound,
    letterLines,
    readAloud,
    sayLine: (et: string) => voice.sayWord(et),
    openLetter,
    openWaiting,
    startSearch,
    close,
    tapTarget,
    onSiiriFlip,
    soon,
    emptyLine,
  };
}
