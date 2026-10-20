/* Duell-motståndarna - enda källan, delad mellan Skattkammarens Duellhylla (Vue) och
   duellspelet (public/legacy/app.js, som läser den via window.SiiriData, se
   app/plugins/siiri-data.client.ts). Tidigare fanns en andra, ofullständig kopia direkt i
   rivals.ts (bara em/et/sv/img) - den kunde glida isär från app.js:s egen lista, som redan
   hänt en gång när Vanapagans img-fält bara lades till på ena stället. */

export type Rival = {
  id: string;
  em: string;
  /** Illustrerad bild istället för bara emoji (samma handritade stil som Siiri) - se
   * public/images/rivals/. Valfri: rivaler utan egen bild visar bara em. */
  img?: string;
  et: string;
  sv: string;
  /** Hur ofta rivalen svarar rätt (0-1) i duellens AI. */
  skill: number;
  /** Antal besökta Teekond-orter som krävs för att låsa upp rivalen. */
  need: number;
  /** Kort beskrivning, visas i rivallistan och duellens setup-ruta. */
  desc: string;
  /** Lite längre, påhittad historia om rivalen - visas i figur-kortet (openCharCard() i
   * app.js) istället för desc, när den finns. Bara för de påhittade djur-rivalerna; de
   * estniska folktrofigurerna (Vanapagan här, Kalevipoeg/Suur Tõll i LORE) har redan sin
   * egen, riktiga historia i desc/fact och behöver ingen. */
  story?: string;
  /** Samma historia på enkel, barnanpassad estniska - visas som förval i figur-kortet, med
   * en knapp för att växla till story (svenska) för den som inte hänger med. */
  storyEt?: string;
};

export const RIVALS: Rival[] = [
  {
    id: "hiir",
    em: "🐭",
    img: "/images/rivals/hiir.webp",
    et: "Hiir",
    sv: "Musen",
    skill: 0.5,
    need: 0,
    desc: "Snabb men slarvig. Bra att börja med.",
    story:
      "En gång gömde sig Hiir i Siiris ryggsäck hela vägen till skolan, bara för äventyrets skull. Hon kom hem med halva läxan borttappad på vägen, men hade upptäckt tre nya gömställen ingen annan mus känt till. Numera utmanar hon alla hon möter, mest för att hon inte kan sitta still.",
    storyEt:
      "Hiir on väike ja kiire. Ta armastab seiklusi ja uusi kohti. Hiir ei oska kaua paigal istuda, seepärast kutsub ta kõiki endaga võistlema.",
  },
  {
    id: "rebane",
    em: "🦊",
    img: "/images/rivals/rebane.webp",
    et: "Rebane",
    sv: "Räven",
    skill: 0.66,
    need: 3,
    desc: "Kaxig och kvick. Spärrar vägen mot Tartu.",
    story:
      "Rebane bor i en lya vid vägkanten strax utanför Tartu, och ingen kommer förbi utan att först svara på hennes frågor. Hon lärde sig alla sina ord på en enda vinter, av ren envishet, och har inte förlorat en enda duell sedan dess — än.",
    storyEt:
      "Rebane on tark ja kaval. Ta elab metsas Tartu lähedal ega lase kedagi mööda enne, kui nad vastavad tema küsimustele. Rebane õppis kõik sõnad ühe ainsa talvega.",
  },
  {
    id: "karu",
    em: "🐻",
    img: "/images/rivals/karu.webp",
    et: "Karu",
    sv: "Björnen",
    skill: 0.76,
    need: 6,
    desc: "Långsam att svara, men sällan fel.",
    story:
      "Karu läser en sida i taget i byns lilla bibliotek och skyndar sig aldrig för någon. Han svarar hellre sent och rätt än snabbt och fel, och säger ofta att den som väntar lugnt till slut alltid hittar rätt ord.",
    storyEt:
      "Karu on suur ja rahulik. Ta loeb raamatukogus aeglaselt, lehekülg korraga, ega kiirusta kunagi. Parem hilja ja õigesti kui kiiresti ja valesti, ütleb ta sageli.",
  },
  {
    id: "draakon",
    em: "🐉",
    img: "/images/rivals/draakon.webp",
    et: "Draakon",
    sv: "Draken",
    skill: 0.86,
    need: 9,
    desc: "Kan nästan varje ord. Nästan.",
    story:
      "Draakon är den minsta draken i hela skogen och lite blyg för sin storlek, men hans minne är desto större. Han har läst nästan hela ordboken från pärm till pärm — nästan, för sidan med sitt eget namn rev han av sig och åt upp av misstag.",
    storyEt:
      "Draakon on metsa kõige väiksem lohe, aga tema mälu on seda suurem. Ta on lugenud peaaegu kogu sõnaraamatu läbi. Ainult lehekülje oma nimega sõi ta kogemata ära.",
  },
  {
    id: "vanapagan",
    em: "😈",
    img: "/images/rivals/vanapagan.webp",
    et: "Vanapagan",
    sv: "Vanapagan",
    skill: 0.9,
    need: 12,
    desc: "Gammal som jorden och listig som få. I de estniska sagorna vinner alltid den som är klipskast i ord — visa att det är du.",
  },
];
