/* Figurerna man kan välja – samma som i spelet (AVATARS i public/legacy/app.js). Valet sparas
   som själva emojin (S.avatar), inte ett id - AVATARS ändras därför aldrig i efterhand utan
   att gamla sparfiler tappar sitt val. */
export const AVATARS = ["🦔", "🐻", "🦊", "🐰", "🐼", "🦉", "🐸", "🐯", "🦁", "🐨", "🐧", "🦄", "🐢", "🐙"];

export type AvatarInfo = {
  /** Illustrerad bild istället för bara emoji (samma handritade stil som Siiri/rivalerna) -
   * se public/images/avatars/ och avatarIcon() i app.js. */
  img: string;
  /** Estniska ordet för djuret - lärs ut i figur-kortet precis som i resten av spelet. */
  et: string;
  sv: string;
  /** Kort påhittad historia, visas i figur-kortet (openCharCard() i app.js) när man klickar
   * på avataren, samma mönster som Duell-rivalernas story-fält. */
  story: string;
  /** Samma historia på enkel, barnanpassad estniska - förvalet i figur-kortet, med en knapp
   * för att växla till story (svenska) för den som inte hänger med. */
  storyEt: string;
};

/* En uppslagning från emoji till figur-info, inte en del av AVATARS själv - eftersom
   S.avatar redan pekar på emojin och den identiteten inte ska ändras om fler djur läggs
   till eller ordningen ändras. */
export const AVATAR_INFO: Record<string, AvatarInfo> = {
  "🦔": {
    img: "/images/avatars/hedgehog.webp",
    et: "Siil",
    sv: "Igelkotten",
    story:
      "Precis som Siiri själv är igelkotten nyfiken och modig trots sin lilla storlek. Den rullar ihop sig till ett skyddande klot när faran är nära, men vågar sig alltid fram igen för en ny upptäckt.",
    storyEt:
      "Siil on uudishimulik ja julge, kuigi ta on väike. Kui on hirmus, keerab ta end kerra. Varsti julgeb ta jälle maailma avastada, täpselt nagu Siiri.",
  },
  "🐻": {
    img: "/images/avatars/bear.webp",
    et: "Karu",
    sv: "Björnen",
    story:
      "Björnen är skogens starkaste invånare, men också en av de mest tålmodiga. Den sover hela vintern och vaknar alltid redo för nya äventyr när våren kommer.",
    storyEt:
      "Karu on metsa kõige tugevam loom, aga ka väga rahulik. Talvel magab ta kaua. Kevadel ärkab ta üles ja on valmis uuteks seiklusteks.",
  },
  "🦊": {
    img: "/images/avatars/fox.webp",
    et: "Rebane",
    sv: "Räven",
    story:
      "Räven är känd i estniska sagor för sin list och sitt skarpa sinne. Den hittar alltid en väg runt problem som andra djur ger upp inför.",
    storyEt:
      "Rebane on eesti muinasjuttudes tuntud oma kavaluse poolest. Ta leiab alati tee probleemide ümber. Teised loomad imestavad, kuidas ta seda suudab.",
  },
  "🐰": {
    img: "/images/avatars/rabbit.webp",
    et: "Jänes",
    sv: "Haren",
    story:
      "Haren är snabbast av alla i skogen, med öron som hör minsta prassel på långt håll. Ingen vinner en kapplöpning mot en hare som inte fått ett rejält försprång.",
    storyEt:
      "Jänes on metsa kõige kiirem loom. Tal on suured kõrvad, mis kuulevad kaugelt pisimatki häält. Jooksuvõistluses ei võida jänest keegi.",
  },
  "🐼": {
    img: "/images/avatars/panda.webp",
    et: "Panda",
    sv: "Pandan",
    story:
      "Pandan bor långt borta i bambuskogar, men älskar att resa och lära sig nya ord precis som Siiri. Den väljer hellre en stilla stund med en god bok än att skynda iväg någonstans.",
    storyEt:
      "Panda elab kaugel bambusemetsas, aga armastab reisida ja uusi sõnu õppida, nagu Siirigi. Kõige rohkem meeldib talle rahulik hetk hea raamatuga.",
  },
  "🦉": {
    img: "/images/avatars/owl.webp",
    et: "Öökull",
    sv: "Ugglan",
    story:
      "Ugglan är skogens vise, vaken när alla andra sover och full av gamla historier. Den ser i mörkret det andra missar helt.",
    storyEt:
      "Öökull on metsa kõige targem loom. Ta on ärkvel öösel, kui teised magavad. Pimedas näeb ta asju, mida teised ei märka.",
  },
  "🐸": {
    img: "/images/avatars/frog.webp",
    et: "Konn",
    sv: "Grodan",
    story:
      "Grodan hoppar glatt mellan näckrosbladen och sjunger sin egen melodi i skymningen. Den är aldrig rädd för att hoppa rakt in i det okända.",
    storyEt:
      "Konn hüppab rõõmsalt veelehtede vahel. Õhtuhämaruses laulab ta oma laulu. Konn ei karda kunagi hüpata millessegi uude.",
  },
  "🐯": {
    img: "/images/avatars/tiger.webp",
    et: "Tiiger",
    sv: "Tigern",
    story:
      "Tigern smyger tyst genom det höga gräset men ryter stolt när den är glad. Dess ränder gör den omöjlig att missa — och omöjlig att glömma.",
    storyEt:
      "Tiiger hiilib vaikselt kõrges rohus. Kui ta on rõõmus, möirgab ta valjusti. Tema triibud on nii ilusad, et neid ei unusta keegi.",
  },
  "🦁": {
    img: "/images/avatars/lion.webp",
    et: "Lõvi",
    sv: "Lejonet",
    story:
      "Lejonet bär sin man som en krona och går med huvudet högt var det än kommer. Men under den modiga ytan finns ett varmt och lojalt hjärta.",
    storyEt:
      "Lõvi lakk näeb välja nagu kroon. Ta kõnnib alati uhkelt, pea püsti. Aga tema südames on palju soojust ja sõprust.",
  },
  "🐨": {
    img: "/images/avatars/koala.webp",
    et: "Koala",
    sv: "Koalan",
    story:
      "Koalan sover nästan hela dagen i sitt favoritträd, men är klarvaken och glad så fort det är dags att leka. Den kramar allt den tycker om, särskilt goda vänner.",
    storyEt:
      "Koala magab peaaegu terve päeva oma lemmikpuul. Aga kui on mänguaeg, on ta kohe ärkvel. Koala kallistab kõiki, keda ta armastab.",
  },
  "🐧": {
    img: "/images/avatars/penguin.webp",
    et: "Pingviin",
    sv: "Pingvinen",
    story:
      "Pingvinen kan inte flyga, men simmar som en pil genom det iskalla havet. Den vaggar lite komiskt på land — men är fullständigt graciös i vattnet.",
    storyEt:
      "Pingviin ei oska lennata, aga ujub kiiresti nagu nool. Maa peal kõnnib ta naljakalt kiikudes. Vees aga on ta tõeline tantsija.",
  },
  "🦄": {
    img: "/images/avatars/unicorn.webp",
    et: "Ükssarvik",
    sv: "Enhörningen",
    story:
      "Enhörningen finns bara i de allra vackraste sagorna, med ett horn som sägs skimra i regnbågens alla färger. Den dyker bara upp för den som verkligen tror på den.",
    storyEt:
      "Ükssarvik elab ainult kõige ilusamates muinasjuttudes. Tema sarv särab nagu vikerkaar. Ta näitab end ainult neile, kes temasse tõeliselt usuvad.",
  },
  "🐢": {
    img: "/images/avatars/turtle.webp",
    et: "Kilpkonn",
    sv: "Sköldpaddan",
    story:
      "Sköldpaddan tar sin tid med allt den gör, men kommer alltid fram till slut. Dess skal har sett mer av världen än de flesta andra djur i skogen.",
    storyEt:
      "Kilpkonn teeb kõike aeglaselt, aga jõuab alati kohale. Tema kilp on näinud rohkem maailma kui paljud teised metsaloomad.",
  },
  "🐙": {
    img: "/images/avatars/octopus.webp",
    et: "Kaheksajalg",
    sv: "Bläckfisken",
    story:
      "Bläckfisken har åtta armar och en förbluffande smart hjärna — den kan lösa gåtor som skulle ta andra djur evigheter. Den bor djupt i havet men längtar ibland efter att höra historier från land.",
    storyEt:
      "Kaheksajalal on kaheksa kätt ja väga tark pea. Ta elab sügaval meres. Vahel igatseb ta kuulda lugusid maa pealt.",
  },
};
