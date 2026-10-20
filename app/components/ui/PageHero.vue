<script setup lang="ts">
/* Sidrubrik (emoji + titel + undertext) för en toppnivå-sida, se app/pages/*.vue. Tidigare
   kopierades den här blocken in separat i profile/trophy/shop/room.vue, varje gång med sin
   egen hårdkodade hex-gradient - det bröt dark mode och färgteman (reglerna i
   docs/vue-conventions.md säger att färg alltid ska komma från en CSS-variabel, aldrig
   hex, av precis den anledningen). Gradienterna ligger nu som delade variabler i
   public/legacy/style.css (hero-gold, hero-violet, hero-amber). */
const {
  emoji,
  title,
  subtitle,
  tone = "amber",
} = defineProps<{
  /** Emoji som representerar sidan, visas stort till vänster. */
  emoji: string;
  /** Sidans rubrik. */
  title: string;
  /** Kort beskrivning under rubriken. */
  subtitle: string;
  /** Vilken delad gradient (public/legacy/style.css) bakgrunden använder. */
  tone?: "gold" | "violet" | "amber";
}>();
</script>

<template>
  <header class="page-hero" :class="`page-hero--${tone}`">
    <span class="page-hero__emoji" aria-hidden="true">{{ emoji }}</span>
    <div>
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.page-hero {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  margin: $spacing-1 0 $spacing-2;
  border-radius: $radius-lg;
  padding: $spacing-3;
  color: #fff;
  box-shadow: $shadow-3;

  /* en mörk ton lagd över färgtonen (inte bara färgen själv) - annars klarar vit text inte
     kontrastkravet mot den ljusa änden av gradienten (så lågt som 1.8:1, kravet är 4.5:1) */
  &--gold {
    background:
      linear-gradient(140deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.12)),
      linear-gradient(140deg, var(--hero-gold-a), var(--hero-gold-b));
  }

  &--violet {
    background:
      linear-gradient(140deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.12)),
      linear-gradient(140deg, var(--hero-violet-a), var(--hero-violet-b));
  }

  &--amber {
    background:
      linear-gradient(140deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.12)),
      linear-gradient(140deg, var(--hero-amber-a), var(--hero-amber-b));
  }

  h1 {
    font-size: $font-size-xl;
    line-height: 1.1;
    margin: 0;
  }

  p {
    font-size: $font-size-sm;
    font-weight: 500;
    margin: 0;
  }

  &__emoji {
    font-size: 2.125rem; // 34px
    line-height: 1;
  }
}
</style>
