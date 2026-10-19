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
      <img v-if="AVATAR_INFO[a]" :src="AVATAR_INFO[a].img" alt="" class="avpick__img" />
      <template v-else>{{ a }}</template>
    </button>
  </div>
</template>

<style lang="scss" scoped>
/* höjd, inte bredd - se avatarIcon()/rivalIcon() i app.js för varför (samma figur-bilder
   har olika bredd, t.ex. en svans som sträcker ut åt sidan, utan att själva figuren är
   större, så bredd-baserad skalning hade gjort vissa skenbart mindre). */
.avpick__img {
  height: 2.75rem; // 44px
  width: auto;
  display: block;
  vertical-align: middle;
}
</style>
