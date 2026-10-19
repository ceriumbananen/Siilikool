<script setup lang="ts">
/* den tidigare adressen till Familjen (och länkar i gamla mejl, t.ex. "Glömt lösenordet?"): vidare
   till /familj med samma ?… */
onMounted(() => location.replace("/familj" + location.search + location.hash));
</script>

<template>
  <div class="wrap page"></div>
</template>
