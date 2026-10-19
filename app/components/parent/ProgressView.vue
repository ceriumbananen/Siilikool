<script setup lang="ts">
/* Vad en spelare faktiskt kan: ord som sitter och vacklar, siffror, läxorden, tema för tema och
   orden att öva tillsammans. Används på medlemssidan i Familjen och för spelaren utan konto på
   enheten (ParentDevicePanel). Ersätter "För vuxna" i den gamla appen (parentScreen). */
const props = defineProps<{ progress: ChildProgress; name: string; emptyText?: string }>();

const schoolKnown = computed(() => props.progress.school?.words.filter(w => w.known).length ?? 0);
/* texterna ligger i skriptet i stället för i mallen – långa uttryck i {{ }} bryts annars fel av Prettier */
const schoolDays = computed(() => {
  const d = props.progress.school?.daysLeft ?? 0;
  return d > 0 ? `${d} dagar kvar` : "Listan har gått ut";
});
const tiles = computed(() => [
  { n: props.progress.words.strong, label: "ord som sitter" },
  { n: props.progress.words.shaky, label: "ord som vacklar" },
  { n: props.progress.words.unseen, label: "ord kvar att möta" },
  { n: props.progress.flames, label: "dagsutmaningar" },
  { n: props.progress.lessons, label: "lektioner" },
  { n: props.progress.correct, label: "rätta svar" },
  { n: props.progress.spoken, label: "ord sagda högt" },
  { n: props.progress.typed, label: "ord skrivna" },
]);
const medalEm = { gold: "🥇", silver: "🥈", bronze: "🥉", "": "" } as const;
const started = computed(() => props.progress.themes.filter(t => t.strong > 0).length);
</script>

<template>
  <div class="pview">
    <div class="stats">
      <div v-for="t in tiles" :key="t.label" class="stat">
        <b>{{ t.n }}</b
        ><span>{{ t.label }}</span>
      </div>
    </div>
    <p class="qsub">⭐ {{ progress.stars }} stjärnor · {{ progress.xp }} poäng · {{ progress.badges }} märken</p>
    <p class="qsub">
      Ett ord <b>sitter</b> först när {{ name }} klarat det flera gånger, helst genom att skriva eller säga det – inte
      bara peka på rätt bild.
    </p>
    <p v-if="!progress.words.practiced && emptyText" class="qsub">{{ emptyText }}</p>

    <template v-if="progress.school">
      <h3 class="sub">
        Glosor: {{ progress.school.name }} – {{ schoolKnown }} av {{ progress.school.words.length }} sitter
      </h3>
      <p class="qsub">{{ schoolDays }}</p>
      <ul class="wlist">
        <li v-for="w in progress.school.words" :key="w.et">
          {{ w.known ? "✅" : "⏳" }} <b lang="et">{{ w.et }}</b> = {{ w.sv }}
        </li>
      </ul>
    </template>
    <p v-if="progress.doneLists" class="qsub">{{ progress.doneLists }} tidigare glosor klara.</p>

    <template v-if="progress.hard.length">
      <h3 class="sub">Ord att öva tillsammans</h3>
      <ul class="pview__hard">
        <li v-for="h in progress.hard" :key="h.et + h.sv">
          <span aria-hidden="true">{{ h.em }}</span>
          <b lang="et">{{ h.et }}</b>
          <small>{{ h.sv }}</small>
        </li>
      </ul>
      <p class="qsub">Appen tar redan upp dem oftare. Att säga dem högt hemma hjälper mest.</p>
    </template>

    <details class="more pview__themes">
      <summary>Tema för tema ({{ started }} av {{ progress.themes.length }} påbörjade)</summary>
      <ul>
        <li v-for="t in progress.themes" :key="t.id" class="pview__theme">
          <span class="pview__theme-em" aria-hidden="true">{{ t.em }}</span>
          <span class="pview__theme-tx">
            <b>{{ t.sv }}</b>
            <span class="pview__bar" :class="`pview__bar--${t.medal || 'none'}`"
              ><i :style="{ width: t.pct + '%' }"
            /></span>
            <small>{{ t.strong }} av {{ t.total }} ord sitter{{ t.medal ? ` · ${medalEm[t.medal]}` : "" }}</small>
          </span>
        </li>
      </ul>
    </details>

    <details class="more">
      <summary>Om inlärningen</summary>
      <p class="qsub">
        Orden återkommer med växande mellanrum – en dag, två, fyra, åtta, sexton, trettio. Ett fel nollställer
        intervallet. Det är samma princip som i forskningen kring repetition över tid, och den är inbyggd i alla
        spellägen, så {{ name }} möter rätt ord utan att behöva välja dem.
      </p>
    </details>
  </div>
</template>

<style lang="scss" scoped>
.pview {
  &__hard {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
    gap: $spacing-1;
    margin: $spacing-2 0 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: $spacing-2 $spacing-1;
      border: 1px solid var(--line);
      border-radius: $radius-sm;
      text-align: center;
    }

    span {
      font-size: 1.5rem;
      line-height: 1.2;
    }

    small {
      color: var(--muted);
    }
  }

  &__themes ul {
    margin: $spacing-2 0 0;
    padding: 0;
    list-style: none;
  }

  &__theme {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    padding: $spacing-1 0;

    & + & {
      border-top: 1px dotted var(--line);
    }
  }

  &__theme-em {
    font-size: 1.5rem;
  }

  &__theme-tx {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;

    small {
      color: var(--muted);
    }
  }

  &__bar {
    display: block;
    height: 0.5rem;
    border-radius: $radius-pill;
    background: var(--line);
    overflow: hidden;

    i {
      display: block;
      height: 100%;
      background: var(--moss);
    }

    &--silver i {
      background: var(--blue);
    }

    &--gold i {
      background: var(--honey);
    }
  }
}
</style>
