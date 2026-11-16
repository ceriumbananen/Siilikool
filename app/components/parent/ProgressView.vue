<script setup lang="ts">
/* Vad en spelare faktiskt kan: ord som sitter och vacklar, siffror, läxorden, tema för tema och
   orden att öva tillsammans. Används på medlemssidan i Familjen och för spelaren utan konto på
   enheten (ParentDevicePanel). Ersätter "För vuxna" i den gamla appen (parentScreen). */
const props = defineProps<{ progress: ChildProgress; name: string; emptyText?: string }>();
const { L, isEt } = useLang();

const schoolKnown = computed(() => props.progress.school?.words.filter(w => w.known).length ?? 0);
/* texterna ligger i skriptet i stället för i mallen – långa uttryck i {{ }} bryts annars fel av Prettier */
const schoolDays = computed(() => {
  const d = props.progress.school?.daysLeft ?? 0;
  return d > 0 ? L(`${d} dagar kvar`, `${d} päeva jäänud`) : L("Listan har gått ut", "Loend on aegunud");
});
const tiles = computed(() => [
  { n: props.progress.words.strong, label: L("ord som sitter", "selgeks saanud sõna") },
  { n: props.progress.words.shaky, label: L("ord som vacklar", "veel ebakindlat sõna") },
  { n: props.progress.words.unseen, label: L("ord kvar att möta", "sõna veel ees") },
  { n: props.progress.flames, label: L("dagsutmaningar", "päeva väljakutset") },
  { n: props.progress.lessons, label: L("lektioner", "tundi") },
  { n: props.progress.correct, label: L("rätta svar", "õiget vastust") },
  { n: props.progress.spoken, label: L("ord sagda högt", "valjusti öeldud sõna") },
  { n: props.progress.typed, label: L("ord skrivna", "kirjutatud sõna") },
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
    <p class="qsub">
      ⭐ {{ progress.stars }} {{ L("stjärnor", "tähte") }} · {{ progress.xp }} {{ L("poäng", "punkti") }} ·
      {{ progress.badges }} {{ L("märken", "märki") }}
    </p>
    <p v-if="isEt()" class="qsub">
      Sõna on <b>selge</b> alles siis, kui laps ({{ name }}) on sellega mitu korda hakkama saanud, eelistatult seda
      kirjutades või öeldes – mitte ainult õigele pildile osutades.
    </p>
    <p v-else class="qsub">
      Ett ord <b>sitter</b> först när {{ name }} klarat det flera gånger, helst genom att skriva eller säga det – inte
      bara peka på rätt bild.
    </p>
    <p v-if="!progress.words.practiced && emptyText" class="qsub">{{ emptyText }}</p>

    <template v-if="progress.school">
      <h3 class="sub">
        {{ L("Glosor:", "Koolisõnad:") }} {{ progress.school.name }} –
        {{
          L(
            `${schoolKnown} av ${progress.school.words.length} sitter`,
            `${schoolKnown}/${progress.school.words.length} selged`,
          )
        }}
      </h3>
      <p class="qsub">{{ schoolDays }}</p>
      <ul class="wlist">
        <li v-for="w in progress.school.words" :key="w.et">
          {{ w.known ? "✅" : "⏳" }} <b lang="et">{{ w.et }}</b> = {{ w.sv }}
        </li>
      </ul>
    </template>
    <p v-if="progress.doneLists" class="qsub">
      {{ L(`${progress.doneLists} tidigare glosor klara.`, `Varasemaid sõnaloendeid tehtud: ${progress.doneLists}.`) }}
    </p>

    <template v-if="progress.hard.length">
      <h3 class="sub">{{ L("Ord att öva tillsammans", "Sõnad, mida koos harjutada") }}</h3>
      <ul class="pview__hard">
        <li v-for="h in progress.hard" :key="h.et + h.sv">
          <span aria-hidden="true">{{ h.em }}</span>
          <b lang="et">{{ h.et }}</b>
          <small>{{ h.sv }}</small>
        </li>
      </ul>
      <p class="qsub">
        {{
          L(
            "Appen tar redan upp dem oftare. Att säga dem högt hemma hjälper mest.",
            "Äpp kordab neid juba sagedamini. Kõige rohkem aitab, kui neid kodus valjusti öelda.",
          )
        }}
      </p>
    </template>

    <details class="more pview__themes">
      <summary>
        {{
          L(
            `Tema för tema (${started} av ${progress.themes.length} påbörjade)`,
            `Teemade kaupa (alustatud ${started}/${progress.themes.length})`,
          )
        }}
      </summary>
      <ul>
        <li v-for="t in progress.themes" :key="t.id" class="pview__theme">
          <span class="pview__theme-em" aria-hidden="true">{{ t.em }}</span>
          <span class="pview__theme-tx">
            <b>{{ isEt() ? t.et : t.sv }}</b>
            <span class="pview__bar" :class="`pview__bar--${t.medal || 'none'}`"
              ><i :style="{ width: t.pct + '%' }"
            /></span>
            <small
              >{{ L(`${t.strong} av ${t.total} ord sitter`, `${t.strong}/${t.total} sõna selged`)
              }}{{ t.medal ? ` · ${medalEm[t.medal]}` : "" }}</small
            >
          </span>
        </li>
      </ul>
    </details>

    <details class="more">
      <summary>{{ L("Om inlärningen", "Õppimisest") }}</summary>
      <p v-if="isEt()" class="qsub">
        Sõnad tulevad tagasi üha pikemate vahedega – üks päev, kaks, neli, kaheksa, kuusteist, kolmkümmend. Viga alustab
        vahe uuesti otsast. See on sama põhimõte, mida uuritakse ajas hajutatud kordamise juures, ja see on sisse
        ehitatud kõigisse mänguviisidesse, nii et laps kohtab õigeid sõnu ilma neid ise valimata.
      </p>
      <p v-else class="qsub">
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
