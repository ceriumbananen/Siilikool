/* Hoppar till en specifik skärm i den gamla motorn (public/legacy/app.js), som bara körs på
   hemskärmen (se app/components/LegacyApp.vue). Sparar ett litet märke i sessionStorage och
   länken till / laddar om sidan dit - i app.js:s uppstartssekvens (allra sist i filen) läses
   märket och man hoppar direkt till rätt skärm istället för till hemskärmen. Används av sidor
   som flyttats ut ur app.js men vars knappar fortfarande leder in i oporterade delar. */
export type LegacyScreen = "words" | "school" | "schoolimport" | "edit" | "admin";

export function markLegacyScreen(screen: LegacyScreen) {
  try {
    sessionStorage.setItem("siiri-open", screen);
  } catch {
    /* blockerad (t.ex. privat läge) - hamnar bara på hemskärmen istället */
  }
}
