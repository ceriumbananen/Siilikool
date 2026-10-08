/* Spelarens data (S i den gamla koden), profilerna och reservkopiorna.
   Flyttat från public/legacy/app.js så att den gamla koden och Vue delar samma data:
   den gamla koden får `state` via window.SiiriStore och ändrar fälten direkt, och eftersom
   `state` är reaktiv ser Vue-komponenterna ändringarna. Nycklar och format i localStorage
   är exakt som förut, så befintliga spelare behåller allt. */

const KEY = "siiri-eesti-v1";
const SLOTKEY = "siiri-eesti-slots"; /* vilken profil som är vald */
const SCHEMA = 2;

function slotKey(i: number) {
  return KEY + (i ? "-" + i : "");
}
function bkKey(i: number) {
  return slotKey(i) + "-backup";
}

/* localStorage kan saknas eller kasta (privat läge, blockerad lagring) – appen ska fungera ändå */
function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* full eller blockerad */
  }
}
function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* blockerad */
  }
}

export function defaultSave(): SaveData {
  return {
    xp: 0,
    stars: 0,
    correct: 0,
    spoken: 0,
    typed: 0,
    perfect: 0,
    best: {},
    badges: [],
    sound: true,
    theme: null,
    name: "",
    avatar: "🦔",
    amb: 0,
    color: "skog",
    fur: "kreem",
    diff: "lagom",
    mstyle: {},
    secrets: [],
    owned: [],
    wear: {},
    wordmem: {},
    mixbest: 0,
    sentbest: 0,
    bestcombo: 0,
    flames: 0,
    day: null,
    dayp: {},
    lastday: null,
    rank: 0,
  };
}

export function migrate(o: any): any {
  if (!o || typeof o !== "object") return o;
  /* en skadad profil ska inte kunna slå ut appen */
  const arr = (k: string) => {
    if (!Array.isArray(o[k])) o[k] = [];
  };
  const obj = (k: string) => {
    if (!o[k] || typeof o[k] !== "object" || Array.isArray(o[k])) o[k] = {};
  };
  const num = (k: string, d = 0) => {
    const n = Number(o[k]);
    o[k] = isFinite(n) ? n : d;
  };
  ["owned", "secrets", "badges", "challenges"].forEach(arr);
  ["wear", "best", "wordmem", "dayp", "mstyle", "duels", "tried", "memBestLv", "bestRight", "tripP", "chalTop"].forEach(
    obj,
  );
  ["stars", "xp", "correct", "spoken", "typed", "perfect", "flames", "lessons", "hardWins", "tripDone"].forEach(k =>
    num(k, 0),
  );
  if (typeof o.name !== "string") o.name = "";
  if (!o.ver) o.ver = 1;
  /* framtida flyttar av fält görs här, steg för steg */
  if (o.ver < 2) {
    if (o.amb === undefined) o.amb = 0;
    o.ver = 2;
  }
  return o;
}

function readSlotIndex(): number {
  return parseInt(read(SLOTKEY) || "0", 10) || 0;
}

/* standardvärden + det som finns sparat (fält som är undefined skriver inte över standard) */
function loadSlot(i: number): SaveData {
  const s = defaultSave();
  try {
    const raw = read(slotKey(i));
    if (raw) {
      const p = migrate(JSON.parse(raw));
      for (const k in p) {
        if (p[k] !== undefined) s[k] = p[k];
      }
    }
  } catch {
    /* trasig sparfil – börja med standard */
  }
  return s;
}

export const useProfileStore = defineStore("profile", () => {
  const slot = ref(readSlotIndex());
  const state = reactive<SaveData>(loadSlot(slot.value));

  function save() {
    state.ver = SCHEMA;
    state.t = Date.now(); /* när den sparades – avgör vilken version som är senast vid synk */
    write(slotKey(slot.value), JSON.stringify(toRaw(state)));
  }

  /* byter allt innehåll men behåller samma objekt, så att den gamla kodens S fortsätter peka rätt */
  function replace(data: any) {
    for (const k of Object.keys(state)) delete state[k];
    Object.assign(state, defaultSave(), migrate(data));
    save();
  }

  /* ---------- profiler (tre platser) ---------- */
  function slotInfo(i: number): SlotInfo | null {
    try {
      const raw = read(slotKey(i));
      if (!raw) return null;
      const p = JSON.parse(raw);
      return {
        name: p.name || "",
        avatar: p.avatar || "🦔",
        xp: p.xp || 0,
        stars: p.stars || 0,
        color: p.color || "skog",
      };
    } catch {
      return null;
    }
  }
  /* byter profil och laddar om – till `to` (t.ex. spelet från /join), annars samma sida */
  function switchSlot(i: number, to?: string) {
    write(SLOTKEY, String(i));
    if (to) location.href = to;
    else location.reload();
  }

  /* ---------- automatisk reservkopia ---------- */
  function autoBackup(why?: string) {
    write(bkKey(slot.value), JSON.stringify({ t: Date.now(), why: why || "", data: toRaw(state) }));
  }
  function backupInfo(): Backup | null {
    try {
      const raw = read(bkKey(slot.value));
      if (!raw) return null;
      const p = JSON.parse(raw);
      return p && p.data ? p : null;
    } catch {
      return null;
    }
  }
  function backupAge(p: Backup) {
    const d = Math.floor((Date.now() - (p.t || 0)) / 86400000);
    return d <= 0 ? "idag" : d === 1 ? "igår" : d + " dagar sedan";
  }
  /* skriver kopian som sparfil – den gamla koden laddar om sidan efteråt */
  function restoreBackup() {
    const p = backupInfo();
    if (!p) return false;
    write(slotKey(slot.value), JSON.stringify(p.data));
    return true;
  }
  /* en profil som ser tom ut trots att det finns en kopia = något gick fel */
  function backupLooksBetter() {
    const p = backupInfo();
    if (!p || !p.data) return false;
    const now = (state.xp || 0) + (state.stars || 0) + (state.correct || 0);
    const old = (p.data.xp || 0) + (p.data.stars || 0) + (p.data.correct || 0);
    return old > 50 && now < old * 0.25;
  }

  /* ---------- säkerhetskopia: all data som en kod man kan spara eller flytta ---------- */
  function exportCode() {
    try {
      return "SIIRI1:" + btoa(unescape(encodeURIComponent(JSON.stringify(toRaw(state)))));
    } catch {
      return "";
    }
  }
  function importCode(code: string) {
    try {
      code = (code || "").trim();
      if (code.indexOf("SIIRI1:") !== 0) return false;
      const obj = JSON.parse(decodeURIComponent(escape(atob(code.slice(7)))));
      if (!obj || typeof obj !== "object") return false;
      replace(obj);
      return true;
    } catch {
      return false;
    }
  }

  /* raderar den profil som spelas nu (förut raderades alltid profil 1, oavsett vilken som var vald) */
  function wipe() {
    remove(slotKey(slot.value));
    replace(defaultSave());
  }

  return {
    slot,
    state,
    save,
    replace,
    slotInfo,
    switchSlot,
    autoBackup,
    backupInfo,
    backupAge,
    restoreBackup,
    backupLooksBetter,
    exportCode,
    importCode,
    wipe,
  };
});
