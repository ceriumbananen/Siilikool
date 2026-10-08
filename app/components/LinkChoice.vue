<script setup lang="ts">
/* Visas när både enheten och kontot redan har ett spel för barnet: vad ska gälla? */

defineProps<{ name: string; busy?: boolean }>();
const emit = defineEmits<{ choose: [choice: LinkChoice] }>();
</script>

<template>
  <div class="card">
    <p class="q" style="text-align: left">Det finns redan ett spel på båda ställena</p>
    <p class="qsub" style="text-align: left">
      Den här enheten och {{ name }}s profil i kontot har båda poäng och ord. Välj vad som ska gälla. En reservkopia av
      enhetens spel sparas först, oavsett val.
    </p>
    <button class="btn green wide" :disabled="busy" @click="emit('choose', 'merge')">
      🤝 Slå ihop (rekommenderas)
    </button>
    <p class="qsub" style="text-align: left">Stjärnor, köp, märken och ord från båda behålls.</p>
    <button class="btn ghost wide" :disabled="busy" @click="emit('choose', 'local')">📱 Behåll enhetens spel</button>
    <button class="btn ghost wide" :disabled="busy" @click="emit('choose', 'remote')">
      ☁️ Använd spelet från kontot
    </button>
  </div>
</template>
