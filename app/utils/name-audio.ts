/* Hitta och spela upp Siiris uttal av ett förnamn, om det finns inspelat - porterat från
   nameKey()/nameClip() i public/legacy/app.js (rad 3642-3674). Namnbanken ligger kvar som
   public/audio/names-<bokstav>.js (en fil per bokstav, legacy-formatet
   window.addAudio("names-x", {names: {...}})) eftersom den redan används av den gamla
   motorn på hemskärmen - den här filen hämtar och tolkar samma filer direkt istället för
   att duplicera alla ~1000 namnen. Medvetet UTAN legacy-versionens inledande "Tere," (kräver
   temats egen ljudbank, theme-tere.js) - bara namnet spelas upp. */

function foldDiacritics(s: string): string {
  return s
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/õ/g, "o")
    .replace(/ü/g, "u")
    .replace(/š/g, "s")
    .replace(/ž/g, "z");
}

export function nameKey(name: string): string {
  return (
    (name || "")
      .trim()
      .split(/\s+/)[0]
      ?.toLowerCase()
      .replace(/[^a-zåäöõüšž]/g, "") || ""
  );
}

const bankCache = new Map<string, Promise<Record<string, string> | null>>();

function loadNameBank(letter: string): Promise<Record<string, string> | null> {
  let p = bankCache.get(letter);
  if (!p) {
    p = fetch(`/audio/names-${letter}.js`)
      .then(r => (r.ok ? r.text() : null))
      .then(text => {
        if (!text) return null;
        const m = text.match(/^window\.addAudio\(\s*"[^"]*"\s*,(.+)\);?\s*$/s);
        if (!m) return null;
        const data = JSON.parse(m[1]!) as { names?: Record<string, string> };
        return data.names || null;
      })
      .catch(() => null);
    bankCache.set(letter, p);
  }
  return p;
}

/** Hittar sökvägen till ett förnamns ljudklipp, eller null om Siiri inte kan säga det namnet
 * än. Provar exakt stavning, sedan samma namn utan prickar (Jönas -> jonas) i båda
 * riktningarna, precis som legacy-versionen. */
export async function findNameClip(name: string): Promise<string | null> {
  const key = nameKey(name);
  if (!key) return null;
  const bank = await loadNameBank(key[0]!);
  if (!bank) return null;
  if (bank[key]) return bank[key];
  const plain = foldDiacritics(key);
  if (bank[plain]) return bank[plain];
  for (const k in bank) {
    if (foldDiacritics(k) === plain) return bank[k] ?? null;
  }
  return null;
}
