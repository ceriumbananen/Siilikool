/* Tolkar en inklistrad glosa per rad, "estniska = svenska" (också ; tabb – — " - " eller ,).
   Samma regler som schoolParse i den gamla appen, så att listor från föräldern beter sig likadant. */

export function parseWordList(txt: string): { words: Word[]; bad: string[] } {
  const words: Word[] = [],
    bad: string[] = [];
  for (const raw of (txt || "").split(/[\n\r]+/)) {
    const l = raw.trim();
    if (!l) continue;
    const parts = l.split(/\s*(?:=|;|\t|–|—| - |,)\s*/);
    const et = (parts[0] || "").trim(),
      sv = (parts[1] || "").trim();
    if (!et || !sv || et.length > 40 || sv.length > 40) {
      bad.push(l);
      continue;
    }
    words.push({ et, sv });
  }
  return { words: words.slice(0, 40), bad };
}
