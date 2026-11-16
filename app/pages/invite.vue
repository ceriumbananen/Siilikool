<script setup lang="ts">
/* En vuxen tar emot en inbjudan till familjen: logga in eller skapa ett eget konto (samma
   välkomstskärm som på startsidan, men utan familjenamn) → skriv sitt namn → med i familjen. */

const { L } = useLang();
useHead({ title: () => L("Inbjudan · Siilikool", "Kutse · Siilikool") });
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
      <a href="/" class="back">{{ L("← Till spelet", "← Mängu juurde") }}</a>
      <h1>{{ L("Inbjudan", "Kutse") }}</h1>
      <p>{{ L("Gå med i familjen i Siilikool", "Liitu perega Siilikoolis") }}</p>
    </header>

    <div v-if="!cloud.enabled || !token" class="card">
      <p class="qsub">
        {{
          L(
            "Inbjudan saknas eller går inte att läsa. Be om en ny länk.",
            "Kutset pole või seda ei saa lugeda. Palu uut linki.",
          )
        }}
      </p>
    </div>
    <p v-else-if="!ready" class="qsub">{{ L("Hämtar …", "Laadin …") }}</p>
    <div v-else-if="cloud.isAnonymous" class="card">
      <p class="qsub">
        {{
          L(
            "Det här är en barnenhet i en familj. Öppna inbjudan på din egen enhet, eller logga in som vuxen i Familjen först.",
            "See on pere lapse seade. Ava kutse oma seadmes või logi enne pere lehel täiskasvanuna sisse.",
          )
        }}
      </p>
      <a href="/familj" class="btn ghost wide">{{ L("Till Familjen", "Pere lehele") }}</a>
    </div>
    <div v-else-if="cloud.me?.adult" class="card">
      <p class="qsub">
        {{
          L(
            "Du är redan med i en familj. En vuxen kan bara vara med i en familj.",
            "Sa oled juba ühes peres. Täiskasvanu saab olla ainult ühes peres.",
          )
        }}
      </p>
      <a href="/familj" class="btn ghost wide">{{ L("Till Familjen", "Pere lehele") }}</a>
    </div>
    <div v-else class="card">
      <h2 class="q">{{ L("Gå med i familjen", "Liitu perega") }}</h2>
      <label class="flabel"
        >{{ L("Ditt namn i familjen", "Sinu nimi peres") }}
        <input v-model="name" class="field" type="text" maxlength="40" :placeholder="L('t.ex. Pappa', 'nt Isa')"
      /></label>
      <button class="btn green wide" :disabled="busy" @click="accept">{{ L("Gå med", "Liitu") }}</button>
      <p class="qsub">
        {{
          L(
            "Inbjudan gäller i 7 dagar och kan användas en gång.",
            "Kutse kehtib 7 päeva ja seda saab kasutada ühe korra.",
          )
        }}
      </p>
    </div>
    <p v-if="err" class="err" role="alert">{{ err }}</p>
  </div>
</template>
