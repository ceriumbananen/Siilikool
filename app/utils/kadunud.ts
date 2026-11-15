/* Kadunud asi (Den försvunna saken) - en minneslek i Siiris rum. Barnet tittar noga på rummet,
   blundar ("Sulge silmad!", Siiri räknar "üks, kaks, kolm"), och när ögonen öppnas har en sak
   försvunnit. "Mis on kadunud?" - barnet väljer rätt ord (eller trycker där saken stod), och
   Siiri säger "Vaip on kadunud!" medan saken tonar tillbaka. Spelplanen är barnets eget rum,
   med de möbler det själv köpt i Laat. Spelet: app/pages/kadunud.vue. */

export type KadLine = { et: string; sv: string };

/** En sak i rummet som kan försvinna. sel = var den finns i rummets SVG (room-svg.ts, scenes.ts),
 * et/sv = ordet (sv i bestämd form, för "Mattan är borta!"), svWord = det svenska ordet i
 * obestämd grundform ("matta") - det som står på valknapparna i estniskt läge. */
export type KadThing = { key: string; sel: string; et: string; sv: string; svWord: string };
type KadWord = { et: string; sv: string; svWord: string };

/* möbler och annat man väljer själv: ordet beror på vad som står där */
const BY_FURN: Record<string, KadWord> = {
  "a-view": { et: "maal", sv: "tavlan", svWord: "tavla" },
  "a-koler": { et: "maal", sv: "tavlan", svWord: "tavla" },
  "a-map": { et: "kaart", sv: "kartan", svWord: "karta" },
  "a-photo": { et: "foto", sv: "fotot", svWord: "foto" },
  "a-clock": { et: "kell", sv: "klockan", svWord: "klocka" },
  "v-pot": { et: "lill", sv: "blomman", svWord: "blomma" },
  "v-tree": { et: "puu", sv: "trädet", svWord: "träd" },
  "v-flow": { et: "lillevaas", sv: "blomvasen", svWord: "blomvas" },
  "v-cact": { et: "kaktus", sv: "kaktusen", svWord: "kaktus" },
  "l-bed": { et: "voodi", sv: "sängen", svWord: "säng" },
  "l-desk": { et: "laud", sv: "skrivbordet", svWord: "skrivbord" },
  "l-rock": { et: "kiiktool", sv: "gungstolen", svWord: "gungstol" },
  "l-sofa": { et: "diivan", sv: "soffan", svWord: "soffa" },
  "g-wood": { et: "puukorv", sv: "vedkorgen", svWord: "vedkorg" },
  "g-shelf": { et: "raamaturiiul", sv: "bokhyllan", svWord: "bokhylla" },
  "g-toys": { et: "mänguasjad", sv: "leksakerna", svWord: "leksaker" },
  "g-kannel": { et: "kannel", sv: "kanteln", svWord: "kantele" },
  "g-dress": { et: "kummut", sv: "byrån", svWord: "byrå" },
  "p-floor": { et: "lamp", sv: "lampan", svWord: "lampa" },
  "p-ceil": { et: "lamp", sv: "lampan", svWord: "lampa" },
  "p-lant": { et: "latern", sv: "lyktan", svWord: "lykta" },
  "d-cat": { et: "kass", sv: "katten", svWord: "katt" },
  "d-bird": { et: "lind", sv: "fågeln", svWord: "fågel" },
  "d-hedge": { et: "siilipoeg", sv: "igelkottsungen", svWord: "igelkottsunge" },
};

/* platserna i rummet: fasta saker (flaggan, brasan, ...) och platser för valda möbler */
const SPOTS: { key: string; sel: string; slot?: string; et?: string; sv?: string; svWord?: string }[] = [
  { key: "lipp", sel: "#roomflag", et: "lipp", sv: "flaggan", svWord: "flagga" },
  { key: "kamin", sel: "#roomfire", et: "kamin", sv: "brasan", svWord: "brasa" },
  { key: "nukud", sel: "#roomdolls", et: "nukud", sv: "dockorna", svWord: "dockor" },
  { key: "puuhobune", sel: "#roomdala", et: "puuhobune", sv: "trähästen", svWord: "trähäst" },
  { key: "aken", sel: "#roomwindow2", et: "aken", sv: "fönstret", svWord: "fönster" },
  { key: "vaip", sel: "#roomrug", et: "vaip", sv: "mattan", svWord: "matta" },
  { key: "art", sel: "#roomart", slot: "art" },
  { key: "plant", sel: "#roomplant", slot: "plant" },
  { key: "left", sel: "#roomleft", slot: "left" },
  { key: "right", sel: "#roomright", slot: "right" },
  { key: "lamp", sel: '#roomlamp, [data-kad="lamp"]', slot: "lamp" },
  { key: "pet", sel: '#roompet, [data-kad="pet"]', slot: "pet" },
];

/** Sakerna som finns i barnets rum just nu (furnOf = vad som står på en plats, som i room.vue).
 * Om saken faktiskt syns kontrolleras sedan i sidan (elementet måste finnas och ha storlek). */
export function kadThings(furnOf: (slot: string) => string | null): KadThing[] {
  const out: KadThing[] = [];
  for (const s of SPOTS) {
    if (!s.slot) {
      out.push({ key: s.key, sel: s.sel, et: s.et!, sv: s.sv!, svWord: s.svWord! });
      continue;
    }
    const id = furnOf(s.slot);
    const w = id ? BY_FURN[id] : undefined;
    if (w) out.push({ key: s.key, sel: s.sel, et: w.et, sv: w.sv, svWord: w.svWord });
  }
  return out;
}

export const kadGone = (t: KadThing): KadLine => ({
  et: `${t.et[0]!.toUpperCase()}${t.et.slice(1)} on kadunud!`,
  sv: `${t.sv[0]!.toUpperCase()}${t.sv.slice(1)} är borta!`,
});

export const KAD_LOOK: KadLine = { et: "Vaata tuba hästi!", sv: "Titta noga på rummet!" };
export const KAD_CLOSE: KadLine = { et: "Sulge silmad!", sv: "Blunda!" };
export const KAD_OPEN: KadLine = { et: "Ava silmad!", sv: "Öppna ögonen!" };
export const KAD_WHAT: KadLine = { et: "Mis on kadunud?", sv: "Vad är borta?" };
export const KAD_STILL: KadLine = { et: "Ei, see on alles!", sv: "Nej, den finns kvar!" };
export const KAD_HERE: KadLine = { et: "Siin see on!", sv: "Här är den!" };
export const KAD_COUNT = ["üks", "kaks", "kolm"];
/** estniskt läge: Siiri räknar på svenska */
export const KAD_COUNT_SV = ["ett", "två", "tre"];
export const KAD_DONE: KadLine = { et: "Tubli!", sv: "Bra gjort!" };

/* Estniskt läge: "Nej, den finns kvar!" / "Här är den!" blir fel på svenska för ett-ord och
   plural (fönstret, leksakerna), så där säger Siiri saken själv: "Nej, fönstret finns kvar!",
   "Här är mattan!". Den estniska hjälpraden är densamma som i KAD_STILL / KAD_HERE. */
export const kadStill = (t: KadThing): KadLine => ({ et: KAD_STILL.et, sv: `Nej, ${t.sv} finns kvar!` });
export const kadHere = (t: KadThing): KadLine => ({ et: KAD_HERE.et, sv: `Här är ${t.sv}!` });

/** alla ord som kan försvinna (fasta saker och möbler) */
function kadWords(): KadWord[] {
  return [
    ...SPOTS.filter(s => s.et).map(s => ({ et: s.et!, sv: s.sv!, svWord: s.svWord! })),
    ...Object.values(BY_FURN),
  ];
}
export const KAD_ROUNDS = 5;

/** Alla estniska fraser som behöver Siiris röst (tools/generate_audio.py kadunud ...). */
export function kadPhrases(): string[] {
  const out = new Set<string>();
  for (const l of [KAD_LOOK, KAD_CLOSE, KAD_OPEN, KAD_WHAT, KAD_STILL, KAD_HERE]) out.add(l.et);
  for (const w of kadWords()) {
    out.add(w.et);
    out.add(kadGone({ key: "", sel: "", ...w }).et);
  }
  for (const c of KAD_COUNT) out.add(c);
  return [...out];
}

/** Alla svenska fraser som behöver Sofies röst i estniskt läge (svenska klipp, findSvClip). */
export function kadPhrasesSv(): string[] {
  const out = new Set<string>();
  for (const l of [KAD_LOOK, KAD_CLOSE, KAD_OPEN, KAD_WHAT, KAD_DONE]) out.add(l.sv);
  for (const w of kadWords()) {
    const t = { key: "", sel: "", ...w };
    out.add(w.svWord);
    out.add(kadGone(t).sv);
    out.add(kadStill(t).sv);
    out.add(kadHere(t).sv);
  }
  for (const c of KAD_COUNT_SV) out.add(c);
  return [...out];
}
