/* Dagens utmaning - porterat från QUESTS/questOfDay/questProgress i public/legacy/app.js
   (rad 2811-2988). Bara läsningen är porterad hit; att registrera framsteg (bumpQuest)
   sker fortfarande i legacy-koden tills spelomgångarna själva är migrerade. */

export type Quest = {
  id: string;
  em: string;
  sv: string;
  goal: number;
  key: string;
};

const QUESTS: Quest[] = [
  { id: "right15", em: "🎯", sv: "Få 15 rätt idag", goal: 15, key: "correct" },
  { id: "speak6", em: "🎤", sv: "Säg 6 ord högt idag", goal: 6, key: "spoken" },
  { id: "themes2", em: "🏁", sv: "Klara 2 teman idag", goal: 2, key: "themes" },
  { id: "type8", em: "✏️", sv: "Skriv 8 ord rätt idag", goal: 8, key: "typed" },
  { id: "talk1", em: "💬", sv: "Prata klart ett samtal", goal: 1, key: "talks" },
  { id: "right25", em: "🔥", sv: "Få 25 rätt idag", goal: 25, key: "correct" },
  { id: "mixed1", em: "🎲", sv: "Klara en runda blandade ord", goal: 1, key: "mixed" },
  { id: "sent3", em: "🧩", sv: "Bygg 3 meningar rätt", goal: 3, key: "sent" },
];

/** Barnet kan välja sitt eget mål istället för det tilldelade (questPickScreen() i
 * app.js) - samma questPick-fält, så hemskärmen (legacy) och Skattkammaren (Vue) visar
 * samma mål. */
function questOfDay(questPick?: { day: string; id: string } | null): Quest {
  if (questPick && questPick.day === todayKey()) {
    const picked = QUESTS.find(q => q.id === questPick.id);
    if (picked) return picked;
  }
  return QUESTS[new Date().getDay() % QUESTS.length]!;
}

/** Dagens utmaning och hur långt spelaren kommit - S.dayp i sparfilen nollställs varje
 * ny dag av newDay() i legacy-koden (oförändrat tills vidare). */
export function useDailyQuest(
  dayProgress: Record<string, number | undefined>,
  questPick?: { day: string; id: string } | null,
) {
  const quest = questOfDay(questPick);
  const value = Math.min(dayProgress[quest.key] || 0, quest.goal);
  return { quest, value, done: value >= quest.goal };
}
