<script setup lang="ts">
/* "Lämna över till barnen": enheten låses – Familjen-sidan försvinner, databasen nekar allt vuxet och
   barnen väljer vem som spelar ("Vem spelar?"), tills vuxen-PIN låser upp. Andra enheter påverkas inte. */
const cloud = useCloudStore();
const api = useParentApi();
const { busy, err, run } = useBusy();
const hasPin = ref<boolean | null>(null);

onMounted(() =>
  run(async () => {
    hasPin.value = await api.hasAdultPin();
  }),
);
const handOver = () =>
  run(async () => {
    await cloud.lock();
    location.href = "/"; /* till spelet – barnen väljer vem som spelar */
  });
</script>

<template>
  <div class="card">
    <h2 class="q">🔒 Lämna över till barnen</h2>
    <p class="qsub">
      Ska barnen spela på den här enheten? Då låses Familjen-sidan och barnen väljer vem som spelar. Du låser upp med
      vuxen-PIN. Dina andra enheter påverkas inte.
    </p>
    <!-- utan vuxen-PIN går det inte att låsa upp, så den väljs först -->
    <template v-if="hasPin === false">
      <p class="qsub">Välj först en vuxen-PIN – den behövs för att låsa upp igen.</p>
      <ParentAdultPinCard :has-pin="false" @saved="hasPin = true" />
    </template>
    <button v-else-if="hasPin" class="btn green wide" :disabled="busy" @click="handOver">Lämna över till barnen</button>
    <p v-if="err" class="err" role="alert">{{ err }}</p>
  </div>
</template>
