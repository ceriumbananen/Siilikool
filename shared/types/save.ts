/* Spelarens data och reservkopior (app/stores/profile.ts). Typerna i shared/types importeras automatiskt. */

/* Sparfilen har många fält som den gamla koden lägger till efter hand – bara de vanligaste
   är typade, resten får vara vad de är tills skärmarna flyttats till Vue. */
export interface SaveData {
  [key: string]: any;
  ver?: number;
  name: string;
  avatar: string;
  xp: number;
  stars: number;
  wordmem: Record<string, any>;
}

export interface SlotInfo {
  name: string;
  avatar: string;
  xp: number;
  stars: number;
  color: string;
}

export interface Backup {
  t: number;
  why: string;
  data: SaveData;
}
