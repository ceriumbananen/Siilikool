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
    <header class="pagehead">
      <a href="/" class="back">← Till spelet</a>
      <h1>Inbjudan</h1>
      <p>Gå med i familjen i Siilikool</p>
    </header>

    <div v-if="!cloud.enabled || !token" class="card">
      <p class="qsub">Inbjudan saknas eller går inte att läsa. Be om en ny länk.</p>
    </div>
    <div v-else-if="cloud.isAnonymous" class="card">
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
    <div v-else-if="cloud.me?.adult" class="card">
      <p class="qsub">Du är redan med i en familj. En vuxen kan bara vara med i en familj.</p>
      <a href="/parent" class="btn ghost wide">Till föräldraläget</a>
    </div>
    <div v-else class="card">
      <h2 class="q">Gå med i familjen</h2>
      <label class="flabel"
        >Ditt namn i familjen <input v-model="name" class="field" type="text" maxlength="40" placeholder="t.ex. Pappa"
      /></label>
      <button class="btn green wide" :disabled="busy" @click="accept">Gå med</button>
      <p class="qsub">Inbjudan gäller i 7 dagar och kan användas en gång.</p>
    </div>
    <p v-if="err" class="err" role="alert">{{ err }}</p>
  </div>
</template>
