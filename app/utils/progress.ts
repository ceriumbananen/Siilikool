/* Sammanställer ett barns framsteg ur spelets data (S i den gamla appen), som föräldern läser i
   kontot. Samma regler som föräldrasidan i den gamla appen: ett ord sitter när styrkan (s) är minst 2,
   ett ord är svårt när vikten (w) är över 1,6, och ett läxord sitter när s ≥ 2 och r ≥ 3. */

const num = (v: unknown) => (typeof v === "number" && isFinite(v) ? v : 0);
/* ord med två betydelser har nyckeln "ord\x01betydelse" i ordminnet */
const wordOf = (key: string) => key.split("\x01")[0]!;

export function summarizeProgress(data: Record<string, any> | null | undefined): ChildProgress {
  const s = data || {};
  const mem: Record<string, any> = s.wordmem && typeof s.wordmem === "object" ? s.wordmem : {};
  const entries = Object.entries(mem).filter(([, m]) => m && typeof m === "object");

  const strong = entries.filter(([, m]) => num(m.s) >= 2).length;
  const hardEntries = entries
    .filter(([, m]) => num(m.w) > 1.6)
    .sort(([, a], [, b]) => num(b.w) - num(a.w))
    .slice(0, 12);
  const hardKeys = hardEntries.map(([k]) => k);
  const hard = hardEntries.map(([k, m]) => ({ et: wordOf(k), misses: num(m.m) }));

  let school: ChildProgress["school"] = null;
  if (s.school && Array.isArray(s.school.words) && s.school.words.length) {
    const today = Math.floor(Date.now() / 86400000);
    school = {
      name: String(s.school.name || "Veckans ord"),
      daysLeft: num(s.school.added) + num(s.school.days || 21) - today,
      words: s.school.words.map((w: { et: string; sv: string }) => {
        const m = mem[w.et] ?? mem[w.et + "\x01" + w.sv];
        return { et: w.et, sv: w.sv, known: !!m && num(m.s) >= 2 && num(m.r) >= 3 };
      }),
    };
  }

  /* samma ord som barnet möter i spelet: hur många som inte övats än, och tema för tema */
  const words = allWords(s);
  const unseen = words.filter(w => !mem[mkey(w.et, w.sv)]).length;
  const themes = (THEMES as { id: string; sv: string; em: string; words: WordItem[] }[]).map(t => {
    const strongIn = t.words.filter(w => num(mem[mkey(w.et, w.sv)]?.s) >= 2).length;
    const p = t.words.length ? strongIn / t.words.length : 0;
    return {
      id: t.id,
      sv: t.sv,
      em: t.em,
      strong: strongIn,
      total: t.words.length,
      pct: Math.round(p * 100),
      medal: (p >= 0.95 ? "gold" : p >= 0.7 ? "silver" : p >= 0.4 ? "bronze" : "") as "" | "gold" | "silver" | "bronze",
    };
  });
  /* de svåra orden med svenska och bild, när ordet finns i spelet */
  const byKey = new Map(words.map(w => [mkey(w.et, w.sv), w]));
  const hardWords = hard.map((h, i) => {
    const w = byKey.get(hardKeys[i]!);
    return { ...h, sv: w?.sv ?? "", em: w?.em ?? "" };
  });

  return {
    stars: num(s.stars),
    xp: num(s.xp),
    correct: num(s.correct),
    lessons: num(s.lessons),
    badges: Array.isArray(s.badges) ? s.badges.length : 0,
    flames: num(s.flames),
    spoken: num(s.spoken),
    typed: num(s.typed),
    words: { practiced: entries.length, strong, shaky: entries.length - strong, unseen },
    hard: hardWords,
    themes,
    school,
    doneLists: Array.isArray(s.schoolDoneSets) ? s.schoolDoneSets.length : 0,
  };
}
