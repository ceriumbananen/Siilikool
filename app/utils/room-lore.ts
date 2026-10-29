/* Lore-korten i Siiris rum (app/pages/room.vue, touchLoreSpot) - öppnas istället för den vanliga
   "säger ett ord"-pratbubblan för de saker i rummet som har en egen kulturell/historisk historia
   att berätta (eldstaden, flaggan, dalahästen, folkdockorna). Samma mönster som openCharCard() i
   public/legacy/app.js (rival-/avatarkorten): estniska texten (factEt) visas som förval, en knapp
   växlar till svenska (fact).

   Nycklarna: "roomfire" och "dalahast"/"folkdockor" är fasta (alltid samma sak på spiselkransen),
   "a-flag"/"a-koler" är nycklar på respektive FURN-sak (se shop.ts) - roomart slår alltså upp
   lore efter vald tavla, och faller tillbaka till den vanliga pratbubblan om man valt något
   annat (karta, foto, klocka...).

   Källor (kort, barnvänligt, men kontrollerat mot riktig historia - se gärna över själva
   estniskan, den är AI-skriven):
   - Eesti lipp: riigikantselei.ee (Eesti lipu päev), Tartu üliõpilasselts Vironia 1881,
     riigilipuks 1918.
   - Dalahäst: Nordiska museet / svensk hemslöjdstradition, 1700-talets Dalarna, världsutställningen
     i New York 1939.
   - Rahvariietes nukud: eesti rahvarõivad - triibulised seelikud ja omad värvid igas maakonnas/
     kihelkonnas (alates 1700. sajandist), kantakse tänapäeval eriti laulupeol (rahvaroivad.ee).
   - Ahi/eldstaden: Eesti Vabaõhumuuseum - rehielamu rehetuba, suur ahi kütmiseks, vilja kuivatamiseks
     ja musta leiva küpsetamiseks.
   - Tütarlaps allikal: Johann Köler (1826-1899), 1859-1861, õli lõuendil, Eesti Kunstimuuseum
     (digikogu.ekm.ee, oid-11821) - kontrollerad mot den digitaliserade originalmålningen. */
export type RoomLore = {
  /** Finns ingen egen bild (de flesta plagg är bara inritade direkt på Siiri, ingen separat
   * fil) visas istället emojin stort - se `em` nedan. */
  img?: string;
  /** Fallback när `img` saknas (se ovan). */
  em?: string;
  name: { et: string; sv: string };
  factEt: string;
  fact: string;
};

export const ROOM_LORE: Record<string, RoomLore> = {
  roomfire: {
    img: "/images/room/fireplace.webp",
    name: { et: "Ahi", sv: "Eldstaden" },
    factEt:
      "Vanasti oli taluperes suur kiviahi kodu kõige tähtsam koht. Selles köeti tuba, kuivatati vilja ja küpsetati musta leiba - Eesti kõige vanemat ja armastatumat toitu.",
    fact: "Förr i tiden var den stora stenugnen det viktigaste i ett estniskt bondehem. Den värmde upp rummet, torkade säden och bakade det svarta brödet - Estlands äldsta och mest älskade mat.",
  },
  "a-flag": {
    img: "/images/room/flag.webp",
    name: { et: "Eesti lipp", sv: "Estlands flagga" },
    factEt:
      "Sinine, must ja valge - Eesti lipu värvid valiti juba 1881. aastal Tartus. Sinine on taevas, must on muld ja minevik, valge on lootus ja tulevik. Lipp sai Eesti riigilipuks 1918. aastal.",
    fact: "Blått, svart och vitt - Estlands flaggfärger valdes redan 1881 i Tartu. Blått är himlen, svart är jorden och det förflutna, vitt är hoppet och framtiden. Flaggan blev Estlands officiella flagga 1918.",
  },
  "a-koler": {
    img: "/images/room/koler-painting.webp",
    name: { et: "Tütarlaps allikal", sv: "Flickan vid källan" },
    factEt:
      "Selle maali maalis Johann Köler aastatel 1859-1861. Ta oli üks esimesi tuntud eesti soost kunstnikke, kes õppis Peterburi Kunstiakadeemias. Maal on tänapäeval hoiul Eesti Kunstimuuseumis.",
    fact: "Den här tavlan målades av Johann Köler mellan 1859 och 1861. Han var en av de första kända konstnärerna med estnisk bakgrund och studerade vid Konstakademien i Sankt Petersburg. Tavlan finns idag på Estlands konstmuseum.",
  },
  dalahast: {
    img: "/images/room/dala-horse.webp",
    name: { et: "Dalahobune", sv: "Dalahästen" },
    factEt:
      "Dalahobune on puust nikerdatud ja värvitud hobuke Rootsist, Dalarna maakonnast. Juba 1700. aastatel nikerdasid metsamehed selliseid hobuseid oma lastele mänguasjaks. Tänapäeval on ta üks Rootsi tuntumaid sümboleid.",
    fact: "Dalahästen är en handsnidad och målad trähäst från Dalarna i Sverige. Redan på 1700-talet snidade skogsarbetare såna hästar som leksaker åt sina barn. Idag är den en av Sveriges mest kända symboler.",
  },
  folkdockor: {
    img: "/images/room/folk-dolls.webp",
    name: { et: "Rahvariietes nukud", sv: "Folkdräktsdockorna" },
    factEt:
      "Need nukud kannavad Eesti rahvariideid. Igal maakonnal on oma triibuline seelik ja omad värvid - isegi naaberkihelkondades võisid need olla hoopis erinevad! Tänapäeval kantakse rahvariideid eriti laulupeol, kus tuhanded inimesed laulavad koos.",
    fact: "De här dockorna bär estnisk folkdräkt. Varje landskap har sin egen randiga kjol och sina egna färger - i grannsocknarna kunde de se helt olika ut! Idag bär man folkdräkt särskilt på sångfesten, där tusentals människor sjunger tillsammans.",
  },

  /* Nycklarna nedan är plagg-id:n ur SHOP och möbel-id:n ur FURN (shop.ts) - samma mönster som
     "a-koler" ovan, men nu också kopplat till plagg Siiri bär (visas i förhandsgranskningen i
     Laat, se ShopPreviewOverlay.vue) och till fler rumssaker (vägg/matta/höger-möbel, se
     LORE_SPOT_IDS i room.vue). Bara saker med en egen, verklig kulturell/historisk historia -
     inte alla 86 varor. Estniskan är AI-skriven, kolla gärna över den. */
  rukkilill: {
    img: "/images/room/plant-vase.webp",
    em: "🪻",
    name: { et: "Rukkilill", sv: "Rukkilill" },
    factEt:
      "Rukkilill on Eesti rahvuslill. Ta kasvab metsikult rukkipõldude ääres ja valiti rahvuslilleks 1968. aastal, kui Eesti oli Nõukogude Liidu osa - sinine õis sümboliseeris salaja lootust ja vabadust.",
    fact: "Rukkilill (blåklint) är Estlands nationalblomma. Den växer vilt i kanten av rågfält och valdes till nationalblomma 1968, när Estland var en del av Sovjetunionen - den blå blomman symboliserade i hemlighet hopp och frihet.",
  },
  kihnu: {
    em: "👗",
    name: { et: "Kihnu seelik", sv: "Kihnukjol" },
    factEt:
      "Kihnu on väike saar Pärnu lahes, kus naised kannavad siiani oma värvikirevaid triibulisi seelikuid igapäevaselt. Kihnu kultuuriruum on UNESCO poolt tunnistatud maailma vaimse kultuuripärandi hulka 2003. aastal.",
    fact: "Kihnu är en liten ö i Pärnuviken där kvinnorna än idag bär sina färgglada randiga kjolar i vardagen. Kihnus kulturarv finns sedan 2003 med på UNESCO:s lista över mänsklighetens immateriella kulturarv.",
  },
  mulgi: {
    em: "🧥",
    name: { et: "Mulgi kuub", sv: "Mulgikaftan" },
    factEt:
      "Mulgimaa oli omal ajal Eesti üks jõukamaid piirkondi tänu linakasvatusele. Mulgi kuub on tume, peente hõbenööpidega kuub, mida kandsid rikkad taluperemehed - mida rohkem nööpe, seda jõukam pere.",
    fact: "Mulgimaa var förr en av Estlands rikaste trakter tack vare linodling. Mulgikaftanen är en mörk rock med fina silverknappar som förmögna bönder bar - ju fler knappar, desto rikare familj.",
  },
  rahvas: {
    img: "/images/room/folk-dolls.webp",
    name: { et: "Rahvarõivad", sv: "Folkdräkt" },
    factEt:
      "Eesti rahvarõivad nägid välja erinevad igas maakonnas - triibuline seelik, pluus ja vöö rääkisid, kust kandja pärit oli. Tänapäeval pannakse need selga eriti suurtel pidudel, nagu laulupidu, kuhu tuleb kokku tuhandeid inimesi.",
    fact: "Estnisk folkdräkt såg olika ut i varje landskap - den randiga kjolen, blusen och bältet berättade var bäraren kom ifrån. Idag tar man på sig den särskilt på stora fester, som sångfesten, dit tusentals människor samlas.",
  },
  hobekee: {
    em: "🪙",
    name: { et: "Hõbekee", sv: "Setos silversmycke" },
    factEt:
      "Setod on oma keele ja lauluga rahvas Kagu-Eestis. Seto naised kandsid pidulikult rasket hõbeehet - mõnikord mitu kilogrammi hõbedat korraga! See näitas pere jõukust ja anti edasi emalt tütrele.",
    fact: "Seterna är ett folk med eget språk och sång i sydöstra Estland. Seto-kvinnor bar vid högtider tunga silversmycken - ibland flera kilo silver samtidigt! Det visade familjens förmögenhet och gick i arv från mor till dotter.",
  },
  kannel: {
    img: "/images/room/gear-kannel.webp",
    name: { et: "Kannel", sv: "Kantele" },
    factEt:
      "Kannel on Eesti kõige vanem rahvapill - juba muinasjuttudeski mängitakse kannelt. Vanasti tehti kannel ühest puutükist ja keeled olid hobusejõhvist, tänapäeval enamasti metallist. Viljandis peetakse igal aastal suurt pärimusmuusika festivali.",
    fact: "Kannel är Estlands äldsta folkinstrument - redan i sagorna spelar man kannel. Förr gjordes den av ett enda träblock och strängarna var av hästtagel, idag oftast av metall. Varje år hålls en stor folkmusikfestival i Viljandi.",
  },
  "g-kannel": {
    img: "/images/room/gear-kannel.webp",
    name: { et: "Kannel", sv: "Kantele" },
    factEt:
      "Kannel on Eesti kõige vanem rahvapill - juba muinasjuttudeski mängitakse kannelt. Vanasti tehti kannel ühest puutükist ja keeled olid hobusejõhvist, tänapäeval enamasti metallist. Viljandis peetakse igal aastal suurt pärimusmuusika festivali.",
    fact: "Kannel är Estlands äldsta folkinstrument - redan i sagorna spelar man kannel. Förr gjordes den av ett enda träblock och strängarna var av hästtagel, idag oftast av metall. Varje år hålls en stor folkmusikfestival i Viljandi.",
  },
  torupill: {
    em: "🪈",
    name: { et: "Torupill", sv: "Torupill" },
    factEt:
      "Torupill on vana Eesti pill, mis tehti looma nahast ja põiest. 20. sajandi alguseks oli torupillimäng peaaegu kadunud, aga tänu muusikutele ja pärimuse uurijatele on see nüüd taas elus ja mängitakse pidudel.",
    fact: "Torupillen (säckpipan) är ett gammalt estniskt instrument som gjordes av djurskinn och urinblåsa. I början av 1900-talet höll konsten att spela torupill på att dö ut, men tack vare musiker och forskare lever den nu igen och spelas på fester.",
  },
  paasuke2: {
    em: "🐦",
    name: { et: "Suitsupääsuke", sv: "Ladusvala" },
    factEt:
      "Suitsupääsuke on Eesti rahvuslind, valitud 1960. aastal. Ta lendab igal kevadel tuhandeid kilomeetreid tagasi Aafrikast ja ehitab oma pesa tihti just talurahva laudahoonete alla - tema saabumine tähendab, et kevad on käes.",
    fact: "Ladusvalan är Estlands nationalfågel sedan 1960. Varje vår flyger den tusentals kilometer tillbaka från Afrika och bygger ofta sitt bo under taket på lador - när den kommer vet man att våren är här.",
  },
  jaanituli: {
    em: "🔥",
    name: { et: "Jaanituli", sv: "Midsommareld" },
    factEt:
      "Jaaniõhtu on aasta lühim öö ja üks Eesti suurimaid pidusid. Süüdatakse suur lõke, hüpatakse üle tule õnne toomiseks ja ei magata terve öö - vanasti usuti, et tuli kaitseb kurja vaimu eest ja toob hea saagi.",
    fact: "Midsommarnatten är årets kortaste natt och en av Estlands största fester. Man tänder en stor brasa, hoppar över elden för att få lycka och sover inte hela natten - förr trodde man att elden skyddade mot onda andar och gav en god skörd.",
  },
  vanalinn: {
    em: "🏙️",
    name: { et: "Vanalinn", sv: "Gamla stan" },
    factEt:
      "Tallinna vanalinn on üks Euroopa paremini säilinud keskaegseid linnu ja on UNESCO maailmapärandi nimekirjas alates 1997. aastast. Kitsad munakivitänavad ja kõrged tornid meenutavad aega, mil Tallinn oli tähtis kaubalinn Hansa Liidus.",
    fact: "Tallinns gamla stad är en av Europas bäst bevarade medeltida städer och har stått på UNESCO:s världsarvslista sedan 1997. De smala kullerstensgatorna och höga tornen påminner om tiden då Tallinn var en viktig handelsstad i Hansaförbundet.",
  },
  "r-folk": {
    img: "/images/room/rug-folk.webp",
    name: { et: "Rahvavaip", sv: "Folkmönstrad matta" },
    factEt:
      "Rahvavaibad kooti vanasti kodus suurtel kangastelgedel. Igal maakonnal olid omad mustrid ja värvid, ja tüdrukud õppisid juba noorelt kuduma - vaibad ja tekid olid sageli osa pruudi kaasavarast.",
    fact: "Folkmönstrade mattor vävdes förr hemma på stora vävstolar. Varje landskap hade sina egna mönster och färger, och flickor lärde sig väva redan som unga - mattor och täcken var ofta en del av brudens hemgift.",
  },
  "w-wood": {
    img: "/images/room/wall-wood.webp",
    name: { et: "Palksein", sv: "Timmervägg" },
    factEt:
      "Vanad Eesti talumajad ehitati paksudest palkidest, mis lõigati nurkades üksteise külge nii, et maja püsiks koos ilma naelteta. Palkide vahele topiti sammalt, et tuba püsiks soe - sama maja, kus asus ka suur kiviahi.",
    fact: "Gamla estniska bondgårdar byggdes av tjocka timmerstockar som skars ihop i hörnen så att huset höll ihop utan spik. Mellan stockarna stoppade man mossa för att hålla värmen inne - samma hus som rymde den stora stenugnen.",
  },
};
