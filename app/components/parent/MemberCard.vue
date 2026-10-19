<script setup lang="ts">
/* En medlem i Familjen: figur, namn, stjärnor och när spelet senast sparades. Öppnar medlemssidan. */
const props = defineProps<{ member: Member; me: boolean; here: "" | "now" | "device" }>();
defineEmits<{ open: [] }>();

const lastSeen = computed(() =>
  new Date(props.member.updated_at).toLocaleDateString("sv-SE", { day: "numeric", month: "short" }),
);
const tags = computed(() =>
  [
    props.me ? "du" : props.member.kind === "adult" ? "vuxen" : "",
    props.member.has_pin ? "🔒 PIN" : "",
    props.here === "now" ? "spelar nu" : props.here === "device" ? "på enheten" : "",
  ].filter(Boolean),
);
</script>

<template>
  <button class="member" :class="{ 'member--now': here === 'now' }" @click="$emit('open')">
    <span class="member__av" aria-hidden="true">{{ member.avatar }}</span>
    <b class="member__name">{{ member.name || "Vuxen" }}</b>
    <small class="member__line">⭐ {{ member.stars ?? 0 }} · {{ lastSeen }}</small>
    <small v-if="tags.length" class="member__tags">{{ tags.join(" · ") }}</small>
  </button>
</template>

<style lang="scss" scoped>
.member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  min-height: 8.5rem;
  padding: $spacing-3 $spacing-2;
  border: 1px solid var(--line);
  border-radius: $radius-md;
  background: var(--card);
  color: var(--ink);
  font: inherit;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover,
  &:focus-visible {
    border-color: var(--moss);
  }

  &--now {
    border-width: 2px;
    border-color: var(--moss);
  }

  &__av {
    font-size: 2.375rem;
    line-height: 1.1;
  }

  &__name {
    font-family: "Fredoka", system-ui, sans-serif;
    font-size: $font-size-lg;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  &__line,
  &__tags {
    color: var(--muted);
    font-size: $font-size-sm;
  }

  &__tags {
    color: var(--moss);
    font-weight: 600;
  }
}
</style>
