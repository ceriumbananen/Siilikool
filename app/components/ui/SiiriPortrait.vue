<script setup lang="ts">
/* Igelkotten Siiri - porterat från siilSVG() i public/legacy/app.js (rad 4966-5057), som
   själva teckningen (app/utils/siiri-portrait.ts: wearSVG/furLayer/FURS/EYES, porterat nästan
   ordagrant). Basbilden (window.SIIRI_IMG i public/legacy/data.js, ~230kB base64) är extraherad
   till public/images/siiri/siiri-body.webp en gång för alla - se git-historiken för
   extraheringen - istället för att hämta hela data.js (566kB, mest ljudbanker) bara för en bild.

   Hon lever som förut (public/legacy/app.js rad 5211-5456, style.css rad 400-1037):
   - andas och blinkar, ögonen följer fingret/muspekaren och hela figuren lutar sig mot det
   - munnen rör sig när hon pratar (useSiiriVoice), humör (glad/ledsen/lyssnar) syns på
     ögonbrynen, hopp och vickning, dans (useSiiri().dance() från resten av appen)
   - solglasögon på svår nivå

   Tre hemligheter sitter på figuren (rad 5459-5583, 5693-5814):
   - "Kõdi" (tickle): håll in och vicka fram och tillbaka över figuren 10 gånger, eller knacka
     6 gånger snabbt (inom 1,2s).
   - "Kuldne Siiri" (gold): håll in i 1,1 sekunder utan att vicka (fingret får glida högst 12px).
   - "Aptsihh" (sneeze): knacka 3 gånger snabbt (inom 1,5s) på nosen.
   De säger sin replik högt, med konfetti och belöning (useRewards: rutorna "Hemlighet!" och
   "Nytt märke" visas av UiSecretOverlay och UiRankUpOverlay i AppShell).

   Att använda henne på en skärm: <UiSiiriPortrait size="small" /> (eller "big"); humör och dans
   styrs från skärmen med useSiiri().mood("cheer" | "oops" | "listen" | "think" | "") och
   useSiiri().dance(big), och hon pratar med useSiiriVoice().say([...klipp]). Flera figurer på
   samma sida går bra - delarna har klasser i stället för id:n, och gesterna gäller den figur man
   rör vid.

   Inte med, eftersom de inte syntes ens i legacy: armarnas, örats och blommans rörelser
   (s-armL/R, s-ear, s-flower är tomma platshållare där också) och humöret "think" (trasig
   CSS-selektor i style.css). */

const {
  size = "normal",
  previewWear,
  previewOwned,
} = defineProps<{
  /** Hur stor figuren är: "normal" (profil, hem), "big" (slutskärmar) eller "small" (bredvid en
   * uppgift) - samma tre storlekar som siilSVG(size) hade - eller "room" (i Tuba). */
  size?: "normal" | "big" | "small" | "room";
  /** Förhandsgranskning i Laat (ShopPreviewOverlay): visar henne med DETTA istället för det
   * riktiga S.wear/S.owned, utan att röra profilen - allt annat (päls, ögon, humör) är hennes
   * egna som vanligt. Utelämnad = det riktiga, sparade utseendet. */
  previewWear?: Wear;
  previewOwned?: string[];
}>();

const profile = useProfileStore();
const { tone, buzz, sndLvl } = useSiiriSound();
const { burst } = useConfetti();
const voice = useSiiriVoice();
const { foundSecret, secretReward, addXp, showSecret } = useRewards();
const { danceRequest, moodRequest } = useSiiri();
/* egna id:n till pälsens färglager, så att flera figurer på samma sida inte delar dem */
const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

const furObj = computed(() => myFur(profile.state.fur as string | undefined));
const eyeObj = computed(() => myEye(profile.state.eye as string | undefined));
const isCool = computed(() => profile.state.diff === "svar");

const wear = computed(() => previewWear ?? (profile.state.wear as Wear | undefined));
const owned = computed(() => previewOwned ?? (profile.state.owned as string[] | undefined));

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
const furHtml = computed(() => furLayer(furObj.value, `s${uid}`));

function wearing(w: Wear | undefined, slot: string): string | null {
  return (w || {})[slot] || null;
}

/* ---------- figurens tillstånd (klasser på svg:n) ---------- */
const golden = ref(false);
const giggle = ref(false);
const dancing = ref(false);
const pulse = ref<"" | "hop" | "wob">("");
const mood = ref<"" | "happy" | "sad" | "listen" | "think" | "talk" | "cheer">("");
const squint = ref(false);
let danceTimer: ReturnType<typeof setTimeout> | undefined;
let pulseTimer: ReturnType<typeof setTimeout> | undefined;
let moodTimer: ReturnType<typeof setTimeout> | undefined;

const svgClasses = computed(() => [
  "siiri-portrait__svg",
  size !== "normal" && `siiri-portrait__svg--${size}`,
  isCool.value && "siiri-portrait__svg--cool",
  golden.value && "siiri-portrait__svg--golden",
  giggle.value && "siiri-portrait__svg--giggle",
  pulse.value && `siiri-portrait__svg--${pulse.value}`,
  dancing.value && "siiri-portrait__svg--dance",
  mood.value && `siiri-portrait__svg--mood-${mood.value}`,
]);

/* restartar en kort animation (hopp/vickning) även om samma redan pågår */
function mPulse(cls: "hop" | "wob", ms = 1200) {
  pulse.value = "";
  clearTimeout(pulseTimer);
  requestAnimationFrame(() => {
    pulse.value = cls;
    pulseTimer = setTimeout(() => (pulse.value = ""), ms);
  });
}
/* glad: ögonbrynen upp och två hopp. Humöret släpps efter en stund, om hon inte pratar. */
function cheer() {
  mood.value = "happy";
  mPulse("hop");
  clearTimeout(moodTimer);
  moodTimer = setTimeout(() => {
    if (!voice.talking.value) mood.value = "";
  }, 1600);
}
/* medan hon pratar har hon humöret "talk" (neutrala ögonbryn), som förut */
watch(voice.talking, on => {
  if (on) mood.value = "talk";
  else if (mood.value === "talk") mood.value = "";
});

/* glada, kisande ögon - samma inline-stil som legacy (blinkningen ligger ovanpå, så det som
 * syns är framför allt de dämpade irisarna) */
const eyeStyleL = computed(() => (squint.value ? { transform: "scaleY(.55)" } : {}));
const eyeStyleR = computed(() => (squint.value ? { transform: "scaleY(.55)" } : {}));
const irisOpacity = computed(() => (squint.value ? 0.25 : undefined));

function dance(big: boolean) {
  dancing.value = false;
  requestAnimationFrame(() => (dancing.value = true));
  mood.value = "cheer";
  squint.value = true;
  clearTimeout(danceTimer);
  danceTimer = setTimeout(() => {
    dancing.value = false;
    squint.value = false;
    mood.value = "";
  }, 2200);
  if (profile.state.sound) {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, i * 0.16));
    if (big) {
      tone(1319, 0.3, 0.66);
      tone(1047, 0.3, 0.66);
    }
  }
}
watch(
  () => danceRequest.n,
  () => dance(danceRequest.big),
);
/* ledsen: ögonbrynen ner och en vickning, släpps efter en stund om hon inte pratar */
function oops() {
  mood.value = "sad";
  mPulse("wob");
  clearTimeout(moodTimer);
  moodTimer = setTimeout(() => {
    if (!voice.talking.value) mood.value = "";
  }, 1800);
}
watch(
  () => moodRequest.n,
  () => {
    const k = moodRequest.kind;
    if (k === "cheer") cheer();
    else if (k === "oops") oops();
    else {
      clearTimeout(moodTimer);
      mood.value = k;
    }
  },
);

/* ---------- munnen: illustrationens leende, eller en öppen mun när hon pratar ---------- */
const MOUTH_Y = 117;
const mouth = computed(() => {
  const v = voice.jaw.value;
  if (v <= 0.04) return null;
  const ry = 1.8 + 8.5 * v;
  return {
    ry,
    rx: 9 + 2.6 * v,
    tongueCy: MOUTH_Y + ry * 0.42,
    tongueRy: 1.0 + 1.8 * v,
    tongueRx: 4.5 + 1.6 * v,
    tongueOpacity: v > 0.35 ? 1 : 0,
  };
});

/* ---------- ögonen följer pekaren, och hela figuren lutar sig mot den ---------- */
const svgEl = ref<SVGSVGElement | null>(null);
const noseEl = ref<SVGCircleElement | null>(null);
const look = ref("translate(0,0)");
const tilt = ref("");
function mLook(cx: number, cy: number) {
  const s = svgEl.value;
  if (!s) return;
  const r = s.getBoundingClientRect();
  const ex = r.left + r.width / 2,
    ey = r.top + r.height * 0.52;
  const W = window.innerWidth || 600,
    H = window.innerHeight || 600;
  /* mät åt vänster och åt höger var för sig: hon sitter sällan mitt på skärmen,
   * så samma måttstock åt båda håll gör att blicken slår i taket åt ena sidan */
  const spanL = Math.max(ex, 60),
    spanR = Math.max(W - ex, 60);
  const spanU = Math.max(ey, 60),
    spanD = Math.max(H - ey, 60);
  const dx = Math.max(-1, Math.min(1, (cx - ex) / (cx < ex ? spanL : spanR)));
  const dy = Math.max(-1, Math.min(1, (cy - ey) / (cy < ey ? spanU : spanD)));
  look.value = `translate(${(dx * 3.2).toFixed(1)},${(dy * 2.8).toFixed(1)})`;
  /* hela figuren vrider sig en aning mot pekaren - djup utan 3D-modell (inte medan hon dansar) */
  if (!dancing.value)
    tilt.value = `perspective(700px) rotateY(${(dx * 7).toFixed(1)}deg) rotateX(${(dy * -4).toFixed(1)}deg)`;
}

/* ---------- hemligheterna ---------- */
function goldenSiiri() {
  golden.value = true;
  setTimeout(() => (golden.value = false), 4200);
  burst(220);
  setTimeout(() => burst(160), 500);
  sndLvl();
  cheer();
  const isNew = foundSecret("gold");
  showSecret("gold", "🌟");
  if (isNew) addXp(40);
}
function tickleSiiri() {
  buzz(30);
  giggle.value = true;
  setTimeout(() => (giggle.value = false), 1600);
  tone(880, 0.08, 0);
  tone(1100, 0.08, 0.09);
  tone(1320, 0.12, 0.18);
  burst(50);
  const isNew = foundSecret("tickle");
  showSecret("tickle", "🤭");
  if (isNew) addXp(40);
}
function sneeze() {
  mPulse("wob", 700);
  tone(880, 0.07, 0, "triangle");
  tone(420, 0.22, 0.08, "triangle");
  burst(40);
  secretReward("sneeze", 40);
  showSecret("sneeze", "🤧");
}

/* ---------- gest-igenkänning: håll+vicka eller 6 snabba knack = kittla, 1,1s långt
 * tryck = gyllene, 3 snabba knack på nosen = nysning. Samma trösklar som legacy
 * (public/legacy/app.js rad 5700-5814). Lyssnar på hela dokumentet, precis som förut,
 * eftersom pekaren ofta hinner utanför den lilla SVG:n mellan två vickningar. */
const TK = { on: false, x: 0, turns: 0, lastDir: 0, level: 0, startX: 0, startY: 0 };
/* Så långt (px) fingret får glida innan det inte längre räknas som att hålla still. Utan gränsen
 * (som i legacy) utlöstes "Kuldne Siiri" mitt i en kittling, eller när man drog runt på henne -
 * vickandet tar längre än 1,1s. */
const HOLD_SLOP = 12;
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
function cancelHold() {
  clearTimeout(pressTimer);
  pressTimer = undefined;
}
function onPointerMove(e: PointerEvent) {
  mLook(e.clientX, e.clientY);
  if (!TK.on) return;
  if (pressTimer && Math.hypot(e.clientX - TK.startX, e.clientY - TK.startY) > HOLD_SLOP) cancelHold();
  const dx = e.clientX - TK.x;
  if (Math.abs(dx) < 16) return;
  const dir = dx > 0 ? 1 : -1;
  if (TK.lastDir && dir !== TK.lastDir) TK.turns++;
  TK.lastDir = dir;
  TK.x = e.clientX;
  if (TK.turns >= 3 && TK.level < 1) {
    TK.level = 1;
    giggle.value = true;
    mood.value = "cheer";
  }
  if (TK.turns >= 6 && TK.level < 2) {
    TK.level = 2;
    tone(1100, 0.06, 0);
    squint.value = true;
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
  const target = e.target as Element | null;
  if (target && noseEl.value?.contains(target)) {
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
  if (!target || !svgEl.value?.contains(target)) return;
  TK.on = true;
  TK.x = TK.startX = e.clientX;
  TK.startY = e.clientY;
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
      squint.value = false;
      mood.value = "";
    }
    tickleReset();
  }
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = undefined;
    const target = e.target as Element | null;
    if (target && svgEl.value?.contains(target)) {
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
/* scroll som tar över fingret, eller fönstret som tappar fokus (släppt utanför fönstret) */
function onPointerCancel() {
  cancelHold();
  if (TK.on) {
    giggle.value = false;
    tickleReset();
  }
}

onMounted(() => {
  /* så att replikerna kommer direkt */
  for (const et of [EGGS.gold!.et, EGGS.tickle!.et, EGGS2.sneeze!.et])
    findWordClip(et).then(c => c && voice.preload([c.src]));
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.addEventListener("pointerup", onPointerUp, { passive: true });
  document.addEventListener("pointercancel", onPointerCancel, { passive: true });
  window.addEventListener("blur", onPointerCancel);
});
onUnmounted(() => {
  window.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerdown", onPointerDown);
  document.removeEventListener("pointerup", onPointerUp);
  document.removeEventListener("pointercancel", onPointerCancel);
  window.removeEventListener("blur", onPointerCancel);
  [pressTimer, tapTimer, noseTimer, danceTimer, pulseTimer, moodTimer].forEach(t => clearTimeout(t));
  voice.hush();
});
</script>

<template>
  <span class="siiri-portrait">
    <svg
      ref="svgEl"
      :class="svgClasses"
      :style="tilt ? { transform: tilt } : undefined"
      viewBox="0 0 200 200"
      role="img"
      aria-label="Igelkotten Siiri"
    >
      <defs>
        <radialGradient id="sg-aura" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stop-color="rgba(255,214,110,0)" />
          <stop offset="80%" stop-color="rgba(255,206,92,.38)" />
          <stop offset="100%" stop-color="rgba(255,186,40,0)" />
        </radialGradient>
        <!-- natthimlen (bakgrunden "taevas" i garderoben) -->
        <radialGradient id="sg-night" cx="38%" cy="26%" r="80%">
          <stop offset="0%" stop-color="#31467F" />
          <stop offset="100%" stop-color="#101B3C" />
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
      <g class="siiri-portrait__all">
        <!-- ljudvågor när hon lyssnar (humöret "listen") -->
        <g class="siiri-portrait__wave">
          <circle cx="14" cy="52" r="6" fill="#3B6CD4" opacity="0" />
          <circle cx="14" cy="52" r="6" fill="#3B6CD4" opacity="0" />
          <circle cx="14" cy="52" r="6" fill="#3B6CD4" opacity="0" />
        </g>
        <g class="siiri-portrait__head">
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
          <!-- platshållare som minspelet animerar (tomma även i legacy) -->
          <g class="siiri-portrait__ear" />
          <g class="siiri-portrait__arm-l" />
          <g class="siiri-portrait__arm-r" />
          <g class="siiri-portrait__flower" />
          <g class="siiri-portrait__brow-l">
            <path
              d="M66 75 q9 -4 17 -1"
              stroke="#C3A88C"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              opacity=".45"
            />
          </g>
          <g class="siiri-portrait__brow-r">
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
          <!-- ögon: iris, pupill och glansprickar flyttas mot pekaren (look) -->
          <g class="siiri-portrait__eye-l" :style="eyeStyleL">
            <ellipse cx="76.4" cy="91.4" rx="9.2" ry="9.9" fill="#080605" />
            <circle
              class="siiri-portrait__iris"
              cx="76.4"
              cy="91.4"
              r="5.6"
              :fill="eyeObj.c"
              :opacity="irisOpacity"
              :transform="look"
            />
            <circle class="siiri-portrait__pupil" cx="76.4" cy="91.4" r="3.0" fill="#000" :transform="look" />
            <circle class="siiri-portrait__gleam" cx="74.2" cy="88.8" r="2.6" fill="#fff" :transform="look" />
            <circle
              class="siiri-portrait__gleam-small"
              cx="79.1"
              cy="94.2"
              r="1.5"
              fill="#fff"
              opacity=".6"
              :transform="look"
            />
            <path d="M70.4 95.4 q6 5 12 1" stroke="#6E5F55" stroke-width="1" fill="none" opacity=".3" />
          </g>
          <g class="siiri-portrait__eye-r" :style="eyeStyleR">
            <ellipse cx="123.2" cy="90.7" rx="9.2" ry="9.9" fill="#080605" />
            <circle
              class="siiri-portrait__iris"
              cx="123.2"
              cy="90.7"
              r="5.6"
              :fill="eyeObj.c"
              :opacity="irisOpacity"
              :transform="look"
            />
            <circle class="siiri-portrait__pupil" cx="123.2" cy="90.7" r="3.0" fill="#000" :transform="look" />
            <circle class="siiri-portrait__gleam" cx="121.0" cy="88.1" r="2.6" fill="#fff" :transform="look" />
            <circle
              class="siiri-portrait__gleam-small"
              cx="125.9"
              cy="93.5"
              r="1.5"
              fill="#fff"
              opacity=".6"
              :transform="look"
            />
            <path d="M117.2 94.7 q6 5 12 1" stroke="#6E5F55" stroke-width="1" fill="none" opacity=".3" />
          </g>
          <!-- solglasögon (svår nivå) -->
          <g class="siiri-portrait__shades">
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
            <g class="siiri-portrait__shades-glint">
              <path d="M128 83 l1.9 4 4.2 .6 -3 3 .8 4.2 -3.9 -2.1 -3.8 2.1 .7 -4.2 -3 -3 4.2 -.6 Z" fill="#FFF7C4" />
            </g>
          </g>
          <!-- munnen: illustrationens leende syns som det är, och när hon pratar läggs en öppen mun över -->
          <circle
            ref="noseEl"
            class="siiri-portrait__nose"
            cx="99.5"
            cy="106"
            r="13"
            fill="#fff"
            opacity="0"
            style="cursor: pointer"
          />
          <path class="siiri-portrait__smile" d="M0 0" stroke="none" fill="none" :opacity="mouth ? 0 : 1" />
          <g class="siiri-portrait__mouth" :opacity="mouth ? 1 : 0">
            <ellipse
              class="siiri-portrait__mouth-open"
              cx="100"
              :cy="MOUTH_Y"
              :rx="mouth ? mouth.rx.toFixed(2) : 9.5"
              :ry="mouth ? mouth.ry.toFixed(2) : 2"
              fill="#6E3540"
            />
            <ellipse
              class="siiri-portrait__tongue"
              cx="100"
              :cy="mouth ? mouth.tongueCy.toFixed(2) : 120"
              :rx="mouth ? mouth.tongueRx.toFixed(2) : 5.5"
              :ry="mouth ? mouth.tongueRy.toFixed(2) : 1.3"
              :opacity="mouth ? mouth.tongueOpacity : 1"
              fill="#E28EA0"
            />
          </g>
        </g>
      </g>
    </svg>
    <span class="siiri-portrait__shadow" />
  </span>
</template>

<style lang="scss" scoped>
.siiri-portrait {
  display: inline-block;
  position: relative;
  line-height: 0;
  max-width: 100%;
  perspective: 700px; // djupet när hon lutar sig mot pekaren (legacy .siiri3d)

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
    transform-style: preserve-3d;
    transition: transform 0.22s ease-out;
    will-change: transform;

    /* figurens egna delar vrids/flyttas kring sig själva (legacy: .siiri g[id]) */
    :deep(.siiri-portrait__head),
    :deep(.siiri-portrait__wave),
    :deep(.siiri-portrait__ear),
    :deep(.siiri-portrait__arm-l),
    :deep(.siiri-portrait__arm-r),
    :deep(.siiri-portrait__flower),
    :deep(.siiri-portrait__brow-l),
    :deep(.siiri-portrait__brow-r),
    :deep(.siiri-portrait__shades),
    :deep(.siiri-portrait__shades-glint) {
      transform-box: fill-box;
    }

    :deep(.siiri-portrait__all) {
      transform-box: fill-box;
      transform-origin: 50% 100%;
      animation: siiri-breathe 3.6s ease-in-out infinite;
      filter: drop-shadow(0 0.375rem 0.625rem rgba(31, 61, 43, 0.22)); // 6px, 10px
    }

    :deep(.siiri-portrait__eye-l),
    :deep(.siiri-portrait__eye-r) {
      transform-box: view-box;
      animation: siiri-blink 5.4s infinite;
    }
    :deep(.siiri-portrait__eye-l) {
      transform-origin: 76.4px 91.4px;
    }
    :deep(.siiri-portrait__eye-r) {
      transform-origin: 123.2px 90.7px;
    }

    :deep(.siiri-portrait__brow-l),
    :deep(.siiri-portrait__brow-r),
    :deep(.siiri-portrait__arm-l),
    :deep(.siiri-portrait__arm-r),
    :deep(.siiri-portrait__flower) {
      transform-origin: 50% 50%;
      transition: transform 0.28s cubic-bezier(0.3, 1.4, 0.5, 1);
    }
    :deep(.siiri-portrait__arm-l) {
      transform-origin: 80% 10%;
    }
    :deep(.siiri-portrait__arm-r) {
      transform-origin: 20% 10%;
    }
    :deep(.siiri-portrait__flower) {
      transform-origin: 50% 100%;
      animation: siiri-sway 2.8s ease-in-out infinite;
    }

    :deep(.siiri-portrait__shades) {
      opacity: 0;
      transform: translateY(-22px) rotate(-6deg); // px = SVG:ns ritenheter
      transform-origin: 50% 50%;
      transition:
        opacity 0.3s ease,
        transform 0.45s cubic-bezier(0.2, 1.5, 0.45, 1);
      pointer-events: none;
    }
    :deep(.siiri-portrait__shades-glint) {
      transform-box: fill-box;
      transform-origin: center;
      opacity: 0;
    }

    &--big {
      width: clamp(11.875rem, 62vw, 18.75rem); // 190-300px
    }
    &--small {
      width: clamp(6rem, 22vw, 8.25rem); // 96-132px
    }
    &--room {
      width: clamp(8.125rem, 34vw, 11.875rem); // 130-190px, som .rsiiri .siiri i legacy
    }

    &--cool {
      :deep(.siiri-portrait__shades) {
        opacity: 1;
        transform: translateY(0) rotate(0);
      }
      :deep(.siiri-portrait__brow-l),
      :deep(.siiri-portrait__brow-r) {
        opacity: 0;
      }
      :deep(.siiri-portrait__shades-glint) {
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

      /* inuti: hopp, vridning och svikt med studs i landningen */
      :deep(.siiri-portrait__all) {
        animation: siiri-dance-body 1.9s cubic-bezier(0.3, 0.7, 0.3, 1) 2;
      }
    }

    &--hop {
      animation: siiri-hop 0.55s ease 2;
    }

    /* humör: ögonbrynen (och ljudvågorna när hon lyssnar). Flyttningar inuti SVG:n anges i px,
     * som här är SVG:ns egna ritenheter (som cx/cy) - inte skärmpixlar, så inte rem. */
    &--mood-happy {
      :deep(.siiri-portrait__brow-l) {
        transform: translateY(-4px) rotate(-8deg);
      }
      :deep(.siiri-portrait__brow-r) {
        transform: translateY(-4px) rotate(8deg);
      }
    }
    &--mood-sad {
      :deep(.siiri-portrait__brow-l) {
        transform: translateY(5px) rotate(16deg);
      }
      :deep(.siiri-portrait__brow-r) {
        transform: translateY(5px) rotate(-16deg);
      }
    }
    &--mood-listen {
      :deep(.siiri-portrait__brow-l),
      :deep(.siiri-portrait__brow-r) {
        transform: translateY(-5px);
      }
      :deep(.siiri-portrait__wave circle) {
        opacity: 1;
        animation: siiri-waves 1.4s infinite;
      }
      :deep(.siiri-portrait__wave circle:nth-child(2)) {
        animation-delay: 0.25s;
      }
      :deep(.siiri-portrait__wave circle:nth-child(3)) {
        animation-delay: 0.5s;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;

      &--dance,
      &--wob {
        animation: none !important;
      }
      &--dance :deep(.siiri-portrait__all) {
        animation: none;
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

@keyframes siiri-hop {
  0%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-1.125rem); // -18px
  }
  70% {
    transform: translateY(0);
  }
}

@keyframes siiri-waves {
  0% {
    opacity: 0.9;
    r: 6;
  }
  100% {
    opacity: 0;
    r: 26;
  }
}

/* inuti SVG:n: px = ritenheter, se humörerna ovan */
@keyframes siiri-dance-body {
  0% {
    transform: translateY(0) rotate(0deg) scale(1, 1);
  }
  8% {
    transform: translateY(2px) rotate(0deg) scale(1.06, 0.93);
  }
  20% {
    transform: translateY(-16px) rotate(-7deg) scale(0.95, 1.07);
  }
  32% {
    transform: translateY(0) rotate(0deg) scale(1.05, 0.95);
  }
  44% {
    transform: translateY(-14px) rotate(7deg) scale(0.96, 1.06);
  }
  56% {
    transform: translateY(0) rotate(0deg) scale(1.05, 0.95);
  }
  68% {
    transform: translateY(-18px) rotate(-5deg) scale(0.94, 1.08);
  }
  80% {
    transform: translateY(0) rotate(3deg) scale(1.04, 0.96);
  }
  90% {
    transform: translateY(-6px) rotate(-2deg) scale(0.98, 1.02);
  }
  100% {
    transform: translateY(0) rotate(0deg) scale(1, 1);
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
