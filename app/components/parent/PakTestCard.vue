<script setup lang="ts">
/* Testa Päkapiku kirjad (tomtenissens brev i december) före december: ett låtsasdatum som bara
   gäller den här enheten. Inget sparas i spelet - inga stjärnor, ingen XP, ingen tomteluva och
   inget i barnens framsteg. Ligger under Konto, alltså bakom inloggning och vuxen-PIN.
   Logiken i usePakTest() (app/composables/usePakapikk.ts). */
const { test, start, reset, stop } = usePakTest();

const year = new Date().getFullYear();
const QUICK = [
  { date: `${year}-11-26`, label: "26 nov", hint: "tom toffel" },
  { date: `${year}-12-01`, label: "1 dec", hint: "en lapp" },
  { date: `${year}-12-10`, label: "10 dec", hint: "två lappar" },
  { date: `${year}-12-17`, label: "17 dec", hint: "tre lappar" },
  { date: `${year}-12-24`, label: "24 dec", hint: "julafton" },
];
const custom = ref(test.value?.date || `${year}-12-01`);

function go(date: string) {
  start(date);
  custom.value = date;
  navigateTo("/room");
}
const label = computed(() => {
  if (!test.value) return "";
  const d = new Date(`${test.value.date}T12:00:00`);
  return d.toLocaleDateString("sv-SE", { day: "numeric", month: "long" });
});
</script>

<template>
  <div class="card">
    <h2 class="q">🧦 Testa Päkapiku kirjad</h2>
    <p class="qsub">
      Tomtenissens brev syns i Siiris rum från 24 november (tom toffel) och 1–24 december (breven). Här kan du prova
      leken redan nu genom att låtsas att det är ett annat datum.
      <b>Bara på den här enheten, och inget sparas i spelet</b> – inga stjärnor, ingen tomteluva, inget i barnens
      framsteg.
    </p>

    <p v-if="test" class="ok" role="status">
      🧪 Testläget är på: rummet tror att det är <b>{{ label }}</b
      >. {{ test.found.length }} av 24 testbrev hittade.
    </p>

    <div class="pak-test__quick">
      <button v-for="q in QUICK" :key="q.date" class="btn ghost pak-test__day" @click="go(q.date)">
        <b>{{ q.label }}</b
        ><small>{{ q.hint }}</small>
      </button>
    </div>

    <form class="pak-test__custom" @submit.prevent="go(custom)">
      <label class="flabel"
        >Eget datum
        <input v-model="custom" class="field" type="date" required />
      </label>
      <button class="btn green" type="submit">Öppna rummet</button>
    </form>

    <template v-if="test">
      <button class="btn ghost wide" @click="reset">↺ Börja om (alla testbrev väntar igen)</button>
      <button class="btn ghost wide" @click="stop">Stäng av testläget</button>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.pak-test {
  &__quick {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
    gap: $spacing-2;
    margin: $spacing-3 0;
  }

  &__day {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.125rem;
    padding-inline: 0.25rem;

    small {
      font-size: $font-size-xs;
      font-weight: 500;
      opacity: 0.8;
    }
  }

  &__custom {
    display: flex;
    gap: $spacing-2;
    align-items: flex-end;
    margin-bottom: $spacing-3;

    .flabel {
      flex: 1;
      margin: 0;
    }
  }
}
</style>
