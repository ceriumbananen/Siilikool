<script setup lang="ts">
/* Siiri tuba (rummet) - porterat från roomScreen()/findHidden() i public/legacy/app.js. Rummet
   med möbler, diplom och souvenirer (app/utils/room-svg.ts), Siiri som vänds om man trycker på
   henne, brasan/lampan/fönstret/katten som var sin säger ett ord när man trycker på dem
   (ROOM_SPOTS), dagens gömda sak och flikarna Färg, Ögon, Kläder, Möbler och Diplom (diplomleken
   i app/components/room/DiplomaQuiz.vue). Nytt köps i Laat (app/pages/shop.vue). */

useHead({ title: "Siiri tuba · Siilikool" });
const profile = useProfileStore();
const voice = useSiiriVoice();
const { tone, buzz, fanfare, purr } = useSiiriSound();
const { burst } = useConfetti();
const { addXp } = useRewards();
const { L, TL, tgt, nat, tgtLang, isEt } = useLang();

const s = profile.state;
const owned = computed(() => (s.owned as string[] | undefined) || []);
const wear = computed(() => (s.wear as Record<string, string | null> | undefined) || {});
const furnOwnedIds = computed(() => s.furnOwned as string[] | undefined);
const room = computed(() => s.room as Record<string, string> | undefined);
const fur = computed(() => myFur(s.fur as string | undefined));
const eye = computed(() => myEye(s.eye as string | undefined));

/* ---------- rummet och Siiri ---------- */
const roomHtml = computed(() =>
  roomSVG({
    furnOf: slot => furnOf(slot, room.value, furnOwnedIds.value),
    diplomas: (s.diplomas as Record<string, number> | undefined) || {},
    tripDone: tripDone(s),
  }),
);
const backHtml = computed(() => siiriBackSVG(fur.value, wear.value as Wear, owned.value));
const turned = ref(false);
/* Päkapiku kirjad (december): julstrumpan, jakten och brevet - app/composables/usePakapikk.ts */
const pak = usePakapikk();
/* vänd på Siiri: CSS-flippen sköter animationen */
function flip() {
  turned.value = !turned.value;
  tone(520, 0.08, 0);
  tone(720, 0.1, 0.07);
  pak.onSiiriFlip();
}
/* efter en lapp som sa "Pööra Siiri ümber!" vänds hon tillbaka när nissen tittat fram */
watch(
  () => pak.mode.value,
  (_mode, old) => {
    if (old === "peek" && turned.value) turned.value = false;
  },
);
/* saker i rummet man kan trycka på: katten spinner, brasan, lampan, fönstret och katten
   säger var sitt ord (samma pop-bubbla-mönster, så de känns som en familj av reaktioner) */
type RoomSpotId = "roomfire" | "roomlamp" | "roomwindow" | "roomwindow2" | "roompet";
type RoomSpot = { x: number; y: number; dir: "up" | "left" | "down"; words: { et: string; sv: string }[] };
const ROOM_SPOTS: Record<RoomSpotId, RoomSpot> = {
  roomfire: { x: 61, y: 42, dir: "left", words: [{ et: "soe", sv: "varmt" }] },
  roomlamp: { x: 30, y: 29, dir: "up", words: [{ et: "lamp", sv: "lampa" }] },
  roomwindow: {
    x: 19,
    y: 47,
    dir: "down",
    words: [
      { et: "vihm", sv: "regn" },
      { et: "päike", sv: "sol" },
    ],
  },
  roomwindow2: {
    x: 50,
    y: 47,
    dir: "down",
    words: [
      { et: "vihm", sv: "regn" },
      { et: "päike", sv: "sol" },
    ],
  },
  roompet: { x: 21, y: 72, dir: "up", words: [{ et: "kass", sv: "katt" }] },
};
/* möblerna (vänster/höger/matta/växt/tavla) säger inte ett fast ord som ovan, utan precis
   det man själv valt i Laat (FURN i shop.ts har redan et/sv per sak) - annars hade t.ex.
   "möbeln" alltid behövt säga samma ord oavsett om det är en säng eller en gungstol. */
type FurnSpotId = "roomleft" | "roomright" | "roomrug" | "roomplant" | "roomart" | "roomwall";
const FURN_SPOTS: Record<FurnSpotId, { slot: string; x: number; y: number; dir: "up" | "left" | "down" }> = {
  roomleft: { slot: "left", x: 14, y: 65, dir: "up" },
  roomright: { slot: "right", x: 88, y: 62, dir: "up" },
  roomrug: { slot: "rug", x: 50, y: 85, dir: "up" },
  roomplant: { slot: "plant", x: 92, y: 65, dir: "up" },
  roomart: { slot: "art", x: 31, y: 22, dir: "up" },
  roomwall: { slot: "wall", x: 72, y: 14, dir: "up" },
};
const roomTurn: Partial<Record<RoomSpotId, number>> = {};
/* pratbubblan: word = det barnet lär sig (stort), gloss = förklaringen på barnets eget språk */
const roomSaid = ref<{ word: string; gloss: string; x: number; y: number; dir: "up" | "left" | "down" } | null>(null);
const cap = (t: string) => `${t[0]!.toUpperCase()}${t.slice(1)}`;
let roomSaidTimer: ReturnType<typeof setTimeout> | undefined;

/* vissa saker har en egen kulturell/historisk historia (ROOM_LORE i app/utils/room-lore.ts) och
   öppnar ett kort istället för pratbubblan - samma mönster som openCharCard() i app.js
   (rival-/avatarkorten). "roomart" är dynamisk: bara vald tavla (t.ex. a-koler) har lore, annat
   val (karta, foto...) faller tillbaka till den vanliga pratbubblan via FURN_SPOTS nedan.
   "roomflag" är fast (flaggan är inte längre ett tavelval, se fArt()/FLAGSVG i room-svg.ts -
   så att flaggan och en vald tavla kan synas samtidigt, på var sin plats i rummet). */
const LORE_SPOT_IDS = [
  "roomfire",
  "roomart",
  "roomflag",
  "roomdala",
  "roomdolls",
  "roomwall",
  "roomrug",
  "roomright",
] as const;
/* "roomart" var länge den enda dynamiska platsen (bara vald tavla, t.ex. a-koler, har lore) -
   samma knep gäller nu även väggen/mattan/höger-möbeln (se FURN_SPOTS för deras slot). Val utan
   egen lore (t.ex. en vanlig matta) faller igenom till den vanliga pratbubblan, se onStageClick. */
const DYNAMIC_LORE_SLOTS: Partial<Record<string, string>> = {
  roomart: "art",
  roomwall: "wall",
  roomrug: "rug",
  roomright: "right",
};
function loreFor(id: string): RoomLore | null {
  if (id === "roomfire") return ROOM_LORE.roomfire!;
  if (id === "roomflag") return ROOM_LORE["a-flag"]!;
  if (id === "roomdala") return ROOM_LORE.dalahast!;
  if (id === "roomdolls") return ROOM_LORE.folkdockor!;
  const slot = DYNAMIC_LORE_SLOTS[id];
  if (slot) {
    const furnId = furnOf(slot, room.value, furnOwnedIds.value);
    return (furnId && ROOM_LORE[furnId]) || null;
  }
  return null;
}
const lore = ref<RoomLore | null>(null);
/* kortet öppnas på det språk barnet lär sig (estniska, eller svenska i estniskt läge) */
const loreShowEt = ref(true);
function openLore(entry: RoomLore) {
  lore.value = entry;
  loreShowEt.value = !isEt();
  tone(260, 0.08, 0);
  tone(160, 0.16, 0.05);
  voice.sayWord(loreShowEt.value ? entry.factEt : entry.fact);
}
function toggleLoreLang() {
  loreShowEt.value = !loreShowEt.value;
  if (lore.value) voice.sayWord(loreShowEt.value ? lore.value.factEt : lore.value.fact);
}

function onStageClick(e: MouseEvent) {
  const target = e.target as Element | null;
  for (const id of LORE_SPOT_IDS) {
    const el = target?.closest?.(`#${id}`);
    if (!el) continue;
    const entry = loreFor(id);
    if (!entry) break; /* t.ex. roomart utan lore för vald tavla - fall igenom till pratbubblan */
    openLore(entry);
    (el as SVGElement).blur?.();
    return;
  }
  for (const id of Object.keys(ROOM_SPOTS) as RoomSpotId[]) {
    const el = target?.closest?.(`#${id}`);
    if (el) {
      touchRoomSpot(id, el);
      /* en musklick ska inte lämna kvar fokusringen (den är till för tangentbordsnavigering,
         se :focus-visible nedan) - annars syns en blå ruta runt t.ex. katten efter varje tryck,
         tydligast på den nya bilden som fyller hela sin rektangel (ovanligt för tätt mot de
         gamla handritade formerna). */
      (el as SVGElement).blur?.();
      return;
    }
  }
  for (const id of Object.keys(FURN_SPOTS) as FurnSpotId[]) {
    const el = target?.closest?.(`#${id}`);
    if (el) {
      touchFurnSpot(id, el);
      (el as SVGElement).blur?.();
      return;
    }
  }
}
/* rummets saker (eld/lampa/fönster/katt) är <g>-element i rå SVG (v-html, se roomSVG() i
   app/utils/room-svg.ts) - tabindex/role/aria-label sätts där, men tangentbordet ger bara
   klick-event på <button>/<a>, inte på fokuserade SVG-grupper, så Enter/mellanslag hanteras
   här precis som ett klick skulle. */
function onStageKeydown(e: KeyboardEvent) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const target = e.target as Element | null;
  for (const id of LORE_SPOT_IDS) {
    if (target?.id !== id) continue;
    const entry = loreFor(id);
    if (!entry) break;
    e.preventDefault();
    openLore(entry);
    return;
  }
  for (const id of Object.keys(ROOM_SPOTS) as RoomSpotId[]) {
    if (target?.id === id) {
      e.preventDefault();
      touchRoomSpot(id, target);
      return;
    }
  }
  for (const id of Object.keys(FURN_SPOTS) as FurnSpotId[]) {
    if (target?.id === id) {
      e.preventDefault();
      touchFurnSpot(id, target);
      return;
    }
  }
}
function touchRoomSpot(id: RoomSpotId, el: Element) {
  const litClass = `${id}--lit`;
  el.classList.remove(litClass);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(litClass);
  if (id === "roompet") purr();
  else {
    tone(260, 0.08, 0);
    tone(160, 0.16, 0.05);
  }
  const spot = ROOM_SPOTS[id];
  const turn = (roomTurn[id] || 0) % spot.words.length;
  roomTurn[id] = turn + 1;
  const word = spot.words[turn]!;
  voice.sayWord(tgt(word));
  const gloss = id === "roompet" && petName.value ? petName.value : `${cap(nat(word))}!`;
  roomSaid.value = { word: tgt(word), gloss, x: spot.x, y: spot.y, dir: spot.dir };
  clearTimeout(roomSaidTimer);
  roomSaidTimer = setTimeout(() => {
    roomSaid.value = null;
  }, 1800);
}
/* samma pop-bubbla, men ordet kommer från den möbel man faktiskt valt i Laat, inte en fast lista. */
function touchFurnSpot(id: FurnSpotId, el: Element) {
  const spot = FURN_SPOTS[id];
  const furnId = furnOf(spot.slot, room.value, furnOwnedIds.value);
  const item = furnId && furnById(furnId);
  if (!item) return;
  const litClass = `${id}--lit`;
  el.classList.remove(litClass);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(litClass);
  tone(260, 0.08, 0);
  tone(160, 0.16, 0.05);
  voice.sayWord(tgt(item));
  /* växten flyttar med möbeln till höger (plantAnchor i room-svg.ts) - bubblan också */
  let { x, y } = spot;
  if (id === "roomplant") {
    const a = plantAnchor(furnOf("right", room.value, furnOwnedIds.value));
    x = a.tx / 4;
    y = ((a.ty - 34 * a.s) / 270) * 100;
  }
  roomSaid.value = {
    word: tgt(item),
    gloss: `${cap(nat(item))}!`,
    x,
    y,
    dir: spot.dir,
  };
  clearTimeout(roomSaidTimer);
  roomSaidTimer = setTimeout(() => {
    roomSaid.value = null;
  }, 1800);
}
/* ögonfärgerna har bara svenska namn i EYES (id:t är estniskt, men utan stor bokstav och i
   ett fall för kort) - estniska namnen för estniskt läge här */
const EYE_ET: Record<string, string> = {
  pruun: "Pruun",
  merevaik: "Merevaik",
  roheline: "Roheline",
  sinine: "Sinine",
  hall: "Hall",
  lilla: "Lilla",
  kuld: "Kuld",
  punane: "Rubiinpunane",
};
const eyeName = (e: { id: string; sv: string }) => L(e.sv, EYE_ET[e.id] || e.sv);
/* estniska: "1 asi", annars "2 asja" (partitiv efter räkneord) */
const asju = (n: number) => `${n} ${n === 1 ? "asi" : "asja"}`;
const label = computed(() =>
  L(
    `${fur.value.sv} päls · ${eye.value.sv} ögon · ${owned.value.length} av ${SHOP.length} saker`,
    `Karv: ${fur.value.et.toLowerCase()} · silmad: ${eyeName(eye.value).toLowerCase()} · ${asju(owned.value.length)} ${SHOP.length}-st`,
  ),
);

/* döp husdjuret - att få namnge något gör det till "mitt", inte bara "ett" husdjur */
const petName = computed(() => ((s.petName as string | undefined) || "").trim());
function savePetName(e: Event) {
  s.petName = (e.target as HTMLInputElement).value.trim().slice(0, 16);
  profile.save();
}

/* "Vilken färg har ditt rum?" i Hemma-samtalet (chats.ts, S.roomColor) - en ram i samma
   svenska färgord runt rummet, om det är en av de grundfärger temat Värvid redan lär ut.
   Ovanliga svar ("glittrig", "osynlig" ...) får ingen ram - personalisering ska aldrig se
   ut som ett fel när appen inte känner igen ordet. */
const ROOM_COLOR_HEX: Record<string, string> = {
  röd: "#e2584a",
  blå: "#4a90c9",
  gul: "#e8c34a",
  grön: "#5aa06a",
  svart: "#3a3a3a",
  vit: "#e8e4da",
  rosa: "#e58fc0",
  lila: "#9b7bc9",
  grå: "#9a9a9a",
  brun: "#8a5a3c",
  orange: "#e0923c",
};
const roomAccent = computed(
  () => ROOM_COLOR_HEX[((s.roomColor as string | undefined) || "").trim().toLowerCase()] || "",
);

/* Siiri kommenterar utseendet - päls/ögon/kläder ändrades innan bara tyst (en ton + konfetti),
   trots att hon redan har hela mood/reaktionssystemet. Återanvänder roomSaid-bubblan ovan. */
/* svShort = repliken på svenska i estniskt läge (utan detaljen - estniskans kasus gör den svår
   att foga in), et visas då som förklaring */
const APPEARANCE_REACTIONS: { et: string; sv: (detail: string) => string; svShort: string }[] = [
  { et: "Mulle meeldib!", sv: detail => `Jag gillar ${detail} på mig!`, svShort: "Jag gillar det!" },
  { et: "Kui ilus!", sv: detail => `Vad fint, jag har ${detail} nu!`, svShort: "Vad fint!" },
  { et: "Vaata mind!", sv: detail => `Titta, nu har jag ${detail}!`, svShort: "Titta på mig!" },
];
/** word = ordet som sägs, på det språk barnet lär sig. */
function reactToLook(detailSv: string, word?: string) {
  if (word) voice.sayWord(word);
  const r = APPEARANCE_REACTIONS[(Math.random() * APPEARANCE_REACTIONS.length) | 0]!;
  roomSaid.value = isEt()
    ? { word: r.svShort, gloss: r.et, x: 50, y: 38, dir: "up" }
    : { word: r.et, gloss: r.sv(detailSv), x: 50, y: 38, dir: "up" };
  clearTimeout(roomSaidTimer);
  roomSaidTimer = setTimeout(() => {
    roomSaid.value = null;
  }, 1800);
}

/* ---------- dagens gömda sak ---------- */
const found = computed(() => s.hideday === todayKey());
const hidden = computed(() => {
  const seed = dayHash(todayKey() + "|" + (s.name || ""));
  const pool = allWords(s);
  return { spot: HIDE_SPOTS[seed % HIDE_SPOTS.length]!, word: pool[(seed >>> 3) % pool.length]! };
});
const foundPopup = ref<{ word: WordItem; spot: string; gain: number } | null>(null);
function findHidden() {
  if (found.value) return;
  const t = hidden.value;
  s.hideday = todayKey();
  s.hidelast = { et: t.word.et, sv: t.word.sv, em: t.word.em };
  const gain = Math.round((15 + (dayHash(todayKey()) % 6) * 5) * starMult(s.xp));
  s.stars += gain;
  profile.save();
  addXp(20);
  voice.sayWord(tgt(t.word));
  burst(140);
  fanfare(2);
  buzz(24);
  foundPopup.value = { word: t.word, spot: L(t.spot.sv, t.spot.et), gain };
}
const foundIcon = computed(() => {
  const w = foundPopup.value?.word;
  if (!w || !hasPic(w)) return "";
  return wordArtSVG(w.et) || w.em || "";
});
const hideLast = computed(() => {
  const h = (s.hidelast as { et?: string; sv?: string } | undefined) || {};
  return { et: h.et || "", sv: h.sv || "" };
});

/* ---------- flikarna ---------- */
const TABS = [
  ["varv", "🎨", "Färg", "Värv"],
  ["silmad", "👀", "Ögon", "Silmad"],
  ["riided", "👕", "Kläder", "Riided"],
  ["sisu", "🛋️", "Möbler", "Mööbel"],
  ["diplom", "📜", "Diplom", "Diplomid"],
] as const;
const tab = computed(() => (s.roomTab as string | undefined) || "varv");
function setTab(id: string) {
  s.roomTab = id;
  profile.save();
  tone(700, 0.06, 0);
}

function pickFur(id: string) {
  s.fur = id;
  profile.save();
  tone(820, 0.08, 0);
  burst(24);
  const f = myFur(id);
  reactToLook(`${f.sv.toLowerCase()} päls`, tgt(f));
}
function pickEye(id: string) {
  s.eye = id;
  profile.save();
  tone(900, 0.08, 0);
  const e = myEye(id);
  reactToLook(`${e.sv.toLowerCase()} ögon`, TL(e.id, e.sv));
}

/* kläderna barnet äger, per plats på Siiri */
const wardrobe = computed(() =>
  WEAR_SLOTS.map(slot => ({
    slot,
    items: SHOP.filter(it => it.slot === slot.id && owned.value.includes(it.id)),
  })).filter(w => w.items.length),
);
function toggleWear(it: ShopItem) {
  const on = wear.value[it.slot] === it.id;
  s.wear = { ...wear.value, [it.slot]: on ? null : it.id };
  profile.save();
  if (!on) {
    voice.sayWord(tgt(it));
    tone(760, 0.09, 0);
    reactToLook(it.sv.charAt(0).toLowerCase() + it.sv.slice(1));
  } else tone(520, 0.09, 0);
}

/* möblerna barnet äger, per plats i rummet */
const furnRows = computed(() =>
  FURN_SLOTS.map(([id, sv, em, et]) => ({
    id,
    title: `${em} ${L(sv, et)}`,
    mine: FURN.filter(f => f.slot === id && furnOwned(f.id, furnOwnedIds.value)),
    locked: FURN.filter(f => f.slot === id && !furnOwned(f.id, furnOwnedIds.value)).length,
    current: furnOf(id, room.value, furnOwnedIds.value),
  })),
);
function placeFurn(f: FurnItem) {
  s.room = { ...(room.value || {}), [f.slot]: f.id };
  profile.save();
  tone(720, 0.07, 0);
}

/* ---------- diplomen ---------- */
type Theme = { id: string; em: string; et: string; sv: string; words: WordItem[] };
const quizTheme = ref<Theme | null>(null);
const dipGet = (id: string) => ((s.diplomas as Record<string, number> | undefined) || {})[id] || 0;
function startQuiz(t: Theme) {
  quizTheme.value = t;
  window.scrollTo(0, 0);
}
function backFromQuiz() {
  quizTheme.value = null;
  s.roomTab = "diplom";
  profile.save();
  window.scrollTo(0, 0);
}
</script>

<template>
  <UiAppShell active="room" wide>
    <main class="room-page">
      <RoomDiplomaQuiz v-if="quizTheme" :key="quizTheme.id" :theme="quizTheme" @room="backFromQuiz" />

      <template v-else>
        <UiPageHero
          emoji="🏠"
          title="Siiri tuba"
          :subtitle="
            L(
              'Siiris rum — hon är din, gör henne till din egen',
              'Siiri on sinu oma — tee ta selliseks, nagu sulle meeldib',
            )
          "
          tone="amber"
        />

        <!-- rummet: hylla, fönster och matta bakom henne -->
        <div
          class="room-page__stage"
          :style="{ '--room-accent': roomAccent || 'transparent' }"
          @click="onStageClick"
          @keydown="onStageKeydown"
        >
          <div class="room-page__room" v-html="roomHtml" />
          <div class="room-page__siiri" :class="{ 'room-page__siiri--turned': turned }">
            <div
              class="room-page__flip"
              role="button"
              tabindex="0"
              :title="L('Tryck på Siiri för att vända på henne', 'Vajuta Siirile, et ta ümber pöörata')"
              :aria-label="L('Tryck på Siiri för att vända på henne', 'Vajuta Siirile, et ta ümber pöörata')"
              @click="flip"
              @keydown.enter.prevent="flip"
              @keydown.space.prevent="flip"
            >
              <div class="room-page__face">
                <UiSiiriPortrait size="room" />
              </div>
              <div class="room-page__face room-page__face--back" v-html="backHtml" />
            </div>
          </div>
          <RoomPakapikkStage />
          <button
            v-if="!found && !pak.searching.value"
            class="room-page__hidden"
            :style="{ left: `${hidden.spot.x}%`, top: `${hidden.spot.y}%` }"
            :aria-label="L('Något gömmer sig', 'Siin on midagi peidus')"
            @click.stop="findHidden"
          >
            <span>{{ hidden.word.em }}</span>
          </button>
          <div class="room-page__label">{{ label }}</div>
          <div
            v-if="roomSaid"
            class="room-page__spot-bubble"
            :class="`room-page__spot-bubble--${roomSaid.dir}`"
            :style="{ left: `${roomSaid.x}%`, top: `${roomSaid.y}%` }"
          >
            <b :lang="tgtLang()">{{ roomSaid.word }}</b
            ><span>{{ roomSaid.gloss }}</span>
          </div>
        </div>
        <RoomPakapikkBanner />
        <p v-if="!pak.searching.value" class="room-page__note">
          <template v-if="found && isEt()">
            🔍 Tänane asi on leitud: <b lang="sv">{{ hideLast.sv }}</b> — {{ hideLast.et }}. Homme on uus!
          </template>
          <template v-else-if="found">
            🔍 Dagens sak hittad: <b lang="et">{{ hideLast.et }}</b> — {{ hideLast.sv }}. Ny sak imorgon!
          </template>
          <template v-else>{{
            L(
              "🔍 Något litet gömmer sig i rummet idag. Hittar du det?",
              "🔍 Toas on täna midagi väikest peidus. Kas leiad selle üles?",
            )
          }}</template>
        </p>
        <RoomPakapikkCalendar />
        <RoomPakapikkLetter />

        <!-- flikar -->
        <div class="room-page__tabs" role="tablist">
          <button
            v-for="[id, em, sv, et] in TABS"
            :key="id"
            class="room-page__tab"
            :class="{ 'room-page__tab--on': tab === id }"
            role="tab"
            :aria-selected="tab === id"
            @click="setTab(id)"
          >
            <span aria-hidden="true">{{ em }}</span
            ><b>{{ L(sv, et) }}</b>
          </button>
        </div>

        <!-- Färg -->
        <UiAppCard v-if="tab === 'varv'">
          <h2 class="room-page__slot">{{ L("Karvavärv · Pälsfärg", "Pälsfärg · Karvavärv") }}</h2>
          <p class="room-page__sub">
            {{
              L(
                "Färgen sätter sig på taggarna. Ansiktet och magen förblir gräddvita.",
                "Värv tuleb okastele. Nägu ja kõht jäävad kreemjaks.",
              )
            }}
          </p>
          <div class="room-page__swatches">
            <button
              v-for="f in FURS"
              :key="f.id"
              class="room-page__swatch"
              :class="{ 'room-page__swatch--on': fur.id === f.id }"
              @click="pickFur(f.id)"
            >
              <span class="room-page__fur" :style="{ background: f.o ? f.c : '#F3EADB' }" />
              <b>{{ nat(f) }}</b
              ><small :lang="tgtLang()">{{ tgt(f) }}</small>
            </button>
          </div>
        </UiAppCard>

        <!-- Ögon -->
        <UiAppCard v-else-if="tab === 'silmad'">
          <h2 class="room-page__slot">{{ L("Silmavärv · Ögonfärg", "Ögonfärg · Silmavärv") }}</h2>
          <div class="room-page__swatches">
            <button
              v-for="e in EYES"
              :key="e.id"
              class="room-page__swatch"
              :class="{ 'room-page__swatch--on': eye.id === e.id }"
              @click="pickEye(e.id)"
            >
              <span class="room-page__eye"><span :style="{ background: e.c }" /></span>
              <b>{{ eyeName(e) }}</b>
            </button>
          </div>
        </UiAppCard>

        <!-- Möbler -->
        <UiAppCard v-else-if="tab === 'sisu'">
          <h2 class="room-page__kicker">{{ L("Sisusta tuba · Möblera rummet", "Möblera rummet · Sisusta tuba") }}</h2>
          <p v-if="isEt()" class="room-page__sub">Vaheta vabalt asju, mis sul juba on. Uusi asju leiad laadalt.</p>
          <p v-else class="room-page__sub">
            Byt fritt mellan det du äger. Nytt köper du i marknaden under <b>Rummet</b>.
          </p>
          <template v-for="row in furnRows" :key="row.id">
            <h3 class="room-page__furn-title">{{ row.title }}</h3>
            <div class="room-page__furn-row">
              <button
                v-for="f in row.mine"
                :key="f.id"
                class="room-page__furn"
                :class="{ 'room-page__furn--on': row.current === f.id }"
                @click="placeFurn(f)"
              >
                <b>{{ nat(f) }}</b
                ><small :lang="tgtLang()">{{ tgt(f) }}</small>
              </button>
              <span v-if="row.locked" class="room-page__furn-lock">{{
                L(`🔒 ${row.locked} till i marknaden`, `🔒 veel ${row.locked} laadal`)
              }}</span>
            </div>
            <div v-if="row.id === 'pet' && row.current !== 'd-none'" class="room-page__pet-name">
              <label for="petname">{{ L("Ge husdjuret ett namn", "Pane lemmikloomale nimi") }}</label>
              <input
                id="petname"
                type="text"
                maxlength="16"
                :value="petName"
                :placeholder="L('t.ex. Nurr', 'nt Nurr')"
                @change="savePetName"
              />
            </div>
          </template>
        </UiAppCard>

        <!-- Diplom -->
        <UiAppCard v-else-if="tab === 'diplom'">
          <h2 class="room-page__kicker">{{ L("📜 Diplomid · Diplom", "📜 Diplom · Diplomid") }}</h2>
          <p v-if="isEt()" class="room-page__sub">
            Kümme küsimust ühel teemal. Läbi kukkuda ei saa — proovi uuesti, millal tahad, arvesse läheb parim tulemus.
            Diplomid ripuvad toa seinal.
          </p>
          <p v-else class="room-page__sub">
            Tio frågor på ett tema. Du kan inte misslyckas — gör om när du vill, bästa resultatet räknas. Diplomen
            hänger på väggen i rummet.
          </p>
          <div class="room-page__diplomas">
            <button
              v-for="t in THEMES"
              :key="t.id"
              class="room-page__diploma"
              :class="{ 'room-page__diploma--has': dipGet(t.id) }"
              @click="startQuiz(t as Theme)"
            >
              <span class="room-page__diploma-em" aria-hidden="true">{{ t.em }}</span>
              <b :lang="tgtLang()">{{ tgt(t) }}</b>
              <small>{{ nat(t) }}</small>
              <small class="room-page__seals">{{
                dipGet(t.id) ? "⭐".repeat(dipGet(t.id)) : L("gör diplom", "tee diplom")
              }}</small>
            </button>
          </div>
        </UiAppCard>

        <!-- Kläder -->
        <template v-else>
          <UiAppCard v-if="!owned.length" class="room-page__empty">
            <p>
              {{
                L(
                  "Garderoben är tom än. Allt du köper på marknaden hamnar här.",
                  "Riidekapp on veel tühi. Kõik, mis sa laadalt ostad, tuleb siia.",
                )
              }}
            </p>
            <span class="room-page__pointer" aria-hidden="true">🎪</span>
            <a class="room-page__to-shop" href="/shop">{{ L("Till marknaden", "Laadale") }}</a>
          </UiAppCard>
          <UiAppCard v-for="w in wardrobe" :key="w.slot.id" class="room-page__section">
            <h2 class="room-page__slot">{{ L(w.slot.sv, w.slot.et) }}</h2>
            <div class="room-page__shelf">
              <button
                v-for="it in w.items"
                :key="it.id"
                class="room-page__item"
                :class="{ 'room-page__item--worn': wear[it.slot] === it.id }"
                @click="toggleWear(it)"
              >
                <span class="room-page__item-em" aria-hidden="true">{{ it.em }}</span>
                <b :lang="tgtLang()">{{ tgt(it) }}</b>
                <small>{{ nat(it) }}</small>
                <small v-if="wear[it.slot] === it.id" class="room-page__worn">{{ L("på ✓", "peal ✓") }}</small>
              </button>
            </div>
          </UiAppCard>
          <p v-if="owned.length && owned.length < SHOP.length" class="room-page__note">
            {{
              L(
                `${SHOP.length - owned.length} saker väntar på marknaden.`,
                `Laadal ootab veel ${asju(SHOP.length - owned.length)}.`,
              )
            }}
          </p>
          <p v-if="owned.length === SHOP.length" class="room-page__note">
            {{ L("Du äger allt som finns. Rummet är fullt!", "Sul on kõik olemas. Tuba on täis!") }}
          </p>
        </template>
      </template>
    </main>

    <!-- dagens gömda sak hittad -->
    <div v-if="foundPopup" class="room-page__found" role="dialog" aria-modal="true">
      <div class="room-page__found-card">
        <p class="room-page__found-kicker">
          {{ L("🔍 Sa leidsid! · Du hittade den!", "🔍 Du hittade den! · Sa leidsid!") }}
        </p>
        <div class="room-page__found-icon" aria-hidden="true" v-html="foundIcon" />
        <h3 :lang="tgtLang()">{{ tgt(foundPopup.word) }}</h3>
        <p>{{ nat(foundPopup.word) }} · {{ L("låg", "oli") }} {{ foundPopup.spot }}</p>
        <p class="room-page__sub">⭐ +{{ foundPopup.gain }}</p>
        <div class="room-page__found-row">
          <UiAppButton variant="primary" @click="voice.sayWord(tgt(foundPopup.word))">{{
            L("🔊 Hör igen", "🔊 Kuula uuesti")
          }}</UiAppButton>
          <UiAppButton variant="green" @click="foundPopup = null">{{ TL("Aitäh!", "Tack!") }}</UiAppButton>
        </div>
      </div>
    </div>

    <!-- historiekort: dalahäst, folkdockor, flagga, eldstad - se ROOM_LORE/openLore -->
    <div v-if="lore" class="room-page__found" role="dialog" aria-modal="true">
      <div class="room-page__found-card">
        <img v-if="lore.img" :src="lore.img" alt="" class="room-page__lore-img" />
        <span v-else-if="lore.em" class="room-page__lore-em" aria-hidden="true">{{ lore.em }}</span>
        <h3 :lang="loreShowEt ? 'et' : 'sv'">{{ loreShowEt ? lore.name.et : lore.name.sv }}</h3>
        <p :lang="loreShowEt ? 'et' : 'sv'">{{ loreShowEt ? lore.factEt : lore.fact }}</p>
        <div class="room-page__found-row">
          <UiAppButton variant="primary" @click="voice.sayWord(loreShowEt ? lore.factEt : lore.fact)">{{
            L("🔊 Hör", "🔊 Kuula")
          }}</UiAppButton>
          <UiAppButton variant="ghost" @click="toggleLoreLang">{{
            loreShowEt ? L("🇸🇪 På svenska", "🇸🇪 Rootsi keeles") : "🇪🇪 Eesti keeles"
          }}</UiAppButton>
        </div>
        <UiAppButton variant="green" wide @click="lore = null">{{ L("Stäng", "Sulge") }}</UiAppButton>
      </div>
    </div>
  </UiAppShell>
</template>

<style lang="scss" scoped>
.room-page {
  /* rummet */
  &__stage {
    position: relative;
    border-radius: $radius-lg;
    overflow: hidden;
    margin-bottom: $spacing-2;
    /* --room-accent sätts från S.roomColor (se roomAccent ovan) - transparent syns inte */
    box-shadow:
      $shadow-3,
      0 0 0 0.1875rem var(--room-accent, transparent);
    border: $border-width solid var(--line);
    line-height: 0;
    transition: box-shadow 0.3s ease;
  }

  /* rummets egna animationer (eld, glöd, svans) finns i public/legacy/style.css (.roomsvg) */
  &__room :deep(.roomsvg) {
    width: 100%;
    height: auto;
    display: block;
  }

  /* rummets klickbara saker (eld/lampa/fönster/katt) är <g>-element i rå SVG (v-html, se
     app/utils/room-svg.ts) - scoped CSS och @include focus-visible når inte dit, så samma
     fokusring skrivs ut för hand här. */
  &__room :deep(#roomfire:focus-visible),
  &__room :deep(#roomlamp:focus-visible),
  &__room :deep(#roomwindow:focus-visible),
  &__room :deep(#roomwindow2:focus-visible),
  &__room :deep(#roompet:focus-visible),
  &__room :deep(#roomleft:focus-visible),
  &__room :deep(#roomright:focus-visible),
  &__room :deep(#roomrug:focus-visible),
  &__room :deep(#roomplant:focus-visible),
  &__room :deep(#roomart:focus-visible),
  &__room :deep(#roomflag:focus-visible),
  &__room :deep(#roomdala:focus-visible),
  &__room :deep(#roomdolls:focus-visible) {
    outline: $border-width solid var(--blue);
    outline-offset: $border-width;
  }

  &__siiri {
    position: absolute;
    /* över nissen när han tittar fram bakom hennes rygg (PakapikkStage, .pak-peek--behind) */
    z-index: 2;
    left: 0;
    right: 0;
    bottom: 9%;
    display: flex;
    justify-content: center;
    pointer-events: none;
    perspective: 1100px;
    filter: drop-shadow(0 0.625rem 0.75rem rgba(40, 25, 10, 0.28));
  }

  /* vänd-animationen: två sidor av samma kort, bara en syns åt gången */
  &__flip {
    position: relative;
    display: inline-block;
    pointer-events: auto;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.34, 1.4, 0.4, 1);
    border-radius: $radius-lg;
    @include focus-visible;
  }

  &__siiri--turned &__flip {
    transform: rotateY(180deg);
  }

  &__face {
    backface-visibility: hidden;

    &--back {
      position: absolute;
      inset: 0;
      transform: rotateY(180deg);
      display: flex;
      justify-content: center;

      :deep(.siiri) {
        width: clamp(8.125rem, 34vw, 11.875rem); // samma som framsidan (size="room")
        transform: none;
      }
    }
  }

  &__hidden {
    position: absolute;
    width: clamp(1.625rem, 7vw, 2.125rem); // 26-34px
    height: clamp(1.625rem, 7vw, 2.125rem);
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    transform: translate(-50%, -50%);
    z-index: 4;
    opacity: 0.16;
    animation: room-hide-glint 9s ease-in-out infinite;

    span {
      font-size: clamp(1.0625rem, 4.6vw, 1.375rem); // 17-22px
      display: block;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    }

    &:hover {
      opacity: 0.85;
    }

    &:focus-visible {
      opacity: 0.85;
      @include focus-visible;
    }

    &:active {
      transform: translate(-50%, -50%) scale(1.25);
    }
  }

  &__spot-bubble {
    position: absolute;
    background: var(--card);
    border: $border-width solid var(--honey);
    border-radius: $radius-md;
    padding: 0.25rem 0.625rem;
    text-align: center;
    line-height: normal;
    box-shadow: $shadow-2;
    pointer-events: none;
    z-index: 5;

    b {
      display: block;
      font-size: $font-size-sm;
      color: var(--honey-deep);
    }

    span {
      display: block;
      font-size: $font-size-xs;
      color: var(--muted);
    }

    &--left {
      transform: translate(-100%, -50%);
      animation: room-spot-pop-left 1.8s ease forwards;
    }

    &--up {
      transform: translate(-50%, -100%);
      animation: room-spot-pop-up 1.8s ease forwards;
    }

    &--down {
      transform: translate(-50%, 0);
      animation: room-spot-pop-down 1.8s ease forwards;
    }
  }

  &__label {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    font-size: $font-size-xs;
    font-weight: 700;
    color: var(--ink);
    background: color-mix(in srgb, var(--card) 84%, transparent);
    padding: 0.3125rem; // 5px
    line-height: 1.3;
  }

  &__note {
    font-size: $font-size-sm;
    color: var(--muted);
    text-align: center;
    margin: $spacing-2 0;
    line-height: 1.5;
  }

  /* flikar */
  &__tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-2;
    margin-bottom: $spacing-2;
  }

  &__tab {
    background: var(--card);
    border: $border-width solid var(--line);
    border-radius: $radius-md;
    padding: 0.5625rem 0.25rem; // 9px 4px
    cursor: pointer;
    color: var(--ink);
    font: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    box-shadow: $shadow-2;

    @include focus-visible;

    span {
      font-size: 1.375rem; // 22px
      line-height: 1.1;
    }

    b {
      font-size: $font-size-sm;
    }

    &--on {
      border-color: var(--moss);
      background: color-mix(in srgb, var(--moss) 15%, var(--card));
    }
  }

  &__section {
    margin-top: $spacing-3;
  }

  &__kicker {
    font-size: $font-size-sm;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--muted);
    margin: 0;
  }

  &__slot {
    font-weight: 600;
    margin: 0 0 0.125rem;
    font-size: $font-size-md;
    color: var(--muted);
  }

  &__sub {
    color: var(--muted);
    font-size: $font-size-sm;
    margin: $spacing-1 0;
  }

  /* päls- och ögonfärger */
  &__swatches {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(5.25rem, 1fr)); // 84px
    gap: $spacing-2;
    margin-top: $spacing-2;
  }

  &__swatch {
    border: $border-width solid var(--line);
    border-radius: $radius-md;
    background: var(--bg2);
    padding: 0.5rem 0.375rem;
    cursor: pointer;
    color: var(--ink);
    font: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1875rem;

    @include focus-visible;

    b {
      font-size: $font-size-xs;
    }

    small {
      font-size: 0.75rem;
      color: var(--muted);
    }

    &--on {
      border-color: var(--moss);
      background: color-mix(in srgb, var(--moss) 16%, var(--card));
      transform: translateY(-0.125rem);
    }
  }

  &__fur {
    width: 2.375rem; // 38px
    height: 2.375rem;
    border-radius: 50%;
    display: block;
    box-shadow:
      inset -6px -8px 12px rgba(0, 0, 0, 0.28),
      inset 5px 5px 8px rgba(255, 255, 255, 0.35),
      0 2px 0 rgba(0, 0, 0, 0.08);
  }

  &__eye {
    width: 2.375rem;
    height: 2.375rem;
    border-radius: 50%;
    background: #0b0908;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      width: 1.25rem; // 20px
      height: 1.25rem;
      border-radius: 50%;
      display: block;
      box-shadow: inset -3px -3px 4px rgba(0, 0, 0, 0.35);
    }
  }

  /* möbler */
  &__furn-title {
    font-size: $font-size-md;
    font-weight: 600;
    margin: $spacing-2 0 $spacing-1;
  }

  &__furn-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  &__furn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1px;
    padding: 0.4375rem 0.6875rem; // 7px 11px
    border: $border-width solid var(--line);
    border-radius: $radius-md;
    background: var(--card);
    color: var(--ink);
    font: inherit;
    cursor: pointer;
    text-align: left;

    @include focus-visible;

    b {
      font-size: $font-size-sm;
    }

    small {
      font-size: $font-size-xs;
      color: var(--muted);
    }

    &--on {
      border-color: var(--moss);
      background: color-mix(in srgb, var(--moss) 14%, var(--card));
    }

    &:active {
      transform: translateY(0.125rem);
    }
  }

  &__furn-lock {
    font-size: $font-size-xs;
    color: var(--muted);
  }

  &__pet-name {
    margin-top: $spacing-2;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    label {
      font-size: $font-size-xs;
      color: var(--muted);
    }

    input {
      font: inherit;
      font-size: $font-size-md;
      font-weight: 600;
      padding: 0.5rem 0.75rem;
      border: $border-width solid var(--line);
      border-radius: $radius-md;
      background: var(--bg2);
      color: var(--ink);
      max-width: 16rem;

      @include focus-visible;
    }
  }

  /* diplom */
  &__diplomas {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-2;
  }

  &__diploma {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: $spacing-2;
    border: $border-width solid var(--line);
    border-radius: $radius-md;
    background: var(--card);
    color: var(--ink);
    font: inherit;
    cursor: pointer;
    text-align: center;

    @include focus-visible;

    b {
      font-size: $font-size-sm;
    }

    small {
      font-size: $font-size-xs;
      color: var(--muted);
    }

    &--has {
      border-color: var(--honey);
      background: color-mix(in srgb, var(--honey) 14%, var(--card));
    }

    &:active {
      transform: translateY(0.125rem);
    }
  }

  &__diploma-em {
    font-size: 1.625rem; // 26px
  }

  & &__seals {
    font-weight: 700;
    color: var(--honey-deep);
  }

  /* kläder */
  &__empty {
    text-align: center;
    color: var(--muted);
  }

  &__pointer {
    font-size: 1.875rem; // 30px
    display: block;
    animation: room-bob 1.4s ease-in-out infinite;
  }

  &__to-shop {
    display: block;
    margin-top: $spacing-2;
    padding: 0.75rem $spacing-4;
    border-radius: $radius-md;
    background: var(--moss);
    color: var(--on-accent);
    font-weight: 700;
    text-decoration: none;

    @include focus-visible;
  }

  &__shelf {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(clamp(5.5rem, 23vw, 7.5rem), 1fr)); // 88-120px
    gap: $spacing-2;
    margin-top: $spacing-2;
  }

  &__item {
    background: var(--bg2);
    border: $border-width solid var(--line);
    border-radius: $radius-md;
    padding: $spacing-2 0.375rem;
    cursor: pointer;
    font: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    color: var(--ink);
    box-shadow: inset 0 -6px 0 rgba(0, 0, 0, 0.06);

    @include focus-visible;

    b {
      font-size: $font-size-sm;
    }

    small {
      font-size: $font-size-xs;
      color: var(--muted);
    }

    &--worn {
      border-color: var(--moss);
      background: color-mix(in srgb, var(--moss) 15%, var(--card));
    }
  }

  &__item-em {
    font-size: 1.75rem; // 28px
    line-height: 1.1;
  }

  & &__worn {
    color: var(--moss);
  }

  /* dagens gömda sak hittad */
  &__found {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-3;
    background: rgba(12, 28, 18, 0.72);
  }

  &__found-card {
    background: var(--card);
    border: $border-width solid var(--honey);
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
      margin: 0 0 $spacing-1;
    }
  }

  &__found-kicker {
    font-weight: 700;
  }

  &__found-icon {
    font-size: 3.5rem;
    line-height: 1.1;

    :deep(.wicon) {
      width: 5rem;
      height: 5rem;
    }
  }

  &__lore-img {
    display: block;
    max-width: 100%;
    max-height: 14rem;
    width: auto;
    height: auto;
    margin: 0 auto $spacing-2;
    object-fit: contain;
  }

  &__lore-em {
    display: block;
    font-size: 3.5rem; // 56px
    line-height: 1.1;
    margin: 0 0 $spacing-2;
  }

  &__found-row {
    display: flex;
    justify-content: center;
    gap: $spacing-2;
    margin-top: $spacing-2;
  }

  @media (prefers-reduced-motion: reduce) {
    &__flip {
      transition: none;
    }

    &__hidden {
      animation: none;
      opacity: 0.22;
    }

    &__pointer {
      animation: none;
    }

    &__spot-bubble {
      animation: none;
    }
  }
}

@keyframes room-spot-pop-left {
  0% {
    opacity: 0;
    transform: translate(-90%, -50%) scale(0.85);
  }
  15% {
    opacity: 1;
    transform: translate(-100%, -50%) scale(1);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes room-spot-pop-up {
  0% {
    opacity: 0;
    transform: translate(-50%, -90%) scale(0.85);
  }
  15% {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes room-spot-pop-down {
  0% {
    opacity: 0;
    transform: translate(-50%, 10%) scale(0.85);
  }
  15% {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* dagens gömda sak: nästan osynlig, men glimtar till ibland */
@keyframes room-hide-glint {
  0%,
  86%,
  100% {
    opacity: 0.14;
  }
  92% {
    opacity: 0.5;
  }
}

@keyframes room-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.375rem);
  }
}
</style>
