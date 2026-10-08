<script setup lang="ts">
/* Föräldraläget: logga in med e-post, lägg till barn, skicka läxlistor, koppla barnens enheter. */

useHead({ title: "Föräldrar · Siilikool" });
const cloud = useCloudStore();
const api = cloud.enabled ? useParentApi() : null;

const err = ref(""),
  msg = ref(""),
  busy = ref(false);
async function run(fn: () => Promise<void>) {
  err.value = "";
  msg.value = "";
  busy.value = true;
  try {
    await fn();
  } catch (e) {
    err.value = e instanceof Error ? e.message : String(e);
  } finally {
    busy.value = false;
  }
}

/* ---------- inloggning ---------- */
const email = ref(""),
  code = ref(""),
  sent = ref(false);
async function sendLink() {
  await run(async () => {
    await api!.sendLoginLink(email.value.trim());
    sent.value = true;
  });
}
async function verify() {
  await run(async () => {
    await api!.verifyCode(email.value.trim(), code.value);
  });
}
/* barnets enhet (anonym) blir förälderns: kopplingen till barnet släpps först */
async function leaveDeviceMode() {
  if (
    !confirm(
      "Den här enheten är kopplad som barnets enhet. Om du loggar in som förälder här kopplas den bort – spelet finns kvar på enheten. Fortsätta?",
    )
  )
    return;
  await run(async () => {
    await cloud.unlink();
  });
}

/* ---------- barn ---------- */
const children = ref<Child[]>([]);
const newName = ref("");
async function load() {
  await run(async () => {
    children.value = await api!.children();
  });
}
async function addChild() {
  await run(async () => {
    if (!newName.value.trim()) throw new Error("Skriv barnets namn.");
    await api!.addChild(newName.value);
    newName.value = "";
    children.value = await api!.children();
  });
}
watch(
  () => cloud.isParent,
  v => {
    if (v) load();
  },
);
onMounted(async () => {
  await cloud.init();
  if (cloud.isParent) load();
});

/* ---------- kontot ---------- */
const userEmail = computed(() => cloud.session?.user.email || "");
async function signOut() {
  await run(async () => {
    await cloud.signOut();
    children.value = [];
  });
}
async function deleteAccount() {
  const ans = prompt(
    "Radera kontot och allt som sparats i det (barnens profiler, läxor och kopplingar)? Spelen på enheterna finns kvar. Skriv RADERA för att bekräfta.",
  );
  if (ans !== "RADERA") return;
  await run(async () => {
    await api!.deleteAccount(); /* kräver inloggning – raderas först */
    await cloud.signOut().catch(() => {
      /* sessionen är redan borta */
    });
    children.value = [];
    msg.value = "Kontot är raderat.";
  });
}
</script>

<template>
  <div class="wrap page">
    <div class="zone me">
      <span class="zem">👨‍👩‍👧</span>
      <span><b>Föräldrar</b><span>Läxor och enheter för dina barn</span></span>
    </div>
    <a href="/" class="btn ghost">← Till spelet</a>

    <div v-if="!cloud.enabled" class="card">
      <p class="qsub">Konton är inte påslagna i den här versionen av Siilikool.</p>
    </div>

    <!-- barnets enhet -->
    <div v-else-if="cloud.isDevice" class="card" style="text-align: left">
      <p class="q" style="text-align: left">Det här är barnets enhet</p>
      <p class="qsub">
        Enheten är kopplad till <b>{{ cloud.link?.name || "ett barn" }}</b> i ett föräldrakonto. Föräldraläget öppnar du
        på din egen enhet.
      </p>
      <button class="btn ghost wide" :disabled="busy" @click="leaveDeviceMode">Logga in som förälder här ändå</button>
    </div>

    <!-- logga in -->
    <div v-else-if="!cloud.isParent" class="card" style="text-align: left">
      <p class="q" style="text-align: left">Logga in</p>
      <p class="qsub">Skriv din e-post så skickar vi en inloggningslänk. Inget lösenord behövs.</p>
      <input
        v-model="email"
        class="field"
        type="email"
        autocomplete="email"
        placeholder="din@epost.se"
        @keydown.enter="sendLink"
      />
      <button class="btn green wide" :disabled="busy || !email.includes('@')" @click="sendLink">
        Skicka inloggningslänk
      </button>
      <template v-if="sent">
        <p class="ok">Mejlet är skickat till {{ email }}.</p>
        <p class="qsub">Klicka på länken i mejlet så loggas du in.</p>
        <!-- koden finns bara i mejlet när mallen innehåller .Token (kräver egen SMTP i Supabase, se docs/konton.md) -->
        <p class="qsub">
          Har mejlet också en sexsiffrig kod kan du skriva den här i stället – det behövs om du använder appen från
          hemskärmen, där länken öppnas i webbläsaren och inte i appen.
        </p>
        <input
          v-model="code"
          class="field code"
          inputmode="numeric"
          autocomplete="one-time-code"
          maxlength="10"
          placeholder="123456"
          @keydown.enter="verify"
        />
        <button class="btn ghost wide" :disabled="busy || code.length < 6" @click="verify">Logga in med koden</button>
      </template>
    </div>

    <!-- inloggad -->
    <template v-else>
      <ParentChildPanel v-for="c in children" :key="c.id" :child="c" @removed="load" />

      <div class="card" style="text-align: left">
        <p class="q" style="text-align: left">
          {{ children.length ? "Lägg till ett barn" : "Lägg till ditt första barn" }}
        </p>
        <input
          v-model="newName"
          class="field"
          type="text"
          maxlength="40"
          placeholder="Barnets namn"
          @keydown.enter="addChild"
        />
        <button class="btn green wide" :disabled="busy" @click="addChild">Lägg till</button>
      </div>

      <div class="card" style="text-align: left">
        <p class="q" style="text-align: left">Kontot</p>
        <p class="qsub">Inloggad som {{ userEmail }}</p>
        <div class="row" style="justify-content: flex-start">
          <button class="btn ghost" :disabled="busy" @click="signOut">Logga ut</button>
          <button class="btn ghost" :disabled="busy" @click="deleteAccount">Radera kontot</button>
        </div>
      </div>
    </template>

    <p v-if="err" class="err">{{ err }}</p>
    <p v-if="msg" class="ok">{{ msg }}</p>
  </div>
</template>
