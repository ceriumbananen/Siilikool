<script setup lang="ts">
/* Vuxen-PIN och lås. Låset gäller den här enhetens inloggning: föräldrafunktionerna försvinner och
   databasen nekar allt vuxet tills vuxen-PIN låser upp. Andra enheter påverkas inte. */
const cloud = useCloudStore();
const api = useParentApi();
const { busy, err, run } = useBusy();
const hasPin = ref<boolean | null>(null),
  pin = ref(""),
  saved = ref(false);

/* i skriptet i stället för i mallen – långa uttryck i {{ }} bryts annars fel av Prettier */
const pinPrompt = computed(() =>
  hasPin.value
    ? "Byt vuxen-PIN (gemensam för familjens vuxna):"
    : "Välj först en vuxen-PIN (gemensam för familjens vuxna):",
);
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
  <div class="card" style="text-align: left">
    <p class="q" style="text-align: left">Lås den här enheten</p>
    <p class="qsub">
      För en enhet som barnen också använder. När den är låst syns inget av föräldraläget, och barnen väljer vem som
      spelar. Du låser upp med vuxen-PIN-koden. Dina andra enheter påverkas inte.
    </p>
    <button v-if="hasPin" class="btn green wide" :disabled="busy" @click="lock">🔒 Lås den här enheten</button>
    <p class="qsub" style="margin-top: 12px">
      {{ pinPrompt }}
    </p>
    <input
      v-model="pin"
      class="field code"
      type="password"
      inputmode="numeric"
      pattern="[0-9]*"
      autocomplete="new-password"
      maxlength="8"
      placeholder="4–8 siffror"
    />
    <button class="btn ghost wide" :disabled="busy || pin.length < 4" @click="savePin">Spara vuxen-PIN</button>
    <p v-if="saved" class="ok">Vuxen-PIN sparad.</p>
    <p v-if="err" class="err">{{ err }}</p>
  </div>
</template>
