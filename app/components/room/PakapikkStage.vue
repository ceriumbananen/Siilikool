<script setup lang="ts">
/* Päkapiku kirjad i själva rummet (ligger inuti room.vue:s scen): julstrumpan under
   fönsterbrädan och dagens brev, rutorna man letar i, "Ei ole siin" vid fel ställe och nissen som tittar fram
   vid rätt. Logiken i app/composables/usePakapikk.ts. */
const pak = usePakapikk();

/* bildernas proportioner (public/images/room/pak-letter.webp, pak-stocking.webp) */
const LETTER_W = 520,
  LETTER_H = 386,
  STOCKING_W = 360,
  STOCKING_H = 779;
/* dagens brev: var nissen lagt det (pakDrop) */
const drop = computed(() => (pak.waiting.value ? pakDrop(pak.waiting.value) : null));
/** x/y/bredd/höjd för en sak som står på (x, y) i rummet, w bred, med en bild i proportionerna vw:vh. */
function box(d: PakDrop, vw: number, vh: number) {
  const h = (d.w * vh) / vw;
  return { x: d.x - d.w / 2, y: d.y - h, width: d.w, height: h };
}

/* nissen (public/images/room/pak-elf.webp, 520x562): kanten han lutar sig mot ligger 82,35 %
   ner i bilden - under den syns bara vanten som hänger över kanten */
/* den liggande tomten (pak-elf-rug.webp, 600x510): mattkanten ligger över hans rygg, 40 % ner */
const ELF_POSES = {
  edge: { src: "/images/room/pak-elf.webp", ratio: 562 / 520, edge: 0.8235 },
  rug: { src: "/images/room/pak-elf-rug.webp", ratio: 510 / 600, edge: 0.403 },
};
const peekBox = ref<{
  left: number;
  top: number;
  width: number;
  behind: boolean;
  bubble: "center" | "start" | "end" | "side";
  pose: "edge" | "rug";
} | null>(null);
/* var nissen tittar fram, i procent av scenen (rummet är 400x270 enheter). Vid Siiri finns
   ingen fast kant - hon skalar inte med rummet - så där räknas den fram ur hennes faktiska
   storlek, och nissen ritas bakom henne och tittar fram över hennes axel. */
watch(
  () => pak.mode.value,
  m => {
    if (m !== "peek" || !pak.target.value) return;
    let { x, edge, w } = pak.target.value.peek;
    const pose = pak.target.value.peek.pose || "edge";
    const P = ELF_POSES[pose];
    let behind = false;
    if (pak.target.value.id === "siiri") {
      const siiri = document.querySelector(".room-page__flip");
      const stage = siiri?.closest(".room-page__stage");
      if (siiri && stage) {
        const r = siiri.getBoundingClientRect(),
          st = stage.getBoundingClientRect(),
          u = 400 / st.width;
        w = r.width * u * 0.5;
        x = (r.left - st.left + r.width * 0.78) * u;
        edge = (r.top - st.top + r.height * 0.36) * u;
        behind = true;
      }
    }
    const h = w * P.ratio;
    const top = ((edge - h * P.edge) / 270) * 100;
    /* pratbubblan ska inte hamna utanför rummet: vid överkanten (flaggan) åt sidan, vid
       sidokanterna (gardinen) inåt i stället för centrerad */
    const bubble = top < 14 ? "side" : x < 70 ? "start" : x > 330 ? "end" : "center";
    peekBox.value = { left: ((x - w / 2) / 400) * 100, top, width: (w / 400) * 100, behind, bubble, pose };
  },
);

const targets = computed(() => Object.values(PAK_TARGETS).filter(t => t.rects.length));
const hint = computed(() => pak.wrong.value >= 2);

/* den tomma julstrumpan: nissen kommer snart / nytt brev i morgon / god jul */
const soonSaid = ref(0);
let soonTimer: ReturnType<typeof setTimeout> | undefined;
function onSlipper() {
  if (pak.waiting.value) return pak.openWaiting();
  pak.soon();
  soonSaid.value++;
  clearTimeout(soonTimer);
  soonTimer = setTimeout(() => (soonSaid.value = 0), 2200);
}

function tap(id: PakTargetId, e: MouseEvent, rect: [number, number, number, number]) {
  const box = (e.currentTarget as HTMLElement).parentElement!.getBoundingClientRect();
  const x = e.clientX ? ((e.clientX - box.left) / box.width) * 100 : rect[0] + rect[2] / 2;
  const y = e.clientY ? ((e.clientY - box.top) / box.height) * 100 : rect[1] + rect[3] / 2;
  pak.tapTarget(id, x, y);
}
</script>

<template>
  <!-- julstrumpan och brevet, ritade i rummets egna koordinater (viewBox 0 0 400 270, samma
       preserveAspectRatio som rummet i room-svg.ts) så att de alltid står på rätt ställe,
       oavsett skärmstorlek -->
  <svg
    v-if="pak.phase.value.phase !== 'off' && !pak.searching.value"
    class="pak-layer"
    viewBox="0 0 400 270"
    preserveAspectRatio="xMidYMid slice"
  >
    <!-- brevet i strumpan ritas bakom den, så att det sticker upp ur den -->
    <g
      v-if="drop && drop.id === 'sokk'"
      class="pak-item pak-item--mail"
      role="button"
      tabindex="0"
      aria-label="Ett brev från tomtenissen ligger i julstrumpan"
      @click.stop="pak.openWaiting()"
      @keydown.enter.prevent="pak.openWaiting()"
    >
      <image v-bind="box(drop, LETTER_W, LETTER_H)" href="/images/room/pak-letter.webp" />
    </g>
    <g
      class="pak-item"
      role="button"
      tabindex="0"
      :aria-label="drop?.id === 'sokk' ? 'Julstrumpan med brevet' : 'Julstrumpan under fönstret'"
      @click.stop="onSlipper"
      @keydown.enter.prevent="onSlipper"
    >
      <image v-bind="box(PAK_STOCKING, STOCKING_W, STOCKING_H)" href="/images/room/pak-stocking.webp" />
    </g>
    <!-- brevet någon annanstans i rummet -->
    <g
      v-if="drop && drop.id !== 'sokk'"
      class="pak-item pak-item--mail"
      role="button"
      tabindex="0"
      aria-label="Ett brev från tomtenissen ligger i rummet"
      @click.stop="pak.openWaiting()"
      @keydown.enter.prevent="pak.openWaiting()"
    >
      <image v-bind="box(drop, LETTER_W, LETTER_H)" href="/images/room/pak-letter.webp" />
    </g>
    <!-- fler brev väntar: en liten siffra vid brevet -->
    <g v-if="drop && pak.waitingCount.value > 1" class="pak-count" aria-hidden="true">
      <circle :cx="drop.x - drop.w / 2" :cy="drop.y - (drop.w * LETTER_H) / LETTER_W" r="6" />
      <text :x="drop.x - drop.w / 2" :y="drop.y - (drop.w * LETTER_H) / LETTER_W + 2.6" text-anchor="middle">
        {{ pak.waitingCount.value }}
      </text>
    </g>
  </svg>

  <div v-if="soonSaid" :key="soonSaid" class="pak-miss pak-miss--soon">
    <b lang="et">{{ pak.emptyLine.value.et }}</b>
    <span>{{ pak.emptyLine.value.sv }}</span>
  </div>

  <!-- jakten: rutorna i rummet (lappens instruktion visas under scenen, RoomPakapikkBanner) -->
  <template v-if="pak.searching.value && pak.target.value">
    <template v-for="t in targets" :key="t.id">
      <button
        v-for="(r, i) in t.rects"
        :key="i"
        class="pak-zone"
        :class="{ 'pak-zone--hint': hint && pak.mode.value === 'search' && pak.target.value.id === t.id }"
        :style="{ left: `${r[0]}%`, top: `${r[1]}%`, width: `${r[2]}%`, height: `${r[3]}%` }"
        :aria-label="t.ask.sv"
        @click.stop="tap(t.id, $event, r)"
      />
    </template>
    <div
      v-if="hint && pak.mode.value === 'search' && pak.target.value.id === 'siiri'"
      class="pak-sparkle"
      aria-hidden="true"
    >
      ✨
    </div>
    <div
      v-if="pak.miss.value"
      :key="pak.miss.value.n"
      class="pak-miss"
      :style="{ left: `${Math.min(86, Math.max(14, pak.miss.value.x))}%`, top: `${Math.max(16, pak.miss.value.y)}%` }"
    >
      <b lang="et">{{ PAK_WRONG.et }}</b>
      <span>{{ PAK_WRONG.sv }}</span>
    </div>

    <!-- nissen tittar fram bakom en kant där saken låg (bilden: vantarna vilar på kanten,
         resten av kroppen är bakom den) -->
    <div
      v-if="pak.mode.value === 'peek' && peekBox"
      class="pak-peek"
      :class="[
        `pak-peek--bubble-${peekBox.bubble}`,
        `pak-peek--${peekBox.pose}`,
        { 'pak-peek--behind': peekBox.behind },
      ]"
      :style="{ left: `${peekBox.left}%`, top: `${peekBox.top}%`, width: `${peekBox.width}%` }"
    >
      <div class="pak-peek__clip">
        <img class="pak-peek__elf" :src="ELF_POSES[peekBox.pose].src" alt="" />
      </div>
      <div class="pak-peek__bubble">
        <b lang="et">{{ pak.target.value.at.et }}</b>
        <span>{{ pak.target.value.at.sv }}</span>
      </div>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.pak-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  pointer-events: none;
}

.pak-item {
  pointer-events: auto;
  cursor: pointer;
  outline: none;
  filter: drop-shadow(0 1.5px 1.2px rgba(40, 25, 10, 0.35));
  transform-box: fill-box;
  transform-origin: 50% 100%;

  &:focus-visible {
    filter: drop-shadow(0 0 2px var(--blue)) drop-shadow(0 0 2px var(--blue));
  }

  &--mail {
    animation: pak-wiggle 3.2s ease-in-out infinite;
  }

  &:active {
    transform: scale(1.12);
  }
}

.pak-count {
  pointer-events: none;

  circle {
    fill: var(--berry);
    stroke: #fff;
    stroke-width: 1;
  }

  text {
    fill: #fff;
    font-size: 7.5px;
    font-weight: 700;
  }
}

.pak-zone {
  position: absolute;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  z-index: 3;
  border-radius: $radius-md;
  @include focus-visible;

  &:active {
    background: rgba(255, 250, 240, 0.25);
  }

  &--hint {
    animation: pak-hint 1.6s ease-in-out infinite;
  }
}

.pak-sparkle {
  position: absolute;
  left: 62%;
  top: 48%;
  font-size: 1.5rem;
  z-index: 5;
  pointer-events: none;
  animation: pak-twinkle 1.2s ease-in-out infinite;
}

.pak-miss {
  position: absolute;
  transform: translate(-50%, -110%);
  background: var(--card);
  border: $border-width solid var(--line);
  border-radius: $radius-md;
  padding: 0.25rem 0.625rem;
  text-align: center;
  line-height: normal;
  box-shadow: $shadow-2;
  pointer-events: none;
  white-space: nowrap;
  z-index: 7;
  animation: pak-shake 0.4s ease;

  b {
    display: block;
    font-size: $font-size-sm;
    color: var(--ink);
  }

  span {
    display: block;
    font-size: $font-size-xs;
    color: var(--muted);
  }
}

.pak-peek {
  position: absolute;
  z-index: 6;
  pointer-events: none;
  line-height: normal;

  /* bakom Siiri (room.vue ger henne z-index 2) */
  &--behind {
    z-index: 1;
  }

  /* den liggande tomten: kryper fram (nedåt, mot oss) under mattkanten */
  &--rug &__clip {
    aspect-ratio: 600 / 510;
    animation-name: pak-peek-clip-rug;
  }

  &--rug &__elf {
    animation-name: pak-peek-crawl;
  }

  &__clip {
    aspect-ratio: 520 / 562;
    overflow: hidden;
    filter: drop-shadow(0 1px 2px rgba(40, 25, 10, 0.35));
    /* medan han reser sig och sjunker klipps han vid kanten, så att kroppen aldrig syns
       framför den - vanten som hänger över kanten kommer fram först när han står still */
    animation: pak-peek-clip 2.3s linear forwards;
  }

  &__elf {
    display: block;
    width: 100%;
    max-width: none;
    height: auto;
    animation: pak-peek-up 2.3s cubic-bezier(0.34, 1.5, 0.5, 1) forwards;
  }

  &--bubble-start &__bubble {
    left: 0;
    transform: none;
  }

  &--bubble-end &__bubble {
    left: auto;
    right: 0;
    transform: none;
  }

  &--bubble-side &__bubble {
    left: auto;
    right: 100%;
    bottom: 30%;
    margin: 0 0.25rem 0 0;
    transform: none;
  }

  &__bubble {
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-bottom: 0.25rem;
    transform: translateX(-50%);
    white-space: nowrap;
    background: #fffaf0;
    border: $border-width solid #c8352e;
    border-radius: $radius-md;
    padding: 0.25rem 0.625rem;
    text-align: center;
    box-shadow: $shadow-2;
    animation: pak-pop 2.3s ease forwards;

    b {
      display: block;
      font-size: $font-size-sm;
      color: #8e211c;
    }

    span {
      display: block;
      font-size: $font-size-xs;
      color: #7a6a58;
    }
  }
}

.pak-miss--soon {
  left: 12%;
  top: 34%;
  transform: translate(-12%, -100%);
  white-space: nowrap;
}

@keyframes pak-wiggle {
  0%,
  78%,
  100% {
    transform: rotate(0);
  }
  82% {
    transform: rotate(-7deg);
  }
  86% {
    transform: rotate(6deg);
  }
  90% {
    transform: rotate(-4deg);
  }
  94% {
    transform: rotate(2deg);
  }
}

@keyframes pak-hint {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(232, 195, 74, 0);
  }
  50% {
    box-shadow:
      0 0 0 0.1875rem rgba(232, 195, 74, 0.9),
      0 0 1.25rem rgba(232, 195, 74, 0.7);
  }
}

@keyframes pak-twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes pak-shake {
  0%,
  100% {
    margin-left: 0;
  }
  25% {
    margin-left: -0.375rem;
  }
  75% {
    margin-left: 0.375rem;
  }
}

@keyframes pak-peek-clip {
  0%,
  19% {
    clip-path: inset(-50% -50% 17.65% -50%);
  }
  20%,
  85% {
    clip-path: inset(-50% -50% 0 -50%);
  }
  86%,
  100% {
    clip-path: inset(-50% -50% 17.65% -50%);
  }
}

@keyframes pak-peek-clip-rug {
  0%,
  19% {
    clip-path: inset(40.3% -50% -50% -50%);
  }
  20%,
  85% {
    clip-path: inset(-50% -50% -50% -50%);
  }
  86%,
  100% {
    clip-path: inset(40.3% -50% -50% -50%);
  }
}

@keyframes pak-peek-crawl {
  0% {
    transform: translateY(-60%);
  }
  20% {
    transform: translateY(0);
  }
  32% {
    transform: translateY(0) rotate(-2deg);
  }
  44% {
    transform: translateY(0) rotate(2deg);
  }
  56%,
  86% {
    transform: translateY(0) rotate(0);
  }
  100% {
    transform: translateY(-60%);
  }
}

/* nissen reser sig bakom kanten, vinkar och sjunker ner igen */
@keyframes pak-peek-up {
  0% {
    transform: translateY(100%);
  }
  20% {
    transform: translateY(0);
  }
  32% {
    transform: translateY(0) rotate(-3deg);
  }
  44% {
    transform: translateY(0) rotate(3deg);
  }
  56%,
  86% {
    transform: translateY(0) rotate(0);
  }
  100% {
    transform: translateY(100%);
  }
}

/* bara opacitet och skala (egen egenskap), så att bubblans placering (transform) får vara kvar */
@keyframes pak-pop {
  0%,
  14% {
    opacity: 0;
    scale: 0.8;
  }
  24%,
  86% {
    opacity: 1;
    scale: 1;
  }
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pak-item--mail,
  .pak-zone--hint,
  .pak-sparkle,
  .pak-miss {
    animation: none;
  }

  .pak-zone--hint {
    box-shadow: 0 0 0 0.1875rem rgba(232, 195, 74, 0.9);
  }

  .pak-peek__elf,
  .pak-peek__bubble {
    animation-duration: 0.01s;
    animation-fill-mode: none;
  }
}
</style>
