/* Familjekontot i appen (app/stores/cloud.ts). */

/* kopplingen mellan en lokal profilplats och en medlem i familjen */
export interface CloudLink {
  id: string /* members.id */;
  kind: "adult" | "child";
  name: string /* medlemmens namn, för att visa var spelet sparas */;
  avatar?: string /* medlemmens figur vid senaste synk – för att märka när de vuxna byter den */;
  pin?: boolean /* barnet har PIN-kod: den behövs för att byta till barnet på en delad enhet */;
  ver: number /* serverns version vid senaste synk */;
  base: string | null /* datan vid senaste synk (JSON) – utgångspunkt när två versioner slås ihop */;
  dirty: boolean /* lokala ändringar som inte skickats upp än */;
}

/* vad som ska gälla när både enheten och kontot redan har ett spel */
export type LinkChoice = "local" | "remote" | "merge";

/* den här inloggningen enligt databasen (my_session) */
export interface MySession {
  family_id: string | null;
  adult: boolean /* inloggad vuxen i familjen (oavsett lås) */;
  locked: boolean /* enhetens inloggning är låst */;
  members: string[] /* barn som valts på enheten */;
}

/* barnenhet: familjen som enheten hör till (koden behövs för att lägga till fler barn) */
export interface StoredFamily {
  code: string;
  name: string;
}

/* en spelare på enheten i "Vem spelar?" (en profilplats som används) */
export interface DevicePlayer {
  slot: number;
  name: string;
  avatar: string;
  kind: "" | "adult" | "child" /* tom = spelet finns bara på enheten */;
  pin: boolean;
  current: boolean;
}

/* svaret när familjekoden skrivs in (och för en låst vuxen enhet, utan kod) */
export interface FamilyLookup {
  ok: boolean;
  error?: "unknown_code" | "locked" | "no_family";
  until?: string;
  family_name?: string;
  members?: { id: string; name: string; avatar: string; has_pin: boolean }[];
}
