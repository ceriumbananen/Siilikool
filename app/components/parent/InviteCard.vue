<script setup lang="ts">
/* Bjud in en vuxen till familjen: en länk som gäller 7 dagar och kan användas en gång. */
const api = useParentApi();
const { L } = useLang();
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
    <h2 class="q">{{ L("Bjud in en vuxen", "Kutsu täiskasvanu") }}</h2>
    <template v-if="link">
      <p class="qsub">
        {{
          L(
            "Skicka länken till den vuxna du vill bjuda in. Den gäller i 7 dagar och kan användas en gång.",
            "Saada link täiskasvanule, keda tahad kutsuda. See kehtib 7 päeva ja seda saab kasutada ühe korra.",
          )
        }}
      </p>
      <label class="flabel"
        >{{ L("Inbjudningslänk", "Kutse link") }}
        <input class="field" :value="link" readonly @focus="($event.target as HTMLInputElement).select()"
      /></label>
      <button class="btn ghost wide" @click="copy">
        {{ copied ? L("Kopierad ✓", "Kopeeritud ✓") : L("Kopiera länken", "Kopeeri link") }}
      </button>
    </template>
    <template v-else>
      <p class="qsub">
        {{
          L(
            "Den vuxna får ett eget konto i familjen, med egen e-post och eget lösenord.",
            "Täiskasvanu saab peres oma konto, oma e-posti ja oma parooliga.",
          )
        }}
      </p>
      <button class="btn ghost wide" :disabled="busy" @click="invite">
        {{ L("Skapa en inbjudningslänk", "Loo kutse link") }}
      </button>
    </template>
    <p v-if="err" class="err" role="alert">{{ err }}</p>
  </div>
</template>
