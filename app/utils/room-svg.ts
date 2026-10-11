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
  if (id === "r-stripe") {
    var s = '<ellipse cx="150" cy="240" rx="88" ry="22" fill="#2A1B0C" opacity=".2"/>',
      i;
    var cols = ["#C85A6A", "#E8D6B4", "#4E8A8C", "#E8D6B4"];
    for (i = 0; i < 8; i++)
      s +=
        '<ellipse cx="150" cy="240" rx="' +
        (86 - i * 10) +
        '" ry="' +
        (21.5 - i * 2.5) +
        '" fill="' +
        cols[i % 4] +
        '"/>';
    return s;
  }
  if (id === "r-folk") {
    var s2 =
        '<ellipse cx="150" cy="240" rx="88" ry="22" fill="#7E3348"/>' +
        '<ellipse cx="150" cy="239" rx="72" ry="18" fill="#E6D2AE"/>' +
        '<ellipse cx="150" cy="238" rx="54" ry="13" fill="#A8465C"/>' +
        '<ellipse cx="150" cy="238" rx="30" ry="7" fill="#E6D2AE"/>',
      k,
      a,
      x,
      y;
    for (k = 0; k < 12; k++) {
      a = (Math.PI * 2 * k) / 12;
      x = 150 + Math.cos(a) * 63;
      y = 239 + Math.sin(a) * 15.5;
      s2 += '<path d="M' + x + " " + (y - 3) + ' l2.4 3 l-2.4 3 l-2.4 -3 z" fill="#2E6B45"/>';
    }
    return s2;
  }
  if (id === "r-bear") {
    return (
      '<g><ellipse cx="150" cy="243" rx="74" ry="18" fill="#6E4E34"/>' +
      '<ellipse cx="150" cy="241" rx="62" ry="15" fill="#8A6845"/>' +
      '<circle cx="80" cy="238" r="15" fill="#6E4E34"/><circle cx="70" cy="228" r="6" fill="#5C3F28"/>' +
      '<circle cx="90" cy="226" r="6" fill="#5C3F28"/><circle cx="75" cy="238" r="2" fill="#2A1B0C"/>' +
      '<circle cx="86" cy="238" r="2" fill="#2A1B0C"/><ellipse cx="80" cy="243" rx="4" ry="3" fill="#3A2A1E"/>' +
      '<circle cx="214" cy="232" r="11" fill="#6E4E34"/><circle cx="208" cy="252" r="11" fill="#6E4E34"/></g>'
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
    return (
      '<g transform="translate(14,146)"><ellipse cx="46" cy="80" rx="52" ry="9" fill="#2A1B0C" opacity=".22"/>' +
      '<rect x="0" y="18" width="12" height="58" rx="4" fill="#8A5E30"/><rect x="80" y="30" width="12" height="46" rx="4" fill="#8A5E30"/>' +
      '<rect x="0" y="4" width="12" height="20" rx="5" fill="#A8713C"/>' +
      '<rect x="4" y="34" width="86" height="18" rx="6" fill="#F3EADA"/>' +
      '<rect x="4" y="40" width="86" height="14" rx="6" fill="#7FA9C9"/>' +
      '<rect x="10" y="28" width="30" height="14" rx="6" fill="#FFFDF6"/>' +
      '<rect x="4" y="52" width="86" height="8" rx="4" fill="#5E87A8"/></g>'
    );
  }
  if (id === "l-desk") {
    return (
      '<g transform="translate(16,150)"><ellipse cx="46" cy="76" rx="48" ry="8" fill="#2A1B0C" opacity=".22"/>' +
      '<rect x="0" y="22" width="92" height="9" rx="3" fill="#B07C48"/><rect x="0" y="22" width="92" height="3" fill="#E0BC8E" opacity=".8"/>' +
      '<rect x="4" y="31" width="9" height="42" rx="3" fill="#8A5E30"/><rect x="79" y="31" width="9" height="42" rx="3" fill="#8A5E30"/>' +
      '<rect x="46" y="31" width="38" height="26" rx="3" fill="#A8713C"/><circle cx="65" cy="44" r="2.4" fill="#E8D2A8"/>' +
      '<rect x="12" y="12" width="26" height="10" rx="2" fill="#C85A6A"/><rect x="14" y="8" width="22" height="6" rx="2" fill="#4E8A8C"/>' +
      '<path d="M66 22 v-10" stroke="#8A5E30" stroke-width="2"/><circle cx="66" cy="10" r="5" fill="#F6D24A"/></g>'
    );
  }
  if (id === "l-rock") {
    return (
      '<g transform="translate(20,150)"><ellipse cx="40" cy="78" rx="44" ry="8" fill="#2A1B0C" opacity=".22"/>' +
      '<path d="M6 30 q0 -26 30 -26 q30 0 30 26 v28 H6 z" fill="#9A6B8C"/>' +
      '<path d="M6 30 q0 -26 30 -26 q10 0 16 5 q-22 5 -26 24 z" fill="#fff" opacity=".16"/>' +
      '<rect x="0" y="52" width="72" height="16" rx="7" fill="#7E5472"/>' +
      '<path d="M-2 76 q38 -14 76 0" stroke="#6E4A28" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<rect x="8" y="66" width="7" height="10" fill="#6E4A28"/><rect x="57" y="66" width="7" height="10" fill="#6E4A28"/></g>'
    );
  }
  return (
    '<g transform="translate(24,150)"><ellipse cx="34" cy="76" rx="38" ry="9" fill="#2A1B0C" opacity=".22"/>' +
    '<path d="M6 30 q0 -22 28 -22 q28 0 28 22 v34 H6 z" fill="#6A9A7A"/>' +
    '<path d="M6 30 q0 -22 28 -22 q10 0 16 5 q-22 4 -26 22 z" fill="#fff" opacity=".14"/>' +
    '<rect x="0" y="52" width="68" height="18" rx="7" fill="#5E8A6B"/>' +
    '<rect x="-2" y="44" width="12" height="26" rx="5" fill="#446B52"/><rect x="58" y="44" width="12" height="26" rx="5" fill="#446B52"/>' +
    '<rect x="8" y="68" width="7" height="9" rx="2" fill="#6E4A28"/><rect x="53" y="68" width="7" height="9" rx="2" fill="#6E4A28"/>' +
    '<g transform="translate(14,34) rotate(-8)"><rect x="0" y="0" width="26" height="20" rx="5" fill="#E2C46A"/>' +
    '<rect x="0" y="0" width="26" height="6" rx="3" fill="#F2DC9C" opacity=".8"/></g></g>'
  );
}
function fRight(id: string | null) {
  if (id === "g-shelf") {
    return (
      '<g transform="translate(348,150)"><ellipse cx="32" cy="90" rx="38" ry="8" fill="#2A1B0C" opacity=".22"/>' +
      '<rect x="0" y="0" width="64" height="88" rx="3" fill="#A8713C"/>' +
      '<rect x="4" y="4" width="56" height="80" fill="#7A5230"/>' +
      '<rect x="4" y="28" width="56" height="5" fill="#A8713C"/><rect x="4" y="54" width="56" height="5" fill="#A8713C"/>' +
      '<g><rect x="8" y="8" width="7" height="20" fill="#C85A6A"/><rect x="17" y="10" width="6" height="18" fill="#4E8A8C"/>' +
      '<rect x="25" y="7" width="8" height="21" fill="#E8B62C"/><rect x="35" y="12" width="6" height="16" fill="#7E5AA8"/>' +
      '<rect x="8" y="36" width="6" height="18" fill="#5C9C5E"/><rect x="16" y="34" width="8" height="20" fill="#C06A4A"/>' +
      '<rect x="26" y="38" width="7" height="16" fill="#3A72C8"/>' +
      '<circle cx="46" cy="48" r="6" fill="#4E8A52"/><rect x="43" y="48" width="7" height="6" fill="#C06A4A"/></g></g>'
    );
  }
  if (id === "g-toys") {
    return (
      '<g transform="translate(344,208)"><ellipse cx="30" cy="34" rx="34" ry="7" fill="#2A1B0C" opacity=".22"/>' +
      '<path d="M2 4 h56 l-6 28 h-44 z" fill="#C9A06A"/><path d="M2 4 h56 l-1.4 6 h-53.2 z" fill="#E0BC8E"/>' +
      '<g stroke="#A8824E" stroke-width="1.2" opacity=".6"><path d="M12 10 v20 M24 10 v20 M36 10 v20 M48 10 v20"/></g>' +
      '<circle cx="16" cy="0" r="9" fill="#C85A6A"/><circle cx="34" cy="-2" r="7" fill="#3A72C8"/>' +
      '<path d="M44 2 l6 -10 l6 10 z" fill="#E8B62C"/></g>'
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
  return (
    '<g transform="translate(348,214)"><ellipse cx="24" cy="30" rx="30" ry="6" fill="#2A1B0C" opacity=".26"/>' +
    '<g><g transform="translate(4,18)"><ellipse rx="8.5" ry="7" fill="#6E4524"/><ellipse rx="6.4" ry="5.2" fill="#C89A62"/></g>' +
    '<g transform="translate(23,18)"><ellipse rx="8.5" ry="7" fill="#5E3A1E"/><ellipse rx="6.4" ry="5.2" fill="#B98A54"/></g>' +
    '<g transform="translate(42,18)"><ellipse rx="8.5" ry="7" fill="#6E4524"/><ellipse rx="6.4" ry="5.2" fill="#C89A62"/></g>' +
    '<g transform="translate(13,7)"><ellipse rx="8.5" ry="7" fill="#5E3A1E"/><ellipse rx="6.4" ry="5.2" fill="#BE8F58"/></g>' +
    '<g transform="translate(33,7)"><ellipse rx="8.5" ry="7" fill="#6E4524"/><ellipse rx="6.4" ry="5.2" fill="#C89A62"/></g>' +
    '<g transform="translate(23,-4)"><ellipse rx="8.5" ry="7" fill="#5E3A1E"/><ellipse rx="6.4" ry="5.2" fill="#C29562"/></g></g></g>'
  );
}
function fArt(id: string | null) {
  if (id === "a-view") {
    return (
      '<g transform="translate(150,20)"><rect x="3" y="5" width="96" height="66" rx="3" fill="#2A1B0C" opacity=".22"/>' +
      '<rect width="96" height="66" rx="3" fill="#8A6238"/><rect x="5" y="5" width="86" height="56" fill="#DCEEF6"/>' +
      '<path d="M5 40 q18 -16 34 -4 q14 10 24 -4 q10 -12 23 -2 v27 H5 z" fill="#8FBE7E"/>' +
      '<circle cx="70" cy="20" r="9" fill="#F6D24A"/><path d="M5 52 q22 -8 44 0 q22 8 42 -2 v11 H5 z" fill="#5E8A54"/></g>'
    );
  }
  if (id === "a-map") {
    return (
      '<g transform="translate(150,20)"><rect x="3" y="5" width="96" height="66" rx="3" fill="#2A1B0C" opacity=".22"/>' +
      '<rect width="96" height="66" rx="3" fill="#6E4E2A"/><rect x="5" y="5" width="86" height="56" fill="#F2EAD6"/>' +
      '<path d="M14 40 q6 -14 22 -12 q10 -8 24 -2 q14 -2 18 8 q4 12 -8 16 q-16 6 -34 2 q-18 -2 -22 -12 z" fill="#9EC48E" stroke="#6E8A5E" stroke-width="1"/>' +
      '<circle cx="34" cy="30" r="2.2" fill="#C8305A"/><circle cx="56" cy="38" r="2" fill="#C8305A"/><circle cx="70" cy="34" r="2" fill="#C8305A"/>' +
      '<path d="M34 30 L56 38 L70 34" stroke="#C8305A" stroke-width="1.2" fill="none" stroke-dasharray="3 2"/></g>'
    );
  }
  if (id === "a-photo") {
    return (
      '<g transform="translate(150,20)"><rect x="3" y="5" width="96" height="66" rx="3" fill="#2A1B0C" opacity=".22"/>' +
      '<rect width="96" height="66" rx="3" fill="#C9A06A"/><rect x="6" y="6" width="84" height="54" fill="#FBF6EA"/>' +
      '<circle cx="34" cy="30" r="11" fill="#E8D2B4"/><circle cx="34" cy="30" r="8" fill="#C9A98A"/>' +
      '<circle cx="60" cy="33" r="9" fill="#E8D2B4"/><circle cx="60" cy="33" r="6.4" fill="#C9A98A"/>' +
      '<path d="M18 52 q16 -12 32 0 q14 -10 28 0 v8 H18 z" fill="#8FA8C4"/>' +
      '<path d="M26 20 q8 -8 16 0" stroke="#8A6238" stroke-width="2" fill="none"/></g>'
    );
  }
  return (
    '<g transform="translate(150,20)"><rect x="3" y="5" width="96" height="66" rx="3" fill="#2A1B0C" opacity=".22"/>' +
    '<rect width="96" height="66" rx="3" fill="#8A6238"/><rect x="5" y="5" width="86" height="56" fill="#F7F7F7"/>' +
    '<rect x="5" y="5" width="86" height="18.7" fill="#0072CE"/><rect x="5" y="23.7" width="86" height="18.7" fill="#141414"/>' +
    '<rect x="5" y="42.4" width="86" height="18.6" fill="#FAFAFA"/>' +
    '<rect x="5" y="5" width="86" height="56" fill="none" stroke="#6E4E2A" stroke-width="1.2"/></g>'
  );
}
function fLamp(id: string | null) {
  if (id === "p-floor") {
    return (
      '<g transform="translate(120,124)"><ellipse cx="0" cy="104" rx="16" ry="4" fill="#2A1B0C" opacity=".24"/>' +
      '<rect x="-2" y="18" width="4" height="86" fill="#8A7A5E"/><rect x="-10" y="100" width="20" height="5" rx="2.5" fill="#6E6048"/>' +
      '<path d="M-18 18 h36 l-7 -20 h-22 z" fill="#F2D98A"/><path d="M-18 18 h36 l-1 3 h-34 z" fill="#D8B964"/>' +
      '<ellipse cx="0" cy="26" rx="22" ry="9" fill="#FFE9A8" opacity=".35"/></g>'
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
function fView(id: string | null) {
  if (id === "u-night") {
    var s = '<rect x="28" y="34" width="84" height="90" fill="#223052"/>',
      i,
      x,
      y;
    for (i = 0; i < 22; i++) {
      x = 32 + ((i * 37) % 76);
      y = 38 + ((i * 23) % 78);
      s +=
        '<circle cx="' +
        x +
        '" cy="' +
        y +
        '" r="' +
        (0.8 + (i % 3) * 0.4) +
        '" fill="#F6E28A" opacity="' +
        (0.5 + (i % 4) * 0.12) +
        '"/>';
    }
    return (
      s +
      '<circle cx="92" cy="54" r="11" fill="#F8EDBE"/><circle cx="87" cy="50" r="9" fill="#223052"/>' +
      '<path d="M28 104 q22 -14 42 -4 q18 10 42 -4 v28 H28 z" fill="#2E4064"/>'
    );
  }
  if (id === "u-snow") {
    var s2 = '<rect x="28" y="34" width="84" height="90" fill="#CFE2EF"/>',
      j,
      x2,
      y2;
    s2 += '<path d="M28 92 q22 -16 42 -6 q20 10 42 -6 v44 H28 z" fill="#F2F7FB"/>';
    for (j = 0; j < 26; j++) {
      x2 = 30 + ((j * 31) % 80);
      y2 = 36 + ((j * 19) % 86);
      s2 += '<circle cx="' + x2 + '" cy="' + y2 + '" r="' + (1.2 + (j % 3) * 0.5) + '" fill="#FFFFFF" opacity=".9"/>';
    }
    return s2 + '<path d="M44 92 l6 -16 l6 16 z" fill="#E8F2F8"/><path d="M78 96 l7 -18 l7 18 z" fill="#E8F2F8"/>';
  }
  if (id === "u-sea") {
    return (
      '<rect x="28" y="34" width="84" height="90" fill="#BFE0F2"/>' +
      '<circle cx="94" cy="52" r="10" fill="#FFE58A"/>' +
      '<rect x="28" y="84" width="84" height="40" fill="#5AA8C8"/>' +
      '<g stroke="#FFFFFF" stroke-width="1.4" opacity=".7" fill="none">' +
      '<path d="M32 94 q8 -4 16 0 q8 4 16 0 q8 -4 16 0 q8 4 16 0"/>' +
      '<path d="M32 106 q8 -4 16 0 q8 4 16 0 q8 -4 16 0 q8 4 16 0"/></g>' +
      '<path d="M54 84 l8 -16 l8 16 z" fill="#F7EEDC"/><rect x="60" y="68" width="2" height="16" fill="#8A5E30"/>'
    );
  }
  return "";
}
function fRugExtra(id: string | null) {
  if (id !== "r-star") return null;
  var s =
      '<ellipse cx="150" cy="240" rx="88" ry="22" fill="#2A1B0C" opacity=".2"/>' +
      '<ellipse cx="150" cy="240" rx="86" ry="21" fill="#3A4C8A"/>' +
      '<ellipse cx="150" cy="239" rx="64" ry="15" fill="#4E63A8"/>',
    i,
    a,
    x,
    y;
  for (i = 0; i < 14; i++) {
    a = (Math.PI * 2 * i) / 14;
    x = 150 + Math.cos(a) * 70;
    y = 239 + Math.sin(a) * 17;
    s +=
      '<path d="M' +
      x +
      " " +
      (y - 3.4) +
      ' l1.1 2.4 l2.6 .3 l-1.9 1.8 l.5 2.6 l-2.3 -1.3 l-2.3 1.3 l.5 -2.6 l-1.9 -1.8 l2.6 -.3 z" fill="#F6E28A"/>';
  }
  s +=
    '<path d="M150 230 l3.4 7 l7.6 .9 l-5.6 5.4 l1.4 7.6 l-6.8 -3.8 l-6.8 3.8 l1.4 -7.6 l-5.6 -5.4 l7.6 -.9 z" fill="#F8EDBE"/>';
  return s;
}
function fLeftExtra(id: string | null) {
  if (id !== "l-sofa") return null;
  return (
    '<g transform="translate(16,154)"><ellipse cx="46" cy="72" rx="52" ry="9" fill="#2A1B0C" opacity=".22"/>' +
    '<path d="M4 26 q0 -18 20 -18 h44 q20 0 20 18 v22 H4 z" fill="#B85E72"/>' +
    '<path d="M4 26 q0 -18 20 -18 h20 q-16 6 -18 22 z" fill="#fff" opacity=".14"/>' +
    '<rect x="-2" y="40" width="96" height="22" rx="9" fill="#9C4A5E"/>' +
    '<rect x="-4" y="30" width="16" height="32" rx="7" fill="#8A3F52"/>' +
    '<rect x="80" y="30" width="16" height="32" rx="7" fill="#8A3F52"/>' +
    '<rect x="10" y="60" width="8" height="10" rx="2" fill="#6E4A28"/>' +
    '<rect x="74" y="60" width="8" height="10" rx="2" fill="#6E4A28"/>' +
    '<rect x="26" y="20" width="22" height="18" rx="5" fill="#E2C46A" transform="rotate(-8 37 29)"/></g>'
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
  return (
    '<g transform="translate(182,24)"><circle cx="16" cy="18" r="21" fill="#8A6238"/>' +
    '<circle cx="16" cy="18" r="17" fill="#F7F2E6"/>' +
    '<g stroke="#6E5F55" stroke-width="1.4"><path d="M16 5 v3 M16 28 v3 M3 18 h3 M26 18 h3"/></g>' +
    '<path d="M16 18 v-9 M16 18 l7 5" stroke="#33312E" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="16" cy="18" r="2" fill="#33312E"/>' +
    '<path d="M16 39 v6" stroke="#8A6238" stroke-width="3"/><circle cx="16" cy="48" r="5" fill="#C9A06A"/></g>'
  );
}
function fLampExtra(id: string | null) {
  if (id !== "p-ceil") return null;
  return (
    '<g transform="translate(200,0)"><rect x="-1.5" y="0" width="3" height="26" fill="#8A7A5E"/>' +
    '<path d="M-22 26 h44 l-9 -16 h-26 z" fill="#E8D8A8"/>' +
    '<path d="M-22 26 h44 l-1.5 3 h-41 z" fill="#C9B882"/>' +
    '<ellipse cx="0" cy="34" rx="26" ry="11" fill="#FFE9A8" opacity=".35"/></g>'
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
    return (
      '<g id="roompet" transform="translate(70,193) scale(0.6)" style="cursor:pointer">' +
      '<ellipse cx="50" cy="93" rx="27" ry="5" fill="#2A1B0C" opacity=".18"/>' +
      '<g class="pettail">' +
      '<path d="M64,66 C96,66 108,30 86,8 C98,28 96,62 60,60 Z" fill="#F2A765"/>' +
      '<path d="M86,16 C96,32 92,54 68,58" fill="none" stroke="#D98A3E" stroke-width="1.6" opacity=".5" stroke-linecap="round"/>' +
      "</g>" +
      '<ellipse cx="50" cy="62" rx="28" ry="24" fill="#F2A765"/>' +
      '<ellipse cx="50" cy="72" rx="19" ry="16" fill="#FDF4E6"/>' +
      '<path d="M50,78 q0,7 0,11" stroke="#E8C79A" stroke-width="1.3" opacity=".6" stroke-linecap="round"/>' +
      '<ellipse cx="38" cy="85" rx="9.5" ry="7.5" fill="#FDF4E6"/>' +
      '<ellipse cx="62" cy="85" rx="9.5" ry="7.5" fill="#FDF4E6"/>' +
      '<path d="M32,16 Q22,0 42,12 Q38,18 32,16 Z" fill="#F2A765"/>' +
      '<path d="M33,14 Q27,5 39,12 Q36,15.5 33,14 Z" fill="#FBD9B0"/>' +
      '<path d="M68,16 Q78,0 58,12 Q62,18 68,16 Z" fill="#F2A765"/>' +
      '<path d="M67,14 Q73,5 61,12 Q64,15.5 67,14 Z" fill="#FBD9B0"/>' +
      '<circle cx="50" cy="31" r="22" fill="#F2A765"/>' +
      '<g stroke="#D98A3E" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".7">' +
      '<path d="M43,14 q2,5 0,9"/><path d="M50,12 q0,5 0,9"/><path d="M57,14 q-2,5 0,9"/>' +
      "</g>" +
      '<ellipse cx="32" cy="38" rx="5.5" ry="4" fill="#F7C07E" opacity=".5"/>' +
      '<ellipse cx="68" cy="38" rx="5.5" ry="4" fill="#F7C07E" opacity=".5"/>' +
      '<g stroke="#FFFDF8" stroke-width="1.1" stroke-linecap="round" opacity=".9">' +
      '<path d="M28,34 L9,30"/><path d="M28,37 L8,37"/><path d="M28,40 L9,44"/>' +
      '<path d="M72,34 L91,30"/><path d="M72,37 L92,37"/><path d="M72,40 L91,44"/>' +
      "</g>" +
      '<ellipse cx="41.5" cy="33" rx="5" ry="6" fill="#2A2015"/><ellipse cx="58.5" cy="33" rx="5" ry="6" fill="#2A2015"/>' +
      '<circle cx="39.5" cy="29.5" r="1.7" fill="#fff"/><circle cx="56.5" cy="29.5" r="1.7" fill="#fff"/>' +
      '<circle cx="43" cy="35" r=".9" fill="#fff" opacity=".7"/><circle cx="60" cy="35" r=".9" fill="#fff" opacity=".7"/>' +
      '<path d="M46.5,40 L53.5,40 L50,43.5 Z" fill="#E8899A"/>' +
      '<path d="M50,43.5 L50,45.5" stroke="#C47A4A" stroke-width="1"/>' +
      '<path d="M50,45.5 q-4,4 -8,0.6" fill="none" stroke="#C47A4A" stroke-width="1.3" stroke-linecap="round"/>' +
      '<path d="M50,45.5 q4,4 8,0.6" fill="none" stroke="#C47A4A" stroke-width="1.3" stroke-linecap="round"/>' +
      "</g>"
    );
  }
  if (id === "d-bird") {
    return (
      '<g transform="translate(78,192)">' +
      '<ellipse cx="0" cy="62" rx="18" ry="5" fill="#2A1B0C" opacity=".24"/>' +
      '<rect x="-1.6" y="48" width="3.2" height="14" fill="#8A7A5E"/>' +
      '<path d="M-10 62 h20 l-2 -4 h-16 z" fill="#8A7A5E"/>' +
      '<path d="M0 0 v10" stroke="#8A7A5E" stroke-width="2"/>' +
      '<path d="M-14 10 q14 -8 28 0 v36 q-14 8 -28 0 z" fill="#F2EADA" opacity=".55"/>' +
      '<g stroke="#A8936E" stroke-width="1.2"><path d="M-10 12 v34 M-4 10 v38 M2 10 v38 M8 12 v34"/></g>' +
      '<ellipse cx="0" cy="48" rx="15" ry="4" fill="#A8936E"/>' +
      '<ellipse cx="0" cy="34" rx="7" ry="6" fill="#E8B62C"/><circle cx="4" cy="29" r="4.4" fill="#F2C94C"/>' +
      '<path d="M7 29 l5 1.6 l-5 1.6 z" fill="#E86A3A"/><circle cx="5" cy="28" r="1" fill="#2A1B0C"/></g>'
    );
  }
  if (id === "d-hedge") {
    return (
      '<g transform="translate(320,252)"><ellipse cx="0" cy="5" rx="20" ry="5" fill="#2A1B0C" opacity=".24"/>' +
      '<ellipse cx="0" cy="-7" rx="17" ry="13" fill="#8A7055"/>' +
      '<g fill="#6E5540">' +
      '<path d="M-14 -14 l-3 -7 l7 3 z"/><path d="M-6 -18 l-1 -8 l6 5 z"/><path d="M2 -19 l2 -8 l5 6 z"/>' +
      '<path d="M10 -15 l6 -6 l2 7 z"/><path d="M15 -8 l8 -3 l-4 6 z"/></g>' +
      '<ellipse cx="-13" cy="-4" rx="8" ry="7" fill="#F2E4CE"/>' +
      '<circle cx="-16" cy="-6" r="1.4" fill="#2A1B0C"/><circle cx="-10" cy="-6" r="1.4" fill="#2A1B0C"/>' +
      '<ellipse cx="-20" cy="-3" rx="2.2" ry="1.8" fill="#3A2A1E"/></g>'
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
  var s = '<g transform="translate(266,6)">',
    i,
    max = Math.min(8, ids.length);
  for (i = 0; i < max; i++) {
    var col = ids[i]!.s >= 3 ? "#D9A52B" : ids[i]!.s >= 2 ? "#A8A8A8" : "#C08A54";
    var x = (i % 4) * 31,
      y = Math.floor(i / 4) * 33;
    s +=
      '<g transform="translate(' +
      x +
      "," +
      y +
      ')">' +
      '<rect x="1" y="1" width="26" height="29" rx="2" fill="#2A1B0C" opacity=".18"/>' +
      '<rect width="26" height="29" rx="2" fill="#F7F1E2" stroke="' +
      col +
      '" stroke-width="1.8"/>' +
      '<path d="M5 9 h16 M5 13.5 h16 M5 18 h11" stroke="#B7A98E" stroke-width="1.2"/>' +
      '<circle cx="19" cy="23" r="3.4" fill="' +
      col +
      '"/></g>';
  }
  if (ids.length > 8) s += '<text x="0" y="78" font-size="7" fill="#6E5F4E">+' + (ids.length - 8) + " till</text>";
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
  var s =
    '<g transform="translate(150,98)"><rect x="0" y="22" width="98" height="7" rx="2.5" fill="#B07C48"/>' +
    '<rect x="0" y="22" width="98" height="2" fill="#E0BC8E" opacity=".8"/>' +
    '<path d="M0 29 h98 l-4 4 h-90 z" fill="#2A1B0C" opacity=".2"/>' +
    '<path d="M8 29 h10 l-3 6 h-4 z M80 29 h10 l-3 6 h-4 z" fill="#7A5230"/>';
  var k, row, col, x, y;
  for (k = 0; k < got.length && k < 20; k++) {
    row = k < 10 ? 0 : 1;
    col = k % 10;
    x = 6 + col * 9.6;
    y = row === 0 ? -6 : 20;
    if (got[k]!.have) s += '<text x="' + x + '" y="' + y + '" font-size="9">' + got[k]!.em + "</text>";
    else s += '<circle cx="' + (x + 3.4) + '" cy="' + (y - 3.4) + '" r="2.8" fill="#000" opacity=".10"/>';
  }
  /* en liten extra hylla för den övre raden */
  s +=
    '<rect x="0" y="-4" width="98" height="5" rx="2" fill="#B07C48"/>' +
    '<rect x="0" y="-4" width="98" height="1.6" fill="#E0BC8E" opacity=".8"/>';
  return s + "</g>";
}
function roomSVGInner() {
  var wall = fWall(ctx.furnOf("wall")),
    floor = fFloor(ctx.furnOf("floor"));
  var fire = '<g transform="translate(270,92)">' + FIRESVG + "</g>";
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
    "</defs>" +
    wall.body +
    fWallExtra(ctx.furnOf("wall")) +
    floor.body +
    WINDOWSVG +
    fView(ctx.furnOf("view")) +
    '<path d="M36 148 L128 148 L196 268 L60 268 Z" fill="url(#g-beam)" opacity=".45"/>' +
    (fArtExtra(ctx.furnOf("art")) || fArt(ctx.furnOf("art"))) +
    fShelf() +
    fire +
    fDiplomas() +
    MANTELSVG +
    (fRugExtra(ctx.furnOf("rug")) || fRug(ctx.furnOf("rug"))) +
    (fLeftExtra(ctx.furnOf("left")) || fLeft(ctx.furnOf("left"))) +
    (fRightExtra(ctx.furnOf("right")) || fRight(ctx.furnOf("right"))) +
    (fLampExtra(ctx.furnOf("lamp")) || fLamp(ctx.furnOf("lamp"))) +
    (fPlantExtra(ctx.furnOf("plant")) || fPlant(ctx.furnOf("plant"))) +
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
  { id: "riiul", sv: "på hyllan", x: 56, y: 47 },
  { id: "kamin", sv: "vid brasan", x: 78, y: 44 },
  { id: "lipp", sv: "bakom tavlan", x: 36, y: 11 },
  { id: "aken", sv: "på fönsterbrädan", x: 16, y: 53 },
  { id: "tool", sv: "i fåtöljen", x: 12, y: 71 },
  { id: "puud", sv: "i vedtraven", x: 93, y: 86 },
];
