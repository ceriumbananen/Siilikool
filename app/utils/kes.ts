/* Kes ma olen? (Vem är jag?) - en estnisk gissningslek. Siiri låtsas vara ett djur; barnet
   ställer ja/nej-frågor på estniska ("Kas sa elad metsas?"), Siiri svarar med en hel mening
   ("Jah, ma elan metsas."), och djuren som inte passar bleknar bort. Innan barnet gissar
   frågar Siiri "Mida me teame?" - barnet väljer rätt påstående för varje svar ("Sa elad
   metsas." eller "Sa ei ela metsas."), alltså upprepar det man lärt sig, och gissar sedan.
   Spelet: app/pages/kes.vue. */

export type KesLine = { et: string; sv: string };

export type KesFeature = {
  id: string;
  em: string;
  ask: KesLine;
  /** estniskt läge: frågan som barnet läser och Siiri säger på svenska, när ask.sv är en
   * förklaring snarare än en fråga man ställer (se kesAsk) */
  askSv?: string;
  /* Siiris svar */
  yes: KesLine;
  no: KesLine;
  /* "Mida me teame?" - det barnet ska känna igen som sant */
  isTrue: KesLine;
  isFalse: KesLine;
};

export const KES_FEATURES: KesFeature[] = [
  {
    id: "mets",
    em: "🌲",
    ask: { et: "Kas sa elad metsas?", sv: "Bor du i skogen?" },
    yes: { et: "Jah, ma elan metsas.", sv: "Ja, jag bor i skogen." },
    no: { et: "Ei, ma ei ela metsas.", sv: "Nej, jag bor inte i skogen." },
    isTrue: { et: "Sa elad metsas.", sv: "Du bor i skogen." },
    isFalse: { et: "Sa ei ela metsas.", sv: "Du bor inte i skogen." },
  },
  {
    id: "talu",
    em: "🏡",
    ask: { et: "Kas sa elad talus?", sv: "Bor du på en bondgård?" },
    yes: { et: "Jah, ma elan talus.", sv: "Ja, jag bor på en bondgård." },
    no: { et: "Ei, ma ei ela talus.", sv: "Nej, jag bor inte på en bondgård." },
    isTrue: { et: "Sa elad talus.", sv: "Du bor på en bondgård." },
    isFalse: { et: "Sa ei ela talus.", sv: "Du bor inte på en bondgård." },
  },
  {
    id: "vesi",
    em: "💧",
    ask: { et: "Kas sa elad vees?", sv: "Bor du i vattnet?" },
    yes: { et: "Jah, ma elan vees.", sv: "Ja, jag bor i vattnet." },
    no: { et: "Ei, ma ei ela vees.", sv: "Nej, jag bor inte i vattnet." },
    isTrue: { et: "Sa elad vees.", sv: "Du bor i vattnet." },
    isFalse: { et: "Sa ei ela vees.", sv: "Du bor inte i vattnet." },
  },
  {
    id: "suur",
    em: "🐘",
    ask: { et: "Kas sa oled suur?", sv: "Är du stor?" },
    yes: { et: "Jah, ma olen suur.", sv: "Ja, jag är stor." },
    no: { et: "Ei, ma ei ole suur.", sv: "Nej, jag är inte stor." },
    isTrue: { et: "Sa oled suur.", sv: "Du är stor." },
    isFalse: { et: "Sa ei ole suur.", sv: "Du är inte stor." },
  },
  {
    id: "karvane",
    em: "🧶",
    ask: { et: "Kas sa oled karvane?", sv: "Är du lurvig (har du päls)?" },
    askSv: "Har du päls?",
    yes: { et: "Jah, ma olen karvane.", sv: "Ja, jag har päls." },
    no: { et: "Ei, ma ei ole karvane.", sv: "Nej, jag har ingen päls." },
    isTrue: { et: "Sa oled karvane.", sv: "Du har päls." },
    isFalse: { et: "Sa ei ole karvane.", sv: "Du har ingen päls." },
  },
  {
    id: "jalad",
    em: "🐾",
    ask: { et: "Kas sul on neli jalga?", sv: "Har du fyra ben?" },
    yes: { et: "Jah, mul on neli jalga.", sv: "Ja, jag har fyra ben." },
    no: { et: "Ei, mul ei ole nelja jalga.", sv: "Nej, jag har inte fyra ben." },
    isTrue: { et: "Sul on neli jalga.", sv: "Du har fyra ben." },
    isFalse: { et: "Sul ei ole nelja jalga.", sv: "Du har inte fyra ben." },
  },
  {
    id: "saba",
    em: "〰️",
    ask: { et: "Kas sul on saba?", sv: "Har du svans?" },
    yes: { et: "Jah, mul on saba.", sv: "Ja, jag har svans." },
    no: { et: "Ei, mul ei ole saba.", sv: "Nej, jag har ingen svans." },
    isTrue: { et: "Sul on saba.", sv: "Du har svans." },
    isFalse: { et: "Sul ei ole saba.", sv: "Du har ingen svans." },
  },
  {
    id: "korvad",
    em: "👂",
    ask: { et: "Kas sul on pikad kõrvad?", sv: "Har du långa öron?" },
    yes: { et: "Jah, mul on pikad kõrvad.", sv: "Ja, jag har långa öron." },
    no: { et: "Ei, mul ei ole pikki kõrvu.", sv: "Nej, jag har inte långa öron." },
    isTrue: { et: "Sul on pikad kõrvad.", sv: "Du har långa öron." },
    isFalse: { et: "Sul ei ole pikki kõrvu.", sv: "Du har inte långa öron." },
  },
  {
    id: "sarved",
    em: "🦌",
    ask: { et: "Kas sul on sarved?", sv: "Har du horn?" },
    yes: { et: "Jah, mul on sarved.", sv: "Ja, jag har horn." },
    no: { et: "Ei, mul ei ole sarvi.", sv: "Nej, jag har inga horn." },
    isTrue: { et: "Sul on sarved.", sv: "Du har horn." },
    isFalse: { et: "Sul ei ole sarvi.", sv: "Du har inga horn." },
  },
  {
    id: "lendab",
    em: "🪶",
    ask: { et: "Kas sa oskad lennata?", sv: "Kan du flyga?" },
    yes: { et: "Jah, ma oskan lennata.", sv: "Ja, jag kan flyga." },
    no: { et: "Ei, ma ei oska lennata.", sv: "Nej, jag kan inte flyga." },
    isTrue: { et: "Sa oskad lennata.", sv: "Du kan flyga." },
    isFalse: { et: "Sa ei oska lennata.", sv: "Du kan inte flyga." },
  },
  {
    id: "haugub",
    em: "🗣️",
    ask: { et: "Kas sa haugud?", sv: "Skäller du?" },
    yes: { et: "Jah, ma haugun.", sv: "Ja, jag skäller." },
    no: { et: "Ei, ma ei haugu.", sv: "Nej, jag skäller inte." },
    isTrue: { et: "Sa haugud.", sv: "Du skäller." },
    isFalse: { et: "Sa ei haugu.", sv: "Du skäller inte." },
  },
];

export type KesAnimal = {
  et: string;
  sv: string;
  em: string;
  /** Siiri avslöjar: "Ma olen rebane!" */
  reveal: string;
  /** fel gissning: "Ei, ma ei ole kass." */
  notMe: string;
  /** estniskt läge (och den svenska hjälpraden): "Jag är en räv!" */
  revealSv: string;
  /** "Nej, jag är ingen katt." */
  notMeSv: string;
  /** egenskaperna (KES_FEATURES.id) som stämmer - alla andra är "nej" */
  has: string[];
};

/* Alla djuren är en-ord på svenska (en hund, en ko, en groda ...), så "en"/"ingen" stämmer. */
/* Svaren följer hur en bilderbok visar djuret, inte zoologiska undantag: björnen och igelkotten
   har ingen synlig svans, grisen räknas inte som lurvig. Varje djur har en egen kombination
   (kontrolleras i kesSelfCheck), så det går alltid att fråga sig fram. */
const A = (et: string, sv: string, em: string, has: string[]): KesAnimal => ({
  et,
  sv,
  em,
  has,
  reveal: `Ma olen ${et}!`,
  notMe: `Ei, ma ei ole ${et}.`,
  revealSv: `Jag är en ${sv}!`,
  notMeSv: `Nej, jag är ingen ${sv}.`,
});
export const KES_ANIMALS: KesAnimal[] = [
  A("koer", "hund", "🐶", ["karvane", "jalad", "saba", "haugub"]),
  A("kass", "katt", "🐱", ["karvane", "jalad", "saba"]),
  A("hobune", "häst", "🐴", ["talu", "suur", "karvane", "jalad", "saba"]),
  A("lehm", "ko", "🐮", ["talu", "suur", "karvane", "jalad", "saba", "sarved"]),
  A("siga", "gris", "🐷", ["talu", "jalad", "saba"]),
  A("karu", "björn", "🐻", ["mets", "suur", "karvane", "jalad"]),
  A("rebane", "räv", "🦊", ["mets", "karvane", "jalad", "saba"]),
  A("jänes", "hare", "🐰", ["mets", "karvane", "jalad", "saba", "korvad"]),
  A("siil", "igelkott", "🦔", ["mets", "jalad"]),
  A("lind", "fågel", "🐦", ["mets", "saba", "lendab"]),
  A("kala", "fisk", "🐟", ["vesi", "saba"]),
  A("konn", "groda", "🐸", ["vesi", "jalad"]),
];

export const KES_INTRO: KesLine = { et: "Ma olen loom. Kes ma olen?", sv: "Jag är ett djur. Vem är jag?" };
export const KES_ASK_ME: KesLine = { et: "Küsi minult!", sv: "Fråga mig!" };
export const KES_RECAP: KesLine = { et: "Mida me teame?", sv: "Vad vet vi?" };
export const KES_PICK: KesLine = { et: "Vali õige!", sv: "Välj det som stämmer!" };
export const KES_GUESS: KesLine = { et: "Kes ma olen?", sv: "Vem är jag?" };
export const KES_MORE: KesLine = { et: "Küsi veel!", sv: "Fråga mer!" };
export const KES_I_KNOW: KesLine = { et: "Ma tean!", sv: "Jag vet!" };

/** Frågan som ett { et, sv }-par för estniskt läge, där den svenska sidan är det barnet läser
 * och säger (askSv om det finns). Svenskt läge använder f.ask direkt. */
export const kesAsk = (f: KesFeature): KesLine => ({ et: f.ask.et, sv: f.askSv ?? f.ask.sv });
export const kesReveal = (a: KesAnimal): KesLine => ({ et: a.reveal, sv: a.revealSv });
export const kesNotMe = (a: KesAnimal): KesLine => ({ et: a.notMe, sv: a.notMeSv });

export function kesHas(a: KesAnimal, f: KesFeature): boolean {
  return a.has.includes(f.id);
}

/** Alla estniska fraser som behöver Siiris röst (tools/generate_audio.py kes ...). */
export function kesPhrases(): string[] {
  const out = new Set<string>();
  for (const l of [KES_INTRO, KES_ASK_ME, KES_RECAP, KES_PICK, KES_GUESS, KES_MORE, KES_I_KNOW]) out.add(l.et);
  for (const f of KES_FEATURES) for (const l of [f.ask, f.yes, f.no, f.isTrue, f.isFalse]) out.add(l.et);
  for (const a of KES_ANIMALS) {
    out.add(a.reveal);
    out.add(a.notMe);
  }
  return [...out];
}

/** Alla svenska fraser som behöver Sofies röst i estniskt läge (svenska klipp, findSvClip). */
export function kesPhrasesSv(): string[] {
  const out = new Set<string>();
  for (const l of [KES_INTRO, KES_ASK_ME, KES_RECAP, KES_PICK, KES_GUESS, KES_MORE, KES_I_KNOW]) out.add(l.sv);
  for (const f of KES_FEATURES) for (const l of [kesAsk(f), f.yes, f.no, f.isTrue, f.isFalse]) out.add(l.sv);
  for (const a of KES_ANIMALS) {
    out.add(a.sv);
    out.add(a.revealSv);
    out.add(a.notMeSv);
  }
  return [...out];
}

/** Två djur med exakt samma svar på alla frågor går inte att skilja åt - returnerar sådana par. */
export function kesSelfCheck(): string[] {
  const seen = new Map<string, string>();
  const clash: string[] = [];
  for (const a of KES_ANIMALS) {
    const key = KES_FEATURES.map(f => (kesHas(a, f) ? 1 : 0)).join("");
    if (seen.has(key)) clash.push(`${seen.get(key)} = ${a.et}`);
    else seen.set(key, a.et);
  }
  return clash;
}
