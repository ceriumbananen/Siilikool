<script setup lang="ts">
/* Föräldraläget (docs/plan-familj.md): logga in, skapa familjen, barn, glosor, familjekod,
   fler vuxna, vuxen-PIN och lås, eget spel och konto. */

useHead({ title: "Föräldrar · Siilikool" });
const cloud = useCloudStore();
const api = cloud.enabled ? useParentApi() : null;
const { busy, err, run } = useBusy();
const msg = ref("");

const family = ref<Family | null>(null);
const members = ref<Member[]>([]);
const loaded = ref(false);
const children = computed(() => members.value.filter(m => m.kind === "child"));
const adults = computed(() => members.value.filter(m => m.kind === "adult"));

const load = () =>
  run(async () => {
    family.value = await api!.family();
    members.value = family.value ? await api!.members() : [];
    loaded.value = true;
  });

/* inloggad (och olåst) vuxen: hämta familjen */
watch(
  () => cloud.isEmailUser && !cloud.isLocked && !!cloud.me,
  v => {
    if (v) load();
  },
);
onMounted(async () => {
  await cloud.init();
  if (cloud.isEmailUser && !cloud.isLocked) load();
});

/* ---------- barnens enhet → vuxen ---------- */
async function leaveDeviceMode() {
  if (
    !confirm(
      "Det här är en barnenhet i familjen. Om du loggar in som vuxen här tas barnen bort från enheten – spelen finns kvar på enheten. Fortsätta?",
    )
  )
    return;
  await run(() => cloud.leaveFamilyDevice());
}

/* ---------- låst enhet ---------- */
const unlockPin = ref("");
const unlock = () =>
  run(async () => {
    const r = await cloud.unlock(unlockPin.value);
    unlockPin.value = "";
    if (!r.ok)
      throw new Error(
        r.error === "locked"
          ? `För många fel försök. Vänta till ${new Date(r.until!).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}.`
          : "Fel PIN-kod.",
      );
    await load();
  });

/* ---------- skapa familj ---------- */
const familyName = ref(""),
  adultName = ref("");
const createFamily = () =>
  run(async () => {
    if (!familyName.value.trim()) throw new Error("Skriv familjens namn.");
    await api!.createFamily(familyName.value, adultName.value);
    await cloud.refreshSession();
    await load();
  });

/* ---------- lägg till barn ---------- */
const newName = ref(""),
  newAvatar = ref("🦊");
const addChild = () =>
  run(async () => {
    if (!newName.value.trim()) throw new Error("Skriv barnets namn.");
    await api!.addChild(family.value!.id, newName.value, newAvatar.value);
    newName.value = "";
    members.value = await api!.members();
  });

/* texterna ligger i skriptet i stället för i mallen – långa uttryck i {{ }} bryts annars fel av Prettier */
const deviceNote = computed(() =>
  cloud.family?.name ? `Enheten spelar i familjen ”${cloud.family.name}”.` : "Enheten spelar i en familj.",
);
const addTitle = computed(() => (children.value.length ? "Lägg till ett barn" : "Lägg till ert första barn"));

/* ---------- konto ---------- */
const userEmail = computed(() => cloud.session?.user.email || "");
const lastAdult = computed(() => adults.value.length <= 1);
const signOut = () =>
  run(async () => {
    await cloud.signOut();
    family.value = null;
    members.value = [];
  });
async function deleteAccount() {
  const what = lastAdult.value
    ? "Du är den enda vuxna – hela familjen raderas: barnen, deras spel i kontot, glosor och enheter."
    : "Ditt konto och ditt spel i kontot raderas. Familjen och de andra vuxna finns kvar.";
  if (prompt(`${what} Spelen på enheterna finns kvar. Skriv RADERA för att bekräfta.`) !== "RADERA") return;
  await run(async () => {
    await api!.deleteAccount();
    await cloud.signOut().catch(() => {
      /* sessionen är redan borta */
    });
    family.value = null;
    members.value = [];
    msg.value = "Kontot är raderat.";
  });
}
</script>

<template>
  <div class="wrap page">
    <div class="zone me">
      <span class="zem">👨‍👩‍👧</span>
      <span
        ><b>Föräldrar</b><span>{{ family?.name || "Familjen i Siilikool" }}</span></span
      >
    </div>
    <a href="/" class="btn ghost">← Till spelet</a>

    <div v-if="!cloud.enabled" class="card">
      <p class="qsub">Konton är inte påslagna i den här versionen av Siilikool.</p>
    </div>

    <!-- barnens enhet -->
    <div v-else-if="cloud.isAnonymous" class="card" style="text-align: left">
      <p class="q" style="text-align: left">Det här är en barnenhet</p>
      <p class="qsub">{{ deviceNote }} Föräldraläget öppnar du på din egen enhet.</p>
      <button class="btn ghost wide" :disabled="busy" @click="leaveDeviceMode">Logga in som vuxen här ändå</button>
    </div>

    <!-- logga in -->
    <LoginCard v-else-if="!cloud.isEmailUser" />

    <!-- låst enhet -->
    <div v-else-if="cloud.isLocked" class="card" style="text-align: left">
      <p class="q" style="text-align: left">🔒 Enheten är låst</p>
      <p class="qsub">Skriv vuxen-PIN-koden för att låsa upp föräldraläget på den här enheten.</p>
      <input
        v-model="unlockPin"
        class="field code"
        type="password"
        inputmode="numeric"
        pattern="[0-9]*"
        autocomplete="off"
        maxlength="8"
        placeholder="••••"
        @keydown.enter="unlock"
      />
      <button class="btn green wide" :disabled="busy || unlockPin.length < 4" @click="unlock">Lås upp</button>
    </div>

    <p v-else-if="!loaded" class="qsub">Hämtar familjen …</p>

    <!-- ingen familj än -->
    <div v-else-if="!family" class="card" style="text-align: left">
      <p class="q" style="text-align: left">Skapa er familj</p>
      <p class="qsub">
        Familjen samlar alla: vuxna loggar in med e-post, barnen med familjekoden. Har du fått en inbjudan från en annan
        vuxen? Öppna länken i den i stället.
      </p>
      <input
        v-model="familyName"
        class="field"
        type="text"
        maxlength="60"
        placeholder="Familjens namn, t.ex. Familjen Ek"
      />
      <input v-model="adultName" class="field" type="text" maxlength="40" placeholder="Ditt namn, t.ex. Mamma" />
      <button class="btn green wide" :disabled="busy" @click="createFamily">Skapa familjen</button>
    </div>

    <!-- familjen -->
    <template v-else>
      <ParentMyGameCard />

      <ParentChildPanel v-for="c in children" :key="c.id" :member="c" :family-id="family.id" @changed="load" />

      <div class="card" style="text-align: left">
        <p class="q" style="text-align: left">{{ addTitle }}</p>
        <input
          v-model="newName"
          class="field"
          type="text"
          maxlength="40"
          placeholder="Barnets namn"
          @keydown.enter="addChild"
        />
        <AvatarPicker v-model="newAvatar" />
        <button class="btn green wide" :disabled="busy" @click="addChild">Lägg till</button>
        <p class="qsub">PIN-kod sätter du på barnet efteråt (valfritt).</p>
      </div>

      <div v-if="children.length" class="card">
        <p class="q" style="text-align: left">Glosor för alla barn</p>
        <ParentWordListEditor :family-id="family.id" :member-id="null" who="alla barn" />
      </div>

      <ParentFamilyCodeCard :family="family" @rotated="load" />
      <ParentAdultsCard :adults="adults" />
      <ParentLockCard />

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
