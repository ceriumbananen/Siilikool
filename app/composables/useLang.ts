/* Språkriktningen för Vue-sidorna, bunden till spelaren (profile.state.home) - samma regler
   som tgt()/nat()/LT()/TL() i public/legacy/app.js (se "SPRÅKRIKTNING" där) och app/utils/lang.ts.

   const { L, tgt, nat, tgtLang, isEt } = useLang();
   - L("Svensk text", "Eesti tekst")  fast gränssnittstext på barnets eget språk
   - TL("Eesti", "Svenska")           text på språket barnet LÄR SIG (spegelbild av L)
   - tgt(o) / nat(o)                  ett { et, sv }-par: det man lär sig / förklaringen
   - tgtLang()                        lang-attribut för det man lär sig ("et" eller "sv")
   Alla är vanliga funktioner som läser profile.state.home, så de är reaktiva i templates.
   Vuxensidorna (/familj, /join, /invite) kan öppnas utan aktiv spelare: då gäller språket som valts
   på välkomstskärmen (siiri-home-pending, se WelcomeGate.vue). */
type Pair = { et: string; sv: string };

export function useLang() {
  const profile = useProfileStore();
  const pendingEt = () => {
    if (!import.meta.client) return false;
    try {
      return localStorage.getItem("siiri-home-pending") === "et";
    } catch {
      return false; /* privat läge o.d. */
    }
  };
  const isEt = () => profile.state.home === "et" || (!profile.state.name && pendingEt());
  const L = (sv: string, et: string) => (isEt() ? et : sv);
  const TL = (et: string, sv: string) => (isEt() ? sv : et);
  const tgt = (o: Pair | null | undefined) => (o ? (isEt() ? o.sv : o.et) : "");
  const nat = (o: Pair | null | undefined) => (o ? (isEt() ? o.et : o.sv) : "");
  const tgtLang = () => (isEt() ? "sv" : "et");
  return { isEt, L, TL, tgt, nat, tgtLang };
}
