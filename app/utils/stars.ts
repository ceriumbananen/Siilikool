/* Porterat från starStr() i public/legacy/app.js - samma stjärnskala (0-3) används för
   temaresultat, duellresultat m.fl. */

/** T.ex. starRating(2) → "★★☆". */
export function starRating(n: number, max = 3): string {
  return Array.from({ length: max }, (_, i) => (i < n ? "★" : "☆")).join("");
}
