/* Duell-motståndarna - porterat från RIVALS i public/legacy/app.js (rad 2317-2348).
   Bara det Skattkammarens Duellhylla behöver (em/et/sv); skill/need/desc hör till själva
   duellspelet och porteras när den skärmen migreras. */

export type Rival = {
  id: string;
  em: string;
  /** Illustrerad bild istället för bara emoji (samma handritade stil som Siiri) - se
   * public/images/rivals/. Valfri: rivaler utan egen bild visar bara em. */
  img?: string;
  et: string;
  sv: string;
};

export const RIVALS: Rival[] = [
  { id: "hiir", em: "🐭", et: "Hiir", sv: "Musen" },
  { id: "rebane", em: "🦊", et: "Rebane", sv: "Räven" },
  { id: "karu", em: "🐻", et: "Karu", sv: "Björnen" },
  { id: "draakon", em: "🐉", et: "Draakon", sv: "Draken" },
  { id: "vanapagan", em: "😈", img: "/images/rivals/vanapagan.webp", et: "Vanapagan", sv: "Vanapagan" },
];
