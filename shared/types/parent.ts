/* Det de vuxna ser i familjekontot (app/composables/useParentApi.ts). */

/* en glosa: estniska = svenska */
export interface Word {
  et: string;
  sv: string;
}

export interface Family {
  id: string;
  name: string;
  child_code: string;
}

/* en medlem i familjen (vuxen eller barn), utan själva spelet */
export interface Member {
  id: string;
  user_id: string | null /* vuxna: kontot – så att man ser vem som är "du" */;
  kind: "adult" | "child";
  name: string;
  avatar: string;
  has_pin: boolean;
  updated_at: string;
  stars: number | null;
  xp: number | null;
}

/* en glosa-lista: för ett barn, eller för alla barn (member_id null) */
export interface WordList {
  id: string;
  member_id: string | null;
  name: string;
  words: Word[];
  days: number;
  created_at: string;
}

/* en enhet där ett barn har valts ("Vem spelar?") */
export interface Device {
  session_id: string;
  label: string;
  created_at: string;
}

/* ett barns framsteg, sammanställt ur spelets data i kontot (app/utils/progress.ts) */
export interface ChildProgress {
  stars: number;
  xp: number;
  correct: number;
  lessons: number;
  badges: number;
  flames: number /* dagsutmaningar klarade */;
  spoken: number /* ord sagda högt */;
  typed: number /* ord skrivna */;
  words: { practiced: number; strong: number; shaky: number; unseen: number };
  /* de svåraste orden just nu (sv och em när ordet finns i spelet) */
  hard: { et: string; sv: string; em: string; misses: number }[];
  /* hur många ord som sitter, tema för tema (medalj vid 40/70/95 %) */
  themes: { id: string; sv: string; em: string; strong: number; total: number; pct: number; medal: "" | "gold" | "silver" | "bronze" }[];
  school: { name: string; daysLeft: number; words: { et: string; sv: string; known: boolean }[] } | null;
  doneLists: number;
}
