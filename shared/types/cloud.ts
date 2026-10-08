/* Kopplingen mellan en lokal profilplats på barnets enhet och barnets profil i föräldrakontot (app/stores/cloud.ts). */

export interface CloudLink {
  id: string /* profiles.id */;
  name: string /* barnets namn i kontot, för att visa var det sparas */;
  ver: number /* serverns version vid senaste synk */;
  base: string | null /* datan vid senaste synk (JSON) – utgångspunkt när två versioner slås ihop */;
  dirty: boolean /* lokala ändringar som inte skickats upp än */;
}

/* vad som ska gälla när både enheten och kontot redan har ett spel */
export type LinkChoice = "local" | "remote" | "merge";
