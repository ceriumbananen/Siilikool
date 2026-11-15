<script setup lang="ts">
/* Kadunud asi (Den försvunna saken) - minneslek i Siiris rum. Datan i app/utils/kadunud.ts,
   rummet ritas av roomSVG (app/utils/room-svg.ts) precis som i room.vue - barnets eget rum, med
   de möbler det köpt. Startas från hemskärmens ruta (public/legacy/app.js, MODES "kad").

   En runda: titta ("Vaata tuba hästi!") → "Valmis!" → ögonlocken glider ihop, Siiri räknar
   "üks, kaks, kolm" och en sak tonar bort → "Mis on kadunud?" → välj ordet (eller tryck där
   saken stod). Fel val är inget straff: saken man valde lyser upp ("Ei, see on alles!" - den
   finns ju kvar). Rätt: saken tonar tillbaka med ett glitter, "Vaip on kadunud! Siin see on!" */

useHead({ title: "Kadunud asi · Siilikool" });
const profile = useProfileStore();
const s = profile.state;
const voice = useSiiriVoice();
const { tone, buzz, fanfare } = useSiiriSound();
const { burst } = useConfetti();
const { addXp } = useRewards();
const { mood, dance } = useSiiri();

/* ---------- rummet ---------- */
const furnOwnedIds = computed(() => s.furnOwned as string[] | undefined);
const room = computed(() => s.room as Record<string, string> | undefined);
const slotOf = (slot: string) => furnOf(slot, room.value, furnOwnedIds.value);
const roomHtml = roomSVG({
  furnOf: slotOf,
  diplomas: (s.diplomas as Record<string, number> | undefined) || {},
  tripDone: tripDone(s),
});
const stage = ref<HTMLElement | null>(null);
const elOf = (t: KadThing) => stage.value?.querySelector<SVGGraphicsElement>(t.sel) || null;

/* ---------- spelet ---------- */
type Phase = "look" | "blink" | "find" | "found" | "done";
const phase = ref<Phase>("look");
const round = ref(1);
const things = ref<KadThing[]>([]);
const hidden = ref<KadThing | null>(null);
const choices = ref<KadThing[]>([]);
const missed = ref(false);
const firstTry = ref(0);
const stars = ref(0);
const said = ref<KadLine>(KAD_LOOK);
const showSv = ref(s.diff === "latt");
const lids = ref(false);
const sparkle = ref<{ x: number; y: number; n: number } | null>(null);
let lastKey = "";

async function sayLines(lines: string[]) {
  const clips = (await Promise.all(lines.map(l => findWordClip(l)))).filter(Boolean).map(c => c!.src);
  if (clips.length) voice.say(clips);
  else if (lines[0]) voice.sayWord(lines[0]);
}
function show(line: KadLine, extra: string[] = [], after: string[] = []) {
  said.value = line;
  sayLines([...extra, line.et, ...after]);
}

onMounted(async () => {
  await nextTick();
  /* bara det som faktiskt syns i barnets rum - och är stort nog att lägga märke till
     (dockorna och trähästen på spiselkransen är bara några pixlar på en telefon) */
  things.value = kadThings(slotOf).filter(t => {
    const el = elOf(t);
    const r = el?.getBoundingClientRect();
    return !!r && r.width >= 18 && r.height >= 18;
  });
  mood("listen");
  show(KAD_LOOK);
});

function ready() {
  if (phase.value !== "look") return;
  phase.value = "blink";
  lids.value = true;
  mood("");
  tone(392, 0.12, 0);
  tone(294, 0.18, 0.1);
  show(KAD_CLOSE, [], KAD_COUNT);
  /* bakom ögonlocken: välj saken och låt den försvinna */
  setTimeout(() => {
    const pool = things.value.filter(t => t.key !== lastKey);
    const t = pool[Math.floor(Math.random() * pool.length)]!;
    lastKey = t.key;
    hidden.value = t;
    const el = elOf(t);
    if (el) {
      el.style.transition = "none";
      el.style.opacity = "0";
    }
    const n = s.diff === "svar" ? 3 : 2;
    const others = things.value.filter(x => x.key !== t.key && x.et !== t.et);
    const pick = shuffle(others).slice(0, n);
    choices.value = shuffle([t, ...pick]);
    missed.value = false;
  }, 900);
  setTimeout(() => {
    lids.value = false;
    phase.value = "find";
    mood("think");
    show(KAD_WHAT, [KAD_OPEN.et]);
  }, 3600);
}

/* lyser upp en sak i rummet en stund */
function glow(t: KadThing) {
  const el = elOf(t);
  if (!el) return;
  el.style.transition = "filter 0.3s ease";
  el.style.filter = "drop-shadow(0 0 4px #ffd75e) drop-shadow(0 0 10px #ffd75e)";
  setTimeout(() => (el.style.filter = ""), 1300);
}

function choose(t: KadThing) {
  if (phase.value !== "find" || !hidden.value) return;
  if (t.key === hidden.value.key) return found();
  missed.value = true;
  buzz(14);
  tone(330, 0.1, 0);
  tone(262, 0.14, 0.08);
  mood("oops");
  glow(t);
  show(KAD_STILL);
}

/* tryck i rummet: där saken stod räknas som rätt, en annan sak som "den finns kvar" */
function onStage(e: MouseEvent) {
  if (phase.value !== "find" || !hidden.value) return;
  const el = elOf(hidden.value);
  const r = el?.getBoundingClientRect();
  const pad = 8;
  if (
    r &&
    e.clientX >= r.left - pad &&
    e.clientX <= r.right + pad &&
    e.clientY >= r.top - pad &&
    e.clientY <= r.bottom + pad
  )
    return found();
  const target = e.target as Element;
  const other = things.value.find(t => t.key !== hidden.value!.key && elOf(t)?.contains(target));
  if (other) choose(other);
}

function found() {
  const t = hidden.value!;
  phase.value = "found";
  if (!missed.value) firstTry.value++;
  const gain = Math.round((missed.value ? 2 : 4) * starMult(s.xp || 0));
  stars.value += gain;
  s.stars = (s.stars || 0) + gain;
  profile.save();
  const el = elOf(t);
  if (el) {
    el.style.transition = "opacity 0.9s ease";
    el.style.opacity = "1";
    const r = el.getBoundingClientRect(),
      st = stage.value!.getBoundingClientRect();
    sparkle.value = {
      x: ((r.left + r.width / 2 - st.left) / st.width) * 100,
      y: ((r.top + r.height / 2 - st.top) / st.height) * 100,
      n: (sparkle.value?.n || 0) + 1,
    };
    glow(t);
  }
  mood("cheer");
  tone(784, 0.08, 0);
  tone(1046, 0.12, 0.08);
  tone(1318, 0.16, 0.16);
  burst(50);
  show(kadGone(t), [], [KAD_HERE.et]);
}

function next() {
  if (round.value >= KAD_ROUNDS) return finish();
  round.value++;
  hidden.value = null;
  sparkle.value = null;
  phase.value = "look";
  mood("listen");
  show(KAD_LOOK);
}

function finish() {
  phase.value = "done";
  s.kadGames = ((s.kadGames as number | undefined) || 0) + 1;
  profile.save();
  dance(true);
  fanfare(2);
  burst(120);
  setTimeout(() => addXp(5 * KAD_ROUNDS), 1500);
  show({ et: "Tubli!", sv: "Bra gjort!" });
}

function again() {
  round.value = 1;
  firstTry.value = 0;
  stars.value = 0;
  hidden.value = null;
  sparkle.value = null;
  phase.value = "look";
  mood("listen");
  show(KAD_LOOK);
}
</script>

<template>
  <UiAppShell active="home" wide>
    <main class="kad">
      <a class="kad__back" href="/">← Tillbaka</a>

      <div class="kad__top">
        <UiSiiriPortrait size="small" class="kad__siiri" />
        <button class="kad__bubble" @click="show(said)">
          <b lang="et">{{ said.et }}</b>
          <small v-if="showSv">{{ said.sv }}</small>
          <small v-else>🔊 Tryck för att höra igen</small>
        </button>
      </div>

      <p class="kad__round">
        <span
          v-for="i in KAD_ROUNDS"
          :key="i"
          :class="{ on: i < round || (i === round && (phase === 'found' || phase === 'done')) }"
          >●</span
        >
        Runda {{ Math.min(round, KAD_ROUNDS) }} av {{ KAD_ROUNDS }}
      </p>

      <!-- rummet -->
      <div class="kad__stage" :class="{ 'kad__stage--find': phase === 'find' }" @click="onStage">
        <div ref="stage" class="kad__room" v-html="roomHtml" />
        <div class="kad__lid kad__lid--top" :class="{ 'kad__lid--shut': lids }" />
        <div class="kad__lid kad__lid--bottom" :class="{ 'kad__lid--shut': lids }" />
        <div v-if="lids" class="kad__shut" aria-hidden="true">🙈</div>
        <div
          v-if="sparkle"
          :key="sparkle.n"
          class="kad__sparkle"
          :style="{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }"
          aria-hidden="true"
        >
          ✨
        </div>
      </div>

      <!-- vad man gör nu -->
      <UiAppButton v-if="phase === 'look'" variant="green" wide big @click="ready">
        👀 Valmis! · Jag har tittat!
      </UiAppButton>

      <div v-else-if="phase === 'find'" class="kad__choices">
        <button v-for="c in choices" :key="c.key" class="kad__choice" @click="choose(c)">
          <b lang="et">{{ c.et }}</b>
          <small v-if="showSv">{{ c.sv }}</small>
        </button>
      </div>

      <UiAppButton v-else-if="phase === 'found'" variant="green" wide big @click="next">
        {{ round >= KAD_ROUNDS ? "🎉 Klart!" : "➡️ Järgmine · Nästa" }}
      </UiAppButton>

      <UiAppCard v-else-if="phase === 'done'" class="kad__done">
        <h2>Tubli! <small>Bra gjort!</small></h2>
        <p>Du hittade {{ firstTry }} av {{ KAD_ROUNDS }} på första försöket.</p>
        <p class="kad__stars">+{{ stars }} ⭐</p>
        <div class="kad__row">
          <UiAppButton variant="green" big @click="again">🔄 Igen</UiAppButton>
          <a class="kad__home" href="/">Hem</a>
        </div>
      </UiAppCard>

      <p v-if="phase === 'find'" class="kad__hint">Välj ordet – eller tryck där saken stod.</p>
      <button v-if="!showSv && phase !== 'done'" class="kad__sv" @click="showSv = true">🇸🇪 Visa på svenska</button>
    </main>
  </UiAppShell>
</template>

<style lang="scss" scoped>
.kad {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
  padding-bottom: $spacing-5;

  &__back {
    color: var(--muted);
    font-weight: 700;
    text-decoration: none;
    font-size: $font-size-sm;
  }

  &__top {
    display: flex;
    align-items: center;
    gap: $spacing-2;
  }

  &__siiri {
    flex: none;
  }

  &__bubble {
    flex: 1;
    text-align: left;
    background: var(--card);
    color: var(--ink);
    border: $border-width solid var(--honey);
    border-radius: $radius-lg;
    padding: $spacing-2 $spacing-3;
    font: inherit;
    cursor: pointer;
    box-shadow: $shadow-2;
    @include focus-visible;

    b {
      display: block;
      font-size: $font-size-lg;
      color: var(--honey-deep);
    }

    small {
      display: block;
      font-size: $font-size-sm;
      color: var(--muted);
    }
  }

  &__round {
    margin: 0;
    font-size: $font-size-sm;
    color: var(--muted);
    font-weight: 700;

    span {
      margin-right: 0.125rem;
      opacity: 0.3;

      &.on {
        opacity: 1;
        color: var(--honey);
      }
    }
  }

  &__stage {
    position: relative;
    border-radius: $radius-lg;
    overflow: hidden;
    border: $border-width solid var(--line);
    box-shadow: $shadow-3;
    line-height: 0;
  }

  &__stage--find {
    cursor: pointer;
  }

  &__room :deep(.roomsvg) {
    width: 100%;
    height: auto;
    display: block;
  }

  /* ögonlocken: två mörka halvor som glider ihop */
  &__lid {
    position: absolute;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(var(--bg), color-mix(in srgb, var(--bg) 85%, #000));
    transition: transform 0.7s cubic-bezier(0.6, 0, 0.3, 1);
    z-index: 2;
    pointer-events: none;

    &--top {
      top: 0;
      transform: translateY(-101%);
      border-bottom: 0.25rem solid color-mix(in srgb, var(--honey) 60%, transparent);
    }

    &--bottom {
      bottom: 0;
      transform: translateY(101%);
      border-top: 0.25rem solid color-mix(in srgb, var(--honey) 60%, transparent);
    }

    &--shut {
      transform: translateY(0);
    }
  }

  &__shut {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 3.5rem;
    z-index: 3;
    line-height: 1;
    animation: kad-peek 2.6s ease-in-out;
  }

  &__sparkle {
    position: absolute;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    z-index: 2;
    pointer-events: none;
    animation: kad-sparkle 1.4s ease forwards;
  }

  &__choices {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(6.5rem, 1fr));
    gap: $spacing-2;
  }

  &__choice {
    padding: $spacing-3 $spacing-2;
    border-radius: $radius-md;
    border: $border-width solid var(--honey);
    background: var(--card);
    color: var(--ink);
    font: inherit;
    cursor: pointer;
    box-shadow: $shadow-2;
    animation: kad-pop 0.35s cubic-bezier(0.34, 1.5, 0.5, 1);
    @include focus-visible;

    b {
      display: block;
      font-size: $font-size-lg;
    }

    small {
      display: block;
      color: var(--muted);
      font-size: $font-size-sm;
    }

    &:active {
      transform: scale(0.97);
    }
  }

  &__hint {
    margin: 0;
    text-align: center;
    font-size: $font-size-sm;
    color: var(--muted);
  }

  &__sv {
    align-self: center;
    border: none;
    background: none;
    color: var(--muted);
    font: inherit;
    font-size: $font-size-sm;
    cursor: pointer;
    text-decoration: underline;
  }

  &__done {
    text-align: center;

    h2 {
      margin: 0 0 $spacing-2;

      small {
        color: var(--muted);
        font-weight: 500;
        font-size: $font-size-md;
      }
    }

    p {
      margin: 0 0 $spacing-2;
    }
  }

  &__stars {
    font-size: $font-size-lg;
    font-weight: 700;
  }

  &__row {
    display: flex;
    gap: $spacing-3;
    justify-content: center;
    align-items: center;
  }

  &__home {
    color: var(--muted);
    font-weight: 700;
  }
}

@keyframes kad-peek {
  0%,
  100% {
    opacity: 0;
  }
  20%,
  80% {
    opacity: 1;
  }
}

@keyframes kad-sparkle {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.4);
  }
  30% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.4);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -80%) scale(1);
  }
}

@keyframes kad-pop {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
}

@media (prefers-reduced-motion: reduce) {
  .kad__lid {
    transition: none;
  }

  .kad__shut,
  .kad__sparkle,
  .kad__choice {
    animation: none;
  }
}
</style>
