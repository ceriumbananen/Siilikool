<script setup lang="ts">
/* En vuxen tar emot en inbjudan till familjen: logga in med e-post → skriv sitt namn → med i familjen. */

useHead({ title: "Inbjudan · Siilikool" });
const cloud = useCloudStore();
const api = cloud.enabled ? useParentApi() : null;
const { busy, err, run } = useBusy();
const token = new URLSearchParams(location.search).get("t") || "";
const name = ref("");

const accept = () =>
  run(async () => {
    await api!.acceptInvite(token, name.value);
    await cloud.refreshSession();
    location.href = "/parent";
  });
onMounted(() => cloud.init());
</script>

<template>
  <div class="wrap page">
    <div class="zone me">
      <span class="zem">💌</span>
      <span><b>Inbjudan</b><span>Gå med i familjen i Siilikool</span></span>
    </div>

    <div v-if="!cloud.enabled || !token" class="card">
      <p class="qsub">Inbjudan saknas eller går inte att läsa. Be om en ny länk.</p>
    </div>
    <div v-else-if="cloud.isAnonymous" class="card" style="text-align: left">
      <p class="qsub">
        Det här är en barnenhet i en familj. Öppna inbjudan på din egen enhet, eller logga in som vuxen i föräldraläget
        först.
      </p>
      <a href="/parent" class="btn ghost wide">Till föräldraläget</a>
    </div>
    <LoginCard
      v-else-if="!cloud.isEmailUser"
      title="Logga in för att gå med"
      intro="Skriv din e-post så skickar vi en inloggningslänk. Den leder tillbaka hit."
    />
    <div v-else-if="cloud.me?.adult" class="card" style="text-align: left">
      <p class="qsub">Du är redan med i en familj. En vuxen kan bara vara med i en familj.</p>
      <a href="/parent" class="btn ghost wide">Till föräldraläget</a>
    </div>
    <div v-else class="card" style="text-align: left">
      <p class="q" style="text-align: left">Gå med i familjen</p>
      <input v-model="name" class="field" type="text" maxlength="40" placeholder="Ditt namn, t.ex. Pappa" />
      <button class="btn green wide" :disabled="busy" @click="accept">Gå med</button>
      <p class="qsub">Inbjudan gäller i 7 dagar och kan användas en gång.</p>
    </div>
    <p v-if="err" class="err">{{ err }}</p>
  </div>
</template>
