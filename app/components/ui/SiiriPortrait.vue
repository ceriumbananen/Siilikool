<script setup lang="ts">
/* Igelkotten Siiri - porterat från siilSVG() i public/legacy/app.js (rad 4966-5057), som
   själva teckningen (app/utils/siiri-portrait.ts: wearSVG/furLayer/FURS/EYES, porterat nästan
   ordagrant). Basbilden (window.SIIRI_IMG i public/legacy/data.js, ~230kB base64) är extraherad
   till public/images/siiri/siiri-body.webp en gång för alla - se git-historiken för
   extraheringen - istället för att hämta hela data.js (566kB, mest ljudbanker) bara för en bild.

   Tre hemligheter är portade, alla kopplade till samma figur precis som i legacy
   (public/legacy/app.js rad 5478-5814, 5570-5583):
   - "Kõdi" (tickle): håll in och vicka fram och tillbaka över figuren 10 gånger, eller knacka
     6 gånger snabbt (inom 1,2s).
   - "Kuldne Siiri" (gold): håll in i 1,1 sekunder utan att vicka.
   - "Aptsihh" (sneeze): knacka 3 gånger snabbt (inom 1,5s) på nosen.

   Medvetet utelämnat (kosmetiska lager ovanpå spelmekaniken, inte kärnan i hemligheterna):
   - Konfettin (burst()) - hör till en helt egen canvas-partikelmotor (public/legacy/app.js,
     <canvas id="fx"> i LegacyApp.vue) som bara finns på hemskärmen.
   - "+40"-texten som flyger iväg (flyXp) och den stora rang-upp-overlayn (rankUp) när ett
     hemlighets-XP råkar trigga en ny rang - XP:t och rangen uppdateras ändå korrekt och syns
     direkt i AppShell:s nivåmätare, bara utan fanfaren.
   - Ögonen som följer muspekaren (mLook) och den synkade munrörelsen när hon "pratar"
     (mJaw/speak) - hemligheterna visar sin replik som text istället för att läsa upp den,
     eftersom speak() hör till hela tal-ut-motorn (ordförråd + ljudbanker), inte bara namn
     (jfr app/utils/name-audio.ts, som är fristående och redan portad).
   - Dansens detaljerade arm/öra-koreografi (bara helfigursanimationen siiridance är med). */

const profile = useProfileStore();

const furObj = computed(() => myFur(profile.state.fur as string | undefined));
const eyeObj = computed(() => myEye(profile.state.eye as string | undefined));
const isCool = computed(() => profile.state.diff === "svar");

const wear = computed(() => profile.state.wear as Wear | undefined);
const owned = computed(() => profile.state.owned as string[] | undefined);

/* ryggplagg: vissa (ryggsäck, vingar m.fl.) visas i två delar - en bakom figuren, en
 * framför - övriga visas som vanligt, helt bakom. Samma lista som siilSVG. */
const BACK_DOUBLE = ["kott", "tiivad", "paasuke2", "draakon", "ring"];
const isDoubleBack = computed(() => {
  const id = wearing(wear.value, "back");
  return !!id && BACK_DOUBLE.includes(id);
});
const wearBackBehind = computed(() =>
  isDoubleBack.value ? wearSVG(wear.value, owned.value, "back", "back") : wearSVG(wear.value, owned.value, "back"),
);
const wearBackFront = computed(() => (isDoubleBack.value ? wearSVG(wear.value, owned.value, "back", "front") : ""));
const wearScene = computed(() => wearSVG(wear.value, owned.value, "scene"));
const wearAura = computed(() => wearSVG(wear.value, owned.value, "aura"));
const wearOutfit = computed(() => wearSVG(wear.value, owned.value, "outfit"));
const wearNeck = computed(() => wearSVG(wear.value, owned.value, "neck"));
const wearHead = computed(() => wearSVG(wear.value, owned.value, "head"));
const wearHand = computed(() => wearSVG(wear.value, owned.value, "hand"));
const furHtml = computed(() => furLayer(furObj.value, "s"));

function wearing(w: Wear | undefined, slot: string): string | null {
  return (w || {})[slot] || null;
}

/* ---------- ljud (tone/buzz), fristående Web Audio - ingen legacy-motor behövs ---------- */
let audioCtx: AudioContext | null = null;
function tone(freq: number, dur: number, when = 0, type: OscillatorType = "sine") {
  if (!profile.state.sound) return;
  try {
    if (!audioCtx) audioCtx = new AudioContext();
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
function sndLvl() {
  tone(523, 0.14, 0);
  tone(659, 0.14, 0.12);
  tone(784, 0.14, 0.24);
  tone(1047, 0.3, 0.36);
}

/* ---------- hemligheter: hitta, belöna, visa ---------- */
function foundSecret(id: string): boolean {
  const secrets = (profile.state.secrets as string[] | undefined) || [];
  if (secrets.includes(id)) return false;
  profile.state.secrets = [...secrets, id];
  profile.save();
  return true;
}
function addXp(n: number) {
  profile.state.xp = (profile.state.xp || 0) + n;
  profile.save();
}

const secretOverlay = ref<{ em: string; et: string; sv: string } | null>(null);
function showSecret(em: string, et: string, sv: string) {
  secretOverlay.value = { em, et, sv };
}
function closeSecret() {
  secretOverlay.value = null;
}

/* ---------- figurens tillstånd (CSS-klasser + inline eye-squint) ---------- */
const golden = ref(false);
const giggle = ref(false);
const wob = ref(false);
const dancing = ref(false);
const mood = ref("");
let danceTimer: ReturnType<typeof setTimeout> | undefined;

const svgClasses = computed(() => [
  "siiri-portrait__svg",
  isCool.value && "siiri-portrait__svg--cool",
  golden.value && "siiri-portrait__svg--golden",
  giggle.value && "siiri-portrait__svg--giggle",
  wob.value && "siiri-portrait__svg--wob",
  dancing.value && "siiri-portrait__svg--dance",
  mood.value && `siiri-portrait__svg--mood-${mood.value}`,
]);

function mMood(m: string) {
  mood.value = m;
}
function happyEyes(on: boolean) {
  const el = document.getElementById("s-eyeL");
  const er = document.getElementById("s-eyeR");
  const l = document.getElementById("s-irisL");
  const r = document.getElementById("s-irisR");
  if (!el || !er) return;
  el.style.transform = on ? "scaleY(.55)" : "";
  er.style.transform = on ? "scaleY(.55)" : "";
  el.style.transformOrigin = "76.4px 91.4px";
  er.style.transformOrigin = "123.2px 90.7px";
  if (l) l.style.opacity = on ? ".25" : "";
  if (r) r.style.opacity = on ? ".25" : "";
}
function dance(big: boolean) {
  dancing.value = false;
  requestAnimationFrame(() => (dancing.value = true));
  mMood("cheer");
  happyEyes(true);
  clearTimeout(danceTimer);
  danceTimer = setTimeout(() => {
    dancing.value = false;
    happyEyes(false);
    mMood("");
  }, 2200);
  if (profile.state.sound) {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, i * 0.16));
    if (big) {
      tone(1319, 0.3, 0.66);
      tone(1047, 0.3, 0.66);
    }
  }
}

function goldenSiiri() {
  golden.value = true;
  setTimeout(() => (golden.value = false), 4200);
  sndLvl();
  mMood("cheer");
  const isNew = foundSecret("gold");
  showSecret("🌟", "Vaata, ma olen kuldne siil!", "Titta, jag är en gyllene igelkott!");
  if (isNew) addXp(40);
}
function tickleSiiri() {
  buzz(30);
  giggle.value = true;
  setTimeout(() => (giggle.value = false), 1600);
  tone(880, 0.08, 0);
  tone(1100, 0.08, 0.09);
  tone(1320, 0.12, 0.18);
  const isNew = foundSecret("tickle");
  showSecret("🤭", "Kõdi! Ära kõdista mind!", "Det kittlas! Sluta kittla mig!");
  if (isNew) addXp(40);
}
function sneeze() {
  wob.value = true;
  setTimeout(() => (wob.value = false), 700);
  tone(880, 0.07, 0, "triangle");
  tone(420, 0.22, 0.08, "triangle");
  const isNew = foundSecret("sneeze");
  showSecret("🤧", "Aptsihh! Vabandust.", "Atjo! Ursäkta.");
  if (isNew) addXp(40);
}

/* ---------- gest-igenkänning: håll+vicka eller 6 snabba knack = kittla, 1,1s långt
 * tryck = gyllene, 3 snabba knack på nosen = nysning. Samma trösklar som legacy
 * (public/legacy/app.js rad 5700-5814). Lyssnar på hela dokumentet, precis som förut,
 * eftersom pekaren ofta hinner utanför den lilla SVG:n mellan två vickningar. */
const TK = { on: false, x: 0, turns: 0, lastDir: 0, level: 0 };
let pressTimer: ReturnType<typeof setTimeout> | undefined;
let tapCount = 0;
let tapTimer: ReturnType<typeof setTimeout> | undefined;
let noseTaps = 0;
let noseTimer: ReturnType<typeof setTimeout> | undefined;

function tickleReset() {
  TK.on = false;
  TK.turns = 0;
  TK.lastDir = 0;
  TK.level = 0;
}
function onPointerMove(e: PointerEvent) {
  if (!TK.on) return;
  const dx = e.clientX - TK.x;
  if (Math.abs(dx) < 16) return;
  const dir = dx > 0 ? 1 : -1;
  if (TK.lastDir && dir !== TK.lastDir) TK.turns++;
  TK.lastDir = dir;
  TK.x = e.clientX;
  if (TK.turns >= 3 && TK.level < 1) {
    TK.level = 1;
    giggle.value = true;
    mMood("cheer");
  }
  if (TK.turns >= 6 && TK.level < 2) {
    TK.level = 2;
    tone(1100, 0.06, 0);
    happyEyes(true);
  }
  if (TK.turns >= 10 && TK.level < 3) {
    TK.level = 3;
    giggle.value = false;
    tickleSiiri();
    setTimeout(() => dance(true), 420);
    tickleReset();
  }
}
function onPointerDown(e: PointerEvent) {
  const target = e.target as HTMLElement | null;
  if (target?.closest?.("#s-nose-hit")) {
    noseTaps++;
    clearTimeout(noseTimer);
    noseTimer = setTimeout(() => (noseTaps = 0), 1500);
    tone(660, 0.05, 0);
    if (noseTaps >= 3) {
      noseTaps = 0;
      sneeze();
    }
    return;
  }
  if (!target?.closest?.("#s-svg")) return;
  TK.on = true;
  TK.x = e.clientX;
  TK.turns = 0;
  TK.lastDir = 0;
  TK.level = 0;
  clearTimeout(pressTimer);
  pressTimer = setTimeout(() => {
    pressTimer = undefined;
    tapCount = 0;
    goldenSiiri();
  }, 1100);
}
function onPointerUp(e: PointerEvent) {
  if (TK.on) {
    giggle.value = false;
    if (TK.level > 0 && TK.level < 3) {
      happyEyes(false);
      mMood("");
    }
    tickleReset();
  }
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = undefined;
    const target = e.target as HTMLElement | null;
    if (target?.closest?.("#s-svg")) {
      tapCount++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => (tapCount = 0), 1200);
      if (tapCount >= 6) {
        tapCount = 0;
        tickleSiiri();
        setTimeout(() => dance(true), 420);
      }
    }
  }
}
function onPointerCancel() {
  clearTimeout(pressTimer);
  pressTimer = undefined;
}

onMounted(() => {
  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.addEventListener("pointerup", onPointerUp, { passive: true });
  document.addEventListener("pointercancel", onPointerCancel, { passive: true });
});
onUnmounted(() => {
  document.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerdown", onPointerDown);
  document.removeEventListener("pointerup", onPointerUp);
  document.removeEventListener("pointercancel", onPointerCancel);
  clearTimeout(pressTimer);
  clearTimeout(tapTimer);
  clearTimeout(noseTimer);
  clearTimeout(danceTimer);
});
</script>

<template>
  <span class="siiri-portrait">
    <svg id="s-svg" :class="svgClasses" viewBox="0 0 200 200" role="img" aria-label="Igelkotten Siiri">
      <defs>
        <radialGradient id="sg-aura" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stop-color="rgba(255,214,110,0)" />
          <stop offset="80%" stop-color="rgba(255,206,92,.38)" />
          <stop offset="100%" stop-color="rgba(255,186,40,0)" />
        </radialGradient>
        <radialGradient id="sg-lid" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stop-color="#FFFDF8" />
          <stop offset="70%" stop-color="#FAF2E6" />
          <stop offset="100%" stop-color="#F1E3D0" />
        </radialGradient>
        <linearGradient id="sg-lens" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stop-color="#4A4A58" />
          <stop offset="45%" stop-color="#16161E" />
          <stop offset="100%" stop-color="#2B2B38" />
        </linearGradient>
        <linearGradient id="sg-frame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#5E5E6E" />
          <stop offset="50%" stop-color="#1A1A22" />
          <stop offset="100%" stop-color="#43434F" />
        </linearGradient>
        <image
          id="siiriPic"
          href="/images/siiri/siiri-body.webp"
          x="0"
          y="0"
          width="200"
          height="200"
          preserve-aspect-ratio="xMidYMid meet"
        />
      </defs>
      <g id="s-all">
        <g id="s-head">
          <g v-html="wearScene" />
          <g v-html="wearBackBehind" />
          <use href="#siiriPic" />
          <g v-html="furHtml" />
          <g v-html="wearBackFront" />
          <g v-html="wearAura" />
          <g v-html="wearOutfit" />
          <g v-html="wearNeck" />
          <g v-html="wearHead" />
          <g v-html="wearHand" />
          <!-- platshållare som minspelet (happyEyes/dance) animerar -->
          <g id="s-armL" />
          <g id="s-armR" />
          <g id="s-flower" />
          <g id="s-browL">
            <path
              d="M66 75 q9 -4 17 -1"
              stroke="#C3A88C"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              opacity=".45"
            />
          </g>
          <g id="s-browR">
            <path
              d="M116 74 q9 -4 17 1"
              stroke="#C3A88C"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              opacity=".45"
            />
          </g>
          <!-- ögonlock: samma färg som pälsen, syns när hon blinkar -->
          <ellipse cx="76.4" cy="91.4" rx="10.3" ry="11" fill="url(#sg-lid)" />
          <ellipse cx="123.2" cy="90.7" rx="10.3" ry="11" fill="url(#sg-lid)" />
          <g id="s-eyeL">
            <ellipse cx="76.4" cy="91.4" rx="9.2" ry="9.9" fill="#080605" />
            <circle id="s-irisL" cx="76.4" cy="91.4" r="5.6" :fill="eyeObj.c" />
            <circle cx="76.4" cy="91.4" r="3.0" fill="#000" />
            <circle cx="74.2" cy="88.8" r="2.6" fill="#fff" />
            <circle cx="79.1" cy="94.2" r="1.5" fill="#fff" opacity=".6" />
            <path d="M70.4 95.4 q6 5 12 1" stroke="#6E5F55" stroke-width="1" fill="none" opacity=".3" />
          </g>
          <g id="s-eyeR">
            <ellipse cx="123.2" cy="90.7" rx="9.2" ry="9.9" fill="#080605" />
            <circle id="s-irisR" cx="123.2" cy="90.7" r="5.6" :fill="eyeObj.c" />
            <circle cx="123.2" cy="90.7" r="3.0" fill="#000" />
            <circle cx="121.0" cy="88.1" r="2.6" fill="#fff" />
            <circle cx="125.9" cy="93.5" r="1.5" fill="#fff" opacity=".6" />
            <path d="M117.2 94.7 q6 5 12 1" stroke="#6E5F55" stroke-width="1" fill="none" opacity=".3" />
          </g>
          <!-- solglasögon (svår nivå) -->
          <g id="s-shades">
            <path
              d="M59 87 Q67 82 73 85"
              stroke="url(#sg-frame)"
              stroke-width="3.4"
              fill="none"
              stroke-linecap="round"
            />
            <path
              d="M140 86 Q132 81 126 84"
              stroke="url(#sg-frame)"
              stroke-width="3.4"
              fill="none"
              stroke-linecap="round"
            />
            <path
              d="M94 88 Q100 85 106 88"
              stroke="url(#sg-frame)"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
            />
            <path
              d="M66 81 h26 q5 0 5 5 q0 12 -8 16 q-7 4 -14 0 q-7 -4 -10 -14 q-1 -7 1 -7 Z"
              fill="url(#sg-lens)"
              stroke="url(#sg-frame)"
              stroke-width="2.8"
            />
            <path
              d="M134 80 h-26 q-5 0 -5 5 q0 12 8 16 q7 4 14 0 q7 -4 10 -14 q1 -7 -1 -7 Z"
              fill="url(#sg-lens)"
              stroke="url(#sg-frame)"
              stroke-width="2.8"
            />
            <path d="M71 85 l9 0 -11 11 0 -7 Z" fill="#fff" opacity=".45" />
            <path d="M113 84 l9 0 -11 11 0 -7 Z" fill="#fff" opacity=".45" />
            <g id="s-glint">
              <path d="M128 83 l1.9 4 4.2 .6 -3 3 .8 4.2 -3.9 -2.1 -3.8 2.1 .7 -4.2 -3 -3 4.2 -.6 Z" fill="#FFF7C4" />
            </g>
          </g>
          <!-- munnen: illustrationens leende syns som det är, ingen pratanimation här -->
          <circle id="s-nose-hit" cx="99.5" cy="106" r="13" fill="#fff" opacity="0" style="cursor: pointer" />
        </g>
      </g>
    </svg>
    <span class="siiri-portrait__shadow" />

    <div v-if="secretOverlay" class="siiri-portrait__overlay" role="dialog" aria-modal="true" @click="closeSecret">
      <div class="siiri-portrait__overlay-card" @click.stop>
        <p class="siiri-portrait__overlay-kicker">🤫 Hemlighet!</p>
        <div class="siiri-portrait__overlay-emoji" aria-hidden="true">{{ secretOverlay.em }}</div>
        <h3 lang="et">{{ secretOverlay.et }}</h3>
        <p>{{ secretOverlay.sv }}</p>
        <UiAppButton variant="primary" wide @click="closeSecret">Hihi!</UiAppButton>
      </div>
    </div>
  </span>
</template>

<style lang="scss" scoped>
.siiri-portrait {
  display: inline-block;
  position: relative;
  line-height: 0;
  max-width: 100%;

  &__svg {
    width: clamp(9.375rem, 44vw, 13.125rem); // 150-210px
    height: auto;
    overflow: visible;
    display: block;
    margin: 0 auto;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;

    :deep(g[id]) {
      transform-box: fill-box;
    }

    :deep(#s-all) {
      transform-box: fill-box;
      transform-origin: 50% 100%;
      animation: siiri-breathe 3.6s ease-in-out infinite;
      filter: drop-shadow(0 0.375rem 0.625rem rgba(31, 61, 43, 0.22)); // 6px, 10px
    }

    :deep(#s-eyeL),
    :deep(#s-eyeR) {
      transform-box: view-box;
      animation: siiri-blink 5.4s infinite;
    }
    :deep(#s-eyeL) {
      transform-origin: 76.4px 91.4px;
    }
    :deep(#s-eyeR) {
      transform-origin: 123.2px 90.7px;
    }

    :deep(#s-browL),
    :deep(#s-browR),
    :deep(#s-armL),
    :deep(#s-armR),
    :deep(#s-flower) {
      transform-origin: 50% 50%;
      transition: transform 0.28s cubic-bezier(0.3, 1.4, 0.5, 1);
    }
    :deep(#s-armL) {
      transform-origin: 80% 10%;
    }
    :deep(#s-armR) {
      transform-origin: 20% 10%;
    }
    :deep(#s-flower) {
      transform-origin: 50% 100%;
      animation: siiri-sway 2.8s ease-in-out infinite;
    }

    :deep(#s-shades) {
      opacity: 0;
      transform: translateY(-1.375rem) rotate(-6deg); // -22px
      transform-origin: 50% 50%;
      transition:
        opacity 0.3s ease,
        transform 0.45s cubic-bezier(0.2, 1.5, 0.45, 1);
      pointer-events: none;
    }
    :deep(#s-glint) {
      transform-box: fill-box;
      transform-origin: center;
      opacity: 0;
    }

    &--cool {
      :deep(#s-shades) {
        opacity: 1;
        transform: translateY(0) rotate(0);
      }
      :deep(#s-browL),
      :deep(#s-browR) {
        opacity: 0;
      }
      :deep(#s-glint) {
        animation: siiri-glint 3.4s ease-in-out infinite;
      }
    }

    &--golden {
      filter: sepia(0.9) saturate(3.2) hue-rotate(-14deg) brightness(1.12)
        drop-shadow(0 0 0.875rem rgba(246, 185, 59, 0.85)); // 14px
      animation: siiri-goldspin 1.6s ease;
    }

    &--giggle {
      animation: siiri-giggle 0.5s ease 3;
    }

    &--wob {
      animation: siiri-wob 0.5s ease;
    }

    &--dance {
      animation: siiri-dance 2.1s cubic-bezier(0.34, 1.3, 0.5, 1) 1;
    }

    @media (prefers-reduced-motion: reduce) {
      &--dance,
      &--wob {
        animation: none !important;
      }
    }
  }

  &__shadow {
    position: absolute;
    left: 18%;
    right: 18%;
    bottom: 1%;
    height: 8%;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba(40, 30, 15, 0.28), rgba(40, 30, 15, 0));
    pointer-events: none;
  }

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(12, 28, 18, 0.55);
    padding: $spacing-3;
    line-height: normal; // .siiri-portrait sätter line-height:0 för den täta SVG-inramningen -
    // den ärvs annars hit och kraschar all text i rutan på varandra
  }

  &__overlay-card {
    background: var(--card);
    border: $border-width solid #6b4fd8;
    border-radius: $radius-card;
    padding: $spacing-4;
    max-width: 22rem; // 352px
    width: 100%;
    text-align: center;
    box-shadow: $shadow-3;

    h3 {
      font-size: $font-size-xl;
      margin: $spacing-1 0;
    }

    p {
      margin: 0 0 $spacing-3;
    }
  }

  &__overlay-kicker {
    font-weight: 700;
    margin: 0 0 $spacing-1;
  }

  &__overlay-emoji {
    font-size: 4rem; // 64px
    line-height: 1;
  }
}

@keyframes siiri-breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.022);
  }
}

@keyframes siiri-blink {
  0%,
  95.5%,
  100% {
    transform: scaleY(1);
  }
  97.5% {
    transform: scaleY(0.08);
  }
}

@keyframes siiri-sway {
  0%,
  100% {
    transform: rotate(-7deg);
  }
  50% {
    transform: rotate(7deg);
  }
}

@keyframes siiri-glint {
  0%,
  70%,
  100% {
    opacity: 0;
    transform: scale(0.4);
  }
  80% {
    opacity: 1;
    transform: scale(1.1);
  }
  90% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

@keyframes siiri-goldspin {
  0% {
    transform: scale(1) rotate(0);
  }
  30% {
    transform: scale(1.18) rotate(-10deg);
  }
  60% {
    transform: scale(1.12) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0);
  }
}

@keyframes siiri-giggle {
  0%,
  100% {
    transform: translateX(0) rotate(0);
  }
  25% {
    transform: translateX(-0.4375rem) rotate(-5deg); // -7px
  }
  75% {
    transform: translateX(0.4375rem) rotate(5deg); // 7px
  }
}

@keyframes siiri-wob {
  0%,
  100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-6deg);
  }
  75% {
    transform: rotate(6deg);
  }
}

@keyframes siiri-dance {
  0% {
    transform: rotate(0deg) translateY(0) scale(1);
  }
  10% {
    transform: rotate(-7deg) translateY(-0.625rem) scale(1.04, 0.97); // -10px
  }
  22% {
    transform: rotate(6deg) translateY(0) scale(0.97, 1.05);
  }
  34% {
    transform: rotate(-6deg) translateY(-0.75rem) scale(1.05, 0.96); // -12px
  }
  46% {
    transform: rotate(5deg) translateY(0) scale(0.98, 1.04);
  }
  58% {
    transform: rotateY(180deg) translateY(-0.5rem) scale(1.02); // -8px
  }
  70% {
    transform: rotateY(360deg) translateY(0) scale(1);
  }
  82% {
    transform: rotate(-4deg) translateY(-0.4375rem) scale(1.03, 0.98); // -7px
  }
  92% {
    transform: rotate(3deg) translateY(0) scale(0.99, 1.02);
  }
  100% {
    transform: rotate(0deg) translateY(0) scale(1);
  }
}
</style>
