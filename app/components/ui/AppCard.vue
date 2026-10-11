<script setup lang="ts">
/** Standardkortet i hela appen - en vit yta med skugga. Lägger inte på egen marginal;
 * avstånd mellan kort hör till layouten som använder dem (t.ex. flex/grid-gap), inte
 * till kortet själv. */
</script>

<template>
  <section class="app-card">
    <slot />
  </section>
</template>

<style lang="scss" scoped>
.app-card {
  background: var(--card);
  border: $border-width solid var(--line);
  border-radius: $radius-card;
  padding: $spacing-4; // 18px
  box-shadow: $shadow-3;
}
</style>
