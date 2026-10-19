<script setup lang="ts">
/* Bjud in en vuxen till familjen: en länk som gäller 7 dagar och kan användas en gång. */
const api = useParentApi();
const { busy, err, run } = useBusy();
const link = ref(""),
  copied = ref(false);

const invite = () =>
  run(async () => {
    link.value = `${location.origin}/invite?t=${await api.createInvite()}`;
    copied.value = false;
  });
async function copy() {
  try {
    await navigator.clipboard.writeText(link.value);
    copied.value = true;
  } catch {
    /* markera och kopiera för hand */
  }
}
</script>

<template>
  <div class="card">
    <h2 class="q">Bjud in en vuxen</h2>
    <template v-if="link">
      <p class="qsub">Skicka länken till den vuxna du vill bjuda in. Den gäller i 7 dagar och kan användas en gång.</p>
      <label class="flabel"
        >Inbjudningslänk
        <input class="field" :value="link" readonly @focus="($event.target as HTMLInputElement).select()"
      /></label>
      <button class="btn ghost wide" @click="copy">{{ copied ? "Kopierad ✓" : "Kopiera länken" }}</button>
    </template>
    <template v-else>
      <p class="qsub">Den vuxna får ett eget konto i familjen, med egen e-post och eget lösenord.</p>
      <button class="btn ghost wide" :disabled="busy" @click="invite">Skapa en inbjudningslänk</button>
    </template>
    <p v-if="err" class="err" role="alert">{{ err }}</p>
  </div>
</template>
