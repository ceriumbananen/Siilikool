/* Slår ihop två versioner av samma barns spel, t.ex. när en iPad har spelat offline medan
   föräldern spelade på telefonen. `base` är den version båda utgick från (senast synkad);
   finns ingen (första kopplingen) tas det högsta värdet i stället för summan.

   - räknare (stjärnor, xp …): båda enheternas förändringar räknas – tjänade och spenderade
     stjärnor på olika enheter blir rätt
   - samlingar (köpta saker, märken, hemligheter, klarade glosor): allt som finns på någon av enheterna
   - bästa resultat per tema/nivå, diplom och rekord: det bästa (högsta, eller lägsta antal drag i memory)
   - resan: per plats alla hörda ord och det högsta per uppgift; dueller: det högsta per motståndare
   - ordminnet: per ord den version som övats mest
   - allt annat (namn, figur, inställningar …): den senast sparade versionen */

type Save = Record<string, any>;

const COUNTERS = ["stars", "xp", "correct", "spoken", "typed", "perfect", "lessons", "hardWins", "tripDone"];
const SETS = ["owned", "badges", "secrets", "furnOwned", "schoolDoneSets"];
const BEST_MAPS = ["best", "bestRight", "chalTop", "diplomas", "tried"];
const LOW_MAPS = ["memBestLv"]; /* antal drag – färre är bättre */
const BEST_NUMS = ["bestcombo", "sentbest", "mixbest", "rank", "songDone"];
const LOW_NUMS = ["memBest"];
/* allt som barnet har klarat (inte räknare som stjärnor, som kan ha spenderats) */
export const ACHIEVEMENTS = [...SETS, ...BEST_MAPS, ...LOW_MAPS, ...BEST_NUMS, ...LOW_NUMS, "duels", "tripP"];

const num = (v: unknown) => (typeof v === "number" && isFinite(v) ? v : 0);
const isObj = (v: unknown): v is Record<string, any> => !!v && typeof v === "object" && !Array.isArray(v);

/* det lägsta av två rekord där färre är bättre (0 eller saknas = inget rekord) */
function lowest(x: unknown, y: unknown) {
  const a = num(x),
    b = num(y);
  return a > 0 && b > 0 ? Math.min(a, b) : a || b;
}

/* två objekt med siffror (t.ex. en duell): det högsta per fält; annat från det första */
function maxFields(x: Record<string, any>, y: Record<string, any>) {
  const m: Record<string, any> = { ...y, ...x };
  for (const f in m) if (typeof x[f] === "number" || typeof y[f] === "number") m[f] = Math.max(num(x[f]), num(y[f]));
  return m;
}

/* hur mycket ett ord har övats: rätt + fel (r/m i ordminnet), sist övat (d) avgör vid lika */
function practice(e: any) {
  return isObj(e) ? num(e.r) + num(e.m) : -1;
}

export function mergeSaves(base: Save | null, local: Save, remote: Save): Save {
  const newer = num(remote.t) > num(local.t) ? remote : local;
  const out: Save = JSON.parse(JSON.stringify(newer));

  for (const k of COUNTERS) {
    if (!(k in local) && !(k in remote)) continue;
    const l = num(local[k]),
      r = num(remote[k]);
    out[k] = base && k in base ? Math.max(0, num(base[k]) + (l - num(base[k])) + (r - num(base[k]))) : Math.max(l, r);
  }

  for (const k of SETS) {
    const a = Array.isArray(local[k]) ? local[k] : [],
      b = Array.isArray(remote[k]) ? remote[k] : [];
    if (!a.length && !b.length) continue;
    out[k] = [...new Set([...a, ...b])]; /* varje sak en gång, även om en lista redan har dubbletter */
  }

  for (const k of BEST_MAPS) {
    const a = isObj(local[k]) ? local[k] : {},
      b = isObj(remote[k]) ? remote[k] : {};
    const m: Record<string, any> = { ...a };
    for (const key in b) {
      const x = a[key],
        y = b[key];
      m[key] =
        typeof x === "number" && typeof y === "number" ? Math.max(x, y) : key in a ? (newer === remote ? y : x) : y;
    }
    if (Object.keys(m).length) out[k] = m;
  }

  for (const k of LOW_MAPS) {
    const a = isObj(local[k]) ? local[k] : {},
      b = isObj(remote[k]) ? remote[k] : {};
    const m: Record<string, any> = { ...a };
    for (const key in b) m[key] = lowest(a[key], b[key]);
    if (Object.keys(m).length) out[k] = m;
  }
  for (const k of BEST_NUMS) if (k in local || k in remote) out[k] = Math.max(num(local[k]), num(remote[k]));
  for (const k of LOW_NUMS) if (k in local || k in remote) out[k] = lowest(local[k], remote[k]);

  /* dueller: vinster, förluster och bästa per motståndare – det högsta */
  const da = isObj(local.duels) ? local.duels : {},
    db = isObj(remote.duels) ? remote.duels : {};
  if (Object.keys(da).length || Object.keys(db).length) {
    const m: Record<string, any> = { ...da };
    for (const id in db) m[id] = isObj(da[id]) && isObj(db[id]) ? maxFields(da[id], db[id]) : db[id];
    out.duels = m;
  }

  /* resan: per plats alla ord som hörts, och det högsta per uppgift */
  const ta = isObj(local.tripP) ? local.tripP : {},
    tb = isObj(remote.tripP) ? remote.tripP : {};
  if (Object.keys(ta).length || Object.keys(tb).length) {
    const m: Record<string, any> = { ...ta };
    for (const id in tb) {
      const x = ta[id],
        y = tb[id];
      if (!isObj(x) || !isObj(y)) {
        m[id] = isObj(x) ? x : y;
        continue;
      }
      const words = [
        ...new Set([...(Array.isArray(x.words) ? x.words : []), ...(Array.isArray(y.words) ? y.words : [])]),
      ];
      m[id] = { ...maxFields(x, y), words };
    }
    out.tripP = m;
  }

  const wa = isObj(local.wordmem) ? local.wordmem : {},
    wb = isObj(remote.wordmem) ? remote.wordmem : {};
  const wm: Record<string, any> = { ...wa };
  for (const key in wb) {
    const x = wa[key],
      y = wb[key];
    if (!(key in wa) || practice(y) > practice(x) || (practice(y) === practice(x) && num(y?.d) > num(x?.d)))
      wm[key] = y;
  }
  out.wordmem = wm;

  out.t = Math.max(num(local.t), num(remote.t));
  return out;
}

/* har spelaren kommit igång? (används för att avgöra om två versioner behöver slås ihop) */
export function hasProgress(s: Save | null | undefined) {
  return !!s && (num(s.xp) > 0 || num(s.stars) > 0 || num(s.correct) > 0 || !!s.setupdone);
}
