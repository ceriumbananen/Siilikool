/* Siiris rum (Tuba) som SVG - flyttat nästan ordagrant ur public/legacy/app.js (fWall ... roomSVG,
   dipSVG): väggar, golv, möbler, husdjur, diplomen på väggen och souvenirhyllan från resan.
   Samma SVG-strängar som förut (läses med v-html i app/pages/room.vue); bara det som läste
   spelarens S tar nu emot det som argument (RoomCtx). Ingen användarinmatning passerar här,
   utom namnet på diplomet, som escapas. */

export type RoomCtx = {
  /** Vad som står på en plats i rummet (furnOf i shop.ts). */
  furnOf: (slot: string) => string | null;
  /** Diplomen: tema-id -> antal stjärnor (S.diplomas). */
  diplomas: Record<string, number>;
  /** Hur många orter på resan som är klara (souvenirerna på hyllan). */
  tripDone: number;
};

let ctx: RoomCtx;

function escHtml(s: string): string {
  return String(s).replace(
    /[&<>"']/g,
    c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function fWall(id: string | null) {
  var base = {
    "w-panel": ["#EFE3CC", "#E2D3B8", "#C8B698"],
    "w-mint": ["#E4F0E2", "#CFE4CC", "#A9CBA6"],
    "w-rose": ["#F6E6E4", "#EBD2CF", "#D2ADA8"],
    "w-blue": ["#E2EDF6", "#CBDFEE", "#A5C2DA"],
    "w-stars": ["#2B3A63", "#223052", "#16213C"],
  }[id ?? ""] || ["#EFE3CC", "#E2D3B8", "#C8B698"];
  var s =
    '<linearGradient id="g-wall" x1="0" y1="0" x2="0.25" y2="1">' +
    '<stop offset="0%" stop-color="' +
    base[0] +
    '"/><stop offset="48%" stop-color="' +
    base[1] +
    '"/>' +
    '<stop offset="100%" stop-color="' +
    base[2] +
    '"/></linearGradient>';
  var body = '<rect width="400" height="202" fill="url(#g-wall)"/>',
    x;
  for (x = 0; x <= 400; x += 24) {
    body +=
      '<rect x="' +
      x +
      '" y="0" width="1.4" height="202" fill="#000" opacity=".03"/>' +
      '<rect x="' +
      (x + 1.4) +
      '" y="0" width="1.2" height="202" fill="#fff" opacity=".10"/>';
  }
  if (id === "w-stars") {
    var i, sx, sy;
    for (i = 0; i < 34; i++) {
      sx = ((i * 97) % 380) + 10;
      sy = ((i * 53) % 170) + 8;
      body +=
        '<path d="M' +
        sx +
        " " +
        (sy - 3.2) +
        ' l1 2.2 l2.4 .3 l-1.8 1.7 l.5 2.4 l-2.1 -1.2 l-2.1 1.2 l.5 -2.4 l-1.8 -1.7 l2.4 -.3 z" fill="#F6E28A" opacity="' +
        (0.5 + (i % 3) * 0.2) +
        '"/>';
    }
    body +=
      '<circle cx="340" cy="38" r="16" fill="#F8EDBE" opacity=".9"/><circle cx="333" cy="33" r="13" fill="' +
      base[0] +
      '"/>';
  }
  body +=
    '<rect x="0" y="0" width="34" height="202" fill="#3A2A18" opacity=".10"/>' +
    '<rect x="366" y="0" width="34" height="202" fill="#3A2A18" opacity=".08"/>' +
    '<rect x="0" y="0" width="400" height="16" fill="#3A2A18" opacity=".12"/>';
  /* bröstpanel */
  var wain = id === "w-stars" ? "#33436E" : "#EADCC0";
  body +=
    '<rect x="0" y="150" width="400" height="46" fill="' +
    wain +
    '"/>' +
    '<rect x="0" y="147" width="400" height="5" rx="2.5" fill="#D9C8AB" opacity=".9"/>' +
    '<rect x="0" y="147" width="400" height="2" fill="#FFF6E6" opacity=".7"/>';
  for (x = 12; x < 400; x += 64) {
    body +=
      '<rect x="' +
      x +
      '" y="158" width="48" height="30" rx="3" fill="none" stroke="#C6B294" stroke-width="1.8" opacity=".8"/>';
  }
  body += '<rect x="0" y="190" width="400" height="6" fill="#B9A585"/>';
  return { defs: s, body: body };
}
function fFloor(id: string | null) {
  var c = {
    "f-wood": ["#C39A68", "#AC8352", "#8A6238"],
    "f-dark": ["#8A6A4A", "#6E5134", "#4E3721"],
    "f-tile": ["#DCD2C2", "#C3B6A2", "#A2957F"],
  }[id ?? ""] || ["#C39A68", "#AC8352", "#8A6238"];
  var s =
    '<linearGradient id="g-floor" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="' +
    c[0] +
    '"/><stop offset="45%" stop-color="' +
    c[1] +
    '"/>' +
    '<stop offset="100%" stop-color="' +
    c[2] +
    '"/></linearGradient>';
  var body = '<rect y="196" width="400" height="74" fill="url(#g-floor)"/>',
    i,
    x1,
    x2;
  if (id === "f-tile") {
    var r, q;
    for (r = 0; r < 4; r++)
      for (q = -1; q < 9; q++) {
        if ((r + q) % 2) continue;
        var yy = 196 + r * 19,
          hh = 19,
          xx = q * 52 + r * 8,
          ww = 52 + r * 8;
        body +=
          '<rect x="' + xx + '" y="' + yy + '" width="' + ww + '" height="' + hh + '" fill="#F2ECE0" opacity=".5"/>';
      }
  } else {
    for (i = -6; i < 14; i++) {
      x1 = i * 34;
      x2 = 200 + (x1 - 200) * 1.9;
      body += '<path d="M' + x1 + " 196 L" + x2 + ' 270" stroke="#3A2410" stroke-width="1.2" opacity=".15"/>';
    }
  }
  body += '<rect y="193" width="400" height="8" fill="#2A1B0C" opacity=".20"/>';
  return { defs: s, body: body };
}
function fRug(id: string | null) {
  /* illustrerade bilder istället för handritade ellipser (public/images/room/rug-*.webp) -
     samma fasta golv-yta för alla mattor (x62-238,y218-262, en platt 4:1-oval som om man
     såg golvet snett uppifrån), icke-enhetligt skalad dit precis som utsikterna i fönstren. */
  if (id === "r-stripe") {
    return (
      '<ellipse cx="150" cy="240" rx="88" ry="22" fill="#2A1B0C" opacity=".2"/>' +
      '<image href="/images/room/rug-stripe.webp" x="62" y="218" width="176" height="44" preserveAspectRatio="none"/>'
    );
  }
  if (id === "r-folk") {
    return (
      '<ellipse cx="150" cy="240" rx="88" ry="22" fill="#2A1B0C" opacity=".2"/>' +
      '<image href="/images/room/rug-folk.webp" x="62" y="218" width="176" height="44" preserveAspectRatio="none"/>'
    );
  }
  if (id === "r-bear") {
    return (
      '<ellipse cx="150" cy="243" rx="80" ry="19" fill="#2A1B0C" opacity=".2"/>' +
      '<image href="/images/room/rug-bear.webp" x="58" y="219" width="184" height="46" preserveAspectRatio="none"/>'
    );
  }
  var s3 =
    '<ellipse cx="150" cy="240" rx="88" ry="22" fill="#2A1B0C" opacity=".2"/>' +
    '<ellipse cx="150" cy="240" rx="86" ry="21" fill="#B8566A"/>' +
    '<ellipse cx="150" cy="239" rx="66" ry="16" fill="#E0CDAC"/>' +
    '<ellipse cx="150" cy="238" rx="42" ry="10" fill="#A8465C"/>';
  return s3;
}
function fLeft(id: string | null) {
  if (id === "l-bed") {
    /* illustrerad bild istället för handritad SVG (public/images/room/bed.webp), samma
       mönster som husdjuren (katten/fågeln/igelkottvalpen) - skuggan är kvar som vektor. */
    return (
      '<g transform="translate(14,146)"><ellipse cx="46" cy="80" rx="52" ry="9" fill="#2A1B0C" opacity=".22"/>' +
      '<image href="/images/room/bed.webp" x="-6" y="2" width="104" height="54.7"/></g>'
    );
  }
  if (id === "l-desk") {
    /* illustrerad bild istället för handritad SVG (public/images/room/desk.webp), samma
       mönster som sängen/gungstolen - skuggan är kvar som vektor. */
    return (
      '<g transform="translate(20,150)"><ellipse cx="40" cy="78" rx="44" ry="8" fill="#2A1B0C" opacity=".22"/>' +
      '<image href="/images/room/desk.webp" x="-10" y="2" width="101" height="59.5"/></g>'
    );
  }
  if (id === "l-rock") {
    /* illustrerad bild istället för handritad SVG (public/images/room/rocking-chair.webp),
       samma mönster som sängen/husdjuren - skuggan är kvar som vektor. */
    return (
      '<g transform="translate(20,150)"><ellipse cx="40" cy="78" rx="44" ry="8" fill="#2A1B0C" opacity=".22"/>' +
      '<image href="/images/room/rocking-chair.webp" x="-14" y="2" width="108" height="59.5"/></g>'
    );
  }
  /* ingen möbel vald (l-none, def) - tomt golvutrymme, samma mönster som lampa/växt/husdjur
     utan val, så att det finns synligt plats kvar att fylla med köpta möbler. */
  return "";
}
function fRight(id: string | null) {
  if (id === "g-shelf") {
    /* illustrerad bild istället för handritad SVG (public/images/room/bookshelf.webp) -
       samma mönster som sängen/gungstolen - skuggan är kvar som vektor. */
    return (
      '<g transform="translate(348,150)"><ellipse cx="40" cy="70" rx="38" ry="8" fill="#2A1B0C" opacity=".22"/>' +
      '<image href="/images/room/bookshelf.webp" x="0" y="0" width="79" height="65"/></g>'
    );
  }
  if (id === "g-toys") {
    /* illustrerad bild istället för handritad SVG (public/images/room/toy-basket.webp) -
       samma mönster som sängen/gungstolen - skuggan är kvar som vektor. */
    return (
      '<g transform="translate(344,208)"><ellipse cx="24" cy="38" rx="28" ry="6" fill="#2A1B0C" opacity=".22"/>' +
      '<image href="/images/room/toy-basket.webp" x="0" y="-4" width="48" height="42"/></g>'
    );
  }
  if (id === "g-kannel") {
    return (
      '<g transform="translate(344,186)"><ellipse cx="34" cy="58" rx="36" ry="8" fill="#2A1B0C" opacity=".22"/>' +
      '<path d="M4 20 h58 l-10 22 h-38 z" fill="#C08A54"/><path d="M4 20 h58 l-2 5 h-54 z" fill="#E0BC8E"/>' +
      '<g stroke="#F2E4C8" stroke-width="1" opacity=".85"><path d="M10 24 l40 0 M12 29 l36 0 M14 34 l32 0 M16 39 l28 0"/></g>' +
      '<rect x="14" y="42" width="7" height="16" fill="#8A5E30"/><rect x="46" y="42" width="7" height="16" fill="#8A5E30"/></g>'
    );
  }
  /* illustrerad bild istället för handritad vedtrave (public/images/room/wood-basket.webp) -
     mindre och flyttad intill eldstadens högra sida (#roomfire slutar på x=388,y=200 - se
     fire-variabeln i roomSVGInner) istället för det generella "höger"-hörnet. */
  return (
    '<g transform="translate(380,200)"><ellipse cx="0" cy="0" rx="21" ry="4.2" fill="#2A1B0C" opacity=".26"/>' +
    '<image href="/images/room/wood-basket.webp" x="-21" y="-34" width="42" height="34"/></g>'
  );
}
function fArt(id: string | null) {
  /* alla tavelval (+ a-clock i fArtExtra) delar samma centrerade plats (ca 124.8,60) i
     mellanrummet mellan de två fönstren (#roomwindow slutar x91, #roomwindow2 börjar x158.6 -
     se roomSVGInner) - mindre än förut, så den får plats i mellanrummet. Diplomen (fDiplomas)
     fick flytta för att göra plats, se kommentaren där. */
  /* illustrerade bilder istället för handritade ramar (public/images/room/art-*.webp) - samma
     mönster som Köler-tavlan (a-koler) nedan: bilden innehåller redan sin egen ram och
     upphängningssnöre, så den läggs rakt in utan någon extra ritad ram runt om. Bredd/höjd
     följer varje bilds egna proportioner, nederkanten liggandes på samma linje (y=82) som
     a-koler, så tavlorna inte hoppar i höjd beroende på vilken som är vald. */
  if (id === "a-view") {
    return '<g transform="translate(94.8,48.3)"><image href="/images/room/art-landscape.webp" x="0" y="0" width="60" height="33.7"/></g>';
  }
  if (id === "a-map") {
    return '<g transform="translate(96.8,35.2)"><image href="/images/room/art-map.webp" x="0" y="0" width="56" height="46.8"/></g>';
  }
  if (id === "a-photo") {
    return '<g transform="translate(94.8,49.2)"><image href="/images/room/art-family.webp" x="0" y="0" width="60" height="32.8"/></g>';
  }
  if (id === "a-koler") {
    /* illustrerad bild av Johann Kölers "Tütarlaps allikal" (public/images/room/koler-painting.webp) -
       samma mönster som flaggan, bilden innehåller upphängningssnöret. */
    return '<g transform="translate(96.8,38)"><image href="/images/room/koler-painting.webp" x="0" y="0" width="56" height="44"/></g>';
  }
  /* a-none (def, gratis) - flaggan är inte längre ett tavelval här, den hänger alltid ovanför
     eldstaden som en egen, fast sak (se FLAGSVG/roomSVGInner) så att man kan ha flaggan OCH
     en tavla i mellanrummet mellan fönstren samtidigt. */
  return "";
}
/* Estlands flagga - fast, inte ett tavelval (se fArt() ovan) så den kan synas samtidigt som
   en vald tavla mellan fönstren. Centrerad ovanför eldstaden (#roomfire/fire - samma plats
   tavlorna hade innan de flyttade till mellanrummet mellan fönstren). Tryckbar (#roomflag),
   öppnar ett historiekort (ROOM_LORE["a-flag"] i room-lore.ts), se touchLoreSpot i room.vue. */
var FLAGSVG =
  '<g id="roomflag" style="cursor:pointer" tabindex="0" role="button" aria-label="Tryck på flaggan">' +
  '<g transform="translate(306,20)"><image href="/images/room/flag.webp" x="-10" y="-0.8" width="60" height="55.8"/></g>' +
  "</g>";
function fLamp(id: string | null) {
  if (id === "p-floor") {
    return (
      '<g id="roomlamp" style="cursor:pointer" tabindex="0" role="button" aria-label="Tryck på lampan" transform="translate(120,124)">' +
      '<ellipse cx="0" cy="104" rx="16" ry="4" fill="#2A1B0C" opacity=".24"/>' +
      '<rect x="-2" y="18" width="4" height="86" fill="#8A7A5E"/><rect x="-10" y="100" width="20" height="5" rx="2.5" fill="#6E6048"/>' +
      '<path d="M-18 18 h36 l-7 -20 h-22 z" fill="#F2D98A"/><path d="M-18 18 h36 l-1 3 h-34 z" fill="#D8B964"/>' +
      '<ellipse class="lampglow" cx="0" cy="26" rx="22" ry="9" fill="#FFE9A8" opacity=".35"/></g>'
    );
  }
  if (id === "p-lant") {
    return (
      '<g transform="translate(298,74)"><path d="M0 0 v8" stroke="#6E6048" stroke-width="2"/>' +
      '<path d="M-9 8 h18 l-2 22 h-14 z" fill="#8A7A5E"/>' +
      '<path d="M-7 10 h14 l-1.6 18 h-10.8 z" fill="#FFE9A8"/>' +
      '<circle cx="0" cy="19" r="4" fill="#FFC24D"/>' +
      '<ellipse cx="0" cy="19" rx="18" ry="14" fill="#FFE9A8" opacity=".25"/></g>'
    );
  }
  return "";
}
function fPlant(id: string | null) {
  if (id === "v-tree") {
    return (
      '<g transform="translate(378,196)" transform-origin="378 196"><ellipse cx="0" cy="52" rx="24" ry="6" fill="#2A1B0C" opacity=".24"/>' +
      '<rect x="-4" y="16" width="8" height="34" fill="#8A5E30"/>' +
      '<circle cx="0" cy="8" r="20" fill="#4E8A52"/><circle cx="-14" cy="18" r="13" fill="#5CA05E"/>' +
      '<circle cx="14" cy="18" r="13" fill="#3E7A46"/>' +
      '<path d="M-14 50 h28 l-3 10 h-22 z" fill="#C06A4A"/></g>'
    );
  }
  if (id === "v-flow") {
    return (
      '<g transform="translate(366,168)"><ellipse cx="0" cy="34" rx="16" ry="5" fill="#2A1B0C" opacity=".24"/>' +
      '<path d="M-8 10 q0 22 8 24 q8 -2 8 -24 z" fill="#9ACCE2"/><path d="M-8 10 h16 l-1 3 h-14 z" fill="#C6E4F2"/>' +
      '<path d="M0 10 v-16" stroke="#4E8A52" stroke-width="2"/><circle cx="0" cy="-18" r="5" fill="#E86A8A"/>' +
      '<path d="M-5 2 q-8 -6 -9 -14 q8 2 10 12 z" fill="#5CA05E"/>' +
      '<path d="M4 -2 q9 -6 10 -16 q-9 3 -11 14 z" fill="#4E8A52"/>' +
      '<circle cx="-7" cy="-12" r="4" fill="#F6D24A"/><circle cx="7" cy="-10" r="4" fill="#C8A0E2"/></g>'
    );
  }
  if (id === "v-pot") {
    return (
      '<g transform="translate(366,168)"><ellipse cx="0" cy="34" rx="20" ry="5" fill="#2A1B0C" opacity=".24"/>' +
      '<path d="M0 14 q-14 -6 -17 -22 q16 2 19 18 z" fill="#4E8A52"/>' +
      '<path d="M3 14 q14 -9 15 -25 q-16 5 -17 22 z" fill="#69A86A"/>' +
      '<path d="M-12 14 h26 l-4 20 h-18 z" fill="#C06A4A"/><path d="M-12 14 h26 l-1 5 h-24 z" fill="#E08A66"/></g>'
    );
  }
  return "";
}
function fWallExtra(id: string | null) {
  if (id !== "w-wood") return "";
  var s = "",
    y;
  for (y = 0; y < 150; y += 22) {
    s +=
      '<path d="M0 ' +
      y +
      ' h400 v22 h-400 z" fill="#C9A06A" opacity="' +
      (y % 44 ? ".55" : ".75") +
      '"/>' +
      '<path d="M0 ' +
      (y + 22) +
      ' h400" stroke="#8A5E30" stroke-width="1.4" opacity=".5"/>' +
      '<path d="M0 ' +
      (y + 2) +
      ' h400" stroke="#E8C79A" stroke-width="1.2" opacity=".45"/>';
  }
  return s;
}
/* second: det andra fönstret (#roomwindow2) ritar samma himmel, men utan sol/måne - annars
   ser det ut som att det finns två solar/månar på himlen, en per fönster. Stjärnorna/snön får
   gärna synas i båda (ingen ser konstig ut dubblerad), bara den enda sol/månen ska synas en
   gång. */
function fView(id: string | null, second?: boolean) {
  if (id === "u-night") {
    /* AI-illustrerad himmel (public/images/room/view-night-bg.webp, trädsilhuetten är redan
       målad in i bilden) istället för en platt rektangel + handritad trädform. Månen är ett
       eget lager ovanpå (med en pulserande glöd bakom) så den kan glimra för sig - samma
       teknik som eldstadens flammor. Stjärnorna hålls ovanför den målade trädlinjen (under
       ca 60% av höjden var tidigare fri himmel, nu är det samma andel som förut). */
    var s =
        '<image href="/images/room/view-night-bg.webp" x="28" y="34" width="84" height="90" preserveAspectRatio="none"/>',
      i,
      x,
      y;
    for (i = 0; i < 22; i++) {
      x = 32 + ((i * 37) % 76);
      y = 38 + ((i * 23) % 56);
      s +=
        '<circle class="roomstar" cx="' +
        x +
        '" cy="' +
        y +
        '" r="' +
        (0.8 + (i % 3) * 0.4) +
        '" fill="#F6E28A" opacity="' +
        (0.5 + (i % 4) * 0.12) +
        '" style="animation-delay:' +
        ((i * 0.37) % 3.2) +
        "s;animation-duration:" +
        (2.4 + (i % 5) * 0.4) +
        's"/>';
    }
    /* stjärnfall: en sällsynt, kort ljusstrimma som skjuter över himlen - mest osynlig,
       blixnabb när den väl syns. De två fönstren har olika fördröjning så de inte råkar
       skjuta i exakt samma sekund. */
    s +=
      '<g class="shootingstar' +
      (second ? " shootingstar--b" : "") +
      '"><line x1="0" y1="0" x2="-7" y2="-3.5" stroke="url(#shootgrad)" stroke-width="1" stroke-linecap="round"/>' +
      '<circle r="0.9" fill="#FFFFFF"/></g>';
    if (!second) {
      s +=
        '<ellipse class="moonglow" cx="89" cy="50" rx="15" ry="15" fill="url(#moonglow)"/>' +
        '<image class="moonimg" href="/images/room/view-moon.webp" x="79" y="40" width="20" height="20" preserveAspectRatio="xMidYMid meet"/>';
    }
    return s;
  }
  if (id === "u-snow") {
    /* AI-illustrerad snöig by i skymning (public/images/room/view-winter-bg.webp) istället
       för platt rektangel + handritade drivor. Det fallande snöet (roomsnow) är kvar som
       eget CSS-lager ovanpå - bilden har medvetet inget fallande snö inbakat. */
    var s2 =
        '<image href="/images/room/view-winter-bg.webp" x="28" y="34" width="84" height="90" preserveAspectRatio="none"/>',
      j,
      x2,
      y2;
    for (j = 0; j < 26; j++) {
      x2 = 30 + ((j * 31) % 80);
      y2 = 36 + ((j * 19) % 86);
      s2 +=
        '<circle class="roomsnow" cx="' +
        x2 +
        '" cy="' +
        y2 +
        '" r="' +
        (1.2 + (j % 3) * 0.5) +
        '" fill="#FFFFFF" opacity=".9" style="animation-delay:' +
        ((j * 0.23) % 2.6) +
        "s;animation-duration:" +
        (2.2 + (j % 4) * 0.35) +
        's"/>';
    }
    return s2;
  }
  if (id === "u-sygis") {
    /* Höstregn (public/images/room/view-autumn-bg.webp) - inte köpbar, bara ett automatiskt
       säsongsbyte (se förvalet nedan). Regnet är randiga streck som faller snabbt och
       vinklat, samma teknik som roomsnow men brantare/snabbare och genomskinligare. Plus
       ett par enstaka snöflingor (blötsnö/slask i sen höst) och löv som fladdrar i vinden. */
    var s3 =
        '<image href="/images/room/view-autumn-bg.webp" x="28" y="34" width="84" height="90" preserveAspectRatio="none"/>',
      k,
      x3,
      y3,
      m,
      x4,
      y4,
      n,
      x5,
      y5,
      leafCols = ["#D97F2E", "#B5542A", "#D9A52E"];
    for (k = 0; k < 20; k++) {
      x3 = 30 + ((k * 29) % 80);
      y3 = 36 + ((k * 17) % 86);
      s3 +=
        '<line class="roomrain" x1="' +
        x3 +
        '" y1="' +
        y3 +
        '" x2="' +
        (x3 - 2) +
        '" y2="' +
        (y3 + 7) +
        '" stroke="#CFE3EE" stroke-width="0.8" stroke-linecap="round" opacity=".55" style="animation-delay:' +
        ((k * 0.17) % 1.4) +
        "s;animation-duration:" +
        (0.7 + (k % 3) * 0.15) +
        's"/>';
    }
    for (m = 0; m < 5; m++) {
      x4 = 34 + ((m * 43) % 74);
      y4 = 40 + ((m * 31) % 70);
      s3 +=
        '<circle class="roomsnow" cx="' +
        x4 +
        '" cy="' +
        y4 +
        '" r="1" fill="#FFFFFF" opacity=".7" style="animation-delay:' +
        ((m * 0.5) % 2.6) +
        "s;animation-duration:" +
        (2.4 + (m % 3) * 0.4) +
        's"/>';
    }
    for (n = 0; n < 7; n++) {
      x5 = 32 + ((n * 26) % 78);
      y5 = 38 + ((n * 34) % 50);
      s3 +=
        '<g transform="translate(' +
        x5 +
        "," +
        y5 +
        ") rotate(" +
        ((n * 51) % 360) +
        ')"><path class="roomleaf" d="M0,-2.4 Q1.6,-1 1.2,0.6 Q0.5,2 0,2.4 Q-0.5,2 -1.2,0.6 Q-1.6,-1 0,-2.4 Z" fill="' +
        leafCols[n % leafCols.length] +
        '" opacity=".75" style="animation-delay:' +
        ((n * 0.44) % 3.4) +
        "s;animation-duration:" +
        (2.8 + (n % 3) * 0.5) +
        's"/></g>';
    }
    return s3;
  }
  if (id === "u-day") {
    /* förvalet (def:1, gratis) - dynamiskt: visar natt på kvällen/natten, snö på vintern och
       regn på hösten, genom att återanvända u-night/u-snow/u-sygis-ritningarna ovan istället
       för en egen scen. Köpta vyer (u-night/u-snow) ändras INTE av detta - de är ett medvetet,
       betalt val som ska vara kvar som man valde det, året och dygnet runt. u-sygis finns
       bara här - höstregnet är inte köpbart i butiken. */
    var hour = new Date().getHours();
    if (hour < 6 || hour >= 21) return fView("u-night", second);
    if (seasonId() === "vinter") return fView("u-snow", second);
    if (seasonId() === "sygis") return fView("u-sygis", second);
    /* AI-illustrerad sommaräng (public/images/room/view-day-bg.webp) istället för platt
       rektangel + handritade molnbågar. Solen är ett eget lager ovanom (egen glöd redan
       inbakad i bilden, se view-sun.webp) så den kan glimra för sig - samma teknik som
       månen/eldens flammor. */
    return (
      '<image href="/images/room/view-day-bg.webp" x="28" y="34" width="84" height="90" preserveAspectRatio="none"/>' +
      (second
        ? ""
        : '<image class="sunimg" href="/images/room/view-sun.webp" x="84" y="34" width="26" height="21" preserveAspectRatio="xMidYMid meet"/>')
    );
  }
  return fView("u-day", second);
}
function fRugExtra(id: string | null) {
  if (id !== "r-star") return null;
  /* illustrerad bild istället för handritad ellips+stjärnor (public/images/room/rug-star.webp) -
     samma fasta golv-yta som de andra mattorna, se fRug() ovan. */
  return (
    '<ellipse cx="150" cy="240" rx="88" ry="22" fill="#2A1B0C" opacity=".2"/>' +
    '<image href="/images/room/rug-star.webp" x="62" y="218" width="176" height="44" preserveAspectRatio="none"/>'
  );
}
function fLeftExtra(id: string | null) {
  if (id !== "l-sofa") return null;
  /* illustrerad bild istället för handritad SVG (public/images/room/sofa.webp), samma
     mönster som sängen/gungstolen/skrivbordet - skuggan är kvar som vektor. Benen i bilden
     når ända ner till bildens nederkant (ingen marginal kvar efter beskärning), så skuggan
     måste ligga precis vid y=2+59.5=61.5 - annars ser soffan ut att sväva ovanför golvet. */
  return (
    '<g transform="translate(16,150)"><ellipse cx="46" cy="61.5" rx="46" ry="7" fill="#2A1B0C" opacity=".22"/>' +
    /* spegelvänd (scale(-1,1)) så soffan vetter åt andra hållet - bilden flyttad till x=-89
       (istället för -9) så den spegelvända bilden hamnar på exakt samma plats som innan. */
    '<g transform="scale(-1,1)"><image href="/images/room/sofa.webp" x="-89" y="2" width="98" height="59.5"/></g></g>'
  );
}
function fRightExtra(id: string | null) {
  if (id !== "g-dress") return null;
  return (
    '<g transform="translate(336,156)"><ellipse cx="30" cy="74" rx="36" ry="8" fill="#2A1B0C" opacity=".22"/>' +
    '<rect x="0" y="0" width="60" height="72" rx="4" fill="#B07C48"/>' +
    '<rect x="0" y="0" width="60" height="6" rx="3" fill="#D8A86A"/>' +
    '<rect x="6" y="10" width="48" height="18" rx="3" fill="#C9A06A"/>' +
    '<rect x="6" y="32" width="48" height="18" rx="3" fill="#C9A06A"/>' +
    '<rect x="6" y="54" width="48" height="14" rx="3" fill="#C9A06A"/>' +
    '<circle cx="30" cy="19" r="2.6" fill="#F2E8D4"/><circle cx="30" cy="41" r="2.6" fill="#F2E8D4"/>' +
    '<circle cx="30" cy="61" r="2.6" fill="#F2E8D4"/>' +
    '<g transform="translate(14,-14)"><path d="M0 14 q-8 -4 -10 -12 q9 1 11 10 z" fill="#4E8A52"/>' +
    '<path d="M2 14 q8 -5 9 -14 q-9 3 -10 12 z" fill="#69A86A"/>' +
    '<path d="M-7 14 h16 l-2 10 h-12 z" fill="#C06A4A"/></g></g>'
  );
}
function fArtExtra(id: string | null) {
  if (id !== "a-clock") return null;
  /* illustrerad bild istället för handritad urtavla (public/images/room/art-clock.webp) - samma
     centrerade plats och nederkant (y=82) som de andra tavelvalen, se fArt() ovan. */
  return '<g transform="translate(99.8,30.8)"><image href="/images/room/art-clock.webp" x="0" y="0" width="50" height="51.2"/></g>';
}
function fLampExtra(id: string | null) {
  if (id !== "p-ceil") return null;
  return (
    '<g id="roomlamp" style="cursor:pointer" tabindex="0" role="button" aria-label="Tryck på lampan" transform="translate(200,0)">' +
    '<rect x="-1.5" y="0" width="3" height="26" fill="#8A7A5E"/>' +
    '<path d="M-22 26 h44 l-9 -16 h-26 z" fill="#E8D8A8"/>' +
    '<path d="M-22 26 h44 l-1.5 3 h-41 z" fill="#C9B882"/>' +
    '<ellipse class="lampglow" cx="0" cy="34" rx="26" ry="11" fill="#FFE9A8" opacity=".35"/></g>'
  );
}
function fPlantExtra(id: string | null) {
  if (id !== "v-cact") return null;
  return (
    '<g transform="translate(366,172)"><ellipse cx="0" cy="30" rx="16" ry="5" fill="#2A1B0C" opacity=".24"/>' +
    '<rect x="-6" y="-14" width="12" height="28" rx="6" fill="#4E8A52"/>' +
    '<rect x="-16" y="-4" width="10" height="8" rx="5" fill="#5CA05E"/>' +
    '<rect x="6" y="-10" width="10" height="8" rx="5" fill="#5CA05E"/>' +
    '<circle cx="0" cy="-18" r="3.4" fill="#E86A8A"/>' +
    '<path d="M-10 14 h20 l-3 16 h-14 z" fill="#C06A4A"/>' +
    '<path d="M-10 14 h20 l-1 4 h-18 z" fill="#E08A66"/></g>'
  );
}
function fPet(id: string | null) {
  if (id === "d-cat") {
    /* illustrerad bild istället för handritad SVG, samma stil som Siiri/rivalerna/
       avatarerna (se public/images/room/cat.webp) - liggande och hoprullad, inte stående
       som duell-rivalerna, eftersom det här är ett husdjur barnet döper, inte en karaktär. */
    return (
      '<g id="roompet" style="cursor:pointer" tabindex="0" role="button" aria-label="Tryck på katten">' +
      '<ellipse cx="110" cy="236" rx="36" ry="6" fill="#2A1B0C" opacity=".18"/>' +
      '<image href="/images/room/cat.webp" x="68" y="188" width="85" height="52.4"/>' +
      "</g>"
    );
  }
  if (id === "d-bird") {
    /* illustrerad fågel istället för handritad SVG (public/images/room/bird.webp) - buren
       (pinne, tak, galler, sittpinne) är kvar som vektor, bara fågeln själv är utbytt. */
    return (
      '<g transform="translate(78,192)">' +
      '<ellipse cx="0" cy="62" rx="18" ry="5" fill="#2A1B0C" opacity=".24"/>' +
      '<rect x="-1.6" y="48" width="3.2" height="14" fill="#8A7A5E"/>' +
      '<path d="M-10 62 h20 l-2 -4 h-16 z" fill="#8A7A5E"/>' +
      '<path d="M0 0 v10" stroke="#8A7A5E" stroke-width="2"/>' +
      '<path d="M-14 10 q14 -8 28 0 v36 q-14 8 -28 0 z" fill="#F2EADA" opacity=".55"/>' +
      '<g stroke="#A8936E" stroke-width="1.2"><path d="M-10 12 v34 M-4 10 v38 M2 10 v38 M8 12 v34"/></g>' +
      '<ellipse cx="0" cy="48" rx="15" ry="4" fill="#A8936E"/>' +
      '<image href="/images/room/bird.webp" x="-13" y="20" width="26" height="26"/>' +
      "</g>"
    );
  }
  if (id === "d-hedge") {
    /* illustrerad valp istället för handritad SVG (public/images/room/hedgehog-pup.webp),
       samma mönster som katten/fågeln - en egen liten figur, inte Siiri själv. */
    return (
      '<g transform="translate(320,234)">' +
      '<ellipse cx="-2" cy="5" rx="18" ry="5" fill="#2A1B0C" opacity=".2"/>' +
      '<image href="/images/room/hedgehog-pup.webp" x="-19" y="-26.6" width="34" height="31.6"/>' +
      "</g>"
    );
  }
  return "";
}
/* diplomen hänger på väggen */
function fDiplomas() {
  var ids = [],
    k;
  for (k in ctx.diplomas) if (ctx.diplomas[k]) ids.push({ id: k, s: ctx.diplomas[k]! });
  if (!ids.length) return "";
  /* en kompakt 2-kolumnsruta i den lediga fickan mellan andra fönstret (slutar x241.4) och
     hyllan/eldstaden (börjar x277, se fShelf/fire) - tavlan (fArt) tog över mellanrummet
     mellan fönstren, så diplomen fick flytta hit istället. Färre märken än innan eftersom
     fickan är smalare. y=30 (inte uppe vid taket) - centrerat ungefär i höjd med fönstren,
     med marginal ner till hyllan som börjar på y94. */
  var s = '<g transform="translate(243,30)">',
    i,
    max = Math.min(6, ids.length);
  for (i = 0; i < max; i++) {
    var col = ids[i]!.s >= 3 ? "#D9A52B" : ids[i]!.s >= 2 ? "#A8A8A8" : "#C08A54";
    var x = (i % 2) * 17,
      y = Math.floor(i / 2) * 22;
    s +=
      '<g transform="translate(' +
      x +
      "," +
      y +
      ')">' +
      '<rect x="1" y="1" width="16" height="18" rx="2" fill="#2A1B0C" opacity=".18"/>' +
      '<rect width="16" height="18" rx="2" fill="#F7F1E2" stroke="' +
      col +
      '" stroke-width="1.3"/>' +
      '<path d="M3.5 6 h9 M3.5 9 h9 M3.5 12 h6" stroke="#B7A98E" stroke-width="1"/>' +
      '<circle cx="12" cy="14.5" r="2.2" fill="' +
      col +
      '"/></g>';
  }
  if (ids.length > 6) s += '<text x="0" y="90" font-size="6" fill="#6E5F4E">+' + (ids.length - 6) + "</text>";
  return s + "</g>";
}
/* souvenirhyllan: visar resans minnen */
function fShelf() {
  var got: { have: boolean; em: string; et: string }[] = [],
    i,
    id: string | undefined;
  for (i = 0; i < TRIP.length; i++) {
    id = SOUVENIR[TRIP[i]!.id];
    got.push({
      have: i < ctx.tripDone,
      em: (SHOP.find(x => x.id === id) || ({} as { em?: string })).em || "🎁",
      et: TRIP[i]!.et,
    });
  }
  /* illustrerad bild istället för handritad hylla (public/images/room/shelf.webp) - bilden
     har två hyllplan rakt framifrån, så troféerna (emoji/platshållarprickar) läggs ovanpå
     på samma sätt som innan, bara omräknat till de nya hyllplanens faktiska höjd i bilden.

     font-size sänkt 9->6: hyllplankorna är bara ca 7.4 resp. 5.9 enheter djupa i bilden (mätt
     i bildens egna pixlar), smalare än en 9px-emojis egen höjd (~10.8 enheter) - för stor
     emoji stack alltså ovanför plankan oavsett var baslinjen (y) sattes, oavsett hyllplan.
     Baslinjerna (5.7/22.4) är omräknade så att emojins "fötter" (textens nedre kant, inte
     mitten - se dess font-metrik) landar precis på plankans framkant istället för mitten. */
  var s = '<g transform="translate(277,94)"><image href="/images/room/shelf.webp" x="0" y="0" width="98" height="34"/>';
  var k, row, col, x, y;
  for (k = 0; k < got.length && k < 20; k++) {
    row = k < 10 ? 0 : 1;
    col = k % 10;
    x = 3 + col * 9.6;
    y = row === 0 ? 5.7 : 22.4;
    if (got[k]!.have) s += '<text x="' + x + '" y="' + y + '" font-size="6">' + got[k]!.em + "</text>";
    else s += '<circle cx="' + (x + 2.3) + '" cy="' + (y - 2.3) + '" r="1.9" fill="#000" opacity=".10"/>';
  }
  return s + "</g>";
}
/** Gör en möbel tryckbar (samma mönster som #roomfire/#roomlamp/#roomwindow/#roompet) - bara
    om det faktiskt finns något att trycka på (t.ex. "ingen möbel"/"ingen växt" ger tomt
    inner, och då ska det inte gå att trycka på osynlig yta). Ordet som sägs slås upp
    dynamiskt från vald möbel i room.vue (FURN_SPOTS), inte hårdkodat här. */
function wrapTap(id: string, label: string, inner: string): string {
  if (!inner) return "";
  return (
    '<g id="' + id + '" style="cursor:pointer" tabindex="0" role="button" aria-label="' + label + '">' + inner + "</g>"
  );
}
function roomSVGInner() {
  var wall = fWall(ctx.furnOf("wall")),
    floor = fFloor(ctx.furnOf("floor"));
  var fire =
    /* illustrerad bild istället för handritad stenomfattning+hylla (public/images/room/fireplace.webp) -
       öppningen (eldstadens valv) är urklippt till transparens i bilden (målad magentafärgad och
       bortnycklad i efterhand), så att den levande elden (FIRESVG - glöd, vedträn, flammor) fortfarande
       syns bakom, omskalad (icke-enhetligt) till valvets faktiska plats och form i den nya bilden. */
    /* storlek ökad och flyttad till höger om Siiri (hon sitter alltid mitt i rummet,
       x~140-260,y~127-246 - se roomSVGInner) - ändras x/y/width/height här måste
       MANTELSVG (scenes.ts) och flamtransformen nedan räknas om på samma sätt,
       annars hamnar dockorna/dalahästen och elden fel. */
    '<g id="roomfire" style="cursor:pointer" tabindex="0" role="button" aria-label="Tryck på elden">' +
    '<g transform="translate(304,133.9) scale(0.517,0.527)">' +
    FIRESVG +
    "</g>" +
    '<image href="/images/room/fireplace.webp" x="264" y="128" width="124" height="72"/>' +
    "</g>";
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 270" class="roomsvg" preserveAspectRatio="xMidYMid slice">' +
    "<defs>" +
    wall.defs +
    floor.defs +
    FIREDEFS +
    '<radialGradient id="g-warm" cx="76%" cy="60%" r="66%"><stop offset="0%" stop-color="#FFC978" stop-opacity=".30"/>' +
    '<stop offset="100%" stop-color="#FFC978" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="g-vign" cx="50%" cy="46%" r="72%"><stop offset="55%" stop-color="#2A1B0C" stop-opacity="0"/>' +
    '<stop offset="100%" stop-color="#2A1B0C" stop-opacity=".30"/></radialGradient>' +
    '<linearGradient id="g-beam" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#FFF6DC" stop-opacity=".5"/>' +
    '<stop offset="100%" stop-color="#FFF6DC" stop-opacity="0"/></linearGradient>' +
    /* månens glöd (fView, u-night) - separat lager bakom måntbilden så den kan pulsera för
       sig, som eldstadens fireglow. */
    '<radialGradient id="moonglow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFF6D6" stop-opacity=".55"/>' +
    '<stop offset="100%" stop-color="#FFF6D6" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="shootgrad" x1="1" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#FFFFFF" stop-opacity="1"/>' +
    '<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>' +
    "</defs>" +
    wall.body +
    fWallExtra(ctx.furnOf("wall")) +
    floor.body +
    /* illustrerad bild istället för handritad ram+gardiner (public/images/room/window.webp) -
       men själva glaset är en transparent urklippt ruta i bilden (målad magentafärgad och
       bortnycklad i efterhand), så att utsikten (fView - natt/snö/hav, alla tre ritade inom
       samma (28,34)-(112,124)-yta) fortfarande syns levande bakom, bara omskalad
       (icke-enhetligt) till rutans faktiska plats och form i den nya bilden.

       Storlek: 82.8x110.4 (69x92 * 1.2) - vid ~84 enheter/meter (sängens skala) var 69x92
       bara ca 0.82x1.10m, i underkant av ett normalt fönster (0.9-1.2m x 1.2-1.5m). 1.2x
       landar på ~0.99x1.31m. Höger-/nedre kanten (x91/y122) oförändrad så fönstret fortfarande
       inte krockar med diplomen (x94-131) eller Siiri (som börjar på y~127). */
    /* ytterligare 8% större (du bad om "några % större") - en ren skalning runt fönstrets
       egen höger-/nedre hörn (x91/y122) ovanpå allt annat nedan, så hela den invändiga
       matematiken (bildens urklippta glasruta, utsiktens omskalning) kan vara orörd. Sen
       en liten knuff nedåt (translate 0,4) eftersom skalning runt hörnet drog upp den. */
    '<g transform="translate(0,4) translate(91,122) scale(1.08) translate(-91,-122)">' +
    '<g id="roomwindow" style="cursor:pointer" tabindex="0" role="button" aria-label="Tryck på fönstret">' +
    '<g transform="translate(11.73,13.08) scale(0.5412,0.6412)">' +
    fView(ctx.furnOf("view")) +
    "</g>" +
    '<image href="/images/room/window.webp" x="8.2" y="11.6" width="82.8" height="110.4"/>' +
    "</g>" +
    "</g>" +
    /* andra fönstret - centrerat ovanför Siiri (hon börjar först på y~127, fönstret slutar
       på y122, så ingen krock trots att hon alltid sitter mitt i rummet). Flaggan/hyllan/
       eldstaden fick flyttas till höger om henne istället (se fArt/fShelf/fire ovan), så
       det här fönstret fyller ut tomrummet i mitten. Tryckbart precis som det första
       fönstret (samma ord, #roomwindow2 i ROOM_SPOTS, se room.vue). Samma 1.2x-storlek som
       det första fönstret, se kommentaren där - centrerat på x=200 istället. */
    /* samma 1.08x-skalning + nedåtknuff som första fönstret, fast runt dess egna
       höger-/nedre hörn (x241.4/y122). */
    '<g transform="translate(0,4) translate(241.4,122) scale(1.08) translate(-241.4,-122)">' +
    '<g id="roomwindow2" style="cursor:pointer" tabindex="0" role="button" aria-label="Tryck på det andra fönstret">' +
    '<g transform="translate(162.13,13.08) scale(0.5412,0.6412)">' +
    fView(ctx.furnOf("view"), true) +
    "</g>" +
    '<image href="/images/room/window.webp" x="158.6" y="11.6" width="82.8" height="110.4"/>' +
    "</g>" +
    "</g>" +
    '<path d="M36 148 L128 148 L196 268 L60 268 Z" fill="url(#g-beam)" opacity=".45"/>' +
    wrapTap("roomart", "Tryck på tavlan", fArtExtra(ctx.furnOf("art")) || fArt(ctx.furnOf("art"))) +
    fShelf() +
    fire +
    fDiplomas() +
    FLAGSVG +
    MANTELSVG +
    wrapTap("roomrug", "Tryck på mattan", fRugExtra(ctx.furnOf("rug")) || fRug(ctx.furnOf("rug"))) +
    wrapTap("roomleft", "Tryck på möbeln", fLeftExtra(ctx.furnOf("left")) || fLeft(ctx.furnOf("left"))) +
    wrapTap("roomright", "Tryck på möbeln", fRightExtra(ctx.furnOf("right")) || fRight(ctx.furnOf("right"))) +
    (fLampExtra(ctx.furnOf("lamp")) || fLamp(ctx.furnOf("lamp"))) +
    wrapTap("roomplant", "Tryck på växten", fPlantExtra(ctx.furnOf("plant")) || fPlant(ctx.furnOf("plant"))) +
    fPet(ctx.furnOf("pet")) +
    '<rect width="400" height="270" fill="url(#g-warm)" style="pointer-events:none"/><rect width="400" height="270" fill="url(#g-vign)" style="pointer-events:none"/>' +
    "</svg>"
  );
}

/** Hela rummet som SVG-sträng. */
export function roomSVG(c: RoomCtx): string {
  ctx = c;
  return roomSVGInner();
}

export function dipSVG(th: { et: string; sv: string }, seals: number, name: string): string {
  var col = seals >= 3 ? "#D9A52B" : seals >= 2 ? "#A8A8A8" : seals >= 1 ? "#C08A54" : "#CFC6B4";
  var s =
    '<svg viewBox="0 0 220 150" style="width:min(74vw,300px);height:auto;display:block;margin:0 auto">' +
    '<rect x="6" y="8" width="208" height="138" rx="5" fill="#2A1B0C" opacity=".14"/>' +
    '<rect x="2" y="4" width="208" height="138" rx="5" fill="#F7F1E2" stroke="' +
    col +
    '" stroke-width="4"/>' +
    '<rect x="10" y="12" width="192" height="122" rx="3" fill="none" stroke="' +
    col +
    '" stroke-width="1.4" opacity=".7"/>' +
    '<text x="106" y="40" text-anchor="middle" font-size="15" font-weight="800" fill="#4A3B2A">DIPLOM</text>' +
    '<text x="106" y="62" text-anchor="middle" font-size="12" fill="#6E5F4E">' +
    escHtml(name) +
    "</text>" +
    '<text x="106" y="84" text-anchor="middle" font-size="13" font-weight="700" fill="#2E4A34">' +
    escHtml(th.et) +
    "</text>" +
    '<text x="106" y="100" text-anchor="middle" font-size="10" fill="#6E5F4E">' +
    escHtml(th.sv) +
    "</text>" +
    "<g>";
  var i;
  for (i = 0; i < 3; i++) {
    var on = i < seals,
      x = 84 + i * 22;
    s +=
      '<circle cx="' +
      x +
      '" cy="118" r="9" fill="' +
      (on ? col : "#E6DECB") +
      '"/>' +
      '<text x="' +
      x +
      '" y="122" text-anchor="middle" font-size="10">' +
      (on ? "⭐" : "") +
      "</text>";
  }
  return s + '</g><text x="106" y="140" text-anchor="middle" font-size="7" fill="#9A8C78">Siilikool</text></svg>';
}

/** Där dagens gömda sak kan ligga i rummet (procent från vänster/uppifrån). */
export const HIDE_SPOTS = [
  { id: "kardin", sv: "bakom gardinen", x: 7, y: 24 },
  { id: "vaip", sv: "under mattan", x: 46, y: 92 },
  { id: "riiul", sv: "på hyllan", x: 82, y: 41 },
  { id: "kamin", sv: "vid brasan", x: 82, y: 61 },
  { id: "lipp", sv: "bakom flaggan", x: 82, y: 17 },
  { id: "aken", sv: "på fönsterbrädan", x: 16, y: 53 },
  { id: "tool", sv: "vid möbeln", x: 12, y: 71 },
  { id: "puud", sv: "i vedkorgen", x: 95, y: 68 },
];
