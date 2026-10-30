(function () {
  "use strict";

  /* ============ INNEHÅLL ============ */
  var THEMES = window.SiiriData.THEMES;

  var CHATS = window.SiiriData.CHATS;

  var TRIP = window.SiiriData.TRIP;
  /* orter utan stopp – bara namn på kartan. Rakvere/Jõhvi/Paide/Võru/Valga är redan riktiga
       TRIP-stopp med egen nål och namn på nästan samma plats, så de är inte med här (krockande text) */
  var MAPTOWNS = [
    { et: "Rapla", x: 147.7, y: 86.8, end: true },
    { et: "Kärdla", x: 60.6, y: 96.1 },
    { et: "Elva", x: 229.5, y: 150.5, end: true, dy: -3 },
    { et: "Türi", x: 175.3, y: 102.5, end: true },
  ];
  /* varje ort har tre uppdrag och en souvenir */
  var TRIPTASKS = window.SiiriData.TRIPTASKS;
  var TASKTEXT = {
    words: { em: "🎧", sv: "Lär dig ortens tre ord" },
    theme: { em: "🏁", sv: "Klara ett tema" },
    mix: { em: "🎲", sv: "Klara en runda blandade ord" },
    type: { em: "✏️", sv: "Skriv ord rätt" },
    sent: { em: "🧩", sv: "Bygg meningar rätt" },
    talk: { em: "💬", sv: "Prata klart ett samtal med Siiri" },
    hear: { em: "👂", sv: "Svara rätt på lyssningsfrågor" },
    otsi: { em: "🔍", sv: "Hitta saker i Otsi!" },
    mem: { em: "🃏", sv: "Klara en runda memory" },
    duel: { em: "⚔️", sv: "Vinn en duell" },
  };
  var SOUVENIR = window.SiiriData.SOUVENIR; /* app/utils/trip.ts */
  var EPILOGUE = window.SiiriData.EPILOGUE; /* app/utils/trip.ts */
  var KITCHEN_RECIPES = window.SiiriData.KITCHEN_RECIPES; /* app/utils/kitchen.ts */

  function tripDone() {
    if (typeof S.tripDone !== "number") {
      S.tripDone = Math.max(0, Math.min(TRIP.length - 1, themesDone()));
      save();
    }
    return S.tripDone;
  }
  var STORY = window.SiiriData.STORY;
  var LORE = window.SiiriData.LORE;
  function tripReached() {
    return Math.max(1, Math.min(TRIP.length, tripDone() + 1));
  }
  function tripCur() {
    return TRIP[tripReached() - 1];
  }
  function tripProg() {
    if (!S.tripP) S.tripP = {};
    var id = tripCur().id;
    if (!S.tripP[id]) S.tripP[id] = { words: [], theme: 0, mix: 0, type: 0, sent: 0, talk: 0, hear: 0 };
    return S.tripP[id];
  }
  function taskValue(kind) {
    var p = tripProg();
    if (kind === "words") {
      /* ordet räknas när det både hörts och sitter i minnet */
      var w = tripCur().words || [],
        n = 0,
        i,
        mm;
      for (i = 0; i < w.length; i++) {
        mm = (S.wordmem || {})[mkey(w[i].et, w[i].sv)];
        if (p.words.indexOf(w[i].et) >= 0 && mm && ((mm.r || 0) >= 1 || (mm.s || 0) >= 1)) n++;
      }
      return n;
    }
    return p[kind] || 0;
  }
  function tasksOf() {
    return (
      TRIPTASKS[tripCur().id] || [
        ["words", 3],
        ["theme", 1],
        ["mix", 1],
      ]
    );
  }
  function tasksLeft() {
    var t = tasksOf(),
      n = 0,
      i;
    for (i = 0; i < t.length; i++) {
      if (taskValue(t[i][0]) < t[i][1]) n++;
    }
    return n;
  }
  /* något händer på vägen mellan två orter */
  /* ett överlägg (helskärms-dialog, se .overlay/.oc i style.css) - html blir .oc:ens
     innehåll. Kom ihåg att koppla på knappar (querySelector + onclick) på den returnerade
     noden efteråt, precis som förut; bara skapandet av själva rutan är gemensamt här. */
  function overlay(html) {
    var d = document.createElement("div");
    d.className = "overlay";
    d.innerHTML = html;
    document.body.appendChild(d);
    return d;
  }
  function roadStop() {
    var leg = tripReached() - 1,
      ev = roadEvent(leg),
      km = legKm(leg);
    var gain = ev.stars;
    earnStars(gain);
    addXp(12);
    save();
    refreshTop();
    var d = overlay(
      '<div class="oc roadcard"><p class="kicker">🥾 ' +
        km +
        " km på vägen till " +
        esc(TRIP[leg].et) +
        "</p>" +
        '<span class="rem">' +
        ev.em +
        "</span>" +
        "<h3>" +
        esc(ev.et) +
        "</h3><p>" +
        esc(ev.sv) +
        "</p>" +
        '<p class="qsub">⭐ +' +
        gain * starMult() +
        "</p>" +
        '<button class="btn big wide" id="rgo">Fortsätt 🗺️</button></div>',
    );
    speak(ev.et);
    d.querySelector("#rgo").onclick = function () {
      d.remove();
      go(tripScreen, true);
    };
  }

  /* räkna upp ett uppdrag för den ort Siiri står på */
  function tripBump(kind, amount, word) {
    if (tripDone() >= TRIP.length) return;
    var p = tripProg();
    if (kind === "words") {
      if (word && p.words.indexOf(word) < 0) p.words.push(word);
    } else {
      p[kind] = (p[kind] || 0) + (amount || 1);
    }
    save();
    if (tasksLeft() === 0) tripAdvance();
  }
  function tripAdvance() {
    autoBackup("ny ort");
    var from = tripCur(),
      gift = SOUVENIR[from.id],
      it = itemById(gift),
      gifted = it && !owns(it.id); /* har barnet redan köpt den i butiken själv? då ges inget nytt */
    S.walkFrom = tripReached() - 1; /* varifrån hon vandrar */
    S.tripDone = Math.min(TRIP.length, tripDone() + 1);
    save();
    if (gifted) {
      if (!S.owned) S.owned = [];
      if (!S.wear) S.wear = {};
      S.owned.push(it.id);
      S.wear[it.slot] = it.id;
      save();
      applyScene();
    }
    var nx = TRIP[tripReached() - 1],
      last = tripDone() >= TRIP.length;
    fanfare(3);
    burst(200);
    setTimeout(function () {
      burst(160);
    }, 420);
    setTimeout(function () {
      var d = overlay(
        '<div class="oc" style="border-color:var(--berry)"><p class="kicker">🎒 Alla uppdrag klara i ' +
          esc(from.et) +
          "!</p>" +
          (gifted
            ? '<div style="font-size:64px">' +
              it.em +
              "</div><h3>" +
              esc(it.et) +
              "</h3>" +
              "<p>" +
              esc(it.sv) +
              " — souvenir från " +
              esc(from.et) +
              ", gratis till marknaden</p>"
            : it
              ? '<div style="font-size:64px">' +
                it.em +
                "</div><h3>" +
                esc(it.et) +
                "</h3>" +
                "<p>" +
                esc(it.sv) +
                " — du har redan den här souveniren från " +
                esc(from.et) +
                "</p>"
              : "") +
          (last
            ? '<p class="qsub" style="margin-top:8px">Du har rest genom hela Estland!</p>'
            : '<p class="qsub" style="margin-top:8px">Siiri vandrar vidare till <b>' + esc(nx.et) + "</b>.</p>") +
          '<button class="btn big wide" id="tadv">' +
          (last ? "Till kartan 🗺️" : "Vandra vidare 🥾") +
          "</button></div>",
      );
      if (it) speak(it.et);
      d.querySelector("#tadv").onclick = function () {
        d.remove();
        if (last) go(tripScreen, true);
        else roadStop();
      };
    }, 600);
  }

  /* räkna upp ett uppdrag för den ort Siiri står på */
  function tripWords() {
    var out = [],
      i,
      j,
      n = tripReached();
    for (i = 0; i < n; i++) for (j = 0; j < TRIP[i].words.length; j++) out.push(TRIP[i].words[j]);
    return out;
  }

  var UI = {
    play: { et: "Mängime!", sv: "Nu spelar vi" },
    mix: { et: "Kõik sõnad", sv: "Blandade ord" },
    sent: { et: "Lauseladu", sv: "Bygg meningar" },
    talk: { et: "Jutt Siiriga", sv: "Prata med Siiri" },
    themes: { et: "Teemad", sv: "Teman" },
    shop: { et: "Laat", sv: "Marknaden" },
    words: { et: "Sõnastik", sv: "Ordlistan" },
    treasure: { et: "Aarded", sv: "Skattkammaren" },
    me: { et: "Minu profiil", sv: "Min profil" },
    trip: { et: "Teekond", sv: "Resan genom Estland" },
    bag: { et: "Üllatuskott", sv: "Överraskningspåsen" },
    next: { et: "Järgmine teema", sv: "Nästa tema" },
    hard: { et: "Harjuta raskeid sõnu", sv: "Öva svåra ord" },
    again: { et: "Veel kord", sv: "En gång till" },
  };

  var SENTENCES = window.SiiriData.SENTENCES;
  var PET_SENTENCE_TEMPLATES = window.SiiriData.PET_SENTENCE_TEMPLATES;

  var SHOP = window.SiiriData.SHOP;
  var FURN = window.SiiriData.FURN; /* app/utils/shop.ts - rummets möbler/inredning */
  var SLOTS = window.SiiriData.WEAR_SLOTS; /* app/utils/shop.ts */
  function seasonId() {
    var m = new Date().getMonth() + 1;
    if (m === 12 || m <= 2) return "vinter";
    if (m <= 5) return "kevad";
    if (m <= 8) return "suvi";
    return "sygis";
  }
  /* säsongs- och högtidsvaror syns bara när de är aktuella – ägda plagg kan alltid bäras */
  function hardWins() {
    return S.hardWins || 0;
  }
  function itemAvailable(it) {
    if (owns(it.id)) return true;
    if (it.hard && hardWins() < 1) return false;
    var m = new Date().getMonth() + 1;
    if (it.months) return it.months.indexOf(m) >= 0;
    if (it.seasons) return it.seasons.indexOf(seasonId()) >= 0;
    return true;
  }
  function isLimited(it) {
    return !!(it.months || it.seasons || it.hard);
  }
  function owns(id) {
    return (S.owned || []).indexOf(id) >= 0;
  }
  function wearing(slot) {
    return (S.wear || {})[slot] || null;
  }
  function itemById(id) {
    for (var i = 0; i < SHOP.length; i++) {
      if (SHOP[i].id === id) return SHOP[i];
    }
    return null;
  }

  var DIFFS = window.SiiriData.DIFFS;
  function diff() {
    var i;
    for (i = 0; i < DIFFS.length; i++) {
      if (DIFFS[i].id === (S.diff || "lagom")) return DIFFS[i];
    }
    return DIFFS[1];
  }

  /* nivåmärkena (app/utils/ranks.ts) - samma lista som Vue-sidorna, via window.SiiriData */
  var RANKS = window.SiiriData.RANKS;
  function rankIndex(xp) {
    var i,
      r = 0;
    for (i = 0; i < RANKS.length; i++) {
      if (xp >= RANKS[i].xp) r = i;
    }
    return r;
  }
  function medalSVG(r, idx, locked, style) {
    var g = "g" + idx,
      st = style || "lagom",
      i,
      s = "";
    var deco = "",
      frame = "",
      ribbon = "";
    if (st === "latt") {
      ribbon =
        '<path d="M40 8 L56 8 L50 56 L32 50 Z" fill="#7FB08C"/><path d="M80 8 L64 8 L70 56 L88 50 Z" fill="#5C8F6C"/>';
      frame = '<circle cx="60" cy="88" r="44" fill="' + r.ring + '" opacity=".85"/>';
      deco =
        '<g opacity=".9">' +
        '<path d="M22 96 Q16 84 24 76 Q32 84 27 96 Z" fill="#4E9A68"/>' +
        '<path d="M98 96 Q104 84 96 76 Q88 84 93 96 Z" fill="#4E9A68"/></g>';
    } else if (st === "svar") {
      ribbon =
        '<path d="M34 4 L54 4 L46 58 L24 50 Z" fill="#7B3BE0"/><path d="M86 4 L66 4 L74 58 L96 50 Z" fill="#4C1FA8"/>';
      s = '<g opacity=".95">';
      for (i = 0; i < 12; i++) {
        s +=
          '<path d="M60 88 L64 34 L56 34 Z" fill="' +
          (i % 2 ? r.c2 : r.c1) +
          '" transform="rotate(' +
          i * 30 +
          ' 60 88)" opacity=".8"/>';
      }
      s += "</g>";
      frame = s + '<circle cx="60" cy="88" r="43" fill="' + r.ring + '"/>';
      deco =
        '<circle cx="60" cy="88" r="36" fill="none" stroke="#FFF3B0" stroke-width="2"/>' +
        '<path d="M60 46 l4 8 8 1 -6 6 2 8 -8 -4 -8 4 2 -8 -6 -6 8 -1 Z" fill="#FFF3B0"/>';
    } else {
      ribbon =
        '<path d="M34 6 L54 6 L46 58 L26 52 Z" fill="#C8305A"/><path d="M86 6 L66 6 L74 58 L94 52 Z" fill="#9E1F42"/>';
      frame = '<circle cx="60" cy="88" r="46" fill="' + r.ring + '"/>';
      deco =
        '<circle cx="60" cy="88" r="33" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2.5" stroke-dasharray="5 7"/>';
    }
    return (
      '<svg class="medal" viewBox="0 0 120 150" role="img" aria-label="' +
      esc(r.sv) +
      '">' +
      '<defs><radialGradient id="' +
      g +
      '" cx="35%" cy="28%" r="85%">' +
      '<stop offset="0%" stop-color="#FFFFFF" stop-opacity=".75"/>' +
      '<stop offset="22%" stop-color="' +
      r.c1 +
      '"/><stop offset="62%" stop-color="' +
      r.c2 +
      '"/>' +
      '<stop offset="100%" stop-color="' +
      r.ring +
      '"/></radialGradient>' +
      '<clipPath id="c' +
      g +
      '"><circle cx="60" cy="88" r="40"/></clipPath></defs>' +
      ribbon +
      frame +
      '<circle cx="60" cy="88" r="40" fill="url(#' +
      g +
      ')"/>' +
      '<ellipse cx="48" cy="72" rx="17" ry="11" fill="#fff" opacity=".28"/>' +
      deco +
      (locked
        ? '<text x="60" y="100" font-size="34" text-anchor="middle">🔒</text>'
        : '<text x="60" y="101" font-size="38" text-anchor="middle">' +
          r.em +
          "</text>" +
          '<g clip-path="url(#c' +
          g +
          ')"><rect class="shine" x="-40" y="42" width="26" height="92" fill="rgba(255,255,255,.55)" transform="rotate(18 60 88)"/></g>') +
      "</svg>"
    );
  }
  function medalStyleOf(rankId) {
    return (S.mstyle && S.mstyle[rankId]) || "lagom";
  }
  /* belöningar som tjänas under en runda visas samlat på resultatskärmen */
  var pend = [];
  function pendAdd(em, title, sub) {
    pend.push({ em: em, title: title, sub: sub });
  }
  function pendHtml() {
    if (!pend.length) return "";
    var s = '<div class="card gains"><p class="q" style="text-align:left">Du fick</p>',
      i;
    for (i = 0; i < pend.length; i++) {
      s +=
        '<div class="gain"><span class="gem">' +
        pend[i].em +
        "</span>" +
        "<span><b>" +
        pend[i].title +
        "</b><small>" +
        pend[i].sub +
        "</small></span></div>";
    }
    pend = [];
    return s + "</div>";
  }
  function inRound() {
    try {
      return (
        !!(typeof L !== "undefined" && L && L.rounds && L.rounds.length) ||
        !!(typeof SP !== "undefined" && SP) ||
        !!(typeof LS !== "undefined" && LS) ||
        !!(typeof DU !== "undefined" && DU) ||
        !!(typeof MM !== "undefined" && MM) ||
        !!(typeof RN !== "undefined" && RN) ||
        !!(typeof BT !== "undefined" && BT)
      );
    } catch (e) {
      return false;
    }
  }
  function rankUp(oldI, newI) {
    autoBackup("nytt märke");
    setTimeout(function () {
      dance(true);
    }, 600);
    if (inRound()) {
      var rr = RANKS[newI];
      pendAdd(rr.em, "Nytt märke: " + esc(rr.et), esc(rr.sv) + " · " + rr.xp.toLocaleString("sv-SE") + " poäng");
      sndLvl();
      return;
    }
    var r = RANKS[newI];
    if (!S.mstyle) S.mstyle = {};
    S.mstyle[r.id] = diff().id;
    save();
    var d = overlay(
      '<div class="oc"><p class="kicker">Nytt märke upplåst!</p>' +
        medalSVG(r, "ov", false, diff().id) +
        "<h3>" +
        esc(r.et) +
        "</h3><p>" +
        esc(r.sv) +
        " · " +
        diff().em +
        " " +
        diff().sv +
        "</p>" +
        '<p style="margin-top:8px">' +
        (S.name ? esc(S.name) + " har" : "Du har") +
        " klättrat till märke " +
        (newI + 1) +
        " av " +
        RANKS.length +
        ".</p>" +
        '<button class="btn big wide" id="ocdone">Toppen! 🎉</button></div>',
    );
    sndLvl();
    burst(190);
    setTimeout(function () {
      burst(120);
    }, 450);
    d.querySelector("#ocdone").onclick = function () {
      d.remove();
    };
  }

  var LEADS = {
    tere: { et: "Tere,", sv: "Hej," },
    tubli: { et: "Tubli,", sv: "Duktigt," },
    vaga: { et: "Väga hea,", sv: "Jättebra," },
    aitah: { et: "Aitäh,", sv: "Tack," },
    aega: { et: "Head aega,", sv: "Hej då," },
    tore: { et: "Tore, et sa mängid,", sv: "Vad kul att du spelar," },
  };

  /* hemligheternas repliker (app/utils/secrets.ts), via window.SiiriData */
  var EGGS = window.SiiriData.EGGS;
  var EGGS2 = window.SiiriData.EGGS2;
  /* beröm som trappas upp – Siiri säger dem högt */
  /* ---------- DUELLER: motståndare, repliker och regler ---------- */
  /* app/utils/rivals.ts - en enda källa, delad med Skattkammarens Duellhylla (Vue). */
  var RIVALS = window.SiiriData.RIVALS;
  /* rivaler med en illustrerad bild (r.img, en handritad figur i samma stil som Siiri -
     se public/images/rivals/) visas med den istället för bara en emoji. px matchar den
     emoji-storlek (font-size) platsen redan hade - men en detaljerad illustration syns
     sämre än en enkel, grafisk emoji vid samma storlek, så den skalas upp en bit extra.
     Ikonen går alltid att klicka eller trycka Enter/mellanslag på (data-char, se
     openCharCard() nedan) för att se figuren i helformat med en faktaruta - nyfikna barn
     ska alltid kunna trycka på en figur, var den än dyker upp. */
  function rivalIcon(r, px) {
    var size = r.img ? Math.round(px * 1.5) : px,
      /* höjd, inte en fyrkantig width=height-ruta - källbilderna är olika breda (en svans
         eller ett föremål som sträcker ut åt sidan gör kanvasen bredare utan att själva
         figuren är större), och en fyrkantig ruta med object-fit:contain hade då krympt just
         de bredare figurerna i höjd för att få plats. Samma fix som .charcard-img. */
      inner = r.img
        ? '<img src="' + r.img + '" alt="" style="height:' + size + 'px;width:auto;vertical-align:middle">'
        : '<span style="font-size:' + size + 'px;line-height:1">' + r.em + "</span>";
    /* en bredare bild (se ovan) ska ändå CENTRERAS i samma breda/smala utrymme som en smalare
       skulle fått - annars hamnar titeln bredvid på olika x-position per rival i en lista.
       display:inline-flex + en bredd (samma som höjden) gör själva ikon-platsen fyrkantig
       och centrerad, medan bilden inuti fritt får svämma över åt båda hållen om den är bredare. */
    return (
      '<span class="charpeek" data-char="rival:' +
      r.id +
      '" role="button" tabindex="0" aria-label="Visa ' +
      esc(r.et) +
      '" style="display:inline-flex;justify-content:center;align-items:center;width:' +
      size +
      'px">' +
      inner +
      "</span>"
    );
  }
  /* en figur (Duell-rival eller folktrofigur som Kalevipoeg) som går att klicka/trycka Enter
     på var den än visas, för ett förstorat kort med namn och fakta. key är "rival:<id>"
     (RIVALS) eller "lore:<id>" (LORE, app/utils/trip.ts). */
  function charLookup(key) {
    var parts = key.split(":"),
      kind = parts[0],
      id = parts[1],
      i;
    if (kind === "rival") {
      for (i = 0; i < RIVALS.length; i++) {
        if (RIVALS[i].id === id) {
          return {
            img: RIVALS[i].img,
            em: RIVALS[i].em,
            name: RIVALS[i].et,
            sub: RIVALS[i].sv,
            fact: RIVALS[i].story || RIVALS[i].desc,
            factEt: RIVALS[i].storyEt,
          };
        }
      }
    }
    if (kind === "lore" && LORE[id]) {
      return {
        img: LORE[id].img,
        em: "📖",
        name: LORE[id].et,
        sub: LORE[id].sv,
        fact: LORE[id].fact,
        factEt: LORE[id].factEt,
      };
    }
    if (kind === "avatar" && AVATAR_INFO[id]) {
      return {
        img: AVATAR_INFO[id].img,
        em: id,
        name: AVATAR_INFO[id].et,
        sub: AVATAR_INFO[id].sv,
        fact: AVATAR_INFO[id].story,
        factEt: AVATAR_INFO[id].storyEt,
      };
    }
    return null;
  }
  /* historietexten börjar på estniska när den finns (factEt) - knappen växlar till svenska
     (fact) för den som inte hänger med än. Vanapagan (och andra utan factEt) visar bara fact,
     ingen knapp behövs då. */
  function openCharCard(key) {
    var c = charLookup(key);
    if (!c) return;
    var showEt = !!c.factEt;
    var d = overlay(
      '<div class="oc charcard">' +
        (c.img
          ? '<img src="' + c.img + '" alt="" class="charcard-img">'
          : '<div style="font-size:84px">' + c.em + "</div>") +
        "<h3>" +
        esc(c.name) +
        "</h3>" +
        (c.sub && c.sub !== c.name ? '<p class="kicker" style="margin-top:-4px">' + esc(c.sub) + "</p>" : "") +
        '<p id="charcardfact">' +
        esc(showEt ? c.factEt : c.fact) +
        "</p>" +
        (c.factEt
          ? '<button class="btn ghost sm" id="charcardlang" style="margin-bottom:8px">🇸🇪 På svenska</button>'
          : "") +
        '<button class="btn ghost wide" id="charcardclose">Stäng</button></div>',
    );
    if (c.factEt) {
      d.querySelector("#charcardlang").onclick = function () {
        showEt = !showEt;
        d.querySelector("#charcardfact").textContent = showEt ? c.factEt : c.fact;
        d.querySelector("#charcardlang").textContent = showEt ? "🇸🇪 På svenska" : "🇪🇪 Eesti keeles";
      };
    }
    d.querySelector("#charcardclose").onclick = function () {
      d.remove();
    };
  }
  /* fångas i fångstfasen (sista argumentet true), innan klicket hinner bubbla upp till t.ex.
     rivalkortets egen knapp - annars skulle ett tryck på figuren både öppna kortet och
     starta duellen samtidigt. */
  document.addEventListener(
    "click",
    function (e) {
      var t = e.target.closest && e.target.closest("[data-char]");
      if (!t) return;
      e.stopPropagation();
      e.preventDefault();
      openCharCard(t.getAttribute("data-char"));
    },
    true,
  );
  document.addEventListener(
    "keydown",
    function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var t = e.target.closest && e.target.closest("[data-char]");
      if (!t) return;
      e.stopPropagation();
      e.preventDefault();
      openCharCard(t.getAttribute("data-char"));
    },
    true,
  );
  var TAUNT = window.SiiriData.TAUNT;
  var COACH = [
    { et: "Sa saad hakkama!", sv: "Du klarar det!" },
    { et: "Ole julge!", sv: "Var modig!" },
    { et: "Ma usun sinusse!", sv: "Jag tror på dig!" },
  ];
  function taunt(kind) {
    var a = TAUNT[kind] || TAUNT.hit;
    return a[(Math.random() * a.length) | 0];
  }

  var PRAISE = window.SiiriData.PRAISE;
  var lastPraise = "";
  function praise(combo, ok) {
    var pool = !ok ? PRAISE.no : combo >= 10 ? PRAISE.t4 : combo >= 5 ? PRAISE.t3 : combo >= 3 ? PRAISE.t2 : PRAISE.t1;
    var p = pool[(Math.random() * pool.length) | 0],
      guard = 0;
    while (p.et === lastPraise && pool.length > 1 && guard++ < 6) p = pool[(Math.random() * pool.length) | 0];
    lastPraise = p.et;
    return p;
  }
  function praiseSay(combo, ok, el) {
    var p = praise(combo, ok);
    if (el) {
      el.className = "feedback " + (ok ? "ok" : "no");
      el.innerHTML =
        esc(p.et) + ' <span style="font-weight:500;color:var(--muted);font-size:var(--fs-sm)">' + esc(p.sv) + "</span>";
    }
    if (ok && (combo >= 3 || Math.random() < 0.45)) queuePraise(p.et);
    else if (!ok && Math.random() < 0.5) queuePraise(p.et);
    return p;
  }
  /* berömmet sägs efter det rätta ordet när svaret visas (showAnswer), annars ensamt –
       så att Siiri aldrig pratar i mun på sig själv ("Usku-lehm") */
  var pendingPraise = null;
  function queuePraise(et) {
    pendingPraise = et;
    setTimeout(function () {
      if (pendingPraise === et) {
        pendingPraise = null;
        speak(et);
      }
    }, 150);
  }

  /* hemligheterna (app/utils/secrets.ts) - samma lista som Vue-sidorna, via window.SiiriData */
  var SECRETS = window.SiiriData.SECRETS;
  function foundSecret(id) {
    if (!S.secrets) S.secrets = [];
    if (S.secrets.indexOf(id) >= 0) return false;
    S.secrets.push(id);
    save();
    return true;
  }

  /* bragdmärkena (app/utils/badges.ts) - samma lista som Vue-sidorna, via window.SiiriData */
  var BADGES = window.SiiriData.BADGES;

  /* ============ ÅRSTIDER OCH HÖGTIDER ============ */
  /* årstiderna och högtiderna (app/utils/seasons.ts), via window.SiiriData */
  var SEASONS = window.SiiriData.SEASONS;
  var HOLIDAYS = window.SiiriData.HOLIDAYS;
  function seasonNow() {
    var m = new Date().getMonth() + 1;
    if (m === 12 || m <= 2) return SEASONS.vinter;
    if (m <= 5) return SEASONS.kevad;
    if (m <= 8) return SEASONS.suvi;
    return SEASONS.sygis;
  }
  /* hälsningen på hemskärmen (homeScreen()) följer klockan, inte bara "Tere" hela dygnet.
     Samma gränser som nightOwl() (21-04) för "Head ööd", så sen kväll hänger ihop med den. */
  function greetingNow() {
    var hh = new Date().getHours();
    if (hh >= 5 && hh < 11) return { et: "Tere hommikust" };
    if (hh >= 11 && hh < 17) return { et: "Tere päevast" };
    if (hh >= 17 && hh < 21) return { et: "Tere õhtust" };
    return { et: "Head ööd" };
  }
  function holidayNow() {
    var t = new Date(),
      m = t.getMonth() + 1,
      d = t.getDate(),
      i;
    for (i = 0; i < HOLIDAYS.length; i++) {
      if (HOLIDAYS[i].m === m && HOLIDAYS[i].d === d) return HOLIDAYS[i];
    }
    return null;
  }
  function seasonFx() {
    var f = seasonNow().fx;
    if (f === "snow") snow(70);
    else if (f === "petals") petals(45, ["#FFC7DC", "#FFE0EC", "#F7A8C4"]);
    else if (f === "leaves") petals(45, ["#E0A14A", "#C8762F", "#D9B84C"]);
  }
  function holidayCard() {
    var hol = holidayNow();
    if (!hol) return;
    if (S.holseen === today()) return;
    S.holseen = today();
    save();
    setTimeout(function () {
      var d = overlay(
        '<div class="oc"><p class="kicker">Idag är det något särskilt!</p>' +
          '<div style="font-size:64px">' +
          hol.em +
          "</div><h3>" +
          esc(hol.et) +
          "</h3><p>" +
          esc(hol.tr) +
          "</p>" +
          '<p class="qsub" style="margin-top:4px">' +
          esc(hol.sv) +
          "</p>" +
          '<button class="btn big wide" id="holok">Aitäh!</button></div>',
      );
      burst(180);
      speak(hol.et);
      d.querySelector("#holok").onclick = function () {
        d.remove();
      };
    }, 700);
  }

  /* ============ DAGENS UTMANING ============ */
  /* app/utils/quests.ts - en enda källa, delad med Skattkammaren (Vue). */
  var QUESTS = window.SiiriData.QUESTS;
  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function questOfDay() {
    if (S.questPick && S.questPick.day === today()) {
      var i;
      for (i = 0; i < QUESTS.length; i++) if (QUESTS[i].id === S.questPick.id) return QUESTS[i];
    }
    var d = new Date();
    return QUESTS[d.getDay() % QUESTS.length];
  }
  /* barnet får välja sitt eget mål för dagen istället för att bara få ett tilldelat - S.dayp
     räknar redan alla nyckeltal samtidigt (se newDay()), så ett byte tappar ingen framgång. */
  function questPickScreen() {
    screen = "questpick";
    var current = questOfDay(),
      pool = QUESTS.filter(function (q) {
        return q.id !== current.id;
      }),
      choices = [],
      i;
    while (choices.length < 3 && pool.length) {
      choices.push(pool.splice((Math.random() * pool.length) | 0, 1)[0]);
    }
    var html =
      '<div class="card"><p class="q">Vilket mål vill du sätta idag?</p>' +
      '<p class="qsub">Du väljer själv — din gamla framgång finns kvar om du ångrar dig.</p>' +
      '<div class="topics">' +
      '<button class="tile" data-qid="' +
      current.id +
      '" style="min-height:96px"><span class="em">' +
      current.em +
      '</span><span class="et">Behåll det här</span><span class="sv">' +
      esc(current.sv) +
      "</span></button>";
    for (i = 0; i < choices.length; i++) {
      html +=
        '<button class="tile" data-qid="' +
        choices[i].id +
        '" style="min-height:96px"><span class="em">' +
        choices[i].em +
        '</span><span class="et">Välj det här</span><span class="sv">' +
        esc(choices[i].sv) +
        "</span></button>";
    }
    html += "</div></div>";
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-qid]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          S.questPick = { day: today(), id: el.getAttribute("data-qid") };
          save();
          tone(760, 0.09, 0);
          go(homeScreen, false);
        };
      })(bs[k]);
    }
  }
  /* ============ STATE ============ */
  /* Datan (S), sparningen, profilerna och reservkopiorna ligger i Nuxt-appen
       (app/stores/profile.ts), så att den här koden och Vue delar samma data. S är samma
       reaktiva objekt som lagret håller – fält ändras direkt som förut, och save() sparar. */
  var STORE = window.SiiriStore;
  var S = STORE.state;
  function save() {
    STORE.save();
  }
  /* ---------- automatisk reservkopia ---------- */
  function autoBackup(why) {
    STORE.autoBackup(why);
  }
  function backupInfo() {
    return STORE.backupInfo();
  }
  function backupAge(p) {
    return STORE.backupAge(p);
  }
  function restoreBackup() {
    return STORE.restoreBackup();
  }
  function backupLooksBetter() {
    return STORE.backupLooksBetter();
  }
  /* familjekontot (Nuxt-appen, app/stores/cloud.ts) – finns bara om konton är påslagna */
  function cloudOn() {
    return !!(window.SiiriCloud && window.SiiriCloud.enabled);
  }
  function cloudInfo() {
    return cloudOn()
      ? window.SiiriCloud.info()
      : {
          linked: false,
          name: "",
          kind: "",
          status: "",
          needsLogin: false,
          adult: false,
          locked: false,
          familyDevice: false,
          family: "",
          signedIn: false,
        };
  }
  /* barn spelar här (barnspelare, eller enheten är låst av en vuxen): föräldradelar, admin och
     glosinklistring visas inte – glosorna kommer från de vuxna i familjen */
  function childDevice() {
    var c = cloudInfo();
    return c.kind === "child" || c.locked;
  }
  function newDay() {
    var t = today();
    if (S.day !== t) {
      /* S.flames räknar dagar då dagens utmaning klarats – den nollställs aldrig,
         så en missad dag tar inte bort något barnet redan klarat (ingen svit, ingen press).
         S.daysPlayed är samma princip för vänskapen: hur många olika dagar man spelat totalt,
         aldrig en svit som kan brytas. */
      S.day = t;
      S.dayp = { correct: 0, spoken: 0, typed: 0, themes: 0, talks: 0, mixed: 0, claimed: 0 };
      S.daysPlayed = (S.daysPlayed || 0) + 1;
      save();
      checkFriendMilestone();
    }
    if (!S.dayp) S.dayp = { correct: 0, spoken: 0, typed: 0, themes: 0, talks: 0, mixed: 0, claimed: 0 };
  }
  /* en växande vänskap istället för ännu en mätare - firar hur många OLIKA dagar barnet och
     Siiri spelat ihop (S.daysPlayed, se newDay()), inte en svit som kan gå förlorad. */
  var FRIEND_MILESTONES = [3, 7, 15, 30, 60, 100, 200, 365];
  function checkFriendMilestone() {
    if (FRIEND_MILESTONES.indexOf(S.daysPlayed) < 0) return;
    if ((S.friendSeen || []).indexOf(S.daysPlayed) >= 0) return;
    S.friendSeen = (S.friendSeen || []).concat(S.daysPlayed);
    save();
    setTimeout(function () {
      var line = {
        et: "Me oleme juba " + S.daysPlayed + " päeva koos mänginud!",
        sv: "Vi har spelat tillsammans i " + S.daysPlayed + " dagar!",
      };
      var d = overlay(
        '<div class="oc" style="border-color:#E0912A"><p class="kicker">🦔💛 Sõbrad!</p>' +
          '<div style="font-size:64px">🤝</div>' +
          '<h3 style="font-size:22px">' +
          esc(line.et) +
          "</h3><p>" +
          esc(line.sv) +
          (S.name ? " Tubli, " + esc(S.name) + "!" : "") +
          "</p>" +
          '<button class="btn big wide" id="friendok">Tubli!</button></div>',
      );
      burst(120);
      fanfare(2);
      speak(line.et);
      d.querySelector("#friendok").onclick = function () {
        d.remove();
      };
    }, 1800);
  }
  /* "första gången"-ögonblick förtjänar egen fanfar, skilt från den vanliga belöningen för
     samma handling varje gång därefter - annars syns aldrig att just DEN här gången var unik. */
  function firstEver(key) {
    if (!S.firsts) S.firsts = [];
    if (S.firsts.indexOf(key) >= 0) return false;
    S.firsts.push(key);
    save();
    return true;
  }
  function celebrateFirst(em, et, sv) {
    setTimeout(function () {
      var d = overlay(
        '<div class="oc" style="border-color:#D9A52B"><p class="kicker">✨ Esimene kord!</p>' +
          '<div style="font-size:64px">' +
          em +
          "</div>" +
          '<h3 style="font-size:22px">' +
          esc(et) +
          "</h3><p>" +
          esc(sv) +
          "</p>" +
          '<button class="btn big wide" id="firstok">Tubli!</button></div>',
      );
      burst(160);
      fanfare(3);
      speak(et);
      d.querySelector("#firstok").onclick = function () {
        d.remove();
      };
    }, 900);
  }
  function questProgress() {
    var q = questOfDay(),
      v = S.dayp[q.key] || 0;
    return { q: q, v: Math.min(v, q.goal), done: v >= q.goal, claimed: !!S.dayp.claimed };
  }
  function bumpQuest(key, amount, isMax) {
    newDay();
    if (isMax) {
      if ((S.dayp[key] || 0) < amount) S.dayp[key] = amount;
    } else S.dayp[key] = (S.dayp[key] || 0) + (amount || 1);
    var p = questProgress();
    if (p.done && !p.claimed) {
      S.dayp.claimed = 1;
      S.flames = (S.flames || 0) + 1;
      save();
      addXp(60);
      setTimeout(function () {
        var d = overlay(
          '<div class="oc"><p class="kicker">Dagens utmaning klar!</p>' +
            '<div style="font-size:64px">' +
            p.q.em +
            "</div><h3>" +
            esc(p.q.sv) +
            "</h3>" +
            "<p>+60 poäng · " +
            S.flames +
            (S.flames === 1 ? " dagsutmaning" : " dagsutmaningar") +
            " klarade 🌟</p>" +
            '<button class="btn big wide" id="qdone">Nice!</button></div>',
        );
        burst(160);
        sndLvl();
        d.querySelector("#qdone").onclick = function () {
          d.remove();
        };
      }, 900);
    }
    save();
  }

  var app = document.getElementById("app");
  /* bilden läggs in en enda gång och återanvänds av alla figurer (samma fil som Vue-figuren) */
  (function () {
    try {
      var defs = document.querySelector("#siiridefs defs");
      if (defs)
        defs.innerHTML =
          '<image id="siiriPic" href="/images/siiri/siiri-body.webp" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMid meet"/>';
    } catch (e) {}
  })();
  var elStars = document.getElementById("stars");
  var btnBack = document.getElementById("back");
  var btnSound = document.getElementById("sound");
  var btnTheme = document.getElementById("theme");
  var btnBug = document.getElementById("bugreport");
  /* räknare som tickar upp i stället för att hoppa */
  function tickNumber(el, from, to, dur) {
    if (!el) return;
    if (typeof requestAnimationFrame !== "function" || Math.abs(to - from) > 4000 || from === to) {
      el.textContent = to.toLocaleString("sv-SE");
      return;
    }
    var t0 = performance.now();
    dur = dur || 520;
    function step(now) {
      var k = Math.min(1, (now - t0) / dur),
        v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      el.textContent = v.toLocaleString("sv-SE");
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* toppraden: figur, namn, märke, stjärnor och mätaren mot nästa märke */
  function refreshTop() {
    var ri = rankIndex(S.xp),
      r = RANKS[ri],
      nxt = RANKS[ri + 1],
      e;
    e = document.getElementById("meav");
    if (e) e.innerHTML = avatarIcon(S.avatar || "🦔", 19);
    e = document.getElementById("mename");
    if (e) e.textContent = S.name || "Profil";
    e = document.getElementById("rankmini");
    if (e) e.innerHTML = medalSVG(r, "mini", false, medalStyleOf(r.id));
    if (elStars) tickNumber(elStars, parseInt((elStars.textContent || "0").replace(/\s/g, ""), 10) || 0, S.stars, 520);
    e = document.getElementById("lvltext");
    if (e) e.textContent = nxt ? "Nästa märke: " + nxt.et + " · " + nxt.sv : "Högsta märket! " + r.et;
    e = document.getElementById("xptext");
    if (e)
      e.textContent = nxt
        ? (S.xp - r.xp).toLocaleString("sv-SE") + " / " + (nxt.xp - r.xp).toLocaleString("sv-SE")
        : S.xp.toLocaleString("sv-SE");
    e = document.getElementById("bandfill");
    if (e)
      e.style.width =
        (nxt ? Math.max(0, Math.min(100, Math.round(((S.xp - r.xp) / (nxt.xp - r.xp)) * 100))) : 100) + "%";
    e = document.getElementById("sound");
    if (e) e.textContent = S.sound ? "🔊" : "🔇";
    var nav = document.getElementById("nav");
    if (nav) nav.hidden = !S.setupdone;
    /* ljud/mörkt-läge/bugg hör ihop med resten av kromet - samma villkor som nav ovan, annars
       förblir de osynliga hela spelet igenom (deras hidden-attribut i LegacyApp.vue:s statiska
       markup togs annars aldrig bort) */
    if (btnSound) btnSound.hidden = btnTheme.hidden = btnBug.hidden = !S.setupdone;
  }

  var blobCache = {},
    blobCount = 0;
  function toBlob(src) {
    if (!src || src.indexOf("data:") !== 0) return src;
    if (blobCache[src]) return blobCache[src];
    if (blobCount > 320) return src;
    try {
      var parts = src.split(","),
        bin = atob(parts[1]),
        n = bin.length,
        arr = new Uint8Array(n),
        i;
      for (i = 0; i < n; i++) arr[i] = bin.charCodeAt(i);
      var url = URL.createObjectURL(new Blob([arr], { type: "audio/mpeg" }));
      blobCache[src] = url;
      blobCount++;
      return url;
    } catch (e) {
      return src;
    }
  }
  var AC = null;
  function tone(freq, dur, when, type) {
    if (!S.sound) return;
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      var o = AC.createOscillator(),
        g = AC.createGain();
      o.type = type || "sine";
      o.frequency.value = freq;
      o.connect(g);
      g.connect(AC.destination);
      var t = AC.currentTime + (when || 0);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t);
      o.stop(t + dur + 0.03);
    } catch (e) {}
  }
  function buzz(p) {
    try {
      if (S.sound && navigator.vibrate) navigator.vibrate(p);
    } catch (e) {}
  }
  function stampOn(el, sym) {
    if (!el) return;
    try {
      var s = document.createElement("span");
      s.className = "stamp";
      s.textContent = sym;
      el.appendChild(s);
      setTimeout(function () {
        if (s.parentNode) s.parentNode.removeChild(s);
      }, 1400);
    } catch (e) {}
  }
  function sndOk() {
    tone(660, 0.14, 0);
    tone(880, 0.16, 0.11);
    tone(1180, 0.22, 0.22);
  }
  /* applåder: korta brusstötar genom ett högpassfilter, utspridda som en folkmassa som klappar */
  function applause(n, dur) {
    if (!S.sound) return;
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      var claps = n || 16,
        i;
      for (i = 0; i < claps; i++) {
        (function (delay) {
          var len = 0.05,
            buf = AC.createBuffer(1, Math.ceil(AC.sampleRate * len), AC.sampleRate);
          var data = buf.getChannelData(0),
            j;
          for (j = 0; j < data.length; j++) data[j] = (Math.random() * 2 - 1) * (1 - j / data.length);
          var src = AC.createBufferSource();
          src.buffer = buf;
          var f = AC.createBiquadFilter();
          f.type = "highpass";
          f.frequency.value = 1200;
          var g = AC.createGain(),
            t = AC.currentTime + delay;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.4, t + 0.004);
          g.gain.exponentialRampToValueAtTime(0.0001, t + len);
          src.connect(f);
          f.connect(g);
          g.connect(AC.destination);
          src.start(t);
          src.stop(t + len + 0.01);
        })(Math.random() * (dur || 1.8));
      }
    } catch (e) {}
  }
  /* kattspinn: en låg ton som darrar i ~26 Hz, plus lite brus för textur */
  /* kattspinn: riktiga katter spinner genom att stämbanden öppnas och stängs
       ~25-30 ggr/sek, vilket ger ett muller av bruset luft snarare än en ren ton –
       därför byggs ljudet av pulsat, lågpassfiltrerat brus och ingen oscillator */
  function sndNo() {
    tone(300, 0.16, 0, "triangle");
    tone(210, 0.22, 0.13, "triangle");
  }
  var AMB = null;
  function ambienceStop() {
    if (!AMB) return;
    try {
      if (AMB.gain) AMB.gain.gain.setTargetAtTime(0, AC.currentTime, 0.4);
      var n = AMB;
      setTimeout(function () {
        try {
          n.src && n.src.stop();
          n.lfo && n.lfo.stop();
          n.gain && n.gain.disconnect();
        } catch (e) {}
      }, 1100);
      if (n.timer) clearInterval(n.timer);
    } catch (e) {}
    AMB = null;
  }
  /* ljudmiljön ska andas, inte susa: mycket tyst brus med långsamma vindpustar
       plus enstaka händelser – regndroppar på hösten, fåglar på våren och sommaren */
  function ambienceStart() {
    if (!S.sound || !S.amb || AMB) return;
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      var sec = seasonId();
      var len = AC.sampleRate * 4,
        buf = AC.createBuffer(1, len, AC.sampleRate),
        d = buf.getChannelData(0),
        last = 0,
        i;
      for (i = 0; i < len; i++) {
        var wn = Math.random() * 2 - 1;
        last = (last + 0.02 * wn) / 1.02;
        d[i] = last * 3.2;
      }
      var src = AC.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      var bp = AC.createBiquadFilter();
      bp.type = "lowpass";
      bp.frequency.value = sec === "vinter" ? 300 : sec === "sygis" ? 520 : 420;
      bp.Q.value = 0.6;
      var base = AC.createGain();
      base.gain.value = sec === "suvi" ? 0.006 : 0.01; /* nästan omärkligt */
      /* vindpustar: långsam våg som höjer och sänker */
      var lfo = AC.createOscillator(),
        lfoG = AC.createGain();
      lfo.frequency.value = 0.055; /* ca en pust var 18:e sekund */
      lfoG.gain.value = sec === "suvi" ? 0.004 : 0.008;
      lfo.connect(lfoG);
      lfoG.connect(base.gain);
      var out = AC.createGain();
      out.gain.value = 0;
      out.gain.setTargetAtTime(1, AC.currentTime, 2.5); /* tona in långsamt */
      src.connect(bp);
      bp.connect(base);
      base.connect(out);
      out.connect(AC.destination);
      src.start();
      lfo.start();
      AMB = { src: src, lfo: lfo, gain: out, timer: null };
      /* enstaka händelser i stället för konstant ljud */
      AMB.timer = setInterval(function () {
        if (!AMB || !S.sound) return;
        var t = AC.currentTime;
        if (sec === "kevad" || sec === "suvi") {
          if (Math.random() < 0.62) return; /* fågel ungefär var 12:e sekund */
          var o = AC.createOscillator(),
            og = AC.createGain();
          o.type = "sine";
          o.frequency.setValueAtTime(1900 + Math.random() * 700, t);
          o.frequency.exponentialRampToValueAtTime(2500 + Math.random() * 800, t + 0.08);
          og.gain.setValueAtTime(0.0001, t);
          og.gain.exponentialRampToValueAtTime(0.022, t + 0.03);
          og.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
          o.connect(og);
          og.connect(AC.destination);
          o.start(t);
          o.stop(t + 0.28);
        } else if (sec === "sygis") {
          if (Math.random() < 0.5) return; /* enstaka droppe */
          var o2 = AC.createOscillator(),
            g2 = AC.createGain();
          o2.type = "sine";
          o2.frequency.setValueAtTime(900 + Math.random() * 500, t);
          o2.frequency.exponentialRampToValueAtTime(420, t + 0.09);
          g2.gain.setValueAtTime(0.0001, t);
          g2.gain.exponentialRampToValueAtTime(0.014, t + 0.01);
          g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
          o2.connect(g2);
          g2.connect(AC.destination);
          o2.start(t);
          o2.stop(t + 0.2);
        }
      }, 4200);
    } catch (e) {}
  }
  function ambienceToggle() {
    S.amb = S.amb ? 0 : 1;
    save();
    if (!S.amb) ambienceStop();
    else ambienceStart();
  }
  function fanfare(tier) {
    if (!S.sound) return;
    var N = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    if (tier >= 3) {
      tone(261.6, 0.5, 0, "triangle");
      tone(392, 0.5, 0, "triangle");
      tone(N[0], 0.16, 0.05);
      tone(N[1], 0.16, 0.2);
      tone(N[2], 0.16, 0.35);
      tone(N[3], 0.5, 0.52);
      tone(N[2], 0.5, 0.52);
      tone(N[4], 0.7, 0.7);
      tone(130.8, 0.7, 0.7, "triangle");
      setTimeout(function () {
        tone(N[3], 0.18, 0);
        tone(N[4], 0.5, 0.16);
      }, 1200);
    } else if (tier === 2) {
      tone(N[0], 0.14, 0);
      tone(N[1], 0.14, 0.13);
      tone(N[2], 0.14, 0.26);
      tone(N[3], 0.45, 0.4);
      tone(N[1], 0.45, 0.4);
    } else {
      tone(N[1], 0.12, 0);
      tone(N[2], 0.12, 0.11);
      tone(N[3], 0.3, 0.23);
    }
  }
  function sndLvl() {
    tone(523, 0.14, 0);
    tone(659, 0.14, 0.12);
    tone(784, 0.14, 0.24);
    tone(1047, 0.3, 0.36);
  }

  /* ============ TAL UT (estniska, kvinnoröst) ============ */
  var BANKS = window.AUDIO || { normal: {}, slow: {}, names: {} };
  if (!BANKS.story) BANKS.story = {};
  if (!BANKS.normal) BANKS.normal = {};
  if (!BANKS.slow) BANKS.slow = {};
  if (!BANKS.names) BANKS.names = {};
  function bank(slow) {
    return (slow ? BANKS.slow : BANKS.normal) || BANKS.normal || {};
  }

  /* --- offline: be service workern hämta en dels alla klipp i förväg,
       så att hela temat fungerar utan nät när det väl har öppnats --- */
  function precacheClips(banks) {
    if (!("serviceWorker" in navigator) || location.protocol.indexOf("http") !== 0) return;
    var urls = [],
      b,
      k,
      v;
    for (b in banks) {
      if (!banks[b] || typeof banks[b] !== "object") continue;
      for (k in banks[b]) {
        v = banks[b][k];
        if (typeof v === "string" && v.indexOf("data:") !== 0) urls.push(v);
      }
    }
    if (!urls.length) return;
    navigator.serviceWorker.ready
      .then(function (reg) {
        if (reg.active) reg.active.postMessage({ type: "precache", urls: urls });
      })
      .catch(function () {});
  }
  precacheClips(BANKS); /* orden i startfilen */

  /* --- ljuddelar: hämtas först när de behövs --- */
  window.AUDIO_PARTS = window.AUDIO_PARTS || { loaded: {}, pending: {} };
  window.addAudio = function (part, data) {
    var k;
    if (data.normal) for (k in data.normal) BANKS.normal[k] = data.normal[k];
    if (data.slow) for (k in data.slow) BANKS.slow[k] = data.slow[k];
    if (data.names) for (k in data.names) BANKS.names[k] = data.names[k];
    precacheClips(data);
    window.AUDIO_PARTS.loaded[part] = 1;
    var q = window.AUDIO_PARTS.pending[part] || [];
    delete window.AUDIO_PARTS.pending[part];
    for (var i = 0; i < q.length; i++) {
      try {
        q[i]();
      } catch (e) {}
    }
  };
  function partFor(text) {
    var pm = window.PARTMAP || null;
    if (!pm) return null;
    var p = pm[text];
    if (!p || window.AUDIO_PARTS.loaded[p]) return null;
    return p;
  }
  /* orden i startfilen har bara normal hastighet – den långsamma inläsningen
       ligger i en egen del som hämtas först när någon trycker 🐢 */
  function slowPartFor(text) {
    var sm = window.SLOWMAP || null;
    if (!sm) return null;
    var p = sm[text];
    if (!p || window.AUDIO_PARTS.loaded[p]) return null;
    return p;
  }
  var loadingParts = 0;
  function showLoading(on) {
    var el = document.getElementById("loadbar");
    if (!el) {
      if (!on) return;
      el = document.createElement("div");
      el.id = "loadbar";
      document.body.appendChild(el);
    }
    el.className = on ? "on" : "";
    if (!on)
      setTimeout(function () {
        if (el && !loadingParts) el.remove();
      }, 400);
  }
  function loadPart(part, cb) {
    /* i enfilsversionen finns ingen delkarta – då ligger allt ljud redan i sidan */
    if (!part || !window.PARTMAP) {
      cb && cb();
      return;
    }
    var P = window.AUDIO_PARTS;
    if (P.loaded[part]) {
      cb && cb();
      return;
    }
    if (P.pending[part]) {
      if (cb) P.pending[part].push(cb);
      return;
    }
    P.pending[part] = cb ? [cb] : [];
    loadingParts++;
    showLoading(true);
    /* delen gick inte att hämta (saknas helt, eller ett nätverksfel) - ge upp tyst istället
       för att låta speak() vänta för evigt på ett anrop som aldrig kommer. */
    var fail = function () {
      P.loaded[part] = 1;
      var q = P.pending[part] || [];
      delete P.pending[part];
      for (var i = 0; i < q.length; i++) {
        try {
          q[i]();
        } catch (e) {}
      }
    };
    var done = function () {
      loadingParts = Math.max(0, loadingParts - 1);
      if (!loadingParts) showLoading(false);
      /* skriptet hämtades, men om addAudio() aldrig anropades (t.ex. om delen saknas och
         servern svarade med sin egen felsida i stället för en riktig 404) har P.loaded[part]
         fortfarande inte satts - då räknas det ändå som att delen inte gick att hämta. */
      if (!P.loaded[part]) fail();
    };
    var s = document.createElement("script");
    s.addEventListener("load", done);
    s.addEventListener("error", function () {
      loadingParts = Math.max(0, loadingParts - 1);
      if (!loadingParts) showLoading(false);
      fail();
    });
    s.src = "audio/" + part + ".js";
    s.async = true;
    document.head.appendChild(s);
  }
  /* bara delar som finns: de nyare temana har inga egna ljudfiler (orden ligger i andra delar),
     och en fil som inte finns gav bara ett fel i konsolen */
  var KNOWN_PARTS = null;
  function prefetch(part) {
    if (!KNOWN_PARTS) {
      KNOWN_PARTS = {};
      var pm = window.PARTMAP || {},
        k;
      for (k in pm) KNOWN_PARTS[pm[k]] = 1;
    }
    if (!KNOWN_PARTS[part]) return;
    loadPart(part, null);
  }
  function prefetchTheme(id) {
    prefetch("theme-" + id);
  }
  function prefetchAllThemes() {
    for (var i = 0; i < THEMES.length; i++) prefetch("theme-" + THEMES[i].id);
  }
  function prefetchName() {
    var k = (S.name || "").trim().charAt(0).toLowerCase();
    if (k) prefetch("names-" + (/[a-zåäöõü]/.test(k) ? k : "x"));
  }
  var voices = [],
    etVoice = null,
    voiceSource = "inbyggd";
  var FEM = /anu|liisi|külli|kylli|kadri|mari|eva|naine|female|woman|zira|hazel/i;
  var MAS = /kert|tõnu|tonu|meelis|mihkel|mees|male\b|man\b|david|mark/i;
  function loadVoices() {
    try {
      voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    } catch (e) {
      voices = [];
    }
    etVoice = pickEstonian();
    voiceSource = etVoice ? "system" : "inbyggd";
  }
  function pickEstonian() {
    var et = [],
      i,
      v;
    for (i = 0; i < voices.length; i++) {
      v = voices[i];
      if (v.lang && v.lang.toLowerCase().indexOf("et") === 0) et.push(v);
    }
    if (!et.length) return null;
    for (i = 0; i < et.length; i++) {
      if (FEM.test(et[i].name)) return et[i];
    }
    for (i = 0; i < et.length; i++) {
      if (!MAS.test(et[i].name)) return et[i];
    }
    return null; /* bara manlig estnisk röst -> anvand inbyggd kvinnoröst */
  }
  loadVoices();
  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  var player = null,
    AN = null,
    srcNode = null,
    jawRAF = null,
    talking = false;
  var isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var useAN = !isIOS,
    anBuf = null;
  function ensureGraph() {
    if (!useAN || srcNode || !player) return;
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state !== "running") {
        try {
          AC.resume();
        } catch (e) {}
        return;
      } /* koppla inte in en sovande motor */
      srcNode = AC.createMediaElementSource(player);
      AN = AC.createAnalyser();
      AN.fftSize = 512;
      anBuf = new Uint8Array(AN.fftSize);
      srcNode.connect(AN);
      AN.connect(AC.destination);
    } catch (e) {
      useAN = false;
      AN = null;
    }
  }
  function startJaw(live) {
    stopJaw();
    talking = true;
    mMood("talk");
    var t0 = performance.now();
    function step(now) {
      var v = 0,
        i,
        d,
        sum = 0;
      if (live && AN) {
        AN.getByteTimeDomainData(anBuf);
        for (i = 0; i < anBuf.length; i += 2) {
          d = (anBuf[i] - 128) / 128;
          sum += d * d;
        }
        v = Math.min(1, Math.sqrt(sum / (anBuf.length / 2)) * 5.2);
      } else {
        var t = (now - t0) / 1000;
        v = Math.max(0, (Math.sin(t * 15.5) * 0.5 + 0.5) * (0.45 + 0.55 * Math.abs(Math.sin(t * 2.9))));
      }
      mJaw(v);
      jawRAF = requestAnimationFrame(step);
    }
    jawRAF = requestAnimationFrame(step);
  }
  function stopJaw() {
    if (jawRAF) cancelAnimationFrame(jawRAF);
    jawRAF = null;
    talking = false;
    mJaw(0);
    var s = $s("s-svg");
    if (s && s.className.baseVal.indexOf("mood-talk") >= 0) mMood("");
  }
  function stopSpeak() {
    qlist = [];
    stopStory();
    stopJaw();
    try {
      if (window.speechSynthesis) speechSynthesis.cancel();
    } catch (e) {}
    try {
      if (player) {
        player.pause();
        player.currentTime = 0;
      }
    } catch (e) {}
  }
  function nameKey() {
    return (S.name || "")
      .trim()
      .split(/\s+/)[0]
      .toLowerCase()
      .replace(/[^a-zåäöõüšž]/g, "");
  }
  function nameClip() {
    var b = BANKS.names || {},
      k = nameKey();
    if (k && !b[k]) {
      var pp = partFor(k);
      if (pp) {
        loadPart(pp, null);
      }
    }
    if (!k) return null;
    if (b[k]) return b[k];
    /* prova utan prickar: Jönas -> jonas, Sofía -> sofia */
    var plain = k
      .replace(/å/g, "a")
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/õ/g, "o")
      .replace(/ü/g, "u")
      .replace(/š/g, "s")
      .replace(/ž/g, "z");
    if (b[plain]) return b[plain];
    /* och tvärtom: jonas finns, jônas skrivet -> jämför alla nycklar i enkel form */
    for (var key in b) {
      if (key.replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o").replace(/õ/g, "o").replace(/ü/g, "u") === plain)
        return b[key];
    }
    return null;
  }
  function hasVoiceName() {
    return !!nameClip();
  }
  /* säger t.ex. "Tere, Anna!" genom att spela frasen och namnet efter varandra */
  function speakTo(leadId) {
    var lead = LEADS[leadId];
    if (!lead) return;
    var np = partFor(nameKey()) || partFor(lead.et);
    if (np) {
      loadPart(np, function () {
        speakTo(leadId);
      });
      return;
    }
    var a = bank()[lead.et],
      b = nameClip();
    if (a && b) {
      playChain([a, b]);
      return;
    }
    speak(lead.et);
  }
  var qlist = [];
  function playChain(srcs) {
    if (!S.sound) return;
    stopSpeak();
    qlist = srcs.slice(1);
    playSrc(srcs[0], 1);
  }
  function playSrc(src, rate) {
    try {
      if (!player) {
        player = new Audio();
        player.preload = "auto";
        player.addEventListener("ended", function () {
          if (qlist.length) {
            playSrc(qlist.shift(), 1);
          } else stopJaw();
        });
        /* om ett klipp inte går att spela: hoppa vidare i kön i stället för att tystna */
        player.addEventListener("error", function () {
          if (qlist.length) playSrc(qlist.shift(), 1);
          else stopJaw();
        });
      }
      var start = function () {
        try {
          ensureGraph();
          player.src = toBlob(src);
          player.playbackRate = rate || 1;
          var pr = player.play();
          if (pr && pr.then) {
            pr.then(function () {
              startJaw(!!AN);
            }).catch(function () {
              /* blob nekades – prova den inbäddade källan rakt av */
              try {
                player.src = src;
                var p2 = player.play();
                if (p2 && p2.then)
                  p2.then(function () {
                    startJaw(false);
                  }).catch(function () {
                    stopJaw();
                  });
                else startJaw(false);
              } catch (e2) {
                stopJaw();
              }
            });
          } else {
            startJaw(!!AN);
          }
        } catch (e) {
          stopJaw();
        }
      };
      /* vänta tills ljudmotorn är vaken – annars spelas klippet tyst */
      if (AC && AC.state !== "running") {
        var r = null;
        try {
          r = AC.resume();
        } catch (e) {}
        if (r && r.then) {
          r.then(start, start);
          setTimeout(function () {
            if (player && player.paused) start();
          }, 350);
          return;
        }
      }
      start();
    } catch (e) {
      stopJaw();
    }
  }
  /* sagan läses av en egen svensk berättarröst – Siiri talar bara estniska */
  function stopStory() {}
  function speak(text, slow) {
    lastSpokenText = text;
    if (!S.sound) return;
    var part = partFor(text);
    if (part) {
      loadPart(part, function () {
        speak(text, slow);
      });
      return;
    }
    if (slow) {
      var sp = slowPartFor(text);
      if (sp) {
        loadPart(sp, function () {
          speak(text, slow);
        });
        return;
      }
    }
    stopSpeak();
    var src = slow ? bank(true)[text] || bank()[text] : bank()[text];
    var haveSlow = !!(slow && bank(true)[text]);
    if (!src && needsLiveTts(text) && ttsOk()) {
      /* ord vars uttal inte hunnit hämtas än (glosa eller barnets eget husdjursnamn/
         favoritmat/rumsfärg): hämta riktigt Mari-uttal från Neurokõne och spela sedan -
         samma röst som resten av appen, istället för vilken systemröst enheten råkar ha.
         Misslyckas hämtningen (offline, API nere) faller vi tillbaka på systemrösten nedan. */
      ttsNow(text, "normal").then(function (ok) {
        if (ok) speak(text, slow);
        else speakSystemVoice(text, slow);
      });
      return;
    }
    if (!src && etVoice) {
      speakSystemVoice(text, slow);
      return;
    }
    if (!src) return;
    qlist = [];
    playSrc(src, slow && !haveSlow ? 0.72 : 1);
  }
  /* sista utväg: enhetens egen estniska systemröst (om den har någon), klart sämre än Mari
     men bättre än tystnad - för text som varken är förinspelad eller går att hämta live. */
  function speakSystemVoice(text, slow) {
    if (!etVoice) return;
    try {
      var u = new SpeechSynthesisUtterance(text);
      u.voice = etVoice;
      u.lang = etVoice.lang;
      u.rate = slow ? 0.62 : 0.78;
      u.pitch = 1.1;
      u.onstart = function () {
        startJaw(false);
      };
      u.onend = function () {
        stopJaw();
      };
      u.onerror = function () {
        stopJaw();
      };
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  /* säger flera ord i följd, som en mening */
  function speakSeq(list) {
    if (!S.sound || !list || !list.length) return;
    var i, p;
    for (i = 0; i < list.length; i++) {
      p = partFor(list[i]);
      if (p) {
        loadPart(p, function () {
          speakSeq(list);
        });
        return;
      }
    }
    var srcs = [];
    for (i = 0; i < list.length; i++) {
      var s = bank()[list[i]];
      if (s) srcs.push(s);
    }
    if (!srcs.length) return;
    stopSpeak();
    qlist = srcs.slice(1);
    playSrc(srcs[0], 1);
  }
  function speakSeqSlow(list) {
    if (!S.sound || !list || !list.length) return;
    var i, p;
    for (i = 0; i < list.length; i++) {
      p = partFor(list[i]);
      if (p) {
        loadPart(p, function () {
          speakSeqSlow(list);
        });
        return;
      }
    }
    for (i = 0; i < list.length; i++) {
      p = slowPartFor(list[i]);
      if (p) {
        loadPart(p, function () {
          speakSeqSlow(list);
        });
        return;
      }
    }
    var srcs = [];
    for (i = 0; i < list.length; i++) {
      var s = bank(true)[list[i]] || bank()[list[i]];
      if (s) srcs.push(s);
    }
    if (!srcs.length) return;
    stopSpeak();
    qlist = srcs.slice(1);
    playSrc(srcs[0], 1);
  }
  function voiceStatus() {
    return "Siiri talar med den estniska rösten Mari, byggd på studioinspelningar från Tartu universitet. 🐢 ger en långsammare inläsning av samma ord.";
  }

  /* ============ TAL IN ============ */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var micOK = !!SR;
  var inFrame = false;
  try {
    inFrame = window.self !== window.top;
  } catch (e) {
    inFrame = true;
  }
  var micGranted = false,
    micBlocked = false,
    micLang = "et-EE";
  var APP_URL = "https://claude.ai/artifact/UTaGovPZDgwS6tZDM7yiRP";
  function appUrl() {
    /* inuti chattrutan är location.href en intern ram-adress som inte går att öppna direkt */
    return inFrame ? APP_URL : location.href;
  }
  function openTabHTML(txt) {
    return (
      '<a class="btn ghost" style="margin-top:8px" href="' +
      appUrl() +
      '" target="_blank" rel="noopener">' +
      (txt || "Öppna appen i egen flik 🎤") +
      "</a>"
    );
  }
  function micProblem(err) {
    if (err === "noSR") return "Den här webbläsaren kan inte lyssna. Prova Chrome, Edge eller Safari.";
    if (
      err === "NotAllowedError" ||
      err === "SecurityError" ||
      err === "not-allowed" ||
      err === "service-not-allowed"
    ) {
      micBlocked = true;
      return inFrame
        ? "Mikrofonen får inte användas här. Tryck på svaret i stället, eller öppna appen i egen flik och tillåt mikrofonen."
        : "Mikrofonen är avstängd. Tillåt mikrofon för sidan i webbläsaren och försök igen.";
    }
    if (err === "NotFoundError") return "Ingen mikrofon hittades på enheten.";
    if (err === "no-speech") return "Jag hörde inget. Prata lite närmare mikrofonen och prova igen.";
    if (err === "network") return "Rösttjänsten nås inte just nu. Prova igen om en stund.";
    return "Mikrofonen krånglar här. " + (inFrame ? "Prova att öppna appen i egen flik." : "Prova igen.");
  }
  /* ber om tillstånd först – det ger en tydlig fråga i stället för tyst nekande */
  function askMic(cb) {
    if (micBlocked) {
      cb("NotAllowedError");
      return;
    }
    if (micGranted) {
      cb(null);
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      micGranted = true;
      cb(null);
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (st) {
        try {
          st.getTracks().forEach(function (t) {
            t.stop();
          });
        } catch (e) {}
        micGranted = true;
        cb(null);
      })
      .catch(function (err) {
        var n = err && err.name ? err.name : "NotAllowedError";
        if (n === "NotAllowedError" || n === "SecurityError") micBlocked = true;
        cb(n);
      });
  }
  function listen(onResult, onEnd, onErr) {
    if (!SR) {
      onErr && onErr("noSR");
      return null;
    }
    askMic(function (permErr) {
      if (permErr) {
        onErr && onErr(permErr);
        onEnd && onEnd();
        return;
      }
      startSR(onResult, onEnd, onErr, false);
    });
    return null;
  }
  function startSR(onResult, onEnd, onErr, retried) {
    var r,
      done = false;
    try {
      r = new SR();
    } catch (e) {
      onErr && onErr("start");
      onEnd && onEnd();
      return;
    }
    r.lang = retried ? navigator.language || "en-US" : micLang;
    r.interimResults = false;
    r.maxAlternatives = 5;
    r.continuous = false;
    r.onresult = function (e) {
      done = true;
      var alts = [],
        i;
      for (i = 0; i < e.results[0].length; i++) {
        alts.push(e.results[0][i].transcript);
      }
      onResult(alts);
    };
    r.onerror = function (e) {
      if ((e.error === "language-not-supported" || e.error === "bad-grammar") && !retried) {
        micLang = navigator.language || "en-US";
        startSR(onResult, onEnd, onErr, true);
        return;
      }
      done = true;
      onErr && onErr(e.error);
    };
    r.onend = function () {
      onEnd && onEnd();
      if (!done) {
        /* tyst slut */
      }
    };
    try {
      r.start();
    } catch (e) {
      onErr && onErr("start");
      onEnd && onEnd();
    }
    /* nödbroms om motorn hänger sig */
    setTimeout(function () {
      if (!done) {
        try {
          r.stop();
        } catch (e) {}
      }
    }, 9000);
  }
  function norm(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[.,!?;:"'`´]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function loose(s) {
    return norm(s)
      .replace(/õ/g, "o")
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/ü/g, "u")
      .replace(/š/g, "s")
      .replace(/ž/g, "z")
      .replace(/(.)\1+/g, "$1");
  }
  function lev(a, b) {
    var m = a.length,
      n = b.length,
      d = [],
      i,
      j;
    for (i = 0; i <= m; i++) {
      d[i] = [i];
    }
    for (j = 0; j <= n; j++) {
      d[0][j] = j;
    }
    for (i = 1; i <= m; i++)
      for (j = 1; j <= n; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    return d[m][n];
  }
  function saidIt(alts, target) {
    var t = loose(target),
      i,
      a,
      tol = Math.max(1, Math.floor(t.length / 4));
    for (i = 0; i < alts.length; i++) {
      a = loose(alts[i]);
      if (a === t) return true;
      if (a.indexOf(t) >= 0) return true;
      if (lev(a, t) <= tol) return true;
    }
    return false;
  }

  /* ============ KONFETTI ============ */
  var fx = document.getElementById("fx"),
    ctx = null,
    parts = [],
    raf = null;
  try {
    ctx = fx.getContext("2d");
  } catch (e) {
    ctx = null;
  }
  function sizeFx() {
    if (!ctx) return;
    fx.width = innerWidth * devicePixelRatio;
    fx.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  sizeFx();
  addEventListener("resize", sizeFx);
  var CONF = ["#F6B93B", "#C8305A", "#3B6CD4", "#2E6B45", "#FFFFFF", "#8A5A3B"];
  function burst(n) {
    if (!ctx) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var i,
      cx = innerWidth / 2,
      cy = innerHeight * 0.42;
    for (i = 0; i < (n || 70); i++) {
      parts.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 11,
        vy: Math.random() * -11 - 3,
        s: 5 + Math.random() * 7,
        c: CONF[(Math.random() * CONF.length) | 0],
        a: 1,
        r: Math.random() * 6,
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function petals(n, cols) {
    if (!ctx) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (var i = 0; i < (n || 40); i++) {
      parts.push({
        snow: 1,
        petal: 1,
        x: Math.random() * innerWidth,
        y: -20 - Math.random() * innerHeight,
        vx: 0,
        vy: 0.5 + Math.random() * 0.9,
        s: 5 + Math.random() * 7,
        c: cols[(Math.random() * cols.length) | 0],
        a: 1,
        r: Math.random() * 6,
        w: Math.random() * 6.28,
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function snow(n) {
    if (!ctx) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (var i = 0; i < (n || 120); i++) {
      parts.push({
        snow: 1,
        x: Math.random() * innerWidth,
        y: -20 - Math.random() * innerHeight * 1.2,
        vx: 0,
        vy: 0.7 + Math.random() * 1.1,
        s: 3 + Math.random() * 6,
        c: "#FFFFFF",
        a: 1,
        r: Math.random() * 6,
        w: Math.random() * Math.PI * 2,
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  /* ballonger som stiger från botten, för de allra största firandena */
  function balloons(n) {
    if (!ctx) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (var i = 0; i < (n || 12); i++) {
      parts.push({
        balloon: 1,
        x: innerWidth * (0.08 + Math.random() * 0.84),
        y: innerHeight + 30 + Math.random() * 220,
        vy: -(1 + Math.random() * 0.9),
        s: 20 + Math.random() * 14,
        c: CONF[(Math.random() * CONF.length) | 0],
        a: 1,
        w: Math.random() * 6.28,
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      if (p.balloon) {
        p.w += 0.04;
        p.y += p.vy;
        p.x += Math.sin(p.w) * 0.7;
        if (p.y < -60) {
          parts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.s * 0.62, p.s, 0, 0, 6.284);
        ctx.fillStyle = p.c;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(p.x, p.y + p.s);
        ctx.lineTo(p.x, p.y + p.s + 22);
        ctx.strokeStyle = "rgba(255,255,255,.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
        continue;
      }
      if (p.snow) {
        p.w += 0.03;
        p.y += p.vy;
        p.x += Math.sin(p.w) * (p.petal ? 1.6 : 0.9);
        if (p.y > innerHeight + 20) {
          parts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.petal ? 0.85 : 0.9;
        if (p.petal) {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.w);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.s / 2, p.s / 3.4, 0, 0, 6.284);
          ctx.fillStyle = p.c;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.s / 2, 0, 6.284);
          ctx.fillStyle = p.c;
          ctx.fill();
        }
        ctx.restore();
        continue;
      }
      p.vy += 0.42;
      p.x += p.vx;
      p.y += p.vy;
      p.r += 0.18;
      p.a -= 0.011;
      if (p.a <= 0 || p.y > innerHeight + 40) {
        parts.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(p.a, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    }
    if (parts.length) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  /* ============ MASKOT: igelkotten Siiri ============ */
  /* Kläder, päls och ögonfärger ritas av app/utils/siiri-portrait.ts – samma kod som Vue-figuren
     (SiiriPortrait.vue) – via window.SiiriDraw (app/plugins/siiri-draw.client.ts). Här finns bara
     tunna omslag som läser spelarens S. */
  var DRAW = window.SiiriDraw;
  var FURS = DRAW.FURS,
    EYES = DRAW.EYES;
  function wearSVG(slot, pass) {
    return DRAW.wearSVG(S.wear, S.owned, slot, pass);
  }
  function mixHex(c, t, amt) {
    return DRAW.mixHex(c, t, amt);
  }
  function furLayer(f, img, idSuffix) {
    return DRAW.furLayer(f, idSuffix);
  }
  function myEye() {
    return DRAW.myEye(S.eye);
  }
  function myFur() {
    return DRAW.myFur(S.fur);
  }
  /* samma ritning som Siiri, men med barnets päls och kläder och utan animationer */
  function siilSVG(size) {
    /* förslag: "en ruta bredvid Siiri på svår nivå där man kan cheka av om man vill ha
       glasögon eller inte" - S.shades (standard: på, samma som förut) styr om de syns även
       när nivån är svår. Kryssrutan finns i setupScreen(). */
    var cls = "siiri" + (size ? " " + size : "") + (diff().id === "svar" && S.shades !== false ? " cool" : "");
    return (
      '<span class="siiri3d">' +
      '<svg class="' +
      cls +
      '" id="s-svg" viewBox="0 0 200 200" role="img" aria-label="Igelkotten Siiri">' +
      "<defs>" +
      '<radialGradient id="sg-aura" cx="50%" cy="50%" r="50%">' +
      '<stop offset="55%" stop-color="rgba(255,214,110,0)"/>' +
      '<stop offset="80%" stop-color="rgba(255,206,92,.38)"/>' +
      '<stop offset="100%" stop-color="rgba(255,186,40,0)"/></radialGradient>' +
      '<radialGradient id="sg-night" cx="38%" cy="26%" r="80%">' +
      '<stop offset="0%" stop-color="#31467F"/><stop offset="100%" stop-color="#101B3C"/></radialGradient>' +
      '<radialGradient id="sg-lid" cx="50%" cy="38%" r="62%">' +
      '<stop offset="0%" stop-color="#FFFDF8"/><stop offset="70%" stop-color="#FAF2E6"/>' +
      '<stop offset="100%" stop-color="#F1E3D0"/></radialGradient>' +
      '<linearGradient id="sg-lens" x1="0" y1="0" x2="0.5" y2="1">' +
      '<stop offset="0%" stop-color="#4A4A58"/><stop offset="45%" stop-color="#16161E"/>' +
      '<stop offset="100%" stop-color="#2B2B38"/></linearGradient>' +
      '<linearGradient id="sg-frame" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#5E5E6E"/><stop offset="50%" stop-color="#1A1A22"/>' +
      '<stop offset="100%" stop-color="#43434F"/></linearGradient>' +
      "</defs>" +
      '<g id="s-all">' +
      '<g id="s-wave"><circle cx="14" cy="52" r="6" fill="#3B6CD4" opacity="0"/><circle cx="14" cy="52" r="6" fill="#3B6CD4" opacity="0"/><circle cx="14" cy="52" r="6" fill="#3B6CD4" opacity="0"/></g>' +
      '<g id="s-head">' +
      wearSVG("scene") +
      (["kott", "tiivad", "paasuke2", "draakon", "ring"].indexOf(wearing("back")) >= 0
        ? wearSVG("back", "back")
        : wearSVG("back")) +
      '<use href="#siiriPic"/>' +
      furLayer(myFur(), null, "s") +
      (["kott", "tiivad", "paasuke2", "draakon", "ring"].indexOf(wearing("back")) >= 0
        ? wearSVG("back", "front")
        : "") +
      wearSVG("aura") +
      wearSVG("outfit") +
      wearSVG("neck") +
      wearSVG("head") +
      wearSVG("hand") +
      /* platshållare som minspelet animerar */
      '<g id="s-ear"></g><g id="s-armL"></g><g id="s-armR"></g><g id="s-flower"></g>' +
      '<g id="s-browL"><path d="M66 75 q9 -4 17 -1" stroke="#C3A88C" stroke-width="2" fill="none" stroke-linecap="round" opacity=".45"/></g>' +
      '<g id="s-browR"><path d="M116 74 q9 -4 17 1" stroke="#C3A88C" stroke-width="2" fill="none" stroke-linecap="round" opacity=".45"/></g>' +
      /* ögonlock: samma färg som pälsen, syns när hon blinkar */
      '<ellipse cx="76.4" cy="91.4" rx="10.3" ry="11" fill="url(#sg-lid)"/>' +
      '<ellipse cx="123.2" cy="90.7" rx="10.3" ry="11" fill="url(#sg-lid)"/>' +
      /* ögon */
      '<g id="s-eyeL">' +
      '<ellipse cx="76.4" cy="91.4" rx="9.2" ry="9.9" fill="#080605"/>' +
      '<circle id="s-irisL" cx="76.4" cy="91.4" r="5.6" fill="' +
      myEye().c +
      '"/>' +
      '<circle id="s-pupL" cx="76.4" cy="91.4" r="3.0" fill="#000"/>' +
      '<circle id="s-glL" cx="74.2" cy="88.8" r="2.6" fill="#fff"/>' +
      '<circle id="s-glL2" cx="79.1" cy="94.2" r="1.5" fill="#fff" opacity=".6"/>' +
      '<path d="M70.4 95.4 q6 5 12 1" stroke="#6E5F55" stroke-width="1" fill="none" opacity=".3"/>' +
      "</g>" +
      '<g id="s-eyeR">' +
      '<ellipse cx="123.2" cy="90.7" rx="9.2" ry="9.9" fill="#080605"/>' +
      '<circle id="s-irisR" cx="123.2" cy="90.7" r="5.6" fill="' +
      myEye().c +
      '"/>' +
      '<circle id="s-pupR" cx="123.2" cy="90.7" r="3.0" fill="#000"/>' +
      '<circle id="s-glR" cx="121.0" cy="88.1" r="2.6" fill="#fff"/>' +
      '<circle id="s-glR2" cx="125.9" cy="93.5" r="1.5" fill="#fff" opacity=".6"/>' +
      '<path d="M117.2 94.7 q6 5 12 1" stroke="#6E5F55" stroke-width="1" fill="none" opacity=".3"/>' +
      "</g>" +
      /* solglasögon (svår nivå) */
      '<g id="s-shades">' +
      '<path d="M59 87 Q67 82 73 85" stroke="url(#sg-frame)" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M140 86 Q132 81 126 84" stroke="url(#sg-frame)" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M94 88 Q100 85 106 88" stroke="url(#sg-frame)" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M66 81 h26 q5 0 5 5 q0 12 -8 16 q-7 4 -14 0 q-7 -4 -10 -14 q-1 -7 1 -7 Z" fill="url(#sg-lens)" stroke="url(#sg-frame)" stroke-width="2.8"/>' +
      '<path d="M134 80 h-26 q-5 0 -5 5 q0 12 8 16 q7 4 14 0 q7 -4 10 -14 q1 -7 -1 -7 Z" fill="url(#sg-lens)" stroke="url(#sg-frame)" stroke-width="2.8"/>' +
      '<path d="M71 85 l9 0 -11 11 0 -7 Z" fill="#fff" opacity=".45"/>' +
      '<path d="M113 84 l9 0 -11 11 0 -7 Z" fill="#fff" opacity=".45"/>' +
      '<g id="s-glint"><path d="M128 83 l1.9 4 4.2 .6 -3 3 .8 4.2 -3.9 -2.1 -3.8 2.1 .7 -4.2 -3 -3 4.2 -.6 Z" fill="#FFF7C4"/></g>' +
      "</g>" +
      /* munnen: illustrationens leende syns som det är, och när hon pratar läggs en öppen mun över */
      '<circle id="s-nose-hit" cx="99.5" cy="106" r="13" fill="#fff" opacity="0" style="cursor:pointer"/>' +
      '<path id="s-smile" d="M0 0" stroke="none" fill="none"/>' +
      '<g id="s-mouth" opacity="0">' +
      '<ellipse id="s-mouthO" cx="100" cy="117" rx="9.5" ry="2" fill="#6E3540"/>' +
      '<ellipse id="s-tongue" cx="100" cy="120" rx="5.5" ry="1.3" fill="#E28EA0"/>' +
      "</g>" +
      "</g></g></svg>" +
      '<span class="siirishadow"></span></span>'
    );
  }
  function $s(id) {
    return document.getElementById(id);
  }
  function mMood(m) {
    var s = $s("s-svg");
    if (!s) return;
    s.className.baseVal = s.className.baseVal
      .replace(/mood-\S+/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (m) s.className.baseVal += " mood-" + m;
  }
  function mPulse(cls) {
    var s = $s("s-svg");
    if (!s) return;
    s.classList.remove("hop", "wob");
    void s.getBoundingClientRect();
    s.classList.add(cls);
    setTimeout(function () {
      s.classList.remove(cls);
    }, 1200);
  }
  /* musiknoter som stiger från henne när hon dansar */

  /* en liten glad slinga medan hon dansar */

  /* Siiri dansar när något går riktigt bra */
  var danceT = null;
  function dance(big) {
    var s = $s("s-svg");
    if (!s) return;
    s.classList.remove("dance");
    void s.offsetWidth;
    s.classList.add("dance");
    mMood("cheer");
    happyEyes(true);
    clearTimeout(danceT);
    danceT = setTimeout(function () {
      var e = $s("s-svg");
      if (e) e.classList.remove("dance");
      happyEyes(false);
      mMood("");
    }, 2200);
    /* en liten melodi till dansen */
    if (S.sound) {
      var n = [523, 659, 784, 1047],
        i;
      for (i = 0; i < n.length; i++) tone(n[i], 0.12, i * 0.16);
      if (big) {
        tone(1319, 0.3, 0.66);
        tone(1047, 0.3, 0.66);
      }
    }
  }
  /* glada, kisande ögon */
  function happyEyes(on) {
    var l = $s("s-irisL"),
      r = $s("s-irisR"),
      el = $s("s-eyeL"),
      er = $s("s-eyeR");
    if (!el || !er) return;
    el.style.transform = on ? "scaleY(.55)" : "";
    er.style.transform = on ? "scaleY(.55)" : "";
    el.style.transformBox = "view-box";
    er.style.transformBox = "view-box";
    el.style.transformOrigin = "76.4px 91.4px";
    er.style.transformOrigin = "123.2px 90.7px";
    if (l) l.style.opacity = on ? ".25" : "";
    if (r) r.style.opacity = on ? ".25" : "";
  }
  /* ---------- Siiri lever mellan uppgifterna ---------- */
  var IDLE = { t: null, last: Date.now(), n: 0, on: true };
  var IDLE_LINES = [
    { et: "Mul on igav!", sv: "Jag har tråkigt!" },
    { et: "Teeme edasi!", sv: "Vi fortsätter!" },
    { et: "Ma ootan sind.", sv: "Jag väntar på dig." },
    { et: "Kas mängime?", sv: "Ska vi spela?" },
  ];
  /* Siiri berömmer ibland ett tema barnet redan kan bra (S.best[id]===3, redan beräknat
     av resultScreen() och använt internt av nextUp() - bara aldrig sagt högt förut).
     Estniska hålls till en redan använd, böjningsfri fras ("Sa oled tubli!") - temats
     namn (med böjning) nämns bara på svenska, för att undvika fel estnisk grammatik. */
  function bestThemeLine() {
    var mastered = [],
      k;
    for (k in S.best || {}) if (S.best[k] >= 3) mastered.push(k);
    if (!mastered.length) return null;
    var id = mastered[(Math.random() * mastered.length) | 0],
      t,
      i;
    for (i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) t = THEMES[i];
    if (!t) return null;
    return { et: "Sa oled tubli!", sv: "Du är skicklig på " + t.sv.toLowerCase() + "!" };
  }
  /* samma idé, men för ett diplom barnet redan tagit (S.diplomas, se app/pages/room.vue) -
     diplomen firas bara på sin egen skärm annars och nämns aldrig igen. */
  function diplomaLine() {
    var ids = [],
      k;
    for (k in S.diplomas || {}) if (S.diplomas[k] > 0) ids.push(k);
    if (!ids.length) return null;
    var id = ids[(Math.random() * ids.length) | 0],
      t,
      i;
    for (i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) t = THEMES[i];
    if (!t) return null;
    return { et: "Sa oled tubli!", sv: "Du har ett diplom i " + t.sv.toLowerCase() + "!" };
  }
  /* och för senaste orten på Teekond-resan (TRIP är i ordning, så tripDone()-1 är
     verkligen den senaste - till skillnad från tema/diplom finns ingen gissning här) */
  function latestTripLine() {
    var n = tripDone(),
      city = n >= 1 ? TRIP[n - 1] : null;
    if (!city) return null;
    return { et: "Sa oled tubli!", sv: "Du har redan besökt " + city.em + " " + city.et + " på resan!" };
  }
  /* allt Siiri kan tänkas nämna om vad barnet redan klarat, viktat lika - idleAct() växlar
     slumpmässigt in en av dessa bland de vanliga "uttråkad"-replikerna (IDLE_LINES) */
  function specialIdleLine() {
    var candidates = [bestThemeLine(), diplomaLine(), latestTripLine()].filter(function (l) {
      return !!l;
    });
    if (!candidates.length) return null;
    return candidates[(Math.random() * candidates.length) | 0];
  }
  var BACK_LINES = [
    { et: "Oi, sa oled tagasi!", sv: "Åh, du är tillbaka!" },
    { et: "Tere jälle!", sv: "Hej igen!" },
    { et: "Kus sa olid?", sv: "Var har du varit?" },
  ];
  /* ett helt uppehåll (1+ dygn) är mer intressant än "du är tillbaka" - säg hur länge,
     med rätt estnisk böjning (üks päev, men kaks/kolm/... päeva) och namnet om det finns */
  var DAY_WORDS = ["", "üks", "kaks", "kolm", "neli", "viis", "kuus", "seitse", "kaheksa", "üheksa", "kümme"];
  function daysAwayLine(days) {
    var nm = (S.name || "").trim(),
      who = nm ? ", " + nm : "",
      etDays = days === 1 ? "üks päev" : days <= 10 ? DAY_WORDS[days] + " päeva" : "mitu päeva",
      svDays = days === 1 ? "en dag" : days + " dagar";
    return {
      et: "Tere" + who + "! Sa olid ära " + etDays + ".",
      sv: "Hej" + who + "! Du var borta i " + svDays + ".",
    };
  }
  function siiriClass(add, ms) {
    var s = $s("s-svg");
    if (!s) return;
    s.classList.add(add);
    setTimeout(function () {
      var e = $s("s-svg");
      if (e) e.classList.remove(add);
    }, ms || 1300);
  }
  function idleAct() {
    var s = $s("s-svg");
    if (!s || !IDLE.on) return;
    IDLE.n++;
    /* bara mjuka helkroppsrörelser – huvudet står still */
    if (Math.random() < 0.45) siiriClass("wob", 900);
    /* var tredje gång säger hon något - ibland ett beröm om nåt hon redan vet att barnet klarat */
    if (IDLE.n % 3 === 0 && screen === "home") {
      var l = (Math.random() < 0.3 && specialIdleLine()) || IDLE_LINES[(Math.random() * IDLE_LINES.length) | 0];
      speak(l.et);
      bubble(l);
    }
  }
  function bubble(l) {
    var host = document.querySelector(".hero") || document.querySelector("#app");
    if (!host) return;
    var old = document.getElementById("sbubble");
    if (old) old.remove();
    var d = document.createElement("div");
    d.id = "sbubble";
    d.className = "sbubble";
    d.innerHTML = "<b>" + esc(l.et) + "</b><small>" + esc(l.sv) + "</small>";
    host.appendChild(d);
    setTimeout(function () {
      var e = document.getElementById("sbubble");
      if (e) e.remove();
    }, 4200);
  }
  function idleKick() {
    IDLE.last = Date.now();
    clearTimeout(IDLE.t);
    IDLE.t = setTimeout(
      function tick() {
        if (Date.now() - IDLE.last > 18000) idleAct();
        IDLE.t = setTimeout(tick, 14000 + Math.random() * 12000);
      },
      20000 + Math.random() * 8000,
    );
  }
  document.addEventListener(
    "pointerdown",
    function () {
      IDLE.last = Date.now();
    },
    { passive: true },
  );
  /* hälsa när man kommer tillbaka efter ett uppehåll */
  function welcomeBack() {
    var now = Date.now(),
      gap = now - (S.lastSeen || now);
    S.lastSeen = now;
    save();
    if (gap > 6 * 3600 * 1000) {
      var days = Math.floor(gap / (24 * 3600 * 1000));
      setTimeout(function () {
        var l = days >= 1 ? daysAwayLine(days) : BACK_LINES[(Math.random() * BACK_LINES.length) | 0];
        speak(l.et);
        bubble(l);
        siiriClass("wob", 900);
      }, 900);
    }
  }
  function mood(kind) {
    if (kind === "dance") {
      dance();
      return;
    }
    if (kind === "cheer") {
      mMood("happy");
      mPulse("hop");
      setTimeout(function () {
        if (!talking) mMood("");
      }, 1600);
    } else if (kind === "oops") {
      mMood("sad");
      mPulse("wob");
      setTimeout(function () {
        if (!talking) mMood("");
      }, 1800);
    } else mMood(kind || "");
  }
  var MOUTH_Y = 117;
  function mJaw(v) {
    var m = $s("s-mouth"),
      o = $s("s-mouthO"),
      t = $s("s-tongue"),
      sm = $s("s-smile");
    if (!m || !o) return;
    if (v <= 0.04) {
      m.setAttribute("opacity", "0");
      if (sm) sm.setAttribute("opacity", "1");
      return;
    }
    m.setAttribute("opacity", "1");
    if (sm) sm.setAttribute("opacity", "0");
    var ry = 1.8 + 8.5 * v;
    o.setAttribute("cy", MOUTH_Y.toFixed(2));
    o.setAttribute("ry", ry.toFixed(2));
    o.setAttribute("rx", (9 + 2.6 * v).toFixed(2));
    if (t) {
      t.setAttribute("cy", (MOUTH_Y + ry * 0.42).toFixed(2));
      t.setAttribute("ry", (1.0 + 1.8 * v).toFixed(2));
      t.setAttribute("rx", (4.5 + 1.6 * v).toFixed(2));
      t.setAttribute("opacity", v > 0.35 ? "1" : "0");
    }
  }
  /* ögonen följer fingret eller muspekaren */
  var lookX = 0,
    lookY = 0;
  function mLook(cx, cy) {
    var s = $s("s-svg");
    if (!s) return;
    var r = s.getBoundingClientRect();
    var ex = r.left + r.width / 2,
      ey = r.top + r.height * 0.52;
    var W = window.innerWidth || 600,
      H = window.innerHeight || 600;
    /* mät åt vänster och åt höger var för sig: hon sitter sällan mitt på skärmen,
           så samma måttstock åt båda håll gör att blicken slår i taket åt ena sidan */
    var spanL = Math.max(ex, 60),
      spanR = Math.max(W - ex, 60);
    var spanU = Math.max(ey, 60),
      spanD = Math.max(H - ey, 60);
    var dx = (cx - ex) / (cx < ex ? spanL : spanR);
    var dy = (cy - ey) / (cy < ey ? spanU : spanD);
    lookX = Math.max(-1, Math.min(1, dx)) * 3.2;
    lookY = Math.max(-1, Math.min(1, dy)) * 2.8;
    /* hela figuren lutar en aning mot pekaren – det ger djup */
    try {
      var ty = Math.max(-1, Math.min(1, dx)) * 9,
        tx = Math.max(-1, Math.min(1, dy)) * -6;
      document.documentElement.style.setProperty("--tiltY", ty.toFixed(1) + "deg");
      document.documentElement.style.setProperty("--tiltX", tx.toFixed(1) + "deg");
    } catch (e) {}
    /* hela figuren vrider sig en aning mot pekaren – djup utan 3D-modell */
    if (s && !s.classList.contains("dance")) {
      var ry = Math.max(-1, Math.min(1, dx)) * 7,
        rx = Math.max(-1, Math.min(1, dy)) * -4;
      s.style.transform = "perspective(700px) rotateY(" + ry.toFixed(1) + "deg) rotateX(" + rx.toFixed(1) + "deg)";
    }
    var p,
      i,
      ids = ["s-irisL", "s-pupL", "s-glL", "s-glL2", "s-irisR", "s-pupR", "s-glR", "s-glR2"];
    for (i = 0; i < ids.length; i++) {
      p = $s(ids[i]);
      if (p) p.setAttribute("transform", "translate(" + lookX.toFixed(1) + "," + lookY.toFixed(1) + ")");
    }
  }
  addEventListener(
    "pointermove",
    function (e) {
      mLook(e.clientX, e.clientY);
    },
    { passive: true },
  );

  /* ============ HEMLIGHETER ============ */
  function eggSay(id) {
    var e = EGGS[id];
    if (!e) return;
    speak(e.et);
    var d = overlay(
      '<div class="oc" style="border-color:#6B4FD8"><p class="kicker">🤫 Hemlighet!</p>' +
        '<div style="font-size:64px">' +
        (id === "gold" ? "🌟" : id === "tickle" ? "🤭" : id === "snow" ? "❄️" : "🦔") +
        "</div>" +
        '<h3 style="font-size:22px">' +
        esc(e.et) +
        "</h3><p>" +
        esc(e.sv) +
        "</p>" +
        '<button class="btn big wide" id="eggok">Hihi!</button></div>',
    );
    d.style.background = "rgba(12,28,18,.55)";
    d.querySelector("#eggok").onclick = function () {
      d.remove();
    };
    setTimeout(function () {
      if (d.parentNode) d.remove();
    }, 6000);
  }
  function goldenSiiri() {
    var s = $s("s-svg");
    if (s) {
      s.classList.add("golden");
      setTimeout(function () {
        s.classList.remove("golden");
      }, 4200);
    }
    burst(220);
    setTimeout(function () {
      burst(160);
    }, 500);
    sndLvl();
    mood("cheer");
    var isNew = foundSecret("gold");
    eggSay("gold");
    if (isNew) {
      addXp(40);
    }
  }
  function tickleSiiri() {
    var s = $s("s-svg");
    buzz(30);
    if (s) {
      s.classList.add("giggle");
      setTimeout(function () {
        s.classList.remove("giggle");
      }, 1600);
    }
    tone(880, 0.08, 0);
    tone(1100, 0.08, 0.09);
    tone(1320, 0.12, 0.18);
    burst(50);
    var isNew = foundSecret("tickle");
    eggSay("tickle");
    if (isNew) {
      addXp(40);
    }
  }
  function snowfall() {
    snow(150);
    var isNew = foundSecret("snow");
    eggSay("snow");
    if (isNew) {
      addXp(40);
    }
  }
  function eggSay2(id, em) {
    var e = EGGS2[id];
    if (!e) return;
    speak(e.et);
    var d = overlay(
      '<div class="oc" style="border-color:#6B4FD8"><p class="kicker">🤫 Hemlighet!</p>' +
        '<div style="font-size:64px">' +
        em +
        "</div>" +
        '<h3 style="font-size:22px">' +
        esc(e.et) +
        "</h3><p>" +
        esc(e.sv) +
        "</p>" +
        '<button class="btn big wide" id="eggok2">Hihi!</button></div>',
    );
    d.style.background = "rgba(12,28,18,.55)";
    d.querySelector("#eggok2").onclick = function () {
      d.remove();
    };
    setTimeout(function () {
      if (d.parentNode) d.remove();
    }, 6000);
  }
  function eggReward(id, xp, stars) {
    var isNew = foundSecret(id);
    if (isNew) {
      addXp(xp || 40);
      if (stars) {
        S.stars += stars;
        save();
        refreshTop();
      }
    }
    return isNew;
  }
  function sneeze() {
    var s = $s("s-svg");
    if (s) {
      s.classList.add("wob");
      setTimeout(function () {
        s.classList.remove("wob");
      }, 700);
    }
    tone(880, 0.07, 0, "triangle");
    tone(420, 0.22, 0.08, "triangle");
    burst(40);
    eggReward("sneeze", 40);
    eggSay2("sneeze", "🤧");
  }
  function medalSpin() {
    var m = document.querySelector(".rankchip svg");
    if (m) {
      m.style.transition = "transform 1.2s cubic-bezier(.2,.8,.2,1)";
      m.style.transform = "rotate(720deg)";
      setTimeout(function () {
        m.style.transform = "rotate(0deg)";
      }, 1300);
    }
    burst(120);
    sndLvl();
    eggReward("medals", 40);
    eggSay2("medals", "🏅");
  }
  function comboTen() {
    if (diff().id === "svar" && (S.secrets || []).indexOf("hardten") < 0) {
      burst(220);
      setTimeout(function () {
        burst(160);
      }, 400);
      eggReward("hardten", 80, 40);
      eggSay2("hardten", "🔥");
      return;
    }
    if ((S.secrets || []).indexOf("ten") >= 0) return;
    burst(200);
    setTimeout(function () {
      burst(140);
    }, 400);
    eggReward("ten", 60, 10);
    eggSay2("ten", "🔟");
  }
  function yearRound() {
    snow(45);
    petals(45, ["#FFC7DC", "#FFE0EC"]);
    setTimeout(function () {
      petals(45, ["#E0A14A", "#C8762F"]);
    }, 400);
    eggReward("year", 40);
    eggSay2("year", "🌍");
  }
  function nightOwl() {
    var hh = new Date().getHours();
    if (hh < 21 && hh >= 5) return;
    if (S.owlseen === today()) return;
    S.owlseen = today();
    save();
    setTimeout(function () {
      mMood("sad");
      eggReward("owl", 40);
      eggSay2("night", "🌙");
      setTimeout(function () {
        mMood("");
      }, 2500);
    }, 1400);
  }

  function turtleEgg() {
    var isNew = eggReward("turtle", 100, 20);
    burst(140);
    sndLvl();
    var d = document.createElement("div");
    d.className = "combo";
    d.style.color = "var(--moss)";
    d.textContent = "🐢 +100";
    document.body.appendChild(d);
    setTimeout(function () {
      d.remove();
    }, 900);
    eggSay2("turtle", "🐢");
    checkBadges();
    refreshTop();
  }
  /* sköldpaddsknappen belönar den som håller kvar */
  var turtleT = null;
  document.addEventListener(
    "pointerdown",
    function (e) {
      var b = e.target.closest ? e.target.closest("button") : null;
      if (!b) return;
      var isTurtle = (b.textContent || "").indexOf("🐢") >= 0 || b.hasAttribute("data-slow");
      if (!isTurtle) return;
      clearTimeout(turtleT);
      turtleT = setTimeout(function () {
        turtleT = null;
        turtleEgg();
      }, 1400);
    },
    { passive: true },
  );
  function endTurtle() {
    if (turtleT) {
      clearTimeout(turtleT);
      turtleT = null;
    }
  }
  document.addEventListener("pointerup", endTurtle, { passive: true });
  document.addEventListener("pointercancel", endTurtle, { passive: true });
  document.addEventListener("pointerleave", endTurtle, { passive: true });

  /* långt tryck på Siiri + snabba tryck */
  var pressTimer = null,
    tapCount = 0,
    tapTimer = null;
  var noseTaps = 0,
    noseTimer = null;
  /* kittling: dra fingret fram och tillbaka över henne */
  var TK = { on: false, x: 0, dist: 0, turns: 0, lastDir: 0, t: 0, level: 0 };
  function tickleReset() {
    TK.on = false;
    TK.dist = 0;
    TK.turns = 0;
    TK.lastDir = 0;
    TK.level = 0;
  }
  function tickleMove(e) {
    if (!TK.on) return;
    /* fingret har glidit iväg: det är inte längre "håll in" (annars blev hon gyllene mitt i en kittling) */
    if (pressTimer && Math.abs(e.clientX - TK.sx) + Math.abs(e.clientY - TK.sy) > 12) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    var dx = e.clientX - TK.x;
    if (Math.abs(dx) < 16) return; /* små darrningar räknas inte */
    var dir = dx > 0 ? 1 : -1;
    if (TK.lastDir && dir !== TK.lastDir) TK.turns++;
    TK.lastDir = dir;
    TK.x = e.clientX;
    TK.dist += Math.abs(dx);
    var s = $s("s-svg");
    if (TK.turns >= 3 && TK.level < 1) {
      TK.level = 1;
      if (s) {
        s.classList.add("giggle");
      }
      mMood("cheer");
    }
    if (TK.turns >= 6 && TK.level < 2) {
      TK.level = 2;
      tone(1100, 0.06, 0);
      happyEyes(true);
    }
    if (TK.turns >= 10 && TK.level < 3) {
      TK.level = 3;
      if (s) s.classList.remove("giggle");
      tickleSiiri(); /* repliken och hemligheten */
      setTimeout(function () {
        dance(true);
      }, 420);
      tickleReset();
    }
  }
  document.addEventListener("pointermove", tickleMove, { passive: true });
  document.addEventListener(
    "pointerdown",
    function (e) {
      var nose = e.target.closest ? e.target.closest("#s-nose-hit") : null;
      if (nose) {
        noseTaps++;
        clearTimeout(noseTimer);
        noseTimer = setTimeout(function () {
          noseTaps = 0;
        }, 1500);
        tone(660, 0.05, 0);
        if (noseTaps >= 3) {
          noseTaps = 0;
          sneeze();
        }
        return;
      }
      var t = e.target.closest ? e.target.closest("#s-svg") : null;
      if (!t) return;
      TK.on = true;
      TK.x = TK.sx = e.clientX;
      TK.sy = e.clientY;
      TK.dist = 0;
      TK.turns = 0;
      TK.lastDir = 0;
      TK.level = 0;
      TK.t = Date.now();
      clearTimeout(pressTimer);
      pressTimer = setTimeout(function () {
        pressTimer = null;
        tapCount = 0;
        goldenSiiri();
      }, 1100);
    },
    { passive: true },
  );
  function endPress(e) {
    if (TK.on) {
      var s = $s("s-svg");
      if (s) s.classList.remove("giggle");
      if (TK.level > 0 && TK.level < 3) {
        happyEyes(false);
        mMood("");
      }
      tickleReset();
    }
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
      var t = e.target && e.target.closest ? e.target.closest("#s-svg") : null;
      if (t) {
        tapCount++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(function () {
          tapCount = 0;
        }, 1200);
        if (tapCount >= 6) {
          tapCount = 0;
          tickleSiiri();
          setTimeout(function () {
            dance(true);
          }, 420);
        }
      }
    }
  }
  document.addEventListener("pointerup", endPress, { passive: true });
  function cancelPress() {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
  document.addEventListener("pointercancel", cancelPress, { passive: true });
  /* släppt utanför fönstret: inget pointerup kommer */
  window.addEventListener("blur", cancelPress);

  /* ============ EGNA BILDER TILL ORD ============ */
  /* emojier räcker inte: 🏞️ betyder både sjö, flod och nationalpark.
       Orden nedan får egna ritade ikoner i stället. */
  var WORDART = window.SiiriData.WORDART;
  function wArt(et) {
    var a = WORDART[et];
    if (!a) return "";
    return '<svg class="wicon" viewBox="0 0 100 100" aria-hidden="true">' + a + "</svg>";
  }
  /* har ordet en bild som säkert stämmer? Läxord saknar bild (de hade bara 📝), och ett ord
       vars emoji är missvisande kan märkas med nopic: true i THEMES. Sådana ord visas utan
       ikon och hamnar aldrig i frågor där bilden är svaret. */
  function hasPic(w) {
    return !!(w && !w.school && !w.nopic && (WORDART[w.et] || (w.em && w.em !== "📝")));
  }
  /* ikon om vi ritat en, annars emoji – och hellre ingen alls än en som kan vara fel */
  function wIcon(w) {
    if (!hasPic(w)) return "";
    return wArt(w.et) || esc(w.em);
  }

  /* ============ SKOLANS GLOSOR ============ */
  /* Föräldern klistrar in veckans ord. De blandas in i alla lekar, prioriteras
       i urvalet, och faller bort av sig själva när barnet kan dem. */
  function schoolSet() {
    return S.school && S.school.words && S.school.words.length ? S.school : null;
  }
  function schoolDaysLeft() {
    var s = schoolSet();
    if (!s) return 0;
    var end = (s.added || today0()) + (s.days || 21);
    return end - today0();
  }
  function schoolKnows(w) {
    var mm = (S.wordmem || {})[mkey(w.et, w.sv)];
    return !!(mm && (mm.s || 0) >= 2 && (mm.r || 0) >= 3);
  }
  function schoolLeft() {
    var s = schoolSet();
    if (!s) return [];
    return s.words.filter(function (w) {
      return !schoolKnows(w);
    });
  }
  function schoolDone() {
    var s = schoolSet();
    if (!s) return 0;
    return s.words.length - schoolLeft().length;
  }
  /* läxord som redan mötts minst en gång (via läxkortet eller annars) - bara dessa vävs in
       i vanliga teman och stationer, så ett helt nytt läxord alltid introduceras av läxkortet
       först, aldrig kallt mitt i ett tidspressat spel */
  function schoolReadyWords() {
    var left = schoolLeft(),
      out = [],
      i,
      mm;
    for (i = 0; i < left.length; i++) {
      mm = (S.wordmem || {})[mkey(left[i].et, left[i].sv)];
      if (mm && (mm.r || 0) > 0) out.push(left[i]);
    }
    return out;
  }
  /* samma ord, men bytt mot ordbokens egen post om samma et-ord redan finns där sen innan -
       stationsspelen bygger på att peka ut en bild, och läxord saknar en säker egen (se hasPic) */
  function schoolPicWords() {
    var left = schoolReadyWords();
    if (!left.length) return [];
    var all = allWords(),
      out = [],
      i,
      j,
      src;
    for (i = 0; i < left.length; i++) {
      src = null;
      for (j = 0; j < all.length; j++) {
        if (!all[j].school && all[j].et === left[i].et && hasPic(all[j])) {
          src = all[j];
          break;
        }
      }
      /* behåller läxans egna et/sv (så ordminnet uppdateras på rätt post) - bara bilden lånas */
      if (src) out.push({ et: left[i].et, sv: left[i].sv, em: src.em });
    }
    return out;
  }
  /* städar bort hela omgången när tiden gått ut eller allt sitter */
  function schoolSweep() {
    var s = schoolSet();
    if (!s) return;
    if (schoolLeft().length === 0 || schoolDaysLeft() < 0) {
      if (!S.schoolDoneSets) S.schoolDoneSets = [];
      S.schoolDoneSets.push({ name: s.name, n: s.words.length, done: schoolDone(), when: today0() });
      S.school = null;
      save();
    }
  }
  function schoolParse(txt) {
    var lines = (txt || "").split(/[\n\r]+/),
      out = [],
      bad = [],
      i;
    for (i = 0; i < lines.length; i++) {
      var l = lines[i].trim();
      if (!l) continue;
      var parts = l.split(/\s*(?:=|;|\t|\u2013|\u2014| - |,)\s*/);
      if (parts.length < 2 || !parts[0] || !parts[1]) {
        bad.push(l);
        continue;
      }
      var et = parts[0].trim(),
        sv = parts[1].trim();
      if (et.length > 40 || sv.length > 40) {
        bad.push(l);
        continue;
      }
      out.push({ et: et, sv: sv, em: "📝", hint: et, school: true });
    }
    return { words: out.slice(0, 40), bad: bad };
  }
  function schoolHasAudio(et) {
    return !!(bank()[et] || partFor(et));
  }

  /* ---------- uttal till egna glosor ----------
       Ord som saknar inspelning hämtas från Neurokõne (Tartu universitet, rösten Mari –
       samma som resten av appen) och sparas i service workerns cache, så att de
       fungerar offline. Samma inställningar som tools/generate_audio.py. */
  var TTS_API = "https://api.tartunlp.ai/text-to-speech/v2";
  var TTS_CACHE = "siilikool"; /* samma cache som sw.js */
  var TTS_DIR = "audio/clips/school/";
  var TTS_SPEED = { normal: 0.95, slow: 0.6 },
    TTS_RMS = { normal: 0.148, slow: 0.12 };
  var ttsRun = null;
  function ttsOk() {
    return !!(window.caches && window.fetch && window.Promise && window.DataView);
  }
  function ttsUrl(et, kind) {
    var h = 5381,
      i;
    for (i = 0; i < et.length; i++) h = ((h * 33) ^ et.charCodeAt(i)) >>> 0;
    var s =
      et
        .toLowerCase()
        .replace(/[õö]/g, "o")
        .replace(/[äå]/g, "a")
        .replace(/ü/g, "u")
        .replace(/š/g, "s")
        .replace(/ž/g, "z")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "ord";
    return new URL(TTS_DIR + kind + "/" + s + "-" + h.toString(36) + ".wav", location.href).href;
  }
  function ttsFetch(text, speed) {
    /* utan avslutande skiljetecken tappar rösten sista ljudet ("Sinakas" -> "sinaka") */
    if (!/[.!?…]$/.test(text)) text += ".";
    var tries = 0;
    function go() {
      var ctl = window.AbortController ? new AbortController() : null;
      var t = ctl
        ? setTimeout(function () {
            ctl.abort();
          }, 45000)
        : 0;
      return fetch(TTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "audio/wav" },
        body: JSON.stringify({ text: text, speaker: "mari", speed: speed }),
        signal: ctl ? ctl.signal : undefined,
      })
        .then(function (r) {
          clearTimeout(t);
          if (!r.ok) throw new Error("tts " + r.status);
          return r.arrayBuffer();
        })
        .catch(function (e) {
          clearTimeout(t);
          if (++tries < 3)
            return new Promise(function (res) {
              setTimeout(res, 2000 * tries);
            }).then(go);
          throw e;
        });
    }
    return go();
  }
  /* läser wav (16-bit eller float) till mono-flyttal */
  function wavRead(buf) {
    var v = new DataView(buf),
      p = 12,
      fmt = null,
      data = null;
    while (p + 8 <= v.byteLength) {
      var id = String.fromCharCode(v.getUint8(p), v.getUint8(p + 1), v.getUint8(p + 2), v.getUint8(p + 3)),
        sz = v.getUint32(p + 4, true);
      if (id === "fmt ")
        fmt = {
          tag: v.getUint16(p + 8, true),
          ch: v.getUint16(p + 10, true),
          sr: v.getUint32(p + 12, true),
          bits: v.getUint16(p + 22, true),
        };
      else if (id === "data") {
        data = { off: p + 8, len: Math.min(sz, v.byteLength - p - 8) };
        break;
      }
      p += 8 + sz + (sz & 1);
    }
    if (!fmt || !data) return null;
    var flt = fmt.tag === 3 || (fmt.tag === 0xfffe && fmt.bits === 32),
      by = fmt.bits / 8;
    if (!flt && fmt.bits !== 16) return null;
    var n = Math.floor(data.len / by / fmt.ch),
      s = new Float32Array(n),
      i,
      c,
      o,
      sum;
    for (i = 0; i < n; i++) {
      for (sum = 0, c = 0; c < fmt.ch; c++) {
        o = data.off + (i * fmt.ch + c) * by;
        sum += flt ? v.getFloat32(o, true) : v.getInt16(o, true) / 32768;
      }
      s[i] = sum / fmt.ch;
    }
    return { sr: fmt.sr, s: s };
  }
  /* klipper tystnaden till 0,25 s, jämnar ut nivån och skriver 16-bit mono-wav */
  function wavShape(w, kind) {
    var s = w.s,
      max = 0,
      i,
      a = -1,
      b = -1,
      sq = 0;
    for (i = 0; i < s.length; i++) if (Math.abs(s[i]) > max) max = Math.abs(s[i]);
    for (i = 0; i < s.length; i++)
      if (Math.abs(s[i]) > 0.02 * max) {
        if (a < 0) a = i;
        b = i;
      }
    if (a < 0) return null;
    for (i = a; i <= b; i++) sq += s[i] * s[i];
    var gain = TTS_RMS[kind] / Math.max(1e-6, Math.sqrt(sq / (b - a + 1)));
    var pad = Math.round(0.25 * w.sr),
      n = b - a + 1 + 2 * pad;
    var out = new DataView(new ArrayBuffer(44 + n * 2));
    function str(o, t) {
      for (var k = 0; k < 4; k++) out.setUint8(o + k, t.charCodeAt(k));
    }
    str(0, "RIFF");
    out.setUint32(4, 36 + n * 2, true);
    str(8, "WAVE");
    str(12, "fmt ");
    out.setUint32(16, 16, true);
    out.setUint16(20, 1, true);
    out.setUint16(22, 1, true);
    out.setUint32(24, w.sr, true);
    out.setUint32(28, w.sr * 2, true);
    out.setUint16(32, 2, true);
    out.setUint16(34, 16, true);
    str(36, "data");
    out.setUint32(40, n * 2, true);
    for (i = a; i <= b; i++)
      out.setInt16(44 + (pad + i - a) * 2, Math.round(Math.max(-0.98, Math.min(0.98, s[i] * gain)) * 32767), true);
    return new Blob([out.buffer], { type: "audio/wav" });
  }
  /* med service worker spelas klippet från cachen via sin adress, annars som blob */
  function ttsUse(et, kind, url, blob) {
    var src = navigator.serviceWorker && navigator.serviceWorker.controller ? url : URL.createObjectURL(blob);
    (kind === "slow" ? BANKS.slow : BANKS.normal)[et] = src;
  }
  /* ett ords uttal (normal/långsam): från cachen, annars från Neurokõne – sparas i cachen.
       Löftet ger "made" (hämtat), "hit" (fanns), "offline" eller "failed". */
  function ttsClip(c, et, kind) {
    var url = ttsUrl(et, kind);
    return c.match(url).then(function (hit) {
      if (hit)
        return hit.blob().then(function (bl) {
          ttsUse(et, kind, url, bl);
          return "hit";
        });
      if (navigator.onLine === false) return "offline";
      return ttsFetch(et, TTS_SPEED[kind])
        .then(function (buf) {
          var w = wavRead(buf),
            bl = w && wavShape(w, kind);
          if (!bl) throw new Error("tomt ljud");
          return c.put(url, new Response(bl, { headers: { "Content-Type": "audio/wav" } })).then(function () {
            ttsUse(et, kind, url, bl);
            return "made";
          });
        })
        .catch(function () {
          return "failed";
        });
    });
  }
  /* glosornas ord som saknar inspelning och därför behöver hämtat uttal */
  function ttsNeeds(et) {
    var src = BANKS.normal[et];
    return !(
      partFor(et) ||
      (src && src.indexOf("/" + TTS_DIR) < 0 && src.indexOf(TTS_DIR) !== 0 && src.indexOf("blob:") !== 0)
    );
  }
  /* glosorna i alla profiler på enheten – deras uttal får inte städas bort när en annan spelare spelar */
  function allSchoolWords() {
    var out = [];
    STORE.playerSaves().forEach(function (raw) {
      var p = raw && raw.school && raw.school.words;
      if (p)
        p.forEach(function (w) {
          if (w && w.et) out.push(w.et);
        });
    });
    return out;
  }
  /* ett glosord utan ljud spelas upp: hämta uttalet nu (en gång per ord och session) */
  var ttsAsked = {};
  function ttsNow(et, kind) {
    if (!ttsOk() || ttsAsked[kind + ":" + et]) return Promise.resolve(false);
    ttsAsked[kind + ":" + et] = 1;
    return caches
      .open(TTS_CACHE)
      .then(function (c) {
        return ttsClip(c, et, kind);
      })
      .then(function (r) {
        return r === "made" || r === "hit";
      })
      .catch(function () {
        return false;
      });
  }
  function isSchoolWord(et) {
    var s = schoolSet();
    return !!(
      s &&
      s.words.some(function (w) {
        return w.et === et;
      })
    );
  }
  /* exakt samma text som ett fält barnet själv skrivit i ett samtal (S.petName/favFood/
     roomColor, se chats.ts) - inte en delsträng, så en hel ihopbyggd mening (som råkar
     innehålla t.ex. husdjurets namn) aldrig skickas i sin helhet till Neurokõne. */
  function isPersonalWord(et) {
    var t = (et || "").trim();
    return !!(
      t &&
      (t === (S.petName || "").trim() ||
        t === (S.favFood || "").trim() ||
        t === (S.roomColor || "").trim() ||
        t === (S.favSubject || "").trim() ||
        t === (S.favSeason || "").trim())
    );
  }
  /* epilogens fyra nya ord (Kalevipoja rajal) hann aldrig in i det förinspelade ljudbanken -
     utan detta spelades inget alls upp på enheter utan estnisk systemröst. */
  function isEpilogueWord(et) {
    var t = (et || "").trim();
    return EPILOGUE.stops.some(function (s) {
      return s.word.et === t;
    });
  }
  /* samma sak för Siiri köök (KITCHEN_RECIPES) - lärdomen från epilogen tillämpad direkt från
     start den här gången, inte som en efterhandsfix: stegens instruktioner, ingrediensen och
     alla resultatkortens texter/namn hämtas live precis som skolans glosor. */
  var KITCHEN_TTS_WORDS = (function () {
    var set = {};
    KITCHEN_RECIPES.forEach(function (r) {
      r.steps.forEach(function (s) {
        set[s.et] = 1;
        if (s.ingredient) set[s.ingredient.et] = 1;
      });
      var outs = [r.perfect].concat(
        Object.keys(r.miss).map(function (k) {
          return r.miss[k];
        }),
      );
      outs.forEach(function (o) {
        set[o.et] = 1;
        set[o.name.et] = 1;
      });
    });
    return set;
  })();
  function isKitchenWord(et) {
    return !!KITCHEN_TTS_WORDS[(et || "").trim()];
  }
  /* ord värda att hämta uttal live för när de saknar förinspelat ljud - antingen en glosa
     från läxlistan eller något barnet själv skrivit, se speak(). */
  function needsLiveTts(et) {
    return isSchoolWord(et) || isPersonalWord(et) || isEpilogueWord(et) || isKitchenWord(et);
  }
  /* ser till att alla ord i glosorna har ljud: tar från cachen, hämtar det som saknas
       och rensar bort ljud från gamla listor. onProgress(klara, totalt) är valfri.
       Kommer en ny lista medan det pågår (t.ex. från familjen) körs det en gång till efteråt. */
  var ttsAgain = false;
  function schoolAudio(onProgress) {
    if (!ttsOk()) return Promise.resolve({ made: 0, failed: 0 });
    if (ttsRun) {
      ttsAgain = true;
      return ttsRun;
    }
    var s = schoolSet(),
      words = s
        ? s.words.map(function (w) {
            return w.et;
          })
        : [],
      want = {},
      todo = [];
    /* uttal som ska sparas: alla profilers glosor, inte bara den som spelas nu */
    allSchoolWords().forEach(function (et) {
      ["normal", "slow"].forEach(function (kind) {
        want[ttsUrl(et, kind)] = 1;
      });
    });
    words.forEach(function (et) {
      /* riktig inspelning finns (långsamt spelas den då i lägre takt) – hämta inget */
      if (!ttsNeeds(et)) return;
      ["normal", "slow"].forEach(function (kind) {
        if (!(kind === "slow" ? BANKS.slow : BANKS.normal)[et]) todo.push({ et: et, kind: kind });
      });
    });
    var made = 0,
      failed = 0,
      done = 0;
    ttsRun = caches
      .open(TTS_CACHE)
      .then(function (c) {
        /* städa: ljud till ord som inte längre finns i någon lista */
        var prune = c.keys().then(function (keys) {
          return Promise.all(
            keys
              .filter(function (k) {
                return k.url.indexOf("/" + TTS_DIR) >= 0 && !want[k.url];
              })
              .map(function (k) {
                return c.delete(k);
              }),
          );
        });
        var i = 0;
        function next() {
          if (i >= todo.length) return;
          var t = todo[i++];
          return ttsClip(c, t.et, t.kind)
            .then(function (r) {
              if (r === "made") made++;
              else if (r !== "hit") failed++;
              done++;
              if (onProgress) onProgress(done, todo.length);
            })
            .then(next);
        }
        return Promise.all([prune, next(), next()]);
      })
      .catch(function () {})
      .then(function () {
        ttsRun = null;
        if (ttsAgain) {
          ttsAgain = false;
          schoolAudio();
        }
        return { made: made, failed: failed, total: todo.length };
      });
    return ttsRun;
  }
  function schoolImport() {
    screen = "school";
    btnBack.hidden = false;
    var s = schoolSet();
    var html =
      '<div class="zone words"><span class="zem">📝</span><span><b>Koolisõnad</b>' +
      "<span>" +
      (childDevice() ? "Skolans glosor — från de vuxna i familjen" : "Skolans glosor — klistra in veckans ord") +
      "</span></span></div>";
    if (s) {
      var left = schoolLeft().length,
        d = schoolDaysLeft();
      html +=
        '<div class="card"><p class="kicker">' +
        esc(s.name || "Veckans ord") +
        "</p>" +
        '<p class="qsub"><b>' +
        schoolDone() +
        " av " +
        s.words.length +
        "</b> sitter · " +
        (d > 0 ? d + " dagar kvar" : "sista dagen") +
        '</p><div class="schoolwrap">';
      var i;
      for (i = 0; i < s.words.length; i++) {
        var w = s.words[i],
          ok = schoolKnows(w);
        html +=
          '<div class="schoolrow' +
          (ok ? " done" : "") +
          '"><span class="sw">' +
          esc(w.et) +
          "</span>" +
          '<span class="ss">' +
          esc(w.sv) +
          "</span>" +
          '<span class="sa">' +
          (ok ? "✓ " : "") +
          (schoolHasAudio(w.et)
            ? '<button class="speakbtn sm" data-say="' +
              esc(w.et) +
              '" aria-label="Hör ordet">🔊</button>' +
              '<button class="speakbtn sm" data-slow="' +
              esc(w.et) +
              '" aria-label="Hör ordet långsamt">🐢</button>'
            : ok
              ? ""
              : "—") +
          "</span></div>";
      }
      html +=
        '</div><button class="btn green big wide" id="schoolplay" style="margin-top:10px">▶️ Öva på orden</button>' +
        /* glosor från familjen tas bort av de vuxna i Familjen */
        (s.cloudId || childDevice()
          ? '<p class="qsub" style="margin-top:8px">Glosorna kommer från familjen – de vuxna byter dem i Familjen.</p>'
          : '<button class="btn ghost wide" id="schoolclear" style="margin-top:8px">Ta bort listan</button>') +
        "</div>";
    }
    if (childDevice()) {
      if (!s)
        html +=
          '<div class="card"><p class="kicker">Inga glosor just nu</p>' +
          '<p class="qsub">När en vuxen lägger in veckans ord i Familjen dyker de upp här.</p></div>';
      app.innerHTML = html;
      schoolBind();
      return;
    }
    html +=
      '<div class="card"><p class="kicker">Klistra in orden</p>' +
      '<p class="qsub">Ett ord per rad: <b>estniska = svenska</b>. Komma, semikolon eller tabb fungerar också.</p>' +
      '<textarea id="schooltxt" class="schooltext" rows="8" placeholder="koer = hund&#10;maja = hus&#10;punane = röd"></textarea>' +
      '<div class="row" style="margin-top:8px"><input id="schoolname" class="namefield" type="text" placeholder="Namn, t.ex. Vecka 41" maxlength="24">' +
      '<input id="schooldays" class="namefield" type="number" min="3" max="60" value="14" style="max-width:92px"></div>' +
      '<p class="qsub">Antal dagar listan ska gälla. Ord som sitter faller bort tidigare.</p>' +
      '<button class="btn green big wide" id="schoolsave">Lägg till i spelet</button>' +
      '<div id="schoolmsg"></div></div>';
    app.innerHTML = html;
    schoolBind();
    document.getElementById("schoolsave").onclick = schoolSaveClick;
  }
  /* knapparna i listan (öva, ta bort, lyssna) */
  function schoolBind() {
    var cl = document.getElementById("schoolclear");
    if (cl)
      cl.onclick = function () {
        S.school = null;
        save();
        schoolAudio();
        schoolImport();
      };
    var pl = document.getElementById("schoolplay");
    if (pl)
      pl.onclick = function () {
        go(schoolLessonStart, true);
      };
    var ssay = app.querySelectorAll("[data-say],[data-slow]"),
      si;
    for (si = 0; si < ssay.length; si++) {
      (function (el) {
        el.onclick = function () {
          var w = el.getAttribute("data-say");
          if (w) speak(w);
          else speak(el.getAttribute("data-slow"), true);
        };
      })(ssay[si]);
    }
  }
  /* "Lägg till i spelet": glosorna som klistrats in */
  function schoolSaveClick() {
    var txt = document.getElementById("schooltxt").value;
    var r = schoolParse(txt),
      msg = document.getElementById("schoolmsg");
    if (!r.words.length) {
      msg.innerHTML =
        '<p class="qsub" style="color:var(--berry)">Hittade inga ordpar. Skriv ett ord per rad med = mellan.</p>';
      return;
    }
    var withAudio = 0,
      i;
    for (i = 0; i < r.words.length; i++) if (schoolHasAudio(r.words[i].et)) withAudio++;
    S.school = {
      name: (document.getElementById("schoolname").value || "").trim() || "Veckans ord",
      words: r.words,
      added: today0(),
      days: Math.max(3, Math.min(60, parseInt(document.getElementById("schooldays").value, 10) || 14)),
    };
    save();
    var head =
      '<p class="qsub" style="color:var(--moss)"><b>' +
      r.words.length +
      " ord tillagda.</b> " +
      withAudio +
      " av dem har inspelad röst." +
      (r.bad.length ? "<br>" + r.bad.length + " rader kunde inte läsas." : "") +
      "</p>";
    msg.innerHTML = head;
    burst(60);
    fanfare(2);
    var t0 = Date.now();
    /* hämta uttal till resten; skärmen ritas om när det är klart (minst 0,9 s, som förut) */
    schoolAudio(function (n, tot) {
      msg.innerHTML = head + '<p class="qsub">🎙️ Hämtar uttal … ' + n + " av " + tot + "</p>";
    }).then(function (res) {
      if (res.failed)
        msg.innerHTML =
          head +
          '<p class="qsub" style="color:var(--berry)">' +
          Math.ceil(res.failed / 2) +
          " ord fick inget uttal just nu. Siiri försöker igen nästa gång appen är online.</p>";
      setTimeout(
        function () {
          if (screen === "school") schoolImport();
        },
        Math.max(0, (res.failed ? 2600 : 900) - (Date.now() - t0)),
      );
    });
  }

  /* ============ ORDMINNE ============ */
  /* varje ord får en vikt: fel höjer den, rätt sänker den. Tunga ord dyker upp oftare. */
  function today0() {
    return Math.floor(Date.now() / 86400000);
  }
  /* samma estniska ord kan betyda två olika saker (t.ex. "must" = svart/smutsig).
       sådana ord nycklas på et+sv så att den ena betydelsen inte räknas som kunskap om den andra. */
  var AMBIG_ET = (function () {
    var seen = {},
      dup = {},
      i,
      j,
      w,
      lists = [];
    for (i = 0; i < THEMES.length; i++) lists.push(THEMES[i].words);
    for (i = 0; i < TRIP.length; i++) lists.push(TRIP[i].words);
    for (i = 0; i < lists.length; i++) {
      for (j = 0; j < lists[i].length; j++) {
        w = lists[i][j];
        if (seen.hasOwnProperty(w.et) && seen[w.et] !== w.sv) dup[w.et] = true;
        seen[w.et] = w.sv;
      }
    }
    return dup;
  })();
  function mkey(et, sv) {
    return AMBIG_ET[et] ? et + "" + sv : et;
  }
  function wmem(et, sv) {
    if (!S.wordmem) S.wordmem = {};
    var k = mkey(et, sv);
    if (!S.wordmem[k]) S.wordmem[k] = { w: 1, r: 0, m: 0, d: today0(), s: 0 };
    return S.wordmem[k];
  }
  /* rätt svar skjuter fram nästa repetition: 1, 2, 4, 8, 16, 30 dagar.
       Fel nollställer intervallet. Att skriva eller säga ordet väger tyngre än att peka ut det. */
  function wmemHit(et, ok, mode, sv) {
    var m = wmem(et, sv);
    m.d = today0();
    if (ok) {
      m.r++;
      var strong = mode === "type" || mode === "speak";
      m.s = strong ? Math.min(6, (m.s || 0) + 1) : Math.min(3, (m.s || 0) + 0.5);
      m.w = Math.max(0.35, m.w * (strong ? 0.45 : 0.7));
    } else {
      m.m++;
      m.s = 0;
      m.w = Math.min(16, m.w + 2.2);
    }
    save();
  }
  /* meningsbyggarens ord är ofta böjda former ("sõidame", inte "sõita"),
     så bara de som exakt matchar ett riktigt ordförrådsord räknas in i
     ordminnet - annars skulle böjningsformer skräpa ner S.wordmem utan
     att någonsin repeteras på riktigt */
  function wmemHitSentenceWords(words, ok) {
    var pool = allWords(),
      i,
      j,
      token,
      match;
    for (i = 0; i < words.length; i++) {
      token = words[i].toLowerCase();
      match = null;
      for (j = 0; j < pool.length; j++) {
        if (pool[j].et.toLowerCase() === token) {
          match = pool[j];
          break;
        }
      }
      if (match) wmemHit(match.et, ok, "choose", match.sv);
    }
  }
  function wmemDue(et, sv) {
    var m = (S.wordmem || {})[mkey(et, sv)];
    if (!m) return 0;
    var gaps = [1, 2, 4, 8, 16, 30, 45];
    var gap = gaps[Math.min(6, Math.round(m.s || 0))] || 1;
    return today0() - (m.d || today0()) - gap;
  }
  function wordWeight(et, sv) {
    var sc = schoolSet(),
      i;
    if (sc)
      for (i = 0; i < sc.words.length; i++)
        if (sc.words[i].et === et && !schoolKnows(sc.words[i])) return 6.5; /* skolans ord först */
    var m = (S.wordmem || {})[mkey(et, sv)];
    if (!m) return 2.2;
    /* en gammal eller trasig minnespost får inte göra vikten till NaN */
    var base = typeof m.w === "number" && isFinite(m.w) ? m.w : 1;
    var w = Math.max(0.3, base),
      due = wmemDue(et, sv);
    if (isFinite(due) && due >= 0) w += 2.6 + Math.min(5, due * 0.5); /* förfallna ord går före */
    else w *= 0.35;
    return isFinite(w) ? w : 1;
  }
  /* drar n ord ur en lista, viktat så svåra ord kommer oftare */
  function pickWeighted(pool, n) {
    var left = pool.slice(),
      out = [],
      i,
      tot,
      r,
      acc;
    n = Math.min(n, left.length);
    var guard = 0;
    while (out.length < n && left.length && guard++ < 400) {
      tot = 0;
      for (i = 0; i < left.length; i++) tot += wordWeight(left[i].et, left[i].sv);
      if (!isFinite(tot) || tot <= 0) {
        /* kan inte vikta – ta dem i ordning */
        out.push(left.shift());
        continue;
      }
      r = Math.random() * tot;
      acc = 0;
      var took = false;
      for (i = 0; i < left.length; i++) {
        acc += wordWeight(left[i].et, left[i].sv);
        if (r <= acc) {
          out.push(left[i]);
          left.splice(i, 1);
          took = true;
          break;
        }
      }
      if (!took) out.push(left.shift()); /* avrundning kan missa – ta första */
    }
    return out;
  }
  function hardWords(limit) {
    var all = allWords(),
      out = [],
      i;
    for (i = 0; i < all.length; i++) {
      var m = (S.wordmem || {})[mkey(all[i].et, all[i].sv)];
      if (m && (m.w > 1.6 || wmemDue(all[i].et, all[i].sv) >= 0)) out.push({ w: all[i], m: m });
    }
    out.sort(function (a, b) {
      return b.m.w - a.m.w;
    });
    return out.slice(0, limit || 8);
  }

  /* ============ HJÄLP ============ */
  function shuffle(a) {
    var i, j, t;
    a = a.slice();
    for (i = a.length - 1; i > 0; i--) {
      j = (Math.random() * (i + 1)) | 0;
      t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function starStr(n) {
    var s = "",
      i;
    for (i = 0; i < 3; i++) s += i < n ? "★" : "☆";
    return s;
  }
  /* stjärnorna växer med märket så de stora målen blir nåbara */
  function starMult() {
    return 1 + Math.floor(rankIndex(S.xp) / 3);
  }
  function earnStars(n) {
    S.stars += Math.round(n * starMult());
  }
  function addXp(n, ev) {
    var before = rankIndex(S.xp);
    S.xp += n;
    var after = rankIndex(S.xp);
    save();
    refreshTop();
    if (ev) flyXp(n, ev);
    if (after > before) {
      S.rank = after;
      save();
      setTimeout(function () {
        rankUp(before, after);
      }, 700);
    }
  }
  function flyXp(n, ev) {
    try {
      var d = document.createElement("div");
      d.className = "xpfly";
      d.textContent = "+" + n;
      var x = (ev && ev.clientX) || innerWidth / 2,
        y = (ev && ev.clientY) || innerHeight / 2;
      d.style.left = x - 16 + "px";
      d.style.top = y - 30 + "px";
      document.body.appendChild(d);
      setTimeout(function () {
        d.remove();
      }, 1000);
    } catch (e) {}
  }
  function comboFlash(n) {
    var d = document.createElement("div");
    d.className = "combo";
    d.textContent = (n >= 5 ? "🔥 " : "") + "Kombo x" + n + "!";
    document.body.appendChild(d);
    setTimeout(function () {
      d.remove();
    }, 900);
  }
  function checkBadges() {
    var newOnes = [],
      i;
    for (i = 0; i < BADGES.length; i++) {
      if (S.badges.indexOf(BADGES[i].id) < 0 && BADGES[i].test(S)) {
        S.badges.push(BADGES[i].id);
        newOnes.push(BADGES[i]);
      }
    }
    if (newOnes.length) save();
    return newOnes;
  }
  /* hur nära en olåst bragd man är - visas som "x/y" så barnet ser målet
     komma närmare (goal-gradient: synlig närhet ökar motivationen) */
  /* hur långt spelaren har kommit mot ett märke: [nu, mål] eller null (app/utils/badges.ts) */
  function badgeProgress(b, s) {
    return window.SiiriData.badgeProgress(b, s);
  }
  function badgeChip(b) {
    var has = S.badges.indexOf(b.id) >= 0;
    if (has) return '<span class="badge">' + b.em + " " + esc(b.sv) + "</span>";
    var p = badgeProgress(b, S);
    return (
      '<span class="badge" style="opacity:.35;filter:grayscale(1)">' +
      b.em +
      " " +
      esc(b.sv) +
      (p ? '<small style="opacity:.8;font-weight:700">' + p[0] + "/" + p[1] + "</small>" : "") +
      "</span>"
    );
  }
  /* liten flytande toast, samma mönster som "Raske sõna ×2"-rutan - visas
     direkt istället för att vänta till rundans slut */
  function badgeToast(newOnes, i) {
    i = i || 0;
    if (i >= newOnes.length) return;
    var b = newOnes[i];
    var d = document.createElement("div");
    d.className = "combo hardwin";
    d.innerHTML = b.em + " Nytt märke: " + esc(b.sv);
    document.body.appendChild(d);
    sndLvl();
    setTimeout(function () {
      d.remove();
    }, 1600);
    if (i + 1 < newOnes.length) setTimeout(badgeToast, 1300, newOnes, i + 1);
  }

  /* ============ SKÄRMAR ============ */
  var screen = "home";
  var lastSpokenText = "";
  /* läses av buggrapporten (useBugReport.ts, via window.SiiriDebug) som teknisk kontext -
     vilken skärm och vilket ord som senast spelades upp - utan att den som rapporterar
     behöver beskriva det själv. */
  window.SiiriDebug = {
    screen: function () {
      return screen;
    },
    lastSpoken: function () {
      return lastSpokenText;
    },
  };
  /* toppfältet (profil, märke, stjärnor) och nivåmätaren */
  function showTop(on) {
    var t = document.querySelector(".topbar"),
      m = document.querySelector(".meter");
    if (t) t.hidden = !on;
    if (m) m.hidden = !on;
  }
  function go(fn, isSub) {
    showTop(true);
    btnBack.hidden = !isSub;
    window.scrollTo(0, 0);
    /* riktning: inåt när man öppnar något, utåt när man går tillbaka */
    app.classList.remove("back");
    if (!isSub) app.classList.add("back");
    void app.offsetWidth;
    fn();
  }

  /* teman låses upp efterhand så man slipper välja bland sexton på en gång */

  function themeMastery(t) {
    var i,
      strong = 0,
      m;
    for (i = 0; i < t.words.length; i++) {
      m = (S.wordmem || {})[mkey(t.words[i].et, t.words[i].sv)];
      if (m && (m.s || 0) >= 2) strong++;
    }
    var p = strong / t.words.length;
    return {
      pct: Math.round(p * 100),
      strong: strong,
      total: t.words.length,
      medal: p >= 0.95 ? "gold" : p >= 0.7 ? "silver" : p >= 0.4 ? "bronze" : "",
    };
  }
  function masteryEm(m) {
    return m === "gold" ? "🥇" : m === "silver" ? "🥈" : m === "bronze" ? "🥉" : "";
  }
  function themesDone() {
    var n = 0,
      k;
    for (k in S.best || {}) {
      if (S.best[k] > 0) n++;
    }
    return n;
  }
  function themesUnlocked() {
    return Math.min(THEMES.length, 4 + themesDone() * 2);
  }
  /* vad "Mängime!" gör just nu */
  function nextUp() {
    var hw = hardWords(99);
    if (hw.length >= 6) return { kind: "hard", sv: "öva orden som vacklar", et: UI.hard.et };
    var lim = themesUnlocked(),
      i,
      t;
    for (i = 0; i < lim && i < THEMES.length; i++) {
      t = THEMES[i];
      if (!(S.best[t.id] > 0)) return { kind: "theme", t: t, sv: esc(t.sv), et: t.et };
    }
    for (i = 0; i < lim && i < THEMES.length; i++) {
      t = THEMES[i];
      if ((S.best[t.id] || 0) < 3) return { kind: "theme", t: t, sv: esc(t.sv), et: t.et };
    }
    return { kind: "mix", sv: "blandade ord från allt du kan", et: UI.mix.et };
  }
  function startNext() {
    var n = nextUp();
    if (n.kind === "theme") {
      speak(n.t.et);
      go(function () {
        lessonStart(n.t.id);
      }, true);
    } else if (n.kind === "hard") {
      speak(UI.hard.et);
      go(speedIntro, true);
    } else {
      speak(UI.mix.et);
      go(speedIntro, true);
    }
  }
  var sessionStart = Date.now(),
    pauseShown = false;
  function checkPause() {
    if (pauseShown || Date.now() - sessionStart < 40 * 60 * 1000) return;
    pauseShown = true;
    var d = overlay(
      '<div class="oc"><p class="kicker">Siiri sträcker på sig</p><div style="font-size:52px">🫖</div>' +
        "<h3>Dags för en paus?</h3><p>Ni har hållit på i fyrtio minuter. Orden sitter bättre om man vilar en stund emellan.</p>" +
        '<button class="btn green big wide" id="pz">Okej, vi pausar</button>' +
        '<button class="btn ghost wide" id="pn" style="margin-top:8px">Vi fortsätter lite till</button></div>',
    );
    d.querySelector("#pz").onclick = function () {
      d.remove();
      go(homeScreen, false);
    };
    d.querySelector("#pn").onclick = function () {
      d.remove();
      sessionStart = Date.now();
      pauseShown = false;
    };
  }
  function homeScreen() {
    checkPause();
    idleKick();
    screen = "home";
    newDay();
    var i,
      t,
      html = "",
      n = nextUp(),
      p = questProgress(),
      se = seasonNow(),
      hol = holidayNow(),
      gr = greetingNow();
    var ri = rankIndex(S.xp),
      nxt = RANKS[ri + 1];

    /* spellägen: beräknas tidigt så den minst prövade leken kan erbjudas
       som ett riktigt ALTERNATIV till den gröna knappens eget förslag -
       annars väljer algoritmen allt och barnet får ingen egen vilja med. */
    /* fast ordning, så barnet hittar sin lek på samma plats varje gång.
       En färg per grupp (gör/öva/tävla) – färgen betyder något, i stället för åtta olika. */
    var MODES = [
      { k: "otsi", em: "🔍", et: "Otsi!", sv: "Hitta det Siiri säger", grp: "gör" },
      { k: "mem", em: "🃏", et: "Mälumäng", sv: "Memory", grp: "gör" },
      { k: "rain", em: "🌧️", et: "Sõnasadu", sv: "Ordregnet", grp: "gör" },
      { k: "boat", em: "🛶", et: "Paadisõit", sv: "Barkbåten", grp: "gör" },
      { k: "kok", em: "🥨", et: "Siiri köök", sv: "Siiri kök", grp: "gör" },
      { k: "speed", em: "🎲", et: esc(UI.mix.et), sv: esc(UI.mix.sv), grp: "öva" },
      { k: "sent", em: "🧩", et: esc(UI.sent.et), sv: esc(UI.sent.sv), grp: "öva" },
      { k: "talk", em: "💬", et: esc(UI.talk.et), sv: esc(UI.talk.sv), grp: "öva" },
      { k: "duel", em: "⚔️", et: "Duell", sv: "Tävla mot ett djur", grp: "tävla" },
      { k: "chal", em: "🤝", et: "Väljakutse", sv: "Utmana en vuxen", grp: "tävla" },
    ];
    if (!S.tried) S.tried = {};
    /* alternativet bredvid den gröna knappen: den minst prövade leken (rutorna själva flyttas inte) */
    var altMode = MODES.slice().sort(function (x, y) {
      return (S.tried[x.k] || 0) - (S.tried[y.k] || 0);
    })[0];

    /* Siiri och hälsningen först; årstiden är en liten rad i hälsningen (tryck = hör ordet) */
    html +=
      '<div class="hero"><div class="herorow">' +
      siilSVG("small") +
      '<div style="flex:1"><h1>' +
      esc(gr.et) +
      (S.name ? ", " + esc(S.name) : "") +
      "!" +
      "</h1>" +
      '<button class="seasonbar" type="button">' +
      (hol ? hol.em : se.em) +
      ' <b lang="et">' +
      esc(hol ? hol.et : se.et) +
      "</b>" +
      "<span>" +
      (hol ? esc(hol.sv) : esc(se.word.et) + " = " + esc(se.word.sv)) +
      "</span></button>" +
      '<button class="bubble" id="hello">🔊 Tere' +
      (S.name ? ", " + esc(S.name) : "") +
      "!" +
      "<small>Hej" +
      (S.name ? ", " + esc(S.name) : "") +
      "</small></button></div></div></div>";

    /* den gröna knappen föreslår, men barnet ska också kunna välja själv
       (autonomi, inte bara ett enda påtvingat förslag) - därför en liten
       andrahandsknapp bredvid som alltid pekar på en annan lek */
    html +=
      '<button class="playbtn" id="play"><span class="pem">▶️</span>' +
      "<span><b>" +
      esc(UI.play.et) +
      "</b><span>" +
      esc(UI.play.sv) +
      "</span>" +
      "<small>" +
      (n.kind === "theme" ? esc(n.t.em + " " + n.t.et + " · " + n.t.sv) : esc(n.et + " · " + n.sv)) +
      "</small></span></button>" +
      '<button class="btn ghost wide" id="playalt" style="margin-top:6px">🔀 Eller: ' +
      altMode.em +
      " " +
      esc(altMode.et) +
      " · " +
      esc(altMode.sv) +
      "</button>";

    if (!S.correct || S.correct < 3) {
      html +=
        '<div class="emptytip"><span class="arrow">☝️</span><span><b>Börja här!</b>' +
        "<span>Tryck på den gröna knappen — Siiri visar vägen. Allt du klarar ger stjärnor att handla för på marknaden!</span></span></div>";
    }

    /* efter första rundan: nu är det dags att göra Siilikool till sitt eget (en sak i taget) */
    var untouched = (!S.avatar || S.avatar === "🦔") && (S.color || "skog") === "skog";
    if (!S.picked && untouched && (S.lessons || 0) >= 1 && (S.lessons || 0) < 6) {
      html +=
        '<button class="stbox wide pickme" id="pickme"><b>🎨 Välj din figur och färg</b>' +
        "<small>Gör appen till din egen</small></button>";
    }

    /* dagens överraskning */
    if (bagReady()) {
      html +=
        '<button class="bagbtn" id="bag"><span class="bem">🎁</span>' +
        "<span><b>" +
        esc(UI.bag.et) +
        "</b><span>" +
        esc(UI.bag.sv) +
        " – öppna dagens påse!</span></span></button>";
    }

    /* resan – direkt under den gröna knappen, det är spelets stora mål */
    var trn = tripReached(),
      tdone = 3 - tasksLeft(),
      allDone = tripDone() >= TRIP.length;
    html +=
      '<div class="tripcard">' +
      '<p class="tripkick"><span class="tripflag">🎶</span> Laulupidu · Siiri reser genom Estlands ' +
      TRIP.length +
      " orter</p>" +
      '<button class="tripgo" id="tripbtn">' +
      '<span class="tripem">' +
      TRIP[trn - 1].em +
      "</span>" +
      '<span class="triptx">' +
      '<b><span lang="et">' +
      esc(UI.trip.et) +
      '</span> · <span lang="et">' +
      esc(TRIP[trn - 1].et) +
      "</span></b>" +
      "<small>" +
      (allDone ? "hela resan klar!" : "ort " + trn + " av " + TRIP.length) +
      "</small>" +
      '<span class="tripbar"><i style="width:' +
      Math.round((tripDone() / TRIP.length) * 100) +
      '%"></i></span>' +
      '<span class="triplines">' +
      tripDone() +
      " av " +
      TRIP.length +
      " orter</span>" +
      "</span>" +
      '<span class="tripcta"><span class="tripgobtn">Mine ▸</span><small>gå dit</small></span>' +
      "</button>" +
      (allDone
        ? ""
        : '<div class="tripmini">' +
          '<span class="tripdots">' +
          "●".repeat(tdone) +
          "○".repeat(Math.max(0, 3 - tdone)) +
          "</span>" +
          "<span>" +
          tdone +
          ' av 3 uppdrag klara i <span lang="et">' +
          esc(TRIP[trn - 1].et) +
          "</span></span></div>") +
      "</div>";

    /* skolans glosor, om en lista är igång (att ändra listan är en vuxensak och ligger under För vuxna i Familjen) */
    (function () {
      var sc = schoolSet();
      if (!sc) return;
      var d = schoolDaysLeft(),
        pct = Math.round((schoolDone() / sc.words.length) * 100);
      html +=
        '<button class="stbox wide school" id="schoolbtn">' +
        "<b>📝 " +
        esc(sc.name) +
        " · ▶️ Öva läxorden</b>" +
        "<small>" +
        schoolDone() +
        " av " +
        sc.words.length +
        " sitter" +
        (d > 0 ? " · " + d + " dagar kvar" : " · sista dagen") +
        "</small>" +
        '<span class="qbar"><i style="width:' +
        pct +
        '%"></i></span></button>';
    })();

    /* dagens utmaning – utan svit: det som klarats försvinner aldrig */
    html +=
      '<button class="stbox wide" id="questbtn"><b>' +
      p.q.em +
      " " +
      (p.done ? "Klart!" : p.v + " / " + p.q.goal) +
      "</b>" +
      "<small>" +
      esc(p.q.sv) +
      "</small>" +
      '<span class="qbar"><i style="width:' +
      Math.round((p.v / p.q.goal) * 100) +
      '%"></i></span></button>' +
      (p.done
        ? ""
        : '<button class="btn ghost wide" id="questswap" style="margin-top:6px">🔀 Välj ett eget mål för idag</button>');

    /* lekar: fyra i taget (lagom att välja bland), resten bakom en knapp – nyheter markeras */
    var showMode = S.allModes ? MODES.length : 4;
    html += '<h2 class="sec">Mängud <span class="secsv">Lekar</span></h2>' + '<div class="modes">';
    var newLeft = 2; /* märket betyder inget om allt är nytt */
    for (i = 0; i < showMode; i++) {
      var md = MODES[i],
        isNew = !S.tried[md.k] && newLeft > 0;
      if (isNew) newLeft--;
      html +=
        '<button class="mode g-' +
        ({ gör: "gor", öva: "ova", tävla: "tavla" }[md.grp] || "gor") +
        (isNew ? " fresh" : "") +
        '" data-go="' +
        md.k +
        '">' +
        (isNew ? '<span class="newtag">Ny!</span>' : "") +
        '<span class="grp">' +
        ({ gör: "GÖR", öva: "ÖVA", tävla: "TÄVLA" }[md.grp] || "") +
        "</span>" +
        '<span class="em">' +
        md.em +
        '</span><b lang="et">' +
        md.et +
        "</b><span>" +
        md.sv +
        "</span></button>";
    }
    html += "</div>";
    html +=
      '<button class="morebtn" id="moremodes">' +
      (S.allModes ? "Visa färre lekar" : "Visa alla " + MODES.length + " lekar") +
      "</button>";

    /* teman */
    var lim = themesUnlocked(),
      showAll = !!S.showAll;
    var visible = showAll ? lim : Math.min(lim, 4);
    html +=
      '<h2 class="sec">' +
      esc(UI.themes.et) +
      ' <span class="secsv">' +
      esc(UI.themes.sv) +
      '</span></h2><div class="grid">';
    for (i = 0; i < THEMES.length; i++) {
      t = THEMES[i];
      var locked = i >= lim;
      if (!locked && i >= visible) continue;
      if (locked && (!showAll || i > lim + 1)) continue;
      var bs = S.best[t.id] || 0;
      html +=
        '<button class="tile' +
        (locked ? " locked" : "") +
        '"' +
        (locked ? " disabled" : ' data-theme="' + t.id + '"') +
        ">" +
        '<span class="em">' +
        (locked ? "🔒" : t.em) +
        "</span>" +
        '<span class="et" lang="et">' +
        esc(t.et) +
        '</span><span class="sv">' +
        esc(t.sv) +
        " · " +
        t.words.length +
        " ord</span>" +
        '<span class="stars">' +
        (locked
          ? "<small>klara fler teman</small>"
          : starStr(bs) +
            " " +
            (function () {
              var mm = themeMastery(t);
              return mm.medal ? masteryEm(mm.medal) : "";
            })()) +
        "</span></button>";
    }
    html += "</div>";
    if (lim > 4)
      html +=
        '<button class="morebtn" id="more">' +
        (showAll ? "Visa färre teman" : "Visa alla " + Math.min(THEMES.length, lim) + " öppna teman") +
        "</button>";

    app.innerHTML = html;
    document.getElementById("play").onclick = startNext;
    document.getElementById("hello").onclick = function () {
      if (S.name) speakTo("tere");
      else speak("Tere! Mina olen Siiri.");
      mood("cheer");
    };
    document.getElementById("questbtn").onclick = function () {
      /* Skattkammaren är flyttad till en egen Nuxt-sida (app/pages/trophy.vue) - en vanlig
         navigering dit */
      location.href = "/trophy";
    };
    var qsw = document.getElementById("questswap");
    if (qsw)
      qsw.onclick = function () {
        go(questPickScreen, true);
      };
    var sbn = document.getElementById("schoolbtn");
    if (sbn)
      sbn.onclick = function () {
        go(schoolLessonStart, true);
      };
    document.getElementById("tripbtn").onclick = function () {
      speak(TRIP[tripReached() - 1].et);
      go(tripScreen, true);
    };
    var pk = document.getElementById("pickme");
    if (pk)
      pk.onclick = function () {
        S.picked = 1;
        save();
        setupScreen(false);
      };
    var bg = document.getElementById("bag");
    if (bg)
      bg.onclick = function () {
        openBag();
      };
    var mb = document.getElementById("more");
    if (mb)
      mb.onclick = function () {
        S.showAll = !S.showAll;
        save();
        homeScreen();
      };
    var sb = app.querySelector(".seasonbar"),
      seasonTaps = 0,
      seasonTimer = null;
    if (sb)
      sb.onclick = function () {
        seasonTaps++;
        clearTimeout(seasonTimer);
        seasonTimer = setTimeout(function () {
          seasonTaps = 0;
        }, 2000);
        if (seasonTaps >= 5) {
          seasonTaps = 0;
          yearRound();
          return;
        }
        seasonFx();
        var hh = holidayNow();
        speak(hh ? hh.et : seasonNow().word.et);
        mood("cheer");
      };
    var tiles = app.querySelectorAll("[data-theme]");
    for (i = 0; i < tiles.length; i++) {
      (function (el) {
        el.onclick = function () {
          var id = el.getAttribute("data-theme"),
            j;
          for (j = 0; j < THEMES.length; j++) {
            if (THEMES[j].id === id) speak(THEMES[j].et);
          }
          go(function () {
            lessonStart(id);
          }, true);
        };
      })(tiles[i]);
    }
    var modes = {
      speed: speedIntro,
      sent: sentIntro,
      talk: talkScreen,
      mem: memIntro,
      rain: rainIntro,
      boat: boatIntro,
      kok: kitchenIntro,
      duel: duelIntro,
      chal: chIntro,
      otsi: otsiIntro,
    };
    var keys = ["speed", "sent", "talk", "mem", "rain", "boat", "kok", "duel", "chal", "otsi"];
    for (i = 0; i < keys.length; i++) {
      (function (k) {
        var el = app.querySelector('[data-go="' + k + '"]');
        if (el)
          el.onclick = function () {
            var nm = {
              speed: UI.mix.et,
              sent: UI.sent.et,
              talk: UI.talk.et,
              mem: "Mälumäng",
              rain: "Sõnasadu",
              boat: "Paadisõit",
              kok: "Siiri köök",
              duel: "Duell",
              chal: "Väljakutse",
              otsi: "Otsi!",
            }[k];
            S.tried[k] = (S.tried[k] || 0) + 1;
            save();
            speak(nm);
            go(modes[k], true);
          };
      })(keys[i]);
    }
    var pa = document.getElementById("playalt");
    if (pa)
      pa.onclick = function () {
        S.tried[altMode.k] = (S.tried[altMode.k] || 0) + 1;
        save();
        speak(altMode.et);
        go(modes[altMode.k], true);
      };
    var mm2 = document.getElementById("moremodes");
    if (mm2)
      mm2.onclick = function () {
        S.allModes = !S.allModes;
        save();
        homeScreen();
      };
    refreshTop();
    setNav("home");
  }
  function setNav(which) {
    var nav = document.getElementById("nav");
    if (!nav) return;
    nav.hidden = !S.setupdone;
    var bs = nav.querySelectorAll("[data-nav]"),
      i;
    for (i = 0; i < bs.length; i++) {
      bs[i].className = bs[i].getAttribute("data-nav") === which ? "on" : "";
    }
  }

  /* en siffra + etikett i en .stats-grid (adminScreen()) */
  function statTile(value, label) {
    return '<div class="stat"><b>' + value + "</b><span>" + label + "</span></div>";
  }
  /* ---------- ADMIN: dolt felsökningsläge ---------- */
  var ADMIN_CODE = "lyckholm";
  var APPVER = "2.0",
    BUILDDATE = "2026-10-04";
  /* självtest: letar tysta fel som annars aldrig syns */
  function runSelfTest(log) {
    var fails = [],
      warn = [],
      i,
      j,
      nb = bank(),
      sb = bank(true),
      words = allWords();
    for (i = 0; i < words.length; i++) {
      if (words[i].school) continue; /* importerade glosor saknar ofta ljud */
      if (!nb[words[i].et] && !partFor(words[i].et)) fails.push("ljud saknas: " + words[i].et);
      else if (!sb[words[i].et] && !partFor(words[i].et) && !slowPartFor(words[i].et))
        warn.push("långsamt saknas: " + words[i].et);
    }
    for (i = 0; i < SENTENCES.length; i++) {
      if (!nb[SENTENCES[i].et] && !partFor(SENTENCES[i].et)) fails.push("mening utan ljud: " + SENTENCES[i].et);
      for (j = 0; j < SENTENCES[i].w.length; j++) {
        var tk = SENTENCES[i].w[j];
        if (!nb[tk] && !partFor(tk)) warn.push("ordbricka utan ljud: " + tk);
      }
    }
    for (i = 0; i < TRIP.length; i++) {
      if (!TRIPTASKS[TRIP[i].id]) fails.push("ort utan uppdrag: " + TRIP[i].id);
      if (!SOUVENIR[TRIP[i].id] || !itemById(SOUVENIR[TRIP[i].id])) fails.push("ort utan souvenir: " + TRIP[i].id);
      if (!nb[TRIP[i].et] && !partFor(TRIP[i].et)) warn.push("ortnamn utan ljud: " + TRIP[i].et);
    }
    var slots = {};
    for (i = 0; i < SLOTS.length; i++) slots[SLOTS[i].id] = 1;
    for (i = 0; i < SHOP.length; i++) {
      if (!slots[SHOP[i].slot]) fails.push("okänd plats: " + SHOP[i].id);
      if (!wearSVG(SHOP[i].slot)) 0;
      if (!nb[SHOP[i].et] && !partFor(SHOP[i].et)) warn.push("vara utan ljud: " + SHOP[i].et);
    }
    for (i = 1; i < RANKS.length; i++) {
      if (RANKS[i].xp <= RANKS[i - 1].xp) fails.push("medaljordning fel: " + RANKS[i].id);
    }
    var seen = {};
    for (i = 0; i < SECRETS.length; i++) {
      if (seen[SECRETS[i].id]) fails.push("dubbel hemlighet: " + SECRETS[i].id);
      seen[SECRETS[i].id] = 1;
      if (!SECRETS[i].hint) fails.push("hemlighet utan gåta: " + SECRETS[i].id);
    }
    for (i = 0; i < BADGES.length; i++) {
      try {
        BADGES[i].test(S);
      } catch (e) {
        fails.push("bragd kraschar: " + BADGES[i].id);
      }
    }
    log(
      (fails.length ? "❌ " + fails.length + " fel" : "✅ inga fel") +
        " · " +
        (warn.length ? "⚠️ " + warn.length + " varningar" : "inga varningar") +
        " · " +
        words.length +
        " ord, " +
        SHOP.length +
        " varor, " +
        RANKS.length +
        " medaljer, " +
        SECRETS.length +
        " hemligheter" +
        (fails.length ? " — " + fails.slice(0, 4).join("; ") : warn.length ? " — " + warn.slice(0, 3).join("; ") : ""),
    );
  }
  function adminScreen() {
    screen = "admin";
    setNav("me");
    var parts = window.AUDIO_PARTS ? Object.keys(window.AUDIO_PARTS.loaded || {}).length : 0;
    var wordCount = allWords().length,
      bankN = Object.keys(bank()).length,
      namesN = Object.keys(BANKS.names || {}).length;
    var html =
      '<div class="card" style="border-color:var(--berry)">' +
      '<p class="q" style="text-align:left">🛠️ Admin</p>' +
      '<p class="qsub" style="text-align:left">Version ' +
      APPVER +
      " · byggd " +
      BUILDDATE +
      "</p>" +
      '<p class="qsub" style="text-align:left">Felsökningsläge. Barnet ser aldrig den här sidan.</p>' +
      '<div class="stats">' +
      statTile(wordCount, "ord i spelet") +
      statTile(bankN, "ljudklipp laddade") +
      statTile(namesN, "namn") +
      statTile(parts, "ljuddelar") +
      statTile(TRIP.length, "orter") +
      statTile(SHOP.length, "plagg") +
      statTile(SENTENCES.length, "meningar") +
      statTile(SECRETS.length, "hemligheter") +
      "</div></div>";
    html +=
      '<div class="card"><p class="q" style="text-align:left">Lås upp</p><div class="row" style="justify-content:flex-start">' +
      '<button class="btn ghost" data-a="stars1k">+1 000 ⭐</button>' +
      '<button class="btn ghost" data-a="stars100k">+100 000 ⭐</button>' +
      '<button class="btn ghost" data-a="xp">+2 000 poäng</button>' +
      '<button class="btn ghost" data-a="themes">Alla teman</button>' +
      '<button class="btn ghost" data-a="trip">Hela resan</button>' +
      '<button class="btn ghost" data-a="shop">Alla plagg</button>' +
      '<button class="btn ghost" data-a="secrets">Alla hemligheter</button>' +
      '<button class="btn ghost" data-a="badges">Alla märken</button>' +
      '<button class="btn ghost" data-a="all">🔓 Allt på en gång</button>' +
      "</div></div>";
    html +=
      '<div class="card"><p class="q" style="text-align:left">Testa</p><div class="row" style="justify-content:flex-start">' +
      '<button class="btn ghost" data-a="bag">Öppna påsen igen</button>' +
      '<button class="btn ghost" data-a="hol">Visa högtidsruta</button>' +
      '<button class="btn ghost" data-a="rank">Nästa märke</button>' +
      '<button class="btn ghost" data-a="egg">Spela upp en hemlighet</button>' +
      '<button class="btn ghost" data-a="bkmake">💾 Spara en kopia nu</button>' +
      '<button class="btn ghost" data-a="bkload">↩️ Hämta tillbaka kopian</button>' +
      '<button class="btn ghost" data-a="dance">💃 Testa dansen</button>' +
      '<button class="btn ghost" data-a="mic">Testa mikrofonen</button>' +
      '<button class="btn ghost" data-a="voice">Testa rösten</button>' +
      '<button class="btn ghost" data-a="selftest">🔍 Kör självtest</button>' +
      '</div><p class="qsub" id="adminlog" style="text-align:left;margin-top:8px">&nbsp;</p></div>';
    html +=
      '<div class="card"><p class="q" style="text-align:left">Farligt</p><div class="row" style="justify-content:flex-start">' +
      '<button class="btn ghost" data-a="wipeword">Nollställ ordminnet</button>' +
      '<button class="btn ghost" data-a="wipe" style="color:var(--berry)">Nollställ allt</button>' +
      '<button class="btn ghost" data-a="off">Stäng adminläget</button>' +
      "</div></div>";
    app.innerHTML = html;
    var log = function (t) {
      var e = document.getElementById("adminlog");
      if (e) e.textContent = t;
    };
    var bs = app.querySelectorAll("[data-a]"),
      i;
    for (i = 0; i < bs.length; i++) {
      (function (el) {
        el.onclick = function () {
          var a = el.getAttribute("data-a"),
            k,
            j;
          if (a === "stars1k") {
            S.stars += 1000;
          } else if (a === "stars100k") {
            S.stars += 100000;
          } else if (a === "xp") {
            S.xp += 2000;
          } else if (a === "themes") {
            for (j = 0; j < THEMES.length; j++) {
              if (!S.best[THEMES[j].id]) S.best[THEMES[j].id] = 1;
            }
            S.showAll = 1;
          } else if (a === "trip") {
            for (j = 0; j < THEMES.length; j++) {
              S.best[THEMES[j].id] = Math.max(1, S.best[THEMES[j].id] || 0);
            }
            S.tripDone = TRIP.length;
            S.tripP = {};
          } else if (a === "shop") {
            S.owned = [];
            for (j = 0; j < SHOP.length; j++) S.owned.push(SHOP[j].id);
            S.furnOwned = [];
            for (j = 0; j < FURN.length; j++) S.furnOwned.push(FURN[j].id);
          } else if (a === "secrets") {
            S.secrets = [];
            for (j = 0; j < SECRETS.length; j++) S.secrets.push(SECRETS[j].id);
            S.secretsOpen = 1;
          } else if (a === "badges") {
            S.badges = [];
            for (j = 0; j < BADGES.length; j++) S.badges.push(BADGES[j].id);
          } else if (a === "all") {
            S.stars += 100000;
            S.xp = RANKS[RANKS.length - 1].xp;
            S.showAll = 1;
            S.owned = [];
            for (j = 0; j < SHOP.length; j++) S.owned.push(SHOP[j].id);
            S.furnOwned = [];
            for (j = 0; j < FURN.length; j++) S.furnOwned.push(FURN[j].id);
            S.secrets = [];
            for (j = 0; j < SECRETS.length; j++) S.secrets.push(SECRETS[j].id);
            S.badges = [];
            for (j = 0; j < BADGES.length; j++) S.badges.push(BADGES[j].id);
            for (j = 0; j < THEMES.length; j++) S.best[THEMES[j].id] = 3;
            S.tripDone = TRIP.length;
            S.tripP = {};
          } else if (a === "bag") {
            S.bagday = null;
            save();
            openBag();
            return;
          } else if (a === "hol") {
            S.holseen = null;
            save();
            var hh = holidayNow() || HOLIDAYS[0];
            var d = overlay(
              '<div class="oc"><p class="kicker">Testvisning</p><div style="font-size:64px">' +
                hh.em +
                "</div>" +
                "<h3>" +
                esc(hh.et) +
                "</h3><p>" +
                esc(hh.tr) +
                '</p><button class="btn big wide" id="hok">Stäng</button></div>',
            );
            burst(140);
            speak(hh.et);
            d.querySelector("#hok").onclick = function () {
              d.remove();
            };
            return;
          } else if (a === "rank") {
            var ri = rankIndex(S.xp);
            if (RANKS[ri + 1]) {
              S.xp = RANKS[ri + 1].xp;
              save();
              refreshTop();
              rankUp(ri, ri + 1);
            }
            return;
          } else if (a === "egg") {
            goldenSiiri();
            return;
          } else if (a === "dance") {
            dance(true);
            log("Siiri dansar.");
            return;
          } else if (a === "bkmake") {
            autoBackup("manuell");
            var p0 = backupInfo();
            log(p0 ? "Kopia sparad (" + backupAge(p0) + ")." : "Kunde inte spara.");
            return;
          } else if (a === "bkload") {
            var p1 = backupInfo();
            if (!p1) {
              log("Ingen kopia finns.");
              return;
            }
            if (restoreBackup()) {
              log("Kopian hämtad — laddar om…");
              setTimeout(function () {
                location.reload();
              }, 600);
            } else log("Kunde inte hämta kopian.");
            return;
          } else if (a === "mic") {
            log("Testar mikrofonen …");
            listen(
              function (alts) {
                log("Hörde: " + alts[0]);
              },
              function () {},
              function (err) {
                log("Mikrofonfel: " + micProblem(err));
              },
            );
            return;
          } else if (a === "voice") {
            log("Spelar upp tre ord …");
            speak("tere");
            setTimeout(function () {
              speak("jäätis");
            }, 1200);
            setTimeout(function () {
              speak("Kuressaare");
            }, 2600);
            return;
          } else if (a === "selftest") {
            runSelfTest(log);
            return;
          } else if (a === "wipeword") {
            S.wordmem = {};
            log("Ordminnet nollställt.");
          } else if (a === "wipe") {
            confirmBox(
              "Nollställ allt",
              "Namn, poäng, stjärnor, garderob, resa och hemligheter raderas. Går inte att ångra.",
              "Ja, radera allt",
              function () {
                /* sparas i familjekontot? Då kopplas spelaren bort från enheten först – kontots kopia
                                   av spelet lämnas orörd, så ett barn kan inte radera den av misstag */
                Promise.resolve(cloudOn() ? window.SiiriCloud.unlink() : null)
                  .catch(function () {})
                  .then(function () {
                    /* nollställer profilen som spelas nu (i minnet och i lagringen) */
                    STORE.wipe();
                    try {
                      location.reload();
                    } catch (e) {}
                    setTimeout(function () {
                      /* om omladdning blockeras: börja om utan att ladda om */
                      applyScene();
                      applyColor();
                      refreshTop();
                      setupScreen(true);
                    }, 400);
                  });
              },
            );
            return;
          } else if (a === "off") {
            S.admin = 0;
            save();
            location.href = "/profile"; /* egen Nuxt-sida, se app/pages/profile.vue */
            return;
          }
          save();
          refreshTop();
          adminScreen();
          log("Klart: " + a);
        };
      })(bs[i]);
    }
  }
  function confirmBox(title, text, okText, cb) {
    var d = overlay(
      '<div class="oc" style="border-color:var(--berry)"><p class="kicker">' +
        esc(title) +
        "</p>" +
        '<div style="font-size:44px">⚠️</div><p>' +
        esc(text) +
        "</p>" +
        '<button class="btn big wide" id="cbyes" style="background:var(--berry);box-shadow:0 5px 0 #8E1338;margin-top:8px">' +
        esc(okText) +
        "</button>" +
        '<button class="btn ghost wide" id="cbno" style="margin-top:8px">Avbryt</button></div>',
    );
    d.querySelector("#cbyes").onclick = function () {
      d.remove();
      cb();
    };
    d.querySelector("#cbno").onclick = function () {
      d.remove();
    };
  }
  function askAdmin() {
    var d = overlay(
      '<div class="oc" style="border-color:var(--berry)"><p class="kicker">🛠️ Låst läge</p>' +
        '<h3 style="font-size:19px">Kod</h3>' +
        '<input class="type" id="admcode" type="password" autocomplete="off" placeholder="••••••••" style="font-size:19px">' +
        '<p class="qsub" id="admmsg" style="min-height:18px">&nbsp;</p>' +
        '<button class="btn big wide" id="admok">Lås upp</button>' +
        '<button class="btn ghost wide" id="admno" style="margin-top:8px">Avbryt</button></div>',
    );
    var inp = d.querySelector("#admcode"),
      msg = d.querySelector("#admmsg");
    setTimeout(function () {
      try {
        inp.focus();
      } catch (e) {}
    }, 80);
    function check() {
      if ((inp.value || "").trim().toLowerCase() === ADMIN_CODE) {
        S.admin = 1;
        save();
        sndLvl();
        d.remove();
        go(adminScreen, true);
      } else {
        sndNo();
        msg.textContent = "Fel kod.";
        inp.value = "";
        inp.className = "type wrong";
        setTimeout(function () {
          inp.className = "type";
        }, 500);
      }
    }
    d.querySelector("#admok").onclick = check;
    d.querySelector("#admno").onclick = function () {
      d.remove();
    };
    inp.onkeydown = function (e) {
      if (e.key === "Enter") check();
    };
  }

  /* ---------- PROFIL ---------- */
  var COLORS = [
    { id: "skog", sv: "Skog", c1: "#EDF4E6", c2: "#2E6B45" },
    { id: "rosa", sv: "Rosa", c1: "#FFF1F6", c2: "#E24D90" },
    { id: "lila", sv: "Lila", c1: "#F5F0FF", c2: "#7B52D6" },
    { id: "hav", sv: "Hav", c1: "#EBF6FF", c2: "#2B8CD9" },
    { id: "sol", sv: "Sol", c1: "#FFF8E6", c2: "#DD8A12" },
    { id: "mint", sv: "Mint", c1: "#EAFBF3", c2: "#12A97A" },
  ];
  function applyScene() {
    var s = wearing("scene");
    if (s && owns(s)) document.documentElement.setAttribute("data-scene", s);
    else document.documentElement.removeAttribute("data-scene");
  }
  function applyColor() {
    var c = S.color || "skog";
    if (c === "skog") document.documentElement.removeAttribute("data-color");
    else document.documentElement.setAttribute("data-color", c);
  }
  /* app/utils/avatars.ts - en enda källa, delad med Vue-sidorna. */
  var AVATARS = window.SiiriData.AVATARS;
  var AVATAR_INFO = window.SiiriData.AVATAR_INFO;
  /* samma höjd-inte-fyrkant-centrering som rivalIcon() - se den för varför. em är alltid
     den sparade S.avatar-emojin (eller en annan AVATARS-emoji i väljarrutnätet); bilden är
     bara en kosmetisk uppgradering, S.avatar förblir emojin. Precis som rivalIcon() går
     ikonen alltid att klicka/trycka Enter på för figur-kortet (openCharCard() nedan). */
  /* peek=false ger bara bilden utan charpeek-kortet - den fångande klicklyssnaren för
     [data-char] (se längre ner) gör stopPropagation(), så en charpeek-ikon kan aldrig
     samtidigt vara hela ytan på en egen klickbar knapp (figurväljaren i setupScreen():
     knappen ÄR ikonen, inget annat att klicka på för att faktiskt välja figuren). */
  function avatarIcon(em, px, peek) {
    var info = AVATAR_INFO[em],
      size = info ? Math.round(px * 1.5) : px,
      inner = info
        ? '<img src="' + info.img + '" alt="" style="height:' + size + 'px;width:auto;vertical-align:middle">'
        : '<span style="font-size:' + size + 'px;line-height:1">' + em + "</span>";
    if (peek === false) {
      return (
        '<span style="display:inline-flex;justify-content:center;align-items:center;width:' +
        size +
        'px">' +
        inner +
        "</span>"
      );
    }
    return (
      '<span class="charpeek" data-char="avatar:' +
      em +
      '" role="button" tabindex="0" aria-label="Visa ' +
      esc(info ? info.et : em) +
      '" style="display:inline-flex;justify-content:center;align-items:center;width:' +
      size +
      'px">' +
      inner +
      "</span>"
    );
  }
  function setupScreen(first) {
    screen = "setup";
    setNav(first ? "" : "me");
    /* första gången finns ingen spelare än: inga poäng, märken eller stjärnor att visa */
    showTop(!first);
    btnBack.hidden = !!first ? true : false;
    var html =
      '<div class="card" style="text-align:center">' +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<p class="q">' +
      (first ? "Tere! Vad heter du?" : "Ändra din profil") +
      "</p>" +
      '<p class="qsub">Då kan Siiri säga hej till dig med namn.</p>' +
      '<label class="sr-only" for="nm">Ditt namn</label>' +
      '<input class="type" id="nm" maxlength="14" autocomplete="given-name" placeholder="ditt namn" value="' +
      esc(S.name || "") +
      '">';
    /* första gången: bara namnet, sedan rakt in i spelet. Figur, svårighet och färg väljs
       senare (hemskärmen föreslår det efter första rundan, och allt finns under Profil) */
    if (!first) html += '<p class="qsub" style="margin-top:18px">Välj din figur</p><div class="avatars" id="avs">';
    for (var i = 0; !first && i < AVATARS.length; i++) {
      var avInfo = AVATAR_INFO[AVATARS[i]],
        avOn = AVATARS[i] === (S.avatar || "🦔");
      html +=
        '<button class="av' +
        (avOn ? " on" : "") +
        '" data-av="' +
        AVATARS[i] +
        '" aria-label="Välj ' +
        esc(avInfo ? avInfo.sv : AVATARS[i]) +
        '" aria-pressed="' +
        avOn +
        '">' +
        avatarIcon(AVATARS[i], 30, false) +
        "</button>";
    }
    if (!first)
      html += '</div><p class="qsub" style="margin-top:18px">Hur svårt ska det vara?</p><div class="diffs" id="dfs">';
    for (i = 0; !first && i < DIFFS.length; i++) {
      html +=
        '<button class="dif' +
        (DIFFS[i].id === (S.diff || "lagom") ? " on" : "") +
        '" data-dif="' +
        DIFFS[i].id +
        '" aria-pressed="' +
        (DIFFS[i].id === (S.diff || "lagom")) +
        '">' +
        '<span class="de">' +
        DIFFS[i].em +
        "</span><b>" +
        DIFFS[i].sv +
        "</b>" +
        "<small>" +
        esc(DIFFS[i].txt) +
        "</small></button>";
    }
    /* förslag: "en ruta bredvid Siiri på svår nivå där man kan cheka av om man vill ha
       glasögon eller inte" - bara synlig när svår är vald, annars är den irrelevant. Döljs/
       visas live i dif-knapparnas onclick nedan, utan att behöva rita om hela skärmen. */
    if (!first)
      html +=
        '</div><div id="shadesrow" style="display:' +
        (S.diff === "svar" ? "flex" : "none") +
        ';align-items:center;gap:8px;margin-top:10px">' +
        '<input type="checkbox" id="shades" ' +
        (S.shades === false ? "" : "checked") +
        '><label for="shades">😎 Siiri bär solglasögon på svår nivå</label></div>';
    if (!first) html += '<p class="qsub" style="margin-top:18px">Välj färg på appen</p><div class="colors" id="cols">';
    for (i = 0; !first && i < COLORS.length; i++) {
      html +=
        '<button class="col' +
        (COLORS[i].id === (S.color || "skog") ? " on" : "") +
        '" data-col="' +
        COLORS[i].id +
        '" aria-label="' +
        COLORS[i].sv +
        '" aria-pressed="' +
        (COLORS[i].id === (S.color || "skog")) +
        '">' +
        '<span style="background:linear-gradient(160deg,' +
        COLORS[i].c1 +
        " 45%," +
        COLORS[i].c2 +
        ' 45%)"></span>' +
        "<b>" +
        COLORS[i].sv +
        "</b></button>";
    }
    html +=
      (first ? "" : "</div>") +
      '<button class="btn green big wide" id="ok" style="margin-top:18px">' +
      (first ? "Nu kör vi! 🎈" : "Spara") +
      "</button>" +
      (first ? '<button class="btn ghost wide" id="skip" style="margin-top:8px">Hoppa över</button>' : "") +
      (first && cloudOn()
        ? '<p class="qsub" style="margin-top:10px">Utan konto sparas spelet bara på den här enheten.</p>'
        : "") +
      "</div>";
    app.innerHTML = html;
    var avs = app.querySelectorAll("[data-av]"),
      i;
    for (i = 0; i < avs.length; i++) {
      (function (el) {
        el.onclick = function () {
          var a = app.querySelectorAll("[data-av]");
          for (var j = 0; j < a.length; j++) a[j].classList.remove("on");
          el.classList.add("on");
          S.avatar = el.getAttribute("data-av");
          save();
        };
      })(avs[i]);
    }
    var dfs = app.querySelectorAll("[data-dif]");
    for (i = 0; i < dfs.length; i++) {
      (function (el) {
        el.onclick = function () {
          var a = app.querySelectorAll("[data-dif]");
          for (var j = 0; j < a.length; j++) a[j].classList.remove("on");
          el.classList.add("on");
          S.diff = el.getAttribute("data-dif");
          save();
          var shadesrow = $s("shadesrow");
          if (shadesrow) shadesrow.style.display = S.diff === "svar" ? "flex" : "none";
          var sv = $s("s-svg");
          if (sv) {
            if (S.diff === "svar" && S.shades !== false) {
              sv.classList.add("cool");
              tone(520, 0.1, 0);
              tone(780, 0.14, 0.1);
              mood("cheer");
            } else {
              sv.classList.remove("cool");
              tone(700, 0.09, 0);
            }
          } else tone(700, 0.09, 0);
        };
      })(dfs[i]);
    }
    var shadesBox = $s("shades");
    if (shadesBox) {
      shadesBox.onchange = function () {
        S.shades = shadesBox.checked;
        save();
        var sv2 = $s("s-svg");
        if (sv2) sv2.classList.toggle("cool", S.diff === "svar" && S.shades !== false);
        tone(shadesBox.checked ? 700 : 520, 0.08, 0);
      };
    }
    var cols = app.querySelectorAll("[data-col]");
    for (i = 0; i < cols.length; i++) {
      (function (el) {
        el.onclick = function () {
          var a = app.querySelectorAll("[data-col]");
          for (var j = 0; j < a.length; j++) a[j].classList.remove("on");
          el.classList.add("on");
          S.color = el.getAttribute("data-col");
          save();
          applyColor();
          tone(760, 0.09, 0);
        };
      })(cols[i]);
    }
    document.getElementById("ok").onclick = function () {
      var v = document.getElementById("nm").value.trim().slice(0, 14);
      S.name = v;
      S.setupdone = 1;
      if (!first) S.picked = 1; /* figur och färg är valda – hemskärmen behöver inte föreslå det */
      save();
      prefetchName();
      if (v.toLowerCase() === "siiri" || v.toLowerCase() === "siil") {
        foundSecret("me");
        addXp(40);
        burst(140);
        go(homeScreen, false);
        setTimeout(function () {
          eggSay("me");
          mood("cheer");
        }, 400);
        return;
      }
      go(homeScreen, false);
      setTimeout(function () {
        if (v) speakTo("tere");
        else speak("Tere! Mina olen Siiri.");
        mood("cheer");
      }, 350);
    };
    if (first) {
      document.getElementById("skip").onclick = function () {
        S.setupdone = 1;
        save();
        go(homeScreen, false);
      };
    }
    setTimeout(function () {
      var n = document.getElementById("nm");
      if (n && !S.name) n.focus();
    }, 150);
  }
  /* Profilen är flyttad till en egen Nuxt-sida, se app/pages/profile.vue */

  /* ---------- MENINGSBYGGE ---------- */
  var LS = null;
  function sentIntro() {
    screen = "sent";
    prefetch("sent");
    var html =
      '<div class="card" style="text-align:center"><div style="font-size:64px">🧩</div>' +
      '<p class="q">Bygg meningar</p>' +
      '<p class="qsub">Siiri visar en mening på svenska. Lägg de estniska orden i rätt ordning – tryck på ett ord för att höra det.</p>' +
      (S.sentbest ? '<p class="qsub">Ditt bästa: <b>' + S.sentbest + " av 6</b></p>" : "") +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="start">Sätt igång 🧩</button></div>';
    app.innerHTML = html;
    document.getElementById("start").onclick = function () {
      sentStart();
    };
  }
  /* bygger en extra mening av PET_SENTENCE_TEMPLATES (sentences.ts) med husdjurets namn
     (S.petName, satt i "Om djur"-samtalet eller i Siiri tuba) - null om inget namn finns än. */
  function petSentence() {
    var name = (S.petName || "").trim();
    if (!name) return null;
    var tpl = PET_SENTENCE_TEMPLATES[Math.floor(Math.random() * PET_SENTENCE_TEMPLATES.length)];
    return {
      et: tpl.et.replace("{name}", name),
      sv: tpl.sv.replace("{name}", name),
      w: tpl.w.map(function (tk) {
        return tk === "{name}" ? name : tk;
      }),
    };
  }
  function sentStart() {
    var scored = SENTENCES.map(function (s) {
      var ww = 0,
        i,
        m;
      for (i = 0; i < s.w.length; i++) {
        m = (S.wordmem || {})[s.w[i]];
        ww += m ? Math.max(0.3, m.w) : 1.6;
      }
      return { s: s, w: ww / s.w.length + Math.random() * 0.8 };
    }).sort(function (a, b) {
      return b.w - a.w;
    });
    var pet = petSentence(),
      list = shuffle(
        scored.slice(0, 12).map(function (x) {
          return x.s;
        }),
      ).slice(0, pet ? 5 : 6);
    if (pet) list.splice(Math.floor(Math.random() * (list.length + 1)), 0, pet);
    LS = {
      list: list,
      i: 0,
      right: 0,
      placed: [],
      done: false,
    };
    sentRound();
  }
  function sentRound() {
    if (!LS) return;
    if (LS.i >= LS.list.length) {
      sentEnd();
      return;
    }
    var s = LS.list[LS.i];
    LS.placed = [];
    LS.done = false;
    var bag = shuffle(s.w.slice()),
      i;
    var html = '<div class="progressdots">';
    for (i = 0; i < LS.list.length; i++) {
      var c = "dot";
      if (i < LS.i) {
        c += LS.resList && LS.resList[i] === false ? " no" : " ok";
      } else if (i === LS.i) {
        c += " now";
      }
      html += '<span class="' + c + '"></span>';
    }
    html +=
      '</div><div class="card"><p class="q">Hur säger man det här?</p>' +
      '<p class="qsub" style="font-size:19px;color:var(--ink);font-weight:600">' +
      esc(s.sv) +
      "</p>" +
      '<div class="slots" id="slots"></div>' +
      '<div class="tiles" id="tiles"></div>' +
      (diff().id === "svar"
        ? ""
        : '<div class="center" style="margin-top:12px"><button class="speakbtn sm" id="hear" aria-label="Hör meningen">🔊</button>' +
          '<button class="speakbtn sm" id="hearslow" aria-label="Hör meningen långsamt">🐢</button></div>') +
      '<div class="feedback" id="fb"></div>' +
      '<button class="btn ghost wide" id="clear" style="margin-top:8px">Börja om med den här</button>' +
      '</div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    LS.bag = bag;
    drawTiles();
    var hb = document.getElementById("hear");
    if (hb) {
      hb.onclick = function () {
        speak(s.et);
      };
      document.getElementById("hearslow").onclick = function () {
        speak(s.et, true);
      };
    }
    document.getElementById("clear").onclick = function () {
      LS.placed = [];
      LS.done = false;
      drawTiles();
    };
  }
  function drawTiles() {
    var s = LS.list[LS.i],
      i;
    var sl = document.getElementById("slots"),
      tl = document.getElementById("tiles");
    if (!sl || !tl) return;
    var h1 = "";
    for (i = 0; i < s.w.length; i++) {
      var v = LS.placed[i];
      h1 +=
        '<span class="slot' +
        (v ? " filled" : "") +
        (LS.done ? " right" : "") +
        '" data-slot="' +
        i +
        '">' +
        (v ? esc(v) : "·") +
        "</span>";
    }
    sl.innerHTML = h1;
    var used = {},
      j;
    for (j = 0; j < LS.placed.length; j++) {
      if (LS.placed[j]) used[LS.placed[j]] = (used[LS.placed[j]] || 0) + 1;
    }
    var seen = {},
      h2 = "";
    for (i = 0; i < LS.bag.length; i++) {
      var t = LS.bag[i];
      seen[t] = (seen[t] || 0) + 1;
      var isUsed = (used[t] || 0) >= seen[t];
      h2 += '<button class="tile2' + (isUsed ? " used" : "") + '" data-tile="' + i + '">' + esc(t) + "</button>";
    }
    tl.innerHTML = h2;
    var tb = tl.querySelectorAll("[data-tile]");
    for (i = 0; i < tb.length; i++) {
      (function (el) {
        el.onclick = function () {
          if (LS.done) return;
          var word = LS.bag[parseInt(el.getAttribute("data-tile"), 10)];
          speak(word);
          for (var k = 0; k < LS.list[LS.i].w.length; k++) {
            if (!LS.placed[k]) {
              LS.placed[k] = word;
              break;
            }
          }
          drawTiles();
          checkSentence();
        };
      })(tb[i]);
    }
    var sb = sl.querySelectorAll("[data-slot]");
    for (i = 0; i < sb.length; i++) {
      (function (el) {
        el.onclick = function () {
          if (LS.done) return;
          var k = parseInt(el.getAttribute("data-slot"), 10);
          if (LS.placed[k]) {
            LS.placed[k] = null;
            var comp = [],
              m;
            for (m = 0; m < LS.placed.length; m++) {
              if (LS.placed[m]) comp.push(LS.placed[m]);
            }
            LS.placed = comp;
            drawTiles();
          }
        };
      })(sb[i]);
    }
  }
  function checkSentence() {
    if (LS.done) return;
    var s = LS.list[LS.i];
    if (LS.placed.length < s.w.length) return;
    for (var i = 0; i < s.w.length; i++) {
      if (!LS.placed[i]) return;
    }
    var ok = true;
    for (i = 0; i < s.w.length; i++) {
      if (LS.placed[i] !== s.w[i]) ok = false;
    }
    var fb = document.getElementById("fb");
    if (!LS.resList) LS.resList = [];
    LS.resList[LS.i] = ok;
    LS.done = true;
    wmemHitSentenceWords(s.w, ok);
    if (ok) {
      LS.right++;
      S.correct++;
      earnStars(2);
      bumpQuest("correct", 1);
      bumpQuest("sent", 1);
      tripBump("sent", 1);
      addXp(Math.round(18 * diff().mult));
      sndOk();
      burst(80);
      mood("cheer");
      save();
      fb.className = "feedback ok";
      fb.textContent = "Täpselt! ⭐";
      speak(s.et);
      drawTiles();
      setTimeout(function () {
        if (!LS) return;
        LS.i++;
        sentRound();
      }, 2100);
    } else {
      sndNo();
      mood("oops");
      fb.className = "feedback no";
      fb.textContent = "Rätt ordning: " + s.et;
      var sl = document.getElementById("slots");
      if (sl)
        sl.querySelectorAll(".slot").forEach &&
          sl.querySelectorAll(".slot").forEach(function (e) {
            e.classList.add("wrong");
          });
      speak(s.et);
      setTimeout(function () {
        if (!LS) return;
        LS.i++;
        sentRound();
      }, 2100);
    }
    refreshTop();
  }
  function sentEnd() {
    var right = LS.right,
      n = LS.list.length;
    if (right > (S.sentbest || 0)) S.sentbest = right;
    save();
    var newB = checkBadges();
    burst(right >= n - 1 ? 170 : 110);
    var st = right >= n ? 3 : right >= n * 0.7 ? 2 : right >= n * 0.4 ? 1 : 0;
    var html =
      '<div class="card" style="text-align:center"><div class="bigstars">' +
      starStr(st) +
      "</div>" +
      '<div class="bigscore">' +
      right +
      " / " +
      n +
      "</div>" +
      '<p class="q">' +
      (right >= n ? "Alla meningar rätt!" : "Bra byggt!") +
      "</p>" +
      '<p class="qsub">Varje rätt mening ger 2 stjärnor på marknaden.</p>' +
      '<div class="center">' +
      siilSVG("small") +
      "</div>";
    if (newB.length) {
      html += '<div style="margin-top:8px">';
      for (var i = 0; i < newB.length; i++) {
        html += '<span class="badge">' + newB[i].em + " " + esc(newB[i].sv) + "</span>";
      }
      html += "</div>";
    }
    html +=
      '<div class="row"><button class="btn green big" id="again">En omgång till 🧩</button>' +
      '<button class="btn ghost big" id="home">Tillbaka</button></div></div>';
    app.innerHTML = html;
    LS = null;
    mood("cheer");
    document.getElementById("again").onclick = function () {
      sentIntro();
    };
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
    refreshTop();
  }

  /* ---------- ÜLLATUSKOTT: dagens överraskning ---------- */
  function bagReady() {
    return S.bagday !== today();
  }
  function openBag() {
    if (!bagReady()) return;
    S.bagday = today();
    save();
    /* vad som ligger i påsen: mest stjärnor, ibland ett plagg, ibland ett hemligt ord */
    var roll = Math.random(),
      gift;
    var affordable = [],
      i;
    for (i = 0; i < SHOP.length; i++) {
      if (!owns(SHOP[i].id) && itemAvailable(SHOP[i]) && SHOP[i].price <= 400) affordable.push(SHOP[i]);
    }
    if (roll < 0.14 && affordable.length) {
      var it = affordable[(Math.random() * affordable.length) | 0];
      if (!S.owned) S.owned = [];
      if (!S.wear) S.wear = {};
      S.owned.push(it.id);
      S.wear[it.slot] = it.id;
      save();
      gift = {
        em: it.em,
        big: esc(it.sv),
        sub: esc(it.et) + " · ett fynd från marknaden!",
        note: "Inga stjärnor den här gången - imorgon kanske!",
      };
    } else if (roll < 0.4) {
      var pool = allWords(),
        w = pool[(Math.random() * pool.length) | 0];
      speak(w.et);
      gift = {
        em: w.em,
        big: esc(w.et),
        sub: esc(w.sv) + " · dagens ord från Siiri",
        word: w,
        note: "Inga stjärnor den här gången - imorgon kanske!",
      };
    } else {
      var amount = [15, 20, 25, 30, 40, 50, 60][(Math.random() * 7) | 0];
      if (roll > 0.93) amount = 100;
      S.stars += amount;
      save();
      refreshTop();
      gift = {
        em: "⭐",
        big: "+" + amount + " stjärnor",
        sub: amount >= 100 ? "En riktig skattpåse!" : "Spara dem till marknaden",
      };
    }
    sndLvl();
    burst(190);
    var d = overlay(
      '<div class="oc"><p class="kicker">🎁 ' +
        esc(UI.bag.et) +
        "</p>" +
        '<div class="bagpop">' +
        gift.em +
        "</div><h3>" +
        gift.big +
        "</h3><p>" +
        gift.sub +
        "</p>" +
        (gift.note ? '<p class="qsub">' + gift.note + "</p>" : "") +
        (gift.word ? '<button class="btn ghost" id="bagsay" style="margin-top:8px">🔊 Hör ordet igen</button>' : "") +
        '<button class="btn big wide" id="bagok" style="margin-top:8px">Aitäh, Siiri!</button>' +
        '<p class="qsub" style="margin-top:8px">En ny påse väntar imorgon.</p></div>',
    );
    if (gift.word)
      d.querySelector("#bagsay").onclick = function () {
        speak(gift.word.et);
      };
    d.querySelector("#bagok").onclick = function () {
      d.remove();
      if (screen === "home") homeScreen();
    };
    mood("cheer");
  }

  /* ---------- öva ortens tre ord ---------- */
  var TP = null;
  function tripPractice(cityId) {
    var city = null,
      i;
    for (i = 0; i < TRIP.length; i++) if (TRIP[i].id === cityId) city = TRIP[i];
    if (!city) return;
    var q = [];
    for (i = 0; i < city.words.length; i++) {
      q.push(city.words[i]);
      q.push(city.words[i]);
    }
    TP = { city: city, q: shuffle(q), i: 0, right: 0, lock: false };
    tpRound();
  }
  function tpRound() {
    if (!TP) return;
    screen = "tp";
    setNav("home");
    btnBack.hidden = false;
    if (TP.i >= TP.q.length) {
      var right = TP.right,
        n = TP.q.length,
        city = TP.city;
      TP = null;
      earnStars(20 + right * 4);
      addXp(30);
      save();
      refreshTop();
      burst(120);
      fanfare(2);
      app.innerHTML =
        '<div class="card" style="text-align:center"><p class="kicker">🎧 ' +
        esc(city.et) +
        "</p>" +
        '<h2 class="q">' +
        (right === n ? "Alla rätt!" : "Bra jobbat!") +
        "</h2>" +
        '<p class="qsub">' +
        right +
        " av " +
        n +
        " rätt · ⭐ +" +
        (20 + right * 4) * starMult() +
        "</p>" +
        '<div class="row"><button class="btn big" id="tpag">En gång till</button>' +
        '<button class="btn green" id="tpmap">Till kartan 🗺️</button></div></div>';
      document.getElementById("tpag").onclick = function () {
        tripPractice(city.id);
      };
      document.getElementById("tpmap").onclick = function () {
        go(tripScreen, true);
      };
      return;
    }
    var w = TP.q[TP.i],
      all = optionPool(w, allWords()),
      opts = [w],
      tries = 0,
      j;
    while (opts.length < 4 && tries < 120) {
      var c = all[(Math.random() * all.length) | 0];
      tries++;
      var dup = false;
      for (j = 0; j < opts.length; j++) if (opts[j].sv === c.sv) dup = true;
      if (!dup) opts.push(c);
    }
    opts = shuffle(opts);
    var listen = TP.i % 2 === 1;
    var html =
      '<div class="zone"><span>🎧 <b>' +
      esc(TP.city.et) +
      "</b></span><span>" +
      (TP.i + 1) +
      " / " +
      TP.q.length +
      "</span></div>" +
      '<div class="odots">';
    for (j = 0; j < TP.q.length; j++) html += '<i class="' + (j < TP.i ? "on" : j === TP.i ? "now" : "") + '"></i>';
    html +=
      '</div><div class="card">' +
      (listen
        ? '<p class="q">Lyssna — vad betyder ordet?</p><div class="center"><button class="speakbtn big" id="tpsay" aria-label="Hör ordet">🔊</button></div>'
        : '<p class="q">Vad betyder</p>' +
          promptHtml(w, w.et, "et") +
          '<div class="center"><button class="speakbtn sm" id="tpsay" aria-label="Hör ordet">🔊</button></div>') +
      '<div class="opts">';
    for (j = 0; j < opts.length; j++)
      html += '<button class="opt" data-sv="' + esc(opts[j].sv) + '">' + esc(opts[j].sv) + "</button>";
    html += '</div><div class="feedback" id="tpfb"></div></div>';
    app.innerHTML = html;
    speak(w.et);
    document.getElementById("tpsay").onclick = function () {
      speak(w.et);
    };
    var bs = app.querySelectorAll(".opt"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (TP.lock) return;
          TP.lock = true;
          var ok = el.getAttribute("data-sv") === w.sv,
            b2 = app.querySelectorAll(".opt"),
            q2;
          for (q2 = 0; q2 < b2.length; q2++) {
            b2[q2].disabled = true;
            if (b2[q2].getAttribute("data-sv") === w.sv) b2[q2].className = "opt right";
          }
          if (!ok) el.className = "opt wrong";
          var fb = document.getElementById("tpfb");
          if (ok) {
            TP.right++;
            sndOk();
            if (fb) fb.innerHTML = '<b style="color:var(--moss)">Õige!</b>';
          } else {
            sndNo();
            if (fb) fb.innerHTML = "<b>" + esc(w.et) + " = " + esc(w.sv) + "</b>";
          }
          wmemHit(w.et, ok, "choose", w.sv);
          tripBump("words", 1, w.et);
          speak(w.et);
          setTimeout(
            function () {
              TP.i++;
              TP.lock = false;
              tpRound();
            },
            ok ? 850 : 1600,
          );
        };
      })(bs[k]);
    }
  }

  /* ============ STATIONER: varje ort har en egen lek ============ */
  var ST = null;
  var STATIONS = window.SiiriData.STATIONS;
  var STTHEMES = ["toit", "puuviljad", "riided", "kodus", "mang", "kool"];
  /* saker som inte går att bära ombord sorteras bort */
  var STSKIP = window.SiiriData.STSKIP;
  /* lägger till läxord som har en riktig bild (se schoolPicWords) och inte redan finns med */
  function addSchoolPics(pool) {
    var extra = schoolPicWords(),
      add = [],
      i,
      j,
      dup,
      w;
    for (i = 0; i < extra.length; i++) {
      w = extra[i];
      if (w.et.indexOf(" ") >= 0 || STSKIP.indexOf(w.et) >= 0) continue;
      dup = false;
      for (j = 0; j < pool.length; j++) if (pool[j].et === w.et) dup = true;
      if (!dup) add.push(w);
    }
    return pool.concat(add);
  }
  function stThings(n) {
    var pool = [],
      i,
      j;
    for (i = 0; i < THEMES.length; i++) {
      if (STTHEMES.indexOf(THEMES[i].id) < 0) continue;
      for (j = 0; j < THEMES[i].words.length; j++) {
        var w = THEMES[i].words[j];
        if (w.em && w.et.indexOf(" ") < 0 && STSKIP.indexOf(w.et) < 0) pool.push(w);
      }
    }
    pool = addSchoolPics(pool);
    return pickWeighted(pool, Math.min(n, pool.length));
  }
  function stationOf(id) {
    return STATIONS[id] || null;
  }
  function stationStart(id) {
    var s = stationOf(id);
    if (!s) return;
    ST = null;
    if (s.eng === "harbor") stHarbor(true);
    else if (s.eng === "library") stLibrary(true);
    else if (s.eng === "beach") stBeach(true);
    else if (s.eng === "collect") stCollect(id, true);
    else if (s.eng === "catch") stCatch(id, true);
    else if (s.eng === "sort") stSort(id, true);
    else if (s.eng === "count") stCount(id, true);
    else if (s.eng === "pairs") stPairs(id, true);
    else if (s.eng === "seq") stSeq(id, true);
    else if (s.eng === "finale") stFinale(true);
  }
  /* tre svårighetsnivåer baserat på var i resan orten ligger (tidig/mitten/sen tredjedel) -
     samma sex motorer (collect/catch/sort/count/pairs/seq) återanvänds på 16 av 20 orter, så
     de behöver själva växa med spelaren istället för att kännas exakt likadana vid ort 18
     som vid ort 2. Bara fler alternativ/distraktorer - aldrig nya ord eller kortare tid, så
     det är fortfarande samma sorts uppgift, bara lite klurigare. */
  function stTier(cityId) {
    var i;
    for (i = 0; i < TRIP.length; i++) if (TRIP[i].id === cityId) break;
    if (i >= TRIP.length) return 0;
    return i < 7 ? 0 : i < 14 ? 1 : 2;
  }
  /* ord ur ett visst tema, med fallback */
  function stPool(themeId, n) {
    var i,
      j,
      pool = [];
    for (i = 0; i < THEMES.length; i++) {
      if (themeId && THEMES[i].id !== themeId) continue;
      for (j = 0; j < THEMES[i].words.length; j++) {
        var w = THEMES[i].words[j];
        if (w.em && w.et.indexOf(" ") < 0 && STSKIP.indexOf(w.et) < 0) pool.push(w);
      }
    }
    if (pool.length < 6) pool = stThings(30);
    pool = addSchoolPics(pool);
    return pickWeighted(pool, Math.min(n || 24, pool.length));
  }
  /* Siiri reagerar live på svaren (stReact) istället för att bara synas vid sidbyte -
     samma figur, bara liten, så hon känns närvarande under spelet. Delad av stHead()
     och de tre äldre stationerna (stHarbor/stLibrary/stBeach) som bygger sin egen
     rubrik istället för att gå via stHead(). */
  function stMascotHtml() {
    var combo = ST && ST.combo >= 3 ? ST.combo : 0;
    return (
      '<div class="stmascot">' +
      siilSVG("small") +
      '<span class="station-combo" id="stcombo"' +
      (combo ? "" : " hidden") +
      ">🔥 " +
      combo +
      " i rad!</span></div>"
    );
  }
  function stHead(id, extra) {
    var s = stationOf(id);
    return (
      '<div class="zone"><span>' +
      s.em +
      " <b>" +
      esc(s.et) +
      "</b></span>" +
      "<span>" +
      esc(extra || "") +
      "</span></div>" +
      stMascotHtml()
    );
  }
  /* kort reaktion från Siiri på ett rätt/fel svar i en station - ändrar inget om
     poäng eller spelregler, bara hur det känns att spela. Combon räknas i ST (redan
     den delade tillfälliga stationstatet) och nollställs automatiskt när en ny
     station startar, eftersom ST då blir ett helt nytt objekt. */
  function stReact(ok) {
    if (!ST) return;
    var s = $s("s-svg");
    if (ok) {
      ST.combo = (ST.combo || 0) + 1;
      mMood("happy");
      happyEyes(true);
      if (s) {
        s.classList.add("giggle");
        setTimeout(function () {
          s.classList.remove("giggle");
        }, 900);
      }
      if (ST.combo >= 3) {
        var cb = document.getElementById("stcombo");
        if (cb) {
          cb.hidden = false;
          cb.textContent = "🔥 " + ST.combo + " i rad!";
          cb.classList.remove("pop");
          void cb.offsetWidth;
          cb.classList.add("pop");
        }
      }
    } else {
      ST.combo = 0;
      mMood("sad");
      happyEyes(false);
      if (s) {
        s.classList.add("wob");
        setTimeout(function () {
          s.classList.remove("wob");
        }, 700);
      }
      var cb2 = document.getElementById("stcombo");
      if (cb2) cb2.hidden = true;
    }
    clearTimeout(stReact.t);
    stReact.t = setTimeout(function () {
      mMood("");
    }, 900);
  }
  function stAsk(words, hintSv) {
    var i,
      h2 =
        '<div class="otsiask"><button class="btn small" id="stsay" aria-label="Hör igen">🔊</button>' +
        '<div class="ochips">';
    for (i = 0; i < words.length; i++)
      h2 += '<button class="ochip" data-w="' + esc(words[i]) + '">' + esc(words[i]) + "</button>";
    h2 +=
      '<small id="sthint" hidden>' +
      esc(hintSv) +
      "</small>" +
      '<button class="obtnhelp" id="sthelp">Vad betyder det?</button></div></div>';
    return h2;
  }
  function stWire(words) {
    var sb = document.getElementById("stsay");
    if (sb)
      sb.onclick = function () {
        speakSeq(words);
      };
    var hb = document.getElementById("sthelp");
    if (hb)
      hb.onclick = function () {
        var el = document.getElementById("sthint");
        if (el) el.hidden = false;
        hb.remove();
      };
    var ch = app.querySelectorAll(".ochip"),
      ci;
    for (ci = 0; ci < ch.length; ci++)
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-w"), true);
        };
      })(ch[ci]);
    speakSeq(words);
  }
  function stDone(gain, title, sub, again, cityId) {
    var st = ST ? Math.max(1, 3 - (ST.wrong || 0)) : 1;
    ST = null;
    earnStars(gain);
    addXp(50);
    S.lessons = (S.lessons || 0) + 1;
    save();
    refreshTop();
    bumpQuest("themes", 1);
    /* bumpa bara aktuell orts uppdrag – annars kan en omspelad gammal ort knuffa fel orts framsteg */
    if (!cityId || cityId === tripCur().id) tripBump("theme", 1);
    burst(170);
    fanfare(st >= 3 ? 3 : 2);
    app.innerHTML =
      '<div class="card" style="text-align:center"><p class="kicker">' +
      esc(title) +
      "</p>" +
      '<div class="bigstars">' +
      "⭐".repeat(st) +
      "</div>" +
      '<p class="qsub">' +
      esc(sub) +
      "<br>⭐ +" +
      gain * starMult() +
      "</p>" +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<div class="row"><button class="btn big" id="stag">En gång till</button>' +
      '<button class="btn green" id="stmap">Till kartan 🗺️</button></div></div>';
    document.getElementById("stag").onclick = function () {
      stationStart(cityId);
    };
    document.getElementById("stmap").onclick = function () {
      go(tripScreen, true);
    };
  }

  /* ---------- SALME: finalen på sångfesten ---------- */
  var SONG = [
    { et: "Mu isamaa on minu arm", sv: "Mitt fosterland är min kärlek" },
    { et: "kellele olen andnud", sv: "som jag har gett" },
    { et: "mu kalli isamaa", sv: "mitt kära fosterland" },
    { et: "ja armastan ma teda", sv: "och jag älskar det" },
    { et: "su kõrgte mägede", sv: "dina höga berg" },
    { et: "su metsad laialt", sv: "dina vida skogar" },
    { et: "laulame koos", sv: "vi sjunger tillsammans" },
  ];
  function stFinale(first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    if (first)
      ST = {
        city: "salme",
        phase: 1,
        order: [],
        wrong: 0,
        stars: 0,
        lock: false,
        pool: shuffle(
          SONG.map(function (l, i) {
            return { i: i, l: l };
          }),
        ),
      };
    if (ST.phase === 2) {
      stSing();
      return;
    }
    var html =
      '<div class="zone"><span>🎶 <b>Laulupidu</b> · Salme</span>' +
      "<span>" +
      ST.order.length +
      " / " +
      SONG.length +
      " rader</span></div>" +
      '<div class="card"><p class="q">Pane laul järjekorda</p>' +
      '<p class="qsub">Du har samlat alla rader på resan. Lägg dem i rätt ordning — ' +
      "tryck på 🔊 för att höra hur raden låter.</p>" +
      '<div class="songbox">';
    var i;
    for (i = 0; i < SONG.length; i++) {
      var placed = ST.order[i];
      html +=
        '<div class="songslot' +
        (placed !== undefined ? " filled" : "") +
        '">' +
        '<span class="num">' +
        (i + 1) +
        "</span>" +
        '<span class="ln">' +
        (placed !== undefined ? esc(SONG[placed].et) : "—") +
        "</span>" +
        (placed !== undefined ? "<small>" + esc(SONG[placed].sv) + "</small>" : "") +
        "</div>";
    }
    html += '</div><div class="songpool">';
    for (i = 0; i < ST.pool.length; i++) {
      html +=
        '<button class="songcard" data-line="' +
        ST.pool[i].i +
        '">' +
        "<b>" +
        esc(ST.pool[i].l.et) +
        "</b><small>" +
        esc(ST.pool[i].l.sv) +
        "</small>" +
        '<span class="sp">🔊</span></button>';
    }
    html += '</div><p class="qsub" id="sttip">Vilken rad kommer först?</p></div>';
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-line]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var idx = parseInt(el.getAttribute("data-line"), 10),
            tip = document.getElementById("sttip");
          speak(SONG[idx].et);
          if (idx === ST.order.length) {
            ST.order.push(idx);
            ST.pool = ST.pool.filter(function (p) {
              return p.i !== idx;
            });
            sndOk();
            buzz(14);
            burst(30);
            var g = 14;
            ST.stars += g;
            earnStars(g);
            save();
            refreshTop();
            if (ST.order.length >= SONG.length) {
              ST.phase = 2;
              ST.lock = true;
              setTimeout(stSing, 900);
              return;
            }
            setTimeout(function () {
              stFinale(false);
            }, 450);
          } else {
            ST.wrong++;
            el.classList.add("nope");
            sndNo();
            buzz(26);
            if (tip) tip.textContent = "Inte den — lyssna på raderna och prova igen.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 450);
          }
        };
      })(bs[k]);
    }
  }
  function stSing() {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var html =
      '<div class="zone"><span>🎶 <b>Laulupidu</b> · Salme</span><span>sjung!</span></div>' +
      '<div class="card" style="text-align:center"><p class="kicker">🎤 Laulame!</p>' +
      '<div class="singstage">' +
      siilSVG() +
      "</div>" +
      '<div class="songbox sing" id="singbox">';
    var i;
    for (i = 0; i < SONG.length; i++)
      html +=
        '<div class="songslot filled" data-ln="' +
        i +
        '"><span class="ln">' +
        esc(SONG[i].et) +
        "</span>" +
        "<small>" +
        esc(SONG[i].sv) +
        "</small></div>";
    html +=
      '</div><button class="btn big green wide" id="singgo">🎶 Sjung hela sången</button>' +
      '<p class="qsub" id="sttip">Hela sångarfältet lyssnar.</p></div>';
    app.innerHTML = html;
    document.getElementById("singgo").onclick = function () {
      var i2 = 0;
      var box = document.getElementById("singbox");
      var step = function () {
        if (i2 > 0 && box.children[i2 - 1]) box.children[i2 - 1].classList.remove("now");
        if (i2 >= SONG.length) {
          stFinaleEnd();
          return;
        }
        if (box.children[i2]) box.children[i2].classList.add("now");
        speak(SONG[i2].et);
        burst(24);
        dance(i2 % 2 === 0);
        i2++;
        setTimeout(step, 1700);
      };
      step();
    };
  }
  function stFinaleEnd() {
    /* belöningen ges bara första gången - annars skulle fri repetition av Salmes
       station (se tripScreen) kunna farmas om och om igen för gratis XP/stjärnor */
    var firstTime = !S.songDone;
    var gain = 400 + (ST ? ST.stars : 0);
    var wrong = ST ? ST.wrong : 0;
    ST = null;
    if (!S.badges) S.badges = [];
    if (S.badges.indexOf("laulupidu") < 0) S.badges.push("laulupidu");
    S.songDone = 1;
    if (firstTime) {
      earnStars(gain);
      addXp(500);
    }
    save();
    refreshTop();
    if (firstTime) autoBackup("sångfesten");
    burst(420);
    fanfare(3);
    balloons(16);
    applause(18, 2.4);
    setTimeout(function () {
      speak("Hurraa! Hurraa! Hurraa!");
    }, 300);
    setTimeout(function () {
      burst(260);
      balloons(8);
    }, 700);
    setTimeout(function () {
      burst(220);
    }, 1400);
    app.innerHTML =
      '<div class="card" style="text-align:center"><p class="kicker">🎶 Laulupidu</p>' +
      '<h2 class="q">Sången är färdig!</h2>' +
      '<div class="center">' +
      siilSVG("big") +
      "</div>" +
      '<p class="qsub">Du har rest genom hela Estland, samlat alla sju raderna och sjungit dem ' +
      "på sångarfältet tillsammans med hundratusen andra.</p>" +
      '<div class="bigstars">⭐⭐⭐</div>' +
      '<p class="qsub">' +
      (firstTime ? "⭐ +" + gain * starMult() + " · nytt märke: <b>Laulupidu</b>" : "Tack för att du sjöng med igen!") +
      (firstTime && wrong === 0 ? "<br>Och inte ett enda fel på vägen." : "") +
      "</p>" +
      '<div class="row"><button class="btn green big" id="fmap">Till kartan 🗺️</button>' +
      '<button class="btn" id="froom">Till rummet 🏠</button></div></div>';
    document.getElementById("fmap").onclick = function () {
      go(tripScreen, true);
    };
    document.getElementById("froom").onclick = function () {
      go(roomScreen, true);
    };
  }

  /* ---------- SAMLA: lägg rätt saker i korgen/på brickan ---------- */
  /* illustrerad behållare per ort istället för den gamla tomma rutan - samma bild-mönster
     som guldflaskan/barkbåten i Paadisõit. Orter utan egen bild (de flesta "collect"-typer
     hör bara till Põlva/Valga/Kuressaare) faller tillbaka till den gamla tomma rutan. */
  var COLLECT_ART = { polva: "collect-basket", valga: "collect-wagon", kuressaare: "collect-tray" };
  function stCollect(id, first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var s = stationOf(id);
    if (first)
      ST = { city: id, round: 0, n: 6, wrong: 0, stars: 0, streak: 0, pool: stPool(s.pool, 30), tier: stTier(id) };
    if (ST.round >= ST.n) {
      stDone(60 + ST.round * 9, s.em + " " + s.et, "Du klarade alla " + ST.n + " beställningarna.", null, id);
      speak("Hästi tehtud!");
      return;
    }
    var num = 1 + ((Math.random() * 3) | 0),
      NUMW = ["üks", "kaks", "kolm"];
    var t = ST.pool[(Math.random() * ST.pool.length) | 0];
    var items = stCrates(t, ST.pool, num, 6 + ST.tier),
      i;
    /* guldföremål: en sällsynt extra-glittrig kopia av ett av de RÄTTA föremålen (aldrig
       en lurendrejare) - precis som guldflaskan i Paadisõit, dubbel belöning utan att
       någonsin kunna lura någon till fel svar. Högst ett i taget. */
    var correctIdx = [];
    for (i = 0; i < items.length; i++) if (items[i].w.et === t.et) correctIdx.push(i);
    if (correctIdx.length && Math.random() < 0.3) {
      items[correctIdx[(Math.random() * correctIdx.length) | 0]].golden = true;
    }
    ST.need = num;
    ST.have = 0;
    ST.target = t;
    ST.items = items;
    ST.lock = false;
    var art = COLLECT_ART[id];
    var html =
      stHead(id, ST.round + 1 + " / " + ST.n + " · ⭐ " + ST.stars) +
      '<div class="card">' +
      stAsk(["Korja kokku", t.et], "Lägg " + num + " " + t.sv + " i korgen") +
      '<div class="howmany" style="margin:0 0 8px">' +
      "●".repeat(num) +
      " <b>" +
      num +
      "</b>" +
      '<span id="collectstreak" class="fchip" style="margin-left:6px;display:none"></span>' +
      "</div>" +
      '<div class="basket' +
      (art ? " artbasket art-" + id : "") +
      '" id="basket"' +
      (art ? ' style="background-image:url(/images/games/' + art + '.webp)"' : "") +
      "></div>" +
      '<div class="quay">';
    for (i = 0; i < items.length; i++)
      html +=
        '<button class="crate' +
        (items[i].golden ? " golden" : "") +
        '" data-c="' +
        i +
        '">' +
        wIcon(items[i].w) +
        "</button>";
    html += '</div><p class="qsub" id="sttip">Tryck på sakerna som ska med.</p></div>';
    app.innerHTML = html;
    stWire(["Korja kokku", t.et]);
    var cs = app.querySelectorAll("[data-c]"),
      k;
    for (k = 0; k < cs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var it = ST.items[parseInt(el.getAttribute("data-c"), 10)],
            tip = document.getElementById("sttip");
          if (it.got) return;
          if (it.w.et === ST.target.et) {
            it.got = true;
            ST.have++;
            ST.streak = (ST.streak || 0) + 1;
            el.classList.add("loaded");
            sndOk();
            if (it.golden) {
              /* extra glittrigt ljud ovanpå sndOk() för guldfångsten, som i Paadisõit */
              tone(1180, 0.12, 0.3);
              tone(1760, 0.18, 0.42);
            }
            stReact(true);
            buzz(it.golden ? 30 : 14);
            speak(NUMW[Math.min(2, ST.have - 1)]);
            var bk = document.getElementById("basket");
            if (bk) bk.innerHTML += "<span>" + wIcon(it.w) + "</span>";
            /* combo-eskalering: fler rätt i rad ger en större konfettikaskad - som i Paadisõit */
            burst(it.golden ? 55 : Math.min(8 + ST.streak * 5, 35));
            var hm = app.querySelector(".howmany");
            if (hm) {
              hm.innerHTML =
                "●".repeat(ST.need - ST.have) +
                (ST.need - ST.have ? " <b>" + (ST.need - ST.have) + "</b>" : " <b>✓</b>") +
                '<span id="collectstreak" class="fchip" style="margin-left:6px;' +
                (ST.streak >= 3 ? "" : "display:none") +
                '">🔥 ' +
                ST.streak +
                "</span>";
            }
            if (ST.have >= ST.need) {
              ST.lock = true;
              ST.round++;
              var g = 10 + ST.round * 2 + (it.golden ? 10 : 0);
              ST.stars += g;
              earnStars(g);
              wmemHit(ST.target.et, true, "choose", ST.target.sv);
              save();
              refreshTop();
              if (tip) tip.innerHTML = '<b style="color:var(--moss)">Valmis!</b>';
              speak("Valmis!");
              burst(45);
              setTimeout(function () {
                stCollect(id, false);
              }, 1000);
            }
          } else {
            ST.wrong++;
            ST.streak = 0;
            el.classList.add("nope");
            sndNo();
            stReact(false);
            buzz(24);
            wmemHit(ST.target.et, false, "choose", ST.target.sv);
            if (tip) tip.innerHTML = "Det där är <b>" + esc(it.w.sv) + "</b>.";
            var streakEl2 = document.getElementById("collectstreak");
            if (streakEl2) streakEl2.style.display = "none";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 500);
          }
        };
      })(cs[k]);
    }
  }

  /* ---------- FÅNGA: saker driver förbi ---------- */
  function stCatch(id, first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var s = stationOf(id);
    if (first) ST = { city: id, round: 0, n: 8, wrong: 0, stars: 0, pool: stPool(s.pool, 24), tier: stTier(id) };
    if (ST.round >= ST.n) {
      stDone(70 + ST.round * 8, s.em + " " + s.et, "Du fångade alla " + ST.n + " orden.", null, id);
      speak("Hästi tehtud!");
      return;
    }
    var t = ST.pool[(Math.random() * ST.pool.length) | 0];
    var others = ST.pool.filter(function (w) {
      return w.et !== t.et;
    });
    var items = [t],
      i;
    for (i = 0; i < 3 + ST.tier; i++) items.push(others[(Math.random() * others.length) | 0]);
    items = shuffle(items);
    ST.items = items;
    ST.target = t;
    ST.lock = false;
    var flow = id === "narva" ? "river" : "sea";
    var html =
      stHead(id, ST.round + 1 + " / " + ST.n + " · ⭐ " + ST.stars) +
      '<div class="card">' +
      stAsk(["Püüa kinni", t.et], "Fånga " + t.sv) +
      '<div class="beach ' +
      flow +
      '">';
    var topStep = items.length > 1 ? Math.min(21, 78 / (items.length - 1)) : 0;
    for (i = 0; i < items.length; i++)
      html +=
        '<button class="float" data-f="' +
        i +
        '" style="animation-delay:-' +
        (1.4 + i * 1.5).toFixed(1) +
        "s;top:" +
        (8 + i * topStep).toFixed(1) +
        '%">' +
        wIcon(items[i]) +
        "</button>";
    html += '</div><p class="qsub" id="sttip">Tryck på rätt sak innan den driver förbi.</p></div>';
    app.innerHTML = html;
    stWire(["Püüa kinni", t.et]);
    var fs2 = app.querySelectorAll("[data-f]"),
      k;
    for (k = 0; k < fs2.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var w = ST.items[parseInt(el.getAttribute("data-f"), 10)],
            tip = document.getElementById("sttip");
          if (w.et === ST.target.et) {
            ST.lock = true;
            ST.round++;
            var g = 10 + ST.round * 2;
            ST.stars += g;
            earnStars(g);
            wmemHit(w.et, true, "choose", w.sv);
            save();
            refreshTop();
            el.classList.add("caught");
            sndOk();
            stReact(true);
            buzz(14);
            speak(w.et);
            burst(35);
            if (tip) tip.innerHTML = '<b style="color:var(--moss)">Püütud! ' + esc(w.sv) + "</b>";
            tripBump("hear", 1);
            setTimeout(function () {
              stCatch(id, false);
            }, 950);
          } else {
            ST.wrong++;
            el.classList.add("nope");
            sndNo();
            stReact(false);
            buzz(24);
            wmemHit(ST.target.et, false, "choose", ST.target.sv);
            if (tip) tip.innerHTML = "Det där är <b>" + esc(w.sv) + "</b>.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 500);
          }
        };
      })(fs2[k]);
    }
  }

  /* ---------- SORTERA: fyra lådor med färg ---------- */
  function stSort(id, first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var s = stationOf(id);
    if (first) {
      var tier = stTier(id);
      var BINS = [
        { id: "punane", sv: "röd", c: "#D6453F" },
        { id: "sinine", sv: "blå", c: "#3A72C8" },
        { id: "kollane", sv: "gul", c: "#E8B62C" },
        { id: "roheline", sv: "grön", c: "#4E9A5C" },
      ];
      if (tier >= 1) BINS.push({ id: "roosa", sv: "rosa", c: "#E06A9A" });
      if (tier >= 2) BINS.push({ id: "lilla", sv: "lila", c: "#8A5CC8" });
      ST = {
        city: id,
        round: 0,
        n: 8,
        wrong: 0,
        stars: 0,
        tier: tier,
        bins: BINS,
        done: BINS.map(function () {
          return 0;
        }),
      };
    }
    if (ST.round >= ST.n) {
      stDone(70 + ST.round * 8, s.em + " " + s.et, "Allt är sorterat — " + ST.n + " rätt.", null, id);
      speak("Hästi tehtud!");
      return;
    }
    var want = ST.bins[(Math.random() * ST.bins.length) | 0];
    ST.want = want;
    ST.lock = false;
    var piece = id === "muhu" ? '<span class="thread" id="pcs"></span>' : '<span class="stone" id="pcs"></span>';
    var html =
      stHead(id, ST.round + 1 + " / " + ST.n + " · ⭐ " + ST.stars) +
      '<div class="card">' +
      stAsk(["Pane kotti", ST.want.id], "Lägg i den " + ST.want.sv + "a asken") +
      '<div class="bookhand">' +
      piece +
      '</div><div class="shelves">';
    var i;
    for (i = 0; i < ST.bins.length; i++)
      html +=
        '<button class="shelfslot" data-s="' +
        ST.bins[i].id +
        '"><span class="shelfbar" style="background:' +
        ST.bins[i].c +
        '"></span>' +
        '<span class="shelfbooks">' +
        "●".repeat(Math.min(6, ST.done[i])) +
        "</span></button>";
    html += '</div><p class="qsub" id="sttip">Tryck på rätt ask.</p></div>';
    app.innerHTML = html;
    stWire(["Pane kotti", want.id]);
    var ss = app.querySelectorAll("[data-s]"),
      k;
    for (k = 0; k < ss.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var bid = el.getAttribute("data-s"),
            tip = document.getElementById("sttip"),
            i2;
          if (bid === ST.want.id) {
            ST.lock = true;
            for (i2 = 0; i2 < ST.bins.length; i2++) if (ST.bins[i2].id === bid) ST.done[i2]++;
            ST.round++;
            var g = 9 + ST.round * 2;
            ST.stars += g;
            earnStars(g);
            wmemHit(ST.want.id, true, "choose", ST.want.sv);
            save();
            refreshTop();
            var pc = document.getElementById("pcs");
            if (pc) pc.style.background = ST.want.c;
            el.classList.add("hit");
            sndOk();
            stReact(true);
            buzz(14);
            speak(ST.want.id);
            if (tip) tip.innerHTML = '<b style="color:var(--moss)">Õige!</b>';
            setTimeout(function () {
              stSort(id, false);
            }, 850);
          } else {
            ST.wrong++;
            el.classList.add("nope");
            sndNo();
            stReact(false);
            buzz(24);
            wmemHit(ST.want.id, false, "choose", ST.want.sv);
            var f = null;
            for (i2 = 0; i2 < ST.bins.length; i2++) if (ST.bins[i2].id === bid) f = ST.bins[i2];
            if (tip) tip.innerHTML = "Den asken är <b>" + esc(f ? f.sv : "") + "</b>.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 500);
          }
        };
      })(ss[k]);
    }
  }

  /* ---------- RÄKNA: hur många ser du ---------- */
  var NUMWORDS = ["üks", "kaks", "kolm", "neli", "viis", "kuus", "seitse", "kaheksa"];
  function stCount(id, first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var s = stationOf(id);
    if (first)
      ST = { city: id, round: 0, n: 7, wrong: 0, stars: 0, streak: 0, pool: stPool(s.pool, 20), tier: stTier(id) };
    if (ST.round >= ST.n) {
      stDone(
        60 + ST.round * 9,
        s.em + " " + s.et,
        "Du räknade rätt " + (ST.n - ST.wrong) + " av " + ST.n + ".",
        null,
        id,
      );
      speak("Hästi tehtud!");
      return;
    }
    var maxN = Math.min(8, 3 + Math.floor(ST.round / 2) + 2);
    var num = 1 + ((Math.random() * maxN) | 0);
    var t = ST.pool[(Math.random() * ST.pool.length) | 0];
    /* fler alternativ än möjliga tal (maxN) går inte att hitta - loopen nedan skulle annars
       bara ge upp efter 40 försök och tyst visa färre än tänkt */
    var numOpts = Math.min(maxN, 4 + ST.tier);
    var opts = [num],
      i,
      tries = 0;
    while (opts.length < numOpts && tries < 40) {
      var c = 1 + ((Math.random() * maxN) | 0);
      tries++;
      if (opts.indexOf(c) < 0) opts.push(c);
    }
    opts = shuffle(opts);
    ST.num = num;
    ST.lock = false;
    /* guldsvaret: det RÄTTA talet är ibland extra-glittrigt - alltid rätt svar, dubbel
       belöning, precis som guldflaskan i Paadisõit. */
    ST.golden = Math.random() < 0.3;
    var html =
      stHead(id, ST.round + 1 + " / " + ST.n + " · ⭐ " + ST.stars) +
      '<div class="card">' +
      stAsk(["Mitu on?", t.et], "Hur många " + t.sv + " ser du?") +
      '<span id="countstreak" class="fchip" style="display:none">🔥</span>' +
      '<div class="countbox">';
    for (i = 0; i < num; i++) html += '<span class="citem">' + wIcon(t) + "</span>";
    html += '</div><div class="opts numopts">';
    for (i = 0; i < opts.length; i++)
      html +=
        '<button class="opt' +
        (ST.golden && opts[i] === num ? " golden" : "") +
        '" data-n="' +
        opts[i] +
        '">' +
        esc(NUMWORDS[opts[i] - 1]) +
        "</button>";
    html += '</div><p class="qsub" id="sttip">Välj rätt tal på estniska.</p></div>';
    app.innerHTML = html;
    stWire(["Mitu on?", t.et]);
    var bs = app.querySelectorAll("[data-n]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var v = parseInt(el.getAttribute("data-n"), 10),
            tip = document.getElementById("sttip");
          var all = app.querySelectorAll("[data-n]"),
            q;
          if (v === ST.num) {
            ST.lock = true;
            for (q = 0; q < all.length; q++) {
              all[q].disabled = true;
              if (+all[q].getAttribute("data-n") === ST.num) all[q].className = "opt right";
            }
            ST.round++;
            ST.streak = (ST.streak || 0) + 1;
            var g = 10 + ST.round * 2 + (ST.golden ? 10 : 0);
            ST.stars += g;
            earnStars(g);
            wmemHitSentenceWords([NUMWORDS[ST.num - 1]], true);
            save();
            refreshTop();
            sndOk();
            if (ST.golden) {
              /* extra glittrigt ljud ovanpå sndOk() för guldsvaret, som i Paadisõit */
              tone(1180, 0.12, 0.3);
              tone(1760, 0.18, 0.42);
            }
            stReact(true);
            buzz(ST.golden ? 30 : 14);
            speak(NUMWORDS[ST.num - 1]);
            /* combo-eskalering: fler rätt i rad ger en större konfettikaskad - som i Paadisõit */
            burst(ST.golden ? 55 : Math.min(8 + ST.streak * 5, 35));
            var streakEl = document.getElementById("countstreak");
            if (streakEl) {
              if (ST.streak >= 3) {
                streakEl.style.display = "";
                streakEl.textContent = "🔥 " + ST.streak;
              } else streakEl.style.display = "none";
            }
            if (tip)
              tip.innerHTML =
                '<b style="color:var(--moss)">Õige! ' + ST.num + " = " + esc(NUMWORDS[ST.num - 1]) + "</b>";
            setTimeout(function () {
              stCount(id, false);
            }, 1000);
          } else {
            ST.wrong++;
            ST.streak = 0;
            el.className = "opt wrong";
            sndNo();
            stReact(false);
            buzz(24);
            wmemHitSentenceWords([NUMWORDS[ST.num - 1]], false);
            if (tip) tip.innerHTML = "Räkna en gång till — tryck på sakerna medan du räknar.";
            var streakEl2 = document.getElementById("countstreak");
            if (streakEl2) streakEl2.style.display = "none";
          }
        };
      })(bs[k]);
    }
  }

  /* ---------- PARA IHOP: bild mot ord ---------- */
  function stPairs(id, first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var s = stationOf(id);
    if (first)
      ST = { city: id, round: 0, n: 3, wrong: 0, stars: 0, streak: 0, pool: stPool(s.pool, 24), tier: stTier(id) };
    if (ST.round >= ST.n) {
      stDone(70 + ST.round * 12, s.em + " " + s.et, "Alla par hittade.", null, id);
      speak("Hästi tehtud!");
      return;
    }
    var pairN = 4 + ST.tier;
    var set = otsiPick(pairN, ST.pool);
    ST.set = set;
    ST.picked = null;
    ST.left = set.length;
    ST.lock = false;
    /* guldpar: ett sällsynt extra-glittrigt par (bild+ord) - matchar man det rätt ger det
       dubbel belöning, precis som guldflaskan i Paadisõit. Högst ett i taget. */
    ST.goldenKey = set.length && Math.random() < 0.3 ? set[(Math.random() * set.length) | 0].et : null;
    var words = shuffle(set.slice());
    var html =
      stHead(id, ST.round + 1 + " / " + ST.n + " · ⭐ " + ST.stars) +
      '<div class="card">' +
      '<p class="q">Leia paar · Para ihop bild och ord' +
      '<span id="pairstreak" class="fchip" style="margin-left:6px;display:none"></span>' +
      "</p>" +
      '<div class="pairgrid">';
    var i;
    for (i = 0; i < set.length; i++)
      html +=
        '<button class="pcard pic' +
        (set[i].et === ST.goldenKey ? " golden" : "") +
        '" data-pic="' +
        esc(set[i].et) +
        '">' +
        wIcon(set[i]) +
        "</button>";
    html += '</div><div class="pairgrid words">';
    for (i = 0; i < words.length; i++)
      html +=
        '<button class="pcard wrd' +
        (words[i].et === ST.goldenKey ? " golden" : "") +
        '" data-wrd="' +
        esc(words[i].et) +
        '">' +
        esc(words[i].et) +
        "</button>";
    html += '</div><p class="qsub" id="sttip">Tryck på en bild och sedan på ordet.</p></div>';
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-pic],[data-wrd]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock || el.classList.contains("done")) return;
          var tip = document.getElementById("sttip");
          var isPic = el.hasAttribute("data-pic");
          var key = isPic ? el.getAttribute("data-pic") : el.getAttribute("data-wrd");
          if (isPic) {
            speak(key);
          }
          if (!ST.picked) {
            ST.picked = { el: el, key: key, isPic: isPic };
            el.classList.add("sel");
            return;
          }
          if (ST.picked.el === el) {
            el.classList.remove("sel");
            ST.picked = null;
            return;
          }
          if (ST.picked.isPic === isPic) {
            ST.picked.el.classList.remove("sel");
            ST.picked = { el: el, key: key, isPic: isPic };
            el.classList.add("sel");
            return;
          }
          if (ST.picked.key === key) {
            var golden = key === ST.goldenKey;
            el.classList.add("done");
            ST.picked.el.classList.add("done");
            ST.picked.el.classList.remove("sel");
            ST.picked = null;
            ST.left--;
            ST.streak = (ST.streak || 0) + 1;
            sndOk();
            if (golden) {
              /* extra glittrigt ljud ovanpå sndOk() för guldparet, som i Paadisõit */
              tone(1180, 0.12, 0.3);
              tone(1760, 0.18, 0.42);
            }
            stReact(true);
            buzz(golden ? 30 : 12);
            speak(key);
            for (var pw = 0; pw < ST.set.length; pw++) {
              if (ST.set[pw].et === key) {
                wmemHit(ST.set[pw].et, true, "choose", ST.set[pw].sv);
                break;
              }
            }
            if (tip) tip.innerHTML = '<b style="color:var(--moss)">Õige!</b>';
            /* combo-eskalering: fler rätt i rad ger en större konfettikaskad - som i Paadisõit */
            burst(golden ? 55 : Math.min(8 + ST.streak * 5, 35));
            var streakEl = document.getElementById("pairstreak");
            if (streakEl) {
              if (ST.streak >= 3) {
                streakEl.style.display = "";
                streakEl.textContent = "🔥 " + ST.streak;
              } else streakEl.style.display = "none";
            }
            if (ST.left <= 0) {
              ST.lock = true;
              ST.round++;
              var g = 16 + ST.round * 4 + (golden ? 12 : 0);
              ST.stars += g;
              earnStars(g);
              save();
              refreshTop();
              burst(60);
              setTimeout(function () {
                stPairs(id, false);
              }, 900);
            }
          } else {
            ST.wrong++;
            ST.streak = 0;
            el.classList.add("nope");
            ST.picked.el.classList.remove("sel");
            var bad = el,
              old = ST.picked.el;
            ST.picked = null;
            sndNo();
            stReact(false);
            buzz(22);
            if (tip) tip.textContent = "Inte det paret. Prova igen.";
            var streakEl2 = document.getElementById("pairstreak");
            if (streakEl2) streakEl2.style.display = "none";
            setTimeout(function () {
              bad.classList.remove("nope");
              old.classList.remove("nope");
            }, 450);
          }
        };
      })(bs[k]);
    }
  }

  /* ---------- ORDNING: upprepa det Siiri säger ---------- */
  function stSeq(id, first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var s = stationOf(id);
    if (first) ST = { city: id, round: 0, n: 5, wrong: 0, stars: 0, pool: stPool(s.pool, 16), tier: stTier(id) };
    if (ST.round >= ST.n) {
      stDone(70 + ST.round * 10, s.em + " " + s.et, "Du klarade alla " + ST.n + " slingorna.", null, id);
      speak("Hästi tehtud!");
      return;
    }
    var capLen = 5 + ST.tier;
    var len = Math.min(capLen, 2 + Math.floor(ST.round / 1.5));
    var choices = otsiPick(Math.min(capLen, ST.pool.length), ST.pool);
    var seq = [],
      i;
    for (i = 0; i < len; i++) seq.push(choices[(Math.random() * choices.length) | 0]);
    ST.seq = seq;
    ST.step = 0;
    ST.choices = choices;
    ST.lock = true;
    var html =
      stHead(id, ST.round + 1 + " / " + ST.n + " · ⭐ " + ST.stars) +
      '<div class="card">' +
      '<p class="q">Korda järge · Upprepa ordningen</p>' +
      '<div class="seqdots" id="seqdots">';
    for (i = 0; i < len; i++) html += "<i></i>";
    html += '</div><div class="pairgrid">';
    for (i = 0; i < choices.length; i++)
      html += '<button class="pcard pic" data-seq="' + esc(choices[i].et) + '">' + wIcon(choices[i]) + "</button>";
    html +=
      '</div><p class="qsub" id="sttip">Lyssna först …</p>' +
      '<button class="btn wide" id="seqagain">🔊 Hör slingan igen</button></div>';
    app.innerHTML = html;
    var playSeq = function () {
      ST.lock = true;
      var tip = document.getElementById("sttip");
      if (tip) tip.textContent = "Lyssna …";
      speakSeq(
        seq.map(function (w) {
          return w.et;
        }),
      );
      setTimeout(
        function () {
          ST.lock = false;
          ST.step = 0;
          var t2 = document.getElementById("sttip");
          if (t2) t2.textContent = "Nu du — tryck i samma ordning.";
        },
        700 + seq.length * 900,
      );
    };
    playSeq();
    document.getElementById("seqagain").onclick = playSeq;
    var bs = app.querySelectorAll("[data-seq]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var et = el.getAttribute("data-seq"),
            tip = document.getElementById("sttip");
          var dots = document.getElementById("seqdots");
          if (et === ST.seq[ST.step].et) {
            if (dots && dots.children[ST.step]) dots.children[ST.step].className = "on";
            wmemHit(ST.seq[ST.step].et, true, "choose", ST.seq[ST.step].sv);
            ST.step++;
            sndOk();
            stReact(true);
            buzz(10);
            speak(et);
            if (ST.step >= ST.seq.length) {
              ST.lock = true;
              ST.round++;
              var g = 14 + ST.round * 3;
              ST.stars += g;
              earnStars(g);
              save();
              refreshTop();
              burst(50);
              if (tip) tip.innerHTML = '<b style="color:var(--moss)">Õige järjekord!</b>';
              setTimeout(function () {
                stSeq(id, false);
              }, 950);
            }
          } else {
            ST.wrong++;
            wmemHit(ST.seq[ST.step].et, false, "choose", ST.seq[ST.step].sv);
            ST.step = 0;
            el.classList.add("nope");
            sndNo();
            stReact(false);
            buzz(26);
            if (dots) for (var q = 0; q < dots.children.length; q++) dots.children[q].className = "";
            if (tip) tip.textContent = "Oj — börja om från början på slingan.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 450);
          }
        };
      })(bs[k]);
    }
  }

  /* bygger lådorna så att ANTALET inte avslöjar svaret:
       även lurendrejarna kommer i flera exemplar, minst en lika många som målet */
  function stCrates(target, pool, need, total) {
    var items = [],
      i,
      c;
    for (i = 0; i < need; i++) items.push({ w: target, got: false });
    var others = pool.filter(function (w) {
      return w.et !== target.et;
    });
    others = shuffle(others);
    var rest = total - need,
      k = 0;
    var first = true;
    while (rest > 0 && k < others.length) {
      if (first && rest >= need) {
        c = need;
        first = false;
      } /* en lurendrejare lika många */
      else c = 1 + ((Math.random() * Math.min(rest, 3)) | 0);
      if (c > rest) c = rest;
      for (i = 0; i < c; i++) items.push({ w: others[k], got: false });
      rest -= c;
      k++;
    }
    while (rest > 0 && others.length) {
      items.push({ w: others[(Math.random() * others.length) | 0], got: false });
      rest--;
    }
    return shuffle(items);
  }

  /* ---------- TALLINN: lasta båten ---------- */
  function stHarbor(first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    if (first) {
      ST = { city: "tallinn", round: 0, n: 6, wrong: 0, stars: 0, pool: stThings(40), loaded: [] };
    }
    if (ST.round >= ST.n) {
      stDone(60 + ST.round * 10, "⚓ Laev on täis!", "Du lastade båten med " + ST.n + " saker.", null, "tallinn");
      speak("Laev on täis!");
      return;
    }
    /* en last: ett antal av en sak */
    var num = 1 + ((Math.random() * 3) | 0);
    var NUMW = ["üks", "kaks", "kolm"]; /* räknas högt när varje sak läggs i */
    var target = ST.pool[(Math.random() * ST.pool.length) | 0];
    var crate = stCrates(target, ST.pool, num, 6),
      i;
    ST.need = num;
    ST.have = 0;
    ST.target = target;
    ST.crate = crate;
    ST.lock = false;
    var html =
      '<div class="zone"><span>⚓ <b>Sadam</b> · Tallinn</span><span>' +
      (ST.round + 1) +
      " / " +
      ST.n +
      " · ⭐ " +
      ST.stars +
      "</span></div>" +
      stMascotHtml() +
      '<div class="card"><div class="otsiask">' +
      '<button class="btn small" id="stsay" aria-label="Hör igen">🔊</button>' +
      '<div class="ochips"><button class="ochip" data-w="Pane paati">Pane paati</button>' +
      '<button class="ochip" data-w="' +
      esc(target.et) +
      '">' +
      esc(target.et) +
      "</button>" +
      '<span class="howmany">' +
      "●".repeat(num) +
      " <b>" +
      num +
      "</b></span>" +
      '<small id="sthint" hidden>Lägg ' +
      num +
      " " +
      esc(target.sv) +
      " i båten</small>" +
      '<button class="obtnhelp" id="sthelp">Vad betyder det?</button></div></div>' +
      '<div class="harbor">' +
      '<div class="boat"><div class="boathull"></div><div class="boatload" id="boatload"></div></div>' +
      '<div class="quay">';
    for (i = 0; i < crate.length; i++) {
      html += '<button class="crate" data-c="' + i + '"><span>' + wIcon(crate[i].w) + "</span></button>";
    }
    html += '</div></div><p class="qsub" id="sttip">Tryck på sakerna som ska ombord.</p></div>';
    app.innerHTML = html;
    speakSeq(["Pane paati", target.et]);
    document.getElementById("stsay").onclick = function () {
      speakSeq(["Pane paati", target.et]);
    };
    document.getElementById("sthelp").onclick = function () {
      var el = document.getElementById("sthint");
      if (el) el.hidden = false;
      var b = document.getElementById("sthelp");
      if (b) b.remove();
    };
    var ch = app.querySelectorAll(".ochip"),
      ci;
    for (ci = 0; ci < ch.length; ci++)
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-w"), true);
        };
      })(ch[ci]);
    var cs = app.querySelectorAll("[data-c]"),
      k;
    for (k = 0; k < cs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var idx = parseInt(el.getAttribute("data-c"), 10),
            c = ST.crate[idx];
          if (c.got) return;
          var tip = document.getElementById("sttip");
          if (c.w.et === ST.target.et) {
            c.got = true;
            ST.have++;
            el.classList.add("loaded");
            sndOk();
            stReact(true);
            buzz(14);
            var numSaid = NUMW[Math.min(2, ST.have - 1)]; /* üks … kaks … kolm */
            if (ST.have < ST.need) speak(numSaid); /* sista räknas ihop med berömmet nedan */
            var hm = app.querySelector(".howmany");
            if (hm)
              hm.innerHTML =
                "●".repeat(ST.need - ST.have) +
                (ST.need - ST.have ? " <b>" + (ST.need - ST.have) + "</b>" : " <b>✓</b>");
            var bl = document.getElementById("boatload");
            if (bl) bl.innerHTML += "<span>" + wIcon(c.w) + "</span>";
            if (ST.have >= ST.need) {
              ST.lock = true;
              ST.round++;
              var g = 10 + ST.round * 2;
              ST.stars += g;
              earnStars(g);
              wmemHit(ST.target.et, true, "choose", ST.target.sv);
              save();
              refreshTop();
              if (tip) tip.innerHTML = '<b style="color:var(--moss)">Tubli! Båten rullar vidare.</b>';
              speakSeq([numSaid, "Tubli!"]);
              burst(50);
              setTimeout(function () {
                stHarbor(false);
              }, 1800);
            } else if (tip) tip.textContent = "Bra! " + (ST.need - ST.have) + " till.";
          } else {
            ST.wrong++;
            el.classList.add("nope");
            sndNo();
            stReact(false);
            buzz(26);
            wmemHit(ST.target.et, false, "choose", ST.target.sv);
            if (tip)
              tip.innerHTML = "Det där är <b>" + esc(c.w.sv) + "</b>. Siiri bad om <b>" + esc(ST.target.sv) + "</b>.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 500);
          }
        };
      })(cs[k]);
    }
  }

  /* ---------- TARTU: sortera böckerna ---------- */
  function stLibrary(first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    var SHELF = [
      { id: "punane", sv: "röd", c: "#D6453F" },
      { id: "sinine", sv: "blå", c: "#3A72C8" },
      { id: "kollane", sv: "gul", c: "#E8B62C" },
      { id: "roheline", sv: "grön", c: "#4E9A5C" },
    ];
    if (first) ST = { city: "tartu", round: 0, n: 8, wrong: 0, stars: 0, shelf: SHELF, done: [0, 0, 0, 0] };
    if (ST.round >= ST.n) {
      stDone(
        70 + ST.round * 8,
        "📚 Kõik raamatud on riiulis!",
        "Du sorterade " + ST.n + " böcker rätt.",
        null,
        "tartu",
      );
      speak("Kõik raamatud on riiulis!");
      return;
    }
    var want = ST.shelf[(Math.random() * ST.shelf.length) | 0];
    ST.want = want;
    ST.lock = false;
    var html =
      '<div class="zone"><span>📚 <b>Raamatukogu</b> · Tartu</span><span>' +
      (ST.round + 1) +
      " / " +
      ST.n +
      " · ⭐ " +
      ST.stars +
      "</span></div>" +
      stMascotHtml() +
      '<div class="card"><div class="otsiask">' +
      '<button class="btn small" id="stsay" aria-label="Hör igen">🔊</button>' +
      '<div class="ochips"><button class="ochip" data-w="Pane riiulisse">Pane riiulisse</button>' +
      '<button class="ochip" data-w="' +
      esc(want.id) +
      '">' +
      esc(want.id) +
      "</button>" +
      '<small id="sthint" hidden>Ställ boken i den ' +
      esc(want.sv) +
      "a hyllan</small>" +
      '<button class="obtnhelp" id="sthelp">Vad betyder det?</button></div></div>' +
      '<div class="bookhand"><span class="bk plain" id="bkhand"></span></div>' +
      '<div class="shelves">';
    var i;
    for (i = 0; i < ST.shelf.length; i++) {
      html +=
        '<button class="shelfslot" data-s="' +
        ST.shelf[i].id +
        '">' +
        '<span class="shelfbar" style="background:' +
        ST.shelf[i].c +
        '"></span>' +
        '<span class="shelfbooks">' +
        "📕".repeat(Math.min(5, ST.done[i])) +
        "</span></button>";
    }
    html += '</div><p class="qsub" id="sttip">Tryck på rätt hylla.</p></div>';
    app.innerHTML = html;
    speakSeq(["Pane riiulisse", want.id]);
    document.getElementById("stsay").onclick = function () {
      speakSeq(["Pane riiulisse", want.id]);
    };
    document.getElementById("sthelp").onclick = function () {
      var el = document.getElementById("sthint");
      if (el) el.hidden = false;
      var b = document.getElementById("sthelp");
      if (b) b.remove();
    };
    var ch = app.querySelectorAll(".ochip"),
      ci;
    for (ci = 0; ci < ch.length; ci++)
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-w"), true);
        };
      })(ch[ci]);
    var ss = app.querySelectorAll("[data-s]"),
      k;
    for (k = 0; k < ss.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var id = el.getAttribute("data-s"),
            tip = document.getElementById("sttip"),
            i2;
          if (id === ST.want.id) {
            ST.lock = true;
            for (i2 = 0; i2 < ST.shelf.length; i2++) if (ST.shelf[i2].id === id) ST.done[i2]++;
            ST.round++;
            var g = 9 + ST.round * 2;
            ST.stars += g;
            earnStars(g);
            wmemHit(ST.want.id, true, "choose", ST.want.sv);
            save();
            refreshTop();
            var bkh = document.getElementById("bkhand");
            if (bkh) {
              bkh.classList.remove("plain");
              bkh.style.background = ST.want.c;
            }
            el.classList.add("hit");
            sndOk();
            stReact(true);
            buzz(14);
            speak(ST.want.id);
            if (tip) tip.innerHTML = '<b style="color:var(--moss)">Õige!</b>';
            setTimeout(function () {
              stLibrary(false);
            }, 900);
          } else {
            ST.wrong++;
            el.classList.add("nope");
            sndNo();
            stReact(false);
            buzz(26);
            wmemHit(ST.want.id, false, "choose", ST.want.sv);
            var f = null;
            for (i2 = 0; i2 < ST.shelf.length; i2++) if (ST.shelf[i2].id === id) f = ST.shelf[i2];
            if (tip)
              tip.innerHTML =
                "Den hyllan är <b>" + esc(f ? f.sv : "") + "</b>. Siiri sa <b>" + esc(ST.want.id) + "</b>.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 500);
          }
        };
      })(ss[k]);
    }
  }

  /* ---------- PÄRNU: fånga orden på vågorna ---------- */
  function stBeach(first) {
    screen = "station";
    setNav("home");
    btnBack.hidden = false;
    if (first) {
      ST = { city: "parnu", round: 0, n: 8, wrong: 0, stars: 0, pool: stThings(30) };
    }
    if (ST.round >= ST.n) {
      stDone(70 + ST.round * 8, "🏖️ Tubli püüdja!", "Du fångade " + ST.n + " ord på stranden.", null, "parnu");
      speak("Tubli!");
      return;
    }
    var target = ST.pool[(Math.random() * ST.pool.length) | 0];
    var others = ST.pool.filter(function (w) {
      return w.et !== target.et;
    });
    var items = [target],
      i;
    for (i = 0; i < 3; i++) items.push(others[(Math.random() * others.length) | 0]);
    items = shuffle(items);
    ST.target = target;
    ST.lock = false;
    var html =
      '<div class="zone"><span>🏖️ <b>Rand</b> · Pärnu</span><span>' +
      (ST.round + 1) +
      " / " +
      ST.n +
      " · ⭐ " +
      ST.stars +
      "</span></div>" +
      stMascotHtml() +
      '<div class="card"><div class="otsiask">' +
      '<button class="btn small" id="stsay" aria-label="Hör igen">🔊</button>' +
      '<div class="ochips"><button class="ochip" data-w="Püüa kinni">Püüa kinni</button>' +
      '<button class="ochip" data-w="' +
      esc(target.et) +
      '">' +
      esc(target.et) +
      "</button>" +
      '<small id="sthint" hidden>Fånga ' +
      esc(target.sv) +
      "</small>" +
      '<button class="obtnhelp" id="sthelp">Vad betyder det?</button></div></div>' +
      '<div class="beach">';
    for (i = 0; i < items.length; i++) {
      html +=
        '<button class="float" data-f="' +
        i +
        '" style="animation-delay:-' +
        (1.4 + i * 1.5).toFixed(1) +
        "s;top:" +
        (8 + i * 21) +
        '%">' +
        "<span>" +
        items[i].em +
        "</span></button>";
    }
    html += '</div><p class="qsub" id="sttip">Tryck på rätt sak innan den flyter förbi.</p></div>';
    app.innerHTML = html;
    ST.items = items;
    speakSeq(["Püüa kinni", target.et]);
    document.getElementById("stsay").onclick = function () {
      speakSeq(["Püüa kinni", target.et]);
    };
    document.getElementById("sthelp").onclick = function () {
      var el = document.getElementById("sthint");
      if (el) el.hidden = false;
      var b = document.getElementById("sthelp");
      if (b) b.remove();
    };
    var ch = app.querySelectorAll(".ochip"),
      ci;
    for (ci = 0; ci < ch.length; ci++)
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-w"), true);
        };
      })(ch[ci]);
    var fs = app.querySelectorAll("[data-f]"),
      k;
    for (k = 0; k < fs.length; k++) {
      (function (el) {
        el.onclick = function () {
          if (ST.lock) return;
          var w = ST.items[parseInt(el.getAttribute("data-f"), 10)],
            tip = document.getElementById("sttip");
          if (w.et === ST.target.et) {
            ST.lock = true;
            ST.round++;
            var g = 10 + ST.round * 2;
            ST.stars += g;
            earnStars(g);
            wmemHit(w.et, true, "choose", w.sv);
            save();
            refreshTop();
            el.classList.add("caught");
            sndOk();
            stReact(true);
            buzz(14);
            speak(w.et);
            burst(40);
            if (tip) tip.innerHTML = '<b style="color:var(--moss)">Püütud! ' + esc(w.sv) + "</b>";
            tripBump("hear", 1);
            setTimeout(function () {
              stBeach(false);
            }, 1000);
          } else {
            ST.wrong++;
            el.classList.add("nope");
            sndNo();
            stReact(false);
            buzz(26);
            wmemHit(ST.target.et, false, "choose", ST.target.sv);
            if (tip) tip.innerHTML = "Det där är <b>" + esc(w.sv) + "</b>.";
            setTimeout(function () {
              el.classList.remove("nope");
            }, 500);
          }
        };
      })(fs[k]);
    }
  }

  /* ---------- RESAN GENOM ESTLAND ---------- */
  /* kartan är en handmålad illustration (public/images/map/estonia.webp, se
     tripMapSVG()) istället för en platt vektorform - orterna/vägen/Siiri ligger kvar som
     SVG ovanpå, positionerade för att träffa rätt plats på just den bilden. */
  var MAP_IMG = "/images/map/estonia.webp";
  /* kartan följer årstiden (samma seasonNow() som hemskärmens hälsning redan läser) istället
     för att se likadan ut i juli som i januari - bara ströddda ikoner ovanpå kartbilden, ingen
     ny partikelmotor (seasonFx() kör redan canvas-snö/kronblad på andra skärmar). */
  var MAP_DECO_SPOTS = [
    { x: 181.7, y: 80.1 },
    { x: 227.1, y: 80.1 },
    { x: 196.8, y: 128.1 },
    { x: 257.3, y: 153.8 },
    { x: 166.5, y: 153.8 },
  ];
  function mapSeasonTheme() {
    var fx = seasonNow().fx;
    if (fx === "snow") return { deco: "❄️" };
    if (fx === "petals") return { deco: "🌸" };
    if (fx === "leaves") return { deco: "🍂" };
    return { deco: "" };
  }
  function tripMapSVG() {
    var n = tripReached(),
      i,
      s = "",
      mt2 = mapSeasonTheme();
    s +=
      '<svg viewBox="0 0 330 205" class="estmap" role="img" aria-label="Karta över Estland">' +
      '<defs><clipPath id="mclip"><rect x="0" y="0" width="330" height="205" rx="18"/></clipPath></defs>' +
      '<image href="' +
      MAP_IMG +
      '" x="0" y="0" width="330" height="205" preserveAspectRatio="none" clip-path="url(#mclip)"/>';
    if (mt2.deco) {
      for (i = 0; i < MAP_DECO_SPOTS.length; i++) {
        s +=
          '<text x="' +
          MAP_DECO_SPOTS[i].x +
          '" y="' +
          MAP_DECO_SPOTS[i].y +
          '" font-size="11" opacity=".55" style="pointer-events:none">' +
          mt2.deco +
          "</text>";
      }
    }
    /* orter utan stopp - men klickbara sido-stopp: ingen spärr, inget att missa, bara en
       bonus (uttal + lite stjärnor första gången) för den som utforskar kartan nyfiket */
    for (i = 0; i < MAPTOWNS.length; i++) {
      var mt = MAPTOWNS[i];
      var ax = mt.end ? "end" : "start",
        tx = mt.x + (mt.end ? -4 : 4),
        sideFound = (S.firsts || []).indexOf("side:" + mt.et) >= 0;
      s +=
        '<g class="mtown' +
        (sideFound ? " found" : "") +
        '" data-side="' +
        esc(mt.et) +
        '" style="cursor:pointer">' +
        '<circle cx="' +
        mt.x +
        '" cy="' +
        mt.y +
        '" r="7" fill="transparent"/>' +
        '<circle cx="' +
        mt.x +
        '" cy="' +
        mt.y +
        '" r="2.2" fill="' +
        (sideFound ? "#D9A52B" : "#6E8A66") +
        '"/>' +
        '<text x="' +
        tx +
        '" y="' +
        (mt.y + (mt.dy || 3)) +
        '" text-anchor="' +
        ax +
        '" font-size="7" fill="none" ' +
        'stroke="#F6FBF2" stroke-width="2.4" stroke-linejoin="round">' +
        esc(mt.et) +
        "</text>" +
        '<text x="' +
        tx +
        '" y="' +
        (mt.y + (mt.dy || 3)) +
        '" text-anchor="' +
        ax +
        '" font-size="7" fill="#4A6647">' +
        esc(mt.et) +
        "</text></g>";
    }
    /* vägen */
    var d = "",
      d2 = "";
    for (i = 0; i < TRIP.length; i++) {
      d += (i ? " L" : "M") + TRIP[i].x + " " + TRIP[i].y;
    }
    for (i = 0; i < n; i++) {
      d2 += (i ? " L" : "M") + TRIP[i].x + " " + TRIP[i].y;
    }
    s +=
      '<path d="' +
      d +
      '" fill="none" stroke="#7A5C42" stroke-width="1.1" stroke-dasharray="3 4.5" opacity=".4"/>' +
      '<path d="' +
      d2 +
      '" fill="none" stroke="#C8305A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>';
    for (i = 0; i < TRIP.length; i++) {
      var t = TRIP[i],
        open = i < n,
        here = i === n - 1,
        /* bara "här är du nu" ska sticka ut - redan besökta orter får en liten, lugn
           prick i samma stil som sido-stoppen (MAPTOWNS), annars tävlar 20 lika tjocka
           cirklar om uppmärksamheten på en gång */
        passed = open && !here;
      s +=
        '<g class="mstop' +
        (open ? "" : " locked") +
        (here ? " here" : "") +
        '" data-stop="' +
        t.id +
        '" style="cursor:' +
        (open ? "pointer" : "default") +
        '">' +
        '<circle cx="' +
        t.x +
        '" cy="' +
        t.y +
        '" r="' +
        (here ? 10 : passed ? 6 : 7.5) +
        '" fill="' +
        (open ? "#FFF7E8" : "#E6EBE2") +
        '" stroke="' +
        (here ? "#C8305A" : passed ? "#B7C4AF" : "#93A78D") +
        '" stroke-width="' +
        (here ? 2.2 : 1.2) +
        '"/>' +
        '<text x="' +
        t.x +
        '" y="' +
        (t.y + (here ? 4 : passed ? 2.5 : 3.2)) +
        '" text-anchor="middle" font-size="' +
        (here ? 11 : passed ? 7.5 : 8.5) +
        '">' +
        (open ? t.em : "🔒") +
        "</text>" +
        '<text x="' +
        (t.x + (t.lx || 0)) +
        '" y="' +
        (t.y + (t.ly || (here ? 23 : 20))) +
        '" text-anchor="middle" font-size="8.5" font-weight="700" ' +
        'fill="none" stroke="#F6FBF2" stroke-width="3" stroke-linejoin="round">' +
        esc(t.et) +
        "</text>" +
        '<text x="' +
        (t.x + (t.lx || 0)) +
        '" y="' +
        (t.y + (t.ly || (here ? 23 : 20))) +
        '" text-anchor="middle" font-size="8.5" font-weight="700" ' +
        'fill="#28402C">' +
        esc(t.et) +
        "</text>" +
        "</g>";
    }
    /* Siiri står som en spelpjäs bredvid orten hon nått */
    var me = TRIP[n - 1];
    var walking = S.walkFrom !== undefined && S.walkFrom !== null && S.walkFrom !== n - 1;
    var from = walking ? TRIP[S.walkFrom] : me;
    var px = me.x + 13,
      py = me.y - 17;
    s +=
      '<g id="mewalk"' +
      (walking ? ' style="--fx:' + (from.x - me.x) + "px;--fy:" + (from.y - me.y) + 'px"' : "") +
      ">" +
      '<ellipse cx="' +
      px +
      '" cy="' +
      (py + 9) +
      '" rx="7" ry="2.4" fill="#2E402C" opacity=".28"/>' +
      '<path d="M' +
      (px - 6) +
      " " +
      (py + 8) +
      ' q6 3 12 0 v-2 q-6 3 -12 0 z" fill="#C8305A" opacity=".9"/>' +
      '<text x="' +
      px +
      '" y="' +
      (py + 6) +
      '" text-anchor="middle" font-size="17">🦔</text></g>';
    /* en kort "framme!"-bildtext som dyker upp precis när gånganimationen landar (samma
       --fx/--fy-mönster), så ankomsten känns som en liten höjdpunkt istället för att bara
       vara en prick som flyttat sig */
    if (walking) {
      /* klämd mot kartkanten annars - flera orter (t.ex. Narva) ligger nära övre/högra
         kanten av viewBox:en, så etiketten måste både klampas i x och kunna hamna under
         Siiri istället för ovanför när det inte finns plats upptill */
      var ax = Math.min(304, Math.max(26, px)),
        ay = py - 10 >= 8 ? py - 10 : py + 24;
      s +=
        '<g id="mearrive" transform="translate(' +
        ax +
        "," +
        ay +
        ')"><rect x="-26" y="-11" width="52" height="15" rx="7" fill="#2A1B0C" opacity=".72"/>' +
        '<text x="0" y="0" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">' +
        me.em +
        " " +
        esc(me.et) +
        "!</text></g>";
    }
    s += "</svg>";
    return s;
  }
  /* kartan är 330 enheter bred och Estland ungefär 380 km – ger en km-skala */
  var KM_PER_UNIT = 1.18;
  function legKm(i) {
    if (i <= 0) return 0;
    var a = TRIP[i - 1],
      b = TRIP[i];
    return Math.round(Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)) * KM_PER_UNIT);
  }
  function kmWalked() {
    var i,
      s = 0;
    for (i = 1; i < tripReached(); i++) s += legKm(i);
    return s;
  }
  function kmTotal() {
    var i,
      s = 0;
    for (i = 1; i < TRIP.length; i++) s += legKm(i);
    return s;
  }

  /* små händelser på vägen mellan två orter */
  var ROAD = [
    { em: "🫐", et: "Mustikad!", sv: "Blåbär vid stigen", stars: 20, word: "mustikas" },
    { em: "🌧️", et: "Vihma sajab.", sv: "Det börjar regna — Siiri springer", stars: 10, word: "vihm" },
    { em: "🦌", et: "Põder!", sv: "En älg står mitt på vägen", stars: 25, word: "põder" },
    { em: "🪺", et: "Linnupesa.", sv: "Ett fågelbo i en gran", stars: 15, word: "lind" },
    { em: "🍄", et: "Seened!", sv: "Svamp i mossan", stars: 20, word: "seen" },
    { em: "🌈", et: "Vikerkaar!", sv: "En regnbåge över åkern", stars: 30, word: "vikerkaar" },
    { em: "🚲", et: "Jalgratas!", sv: "Någon lånar ut en cykel", stars: 15, word: "jalgratas" },
    { em: "⭐", et: "Täht!", sv: "Siiri hittar en stjärna i vattenpölen", stars: 35, word: "täht" },
  ];
  function roadEvent(legIndex) {
    var seed = dayHash("road" + legIndex + (S.name || ""));
    return ROAD[seed % ROAD.length];
  }
  /* "Mängi" ska starta något, inte lämna barnet på startsidan.
       För skrivuppdraget väljs det upplåsta tema som har flest ord mogna för
       skrivfrågor (r>=2); för temauppdraget det tema som är längst ifrån klart. */
  function bestThemeFor(kind) {
    var lim = themesUnlocked(),
      best = null,
      bestN = -1,
      i,
      j,
      n,
      m;
    for (i = 0; i < Math.min(lim, THEMES.length); i++) {
      var t = THEMES[i],
        ws = stepWords(t);
      n = 0;
      for (j = 0; j < ws.length; j++) {
        m = (S.wordmem || {})[mkey(ws[j].et, ws[j].sv)] || {};
        if (kind === "type") {
          if ((m.r || 0) >= 2) n++;
        } else {
          if (!m.r) n++;
        } /* tema: flest ord kvar att möta */
      }
      if (n > bestN) {
        bestN = n;
        best = t;
      }
    }
    return best;
  }
  /* varje uppdrag ska gå att starta direkt – annars vet barnet inte var man gör det */
  var TASKGO = {
    words: { go: "practice", lbl: "Mängi" },
    theme: { go: "theme", lbl: "Mängi" },
    mix: { go: "speed", lbl: "Mängi" },
    /* skrivfrågor dyker bara upp i en temalektion, och först när ordet börjat sitta */
    type: { go: "typetheme", lbl: "Mängi", tip: "skrivfrågor kommer när ordet börjat sitta" },
    sent: { go: "sent", lbl: "Mängi" },
    talk: { go: "talk", lbl: "Mängi" },
    hear: { go: "speed", lbl: "Mängi", tip: "Mikrofonen behövs inte — lyssna och välj räcker" },
    otsi: { go: "otsi", lbl: "Mängi" },
    mem: { go: "mem", lbl: "Mängi" },
    duel: { go: "duel", lbl: "Mängi" },
  };
  function taskListHtml(cityId) {
    var tasks = TRIPTASKS[cityId] || [
        ["words", 3],
        ["theme", 1],
        ["mix", 1],
      ],
      i,
      s = "";
    s += '<div class="tasklist">';
    for (i = 0; i < tasks.length; i++) {
      var kind = tasks[i][0],
        goal = tasks[i][1],
        val = Math.min(taskValue(kind), goal),
        done = val >= goal;
      var tt = TASKTEXT[kind],
        tg = TASKGO[kind] || {};
      s +=
        '<div class="task' +
        (done ? " done" : "") +
        '"><span class="tem">' +
        (done ? "✅" : tt.em) +
        "</span>" +
        '<span class="ttx"><b>' +
        esc(tt.sv) +
        (goal > 1 && kind !== "words" ? " (" + goal + " st)" : "") +
        "</b>" +
        '<span class="qbar" style="background:var(--line)"><i style="width:' +
        Math.round((val / goal) * 100) +
        "%;background:" +
        (done ? "var(--moss)" : "var(--berry)") +
        '"></i></span>' +
        "<small>" +
        val +
        " av " +
        goal +
        (tg.tip ? " · " + esc(tg.tip) : "") +
        "</small></span>" +
        (done
          ? '<span class="taskdone">Klar</span>'
          : '<button class="btn small taskgo" data-taskgo="' +
            kind +
            '" data-city="' +
            esc(cityId) +
            '">' +
            (tg.lbl || "Mängi") +
            " ▸</button>") +
        "</div>";
    }
    return s + "</div>";
  }
  function stopCardHtml(t, isHere, n) {
    var sta = stationOf(t.id),
      gift = itemById(SOUVENIR[t.id]),
      j,
      s = "";
    s +=
      '<div class="card stopcard' +
      (isHere ? " now" : "") +
      '" data-city="' +
      t.id +
      '">' +
      (isHere
        ? ""
        : '<button class="btn-plain caret" data-openstop="' +
          t.id +
          '" style="float:right;font-size:18px">▾</button>') +
      '<p class="q" style="text-align:left;margin-bottom:2px">' +
      t.em +
      ' <span lang="et">' +
      esc(t.et) +
      "</span>" +
      (isHere ? ' <small class="herenow">siin oled · här är du</small>' : "") +
      '<button class="speakbtn sm" data-say="' +
      esc(t.et) +
      '" style="float:right" aria-label="Hör ortens namn">🔊</button></p>' +
      (STORY[t.id] ? '<p class="storyline">' + STORY[t.id].replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") + "</p>" : "") +
      '<p class="qsub" style="text-align:left">' +
      esc(t.fact) +
      "</p>";
    if (isHere) {
      var tl = tasksLeft();
      s +=
        '<p class="qsub" style="text-align:left;margin-top:8px"><b>' +
        (tl
          ? "Klara alla tre, så vandrar Siiri vidare" + (TRIP[n] ? " till " + esc(TRIP[n].et) : "") + "."
          : "Alla uppdrag klara!") +
        "</b></p>" +
        taskListHtml(t.id);
    }
    /* souveniren visas även på redan klara orter (inte bara "här") - annars syns aldrig
       vad man faktiskt fick, bara ett löfte innan man var klar */
    if (gift)
      s +=
        '<p class="qsub" style="text-align:left;margin-top:8px">🎁 ' +
        (isHere ? "Souvenir när allt är klart: " : "Souvenir du fick här: ") +
        "<b>" +
        gift.em +
        ' <span lang="et">' +
        esc(gift.et) +
        "</span></b> — " +
        esc(gift.sv) +
        "</p>";
    s += '<button class="btn wide" data-practice="' + t.id + '" style="margin-top:8px">🎧 Öva de tre orden</button>';
    if (sta)
      s +=
        '<button class="btn green stationbtn" data-station="' +
        t.id +
        '">' +
        '<span class="stbtx">' +
        sta.em +
        ' <span lang="et">' +
        esc(sta.et) +
        "</span> · " +
        esc(sta.verb) +
        "</span>" +
        '</button><p class="qsub" style="text-align:left">' +
        esc(sta.intro) +
        "</p>";
    s += '<div class="stopwords">';
    for (j = 0; j < t.words.length; j++) {
      var wd = t.words[j];
      s +=
        '<div class="wordrow"><span class="em">' +
        wIcon(wd) +
        '</span><span class="t"><b lang="et">' +
        esc(wd.et) +
        "</b>" +
        "<span>" +
        esc(wd.sv) +
        " · uttal: " +
        esc(wd.hint) +
        "</span></span>" +
        '<button class="speakbtn sm" data-say="' +
        esc(wd.et) +
        '" data-refresh="1" aria-label="Hör ordet">🔊</button>' +
        '<button class="speakbtn sm" data-slow="' +
        esc(wd.et) +
        '" aria-label="Långsamt">🐢</button></div>';
    }
    return s + "</div></div>";
  }
  /* reseskrapbok - en samlad översikt av allt barnet redan samlat på resan (fakta + souvenir
     per ort), istället för att behöva fälla ut varje besökt ort för sig i "Besökta orter". */
  function tripScrapbookScreen() {
    screen = "scrapbook";
    var n = tripReached(),
      i,
      html;
    html =
      '<div class="zone map"><span class="zem">📖</span><span><b>Reseskrapbok</b>' +
      "<span>" +
      (n - 1) +
      " av " +
      TRIP.length +
      " orter samlade</span></span></div>" +
      '<div class="scrapgrid">';
    for (i = 0; i < TRIP.length; i++) {
      var t = TRIP[i],
        open = i < n,
        gift = open ? itemById(SOUVENIR[t.id]) : null;
      if (open) {
        var story = STORY[t.id] || "",
          loreKey = null;
        for (var lk in LORE) {
          if (story.indexOf(LORE[lk].et) >= 0) {
            loreKey = lk;
            break;
          }
        }
        html +=
          '<div class="card scrapcard">' +
          (loreKey
            ? '<span class="charpeek scrapcard-lore" data-char="lore:' +
              loreKey +
              '" role="button" tabindex="0" aria-label="Visa ' +
              esc(LORE[loreKey].et) +
              '"><img src="' +
              LORE[loreKey].img +
              '" alt=""></span>'
            : "") +
          '<p class="q" style="text-align:left;margin-bottom:2px">' +
          t.em +
          ' <span lang="et">' +
          esc(t.et) +
          "</span></p>" +
          (story ? '<p class="storyline">' + story.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") + "</p>" : "") +
          '<p class="qsub" style="text-align:left">' +
          esc(t.fact) +
          "</p>" +
          (gift ? '<p class="qsub" style="text-align:left"><b>🎁 ' + gift.em + " " + esc(gift.sv) + "</b></p>" : "") +
          "</div>";
      } else {
        html +=
          '<div class="card scrapcard locked"><p class="q" style="text-align:left;margin-bottom:2px">🔒 ???</p>' +
          '<p class="qsub" style="text-align:left">Fortsätt resan för att låsa upp.</p></div>';
      }
    }
    html += "</div>";
    app.innerHTML = html;
  }
  function tripScreen() {
    screen = "trip";
    setNav("trip");
    prefetch("trip");
    var n = tripReached(),
      here = TRIP[n - 1],
      next = TRIP[n],
      i;
    var tl = tasksLeft(),
      tasks = tasksOf(),
      gift = itemById(SOUVENIR[here.id]);
    var songPct = Math.round((tripDone() / TRIP.length) * 100);
    var html =
      '<div class="zone map"><span class="zem">🗺️</span><span><b>Teekond</b><span>Resan genom Estland</span></span></div>';
    /* målet först: barnet ska veta vad resan går ut på innan det ser kartan */
    html +=
      '<div class="card goalcard"><p class="q" style="text-align:left;margin-bottom:2px">🎶 Laulupidu · Sångfesten</p>' +
      '<p class="qsub" style="text-align:left">Hjälp Siiri att resa genom Estlands ' +
      TRIP.length +
      " orter. I varje ort väntar nya ord och uppdrag.</p>" +
      '<div class="songrow"><b class="songbig">' +
      tripDone() +
      " av " +
      TRIP.length +
      "</b><span>orter besökta</span></div>" +
      '<span class="qbar" style="background:var(--line)"><i style="width:' +
      songPct +
      '%;background:var(--berry)"></i></span>' +
      (n > 1
        ? '<button class="btn ghost wide" id="scrapbookbtn" style="margin-top:10px">📖 Reseskrapbok</button>'
        : "") +
      "</div>";
    html +=
      '<div class="card">' +
      '<p class="qsub">' +
      esc(UI.trip.sv) +
      " · " +
      n +
      " av " +
      TRIP.length +
      " orter</p>" +
      tripMapSVG() +
      '<div class="kmbar"><span>🥾 ' +
      kmWalked().toLocaleString("sv-SE") +
      " km</span>" +
      '<span class="qbar" style="background:var(--line)"><i style="width:' +
      Math.round((kmWalked() / kmTotal()) * 100) +
      '%;background:var(--bark)"></i></span>' +
      '<span style="color:var(--muted)">av ' +
      kmTotal().toLocaleString("sv-SE") +
      "</span></div>" +
      (n < TRIP.length
        ? '<p class="qsub" style="margin-top:6px">Nästa etapp: <span lang="et">' +
          esc(TRIP[n].et) +
          "</span> · " +
          legKm(n) +
          " km</p>"
        : "") +
      "</div>";
    if (tripDone() >= TRIP.length) {
      html +=
        '<div class="card" style="text-align:center"><p class="q">🎶 Sången är färdig!</p>' +
        '<p class="storyline" style="text-align:left">Siiri står på sångarfältet med alla ' +
        SONG.length +
        " rader hon samlat på resan i huvudet. Hundratusen röster börjar samtidigt — och hon kan varenda rad, för du hjälpte henne att hitta dem." +
        "</p>" +
        '<div class="center">' +
        siilSVG() +
        "</div>" +
        (S.songDone
          ? '<button class="btn green big wide" id="singit" style="margin-top:10px">🎵 Sjung med Siiri igen</button>'
          : '<button class="btn green big wide" id="singit" style="margin-top:10px">🎤 Sjung hela sången</button>') +
        (S.songDone
          ? '<button class="btn ' +
            (S.epiDone ? "ghost" : "green") +
            ' big wide" id="epilogue" style="margin-top:10px">' +
            (S.epiDone ? "🪨 Kalevipoja kivi" : S.epiStep ? "🪨 Fortsätt: Kalevipoja rajal" : "🪨 Kalevipoja rajal") +
            "</button>"
          : "") +
        "</div>";
    }
    /* ortkortet för orten man är på: berättelse, uppdrag och ord på samma ställe */
    html += stopCardHtml(here, true, n);
    /* de klarade orterna ligger hopfällda längst ner - när hela resan är klar är de
       istället en övningsbank: utfällda som standard (om inte spelaren själv fällt
       ihop dem), och stationsknappen i varje kort funkar fortfarande fritt (ingen
       spärr i data-station-hanteringen) - så vilken ort som helst går att öva om. */
    if (n > 1) {
      var done = tripDone() >= TRIP.length;
      var vis = done ? S.tripVisited !== false : !!S.tripVisited;
      html +=
        '<button class="card visitedhead" id="visitedhead"><span class="sem">🏰</span>' +
        '<span class="stx"><b lang="et">Külastatud</b><small>' +
        (done ? "Öva valfri ort · " : "Besökta orter · ") +
        (n - 1) +
        " st</small></span>" +
        '<span class="caret">' +
        (vis ? "▾" : "▸") +
        "</span></button>";
      if (vis) {
        for (i = n - 2; i >= 0; i--) {
          var t0 = TRIP[i],
            op0 = S.tripOpen === t0.id;
          if (op0) {
            html += stopCardHtml(t0, false, n);
          } else {
            html +=
              '<button class="card stopmini" data-openstop="' +
              t0.id +
              '">' +
              '<span class="sem">' +
              t0.em +
              "</span>" +
              '<span class="stx"><b lang="et">' +
              esc(t0.et) +
              "</b><small>" +
              esc(t0.sv) +
              " · klar ✓</small></span>" +
              '<span class="caret">▸</span></button>';
          }
        }
      }
    }
    app.innerHTML = html;
    var pb = app.querySelectorAll("[data-practice]"),
      pq;
    for (pq = 0; pq < pb.length; pq++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          tripPractice(el.getAttribute("data-practice"));
        };
      })(pb[pq]);
    }
    var os = app.querySelectorAll("[data-openstop]"),
      oq;
    for (oq = 0; oq < os.length; oq++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          var id = el.getAttribute("data-openstop");
          S.tripOpen = S.tripOpen === id ? "-" : id;
          save();
          tripScreen();
        };
      })(os[oq]);
    }
    var vh = document.getElementById("visitedhead");
    if (vh)
      vh.onclick = function () {
        /* samma "utfälld som standard när resan är klar"-logik som i html-bygget ovan -
           annars skulle ett klick när S.tripVisited råkar vara undefined kunna fälla ut
           den igen istället för att fälla ihop den */
        var curVis = tripDone() >= TRIP.length ? S.tripVisited !== false : !!S.tripVisited;
        S.tripVisited = !curVis;
        save();
        tripScreen();
      };
    var tg = app.querySelectorAll("[data-taskgo]"),
      tq;
    for (tq = 0; tq < tg.length; tq++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          var kind = el.getAttribute("data-taskgo"),
            city = el.getAttribute("data-city");
          var dest = (TASKGO[kind] || {}).go;
          stopSpeak();
          if (dest === "practice") {
            tripPractice(city);
            return;
          }
          if (dest === "theme" || dest === "typetheme") {
            var bt = bestThemeFor(dest === "typetheme" ? "type" : "theme");
            if (bt) {
              lessonStart(bt.id);
              return;
            }
            go(homeScreen, true);
            return;
          }
          var f = {
            home: homeScreen,
            speed: speedIntro,
            sent: sentIntro,
            talk: talkScreen,
            otsi: otsiIntro,
            mem: memIntro,
            duel: duelIntro,
          }[dest];
          if (f) go(f, true);
        };
      })(tg[tq]);
    }
    var sb3 = app.querySelectorAll("[data-station]"),
      sq3;
    for (sq3 = 0; sq3 < sb3.length; sq3++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          stationStart(el.getAttribute("data-station"));
        };
      })(sb3[sq3]);
    }
    /* knappen spelade tidigare bara upp en hårdkodad, orelaterad tvåradig sångsnutt -
       Salmes egen station (stFinale/stSing) bygger redan hela den riktiga sången av
       alla sju rader man samlat, så knappen hoppar dit istället för att duplicera det */
    var sing = document.getElementById("singit");
    if (sing)
      sing.onclick = function () {
        stationStart("salme");
      };
    var epi = document.getElementById("epilogue");
    if (epi)
      epi.onclick = function () {
        go(epilogueScreen, true);
      };
    var scrap = document.getElementById("scrapbookbtn");
    if (scrap)
      scrap.onclick = function () {
        go(tripScrapbookScreen, true);
      };
    var b = app.querySelectorAll("[data-say]"),
      k;
    for (k = 0; k < b.length; k++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          var wd = el.getAttribute("data-say");
          speak(wd);
          var cur = tripCur(),
            q;
          for (q = 0; q < cur.words.length; q++) {
            if (cur.words[q].et === wd) tripBump("words", 1, wd);
          }
          if (el.getAttribute("data-refresh"))
            setTimeout(function () {
              if (screen === "trip") tripScreen();
            }, 900);
        };
      })(b[k]);
    }
    var sl = app.querySelectorAll("[data-slow]");
    for (k = 0; k < sl.length; k++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          speak(el.getAttribute("data-slow"), true);
        };
      })(sl[k]);
    }
    var ms = app.querySelectorAll("[data-stop]");
    for (k = 0; k < ms.length; k++) {
      (function (el) {
        el.onclick = function () {
          var id = el.getAttribute("data-stop"),
            q;
          for (q = 0; q < TRIP.length; q++) if (TRIP[q].id === id) break;
          if (q >= tripReached()) return; /* låst ort - inget att visa än */
          speak(TRIP[q].et);
          if (q === tripReached() - 1) {
            var hereCard = app.querySelector(".stopcard.now");
            if (hereCard) hereCard.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
          }
          /* en äldre, redan klarad ort: öppna dess kort direkt (samma som "Besökta
             orter"-listans egna knapp) istället för att bara scrolla till en hopfälld
             rad - annars ser det ut som att klicket på kartan inte gör något */
          S.tripVisited = true;
          S.tripOpen = id;
          save();
          tripScreen();
          var opened = app.querySelector('.stopcard[data-city="' + id + '"]');
          if (opened) opened.scrollIntoView({ behavior: "smooth", block: "center" });
        };
      })(ms[k]);
    }
    var sides = app.querySelectorAll("[data-side]"),
      sk;
    for (sk = 0; sk < sides.length; sk++) {
      (function (el) {
        el.onclick = function () {
          sideStopTap(el.getAttribute("data-side"));
        };
      })(sides[sk]);
    }
  }
  /* sido-stoppen på kartan (MAPTOWNS) - frivillig utforskning, ingen spärr och inget att
     missa. Uttal varje gång, en liten engångsbonus (S.firsts, samma lista som
     celebrateFirst() använder) första gången man trycker på var och en. */
  function sideStopTap(et) {
    speak(et);
    tone(700, 0.08, 0);
    if (firstEver("side:" + et)) {
      S.stars += 10;
      save();
      refreshTop();
      burst(40);
    }
    tripScreen();
  }
  /* "Kalevipoja rajal" - frivillig epilog efter Laulupidu (se EPILOGUE, app/utils/trip.ts).
     Fyra redan besökta orter får ett nytt kort var med en sägen om Kalevipoeg och ett nytt
     ord, sen en exklusiv souvenir på slutet. Framsteg sparas i S.epiStep (hur många stopp
     man gått igenom) och S.epiDone (souveniren redan given) - går att stänga och fortsätta
     när som helst, precis som resten av Teekond. */
  function epiLangToggleHtml(showEt) {
    return (
      '<button class="btn ghost sm" id="epilangbtn" style="margin-bottom:8px">' +
      (showEt ? "🇸🇪 På svenska" : "🇪🇪 Eesti keeles") +
      "</button>"
    );
  }
  function epilogueScreen() {
    screen = "epilogue";
    setNav("trip");
    var step = S.epiStep || 0,
      done = S.epiDone || step >= EPILOGUE.stops.length,
      showEt = !S.epiLangSv,
      html;
    if (done) {
      var kp = EPILOGUE.keepsake;
      html =
        '<div class="zone map"><span class="zem">🪨</span><span><b>Kalevipoja rajal</b><span>Den sista gåvan</span></span></div>' +
        '<div class="card" style="text-align:center">' +
        '<img src="' +
        kp.img +
        '" alt="" style="max-width:100%;max-height:220px;margin:0 auto 10px;display:block">' +
        '<h2 class="q">' +
        esc(kp.et) +
        "</h2>" +
        '<p class="qsub">' +
        esc(kp.sv) +
        "</p>" +
        '<p id="epilang" style="text-align:left">' +
        esc(showEt ? kp.legendEt : kp.legend) +
        "</p>" +
        epiLangToggleHtml(showEt) +
        '<button class="btn green big wide" id="epihome" style="margin-top:4px">🗺️ Till kartan</button>' +
        "</div>";
      app.innerHTML = html;
      document.getElementById("epilangbtn").onclick = function () {
        S.epiLangSv = !S.epiLangSv;
        save();
        var se = !S.epiLangSv;
        document.getElementById("epilang").textContent = se ? kp.legendEt : kp.legend;
        this.textContent = se ? "🇸🇪 På svenska" : "🇪🇪 Eesti keeles";
      };
      document.getElementById("epihome").onclick = function () {
        go(tripScreen, true);
      };
      if (!S.epiDone) {
        S.epiDone = true;
        if (!S.badges) S.badges = [];
        if (S.badges.indexOf("kalevipoja-rajal") < 0) S.badges.push("kalevipoja-rajal");
        save();
        refreshTop();
        burst(300);
        fanfare(2);
        balloons(10);
      }
      return;
    }
    var st = EPILOGUE.stops[step],
      town = null,
      ti;
    for (ti = 0; ti < TRIP.length; ti++)
      if (TRIP[ti].id === st.id) {
        town = TRIP[ti];
        break;
      }
    var kalevi = LORE.kalevipoeg;
    html =
      '<div class="zone map"><span class="zem">🪨</span><span><b>Kalevipoja rajal</b><span>Steg ' +
      (step + 1) +
      " av " +
      EPILOGUE.stops.length +
      "</span></span></div>" +
      '<div class="card">' +
      '<p class="q" style="text-align:left;margin-bottom:2px">' +
      town.em +
      ' <span lang="et">' +
      esc(town.et) +
      "</span></p>" +
      '<div class="center" style="margin:6px 0">' +
      '<span class="charpeek" data-char="lore:kalevipoeg" role="button" tabindex="0" aria-label="Visa ' +
      esc(kalevi.et) +
      '"><img src="' +
      (st.img || kalevi.img) +
      '" alt="" style="max-width:100%;max-height:190px;border-radius:12px"></span>' +
      "</div>" +
      '<p id="epilang" style="text-align:left">' +
      esc(showEt ? st.legendEt : st.legend) +
      "</p>" +
      epiLangToggleHtml(showEt) +
      '<div class="stopwords"><div class="wordrow"><span class="em">' +
      wIcon(st.word) +
      '</span><span class="t"><b lang="et">' +
      esc(st.word.et) +
      "</b><span>" +
      esc(st.word.sv) +
      " · uttal: " +
      esc(st.word.hint) +
      "</span></span>" +
      '<button class="speakbtn sm" data-say="' +
      esc(st.word.et) +
      '" aria-label="Hör ordet">🔊</button>' +
      '<button class="speakbtn sm" data-slow="' +
      esc(st.word.et) +
      '" aria-label="Långsamt">🐢</button></div></div>' +
      '<button class="btn green big wide" id="epinext" style="margin-top:10px">' +
      (step + 1 < EPILOGUE.stops.length ? "Vidare ➡️" : "Till slutet 🪨") +
      "</button>" +
      "</div>";
    app.innerHTML = html;
    document.getElementById("epilangbtn").onclick = function () {
      S.epiLangSv = !S.epiLangSv;
      save();
      var se = !S.epiLangSv;
      document.getElementById("epilang").textContent = se ? st.legendEt : st.legend;
      this.textContent = se ? "🇸🇪 På svenska" : "🇪🇪 Eesti keeles";
    };
    document.getElementById("epinext").onclick = function () {
      S.epiStep = step + 1;
      save();
      epilogueScreen();
    };
    var eb = app.querySelectorAll("[data-say]"),
      ek;
    for (ek = 0; ek < eb.length; ek++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          speak(el.getAttribute("data-say"));
        };
      })(eb[ek]);
    }
    var esl = app.querySelectorAll("[data-slow]"),
      esk;
    for (esk = 0; esk < esl.length; esk++) {
      (function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          speak(el.getAttribute("data-slow"), true);
        };
      })(esl[esk]);
    }
  }
  var DU = null;
  function rivalOpen(r) {
    return tripDone() >= r.need;
  }
  function duelRec(id) {
    if (!S.duels) S.duels = {};
    if (!S.duels[id]) S.duels[id] = { w: 0, l: 0, best: 0 };
    return S.duels[id];
  }
  /* ---------- VÄLJAKUTSE: barnet utmanar en vuxen ---------- */
  var CH = null;

  /* motståndarens chans att svara rätt: sämre på ord du kan, bättre på ord som vacklar,
       och hon skärper sig när hon halkar efter – men kan aldrig springa ifrån på slutet */

  /* ---------- SIIRI TUBA: rummet där samlingen bor ---------- */
  /* ---------- DAGENS GÖMDA SAK ---------- */
  function dayHash(s) {
    var i,
      n = 0;
    for (i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
    return n;
  }

  /* ---------- SIIRI TUBA (rummet) ----------
     Flyttat till en egen Nuxt-sida, se app/pages/room.vue (ritningen i app/utils/room-svg.ts,
     diplomleken i app/components/room/DiplomaQuiz.vue). roomScreen() finns kvar så att alla
     vägar hit leder dit. */
  function roomScreen() {
    location.href = "/room";
  }

  /* ---------- VÄLJAKUTSE: barnet utmanar en vuxen ---------- */

  function chIntro() {
    screen = "chal";
    var last = (S.challenges || [])[0];
    app.innerHTML =
      '<div class="zone map"><span class="zem">🤝</span><span><b>Väljakutse</b>' +
      "<span>Utmana en vuxen — du väljer orden</span></span></div>" +
      '<div class="card"><p class="qsub" style="text-align:left">Du väljer sex ord. Sedan lämnar du över telefonen ' +
      "till en vuxen som får svara. Du ser hur det gick — och de får höra hur orden låter.</p>" +
      (function () {
        var l = (S.challenges || []).slice(0, 3),
          i,
          s2 = "";
        if (!l.length) return "";
        s2 = '<div class="card" style="margin-top:10px"><p class="q" style="text-align:left">Tidigare utmaningar</p>';
        for (i = 0; i < l.length; i++)
          s2 +=
            '<div class="wordrow"><span class="em">' +
            (l[i].em || "🧑") +
            "</span>" +
            '<span class="t"><b>' +
            esc(l[i].who) +
            "</b><span>" +
            l[i].score +
            " av " +
            l[i].total +
            "</span></span></div>";
        return s2 + "</div>";
      })() +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="pick">Välj sex ord →</button></div>';
    document.getElementById("pick").onclick = chWho;
  }
  var OPPONENTS = [
    { id: "ema", em: "👩", sv: "Mamma" },
    { id: "isa", em: "👨", sv: "Pappa" },
    { id: "vana", em: "👵", sv: "Mormor eller farmor" },
    { id: "muu", em: "🧑", sv: "Någon annan" },
  ];
  function chWho() {
    screen = "chal";
    var i,
      html =
        '<div class="zone map"><span class="zem">🤝</span><span><b>Väljakutse</b>' +
        '<span>Vem ska du utmana?</span></span></div><div class="card"><div class="whogrid">';
    for (i = 0; i < OPPONENTS.length; i++) {
      html +=
        '<button class="whobtn" data-who="' +
        OPPONENTS[i].id +
        '"><span class="wem">' +
        OPPONENTS[i].em +
        "</span>" +
        "<b>" +
        esc(OPPONENTS[i].sv) +
        "</b>" +
        (function () {
          var r = (S.chalTop || {})[OPPONENTS[i].id + ":lagom"];
          return r ? "<small>bästa: " + r + " av 6</small>" : "<small>har inte spelat än</small>";
        })() +
        "</button>";
    }
    html += "</div></div>";
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-who]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          var id = el.getAttribute("data-who"),
            o;
          for (var q = 0; q < OPPONENTS.length; q++) if (OPPONENTS[q].id === id) o = OPPONENTS[q];
          CH = { words: [], all: pickWeighted(allWords(), 24), foe: o };
          chPickDraw();
        };
      })(bs[k]);
    }
  }
  function chPick() {
    chWho();
  }
  function chPickDraw() {
    screen = "chal";
    var i,
      html =
        '<div class="zone map"><span class="zem">🤝</span><span><b>Välj sex ord</b>' +
        "<span>" +
        CH.words.length +
        ' av 6 valda</span></span></div><div class="card"><div class="shelf">';
    for (i = 0; i < CH.all.length; i++) {
      var w = CH.all[i],
        on = CH.words.indexOf(w) >= 0;
      html +=
        '<button class="shelfitem' +
        (on ? " worn" : "") +
        '" data-pick="' +
        i +
        '">' +
        '<span class="em">' +
        wIcon(w) +
        "</span><b>" +
        esc(w.et) +
        "</b><small>" +
        esc(w.sv) +
        "</small></button>";
    }
    html += "</div></div>";
    if (CH.words.length === 6)
      html += '<button class="btn green big wide" id="ready">Klart – lämna över telefonen 📱</button>';
    else html += '<p class="note">Tryck på de ord du tror att en vuxen inte kan.</p>';
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-pick]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          var w = CH.all[parseInt(el.getAttribute("data-pick"), 10)],
            at = CH.words.indexOf(w);
          if (at >= 0) CH.words.splice(at, 1);
          else if (CH.words.length < 6) {
            CH.words.push(w);
            speak(w.et);
          }
          tone(760, 0.07, 0);
          chPickDraw();
        };
      })(bs[k]);
    }
    var rd = document.getElementById("ready");
    if (rd) rd.onclick = chPickLevel;
  }
  var CHLEVELS = [
    { id: "latt", sv: "Lätt", em: "🙂", opts: 3, listen: 0, txt: "Tre svar, ordet syns" },
    { id: "lagom", sv: "Lagom", em: "🧐", opts: 4, listen: 0.5, txt: "Fyra svar, varannan fråga bara ljud" },
    { id: "svar", sv: "Svår", em: "😤", opts: 6, listen: 0.5, txt: "Sex svar, varannan fråga bara ljud" },
    {
      id: "proff",
      sv: "Expert",
      em: "🔥",
      opts: 6,
      listen: 1,
      txt: "Sex svar, allt bara ljud, tio sekunder per fråga",
      time: 10,
    },
  ];
  function chLevel() {
    var i,
      id = (CH && CH.lvl) || "lagom";
    for (i = 0; i < CHLEVELS.length; i++) if (CHLEVELS[i].id === id) return CHLEVELS[i];
    return CHLEVELS[1];
  }
  function chPickLevel() {
    screen = "chal";
    var i,
      html =
        '<div class="zone map"><span class="zem">🤝</span><span><b>Väljakutse</b>' +
        '<span>Hur svårt ska den vuxna ha det?</span></span></div><div class="card"><div class="lvlgrid">';
    for (i = 0; i < CHLEVELS.length; i++) {
      var L = CHLEVELS[i],
        best = (S.chalTop || {})[CH.foe.id + ":" + L.id];
      html +=
        '<button class="lvlbtn" data-lvl="' +
        L.id +
        '"><span class="wem">' +
        L.em +
        "</span>" +
        "<b>" +
        L.sv +
        "</b><small>" +
        esc(L.txt) +
        "</small>" +
        '<small class="rec">' +
        (best ? "bästa: " + best + " av 6" : "inte spelat än") +
        "</small></button>";
    }
    html += "</div></div>";
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-lvl]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          CH.lvl = el.getAttribute("data-lvl");
          chHandover();
        };
      })(bs[k]);
    }
  }
  function chHandover() {
    screen = "chal";
    app.innerHTML =
      '<div class="card" style="text-align:center"><div style="font-size:64px">📱</div>' +
      '<p class="q">Lämna över telefonen</p>' +
      '<p class="qsub">Ge den till en vuxen. ' +
      (S.name ? esc(S.name) : "Barnet") +
      " har valt sex ord — vi får se hur det går.</p>" +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="go">Jag är den vuxna – kör!</button>' +
      '<button class="btn ghost wide" id="back2" style="margin-top:8px">Välj andra ord</button></div>';
    document.getElementById("go").onclick = function () {
      CH.i = 0;
      CH.score = 0;
      CH.log = [];
      chRound();
    };
    document.getElementById("back2").onclick = chPick;
  }
  function chRound() {
    if (!CH) return;
    if (CH.i >= CH.words.length) {
      chEnd();
      return;
    }
    var L = chLevel();
    var w = CH.words[CH.i],
      all = optionPool(w, allWords()),
      opts = [w],
      i,
      tries = 0;
    var listen = L.listen >= 1 ? true : L.listen > 0 ? CH.i % 2 === 1 : false;
    while (opts.length < L.opts && tries < 160) {
      var c = all[(Math.random() * all.length) | 0];
      tries++;
      var dup = false;
      for (i = 0; i < opts.length; i++) if (opts[i].sv === c.sv) dup = true;
      if (!dup) opts.push(c);
    }
    opts = shuffle(opts);
    var html =
      '<div class="zone map"><span class="zem">🤝</span><span><b>Fråga ' +
      (CH.i + 1) +
      " av 6</b>" +
      "<span>" +
      CH.score +
      " rätt hittills</span></span></div>" +
      '<div class="card">' +
      (listen
        ? '<p class="q">Lyssna — vad betyder ordet?</p>' +
          '<div class="center"><button class="speakbtn big" id="say" aria-label="Hör ordet">🔊</button></div>'
        : '<p class="q">Vad betyder</p><div class="bigword">' +
          esc(w.et) +
          "</div>" +
          '<div class="center"><button class="speakbtn sm" id="say" aria-label="Hör ordet">🔊</button></div>') +
      '<div class="opts">';
    for (i = 0; i < opts.length; i++)
      html += '<button class="opt" data-sv="' + esc(opts[i].sv) + '">' + esc(opts[i].sv) + "</button>";
    html += '</div><div class="feedback" id="fb"></div></div>';
    app.innerHTML = html;
    if (listen) speak(w.et);
    document.getElementById("say").onclick = function () {
      speak(w.et);
    };
    chStopTimer();
    if (L.time) {
      var left = L.time,
        bar = document.createElement("div");
      bar.className = "chtime";
      bar.innerHTML = "<i></i><span>" + left + "</span>";
      app.querySelector(".card").insertBefore(bar, app.querySelector(".opts"));
      var tid = setInterval(function () {
        var el = app.querySelector(".chtime");
        if (!CH || !el) {
          clearInterval(tid);
          return;
        } /* utmaningen är slut */
        left--;
        el.querySelector("span").textContent = Math.max(0, left);
        el.querySelector("i").style.width = Math.max(0, (left / L.time) * 100) + "%";
        if (left <= 0) {
          clearInterval(tid);
          if (CH) CH.timer = null;
          chTimeout();
        }
      }, 1000);
      CH.timer = tid;
    }
    var bs = app.querySelectorAll(".opt"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          chStopTimer();
          var ok = el.getAttribute("data-sv") === w.sv,
            b2 = app.querySelectorAll(".opt"),
            q;
          for (q = 0; q < b2.length; q++) {
            b2[q].disabled = true;
            if (b2[q].getAttribute("data-sv") === w.sv) b2[q].className = "opt right";
          }
          if (!ok) el.className = "opt wrong";
          if (ok) CH.score++;
          CH.log.push({ w: w, ok: ok });
          speak(w.et);
          var fb = document.getElementById("fb");
          fb.className = "feedback " + (ok ? "ok" : "no");
          fb.textContent = ok ? "Rätt!" : w.et + " = " + w.sv;
          CH.i++;
          setTimeout(function () {
            if (CH) chRound();
          }, 900);
        };
      })(bs[k]);
    }
  }
  function chStopTimer() {
    if (CH && CH.timer) {
      clearInterval(CH.timer);
      CH.timer = null;
    }
  }
  function chTimeout() {
    if (!CH) return;
    var fb = document.getElementById("fb");
    if (fb) fb.innerHTML = '<b style="color:var(--berry)">Tiden är ute!</b>';
    CH.log.push({ w: CH.words[CH.i], ok: false });
    CH.i++;
    setTimeout(function () {
      chRound();
    }, 900);
  }
  function chEnd() {
    chStopTimer();
    var s = CH.score,
      n = CH.words.length,
      i;
    var who = s >= 6 ? "Mästaren!" : s >= 4 ? "Ganska bra" : s >= 2 ? "Lite kämpigt" : "Oj då";
    var foe = CH.foe || { em: "🧑", sv: "Den vuxna", id: "muu" };
    if (!S.chalTop) S.chalTop = {};
    if (s > (S.chalTop[foe.id] || 0)) S.chalTop[foe.id] = s;
    if (!S.challenges) S.challenges = [];
    S.challenges.unshift({ who: foe.sv, em: foe.em, score: s, total: n, day: today() });
    S.challenges = S.challenges.slice(0, 5);
    var gain = 10 + s * 4;
    earnStars(gain);
    addXp(20);
    save();
    refreshTop();
    burst(s >= 5 ? 180 : 120);
    var tricked = [],
      ti;
    for (ti = 0; ti < CH.log.length; ti++) if (!CH.log[ti].ok) tricked.push(CH.log[ti].w);
    var html =
      '<div class="card" style="text-align:center"><div style="font-size:56px">' +
      (CH.foe ? CH.foe.em : "🧑") +
      "</div>" +
      '<div class="bigscore">' +
      s +
      " / " +
      n +
      '</div><p class="q">' +
      esc(CH.foe ? CH.foe.sv : "Den vuxna") +
      ": " +
      esc(who) +
      "</p>" +
      (tricked.length
        ? '<p class="qsub">Du lurade dem med ' + tricked.length + " ord!</p>"
        : '<p class="qsub">Alla rätt — nästa gång får du välja svårare ord.</p>') +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<p class="qsub">Du fick ⭐ ' +
      gain * starMult() +
      " för att du lärde ut orden.</p></div>" +
      '<div class="card"><p class="q" style="text-align:left">Så gick det</p>';
    for (i = 0; i < CH.log.length; i++) {
      html +=
        '<div class="wordrow"><span class="em">' +
        (CH.log[i].ok ? "✅" : "❌") +
        "</span>" +
        '<span class="t"><b>' +
        esc(CH.log[i].w.et) +
        "</b><span>" +
        esc(CH.log[i].w.sv) +
        "</span></span>" +
        '<button class="speakbtn sm" data-say="' +
        esc(CH.log[i].w.et) +
        '" aria-label="Hör ordet">🔊</button></div>';
    }
    html +=
      '</div><div class="row"><button class="btn green big" id="again">Utmana igen 🤝</button>' +
      '<button class="btn ghost big" id="home">Tillbaka</button></div>';
    app.innerHTML = html;
    CH = null;
    mood("cheer");
    var sb = app.querySelectorAll("[data-say]"),
      k;
    for (k = 0; k < sb.length; k++) {
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-say"));
        };
      })(sb[k]);
    }
    document.getElementById("again").onclick = chWho;
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
  }

  var SCENE = window.SiiriData.SCENE;

  var SCENE_AED = window.SiiriData.SCENE_AED;
  var SCENE_KOOK = window.SiiriData.SCENE_KOOK;
  var SCENE_TURG = window.SiiriData.SCENE_TURG;
  /* fyra platser med egna möbler, prepositioner och ord */
  var OSCENES = window.SiiriData.OSCENES;
  function otsiScene() {
    var i = (OT && OT.round) || 0;
    return OSCENES[Math.floor(i / 2) % OSCENES.length];
  }
  function sceneSVG(sc) {
    if (!sc.svg) return SCENE;
    return sc.svg === "AED" ? SCENE_AED : sc.svg === "KOOK" ? SCENE_KOOK : SCENE_TURG;
  }
  /* ============ OTSI! — hitta det Siiri säger ============ */
  var OT = null;
  var OBJ = [
    { id: "raamat", et: "raamat", sv: "bok", def: "boken", g: "en" },
    { id: "pall", et: "pall", sv: "boll", def: "bollen", g: "en" },
    { id: "müts", et: "müts", sv: "mössa", def: "mössan", g: "en" },
    { id: "kruus", et: "kruus", sv: "mugg", def: "muggen", g: "en" },
    { id: "lill", et: "lill", sv: "blomma", def: "blomman", g: "en" },
    { id: "õun", et: "õun", sv: "äpple", def: "äpplet", g: "ett" },
    { id: "auto", et: "auto", sv: "bil", def: "bilen", g: "en" },
    { id: "kala", et: "kala", sv: "fisk", def: "fisken", g: "en" },
    { id: "lind", et: "lind", sv: "fågel", def: "fågeln", g: "en" },
    { id: "täht", et: "täht", sv: "stjärna", def: "stjärnan", g: "en" },
    { id: "maja", et: "maja", sv: "hus", def: "huset", g: "ett" },
    { id: "kott", et: "kott", sv: "väska", def: "väskan", g: "en" },
    { id: "pliiats", et: "pliiats", sv: "penna", def: "pennan", g: "en" },
    { id: "võti", et: "võti", sv: "nyckel", def: "nyckeln", g: "en" },
    { id: "kell", et: "kell", sv: "klocka", def: "klockan", g: "en" },
    { id: "kook", et: "kook", sv: "tårta", def: "tårtan", g: "en" },
    { id: "seen", et: "seen", sv: "svamp", def: "svampen", g: "en" },
    { id: "kivi", et: "kivi", sv: "sten", def: "stenen", g: "en" },
    { id: "jäätis", et: "jäätis", sv: "glass", def: "glassen", g: "en" },
    { id: "puu", et: "puu", sv: "träd", def: "trädet", g: "ett" },
  ];
  var OCOL = [
    { id: "punane", sv: "röd", t: "rött", b: "röda", c: "#D6453F", d: "#A32E2A" },
    { id: "sinine", sv: "blå", t: "blått", b: "blåa", c: "#3A72C8", d: "#27509A" },
    { id: "kollane", sv: "gul", t: "gult", b: "gula", c: "#E8B62C", d: "#B98A16" },
    { id: "roheline", sv: "grön", t: "grönt", b: "gröna", c: "#4E9A5C", d: "#367040" },
    { id: "must", sv: "svart", t: "svart", b: "svarta", c: "#3C3936", d: "#211F1D" },
    { id: "valge", sv: "vit", t: "vitt", b: "vita", c: "#F4EFE4", d: "#C9C0AE" },
  ];
  function svDef(col, obj) {
    return (obj.g === "ett" ? "det " : "den ") + col.b + " " + obj.def;
  }
  function svInd(col, obj) {
    return obj.g + " " + (obj.g === "ett" ? col.t : col.sv) + " " + obj.sv;
  }
  var OSPOT = [
    { id: "riiul", et: "riiuli peal", sv: "på hyllan", x: [178, 238], y: 80 },
    { id: "laudP", et: "laua peal", sv: "på bordet", x: [226, 314], y: 150 },
    { id: "laudA", et: "laua all", sv: "under bordet", x: [234, 304], y: 214 },
    { id: "tool", et: "tooli peal", sv: "på stolen", x: [126, 158], y: 166 },
    { id: "aken", et: "akna juures", sv: "vid fönstret", x: [30, 92], y: 124 },
    { id: "vaip", et: "vaiba peal", sv: "på mattan", x: [114, 188], y: 240 },
    { id: "toolA", et: "tooli all", sv: "under stolen", x: [128, 156], y: 220 },
    { id: "aknaP", et: "akna peal", sv: "på fönsterbrädan", x: [38, 84], y: 124 },
    { id: "porand", et: "põrandal", sv: "på golvet", x: [300, 344], y: 252 },
    { id: "laudK", et: "laua kõrval", sv: "bredvid bordet", x: [338, 352], y: 218 },
    { id: "aknaA", et: "akna all", sv: "under fönstret", x: [34, 88], y: 186 },
  ];
  function otsiDraw(it, i) {
    var c = it.col.c,
      d = it.col.d,
      x = it.x,
      y = it.y,
      g;
    if (it.obj.id === "raamat") {
      g =
        '<path d="M-15 -16 q7 -3 14 0 v16 q-7 -3 -14 0 z" fill="' +
        c +
        '"/>' +
        '<path d="M15 -16 q-7 -3 -14 0 v16 q7 -3 14 0 z" fill="' +
        d +
        '"/>' +
        '<path d="M-13.5 -14 q6 -2.6 12 0 v12.6 q-6 -2.6 -12 0 z" fill="#FBF6EA"/>' +
        '<path d="M13.5 -14 q-6 -2.6 -12 0 v12.6 q6 -2.6 12 0 z" fill="#F2EADA"/>' +
        '<g stroke="#C4B9A2" stroke-width="1" stroke-linecap="round">' +
        '<path d="M-11 -10 h7 M-11 -6.6 h7 M-11 -3.2 h5 M4 -10 h7 M4 -6.6 h7 M4 -3.2 h5"/></g>' +
        '<path d="M0 -16.6 v16.6" stroke="' +
        d +
        '" stroke-width="2"/>';
    } else if (it.obj.id === "pall") {
      g =
        '<circle cx="0" cy="-11" r="11" fill="' +
        c +
        '"/>' +
        '<path d="M-11 -11 q11 -7 22 0 q-11 7 -22 0 z" fill="' +
        d +
        '" opacity=".55"/>' +
        '<ellipse cx="-4" cy="-15" rx="4" ry="3" fill="#fff" opacity=".45"/>';
    } else if (it.obj.id === "müts") {
      g =
        '<path d="M-12 -4 q-1 -18 12 -18 q13 0 12 18 z" fill="' +
        c +
        '"/>' +
        '<path d="M-10 -8 q-1 -12 10 -12 q4 0 6 2 q-9 1 -11 10 z" fill="#fff" opacity=".18"/>' +
        '<g stroke="' +
        d +
        '" stroke-width="1.6" opacity=".7" fill="none">' +
        '<path d="M-6.5 -19 q-0.5 8 -0.5 15"/><path d="M0 -20 v15"/><path d="M6.5 -19 q0.5 8 0.5 15"/></g>' +
        '<path d="M-15 -5 h30 q2 0 2 2.6 v2.4 q0 2 -2 2 h-30 q-2 0 -2 -2 v-2.4 q0 -2.6 2 -2.6 z" fill="#F7EEDC"/>' +
        '<path d="M-15 -2.4 h30" stroke="' +
        d +
        '" stroke-width="1" opacity=".35"/>' +
        '<circle cx="0" cy="-23" r="4.6" fill="#F7EEDC"/>' +
        '<circle cx="-1.4" cy="-24.4" r="1.6" fill="#fff" opacity=".8"/>';
    } else if (it.obj.id === "kruus") {
      g =
        '<path d="M-9 -18 h18 l-2 18 h-14 z" fill="' +
        c +
        '"/>' +
        '<path d="M9 -15 q7 1 7 6 q0 5 -7 6 v-3 q4 -1 4 -3 q0 -2 -4 -3 z" fill="' +
        d +
        '"/>' +
        '<ellipse cx="0" cy="-18" rx="9" ry="2.6" fill="' +
        d +
        '"/>' +
        '<rect x="-6" y="-15" width="3" height="10" rx="1.5" fill="#fff" opacity=".35"/>';
    } else if (it.obj.id === "lill") {
      g =
        '<path d="M0 0 v-12" stroke="#4E8A52" stroke-width="2.2"/>' +
        '<path d="M0 -6 q-6 -3 -8 -8 q6 0 8 5 z" fill="#5CA05E"/>' +
        '<g fill="' +
        c +
        '"><circle cx="0" cy="-19" r="4.4"/><circle cx="-6" cy="-15" r="4.4"/>' +
        '<circle cx="6" cy="-15" r="4.4"/><circle cx="-4" cy="-23" r="4.4"/><circle cx="4" cy="-23" r="4.4"/></g>' +
        '<circle cx="0" cy="-19" r="3.4" fill="#F6D24A"/>';
    } else if (it.obj.id === "auto") {
      g =
        '<path d="M-15 -6 q1 -7 6 -7 h4 l3 -5 h8 l2 5 h4 q5 0 6 7 v6 h-33 z" fill="' +
        c +
        '"/>' +
        '<path d="M-6 -12 h7 l1.4 5 h-10 z" fill="#CFE6F5" opacity=".85"/>' +
        '<circle cx="-8" cy="0" r="4" fill="#33312E"/><circle cx="-8" cy="0" r="1.8" fill="#9A9690"/>' +
        '<circle cx="9" cy="0" r="4" fill="#33312E"/><circle cx="9" cy="0" r="1.8" fill="#9A9690"/>' +
        '<rect x="-15" y="-6.6" width="30" height="2.4" fill="' +
        d +
        '"/>';
    } else if (it.obj.id === "kala") {
      g =
        '<path d="M-14 -10 q9 -8 18 0 q-9 8 -18 0 z" fill="' +
        c +
        '"/>' +
        '<path d="M4 -10 q7 -6 10 -1 q-3 5 -10 1 z" fill="' +
        d +
        '"/>' +
        '<circle cx="-8" cy="-11" r="1.6" fill="#231F1C"/>' +
        '<path d="M-6 -13 q5 3 9 0" stroke="' +
        d +
        '" stroke-width="1.2" fill="none"/>';
    } else if (it.obj.id === "lind") {
      g =
        '<ellipse cx="0" cy="-9" rx="10" ry="8" fill="' +
        c +
        '"/>' +
        '<circle cx="7" cy="-15" r="5.4" fill="' +
        c +
        '"/>' +
        '<path d="M11 -15 l6 2 l-6 2 z" fill="#E8A62C"/>' +
        '<circle cx="8.4" cy="-16.4" r="1.3" fill="#231F1C"/>' +
        '<path d="M-3 -10 q7 -4 10 2 q-7 4 -10 -2 z" fill="' +
        d +
        '"/>' +
        '<path d="M-10 -8 l-6 -3 l3 6 z" fill="' +
        d +
        '"/>' +
        '<path d="M-2 -1 v3 M3 -1 v3" stroke="#E8A62C" stroke-width="1.6"/>';
    } else if (it.obj.id === "täht") {
      g =
        '<path d="M0 -24 l4.6 9.4 l10.4 1.5 l-7.5 7.3 l1.8 10.3 L0 -0.4 l-9.3 4.9 l1.8 -10.3 l-7.5 -7.3 l10.4 -1.5 z" fill="' +
        c +
        '"/>' +
        '<path d="M0 -24 l4.6 9.4 l-4.6 2 z" fill="#fff" opacity=".35"/>';
    } else if (it.obj.id === "maja") {
      g =
        '<rect x="-11" y="-13" width="22" height="13" fill="' +
        c +
        '"/>' +
        '<path d="M-14 -13 L0 -24 L14 -13 z" fill="' +
        d +
        '"/>' +
        '<rect x="-4" y="-8" width="8" height="8" fill="#6E4A28"/>' +
        '<rect x="-9" y="-11" width="5" height="4" fill="#CFE6F5"/>' +
        '<rect x="5" y="-11" width="5" height="4" fill="#CFE6F5"/>';
    } else if (it.obj.id === "kott") {
      g =
        '<path d="M-11 -13 q0 -3 3 -3 h16 q3 0 3 3 l1.6 13 h-25.2 z" fill="' +
        c +
        '"/>' +
        '<path d="M-11.6 -13 q0 -5 5 -5 h13.2 q5 0 5 5 v5 q0 2 -2 2 h-19.2 q-2 0 -2 -2 z" fill="' +
        d +
        '"/>' +
        '<rect x="-3" y="-8" width="6" height="5" rx="1.4" fill="#F2E8D4"/>' +
        '<path d="M-6 -18 q0 -6 6 -6 q6 0 6 6" stroke="' +
        d +
        '" stroke-width="2.4" fill="none"/>' +
        '<rect x="-7" y="-4" width="14" height="4" rx="1.6" fill="#fff" opacity=".28"/>';
    } else if (it.obj.id === "pliiats") {
      g =
        '<path d="M-3 -22 h6 v17 h-6 z" fill="' +
        c +
        '"/>' +
        '<path d="M-3 -5 h6 l-3 5 z" fill="#E8C79A"/>' +
        '<path d="M-1.2 -1.6 h2.4 l-1.2 1.6 z" fill="#3A2A1E"/>' +
        '<rect x="-3" y="-24" width="6" height="2.4" fill="' +
        d +
        '"/>' +
        '<rect x="-3" y="-22" width="1.8" height="17" fill="#fff" opacity=".28"/>';
    } else if (it.obj.id === "kell") {
      g =
        '<circle cx="0" cy="-12" r="11" fill="' +
        c +
        '"/><circle cx="0" cy="-12" r="8.4" fill="#F7F2E6"/>' +
        '<path d="M0 -12 v-6 M0 -12 l4.4 3" stroke="#33312E" stroke-width="1.6" stroke-linecap="round"/>' +
        '<circle cx="0" cy="-12" r="1.3" fill="#33312E"/>' +
        '<rect x="-2" y="-25" width="4" height="3" rx="1.4" fill="' +
        d +
        '"/>';
    } else if (it.obj.id === "kook") {
      g =
        '<ellipse cx="0" cy="0" rx="16" ry="4" fill="#E6DECB"/>' +
        '<path d="M-13 -3 h26 v-7 h-26 z" fill="' +
        d +
        '"/>' +
        '<path d="M-13 -10 h26 v-7 h-26 z" fill="' +
        c +
        '"/>' +
        '<path d="M-13 -17 q6.5 4 13 0 q6.5 -4 13 0 v-4 q-6.5 -4 -13 0 q-6.5 4 -13 0 z" fill="#F7EEDC"/>' +
        '<path d="M-13 -10 h26" stroke="#F7EEDC" stroke-width="1.6" opacity=".7"/>' +
        '<path d="M0 -21 v-5" stroke="#E8C79A" stroke-width="2.4"/>' +
        '<path d="M0 -26 q2.4 2.4 0 4.6 q-2.4 -2.2 0 -4.6" fill="#F6D24A"/>' +
        '<circle cx="-7" cy="-19.6" r="1.6" fill="#D6453F"/><circle cx="7" cy="-19.6" r="1.6" fill="#D6453F"/>';
    } else if (it.obj.id === "seen") {
      g =
        '<path d="M-4 0 q-1 -9 0 -11 h8 q1 2 0 11 z" fill="#F2E7D2"/>' +
        '<path d="M-13 -11 q0 -11 13 -11 q13 0 13 11 z" fill="' +
        c +
        '"/>' +
        '<g fill="#F7EEDC" opacity=".85"><circle cx="-6" cy="-15" r="2.4"/><circle cx="4" cy="-17" r="2"/>' +
        '<circle cx="8" cy="-13" r="1.6"/></g>';
    } else if (it.obj.id === "kivi") {
      g =
        '<path d="M-13 0 L-9 -9 L-2 -13 L7 -11 L13 -3 L11 0 Z" fill="' +
        c +
        '"/>' +
        '<path d="M-9 -9 L-2 -13 L1 -5 Z" fill="#fff" opacity=".22"/>' +
        '<path d="M1 -5 L7 -11 L13 -3 Z" fill="' +
        d +
        '" opacity=".55"/>' +
        '<path d="M-13 0 L-9 -9 L1 -5 L11 0 Z" fill="' +
        d +
        '" opacity=".2"/>' +
        '<path d="M-13 0 L-9 -9 L-2 -13 L7 -11 L13 -3 L11 0 Z" fill="none" stroke="' +
        d +
        '" stroke-width="1.6" stroke-linejoin="round"/>';
    } else if (it.obj.id === "jäätis") {
      g =
        '<path d="M-6 -8 l6 8 l6 -8 z" fill="#D8A86A"/>' +
        '<path d="M-6 -8 h12 l-1 -2 h-10 z" fill="#C08A54"/>' +
        '<circle cx="-3" cy="-12" r="5.6" fill="' +
        c +
        '"/><circle cx="3" cy="-12" r="5.6" fill="' +
        d +
        '"/>' +
        '<circle cx="0" cy="-17" r="5.6" fill="' +
        c +
        '"/>' +
        '<circle cx="-2" cy="-19" r="1.8" fill="#fff" opacity=".45"/>';
    } else if (it.obj.id === "puu") {
      g =
        '<rect x="-2.4" y="-9" width="4.8" height="9" fill="#8A5E30"/>' +
        '<circle cx="0" cy="-17" r="9" fill="' +
        c +
        '"/>' +
        '<circle cx="-6" cy="-12" r="6" fill="' +
        c +
        '"/><circle cx="6" cy="-12" r="6" fill="' +
        c +
        '"/>' +
        '<circle cx="-3" cy="-20" r="4" fill="#fff" opacity=".22"/>';
    } else if (it.obj.id === "võti") {
      g =
        '<circle cx="-6" cy="-14" r="6.4" fill="' +
        c +
        '"/><circle cx="-6" cy="-14" r="2.6" fill="#F3EEE2"/>' +
        '<rect x="-1" y="-16" width="16" height="4" rx="1.4" fill="' +
        c +
        '"/>' +
        '<rect x="9" y="-12" width="3" height="4.4" fill="' +
        c +
        '"/>' +
        '<rect x="13" y="-12" width="3" height="3" fill="' +
        c +
        '"/>';
    } else {
      g =
        '<path d="M0 -20 q-11 0 -11 10 q0 10 11 10 q11 0 11 -10 q0 -10 -11 -10 z" fill="' +
        c +
        '"/>' +
        '<path d="M0 -20 q-6 0 -8.6 4 q3 -8 8.6 -8 z" fill="#fff" opacity=".35"/>' +
        '<path d="M0 -21 v-4" stroke="#6E4A28" stroke-width="2"/>' +
        '<path d="M1 -24 q6 -4 9 0 q-5 4 -9 0 z" fill="#5CA05E"/>';
    }
    return (
      '<g class="oit" data-oi="' +
      i +
      '" transform="translate(' +
      x +
      "," +
      y +
      ') scale(1.12)" style="cursor:pointer">' +
      '<ellipse cx="0" cy="-9" rx="17" ry="16" fill="#FFFFFF" opacity=".30"/>' +
      '<ellipse cx="0" cy="2" rx="12" ry="3.4" fill="#2A1B0C" opacity=".28"/>' +
      g +
      '<circle class="ohit" cx="0" cy="-10" r="24" fill="transparent"/></g>'
    );
  }
  function otsiPick(n, arr) {
    var a = arr.slice(),
      o = [],
      i;
    for (i = 0; i < n && a.length; i++) o.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
    return o;
  }
  function otsiBuild() {
    var lv = OT.round < 3 ? 1 : OT.round < 6 ? 2 : 3;
    var sc = otsiScene();
    OT.scene = sc;
    var pool = OBJ.filter(function (o) {
      return sc.objs.indexOf(o.id) >= 0;
    });
    if (pool.length < 4) pool = OBJ;
    var spots = otsiPick(Math.min(6, sc.spots.length), sc.spots),
      items = [],
      i;
    var tObj = pool[Math.floor(Math.random() * pool.length)];
    var tCol = OCOL[Math.floor(Math.random() * OCOL.length)];
    items.push({ obj: tObj, col: tCol, spot: spots[0] });
    /* lurendrejare som skiljer sig på exakt en sak */
    var others = pool.filter(function (o) {
      return o.id !== tObj.id;
    });
    var cols = OCOL.filter(function (c) {
      return c.id !== tCol.id;
    });
    items.push({ obj: others[Math.floor(Math.random() * others.length)], col: tCol, spot: spots[1] });
    items.push({ obj: tObj, col: cols[Math.floor(Math.random() * cols.length)], spot: spots[2] });
    for (i = 3; i < 6; i++) {
      items.push({
        obj: pool[Math.floor(Math.random() * pool.length)],
        col: OCOL[Math.floor(Math.random() * OCOL.length)],
        spot: spots[i],
      });
    }
    /* placera i sina fack, inte ovanpå varandra */
    for (i = 0; i < items.length; i++) {
      var sp = items[i].spot;
      items[i].x = Math.round(sp.x[0] + Math.random() * (sp.x[1] - sp.x[0]));
      items[i].y = sp.y;
    }
    for (i = items.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)),
        t = items[i];
      items[i] = items[j];
      items[j] = t;
    }
    OT.items = items;
    OT.target = 0;
    for (i = 0; i < items.length; i++) {
      if (items[i].obj === tObj && items[i].col === tCol && items[i].spot === spots[0]) {
        OT.target = i;
        break;
      }
    }
    var tg = items[OT.target];
    if (lv === 1) {
      OT.say = ["Kus on", tCol.id, tObj.et];
      OT.sv = "Var är " + svDef(tCol, tObj) + "?";
    } else if (lv === 2) {
      OT.say = ["Kus on", tObj.et, tg.spot.et];
      OT.sv = "Var är " + tObj.def + " " + tg.spot.sv + "?";
    } else {
      OT.say = ["Kus on", tCol.id, tObj.et, tg.spot.et];
      OT.sv = "Var är " + svDef(tCol, tObj) + " " + tg.spot.sv + "?";
    }
  }
  function otsiScreen() {
    screen = "otsi";
    setNav("home");
    btnBack.hidden = false;
    if (!OT) {
      OT = { round: 0, n: 8, right: 0, wrong: 0, stars: 0, lock: false };
    }
    otsiBuild();
    OT.helped = false;
    OT.missedHere = false;
    OT.missHere = 0;
    var tg = OT.items[OT.target];
    var html =
      '<div class="zone"><span>🔍 <b>Otsi!</b> · ' +
      esc(OT.scene.et) +
      "</span>" +
      "<span>" +
      (OT.round + 1) +
      " / " +
      OT.n +
      " · ⭐ " +
      OT.stars +
      "</span></div>";
    var chips = OT.say
      .map(function (w, k) {
        return (
          '<button class="ochip" data-w="' +
          esc(w) +
          '">' +
          esc(w) +
          (k === OT.say.length - 1 ? '<span class="oq">?</span>' : "") +
          "</button>"
        );
      })
      .join("");
    html +=
      '<div class="card"><div class="otsiask">' +
      '<button class="btn small" id="otsisay" aria-label="Hör hela frågan">🔊</button>' +
      '<button class="btn small ghost" id="otsislow" aria-label="Hör långsamt">🐢</button>' +
      '<div class="ochips">' +
      chips +
      '<small id="otsisv" hidden>' +
      esc(OT.sv) +
      "</small>" +
      '<button class="obtnhelp" id="otsihelp">Vad betyder det?</button></div></div>' +
      '<div class="odots">' +
      Array.apply(null, { length: OT.n })
        .map(function (_, k) {
          return '<i class="' + (k < OT.round ? "on" : k === OT.round ? "now" : "") + '"></i>';
        })
        .join("") +
      "</div>" +
      '<div class="otsiwrap">' +
      sceneSVG(OT.scene) +
      '<svg class="otsilayer" viewBox="0 0 400 270">' +
      '<defs><radialGradient id="ohalo" cx="50%" cy="50%" r="50%">' +
      '<stop offset="42%" stop-color="#FFFFFF" stop-opacity=".44"/>' +
      '<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient></defs>' +
      OT.items.map(otsiDraw).join("") +
      "</svg></div>" +
      '<p class="qsub" id="otsitip">Tryck på rätt sak i rummet.</p></div>';
    app.innerHTML = html;
    speakSeq(OT.say); /* direkt i tryckningen – annars stoppar webbläsaren ljudet */
    document.getElementById("otsisay").onclick = function () {
      speakSeq(OT.say);
    };
    document.getElementById("otsislow").onclick = function () {
      speakSeqSlow(OT.say);
    };
    document.getElementById("otsihelp").onclick = function () {
      otsiHelp();
    };
    var ch = app.querySelectorAll(".ochip"),
      ci;
    for (ci = 0; ci < ch.length; ci++) {
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-w"), true);
        };
      })(ch[ci]);
    }
    var g = app.querySelectorAll("[data-oi]"),
      i;
    for (i = 0; i < g.length; i++) {
      (function (el) {
        el.onclick = function () {
          otsiTap(parseInt(el.getAttribute("data-oi"), 10), el);
        };
      })(g[i]);
    }
  }
  function otsiHelp() {
    var sv = document.getElementById("otsisv"),
      b = document.getElementById("otsihelp");
    if (!sv) return;
    sv.hidden = false;
    if (b) b.remove();
    OT.helped = true;
  }
  function otsiTap(i, el) {
    if (OT.lock) return;
    var tip = document.getElementById("otsitip");
    if (i === OT.target) {
      OT.lock = true;
      OT.right++;
      var solo = !OT.helped && !OT.missedHere;
      if (solo) OT.solo = (OT.solo || 0) + 1;
      var gain = 12 + OT.round * 2 + (solo ? 6 : 0);
      OT.stars += gain;
      earnStars(gain);
      addXp(14);
      save();
      refreshTop();
      el.classList.add("ofound");
      sndOk();
      buzz(16);
      burst(60);
      if (tip)
        tip.innerHTML =
          '<b style="color:var(--moss)">Leidsid! ' +
          esc(OT.items[i].obj.def) +
          " ✓</b>" +
          (solo ? ' <span class="qsub" style="display:inline">utan hjälp ⭐ +6</span>' : "");
      speak("Leidsid!");
      bumpQuest("correct", 1);
      tripBump("hear", 1);
      setTimeout(function () {
        OT.round++;
        if (OT.round >= OT.n) otsiEnd();
        else {
          OT.lock = false;
          otsiScreen();
        }
      }, 1100);
    } else {
      OT.wrong++;
      OT.missedHere = true;
      OT.missHere = (OT.missHere || 0) + 1;
      el.classList.add("owrong");
      sndNo();
      buzz(30);
      if (OT.missHere >= 2) otsiHelp(); /* först efter två försök */
      var w = OT.items[i];
      if (tip)
        tip.innerHTML = "Det där är <b>" + esc(svInd(w.col, w.obj)) + "</b> " + esc(w.spot.sv) + ". Leta vidare!";
      setTimeout(function () {
        el.classList.remove("owrong");
      }, 600);
      setTimeout(function () {
        speakSeq(OT.say);
      }, 700);
    }
  }
  function otsiEnd() {
    tripBump("otsi", 1);
    var st = OT.wrong === 0 ? 3 : OT.wrong <= 2 ? 2 : 1;
    var gained = OT.stars,
      wrong = OT.wrong,
      solo = OT.solo || 0;
    OT = null;
    S.lessons = (S.lessons || 0) + 1;
    save();
    bumpQuest("themes", 1);
    tripBump("hear", 1);
    app.innerHTML =
      '<div class="card" style="text-align:center"><p class="kicker">🔍 Otsi!</p>' +
      '<h2 class="q">' +
      (wrong === 0 ? "Alla rätt!" : "Bra letat!") +
      "</h2>" +
      '<div class="bigstars">' +
      "⭐".repeat(st) +
      "</div>" +
      '<p class="qsub">Du hittade 8 saker och samlade ⭐ ' +
      gained +
      ".<br>" +
      "<b>" +
      solo +
      " av 8</b> klarade du utan att se den svenska texten.</p>" +
      '<div class="row"><button class="btn big" id="oag">En gång till</button>' +
      '<button class="btn ghost" id="ohome">Till start</button></div></div>';
    burst(160);
    fanfare(st);
    document.getElementById("oag").onclick = function () {
      go(otsiScreen, true);
    };
    document.getElementById("ohome").onclick = function () {
      go(homeScreen, true);
    };
  }
  function otsiIntro() {
    OT = null;
    screen = "otsi";
    setNav("home");
    btnBack.hidden = false;
    app.innerHTML =
      '<div class="zone play"><span class="zem">🔍</span><span><b>Otsi!</b>' +
      "<span>Hitta det Siiri säger</span></span></div>" +
      '<div class="card" style="text-align:center">' +
      '<p class="qsub">Siiri säger på estniska vad hon letar efter. Tryck på rätt sak i rummet.</p>' +
      '<p class="qsub">Först <b>färg och sak</b> — <i>kollane müts</i>. Sedan <b>var den ligger</b> — ' +
      "<i>laua all</i>, <i>tooli peal</i>, <i>akna juures</i>.</p>" +
      '<p class="qsub">Åtta saker att hitta. Tryck på 🔊 för att höra om.</p>' +
      '<button class="btn big wide" id="ostart">Alusta! · Börja leta</button></div>';
    document.getElementById("ostart").onclick = function () {
      try {
        ensureGraph();
        if (AC && AC.state === "suspended") AC.resume();
      } catch (e) {}
      OT = { round: 0, n: 8, right: 0, wrong: 0, stars: 0, lock: false };
      go(otsiScreen, true);
    };
  }

  function duelIntro() {
    screen = "duel";
    prefetchAllThemes();
    var i,
      html =
        '<div class="zone map"><span class="zem">⚔️</span><span><b>Duell</b>' +
        "<span>Tävla mot ett djur — Siiri hejar på dig</span></span></div>";
    html +=
      '<div class="card"><p class="qsub" style="text-align:left">Tolv frågor i tre ronder. ' +
      "Ni får samma fråga, och den som har flest rätt vinner. Ingen klocka, och du kan aldrig förlora stjärnor du redan har.</p></div>";
    for (i = 0; i < RIVALS.length; i++) {
      var r = RIVALS[i],
        open = rivalOpen(r),
        rec = duelRec(r.id);
      html +=
        '<button class="rivalcard' +
        (open ? "" : " locked") +
        '"' +
        (open ? ' data-rival="' + r.id + '"' : "") +
        ">" +
        '<span class="rem">' +
        (open ? rivalIcon(r, 40) : "🔒") +
        "</span>" +
        '<span class="rtx"><b>' +
        esc(r.et) +
        "</b><small>" +
        esc(r.sv) +
        " · " +
        esc(r.desc) +
        "</small>" +
        "<small>" +
        (open
          ? "🏆 " + rec.w + " vinster · " + rec.l + " förluster" + (rec.best ? " · bästa " + starStr(rec.best) : "")
          : "öppnas vid ort " + (r.need + 1) + " på resan") +
        "</small></span></button>";
    }
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-rival]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          duelSetup(el.getAttribute("data-rival"));
        };
      })(bs[k]);
    }
  }
  /* rivalen minns förra mötet - inget facit ändras, bara en replik innan matchen (skilt från
     taunt() som redan spelar upp en replik efteråt, i duelEnd()) */
  function rivalMemoryLine(r, rec) {
    if (rec.last === "rivalWon") return { et: "Mina võitsin viimati!", sv: r.sv + " vann senast — dags för revansch?" };
    if (rec.last === "childWon")
      return { et: "Sina võitsid viimati!", sv: "Du vann senast mot " + r.sv.toLowerCase() + " — kan du upprepa det?" };
    return null;
  }
  function duelSetup(id) {
    var r = null,
      i;
    for (i = 0; i < RIVALS.length; i++) if (RIVALS[i].id === id) r = RIVALS[i];
    if (!r) return;
    var rec = duelRec(id),
      pot = 40 + Math.min(60, rec.w * 8),
      mem = rivalMemoryLine(r, rec);
    screen = "duel";
    app.innerHTML =
      '<div class="zone map"><span class="zem">' +
      rivalIcon(r, 34) +
      "</span><span><b>" +
      esc(r.et) +
      "</b>" +
      "<span>" +
      esc(r.sv) +
      " · " +
      esc(r.desc) +
      "</span></span></div>" +
      '<div class="card" style="text-align:center">' +
      '<div class="duelvs"><span>' +
      avatarIcon(S.avatar || "🦔", 44) +
      "</span><b>vs</b><span>" +
      rivalIcon(r, 44) +
      "</span></div>" +
      (mem
        ? '<p class="qsub" style="font-weight:600"><span lang="et">' + esc(mem.et) + "</span> — " + esc(mem.sv) + "</p>"
        : "") +
      '<p class="qsub">Potten är <b>⭐ ' +
      pot +
      "</b>. Vinst ger hela, förlust halva — du kan inte förlora något du redan samlat.</p>" +
      '<button class="btn ghost wide" id="handi">🤝 Ge ' +
      esc(r.et) +
      " två poängs försprång (+50% stjärnor)</button>" +
      '<p class="qsub" id="handit">&nbsp;</p>' +
      '<button class="btn green big wide" id="go">⚔️ Sätt igång</button></div>';
    if (mem) speak(mem.et);
    var handi = false;
    document.getElementById("handi").onclick = function () {
      handi = !handi;
      this.className = handi ? "btn wide" : "btn ghost wide";
      document.getElementById("handit").textContent = handi ? "Försprång på: modigt!" : "";
      tone(handi ? 900 : 600, 0.08, 0);
    };
    document.getElementById("go").onclick = function () {
      duelStart(r, pot, handi);
    };
  }
  function duelStart(r, pot, handi) {
    DU = {
      r: r,
      pot: pot,
      handi: !!handi,
      i: 0,
      n: 12,
      me: 0,
      you: handi ? 2 : 0,
      myMiss: 0,
      hint: true,
      dbl: false,
      rivalDbl: false,
      pool: pickWeighted(allWords(), 16),
      lock: false,
    };
    speak(COACH[(Math.random() * COACH.length) | 0].et);
    setTimeout(duelRound, 700);
  }
  /* motståndarens chans att svara rätt: sämre på ord du kan, bättre på ord som vacklar,
       och hon skärper sig när hon halkar efter – men kan aldrig springa ifrån på slutet */
  function rivalChance(w) {
    var base = DU.r.skill,
      m = (S.wordmem || {})[mkey(w.et, w.sv)],
      strong = m ? Math.min(1, (m.s || 0) / 4) : 0;
    base -= strong * 0.22; /* ord du är stark på klarar hon sämre */
    base += m && m.w > 2 ? 0.1 : 0; /* ord som vacklar kan hon bättre */
    var diff = DU.me - DU.you;
    if (diff >= 2) base += 0.15; /* du leder: hon skärper sig */
    if (diff <= -2) base -= 0.2; /* hon leder: hon slarvar */
    var left = DU.n - DU.i;
    if (left <= 2 && diff > 0) base -= 0.25; /* sista ronden: din ledning står sig */
    return Math.max(0.15, Math.min(0.94, base));
  }
  function duelTrack() {
    var me = Math.min(1, DU.me / 8),
      you = Math.min(1, DU.you / 8);
    return (
      '<div class="track"><div class="lane"><span class="run" style="left:' +
      me * 82 +
      '%">' +
      avatarIcon(S.avatar || "🦔", 28) +
      "</span>" +
      '<span class="flag">🏁</span></div>' +
      '<div class="lane"><span class="run" style="left:' +
      you * 82 +
      '%">' +
      rivalIcon(DU.r, 28) +
      '</span><span class="flag">🏁</span></div>' +
      '<div class="score"><b>' +
      DU.me +
      "</b> – <b>" +
      DU.you +
      "</b></div></div>"
    );
  }
  function duelRound() {
    if (!DU) return;
    /* oavgjort efter tolv frågor ger en avgörande fråga till */
    if (DU.i >= DU.n) {
      if (DU.me === DU.you) {
        DU.n++;
        speak(taunt("tie").et);
      } else {
        duelEnd();
        return;
      }
    }
    var w = DU.pool[DU.i % DU.pool.length],
      all = optionPool(w, allWords()),
      opts = [w],
      i,
      tries = 0;
    var listen = DU.i % 3 === 2; /* var tredje fråga hörs i stället för att synas */
    while (opts.length < 4 && tries < 90) {
      var c = all[(Math.random() * all.length) | 0];
      tries++;
      var dup = false;
      for (i = 0; i < opts.length; i++) if (opts[i].et === c.et || opts[i].sv === c.sv) dup = true;
      if (!dup) opts.push(c);
    }
    opts = shuffle(opts);
    var rnd = Math.floor(DU.i / 4) + 1;
    if (DU.i > 0 && DU.i % 4 === 0 && DU.lastCoach !== rnd) {
      DU.lastCoach = rnd;
      var cm = COACH[(Math.random() * COACH.length) | 0];
      /* ordet som ska höras har ensamrätt – ingen hejarklack ovanpå */
      if (!listen)
        setTimeout(function () {
          if (DU) speak(cm.et);
        }, 350);
    }
    /* motståndaren kan spela sin dubbelpoäng en gång, helst när hon ligger under */
    if (!DU.rivalDbl && DU.i >= 4 && DU.you < DU.me && Math.random() < 0.4) {
      DU.rivalDbl = "now";
    }
    var html =
      '<div class="zone map"><span class="zem">' +
      rivalIcon(DU.r, 34) +
      "</span><span><b>Rond " +
      Math.min(3, rnd) +
      " av 3</b>" +
      "<span>fråga " +
      (DU.i + 1) +
      " av " +
      DU.n +
      "</span></span></div>" +
      '<div class="card">' +
      duelTrack() +
      (DU.i === DU.n - 1
        ? '<p class="qsub" style="color:var(--berry);font-weight:700">' + esc(taunt("last").et) + " · sista frågan</p>"
        : "") +
      (DU.rivalDbl === "now"
        ? '<p class="qsub" style="color:var(--honey-deep);font-weight:700">⭐ ' + esc(DU.r.et) + ": Topeltpunkt!</p>"
        : "") +
      (listen
        ? '<p class="q">Lyssna och välj</p>' +
          '<div class="center"><button class="speakbtn big" id="hear" aria-label="Hör ordet">🔊</button></div>' +
          '<p class="qsub">Tryck igen om du vill höra en gång till</p>'
        : '<p class="q">Vad heter</p>' + promptHtml(w, w.sv)) +
      '<div class="opts" id="opts">';
    for (i = 0; i < opts.length; i++)
      html += '<button class="opt" data-et="' + esc(opts[i].et) + '" lang="et">' + esc(opts[i].et) + "</button>";
    html +=
      '</div><div class="row" style="margin-top:10px">' +
      '<button class="btn ghost" id="hint"' +
      (DU.hint ? "" : " disabled") +
      ">🔍 Vihje</button>" +
      '<button class="btn ghost" id="dbl"' +
      (DU.dbl ? " disabled" : "") +
      ">⭐ Topeltpunkt</button></div>" +
      '<div class="feedback" id="fb"></div></div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    if (listen) {
      speak(w.et);
      var hb = document.getElementById("hear");
      if (hb)
        hb.onclick = function () {
          speak(w.et);
        };
    }
    if (DU.rivalDbl === "now" && !listen) speak(taunt("dbl").et);
    var used = false;
    document.getElementById("hint").onclick = function () {
      if (DU.lock || !DU.hint) return;
      DU.hint = false;
      this.disabled = true;
      var bs = app.querySelectorAll(".opt"),
        removed = 0,
        k;
      for (k = 0; k < bs.length && removed < 2; k++) {
        if (bs[k].getAttribute("data-et") !== w.et) {
          bs[k].style.opacity = ".25";
          bs[k].disabled = true;
          removed++;
        }
      }
      tone(700, 0.1, 0);
    };
    document.getElementById("dbl").onclick = function () {
      if (DU.lock || DU.dbl) return;
      DU.dbl = true;
      this.disabled = true;
      this.className = "btn";
      DU.dblNow = true;
      tone(1180, 0.12, 0);
      document.getElementById("fb").className = "feedback";
      document.getElementById("fb").textContent = "Dubbelt om du har rätt — men missar du får " + DU.r.et + " poängen.";
    };
    var bs = app.querySelectorAll(".opt"),
      k2;
    for (k2 = 0; k2 < bs.length; k2++) {
      (function (el) {
        el.onclick = function () {
          if (DU.lock) return;
          DU.lock = true;
          var ok = el.getAttribute("data-et") === w.et;
          var b2 = app.querySelectorAll(".opt"),
            q;
          for (q = 0; q < b2.length; q++) {
            b2[q].disabled = true;
            if (b2[q].getAttribute("data-et") === w.et) b2[q].className = "opt right";
          }
          if (!ok) el.className = "opt wrong";
          wmemHit(w.et, ok, "choose", w.sv);
          var gained = 0;
          if (ok) {
            gained = DU.dblNow ? 2 : 1;
            DU.me += gained;
            sndOk();
            buzz(18);
            mood("cheer");
          } else {
            DU.myMiss++;
            sndNo();
            mood("oops");
            if (DU.dblNow) {
              DU.you += 1;
            }
          }
          DU.dblNow = false;
          praiseSay(ok ? 2 : 0, ok, document.getElementById("fb"));
          /* motståndaren funderar synligt innan hon svarar */
          var fbT = document.getElementById("fb");
          if (fbT && fbT.parentNode) {
            var th = document.createElement("div");
            th.className = "rivalthink";
            th.innerHTML =
              '<span class="rem">' +
              rivalIcon(DU.r, 26) +
              '</span><span class="dots"><i></i><i></i><i></i></span>' +
              '<span class="rtxt">' +
              esc(DU.r.et) +
              " funderar…</span>";
            fbT.parentNode.insertBefore(th, fbT);
          }
          setTimeout(function () {
            if (!DU) return;
            var th2 = app.querySelector(".rivalthink");
            if (th2) th2.remove();
            var hit = Math.random() < rivalChance(w);
            var pts = DU.rivalDbl === "now" ? 2 : 1;
            if (hit) DU.you += pts;
            if (DU.rivalDbl === "now") DU.rivalDbl = true;
            var t = taunt(hit ? (DU.you > DU.me ? "lead" : "hit") : "miss");
            speak(t.et);
            if (hit) {
              tone(660, 0.09, 0);
              tone(880, 0.12, 0.09);
            } else {
              tone(300, 0.15, 0);
            }
            var face = hit ? (DU.you > DU.me ? "😎" : "🙂") : "😳";
            var fb = document.getElementById("fb");
            if (fb) {
              fb.className = "feedback " + (hit ? "no" : "ok");
              fb.innerHTML =
                '<span class="rivalsay"><span class="rem">' +
                rivalIcon(DU.r, 30) +
                "</span>" +
                "<span><b>" +
                esc(DU.r.et) +
                " " +
                (hit ? "svarade rätt" : "svarade fel") +
                " " +
                face +
                "</b>" +
                "<small>" +
                esc(t.et) +
                " · " +
                esc(t.sv) +
                "</small></span></span>";
            }
            var tr = app.querySelector(".track");
            if (tr) tr.outerHTML = duelTrack();
            DU.i++;
            DU.lock = false;
            setTimeout(function () {
              if (DU) duelRound();
            }, 1300);
          }, 950);
        };
      })(bs[k2]);
    }
  }
  function duelEnd() {
    var won = DU.me > DU.you,
      rec = duelRec(DU.r.id),
      margin = DU.me - DU.you;
    var st = !won ? 0 : DU.myMiss === 0 ? 3 : margin >= 3 ? 2 : 1;
    var gain = Math.round((won ? DU.pot : DU.pot / 2) * (DU.handi ? 1.5 : 1));
    earnStars(gain);
    addXp(won ? 60 : 25);
    var firstDuelWin = false;
    if (won) {
      rec.w++;
      firstDuelWin = firstEver("duelwin");
    } else rec.l++;
    if (st > rec.best) rec.best = st;
    rec.last = won ? "childWon" : "rivalWon";
    save();
    refreshTop();
    if (won) {
      burst(200);
      fanfare(3);
      setTimeout(function () {
        dance();
      }, 300);
      if (firstDuelWin) celebrateFirst("⚔️", "Sinu esimene duellivõit!", "Din första duellvinst!");
    } else {
      burst(80);
      sndLvl();
    }
    speak(taunt(won ? "lose" : "win").et);
    var trophy = won && rec.w === 5;
    app.innerHTML =
      '<div class="card" style="text-align:center">' +
      '<div class="duelvs"><span>' +
      avatarIcon(S.avatar || "🦔", 44) +
      "</span><b>" +
      DU.me +
      " – " +
      DU.you +
      "</b><span>" +
      rivalIcon(DU.r, 44) +
      "</span></div>" +
      '<div class="bigstars">' +
      starStr(st) +
      "</div>" +
      '<p class="q">' +
      (won ? "Du vann mot " + esc(DU.r.et) + "!" : esc(DU.r.et) + " vann den här gången") +
      "</p>" +
      '<p class="qsub">' +
      (won
        ? DU.myMiss === 0
          ? "Felfri match — tre stjärnor!"
          : margin >= 3
            ? "Stor marginal — två stjärnor!"
            : "En stjärna. Vinn med tre poängs marginal för två."
        : "Du får ändå halva potten.") +
      "</p>" +
      '<p class="qsub">⭐ +' +
      gain +
      (DU.handi ? " (försprångsbonus)" : "") +
      "</p>" +
      (trophy ? '<p class="q" style="color:var(--honey-deep)">🏆 Fem vinster mot ' + esc(DU.r.et) + "!</p>" : "") +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="again">⚔️ En gång till mot ' +
      esc(DU.r.et) +
      "</button>" +
      '<div class="row"><button class="btn ghost" id="other">Byt motståndare</button>' +
      '<button class="btn ghost" id="home">Menüü</button></div></div>';
    var r = DU.r;
    DU = null;
    mood(won ? "cheer" : "oops");
    if (won) tripBump("duel", 1);
    if (won)
      setTimeout(function () {
        dance(st >= 2);
      }, 400);
    document.getElementById("again").onclick = function () {
      duelSetup(r.id);
    };
    document.getElementById("other").onclick = function () {
      duelIntro();
    };
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
  }

  /* ---------- SIIRI TUBA: rummet där samlingen bor ---------- */

  /* ---------- MÄLUMÄNG: memory ---------- */
  var MM = null;
  function memIntro() {
    screen = "mem";
    prefetchAllThemes();
    /* buggrapport: "memori på lätt 4 par har fastnat" - !S.memLv är sant även när memLv är 0
       (Lätt), så den skrevs genast över till 1 (Lagom) igen - då kunde man ALDRIG spela Lätt,
       bara se den förvälja sig tillbaka till Lagom. */
    if (S.memLv !== 0 && !S.memLv) S.memLv = 1;
    var sizes = [4, 6, 8],
      names = ["Lätt · 4 par", "Lagom · 6 par", "Svår · 8 par"],
      i;
    var html =
      '<div class="zone play"><span class="zem">🃏</span><span><b>Mälumäng</b>' +
      "<span>Memory — para ihop ordet med bilden</span></span></div>" +
      '<div class="card" style="text-align:center">' +
      '<p class="qsub">Korten ligger nedvända. Vänd två i taget. Hittar du paret läser Siiri ordet – ingen klocka, ingen stress.</p>' +
      '<div class="memlv">';
    for (i = 0; i < 3; i++) {
      var bestT = (S.memBestLv || {})[i];
      html +=
        '<button class="memlvbtn' +
        (S.memLv === i ? " on" : "") +
        '" data-lv="' +
        i +
        '"><b>' +
        names[i] +
        "</b>" +
        "<small>" +
        (bestT ? "bästa: " + bestT + " vändningar" : "inte spelat än") +
        "</small></button>";
    }
    html +=
      '</div><div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="start">Sätt igång 🃏</button></div>';
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-lv]"),
      k;
    for (k = 0; k < bs.length; k++) {
      (function (el) {
        el.onclick = function () {
          S.memLv = parseInt(el.getAttribute("data-lv"), 10);
          save();
          tone(760, 0.07, 0);
          memIntro();
        };
      })(bs[k]);
    }
    document.getElementById("start").onclick = memStart;
  }
  function memStart() {
    /* samma 0-är-falsy-fälla som i memIntro() - Lätt (memLv 0) fick annars alltid 6 par */
    var n = [4, 6, 8][S.memLv !== 0 && !S.memLv ? 1 : S.memLv];
    var pool = pickWeighted(allWords().filter(hasPic), n),
      cards = [],
      i; /* bild ↔ ord: inga läxord */
    for (i = 0; i < pool.length; i++) {
      cards.push({ id: i, kind: "word", w: pool[i] });
      cards.push({ id: i, kind: "pic", w: pool[i] });
    }
    MM = {
      cards: shuffle(cards),
      open: [],
      done: {},
      turns: 0,
      lock: false,
      pairs: n,
      streak: 0,
      best: 0,
      flash: null,
    };
    memDraw();
  }
  function memDraw() {
    var c = MM.cards,
      i;
    var perfect = MM.pairs,
      stars = memStars(MM.turns, MM.pairs);
    var html =
      '<div class="zone play"><span class="zem">🃏</span><span><b>Mälumäng</b>' +
      "<span>" +
      MM.turns +
      " vändningar · " +
      Object.keys(MM.done).length +
      " av " +
      MM.pairs +
      " par" +
      (MM.streak > 1 ? " · 🔥 " + MM.streak + " i rad" : "") +
      "</span></span></div>" +
      '<div class="card">' +
      (MM.flash
        ? '<div class="memflash"><span class="fem">' +
          MM.flash.em +
          "</span>" +
          '<span><b lang="et">' +
          esc(MM.flash.et) +
          "</b><small>" +
          esc(MM.flash.sv) +
          "</small></span></div>"
        : '<div class="memflash empty"></div>') +
      '<div class="memgrid' +
      (MM.pairs >= 8 ? " tight" : "") +
      '">';
    for (i = 0; i < c.length; i++) {
      var isOpen = MM.open.indexOf(i) >= 0,
        isDone = MM.done[c[i].id];
      html +=
        '<button class="memcard' +
        (isOpen || isDone ? " up" : "") +
        (isDone ? " done" : "") +
        '" data-m="' +
        i +
        '">' +
        '<span class="mface back"><span class="mem-back">🦔</span></span>' +
        '<span class="mface front">' +
        (c[i].kind === "pic"
          ? '<span class="mem-em">' + wIcon(c[i].w) + "</span>"
          : '<span class="mem-wd">' + esc(c[i].w.et) + "</span>") +
        "</span></button>";
    }
    html +=
      '</div><p class="qsub" style="margin-top:10px">' +
      (MM.turns
        ? "Klarar du det på " + perfect + " vändningar blir det tre stjärnor."
        : "Varje par du minns direkt ger extra stjärnor.") +
      '</p></div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    var bs = app.querySelectorAll("[data-m]");
    for (i = 0; i < bs.length; i++) {
      (function (el) {
        el.onclick = function () {
          memFlip(parseInt(el.getAttribute("data-m"), 10));
        };
      })(bs[i]);
    }
  }
  function memStars(turns, pairs) {
    if (turns <= pairs) return 3;
    if (turns <= Math.round(pairs * 1.6)) return 2;
    if (turns <= pairs * 2.6) return 1;
    return 0;
  }
  function memFlip(i) {
    if (!MM || MM.lock) return;
    var c = MM.cards[i];
    if (MM.done[c.id] || MM.open.indexOf(i) >= 0) return;
    MM.open.push(i);
    speak(c.w.et);
    if (MM.open.length < 2) {
      MM.flash = null;
      memDraw();
      return;
    }
    MM.turns++;
    MM.lock = true;
    memDraw();
    var a = MM.cards[MM.open[0]],
      b = MM.cards[MM.open[1]];
    if (a.id === b.id) {
      MM.done[a.id] = 1;
      MM.open = [];
      MM.lock = false;
      MM.streak++;
      if (MM.streak > MM.best) MM.best = MM.streak;
      var bonus = 2 + (MM.streak >= 3 ? 2 : MM.streak >= 2 ? 1 : 0);
      S.correct++;
      earnStars(bonus);
      addXp(12 + MM.streak * 2);
      wmemHit(a.w.et, true, "choose", a.w.sv);
      sndOk();
      buzz(18);
      mood("cheer");
      save();
      refreshTop();
      MM.flash = { em: wIcon(a.w), et: a.w.et, sv: a.w.sv };
      if (MM.streak >= 3) {
        tone(1180, 0.1, 0);
        tone(1560, 0.16, 0.1);
      }
      if (Object.keys(MM.done).length >= MM.pairs) {
        setTimeout(memEnd, 650);
        memDraw();
        return;
      }
      setTimeout(memDraw, 260);
    } else {
      MM.streak = 0;
      wmemHit(a.w.et, false, undefined, a.w.sv);
      sndNo();
      mood("oops");
      setTimeout(function () {
        if (!MM) return;
        MM.open = [];
        MM.lock = false;
        MM.flash = null;
        memDraw();
      }, 1000);
    }
  }
  function memEnd() {
    tripBump("mem", 1);
    var t = MM.turns,
      pairs = MM.pairs,
      st = memStars(t, pairs);
    if (!S.memBestLv) S.memBestLv = {};
    /* samma 0-är-falsy-fälla - annars sparades Lätts bästa resultat under Lagoms nyckel */
    var lv = S.memLv !== 0 && !S.memLv ? 1 : S.memLv,
      rec = !S.memBestLv[lv] || t < S.memBestLv[lv];
    if (rec) S.memBestLv[lv] = t;
    if (!S.memBest || t < S.memBest) S.memBest = t;
    var gain = 10 + pairs * 3 + st * 8;
    earnStars(gain);
    save();
    refreshTop();
    tripBump("mix", 1);
    bumpQuest("mixed", 1);
    if (st === 3) {
      burst(180);
      fanfare(3);
      setTimeout(function () {
        dance();
      }, 300);
    } else {
      burst(110);
      fanfare(2);
    }
    app.innerHTML =
      '<div class="card" style="text-align:center"><div class="bigstars">' +
      starStr(st) +
      "</div>" +
      '<div class="bigscore">' +
      t +
      '</div><p class="q">' +
      (st === 3 ? "Perfekt minne!" : rec ? "Nytt rekord!" : "Alla par hittade!") +
      "</p>" +
      '<p class="qsub">vändningar på ' +
      pairs +
      " par" +
      (MM.best > 1 ? " · längsta serie " + MM.best : "") +
      "</p>" +
      '<p class="qsub">⭐ +' +
      gain * starMult() +
      "</p>" +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="again">En gång till 🃏</button>' +
      '<div class="row"><button class="btn ghost" id="harder">Byt svårighet</button>' +
      '<button class="btn ghost" id="home">Tillbaka</button></div></div>';
    MM = null;
    mood("cheer");
    document.getElementById("again").onclick = memStart;
    document.getElementById("harder").onclick = memIntro;
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
  }

  /* ---------- SÕNASADU: ordregn ---------- */
  var RN = null;
  function rainIntro() {
    screen = "rain";
    prefetchAllThemes();
    app.innerHTML =
      '<div class="zone play"><span class="zem">🌧️</span><span><b>Sõnasadu</b><span>Ordregnet — fånga rätt ord</span></span></div>' +
      '<div class="card" style="text-align:center"><p class="qsub">Orden dalar sakta ner. Tryck på det ord Siiri ber om. Missar du dyker det upp igen — ingen stress.</p>' +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="start">Sätt igång 🌧️</button></div>';
    document.getElementById("start").onclick = rainStart;
  }
  function rainStart() {
    RN = { i: 0, n: 10, right: 0, pool: pickWeighted(allWords(), 20) };
    rainRound();
  }
  function rainRound() {
    if (!RN) return;
    if (RN.i >= RN.n) {
      rainEnd();
      return;
    }
    RN.lock = false;
    var target = RN.pool[RN.i % RN.pool.length],
      all = optionPool(target, allWords()),
      opts = [target],
      i,
      tries = 0;
    while (opts.length < 4 && tries < 80) {
      var c = all[(Math.random() * all.length) | 0];
      tries++;
      var dup = false;
      for (i = 0; i < opts.length; i++) if (opts[i].et === c.et || opts[i].sv === c.sv) dup = true;
      if (!dup) opts.push(c);
    }
    opts = shuffle(opts);
    var html =
      '<div class="zone play"><span class="zem">🌧️</span><span><b>Sõnasadu</b>' +
      "<span>ord " +
      (RN.i + 1) +
      " av " +
      RN.n +
      " · " +
      RN.right +
      " rätt</span></span></div>" +
      '<div class="card"><p class="q">Hitta ordet för</p>' +
      promptHtml(target, target.sv) +
      '<div class="center"><button class="speakbtn sm" id="say" aria-label="Hör ordet">🔊</button></div>' +
      '<div class="rainbox">';
    for (i = 0; i < opts.length; i++) {
      html +=
        '<button class="raindrop" data-et="' +
        esc(opts[i].et) +
        '" style="left:' +
        (6 + i * 23) +
        "%;animation-duration:" +
        (7 + i * 1.3) +
        "s;animation-delay:" +
        i * 0.7 +
        's">' +
        esc(opts[i].et) +
        "</button>";
    }
    html += '</div><div class="feedback" id="fb"></div></div><div class="center">' + siilSVG("small") + "</div>";
    app.innerHTML = html;
    speak(target.et);
    document.getElementById("say").onclick = function () {
      speak(target.et);
    };
    var ds = app.querySelectorAll("[data-et]");
    for (i = 0; i < ds.length; i++) {
      (function (el) {
        el.onclick = function () {
          if (!RN || RN.lock) return;
          RN.lock = true;
          for (var j = 0; j < ds.length; j++) {
            ds[j].disabled = true;
            ds[j].style.animationPlayState = "paused";
          }
          var ok = el.getAttribute("data-et") === target.et;
          el.classList.add(ok ? "hit" : "miss");
          wmemHit(target.et, ok, "choose", target.sv);
          praiseSay(ok ? RN.right + 1 : 0, ok, document.getElementById("fb"));
          if (ok) {
            RN.right++;
            S.correct++;
            earnStars(2);
            addXp(10);
            sndOk();
            buzz(18);
            mood("cheer");
            save();
            refreshTop();
          } else {
            sndNo();
            mood("oops");
          }
          RN.i++;
          setTimeout(function () {
            if (RN) rainRound();
          }, 800);
        };
      })(ds[i]);
    }
  }
  function rainEnd() {
    var r = RN.right,
      n = RN.n;
    save();
    burst(150);
    fanfare(2);
    tripBump("hear", r);
    tripBump("mix", 1);
    var st = r >= n ? 3 : r >= n * 0.7 ? 2 : r >= n * 0.4 ? 1 : 0;
    app.innerHTML =
      '<div class="card" style="text-align:center"><div class="bigstars">' +
      starStr(st) +
      "</div>" +
      '<div class="bigscore">' +
      r +
      " / " +
      n +
      '</div><p class="q">Bra fångat!</p>' +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<div class="row"><button class="btn green big" id="again">En gång till 🌧️</button>' +
      '<button class="btn ghost big" id="home">Tillbaka</button></div></div>';
    RN = null;
    mood("cheer");
    document.getElementById("again").onclick = rainIntro;
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
  }

  /* ---------- PAADISÕIT (barkbåten) ----------
     Samma spel som Sõnasadu (välj rätt ord bland fyra, resten är distraktion) men orden
     flyter förbi horisontellt på en flod istället för att falla från himlen - se BT jämfört
     med RN ovan. Egen kopia snarare än en delad motor: två likadana spel är inte värt risken
     att röra det redan fungerande ordregnet för att klämma in en gemensam funktion. */
  var BT = null;
  /* Siiri sitter i barkbåten - samma illustration som resten av appen (public/images/siiri/
     siiri-body.webp), inte en handritad SVG-siluett. Hon visas här i sin vanliga gräddvita
     grundfärg, utan barnets valda pälsfärg: den riktiga färglagda siilSVG() har ett fast id
     ("s-svg") som resten av motorn letar upp för munrörelser/humör/lutning, och att lägga in
     en andra kopia av den på samma sida hade krockat med det. Båten och seglet är vektor -
     enkla föremål, ingen anledning att illustrera dem. */
  function boatIcon() {
    /* en enda AI-illustrerad bild av Siiri som redan sitter i barkbåten (siiri-bark-boat.webp)
       - ersätter det tidigare lagerbygget (skrov + Siiri-overlay + beskuren framkant), som
       aldrig gick att få att se ut som att hon verkligen satt i båten istället för på den. */
    return '<img class="riverboat" src="/images/games/siiri-bark-boat.webp" alt="">';
  }
  function boatIntro() {
    screen = "boat";
    prefetchAllThemes();
    app.innerHTML =
      '<div class="zone play"><span class="zem">🛶</span><span><b>Paadisõit</b><span>Barkbåten — styr och fånga rätt ord</span></span></div>' +
      '<div class="card" style="text-align:center"><p class="qsub">Siiri åker barkbåt nerför floden. Flaskposter flyter förbi på vattnet. Styr båten upp och ner med musen eller piltangenterna, och åk på flaskan med ordet Siiri ber om. Tar du fel flaska? Ingen fara - floden fortsätter, bara testa nästa.</p>' +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="start">Sätt igång 🛶</button></div>';
    document.getElementById("start").onclick = boatStart;
  }
  var BOAT_LANES = [10, 37, 64, 90];
  /* vilket ord nästa flaska i en lucka ska bära - ibland målordet (annars skulle man kunna
     vänta hur länge som helst utan att det dyker upp), annars en distraktor. Undviker ord som
     redan flyter i en annan flaska just då (slotRef utesluter sig själv vid återfyllning). */
  function boatWordFor(slotRef) {
    var present = [],
      k;
    for (k = 0; k < BT.slots.length; k++) if (BT.slots[k] && BT.slots[k] !== slotRef) present.push(BT.slots[k].et);
    if (Math.random() < 0.4 && present.indexOf(BT.target.et) === -1) return BT.target;
    var all = optionPool(BT.target, allWords()),
      tries = 0,
      c;
    do {
      c = all[(Math.random() * all.length) | 0];
      tries++;
    } while (present.indexOf(c.et) !== -1 && tries < 30);
    return c;
  }
  /* guldflaska: en sällsynt extra-glittrig flaska, men bara på ett ord som redan är rätt svar -
     den ska aldrig kunna lura någon att fånga fel ord för belöningens skull. Högst en i taget
     (BT.goldenActive), annars skulle floden kunna fyllas med guld. */
  function boatAssignWord(s) {
    var w = boatWordFor(s);
    s.et = w.et;
    s.golden = !BT.goldenActive && w.et === BT.target.et && Math.random() < 0.3;
    if (s.golden) BT.goldenActive = true;
  }
  /* nästa ord att leta efter - floden stannar aldrig för det, bara prompten och uppläsningen
     byts i farten (se boatCatch()) */
  function boatNextTarget() {
    BT.target = BT.pool[BT.poolIdx % BT.pool.length];
    BT.poolIdx++;
    /* en guldflaska som hann bli guld för det GAMLA ordet är inte längre rätt svar - släck
       guldet (men låt flaskan fortsätta flyta som en vanlig distraktor) så att ett guld
       aldrig kan belöna fel ord. */
    for (var gi = 0; gi < BT.slots.length; gi++) {
      var gs = BT.slots[gi];
      if (gs.golden && gs.et !== BT.target.et) {
        gs.golden = false;
        BT.goldenActive = false;
        var gel = document.getElementById(gs.domId);
        if (gel) gel.classList.remove("golden");
      }
    }
    var el = document.getElementById("boatprompt");
    if (el) el.innerHTML = promptHtml(BT.target, BT.target.sv);
    speak(BT.target.et);
  }
  function boatRespawn(s) {
    s.state = "flowing";
    if (s.golden) BT.goldenActive = false; /* lämnade skärmen ofångad - fritt för nästa guld */
    boatAssignWord(s);
    /* vid reducerad rörelse snurrar tick() aldrig, så en flaska som återfylls utanför rutan
       (det vanliga) skulle bli kvar osynlig för alltid - synlig, stillastående plats istället */
    s.x = BT.reduceMotion ? 10 + s.lane * 20 : -15 - Math.random() * 12;
    var el = document.getElementById(s.domId);
    if (el) {
      el.innerHTML = '<span class="riverlabel">' + (s.golden ? "✨ " : "") + s.et + "</span>";
      el.classList.remove("hit", "miss");
      el.classList.toggle("golden", !!s.golden);
    }
    if (BT.paint) BT.paint();
  }
  /* fångar en flaska oavsett om det var en riktig krock (båten körde över den) eller ett
     direkt tryck - samma utfall, två sätt att träffa (styra dit, eller peka direkt som
     reserv). Stoppar aldrig floden: bara den fångade flaskan fryser till en kort stund
     (hit/miss-färgen) innan den återfylls med ett nytt ord - allt annat flyter vidare. */
  function boatCatch(s) {
    if (!BT || s.state !== "flowing") return;
    s.state = "caught";
    var ok = s.et === BT.target.et,
      golden = ok && !!s.golden,
      el = document.getElementById(s.domId);
    if (el) el.classList.add(ok ? "hit" : "miss");
    wmemHit(BT.target.et, ok, "choose", BT.target.sv);
    /* buggrapport: beröm-repliken ("Bra!" m.fl.) köas med 150ms fördröjning (queuePraise) -
       kom den efter att boatNextTarget() nedan redan hunnit säga nästa ord, kapade den
       (speak() avbryter alltid föregående klipp) så man aldrig hörde det nya ordet. Talar
       därför bara beröm när inget nästa-ord-uttal konkurrerar om det: sista fångsten eller
       en felfångst (ingen av dem följs av boatNextTarget()). */
    if (ok) {
      BT.right++;
      BT.streak = (BT.streak || 0) + 1;
      S.correct++;
      earnStars(golden ? 4 : 2);
      addXp(golden ? 20 : 10);
      sndOk();
      if (golden) {
        /* extra glittrigt ljud ovanpå sndOk() för guldfångsten */
        tone(1180, 0.12, 0.3);
        tone(1760, 0.18, 0.42);
      }
      buzz(golden ? 30 : 18);
      mood("cheer");
      /* combo-eskalering: fler rätt i rad ger en större konfettikaskad - ingen nedsida vid miss */
      burst(golden ? 60 : Math.min(8 + BT.streak * 5, 40));
      save();
      refreshTop();
      var scoreEl = document.getElementById("boatscore");
      if (scoreEl) scoreEl.textContent = BT.right + " av " + BT.n + " rätt";
      var streakEl = document.getElementById("boatstreak");
      if (streakEl) {
        if (BT.streak >= 3) {
          streakEl.style.display = "";
          streakEl.textContent = "🔥 " + BT.streak;
        } else streakEl.style.display = "none";
      }
      if (BT.right >= BT.n) {
        praiseSay(BT.right, true, null);
        setTimeout(boatEnd, 500);
        return;
      }
      boatNextTarget();
    } else {
      BT.wrong++;
      BT.streak = 0;
      sndNo();
      mood("oops");
      praiseSay(0, false, null);
      var streakEl2 = document.getElementById("boatstreak");
      if (streakEl2) streakEl2.style.display = "none";
    }
    setTimeout(function () {
      if (BT) boatRespawn(s);
    }, 420);
  }
  function boatStart() {
    BT = {
      right: 0,
      wrong: 0,
      streak: 0,
      goldenActive: false,
      n: 10,
      pool: pickWeighted(allWords(), 20),
      poolIdx: 1,
      boatY: 50,
      slots: [],
      keyHandler: null,
    };
    BT.target = BT.pool[0];
    BT.keyHandler = function (e) {
      if (!BT || screen !== "boat") return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        BT.boatY = Math.max(6, BT.boatY - 8);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        BT.boatY = Math.min(94, BT.boatY + 8);
      } else return;
      if (BT.paint) BT.paint(); /* tick() må inte snurra (reduceMotion) - rita om direkt så pilarna syns */
    };
    document.addEventListener("keydown", BT.keyHandler);
    boatRender();
  }
  /* ritar skalet en enda gång (till skillnad från förut, då hela skärmen byggdes om per ord) -
     det är precis det som gjorde att floden "bromsade in" mellan varje ord. Nu lever samma DOM
     kvar hela resan; bara prompten (boatNextTarget()) och flaskornas ord (boatRespawn()) byts. */
  function boatRender() {
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      i,
      html =
        '<div class="zone play"><span class="zem">🛶</span><span><b>Paadisõit</b>' +
        '<span id="boatscore">' +
        BT.right +
        " av " +
        BT.n +
        " rätt</span>" +
        '<span id="boatstreak" class="fchip" style="margin-left:6px;display:none"></span></span></div>' +
        '<div class="card"><p class="q">Hitta ordet för</p>' +
        '<div id="boatprompt">' +
        promptHtml(BT.target, BT.target.sv) +
        "</div>" +
        '<div class="center"><button class="speakbtn sm" id="say" aria-label="Hör ordet">🔊</button></div>' +
        '<div class="riverbox" id="riverbox">' +
        boatIcon();
    for (i = 0; i < BOAT_LANES.length; i++) {
      html += '<button class="riverword" id="rw' + i + '" style="top:' + BOAT_LANES[i] + '%"></button>';
    }
    html += '</div></div><div class="center">' + siilSVG("small") + "</div>";
    app.innerHTML = html;
    speak(BT.target.et);
    document.getElementById("say").onclick = function () {
      speak(BT.target.et);
    };
    BT.reduceMotion = reduceMotion;
    BT.slots = [];
    for (i = 0; i < BOAT_LANES.length; i++) {
      BT.slots.push({
        domId: "rw" + i,
        lane: i,
        y: BOAT_LANES[i],
        x: reduceMotion ? 10 + i * 20 : -15 - i * 22,
        state: "flowing",
      });
      boatAssignWord(BT.slots[i]);
    }
    for (i = 0; i < BT.slots.length; i++) {
      (function (s) {
        var el = document.getElementById(s.domId);
        if (el) {
          el.innerHTML = '<span class="riverlabel">' + (s.golden ? "✨ " : "") + s.et + "</span>";
          el.classList.toggle("golden", !!s.golden);
          el.onclick = function () {
            boatCatch(s);
          };
        }
      })(BT.slots[i]);
    }
    var box = document.getElementById("riverbox"),
      boatEl = box.querySelector(".riverboat");
    function paint() {
      /* båten guppar lite i vattnet ovanpå spelarens egen styrning (BT.bob, satt i tick()) -
         ren känsla, påverkar aldrig BT.boatY som fångstzonen räknar på */
      if (boatEl) boatEl.style.top = BT.boatY + (BT.bob || 0) + "%";
      for (var j = 0; j < BT.slots.length; j++) {
        var s = BT.slots[j],
          e2 = document.getElementById(s.domId);
        if (e2) {
          e2.style.left = s.x + "%";
          e2.style.top = s.y + "%";
        }
      }
    }
    BT.paint = paint;
    paint();
    function steerTo(clientY) {
      if (!BT || !box) return;
      var r = box.getBoundingClientRect();
      BT.boatY = Math.max(6, Math.min(94, ((clientY - r.top) / r.height) * 100));
      paint();
    }
    box.addEventListener("mousemove", function (e) {
      steerTo(e.clientY);
    });
    box.addEventListener(
      "touchmove",
      function (e) {
        if (e.touches && e.touches[0]) steerTo(e.touches[0].clientY);
      },
      { passive: true },
    );
    if (reduceMotion) {
      /* ingen självgående rörelse - flaskorna står stilla, tryck på dem funkar ändå,
         och steerTo() ovan ritar om båten direkt så den ändå följer musen/fingret */
      return;
    }
    function tick(ts) {
      if (!BT || screen !== "boat") return; /* skärmen är lämnad - sluta tyst, inget mer att göra */
      var dt = ts - (BT.lastTs || ts);
      BT.lastTs = ts;
      BT.bob = Math.sin(ts / 450) * 2.2; /* mjuk guppning, ett varv på ca 2,8s */
      /* strömmen växlar mjukt mellan lugnare och lite rappare partier istället för att alltid
         flyta i exakt samma takt - ett varv på ca 20s, ±35% kring grundfarten */
      var flow = 1 + 0.35 * Math.sin(ts / 3200);
      /* buggrapport: "flaskorna rör sig för snabbt" - grundfarten var 0.022, sänkt ca 30% */
      var speed = dt * 0.015 * flow; /* % av rutans bredd per ms, tillräckligt lugnt för ett barn att hinna styra */
      for (var j = 0; j < BT.slots.length; j++) {
        var s = BT.slots[j];
        if (s.state !== "flowing") continue; /* just fångad - väntar på boatRespawn() */
        s.x += speed;
        if (s.x > 110) {
          boatRespawn(s);
          continue;
        }
        /* fångstzon: nära båtens fasta x-position (82%), inom räckhåll i höjd från båten */
        if (s.x >= 76 && s.x <= 88 && Math.abs(s.y - BT.boatY) < 16) boatCatch(s);
      }
      paint();
      BT.raf = requestAnimationFrame(tick);
    }
    BT.raf = requestAnimationFrame(tick);
  }
  function boatEnd() {
    var r = BT.right,
      w = BT.wrong;
    if (BT.raf) cancelAnimationFrame(BT.raf);
    if (BT.keyHandler) document.removeEventListener("keydown", BT.keyHandler);
    save();
    burst(150);
    fanfare(2);
    tripBump("hear", r);
    tripBump("mix", 1);
    var st = w === 0 ? 3 : w <= 3 ? 2 : w <= 7 ? 1 : 0;
    app.innerHTML =
      '<div class="card" style="text-align:center"><div class="bigstars">' +
      starStr(st) +
      "</div>" +
      /* r är alltid lika med BT.n (man MÅSTE fånga n rätt för att spelet ska ta slut, fel
         flaskor kostar bara ett nytt försök, inte en runda) - att visa "r / n" här skulle
         alltså alltid bli t.ex. "10 / 10" oavsett hur många fel man gjorde, vilket var
         förvirrande ihop med felmeningen nedan. Visar istället rätt av alla försök (r+w),
         samma typ av facit-kvot som de andra spelens bigscore (t.ex. sentEnd()). */
      '<div class="bigscore">' +
      r +
      " / " +
      (r + w) +
      '</div><p class="q">Bra fångat!</p>' +
      (w
        ? '<p class="qsub">' +
          w +
          " fel " +
          (w === 1 ? "flaska" : "flaskor") +
          " på vägen - ingen fara, du kom hela vägen!</p>"
        : "") +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<div class="row"><button class="btn green big" id="again">En gång till 🛶</button>' +
      '<button class="btn ghost big" id="home">Tillbaka</button></div></div>';
    BT = null;
    mood("cheer");
    document.getElementById("again").onclick = boatIntro;
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
  }

  /* ---------- SIIRI KÖÖK ----------
     Ett recept (KITCHEN_RECIPES, app/utils/kitchen.ts) är en kedja steg, varje steg ett eget
     verb/gest: vala (dra till skålen), sega (cirkelrörelse), loika (upprepade tryck), kupseta
     (släpp när man vill). Inget steg kan misslyckas på riktigt - gör man annorlunda (för många
     varv, för få hack, fel tillagningstid) blir resultatet bara en annan, rolig maträtt
     (recipe.miss[verb]) istället för den "perfekta" varianten, aldrig ett rött kryss. Hittade
     resultat sparas i S.cookbook, samma "samla det udda"-mönster som SECRETS. */
  var KT = null;
  function kitchenIntro() {
    screen = "kitchen";
    app.innerHTML =
      '<div class="zone play"><span class="zem">🥨</span><span><b>Siiri köök</b><span>Laga mat med Siiri</span></span></div>' +
      '<div class="card" style="text-align:center"><p class="qsub">Följ receptet steg för steg - häll, rör, hacka och grädda tillsammans med Siiri. Gör du något lite annorlunda blir det aldrig fel, bara en annan rolig maträtt!</p>' +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="start">Sätt igång 🥨</button></div>';
    document.getElementById("start").onclick = function () {
      KT = { recipe: KITCHEN_RECIPES[0], stepIdx: 0, missVerb: null };
      kitchenStep();
    };
  }
  function kitchenStep() {
    var step = KT.recipe.steps[KT.stepIdx];
    app.innerHTML =
      '<div class="zone play"><span class="zem">🥨</span><span><b>' +
      esc(KT.recipe.name.sv) +
      "</b><span>Steg " +
      (KT.stepIdx + 1) +
      " av " +
      KT.recipe.steps.length +
      "</span></span></div>" +
      '<div class="card" style="text-align:center">' +
      '<p class="q" lang="et">' +
      esc(step.et) +
      "</p>" +
      '<p class="qsub">' +
      esc(step.sv) +
      "</p>" +
      '<div class="kitstage" id="kitstage"></div>' +
      '<div id="kitcontinue"></div>' +
      "</div>";
    speak(step.et);
    if (step.verb === "vala") kitchenSetupVala(step);
    else if (step.verb === "sega") kitchenSetupSega();
    else if (step.verb === "loika") kitchenSetupLoika();
    else kitchenSetupKupseta();
  }
  function kitchenAdvance(missedThisStep) {
    if (missedThisStep && !KT.missVerb) KT.missVerb = KT.recipe.steps[KT.stepIdx].verb;
    KT.stepIdx++;
    if (KT.stepIdx >= KT.recipe.steps.length) kitchenResult();
    else kitchenStep();
  }
  /* vala: dra ingrediensen till skålen. Ingen gradering - missar man skålen får man bara
     försöka igen, det finns inget "fel" sätt att till slut få den dit. */
  function kitchenSetupVala(step) {
    var stage = document.getElementById("kitstage");
    stage.innerHTML =
      '<div class="kitbowl" id="kitbowl">🥣</div>' +
      '<div class="kiting" id="kiting">' +
      (step.ingredient ? step.ingredient.em : "🫐") +
      "</div>";
    var ing = document.getElementById("kiting"),
      bowl = document.getElementById("kitbowl"),
      dragging = false,
      startLeft = ing.offsetLeft,
      startTop = ing.offsetTop;
    ing.style.touchAction = "none";
    function reset() {
      ing.style.left = startLeft + "px";
      ing.style.top = startTop + "px";
    }
    ing.addEventListener("pointerdown", function (e) {
      dragging = true;
      ing.setPointerCapture(e.pointerId);
      ing.classList.add("kit-dragging");
    });
    ing.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var r = stage.getBoundingClientRect();
      /* ritas en bit OVANFÖR fingret, inte rakt under - annars skymmer fingret precis det man
         ska styra, särskilt kännbart på touch där man inte har en liten musmarkör att se runt. */
      ing.style.left = e.clientX - r.left - 24 + "px";
      ing.style.top = e.clientY - r.top - 56 + "px";
    });
    ing.addEventListener("pointerup", function (e) {
      if (!dragging) return;
      dragging = false;
      ing.classList.remove("kit-dragging");
      var br = bowl.getBoundingClientRect();
      var hit = e.clientX >= br.left && e.clientX <= br.right && e.clientY >= br.top && e.clientY <= br.bottom;
      if (hit) {
        bowl.classList.add("kit-pop");
        sndOk();
        setTimeout(function () {
          kitchenAdvance(false);
        }, 350);
      } else {
        reset();
      }
    });
  }
  /* sega: cirkelrörelse i skålen (sveper total vinkel runt skålens mittpunkt, oavsett
     medurs/moturs). Ett barn som tycker cirklandet är kul och fortsätter väldigt länge får en
     jättepannkaka istället för kringeldeg - den "typiska" överdriften ger ett eget roligt
     resultat, inte ett straff. */
  function kitchenSetupSega() {
    var stage = document.getElementById("kitstage");
    stage.innerHTML =
      '<div class="kitbowl kitbowl--stir" id="kitbowl">🥣<div class="kitturns" id="kitturns">0 varv</div></div>';
    var bowl = document.getElementById("kitbowl"),
      total = 0,
      lastAngle = null,
      down = false,
      MIN_TURNS = 0.4,
      MAX_TURNS = 3;
    bowl.style.touchAction = "none";
    function angleFor(e) {
      var r = bowl.getBoundingClientRect();
      return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
    }
    function showContinue() {
      var c = document.getElementById("kitcontinue");
      if (c.firstChild) return;
      c.innerHTML = '<button class="btn green big wide" id="kitdone">Klar! ✅</button>';
      document.getElementById("kitdone").onclick = function () {
        kitchenAdvance(total / (2 * Math.PI) > MAX_TURNS);
      };
    }
    bowl.addEventListener("pointerdown", function (e) {
      down = true;
      bowl.setPointerCapture(e.pointerId);
      lastAngle = angleFor(e);
    });
    bowl.addEventListener("pointermove", function (e) {
      if (!down) return;
      var a = angleFor(e),
        d = a - lastAngle;
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      total += Math.abs(d);
      lastAngle = a;
      document.getElementById("kitturns").textContent = (total / (2 * Math.PI)).toFixed(1) + " varv";
      if (total / (2 * Math.PI) >= MIN_TURNS) showContinue();
    });
    bowl.addEventListener("pointerup", function () {
      down = false;
    });
  }
  /* loika: upprepade tryck. För få hack lämnar degen som en stor klump (en egen rolig
     "sõlm"-rätt) istället för fina bitar - motsatt typ av överdrift mot sega ovan, så de två
     gesterna inte känns likadana. */
  function kitchenSetupLoika() {
    var stage = document.getElementById("kitstage");
    stage.innerHTML = '<div class="kitdough" id="kitdough">🍞<div class="kitcount" id="kitcount">0 hack</div></div>';
    var dough = document.getElementById("kitdough"),
      count = 0,
      MIN_CHOPS = 3;
    function showContinue() {
      var c = document.getElementById("kitcontinue");
      if (c.firstChild) return;
      c.innerHTML = '<button class="btn green big wide" id="kitdone">Klar! ✅</button>';
      document.getElementById("kitdone").onclick = function () {
        kitchenAdvance(count < MIN_CHOPS);
      };
    }
    dough.addEventListener("pointerdown", function () {
      count++;
      document.getElementById("kitcount").textContent = count + " hack";
      dough.classList.remove("kit-pop");
      void dough.offsetWidth;
      dough.classList.add("kit-pop");
      tone(300 + count * 20, 0.05, 0);
      showContinue();
    });
  }
  /* kupseta: släpp när man vill - ingen tidspress alls. Var man släpper avgör bara SMAKEN på
     resultatet (för tidigt/sent = en egen rolig rätt, mitten = perfekt), aldrig om man
     "hann" eller inte. */
  function kitchenSetupKupseta() {
    var stage = document.getElementById("kitstage");
    stage.innerHTML =
      '<div class="kitoven">🔥</div><div class="kitheatbar"><div class="kitheatfill" id="kitheatfill"></div></div>' +
      '<button class="btn green big wide" id="kittake" style="margin-top:12px">Ta ut! 🍽️</button>';
    var fill = document.getElementById("kitheatfill"),
      t0 = Date.now(),
      DURATION = 6000,
      raf;
    function tick() {
      var p = Math.min(1, (Date.now() - t0) / DURATION);
      fill.style.width = p * 100 + "%";
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    document.getElementById("kittake").onclick = function () {
      cancelAnimationFrame(raf);
      var p = Math.min(1, (Date.now() - t0) / DURATION);
      kitchenAdvance(!(p >= 0.35 && p <= 0.75));
    };
  }
  function kitchenResult() {
    var r = KT.recipe,
      outcome = KT.missVerb ? r.miss[KT.missVerb] || r.perfect : r.perfect,
      isNew = (S.cookbook || []).indexOf(outcome.id) === -1;
    if (isNew) {
      if (!S.cookbook) S.cookbook = [];
      S.cookbook.push(outcome.id);
    }
    var perfect = outcome === r.perfect;
    earnStars(perfect ? 30 : 16);
    addXp(perfect ? 40 : 24);
    save();
    burst(perfect ? 120 : 60);
    fanfare(perfect ? 2 : 1);
    speak(outcome.et);
    app.innerHTML =
      '<div class="card" style="text-align:center">' +
      '<div style="font-size:64px">' +
      outcome.em +
      "</div>" +
      '<p class="q" lang="et">' +
      esc(outcome.name.et) +
      "</p>" +
      '<p class="qsub">' +
      esc(outcome.name.sv) +
      "</p>" +
      '<p class="qsub" lang="et">' +
      esc(outcome.et) +
      "</p>" +
      (isNew ? '<p class="qsub" style="color:var(--moss);font-weight:700">🆕 Ny sida i kokboken!</p>' : "") +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<div class="row"><button class="btn green big" id="again">Laga igen 🥨</button>' +
      '<button class="btn ghost big" id="home">Tillbaka</button></div></div>';
    mood("cheer");
    KT = null;
    document.getElementById("again").onclick = kitchenIntro;
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
  }

  /* ---------- LAAT (marknaden) ----------
     Flyttad till en egen Nuxt-sida, se app/pages/shop.vue. shopScreen() finns kvar så att alla
     vägar hit (menyn, stjärnorna, rummet, belöningar) leder dit. */
  function shopScreen() {
    location.href = "/shop";
  }

  /* Skattkammaren är flyttad till en egen Nuxt-sida, se app/pages/trophy.vue (pilotskärmen
     för Vue-migreringen, docs/vue-conventions.md). trophyScreen() fanns här tidigare. */

  /* ---------- BLANDADE ORD (lugn runda, ingen klocka) ---------- */
  var SP = null;
  function allWords() {
    var w = [],
      i,
      j;
    for (i = 0; i < THEMES.length; i++) for (j = 0; j < THEMES[i].words.length; j++) w.push(THEMES[i].words[j]);
    w = w.concat(tripWords());
    var sc = schoolSet();
    if (sc) w = w.concat(schoolLeft()); /* skolans ord är med tills de sitter */
    return w;
  }
  /* hittar vilket tema ett ord hör till, för att kunna ge svarsalternativ från SAMMA tema i
     första hand - annars kan fel svar sticka ut för tydligt (t.ex. "karu" bland
     klossar/faster/klättra, där björn är det enda djuret och alltså uppenbart rätt utan att
     man behöver kunna ordet). Orden i THEMES bär ingen egen temareferens, så vi letar reda på
     den genom att söka igenom alla teman efter en ordträff. */
  function themeWordsFor(et) {
    var i, j;
    for (i = 0; i < THEMES.length; i++) {
      for (j = 0; j < THEMES[i].words.length; j++) {
        if (THEMES[i].words[j].et === et) return THEMES[i].words;
      }
    }
    return null;
  }
  /* poolen att slumpa svarsalternativ ur: ordets eget tema i första hand (om det finns och är
     stort nog), annars samma fallback (hela ordförrådet) som förut - t.ex. för reseord och
     läxord, som inte hör till något tema. */
  function optionPool(w, fallback) {
    var theme = themeWordsFor(w.et);
    return theme && theme.length >= 4 ? theme : fallback;
  }

  /* ============ FRÅGA SIIRI ============ */
  /* Ingen AI-motor - bara mönster-matchning mot sånt appen redan vet: ett litet FAQ om Siiri
     själv (SIIRI_FAQ) och en ordboksslagning mot allWords() (lookupWord) åt båda hållen
     (svenska → estniska och tvärtom), med samma lösa jämförelse (loose/lev) som redan används
     för röstsvar i saidIt(). Känner appen inte igen frågan säger Siiri det, istället för att
     gissa eller hitta på. */
  var ASK_STOP = [
    "vad",
    "heter",
    "betyder",
    "hur",
    "säger",
    "man",
    "sa",
    "du",
    "är",
    "det",
    "den",
    "en",
    "ett",
    "på",
    "estniska",
    "engelska",
    "svenska",
    "jag",
    "vill",
    "veta",
    "kan",
    "skriv",
    "säg",
    "mig",
    "om",
    "som",
    "och",
    "the",
    "what",
    "does",
    "mean",
    "in",
    "is",
    "a",
    "your",
    "name",
  ];
  function askTokens(text) {
    return norm(text)
      .replace(/\?/g, "")
      .split(" ")
      .filter(function (w) {
        return w.length > 1 && ASK_STOP.indexOf(w) < 0;
      });
  }
  function lookupWord(raw) {
    var toks = askTokens(raw);
    if (!toks.length) return null;
    var candidates = toks.concat([toks.join(" ")]),
      words = allWords(),
      i,
      j,
      w,
      nc;
    for (j = 0; j < candidates.length; j++) {
      nc = loose(candidates[j]);
      for (i = 0; i < words.length; i++) {
        if (loose(words[i].sv) === nc) return { word: words[i], dir: "sv2et" };
      }
    }
    for (j = 0; j < candidates.length; j++) {
      nc = loose(candidates[j]);
      for (i = 0; i < words.length; i++) {
        if (loose(words[i].et) === nc) return { word: words[i], dir: "et2sv" };
      }
    }
    var best = null,
      bestD = Infinity,
      bestDir = null;
    for (j = 0; j < candidates.length; j++) {
      nc = loose(candidates[j]);
      /* bara längre ord (5+) får vara "ungefär rätt" - annars matchar nästan vilket kort,
         obesläktat ord som helst av misstag (t.ex. svenska "saga" mot estniska "siga") */
      if (nc.length < 5) continue;
      for (i = 0; i < words.length; i++) {
        w = words[i];
        var sv = loose(w.sv),
          et = loose(w.et);
        var dsv = lev(sv, nc),
          tolSv = Math.max(1, Math.floor(sv.length / 4));
        if (dsv <= tolSv && dsv < bestD) {
          bestD = dsv;
          best = w;
          bestDir = "sv2et";
        }
        var det = lev(et, nc),
          tolEt = Math.max(1, Math.floor(et.length / 4));
        if (det <= tolEt && det < bestD) {
          bestD = det;
          best = w;
          bestDir = "et2sv";
        }
      }
    }
    return best ? { word: best, dir: bestDir } : null;
  }
  /* litet FAQ om Siiri själv - nyckelorden matchas som delsträngar i den normaliserade frågan.
     Några svar återanvänder det appen redan vet om barnet (S.name, S.favColor). */
  var SIIRI_FAQ = [
    {
      k: ["heter du", "vem är du", "ditt namn"],
      get: function () {
        return { et: "Minu nimi on Siiri!", sv: "Jag heter Siiri!", em: "🦔" };
      },
    },
    {
      k: ["mår du", "känner du dig"],
      get: function () {
        return { et: "Mul on väga hästi!", sv: "Jag mår jättebra!", em: "😊" };
      },
    },
    {
      k: ["bor du", "var du bor"],
      get: function () {
        return { et: "Ma elan sinu toas!", sv: "Jag bor i ditt rum!", em: "🏠" };
      },
    },
    {
      k: ["gammal är du", "din ålder", "hur gammal"],
      get: function () {
        return { et: "Siilid ei loe aastaid!", sv: "Igelkottar räknar inte år!", em: "🎂" };
      },
    },
    {
      k: ["favoritfärg", "favorit färg"],
      get: function () {
        return S.favColor
          ? { et: "Mulle meeldib see värv!", sv: "Din favoritfärg " + S.favColor + " är fin!", em: "🎨" }
          : { et: "Mis on sinu lemmikvärv?", sv: "Vad är din favoritfärg? Jag vet inte än!", em: "🎨" };
      },
    },
    {
      k: ["heter jag", "mitt namn"],
      get: function () {
        return S.name
          ? { et: "Sinu nimi on " + S.name + "!", sv: "Du heter " + S.name + "!", em: "👋" }
          : { et: "Ma ei tea veel su nime!", sv: "Jag vet inte ditt namn än!", em: "🤔" };
      },
    },
    {
      k: ["tack", "tackar"],
      get: function () {
        return { et: "Pole tänu väärt!", sv: "Ingen orsak!", em: "💛" };
      },
    },
    {
      k: ["älskar dig", "gillar dig", "tycker om dig"],
      get: function () {
        return { et: "Mina armastan ka sind!", sv: "Jag tycker också om dig!", em: "💛" };
      },
    },
    {
      k: ["leka", "spela", "vill du leka"],
      get: function () {
        return { et: "Jah, mängime!", sv: "Ja, vi leker!", em: "🎉" };
      },
    },
  ];
  function askSiiriAnswer(text) {
    var n = norm(text),
      i,
      j;
    for (i = 0; i < SIIRI_FAQ.length; i++) {
      for (j = 0; j < SIIRI_FAQ[i].k.length; j++) {
        if (n.indexOf(SIIRI_FAQ[i].k[j]) >= 0) return SIIRI_FAQ[i].get();
      }
    }
    var hit = lookupWord(text);
    if (hit) return { et: hit.word.et, sv: hit.word.sv, em: hit.word.em };
    return {
      et: "Ma ei saa veel aru!",
      sv: 'Jag förstår inte riktigt - men fråga mig t.ex. "vad betyder hund" så vet jag!',
      em: "🤔",
    };
  }
  var ASK_LOG = [];
  function askScreen() {
    screen = "ask";
    ASK_LOG = [{ who: "siiri", et: "Tere! Küsi minult midagi!", sv: "Hej! Fråga mig vad som helst!", em: "🦔" }];
    renderAsk();
  }
  function askLogHtml() {
    var h = "",
      i,
      row;
    for (i = 0; i < ASK_LOG.length; i++) {
      row = ASK_LOG[i];
      if (row.who === "me") h += '<div class="askrow me"><span>' + esc(row.text) + "</span></div>";
      else
        h +=
          '<div class="askrow siiri"><span class="askem">' +
          (row.em || "🦔") +
          '</span><div class="askbub"><b lang="et">' +
          esc(row.et) +
          "</b><small>" +
          esc(row.sv) +
          "</small></div></div>";
    }
    return h;
  }
  function renderAsk() {
    var html =
      '<div class="zone"><span>💬 <b>Fråga Siiri</b></span><span>Skriv eller tala - hon svarar om ord hon känner till</span></div>' +
      '<div class="card"><div class="asklog" id="asklog">' +
      askLogHtml() +
      "</div>" +
      '<div class="askinput-row">' +
      '<label class="sr-only" for="askinp">Din fråga</label>' +
      '<input class="type" id="askinp" maxlength="60" autocomplete="off" placeholder="t.ex. vad betyder hund?">' +
      (micOK ? '<button class="mic askmic" id="askmic" aria-label="Fråga med rösten">🎤</button>' : "") +
      "</div>" +
      '<button class="btn green big wide" id="askgo" style="margin-top:8px">Fråga →</button></div>';
    app.innerHTML = html;
    var log = document.getElementById("asklog");
    log.scrollTop = log.scrollHeight;
    document.getElementById("askgo").onclick = function () {
      submitAsk();
    };
    document.getElementById("askinp").addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        submitAsk();
      }
    });
    var mic = document.getElementById("askmic");
    if (mic)
      mic.onclick = function () {
        mic.classList.add("listening");
        listen(
          function (alts) {
            mic.classList.remove("listening");
            submitAsk(alts[0]);
          },
          function () {
            mic.classList.remove("listening");
          },
          function (err) {
            mic.classList.remove("listening");
            var hd = document.getElementById("askinp");
            hd.placeholder = micProblem(err);
          },
        );
      };
  }
  function submitAsk(spokenText) {
    var inp = document.getElementById("askinp"),
      text = (spokenText || inp.value || "").trim();
    if (!text) return;
    inp.value = "";
    ASK_LOG.push({ who: "me", text: text });
    var reply = askSiiriAnswer(text);
    ASK_LOG.push({ who: "siiri", et: reply.et, sv: reply.sv, em: reply.em });
    renderAsk();
    speak(reply.et);
    mood("cheer");
  }

  function speedIntro() {
    screen = "mix";
    prefetchAllThemes();
    var html =
      '<div class="card" style="text-align:center"><div style="font-size:64px">🎲</div>' +
      '<p class="q">Blandade ord</p>' +
      '<p class="qsub">Tolv ord från alla teman, i din egen takt. Ingen klocka – ta all tid du behöver.<br>' +
      "Tre rätt i rad ger dubbla poäng, fem i rad ger tredubbla.</p>" +
      (S.mixbest ? '<p class="qsub">Ditt bästa hittills: <b>' + S.mixbest + " av 12</b></p>" : "") +
      '<div class="center">' +
      siilSVG("small") +
      "</div>" +
      '<button class="btn green big wide" id="start">Sätt igång 🎲</button></div>';
    app.innerHTML = html;
    document.getElementById("start").onclick = function () {
      speedStart();
    };
  }
  function speedStart() {
    SP = { score: 0, combo: 0, best: 0, n: 12, i: 0, pool: pickWeighted(allWords(), 16), results: [] };
    speedRound();
  }
  function speedRound() {
    if (!SP) return;
    if (SP.i >= SP.n) {
      speedEnd();
      return;
    }
    if (SP.i >= SP.pool.length) SP.pool = SP.pool.concat(pickWeighted(allWords(), 16));
    var w = SP.pool[SP.i],
      all = optionPool(w, allWords()),
      opts = [],
      i,
      tries = 0;
    while (opts.length < diff().opts - 1 && tries < 160) {
      var c = all[(Math.random() * all.length) | 0];
      tries++;
      if (c.et === w.et || c.sv === w.sv) continue;
      var dup = false;
      for (i = 0; i < opts.length; i++) if (opts[i].et === c.et || opts[i].sv === c.sv) dup = true;
      if (!dup) opts.push(c);
    }
    opts = shuffle(opts.concat([w]));
    var listen = SP.i % 3 === 2;
    var mult = SP.combo >= 5 ? 3 : SP.combo >= 3 ? 2 : 1;
    var html = '<div class="progressdots">';
    for (i = 0; i < SP.n; i++) {
      var c2 = "dot";
      if (i < SP.results.length) {
        c2 += SP.results[i] ? " ok" : " no";
      } else if (i === SP.i) {
        c2 += " now";
      }
      html += '<span class="' + c2 + '"></span>';
    }
    html +=
      '</div><div class="card">' +
      '<div style="display:flex;justify-content:space-between;font-weight:600;font-size:15.5px;color:var(--muted)">' +
      "<span>⭐ " +
      SP.score +
      " poäng</span><span>" +
      (SP.combo >= 3 ? "🔥 dubbla poäng · " : "") +
      "ord " +
      (SP.i + 1) +
      " av " +
      SP.n +
      "</span></div>";
    if (listen) {
      html +=
        '<p class="q" style="margin-top:8px">Vilket ord hör du?</p>' +
        '<div class="center"><button class="speakbtn" id="say" aria-label="Hör ordet">🔊</button>' +
        '<button class="speakbtn sm" id="slow" aria-label="Hör ordet långsamt">🐢</button></div>';
    } else {
      html += promptHtml(w, w.sv);
    }
    html +=
      '<div class="streakline">' + (SP.combo > 1 ? SP.combo + " rätt i rad!" : "&nbsp;") + '</div><div class="opts">';
    for (i = 0; i < opts.length; i++) {
      html +=
        '<button class="opt" data-et="' + esc(opts[i].et) + '">' + esc(opts[i].et) + (listen ? "" : "") + "</button>";
    }
    html += '</div><div class="feedback" id="fb"></div></div><div class="center">' + siilSVG("small") + "</div>";
    app.innerHTML = html;
    if (listen) {
      speak(w.et);
      document.getElementById("say").onclick = function () {
        speak(w.et);
      };
      document.getElementById("slow").onclick = function () {
        speak(w.et, true);
      };
    }
    var btns = app.querySelectorAll(".opt");
    for (i = 0; i < btns.length; i++) {
      (function (el) {
        el.onclick = function () {
          if (!SP) return;
          var ok = el.getAttribute("data-et") === w.et,
            j;
          for (j = 0; j < btns.length; j++) {
            btns[j].disabled = true;
            if (btns[j].getAttribute("data-et") === w.et) btns[j].classList.add("right");
          }
          if (!ok) el.classList.add("wrong");
          SP.results[SP.i] = ok;
          SP.i++;
          wmemHit(w.et, ok, undefined, w.sv);
          var fb = document.getElementById("fb");
          if (ok) {
            SP.combo++;
            if (SP.combo > SP.best) SP.best = SP.combo;
            if (SP.combo > (S.bestcombo || 0)) {
              S.bestcombo = SP.combo;
              save();
            }
            var m = SP.combo >= 5 ? 3 : SP.combo >= 3 ? 2 : 1;
            SP.score += m;
            S.correct++;
            earnStars(m);
            bumpQuest("correct", 1);
            if (listen) tripBump("hear", 1);
            addXp(Math.round(8 * m * diff().mult));
            sndOk();
            burst(30 + 16 * m);
            mood("cheer");
            if (SP.combo === 3 || SP.combo === 5) comboFlash(SP.combo);
            if (SP.combo >= 10) comboTen();
            fb.className = "feedback ok";
            fb.textContent = "Rätt! ⭐";
          } else {
            SP.combo = 0;
            sndNo();
            mood("oops");
            speak(w.et);
            fb.className = "feedback no";
            fb.textContent = w.sv + " heter " + w.et;
          }
          setTimeout(
            function () {
              if (SP) speedRound();
            },
            ok ? 1000 : 2100,
          );
        };
      })(btns[i]);
    }
  }
  function speedEnd() {
    var right = 0,
      i;
    for (i = 0; i < SP.results.length; i++) {
      if (SP.results[i]) right++;
    }
    var sc = SP.score,
      bc = SP.best,
      n = SP.n;
    var rec = right > (S.mixbest || 0);
    if (rec) S.mixbest = right;
    bumpQuest("mixed", 1);
    tripBump("mix", 1);
    addXp(right * 2);
    save();
    var newB = checkBadges();
    SP = null;
    burst(right >= n * 0.8 ? 180 : 110);
    var st = right >= n * 0.95 ? 3 : right >= n * 0.7 ? 2 : right >= n * 0.4 ? 1 : 0;
    var html =
      '<div class="card" style="text-align:center"><div class="bigstars">' +
      starStr(st) +
      "</div>" +
      '<div class="bigscore">' +
      right +
      " / " +
      n +
      "</div>" +
      '<p class="q">' +
      (rec
        ? "Ditt bästa hittills" + (S.name ? ", " + esc(S.name) : "") + "!"
        : st >= 2
          ? "Fint jobbat!"
          : "Bra kämpat!") +
      "</p>" +
      '<p class="qsub">Bästa kombo: ' +
      bc +
      " i rad · " +
      sc +
      " poäng samlade</p>" +
      '<div class="center">' +
      siilSVG("small") +
      "</div>";
    if (newB.length) {
      html += '<div style="margin-top:8px">';
      for (i = 0; i < newB.length; i++) {
        html += '<span class="badge">' + newB[i].em + " " + esc(newB[i].sv) + "</span>";
      }
      html += "</div>";
    }
    html +=
      '<div class="row"><button class="btn green big" id="again">En runda till 🎲</button>' +
      '<button class="btn ghost big" id="home">Tillbaka</button></div></div>';
    app.innerHTML = html;
    mood("cheer");
    document.getElementById("again").onclick = function () {
      speedIntro();
    };
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
    refreshTop();
  }

  /* ---------- ORDLISTA ---------- */
  function wordRow(w) {
    return (
      '<div class="wordrow"><span class="em">' +
      wIcon(w) +
      '</span><span class="t"><b>' +
      esc(w.et) +
      "</b>" +
      "<span>" +
      esc(w.sv) +
      " · uttal: " +
      esc(w.hint || "") +
      "</span></span>" +
      '<button class="speakbtn sm" data-say="' +
      esc(w.et) +
      '" aria-label="Hör ordet">🔊</button>' +
      '<button class="speakbtn sm" data-slow="' +
      esc(w.et) +
      '" aria-label="Hör ordet långsamt">🐢</button></div>'
    );
  }
  function listScreen() {
    screen = "list";
    setNav("words");
    prefetch("trip");
    prefetchAllThemes();
    if (S.listOpen === undefined) S.listOpen = "";
    var q = (S.listQ || "").trim().toLowerCase();
    var html =
      '<div class="zone words"><span class="zem">📖</span><span><b>Sõnastik</b>' +
      "<span>Ordlistan — 🔊 hör ordet, 🐢 hör det långsamt</span></span></div>" +
      '<div class="searchbar"><span>🔎</span>' +
      '<input id="wq" type="search" placeholder="Sök på svenska eller estniska" value="' +
      esc(S.listQ || "") +
      '" autocomplete="off">' +
      (q ? '<button class="btn small ghost" id="wqclear">Rensa</button>' : "") +
      "</div>";

    if (q) {
      /* sökläge: alla träffar i en lista */
      var hits = [],
        seen = {},
        all = allWords(),
        i;
      for (i = 0; i < all.length; i++) {
        var w = all[i];
        if (seen[w.et]) continue;
        if (w.et.toLowerCase().indexOf(q) >= 0 || w.sv.toLowerCase().indexOf(q) >= 0) {
          seen[w.et] = 1;
          hits.push(w);
        }
      }
      html += '<div class="card"><div class="listhead">' + hits.length + " träffar</div>";
      if (!hits.length) html += '<p class="qsub">Inget ord matchar. Prova en annan del av ordet.</p>';
      for (i = 0; i < hits.length && i < 80; i++) html += wordRow(hits[i]);
      if (hits.length > 80)
        html += '<p class="qsub">… och ' + (hits.length - 80) + " till. Skriv mer för att hitta rätt.</p>";
      html += "</div>";
    } else {
      var tw = tripWords();
      if (tw.length) {
        var openTrip = S.listOpen === "trip";
        html +=
          '<div class="card"><button class="listhead btn-plain" data-open="trip">' +
          "<span>🗺️ " +
          esc(UI.trip.et) +
          " <small>ord från resan · " +
          tw.length +
          "</small></span>" +
          '<span class="caret">' +
          (openTrip ? "▾" : "▸") +
          "</span></button>";
        if (openTrip) for (var q2 = 0; q2 < tw.length; q2++) html += wordRow(tw[q2]);
        html += "</div>";
      }
      for (var i2 = 0; i2 < THEMES.length; i2++) {
        var t = THEMES[i2],
          mm = themeMastery(t),
          op = S.listOpen === t.id;
        html +=
          '<div class="card"><button class="listhead btn-plain" data-open="' +
          t.id +
          '">' +
          "<span>" +
          t.em +
          " " +
          esc(t.et) +
          (mm.medal ? " " + masteryEm(mm.medal) : "") +
          " <small>" +
          esc(t.sv) +
          " · " +
          mm.strong +
          "/" +
          mm.total +
          " sitter</small></span>" +
          '<span class="caret">' +
          (op ? "▾" : "▸") +
          "</span></button>";
        if (op) for (var j = 0; j < t.words.length; j++) html += wordRow(t.words[j]);
        html += "</div>";
      }
    }
    app.innerHTML = html;
    var inp = document.getElementById("wq");
    if (inp) {
      inp.oninput = function () {
        S.listQ = inp.value;
        save();
        var pos = inp.selectionStart;
        listScreen();
        var el = document.getElementById("wq");
        if (el) {
          el.focus();
          try {
            el.setSelectionRange(pos, pos);
          } catch (e) {}
        }
      };
    }
    var cl = document.getElementById("wqclear");
    if (cl)
      cl.onclick = function () {
        S.listQ = "";
        save();
        listScreen();
      };
    var ob = app.querySelectorAll("[data-open]"),
      oi;
    for (oi = 0; oi < ob.length; oi++) {
      (function (el) {
        el.onclick = function () {
          var id = el.getAttribute("data-open");
          S.listOpen = S.listOpen === id ? "" : id;
          save();
          listScreen();
        };
      })(ob[oi]);
    }
    var b = app.querySelectorAll("[data-say]");
    for (var k = 0; k < b.length; k++) {
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-say"));
        };
      })(b[k]);
    }
    var sl = app.querySelectorAll("[data-slow]");
    for (var n = 0; n < sl.length; n++) {
      (function (el) {
        el.onclick = function () {
          speak(el.getAttribute("data-slow"), true);
        };
      })(sl[n]);
    }
  }

  /* ---------- LEKTION ---------- */
  var L = null;
  /* övning med bara läxorden: körs som ett vanligt tema. Ord som redan sitter är med
       som repetition och svarsalternativ, men de nya och vacklande lärs in först. */
  function schoolLessonStart() {
    var s = schoolSet();
    if (!s) {
      schoolImport();
      return;
    }
    var known = s.words.filter(function (w) {
      return schoolKnows(w);
    });
    lessonStart("school", {
      id: "school",
      school: true,
      et: "Koolisõnad",
      sv: s.name || "Veckans ord",
      em: "📝",
      words: schoolLeft().concat(known),
    });
  }
  function lessonStart(themeId, theme) {
    var t = theme || null,
      i;
    if (!t) {
      prefetchTheme(themeId);
      for (i = 0; i < THEMES.length; i++) {
        if (THEMES[i].id === themeId) t = THEMES[i];
      }
    }
    if (!t) {
      homeScreen();
      return;
    }
    /* visa bara de ord som behöver mötas: nya och sådana som vacklar */
    /* högst fem nya ord åt gången – arbetsminnet rymmer inte fler */
    var pool = stepWords(t),
      fresh = [],
      shaky = [],
      i2,
      mm2;
    for (i2 = 0; i2 < pool.length; i2++) {
      mm2 = (S.wordmem || {})[mkey(pool[i2].et, pool[i2].sv)];
      if (!mm2 || (mm2.r || 0) === 0) fresh.push(pool[i2]);
      else if ((mm2.s || 0) < 2 || wmemDue(pool[i2].et, pool[i2].sv) >= 0) shaky.push(pool[i2]);
    }
    /* vacklar flera ord redan? då får färre nya in denna gång, så repetitionen får plats */
    var dueShaky = shaky.filter(function (w) {
      return wmemDue(w.et, w.sv) >= 0;
    }).length;
    var freshBudget = Math.max(2, 5 - Math.min(3, dueShaky));
    var need = fresh.slice(0, freshBudget);
    if (!need.length) need = shaky.slice(0, 3);
    if (!need.length) need = t.words.slice(0, 3);
    L = { theme: t, phase: "learn", learnIdx: 0, learnList: need, rounds: [], idx: 0, results: [], right: 0 };
    learnCard();
  }
  /* pekar ut ett ord barnet redan nämnt i ett samtal (S.favFood/S.favColor, se chats.ts) när
     det dyker upp i rätt tema - en liten "jag minns dig"-stund, inte bara i chatten. */
  function personalNote(t, w) {
    var sv = (w.sv || "").trim().toLowerCase();
    if (t.id === "toit" && S.favFood && S.favFood.trim().toLowerCase() === sv)
      return "Du sa att du gillar " + w.sv + "!";
    if (t.id === "varvid" && S.favColor && S.favColor.trim().toLowerCase() === sv) return "Det är din favoritfärg!";
    return "";
  }
  function learnCard() {
    screen = "learn";
    var t = L.theme,
      list = L.learnList || t.words,
      w = list[L.learnIdx],
      pn = personalNote(t, w);
    var html =
      '<div class="qsub">Lär dig först · ' +
      (L.learnIdx + 1) +
      " av " +
      list.length +
      (list.length < t.words.length ? ' <span style="color:var(--moss)">(bara orden som behöver övas)</span>' : "") +
      "</div>" +
      '<div class="card">' +
      promptHtml(w, w.et, "et") +
      '<div class="trans">' +
      esc(w.sv) +
      "</div>" +
      (pn ? '<div class="center" style="margin-top:4px"><span class="badge">✨ ' + esc(pn) + "</span></div>" : "") +
      '<div class="hint">säg så här: ' +
      esc(w.hint) +
      "</div>" +
      '<div class="center"><button class="speakbtn" id="say" aria-label="Hör ordet igen">🔊</button>' +
      '<button class="speakbtn sm" id="slow" aria-label="Hör ordet långsamt">🐢</button></div>' +
      '<button class="btn wide big" id="next">' +
      (L.learnIdx < list.length - 1 ? "Nästa ord →" : "Nu kör vi! 🎈") +
      "</button>" +
      (list.length > 2
        ? '<button class="btn ghost wide" id="skiplearn" style="margin-top:8px">⏩ Hoppa till frågorna</button>'
        : "") +
      "</div>" +
      '<div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    speak(w.et);
    document.getElementById("say").onclick = function () {
      speak(w.et);
    };
    document.getElementById("slow").onclick = function () {
      speak(w.et, true);
    };
    var sk = document.getElementById("skiplearn");
    if (sk)
      sk.onclick = function () {
        L.phase = "play";
        buildRounds();
        nextRound();
      };
    document.getElementById("next").onclick = function () {
      var list = L.learnList || L.theme.words;
      if (L.learnIdx < list.length - 1) {
        L.learnIdx++;
        learnCard();
      } else {
        buildRounds();
        nextRound();
      }
    };
  }
  /* lägger frågorna i en båge: lugn start, svårast i mitten, lätt vinst sist */
  function dramaOrder(rounds) {
    if (!rounds || rounds.length < 5) return shuffle(rounds);
    var r = shuffle(rounds.slice());
    function hardness(x) {
      var h = 0,
        m = x.w ? (S.wordmem || {})[mkey(x.w.et, x.w.sv)] || null : null;
      if (m) h += Math.max(0, 3 - (m.s || 0)) + Math.min(3, m.m || 0) * 0.8;
      else h += 2.2; /* osett ord är ganska svårt */
      if (x.type === "type") h += 2.2; /* skriva är svårast */
      else if (x.type === "speak") h += 1.2;
      else if (x.type === "listen") h += 0.8;
      return h;
    }
    r.sort(function (a, b) {
      return hardness(a) - hardness(b);
    });
    var n = r.length,
      out = new Array(n),
      i;
    /* bygg bågen: 0,1 lätta → mitten svår → sista lätt */
    var easy = r.slice(0, Math.ceil(n * 0.4)); /* lättaste 40 % */
    var hard = r.slice(Math.ceil(n * 0.4)); /* resten */
    out[0] = easy.shift();
    out[1] = easy.shift() || hard.pop();
    out[n - 1] = easy.pop() || hard.pop(); /* en lätt vinst sist */
    var mid = [],
      k;
    while (hard.length) mid.push(hard.shift());
    while (easy.length) mid.push(easy.shift());
    /* svåraste mot mitten: varva in från båda håll */
    mid.sort(function (a, b) {
      return hardness(b) - hardness(a);
    });
    var free = [];
    for (i = 2; i <= n - 2; i++) free.push(i);
    /* mitten först, sedan utåt */
    free.sort(function (a, b) {
      return Math.abs(a - (n - 1) / 2) - Math.abs(b - (n - 1) / 2);
    });
    for (k = 0; k < free.length; k++) out[free[k]] = mid[k];
    for (i = 0; i < n; i++) if (!out[i]) out[i] = mid[mid.length - 1];
    return out.filter(function (x) {
      return !!x;
    });
  }
  function markGolden(list) {
    var i,
      n = Math.max(1, Math.round(list.length / 12));
    var idx = shuffle(
      list.map(function (_, k) {
        return k;
      }),
    ).slice(0, n);
    for (i = 0; i < idx.length; i++) list[idx[i]].gold = true;
    return list;
  }
  /* dramaturgin ordnar frågorna efter svårighet, men ett enskilt ord ska ändå
       alltid mötas i ordningen höra → välja → säga → skriva. Här byts typerna
       plats inom ordet, utan att rubba bågen lätt → svår → lätt. */
  function fixWordPath(r) {
    var rank = { listen: 0, choose: 1, speak: 2, type: 3 },
      byW = {},
      i,
      k;
    for (i = 0; i < r.length; i++) {
      k = r[i].w && r[i].w.et;
      if (!k) continue;
      if (!byW[k]) byW[k] = [];
      byW[k].push(i);
    }
    for (k in byW) {
      var idx = byW[k];
      if (idx.length < 2) continue;
      var ts = [];
      for (i = 0; i < idx.length; i++) ts.push(r[idx[i]].type);
      ts.sort(function (a, b) {
        return (rank[a] || 0) - (rank[b] || 0);
      });
      for (i = 0; i < idx.length; i++) r[idx[i]].type = ts[i];
    }
    return r;
  }
  /* teman som är indelade i steg (färgerna) släpper fram nästa steg först när
       det föregående sitter. Barnet lär sig grundfärgerna innan helesinine dyker upp. */
  function stepReached(t) {
    var step = 1,
      s,
      i,
      all,
      m;
    for (step = 1; step < 3; step++) {
      all = true;
      for (i = 0; i < t.words.length; i++) {
        if ((t.words[i].step || 1) !== step) continue;
        m = (S.wordmem || {})[mkey(t.words[i].et, t.words[i].sv)];
        if (!m || (m.s || 0) < 1 || (m.r || 0) < 2) {
          all = false;
          break;
        }
      }
      if (!all) return step;
    }
    return 3;
  }
  function hasSteps(t) {
    var i;
    for (i = 0; i < t.words.length; i++) {
      if (t.words[i].step) return true;
    }
    return false;
  }
  function stepWords(t) {
    if (!hasSteps(t)) return t.words;
    var max = stepReached(t),
      out = [],
      i;
    for (i = 0; i < t.words.length; i++) {
      if ((t.words[i].step || 1) <= max) out.push(t.words[i]);
    }
    return out.length ? out : t.words;
  }
  function buildRounds() {
    /* passet: orden som just lärts in + repetition som fallit due, 10–12 frågor */
    var learned = (L.learnList || []).slice(),
      rest = [],
      i0,
      mm0;
    var tw = stepWords(L.theme);
    for (i0 = 0; i0 < tw.length; i0++) {
      var w0 = tw[i0],
        isNew = false,
        k0;
      for (k0 = 0; k0 < learned.length; k0++) if (learned[k0].et === w0.et) isNew = true;
      if (isNew) continue;
      mm0 = (S.wordmem || {})[mkey(w0.et, w0.sv)];
      if (mm0 && (mm0.r || 0) > 0) rest.push(w0);
    }
    /* väv in läxord som redan mötts minst en gång, så de repeteras i vanliga teman också -
       helt nya läxord introduceras bara av läxkortet, aldrig kallt mitt i ett pass */
    if (!L.theme.school) {
      var swords = schoolReadyWords(),
        si1,
        dup1,
        ki1;
      for (si1 = 0; si1 < swords.length; si1++) {
        dup1 = false;
        for (ki1 = 0; ki1 < tw.length; ki1++) if (tw[ki1].et === swords[si1].et) dup1 = true;
        if (!dup1) rest.push(swords[si1]);
      }
    }
    rest = pickWeighted(rest, rest.length);
    /* ord som blev fel en tidigare dag går före allt annat */
    if (S.redo) {
      var rd = [],
        rk,
        zi;
      for (zi = rest.length - 1; zi >= 0; zi--) {
        rk = rest[zi].et;
        if (S.redo[rk] !== undefined && S.redo[rk] < today0()) {
          rd.push(rest[zi]);
          rest.splice(zi, 1);
        }
      }
      rest = rd.concat(rest);
    }
    /* fem nya ord ×2 fyllde hela passet, så repetitionen trängdes ut helt.
           Nu reserveras alltid plats för gamla ord som fallit due. */
    var newQ = learned.length * 2;
    var want = Math.min(12, Math.max(10, newQ + Math.min(5, rest.length)));
    var ws = learned.concat(learned); /* varje nytt ord möts två gånger */
    for (i0 = 0; ws.length < want && i0 < rest.length; i0++) ws.push(rest[i0]);
    if (ws.length < 8) ws = pickWeighted(tw, Math.min(10, tw.length));
    ws = shuffle(ws);
    var r = [],
      i,
      types = diff().types.slice();
    if (!micOK || micBlocked) {
      for (i = 0; i < types.length; i++) {
        if (types[i] === "speak") types[i] = "listen";
      }
    }
    /* varje ord går samma väg: höra → välja → säga → skriva.
           Ett ord ska aldrig behöva skrivas innan det hörts ett par gånger. */
    var seenW = {};
    for (i = 0; i < ws.length; i++) {
      var wq = ws[i],
        mq = (S.wordmem || {})[mkey(wq.et, wq.sv)] || {},
        rq = mq.r || 0,
        t;
      seenW[wq.et] = (seenW[wq.et] || 0) + 1;
      if (rq === 0 && seenW[wq.et] === 1) t = "listen"; /* första mötet: hör ordet */
      else if (rq === 0 && seenW[wq.et] === 2) t = "choose"; /* andra: känn igen det */
      else if (rq < 2) t = "choose"; /* fortfarande färskt */
      else t = types[i % types.length];
      if (t === "speak" && (!micOK || micBlocked)) t = "listen";
      r.push({ type: t, w: wq });
    }
    /* skrivfrågor dök nästan aldrig upp: bara ord med r>=2 kan få dem, och
           typen lottades 1 på 4. Uppdraget "Skriv ord rätt" gick därför inte att klara.
           Nu får varje pass minst en skrivfråga så fort något ord är moget för det. */
    if (diff().types.indexOf("type") >= 0) {
      var hasType = 0,
        eligible = [],
        rq2;
      for (i = 0; i < r.length; i++) {
        if (r[i].type === "type") hasType++;
        rq2 = ((S.wordmem || {})[mkey(r[i].w.et, r[i].w.sv)] || {}).r || 0;
        if (rq2 >= 2) eligible.push(i);
      }
      var wantType = Math.min(eligible.length, hasType ? 2 : 1);
      for (i = eligible.length - 1; i >= 0 && hasType < wantType; i--) {
        if (r[eligible[i]].type !== "type") {
          r[eligible[i]].type = "type";
          hasType++;
        }
      }
    }
    L.rounds = fixWordPath(markGolden(dramaOrder(r)));
    L.idx = 0;
    L.results = [];
    L.right = 0;
    L.combo = 0;
    L.bestCombo = 0;
  }
  /* serien ligger i ett litet chip på prickraden – den ska inte konkurrera med ordet */
  function meterHtml() {
    return "";
  }
  function dots() {
    var s = '<div class="progressdots">',
      i;
    for (i = 0; i < L.rounds.length; i++) {
      var c = "dot",
        res = L.results[i];
      if (i < L.results.length) {
        c += res === "skip" ? " skip" : res ? " ok" : " no";
      } else if (i === L.idx) {
        c += " now";
      }
      s += '<span class="' + c + '"></span>';
    }
    s += "</div>";
    var cc = L.combo || 0,
      mult = cc >= 5 ? 3 : cc >= 3 ? 2 : 1;
    var chip = cc > 1 ? '<span class="fchip">🔥 ' + cc + (mult > 1 ? " · ×" + mult : "") + "</span>" : "";
    return '<div class="dotrow">' + s + chip + "</div>";
  }
  /* säsongens löv och snö är fina på startsidan, men de drar blicken i en övning */
  function calmFx() {
    try {
      if (!parts || !parts.length) return;
      for (var i = parts.length - 1; i >= 0; i--) {
        if (parts[i].snow) parts.splice(i, 1);
      }
      if (ctx) ctx.clearRect(0, 0, innerWidth, innerHeight);
    } catch (e) {}
  }
  function nextRound() {
    calmFx();
    if (L.idx >= L.rounds.length) {
      resultScreen();
      return;
    }
    var r = L.rounds[L.idx];
    if (r.type === "listen") roundListen(r);
    else if (r.type === "choose") roundChoose(r);
    else if (r.type === "type") roundType(r);
    else roundSpeak(r);
  }
  function distractors(w, n) {
    var tw2 = stepWords(L.theme);
    /* läxlistan kan vara kort – fyll på med andra ord så att det finns något att välja mellan */
    if (L.theme.school && tw2.length < n + 1)
      tw2 = tw2.concat(shuffle(allWords().filter(hasPic)).slice(0, n + 1 - tw2.length));
    n = Math.max(2, Math.min(n, tw2.length - 1));
    var pool = [],
      i;
    for (i = 0; i < tw2.length; i++) {
      if (tw2[i].et !== w.et) pool.push(tw2[i]);
    }
    pool = shuffle(pool).slice(0, n);
    return shuffle(pool.concat([w]));
  }
  function struggling() {
    return L && (L.missRun || 0) >= 3;
  }
  /* sitter ordet? då behövs inte svenskan längre – bilden räcker (scaffold fading) */
  function wordSolid(w) {
    var m = w && (S.wordmem || {})[mkey(w.et, w.sv)];
    return !!(m && (m.s || 0) >= 2 && (m.r || 0) >= 3 && (m.m || 0) === 0);
  }
  /* svensk undertext, eller en diskret plats där den brukade stå */
  function transHtml(w, size) {
    /* utan bild är svenskan det enda som visar vilket ord som menas */
    if (wordSolid(w) && hasPic(w)) return '<div class="trans faded">utan svenska nu · du kan det här</div>';
    return '<div class="trans" style="font-size:' + size + 'px">' + esc(w.sv) + "</div>";
  }
  /* ledordet och bilden sida vid sida: bilden hjälper till, men ordet är det man läser.
       Utan säker bild står ordet ensamt. */
  function promptHtml(w, text, lang) {
    var ic = diff().emoji ? wIcon(w) : "";
    return (
      '<div class="prompt">' +
      (ic ? '<span class="pem" aria-hidden="true">' + ic + "</span>" : "") +
      '<span class="pword"' +
      (lang ? ' lang="' + lang + '"' : "") +
      ">" +
      esc(text) +
      "</span></div>"
    );
  }
  /* färre alternativ när det kärvar */
  function optCount() {
    return struggling() ? Math.min(3, diff().opts) : diff().opts;
  }
  function answered(ok, extra) {
    L.results[L.idx] = ok;
    L.missRun = ok ? 0 : (L.missRun || 0) + 1;
    /* hon märker när ett ord som brukade vackla äntligen sitter */
    try {
      var rw = L.rounds[L.idx] && L.rounds[L.idx].w;
      if (ok && rw) {
        var mm = (S.wordmem || {})[mkey(rw.et, rw.sv)];
        if (mm && mm.m >= 2 && mm.r >= 2 && !L.saidFix) {
          L.saidFix = true;
          queuePraise("Nüüd sa oskad!");
          setTimeout(function () {
            siiriClass("wob", 900);
          }, 700);
        }
      }
    } catch (e) {}
    /* var ordet svårt innan? spara det före minnet uppdateras */
    var hardBefore = false,
      cameBack = false;
    if (L.rounds[L.idx] && L.rounds[L.idx].w) {
      var mb = (S.wordmem || {})[mkey(L.rounds[L.idx].w.et, L.rounds[L.idx].w.sv)];
      hardBefore = !!(mb && (mb.m || 0) > 0 && (mb.s || 0) < 2);
      cameBack = !!(mb && (mb.m || 0) >= 2 && (mb.s || 0) >= 1.5);
    }
    if (L.rounds[L.idx] && L.rounds[L.idx].w)
      wmemHit(L.rounds[L.idx].w.et, ok, L.rounds[L.idx].type, L.rounds[L.idx].w.sv);
    /* satt det nu? då behöver det inte tas upp i morgon */
    if (ok && S.redo && L.rounds[L.idx] && L.rounds[L.idx].w) {
      delete S.redo[L.rounds[L.idx].w.et];
      save();
    }
    if (ok) {
      L.right++;
      S.correct++;
      L.combo = (L.combo || 0) + 1;
      if (L.combo > (L.bestCombo || 0)) L.bestCombo = L.combo;
      if (L.combo > (S.bestcombo || 0)) S.bestcombo = L.combo;
      var mult = L.combo >= 5 ? 3 : L.combo >= 3 ? 2 : 1;
      if (extra === "speak") {
        S.spoken++;
        if (firstEver("spoken"))
          celebrateFirst("🎤", "Sa ütlesid esimese sõna valjusti!", "Du sa ditt första ord högt!");
      }
      if (extra === "type") S.typed++;
      if (extra === "type") tripBump("type", 1);
      /* både att säga ordet och att höra och välja rätt räknas – mikrofon behövs aldrig */
      if (extra === "speak") tripBump("hear", 1);
      else if (L.rounds[L.idx] && L.rounds[L.idx].type === "listen") tripBump("hear", 1);
      bumpQuest("correct", 1);
      if (extra === "speak") bumpQuest("spoken", 1);
      if (extra === "type") bumpQuest("typed", 1);
      var gold = L.rounds[L.idx] && L.rounds[L.idx].gold;
      var hardX = hardBefore ? 2 : 1; /* ord du missat förut är värda dubbelt */
      addXp(Math.round(10 * mult * diff().mult * (gold ? 2 : 1) * hardX));
      earnStars((gold ? mult * 3 : mult) * hardX);
      if (hardBefore && !gold) {
        L.hardWon = (L.hardWon || 0) + 1;
        var hw = document.createElement("div");
        hw.className = "combo hardwin";
        hw.innerHTML = "💪 Raske sõna ×2";
        document.body.appendChild(hw);
        setTimeout(function () {
          hw.remove();
        }, 1100);
        tone(880, 0.1, 0);
        tone(1180, 0.16, 0.1);
      }
      /* ordet som inte satt förut sitter nu */
      if (cameBack && L.rounds[L.idx] && L.rounds[L.idx].w) {
        L.fixed = L.fixed || [];
        var fw = L.rounds[L.idx].w,
          dup = false,
          fz;
        for (fz = 0; fz < L.fixed.length; fz++) if (L.fixed[fz].et === fw.et) dup = true;
        if (!dup) L.fixed.push(fw);
      }
      if (gold) {
        petals(40, ["#FFD45E", "#FFF3C4", "#FFE9A8"]);
        tone(1320, 0.12, 0);
        tone(1760, 0.2, 0.12);
        var g = document.createElement("div");
        g.className = "combo";
        g.style.color = "var(--honey-deep)";
        g.textContent = "✨ Kuldsõna ×3";
        document.body.appendChild(g);
        setTimeout(function () {
          g.remove();
        }, 1000);
      }
      save();
      /* kolla bragder direkt, inte bara vid rundans slut - den allra första
         "Nytt märke!" ska komma inom sekunder, inte efter 10-12 frågor */
      var newBadges = checkBadges();
      if (newBadges.length) badgeToast(newBadges);
      sndOk();
      buzz(18);
      mood("cheer");
      if (L.combo === 5 || L.combo === 10) dance(L.combo >= 10);
      if (L.combo >= 3) comboFlash(L.combo);
      if (L.combo >= 10) comboTen();
      if (mult > 1) tone(1320, 0.12, 0.3);
    } else {
      L.combo = 0;
      sndNo();
      buzz([12, 60, 12]);
      mood("oops");
      /* ordet kommer tillbaka om 2–3 frågor, medan det fortfarande sitter i huvudet */
      var r0 = L.rounds[L.idx];
      if (r0 && !r0.again && L.rounds.length < 26) {
        var back = { type: r0.type === "type" || r0.type === "speak" ? "listen" : r0.type, w: r0.w, again: true };
        var at = Math.min(L.rounds.length, L.idx + 2 + ((Math.random() * 2) | 0));
        L.rounds.splice(at, 0, back);
      }
      /* och en gång till i morgon */
      if (r0 && r0.w) {
        if (!S.redo) S.redo = {};
        S.redo[r0.w.et] = today0();
        save();
      }
    }
    refreshTop();
    /* inget försvinner av sig självt – barnet bestämmer när nästa fråga kommer */
    L.waiting = true;
    var rw = L.rounds[L.idx] && L.rounds[L.idx].w,
      ag = false,
      zz;
    if (!ok && rw)
      for (zz = L.idx + 1; zz < L.rounds.length; zz++) {
        if (L.rounds[zz].again && L.rounds[zz].w && L.rounds[zz].w.et === rw.et) ag = true;
      }
    showAnswer(rw, ag);
  }
  function goNext() {
    if (!L || !L.waiting) return;
    L.waiting = false;
    clearTimeout(L.timer);
    L.idx++;
    nextRound();
  }
  /* svarsrutan: estniskan störst, ljudet spelas en gång, och den ligger kvar */
  function showAnswer(w, again) {
    var slot = document.getElementById("ansslot");
    if (!slot) {
      var card = app.querySelector(".card");
      if (!card) return;
      slot = document.createElement("div");
      slot.className = "ansslot";
      slot.id = "ansslot";
      card.appendChild(slot);
    }
    /* frågans kontroller (t.ex. bokstäverna och Valmis) byts mot svaret på samma plats och höjd */
    var fb = document.getElementById("fb"),
      ctl = document.getElementById("qctl");
    var good = !fb || fb.className.indexOf(" no") < 0;
    if (ctl) {
      slot.style.minHeight = ctl.offsetHeight + "px";
      ctl.parentNode.insertBefore(slot, ctl.nextSibling);
      ctl.hidden = true;
    }
    var h = '<div class="ansbox ' + (good ? "good" : "bad") + '"><div class="anspanel">';
    if (w) {
      h +=
        '<div class="answrap"><span class="answord" lang="et">' +
        esc(w.et) +
        "</span>" +
        '<button class="speakbtn sm" id="ansay" aria-label="Hör ordet">🔊</button>' +
        '<button class="speakbtn sm" id="anslow" aria-label="Hör ordet långsamt">🐢</button></div>' +
        '<div class="anssv"><span lang="et">' +
        esc(w.et) +
        "</span> = " +
        esc(w.sv) +
        "</div>";
    }
    if (again) h += '<div class="ansagain">🔁 Vi tar det igen snart</div>';
    h += '</div><button class="btn green wide nextbtn" id="goon">Edasi · Nästa →</button></div>';
    slot.innerHTML = h;
    /* berömmet (eller "ingen fara") hamnar överst i samma panel som ordet */
    var panel = slot.querySelector(".anspanel");
    if (fb && fb.innerHTML && panel) panel.insertBefore(fb, panel.firstChild);
    var b = document.getElementById("ansay");
    if (b && w)
      b.onclick = function () {
        speak(w.et);
      };
    b = document.getElementById("anslow");
    if (b && w)
      b.onclick = function () {
        speak(w.et, true);
      };
    b = document.getElementById("goon");
    if (b) b.onclick = goNext;
    if (w) {
      /* först ordet, sedan berömmet om det finns ett i kö */
      var after = pendingPraise;
      pendingPraise = null;
      setTimeout(function () {
        if (after) speakSeq([w.et, after]);
        else speak(w.et);
      }, 200);
    }
    try {
      slot.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } catch (e) {}
  }
  /* att hoppa över är inte ett fel – prick och serie lämnas i fred */
  function skipRound() {
    if (!L || L.waiting) return;
    L.results[L.idx] = "skip";
    var r0 = L.rounds[L.idx];
    if (r0 && !r0.again && L.rounds.length < 26) L.rounds.push({ type: "listen", w: r0.w, again: true });
    L.waiting = true;
    refreshTop();
    showAnswer(r0 && r0.w, true);
  }
  function roundListen(r) {
    screen = "q";
    var opts = distractors(r.w, optCount() - 1),
      i,
      pics = hasPic(r.w);
    /* läxord har ingen bild: då väljer barnet bland de svenska orden i stället */
    var html =
      dots() +
      meterHtml() +
      '<div class="card' +
      (r.gold ? " golden" : "") +
      '"><p class="q">' +
      (pics ? "Vilken bild hör du?" : "Vilket ord hör du?") +
      '</p><p class="qsub">Tryck på högtalaren och lyssna noga.</p>' +
      '<div class="center"><button class="speakbtn" id="say" aria-label="Spela upp ordet">🔊</button></div><div class="opts">';
    for (i = 0; i < opts.length; i++) {
      html +=
        '<button class="opt" data-et="' +
        esc(opts[i].et) +
        '">' +
        (pics
          ? '<span class="oem">' + wIcon(opts[i]) + "</span><small>" + esc(opts[i].sv) + "</small>"
          : "<b>" + esc(opts[i].sv) + "</b>") +
        "</button>";
    }
    html +=
      '</div><div class="feedback" id="fb"></div><div class="ansslot" id="ansslot"></div></div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    speak(r.w.et);
    document.getElementById("say").onclick = function () {
      speak(r.w.et);
    };
    var btns = app.querySelectorAll(".opt");
    for (i = 0; i < btns.length; i++) {
      (function (el) {
        el.onclick = function () {
          var ok = el.getAttribute("data-et") === r.w.et,
            j;
          for (j = 0; j < btns.length; j++) {
            btns[j].disabled = true;
            if (btns[j].getAttribute("data-et") === r.w.et) {
              btns[j].classList.add("right");
              stampOn(btns[j], "⭐");
            }
          }
          if (!ok) {
            el.classList.add("wrong");
            stampOn(el, "❌");
          }
          praiseSay(L.combo + (ok ? 1 : 0), ok, document.getElementById("fb"));
          answered(ok);
        };
      })(btns[i]);
    }
  }
  function roundChoose(r) {
    screen = "q";
    var opts = distractors(r.w, optCount() - 1),
      i;
    /* svenskan står alltid kvar: bilderna stämmer inte alltid, så ordet är ledtråden.
       På Lätt (barn som kanske inte läser än) får varje alternativ ändå en liten
       bild - annars är den som inte kan läsa orden helt utlämnad åt gissning. */
    var withPics = diff().id === "latt";
    var html =
      dots() +
      meterHtml() +
      '<div class="card' +
      (r.gold ? " golden" : "") +
      '"><p class="q">Mis see on? · Vad heter det?</p>' +
      promptHtml(r.w, r.w.sv) +
      '<div class="opts' +
      (withPics ? "" : " txt") +
      '">';
    for (i = 0; i < opts.length; i++) {
      html +=
        '<button class="opt" data-et="' +
        esc(opts[i].et) +
        '" lang="et">' +
        (withPics && hasPic(opts[i])
          ? '<span class="oem">' + wIcon(opts[i]) + '</span><small lang="et">' + esc(opts[i].et) + "</small>"
          : esc(opts[i].et)) +
        "</button>";
    }
    html +=
      '</div><div class="feedback" id="fb"></div><div class="ansslot" id="ansslot"></div></div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    var btns = app.querySelectorAll(".opt");
    for (i = 0; i < btns.length; i++) {
      (function (el) {
        el.onclick = function () {
          var ok = el.getAttribute("data-et") === r.w.et,
            j;
          /* rätt svar får en bock, resten tonas ned – lugnt, utan rött */
          for (j = 0; j < btns.length; j++) {
            btns[j].disabled = true;
            if (btns[j].getAttribute("data-et") === r.w.et) {
              btns[j].classList.add("right");
              /* bocken som eget element – textContent += skulle radera bilden i bildalternativen */
              btns[j].insertAdjacentHTML("beforeend", '<span class="tick" aria-hidden="true"> ✓</span>');
            } else btns[j].classList.add(btns[j] === el ? "mine" : "dim");
          }
          praiseSay(L.combo + (ok ? 1 : 0), ok, document.getElementById("fb"));
          answered(ok);
        };
      })(btns[i]);
    }
  }
  /* hur långt ifrån är stavningen? används för att säga vad som gick fel */
  function lev(a, b) {
    var m = a.length,
      n = b.length,
      i,
      j,
      prev,
      cur,
      t;
    if (!m) return n;
    if (!n) return m;
    prev = [];
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur = [i];
      for (j = 1; j <= n; j++) {
        t = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + t);
      }
      prev = cur;
    }
    return prev[n];
  }
  /* "en bokstav saknas" är begripligt för ett barn, "inte riktigt" är det inte */
  function typoHint(got, want) {
    var g = norm(got || ""),
      w = norm(want || "");
    if (!g) return "Skriv ordet först.";
    if (g === w) return "Rätt!";
    if (w.indexOf(g) === 0) {
      var d = w.length - g.length;
      return d === 1 ? "Nästan! En bokstav saknas i slutet." : "Nästan! Det fattas " + d + " bokstäver i slutet.";
    }
    if (g.indexOf(w) === 0) return "Nästan! En bokstav för mycket i slutet.";
    var dist = lev(g, w);
    if (dist === 1) return "Nästan! En bokstav är fel.";
    if (dist === 2) return "Nära! Två bokstäver är fel.";
    return "Inte riktigt – prova en gång till.";
  }
  /* visar vilka bokstäver som satt rätt */
  function letterDiff(got, want) {
    var g = got || "",
      w = want || "",
      s = '<span class="ldiff" lang="et">',
      i;
    for (i = 0; i < g.length; i++) {
      var right = i < w.length && norm(g.charAt(i)) === norm(w.charAt(i));
      s += '<span class="' + (right ? "okch" : "badch") + '">' + esc(g.charAt(i)) + "</span>";
    }
    return s + "</span>";
  }
  /* visar det rätta ordet och markerar det som skiljer – även en bokstav som saknas
       ("kasvatu" → kasvatu<b>s</b>), vilket letterDiff inte kan visa */
  function wantDiff(got, want) {
    var g = (got || "").toLowerCase().replace(/\s+/g, " ").trim(),
      w = want || "",
      wl = w.toLowerCase(),
      p = 0,
      q = 0;
    while (p < g.length && p < wl.length && g.charAt(p) === wl.charAt(p)) p++;
    while (q < g.length - p && q < wl.length - p && g.charAt(g.length - 1 - q) === wl.charAt(wl.length - 1 - q)) q++;
    return (
      '<span class="ldiff" lang="et"><span class="okch">' +
      esc(w.slice(0, p)) +
      "</span>" +
      '<span class="badch">' +
      esc(w.slice(p, w.length - q)) +
      "</span>" +
      '<span class="okch">' +
      esc(w.slice(w.length - q)) +
      "</span></span>"
    );
  }
  function roundType(r) {
    screen = "q";
    /* specialtecknen och Valmis ligger i #qctl – svaret tar deras plats, så kortet inte hoppar */
    var html =
      dots() +
      meterHtml() +
      '<div class="card' +
      (r.gold ? " golden" : "") +
      '"><p class="q">Kirjuta eesti keeles · Skriv på estniska</p>' +
      promptHtml(r.w, r.w.sv) +
      '<div class="center qtools"><button class="speakbtn sm" id="say" aria-label="Hör ordet">🔊</button>' +
      (diff().peek ? '<button class="btn ghost" id="peek">💡 Första bokstaven</button>' : "") +
      "</div>" +
      '<input class="type" id="inp" lang="et" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="skriv här" inputmode="text">' +
      '<div class="qctl" id="qctl"><p class="keyslabel">Estniska bokstäver</p><div class="keys" id="keys"></div>' +
      '<button class="btn wide" id="ok">Valmis! · Klart</button>' +
      '<div class="feedback" id="fb"></div></div><div class="ansslot" id="ansslot"></div></div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    var inp = document.getElementById("inp"),
      fb = document.getElementById("fb"),
      tries = 0;
    var special = ["ä", "ö", "ü", "õ", "š", "ž"],
      keys = document.getElementById("keys"),
      i;
    for (i = 0; i < special.length; i++) {
      (function (ch) {
        var b = document.createElement("button");
        b.className = "key";
        b.type = "button";
        b.textContent = ch;
        b.onclick = function () {
          inp.value += ch;
          inp.focus();
        };
        keys.appendChild(b);
      })(special[i]);
    }
    document.getElementById("say").onclick = function () {
      speak(r.w.et);
    };
    var pk = document.getElementById("peek");
    if (pk)
      pk.onclick = function () {
        if (!inp.value) inp.value = r.w.et.charAt(0);
        inp.focus();
      };
    /* frågan kan bara besvaras en gång – förut gick Valmis att trycka igen och igen för nya poäng */
    var done = false;
    function finish(ok) {
      done = true;
      /* Valmis och bokstäverna försvinner när showAnswer byter #qctl mot svaret */
      var e = document.getElementById("peek");
      if (e) e.hidden = true;
      if (ok) inp.value = inp.value.trim() + " ✓";
      answered(ok, "type");
    }
    function check() {
      if (done) return;
      var got = inp.value,
        ok = norm(got) === norm(r.w.et),
        closeTry = false,
        nearly = false;
      /* på Lätt räcker det nära nog, men rätt stavning visas alltid */
      if (!ok && diff().id === "latt" && got && lev(norm(got), norm(r.w.et)) <= 1) ok = nearly = true;
      if (!ok && loose(got) === loose(r.w.et)) {
        tries++;
        inp.className = "type wrong";
        fb.className = "feedback no";
        fb.innerHTML = "Nästan! Kolla prickarna och krokarna.<br>" + letterDiff(got, r.w.et);
        setTimeout(function () {
          inp.className = "type";
        }, 600);
        if (tries < 2) return;
        closeTry = true;
      }
      if (ok && nearly) {
        /* godkänt, men barnet ska se att en bokstav blev fel – inget "du kan det här" */
        inp.className = "type right";
        inp.disabled = true;
        fb.className = "feedback ok";
        fb.innerHTML = "Nästan perfekt! Så här stavas det:<br>" + wantDiff(got, r.w.et);
        finish(true);
      } else if (ok) {
        inp.className = "type right";
        inp.disabled = true;
        praiseSay(L.combo + 1, true, fb);
        finish(true);
      } else if (closeTry) {
        /* redan på sitt andra (nästan-rätt) försök – räkna inte ett tredje här */
        inp.className = "type wrong";
        inp.disabled = true;
        fb.className = "feedback no";
        fb.innerHTML = typoHint(got, r.w.et);
        finish(false);
      } else {
        tries++;
        if (tries < 2) {
          inp.className = "type wrong";
          fb.className = "feedback no";
          fb.innerHTML = typoHint(got, r.w.et) + "<br>" + letterDiff(got, r.w.et);
          setTimeout(function () {
            inp.className = "type";
          }, 600);
        } else {
          inp.className = "type wrong";
          inp.disabled = true;
          fb.className = "feedback no";
          fb.innerHTML = typoHint(got, r.w.et);
          finish(false);
        }
      }
    }
    document.getElementById("ok").onclick = check;
    inp.onkeydown = function (e) {
      if (e.key === "Enter") check();
    };
    setTimeout(function () {
      inp.focus();
    }, 120);
  }
  function roundSpeak(r) {
    if (!micOK || micBlocked) {
      roundChoose(r);
      return;
    }
    screen = "q";
    var html =
      dots() +
      meterHtml() +
      '<div class="card' +
      (r.gold ? " golden" : "") +
      '"><p class="q">Ütle valjusti! · Säg ordet högt!</p><p class="qsub">Tryck på mikrofonen och säg ordet.</p>' +
      promptHtml(r.w, r.w.et, "et") +
      '<div class="trans">' +
      esc(r.w.sv) +
      "</div>" +
      (diff().hint ? '<div class="hint">säg så här: ' + esc(r.w.hint) + "</div>" : "") +
      '<div class="center"><button class="speakbtn sm" id="say" aria-label="Hör ordet först">🔊</button>' +
      '<button class="mic" id="mic" aria-label="Spela in din röst">🎤</button>' +
      '<button class="speakbtn sm" id="slow" aria-label="Hör ordet långsamt">🐢</button></div>' +
      '<div class="heard" id="heard"></div>' +
      '<div class="row"><button class="btn ghost" id="saidit">🗣️ Jag sa det högt!</button>' +
      '<button class="btn ghost" id="skip">Hoppa över</button></div>' +
      '<div class="feedback" id="fb"></div><div class="ansslot" id="ansslot"></div></div><div class="center">' +
      siilSVG("small") +
      "</div>";
    app.innerHTML = html;
    var mic = document.getElementById("mic"),
      heard = document.getElementById("heard"),
      fb = document.getElementById("fb");
    var tries = 0,
      busy = false;
    document.getElementById("say").onclick = function () {
      speak(r.w.et);
    };
    document.getElementById("slow").onclick = function () {
      speak(r.w.et, true);
    };
    /* barnet kan ha sagt ordet perfekt – mikrofonen är inte domaren */
    document.getElementById("saidit").onclick = function () {
      fb.className = "feedback ok";
      fb.textContent = "Tubli! · Duktigt!";
      answered(true, "speak");
    };
    document.getElementById("skip").onclick = function () {
      fb.className = "feedback";
      fb.textContent = "Ingen fara – vi övar mer sen!";
      skipRound();
    };
    mic.onclick = function () {
      if (busy) return;
      busy = true;
      stopSpeak();
      mic.classList.add("listening");
      heard.textContent = "Jag lyssnar …";
      listen(
        function (alts) {
          heard.textContent = "Du sa: " + alts[0];
          if (saidIt(alts, r.w.et)) {
            praiseSay(L.combo + 1, true, fb);
            answered(true, "speak");
          } else {
            tries++;
            if (tries < 2) {
              fb.className = "feedback no";
              fb.textContent = "Nästan! Lyssna en gång till och prova igen.";
              speak(r.w.et);
            } else {
              fb.className = "feedback no";
              fb.textContent = "Vi tar det igen nästa gång: " + r.w.et;
              answered(false);
            }
          }
        },
        function () {
          mic.classList.remove("listening");
          busy = false;
          if (!talking) mMood("");
        },
        function (err) {
          mic.classList.remove("listening");
          busy = false;
          mMood("");
          heard.innerHTML = esc(micProblem(err)) + (inFrame ? "<br>" + openTabHTML() : "");
        },
      );
    };
    if (!micOK) {
      heard.innerHTML =
        '🎤 Mikrofonen är avstängd. Det gör inget – säg ordet högt och tryck <b>Jag sa det högt!</b><br><span style="font-size:12.5px">' +
        esc(micProblem("noSR")) +
        (inFrame ? " " + openTabHTML() : "") +
        "</span>";
    } else if (inFrame) {
      heard.innerHTML =
        'Tryck på mikrofonen och säg ordet.<br><span style="font-size:12.5px">Händer inget? ' +
        openTabHTML("Öppna i egen flik") +
        "</span>";
    }
  }
  function maybeChest() {
    S.lessons = (S.lessons || 0) + 1;
    save();
    if (S.lessons % 3) return;
    var roll = Math.random(),
      pool = allWords();
    if (roll < 0.3) {
      var w = pool[(Math.random() * pool.length) | 0];
      pendAdd("🧰", "Bonuskista: " + esc(w.et), esc(w.sv) + " · ett ord på köpet");
    } else {
      var base = [10, 15, 20, 25, 30, 40][(Math.random() * 6) | 0];
      earnStars(base);
      save();
      refreshTop();
      pendAdd("🧰", "Bonuskista", "+" + base * starMult() + " stjärnor till marknaden");
    }
  }
  /* poäng + allt sparat state för den just avslutade rundan (S.best/S.perfect/S.bestRight/
     uppdrag/resa/S.tough-S.easy-strecket/S.hardWins/XP/märken) - inga animationer eller
     overlägg här, bara vad som HÄNDE och vad som ska sparas. resultScreen() läser svaret
     härifrån och sköter firandet och själva skärmen. */
  function scoreResult() {
    var total = L.rounds.length,
      right = L.right;
    var pct = right / total;
    var st = pct >= 0.95 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0;
    if (st > (S.best[L.theme.id] || 0)) {
      S.best[L.theme.id] = st;
    }
    var firstPerfect = false;
    if (right === total) {
      S.perfect++;
      firstPerfect = firstEver("perfect");
    }
    if (!S.bestRight) S.bestRight = {};
    if (L.right > (S.bestRight[L.theme.id] || 0)) {
      S.bestRight[L.theme.id] = L.right;
      save();
    }
    if (st > 0) {
      bumpQuest("themes", 1);
      tripBump("theme", 1);
    }
    var wrongN = 0,
      wi;
    for (wi = 0; wi < L.results.length; wi++) if (L.results[wi] === false) wrongN++;
    if (wrongN >= Math.max(5, Math.round(L.rounds.length * 0.4)) && diff().id !== "latt") {
      S.tough = (S.tough || 0) + 1;
      S.easy = 0;
    } else if (wrongN === 0 && diff().id !== "svar") {
      S.easy = (S.easy || 0) + 1;
      S.tough = 0;
    } else {
      S.tough = 0;
      S.easy = 0;
    }
    save();
    var firstHardWin = false,
      hardPerfect = false;
    if (diff().id === "svar" && st > 0) {
      S.hardWins = (S.hardWins || 0) + 1;
      save();
      firstHardWin = S.hardWins === 1;
      hardPerfect = st === 3 && (S.secrets || []).indexOf("hardperfect") < 0;
    }
    addXp(Math.round(st * 15 * diff().mult));
    save();
    var newB = checkBadges();
    return {
      total: total,
      right: right,
      st: st,
      firstPerfect: firstPerfect,
      newB: newB,
      firstHardWin: firstHardWin,
      hardPerfect: hardPerfect,
    };
  }
  function resultScreen() {
    screen = "result";
    var r = scoreResult(),
      total = r.total,
      right = r.right,
      st = r.st,
      newB = r.newB;
    setTimeout(function () {
      dance(st >= 3);
    }, 350);
    if (r.firstPerfect) celebrateFirst("💯", "Sinu esimene veatu tulemus!", "Ditt första felfria resultat!");
    maybeChest();
    if (r.firstHardWin) {
      setTimeout(function () {
        var d = overlay(
          '<div class="oc" style="border-color:var(--berry)"><p class="kicker">🔥 Svår nivå klarad!</p>' +
            '<div style="font-size:64px">🐉</div><h3>Tre plagg låstes upp</h3>' +
            "<p>Eldkrona, blixtar och drakvingar finns nu på marknaden — bara för den som spelar på svår.</p>" +
            '<button class="btn big wide" id="hwok">Till garderoben</button></div>',
        );
        burst(180);
        sndLvl();
        d.querySelector("#hwok").onclick = function () {
          d.remove();
          go(shopScreen, true);
        };
      }, 1200);
    }
    if (r.hardPerfect) {
      setTimeout(function () {
        eggReward("hardperfect", 80, 50);
        eggSay2("hardperfect", "🐉");
      }, 700);
    }
    if (st >= 3)
      setTimeout(function () {
        dance();
      }, 520);
    if (st >= 2) burst(140);
    var html =
      '<div class="card" style="text-align:center">' +
      '<div class="bigstars">' +
      starStr(st) +
      "</div>" +
      '<p class="q">' +
      (st === 3
        ? "Suurepärane" + (S.name ? ", " + esc(S.name) : "") + "! Alldeles perfekt!"
        : st === 2
          ? "Tubli" + (S.name ? ", " + esc(S.name) : "") + "! Snyggt jobbat!"
          : st === 1
            ? "Bra kämpat!"
            : "Öva lite till – du fixar det!") +
      "</p>" +
      '<p class="qsub">' +
      right +
      " rätt av " +
      total +
      " · bästa kombo x" +
      (L.bestCombo || 0) +
      " · " +
      diff().em +
      " " +
      diff().sv +
      "</p>" +
      '<div class="center">' +
      siilSVG() +
      "</div>";
    if (newB.length) {
      html += '<p class="q" style="margin-top:12px">Nytt märke!</p><div>';
      for (var i = 0; i < newB.length; i++) {
        html += '<span class="badge">' + newB[i].em + " " + esc(newB[i].sv) + "</span>";
      }
      html += "</div>";
    }
    html += pendHtml();
    /* ord som inte satt förut men sitter nu */
    if (L.fixed && L.fixed.length) {
      html += '<div class="fixedbox"><b>💪 Det här satt inte förut — nu sitter det!</b>';
      for (var fq = 0; fq < L.fixed.length; fq++) {
        html +=
          '<span class="fw">' +
          esc(L.fixed[fq].em || "") +
          " " +
          esc(L.fixed[fq].et) +
          ' <span style="font-weight:400;color:var(--muted)">' +
          esc(L.fixed[fq].sv) +
          "</span></span>";
      }
      html += "</div>";
    }
    if (L.hardWon)
      html +=
        '<p class="qsub">💪 ' +
        L.hardWon +
        (L.hardWon === 1 ? " svårt ord" : " svåra ord") +
        " gav dubbla stjärnor.</p>";
    var nx = nextUp();
    html +=
      '<button class="btn green big wide" id="nextup">▶️ ' +
      esc(UI.next.et) +
      '<span style="font-weight:500;font-size:14px;opacity:.9"> · ' +
      (nx.kind === "theme" ? esc(nx.t.sv) : esc(nx.sv)) +
      "</span></button>" +
      (function () {
        var untried = ["duel", "mem", "rain", "sent", "talk"].filter(function (k) {
          return !(S.tried || {})[k];
        });
        if (!untried.length) return "";
        var nm = {
          duel: "⚔️ Duell mot ett djur",
          mem: "🃏 Memory",
          rain: "🌧️ Ordregnet",
          sent: "🧩 Bygg meningar",
          talk: "💬 Prata med Siiri",
        }[untried[0]];
        return (
          '<button class="btn ghost wide" id="trynew" data-try="' +
          untried[0] +
          '" style="margin-top:10px">Har du testat ' +
          nm +
          "?</button>"
        );
      })() +
      '<div class="row"><button class="btn ghost" id="again">' +
      esc(UI.again.et) +
      " · en gång till</button>" +
      '<button class="btn ghost" id="home">Menüü · menyn</button></div></div>';
    app.innerHTML = html;
    mood("cheer");
    document.getElementById("nextup").onclick = function () {
      startNext();
    };
    var tn = document.getElementById("trynew");
    if (tn)
      tn.onclick = function () {
        var k = tn.getAttribute("data-try");
        var f = { duel: duelIntro, mem: memIntro, rain: rainIntro, sent: sentIntro, talk: talkScreen }[k];
        if (!S.tried) S.tried = {};
        S.tried[k] = (S.tried[k] || 0) + 1;
        save();
        go(f, true);
      };
    if ((S.tough || 0) >= 1 || (S.easy || 0) >= 3) {
      var easier = (S.tough || 0) >= 1;
      setTimeout(function () {
        var d = overlay(
          '<div class="oc"><p class="kicker">' +
            (easier ? "Siiri undrar en sak" : "Siiri har en idé") +
            "</p>" +
            '<div style="font-size:52px">' +
            (easier ? "🍃" : "🔥") +
            "</div>" +
            "<h3>" +
            (easier ? "Ska vi ta det lite lugnare?" : "Vill du prova svårare?") +
            "</h3>" +
            "<p>" +
            (easier
              ? "Du får fler bilder som hjälp och färre svarsalternativ. Du kan byta tillbaka när du vill."
              : "Du klarade flera omgångar utan ett enda fel. På svår nivå finns egna plagg och hemligheter.") +
            "</p>" +
            '<button class="btn green big wide" id="dyes">' +
            (easier ? "🍃 Byt till Lätt" : "🔥 Byt till Svår") +
            "</button>" +
            '<button class="btn ghost wide" id="dno" style="margin-top:8px">Nej tack, det går bra</button></div>',
        );
        d.querySelector("#dyes").onclick = function () {
          S.diff = easier ? "latt" : "svar";
          S.tough = 0;
          S.easy = 0;
          save();
          d.remove();
          refreshTop();
          sndLvl();
        };
        d.querySelector("#dno").onclick = function () {
          S.tough = 0;
          S.easy = 0;
          save();
          d.remove();
        };
      }, 1800);
    }
    if (st >= 2 && S.name) speakTo(st === 3 ? "vaga" : "tubli");
    else if (st >= 2) speak("Sa oled tubli!");
    document.getElementById("again").onclick = function () {
      L.learnIdx = 0;
      buildRounds();
      nextRound();
    };
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
    refreshTop();
  }

  /* ---------- PRATA MED SIIRI ---------- */
  var T = null;
  function talkScreen() {
    screen = "talk";
    prefetch("chat");
    var html =
      '<div class="card"><p class="q">Vad vill du prata om?</p>' +
      '<p class="qsub">Siiri ställer en fråga. Du svarar med rösten eller trycker på ett svar.</p>' +
      '<div class="center">' +
      siilSVG() +
      '</div><div class="topics">';
    for (var i = 0; i < CHATS.length; i++) {
      html +=
        '<button class="tile" data-chat="' +
        CHATS[i].id +
        '" style="min-height:96px">' +
        '<span class="em">' +
        CHATS[i].em +
        '</span><span class="et">' +
        esc(CHATS[i].et) +
        "</span>" +
        '<span class="sv">' +
        esc(CHATS[i].sv) +
        "</span></button>";
    }
    html +=
      "</div>" +
      '<button class="btn ghost wide" id="asksiiri" style="margin-top:10px">💬 Fråga Siiri vad du vill!</button></div>';
    app.innerHTML = html;
    mMood("");
    document.getElementById("asksiiri").onclick = function () {
      go(askScreen, true);
    };
    var b = app.querySelectorAll("[data-chat]");
    for (var k = 0; k < b.length; k++) {
      (function (el) {
        el.onclick = function () {
          startChat(el.getAttribute("data-chat"));
        };
      })(b[k]);
    }
  }
  /* en följdfråga om något barnet svarade i en ANNAN chatt (se chats.ts, "bonus"-fältet) -
     stoppas in strax före farväl-repliken, bara om S[requires] faktiskt är satt. Bygger en
     egen kopia av turns, rör aldrig CHATS-datan själv (delas mellan alla profiler). */
  function chatTurnsWithBonus(c) {
    if (!c.bonus || !c.bonus.length) return c.turns;
    var extra = [],
      i,
      b,
      val;
    for (i = 0; i < c.bonus.length; i++) {
      b = c.bonus[i];
      val = S[b.requires];
      if (!val) continue;
      extra.push({
        q: { et: b.q.et.replace("{value}", val), sv: b.q.sv.replace("{value}", val) },
        opts: b.opts,
        reply: b.reply,
      });
    }
    if (!extra.length) return c.turns;
    return c.turns.slice(0, -1).concat(extra, c.turns.slice(-1));
  }
  function startChat(id) {
    var c = null,
      i;
    for (i = 0; i < CHATS.length; i++) {
      if (CHATS[i].id === id) c = CHATS[i];
    }
    if (!c) {
      talkScreen();
      return;
    }
    var withBonus = {
      id: c.id,
      em: c.em,
      sv: c.sv,
      et: c.et,
      intro: c.intro,
      turns: chatTurnsWithBonus(c),
    };
    T = { c: withBonus, i: 0, said: 0, voice: 0, phase: "intro" };
    renderTalk();
  }
  function renderTalk() {
    var c = T.c,
      step = c.turns[T.i];
    if (step.nameOpt) {
      /* appen vet redan barnets namn - inget skäl att låta den gissa mellan Anna och Oskar */
      var childName = (S.name || "").trim(),
        nm = childName || "sõber",
        nmSv = childName || "vän";
      step.opts = [{ et: "Minu nimi on " + nm + ".", sv: "Jag heter " + nmSv + "." }];
    }
    var freeReplyOverride = T.freeReply;
    T.freeReply = null;
    var line = T.phase === "intro" ? c.intro : T.phase === "reply" ? freeReplyOverride || step.reply : step.q;
    var html =
      '<div class="stage">' +
      '<div class="saysbub" id="bub"><b>' +
      esc(line.et) +
      "</b><span>" +
      esc(line.sv) +
      "</span></div>" +
      siilSVG("big") +
      '<div class="progressdots">';
    for (var d = 0; d < c.turns.length; d++) {
      html += '<span class="dot' + (d < T.i ? " ok" : d === T.i ? " now" : "") + '"></span>';
    }
    html += '</div></div><div class="card" id="ansbox">';
    if (T.phase === "q" && step.freeText) {
      var prevAns = step.saveAs ? S[step.saveAs] || "" : "";
      html +=
        '<div class="center"><button class="speakbtn sm" id="again" aria-label="Hör frågan igen">🔊</button>' +
        '<button class="speakbtn sm" id="slow" aria-label="Hör frågan långsamt">🐢</button></div>' +
        '<div class="heard" id="heard">' +
        (prevAns
          ? "Jag minns: <b>" + esc(prevAns) + "</b>. Skriv om, eller tryck Klart för samma svar."
          : "Skriv ditt eget svar.") +
        "</div>" +
        '<label class="sr-only" for="freeans">Ditt svar</label>' +
        '<input class="type" id="freeans" maxlength="24" autocomplete="off" autocapitalize="off"' +
        (step.numeric ? ' inputmode="numeric" pattern="[0-9]*"' : "") +
        ' placeholder="skriv här" value="' +
        esc(prevAns) +
        '">' +
        '<button class="btn green big wide" id="freeok" style="margin-top:10px">Klart →</button>';
    } else if (T.phase === "q") {
      html +=
        '<div class="center"><button class="speakbtn sm" id="again" aria-label="Hör frågan igen">🔊</button>' +
        (micOK ? '<button class="mic" id="mic" aria-label="Svara med rösten">🎤</button>' : "") +
        '<button class="speakbtn sm" id="slow" aria-label="Hör frågan långsamt">🐢</button></div>' +
        '<div class="heard" id="heard">' +
        (micOK ? "Säg ditt svar – eller tryck på det." : "Tryck på det svar du vill ge.") +
        "</div>";
      for (var i = 0; i < step.opts.length; i++) {
        html +=
          '<button class="answer" data-opt="' +
          i +
          '">' +
          esc(step.opts[i].et) +
          "<span>" +
          esc(step.opts[i].sv) +
          "</span></button>";
      }
    } else {
      html +=
        '<div class="center"><button class="btn big" id="onwards">' +
        (T.phase === "intro" ? "Börja prata 💬" : "Vidare →") +
        "</button></div>";
    }
    html += "</div>";
    app.innerHTML = html;
    speak(line.et);

    if (T.phase !== "q") {
      document.getElementById("onwards").onclick = function () {
        if (T.phase === "reply") {
          T.i++;
          if (T.i >= c.turns.length) {
            talkDone();
            return;
          }
        }
        T.phase = "q";
        renderTalk();
      };
      return;
    }
    document.getElementById("again").onclick = function () {
      speak(step.q.et);
    };
    document.getElementById("slow").onclick = function () {
      speak(step.q.et, true);
    };
    if (step.freeText) {
      var fi = document.getElementById("freeans"),
        fb = document.getElementById("freeok");
      fb.onclick = function () {
        answerTalkFree(fi.value.trim().slice(0, 24));
      };
      fi.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          fb.click();
        }
      });
      fi.focus();
      return;
    }
    var btns = app.querySelectorAll("[data-opt]");
    for (var j = 0; j < btns.length; j++) {
      (function (el) {
        el.onclick = function () {
          el.classList.add("picked");
          answerTalk(parseInt(el.getAttribute("data-opt"), 10), false);
        };
      })(btns[j]);
    }
    var mic = document.getElementById("mic");
    if (mic) {
      var busy = false;
      mic.onclick = function () {
        if (busy) return;
        busy = true;
        stopSpeak();
        mMood("listen");
        mic.classList.add("listening");
        document.getElementById("heard").textContent = "Jag lyssnar …";
        listen(
          function (alts) {
            var k,
              hit = -1;
            for (k = 0; k < step.opts.length; k++) {
              if (saidIt(alts, step.opts[k].et)) {
                hit = k;
                break;
              }
            }
            document.getElementById("heard").textContent = "Du sa: " + alts[0];
            if (hit >= 0) {
              btns[hit].classList.add("picked");
              setTimeout(function () {
                answerTalk(hit, true);
              }, 350);
            } else {
              mMood("think");
              document.getElementById("heard").textContent = "Du sa: " + alts[0] + " – prova ett av svaren nedan.";
              setTimeout(function () {
                mMood("");
              }, 1600);
            }
          },
          function () {
            mic.classList.remove("listening");
            busy = false;
            if (!talking) mMood("");
          },
          function (err) {
            mic.classList.remove("listening");
            busy = false;
            mMood("");
            var hd = document.getElementById("heard");
            hd.innerHTML = esc(micProblem(err)) + (inFrame ? "<br>" + openTabHTML() : "");
          },
        );
      };
    }
  }
  function answerTalk(k, byVoice) {
    var step = T.c.turns[T.i];
    T.said++;
    if (byVoice) T.voice++;
    S.correct++;
    var firstSpoken = false;
    if (byVoice) {
      S.spoken++;
      firstSpoken = firstEver("spoken");
    }
    addXp(byVoice ? 12 : 6);
    earnStars(1);
    save();
    sndOk();
    burst(byVoice ? 70 : 40);
    mood("cheer");
    speak(step.opts[k].et);
    if (firstSpoken) celebrateFirst("🎤", "Sa ütlesid esimese sõna valjusti!", "Du sa ditt första ord högt!");
    setTimeout(function () {
      T.phase = "reply";
      renderTalk();
    }, 1500);
  }
  /* en svensk rad per fält för "jag minns det här"-svaret nedan - generiskt skulle låta fel
     för t.ex. ett husdjursnamn eller en ålder ("är din favorit" passar bara favColor/favFood). */
  var REMEMBER_SV = {
    favColor: "Ja, jag minns att {v} är din favoritfärg!",
    favFood: "Ja, jag minns att du gillar {v}!",
    petName: "Ja, jag minns att ditt husdjur heter {v}!",
    age: "Ja, jag minns att du är {v} år!",
    roomColor: "Ja, jag minns att ditt rum är {v}!",
    favSubject: "Ja, jag minns att du gillar {v}!",
    favSeason: "Ja, jag minns att din favoritårstid är {v}!",
  };
  /* samma belöning som answerTalk, men för en fritt skriven fråga - inget facit att läsa upp.
     saveAs sparar svaret på S så Siiri minns det och kan hälsa på det nästa gång (renderTalk()). */
  function answerTalkFree(text) {
    if (!text) return;
    var step = T.c.turns[T.i];
    if (step.numeric) {
      /* "åtta" eller "8 år" ger ingen siffra att räkna på - behåll då texten barnet skrev
         hellre än att tappa svaret, S.age används bara när det faktiskt går att tolka. */
      var digits = text.replace(/\D+/g, "");
      if (digits) text = digits;
    }
    /* samma gräns som husdjurets namn i Siiri tuba (app/pages/room.vue), eftersom det är
       exakt samma fält (S.petName) */
    if (step.saveAs === "petName") text = text.slice(0, 16);
    var remembered = !!(step.saveAs && S[step.saveAs] && S[step.saveAs] === text);
    if (step.saveAs) S[step.saveAs] = text;
    if (step.saveAs === "age") {
      var ageNum = parseInt(text, 10);
      /* förifyll svårighetsgraden åt yngre barn - men bara om ingen redan valt en själv i
         profilen (S.diff är då redan satt), så det här aldrig skriver över ett eget val */
      if (!isNaN(ageNum) && ageNum > 0 && ageNum <= 6 && !S.diff) S.diff = "latt";
    }
    T.said++;
    S.correct++;
    addXp(6);
    earnStars(1);
    save();
    sndOk();
    burst(40);
    mood("cheer");
    T.freeReply = remembered
      ? {
          et: "Jah, täpselt nii!",
          sv: (REMEMBER_SV[step.saveAs] || "Ja, jag minns att {v} är ditt svar!").replace("{v}", text),
        }
      : null;
    setTimeout(function () {
      T.phase = "reply";
      renderTalk();
    }, 700);
  }
  function talkDone() {
    bumpQuest("talks", 1);
    tripBump("talk", 1);
    var mine = S.name ? esc(S.name) : "";
    var newB = checkBadges();
    burst(150);
    var html =
      '<div class="card" style="text-align:center"><div class="bigstars">★★★</div>' +
      '<p class="q">Sa said hakkama' +
      (mine ? ", " + mine : "") +
      "! Du klarade hela samtalet!</p>" +
      '<p class="qsub">' +
      T.voice +
      " av " +
      T.said +
      " svar sa du med rösten.</p>" +
      '<div class="center">' +
      siilSVG() +
      "</div>";
    if (newB.length) {
      html += '<div style="margin-top:12px">';
      for (var i = 0; i < newB.length; i++) {
        html += '<span class="badge">' + newB[i].em + " " + esc(newB[i].sv) + "</span>";
      }
      html += "</div>";
    }
    html +=
      '<div class="row"><button class="btn green big" id="again">Prata om annat 💬</button>' +
      '<button class="btn ghost big" id="home">Tillbaka</button></div></div>';
    app.innerHTML = html;
    if (S.name) speakTo("tubli");
    else speak("Sa oled tubli!");
    setTimeout(function () {
      mood("cheer");
    }, 200);
    document.getElementById("again").onclick = function () {
      talkScreen();
    };
    document.getElementById("home").onclick = function () {
      go(homeScreen, false);
    };
  }

  /* ============ KNAPPAR ============ */
  btnBack.onclick = function () {
    stopSpeak();
    SP = null;
    go(homeScreen, false);
  };
  btnSound.onclick = function () {
    S.sound = !S.sound;
    save();
    btnSound.textContent = S.sound ? "🔊" : "🔇";
    if (!S.sound) {
      stopSpeak();
      ambienceStop();
    } else {
      tone(880, 0.12, 0);
      ambienceStart();
    }
  };
  var themePress = null,
    themeLong = false;
  btnTheme.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
  btnTheme.addEventListener(
    "pointerdown",
    function () {
      themeLong = false;
      themePress = setTimeout(function () {
        themePress = null;
        themeLong = true;
        snowfall();
      }, 900);
    },
    { passive: true },
  );
  btnTheme.addEventListener("pointercancel", endThemePress, { passive: true });
  function endThemePress() {
    if (themePress) {
      clearTimeout(themePress);
      themePress = null;
    }
  }
  btnTheme.addEventListener("pointerup", endThemePress, { passive: true });
  btnTheme.addEventListener("pointerleave", endThemePress, { passive: true });
  btnTheme.addEventListener("pointercancel", endThemePress, { passive: true });
  btnTheme.onclick = function () {
    if (themeLong) {
      themeLong = false;
      return;
    }
    var cur = document.documentElement.getAttribute("data-theme");
    var isDark = cur ? cur === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    var next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    S.theme = next;
    save();
    btnTheme.textContent = next === "dark" ? "☀️" : "🌙";
  };
  /* buggrapport: en kategori (frivilligt med egen text också) - all teknisk kontext (skärm,
     senast uppspelade ord, konsol-fel, enhet) fylls i av window.SiiriBugReport
     (app/plugins/bug-report.client.ts), som också gör själva sparningen i Supabase. */
  var BUG_CATS = [
    { cat: "confused", em: "😕", lbl: "Konstigt" },
    { cat: "sound", em: "🔇", lbl: "Ljudet" },
    { cat: "image", em: "🖼️", lbl: "Bilden" },
    { cat: "stuck", em: "🐌", lbl: "Fastnade" },
    { cat: "other", em: "✏️", lbl: "Annat" },
  ];
  function openBugReport() {
    var chosen = null,
      i,
      html = '<div class="oc bugcard"><p class="kicker">🐛 Något som inte stämmer?</p><div class="bugcats">';
    for (i = 0; i < BUG_CATS.length; i++) {
      html +=
        '<button class="bugcat" data-cat="' +
        BUG_CATS[i].cat +
        '">' +
        BUG_CATS[i].em +
        "<span>" +
        BUG_CATS[i].lbl +
        "</span></button>";
    }
    html +=
      '</div><textarea class="bugnote" id="bugnote" maxlength="2000" placeholder="Skriv gärna lite mer, om du vill"></textarea>' +
      '<button class="btn green wide" id="bugsend">Skicka</button>' +
      '<button class="btn ghost wide" id="bugcancel" style="margin-top:8px">Avbryt</button></div>';
    var d = overlay(html),
      cats = d.querySelectorAll(".bugcat");
    for (i = 0; i < cats.length; i++) {
      (function (btn) {
        btn.onclick = function () {
          chosen = btn.getAttribute("data-cat");
          for (var j = 0; j < cats.length; j++) cats[j].classList.remove("on");
          btn.classList.add("on");
        };
      })(cats[i]);
    }
    d.querySelector("#bugcancel").onclick = function () {
      d.remove();
    };
    d.querySelector("#bugsend").onclick = function () {
      var note = d.querySelector("#bugnote").value || "";
      var sendBtn = d.querySelector("#bugsend");
      sendBtn.disabled = true;
      sendBtn.textContent = "Skickar …";
      var bridge = window.SiiriBugReport;
      (bridge && bridge.enabled ? bridge.send(chosen || "other", note) : Promise.resolve(false)).then(function (ok) {
        d.innerHTML =
          '<div class="oc bugcard" style="text-align:center"><p class="kicker">🐛 ' +
          (ok ? "Tack!" : "Hoppsan") +
          "</p><p>" +
          (ok ? "Nu vet vi om det." : "Det gick inte att skicka just nu. Testa igen senare.") +
          '</p><button class="btn ghost wide" id="bugok">Okej</button></div>';
        d.querySelector("#bugok").onclick = function () {
          d.remove();
        };
      });
    };
  }
  btnBug.onclick = openBugReport;

  var rankPress = null,
    rankLong = false;
  var rc = document.getElementById("rankchip");
  rc.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
  rc.addEventListener(
    "pointerdown",
    function () {
      rankLong = false;
      rankPress = setTimeout(function () {
        rankPress = null;
        rankLong = true;
        medalSpin();
      }, 900);
    },
    { passive: true },
  );
  rc.addEventListener("pointercancel", endRankPress, { passive: true });
  function endRankPress() {
    if (rankPress) {
      clearTimeout(rankPress);
      rankPress = null;
    }
  }
  rc.addEventListener("pointerup", endRankPress, { passive: true });
  rc.addEventListener("pointerleave", endRankPress, { passive: true });
  rc.onclick = function () {
    if (rankLong) {
      rankLong = false;
      return;
    }
    location.href = "/trophy"; /* egen Nuxt-sida, se app/pages/trophy.vue */
  };
  document.addEventListener(
    "pointerdown",
    function ambOnce() {
      document.removeEventListener("pointerdown", ambOnce);
      ambienceStart();
    },
    { passive: true },
  );
  document.getElementById("starchip").onclick = function () {
    /* marknaden (app/pages/shop.vue) - där räknas trycken vidare till hemligheten Stjärnregnet */
    location.href = "/shop";
  };
  document.getElementById("mechip").onclick = function () {
    location.href = "/profile"; /* egen Nuxt-sida, se app/pages/profile.vue */
  };
  (function () {
    var nav = document.getElementById("nav");
    var map = {
      home: function () {
        go(homeScreen, false);
        setNav("home");
      },
      trip: function () {
        go(tripScreen, true);
        setNav("trip");
      },
      words: function () {
        go(listScreen, true);
        setNav("words");
      },
      shop: function () {
        go(shopScreen, true);
        setNav("shop");
      },
      room: function () {
        go(roomScreen, true);
        setNav("room");
      },
      me: function () {
        location.href = "/profile"; /* egen Nuxt-sida, se app/pages/profile.vue */
        setNav("me");
      },
    };
    var bs = nav.querySelectorAll("[data-nav]"),
      i;
    for (i = 0; i < bs.length; i++) {
      (function (el) {
        el.onclick = function () {
          stopSpeak();
          SP = null;
          map[el.getAttribute("data-nav")]();
        };
      })(bs[i]);
    }
  })();
  /* service workern registreras av Nuxt-appen (app/plugins/sw.client.ts) */
  newDay();
  /* ser profilen tom ut trots att en kopia finns? erbjud återställning */
  try {
    if (backupLooksBetter()) {
      setTimeout(function () {
        var p = backupInfo();
        var d = overlay(
          '<div class="oc" style="border-color:var(--honey)"><p class="kicker">💾 Säkerhetskopia</p>' +
            '<div style="font-size:52px">🦔</div><h3>Vi hittade en sparad kopia</h3>' +
            "<p>Den är från " +
            esc(backupAge(p)) +
            " och innehåller ⭐ " +
            (p.data.stars || 0) +
            " och " +
            (p.data.correct || 0) +
            " rätta svar. Vill du hämta tillbaka den?</p>" +
            '<div class="row"><button class="btn green" id="bkyes">Ja, hämta tillbaka</button>' +
            '<button class="btn ghost" id="bkno">Nej tack</button></div></div>',
        );
        d.querySelector("#bkyes").onclick = function () {
          if (restoreBackup()) location.reload();
          else d.remove();
        };
        d.querySelector("#bkno").onclick = function () {
          d.remove();
        };
      }, 1200);
    }
  } catch (e) {}
  /* tillgänglighet för hela den gamla appen, på ett ställe:
     - svarsrutan (.feedback) läses upp av skärmläsare när rätt/fel visas
     - överläggen (.overlay) blir dialoger: fokus flyttas in, stannar där (Tab), och går tillbaka när de stängs */
  (function a11y() {
    var lastFocus = [];
    function focusables(root) {
      return Array.prototype.filter.call(
        root.querySelectorAll(
          'button:not([disabled]),[href],input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])',
        ),
        function (el) {
          return el.offsetParent !== null || el === document.activeElement;
        },
      );
    }
    function asDialog(ov) {
      if (ov.getAttribute("role")) return;
      ov.setAttribute("role", "dialog");
      ov.setAttribute("aria-modal", "true");
      var h = ov.querySelector("h2,h3,.kicker");
      if (h) {
        if (!h.id) h.id = "dlg" + Math.random().toString(36).slice(2, 8);
        ov.setAttribute("aria-labelledby", h.id);
      }
      lastFocus.push(document.activeElement);
      setTimeout(function () {
        var f = focusables(ov);
        if (f.length) f[0].focus({ preventScroll: true });
      }, 60);
    }
    function asLive(fb) {
      if (fb.getAttribute("aria-live")) return;
      fb.setAttribute("role", "status");
      fb.setAttribute("aria-live", "polite");
    }
    function scan(node) {
      if (node.nodeType !== 1) return;
      if (node.classList.contains("overlay")) asDialog(node);
      if (node.classList.contains("feedback")) asLive(node);
      var fbs = node.querySelectorAll ? node.querySelectorAll(".feedback") : [];
      for (var i = 0; i < fbs.length; i++) asLive(fbs[i]);
    }
    new MutationObserver(function (muts) {
      for (var m = 0; m < muts.length; m++) {
        var a = muts[m].addedNodes,
          r = muts[m].removedNodes,
          i;
        for (i = 0; i < a.length; i++) scan(a[i]);
        for (i = 0; i < r.length; i++) {
          if (r[i].nodeType === 1 && r[i].classList.contains("overlay")) {
            var back = lastFocus.pop();
            if (back && document.contains(back)) back.focus({ preventScroll: true });
          }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var ovs = document.querySelectorAll(".overlay[role=dialog]");
      if (!ovs.length) return;
      var ov = ovs[ovs.length - 1],
        f = focusables(ov);
      if (!f.length) return;
      var first = f[0],
        last = f[f.length - 1];
      if (!ov.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  })();
  welcomeBack();
  idleKick();
  applyColor(); /* färgtema */
  applyScene(); /* scenen bakom Siiri, om en sådan bärs */
  refreshTop();
  prefetchName();
  /* uttal till glosorna: ta fram sparade, hämta det som saknas (även när nätet kommer tillbaka) */
  setTimeout(function () {
    schoolAudio();
  }, 1500);
  window.addEventListener("online", function () {
    schoolAudio();
  });
  /* nya glosor från familjen (app/stores/cloud.ts) – hämta uttalet direkt, inte först nästa gång appen öppnas */
  window.addEventListener("siiri-school", function () {
    schoolAudio();
  });
  setTimeout(seasonFx, 600);
  setTimeout(holidayCard, 300);
  setTimeout(nightOwl, 1000);
  if (!S.setupdone) {
    btnBack.hidden = true;
    setupScreen(true);
  } else {
    /* Nuxt-sidor som flyttats ut ur app.js (t.ex. app/pages/profile.vue) har knappar som
       leder in i skärmar som inte har egna URL:er än - de sparar vilken här innan de laddar
       om på / (se app/utils/legacy-nav.ts), och vi hoppar direkt dit istället för hemskärmen. */
    var openScreen = null;
    try {
      openScreen = sessionStorage.getItem("siiri-open");
      if (openScreen) sessionStorage.removeItem("siiri-open");
    } catch (e) {}
    if (openScreen === "room") go(roomScreen, true);
    else if (openScreen === "shop") go(shopScreen, true);
    else if (openScreen === "words") go(listScreen, true);
    else if (openScreen === "school") go(schoolLessonStart, true);
    else if (openScreen === "edit") setupScreen(false);
    else if (openScreen === "schoolimport") go(schoolImport, true);
    else if (openScreen === "admin") askAdmin();
    else homeScreen();
  }
})();
