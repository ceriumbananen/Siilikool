/* Lore-korten i Siiris rum (app/pages/room.vue, touchLoreSpot) - öppnas istället för den vanliga
   "säger ett ord"-pratbubblan för de saker i rummet som har en egen kulturell/historisk historia
   att berätta (eldstaden, flaggan, dalahästen, folkdockorna). Samma mönster som openCharCard() i
   public/legacy/app.js (rival-/avatarkorten): estniska texten (factEt) visas som förval, en knapp
   växlar till svenska (fact).

   Nycklarna: "roomfire" och "dalahast"/"folkdockor" är fasta (alltid samma sak på spiselkransen),
   "a-flag" är nyckeln på FURN-saken (se shop.ts) - roomart slår alltså upp lore efter vald tavla,
   och faller tillbaka till den vanliga pratbubblan om man valt något annat (karta, foto, klocka...).

   Källor (kort, barnvänligt, men kontrollerat mot riktig historia - se gärna över själva
   estniskan, den är AI-skriven):
   - Eesti lipp: riigikantselei.ee (Eesti lipu päev), Tartu üliõpilasselts Vironia 1881,
     riigilipuks 1918.
   - Dalahäst: Nordiska museet / svensk hemslöjdstradition, 1700-talets Dalarna, världsutställningen
     i New York 1939.
   - Rahvariietes nukud: Nordiska museet, dockor i folkdräkt visade på 1800-talets världsutställningar
     (Paris 1867/1878, Artur Hazelius).
   - Ahi/eldstaden: Eesti Vabaõhumuuseum - rehielamu rehetuba, suur ahi kütmiseks, vilja kuivatamiseks
     ja musta leiva küpsetamiseks. */
export type RoomLore = {
  img: string;
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
    fact:
      "Förr i tiden var den stora stenugnen det viktigaste i ett estniskt bondehem. Den värmde upp rummet, torkade säden och bakade det svarta brödet - Estlands äldsta och mest älskade mat.",
  },
  "a-flag": {
    img: "/images/room/flag.webp",
    name: { et: "Eesti lipp", sv: "Estlands flagga" },
    factEt:
      "Sinine, must ja valge - Eesti lipu värvid valiti juba 1881. aastal Tartus. Sinine on taevas, must on muld ja minevik, valge on lootus ja tulevik. Lipp sai Eesti riigilipuks 1918. aastal.",
    fact:
      "Blått, svart och vitt - Estlands flaggfärger valdes redan 1881 i Tartu. Blått är himlen, svart är jorden och det förflutna, vitt är hoppet och framtiden. Flaggan blev Estlands officiella flagga 1918.",
  },
  dalahast: {
    img: "/images/room/dala-horse.webp",
    name: { et: "Dalahobune", sv: "Dalahästen" },
    factEt:
      "Dalahobune on puust nikerdatud ja värvitud hobuke Rootsist, Dalarna maakonnast. Juba 1700. aastatel nikerdasid metsamehed selliseid hobuseid oma lastele mänguasjaks. Tänapäeval on ta üks Rootsi tuntumaid sümboleid.",
    fact:
      "Dalahästen är en handsnidad och målad trähäst från Dalarna i Sverige. Redan på 1700-talet snidade skogsarbetare såna hästar som leksaker åt sina barn. Idag är den en av Sveriges mest kända symboler.",
  },
  folkdockor: {
    img: "/images/room/folk-dolls.webp",
    name: { et: "Rahvariietes nukud", sv: "Folkdräktsdockorna" },
    factEt:
      "Need väikesed nukud kannavad rootsi rahvariideid. 1800. aastatel näidati selliseid nukke suurtel maailmanäitustel, et tutvustada erinevate Rootsi maakondade rõivaid ja kombeid.",
    fact:
      "De här små dockorna är klädda i svensk folkdräkt. På 1800-talet visades liknande dockor upp på stora världsutställningar, för att visa hur man klädde sig i olika svenska landskap.",
  },
};
