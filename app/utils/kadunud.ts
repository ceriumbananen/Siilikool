/* Kadunud asi (Den försvunna saken) - en minneslek i Siiris rum. Barnet tittar noga på rummet,
   blundar ("Sulge silmad!", Siiri räknar "üks, kaks, kolm"), och när ögonen öppnas har en sak
   försvunnit. "Mis on kadunud?" - barnet väljer rätt ord (eller trycker där saken stod), och
   Siiri säger "Vaip on kadunud!" medan saken tonar tillbaka. Spelplanen är barnets eget rum,
   med de möbler det själv köpt i Laat. Spelet: app/pages/kadunud.vue. */

export type KadLine = { et: string; sv: string };

/** En sak i rummet som kan försvinna. sel = var den finns i rummets SVG (room-svg.ts, scenes.ts),
 * et/sv = ordet (sv i bestämd form, för "Mattan är borta!"). */
export type KadThing = { key: string; sel: string; et: string; sv: string };

/* möbler och annat man väljer själv: ordet beror på vad som står där */
const BY_FURN: Record<string, { et: string; sv: string }> = {
  "a-view": { et: "maal", sv: "tavlan" },
  "a-koler": { et: "maal", sv: "tavlan" },
  "a-map": { et: "kaart", sv: "kartan" },
  "a-photo": { et: "foto", sv: "fotot" },
  "a-clock": { et: "kell", sv: "klockan" },
  "v-pot": { et: "lill", sv: "blomman" },
  "v-tree": { et: "puu", sv: "trädet" },
  "v-flow": { et: "lillevaas", sv: "blomvasen" },
  "v-cact": { et: "kaktus", sv: "kaktusen" },
  "l-bed": { et: "voodi", sv: "sängen" },
  "l-desk": { et: "laud", sv: "skrivbordet" },
  "l-rock": { et: "kiiktool", sv: "gungstolen" },
  "l-sofa": { et: "diivan", sv: "soffan" },
  "g-wood": { et: "puukorv", sv: "vedkorgen" },
  "g-shelf": { et: "raamaturiiul", sv: "bokhyllan" },
  "g-toys": { et: "mänguasjad", sv: "leksakerna" },
  "g-kannel": { et: "kannel", sv: "kanteln" },
  "g-dress": { et: "kummut", sv: "byrån" },
  "p-floor": { et: "lamp", sv: "lampan" },
  "p-ceil": { et: "lamp", sv: "lampan" },
  "p-lant": { et: "latern", sv: "lyktan" },
  "d-cat": { et: "kass", sv: "katten" },
  "d-bird": { et: "lind", sv: "fågeln" },
  "d-hedge": { et: "siilipoeg", sv: "igelkottsungen" },
};

/* platserna i rummet: fasta saker (flaggan, brasan, ...) och platser för valda möbler */
const SPOTS: { key: string; sel: string; slot?: string; et?: string; sv?: string }[] = [
  { key: "lipp", sel: "#roomflag", et: "lipp", sv: "flaggan" },
  { key: "kamin", sel: "#roomfire", et: "kamin", sv: "brasan" },
  { key: "nukud", sel: "#roomdolls", et: "nukud", sv: "dockorna" },
  { key: "puuhobune", sel: "#roomdala", et: "puuhobune", sv: "trähästen" },
  { key: "aken", sel: "#roomwindow2", et: "aken", sv: "fönstret" },
  { key: "vaip", sel: "#roomrug", et: "vaip", sv: "mattan" },
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
      out.push({ key: s.key, sel: s.sel, et: s.et!, sv: s.sv! });
      continue;
    }
    const id = furnOf(s.slot);
    const w = id ? BY_FURN[id] : undefined;
    if (w) out.push({ key: s.key, sel: s.sel, et: w.et, sv: w.sv });
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
export const KAD_ROUNDS = 5;

/** Alla estniska fraser som behöver Siiris röst (tools/generate_audio.py kadunud ...). */
export function kadPhrases(): string[] {
  const out = new Set<string>();
  for (const l of [KAD_LOOK, KAD_CLOSE, KAD_OPEN, KAD_WHAT, KAD_STILL, KAD_HERE]) out.add(l.et);
  const words = [...SPOTS.filter(s => s.et).map(s => ({ et: s.et!, sv: s.sv! })), ...Object.values(BY_FURN)];
  for (const w of words) {
    out.add(w.et);
    out.add(kadGone({ key: "", sel: "", et: w.et, sv: w.sv }).et);
  }
  for (const c of KAD_COUNT) out.add(c);
  return [...out];
}
