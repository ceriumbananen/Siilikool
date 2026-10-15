/* Samtalen med Siiri ("Jutt Siiriga") - flyttat ur public/legacy/app.js (som läser dem via window.SiiriData,
   app/plugins/siiri-data.client.ts). Ren data: ändra här, så gäller det både Vue-sidorna och legacy-skärmarna. */

export const CHATS = [
  {
    id: "tere",
    em: "👋",
    sv: "Säga hej",
    et: "Tere!",
    intro: { et: "Tore, et sa tulid!", sv: "Vad kul att du kom!" },
    turns: [
      {
        q: { et: "Tere! Mina olen Siiri.", sv: "Hej! Jag heter Siiri." },
        opts: [
          { et: "Tere!", sv: "Hej!" },
          { et: "Tere hommikust!", sv: "God morgon!" },
        ],
        reply: { et: "Tore sind näha!", sv: "Kul att se dig!" },
      },
      {
        q: { et: "Kuidas sul läheb?", sv: "Hur mår du?" },
        opts: [
          { et: "Hästi, aitäh!", sv: "Bra, tack!" },
          { et: "Nii ja naa.", sv: "Sådär." },
        ],
        reply: { et: "Väga hea!", sv: "Så bra!" },
      },
      {
        q: { et: "Mis sinu nimi on?", sv: "Vad heter du?" },
        /* appen vet redan barnets namn (S.name) - renderTalk() bygger opts med det, se nameOpt i app.js */
        nameOpt: true,
        opts: [],
        reply: { et: "Väga meeldiv!", sv: "Trevligt!" },
      },
      {
        q: { et: "Kas sa räägid eesti keelt?", sv: "Talar du estniska?" },
        opts: [
          { et: "Natuke.", sv: "Lite grann." },
          { et: "Jah, ma õpin!", sv: "Ja, jag lär mig!" },
        ],
        reply: { et: "Sa oled tubli!", sv: "Du är duktig!" },
      },
      {
        q: { et: "Head aega!", sv: "Hej då!" },
        opts: [
          { et: "Head aega!", sv: "Hej då!" },
          { et: "Nägemist!", sv: "Vi ses!" },
        ],
        reply: { et: "Näeme homme!", sv: "Vi ses imorgon!" },
      },
    ],
  },
  {
    id: "loomad",
    em: "🐻",
    sv: "Om djur",
    et: "Loomadest",
    intro: { et: "Räägime loomadest!", sv: "Nu pratar vi om djur!" },
    turns: [
      {
        q: { et: "Kas sulle meeldivad loomad?", sv: "Gillar du djur?" },
        opts: [
          { et: "Jah, väga!", sv: "Ja, jättemycket!" },
          { et: "Natuke.", sv: "Lite grann." },
        ],
        reply: { et: "Mina olen siil.", sv: "Jag är en igelkott." },
      },
      {
        q: { et: "Kas sul on kodus loom?", sv: "Har du något djur hemma?" },
        opts: [
          { et: "Mul on koer.", sv: "Jag har en hund." },
          { et: "Mul on kass.", sv: "Jag har en katt." },
        ],
        reply: { et: "Kui tore!", sv: "Vad roligt!" },
      },
      {
        q: { et: "Kuidas ütleb kass?", sv: "Vad säger katten?" },
        opts: [
          { et: "Kass ütleb mjäu.", sv: "Katten säger mjau." },
          { et: "Kass ütleb auh.", sv: "Katten säger voff." },
        ],
        reply: { et: "Kass ütleb mjäu!", sv: "Katten säger mjau!" },
      },
      {
        q: { et: "Kas karu on suur või väike?", sv: "Är björnen stor eller liten?" },
        opts: [
          { et: "Karu on suur.", sv: "Björnen är stor." },
          { et: "Karu on väike.", sv: "Björnen är liten." },
        ],
        reply: { et: "Karu on väga suur!", sv: "Björnen är jättestor!" },
      },
    ],
  },
  {
    id: "toit",
    em: "🍎",
    sv: "Om mat",
    et: "Toidust",
    intro: { et: "Mulle meeldib süüa!", sv: "Jag gillar att äta!" },
    turns: [
      {
        q: { et: "Kas sa oled näljane?", sv: "Är du hungrig?" },
        opts: [
          { et: "Jah, ma olen näljane.", sv: "Ja, jag är hungrig." },
          { et: "Ei, ma olen söönud.", sv: "Nej, jag har ätit." },
        ],
        reply: { et: "Lähme sööma!", sv: "Nu går vi och äter!" },
      },
      {
        q: { et: "Mis sulle maitseb?", sv: "Vad tycker du är gott?" },
        opts: [
          { et: "Mulle maitseb leib.", sv: "Jag gillar bröd." },
          { et: "Mulle maitseb jäätis.", sv: "Jag gillar glass." },
        ],
        reply: { et: "Mmm, väga hea!", sv: "Mmm, jättegott!" },
      },
      {
        q: { et: "Kas sa jood piima?", sv: "Dricker du mjölk?" },
        opts: [
          { et: "Jah, ma joon piima.", sv: "Ja, jag dricker mjölk." },
          { et: "Ei, ma joon vett.", sv: "Nej, jag dricker vatten." },
        ],
        reply: { et: "Tubli!", sv: "Duktigt!" },
      },
      {
        q: { et: "Mis värvi on õun?", sv: "Vilken färg har äpplet?" },
        opts: [
          { et: "Õun on punane.", sv: "Äpplet är rött." },
          { et: "Õun on sinine.", sv: "Äpplet är blått." },
        ],
        reply: { et: "Õun on punane ja magus!", sv: "Äpplet är rött och sött!" },
      },
    ],
  },
  {
    id: "varvid",
    em: "🎨",
    sv: "Om färger",
    et: "Värvidest",
    intro: { et: "Vaatame värve!", sv: "Nu tittar vi på färger!" },
    turns: [
      {
        q: { et: "Mis värvi on taevas?", sv: "Vilken färg har himlen?" },
        opts: [
          { et: "Taevas on sinine.", sv: "Himlen är blå." },
          { et: "Taevas on roheline.", sv: "Himlen är grön." },
        ],
        reply: { et: "Taevas on sinine!", sv: "Himlen är blå!" },
      },
      {
        q: { et: "Mis värvi on mets?", sv: "Vilken färg har skogen?" },
        opts: [
          { et: "Mets on roheline.", sv: "Skogen är grön." },
          { et: "Mets on kollane.", sv: "Skogen är gul." },
        ],
        reply: { et: "Mets on roheline!", sv: "Skogen är grön!" },
      },
      {
        q: { et: "Mis on sinu lemmikvärv?", sv: "Vilken är din favoritfärg?" },
        /* fritt svar - alla barn har inte röd eller gul som favorit, se answerTalkFree() i app.js.
           saveAs sparar svaret i S.favColor, så Siiri minns det nästa gång (renderTalk()). */
        freeText: true,
        saveAs: "favColor",
        opts: [],
        reply: { et: "Väga ilus värv!", sv: "Vilken fin färg!" },
      },
      {
        q: { et: "Mis värvi on lumi?", sv: "Vilken färg har snön?" },
        opts: [
          { et: "Lumi on valge.", sv: "Snön är vit." },
          { et: "Lumi on must.", sv: "Snön är svart." },
        ],
        reply: { et: "Lumi on valge ja külm!", sv: "Snön är vit och kall!" },
      },
    ],
  },
  {
    id: "mina",
    em: "🏡",
    sv: "Om dig",
    et: "Sinust",
    intro: { et: "Ma tahan sind tundma õppida!", sv: "Jag vill lära känna dig!" },
    turns: [
      {
        q: { et: "Kui vana sa oled?", sv: "Hur gammal är du?" },
        opts: [
          { et: "Ma olen kaheksa.", sv: "Jag är åtta." },
          { et: "Ma olen kümme.", sv: "Jag är tio." },
        ],
        reply: { et: "Sa oled juba suur!", sv: "Du är redan stor!" },
      },
      {
        q: { et: "Kas sul on õde või vend?", sv: "Har du en syster eller en bror?" },
        opts: [
          { et: "Mul on õde.", sv: "Jag har en syster." },
          { et: "Mul on vend.", sv: "Jag har en bror." },
        ],
        reply: { et: "Kui tore!", sv: "Vad roligt!" },
      },
      {
        q: { et: "Kus sa elad?", sv: "Var bor du?" },
        opts: [
          { et: "Ma elan Rootsis.", sv: "Jag bor i Sverige." },
          { et: "Ma elan Eestis.", sv: "Jag bor i Estland." },
        ],
        reply: { et: "Väga hea!", sv: "Så bra!" },
      },
      {
        q: { et: "Mida sa täna teed?", sv: "Vad gör du idag?" },
        opts: [
          { et: "Ma mängin.", sv: "Jag leker." },
          { et: "Ma õpin eesti keelt.", sv: "Jag lär mig estniska." },
        ],
        reply: { et: "See on väga tore!", sv: "Det är jättekul!" },
      },
    ],
  },
  {
    id: "koolis",
    em: "🎒",
    sv: "Om skolan",
    et: "Koolist",
    intro: { et: "Räägime koolist!", sv: "Nu pratar vi om skolan!" },
    turns: [
      {
        q: { et: "Kas sa käid koolis?", sv: "Går du i skolan?" },
        opts: [
          { et: "Jah, ma käin koolis.", sv: "Ja, jag går i skolan." },
          { et: "Ei, ma olen kodus.", sv: "Nej, jag är hemma." },
        ],
        reply: { et: "Kool on tore koht!", sv: "Skolan är ett fint ställe!" },
      },
      {
        q: { et: "Mis on sinu lemmikaine?", sv: "Vilket är ditt favoritämne?" },
        opts: [
          { et: "Mulle meeldib joonistada.", sv: "Jag gillar att rita." },
          { et: "Mulle meeldib lugeda.", sv: "Jag gillar att läsa." },
        ],
        reply: { et: "Väga hea valik!", sv: "Vilket bra val!" },
      },
      {
        q: { et: "Kas sul on koolikott?", sv: "Har du en skolväska?" },
        opts: [
          { et: "Jah, mul on kott.", sv: "Ja, jag har en väska." },
          { et: "Mul on seljakott.", sv: "Jag har en ryggsäck." },
        ],
        reply: { et: "Ära unusta raamatut!", sv: "Glöm inte boken!" },
      },
      {
        q: { et: "Kes on sinu õpetaja?", sv: "Vem är din lärare?" },
        opts: [
          { et: "Minu õpetaja on tore.", sv: "Min lärare är snäll." },
          { et: "Mul on kaks õpetajat.", sv: "Jag har två lärare." },
        ],
        reply: { et: "Tubli õpetaja!", sv: "Vilken bra lärare!" },
      },
    ],
  },
  {
    id: "ilm",
    em: "🌦️",
    sv: "Om vädret",
    et: "Ilmast",
    intro: { et: "Vaatame, milline ilm on!", sv: "Vi tittar på vädret!" },
    turns: [
      {
        q: { et: "Milline ilm täna on?", sv: "Hur är vädret idag?" },
        opts: [
          { et: "Päike paistab.", sv: "Solen skiner." },
          { et: "Sajab vihma.", sv: "Det regnar." },
        ],
        reply: { et: "Nii on!", sv: "Så är det!" },
      },
      {
        q: { et: "Kas sul on külm?", sv: "Fryser du?" },
        opts: [
          { et: "Jah, mul on külm.", sv: "Ja, jag fryser." },
          { et: "Ei, mul on soe.", sv: "Nej, jag har det varmt." },
        ],
        reply: { et: "Pane müts pähe!", sv: "Sätt på dig mössan!" },
      },
      {
        q: { et: "Kas sulle meeldib lumi?", sv: "Gillar du snö?" },
        opts: [
          { et: "Jah, ma armastan lund.", sv: "Ja, jag älskar snö." },
          { et: "Mulle meeldib suvi.", sv: "Jag gillar sommaren." },
        ],
        reply: { et: "Talv on ilus!", sv: "Vintern är vacker!" },
      },
      {
        q: { et: "Mida sa teed vihmaga?", sv: "Vad gör du när det regnar?" },
        opts: [
          { et: "Ma loen raamatut.", sv: "Jag läser en bok." },
          { et: "Ma mängin kodus.", sv: "Jag leker hemma." },
        ],
        reply: { et: "Hea mõte!", sv: "Bra idé!" },
      },
    ],
  },
  {
    id: "kodu",
    em: "🏠",
    sv: "Om hemma",
    et: "Kodust",
    intro: { et: "Räägime sinu kodust!", sv: "Nu pratar vi om ditt hem!" },
    turns: [
      {
        q: { et: "Kas sa elad majas?", sv: "Bor du i ett hus?" },
        opts: [
          { et: "Jah, ma elan majas.", sv: "Ja, jag bor i ett hus." },
          { et: "Ma elan korteris.", sv: "Jag bor i en lägenhet." },
        ],
        reply: { et: "Kodu on kõige parem!", sv: "Hemma är bäst!" },
      },
      {
        q: { et: "Mis värvi on sinu tuba?", sv: "Vilken färg har ditt rum?" },
        opts: [
          { et: "Minu tuba on sinine.", sv: "Mitt rum är blått." },
          { et: "Minu tuba on valge.", sv: "Mitt rum är vitt." },
        ],
        reply: { et: "Kui ilus!", sv: "Vad fint!" },
      },
      {
        q: { et: "Kas sul on oma voodi?", sv: "Har du en egen säng?" },
        opts: [
          { et: "Jah, mul on oma voodi.", sv: "Ja, jag har en egen säng." },
          { et: "Ma magan õega.", sv: "Jag sover med min syster." },
        ],
        reply: { et: "Maga hästi!", sv: "Sov gott!" },
      },
      {
        q: { et: "Kes teeb teil süüa?", sv: "Vem lagar mat hos er?" },
        opts: [
          { et: "Ema teeb süüa.", sv: "Mamma lagar mat." },
          { et: "Isa teeb süüa.", sv: "Pappa lagar mat." },
        ],
        reply: { et: "Mmm, kui hea lõhn!", sv: "Mmm, vad det luktar gott!" },
      },
    ],
  },
];
