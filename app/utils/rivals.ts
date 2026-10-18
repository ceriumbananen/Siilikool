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
  /** Kort beskrivning, visas i rivallistan och figur-kortet (openCharCard() i app.js). */
  desc: string;
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
  },
  {
    id: "rebane",
    em: "🦊",
    et: "Rebane",
    sv: "Räven",
    skill: 0.66,
    need: 3,
    desc: "Kaxig och kvick. Spärrar vägen mot Tartu.",
  },
  {
    id: "karu",
    em: "🐻",
    et: "Karu",
    sv: "Björnen",
    skill: 0.76,
    need: 6,
    desc: "Långsam att svara, men sällan fel.",
  },
  {
    id: "draakon",
    em: "🐉",
    et: "Draakon",
    sv: "Draken",
    skill: 0.86,
    need: 9,
    desc: "Kan nästan varje ord. Nästan.",
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
