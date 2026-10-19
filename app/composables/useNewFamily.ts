/* Ett nytt familjekonto från välkomstskärmen (WelcomeGate.vue): familjens och den vuxnas namn sparas
   tills inloggningen är klar - direkt, eller efter att e-posten bekräftats via länken i mejlet - och då
   skapas familjen, den vuxna blir spelaren på enheten och spelet sparas i kontot. */

const KEY = "siiri-eesti-ny-familj";
type Pending = { familyName: string; adultName: string };

export function savePendingFamily(p: Pending) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* blockerad - då får man skapa familjen i Familjen */
  }
}

function readPending(): Pending | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function useNewFamily() {
  const cloud = useCloudStore();
  const profile = useProfileStore();

  /** Skapar den sparade familjen om den inloggade vuxna inte har någon än. true om den skapades. */
  async function completePendingFamily(): Promise<boolean> {
    const p = readPending();
    if (!p || !cloud.isEmailUser) return false;
    await cloud.refreshSession();
    if (cloud.me?.family_id) {
      localStorage.removeItem(KEY);
      return false;
    }
    await useParentApi().createFamily(p.familyName, p.adultName);
    localStorage.removeItem(KEY);
    await cloud.refreshSession();
    /* den vuxna är spelaren på enheten: samma namn som i familjen, och spelet sparas i kontot */
    if (!profile.state.name) {
      profile.state.name = p.adultName;
      profile.state.setupdone = 1;
      profile.save();
    }
    await cloud.autoLinkOwnGame();
    return true;
  }

  return { completePendingFamily };
}
