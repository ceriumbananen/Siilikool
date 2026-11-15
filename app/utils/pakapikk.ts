/* Päkapiku kirjad (tomtenissens brev) - en estnisk adventstradition i Siiris rum. I Estland
   lämnar päkapikud (tomtenissarna) små överraskningar till barnen varje natt i december.
   Här lämnar Siiris nisse ett brev på enkel estniska i rummet, 1-24 december: brevet säger var nissen gömt dagens sak ("Vaata vaiba
   alla!"), barnet letar i rummet, och när det hittat rätt säger nissen var den låg med
   lägesorden från temat Var saker är ("Vaiba all!"). Senare i december blir det kedjor om två
   och tre lappar. Missade brev ligger kvar och väntar - ingen streak, ingen skuld.
   Spelet och scenen: app/composables/usePakapikk.ts och app/components/room/Pakapikk*.vue. */

export type PakLine = { et: string; sv: string };

export type PakTargetId = "vaip" | "kardin" | "lipp" | "riiul" | "aken" | "kamin" | "siiri";

/** Där nissen kan gömma något: bara sådant som alltid finns i rummet (inte möbler man kan byta
 * bort). Rutorna är procent av scenen (samma koordinater som HIDE_SPOTS i room-svg.ts);
 * gardinerna och fönstren är flera rutor. Siiri har ingen ruta - där är det vändningen som
 * räknas (se onSiiriFlip i usePakapikk). */
export type PakTarget = {
  id: PakTargetId;
  ask: PakLine; /* instruktionen i brevet */
  at: PakLine; /* var saken låg - lägesordet i grundform */
  rects: [x: number, y: number, w: number, h: number][];
  /* var nissen tittar fram: bakom en kant i rummet (rummets koordinater, viewBox 0 0 400 270).
     x = mitten, edge = kantens överkant (där vantarna vilar), w = nissens bredd. Siiri har
     ingen fast kant - där räknas platsen fram ur hennes storlek (PakapikkStage). */
  peek: PakPeek;
};

export type PakPeek = { x: number; edge: number; w: number };

export const PAK_TARGETS: Record<PakTargetId, PakTarget> = {
  vaip: {
    id: "vaip",
    ask: { et: "Vaata vaiba alla!", sv: "Titta under mattan!" },
    at: { et: "Vaiba all!", sv: "Under mattan!" },
    rects: [[15, 77, 43, 13]],
    peek: { x: 92, edge: 250, w: 36 } /* mattans framkant - tills det finns en liggande pose */,
  },
  kardin: {
    id: "kardin",
    ask: { et: "Vaata kardina taha!", sv: "Titta bakom gardinen!" },
    at: { et: "Kardina taga!", sv: "Bakom gardinen!" },
    rects: [
      [1, 11, 7, 29],
      [17, 11, 5, 29],
      [39, 11, 5.5, 29],
      [53.5, 11, 5.5, 29],
    ],
    peek: { x: 26, edge: 108, w: 36 } /* på fönsterbrädan, bredvid gardinen */,
  },
  lipp: {
    id: "lipp",
    ask: { et: "Vaata lipu taha!", sv: "Titta bakom flaggan!" },
    at: { et: "Lipu taga!", sv: "Bakom flaggan!" },
    rects: [[74, 8, 15, 20]],
    peek: { x: 325, edge: 29, w: 32 } /* över flaggramens överkant */,
  },
  riiul: {
    id: "riiul",
    ask: { et: "Vaata riiuli peale!", sv: "Titta på hyllan!" },
    at: { et: "Riiuli peal!", sv: "På hyllan!" },
    rects: [[69, 33, 25, 11]],
    peek: { x: 318, edge: 96, w: 36 } /* bakom översta hyllan */,
  },
  aken: {
    id: "aken",
    ask: { et: "Vaata aknast välja!", sv: "Titta ut genom fönstret!" },
    at: { et: "Akna taga!", sv: "Utanför fönstret!" },
    rects: [
      [8, 12, 9, 28],
      [44.5, 12, 9, 28],
    ],
    peek: { x: 197, edge: 108, w: 38 } /* utanför fönstret, över fönsterbrädan */,
  },
  kamin: {
    id: "kamin",
    ask: { et: "Vaata kamina juurde!", sv: "Titta vid brasan!" },
    at: { et: "Kamina juures!", sv: "Vid brasan!" },
    rects: [[73, 52, 15, 24]],
    peek: { x: 322, edge: 151, w: 36 } /* bakom spiselkransen */,
  },
  siiri: {
    id: "siiri",
    ask: { et: "Pööra Siiri ümber!", sv: "Vänd på Siiri!" },
    at: { et: "Siiri selja taga!", sv: "Bakom Siiris rygg!" },
    rects: [],
    peek: { x: 0, edge: 0, w: 0 } /* räknas fram ur Siiris storlek */,
  },
};

export const PAK_GREETING: PakLine = { et: "Tere, sõber!", sv: "Hej, kompis!" };
export const PAK_SIGNOFF: PakLine = { et: "Sinu päkapikk", sv: "Din tomtenisse" };
export const PAK_WELL_DONE: PakLine = { et: "Tubli!", sv: "Bra gjort!" };
export const PAK_FOUND: PakLine = { et: "Leidsid!", sv: "Du hittade!" };
export const PAK_WRONG: PakLine = { et: "Ei ole siin.", sv: "Inte här." };
export const PAK_SOON: PakLine = { et: "Päkapikud tulevad varsti!", sv: "Tomtenissarna kommer snart!" };
export const PAK_FINAL_WISH: PakLine = { et: "Häid jõule!", sv: "God jul!" };
export const PAK_TOMORROW: PakLine = { et: "Homme tuleb uus kiri!", sv: "I morgon kommer ett nytt brev!" };

/** em = emoji; img = en egen bild när ingen emoji stämmer (🍪 är en chokladkaka, ingen pepparkaka). */
export type PakGift = { et: string; sv: string; em: string; img?: string };
const GIFTS: PakGift[] = [
  { et: "komm", sv: "godis", em: "🍬" },
  { et: "piparkook", sv: "pepparkaka", em: "🍪", img: "/images/room/pak-piparkook.svg" },
  { et: "mandariin", sv: "mandarin", em: "🍊" },
  { et: "pähkel", sv: "nöt", em: "🌰" },
  { et: "õun", sv: "äpple", em: "🍎" },
  { et: "kelluke", sv: "bjällra", em: "🔔" },
  { et: "küünal", sv: "ljus", em: "🕯️" },
  { et: "sokk", sv: "strumpa", em: "🧦" },
  { et: "täht", sv: "stjärna", em: "⭐" },
];
export const PAK_FINAL_GIFT: PakGift = { et: "kingitus", sv: "julklapp", em: "🎁" };
/** Julafton: nissens sista present är tomteluvan ur Laat (shop.ts, "joulum"). */
export const PAK_FINAL_ITEM = "joulum";

/* dagens rad i brevet - en liten berättelse om nissen genom december */
const STORY: PakLine[] = [
  { et: "Mina olen päkapikk.", sv: "Jag är en tomtenisse." },
  { et: "Ma elan metsas.", sv: "Jag bor i skogen." },
  { et: "Mul on punane müts.", sv: "Jag har en röd luva." },
  { et: "Väljas sajab lund.", sv: "Det snöar ute." },
  { et: "Ma olen väike ja kiire.", sv: "Jag är liten och snabb." },
  { et: "Mul on külm nina.", sv: "Jag är kall om näsan." },
  { et: "Ma armastan piparkooke.", sv: "Jag älskar pepparkakor." },
  { et: "Täna on kaks kirja!", sv: "I dag är det två brev!" },
  { et: "Jõuluvana teeb kingitusi.", sv: "Julgubben gör julklappar." },
  { et: "Ma laulan jõululaulu.", sv: "Jag sjunger en julsång." },
  { et: "Põhjapõder on mu sõber.", sv: "Renen är min kompis." },
  { et: "Ma tegin lumememme.", sv: "Jag byggde en snögubbe." },
  { et: "Mu müts on liiga suur.", sv: "Min luva är för stor." },
  { et: "Ma kukkusin lumme.", sv: "Jag ramlade i snön." },
  { et: "Täna on kolm kirja!", sv: "I dag är det tre brev!" },
  { et: "Siiri on väga armas.", sv: "Siiri är jättegullig." },
  { et: "Ma ei maga öösel.", sv: "Jag sover inte på natten." },
  { et: "Metsas on palju lund.", sv: "Det är mycket snö i skogen." },
  { et: "Ma tõin kuuse.", sv: "Jag har hämtat en gran." },
  { et: "Jõuludeni on neli päeva.", sv: "Fyra dagar kvar till jul." },
  { et: "Jõuludeni on kolm päeva.", sv: "Tre dagar kvar till jul." },
  { et: "Jõuludeni on kaks päeva.", sv: "Två dagar kvar till jul." },
  { et: "Homme on jõululaupäev!", sv: "I morgon är det julafton!" },
  { et: "Häid jõule!", sv: "God jul!" },
];

/* var nissen gömmer saker, dag för dag: en lapp första veckan, två den andra, sedan tre.
   Aldrig samma ställe två gånger i rad, och julaftonens kedja slutar hos Siiri. */
const HUNTS: PakTargetId[][] = [
  ["vaip"],
  ["kardin"],
  ["kamin"],
  ["riiul"],
  ["lipp"],
  ["aken"],
  ["siiri"],
  ["vaip", "riiul"],
  ["kardin", "kamin"],
  ["lipp", "aken"],
  ["siiri", "vaip"],
  ["kamin", "kardin"],
  ["riiul", "lipp"],
  ["aken", "siiri"],
  ["vaip", "kamin", "kardin"],
  ["lipp", "riiul", "aken"],
  ["siiri", "kardin", "vaip"],
  ["kamin", "lipp", "riiul"],
  ["aken", "vaip", "siiri"],
  ["kardin", "riiul", "kamin"],
  ["lipp", "siiri", "aken"],
  ["riiul", "kardin", "vaip"],
  ["kamin", "aken", "lipp"],
  ["kardin", "lipp", "siiri"],
];

export const PAK_DAYS = 24;

export type PakDay = { day: number; story: PakLine; steps: PakTargetId[]; gift: PakGift };

export function pakDay(day: number): PakDay {
  const i = Math.min(PAK_DAYS, Math.max(1, day)) - 1;
  return {
    day: i + 1,
    story: STORY[i]!,
    steps: HUNTS[i]!,
    gift: i === PAK_DAYS - 1 ? PAK_FINAL_GIFT : GIFTS[i % GIFTS.length]!,
  };
}

/** Alla estniska fraser som behöver Siiris röst (tools/generate_audio.py pakapikk ...). */
export function pakPhrases(): string[] {
  const out = new Set<string>();
  for (const l of [PAK_GREETING, PAK_SIGNOFF, PAK_WELL_DONE, PAK_FOUND, PAK_WRONG, PAK_SOON, PAK_TOMORROW, ...STORY])
    out.add(l.et);
  for (const t of Object.values(PAK_TARGETS)) {
    out.add(t.ask.et);
    out.add(t.at.et);
  }
  for (const g of [...GIFTS, PAK_FINAL_GIFT]) out.add(g.et);
  return [...out];
}

/* ---------- var brevet ligger ----------
   Julstrumpan hänger alltid under vänstra fönsterbrädan, men brevet lägger nissen på ett
   nytt ställe varje dag - ibland i strumpan, ibland på hyllan, spiselkransen, golvet ...
   Koordinaterna är rummets egna (viewBox 0 0 400 270 i room-svg.ts): x = mitten, y = där
   saken står (underkanten), w = bredd. Bara sådant som alltid finns i rummet. */
export type PakDrop = { id: string; x: number; y: number; w: number };
export const PAK_STOCKING: PakDrop = { id: "sokk", x: 44, y: 162, w: 22 };
const DROPS: PakDrop[] = [
  { id: "sokk", x: 46, y: 128, w: 20 } /* i julstrumpan */,
  { id: "riiul", x: 356, y: 98.5, w: 26 } /* på översta hyllan */,
  { id: "vaip", x: 88, y: 244, w: 28 } /* på mattans vänstra kant */,
  { id: "aken2", x: 197, y: 117, w: 26 } /* på andra fönsterbrädan */,
  { id: "kamin", x: 330, y: 152, w: 26 } /* på spiselkransen, mellan dockorna och dalahästen */,
  { id: "porand", x: 264, y: 228, w: 28 } /* på golvet mellan Siiri och brasan */,
];
/** Var brevet för en viss dag ligger - aldrig samma ställe två dagar i rad. */
export function pakDrop(day: number): PakDrop {
  return DROPS[(Math.max(1, day) - 1) % DROPS.length]!;
}

/* ---------- kalendern ---------- */

/** Vilken fas december-leken är i just nu: "soon" sista veckan i november (julstrumpan hänger
 * redan på fönsterbrädan), "on" i december (brev 1 till dagens datum, högst 24), annars "off".
 * Breven går att hämta ut hela december, så den som missat dagar före jul hinner ikapp. */
export function pakPhase(date: Date): { phase: "off" | "soon" | "on"; open: number; year: number } {
  const m = date.getMonth() + 1,
    d = date.getDate(),
    year = date.getFullYear();
  if (m === 12) return { phase: "on", open: Math.min(d, PAK_DAYS), year };
  if (m === 11 && d >= 24) return { phase: "soon", open: 0, year };
  return { phase: "off", open: 0, year };
}

/** Nyckeln i S.pakFound för ett brev ("2026-7"), så att nästa jul börjar om från början. */
export const pakKey = (year: number, day: number) => `${year}-${day}`;
