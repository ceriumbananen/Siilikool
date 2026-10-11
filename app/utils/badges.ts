/* Bragdmärkena (Skattkammaren m.fl.) - porterat från BADGES/badgeProgress i public/legacy/app.js
   (rad 2483-2731 respektive 6781-6850). Märkena som gäller resan, marknaden och temana jämför
   mot de riktiga listorna (TRIP i trip.ts, SHOP i shop.ts, THEMES i themes.ts). RIVALS (app/
   utils/rivals.ts) auto-importeras, precis som allt annat i app/utils. */

/** De fält badge-logiken faktiskt läser ur sparfilen (SaveData i shared/types/save.ts
 * har många fler, otypade fält - det här är bara det den här filen behöver). */
export type BadgeProfile = {
  correct: number;
  spoken: number;
  typed: number;
  perfect: number;
  best: Record<string, number>;
  bestcombo?: number;
  sentbest?: number;
  stars: number;
  flames?: number;
  tripDone?: number;
  owned?: string[];
  hardWins?: number;
  secrets?: string[];
  duels?: Record<string, { w?: number; l?: number }>;
};

export type Badge = {
  id: string;
  em: string;
  sv: string;
  test: (s: BadgeProfile) => boolean;
};

const TRIP_LENGTH = TRIP.length;
const SHOP_LENGTH = SHOP.length;
const RIVAL_IDS = ["hiir", "rebane", "karu", "draakon"] as const;
/** Hur många teman appen har totalt (THEMES.length i legacy-koden) - badgen "all" och
 * profilsidans "X av Y teman klara"-statistik jämför båda mot den. */
export const THEMES_LENGTH = THEMES.length;

export const BADGES: Badge[] = [
  { id: "first", em: "🌱", sv: "Första ordet", test: s => s.correct >= 1 },
  { id: "ten", em: "🔟", sv: "Tio rätt", test: s => s.correct >= 10 },
  { id: "fifty", em: "🏆", sv: "Femtio rätt", test: s => s.correct >= 50 },
  { id: "talker", em: "🎤", sv: "Pratmakare", test: s => s.spoken >= 8 },
  { id: "writer", em: "✏️", sv: "Stavningsmästare", test: s => s.typed >= 8 },
  { id: "perfect", em: "💎", sv: "Allt rätt i ett tema", test: s => s.perfect >= 1 },
  {
    id: "all",
    em: "👑",
    sv: "Alla teman klara",
    test: s => Object.values(s.best || {}).filter(v => v > 0).length >= THEMES_LENGTH,
  },
  { id: "combo8", em: "🔥", sv: "Åtta rätt i rad", test: s => (s.bestcombo || 0) >= 8 },
  { id: "flame3", em: "🌟", sv: "Tre dagsutmaningar klarade", test: s => (s.flames || 0) >= 3 },
  { id: "stars100", em: "🌟", sv: "Hundra stjärnor", test: s => s.stars >= 100 },
  { id: "right250", em: "📗", sv: "250 rätta svar", test: s => s.correct >= 250 },
  { id: "right1000", em: "📘", sv: "1000 rätta svar", test: s => s.correct >= 1000 },
  { id: "spoken50", em: "🗣️", sv: "50 ord sagda högt", test: s => s.spoken >= 50 },
  { id: "typed50", em: "⌨️", sv: "50 skrivna ord", test: s => s.typed >= 50 },
  { id: "sent25", em: "🧩", sv: "25 byggda meningar", test: s => (s.sentbest || 0) >= 6 && s.correct >= 200 },
  { id: "flame7", em: "📅", sv: "Sju dagsutmaningar klarade", test: s => (s.flames || 0) >= 7 },
  { id: "flame30", em: "🗓️", sv: "Trettio dagsutmaningar klarade", test: s => (s.flames || 0) >= 30 },
  { id: "trip6", em: "🗺️", sv: "Halva Estland", test: s => (s.tripDone || 0) >= Math.ceil(TRIP_LENGTH / 2) },
  { id: "trip12", em: "🧭", sv: "Hela resan klar", test: s => (s.tripDone || 0) >= TRIP_LENGTH },
  { id: "wardrobe", em: "👗", sv: "Halva marknaden", test: s => (s.owned || []).length >= 13 },
  { id: "wardrobeall", em: "🎽", sv: "Hela marknaden", test: s => (s.owned || []).length >= SHOP_LENGTH },
  { id: "hardwin", em: "🔥", sv: "Klarat svår nivå", test: s => (s.hardWins || 0) >= 1 },
  { id: "hard10", em: "🐲", sv: "Tio teman på svår", test: s => (s.hardWins || 0) >= 10 },
  { id: "perfect5", em: "💠", sv: "Fem perfekta teman", test: s => (s.perfect || 0) >= 5 },
  { id: "stars5000", em: "✨", sv: "5 000 stjärnor samlade", test: s => s.stars >= 5000 },
  { id: "kilpkonn", em: "🐢", sv: "Sköldpaddans märke", test: s => (s.secrets || []).includes("turtle") },
  {
    id: "duel1",
    em: "⚔️",
    sv: "Första duellvinsten",
    test: s => Object.values(s.duels || {}).reduce((n, d) => n + (d.w || 0), 0) >= 1,
  },
  {
    id: "duel10",
    em: "🥊",
    sv: "Tio duellvinster",
    test: s => Object.values(s.duels || {}).reduce((n, d) => n + (d.w || 0), 0) >= 10,
  },
  {
    id: "duelall",
    em: "👑",
    sv: "Slagit alla fyra",
    test: s => RIVAL_IDS.filter(id => (s.duels || {})[id]?.w).length >= 4,
  },
];

/** [nuvarande, mål] för ett ännu inte taget märke, eller null om det inte har en synlig
 * siffra (t.ex. hemliga märken som "kilpkonn" - de ska förbli mystiska). */
export function badgeProgress(badge: Badge, s: BadgeProfile): [number, number] | null {
  switch (badge.id) {
    case "first":
      return [Math.min(s.correct, 1), 1];
    case "ten":
      return [Math.min(s.correct, 10), 10];
    case "fifty":
      return [Math.min(s.correct, 50), 50];
    case "talker":
      return [Math.min(s.spoken, 8), 8];
    case "writer":
      return [Math.min(s.typed, 8), 8];
    case "perfect":
      return [Math.min(s.perfect, 1), 1];
    case "all":
      return [Object.values(s.best || {}).filter(v => v > 0).length, THEMES_LENGTH];
    case "combo8":
      return [Math.min(s.bestcombo || 0, 8), 8];
    case "flame3":
      return [Math.min(s.flames || 0, 3), 3];
    case "stars100":
      return [Math.min(s.stars, 100), 100];
    case "right250":
      return [Math.min(s.correct, 250), 250];
    case "right1000":
      return [Math.min(s.correct, 1000), 1000];
    case "spoken50":
      return [Math.min(s.spoken, 50), 50];
    case "typed50":
      return [Math.min(s.typed, 50), 50];
    case "sent25":
      /* två krav (6 meningar och 200 rätt) - visa det som ligger längst efter */
      if ((s.sentbest || 0) / 6 <= (s.correct || 0) / 200) return [Math.min(s.sentbest || 0, 6), 6];
      return [Math.min(s.correct || 0, 200), 200];
    case "flame7":
      return [Math.min(s.flames || 0, 7), 7];
    case "flame30":
      return [Math.min(s.flames || 0, 30), 30];
    case "trip6":
      return [Math.min(s.tripDone || 0, Math.ceil(TRIP_LENGTH / 2)), Math.ceil(TRIP_LENGTH / 2)];
    case "trip12":
      return [Math.min(s.tripDone || 0, TRIP_LENGTH), TRIP_LENGTH];
    case "wardrobe":
      return [Math.min((s.owned || []).length, 13), 13];
    case "wardrobeall":
      return [Math.min((s.owned || []).length, SHOP_LENGTH), SHOP_LENGTH];
    case "hardwin":
      return [Math.min(s.hardWins || 0, 1), 1];
    case "hard10":
      return [Math.min(s.hardWins || 0, 10), 10];
    case "perfect5":
      return [Math.min(s.perfect || 0, 5), 5];
    case "stars5000":
      return [Math.min(s.stars || 0, 5000), 5000];
    case "duel1":
      return [
        Math.min(
          Object.values(s.duels || {}).reduce((n, d) => n + (d.w || 0), 0),
          1,
        ),
        1,
      ];
    case "duel10":
      return [
        Math.min(
          Object.values(s.duels || {}).reduce((n, d) => n + (d.w || 0), 0),
          10,
        ),
        10,
      ];
    case "duelall":
      return [RIVAL_IDS.filter(id => (s.duels || {})[id]?.w).length, 4];
    default:
      return null; /* kilpkonn m.fl. hemligheter förblir mystiska */
  }
}

export function hasBadge(s: { badges: string[] }, badge: Badge): boolean {
  return s.badges.includes(badge.id);
}
