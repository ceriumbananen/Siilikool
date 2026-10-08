/* Det föräldern ser i sitt konto (app/composables/useParentApi.ts). */

/* en glosa: estniska = svenska */
export interface Word {
  et: string;
  sv: string;
}

export interface Child {
  id: string;
  name: string;
  avatar: string;
  updated_at: string;
  stars: number | null;
  xp: number | null;
}

export interface SchoolList {
  id: string;
  name: string;
  words: Word[];
  days: number;
  created_at: string;
}

export interface Device {
  device_user: string;
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
  words: { practiced: number; strong: number; shaky: number };
  hard: { et: string; misses: number }[];
  school: { name: string; daysLeft: number; words: { et: string; sv: string; known: boolean }[] } | null;
  doneLists: number;
}
