/* Ordförrådet och ordminnet - porterat från allWords()/tripWords()/tripDone()/schoolLeft()/
   AMBIG_ET/mkey()/wmem()/wmemHit()/hasPic()/wArt()/starMult()/shuffle()/today()/dayHash() i
   public/legacy/app.js. Den gamla motorn har kvar sina egna kopior tills skärmarna som använder
   dem också flyttats; logiken här är densamma, men tar spelarens data (S) som argument. */

export type WordItem = { et: string; sv: string; em?: string; school?: boolean; nopic?: boolean };
type Save = Record<string, any>;

/** Dagens nummer (dagar sedan 1970) - ordminnets "senast övat". */
export function today0(): number {
  return Math.floor(Date.now() / 86400000);
}

/** Dagens datum som text ("2026-10-12" utan nollor), som legacy today(). */
export function todayKey(d = new Date()): string {
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

/** Ett stabilt tal ur en text - samma dag ger samma tal (dagens gömda sak m.m.). */
export function dayHash(s: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
  return n;
}

export function shuffle<T>(a: T[]): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [b[i], b[j]] = [b[j]!, b[i]!];
  }
  return b;
}

/** Stjärnorna räknas upp med märket: x1, x2 från tredje märket osv. */
export function starMult(xp: number): number {
  return 1 + Math.floor(rankIndex(xp) / 3);
}

/** Antal teman med minst en stjärna. */
function themesDone(s: Save): number {
  return Object.values((s.best as Record<string, number>) || {}).filter(v => v > 0).length;
}

/** Hur många orter på resan som är klara. Äldre sparfiler utan S.tripDone räknas fram ur
 * temana, som i legacy (som också sparar värdet - det gör inte den här). */
export function tripDone(s: Save): number {
  return typeof s.tripDone === "number" ? s.tripDone : Math.max(0, Math.min(TRIP.length - 1, themesDone(s)));
}

/** Orten man har kommit till (1 = första). */
export function tripReached(s: Save): number {
  return Math.max(1, Math.min(TRIP.length, tripDone(s) + 1));
}

/** Estniska ord som betyder olika saker på olika ställen - de får ett eget minne per betydelse. */
const AMBIG_ET: Record<string, true> = (() => {
  const seen: Record<string, string> = {},
    dup: Record<string, true> = {};
  for (const list of [...THEMES.map(t => t.words), ...TRIP.map(t => t.words)] as WordItem[][])
    for (const w of list) {
      if (Object.prototype.hasOwnProperty.call(seen, w.et) && seen[w.et] !== w.sv) dup[w.et] = true;
      seen[w.et] = w.sv;
    }
  return dup;
})();

/** Ordets nyckel i ordminnet (S.wordmem). Tecknet \u0001 skiljer ord och betydelse, som i legacy. */
export function mkey(et: string, sv: string): string {
  return AMBIG_ET[et] ? et + "\u0001" + sv : et;
}

/** Läxorna (S.school), om det finns ord i dem. */
export function schoolSet(s: Save): { words: WordItem[] } | null {
  return s.school && s.school.words && s.school.words.length ? s.school : null;
}

/** Ett läxord sitter när det övats ordentligt (s >= 2) och varit rätt minst tre gånger. */
export function schoolKnows(s: Save, w: WordItem): boolean {
  const mm = (s.wordmem || {})[mkey(w.et, w.sv)];
  return !!(mm && (mm.s || 0) >= 2 && (mm.r || 0) >= 3);
}

/** Alla ord barnet möter: temana, resans ord fram till orten man nått, och läxorden som inte sitter än. */
export function allWords(s: Save): WordItem[] {
  let w: WordItem[] = (THEMES as { words: WordItem[] }[]).flatMap(t => t.words);
  for (let i = 0; i < tripReached(s); i++) w = w.concat(TRIP[i]!.words as WordItem[]);
  const sc = schoolSet(s);
  if (sc) w = w.concat(sc.words.filter(x => !schoolKnows(s, x)));
  return w;
}

/** Registrerar ett svar i ordminnet (S.wordmem) - samma vikter som legacy wmemHit().
 * Skriv- och talövningar räknas som "starka"; sparar inte, det gör den som anropar. */
export function wmemHit(s: Save, et: string, ok: boolean, mode: string, sv: string) {
  if (!s.wordmem) s.wordmem = {};
  const k = mkey(et, sv);
  if (!s.wordmem[k]) s.wordmem[k] = { w: 1, r: 0, m: 0, d: today0(), s: 0 };
  const m = s.wordmem[k];
  m.d = today0();
  if (ok) {
    m.r++;
    const strong = mode === "type" || mode === "speak";
    m.s = strong ? Math.min(6, (m.s || 0) + 1) : Math.min(3, (m.s || 0) + 0.5);
    m.w = Math.max(0.35, m.w * (strong ? 0.45 : 0.7));
  } else {
    m.m++;
    m.s = 0;
    m.w = Math.min(16, m.w + 2.2);
  }
}

/** Har ordet en bild som säkert stämmer? Läxord saknar bild (de hade bara 📝). */
export function hasPic(w: WordItem | null | undefined): boolean {
  return !!(w && !w.school && !w.nopic && ((WORDART as Record<string, string>)[w.et] || (w.em && w.em !== "📝")));
}

/** Ordets egen ritade bild (WORDART) som SVG-sträng, annars "". */
export function wordArtSVG(et: string): string {
  const a = (WORDART as Record<string, string>)[et];
  return a ? '<svg class="wicon" viewBox="0 0 100 100" aria-hidden="true">' + a + "</svg>" : "";
}
