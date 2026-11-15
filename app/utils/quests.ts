/* Dagens utmaning - enda källan, delad mellan hemskärmen/questPickScreen() (legacy, läser
   via window.SiiriData, se app/plugins/siiri-data.client.ts) och Skattkammaren
   (useDailyQuest(), Vue). Låg tidigare som två oberoende kopior (en här, en i app.js) som
   kunde glida isär. */

export type Quest = {
  id: string;
  em: string;
  sv: string;
  /** samma utmaning på estniska (estniskt läge, se app/utils/lang.ts) */
  et: string;
  goal: number;
  key: string;
};

export const QUESTS: Quest[] = [
  { id: "right15", em: "🎯", sv: "Få 15 rätt idag", et: "Saa täna 15 õiget vastust", goal: 15, key: "correct" },
  { id: "speak6", em: "🎤", sv: "Säg 6 ord högt idag", et: "Ütle täna 6 sõna valjusti", goal: 6, key: "spoken" },
  { id: "themes2", em: "🏁", sv: "Klara 2 teman idag", et: "Lõpeta täna 2 teemat", goal: 2, key: "themes" },
  { id: "type8", em: "✏️", sv: "Skriv 8 ord rätt idag", et: "Kirjuta täna 8 sõna õigesti", goal: 8, key: "typed" },
  { id: "talk1", em: "💬", sv: "Prata klart ett samtal", et: "Räägi üks vestlus lõpuni", goal: 1, key: "talks" },
  { id: "right25", em: "🔥", sv: "Få 25 rätt idag", et: "Saa täna 25 õiget vastust", goal: 25, key: "correct" },
  { id: "mixed1", em: "🎲", sv: "Klara en runda blandade ord", et: "Tee üks segasõnade voor", goal: 1, key: "mixed" },
  { id: "sent3", em: "🧩", sv: "Bygg 3 meningar rätt", et: "Ehita 3 lauset õigesti", goal: 3, key: "sent" },
];
