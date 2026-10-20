#!/usr/bin/env node
/* Listar buggrapporter som barn och föräldrar skickat in från spelet (🐛-knappen i headern,
 * openBugReport() i public/legacy/app.js). Läser direkt med service-role-nyckeln - förbi RLS
 * (bug_reports kan bara skrivas till, aldrig läsas, av klienten själv, se
 * supabase/migrations/20261020000000_bugrapporter.sql) - så den här nyckeln får aldrig hamna i
 * appens egna .env-variabler (NUXT_PUBLIC_*) eller committas.
 *
 * Körs från repots rot:
 *   node --env-file=.env scripts/buggar.mjs            (olästa, nyast sist)
 *   node --env-file=.env scripts/buggar.mjs --alla      (även redan klarmarkerade)
 *   node --env-file=.env scripts/buggar.mjs --klar <id> (markera en rapport som klar, kort id räcker)
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NUXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error(
    "Saknar NUXT_PUBLIC_SUPABASE_URL och/eller SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Lägg till SUPABASE_SERVICE_ROLE_KEY i .env (Supabase: Project Settings → API → service_role secret).\n" +
      "Den nyckeln är hemlig - committa den aldrig, och lägg den aldrig under NUXT_PUBLIC_*.",
  );
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const CATS = {
  confused: "😕 Konstigt",
  sound: "🔇 Ljudet",
  image: "🖼️ Bilden",
  stuck: "🐌 Fastnade",
  other: "✏️ Annat",
};

const args = process.argv.slice(2);
const markDone = args.includes("--klar") ? args[args.indexOf("--klar") + 1] : null;

if (markDone) {
  const { data, error } = await sb
    .from("bug_reports")
    .update({ status: "done" })
    .ilike("id", markDone + "%")
    .select("id")
    .single();
  if (error) {
    console.error("Kunde inte markera som klar:", error.message);
    process.exit(1);
  }
  console.log("Markerad som klar:", data.id);
  process.exit(0);
}

const showAll = args.includes("--alla");
let q = sb.from("bug_reports").select("*").order("created_at", { ascending: true });
if (!showAll) q = q.eq("status", "open");
const { data, error } = await q;
if (error) {
  console.error("Kunde inte hämta rapporter:", error.message);
  process.exit(1);
}
if (!data.length) {
  console.log(showAll ? "Inga buggrapporter alls." : "Inga olästa buggrapporter. 🎉");
  process.exit(0);
}

for (const r of data) {
  const when = new Date(r.created_at).toLocaleString("sv-SE");
  console.log("—".repeat(60));
  console.log(`${r.id.slice(0, 8)}  ${when}  ${r.status === "done" ? "(klar)" : ""}`);
  console.log(
    `${CATS[r.category] || r.category}  ·  profil: ${r.profile_name || "(okänd)"}  ·  skärm: ${r.screen || "?"}`,
  );
  if (r.note) console.log(`Text: ${r.note}`);
  if (r.last_audio) console.log(`Senast uppspelat ord: ${r.last_audio}`);
  if (r.console_errors?.length) console.log(`Konsol-fel:\n  ${r.console_errors.join("\n  ")}`);
  if (r.device && Object.keys(r.device).length)
    console.log(`Enhet: ${r.device.width}×${r.device.height}  ${r.device.ua || ""}`);
}
console.log("—".repeat(60));
console.log(`${data.length} rapport(er). Markera klar: node --env-file=.env scripts/buggar.mjs --klar <id>`);
