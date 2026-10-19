/* Kör alla tests/e2e/*.test.mjs (eller de som matchar ett namn):
     yarn test:e2e              bygger appen mot låtsas-Supabase och kör allt
     yarn test:e2e --no-build   använder bygget i tests/.site
     yarn test:e2e konton       bara testfiler vars namn innehåller "konton" */
import fs from "node:fs";
import path from "node:path";
import { build, runTest, ROOT, SITE_DIR } from "./harness.mjs";

const args = process.argv.slice(2);
const filter = args.find(a => !a.startsWith("--"));
if (!args.includes("--no-build") || !fs.existsSync(SITE_DIR)) {
  console.log("Bygger appen mot låtsas-Supabase …");
  build();
}
const dir = path.join(ROOT, "tests/e2e");
let pass = 0,
  fail = 0;
for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".test.mjs") && (!filter || f.includes(filter)))) {
  const tests = (await import(path.join(dir, f))).default;
  for (const [name, fn, env] of tests) {
    for (const r of await runTest(name, fn, env)) r.pass ? pass++ : fail++;
  }
}
console.log(`\n${pass} av ${pass + fail} kontroller godkända${fail ? ` – ${fail} misslyckades` : ""}`);
process.exit(fail ? 1 : 0);
