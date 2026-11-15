<script setup lang="ts">
/* Päkapiku kirjad: lappens instruktion medan man letar. Ligger direkt under rummet i stället
   för i det, så att den aldrig täcker något man ska leta bakom (flaggan, gardinerna). */
const pak = usePakapikk();
const { test, stop } = usePakTest();
const testDay = computed(() =>
  test.value
    ? new Date(`${test.value.date}T12:00:00`).toLocaleDateString("sv-SE", { day: "numeric", month: "long" })
    : "",
);
</script>

<template>
  <!-- testläget (Familjen → Konto): synligt så att ingen glömmer att det är på -->
  <div v-if="test && !pak.searching.value" class="pak-test-bar" role="status">
    <span
      >🧪 Testläge: rummet tror att det är <b>{{ testDay }}</b
      >. Inget sparas.</span
    >
    <button class="pak-test-bar__off" @click="stop">Stäng av</button>
  </div>
  <div v-if="pak.searching.value && pak.target.value" class="pak-banner">
    <button class="pak-banner__say" aria-label="Läs upp igen" @click="pak.sayLine(pak.target.value.ask.et)">
      <span aria-hidden="true">📜</span>
      <b lang="et">{{ pak.target.value.ask.et }}</b>
      <small v-if="pak.showSv.value">{{ pak.target.value.ask.sv }}</small>
      <small v-else>Tryck för att höra igen</small>
    </button>
    <button
      v-if="!pak.showSv.value"
      class="pak-banner__btn"
      aria-label="Visa på svenska"
      @click="pak.showSv.value = true"
    >
      🇸🇪
    </button>
    <button class="pak-banner__btn" aria-label="Sluta leta" @click="pak.close()">✕</button>
  </div>
</template>

<style lang="scss" scoped>
.pak-banner {
  display: flex;
  gap: 0.375rem;
  align-items: stretch;
  margin: $spacing-2 0;
  animation: pak-drop 0.4s cubic-bezier(0.34, 1.4, 0.4, 1);

  &__say {
    flex: 1;
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 0.625rem;
    align-items: center;
    text-align: left;
    background: #fffaf0;
    color: #3a2a20;
    border: $border-width solid #c8352e;
    border-radius: $radius-md;
    padding: 0.5rem 0.75rem;
    box-shadow: $shadow-2;
    cursor: pointer;
    font: inherit;
    @include focus-visible;

    span {
      grid-row: span 2;
      font-size: 1.625rem;
    }

    b {
      font-size: $font-size-lg;
      color: #a0261f;
    }

    small {
      font-size: $font-size-xs;
      color: #7a6a58;
    }
  }

  &__btn {
    flex: none;
    width: 3rem;
    border: $border-width solid var(--line);
    border-radius: $radius-md;
    background: var(--card);
    color: var(--ink);
    font-size: 1.125rem;
    cursor: pointer;
    box-shadow: $shadow-2;
    @include focus-visible;
  }
}

.pak-test-bar {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  margin: $spacing-2 0;
  padding: 0.5rem 0.75rem;
  border-radius: $radius-md;
  border: $border-width dashed var(--honey);
  background: color-mix(in srgb, var(--honey) 14%, var(--card));
  color: var(--ink);
  font-size: $font-size-sm;
  line-height: 1.4;

  span {
    flex: 1;
  }

  &__off {
    flex: none;
    border: $border-width solid var(--line);
    border-radius: $radius-pill;
    background: var(--card);
    color: var(--ink);
    font: inherit;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    cursor: pointer;
    @include focus-visible;
  }
}

@keyframes pak-drop {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pak-banner {
    animation: none;
  }
}
</style>
