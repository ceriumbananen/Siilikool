/* Hittar Siiris inspelning av ett estniskt ord eller en fras - samma ljudkartor som den gamla
   motorn (bank()/partFor()/slowPartFor() i public/legacy/app.js): window.AUDIO i
   public/legacy/data.js har de vanligaste orden, PARTMAP/SLOWMAP pekar ut vilken ljuddel
   (public/audio/<del>.js, formatet window.addAudio("del", {normal, slow})) resten ligger i.
   Filerna hämtas och tolkas direkt, en gång var, i stället för att data.js och app.js laddas
   (jfr app/utils/name-audio.ts, som gör samma sak för namnen). */

type Bank = Record<string, string>;
type Core = { normal: Bank; slow: Bank; partmap: Record<string, string>; slowmap: Record<string, string> };

let corePromise: Promise<Core | null> | null = null;
const partCache = new Map<string, Promise<{ normal: Bank; slow: Bank } | null>>();

/* data.js: en rad per karta, "window.NAMN = {...};" (JSON) */
function loadCore(): Promise<Core | null> {
  if (!corePromise)
    corePromise = fetch("/legacy/data.js")
      .then(r => (r.ok ? r.text() : null))
      .then(text => {
        if (!text) return null;
        const read = (name: string) => {
          const m = text.match(new RegExp(`window\\.${name} = (\\{.*\\});?\\s*$`, "m"));
          return m ? JSON.parse(m[1]!) : {};
        };
        const audio = read("AUDIO");
        return {
          normal: audio.normal || {},
          slow: audio.slow || {},
          partmap: read("PARTMAP"),
          slowmap: read("SLOWMAP"),
        };
      })
      .catch(() => null);
  return corePromise;
}

function loadPart(part: string) {
  let p = partCache.get(part);
  if (!p) {
    p = fetch(`/audio/${part}.js`)
      .then(r => (r.ok ? r.text() : null))
      .then(text => {
        const m = text?.match(/^window\.addAudio\(\s*"[^"]*"\s*,(.+)\);?\s*$/s);
        if (!m) return null;
        const data = JSON.parse(m[1]!) as { normal?: Bank; slow?: Bank };
        return { normal: data.normal || {}, slow: data.slow || {} };
      })
      .catch(() => null);
    partCache.set(part, p);
  }
  return p;
}

/** Sökvägen till inspelningen av `et` ("/audio/clips/..."), eller null om det inte finns någon.
 * slow = den långsamma inläsningen; finns ingen sådan ges den vanliga och isSlow = false (då
 * spelas den i lägre takt, som i legacy). */
export async function findWordClip(et: string, slow = false): Promise<{ src: string; isSlow: boolean } | null> {
  const core = await loadCore();
  if (!core) return null;
  const abs = (p: string) => (p.startsWith("/") ? p : `/${p}`);
  if (slow) {
    const sp = core.slowmap[et];
    const bank = sp ? (await loadPart(sp))?.slow : core.slow;
    if (bank?.[et]) return { src: abs(bank[et]), isSlow: true };
  }
  if (core.normal[et]) return { src: abs(core.normal[et]), isSlow: false };
  const part = core.partmap[et];
  const fromPart = part ? (await loadPart(part))?.normal[et] : undefined;
  return fromPart ? { src: abs(fromPart), isSlow: false } : null;
}
