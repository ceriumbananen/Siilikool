<script setup lang="ts">
/** Standardknappen i hela appen. Klick vidarebefordras automatiskt (fallthrough), ingen egen @click behövs här. */
const {
  variant = "primary",
  wide = false,
  big = false,
  type = "button",
} = defineProps<{
  /** "primary" (blå) för vanliga handlingar, "green" för att gå vidare/bekräfta, "ghost" för ett sekundärt val, "danger" för förstörande handlingar. */
  variant?: "primary" | "green" | "ghost" | "danger";
  /** Fyller hela bredden - används för knappen som är det naturliga nästa steget på en skärm. */
  wide?: boolean;
  /** Större text och klickyta - för en skärms enda, viktigaste knapp. */
  big?: boolean;
  /** Vanlig "button" som standard så knappen aldrig råkar skicka in ett formulär av misstag. */
  type?: "button" | "submit";
}>();
</script>

<template>
  <button
    class="app-button"
    :class="[`app-button--${variant}`, { 'app-button--wide': wide, 'app-button--big': big }]"
    :type="type"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-1;
  border: none;
  border-radius: $radius-md;
  padding: 0.75rem $spacing-4; // 12px, 18px
  font: inherit;
  font-size: $font-size-md;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s;
  background: var(--blue);
  color: #fff;
  box-shadow: 0 0.3125rem 0 var(--blue-ink); // 5px
  @include focus-visible;

  &:active {
    transform: translateY(0.25rem); // 4px
    box-shadow: 0 0.125rem 0 var(--blue-ink); // 2px
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--green {
    background: var(--moss);
    box-shadow: 0 0.3125rem 0 color-mix(in srgb, var(--moss) 60%, black); // 5px
  }

  &--ghost {
    background: var(--card);
    color: var(--ink);
    border: $border-width solid var(--line);
    box-shadow: $shadow-2;

    &:active {
      box-shadow: $shadow-1;
    }
  }

  &--danger {
    background: var(--berry);
    box-shadow: 0 0.3125rem 0 color-mix(in srgb, var(--berry) 60%, black); // 5px
  }

  &--wide {
    width: 100%;
  }

  &--big {
    font-size: $font-size-xl;
    padding: $spacing-4 1.625rem; // 18px, 26px
  }
}
</style>
