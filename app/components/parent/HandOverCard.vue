<script setup lang="ts">
/* "Lämna över till barnen": enheten låses – Familjen-sidan försvinner, databasen nekar allt vuxet och
   barnen väljer vem som spelar ("Vem spelar?"), tills vuxen-PIN låser upp. Andra enheter påverkas inte. */
const cloud = useCloudStore();
const api = useParentApi();
const { L } = useLang();
const { busy, err, run } = useBusy();
const hasPin = ref<boolean | null>(null);

onMounted(() =>
  run(async () => {
    hasPin.value = await api.hasAdultPin();
  }),
);
const handOver = () =>
  run(async () => {
    await cloud.lock();
    location.href = "/"; /* till spelet – barnen väljer vem som spelar */
  });
</script>

<template>
  <div class="card">
    <h2 class="q">{{ L("🔒 Lämna över till barnen", "🔒 Anna lastele üle") }}</h2>
    <p class="qsub">
      {{
        L(
          "Ska barnen spela på den här enheten? Då låses Familjen-sidan och barnen väljer vem som spelar. Du låser upp med vuxen-PIN. Dina andra enheter påverkas inte.",
          "Kas lapsed mängivad selles seadmes? Siis pere leht lukustatakse ja lapsed valivad, kes mängib. Lukust avad täiskasvanu PIN-koodiga. Sinu teisi seadmeid see ei mõjuta.",
        )
      }}
    </p>
    <!-- utan vuxen-PIN går det inte att låsa upp, så den väljs först -->
    <template v-if="hasPin === false">
      <p class="qsub">
        {{
          L(
            "Välj först en vuxen-PIN – den behövs för att låsa upp igen.",
            "Vali kõigepealt täiskasvanu PIN – seda on vaja, et lukk uuesti avada.",
          )
        }}
      </p>
      <ParentAdultPinCard :has-pin="false" @saved="hasPin = true" />
    </template>
    <button v-else-if="hasPin" class="btn green wide" :disabled="busy" @click="handOver">
      {{ L("Lämna över till barnen", "Anna lastele üle") }}
    </button>
    <p v-if="err" class="err" role="alert">{{ err }}</p>
  </div>
</template>
