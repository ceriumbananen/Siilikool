<script setup lang="ts">
/* Familjen (docs/plan-konton-v2.md, steg 3): logga in, skapa familjen, och för en olåst vuxen tre flikar:
   Familjen (alla medlemmar som kort → medlemssidan med "Spela som", lägg till barn, bjud in vuxna,
   glosor för alla barn och "Lämna över till barnen"), Koder (familjekoden, barnens egna länkar,
   vuxen-PIN – med en rad om vad varje kod är till för) och Konto (lösenord, logga ut, radera).
   Fliken och den öppna medlemmen står i adressen (?flik=…, ?m=…), så att bakåt fungerar. */

const { L, isEt } = useLang();
useHead({ title: () => L("Familjen · Siilikool", "Pere · Siilikool") });
const profile = useProfileStore();
const route = useRoute();
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
/* kom man hit från spelets första skärm ("Logga in", ?tillbaka=1): när inloggningen är klar och
   spelet hämtats (cloud.autoLinkOwnGame) går man tillbaka till spelet */
const query = new URLSearchParams(location.search);
const backToGame = query.has("tillbaka");
/* "Glömt lösenordet?" - länken i mejlet loggade in och ledde hit: välj ett nytt överst */
const newPassword = query.has("nyttLosen");
/* bara den här gången - laddar man om sidan ska kortet inte komma tillbaka */
if (newPassword) navigateTo({ query: { flik: "konto" } }, { replace: true });
/* nytt konto från välkomstskärmen: familjen skapas när inloggningen är klar (useNewFamily) */
const { completePendingFamily } = useNewFamily();
/* ?ny=1: kontot skapades nyss (på välkomstskärmen, eller via bekräftelselänken i mejlet) */
const justCreated = query.has("ny");
const welcome = ref(false);
if (justCreated) navigateTo({ query: {} }, { replace: true });
async function loadAfterLogin() {
  const created = await completePendingFamily().catch(() => false);
  await load();
  if (created || (justCreated && family.value)) welcome.value = true;
}
async function returnIfAsked() {
  if (!backToGame) return;
  await cloud.autoLinkOwnGame().catch(() => false);
  location.href = "/";
}
watch(
  () => cloud.isEmailUser && !cloud.isLocked && !!cloud.me,
  v => {
    if (!v) return;
    if (backToGame) returnIfAsked();
    else loadAfterLogin();
  },
);
const ready = ref(!cloud.enabled);
/* utloggad: "Utan konto" visar spelet på enheten (framsteg, glosor, säkerhetskopia) - en utloggad
   vuxens spel visas inte, då byts det till ett lokalt spel i spelet */
const { playLocal } = usePlayLocal();
const localView = ref(false);
function onLocal() {
  if (cloud.link?.kind === "adult") {
    if (playLocal()) location.href = "/";
    return;
  }
  localView.value = true;
}
/* spelaren på enheten när den inte är med i familjen (lokal): ett eget kort i Familjen, ?m=enheten */
const localPlayer = computed(() =>
  !cloud.link && profile.playerUsed(profile.current)
    ? {
        name: profile.state.name || L("Spelaren", "Mängija"),
        avatar: profile.state.avatar || "🦔",
        stars: profile.state.stars || 0,
      }
    : null,
);
const deviceOpen = computed(() => route.query.m === "enheten" && !!localPlayer.value);
onMounted(async () => {
  await cloud.init();
  ready.value = true;
  if (!cloud.isEmailUser || cloud.isLocked) return;
  if (backToGame) returnIfAsked();
  else loadAfterLogin();
});

/* ---------- flikar och medlemssidan ---------- */
type Flik = "familj" | "koder" | "konto";
const flik = computed<Flik>(() => {
  const f = route.query.flik;
  return f === "koder" || f === "konto" ? f : "familj";
});
const flikar = computed<{ id: Flik; label: string }[]>(() => [
  { id: "familj", label: L("Familjen", "Pere") },
  { id: "koder", label: L("Koder", "Koodid") },
  { id: "konto", label: L("Konto", "Konto") },
]);
const openMember = computed(() => members.value.find(m => m.id === route.query.m) || null);
const goFlik = (f: Flik) => navigateTo({ query: f === "familj" ? {} : { flik: f } });
const goMember = (m: Member) => navigateTo({ query: { m: m.id } });
const goBack = () => (history.state?.back ? history.back() : navigateTo({ query: {} }));
/* mig själv först, sedan de andra vuxna, sedan barnen (i den ordning de lades till) */
const myId = computed(() => cloud.session?.user.id);
const isMe = (m: Member) => !!m.user_id && m.user_id === myId.value;
const ordered = computed(() => [
  ...adults.value.filter(isMe),
  ...adults.value.filter(m => !isMe(m)),
  ...children.value,
]);
/* var medlemmen spelar på den här enheten */
const here = (m: Member): "" | "now" | "device" =>
  profile.current === memberKey(m.id) ? "now" : profile.players.includes(memberKey(m.id)) ? "device" : "";
const showAdd = ref(false);

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
          ? L(
              `För många fel försök. Vänta till ${new Date(r.until!).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}.`,
              `Liiga palju valesid katseid. Oota kuni ${new Date(r.until!).toLocaleTimeString("et-EE", { hour: "2-digit", minute: "2-digit" })}.`,
            )
          : L("Fel PIN-kod.", "Vale PIN-kood."),
      );
    await load();
  });

/* ---------- skapa familj ---------- */
const familyName = ref(""),
  adultName = ref("");
const createFamily = () =>
  act("create", async () => {
    if (!familyName.value.trim()) throw new Error(L("Skriv familjens namn.", "Kirjuta pere nimi."));
    await api!.createFamily(familyName.value, adultName.value);
    await cloud.refreshSession();
    await load();
  });

/* ---------- lägg till barn ---------- */
const newName = ref(""),
  newAvatar = ref("🦊");
const addChild = () =>
  act("add", async () => {
    if (!newName.value.trim()) throw new Error(L("Skriv barnets namn.", "Kirjuta lapse nimi."));
    await api!.addChild(family.value!.id, newName.value, newAvatar.value);
    newName.value = "";
    showAdd.value = false;
    members.value = await api!.members();
  });

/* texterna ligger i skriptet i stället för i mallen – långa uttryck i {{ }} bryts annars fel av Prettier */
const deviceNote = computed(() =>
  cloud.family?.name
    ? L(`Enheten spelar i familjen ”${cloud.family.name}”.`, `Seade kuulub perele: ${cloud.family.name}.`)
    : L("Enheten spelar i en familj.", "Seade kuulub ühele perele."),
);
const addTitle = computed(() =>
  children.value.length
    ? L("Lägg till ett barn", "Lisa laps")
    : L("Lägg till ert första barn", "Lisa oma esimene laps"),
);
const familyNote = computed(() =>
  isEt()
    ? `Liikmeid: ${members.value.length}. Vajuta kellelegi, et näha edusamme, koolisõnu ja PIN-koodi – või mängida tema nimel.`
    : `${members.value.length} ${members.value.length === 1 ? "medlem" : "medlemmar"}. Tryck på någon för framsteg, glosor och PIN – eller för att spela som hen.`,
);

/* ---------- konto ---------- */
const userEmail = computed(() => cloud.session?.user.email || "");
const lastAdult = computed(() => adults.value.length <= 1);
const signOut = () =>
  act("account", async () => {
    await cloud.signOut();
    location.href = "/"; /* tillbaka till välkomstskärmen – den vuxnas spel visas inte utloggat */
  });
const deleteQuestion = computed(
  () =>
    (lastAdult.value
      ? L(
          "Du är den enda vuxna – hela familjen raderas: barnen, deras spel i kontot, glosor och enheter.",
          "Oled ainus täiskasvanu – kogu pere kustutatakse: lapsed, nende mängud kontol, koolisõnad ja seadmed.",
        )
      : L(
          "Ditt konto och ditt spel i kontot raderas. Familjen och de andra vuxna finns kvar.",
          "Sinu konto ja sinu mäng kontol kustutatakse. Pere ja teised täiskasvanud jäävad alles.",
        )) + L(" Spelen på enheterna finns kvar.", " Mängud seadmetes jäävad alles."),
);
function deleteAccount() {
  return act("account", async () => {
    await api!.deleteAccount();
    await cloud.signOut().catch(() => {
      /* sessionen är redan borta */
    });
    family.value = null;
    members.value = [];
    msg.value = L("Kontot är raderat.", "Konto on kustutatud.");
  });
}
</script>

<template>
  <!-- utloggad: samma inloggning som på startsidan, och sedan tillbaka hit -->
  <WelcomeGate
    v-if="cloud.enabled && ready && !cloud.session && !localView"
    to="/familj"
    :local-label="L('Utan konto: spelet på den här enheten', 'Ilma kontota: mäng selles seadmes')"
    :local-hint="
      L(
        'Framsteg, skolans glosor och säkerhetskopia för spelaren som inte är med i något familjekonto.',
        'Edusammud, koolisõnad ja varukoopia mängijale, kes pole üheski perekontos.',
      )
    "
    @local="onLocal"
  />
  <div v-else class="wrap page">
    <header class="pagehead">
      <a href="/" class="back">{{ L("← Till spelet", "← Mängu juurde") }}</a>
      <h1>{{ family?.name || (cloud.session ? L("Familjen", "Pere") : L("För vuxna", "Täiskasvanutele")) }}</h1>
      <p>
        {{
          family
            ? L("Familjen i Siilikool", "Pere Siilikoolis")
            : L("Framsteg, glosor och säkerhetskopia", "Edusammud, koolisõnad ja varukoopia")
        }}
      </p>
    </header>

    <!-- utan familjekonton i den här versionen, eller utloggad och "Utan konto": spelet på enheten -->
    <ParentDevicePanel v-if="!cloud.enabled" />
    <template v-else-if="localView && !cloud.session">
      <div class="card">
        <h2 class="q">{{ L("Familjekonto", "Perekonto") }}</h2>
        <p class="qsub">
          {{
            L(
              "Med ett konto sparas spelet i familjen, följer med till andra enheter och glosorna kommer från de vuxna.",
              "Kontoga salvestatakse mäng pere juurde, see on olemas ka teistes seadmetes ja koolisõnad tulevad täiskasvanutelt.",
            )
          }}
        </p>
        <button class="btn green wide" @click="localView = false">
          {{ L("Logga in eller skapa konto", "Logi sisse või loo konto") }}
        </button>
      </div>
      <ParentDevicePanel />
    </template>

    <!-- barnens enhet -->
    <div v-else-if="cloud.isAnonymous" class="card">
      <h2 class="q">{{ L("Det här är en barnenhet", "See on lapse seade") }}</h2>
      <p class="qsub">
        {{ deviceNote }} {{ L("Familjen öppnar du på din egen enhet.", "Pere lehe saad avada oma seadmes.") }}
      </p>
      <ConfirmAction
        :label="L('Logga in som vuxen här ändå', 'Logi siin ikkagi sisse täiskasvanuna')"
        :question="
          L(
            'Om du loggar in som vuxen här tas barnen bort från enheten. Spelen finns kvar på enheten.',
            'Kui logid siin sisse täiskasvanuna, eemaldatakse lapsed sellest seadmest. Mängud jäävad seadmesse alles.',
          )
        "
        :yes="L('Logga in som vuxen', 'Logi sisse täiskasvanuna')"
        wide
        :busy="busy"
        @confirm="leaveDeviceMode"
      />
      <p v-if="err && errAt === 'device'" class="err" role="alert">{{ err }}</p>
    </div>

    <p v-else-if="!ready" class="qsub">{{ L("Hämtar …", "Laadin …") }}</p>

    <!-- låst enhet -->
    <div v-else-if="cloud.isLocked" class="card">
      <h2 class="q">{{ L("🔒 Enheten är låst", "🔒 Seade on lukus") }}</h2>
      <p class="qsub">
        {{
          L(
            "Skriv vuxen-PIN-koden för att låsa upp Familjen på den här enheten.",
            "Kirjuta täiskasvanu PIN-kood, et avada selles seadmes pere leht.",
          )
        }}
      </p>
      <label class="flabel"
        >{{ L("Vuxen-PIN", "Täiskasvanu PIN") }}
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
      <button class="btn green wide" :disabled="busy || unlockPin.length < 4" @click="unlock">
        {{ L("Lås upp", "Ava lukk") }}
      </button>
      <p v-if="err && errAt === 'unlock'" class="err" role="alert">{{ err }}</p>
      <details class="more">
        <summary>{{ L("Glömt vuxen-PIN?", "Unustasid täiskasvanu PIN-koodi?") }}</summary>
        <p v-if="isEt()" class="qsub">
          Logi välja ja logi uuesti sisse e-kirja lingiga. Uus sisselogimine on alati lukustamata. Seejärel vali uus
          täiskasvanu PIN-kood: <b>Koodid → Täiskasvanu PIN</b>.
        </p>
        <p v-else class="qsub">
          Logga ut och logga in igen med e-postlänken. En ny inloggning är alltid olåst. Välj sedan en ny vuxen-PIN
          under
          <b>Lås den här enheten</b>.
        </p>
        <button class="btn ghost wide" :disabled="busy" @click="signOut">{{ L("Logga ut", "Logi välja") }}</button>
      </details>
    </div>

    <p v-else-if="!loaded" class="qsub">{{ L("Hämtar familjen …", "Laadin pere andmeid …") }}</p>

    <!-- ingen familj än -->
    <div v-else-if="!family" class="card">
      <h2 class="q">{{ L("Skapa er familj", "Loo oma pere") }}</h2>
      <p class="qsub">
        {{
          L(
            "Familjen samlar alla: vuxna loggar in med e-post, barnen med familjekoden. Har du fått en inbjudan från en annan vuxen? Öppna länken i den i stället.",
            "Pere ühendab kõiki: täiskasvanud logivad sisse e-postiga, lapsed perekoodiga. Kas said kutse teiselt täiskasvanult? Ava hoopis selles olev link.",
          )
        }}
      </p>
      <label class="flabel"
        >{{ L("Familjens namn", "Pere nimi") }}
        <input
          v-model="familyName"
          class="field"
          type="text"
          maxlength="60"
          :placeholder="L('t.ex. Familjen Ek', 'nt Tamme pere')"
      /></label>
      <label class="flabel"
        >{{ L("Ditt namn i familjen", "Sinu nimi peres") }}
        <input v-model="adultName" class="field" type="text" maxlength="40" :placeholder="L('t.ex. Mamma', 'nt Ema')"
      /></label>
      <button class="btn green wide" :disabled="busy" @click="createFamily">
        {{ L("Skapa familjen", "Loo pere") }}
      </button>
      <p v-if="err && errAt === 'create'" class="err" role="alert">{{ err }}</p>
    </div>

    <!-- spelaren på enheten som inte är med i familjen -->
    <div v-else-if="deviceOpen">
      <button class="back familj__back" @click="goBack">{{ L("← Familjen", "← Pere") }}</button>
      <ParentDevicePanel />
    </div>

    <!-- en medlem -->
    <ParentMemberDetail
      v-else-if="openMember"
      :key="openMember.id"
      :member="openMember"
      :family-id="family.id"
      :me="isMe(openMember)"
      :here="here(openMember)"
      @changed="load"
      @back="goBack"
    />

    <!-- familjen -->
    <template v-else>
      <div class="tabs" role="tablist" :aria-label="L('Familjen', 'Pere')">
        <button
          v-for="f in flikar"
          :key="f.id"
          class="tab"
          role="tab"
          :class="{ on: flik === f.id }"
          :aria-selected="flik === f.id"
          @click="goFlik(f.id)"
        >
          {{ f.label }}
        </button>
      </div>

      <template v-if="flik === 'familj'">
        <p v-if="welcome" class="ok" role="status">
          {{
            L(
              "Välkommen! Familjen är skapad. Lägg till barnen nedan, så kan de spela med familjekoden.",
              "Tere tulemast! Pere on loodud. Lisa allpool lapsed, siis saavad nad perekoodiga mängida.",
            )
          }}
        </p>
        <div class="card">
          <h2 class="q">{{ L("Alla i familjen", "Kõik pereliikmed") }}</h2>
          <p class="qsub">{{ familyNote }}</p>
          <div class="members">
            <ParentMemberCard
              v-for="m in ordered"
              :key="m.id"
              :member="m"
              :me="isMe(m)"
              :here="here(m)"
              @open="goMember(m)"
            />
            <!-- spelaren på enheten som inte är med i familjen (lokal) -->
            <button v-if="localPlayer" class="members__local" @click="navigateTo({ query: { m: 'enheten' } })">
              <span aria-hidden="true">{{ localPlayer.avatar }}</span>
              <b>{{ localPlayer.name }}</b>
              <small
                >⭐ {{ localPlayer.stars }} · {{ L("utan konto, spelar nu", "ilma kontota, mängib praegu") }}</small
              >
            </button>
            <button v-if="!showAdd" class="members__add" @click="showAdd = true">
              <span aria-hidden="true">➕</span>
              <b>{{ L("Lägg till barn", "Lisa laps") }}</b>
            </button>
          </div>
        </div>

        <div v-if="showAdd || !children.length" class="card">
          <h2 class="q">{{ addTitle }}</h2>
          <label class="flabel"
            >{{ L("Barnets namn", "Lapse nimi") }}
            <input v-model="newName" class="field" type="text" maxlength="40" @keydown.enter="addChild"
          /></label>
          <AvatarPicker v-model="newAvatar" />
          <button class="btn green wide" :disabled="busy" @click="addChild">{{ L("Lägg till", "Lisa") }}</button>
          <p v-if="err && errAt === 'add'" class="err" role="alert">{{ err }}</p>
          <p class="qsub">
            {{
              L(
                "PIN-kod sätter du på barnet efteråt (valfritt).",
                "PIN-koodi saad lapsele panna hiljem (pole kohustuslik).",
              )
            }}
          </p>
        </div>

        <ParentHandOverCard v-if="children.length" />

        <div v-if="children.length" class="card">
          <h2 class="q">{{ L("Glosor för alla barn", "Koolisõnad kõigile lastele") }}</h2>
          <ParentWordListEditor :family-id="family.id" :member-id="null" :who="L('alla barn', 'kõik lapsed')" />
        </div>

        <ParentInviteCard />
      </template>

      <template v-else-if="flik === 'koder'">
        <div class="card">
          <h2 class="q">{{ L("Koderna i familjen", "Pere koodid") }}</h2>
          <ul v-if="isEt()" class="codes">
            <li><b>Parool</b> – sinu enda oma. Logid sisse e-posti ja parooliga.</li>
            <li><b>Perekood</b> – laste seadmete jaoks: sellega valivad lapsed, kes mängib.</li>
            <li><b>Lapse PIN</b> – pole kohustuslik. Vajalik, et valida laps lapse seadmes.</li>
            <li><b>Täiskasvanu PIN</b> – ühine kõigile täiskasvanutele. Avab seadme, mis on lastele üle antud.</li>
          </ul>
          <ul v-else class="codes">
            <li><b>Lösenord</b> – ditt eget. Du loggar in med e-post och lösenord.</li>
            <li><b>Familjekod</b> – för barnens enheter: med den väljer barnen vem som spelar.</li>
            <li><b>Barnets PIN</b> – valfri. Behövs för att välja barnet på en barnenhet.</li>
            <li><b>Vuxen-PIN</b> – gemensam för de vuxna. Låser upp en enhet som lämnats över till barnen.</li>
          </ul>
        </div>
        <ParentFamilyCodeCard :family="family" @rotated="load" />
        <ParentChildLinksCard v-if="children.length" :family="family" :children="children" />
        <div class="card">
          <h2 class="q">{{ L("Vuxen-PIN", "Täiskasvanu PIN") }}</h2>
          <ParentAdultPinCard />
        </div>
      </template>

      <div v-else class="card">
        <h2 class="q">{{ L("Kontot", "Konto") }}</h2>
        <p class="qsub">{{ L("Inloggad som", "Sisse logitud:") }} {{ userEmail }}</p>
        <ParentPasswordCard :highlight="newPassword" />
        <button class="btn ghost wide" :disabled="busy" @click="signOut">{{ L("Logga ut", "Logi välja") }}</button>
        <div class="dangerzone">
          <ConfirmAction
            :label="L('Radera kontot', 'Kustuta konto')"
            :question="deleteQuestion"
            :yes="L('Radera kontot', 'Kustuta konto')"
            :word="L('RADERA', 'KUSTUTA')"
            danger
            wide
            :busy="busy"
            @confirm="deleteAccount"
          />
        </div>
        <p v-if="err && errAt === 'account'" class="err" role="alert">{{ err }}</p>
      </div>
      <ParentPakTestCard v-if="flik === 'konto'" />
    </template>

    <!-- fel som inte hör till ett visst kort (t.ex. när familjen hämtas) -->
    <p v-if="err && !errAt" class="err" role="alert">{{ err }}</p>
    <p v-if="msg" class="ok" role="status">{{ msg }}</p>
  </div>
</template>

<style lang="scss" scoped>
.members {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
  gap: $spacing-2;
  margin-top: $spacing-3;

  &__add,
  &__local {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-1;
    min-height: 8.5rem;
    border: 1px dashed var(--line);
    border-radius: $radius-md;
    background: none;
    color: var(--muted);
    font: inherit;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      border-color: var(--moss);
      color: var(--ink);
    }

    span {
      font-size: 1.75rem;
    }
  }
}

.members__local {
  border-style: solid;
  border-color: var(--moss);
  color: var(--ink);

  b {
    font-family: "Fredoka", system-ui, sans-serif;
    font-size: $font-size-lg;
  }

  small {
    color: var(--muted);
    font-size: $font-size-sm;
  }
}

.familj__back {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  margin-top: $spacing-2;
  padding: 0;
  border: none;
  background: none;
  color: var(--muted);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.codes {
  margin: $spacing-2 0 0;
  padding-left: $spacing-4;

  li + li {
    margin-top: $spacing-1;
  }
}
</style>
