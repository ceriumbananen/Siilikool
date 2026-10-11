/* Porterat nästan ordagrant från public/legacy/app.js: FURS/EYES/myFur/myEye/mixHex/furLayer
   (rad 4832-4964) och gr/shine/wearSVG (rad 4255-4828) - samma SVG-strängar som den gamla
   motorn redan byggde, så pälsplagg/accessoarer/färger ser exakt likadana ut. Läses med
   v-html i SiiriPortrait.vue, precis som legacy redan gjorde via innerHTML - ingen
   användarinmatning passerar här, bara spelets egna klädkoder (S.wear/S.owned/S.fur/S.eye).

   wearing()/owns() motsvarar legacy (S.wear||{})[slot] respektive (S.owned||[]).indexOf(id)>=0,
   men tar emot wear/owned som argument istället för att läsa den globala S - anropas bara en
   gång per wearSVG-anrop (toppen av funktionen), resten av den stora if-kedjan är ren SVG-data
   och orörd. */

export type Fur = { id: string; sv: string; et: string; c: string; o: number };
export type Eye = { id: string; sv: string; c: string };
export type Wear = Record<string, string | undefined>;

function wearing(wear: Wear | undefined, slot: string): string | null {
  return (wear || {})[slot] || null;
}
function owns(owned: string[] | undefined, id: string): boolean {
  return (owned || []).indexOf(id) >= 0;
}

export const FURS: Fur[] = [
  { id: "kreem", sv: "Gräddvit", et: "Kreemjas", c: "#FFFFFF", o: 0 },
  { id: "pruun", sv: "Nötbrun", et: "Pruun", c: "#9A5E2A", o: 0.72 },
  { id: "kaneel", sv: "Kanel", et: "Kaneel", c: "#C07A38", o: 0.7 },
  { id: "hall", sv: "Duvgrå", et: "Hall", c: "#6A757F", o: 0.7 },
  { id: "kuldne", sv: "Gyllene", et: "Kuldne", c: "#D89A12", o: 0.7 },
  { id: "vask", sv: "Koppar", et: "Vasekarva", c: "#B0552C", o: 0.7 },
  { id: "roosa", sv: "Rosa", et: "Roosa", c: "#EE6D9E", o: 0.68 },
  { id: "korall", sv: "Korall", et: "Korall", c: "#E76350", o: 0.68 },
  { id: "sinine", sv: "Himmelsblå", et: "Taevasinine", c: "#5089CE", o: 0.7 },
  { id: "meri", sv: "Havsgrön", et: "Meresinine", c: "#2D918B", o: 0.7 },
  { id: "roheline", sv: "Mossgrön", et: "Sammal", c: "#5C9C5E", o: 0.7 },
  { id: "lilla", sv: "Lavendel", et: "Lavendel", c: "#8E74D8", o: 0.7 },
  { id: "ploom", sv: "Plommon", et: "Ploomikarva", c: "#734184", o: 0.72 },
  { id: "sysi", sv: "Kolsvart", et: "Süsimust", c: "#33384A", o: 0.78 },
];
export const EYES: Eye[] = [
  { id: "pruun", sv: "Nötbrun", c: "#7A5836" },
  { id: "merevaik", sv: "Bärnsten", c: "#C98A20" },
  { id: "roheline", sv: "Grön", c: "#4E8C4A" },
  { id: "sinine", sv: "Blå", c: "#3A6FB0" },
  { id: "hall", sv: "Grå", c: "#6E7884" },
  { id: "lilla", sv: "Violett", c: "#7A5AA8" },
  { id: "kuld", sv: "Guld", c: "#D8A32A" },
  { id: "punane", sv: "Rubinröd", c: "#A8323C" },
];
export function myEye(eyeId: string | undefined): Eye {
  var i,
    id = eyeId || "pruun";
  for (i = 0; i < EYES.length; i++) if (EYES[i]!.id === id) return EYES[i]!;
  return EYES[0]!;
}
/* färgen målas med ljus och skugga: ljusare upptill vänster, mättad i mitten,
       mörkare mot kanten – och ansiktet målas tillbaka i originalfärg */
export function mixHex(c: string, t: string, amt: number): string {
  function p(x: string): number {
    return parseInt(x, 16);
  }
  var r = p(c.slice(1, 3)),
    g = p(c.slice(3, 5)),
    b = p(c.slice(5, 7));
  var r2 = p(t.slice(1, 3)),
    g2 = p(t.slice(3, 5)),
    b2 = p(t.slice(5, 7));
  function m(x: number, y: number): string {
    var v = Math.round(x + (y - x) * amt).toString(16);
    return v.length < 2 ? "0" + v : v;
  }
  return "#" + m(r, r2) + m(g, g2) + m(b, b2);
}
export function furLayer(f: Fur, idSuffix?: string): string {
  if (!f.o) return "";
  var sfx = idSuffix || "",
    mid = "fmask-" + f.id + sfx,
    gid = "fgrad-" + f.id + sfx,
    rid = "frim-" + f.id + sfx;
  var light = mixHex(f.c, "#FFFFFF", 0.42),
    dark = mixHex(f.c, "#2A1E14", 0.38);
  var rings = [
      [60, 65, 0.22],
      [53, 58, 0.3],
      [46, 51, 0.4],
      [39, 44, 0.55],
      [32, 37, 1],
    ],
    i;
  var s =
    "<defs>" +
    '<radialGradient id="' +
    gid +
    '" cx="34%" cy="24%" r="78%">' +
    '<stop offset="0%" stop-color="' +
    light +
    '"/>' +
    '<stop offset="42%" stop-color="' +
    f.c +
    '"/>' +
    '<stop offset="100%" stop-color="' +
    dark +
    '"/></radialGradient>' +
    '<radialGradient id="' +
    rid +
    '" cx="50%" cy="50%" r="50%">' +
    '<stop offset="70%" stop-color="' +
    dark +
    '" stop-opacity="0"/>' +
    '<stop offset="100%" stop-color="' +
    dark +
    '" stop-opacity=".5"/></radialGradient>' +
    '<mask id="' +
    mid +
    '" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">' +
    '<use href="#siiriPic"/></mask>';
  for (i = 0; i < rings.length; i++) {
    s +=
      '<clipPath id="fc' +
      i +
      sfx +
      '"><ellipse cx="100" cy="' +
      (119 - i) +
      '" rx="' +
      rings[i]![0] +
      '" ry="' +
      rings[i]![1] +
      '"/></clipPath>';
  }
  s +=
    "</defs>" +
    '<g mask="url(#' +
    mid +
    ')">' +
    '<rect x="0" y="0" width="200" height="200" fill="url(#' +
    gid +
    ')" opacity="' +
    f.o +
    '"/>' +
    '<rect x="0" y="0" width="200" height="200" fill="url(#' +
    rid +
    ')" opacity="' +
    (f.o * 0.8).toFixed(2) +
    '"/>' +
    "</g>";
  for (i = 0; i < rings.length; i++) {
    s += '<g clip-path="url(#fc' + i + sfx + ')" opacity="' + rings[i]![2] + '"><use href="#siiriPic"/></g>';
  }
  return s;
}
export function myFur(furId: string | undefined): Fur {
  var i,
    id = furId || "kreem";
  for (i = 0; i < FURS.length; i++) if (FURS[i]!.id === id) return FURS[i]!;
  return FURS[0]!;
}

function gr(id: string, c1: string, c2: string, x1?: number, y1?: number, x2?: number, y2?: number): string {
  return (
    '<linearGradient id="' +
    id +
    '" x1="' +
    (x1 || 0) +
    '" y1="' +
    (y1 || 0) +
    '" x2="' +
    (x2 || 0.35) +
    '" y2="' +
    (y2 || 1) +
    '">' +
    '<stop offset="0%" stop-color="' +
    c1 +
    '"/><stop offset="100%" stop-color="' +
    c2 +
    '"/></linearGradient>'
  );
}
function shine(id: string, op?: number): string {
  return (
    '<linearGradient id="' +
    id +
    '" x1="0" y1="0" x2="0.2" y2="1">' +
    '<stop offset="0%" stop-color="#fff" stop-opacity="' +
    (op || 0.45) +
    '"/>' +
    '<stop offset="55%" stop-color="#fff" stop-opacity="0"/></linearGradient>'
  );
}
export function wearSVG(
  wear: Wear | undefined,
  owned: string[] | undefined,
  slot: string,
  pass?: "front" | "back",
): string {
  var id = wearing(wear, slot);
  if (!id || !owns(owned, id)) return "";
  if (id === "lill")
    return (
      "<g><defs>" +
      gr("g-lill", "#FFA8C6", "#E4548B") +
      "</defs>" +
      '<path d="M141 60 q4 -9 1 -15" stroke="#3E7A3C" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M140 52 q-6 -3 -8 -8 q7 0 9 5" fill="#4E9A52"/>' +
      '<g transform="translate(140,42)">' +
      '<ellipse cx="0" cy="-6.4" rx="4.4" ry="6.4" fill="url(#g-lill)" stroke="#D0407A" stroke-width=".7"/>' +
      '<ellipse cx="6" cy="-2" rx="4.4" ry="6.4" fill="url(#g-lill)" stroke="#D0407A" stroke-width=".7" transform="rotate(72 6 -2)"/>' +
      '<ellipse cx="3.7" cy="5.2" rx="4.4" ry="6.4" fill="url(#g-lill)" stroke="#D0407A" stroke-width=".7" transform="rotate(144 3.7 5.2)"/>' +
      '<ellipse cx="-3.7" cy="5.2" rx="4.4" ry="6.4" fill="url(#g-lill)" stroke="#D0407A" stroke-width=".7" transform="rotate(216 -3.7 5.2)"/>' +
      '<ellipse cx="-6" cy="-2" rx="4.4" ry="6.4" fill="url(#g-lill)" stroke="#D0407A" stroke-width=".7" transform="rotate(288 -6 -2)"/>' +
      '<circle cx="0" cy="0" r="3.8" fill="#F6B93B"/><circle cx="-1.2" cy="-1.2" r="1.4" fill="#FFE9A8"/></g></g>'
    );
  if (id === "myts")
    return (
      "<g><defs>" +
      gr("g-myts", "#E8564020", "#A32A1A") +
      gr("g-myts2", "#F07A5E", "#C03A26") +
      shine("g-mytsS", 0.5) +
      gr("g-mytsB", "#FFFBF2", "#DCCBB2", 0, 0, 0.2, 1) +
      "</defs>" +
      '<path d="M60 58 q2 -34 40 -34 q38 0 40 34 z" fill="url(#g-myts2)"/>' +
      '<g stroke="#A5301F" stroke-width="1.1" opacity=".45" fill="none">' +
      '<path d="M74 55 q6 -22 18 -30"/><path d="M88 57 q3 -24 10 -32"/><path d="M104 57 q4 -24 12 -30"/>' +
      '<path d="M118 55 q2 -20 8 -26"/></g>' +
      '<path d="M60 58 q2 -34 40 -34 q10 0 18 6 q-30 6 -34 28 z" fill="url(#g-mytsS)"/>' +
      '<rect x="55" y="52" width="90" height="13" rx="6.5" fill="url(#g-mytsB)"/>' +
      '<path d="M55 58 h90" stroke="#C9B8A0" stroke-width="1" opacity=".5"/>' +
      '<path d="M60 58 q40 7 80 0" stroke="#7E2416" stroke-width="1.6" fill="none" opacity=".45"/>' +
      '<circle cx="100" cy="20" r="9" fill="url(#g-mytsB)"/>' +
      '<circle cx="97" cy="17" r="3.4" fill="#fff" opacity=".8"/></g>'
    );
  if (id === "talv")
    return (
      "<g><defs>" +
      gr("g-talv", "#5FA0E0", "#1C4E8E") +
      shine("g-talvS", 0.42) +
      gr("g-talvB", "#FFFFFF", "#CFDDEA", 0, 0, 0.2, 1) +
      "</defs>" +
      '<path d="M58 58 q2 -36 42 -36 q40 0 42 36 z" fill="url(#g-talv)"/>' +
      '<g stroke="#17457E" stroke-width="1.2" opacity=".4" fill="none">' +
      '<path d="M72 56 q6 -24 18 -32"/><path d="M88 57 q3 -26 10 -34"/><path d="M106 57 q4 -26 12 -32"/><path d="M120 55 q2 -22 8 -28"/></g>' +
      '<path d="M58 58 q2 -36 42 -36 q10 0 18 6 q-32 6 -36 30 z" fill="url(#g-talvS)"/>' +
      '<g opacity=".92"><path d="M100 30 v13 M93.5 33.5 l13 6.5 M106.5 33.5 l-13 6.5" stroke="#EAF3FC" stroke-width="2.6" stroke-linecap="round"/>' +
      '<circle cx="100" cy="36.5" r="2" fill="#EAF3FC"/></g>' +
      '<rect x="53" y="51" width="94" height="14" rx="7" fill="url(#g-talvB)"/>' +
      '<g stroke="#C3D3E2" stroke-width="1" opacity=".7"><path d="M62 51 v14 M76 51 v14 M90 51 v14 M104 51 v14 M118 51 v14 M132 51 v14"/></g>' +
      '<circle cx="100" cy="15" r="10.5" fill="url(#g-talvB)"/>' +
      '<circle cx="96.5" cy="11.5" r="3.6" fill="#fff" opacity=".85"/></g>'
    );
  if (id === "kroon")
    return (
      "<g><defs>" +
      '<linearGradient id="g-kroon" x1="0" y1="0" x2="0.3" y2="1">' +
      '<stop offset="0%" stop-color="#FFE9A0"/><stop offset="38%" stop-color="#F7C53F"/>' +
      '<stop offset="62%" stop-color="#E5A413"/><stop offset="100%" stop-color="#B87A05"/></linearGradient>' +
      '<linearGradient id="g-kroonB" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#FFF0BC"/><stop offset="50%" stop-color="#F5C63A"/>' +
      '<stop offset="100%" stop-color="#C98A06"/></linearGradient>' +
      "</defs>" +
      '<path d="M66 54 L70 24 L84 40 L100 18 L116 40 L130 24 L134 54 Z" fill="url(#g-kroon)" stroke="#8E5D02" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M70 26 L82 39 L100 21 L118 39 L130 26" fill="none" stroke="#FFF3C8" stroke-width="1.6" opacity=".75"/>' +
      '<rect x="63" y="49" width="74" height="11" rx="5.5" fill="url(#g-kroon)" stroke="#8E5D02" stroke-width="1.4"/>' +
      '<path d="M65 52 h70" stroke="#FFF3C8" stroke-width="1.6" opacity=".7"/>' +
      '<g><circle cx="100" cy="30" r="4.6" fill="#D33B62"/><circle cx="98.6" cy="28.6" r="1.6" fill="#fff" opacity=".75"/>' +
      '<circle cx="78" cy="42" r="3.4" fill="#3B6CD4"/><circle cx="77" cy="41" r="1.2" fill="#fff" opacity=".7"/>' +
      '<circle cx="122" cy="42" r="3.4" fill="#2E8B57"/><circle cx="121" cy="41" r="1.2" fill="#fff" opacity=".7"/>' +
      '<circle cx="70" cy="24" r="2.6" fill="#FFF0BC"/><circle cx="100" cy="18" r="2.8" fill="#FFF0BC"/><circle cx="130" cy="24" r="2.6" fill="#FFF0BC"/></g></g>'
    );
  if (id === "lips")
    return (
      "<g><defs>" +
      gr("g-lips", "#F0567E", "#9E1F42") +
      shine("g-lipsS", 0.5) +
      "</defs>" +
      '<path d="M100 137 q-12 -11 -21 -9 q-5 9 0 18 q10 2 21 -9 z" fill="url(#g-lips)" stroke="#8A1937" stroke-width="1.1"/>' +
      '<path d="M100 137 q12 -11 21 -9 q5 9 0 18 q-10 2 -21 -9 z" fill="url(#g-lips)" stroke="#8A1937" stroke-width="1.1"/>' +
      '<path d="M100 137 q-11 -10 -19 -8 q-2 4 -1 8 z" fill="url(#g-lipsS)"/>' +
      '<path d="M100 137 q11 -10 19 -8 q2 4 1 8 z" fill="url(#g-lipsS)"/>' +
      '<ellipse cx="100" cy="137" rx="5.6" ry="5" fill="#B82A52" stroke="#8A1937" stroke-width="1"/>' +
      '<ellipse cx="98.4" cy="135.4" rx="2" ry="1.6" fill="#fff" opacity=".5"/></g>'
    );
  if (id === "sall")
    return (
      "<g><defs>" +
      gr("g-sall", "#49A972", "#1E6B40") +
      shine("g-sallS", 0.3) +
      "</defs>" +
      '<path d="M124 140 q11 15 7 27 l15 3 q4 -17 -5 -28 z" fill="#1E6B40"/>' +
      '<path d="M126 142 q10 14 6 25 l11 2 q3 -15 -4 -25 z" fill="url(#g-sall)"/>' +
      '<g stroke="#8FE0B4" stroke-width="2.4" opacity=".75"><path d="M129 157 q7 1 11 2"/><path d="M131 149 q7 1 11 2"/></g>' +
      '<path d="M56 127 q44 21 88 0 l3 14 q-47 23 -94 0 z" fill="url(#g-sall)"/>' +
      '<g stroke="#8FE0B4" stroke-width="2.6" opacity=".8" fill="none">' +
      '<path d="M58 131 q42 19 84 0"/><path d="M57 137 q43 20 86 0"/></g>' +
      '<path d="M56 127 q44 21 88 0 l1 5 q-45 21 -90 0 z" fill="url(#g-sallS)"/>' +
      "" +
      '<path d="M57 140 q43 21 86 0" stroke="#145233" stroke-width="1.6" opacity=".5" fill="none"/></g>'
    );
  if (id === "kott")
    return (
      {
        /* väskan centrerad på ryggen (syns bakifrån); remmarna går över axlarna
             och syns framifrån - tillsammans syns hela ryggsäcken bakifrån */
        back:
          "<g><defs>" +
          gr("g-kott", "#E04A74", "#8E1838") +
          "</defs>" +
          '<rect x="74" y="118" width="52" height="55" rx="14" fill="url(#g-kott)" stroke="#7A1430" stroke-width="1.4"/>' +
          '<rect x="80" y="134" width="40" height="20" rx="8" fill="#9E1F42" stroke="#7A1430" stroke-width="1"/>' +
          '<rect x="80" y="134" width="40" height="8" rx="4" fill="#F07A9C" opacity=".35"/>' +
          '<rect x="92" y="114" width="16" height="9" rx="4.5" fill="none" stroke="#7A1430" stroke-width="2.4"/></g>',
        front:
          '<g><path d="M70 122 q-15 7 -19 22" stroke="#7A1430" stroke-width="6" fill="none" stroke-linecap="round"/>' +
          '<path d="M70 122 q-15 7 -19 22" stroke="#C8305A" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
          '<path d="M132 122 q15 7 19 22" stroke="#7A1430" stroke-width="6" fill="none" stroke-linecap="round"/>' +
          '<path d="M132 122 q15 7 19 22" stroke="#C8305A" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
          '<rect x="60" y="130" width="9" height="7" rx="2" fill="#E0C05A" stroke="#A8871F" stroke-width=".8"/>' +
          '<rect x="131" y="130" width="9" height="7" rx="2" fill="#E0C05A" stroke="#A8871F" stroke-width=".8"/></g>',
      }[pass || "front"] || ""
    );
  if (id === "rukkilill")
    return (
      '<g><path d="M141 60 q4 -9 1 -15" stroke="#3E7A3C" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<g transform="translate(140,42)">' +
      '<g transform="scale(1.35)">' +
      '<path d="M0 -9 l3 -5 3 5 5 -1 -2 6 5 3 -5 3 2 6 -5 -1 -3 5 -3 -5 -5 1 2 -6 -5 -3 5 -3 -2 -6 z" fill="#3B6CD4"/>' +
      '<path d="M0 -7 l2 -3 2 3 4 -1 -2 4 4 2 -4 2 2 5 -4 -1 -2 4 -2 -4 -4 1 2 -5 -4 -2 4 -2 -2 -4 z" fill="#5C8BEA" opacity=".8"/>' +
      '</g><circle cx="0" cy="0" r="3.2" fill="#152F6E"/><circle cx="-1" cy="-1" r="1.1" fill="#7FA8F0"/></g></g>'
    );
  if (id === "leib")
    return (
      '<g><rect x="118" y="130" width="30" height="20" rx="6" fill="#4A2F1E" transform="rotate(-10 133 140)"/>' +
      '<rect x="122" y="134" width="22" height="12" rx="4" fill="#6B452B" transform="rotate(-10 133 140)"/>' +
      '<circle cx="128" cy="139" r="1.6" fill="#8A6141"/><circle cx="136" cy="142" r="1.4" fill="#8A6141"/></g>'
    );
  if (id === "kihnu")
    return (
      "<g><defs>" +
      gr("g-kih", "#E4553F", "#9E211A") +
      "</defs>" +
      '<path d="M62 146 q38 16 76 0 l6 40 q-44 20 -88 0 z" fill="url(#g-kih)" stroke="#8E1F18" stroke-width="1"/>' +
      '<g fill="none">' +
      '<path d="M62.6 152 q37.4 16 74.8 0" stroke="#F4D93C" stroke-width="4.2"/>' +
      '<path d="M63.4 160 q36.6 15.5 73.2 0" stroke="#2B4CA8" stroke-width="4.2"/>' +
      '<path d="M64.2 168 q35.8 15 71.6 0" stroke="#F4D93C" stroke-width="4.2"/>' +
      '<path d="M65 176 q35 14.5 70 0" stroke="#1E7A4A" stroke-width="4.2"/>' +
      '<path d="M65.8 184 q34.2 14 68.4 0" stroke="#F4D93C" stroke-width="3.4"/></g>' +
      '<path d="M62 146 q38 16 76 0 l1 6 q-39 17 -78 0 z" fill="#fff" opacity=".22"/></g>'
    );
  if (id === "rahvas")
    return (
      "<g><defs>" +
      gr("g-blus", "#FFFDF6", "#DCD2BE") +
      gr("g-liiv", "#3A3430", "#15120F") +
      gr("g-fork", "#E4553F", "#A8281F") +
      "</defs>" +
      '<path d="M60 142 q40 18 80 0 l7 44 q-47 22 -94 0 z" fill="url(#g-blus)" stroke="#CFC3AC" stroke-width="1"/>' +
      '<path d="M60 142 q40 18 80 0 l2 10 q-42 19 -84 0 z" fill="#FFFFFF" opacity=".55"/>' +
      '<path d="M74 142 q26 12 52 0 l4 27 q-30 14 -60 0 z" fill="url(#g-liiv)" stroke="#0C0A08" stroke-width="1"/>' +
      '<g stroke="#D94334" stroke-width="2.8" fill="none" opacity=".95">' +
      '<path d="M76 147 q24 10 48 0"/><path d="M77 154 q23 10 46 0"/><path d="M78 161 q22 10 44 0"/></g>' +
      '<g stroke="#F4D93C" stroke-width="1.3" fill="none" opacity=".9">' +
      '<path d="M76.5 150.5 q23.5 10 47 0"/><path d="M77.5 157.5 q22.5 10 45 0"/></g>' +
      '<path d="M100 142 v27" stroke="#F4D93C" stroke-width="1.2" opacity=".8"/>' +
      '<path d="M62 170 q38 16 76 0 l2 13 q-40 18 -80 0 z" fill="url(#g-fork)" stroke="#8E1F18" stroke-width="1"/>' +
      '<g stroke="#F4D93C" stroke-width="2.2" fill="none" opacity=".95">' +
      '<path d="M63.5 175 q36.5 15 73 0"/><path d="M64.5 180.5 q35.5 15 71 0"/></g>' +
      '<circle cx="100" cy="141" r="3.6" fill="#D6DDE4" stroke="#8E99A6" stroke-width=".9"/>' +
      '<circle cx="98.8" cy="139.8" r="1.2" fill="#fff"/></g>'
    );
  if (id === "mulgi")
    return (
      "<g><defs>" +
      gr("g-mulgi", "#3A3430", "#121010") +
      "</defs>" +
      '<path d="M58 140 q42 18 84 0 l6 48 q-48 22 -96 0 z" fill="url(#g-mulgi)" stroke="#0B0A09" stroke-width="1"/>' +
      '<path d="M58 140 q42 18 84 0 l1 8 q-43 19 -86 0 z" fill="#fff" opacity=".12"/>' +
      '<g stroke="#D94334" stroke-width="3.2" fill="none">' +
      '<path d="M59.5 147 q40.5 17 81 0"/><path d="M61 161 q39 16 78 0"/></g>' +
      '<g stroke="#F4D93C" stroke-width="1.1" fill="none" opacity=".85">' +
      '<path d="M59.8 150.5 q40.2 17 80.4 0"/><path d="M61.3 164.5 q38.7 16 77.4 0"/></g>' +
      '<path d="M100 142 v46" stroke="#D94334" stroke-width="2.6" opacity=".85"/>' +
      '<g><circle cx="100" cy="152" r="3.8" fill="#E8CC66" stroke="#A8871F" stroke-width=".9"/>' +
      '<circle cx="98.8" cy="150.8" r="1.2" fill="#FFF3C8"/>' +
      '<circle cx="100" cy="167" r="3.8" fill="#E8CC66" stroke="#A8871F" stroke-width=".9"/>' +
      '<circle cx="98.8" cy="165.8" r="1.2" fill="#FFF3C8"/></g></g>'
    );
  if (id === "hobekee")
    return (
      "<g><defs>" +
      gr("g-hob", "#F2F6FA", "#8E9AA8") +
      gr("g-hob2", "#FFFFFF", "#A9B4C0") +
      "</defs>" +
      '<path d="M70 131 q30 17 60 0" stroke="#9EAAB8" stroke-width="3.4" fill="none"/>' +
      '<path d="M70 130 q30 17 60 0" stroke="#EDF2F7" stroke-width="1.4" fill="none" opacity=".9"/>' +
      '<circle cx="100" cy="147" r="16" fill="url(#g-hob)" stroke="#7E8A99" stroke-width="1.2"/>' +
      '<circle cx="100" cy="147" r="11.5" fill="url(#g-hob2)" stroke="#8E99A6" stroke-width="1"/>' +
      '<g stroke="#8E99A6" stroke-width="1.3" opacity=".9">' +
      '<path d="M100 136 v22 M89 147 h22 M92.2 139.2 l15.6 15.6 M107.8 139.2 l-15.6 15.6"/></g>' +
      '<circle cx="100" cy="147" r="4.4" fill="#F4F8FB" stroke="#9EAAB8" stroke-width="1"/>' +
      '<circle cx="98.4" cy="145.4" r="1.6" fill="#fff"/>' +
      '<circle cx="80" cy="136" r="4.4" fill="url(#g-hob2)" stroke="#8E99A6" stroke-width=".9"/>' +
      '<circle cx="120" cy="136" r="4.4" fill="url(#g-hob2)" stroke="#8E99A6" stroke-width=".9"/></g>'
    );
  if (id === "kannel")
    return (
      '<g><path d="M112 128 l36 8 l-6 22 l-30 -8 z" fill="#B07C42" transform="rotate(-6 130 143)"/>' +
      '<path d="M114 132 l30 7 l-4 14 l-26 -7 z" fill="#8A5B2A" transform="rotate(-6 130 143)"/>' +
      '<g stroke="#F0E3C8" stroke-width="1" opacity=".9" transform="rotate(-6 130 143)">' +
      '<path d="M114 134 l30 7 M114 138 l30 7 M114 142 l30 7 M114 146 l29 7"/></g></g>'
    );
  if (id === "torupill")
    return (
      '<g><ellipse cx="128" cy="146" rx="18" ry="14" fill="#C8302F" transform="rotate(-12 128 146)"/>' +
      '<path d="M120 134 l-8 -22" stroke="#8A5B2A" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M136 134 l10 -18" stroke="#8A5B2A" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M140 152 l16 6" stroke="#8A5B2A" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="112" cy="112" r="4" fill="#E0C05A"/></g>'
    );
  if (id === "paasuke2")
    return (
      {
        back: "",
        front:
          '<g transform="translate(42,110) scale(1.05)"><path d="M0 0 q-16 -10 -30 -4 q14 4 22 12 q10 10 22 8 q-10 -6 -14 -16 z" fill="#2B3A56"/>' +
          '<ellipse cx="4" cy="2" rx="13" ry="9" fill="#2B3A56"/><circle cx="14" cy="-2" r="6" fill="#2B3A56"/>' +
          '<path d="M16 2 q6 -1 9 2 q-6 2 -9 0 z" fill="#E8A33C"/><circle cx="16" cy="-4" r="1.6" fill="#fff"/>' +
          '<path d="M12 6 q6 4 12 2 q-4 6 -12 2 z" fill="#C8302F"/>' +
          '<path d="M-8 6 q-18 10 -30 8 q14 -2 22 -10 z" fill="#1E2A40"/></g>',
      }[pass || "front"] || ""
    );
  if (id === "jaanituli")
    return (
      '<g><ellipse cx="100" cy="186" rx="86" ry="18" fill="#FF9A3C" opacity=".3"/>' +
      '<g opacity=".92" transform="translate(-72,-6)">' +
      '<path d="M100 192 q-14 -16 -5 -30 q2 9 9 12 q-4 -14 7 -23 q-2 16 9 25 q5 7 -2 16 z" fill="#FF7A1A"/>' +
      '<path d="M100 192 q-7 -11 -2 -19 q2 7 7 9 q-2 -9 4 -14 q0 10 5 17 q4 5 -2 9 z" fill="#FFD45E"/></g>' +
      '<g opacity=".92" transform="translate(72,-6)">' +
      '<path d="M100 192 q-14 -16 -5 -30 q2 9 9 12 q-4 -14 7 -23 q-2 16 9 25 q5 7 -2 16 z" fill="#FF7A1A"/>' +
      '<path d="M100 192 q-7 -11 -2 -19 q2 7 7 9 q-2 -9 4 -14 q0 10 5 17 q4 5 -2 9 z" fill="#FFD45E"/></g>' +
      '<g fill="#FFC24D"><circle cx="66" cy="150" r="2.4"/><circle cx="138" cy="140" r="2"/><circle cx="82" cy="120" r="1.8"/>' +
      '<circle cx="124" cy="112" r="2.2"/><circle cx="52" cy="176" r="2"/><circle cx="152" cy="168" r="1.8"/></g></g>'
    );
  if (id === "jaatis")
    return (
      "<g><defs>" +
      gr("g-strut", "#F0C489", "#B9873F") +
      "</defs>" +
      '<path d="M131 152 l-6 -16 h15 z" fill="url(#g-strut)" stroke="#9E7030" stroke-width=".8"/>' +
      '<g stroke="#9E7030" stroke-width=".7" opacity=".7">' +
      '<path d="M126.5 139 l10 4 M127.5 143 l8 3 M129 147 l5 2"/></g>' +
      '<circle cx="127.5" cy="133" r="7.4" fill="#F9D7E4" stroke="#E0A9BE" stroke-width=".8"/>' +
      '<circle cx="134.5" cy="136" r="6.2" fill="#FBEBC0" stroke="#DCC78E" stroke-width=".8"/>' +
      '<circle cx="132" cy="127.5" r="6.4" fill="#C7EAD8" stroke="#98C8B0" stroke-width=".8"/>' +
      '<circle cx="125.6" cy="130.6" r="2.2" fill="#fff" opacity=".7"/>' +
      '<path d="M133 122 q2 -4 5 -2" stroke="#C8305A" stroke-width="1.6" fill="none"/>' +
      '<circle cx="133" cy="121.5" r="2.4" fill="#D33B62"/></g>'
    );
  if (id === "raamat")
    return (
      '<g transform="rotate(-8 131 142)"><defs>' +
      gr("g-raam", "#D24A40", "#8E241F") +
      "</defs>" +
      '<rect x="117" y="131" width="28" height="22" rx="2" fill="url(#g-raam)" stroke="#6E1A16" stroke-width="1"/>' +
      '<rect x="119.5" y="133" width="23" height="18" rx="1.5" fill="#F7EEDC" stroke="#D8C9AC" stroke-width=".8"/>' +
      '<path d="M131 133 v18" stroke="#C9B79A" stroke-width="1.8"/>' +
      '<g stroke="#A8957C" stroke-width="1.1" opacity=".9">' +
      '<path d="M122 137 h7 M122 141 h7 M122 145 h5 M133.5 137 h7 M133.5 141 h7 M133.5 145 h5"/></g>' +
      '<path d="M117 131 h28 v3 h-28 z" fill="#fff" opacity=".18"/>' +
      '<path d="M131 131 v22" stroke="#6E1A16" stroke-width="1.6"/></g>'
    );
  if (id === "suusad")
    return (
      '<g><path d="M112 156 q18 -4 36 -2" stroke="#2F6FB5" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M112 163 q18 -4 36 -2" stroke="#D2442F" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M146 120 v34" stroke="#8A6B4E" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="146" cy="152" r="4" fill="none" stroke="#8A6B4E" stroke-width="2"/></g>'
    );
  if (id === "vihmav")
    return (
      '<g><path d="M146 118 v34 q0 8 -8 8" stroke="#6B4A2E" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M120 118 q26 -26 52 0 q-13 -8 -26 -8 q-13 0 -26 8 Z" fill="#C8305A"/>' +
      '<path d="M120 118 q13 -8 26 -8 q13 0 26 8 q-13 10 -26 0 q-13 10 -26 0 Z" fill="#E8557E"/></g>'
    );
  if (id === "lipp")
    return (
      '<g><path d="M136 118 v42" stroke="#8A6B4E" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="138" y="118" width="34" height="8" fill="#0072CE"/>' +
      '<rect x="138" y="126" width="34" height="8" fill="#111"/>' +
      '<rect x="138" y="134" width="34" height="8" fill="#FFF"/>' +
      '<rect x="138" y="118" width="34" height="24" fill="none" stroke="#B8A88E" stroke-width="1"/></g>'
    );
  if (id === "parg")
    return (
      '<g><path d="M52 54 q48 -30 96 0" stroke="#4E9A68" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<circle cx="62" cy="50" r="6" fill="#FF7FA8"/><circle cx="82" cy="40" r="6.5" fill="#FFD45E"/>' +
      '<circle cx="100" cy="36" r="7" fill="#FF9BC0"/><circle cx="118" cy="40" r="6.5" fill="#C9A7F5"/>' +
      '<circle cx="138" cy="50" r="6" fill="#FFD45E"/>' +
      '<circle cx="100" cy="36" r="2.6" fill="#fff"/><circle cx="82" cy="40" r="2.2" fill="#fff"/></g>'
    );
  if (id === "jaanip")
    return (
      '<g><path d="M52 54 q48 -32 96 0" stroke="#3E8C5A" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<circle cx="66" cy="48" r="6" fill="#FFF2B0"/><circle cx="66" cy="48" r="2.4" fill="#F0A81E"/>' +
      '<circle cx="88" cy="38" r="7" fill="#FFF2B0"/><circle cx="88" cy="38" r="2.8" fill="#F0A81E"/>' +
      '<circle cx="112" cy="38" r="7" fill="#FFF2B0"/><circle cx="112" cy="38" r="2.8" fill="#F0A81E"/>' +
      '<circle cx="134" cy="48" r="6" fill="#FFF2B0"/><circle cx="134" cy="48" r="2.4" fill="#F0A81E"/>' +
      '<path d="M76 46 q6 -8 14 -6 M124 46 q-6 -8 -14 -6" stroke="#5FAE72" stroke-width="3" fill="none" stroke-linecap="round"/></g>'
    );
  if (id === "lehed")
    return (
      '<g><path d="M54 54 q46 -28 92 0" stroke="#8A5A2B" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M68 50 q-8 -12 2 -18 q10 6 4 18 z" fill="#D9762F"/>' +
      '<path d="M92 40 q-8 -13 2 -19 q11 6 5 19 z" fill="#E0A14A"/>' +
      '<path d="M116 40 q8 -13 -2 -19 q-11 6 -5 19 z" fill="#C25A28"/>' +
      '<path d="M138 50 q8 -12 -2 -18 q-10 6 -4 18 z" fill="#D9A93F"/></g>'
    );
  if (id === "joulum")
    return (
      '<g><path d="M60 58 q4 -34 42 -34 q30 0 38 22 q-16 14 -80 12 z" fill="#C42B2B"/>' +
      '<rect x="55" y="52" width="90" height="12" rx="6" fill="#FBF6EE"/>' +
      '<circle cx="140" cy="44" r="9" fill="#FBF6EE"/></g>'
    );
  if (id === "smvsall")
    return (
      '<g><path d="M56 128 q44 20 88 0 l3 13 q-47 22 -94 0 z" fill="#0072CE"/>' +
      '<path d="M57 133 q43 19 86 0 l1 5 q-44 20 -88 0 z" fill="#111"/>' +
      '<path d="M58 138 q42 18 84 0 l1 4 q-43 19 -86 0 z" fill="#F4F1EA"/>' +
      '<path d="M124 141 q10 14 6 26 l14 3 q4 -16 -4 -27 z" fill="#0072CE"/>' +
      '<path d="M126 152 h15 M127 158 h15" stroke="#F4F1EA" stroke-width="3"/></g>'
    );
  if (id === "ring")
    return (
      {
        back: "",
        front:
          '<g><circle cx="100" cy="128" r="62" fill="none" stroke="#F4F1EA" stroke-width="15"/>' +
          '<circle cx="100" cy="128" r="62" fill="none" stroke="#E2453C" stroke-width="15" stroke-dasharray="46 46" stroke-dashoffset="23"/></g>',
      }[pass || "front"] || ""
    );
  if (id === "sara")
    return (
      '<g><circle cx="100" cy="104" r="86" fill="url(#sg-aura)"/>' +
      '<g fill="#FFE9A8"><path d="M26 44 l2.6 6 6 .8 -4.4 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4.2 6-.8 z"/>' +
      '<path d="M172 56 l2.2 5 5 .7 -3.6 3.5 1 5-4.6-2.5-4.6 2.5 1-5-3.6-3.5 5-.7 z"/>' +
      '<path d="M164 150 l2 4.6 4.6.6 -3.3 3.2.9 4.6-4.2-2.3-4.2 2.3.9-4.6-3.3-3.2 4.6-.6 z"/>' +
      '<path d="M34 148 l2 4.6 4.6.6 -3.3 3.2.9 4.6-4.2-2.3-4.2 2.3.9-4.6-3.3-3.2 4.6-.6 z"/></g></g>'
    );
  if (id === "tuli")
    return (
      '<g opacity=".95">' +
      '<g stroke="#FFD45E" stroke-width="2" stroke-linecap="round">' +
      '<path d="M32 40 v-14 M32 40 l-10 -10 M32 40 l10 -10 M32 40 l-14 0 M32 40 l14 0"/></g>' +
      '<g stroke="#FF7FA8" stroke-width="2" stroke-linecap="round">' +
      '<path d="M168 52 v-12 M168 52 l-9 -9 M168 52 l9 -9 M168 52 l-12 0 M168 52 l12 0"/></g>' +
      '<g stroke="#8FD3F4" stroke-width="2" stroke-linecap="round">' +
      '<path d="M150 22 v-10 M150 22 l-8 -8 M150 22 l8 -8"/></g></g>'
    );
  if (id === "vikerkaar")
    return (
      '<g opacity=".9">' +
      '<path d="M6 176 a94 94 0 0 1 188 0" fill="none" stroke="#E2453C" stroke-width="9"/>' +
      '<path d="M15 176 a85 85 0 0 1 170 0" fill="none" stroke="#F0A81E" stroke-width="9"/>' +
      '<path d="M24 176 a76 76 0 0 1 152 0" fill="none" stroke="#F3D34A" stroke-width="9"/>' +
      '<path d="M33 176 a67 67 0 0 1 134 0" fill="none" stroke="#5FAE72" stroke-width="9"/>' +
      '<path d="M42 176 a58 58 0 0 1 116 0" fill="none" stroke="#4E8ED2" stroke-width="9"/>' +
      '<path d="M51 176 a49 49 0 0 1 98 0" fill="none" stroke="#9B72D0" stroke-width="9"/></g>'
    );
  if (id === "taevas")
    return (
      '<g><circle cx="100" cy="100" r="99" fill="#1B2A55"/>' +
      '<circle cx="100" cy="100" r="99" fill="url(#sg-night)"/>' +
      '<g fill="#FFF6C8"><circle cx="30" cy="34" r="2.4"/><circle cx="58" cy="18" r="1.6"/><circle cx="92" cy="26" r="2"/>' +
      '<circle cx="132" cy="16" r="1.8"/><circle cx="168" cy="38" r="2.4"/><circle cx="180" cy="80" r="1.8"/>' +
      '<circle cx="18" cy="76" r="2"/><circle cx="24" cy="128" r="1.7"/><circle cx="176" cy="132" r="2.1"/>' +
      '<circle cx="150" cy="60" r="1.5"/><circle cx="46" cy="52" r="1.5"/></g>' +
      '<circle cx="158" cy="30" r="13" fill="#FBF3D0"/><circle cx="152" cy="26" r="11" fill="#1B2A55"/></g>'
    );
  if (id === "virmalised")
    return (
      '<g><circle cx="100" cy="100" r="99" fill="#0E1B3A"/>' +
      '<path d="M0 70 q50 -34 100 -6 q50 28 100 -8 v34 q-50 34 -100 6 q-50 -28 -100 8 z" fill="#3FE0A8" opacity=".55"/>' +
      '<path d="M0 92 q50 -30 100 -4 q50 26 100 -6 v26 q-50 30 -100 4 q-50 -26 -100 6 z" fill="#7BE8F5" opacity=".45"/>' +
      '<path d="M0 116 q50 -26 100 -2 q50 24 100 -4 v22 q-50 26 -100 2 q-50 -24 -100 4 z" fill="#B78BF0" opacity=".38"/>' +
      '<g fill="#FFFDF0"><circle cx="26" cy="26" r="2"/><circle cx="70" cy="14" r="1.6"/><circle cx="120" cy="20" r="2.2"/>' +
      '<circle cx="170" cy="28" r="1.8"/><circle cx="184" cy="96" r="2"/><circle cx="14" cy="104" r="1.7"/></g></g>'
    );
  if (id === "kosmos")
    return (
      '<g><circle cx="100" cy="100" r="99" fill="#070B22"/>' +
      '<g fill="#FFFDF0"><circle cx="22" cy="30" r="2.2"/><circle cx="56" cy="14" r="1.5"/><circle cx="96" cy="22" r="2.6"/>' +
      '<circle cx="140" cy="12" r="1.8"/><circle cx="176" cy="34" r="2.2"/><circle cx="186" cy="88" r="1.6"/>' +
      '<circle cx="12" cy="86" r="2"/><circle cx="20" cy="140" r="1.8"/><circle cx="182" cy="140" r="2.4"/>' +
      '<circle cx="64" cy="176" r="1.6"/><circle cx="140" cy="182" r="2"/></g>' +
      '<circle cx="36" cy="46" r="15" fill="#E8894A"/><ellipse cx="36" cy="46" rx="24" ry="6" fill="none" stroke="#F3D34A" stroke-width="3" transform="rotate(-18 36 46)"/>' +
      '<circle cx="168" cy="66" r="9" fill="#7BA7F0"/>' +
      '<g transform="rotate(24 160 150)"><path d="M156 158 l4 -16 4 16 z" fill="#E2453C"/>' +
      '<path d="M154 158 h12 l-2 6 h-8 z" fill="#D9DEE8"/><circle cx="160" cy="148" r="2.4" fill="#8FD3F4"/></g>' +
      '<g fill="#FFD45E" opacity=".9"><path d="M78 168 l2 5 5 .7 -3.6 3.5 1 5-4.4-2.4-4.4 2.4 1-5-3.6-3.5 5-.7 z"/></g></g>'
    );
  if (id === "vanalinn")
    return (
      "<g><defs>" +
      gr("g-vanalinn", "#F6C879", "#C9703E", 0, 0, 0.3, 1) +
      '<clipPath id="clip-vanalinn"><circle cx="100" cy="100" r="99"/></clipPath>' +
      "</defs>" +
      '<circle cx="100" cy="100" r="99" fill="url(#g-vanalinn)"/>' +
      '<g clip-path="url(#clip-vanalinn)">' +
      '<g fill="#4A2E22">' +
      '<rect x="8" y="128" width="24" height="60"/>' +
      '<rect x="36" y="110" width="18" height="78"/>' +
      '<path d="M36 110 l9 -16 9 16 z"/>' +
      '<rect x="58" y="134" width="20" height="54"/>' +
      '<rect x="148" y="122" width="20" height="66"/>' +
      '<rect x="170" y="138" width="22" height="50"/>' +
      '<rect x="108" y="76" width="16" height="112"/>' +
      '<path d="M108 76 l8 -28 8 28 z"/>' +
      '<rect x="115" y="40" width="2" height="12"/>' +
      "</g>" +
      '<g fill="#F3D34A" opacity=".85">' +
      '<rect x="14" y="146" width="4" height="6"/><rect x="22" y="156" width="4" height="6"/>' +
      '<rect x="64" y="150" width="4" height="6"/><rect x="154" y="140" width="4" height="6"/>' +
      '<rect x="178" y="156" width="4" height="6"/>' +
      "</g>" +
      "</g>" +
      '<circle cx="150" cy="40" r="15" fill="#FFE9A8" opacity=".9"/></g>'
    );
  if (id === "rand2")
    return (
      "<g><defs>" +
      gr("g-rand2sky", "#BFE6F5", "#EAF6FC", 0, 0, 0, 1) +
      gr("g-rand2sea", "#4E9FC9", "#1E5A82", 0, 0, 0, 1) +
      '<clipPath id="clip-rand2"><circle cx="100" cy="100" r="99"/></clipPath>' +
      "</defs>" +
      '<g clip-path="url(#clip-rand2)">' +
      '<rect x="0" y="0" width="200" height="200" fill="url(#g-rand2sky)"/>' +
      '<circle cx="148" cy="48" r="16" fill="#FFE07A"/>' +
      '<rect x="0" y="128" width="200" height="72" fill="url(#g-rand2sea)"/>' +
      '<path d="M0 140 q25 10 50 0 q25 -10 50 0 q25 10 50 0 q25 -10 50 0" stroke="#EAF6FC" stroke-width="3" fill="none" opacity=".6"/>' +
      '<path d="M0 154 q25 10 50 0 q25 -10 50 0 q25 10 50 0 q25 -10 50 0" stroke="#EAF6FC" stroke-width="3" fill="none" opacity=".4"/>' +
      '<rect x="0" y="176" width="200" height="24" fill="#E8D7A8"/>' +
      '<g stroke="#4E8A52" stroke-width="2" fill="none" opacity=".8">' +
      '<path d="M10 178 q2 -12 -2 -20"/><path d="M18 180 q4 -14 0 -22"/>' +
      '<path d="M182 176 q-2 -12 2 -18"/><path d="M190 180 q-4 -14 0 -20"/>' +
      "</g>" +
      "</g></g>"
    );
  if (id === "raba")
    return (
      "<g><defs>" +
      gr("g-rabasky", "#F3C9A0", "#F7E6C4", 0, 0, 0, 1) +
      '<clipPath id="clip-raba"><circle cx="100" cy="100" r="99"/></clipPath>' +
      "</defs>" +
      '<g clip-path="url(#clip-raba)">' +
      '<rect x="0" y="0" width="200" height="200" fill="url(#g-rabasky)"/>' +
      '<circle cx="100" cy="118" r="26" fill="#FFD98A" opacity=".9"/>' +
      '<rect x="0" y="130" width="200" height="70" fill="#9AB89C"/>' +
      '<path d="M0 132 q50 -8 100 0 q50 8 100 0 v6 q-50 8 -100 0 q-50 -8 -100 0 z" fill="#7FA082" opacity=".8"/>' +
      '<g stroke="#5E4A38" stroke-width="2.4" opacity=".55">' +
      '<path d="M20 200 v-46"/><path d="M34 200 v-50"/><path d="M160 200 v-44"/><path d="M176 200 v-52"/>' +
      "</g>" +
      '<g fill="#E8D7B0" opacity=".9"><rect x="86" y="150" width="28" height="4"/><rect x="82" y="158" width="36" height="4"/>' +
      '<rect x="86" y="166" width="28" height="4"/></g>' +
      "</g></g>"
    );
  if (id === "tulekroon")
    return (
      "<g><defs>" +
      '<linearGradient id="g-tulekroon" x1="0" y1="1" x2="0" y2="0">' +
      '<stop offset="0%" stop-color="#8E1F10"/><stop offset="40%" stop-color="#E8430A"/>' +
      '<stop offset="75%" stop-color="#FF8C14"/><stop offset="100%" stop-color="#FFE07A"/></linearGradient>' +
      '<linearGradient id="g-tulekroonB" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#8A2A14"/><stop offset="100%" stop-color="#4A1006"/></linearGradient>' +
      "</defs>" +
      '<path d="M70 54 q-10 -20 -2 -34 q2 10 9 13 q-5 -16 5 -26 q-3 18 8 27 q7 8 -4 20 z" fill="url(#g-tulekroon)"/>' +
      '<path d="M100 54 q-12 -24 -2 -40 q2 12 11 16 q-6 -19 6 -31 q-3 21 9 32 q8 10 -5 23 z" fill="url(#g-tulekroon)"/>' +
      '<path d="M130 54 q10 -20 2 -34 q-2 10 -9 13 q5 -16 -5 -26 q3 18 -8 27 q-7 8 4 20 z" fill="url(#g-tulekroon)"/>' +
      '<rect x="63" y="49" width="74" height="11" rx="5.5" fill="url(#g-tulekroonB)" stroke="#2E0A03" stroke-width="1.4"/>' +
      '<path d="M65 52 h70" stroke="#FFCB6B" stroke-width="1.4" opacity=".55"/>' +
      '<circle cx="100" cy="30" r="3" fill="#FFE07A"/><circle cx="78" cy="38" r="2.2" fill="#FFCB6B"/><circle cx="122" cy="38" r="2.2" fill="#FFCB6B"/></g>'
    );
  if (id === "valk")
    return (
      '<g opacity=".95"><defs>' +
      '<linearGradient id="g-valk" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#FFF3B0"/><stop offset="100%" stop-color="#F6C92B"/></linearGradient>' +
      "</defs>" +
      '<path d="M34 50 l18 -34 l-6 20 l16 -6 l-22 38 l6 -20 z" fill="url(#g-valk)" stroke="#C99A0A" stroke-width="1"/>' +
      '<path d="M176 60 l-16 -32 l5 19 l-15 -5 l20 36 l-5 -19 z" fill="url(#g-valk)" stroke="#C99A0A" stroke-width="1"/>' +
      '<path d="M24 146 l16 -30 l-5 18 l14 -5 l-18 33 l5 -18 z" fill="url(#g-valk)" stroke="#C99A0A" stroke-width="1" opacity=".85"/>' +
      '<path d="M168 152 l-14 -28 l4 16 l-13 -4 l16 30 l-4 -16 z" fill="url(#g-valk)" stroke="#C99A0A" stroke-width="1" opacity=".85"/></g>'
    );
  if (id === "draakon")
    return (
      {
        back: "",
        front:
          "<g><defs>" +
          '<linearGradient id="g-draakon" x1="1" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#8FD98F"/><stop offset="55%" stop-color="#3E8C4A"/>' +
          '<stop offset="100%" stop-color="#1E5A2A"/></linearGradient>' +
          "</defs>" +
          '<g><path d="M148,108 Q160,58 192,34 Q182,64 180,86 Q198,80 198,98 Q184,98 180,112 Q196,120 196,142 Q180,132 174,132 Q180,152 172,170 Q156,138 148,108 Z" fill="url(#g-draakon)" stroke="#143F1C" stroke-width="2"/>' +
          '<g stroke="#143F1C" stroke-width="1.4" opacity=".55" fill="none">' +
          '<path d="M150,106 Q166,70 188,38"/><path d="M154,112 Q176,96 196,98"/><path d="M158,122 Q178,114 194,142"/><path d="M160,132 Q170,142 172,168"/></g></g>' +
          '<g transform="scale(-1,1) translate(-200,0)">' +
          '<path d="M148,108 Q160,58 192,34 Q182,64 180,86 Q198,80 198,98 Q184,98 180,112 Q196,120 196,142 Q180,132 174,132 Q180,152 172,170 Q156,138 148,108 Z" fill="url(#g-draakon)" stroke="#143F1C" stroke-width="2"/>' +
          '<g stroke="#143F1C" stroke-width="1.4" opacity=".55" fill="none">' +
          '<path d="M150,106 Q166,70 188,38"/><path d="M154,112 Q176,96 196,98"/><path d="M158,122 Q178,114 194,142"/><path d="M160,132 Q170,142 172,168"/></g></g></g>',
      }[pass || "front"] || ""
    );
  if (id === "tiivad")
    return (
      {
        back: "",
        front:
          '<g opacity=".92"><defs>' +
          '<linearGradient id="g-tiiv" x1="1" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#D9F1FD"/><stop offset="55%" stop-color="#8FD3F4"/>' +
          '<stop offset="100%" stop-color="#5FA8D8"/></linearGradient>' +
          '<linearGradient id="g-tiiv2" x1="1" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#EAF8FE"/><stop offset="100%" stop-color="#93CDE8"/></linearGradient></defs>' +
          "<g>" +
          '<path d="M46 96 q-34 -30 -34 -4 q0 26 34 22 z" fill="url(#g-tiiv)" stroke="#5FA8D8" stroke-width="1.2"/>' +
          '<path d="M46 116 q-30 4 -28 26 q2 20 28 -8 z" fill="url(#g-tiiv2)" stroke="#7FBEDC" stroke-width="1.1"/>' +
          '<g stroke="#6FB6DA" stroke-width=".9" opacity=".8" fill="none">' +
          '<path d="M44 98 q-16 -6 -26 -2"/><path d="M44 104 q-18 0 -26 6"/><path d="M44 120 q-14 4 -20 14"/></g>' +
          '<circle cx="24" cy="100" r="3" fill="#FFFFFF" opacity=".6"/><circle cx="26" cy="132" r="2.4" fill="#FFFFFF" opacity=".55"/></g>' +
          "<g>" +
          '<path d="M154 96 q34 -30 34 -4 q0 26 -34 22 z" fill="url(#g-tiiv)" stroke="#5FA8D8" stroke-width="1.2"/>' +
          '<path d="M154 116 q30 4 28 26 q-2 20 -28 -8 z" fill="url(#g-tiiv2)" stroke="#7FBEDC" stroke-width="1.1"/>' +
          '<g stroke="#6FB6DA" stroke-width=".9" opacity=".8" fill="none">' +
          '<path d="M156 98 q16 -6 26 -2"/><path d="M156 104 q18 0 26 6"/><path d="M156 120 q14 4 20 14"/></g>' +
          '<circle cx="176" cy="100" r="3" fill="#FFFFFF" opacity=".6"/><circle cx="174" cy="132" r="2.4" fill="#FFFFFF" opacity=".55"/></g></g>',
      }[pass || "front"] || ""
    );
  return "";
}

/* Siiri bygger på en akvarellillustration; ögon, mun och glasögon ritas ovanpå så hon kan blinka och prata */
/* barnets egen igelkott: samma teckning, egen pälsfärg och egna kläder */

/* ---------- Siiri bakifrån (Tuba) - flyttat ur public/legacy/app.js (BACK_SPLIT, backFurColors, siilBackSVG) ---------- */
const BACK_SPLIT: string[] = ["kott", "tiivad", "paasuke2", "draakon", "ring"];
function backFurColors(f: Fur) {
  return {
    rim: f.o ? mixHex(f.c, "#2A1E14", 0.32) : "#B9A787",
    r2: f.o ? mixHex(f.c, "#2A1E14", 0.12) : "#C9BBA3",
    r3: f.o ? f.c : "#D6C7A8",
    r4: f.o ? mixHex(f.c, "#FFFFFF", 0.3) : "#E2D6BC",
    r5: f.o ? mixHex(f.c, "#FFFFFF", 0.55) : "#EBE1CA",
    r6: f.o ? mixHex(f.c, "#FFFFFF", 0.78) : "#F5EFDE",
    base: f.o ? mixHex(f.c, "#FFFFFF", 0.82) : "#FBF7EE",
    stroke: f.o ? mixHex(f.c, "#2A1E14", 0.4) : "#A8987E",
    line: f.o ? mixHex(f.c, "#000000", 0.14) : "#E6DCC8",
  };
}
export function siiriBackSVG(fur: Fur, wear: Wear | undefined, owned: string[] | undefined, size?: string): string {
  var cls = "siiri" + (size ? " " + size : "");
  var f = fur;
  var c = backFurColors(fur);
  /* kott (ryggsäcken) visar bara själva väskan på baksidan, utan remmar -
     de gjorde mer skada (stack upp i luften) än nytta; övriga ryggplagg
     (vingar m.fl.) saknar en egen "back"-del och visas hela via "front" */
  var backItem =
    BACK_SPLIT.indexOf(wearing(wear, "back") ?? "") >= 0
      ? wearSVG(wear, owned, "back", "back") +
        (wearing(wear, "back") === "kott" ? "" : wearSVG(wear, owned, "back", "front"))
      : wearSVG(wear, owned, "back");
  /* sex ringar taggar, från spetsigast/ytterst till kortast/innerst - formerna
     är desamma som tidigare, men fylls nu med den riktiga pälstexturen istället
     för platt färg. HI-delmängden får en diskret vit glansfläck ovanpå. */
  var rings = [
    {
      sw: 1.1,
      d: "M158.4 107.9 L172.5 112.7 L158.8 118.8 Z M156.8 132.6 L167.9 142.5 L153.4 142.9 Z M150.2 149.2 L159.1 162.7 L144.1 158.0 Z M143.1 159.3 L149.6 174.7 L135.5 166.6 Z M128.8 171.4 L130.4 187.7 L119.6 175.9 Z M111.1 178.3 L107.5 193.0 L101.0 179.5 Z M87.7 178.1 L78.0 192.8 L78.0 174.9 Z M74.3 173.1 L62.6 182.9 L65.6 167.5 Z M54.4 156.1 L37.4 161.5 L48.7 147.1 Z M45.4 139.7 L29.6 138.9 L42.4 129.2 Z M41.1 114.2 L28.3 107.2 L42.3 103.3 Z M44.0 96.4 L32.6 85.5 L48.0 86.3 Z M47.2 88.0 L38.0 76.0 L52.4 78.6 Z M59.4 70.0 L53.0 53.3 L67.3 63.2 Z M73.0 59.6 L71.7 42.7 L82.4 55.4 Z M96.9 52.6 L102.4 37.6 L107.0 53.0 Z M114.0 54.3 L123.1 42.8 L123.6 57.8 Z M124.9 58.5 L136.4 48.6 L133.7 63.9 Z M146.1 76.5 L161.5 72.5 L151.7 85.6 Z M153.1 88.7 L169.6 88.1 L156.7 98.9 Z",
      hi: "M158.4 107.9 L172.5 112.7 L158.8 118.8 Z M143.1 159.3 L149.6 174.7 L135.5 166.6 Z M87.7 178.1 L78.0 192.8 L78.0 174.9 Z M45.4 139.7 L29.6 138.9 L42.4 129.2 Z M47.2 88.0 L38.0 76.0 L52.4 78.6 Z M96.9 52.6 L102.4 37.6 L107.0 53.0 Z M146.1 76.5 L161.5 72.5 L151.7 85.6 Z",
    },
    {
      sw: 0.95,
      d: "M151.3 109.9 L163.4 114.6 L151.4 119.6 Z M149.2 131.9 L159.9 141.5 L145.9 140.9 Z M145.7 141.3 L154.2 152.6 L140.9 149.5 Z M133.5 158.0 L138.0 172.4 L126.3 163.7 Z M117.4 168.2 L116.2 181.5 L108.9 170.7 Z M98.5 171.5 L92.8 182.8 L89.7 170.4 Z M89.4 170.3 L81.2 182.2 L80.8 167.5 Z M77.2 165.7 L66.8 174.4 L69.6 160.7 Z M65.1 156.6 L52.3 162.2 L59.1 149.5 Z M51.4 134.0 L37.8 132.6 L49.2 124.6 Z M48.5 115.2 L36.8 109.2 L49.3 105.5 Z M50.4 100.2 L39.9 90.9 L53.6 91.1 Z M56.4 85.5 L49.1 73.9 L61.7 77.8 Z M69.5 70.2 L66.0 55.3 L77.1 65.1 Z M79.6 63.9 L79.7 49.4 L88.1 60.8 Z M90.2 60.3 L93.2 46.2 L99.0 59.3 Z M113.4 61.2 L122.4 49.2 L121.8 64.5 Z M129.9 69.7 L141.1 63.4 L136.7 76.0 Z M138.0 77.5 L151.1 73.0 L143.4 85.1 Z M144.8 87.8 L158.1 86.8 L148.5 96.6 Z",
      hi: "M151.3 109.9 L163.4 114.6 L151.4 119.6 Z M133.5 158.0 L138.0 172.4 L126.3 163.7 Z M89.4 170.3 L81.2 182.2 L80.8 167.5 Z M51.4 134.0 L37.8 132.6 L49.2 124.6 Z M56.4 85.5 L49.1 73.9 L61.7 77.8 Z M90.2 60.3 L93.2 46.2 L99.0 59.3 Z M138.0 77.5 L151.1 73.0 L143.4 85.1 Z",
    },
    {
      sw: 0.8,
      d: "M143.5 106.3 L153.1 110.2 L144.2 115.6 Z M143.7 122.0 L153.3 129.2 L141.6 131.0 Z M138.5 138.7 L144.0 148.3 L133.6 146.4 Z M126.6 153.7 L128.8 166.1 L119.4 158.6 Z M116.0 160.2 L114.7 171.7 L107.9 162.8 Z M96.0 163.4 L89.8 174.0 L87.7 161.6 Z M78.7 157.5 L68.8 164.4 L71.7 152.2 Z M70.8 151.3 L60.5 155.1 L65.0 144.5 Z M60.8 137.3 L48.8 137.3 L57.6 128.6 Z M55.8 114.1 L46.9 108.4 L56.8 104.8 Z M56.5 106.3 L48.4 99.1 L58.8 97.3 Z M62.1 89.8 L56.3 79.7 L67.1 82.3 Z M75.1 74.5 L74.2 63.4 L82.6 70.0 Z M83.2 69.7 L84.4 58.3 L91.3 67.0 Z M102.1 66.1 L107.8 56.0 L110.5 67.4 Z M122.6 72.9 L132.3 66.6 L129.4 78.4 Z M131.1 80.1 L141.9 76.7 L136.5 87.3 Z M140.6 95.7 L150.7 97.2 L143.2 104.6 Z",
      hi: "M143.5 106.3 L153.1 110.2 L144.2 115.6 Z M126.6 153.7 L128.8 166.1 L119.4 158.6 Z M78.7 157.5 L68.8 164.4 L71.7 152.2 Z M55.8 114.1 L46.9 108.4 L56.8 104.8 Z M75.1 74.5 L74.2 63.4 L82.6 70.0 Z M122.6 72.9 L132.3 66.6 L129.4 78.4 Z",
    },
    {
      sw: 0.65,
      d: "M136.8 113.7 L145.4 119.0 L136.0 122.6 Z M134.2 129.3 L140.4 137.7 L130.6 137.3 Z M129.3 139.3 L132.5 148.5 L123.8 145.8 Z M120.7 148.5 L121.2 158.6 L113.6 152.6 Z M107.8 154.7 L104.6 163.1 L99.9 155.6 Z M92.2 154.6 L85.9 161.0 L84.6 151.8 Z M78.1 147.4 L70.0 150.2 L72.2 141.4 Z M70.1 138.3 L61.4 138.4 L66.2 130.5 Z M64.0 122.6 L55.5 118.9 L63.2 113.7 Z M63.7 107.2 L56.0 100.2 L65.9 98.6 Z M72.0 87.4 L69.5 78.4 L77.7 81.2 Z M80.4 79.1 L80.5 69.5 L87.6 75.2 Z M94.8 73.2 L98.6 65.0 L102.8 72.9 Z M113.3 75.6 L121.1 68.9 L120.3 79.7 Z M122.8 81.7 L131.5 78.6 L128.5 88.0 Z M130.4 90.8 L139.0 91.0 L134.1 98.7 Z",
      hi: "M136.8 113.7 L145.4 119.0 L136.0 122.6 Z M120.7 148.5 L121.2 158.6 L113.6 152.6 Z M78.1 147.4 L70.0 150.2 L72.2 141.4 Z M63.7 107.2 L56.0 100.2 L65.9 98.6 Z M94.8 73.2 L98.6 65.0 L102.8 72.9 Z M130.4 90.8 L139.0 91.0 L134.1 98.7 Z",
    },
    {
      sw: 0.55,
      d: "M130.0 108.1 L136.4 112.1 L130.2 116.5 Z M127.9 127.0 L131.3 133.9 L124.1 134.2 Z M124.0 134.5 L126.5 142.8 L118.7 140.4 Z M110.2 145.7 L107.8 152.9 L102.9 147.5 Z M96.6 147.4 L91.6 152.5 L89.4 145.5 Z M84.0 142.5 L76.4 145.8 L78.2 137.2 Z M73.1 129.5 L65.4 128.1 L70.5 121.6 Z M70.1 119.7 L63.5 115.9 L69.7 111.4 Z M70.6 105.3 L65.3 98.8 L73.2 97.5 Z M78.5 89.6 L77.1 81.2 L84.3 84.4 Z M88.5 82.1 L90.5 74.7 L95.7 79.9 Z M105.3 80.1 L111.0 74.0 L112.5 82.6 Z M118.0 86.2 L125.6 83.7 L123.4 91.9 Z M126.7 97.4 L134.6 98.6 L129.4 105.2 Z",
      hi: "M130.0 108.1 L136.4 112.1 L130.2 116.5 Z M110.2 145.7 L107.8 152.9 L102.9 147.5 Z M73.1 129.5 L65.4 128.1 L70.5 121.6 Z M78.5 89.6 L77.1 81.2 L84.3 84.4 Z M118.0 86.2 L125.6 83.7 L123.4 91.9 Z",
    },
    {
      sw: 0.4,
      d: "M123.4 107.4 L128.6 110.9 L123.8 115.1 Z M122.5 122.0 L124.8 127.6 L119.3 128.8 Z M116.8 132.0 L116.9 138.2 L111.3 136.5 Z M104.8 139.1 L101.7 144.8 L97.9 139.6 Z M88.8 136.6 L83.1 138.4 L83.2 132.0 Z M79.8 127.2 L73.3 126.1 L77.0 120.2 Z M76.1 113.9 L71.7 109.6 L76.8 106.3 Z M77.2 104.8 L74.6 99.2 L80.3 97.9 Z M83.9 93.3 L84.1 87.1 L89.5 89.0 Z M97.3 86.5 L100.9 80.9 L104.1 86.7 Z M110.6 89.1 L116.3 87.0 L116.3 93.5 Z M119.3 97.3 L125.6 98.0 L122.5 104.0 Z",
      hi: "M123.4 107.4 L128.6 110.9 L123.8 115.1 Z M104.8 139.1 L101.7 144.8 L97.9 139.6 Z M76.1 113.9 L71.7 109.6 L76.8 106.3 Z M97.3 86.5 L100.9 80.9 L104.1 86.7 Z",
    },
  ];
  var ringColors = [c.rim, c.r2, c.r3, c.r4, c.r5, c.r6];
  var spikes = "",
    shine = "",
    clipShapes = '<ellipse cx="100" cy="116" rx="66" ry="71"/>',
    i;
  for (i = 0; i < rings.length; i++) {
    spikes +=
      '<path fill="' +
      ringColors[i] +
      '" stroke="' +
      c.stroke +
      '" stroke-width="' +
      rings[i]!.sw +
      '" d="' +
      rings[i]!.d +
      '"/>';
    shine += '<path fill="#fff" opacity=".3" d="' + rings[i]!.hi + '"/>';
    clipShapes += '<path d="' + rings[i]!.d + '"/>';
  }
  return (
    '<span class="siiri3d">' +
    '<svg class="' +
    cls +
    '" id="s-back-svg" viewBox="0 0 200 200" role="img" aria-label="Igelkotten Siiri bakifrån">' +
    "<defs>" +
    /* en ansiktsfri pälsbit från hjässan (ovanför ögonbrynen), upprepad som
       mönster - ger äkta penseldrag ovanpå de platta taggfärgerna nedan.
       Mönstret har genomskinliga luckor mellan strån, så det läggs som ett
       halvtransparent detaljlager - inte som själva bottenfärgen - annars
       lyser rummet bakom igenom luckorna. */
    /* y=-20 flyttar mönstrets skarv (64x54-rutan upprepas inte sömlöst) så
       den hamnar dold under ryggsäcken - omräknat efter att hela kroppen
       förstorades 1.33x (skarven låg tidigare dold vid den mindre storleken) */
    '<pattern id="back-furtile" patternUnits="userSpaceOnUse" x="0" y="-20" width="64" height="54">' +
    '<use href="#siiriPic" x="-68" y="-4"/>' +
    "</pattern>" +
    '<clipPath id="back-clip">' +
    clipShapes +
    "</clipPath>" +
    "</defs>" +
    '<g id="s-back-all">' +
    wearSVG(wear, owned, "scene") +
    wearSVG(wear, owned, "aura") +
    '<ellipse cx="100" cy="186" rx="55" ry="8" fill="#2A1B0C" opacity=".15"/>' +
    /* hela taggsiluetten förstoras ~1.33x runt kroppens mittpunkt - den
       handritade siluetten fyllde bara ~2/3 av canvasen, medan den riktiga
       vattenfärgsbilden (framsidan) fyller nästan hela den, vilket fick
       baksidan att se avsevärt mindre/längre bort ut trots samma SVG-ruta */
    '<g transform="translate(100,116) scale(1.33) translate(-100,-116)">' +
    '<ellipse cx="100" cy="116" rx="66" ry="71" fill="' +
    c.rim +
    '"/>' +
    spikes +
    '<g clip-path="url(#back-clip)">' +
    '<rect x="0" y="0" width="200" height="200" fill="url(#back-furtile)" opacity=".95"/>' +
    "</g>" +
    shine +
    '<ellipse cx="100" cy="150" rx="50" ry="40" fill="' +
    c.base +
    '"/>' +
    '<g stroke="' +
    c.line +
    '" stroke-width="1.4" opacity=".7" fill="none">' +
    '<path d="M70 134 q30 14 60 0"/><path d="M66 154 q34 16 68 0"/></g>' +
    '<ellipse cx="76" cy="182" rx="15" ry="10" fill="' +
    c.base +
    '" stroke="' +
    c.line +
    '" stroke-width="1"/>' +
    '<ellipse cx="124" cy="182" rx="15" ry="10" fill="' +
    c.base +
    '" stroke="' +
    c.line +
    '" stroke-width="1"/>' +
    "</g>" +
    /* ryggplagget förstoras ~30% och centreras över den taggiga mitten - precis
       där ansiktet hade legat på framsidan, så det täcker den tuffaste skarven */
    '<g transform="translate(100,122) scale(1.3) translate(-100,-122)">' +
    backItem +
    "</g>" +
    wearSVG(wear, owned, "head") +
    wearSVG(wear, owned, "neck") +
    "</g></svg>" +
    '<span class="siirishadow"></span></span>'
  );
}
