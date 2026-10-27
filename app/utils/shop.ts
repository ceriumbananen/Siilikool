/* Marknaden (Laat) och möblerna i Siiris rum - flyttat ur public/legacy/app.js (som läser dem via window.SiiriData,
   app/plugins/siiri-data.client.ts). Ren data: ändra här, så gäller det både Vue-sidorna och legacy-skärmarna. */

export const SHOP = [
  { id: "lill", slot: "head", em: "🌸", sv: "Blomma", et: "Lill", price: 25 },
  { id: "lips", slot: "neck", em: "🎀", sv: "Rosett", et: "Lips", price: 35 },
  { id: "myts", slot: "head", em: "🧢", sv: "Röd mössa", et: "Punane müts", price: 60 },
  { id: "sall", slot: "neck", em: "🧣", sv: "Halsduk", et: "Sall", price: 90 },
  { id: "jaatis", slot: "hand", em: "🍦", sv: "Glass", et: "Jäätis", price: 120 },
  { id: "raamat", slot: "hand", em: "📕", sv: "Bok", et: "Raamat", price: 180 },
  { id: "kott", slot: "back", em: "🎒", sv: "Ryggsäck", et: "Koolikott", price: 250 },
  { id: "tiivad", slot: "back", em: "🦋", sv: "Fjärilsvingar", et: "Liblikatiivad", price: 400 },
  { id: "kroon", slot: "head", em: "👑", sv: "Guldkrona", et: "Kuldkroon", price: 700 },
  { id: "sara", slot: "aura", em: "✨", sv: "Gyllene skimmer", et: "Kuldne sära", price: 1200 },
  { id: "vikerkaar", slot: "scene", em: "🌈", sv: "Regnbåge", et: "Vikerkaar", price: 2500 },
  { id: "taevas", slot: "scene", em: "🌌", sv: "Stjärnhimmel", et: "Tähetaevas", price: 4000 },
  { id: "virmalised", slot: "scene", em: "🌠", sv: "Norrsken", et: "Virmalised", price: 3600, dream: true },
  { id: "kosmos", slot: "scene", em: "🚀", sv: "Rymden", et: "Kosmos", price: 3000, dream: true },
  { id: "rukkilill", slot: "head", em: "🪻", sv: "Blåklint", et: "Rukkilill", price: 120 },
  { id: "leib", slot: "hand", em: "🍞", sv: "Svart rågbröd", et: "Must leib", price: 160 },
  { id: "kihnu", slot: "outfit", em: "👗", sv: "Kihnukjol", et: "Kihnu seelik", price: 750 },
  { id: "paasuke2", slot: "back", em: "🐦", sv: "Ladusvala", et: "Suitsupääsuke", price: 640 },
  { id: "kannel", slot: "hand", em: "🪕", sv: "Kantele", et: "Kannel", price: 820 },
  { id: "hobekee", slot: "neck", em: "🪙", sv: "Setos silversmycke", et: "Hõbekee", price: 1100 },
  { id: "rahvas", slot: "outfit", em: "👗", sv: "Folkdräkt", et: "Rahvarõivad", price: 1400 },
  { id: "torupill", slot: "hand", em: "🪈", sv: "Säckpipa", et: "Torupill", price: 1000 },
  { id: "mulgi", slot: "outfit", em: "🧥", sv: "Mulgikaftan", et: "Mulgi kuub", price: 1700 },
  { id: "jaanituli", slot: "aura", em: "🔥", sv: "Midsommareld", et: "Jaanituli", price: 900 },
  { id: "vanalinn", slot: "scene", em: "🏙️", sv: "Gamla stan", et: "Vanalinn", price: 3500 },
  { id: "rand2", slot: "scene", em: "🏖️", sv: "Pärnu strand", et: "Pärnu rand", price: 4000 },
  { id: "raba", slot: "scene", em: "🌅", sv: "Mossen i gryningen", et: "Raba koidikul", price: 2800 },
  { id: "tulekroon", slot: "head", em: "🔥", sv: "Eldkrona", et: "Tulekroon", price: 900, hard: true },
  { id: "valk", slot: "aura", em: "⚡", sv: "Blixtar", et: "Välk", price: 1300, hard: true },
  { id: "draakon", slot: "back", em: "🐉", sv: "Drakvingar", et: "Draakonitiivad", price: 2200, hard: true },
  { id: "talv", slot: "head", em: "🎿", sv: "Vintermössa", et: "Talvemüts", price: 140, seasons: ["vinter"] },
  { id: "suusad", slot: "hand", em: "⛷️", sv: "Skidor", et: "Suusad", price: 450, seasons: ["vinter"] },
  { id: "parg", slot: "head", em: "💐", sv: "Blomsterkrans", et: "Lillepärg", price: 280, seasons: ["kevad"] },
  { id: "jaanip", slot: "head", em: "🌼", sv: "Midsommarkrans", et: "Jaanipärg", price: 320, seasons: ["suvi"] },
  { id: "ring", slot: "back", em: "🛟", sv: "Badring", et: "Ujumisrõngas", price: 380, seasons: ["suvi"] },
  { id: "lehed", slot: "head", em: "🍁", sv: "Lövkrona", et: "Lehekroon", price: 220, seasons: ["sygis"] },
  { id: "vihmav", slot: "hand", em: "☂️", sv: "Paraply", et: "Vihmavari", price: 300, seasons: ["sygis"] },
  { id: "lipp", slot: "hand", em: "🇪🇪", sv: "Estlands flagga", et: "Eesti lipp", price: 260, months: [2] },
  {
    id: "smvsall",
    slot: "neck",
    em: "🧣",
    sv: "Blå-svart-vit halsduk",
    et: "Sinimustvalge sall",
    price: 340,
    months: [2],
  },
  { id: "joulum", slot: "head", em: "🎅", sv: "Tomteluva", et: "Jõulumüts", price: 240, months: [12] },
  { id: "tuli", slot: "aura", em: "🎆", sv: "Fyrverkeri", et: "Ilutulestik", price: 600, months: [12, 1] },
];

export const FURN = [
  { id: "w-panel", slot: "wall", sv: "Gräddpanel", et: "Kreemjas", price: 0, def: 1 },
  { id: "w-mint", slot: "wall", sv: "Grönaktig vägg", et: "Rohekas", price: 260 },
  { id: "w-rose", slot: "wall", sv: "Rosaaktig vägg", et: "Roosakas", price: 260 },
  { id: "w-blue", slot: "wall", sv: "Blåaktig vägg", et: "Sinakas", price: 320 },
  { id: "w-stars", slot: "wall", sv: "Stjärntapet", et: "Tähetapeet", price: 650 },
  { id: "f-wood", slot: "floor", sv: "Furugolv", et: "Puupõrand", price: 0, def: 1 },
  { id: "f-dark", slot: "floor", sv: "Mörkt golv", et: "Tume põrand", price: 240 },
  { id: "f-tile", slot: "floor", sv: "Rutigt golv", et: "Ruuduline", price: 380 },
  { id: "r-round", slot: "rug", sv: "Rund matta", et: "Ümmargune vaip", price: 0, def: 1 },
  { id: "r-stripe", slot: "rug", sv: "Randig matta", et: "Triibuline vaip", price: 220 },
  { id: "r-folk", slot: "rug", sv: "Folkmönstrad matta", et: "Rahvavaip", price: 460 },
  { id: "r-bear", slot: "rug", sv: "Björnfäll", et: "Karunahk", price: 700 },
  { id: "l-none", slot: "left", sv: "Ingen möbel", et: "Ilma", price: 0, def: 1 },
  { id: "l-bed", slot: "left", sv: "Liten säng", et: "Voodi", price: 520 },
  { id: "l-desk", slot: "left", sv: "Skrivbord", et: "Kirjutuslaud", price: 430 },
  { id: "l-rock", slot: "left", sv: "Gungstol", et: "Kiiktool", price: 600 },
  { id: "g-wood", slot: "right", sv: "Vedkorg", et: "Puukorv", price: 0, def: 1 },
  { id: "g-shelf", slot: "right", sv: "Bokhylla", et: "Raamaturiiul", price: 480 },
  { id: "g-toys", slot: "right", sv: "Leksakskorg", et: "Mänguasjad", price: 300 },
  { id: "g-kannel", slot: "right", sv: "Kannel på stativ", et: "Kannel", price: 820 },
  { id: "a-none", slot: "art", sv: "Ingen tavla", et: "Ilma", price: 0, def: 1 },
  { id: "a-view", slot: "art", sv: "Landskapstavla", et: "Maastik", price: 280 },
  { id: "a-map", slot: "art", sv: "Karta över Estland", et: "Kaart", price: 340 },
  { id: "a-photo", slot: "art", sv: "Familjefoto", et: "Pere pilt", price: 420 },
  { id: "p-none", slot: "lamp", sv: "Ingen lampa", et: "Ilma", price: 0, def: 1 },
  { id: "p-floor", slot: "lamp", sv: "Golvlampa", et: "Põrandalamp", price: 260 },
  { id: "p-lant", slot: "lamp", sv: "Lykta", et: "Latern", price: 340 },
  { id: "v-none", slot: "plant", sv: "Ingen växt", et: "Ilma", price: 0, def: 1 },
  { id: "v-pot", slot: "plant", sv: "Krukväxt", et: "Toataim", price: 180 },
  { id: "v-tree", slot: "plant", sv: "Litet träd", et: "Väike puu", price: 420 },
  { id: "v-flow", slot: "plant", sv: "Blomvas", et: "Lillevaas", price: 300 },
  { id: "v-cact", slot: "plant", sv: "Kaktus", et: "Kaktus", price: 260 },
  { id: "u-day", slot: "view", sv: "Sommardag", et: "Suvepäev", price: 0, def: 1 },
  { id: "u-night", slot: "view", sv: "Stjärnnatt", et: "Tähine öö", price: 340 },
  { id: "u-snow", slot: "view", sv: "Snöfall", et: "Lumesadu", price: 380 },
  { id: "d-none", slot: "pet", sv: "Inget djur", et: "Ilma", price: 0, def: 1 },
  { id: "d-cat", slot: "pet", sv: "Kattunge", et: "Kassipoeg", price: 900 },
  { id: "d-bird", slot: "pet", sv: "Fågel i bur", et: "Lind puuris", price: 640 },
  { id: "d-hedge", slot: "pet", sv: "Liten igelkott", et: "Siilipoeg", price: 1200 },
  { id: "w-wood", slot: "wall", sv: "Timmervägg", et: "Palksein", price: 520 },
  { id: "r-star", slot: "rug", sv: "Stjärnmatta", et: "Tähevaip", price: 520 },
  { id: "l-sofa", slot: "left", sv: "Liten soffa", et: "Diivan", price: 700 },
  { id: "g-dress", slot: "right", sv: "Byrå", et: "Kummut", price: 560 },
  { id: "a-clock", slot: "art", sv: "Väggklocka", et: "Seinakell", price: 300 },
  { id: "p-ceil", slot: "lamp", sv: "Taklampa", et: "Laelamp", price: 420 },
  { id: "a-koler", slot: "art", sv: "Tütarlaps allikal (tavla)", et: "Tütarlaps allikal", price: 380 },
];

export type ShopItem = (typeof SHOP)[number];
export type FurnItem = (typeof FURN)[number];

/** Var på Siiri ett plagg sitter - hyllorna i Laat i den här ordningen. */
export const WEAR_SLOTS = [
  { id: "head", sv: "På huvudet" },
  { id: "outfit", sv: "Dräkt" },
  { id: "neck", sv: "Runt halsen" },
  { id: "hand", sv: "I tassen" },
  { id: "back", sv: "På ryggen" },
  { id: "aura", sv: "Runt Siiri" },
  { id: "scene", sv: "Bakom Siiri" },
];

/** Platserna i Siiris rum: [id, namn, emoji]. */
export const FURN_SLOTS: [string, string, string][] = [
  ["wall", "Vägg", "🎨"],
  ["floor", "Golv", "🪵"],
  ["rug", "Matta", "🟣"],
  ["left", "Möbel vänster", "🪑"],
  ["right", "Möbel höger", "📚"],
  ["art", "På väggen", "🖼️"],
  ["lamp", "Lampa", "💡"],
  ["plant", "Växt", "🪴"],
  ["view", "Utsikt", "🪟"],
  ["pet", "Husdjur", "🐾"],
];

/** Säsongs-, högtids- och svår-nivå-varor - syns bara ibland. */
export function isLimited(it: ShopItem): boolean {
  return !!(it.months || it.seasons || it.hard);
}

/** Finns plagget i butiken nu? Ägda plagg kan alltid bäras; svår-nivå-varorna kräver ett tema
 * klarat på svår (hardWins), säsongsvarorna rätt månad eller årstid. */
export function itemAvailable(it: ShopItem, owned: string[], hardWins: number, date = new Date()): boolean {
  if (owned.includes(it.id)) return true;
  if (it.hard && hardWins < 1) return false;
  if (it.months) return it.months.includes(date.getMonth() + 1);
  if (it.seasons) return (it.seasons as string[]).includes(seasonId(date));
  return true;
}

export function furnById(id: string): FurnItem | null {
  return FURN.find(f => f.id === id) || null;
}

/** Möbler som ingår från början (def) räknas alltid som ägda. */
export function furnOwned(id: string, furnOwnedIds: string[] | undefined): boolean {
  const f = furnById(id);
  return !!(f && (f.def || (furnOwnedIds || []).includes(id)));
}

/** Vad som står på en plats i rummet: det valda, annars det som ingår från början. */
export function furnOf(slot: string, room: Record<string, string> | undefined, furnOwnedIds: string[] | undefined) {
  const id = room?.[slot];
  if (id && furnOwned(id, furnOwnedIds)) return id;
  return FURN.find(f => f.slot === slot && f.def)?.id ?? null;
}
