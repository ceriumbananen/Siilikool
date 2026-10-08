<script setup lang="ts">
/* De vuxna i familjen, och en inbjudningslänk för fler (gäller 7 dagar, en gång). */
defineProps<{ adults: Member[] }>();
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
  <div class="card" style="text-align: left">
    <p class="q" style="text-align: left">Vuxna i familjen</p>
    <ul class="wlist">
      <li v-for="a in adults" :key="a.id">{{ a.avatar }} {{ a.name || "Vuxen" }}</li>
    </ul>
    <template v-if="link">
      <p class="qsub">Skicka länken till den vuxna du vill bjuda in. Den gäller i 7 dagar och kan användas en gång.</p>
      <input class="field" :value="link" readonly @focus="($event.target as HTMLInputElement).select()" />
      <button class="btn ghost wide" @click="copy">{{ copied ? "Kopierad ✓" : "Kopiera länken" }}</button>
    </template>
    <button v-else class="btn ghost wide" :disabled="busy" @click="invite">Bjud in en vuxen</button>
    <p v-if="err" class="err">{{ err }}</p>
  </div>
</template>
