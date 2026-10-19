/* Testmiljö för tests/e2e/*.test.mjs: bygger appen mot låtsas-Supabase (tests/fake-supabase.mjs),
   serverar bygget som Cloudflare Pages gör, och styr Chrome med puppeteer-core. Varje test får en
   ny, tom databas. Kör alla med:  yarn test:e2e   (eller  yarn test:e2e --no-build  om bygget finns) */
import { spawn, execSync } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const SITE_DIR = path.join(ROOT, "tests/.site");
export const API = "http://localhost:54321";
export const BASE = "http://localhost:8012";
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export const wait = ms => new Promise(r => setTimeout(r, ms));

/* appen byggd mot låtsas-Supabase, i tests/.site */
export function build() {
  execSync("yarn generate", {
    cwd: ROOT,
    stdio: ["ignore", "ignore", "inherit"],
    env: { ...process.env, NUXT_PUBLIC_SUPABASE_URL: API, NUXT_PUBLIC_SUPABASE_KEY: "fake-anon-key" },
  });
  fs.rmSync(SITE_DIR, { recursive: true, force: true });
  fs.cpSync(path.join(ROOT, ".output/public"), SITE_DIR, { recursive: true });
}

/* statisk server som Cloudflare Pages: /x/index.html -> 308 /x/, mapp utan / -> 308, okänt -> 404.html */
export function startSite() {
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".webmanifest": "application/manifest+json",
    ".png": "image/png",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
  };
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, BASE);
    let p = decodeURIComponent(u.pathname);
    if (p.endsWith("/index.html")) return res.writeHead(308, { location: p.slice(0, -10) + u.search }).end();
    let f = path.join(SITE_DIR, p);
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) {
      if (!p.endsWith("/")) return res.writeHead(308, { location: p + "/" + u.search }).end();
      f = path.join(f, "index.html");
    }
    if (!fs.existsSync(f)) {
      res.writeHead(404, { "content-type": "text/html" });
      return res.end(fs.readFileSync(path.join(SITE_DIR, "404.html")));
    }
    res.writeHead(200, {
      "content-type": types[path.extname(f)] || "application/octet-stream",
      "cache-control": "no-store",
    });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => server.listen(8012, () => r(server)));
}

/* låtsas-Supabase med en ny databas */
async function startFake(env = {}) {
  const proc = spawn("node", [path.join(ROOT, "tests/fake-supabase.mjs"), "54321"], {
    stdio: ["ignore", "pipe", "inherit"],
    env: { ...process.env, ...env },
  });
  await new Promise((resolve, reject) => {
    proc.stdout.on("data", d => String(d).includes("låtsas-Supabase") && resolve());
    proc.on("exit", c => reject(new Error("låtsas-Supabase avslutades: " + c)));
  });
  return proc;
}

export async function sql(query, params) {
  const r = await fetch(API + "/debug/sql", { method: "POST", body: JSON.stringify({ sql: query, params }) });
  return r.json();
}

/* Ett test: får `t` med enheter (egna webbläsarprofiler), hjälpare och ok() för kontrollerna */
export async function runTest(name, fn, env = {}) {
  const fake = await startFake(env);
  const site = await startSite();
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    protocolTimeout: 90000,
    defaultViewport: { width: 390, height: 900 },
  });
  const results = [],
    errors = [];
  const t = {
    ok(label, cond, info) {
      results.push({ label, pass: !!cond, info });
      console.log(`${cond ? "  ✅" : "  ❌"} ${label}${cond ? "" : "  → " + JSON.stringify(info)}`);
    },
    /* en ny enhet: egen lagring och egen inloggning */
    async device(label) {
      const ctx = await browser.createBrowserContext();
      const page = await ctx.newPage();
      page.on("pageerror", e => errors.push(`${label}: ${e.message}`));
      page.on("dialog", d => d.accept());
      return page;
    },
    async until(page, fn, arg, ms = 12000) {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) {
        if (await page.evaluate(fn, arg).catch(() => false)) return true;
        await wait(200);
      }
      return false;
    },
    text: page => page.evaluate(() => document.body.innerText.replace(/\s+/g, " ")),
    async has(page, txt, ms) {
      return t.until(page, x => document.body.innerText.replace(/\s+/g, " ").includes(x), txt, ms);
    },
    /* klickar på knappen/länken med den texten (väntar tills den finns och är aktiv) */
    async click(page, txt, root = "") {
      for (let i = 0; i < 50; i++) {
        const done = await page
          .evaluate(
            (x, r) => {
              const e = [...document.querySelectorAll(`${r} button, ${r} a`)].find(
                b => b.innerText.includes(x) && !b.disabled,
              );
              if (e) e.click();
              return !!e;
            },
            txt,
            root,
          )
          .catch(() => false);
        if (done) return;
        await wait(200);
      }
      throw new Error("hittar inte: " + txt);
    },
    async type(page, selector, value) {
      await t.until(page, s => !!document.querySelector(s), selector);
      await page.evaluate(
        (s, v) => {
          const e = document.querySelector(s);
          e.value = v;
          e.dispatchEvent(new Event("input", { bubbles: true }));
        },
        selector,
        value,
      );
    },
    /* spelet (den gamla appen) har startat på sidan */
    game: page =>
      t.until(
        page,
        () => location.pathname === "/" && !!window.SiiriStore && !!document.getElementById("app")?.innerText,
        null,
        15000,
      ),
    store: page =>
      page.evaluate(() =>
        JSON.parse(
          JSON.stringify({
            state: window.SiiriStore.state,
            players: window.SiiriStore.players,
            current: window.SiiriStore.current,
          }),
        ),
      ),
    sql,
    wait,
    BASE,
  };
  console.log(`\n▶ ${name}`);
  try {
    await fn(t);
  } catch (e) {
    results.push({ label: "kraschade: " + e.message, pass: false });
    console.log("  💥 " + e.message);
  } finally {
    await browser.close();
    site.close();
    fake.kill();
  }
  if (errors.length) {
    results.push({ label: "fel i sidan", pass: false, info: errors });
    console.log("  ❌ fel i sidan: " + JSON.stringify(errors));
  }
  return results;
}
