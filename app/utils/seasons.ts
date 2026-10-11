/* Årstiderna och de estniska högtiderna - flyttat ur public/legacy/app.js (ÅRSTIDER OCH HÖGTIDER),
   som läser dem via window.SiiriData. Styr säsongsvarorna i Laat, startsidans årstidsrad och
   högtidskortet. */

export type SeasonId = "vinter" | "kevad" | "suvi" | "sygis";

export const SEASONS = {
  vinter: { em: "❄️", sv: "Vinter", et: "Talv", word: { et: "lumi", sv: "snö" }, fx: "snow" },
  kevad: { em: "🌸", sv: "Vår", et: "Kevad", word: { et: "lill", sv: "blomma" }, fx: "petals" },
  suvi: { em: "☀️", sv: "Sommar", et: "Suvi", word: { et: "päike", sv: "sol" }, fx: "none" },
  sygis: { em: "🍂", sv: "Höst", et: "Sügis", word: { et: "vihm", sv: "regn" }, fx: "leaves" },
};

export const HOLIDAYS = [
  {
    m: 2,
    d: 24,
    em: "🇪🇪",
    sv: "Estlands självständighetsdag",
    et: "Head iseseisvuspäeva!",
    tr: "Glad självständighetsdag!",
  },
  { m: 3, d: 14, em: "📖", sv: "Modersmålsdagen i Estland", et: "Head emakeelepäeva!", tr: "Glad modersmålsdag!" },
  { m: 6, d: 23, em: "🔥", sv: "Midsommarafton i Estland", et: "Head jaanipäeva!", tr: "Glad midsommar!" },
  { m: 6, d: 24, em: "🌼", sv: "Midsommardagen", et: "Head jaanipäeva!", tr: "Glad midsommar!" },
  { m: 12, d: 24, em: "🎄", sv: "Julafton", et: "Häid jõule!", tr: "God jul!" },
  { m: 12, d: 25, em: "🎄", sv: "Juldagen", et: "Häid jõule!", tr: "God jul!" },
  { m: 1, d: 1, em: "🎆", sv: "Nyårsdagen", et: "Head uut aastat!", tr: "Gott nytt år!" },
];

/** Årstiden just nu (december-februari är vinter, osv.). */
export function seasonId(date = new Date()): SeasonId {
  const m = date.getMonth() + 1;
  if (m === 12 || m <= 2) return "vinter";
  if (m <= 5) return "kevad";
  if (m <= 8) return "suvi";
  return "sygis";
}

export function seasonNow(date = new Date()) {
  return SEASONS[seasonId(date)];
}

/** Högtiden i dag, eller null. */
export function holidayNow(date = new Date()) {
  const m = date.getMonth() + 1,
    d = date.getDate();
  return HOLIDAYS.find(h => h.m === m && h.d === d) || null;
}
