<script setup lang="ts">
/* Rutan efter ett köp i Laat ("Nytt plagg!", "Ny skatt!", "En dröm gick i uppfyllelse!") -
   porterat från buyOrWear() i public/legacy/app.js. Stängs bara med knappen. */
const { item, tier } = defineProps<{
  /** Plagget som just köptes. */
  item: ShopItem;
  /** Hur stort köpet var: 1 (vanligt), 2 (från 500 ⭐), 3 (en dröm, från 2 000 ⭐). */
  tier: 1 | 2 | 3;
}>();
const emit = defineEmits<{ close: [] }>();
const voice = useSiiriVoice();

const kicker = computed(() =>
  tier >= 3 ? "✨ En dröm gick i uppfyllelse!" : tier === 2 ? "⭐ Ny skatt!" : "Nytt plagg!",
);
</script>

<template>
  <div class="buy-overlay" role="dialog" aria-modal="true">
    <div class="buy-overlay__card" :class="{ 'buy-overlay__card--dream': tier >= 3 }">
      <p class="buy-overlay__kicker">{{ kicker }}</p>
      <div class="buy-overlay__emoji" :class="{ 'buy-overlay__emoji--dream': tier >= 3 }" aria-hidden="true">
        {{ item.em }}
      </div>
      <h3 lang="et">{{ item.et }}</h3>
      <p>{{ item.sv }}</p>
      <div class="buy-overlay__speak">
        <button class="buy-overlay__say" aria-label="Hör ordet" @click="voice.sayWord(item.et)">🔊</button>
        <button
          class="buy-overlay__say buy-overlay__say--slow"
          aria-label="Hör ordet långsamt"
          @click="voice.sayWord(item.et, true)"
        >
          🐢
        </button>
      </div>
      <p v-if="item.slot === 'scene'" class="buy-overlay__note">Hela appen har bytt skepnad!</p>
      <UiAppButton variant="primary" wide big @click="emit('close')">{{
        tier >= 3 ? "Wow! ✨" : "Snyggt!"
      }}</UiAppButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.buy-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-3;
  background: rgba(12, 28, 18, 0.72);

  &__card {
    background: var(--card);
    border: $border-width solid var(--honey);
    border-radius: $radius-card;
    padding: $spacing-4;
    max-width: 22rem; // 352px, som legacy .oc
    width: 100%;
    text-align: center;
    box-shadow: $shadow-3;

    &--dream {
      border-color: #8e7bff;
    }

    h3 {
      font-size: $font-size-xl;
      margin: $spacing-1 0;
    }

    p {
      margin: 0 0 $spacing-2;
    }
  }

  &__kicker {
    font-weight: 700;
  }

  &__emoji {
    font-size: 3.5rem; // 56px
    line-height: 1.1;
    animation: buy-pop 0.6s cubic-bezier(0.2, 1.5, 0.4, 1);

    &--dream {
      font-size: 4.75rem; // 76px
    }
  }

  &__speak {
    display: flex;
    justify-content: center;
    gap: $spacing-2;
    margin-bottom: $spacing-2;
  }

  &__say {
    width: 3.25rem; // 52px
    height: 3.25rem;
    border-radius: 50%;
    border: none;
    background: var(--honey);
    font-size: $font-size-lg;
    cursor: pointer;
    box-shadow: $shadow-2;

    @include focus-visible;

    &--slow {
      width: 2.75rem; // 44px
      height: 2.75rem;
      align-self: center;
    }
  }

  &__note {
    font-size: $font-size-sm;
    color: var(--muted);
  }

  @media (prefers-reduced-motion: reduce) {
    &__emoji {
      animation: none;
    }
  }
}

@keyframes buy-pop {
  from {
    transform: scale(0.3);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
