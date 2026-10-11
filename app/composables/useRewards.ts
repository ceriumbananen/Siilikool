/* Poäng, nytt märke och hemligheter - porterat från addXp()/rankUp()/foundSecret()/eggReward()/
   eggSay() i public/legacy/app.js. Rutorna för nytt märke och hemligheter visas av
   UiRankUpOverlay och UiSecretOverlay (monteras i AppShell). */

const rankUp = ref<{ rank: Rank; index: number; style: MedalStyle } | null>(null);
const secret = ref<{ em: string; et: string; sv: string } | null>(null);
let secretTimer: ReturnType<typeof setTimeout> | undefined;

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

  /** Rutan "Hemlighet!" med Siiris replik (EGGS/EGGS2 i secrets.ts), som hon säger högt.
   * Stängs med knappen eller av sig själv efter 6s - aldrig av ett klick utanför, eftersom
   * barnen ofta trycker många gånger i rad (som eggSay()/eggSay2() i legacy). */
  function showSecret(id: string, em: string) {
    const line = EGGS[id] || EGGS2[id];
    if (!line) return;
    useSiiriVoice().sayWord(line.et);
    secret.value = { em, ...line };
    clearTimeout(secretTimer);
    secretTimer = setTimeout(closeSecret, 6000);
  }
  function closeSecret() {
    clearTimeout(secretTimer);
    secret.value = null;
  }

  return {
    addXp,
    foundSecret,
    secretReward,
    rankUp,
    closeRankUp: () => (rankUp.value = null),
    secret,
    showSecret,
    closeSecret,
  };
}
