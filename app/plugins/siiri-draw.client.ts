/* Siiris kläder, päls och ögonfärger (app/utils/siiri-portrait.ts) för den gamla koden
   (public/legacy/app.js), som window.SiiriDraw - så att båda ritar Siiri med samma kod.
   Pluginen körs innan appen monteras, alltså innan LegacyApp laddar skripten. */

export default defineNuxtPlugin(() => {
  (window as unknown as { SiiriDraw: unknown }).SiiriDraw = { wearSVG, furLayer, myFur, myEye, mixHex, FURS, EYES };
});
