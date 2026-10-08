<script setup lang="ts">
/* Barnets enhet: skriv förälderns kod så sparas spelet i föräldrakontot och läxorna kommer hit. */

useHead({ title: "Koppla till förälder · Siilikool" });
const cloud = useCloudStore();
const code = ref(""),
  err = ref(""),
  busy = ref(false),
  done = ref(false);
const pendingProfile = ref(""),
  childName = ref("");

/* ett namn på enheten som föräldern känner igen i listan */
function deviceLabel() {
  const ua = navigator.userAgent;
  const kind =
    /iPad|Macintosh.*Mobile/.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua))
      ? "iPad"
      : /iPhone/.test(ua)
        ? "iPhone"
        : /Android/.test(ua)
          ? "Android"
          : "Dator";
  return kind + " · kopplad " + new Date().toLocaleDateString("sv-SE");
}

async function run(fn: () => Promise<void>) {
  err.value = "";
  busy.value = true;
  try {
    await fn();
  } catch (e) {
    err.value = e instanceof Error ? e.message : String(e);
  } finally {
    busy.value = false;
  }
}

async function finish(choice?: LinkChoice) {
  const r = await cloud.linkSlot(pendingProfile.value, choice);
  if (r === "needs-choice") return;
  pendingProfile.value = "";
  done.value = true;
  childName.value = cloud.link?.name || "";
}

async function connect() {
  await run(async () => {
    pendingProfile.value = await cloud.claimCode(code.value, deviceLabel());
    await finish();
  });
}
async function choose(c: LinkChoice) {
  await run(() => finish(c));
}
async function disconnect() {
  if (!confirm("Koppla bort enheten från föräldrakontot? Spelet finns kvar här, men sparas inte längre i kontot."))
    return;
  await run(async () => {
    await cloud.unlink();
  });
}

/* texterna ligger här i stället för i mallen – långa uttryck i {{ }} bryts annars fel av Prettier */
const errText = computed(() =>
  err.value === "parent-signed-in"
    ? "Du är inloggad som förälder här. Är det här barnets enhet? Logga ut i föräldraläget först."
    : err.value,
);

onMounted(() => cloud.init());
</script>

<template>
  <div class="wrap page">
    <div class="zone me">
      <span class="zem">🔗</span>
      <span><b>Koppla till förälder</b><span>Spara spelet i föräldrakontot och få läxorna hit</span></span>
    </div>
    <a href="/" class="btn ghost">← Till spelet</a>

    <div v-if="!cloud.enabled" class="card">
      <p class="qsub">Konton är inte påslagna i den här versionen av Siilikool.</p>
    </div>

    <div v-else-if="done" class="card">
      <div style="font-size: 56px">🎉</div>
      <p class="q">Klart!</p>
      <p class="qsub">
        Spelet sparas nu i föräldrakontot{{ childName ? " som " + childName : "" }}. Läxor som föräldern skickar dyker
        upp här.
      </p>
      <a href="/" class="btn green big wide">Till spelet</a>
    </div>

    <LinkChoice v-else-if="pendingProfile" name="barnet" :busy="busy" @choose="choose" />

    <!-- redan kopplad -->
    <div v-else-if="cloud.link" class="card" style="text-align: left">
      <p class="q" style="text-align: left">Kopplad till {{ cloud.link.name || "föräldrakontot" }}</p>
      <p class="qsub">
        Spelet sparas i föräldrakontot och läxorna hämtas härifrån.
        <span v-if="cloud.needsLogin">Inloggningen har gått ut – koppla enheten på nytt med en ny kod.</span>
      </p>
      <button class="btn ghost wide" :disabled="busy" @click="disconnect">Koppla bort den här enheten</button>
    </div>

    <!-- förälderns egen enhet -->
    <div v-else-if="cloud.isParent" class="card" style="text-align: left">
      <p class="qsub">
        Du är inloggad som förälder på den här enheten, och här har du ditt eget spel. Barnets enhet kopplas på barnets
        egen enhet – eller logga ut i föräldraläget först om det här är barnets enhet.
      </p>
      <a href="/parent" class="btn green wide">Till föräldraläget</a>
    </div>

    <!-- skriv koden -->
    <div v-else class="card" style="text-align: left">
      <p class="q" style="text-align: left">Skriv koden från föräldern</p>
      <p class="qsub">Föräldern skapar koden i <b>Föräldrar → barnets namn → Enheter</b>. Den gäller i tio minuter.</p>
      <input
        v-model="code"
        class="field code"
        maxlength="6"
        autocomplete="off"
        autocapitalize="characters"
        placeholder="ABC234"
        @keydown.enter="connect"
      />
      <button class="btn green big wide" :disabled="busy || code.trim().length < 6" @click="connect">Koppla</button>
    </div>

    <p v-if="err" class="err">{{ errText }}</p>
  </div>
</template>
