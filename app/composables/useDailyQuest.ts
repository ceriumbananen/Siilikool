/* Dagens utmaning - porterat från questOfDay/questProgress i public/legacy/app.js
   (rad 2811-2988). Bara läsningen är porterad hit; att registrera framsteg (bumpQuest)
   sker fortfarande i legacy-koden tills spelomgångarna själva är migrerade. Själva
   QUESTS-listan ligger i app/utils/quests.ts, delad med legacy-koden via window.SiiriData. */

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
