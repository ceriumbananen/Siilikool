/* Nivåmärkena (Skattkammaren, startsidan m.fl.) - porterat från RANKS/rankIndex/medalStyleOf
   i public/legacy/app.js (rad 1952-2203). */

export type Rank = {
  id: string;
  xp: number;
  em: string;
  et: string;
  sv: string;
  c1: string;
  c2: string;
  ring: string;
};

/** Vilken svårighetsgrad spelaren körde när märket togs - styr medaljens bandfärg (se MedalBadge.vue). */
export type MedalStyle = "latt" | "lagom" | "svar";

export const RANKS: Rank[] = [
  {
    id: "siil",
    xp: 0,
    em: "🦔",
    et: "Pronkssiil",
    sv: "Bronsigelkotten",
    c1: "#E8A76A",
    c2: "#A9683A",
    ring: "#7A4522",
  },
  {
    id: "lind",
    xp: 150,
    em: "🐦",
    et: "Hõbelind",
    sv: "Silverfågeln",
    c1: "#F2F5F8",
    c2: "#A9B4BF",
    ring: "#7C8894",
  },
  { id: "kala", xp: 350, em: "🐟", et: "Kuldkala", sv: "Guldfisken", c1: "#FFE08A", c2: "#E0A21A", ring: "#A87206" },
  {
    id: "karu",
    xp: 650,
    em: "🐻",
    et: "Kristallkaru",
    sv: "Kristallbjörnen",
    c1: "#DFFAFF",
    c2: "#79C9E8",
    ring: "#3E8FB0",
  },
  {
    id: "rebane",
    xp: 1000,
    em: "🦊",
    et: "Tulerebane",
    sv: "Eldräven",
    c1: "#FFC24D",
    c2: "#F2612B",
    ring: "#B33808",
  },
  { id: "hunt", xp: 1450, em: "🐺", et: "Jäähunt", sv: "Isvargen", c1: "#EAF6FF", c2: "#8FB6F0", ring: "#4E79C4" },
  {
    id: "ukssarvik",
    xp: 2000,
    em: "🦄",
    et: "Kuldükssarvik",
    sv: "Guldenhörningen",
    c1: "#FFF0A8",
    c2: "#F5B72F",
    ring: "#C77BB0",
  },
  {
    id: "draakon",
    xp: 2800,
    em: "🐉",
    et: "Tähedraakon",
    sv: "Stjärndraken",
    c1: "#E3CCFF",
    c2: "#8E5BE8",
    ring: "#5B2FB0",
  },
  {
    id: "kull",
    xp: 4000,
    em: "🦉",
    et: "Tähekull",
    sv: "Stjärnugglan",
    c1: "#FFF1D6",
    c2: "#C99A4E",
    ring: "#8A6425",
  },
  {
    id: "kotkas",
    xp: 6000,
    em: "🦅",
    et: "Kuldkotkas",
    sv: "Guldörnen",
    c1: "#FFEFA8",
    c2: "#E6A81C",
    ring: "#A06E00",
  },
  { id: "vaal", xp: 9000, em: "🐋", et: "Hõbevaal", sv: "Silvervalen", c1: "#E6F6FF", c2: "#7FB6D9", ring: "#3D7699" },
  {
    id: "podera",
    xp: 13000,
    em: "🦌",
    et: "Põhjapõder",
    sv: "Norrskensrenen",
    c1: "#D8FFEF",
    c2: "#4FD1A0",
    ring: "#1E7D5C",
  },
  {
    id: "lovi",
    xp: 18000,
    em: "🦁",
    et: "Tulelõvi",
    sv: "Eldlejonet",
    c1: "#FFD9A8",
    c2: "#F2662B",
    ring: "#A63307",
  },
  {
    id: "kilpkonn",
    xp: 25000,
    em: "🐢",
    et: "Igikilpkonn",
    sv: "Urtidssköldpaddan",
    c1: "#E2F3C8",
    c2: "#7FA83E",
    ring: "#4A6B18",
  },
  {
    id: "mammut",
    xp: 35000,
    em: "🦣",
    et: "Jäämammut",
    sv: "Isjättemammuten",
    c1: "#EAF2FF",
    c2: "#98A9C9",
    ring: "#5A6B8C",
  },
  {
    id: "paasuke",
    xp: 48000,
    em: "🕊️",
    et: "Hõbepääsuke",
    sv: "Silversvalan",
    c1: "#FFFFFF",
    c2: "#BFC9D6",
    ring: "#7E8A99",
  },
  {
    id: "paabu",
    xp: 65000,
    em: "🦚",
    et: "Kuldpaabulind",
    sv: "Guldpåfågeln",
    c1: "#CFFFF3",
    c2: "#22A6B3",
    ring: "#0B6E7A",
  },
  {
    id: "kuningas",
    xp: 100000,
    em: "👑",
    et: "Kuningsiil",
    sv: "Kungsigelkotten",
    c1: "#FFF6C0",
    c2: "#F0B222",
    ring: "#B4780A",
  },
];

export function rankIndex(xp: number): number {
  let r = 0;
  RANKS.forEach((rank, i) => {
    if (xp >= rank.xp) r = i;
  });
  return r;
}

/** Vilken svårighet ett redan taget märke ska visas med (sparas per märke när det tas). */
export function medalStyleOf(mstyle: Record<string, MedalStyle> | undefined, rankId: string): MedalStyle {
  return mstyle?.[rankId] || "lagom";
}

/** Emoji + namn för en svårighetsgrad, bara det Skattkammaren behöver visa under ett taget
 * märke ("🍃 Lätt" osv) - porterat ur DIFFS i public/legacy/app.js (rad 1903-1938). De
 * övriga DIFFS-fälten (mult/opts/types m.fl.) hör till själva spelrundorna och porteras när
 * den logiken migreras. */
const DIFFICULTY_LABELS: Record<MedalStyle, { em: string; sv: string }> = {
  latt: { em: "🍃", sv: "Lätt" },
  lagom: { em: "⭐", sv: "Lagom" },
  svar: { em: "🔥", sv: "Svår" },
};

export function difficultyLabel(style: MedalStyle): string {
  const d = DIFFICULTY_LABELS[style];
  return `${d.em} ${d.sv}`;
}
