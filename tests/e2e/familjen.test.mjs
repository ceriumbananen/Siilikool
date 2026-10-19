/* Familjen-sidan (docs/plan-konton-v2.md, steg 3): medlemskort, medlemssidan med "Spela som",
   "Lämna över till barnen", barnens egna länkar, Koder- och Konto-flikarna, och inloggningen på
   Familjen-sidan när man är utloggad. */
import { runTest } from "./harness.mjs";

const EMAIL = "laura@exempel.se",
  PASSWORD = "hemligt-losen";

/* nytt konto via välkomstskärmen, plus barnen Luna (PIN 1234, ⭐40) och Elis */
async function family(t) {
  const A = await t.device("A");
  await A.goto(t.BASE + "/", { waitUntil: "load" });
  await t.until(A, () => !!document.querySelector(".welcome"));
  await t.click(A, "Skapa konto", ".welcome__tabs");
  await t.type(A, "#w-name", "Laura");
  await t.type(A, "#w-fam", "Familjen Ek");
  await t.type(A, "#w-email3", EMAIL);
  await t.type(A, "#w-pw2", PASSWORD);
  await t.click(A, "Skapa konto", ".welcome__form");
  await t.has(A, "Familjen är skapad");
  const fam = (await t.sql("select id, child_code from public.families"))[0];
  await t.sql(
    `insert into public.members (family_id, kind, name, avatar, data) values
       ($1, 'child', 'Luna', '🦊', '{"setupdone":1,"name":"Luna","avatar":"🦊","stars":40}'::jsonb),
       ($1, 'child', 'Elis', '🐻', '{}'::jsonb)`,
    [fam.id],
  );
  await t.sql(
    "update public.members set pin_hash = extensions.crypt('1234', extensions.gen_salt('bf')), has_pin = true where name = 'Luna'",
  );
  const luna = (await t.sql("select id from public.members where name = 'Luna'"))[0];
  const elis = (await t.sql("select id from public.members where name = 'Elis'"))[0];
  return { A, fam, luna, elis };
}

const starsOf = async (t, id) => (await t.sql("select data->>'stars' s from public.members where id = $1", [id]))[0]?.s;
async function setStars(t, page, n) {
  await page.evaluate(n => {
    window.SiiriStore.state.stars = n;
    window.SiiriStore.save();
  }, n);
}
async function waitStars(t, id, n) {
  for (let i = 0; i < 40; i++) {
    if ((await starsOf(t, id)) === String(n)) return true;
    await t.wait(250);
  }
  return false;
}

export default [
  [
    "Familjen: medlemskort, Spela som och Lämna över",
    async t => {
      const { A, luna } = await family(t);
      await A.goto(t.BASE + "/familj", { waitUntil: "load" });
      await t.has(A, "Alla i familjen");
      const cards = await A.evaluate(() =>
        [...document.querySelectorAll(".member")].map(b => b.innerText.replace(/\s+/g, " ")),
      );
      t.ok(
        "alla tre som kort: Laura (du) först, sedan barnen (Luna med PIN)",
        cards.length === 3 &&
          /Laura.*du/.test(cards[0]) &&
          cards.some(c => /Luna.*🔒 PIN/.test(c)) &&
          cards.some(c => /Elis/.test(c)),
        cards,
      );
      await t.click(A, "Luna", ".members");
      t.ok(
        "Lunas sida: Spela som Luna och hennes framsteg (⭐40, tema för tema)",
        (await t.has(A, "Spela som Luna")) && (await t.has(A, "40 stjärnor")) && (await t.has(A, "Tema för tema")),
        await t.text(A),
      );
      t.ok("adressen visar medlemmen (?m=)", await A.evaluate(id => location.search.includes(id), luna.id));
      await t.click(A, "Spela som Luna");
      await t.game(A);
      let s = await t.store(A);
      t.ok(
        "Spela som Luna → enheten spelar Lunas spel, utan hennes PIN",
        s.current === "m:" + luna.id && s.state.name === "Luna" && s.state.stars === 40,
        { current: s.current, name: s.state.name, stars: s.state.stars },
      );
      await setStars(t, A, 55);
      t.ok("det som spelas räknas på Luna (⭐55 i kontot)", await waitStars(t, luna.id, 55));

      await A.goto(t.BASE + "/familj", { waitUntil: "load" });
      t.ok(
        "Lunas kort: spelar nu",
        await t.until(A, () =>
          [...document.querySelectorAll(".member")].some(
            b => /Luna/.test(b.innerText) && /spelar nu/.test(b.innerText),
          ),
        ),
      );
      await t.sql("update public.families set adult_pin_hash = extensions.crypt('2468', extensions.gen_salt('bf'))");
      await A.reload({ waitUntil: "load" });
      await t.click(A, "Lämna över till barnen");
      await t.game(A);
      t.ok(
        "Lämna över → enheten är låst, Luna spelar vidare",
        await t.until(A, () => window.SiiriStore.current.startsWith("m:")),
      );
      await A.goto(t.BASE + "/familj", { waitUntil: "load" });
      t.ok("föräldraläget är låst", await t.has(A, "Enheten är låst"));
      await A.goto(t.BASE + "/", { waitUntil: "load" });
      await t.game(A);
      await t.click(A, "Luna", ".whoplays").catch(() => {});
      await t.until(A, () => window.SiiriStore?.current?.startsWith("m:"));
      await setStars(t, A, 60);
      t.ok("Lunas spel synkar även på den låsta enheten (⭐60)", await waitStars(t, luna.id, 60));
    },
  ],
  [
    "Barnets egen länk, Koder och Konto",
    async t => {
      const { A, fam, luna, elis } = await family(t);
      await A.goto(t.BASE + "/familj?flik=koder", { waitUntil: "load" });
      t.ok(
        "Koder: en rad per kod, familjekoden och barnens egna länkar",
        (await t.has(A, "Koderna i familjen")) &&
          (await t.has(A, "Vuxen-PIN")) &&
          (await t.has(A, "Barnens egna länkar")),
      );
      await t.click(A, "Konto", ".tabs");
      t.ok(
        "Konto: e-post, lösenord och logga ut",
        (await t.has(A, "Inloggad som " + EMAIL)) && (await t.has(A, "Logga ut")),
      );

      const E = await t.device("Elis surfplatta");
      await E.goto(`${t.BASE}/join?kod=${fam.child_code}&barn=${elis.id}`, { waitUntil: "load" });
      await t.game(E);
      t.ok("Elis egen länk → Elis spelar direkt, utan Vem spelar?", (await t.store(E)).current === "m:" + elis.id);

      const L = await t.device("Lunas mobil");
      await L.goto(`${t.BASE}/join?kod=${fam.child_code}&barn=${luna.id}`, { waitUntil: "load" });
      t.ok("Lunas egen länk → bara hennes PIN-ruta", await t.has(L, "Lunas PIN-kod"));
      await t.type(L, ".field.code", "1234");
      await t.click(L, "Spela");
      await t.game(L);
      t.ok("rätt PIN → Luna spelar", (await t.store(L)).current === "m:" + luna.id);
    },
  ],
  [
    "Gamla adresser, inbjudan till en vuxen och Spela som i profilen",
    async t => {
      const { A, fam, luna } = await family(t);
      await A.goto(t.BASE + "/parent?flik=koder", { waitUntil: "load" });
      t.ok(
        "/parent → /familj (med samma ?flik=)",
        await t.until(A, () => location.pathname.startsWith("/familj") && location.search === "?flik=koder"),
      );
      const C = await t.device("gammal QR");
      await C.goto(`${t.BASE}/connect?kod=${fam.child_code}`, { waitUntil: "load" });
      t.ok(
        "/connect → /join med koden",
        (await t.until(C, () => location.pathname.startsWith("/join"))) && (await t.has(C, "Vem spelar?")),
      );

      /* inbjudan */
      await A.goto(t.BASE + "/familj", { waitUntil: "load" });
      await t.click(A, "Skapa en inbjudningslänk");
      await t.until(A, () => !!document.querySelector("input[readonly]")?.value);
      const link = await A.evaluate(() => document.querySelector("input[readonly]").value);
      const B = await t.device("Pappas mobil");
      await B.goto(link, { waitUntil: "load" });
      t.ok(
        "inbjudan utloggad: välkomstskärmen utan familjenamn, familjekod och Spela utan konto",
        (await t.until(B, () => !!document.querySelector(".welcome"))) &&
          (await t.has(B, "Du är inbjuden")) &&
          !(await t.text(B)).includes("Spela utan konto"),
      );
      await t.click(B, "Skapa konto", ".welcome__tabs");
      t.ok("inget fält för familjens namn", await B.evaluate(() => !document.querySelector("#w-fam")));
      await t.type(B, "#w-name", "Pappa");
      await t.type(B, "#w-email3", "pappa@exempel.se");
      await t.type(B, "#w-pw2", "pappas-losen");
      await t.click(B, "Skapa konto", ".welcome__form");
      t.ok("nytt konto → tillbaka till inbjudan", await t.has(B, "Gå med i familjen"), await t.text(B));
      await t.type(B, ".field", "Pappa");
      await t.click(B, "Gå med");
      t.ok(
        "med i familjen → Familjen, med två vuxna",
        await t.until(
          B,
          () => location.pathname.startsWith("/familj") && document.querySelectorAll(".member").length === 4,
          null,
          15000,
        ),
        await t.text(B),
      );
      const pappa = (await t.sql("select id from public.members where name = 'Pappa' and kind = 'adult'"))[0];
      t.ok(
        "Pappas eget spel på hans enhet (m:<pappa>)",
        await t.until(B, k => window.SiiriStore?.current === k, "m:" + pappa?.id),
      );

      /* Spela som i profilen */
      await A.goto(t.BASE + "/profile", { waitUntil: "load" });
      t.ok("profilen: familjens barn som inte spelar här, med spela som", await t.has(A, "spela som"));
      await t.click(A, "Luna", ".profile-page__slots");
      await t.game(A);
      t.ok("Luna spelar på den vuxnas enhet", (await t.store(A)).current === "m:" + luna.id);
      await A.goto(t.BASE + "/profile", { waitUntil: "load" });
      t.ok(
        "profilen: en Familjen-knapp, inget Lås enheten",
        (await t.has(A, "Familjen")) && !(await t.text(A)).includes("Lås enheten"),
      );
    },
  ],
  [
    "För vuxna utan konto: en ingång, framsteg, glosor och säkerhetskopia",
    async t => {
      const D = await t.device("lokal");
      await D.goto(t.BASE + "/", { waitUntil: "load" });
      await t.until(D, () => !!document.querySelector(".welcome"));
      await t.click(D, "Spela utan konto");
      await t.game(D);
      await D.evaluate(() => {
        const s = window.SiiriStore.state;
        Object.assign(s, {
          setupdone: 1,
          name: "Anna",
          stars: 12,
          wordmem: { tere: { w: 3, r: 1, m: 2, d: 1, s: 2 } },
        });
        window.SiiriStore.save();
      });
      await D.goto(t.BASE + "/profile", { waitUntil: "load" });
      await t.has(D, "Perekond");
      const vuxna = await D.evaluate(() =>
        [...document.querySelectorAll("a, button")]
          .filter(e => /För vuxna/.test(e.innerText))
          .map(e => e.getAttribute("href")),
      );
      t.ok("en enda För vuxna-ingång, till /familj", vuxna.length === 1 && vuxna[0] === "/familj", vuxna);
      await D.goto(t.BASE + "/familj", { waitUntil: "load" });
      await t.click(D, "Utan konto: spelet på den här enheten");
      t.ok(
        "utan konto: Annas framsteg, tema för tema, glosor och säkerhetskopia",
        (await t.has(D, "Anna just nu")) &&
          (await t.has(D, "Tema för tema")) &&
          (await t.has(D, "Skolans glosor")) &&
          (await t.has(D, "Säkerhetskopia")),
        await t.text(D),
      );
      t.ok("svåra ord med svenska: tere = hej", await t.has(D, "tere hej"));
      await t.click(D, "Kopiera spelets kod");
      const code = await D.evaluate(() => document.querySelector("textarea[readonly]")?.value || "");
      t.ok("koden är spelets (SIIRI1:…)", code.startsWith("SIIRI1:"));
      await D.evaluate(() => {
        window.SiiriStore.state.stars = 99;
        window.SiiriStore.save();
      });
      await t.click(D, "Återställ från kod");
      await D.evaluate(c => {
        const e = [...document.querySelectorAll("textarea")].find(x => !x.readOnly);
        e.value = c;
        e.dispatchEvent(new Event("input", { bubbles: true }));
      }, code);
      await t.click(D, "Återställ");
      await t.game(D);
      t.ok("återställd från koden (⭐12 igen)", (await t.store(D)).state.stars === 12);
      await D.goto(t.BASE + "/familj", { waitUntil: "load" });
      await t.click(D, "Utan konto: spelet på den här enheten");
      await t.click(D, "Skolans glosor");
      t.ok("Skolans glosor → inklistringen i spelet", await t.has(D, "Klistra in orden"), await t.text(D));
    },
  ],
  [
    "Utloggad på Familjen-sidan: inloggningen, och sedan tillbaka till Familjen",
    async t => {
      const { A } = await family(t);
      await A.close();
      const B = await t.device("B");
      await B.goto(t.BASE + "/familj", { waitUntil: "load" });
      t.ok(
        "välkomstskärmen i stället för den gamla e-postlänken",
        await t.until(B, () => !!document.querySelector(".welcome")),
      );
      await t.type(B, "#w-email", EMAIL);
      await t.type(B, "#w-pw", PASSWORD);
      await t.click(B, "Logga in", ".welcome__form");
      t.ok(
        "inloggad → tillbaka i Familjen",
        await t.until(
          B,
          () => location.pathname.startsWith("/familj") && document.body.innerText.includes("Alla i familjen"),
          null,
          15000,
        ),
        await t.text(B),
      );
    },
  ],
];
