/* Konton och spelare (docs/plan-konton-v2.md, steg 0-2): välkomstskärmen, nytt konto, inloggning
   på en tömd enhet, en annan spelare på samma enhet, flytten från de gamla profilplatserna, och
   barnens enheter med flera barn, PIN och "Vem spelar?". */
import { runTest } from "./harness.mjs";

const EMAIL = "laura@exempel.se",
  PASSWORD = "hemligt-losen";

/* nytt konto via välkomstskärmen; returnerar enheten */
async function createAccount(t) {
  const A = await t.device("A");
  await A.goto(t.BASE + "/", { waitUntil: "load" });
  await t.until(A, () => !!document.querySelector(".welcome"));
  await t.click(A, "Skapa konto", ".welcome__tabs");
  await t.type(A, "#w-name", "Laura");
  await t.type(A, "#w-fam", "Familjen Ek");
  await t.type(A, "#w-email3", EMAIL);
  await t.type(A, "#w-pw2", PASSWORD);
  await t.click(A, "Skapa konto", ".welcome__form");
  await t.until(A, () => location.pathname.startsWith("/familj"));
  return A;
}

export default [
  [
    "Välkomstskärmen och Spela utan konto",
    async t => {
      const D = await t.device("ny");
      await D.goto(t.BASE + "/", { waitUntil: "load" });
      t.ok("ny enhet: välkomstskärmen visas", await t.until(D, () => !!document.querySelector(".welcome")));
      t.ok(
        "Logga in är förvalt, Skapa konto som andra flik",
        await D.evaluate(
          () =>
            [...document.querySelectorAll(".welcome__tab")]
              .map(b => b.innerText + (b.classList.contains("welcome__tab--on") ? "*" : ""))
              .join("|") === "Logga in*|Skapa konto",
        ),
      );
      t.ok("inget toppfält (profil, märke, stjärnor)", await D.evaluate(() => !document.querySelector(".topbar")));
      await t.click(D, "Spela utan konto");
      t.ok(
        "Spela utan konto → namnrutan, fortfarande utan toppfält",
        (await t.game(D)) &&
          (await t.has(D, "Vad heter du?")) &&
          (await D.evaluate(() => document.querySelector(".topbar").hidden)),
      );
      await D.reload({ waitUntil: "load" });
      t.ok("valet sitter kvar: ingen välkomstskärm igen", (await t.game(D)) && !(await D.$(".welcome")));
    },
  ],
  [
    "Nytt konto, sedan tömd webbläsare: logga in → spelet är tillbaka",
    async t => {
      const A = await createAccount(t);
      t.ok("Skapa konto → föräldraläget, familjen skapad", await t.has(A, "Familjen är skapad"), await t.text(A));
      const adult = (await t.sql("select id, name from public.members where kind = 'adult'"))[0];
      t.ok("vuxen medlem Laura", adult?.name === "Laura", adult);
      await A.goto(t.BASE + "/", { waitUntil: "load" });
      await t.game(A);
      let s = await t.store(A);
      t.ok(
        "spelaren heter Laura och är kontots (m:<id>)",
        s.state.name === "Laura" && s.current === "m:" + adult.id,
        s.current,
      );
      await A.evaluate(() => {
        window.SiiriStore.state.stars = 300;
        window.SiiriStore.save();
      });
      let saved = false;
      for (let i = 0; i < 40 && !saved; i++) {
        saved = (await t.sql("select data->>'stars' s from public.members where id = $1", [adult.id]))[0]?.s === "300";
        await t.wait(250);
      }
      t.ok("stjärnorna sparas i kontot (300)", saved);

      /* en helt tom webbläsare (= tömd lagring) */
      const B = await t.device("tömd");
      await B.goto(t.BASE + "/", { waitUntil: "load" });
      t.ok("tömd enhet: välkomstskärmen", await t.until(B, () => !!document.querySelector(".welcome")));
      await t.type(B, "#w-email", EMAIL);
      await t.type(B, "#w-pw", "fel-losen");
      await t.click(B, "Logga in", ".welcome__form");
      t.ok("fel lösenord → tydligt fel på svenska", await t.has(B, "Fel e-post eller lösenord"));
      await t.type(B, "#w-pw", PASSWORD);
      await t.click(B, "Logga in", ".welcome__form");
      t.ok("rätt lösenord → in i spelet", await t.game(B));
      s = await t.store(B);
      t.ok(
        "spelet är tillbaka: Laura, ⭐300",
        s.state.name === "Laura" && s.state.stars === 300 && s.current === "m:" + adult.id,
        { name: s.state.name, stars: s.state.stars, current: s.current },
      );
    },
  ],
  [
    "Logga ut i Familjen → välkomstskärmen, och inte den vuxnas spel",
    async t => {
      const A = await createAccount(t);
      await t.has(A, "Familjen är skapad");
      await A.goto(t.BASE + "/", { waitUntil: "load" });
      await t.game(A);
      const adultKey = (await t.store(A)).current;
      await A.goto(t.BASE + "/familj?flik=konto", { waitUntil: "load" });
      await t.click(A, "Logga ut");
      t.ok(
        "Logga ut → välkomstskärmen direkt",
        await t.until(A, () => location.pathname === "/" && !!document.querySelector(".welcome")),
      );
      await A.goto(t.BASE + "/", { waitUntil: "load" });
      t.ok(
        "Till spelet efter utloggning: fortfarande välkomstskärmen",
        await t.until(A, () => !!document.querySelector(".welcome")),
      );
      await t.click(A, "Spela utan konto");
      await t.game(A);
      const s = await t.store(A);
      t.ok(
        "Spela utan konto → en ny lokal spelare, den vuxnas spel ligger kvar i listan",
        s.current.startsWith("l:") && s.players.includes(adultKey) && (await t.has(A, "Vad heter du?")),
        s,
      );
      await A.reload({ waitUntil: "load" });
      t.ok("lokala spelet startar utan välkomstskärm", (await t.game(A)) && !(await A.$(".welcome")));
      await A.evaluate(k => window.SiiriStore.switchPlayer(k, "/"), adultKey);
      t.ok(
        "byter man till den vuxnas spel utloggad → välkomstskärmen",
        await t.until(A, () => !!document.querySelector(".welcome")),
      );
      await t.type(A, "#w-email", EMAIL);
      await t.type(A, "#w-pw", PASSWORD);
      await t.click(A, "Logga in", ".welcome__form");
      t.ok("logga in igen → den vuxnas spel", (await t.game(A)) && (await t.store(A)).current === adultKey);
    },
  ],
  [
    "En annan spelare på enheten: den vuxna får en egen spelare, den andra finns kvar",
    async t => {
      const A = await createAccount(t);
      const adult = (await t.sql("select id from public.members where kind = 'adult'"))[0];
      await t.sql("update public.members set data = $1, ver = 1 where id = $2", [
        JSON.stringify({ name: "Laura", stars: 300, xp: 900, setupdone: 1 }),
        adult.id,
      ]);
      await A.close();

      const C = await t.device("Elis iPad");
      /* ett lokalt spel i den gamla platsen (som före ombyggnaden) */
      await C.goto(t.BASE + "/manifest.webmanifest", { waitUntil: "load" });
      await C.evaluate(() =>
        localStorage.setItem("siiri-eesti-v1", JSON.stringify({ setupdone: 1, name: "Elis", stars: 50, xp: 70 })),
      );
      await C.goto(t.BASE + "/", { waitUntil: "load" });
      t.ok(
        "befintlig spelare: ingen välkomstskärm, Elis spelar",
        (await t.game(C)) && (await t.store(C)).state.name === "Elis",
      );
      await C.goto(t.BASE + "/familj", { waitUntil: "load" });
      await t.click(C, "Logga in med kod i stället");
      await t.type(C, "#w-email2", EMAIL);
      await t.click(C, "Skicka kod");
      await t.type(C, "#w-code", "123456");
      await t.click(C, "Logga in med koden");
      await t.until(C, () => !!window.SiiriStore && window.SiiriStore.state.stars === 300, null, 15000);
      const s = await t.store(C);
      t.ok(
        "inloggning byter till den vuxnas egen spelare (⭐300)",
        s.state.name === "Laura" && s.state.stars === 300 && s.current === "m:" + adult.id,
        { name: s.state.name, stars: s.state.stars, current: s.current },
      );
      t.ok(
        "Elis lokala spel finns kvar som egen spelare",
        s.players.length === 2 && s.players.some(k => k.startsWith("l:")),
        s.players,
      );
      await C.goto(t.BASE + "/profile", { waitUntil: "load" });
      t.ok(
        "profilen visar Laura och Elis + Ny spelare",
        (await t.has(C, "Elis")) && (await t.has(C, "Ny spelare")) && (await t.has(C, "Laura")),
      );
    },
  ],
  [
    "Flytten från de tre gamla profilplatserna",
    async t => {
      const D = await t.device("gammal");
      await D.goto(t.BASE + "/manifest.webmanifest", { waitUntil: "load" });
      await D.evaluate(() => {
        localStorage.setItem("siiri-eesti-v1", JSON.stringify({ setupdone: 1, name: "Anna", stars: 5 }));
        localStorage.setItem(
          "siiri-eesti-v1-backup",
          JSON.stringify({ t: 1, why: "test", data: { name: "Anna", stars: 4 } }),
        );
        localStorage.setItem("siiri-eesti-v1-1", JSON.stringify({ setupdone: 1, name: "Luna", stars: 77 }));
        localStorage.setItem(
          "siiri-eesti-cloud",
          JSON.stringify({
            1: {
              id: "11111111-1111-4111-8111-111111111111",
              kind: "child",
              name: "Luna",
              ver: 3,
              base: null,
              dirty: false,
            },
          }),
        );
        localStorage.setItem("siiri-eesti-slots", "1");
      });
      await D.goto(t.BASE + "/", { waitUntil: "load" });
      await t.game(D);
      const r = await D.evaluate(() => ({
        players: JSON.parse(localStorage.getItem("siiri-players")),
        current: localStorage.getItem("siiri-current"),
        links: JSON.parse(localStorage.getItem("siiri-links") || "{}"),
        name: window.SiiriStore.state.name,
        stars: window.SiiriStore.state.stars,
        oldKept: !!localStorage.getItem("siiri-eesti-v1-1"),
      }));
      const luna = "m:11111111-1111-4111-8111-111111111111";
      t.ok(
        "två spelare: Anna (lokal) och Luna (medlem)",
        r.players.length === 2 && r.players.includes(luna) && r.players.some(k => k.startsWith("l:")),
        r.players,
      );
      t.ok(
        "platsen som spelades (Luna) spelar nu, med sitt spel",
        r.current === luna && r.name === "Luna" && r.stars === 77,
        r,
      );
      t.ok("kopplingen följer med till Lunas nyckel", r.links[luna]?.ver === 3, r.links);
      const anna = r.players.find(k => k.startsWith("l:"));
      const bk = await D.evaluate(k => JSON.parse(localStorage.getItem(`siiri-p-${k}-backup`) || "null"), anna);
      t.ok("Annas reservkopia följer med", bk?.data?.stars === 4, bk);
      t.ok("de gamla platserna ligger kvar orörda", r.oldKept);
    },
  ],
  [
    "Flytten: huvudprofilen på tredje platsen, medan en annan plats spelas",
    async t => {
      const D = await t.device("tredje");
      await D.goto(t.BASE + "/manifest.webmanifest", { waitUntil: "load" });
      await D.evaluate(() => {
        localStorage.setItem("siiri-eesti-v1", JSON.stringify({ setupdone: 1, name: "Test", stars: 2 }));
        localStorage.setItem("siiri-eesti-v1-1", JSON.stringify({ setupdone: 1, name: "Test2", stars: 1 }));
        localStorage.setItem("siiri-eesti-v1-2", JSON.stringify({ setupdone: 1, name: "Luna", stars: 900, xp: 5000 }));
        localStorage.setItem(
          "siiri-eesti-cloud",
          JSON.stringify({
            2: {
              id: "22222222-2222-4222-8222-222222222222",
              kind: "child",
              name: "Luna",
              ver: 9,
              base: null,
              dirty: false,
            },
          }),
        );
        localStorage.setItem("siiri-eesti-slots", "0");
      });
      await D.goto(t.BASE + "/", { waitUntil: "load" });
      await t.game(D);
      const luna = "m:22222222-2222-4222-8222-222222222222";
      const r = await D.evaluate(
        k => ({
          players: JSON.parse(localStorage.getItem("siiri-players")),
          current: localStorage.getItem("siiri-current"),
          luna: JSON.parse(localStorage.getItem("siiri-p-" + k) || "null"),
          link: JSON.parse(localStorage.getItem("siiri-links") || "{}")[k],
        }),
        luna,
      );
      t.ok("alla tre spelarna finns kvar", r.players.length === 3 && r.players.includes(luna), r.players);
      t.ok("den valda platsen (Test) spelar fortfarande", r.current !== luna && r.current.startsWith("l:"), r.current);
      t.ok("huvudprofilen har hela sitt spel (⭐900, 5000 xp)", r.luna?.stars === 900 && r.luna?.xp === 5000, r.luna);
      t.ok("och sin koppling till familjen", r.link?.ver === 9, r.link);
    },
  ],
  [
    "Barnens enhet: två barn, PIN, Vem spelar? och borttagen enhet",
    async t => {
      const A = await createAccount(t);
      const fam = (await t.sql("select id, child_code from public.families"))[0];
      await t.sql(
        "insert into public.members (family_id, kind, name, avatar) values ($1, 'child', 'Luna', '🦊'), ($1, 'child', 'Elis', '🐻')",
        [fam.id],
      );
      await t.sql(
        "update public.members set pin_hash = extensions.crypt('1234', extensions.gen_salt('bf')), has_pin = true where name = 'Elis'",
      );
      const [luna, elis] = await t.sql("select id from public.members where kind = 'child' order by name desc");
      await A.close();

      const I = await t.device("iPad");
      await I.goto(t.BASE + "/join?kod=" + fam.child_code, { waitUntil: "load" });
      await t.has(I, "Vem spelar?");
      await t.click(I, "Luna");
      await t.game(I);
      let s = await t.store(I);
      t.ok("Luna spelar (m:<luna>)", s.state.name === "Luna" && s.current === "m:" + luna.id, s.current);
      await I.goto(t.BASE + "/join", { waitUntil: "load" });
      await t.has(I, "Vem spelar?");
      await t.click(I, "Elis");
      await t.type(I, 'input[type="password"]', "9999");
      await t.click(I, "Spela");
      t.ok("fel PIN för Elis → Fel PIN-kod", await t.has(I, "Fel PIN-kod"));
      await t.type(I, 'input[type="password"]', "1234");
      await t.click(I, "Spela");
      await t.game(I);
      s = await t.store(I);
      t.ok(
        "Elis får en egen spelare, Luna finns kvar",
        s.state.name === "Elis" && s.current === "m:" + elis.id && s.players.includes("m:" + luna.id),
        s.players,
      );

      /* appen öppnas igen (ny flik) */
      const I2 = await (await I.browserContext()).newPage();
      await I2.goto(t.BASE + "/", { waitUntil: "load" });
      t.ok(
        "appen öppnas: Vem spelar? med Luna och Elis",
        await t.until(I2, () => {
          const n = [...document.querySelectorAll(".whoplays .slotbtn b")].map(b => b.innerText);
          return n.includes("Luna") && n.includes("Elis");
        }),
      );
      await t.click(I2, "Luna", ".whoplays");
      await t.until(I2, () => window.SiiriStore?.state.name === "Luna");
      t.ok("väljer Luna → Luna spelar", (await t.store(I2)).state.name === "Luna");

      /* en vuxen tar bort iPaden från Luna */
      await I2.evaluate(() => {
        window.SiiriStore.state.stars = 42;
        window.SiiriStore.save();
      });
      await t.wait(2600);
      await t.sql("delete from public.device_members where member_id = $1", [luna.id]);
      await I2.reload({ waitUntil: "load" });
      await t.game(I2);
      await t.wait(1500);
      s = await t.store(I2);
      t.ok(
        "borttagen: Lunas spel finns kvar på iPaden, som lokal spelare",
        s.state.name === "Luna" && s.state.stars === 42 && s.current.startsWith("l:"),
        { current: s.current, stars: s.state.stars },
      );
      t.ok("Elis finns kvar som familjens spelare", s.players.includes("m:" + elis.id), s.players);
    },
  ],
  [
    "Låst enhet: den vuxnas spel göms, barnen läggs till utan kod",
    async t => {
      const A = await createAccount(t);
      const fam = (await t.sql("select id from public.families"))[0];
      const adult = (await t.sql("select id from public.members where kind = 'adult'"))[0];
      await t.sql("insert into public.members (family_id, kind, name, avatar) values ($1, 'child', 'Luna', '🦊')", [
        fam.id,
      ]);
      await t.sql("update public.families set adult_pin_hash = extensions.crypt('2468', extensions.gen_salt('bf'))");
      const luna = (await t.sql("select id from public.members where kind = 'child'"))[0];
      await A.goto(t.BASE + "/familj", { waitUntil: "load" });
      await t.click(A, "Lämna över till barnen");
      await t.game(A);
      t.ok(
        "låst: Vem spelar? måste besvaras, utan den vuxnas spel",
        await t.until(A, () => {
          const n = [...document.querySelectorAll(".whoplays .slotbtn b")].map(b => b.innerText);
          return n.length === 1 && n[0] === "Lägg till" && !document.querySelector(".whoplays .closebtn");
        }),
        await t.text(A),
      );
      await t.click(A, "Lägg till", ".whoplays");
      t.ok("låst /join: barnen utan familjekod", (await t.has(A, "Vem spelar?")) && (await t.has(A, "Luna")));
      await t.click(A, "Luna");
      await t.game(A);
      const s = await t.store(A);
      t.ok(
        "Luna spelar på den låsta enheten, den vuxnas spelare finns kvar",
        s.current === "m:" + luna.id && s.players.includes("m:" + adult.id),
        s.players,
      );
    },
  ],
  [
    "Ny spelare i profilen, och två enheter som spelar samtidigt",
    async t => {
      const A = await createAccount(t);
      const fam = (await t.sql("select id, child_code from public.families"))[0];
      await t.sql("insert into public.members (family_id, kind, name, avatar) values ($1, 'child', 'Luna', '🦊')", [
        fam.id,
      ]);
      const luna = (await t.sql("select id from public.members where kind = 'child'"))[0];
      await A.goto(t.BASE + "/profile", { waitUntil: "load" });
      await t.click(A, "Ny spelare");
      t.ok("Ny spelare → namnrutan för en ny lokal spelare", (await t.game(A)) && (await t.has(A, "Vad heter du?")));
      await t.type(A, "#nm", "Gäst");
      await t.click(A, "Nu kör vi");
      await t.wait(800);
      const s = await t.store(A);
      t.ok(
        "den nya spelaren heter Gäst och är lokal; Laura finns kvar",
        s.state.name === "Gäst" && s.current.startsWith("l:") && s.players.length === 2,
        s.players,
      );

      /* Luna på två enheter */
      const join = async label => {
        const P = await t.device(label);
        await P.goto(t.BASE + "/join?kod=" + fam.child_code, { waitUntil: "load" });
        await t.has(P, "Vem spelar?");
        await t.click(P, "Luna");
        await t.game(P);
        return P;
      };
      const I = await join("iPad"),
        M = await join("mobil");
      await I.evaluate(() => {
        window.SiiriStore.state.stars = 50;
        window.SiiriStore.save();
      });
      await t.wait(3000);
      await M.reload({ waitUntil: "load" });
      await t.game(M);
      t.ok("mobilen hämtar Lunas spel (⭐50)", await t.until(M, () => window.SiiriStore.state.stars === 50));
      await I.evaluate(() => {
        window.SiiriStore.state.stars += 10;
        window.SiiriStore.save();
      });
      await M.evaluate(() => {
        window.SiiriStore.state.stars += 5;
        window.SiiriStore.save();
      });
      let stars = null;
      for (let i = 0; i < 60 && stars !== 65; i++) {
        stars = Number((await t.sql("select data->>'stars' s from public.members where id = $1", [luna.id]))[0].s);
        await t.wait(250);
      }
      t.ok("samtidigt spel slås ihop: 50 + 10 + 5 = 65", stars === 65, stars);
    },
  ],
];
