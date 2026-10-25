/* Spelets innehåll (listor i app/utils/) för den gamla koden (public/legacy/app.js), som
   window.SiiriData - en enda källa för både Vue-sidorna och legacy-skärmarna, så att listorna
   inte finns i två kopior som kan glida isär. Pluginen körs innan appen monteras, alltså innan
   LegacyApp laddar skripten. */

export default defineNuxtPlugin(() => {
  (window as unknown as { SiiriData: unknown }).SiiriData = {
    RANKS,
    SECRETS,
    EGGS,
    EGGS2,
    /* seasons.ts, shop.ts (platserna) */
    SEASONS,
    HOLIDAYS,
    WEAR_SLOTS,
    FURN_SLOTS,
    BADGES,
    badgeProgress,
    /* themes.ts, sentences.ts, chats.ts */
    THEMES,
    WORDART,
    SENTENCES,
    PET_SENTENCE_TEMPLATES,
    CHATS,
    /* trip.ts, shop.ts */
    TRIP,
    TRIPTASKS,
    STORY,
    LORE,
    STATIONS,
    STSKIP,
    SOUVENIR,
    EPILOGUE,
    SHOP,
    FURN,
    /* rivals.ts, avatars.ts, quests.ts */
    RIVALS,
    AVATARS,
    AVATAR_INFO,
    QUESTS,
    /* scenes.ts, praise.ts */
    SCENE,
    SCENE_AED,
    SCENE_KOOK,
    SCENE_TURG,
    OSCENES,
    MANTELSVG,
    FIRESVG,
    WINDOWSVG,
    FIREDEFS,
    PRAISE,
    TAUNT,
    DIFFS,
  };
});
