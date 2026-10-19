/* "Spela utan konto" på välkomstskärmen. Valet sparas på enheten, så att välkomstskärmen inte
   kommer tillbaka. Är spelaren som valts en utloggad vuxens byts det till ett lokalt spel på enheten
   (eller en ny spelare) - den vuxnas spel visas bara inloggad. Returnerar true om spelet kan visas
   direkt, false om sidan byter spelare och laddas om. */
const LOCAL_KEY = "siiri-eesti-lokalt";

export function usePlayLocal() {
  const cloud = useCloudStore();
  const profile = useProfileStore();

  function choseLocal() {
    try {
      return !!localStorage.getItem(LOCAL_KEY);
    } catch {
      return false;
    }
  }

  function playLocal(): boolean {
    try {
      localStorage.setItem(LOCAL_KEY, "1");
    } catch {
      /* blockerad - då visas välkomstskärmen igen nästa gång */
    }
    if (cloud.link?.kind !== "adult") return true;
    const local = profile.players.find(key => key.startsWith("l:") && profile.playerUsed(key));
    if (local) profile.switchPlayer(local, "/");
    else profile.newLocalPlayer("/");
    return false;
  }

  return { choseLocal, playLocal };
}
