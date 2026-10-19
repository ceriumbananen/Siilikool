/* Spelarens data (S i den gamla koden), spelarna på enheten och reservkopiorna.
   Den gamla koden får `state` via window.SiiriStore och ändrar fälten direkt, och eftersom
   `state` är reaktiv ser Vue-komponenterna ändringarna.

   Spelarna (docs/plan-konton-v2.md, steg 2): varje spelare på enheten har en egen nyckel -
   "m:<id>" för en medlem i familjen (spelet sparas också i kontot) och "l:<slump>" för en lokal
   spelare utan konto. Spelet sparas under "siiri-p-<nyckel>", listan i "siiri-players" och den
   som spelar nu i "siiri-current". Förut fanns tre fasta profilplatser (siiri-eesti-v1, -1, -2);
   de flyttas hit en gång och ligger sedan kvar orörda som en extra kopia. */

const SCHEMA = 2;
const PLAYERS_KEY = "siiri-players";
const CURRENT_KEY = "siiri-current";
export const LINKS_KEY = "siiri-links"; /* kopplingarna spelare -> medlem (app/stores/cloud.ts) */
const saveKey = (k: string) => `siiri-p-${k}`;
const backupKey = (k: string) => `siiri-p-${k}-backup`;

/* de tre gamla profilplatserna */
const OLD_KEY = "siiri-eesti-v1";
const OLD_SLOTKEY = "siiri-eesti-slots";
const OLD_LINKS = "siiri-eesti-cloud";
const oldSlotKey = (i: number) => OLD_KEY + (i ? "-" + i : "");

export const memberKey = (memberId: string) => `m:${memberId}`;
export const newLocalKey = () => `l:${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;

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

function readJson<T>(key: string): T | null {
  try {
    return JSON.parse(read(key) || "null");
  } catch {
    return null;
  }
}

/* En sparfil "används" när spelaren har kommit igång (namn, poäng eller klar med starten). */
function used(raw: string | null): boolean {
  if (!raw) return false;
  try {
    const p = JSON.parse(raw);
    return !!(p && (p.name || p.xp || p.stars || p.setupdone));
  } catch {
    return false;
  }
}

/* Engångsflytt från de tre profilplatserna: varje plats som används blir en spelare (kopplad till
   sin medlem, eller lokal), med reservkopian. Platsen som spelades blir den som spelar nu. */
function migrateSlots(): { players: string[]; current: string } {
  const oldLinks = readJson<Record<string, CloudLink>>(OLD_LINKS) || {};
  const cur = parseInt(read(OLD_SLOTKEY) || "0", 10) || 0;
  const players: string[] = [],
    links: Record<string, CloudLink> = {};
  let current: string | null = null;
  for (let i = 0; i < 3; i++) {
    const raw = read(oldSlotKey(i));
    const l = oldLinks[String(i)]?.kind ? oldLinks[String(i)]! : null;
    if (!used(raw) && !l) {
      if (i === cur) current = newLocalKey(); /* en tom plats som var vald: en ny, tom spelare */
      continue;
    }
    const key = l ? memberKey(l.id) : newLocalKey();
    if (players.includes(key)) continue;
    if (raw) write(saveKey(key), raw);
    const bk = read(oldSlotKey(i) + "-backup");
    if (bk) write(backupKey(key), bk);
    if (l) links[key] = l;
    players.push(key);
    if (i === cur) current = key;
  }
  if (!current) current = players[0] || newLocalKey();
  if (!players.includes(current)) players.push(current);
  write(PLAYERS_KEY, JSON.stringify(players));
  write(CURRENT_KEY, current);
  if (Object.keys(links).length) write(LINKS_KEY, JSON.stringify(links));
  return { players, current };
}

/* spelarna på enheten och den som spelar nu. Tomma lokala spelare (påbörjade men aldrig spelade)
   städas bort, utom den som spelar nu. */
function loadPlayers(): { players: string[]; current: string } {
  let players = readJson<string[]>(PLAYERS_KEY);
  if (!Array.isArray(players)) return migrateSlots();
  let current = read(CURRENT_KEY) || players[0] || newLocalKey();
  players = players.filter(k => k === current || k.startsWith("m:") || used(read(saveKey(k))));
  if (!players.includes(current)) players.push(current);
  return { players, current };
}

/* standardvärden + det som finns sparat (fält som är undefined skriver inte över standard) */
function loadSave(key: string): SaveData {
  const s = defaultSave();
  try {
    const raw = read(saveKey(key));
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
  const start = loadPlayers();
  const players = ref<string[]>(start.players);
  const current = ref(start.current);
  const state = reactive<SaveData>(loadSave(current.value));
  const persistPlayers = () => write(PLAYERS_KEY, JSON.stringify(players.value));
  persistPlayers();

  function save() {
    state.ver = SCHEMA;
    state.t = Date.now(); /* när den sparades – avgör vilken version som är senast vid synk */
    write(saveKey(current.value), JSON.stringify(toRaw(state)));
  }

  /* byter allt innehåll men behåller samma objekt, så att den gamla kodens S fortsätter peka rätt */
  function replace(data: any) {
    for (const k of Object.keys(state)) delete state[k];
    Object.assign(state, defaultSave(), migrate(data));
    save();
  }

  /* ---------- spelarna på enheten ---------- */
  function playerInfo(key: string): SlotInfo | null {
    try {
      const raw = read(saveKey(key));
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
  /** Har spelaren kommit igång (namn, poäng eller klar med starten)? */
  function playerUsed(key: string): boolean {
    return key === current.value ? hasProgress(state) || !!state.name : used(read(saveKey(key)));
  }
  /** Lägger till en spelare i listan (spelet hämtas/sparas när man byter till den). */
  function addPlayer(key: string) {
    if (!players.value.includes(key)) {
      players.value = [...players.value, key];
      persistPlayers();
    }
  }
  /** Byter spelare och laddar om - till `to` (t.ex. spelet från /join), annars samma sida. */
  function switchPlayer(key: string, to?: string) {
    addPlayer(key);
    write(CURRENT_KEY, key);
    if (to) location.href = to;
    else location.reload();
  }
  /** En ny lokal spelare (utan konto) - börjar med att välja namn. */
  function newLocalPlayer(to = "/") {
    switchPlayer(newLocalKey(), to);
  }
  /** Ger en spelare en ny nyckel och flyttar spelet och reservkopian dit - när ett lokalt spel blir
   * en medlems ("m:<id>"), eller en medlem tas bort från enheten och spelet blir lokalt igen. */
  function rekey(from: string, to: string) {
    if (from === to) return;
    for (const [a, b] of [
      [saveKey(from), saveKey(to)],
      [backupKey(from), backupKey(to)],
    ] as const) {
      const v = read(a);
      if (v !== null) write(b, v);
      remove(a);
    }
    players.value = players.value.includes(to)
      ? players.value.filter(k => k !== from)
      : players.value.map(k => (k === from ? to : k));
    persistPlayers();
    if (current.value === from) {
      current.value = to;
      write(CURRENT_KEY, to);
    }
  }
  /** Spelen för alla spelare på enheten (den som spelar nu ur minnet) - t.ex. för glosornas uttal. */
  function playerSaves(): SaveData[] {
    return players.value
      .map(k => (k === current.value ? toRaw(state) : readJson<SaveData>(saveKey(k))))
      .filter((x): x is SaveData => !!x);
  }

  /* ---------- automatisk reservkopia ---------- */
  function autoBackup(why?: string) {
    write(backupKey(current.value), JSON.stringify({ t: Date.now(), why: why || "", data: toRaw(state) }));
  }
  function backupInfo(): Backup | null {
    try {
      const raw = read(backupKey(current.value));
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
    write(saveKey(current.value), JSON.stringify(p.data));
    return true;
  }
  /* Diplom, rekord, resan och samlingar som finns i reservkopian men saknas i spelet läggs tillbaka –
     en tidigare version av synken tappade dem när två enheters spel slogs ihop. Bara om kopian är samma
     spelare (samma namn); stjärnor och andra räknare rörs inte. Returnerar true om något lades tillbaka. */
  function healFromBackup() {
    const p = backupInfo();
    const name = (state.name || "").trim().toLowerCase();
    if (!p?.data || !name || (p.data.name || "").trim().toLowerCase() !== name) return false;
    const merged = mergeSaves(null, toRaw(state), p.data);
    let changed = false;
    for (const k of ACHIEVEMENTS) {
      if (merged[k] === undefined || JSON.stringify(merged[k]) === JSON.stringify(state[k])) continue;
      state[k] = merged[k];
      changed = true;
    }
    if (changed) save();
    return changed;
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
    remove(saveKey(current.value));
    replace(defaultSave());
  }

  return {
    players,
    current,
    state,
    save,
    replace,
    playerInfo,
    playerUsed,
    addPlayer,
    switchPlayer,
    newLocalPlayer,
    rekey,
    playerSaves,
    autoBackup,
    backupInfo,
    backupAge,
    restoreBackup,
    backupLooksBetter,
    healFromBackup,
    exportCode,
    importCode,
    wipe,
  };
});
