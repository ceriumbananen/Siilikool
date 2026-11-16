<template>
  <!-- / = spelet (LegacyApp), /familj = Familjen (för vuxna), /join = barnens enheter (familjekod → Vem spelar?),
       /invite = vuxen tar emot inbjudan.
       Mellan spelet och de andra sidorna navigeras med vanliga länkar (hel sidladdning),
       eftersom den gamla appen bara kan starta en gång per sidladdning. -->
  <NuxtPage />
</template>

<script setup lang="ts">
/* fliktiteln och sidans språk följer spelarens språkriktning (estniskt läge = lär sig svenska);
   sidor med egen titel (t.ex. "Laat · Siilikool") skriver över titeln */
const { isEt } = useLang();
useHead({
  title: () => (isEt() ? "Siilikool – õpi rootsi keelt" : "Siilikool – lär dig estniska"),
  htmlAttrs: { lang: () => (isEt() ? "et" : "sv") },
});
</script>
