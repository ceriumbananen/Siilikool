<script setup lang="ts">
const {
  badge,
  earned,
  progress = null,
} = defineProps<{
  /** Märket som visas (namn och emoji). */
  badge: Badge;
  /** Om spelaren redan har tagit märket - styr färg och om en siffra visas. */
  earned: boolean;
  /** [nuvarande, mål] för ett ännu inte taget märke, från badgeProgress() - null döljer siffran
   * (t.ex. för hemliga märken som inte ska avslöja hur de tas). */
  progress?: [number, number] | null;
}>();
</script>

<template>
  <span class="badge-chip" :class="{ 'badge-chip--locked': !earned }">
    <span aria-hidden="true">{{ badge.em }}</span>
    {{ badge.sv }}
    <small v-if="!earned && progress" class="badge-chip__progress">{{ progress[0] }}/{{ progress[1] }}</small>
  </span>
</template>

<style lang="scss" scoped>
.badge-chip {
  display: inline-flex;
  align-items: center;
  gap: $spacing-1;
  background: var(--honey);
  color: #3a2708;
  border-radius: $radius-lg;
  padding: 8px 12px;
  font-weight: 600;
  margin: 4px;

  &--locked {
    opacity: 0.35;
    filter: grayscale(1);
  }

  &__progress {
    font-size: $font-size-xs;
    font-weight: 700;
    opacity: 0.8;
  }
}
</style>
