/* Gör datalagret nåbart för den gamla koden (public/legacy/app.js), som läser det som
   window.SiiriStore. Pluginen körs innan appen monteras, alltså innan LegacyApp laddar skripten. */

export default defineNuxtPlugin(() => {
  (window as unknown as { SiiriStore: ReturnType<typeof useProfileStore> }).SiiriStore = useProfileStore();
});
