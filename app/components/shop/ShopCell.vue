<script setup lang="ts">
/* Ett plagg på en hylla i Laat - porterat från shopCells() i public/legacy/app.js. Klicket
   (köp, ta på, ta av) hanteras av sidan. */
const { item, owned, worn, stars } = defineProps<{
  /** Plagget (SHOP i app/utils/shop.ts). */
  item: ShopItem;
  /** Spelaren äger det redan. */
  owned: boolean;
  /** Siiri bär det just nu. */
  worn: boolean;
  /** Spelarens stjärnor - avgör om det går att köpa och hur långt kvar det är. */
  stars: number;
}>();

const afford = computed(() => stars >= item.price);
/* dyra plagg som inte går att köpa än visar hur långt det är kvar */
const pct = computed(() => Math.min(100, Math.round((stars / item.price) * 100)));
const costText = computed(() => {
  if (owned) return worn ? "på ✓" : "i lådan";
  if (afford.value) return `⭐ ${item.price.toLocaleString("sv-SE")}`;
  return `🔒 ⭐ ${(item.price - stars).toLocaleString("sv-SE")} kvar`;
});
</script>

<template>
  <button
    class="shop-cell"
    :class="{
      'shop-cell--worn': worn,
      'shop-cell--locked': !owned && afford,
      'shop-cell--cant': !owned && !afford,
    }"
  >
    <span class="shop-cell__em" aria-hidden="true">{{ item.em }}</span>
    <b lang="et">{{ item.et }}</b>
    <small>{{ item.sv }}</small>
    <span class="shop-cell__cost" :class="{ 'shop-cell__cost--cant': !owned && !afford }">{{ costText }}</span>
    <span v-if="!owned && !afford && item.price >= 700" class="shop-cell__bar"
      ><i :style="{ width: `${pct}%` }"
    /></span>
    <small v-if="isLimited(item) && !owned" class="shop-cell__season">säsong</small>
  </button>
</template>

<style lang="scss" scoped>
.shop-cell {
  background: var(--card);
  border: $border-width solid var(--line);
  border-radius: $radius-md;
  padding: 0.5rem 0.25rem; // 8px 4px
  text-align: center;
  cursor: pointer;
  box-shadow: $shadow-2;
  display: flex;
  flex-direction: column;
  gap: 0.125rem; // 2px
  align-items: center;
  font: inherit;
  color: var(--ink);

  @include focus-visible;

  b {
    font-size: $font-size-sm;
  }

  small {
    font-size: $font-size-xs;
    color: var(--muted);
  }

  &:active {
    transform: translateY(0.1875rem); // 3px
    box-shadow: none;
  }

  &--worn {
    border-color: var(--moss);
    background: color-mix(in srgb, var(--moss) 14%, var(--card));
  }

  &--locked {
    opacity: 0.82;
  }

  &--cant {
    opacity: 0.55;
    filter: grayscale(0.85);
    cursor: not-allowed;
  }

  &__em {
    font-size: $font-size-2xl;
    line-height: 1.1;
  }

  &__cost {
    font-weight: 700;
    color: var(--honey-deep);
    font-size: $font-size-sm;

    &--cant {
      color: var(--berry);
    }
  }

  &__bar {
    display: block;
    width: 80%;
    height: 0.375rem; // 6px
    border-radius: $radius-pill;
    background: var(--line);
    overflow: hidden;

    i {
      display: block;
      height: 100%;
      background: var(--honey-deep);
    }
  }

  & &__season {
    color: var(--honey-deep);
  }
}
</style>
