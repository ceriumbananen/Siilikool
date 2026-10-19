<script setup lang="ts">
/* Vuxen-PIN: gemensam för familjens vuxna. Den låser upp en enhet som lämnats över till barnen. */
/* hasPin: redan känt av den som visar kortet – annars hämtas det */
const props = defineProps<{ hasPin?: boolean }>();
const emit = defineEmits<{ saved: [] }>();
const api = useParentApi();
const { busy, err, run } = useBusy();
const pin = ref(""),
  saved = ref(false),
  hasPin = ref<boolean | null>(props.hasPin ?? null);
onMounted(() => {
  if (hasPin.value === null)
    run(async () => {
      hasPin.value = await api.hasAdultPin();
    });
});

const savePin = () =>
  run(async () => {
    if (!/^[0-9]{4,8}$/.test(pin.value)) throw new Error("PIN-koden ska vara 4–8 siffror.");
    await api.setAdultPin(pin.value);
    pin.value = "";
    saved.value = true;
    hasPin.value = true;
    emit("saved");
  });
const label = computed(() =>
  hasPin.value ? "Ny vuxen-PIN (4–8 siffror)" : "Välj en vuxen-PIN (4–8 siffror, gemensam för familjens vuxna)",
);
</script>

<template>
  <div>
    <p v-if="saved" class="ok" role="status">Vuxen-PIN sparad.</p>
    <label class="flabel"
      >{{ label }}
      <input
        v-model="pin"
        class="field code"
        type="password"
        inputmode="numeric"
        pattern="[0-9]*"
        autocomplete="new-password"
        maxlength="8"
        @keydown.enter="savePin"
    /></label>
    <button class="btn green wide" :disabled="busy || pin.length < 4" @click="savePin">
      {{ hasPin ? "Spara ny vuxen-PIN" : "Spara vuxen-PIN" }}
    </button>
    <p v-if="err" class="err" role="alert">{{ err }}</p>
  </div>
</template>
