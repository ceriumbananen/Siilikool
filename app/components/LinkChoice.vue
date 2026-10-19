<script setup lang="ts">
/* Visas när både enheten och kontot redan har ett spel för barnet: vad ska gälla? */

defineProps<{ name: string; busy?: boolean }>();
const emit = defineEmits<{ choose: [choice: LinkChoice] }>();
</script>

<template>
  <div class="card">
    <h2 class="q">Det finns redan ett spel på båda ställena</h2>
    <p class="qsub">
      Den här enheten och {{ name }}s profil i kontot har båda poäng och ord. Välj vad som ska gälla. En reservkopia av
      enhetens spel sparas först, oavsett val.
    </p>
    <button class="btn green wide" :disabled="busy" @click="emit('choose', 'merge')">
      🤝 Slå ihop (rekommenderas)
    </button>
    <p class="qsub">Stjärnor, köp, märken, diplom, resan och ord från båda behålls.</p>
    <!-- de två andra valen kastar det ena spelet - det ska synas på knappen, inte bara i en reservkopia -->
    <button class="btn ghost wide" :disabled="busy" @click="emit('choose', 'local')">
      📱 Behåll bara enhetens spel
    </button>
    <p class="qsub">Spelet i kontot ersätts av det på den här enheten.</p>
    <button class="btn ghost wide" :disabled="busy" @click="emit('choose', 'remote')">
      ☁️ Använd bara spelet från kontot
    </button>
    <p class="qsub">Spelet på den här enheten ersätts av det i kontot.</p>
  </div>
</template>
