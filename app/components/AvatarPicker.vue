<script setup lang="ts">
/* Välj figur (v-model). */
const model = defineModel<string>({ required: true });
</script>

<template>
  <div class="avpick">
    <button
      v-for="a in AVATARS"
      :key="a"
      type="button"
      :class="{ on: model === a }"
      :aria-label="'Figur ' + a"
      @click="model = a"
    >
      {{ a }}
    </button>
  </div>
</template>
