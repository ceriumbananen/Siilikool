/* Duell-motståndarna - porterat från RIVALS i public/legacy/app.js (rad 2317-2348).
   Bara det Skattkammarens Duellhylla behöver (em/et/sv); skill/need/desc hör till själva
   duellspelet och porteras när den skärmen migreras. */

export type Rival = {
  id: string;
  em: string;
  et: string;
  sv: string;
};

export const RIVALS: Rival[] = [
  { id: "hiir", em: "🐭", et: "Hiir", sv: "Musen" },
  { id: "rebane", em: "🦊", et: "Rebane", sv: "Räven" },
  { id: "karu", em: "🐻", et: "Karu", sv: "Björnen" },
  { id: "draakon", em: "🐉", et: "Draakon", sv: "Draken" },
  { id: "vanapagan", em: "😈", et: "Vanapagan", sv: "Vanapagan" },
];
