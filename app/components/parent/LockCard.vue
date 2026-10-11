<script setup lang="ts">
/* Vuxen-PIN och lås. Låset gäller den här enhetens inloggning: föräldrafunktionerna försvinner och
   databasen nekar allt vuxet tills vuxen-PIN låser upp. Andra enheter påverkas inte. */
const cloud = useCloudStore();
const api = useParentApi();
const { busy, err, run } = useBusy();
const hasPin = ref<boolean | null>(null),
  pin = ref(""),
  saved = ref(false);

onMounted(() =>
  run(async () => {
    hasPin.value = await api.hasAdultPin();
  }),
);
const savePin = () =>
  run(async () => {
    if (!/^[0-9]{4,8}$/.test(pin.value)) throw new Error("PIN-koden ska vara 4–8 siffror.");
    await api.setAdultPin(pin.value);
    pin.value = "";
    hasPin.value = true;
    saved.value = true;
  });
const lock = () =>
  run(async () => {
    await cloud.lock();
    location.href = "/"; /* till spelet – nu som barnenhet */
  });
</script>

<template>
  <div class="card">
    <h2 class="q">Lås den här enheten</h2>
    <p class="qsub">
      För en enhet som barnen också använder. Låst visar den inget av föräldraläget, och barnen väljer vem som spelar.
      Dina andra enheter påverkas inte.
    </p>

    <!-- steg 1: utan vuxen-PIN går det inte att låsa upp, så den väljs först -->
    <template v-if="hasPin === false">
      <label class="flabel"
        >Välj en vuxen-PIN (4–8 siffror, gemensam för familjens vuxna)
        <input
          v-model="pin"
          class="field code"
          type="password"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="new-password"
          maxlength="8"
      /></label>
      <button class="btn green wide" :disabled="busy || pin.length < 4" @click="savePin">Spara vuxen-PIN</button>
      <p class="qsub">Sedan kan du låsa enheten.</p>
    </template>

    <!-- steg 2: låsa -->
    <template v-else-if="hasPin">
      <p v-if="saved" class="ok" role="status">Vuxen-PIN sparad. Nu kan du låsa enheten.</p>
      <button class="btn green wide" :disabled="busy" @click="lock">🔒 Lås den här enheten</button>
      <details class="more">
        <summary>Byt vuxen-PIN</summary>
        <label class="flabel"
          >Ny vuxen-PIN (4–8 siffror)
          <input
            v-model="pin"
            class="field code"
            type="password"
            inputmode="numeric"
            pattern="[0-9]*"
            autocomplete="new-password"
            maxlength="8"
        /></label>
        <button class="btn ghost wide" :disabled="busy || pin.length < 4" @click="savePin">Spara ny vuxen-PIN</button>
      </details>
    </template>
    <p v-if="err" class="err" role="alert">{{ err }}</p>
  </div>
</template>
