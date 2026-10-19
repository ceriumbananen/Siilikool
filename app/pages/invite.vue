<script setup lang="ts">
/* En vuxen tar emot en inbjudan till familjen: logga in eller skapa ett eget konto (samma
   välkomstskärm som på startsidan, men utan familjenamn) → skriv sitt namn → med i familjen. */

useHead({ title: "Inbjudan · Siilikool" });
const cloud = useCloudStore();
const api = cloud.enabled ? useParentApi() : null;
const { busy, err, run } = useBusy();
const token = new URLSearchParams(location.search).get("t") || "";
const name = ref("");
const ready = ref(!cloud.enabled);
const back = `/invite?t=${encodeURIComponent(token)}`;

const accept = () =>
  run(async () => {
    await api!.acceptInvite(token, name.value);
    await cloud.refreshSession();
    /* nu vuxen i familjen: hämta (eller börja) den vuxnas eget spel, som vid en vanlig inloggning.
       Byts spelare laddas sidan dit adressen pekar - därför Familjen först. */
    history.replaceState(history.state, "", "/familj");
    if ((await cloud.autoLinkOwnGame().catch(() => false)) !== "switched") location.href = "/familj";
  });
onMounted(async () => {
  await cloud.init();
  ready.value = true;
});
</script>

<template>
  <!-- utloggad: logga in eller skapa ett konto, och sedan tillbaka hit -->
  <WelcomeGate v-if="cloud.enabled && token && ready && !cloud.session" invite :to="back" />
  <div v-else class="wrap page">
    <header class="pagehead">
      <a href="/" class="back">← Till spelet</a>
      <h1>Inbjudan</h1>
      <p>Gå med i familjen i Siilikool</p>
    </header>

    <div v-if="!cloud.enabled || !token" class="card">
      <p class="qsub">Inbjudan saknas eller går inte att läsa. Be om en ny länk.</p>
    </div>
    <p v-else-if="!ready" class="qsub">Hämtar …</p>
    <div v-else-if="cloud.isAnonymous" class="card">
      <p class="qsub">
        Det här är en barnenhet i en familj. Öppna inbjudan på din egen enhet, eller logga in som vuxen i Familjen
        först.
      </p>
      <a href="/familj" class="btn ghost wide">Till Familjen</a>
    </div>
    <div v-else-if="cloud.me?.adult" class="card">
      <p class="qsub">Du är redan med i en familj. En vuxen kan bara vara med i en familj.</p>
      <a href="/familj" class="btn ghost wide">Till Familjen</a>
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
