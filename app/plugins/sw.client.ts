/* Registrerar service workern (byggs från app/service-worker/sw.ts till /sw.js).
   Bara i den byggda appen – i `yarn dev` finns ingen service worker, så inget gammalt cachas. */
export default defineNuxtPlugin(() => {
  if (import.meta.dev || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js").catch(() => {
    /* offline-stödet är en bonus, appen fungerar ändå */
  });
});
