<script setup lang="ts">
/* Välj eller byt lösenord för den inloggade vuxna (docs/plan-konton-v2.md). Behövs av konton som
   hittills bara loggat in med e-postkod, och efter "Glömt lösenordet?" (länken loggar in och leder
   hit med ?nyttLosen=1). */
const { highlight = false } = defineProps<{
  /** Visas överst och öppen, efter "Glömt lösenordet?". */
  highlight?: boolean;
}>();
const api = useParentApi();
const { busy, err, run } = useBusy();
const open = ref(highlight),
  pw = ref(""),
  pw2 = ref(""),
  done = ref(false);

/* efter "Glömt lösenordet?": rulla hit och lys upp kortet en stund, så att ögat hittar det */
const root = ref<HTMLElement | null>(null);
const glow = ref(false);
onMounted(() => {
  if (!highlight) return;
  root.value?.scrollIntoView({ behavior: "smooth", block: "center" });
  glow.value = true;
  setTimeout(() => (glow.value = false), 4000);
});

const save = () =>
  run(async () => {
    if (pw.value.length < 8) throw new Error("Välj ett lösenord på minst 8 tecken.");
    if (pw.value !== pw2.value) throw new Error("Lösenorden är inte lika.");
    await api.setPassword(pw.value);
    pw.value = pw2.value = "";
    done.value = true;
    open.value = false;
  });
</script>

<template>
  <div ref="root" :class="[highlight && 'card', glow && 'pwcard--glow']">
    <h2 v-if="highlight" class="q">Välj ett nytt lösenord</h2>
    <p v-if="done" class="ok" role="status">Lösenordet är sparat. Nästa gång loggar du in med e-post och lösenord.</p>
    <button v-if="!open" class="btn ghost wide" @click="((open = true), (done = false))">
      🔑 Välj eller byt lösenord
    </button>
    <form v-if="open" @submit.prevent="save">
      <label class="flabel"
        >Nytt lösenord
        <input v-model="pw" class="field" type="password" autocomplete="new-password" minlength="8" required
      /></label>
      <label class="flabel"
        >Samma lösenord igen
        <input v-model="pw2" class="field" type="password" autocomplete="new-password" minlength="8" required
      /></label>
      <p class="qsub">Minst 8 tecken.</p>
      <button class="btn green wide" type="submit" :disabled="busy">Spara lösenordet</button>
    </form>
    <p v-if="err" class="err" role="alert">{{ err }}</p>
  </div>
</template>

<style lang="scss" scoped>
/* gul ram som pulserar några gånger och sedan försvinner */
.pwcard--glow {
  animation: pwglow 1.3s ease-in-out 3;
}
@keyframes pwglow {
  0%,
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--honey) 0%, transparent);
    border-color: var(--line);
  }
  50% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--honey) 55%, transparent);
    border-color: var(--honey);
  }
}
@media (prefers-reduced-motion: reduce) {
  .pwcard--glow {
    animation: none;
    border-color: var(--honey);
  }
}
</style>
