<script setup lang="ts">
/* Päkapiku kirjad: adventskalendern under rummet. Hittade brev visar dagens sak och går att
   läsa (och höra) igen, väntande brev ligger som kuvert, kommande dagar är bara siffror. */
const pak = usePakapikk();

const days = computed(() =>
  Array.from({ length: PAK_DAYS }, (_, i) => {
    const d = i + 1;
    const state = pak.isFound(d) ? "found" : d <= pak.phase.value.open ? "waiting" : "later";
    return { d, state, gift: pakDay(d).gift };
  }),
);
const foundCount = computed(() => days.value.filter(x => x.state === "found").length);

function pick(d: number, state: string) {
  if (state === "later") return;
  pak.openLetter(d);
}
</script>

<template>
  <UiAppCard v-if="pak.phase.value.phase === 'on'" class="pak-cal">
    <h2 class="pak-cal__title"><span lang="et">Päkapiku kirjad</span> · Tomtenissens brev</h2>
    <p class="pak-cal__sub">
      I Estland lämnar tomtenissarna, päkapikud, små överraskningar till barnen varje natt i december. Siiris nisse
      gömmer ett brev på estniska i rummet varje dag: hitta brevet, läs och leta!
      <b>{{ foundCount }} av {{ PAK_DAYS }}</b>
    </p>
    <div class="pak-cal__grid">
      <button
        v-for="x in days"
        :key="x.d"
        class="pak-cal__day"
        :class="`pak-cal__day--${x.state}`"
        :disabled="x.state === 'later' || pak.searching.value"
        :aria-label="
          x.state === 'found'
            ? `${x.d} december: ${x.gift.sv}, läs brevet igen`
            : x.state === 'waiting'
              ? `${x.d} december: brevet väntar`
              : `${x.d} december`
        "
        @click="pick(x.d, x.state)"
      >
        <small>{{ x.d }}</small>
        <img v-if="x.state === 'found' && x.gift.img" :src="x.gift.img" alt="" class="pak-cal__img" />
        <span v-else aria-hidden="true">{{ x.state === "found" ? x.gift.em : x.state === "waiting" ? "✉️" : "" }}</span>
      </button>
    </div>
  </UiAppCard>
</template>

<style lang="scss" scoped>
.pak-cal {
  margin-top: $spacing-2;

  &__title {
    font-size: $font-size-md;
    margin: 0 0 $spacing-1;
  }

  &__sub {
    font-size: $font-size-sm;
    color: var(--muted);
    margin: 0 0 $spacing-3;
    line-height: 1.5;

    b {
      color: var(--ink);
      white-space: nowrap;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.375rem;

    /* surfplatta/dator: två rader om tolv i stället för stora rutor */
    @media (min-width: 40rem) {
      grid-template-columns: repeat(12, 1fr);
    }
  }

  &__day {
    position: relative;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-md;
    border: $border-width solid var(--line);
    background: var(--bg2);
    color: var(--muted);
    font: inherit;
    padding: 0;
    cursor: pointer;
    @include focus-visible;

    small {
      position: absolute;
      top: 0.125rem;
      left: 0.3125rem;
      font-size: $font-size-xs;
      font-weight: 700;
    }

    span {
      font-size: 1.375rem;
    }

    .pak-cal__img {
      width: 1.625rem;
      height: 1.625rem;
      object-fit: contain;
    }

    &--found {
      background: #fffaf0;
      border-color: #c8352e;
      color: #a0261f;
    }

    &--waiting {
      border-color: var(--honey);
      color: var(--ink);
      animation: pak-cal-glow 2.4s ease-in-out infinite;
    }

    &--later {
      cursor: default;
      opacity: 0.55;

      small {
        position: static;
        font-size: $font-size-sm;
      }
    }

    &:disabled:not(&--later) {
      cursor: default;
    }
  }
}

@keyframes pak-cal-glow {
  0%,
  100% {
    box-shadow: none;
  }
  50% {
    box-shadow: 0 0 0.625rem rgba(232, 195, 74, 0.6);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pak-cal__day--waiting {
    animation: none;
  }
}
</style>
