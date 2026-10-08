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
  const hard = entries
    .filter(([, m]) => num(m.w) > 1.6)
    .sort(([, a], [, b]) => num(b.w) - num(a.w))
    .slice(0, 8)
    .map(([k, m]) => ({ et: wordOf(k), misses: num(m.m) }));

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

  return {
    stars: num(s.stars),
    xp: num(s.xp),
    correct: num(s.correct),
    lessons: num(s.lessons),
    badges: Array.isArray(s.badges) ? s.badges.length : 0,
    words: { practiced: entries.length, strong, shaky: entries.length - strong },
    hard,
    school,
    doneLists: Array.isArray(s.schoolDoneSets) ? s.schoolDoneSets.length : 0,
  };
}
