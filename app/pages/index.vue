<script setup lang="ts">
/* Spelet. Välkomstskärmen (logga in, skapa konto, familjekod eller spela utan konto) visas först när
   enheten inte är inloggad och antingen inte har någon sparad spelare, eller spelaren som valts är
   en vuxens - en vuxen som loggat ut ska inte se sitt spel förrän hen loggat in igen. */
const cloud = useCloudStore();
const profile = useProfileStore();
const { choseLocal, playLocal } = usePlayLocal();
const view = ref<"wait" | "gate" | "game">("wait");

function hasSavedPlayer() {
  return profile.players.some(key => profile.playerUsed(key));
}
/* den valda spelaren är en vuxens konto */
const adultPlayer = () => cloud.link?.kind === "adult";

onMounted(async () => {
  if (!cloud.enabled || (!adultPlayer() && (hasSavedPlayer() || choseLocal()))) {
    view.value = "game";
    return;
  }
  await cloud.whenReady(2500);
  view.value = cloud.session ? "game" : "gate";
});

function onLocal() {
  if (playLocal()) view.value = "game";
}
</script>

<template>
  <div>
    <WelcomeGate v-if="view === 'gate'" @local="onLocal" />
    <template v-else-if="view === 'game'">
      <!-- själva spelet: den gamla appen, tills skärmarna flyttats till Vue -->
      <LegacyApp />
      <!-- "Vem spelar?" på enheter där barnen spelar -->
      <WhoPlays />
    </template>
  </div>
</template>
