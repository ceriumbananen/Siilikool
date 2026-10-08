<script setup lang="ts">
/* den tidigare adressen (och QR-koder som pekar hit): vidare till /join med samma ?kod= */
onMounted(() => location.replace("/join" + location.search));
</script>

<template>
  <div class="wrap page"></div>
</template>
