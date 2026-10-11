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
  act("", async () => {
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
/* fel visas i kortet där åtgärden gjordes, inte längst ned på sidan */
const errAt = ref("");
const act = (where: string, fn: () => Promise<void>) => {
  errAt.value = where;
  return run(fn);
};
const leaveDeviceMode = () => act("device", () => cloud.leaveFamilyDevice());

/* ---------- låst enhet ---------- */
const unlockPin = ref("");
const unlock = () =>
  act("unlock", async () => {
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
  act("create", async () => {
    if (!familyName.value.trim()) throw new Error("Skriv familjens namn.");
    await api!.createFamily(familyName.value, adultName.value);
    await cloud.refreshSession();
    await load();
  });

/* ---------- lägg till barn ---------- */
const newName = ref(""),
  newAvatar = ref("🦊");
const addChild = () =>
  act("add", async () => {
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
  act("account", async () => {
    await cloud.signOut();
    family.value = null;
    members.value = [];
  });
const deleteQuestion = computed(
  () =>
    (lastAdult.value
      ? "Du är den enda vuxna – hela familjen raderas: barnen, deras spel i kontot, glosor och enheter."
      : "Ditt konto och ditt spel i kontot raderas. Familjen och de andra vuxna finns kvar.") +
    " Spelen på enheterna finns kvar.",
);
function deleteAccount() {
  return act("account", async () => {
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
    <header class="pagehead">
      <a href="/" class="back">← Till spelet</a>
      <h1>Föräldrar</h1>
      <p>{{ family?.name || "Familjen i Siilikool" }}</p>
    </header>

    <div v-if="!cloud.enabled" class="card">
      <h2 class="q">Spelet fungerar utan konto</h2>
      <p class="qsub">
        Den här versionen av Siilikool har inga familjekonton. Allt i spelet fungerar ändå, och framstegen sparas på
        enheten.
      </p>
      <p class="qsub">
        Glosor från skolan lägger du in i spelet: <b>Profil → För vuxna</b>. Där finns också framsteg och reservkopia av
        spelet.
      </p>
    </div>

    <!-- barnens enhet -->
    <div v-else-if="cloud.isAnonymous" class="card">
      <h2 class="q">Det här är en barnenhet</h2>
      <p class="qsub">{{ deviceNote }} Föräldraläget öppnar du på din egen enhet.</p>
      <ConfirmAction
        label="Logga in som vuxen här ändå"
        question="Om du loggar in som vuxen här tas barnen bort från enheten. Spelen finns kvar på enheten."
        yes="Logga in som vuxen"
        wide
        :busy="busy"
        @confirm="leaveDeviceMode"
      />
      <p v-if="err && errAt === 'device'" class="err" role="alert">{{ err }}</p>
    </div>

    <!-- logga in -->
    <LoginCard v-else-if="!cloud.isEmailUser" />

    <!-- låst enhet -->
    <div v-else-if="cloud.isLocked" class="card">
      <h2 class="q">🔒 Enheten är låst</h2>
      <p class="qsub">Skriv vuxen-PIN-koden för att låsa upp föräldraläget på den här enheten.</p>
      <label class="flabel"
        >Vuxen-PIN
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
      /></label>
      <button class="btn green wide" :disabled="busy || unlockPin.length < 4" @click="unlock">Lås upp</button>
      <p v-if="err && errAt === 'unlock'" class="err" role="alert">{{ err }}</p>
      <details class="more">
        <summary>Glömt vuxen-PIN?</summary>
        <p class="qsub">
          Logga ut och logga in igen med e-postlänken. En ny inloggning är alltid olåst. Välj sedan en ny vuxen-PIN
          under
          <b>Lås den här enheten</b>.
        </p>
        <button class="btn ghost wide" :disabled="busy" @click="signOut">Logga ut</button>
      </details>
    </div>

    <p v-else-if="!loaded" class="qsub">Hämtar familjen …</p>

    <!-- ingen familj än -->
    <div v-else-if="!family" class="card">
      <h2 class="q">Skapa er familj</h2>
      <p class="qsub">
        Familjen samlar alla: vuxna loggar in med e-post, barnen med familjekoden. Har du fått en inbjudan från en annan
        vuxen? Öppna länken i den i stället.
      </p>
      <label class="flabel"
        >Familjens namn
        <input v-model="familyName" class="field" type="text" maxlength="60" placeholder="t.ex. Familjen Ek"
      /></label>
      <label class="flabel"
        >Ditt namn i familjen
        <input v-model="adultName" class="field" type="text" maxlength="40" placeholder="t.ex. Mamma"
      /></label>
      <button class="btn green wide" :disabled="busy" @click="createFamily">Skapa familjen</button>
      <p v-if="err && errAt === 'create'" class="err" role="alert">{{ err }}</p>
    </div>

    <!-- familjen -->
    <template v-else>
      <ParentMyGameCard />

      <ParentChildPanel v-for="c in children" :key="c.id" :member="c" :family-id="family.id" @changed="load" />

      <div class="card">
        <h2 class="q">{{ addTitle }}</h2>
        <label class="flabel"
          >Barnets namn <input v-model="newName" class="field" type="text" maxlength="40" @keydown.enter="addChild"
        /></label>
        <AvatarPicker v-model="newAvatar" />
        <button class="btn green wide" :disabled="busy" @click="addChild">Lägg till</button>
        <p v-if="err && errAt === 'add'" class="err" role="alert">{{ err }}</p>
        <p class="qsub">PIN-kod sätter du på barnet efteråt (valfritt).</p>
      </div>

      <div v-if="children.length" class="card">
        <h2 class="q">Glosor för alla barn</h2>
        <ParentWordListEditor :family-id="family.id" :member-id="null" who="alla barn" />
      </div>

      <ParentFamilyCodeCard :family="family" @rotated="load" />
      <ParentAdultsCard :adults="adults" />
      <ParentLockCard />

      <div class="card">
        <h2 class="q">Kontot</h2>
        <p class="qsub">Inloggad som {{ userEmail }}</p>
        <button class="btn ghost wide" :disabled="busy" @click="signOut">Logga ut</button>
        <div class="dangerzone">
          <ConfirmAction
            label="Radera kontot"
            :question="deleteQuestion"
            yes="Radera kontot"
            word="RADERA"
            danger
            wide
            :busy="busy"
            @confirm="deleteAccount"
          />
        </div>
        <p v-if="err && errAt === 'account'" class="err" role="alert">{{ err }}</p>
      </div>
    </template>

    <!-- fel som inte hör till ett visst kort (t.ex. när familjen hämtas) -->
    <p v-if="err && !errAt" class="err" role="alert">{{ err }}</p>
    <p v-if="msg" class="ok" role="status">{{ msg }}</p>
  </div>
</template>
