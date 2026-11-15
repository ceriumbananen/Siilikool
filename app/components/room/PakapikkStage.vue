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

    <!-- nissen tittar fram där saken låg -->
    <div
      v-if="pak.mode.value === 'peek'"
      class="pak-peek"
      :style="{ left: `${pak.target.value.peek[0]}%`, top: `${pak.target.value.peek[1]}%` }"
    >
      <svg class="pak-peek__elf" viewBox="0 0 60 72" aria-hidden="true">
        <path d="M9 36 Q22 -4 50 8 Q42 18 51 36 Z" fill="#c8352e" stroke="#8e211c" stroke-width="1.5" />
        <circle cx="50" cy="8" r="4.5" fill="#fbf7ef" />
        <rect x="7" y="31" width="46" height="9" rx="4.5" fill="#fbf7ef" stroke="#d9cfbf" />
        <circle cx="30" cy="48" r="12" fill="#f4c9a8" />
        <path d="M17 50 Q19 70 30 71 Q41 70 43 50 Q37 56 30 56 Q23 56 17 50 Z" fill="#fbf7ef" stroke="#d9cfbf" />
        <circle cx="25" cy="45" r="1.8" fill="#3a2a20" />
        <circle cx="35" cy="45" r="1.8" fill="#3a2a20" />
        <circle cx="30" cy="50" r="3.6" fill="#e58f7a" />
        <circle cx="21" cy="50" r="2.2" fill="#ef9c8f" opacity="0.6" />
        <circle cx="39" cy="50" r="2.2" fill="#ef9c8f" opacity="0.6" />
      </svg>
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

  &__elf {
    position: absolute;
    width: clamp(2.75rem, 12vw, 3.75rem);
    max-width: none; /* den globala max-width: 100% (legacy/style.css) gör den 0 bred här */
    height: auto;
    transform: translate(-50%, -100%);
    transform-origin: 50% 100%;
    animation: pak-peek-up 2.3s cubic-bezier(0.34, 1.5, 0.5, 1) forwards;
    filter: drop-shadow(0 2px 3px rgba(40, 25, 10, 0.35));
  }

  &__bubble {
    position: absolute;
    bottom: clamp(3.5rem, 15vw, 4.75rem);
    left: 0;
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

@keyframes pak-peek-up {
  0% {
    opacity: 0;
    transform: translate(-50%, -40%) scale(0.4);
  }
  18% {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1);
  }
  30% {
    transform: translate(-50%, -100%) rotate(-8deg);
  }
  42% {
    transform: translate(-50%, -100%) rotate(8deg);
  }
  54%,
  86% {
    transform: translate(-50%, -100%) rotate(0);
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -60%) scale(0.7);
  }
}

@keyframes pak-pop {
  0%,
  14% {
    opacity: 0;
    transform: translateX(-50%) scale(0.8);
  }
  24%,
  86% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
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
