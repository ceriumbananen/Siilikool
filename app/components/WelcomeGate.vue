<script setup lang="ts">
/* Välkomstskärmen (docs/plan-konton-v2.md, steg 1): visas före spelet på en enhet som varken är
   inloggad eller har någon sparad spelare. Logga in (förvalt), skapa ett familjekonto, gå in med
   familjekod - eller spela utan konto, som då sparas bara på den här enheten. Inget av spelets toppfält
   (profil, märke, stjärnor) syns här: det finns ingen spelare än. */
const {
  to = "/",
  invite = false,
  localLabel = "Spela utan konto",
  localHint = "Sparas bara på den här enheten. Du kan koppla spelet till ett familjekonto senare.",
} = defineProps<{
  /** Vart man kommer efter inloggningen (spelet, eller Familjen när man loggar in där). */
  to?: string;
  /** På en inbjudan: inget familjenamn (man går med i en befintlig familj), ingen familjekod och
   * inget "Spela utan konto" - efter inloggningen går man tillbaka till inbjudan (`to`). */
  invite?: boolean;
  /** Knappen för att fortsätta utan konto, och raden under den (Familjen visar enhetens spel i stället). */
  localLabel?: string;
  localHint?: string;
}>();
const emit = defineEmits<{ local: [] }>();

const api = useParentApi();
const cloud = useCloudStore();
const { completePendingFamily } = useNewFamily();
const { busy, err, run } = useBusy();

const mode = ref<"login" | "create">("login");
const email = ref(""),
  password = ref(""),
  adultName = ref(""),
  familyName = ref("");
const msg = ref("");
/* inloggning med kod i mejlet - för konton som inte har något lösenord än */
const codeMode = ref(false),
  codeSent = ref(false),
  code = ref("");
const childOpen = ref(false),
  childCode = ref("");

/* Supabase svarar på engelska - översätt det barn och föräldrar faktiskt kan råka ut för */
function swedish(e: unknown): Error {
  const m = e instanceof Error ? e.message : String(e);
  if (/invalid login credentials/i.test(m))
    return new Error(
      "Fel e-post eller lösenord. Har du bara loggat in med kod tidigare? Välj ”Logga in med kod i stället”.",
    );
  if (/email not confirmed/i.test(m)) return new Error("Bekräfta din e-post först – klicka på länken i mejlet.");
  if (/already registered|already been registered/i.test(m))
    return new Error("Det finns redan ett konto med den e-posten. Logga in i stället.");
  if (/rate limit|too many/i.test(m)) return new Error("För många försök på kort tid. Vänta en stund och prova igen.");
  if (/password/i.test(m) && /characters|short|weak/i.test(m))
    return new Error("Lösenordet är för kort eller för enkelt. Välj minst 8 tecken.");
  return e instanceof Error ? e : new Error(m);
}
const act = (fn: () => Promise<void>) =>
  run(async () => {
    msg.value = "";
    try {
      await fn();
    } catch (e) {
      throw swedish(e);
    }
  });

/* inloggad: familjen som väntade på bekräftelsen skapas, saknas familj går man till Familjen
   (där den skapas), annars hämtas spelet och man går in i det */
async function afterLogin() {
  await cloud.refreshSession();
  if (invite) {
    location.href = to;
    return;
  }
  if (await completePendingFamily()) {
    location.href = "/familj?ny=1"; /* välkommen - lägg till barnen */
    return;
  }
  if (!cloud.me?.family_id) {
    location.href = "/familj";
    return;
  }
  await cloud.autoLinkOwnGame().catch(() => false);
  location.href = to;
}

const emailOk = computed(() => /.+@.+\..+/.test(email.value.trim()));

const login = () =>
  act(async () => {
    await api.signInWithPassword(email.value, password.value);
    await afterLogin();
  });
const forgot = () =>
  act(async () => {
    if (!emailOk.value) throw new Error("Skriv din e-post först, så skickar vi en länk.");
    await api.sendPasswordReset(email.value);
    msg.value = `Vi har skickat en länk till ${email.value.trim()}. Öppna den för att välja ett nytt lösenord.`;
  });
const sendCode = () =>
  act(async () => {
    await api.sendLoginLink(email.value.trim());
    codeSent.value = true;
    msg.value = `Mejlet är skickat till ${email.value.trim()}. Skriv koden här, eller klicka på länken i mejlet.`;
  });
const verifyCode = () =>
  act(async () => {
    await api.verifyCode(email.value.trim(), code.value);
    await afterLogin();
  });

const create = () =>
  act(async () => {
    if (!adultName.value.trim()) throw new Error("Skriv ditt namn.");
    if (!invite && !familyName.value.trim()) throw new Error("Skriv familjens namn.");
    if (password.value.length < 8) throw new Error("Välj ett lösenord på minst 8 tecken.");
    if (!invite) savePendingFamily({ familyName: familyName.value.trim(), adultName: adultName.value.trim() });
    const { loggedIn } = await api.signUp(email.value, password.value, invite ? to : "/familj?ny=1");
    if (loggedIn) return afterLogin();
    msg.value = `Nästan klart! Vi har skickat ett mejl till ${email.value.trim()}. Klicka på länken i det för att bekräfta${invite ? ", så kommer du tillbaka till inbjudan" : ", så skapas familjen"}.`;
  });

const childCodeOk = computed(() => childCode.value.replace(/[^A-Za-z0-9]/g, "").length >= 6);
function goChild() {
  location.href = `/join?kod=${encodeURIComponent(childCode.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase())}`;
}

const lead = computed(() =>
  invite
    ? "Du är inbjuden till en familj. Logga in, eller skapa ett eget konto, så går du med."
    : "Lär dig estniska med igelkotten Siiri. Logga in, eller skapa ett konto för familjen.",
);

function setMode(m: "login" | "create") {
  mode.value = m;
  err.value = "";
  msg.value = "";
}
</script>

<template>
  <main class="welcome">
    <section class="welcome__card" aria-labelledby="welcome-title">
      <img class="welcome__siiri" src="/images/siiri/siiri-body.webp" alt="" width="120" height="120" />
      <h1 id="welcome-title">Siilikool</h1>
      <p class="welcome__lead">{{ lead }}</p>

      <div class="welcome__tabs" role="tablist">
        <button
          role="tab"
          :aria-selected="mode === 'login'"
          :class="{ 'welcome__tab--on': mode === 'login' }"
          class="welcome__tab"
          @click="setMode('login')"
        >
          Logga in
        </button>
        <button
          role="tab"
          :aria-selected="mode === 'create'"
          :class="{ 'welcome__tab--on': mode === 'create' }"
          class="welcome__tab"
          @click="setMode('create')"
        >
          Skapa konto
        </button>
      </div>

      <!-- logga in -->
      <form v-if="mode === 'login' && !codeMode" class="welcome__form" @submit.prevent="login">
        <label class="welcome__label" for="w-email">E-post</label>
        <input id="w-email" v-model="email" class="welcome__field" type="email" autocomplete="email" required />
        <label class="welcome__label" for="w-pw">Lösenord</label>
        <input
          id="w-pw"
          v-model="password"
          class="welcome__field"
          type="password"
          autocomplete="current-password"
          required
        />
        <button class="welcome__primary" type="submit" :disabled="busy || !emailOk || !password">Logga in</button>
        <div class="welcome__links">
          <button type="button" class="welcome__link" :disabled="busy" @click="forgot">Glömt lösenordet?</button>
          <button type="button" class="welcome__link" @click="((codeMode = true), (msg = ''), (err = ''))">
            Logga in med kod i stället
          </button>
        </div>
      </form>

      <!-- logga in med kod i mejlet -->
      <form v-else-if="mode === 'login'" class="welcome__form" @submit.prevent="codeSent ? verifyCode() : sendCode()">
        <p class="welcome__hint">
          Vi skickar en kod till din e-post. Efter inloggningen kan du välja ett lösenord under Familjen → Konto.
        </p>
        <label class="welcome__label" for="w-email2">E-post</label>
        <input id="w-email2" v-model="email" class="welcome__field" type="email" autocomplete="email" required />
        <template v-if="codeSent">
          <label class="welcome__label" for="w-code">Kod från mejlet</label>
          <input
            id="w-code"
            v-model="code"
            class="welcome__field welcome__field--code"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="10"
          />
        </template>
        <button class="welcome__primary" type="submit" :disabled="busy || !emailOk || (codeSent && code.length < 6)">
          {{ codeSent ? "Logga in med koden" : "Skicka kod" }}
        </button>
        <div class="welcome__links">
          <button type="button" class="welcome__link" @click="((codeMode = false), (msg = ''), (err = ''))">
            Logga in med lösenord
          </button>
        </div>
      </form>

      <!-- skapa konto -->
      <form v-else class="welcome__form" @submit.prevent="create">
        <label class="welcome__label" for="w-name">Ditt namn</label>
        <input
          id="w-name"
          v-model="adultName"
          class="welcome__field"
          type="text"
          maxlength="40"
          autocomplete="given-name"
          placeholder="t.ex. Laura"
          required
        />
        <template v-if="!invite">
          <label class="welcome__label" for="w-fam">Familjens namn</label>
          <input
            id="w-fam"
            v-model="familyName"
            class="welcome__field"
            type="text"
            maxlength="60"
            placeholder="t.ex. Familjen Ek"
            required
          />
        </template>
        <label class="welcome__label" for="w-email3">E-post</label>
        <input id="w-email3" v-model="email" class="welcome__field" type="email" autocomplete="email" required />
        <label class="welcome__label" for="w-pw2">Lösenord</label>
        <input
          id="w-pw2"
          v-model="password"
          class="welcome__field"
          type="password"
          autocomplete="new-password"
          minlength="8"
          required
        />
        <p v-if="invite" class="welcome__hint">Minst 8 tecken.</p>
        <p v-else class="welcome__hint">
          Minst 8 tecken. Barnen behöver inget konto – du lägger till dem i familjen, och de går in med familjekoden.
        </p>
        <button class="welcome__primary" type="submit" :disabled="busy || !emailOk">Skapa konto</button>
      </form>

      <p v-if="msg" class="welcome__msg" role="status">{{ msg }}</p>
      <p v-if="err" class="welcome__err" role="alert">{{ err }}</p>

      <!-- barn -->
      <div v-if="!invite" class="welcome__child">
        <button v-if="!childOpen" type="button" class="welcome__link" @click="childOpen = true">
          🧒 Är du ett barn med en familjekod? Skriv den här
        </button>
        <form v-else class="welcome__child-form" @submit.prevent="goChild">
          <label class="welcome__label" for="w-child">Familjekod</label>
          <input
            id="w-child"
            v-model="childCode"
            class="welcome__field welcome__field--code"
            autocapitalize="characters"
            autocomplete="off"
            maxlength="7"
            placeholder="ABC-234"
          />
          <button class="welcome__secondary" type="submit" :disabled="!childCodeOk">Fortsätt</button>
        </form>
      </div>

      <template v-if="!invite">
        <div class="welcome__divider"><span>eller</span></div>
        <button type="button" class="welcome__secondary" @click="emit('local')">{{ localLabel }}</button>
        <p class="welcome__hint welcome__hint--center">{{ localHint }}</p>
      </template>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.welcome {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-4 $spacing-3;

  &__card {
    width: 100%;
    max-width: 50rem;
    background: var(--card);
    border: $border-width solid var(--line);
    border-radius: $radius-lg;
    box-shadow: $shadow-3;
    padding: $spacing-5 $spacing-4;
    text-align: center;
    color: var(--ink);

    h1 {
      font-size: $font-size-2xl;
      margin: $spacing-1 0 0;
    }
  }

  &__siiri {
    width: 7.5rem; // 120px
    height: 7.5rem;
    object-fit: contain;
  }

  &__lead {
    color: var(--muted);
    margin: $spacing-1 0 $spacing-4;
  }

  /* flikarna: logga in / skapa konto */
  &__tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.25rem;
    padding: 0.25rem;
    border-radius: $radius-pill;
    background: var(--bg2);
    margin-bottom: $spacing-4;
  }

  &__tab {
    border: none;
    border-radius: $radius-pill;
    padding: $spacing-2;
    background: none;
    color: var(--muted);
    font: inherit;
    font-weight: 700;
    cursor: pointer;

    @include focus-visible;

    &--on {
      background: var(--moss);
      color: #fff;
    }
  }

  &__form,
  &__child-form {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  &__label {
    font-size: $font-size-xs;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
    margin: $spacing-2 0 0.25rem;
  }

  &__field {
    font: inherit;
    font-size: $font-size-md;
    padding: 0.75rem $spacing-3;
    border-radius: $radius-md;
    border: $border-width solid var(--line);
    background: var(--bg2);
    color: var(--ink);

    &:focus {
      outline: none;
      border-color: var(--moss);
    }

    &--code {
      text-align: center;
      letter-spacing: 0.2em;
      font-weight: 700;
      text-transform: uppercase;
    }
  }

  &__primary,
  &__secondary {
    font: inherit;
    font-weight: 700;
    font-size: $font-size-md;
    border-radius: $radius-pill;
    padding: 0.875rem $spacing-4;
    cursor: pointer;
    width: 100%;

    @include focus-visible;

    &:disabled {
      opacity: 0.55;
      cursor: default;
    }
  }

  &__primary {
    margin-top: $spacing-4;
    border: none;
    background: var(--moss);
    color: #fff;
    box-shadow: $shadow-2;
  }

  &__secondary {
    margin-top: $spacing-2;
    border: $border-width solid var(--line);
    background: none;
    color: var(--ink);
  }

  &__links {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: $spacing-1;
    margin-top: $spacing-2;
  }

  &__link {
    background: none;
    border: none;
    padding: 0.25rem 0;
    font: inherit;
    font-size: $font-size-sm;
    font-weight: 600;
    color: var(--moss);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 0.2em;

    @include focus-visible;
  }

  &__hint {
    font-size: $font-size-sm;
    color: var(--muted);
    margin: $spacing-1 0 0;
    line-height: 1.45;

    &--center {
      text-align: center;
    }
  }

  &__msg,
  &__err {
    font-size: $font-size-sm;
    margin: $spacing-3 0 0;
    text-align: left;
  }

  &__msg {
    color: var(--moss);
  }

  &__err {
    color: var(--berry);
  }

  &__child {
    margin-top: $spacing-4;

    .welcome__link {
      color: var(--ink);
      font-size: $font-size-lg;
      text-decoration: none;
    }
  }

  &__divider {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    margin: $spacing-4 0 0;
    color: var(--muted);
    font-size: $font-size-sm;

    &::before,
    &::after {
      content: "";
      flex: 1;
      height: 1px;
      background: var(--line);
    }
  }
}
</style>
