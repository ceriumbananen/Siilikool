<script setup lang="ts">
/* Canvasen som useConfetti() ritar på - motsvarar <canvas id="fx"> i LegacyApp.vue.
   Täcker hela skärmen men tar aldrig emot klick. */
const canvas = ref<HTMLCanvasElement | null>(null);

function size() {
  const c = canvas.value;
  const ctx = c?.getContext("2d");
  if (!c || !ctx) return;
  c.width = innerWidth * devicePixelRatio;
  c.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

onMounted(() => {
  size();
  addEventListener("resize", size);
  setConfettiCanvas(canvas.value?.getContext("2d") ?? null);
});
onUnmounted(() => {
  removeEventListener("resize", size);
  setConfettiCanvas(null);
});
</script>

<template>
  <canvas ref="canvas" class="confetti-layer" aria-hidden="true" />
</template>

<style lang="scss" scoped>
.confetti-layer {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 110; // över hemlighets- och märkesrutorna, som legacy-canvasen
}
</style>
