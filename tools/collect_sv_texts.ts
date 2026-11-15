/* Samlar alla svenska texter som Siiri läser upp i estniskt läge (barnet lär sig svenska), en per
   rad - indata till tools/generate_audio_sv.py. Kör från repots rot:

     node_modules/.bin/jiti tools/collect_sv_texts.ts > sv_texts.txt
     python3 tools/generate_audio_sv.py --edge texter --file sv_texts.txt

   Texter med platshållare ({name}, {value}) hoppas över - de läses av enhetens röst. */
import { THEMES } from "../app/utils/themes";
import { TRIP, EPILOGUE } from "../app/utils/trip";
import { SENTENCES } from "../app/utils/sentences";
import { CHATS } from "../app/utils/chats";
import { KITCHEN_RECIPES } from "../app/utils/kitchen";
import { SHOP, FURN } from "../app/utils/shop";
import { RANKS } from "../app/utils/ranks";
import { kesPhrasesSv } from "../app/utils/kes";
import { kadPhrasesSv } from "../app/utils/kadunud";
import * as PAK from "../app/utils/pakapikk";

const out = new Set<string>();
const add = (x: unknown) => {
  if (typeof x !== "string") return;
  const t = x.trim();
  if (t && !t.includes("{")) out.add(t);
};
/* alla { et, sv }-par i en struktur, hur djupt de än ligger */
const walk = (v: unknown, depth = 0): void => {
  if (!v || depth > 8) return;
  if (Array.isArray(v)) return v.forEach(x => walk(x, depth + 1));
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.sv === "string" && typeof o.et === "string") add(o.sv);
    Object.values(o).forEach(x => walk(x, depth + 1));
  }
};

THEMES.forEach(t => walk(t.words));
TRIP.forEach(t => walk(t.words));
EPILOGUE.stops.forEach(s => walk(s.word));
walk(SENTENCES);
walk(CHATS);
walk(KITCHEN_RECIPES);
walk(SHOP);
walk(FURN);
walk(RANKS);
kesPhrasesSv().forEach(add);
kadPhrasesSv().forEach(add);
Object.values(PAK).forEach(v => {
  if (typeof v !== "function") walk(v);
});
/* breven och gåvorna ligger bakom pakDay() - en dag i taget */
for (let d = 1; d <= PAK.PAK_DAYS; d++) walk(PAK.pakDay(d));
/* sångfinalen i Salme (SONG i public/legacy/app.js) och några fasta repliker därifrån */
[
  "Mitt fosterland är min kärlek",
  "som jag har gett",
  "mitt kära fosterland",
  "och jag älskar det",
  "dina höga berg",
  "dina vida skogar",
  "vi sjunger tillsammans",
  "Du är duktig!",
  "Ja, precis så!",
].forEach(add);

process.stdout.write([...out].join("\n") + "\n");
