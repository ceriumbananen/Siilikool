<script setup lang="ts">
/* Visas när både enheten och kontot redan har ett spel för barnet: vad ska gälla? */

defineProps<{ name: string; busy?: boolean }>();
const emit = defineEmits<{ choose: [choice: LinkChoice] }>();
const { L, isEt } = useLang();
</script>

<template>
  <div class="card">
    <h2 class="q">{{ L("Det finns redan ett spel på båda ställena", "Mõlemas kohas on juba mäng olemas") }}</h2>
    <p v-if="isEt()" class="qsub">
      Selles seadmes ja kontol olevas profiilis ({{ name }}) on mõlemas punktid ja sõnad. Vali, kumb kehtib. Enne
      tehakse igal juhul seadme mängust varukoopia.
    </p>
    <p v-else class="qsub">
      Den här enheten och {{ name }}s profil i kontot har båda poäng och ord. Välj vad som ska gälla. En reservkopia av
      enhetens spel sparas först, oavsett val.
    </p>
    <button class="btn green wide" :disabled="busy" @click="emit('choose', 'merge')">
      {{ L("🤝 Slå ihop (rekommenderas)", "🤝 Ühenda (soovitatav)") }}
    </button>
    <p class="qsub">
      {{
        L(
          "Stjärnor, köp, märken, diplom, resan och ord från båda behålls.",
          "Tähed, ostud, märgid, diplomid, teekond ja sõnad mõlemast jäävad alles.",
        )
      }}
    </p>
    <!-- de två andra valen kastar det ena spelet - det ska synas på knappen, inte bara i en reservkopia -->
    <button class="btn ghost wide" :disabled="busy" @click="emit('choose', 'local')">
      {{ L("📱 Behåll bara enhetens spel", "📱 Jäta alles ainult seadme mäng") }}
    </button>
    <p class="qsub">
      {{
        L("Spelet i kontot ersätts av det på den här enheten.", "Kontol olev mäng asendatakse selle seadme mänguga.")
      }}
    </p>
    <button class="btn ghost wide" :disabled="busy" @click="emit('choose', 'remote')">
      {{ L("☁️ Använd bara spelet från kontot", "☁️ Kasuta ainult kontol olevat mängu") }}
    </button>
    <p class="qsub">
      {{
        L("Spelet på den här enheten ersätts av det i kontot.", "Selle seadme mäng asendatakse kontol oleva mänguga.")
      }}
    </p>
  </div>
</template>
