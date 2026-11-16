<script setup lang="ts">
/* Välj eller byt lösenord för den inloggade vuxna (docs/plan-konton-v2.md). Behövs av konton som
   hittills bara loggat in med e-postkod, och efter "Glömt lösenordet?" (länken loggar in och leder
   hit med ?nyttLosen=1). */
const { highlight = false } = defineProps<{
  /** Visas överst och öppen, efter "Glömt lösenordet?". */
  highlight?: boolean;
}>();
const api = useParentApi();
const { L } = useLang();
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
    if (pw.value.length < 8)
      throw new Error(L("Välj ett lösenord på minst 8 tecken.", "Vali vähemalt 8 tähemärgi pikkune parool."));
    if (pw.value !== pw2.value) throw new Error(L("Lösenorden är inte lika.", "Paroolid ei ole ühesugused."));
    await api.setPassword(pw.value);
    pw.value = pw2.value = "";
    done.value = true;
    open.value = false;
  });
</script>

<template>
  <div ref="root" :class="[highlight && 'card', glow && 'pwcard--glow']">
    <h2 v-if="highlight" class="q">{{ L("Välj ett nytt lösenord", "Vali uus parool") }}</h2>
    <p v-if="done" class="ok" role="status">
      {{
        L(
          "Lösenordet är sparat. Nästa gång loggar du in med e-post och lösenord.",
          "Parool on salvestatud. Järgmine kord logid sisse e-posti ja parooliga.",
        )
      }}
    </p>
    <button v-if="!open" class="btn ghost wide" @click="((open = true), (done = false))">
      {{ L("🔑 Välj eller byt lösenord", "🔑 Vali või vaheta parool") }}
    </button>
    <form v-if="open" @submit.prevent="save">
      <label class="flabel"
        >{{ L("Nytt lösenord", "Uus parool") }}
        <input v-model="pw" class="field" type="password" autocomplete="new-password" minlength="8" required
      /></label>
      <label class="flabel"
        >{{ L("Samma lösenord igen", "Sama parool uuesti") }}
        <input v-model="pw2" class="field" type="password" autocomplete="new-password" minlength="8" required
      /></label>
      <p class="qsub">{{ L("Minst 8 tecken.", "Vähemalt 8 tähemärki.") }}</p>
      <button class="btn green wide" type="submit" :disabled="busy">
        {{ L("Spara lösenordet", "Salvesta parool") }}
      </button>
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
