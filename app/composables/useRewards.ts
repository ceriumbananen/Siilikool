/* Poäng, nytt märke och hemligheter - porterat från addXp()/rankUp()/foundSecret()/eggReward()
   i public/legacy/app.js (rad 2241-2286, 2475-2481, 5558-5569, 6738-6752). Rutan för nytt märke
   visas av UiRankUpOverlay (monteras i AppShell). */

const rankUp = ref<{ rank: Rank; index: number; style: MedalStyle } | null>(null);

export function useRewards() {
  const profile = useProfileStore();
  const { dance } = useSiiri();

  /** Ger poäng. Räcker de till ett nytt märke visas rutan för det, och Siiri dansar. */
  function addXp(n: number) {
    const before = rankIndex(profile.state.xp || 0);
    profile.state.xp = (profile.state.xp || 0) + n;
    const after = rankIndex(profile.state.xp);
    profile.save();
    if (after > before) {
      profile.state.rank = after;
      profile.save();
      setTimeout(() => showRankUp(after), 700);
    }
  }

  function showRankUp(index: number) {
    profile.autoBackup("nytt märke");
    setTimeout(() => dance(true), 600);
    const r = RANKS[index]!;
    const style = (profile.state.diff || "lagom") as MedalStyle;
    profile.state.mstyle = { ...(profile.state.mstyle || {}), [r.id]: style };
    profile.save();
    rankUp.value = { rank: r, index, style };
  }

  /** Markerar en hemlighet som hittad. true första gången. */
  function foundSecret(id: string): boolean {
    const secrets = (profile.state.secrets as string[] | undefined) || [];
    if (secrets.includes(id)) return false;
    profile.state.secrets = [...secrets, id];
    profile.save();
    return true;
  }

  /** Hemlighet med belöning: poäng (och stjärnor) bara första gången. true om den var ny. */
  function secretReward(id: string, xp = 40, stars = 0): boolean {
    const isNew = foundSecret(id);
    if (isNew) {
      addXp(xp);
      if (stars) {
        profile.state.stars = (profile.state.stars || 0) + stars;
        profile.save();
      }
    }
    return isNew;
  }

  return { addXp, foundSecret, secretReward, rankUp, closeRankUp: () => (rankUp.value = null) };
}
