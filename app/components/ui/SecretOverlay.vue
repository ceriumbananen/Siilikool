<script setup lang="ts">
/* "🤫 Hemlighet!" - porterat från eggSay()/eggSay2() i public/legacy/app.js. Visas när
   useRewards().showSecret() anropas; stängs bara med knappen eller av sig själv efter 6s. */
const { secret, closeSecret } = useRewards();
</script>

<template>
  <div v-if="secret" class="secret-overlay" role="dialog" aria-modal="true">
    <div class="secret-overlay__card">
      <p class="secret-overlay__kicker">🤫 Hemlighet!</p>
      <div class="secret-overlay__emoji" aria-hidden="true">{{ secret.em }}</div>
      <h3 lang="et">{{ secret.et }}</h3>
      <p>{{ secret.sv }}</p>
      <UiAppButton variant="primary" wide @click="closeSecret">Hihi!</UiAppButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.secret-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 28, 18, 0.55);
  padding: $spacing-3;

  &__card {
    background: var(--card);
    border: $border-width solid #6b4fd8;
    border-radius: $radius-card;
    padding: $spacing-4;
    max-width: 22rem; // 352px
    width: 100%;
    text-align: center;
    box-shadow: $shadow-3;

    h3 {
      font-size: $font-size-xl;
      margin: $spacing-1 0;
    }

    p {
      margin: 0 0 $spacing-3;
    }
  }

  &__kicker {
    font-weight: 700;
    margin: 0 0 $spacing-1;
  }

  &__emoji {
    font-size: 4rem; // 64px
    line-height: 1;
  }
}
</style>
