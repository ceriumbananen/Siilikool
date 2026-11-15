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

/* Estniskt läge (beta, se LANG_BETA_KEY i public/legacy/app.js): på enheter där det slagits på
   kan välkomstskärmen visas på estniska, och valet följer med in i spelet (siiri-home-pending
   läses av langScreen/start i app.js). w(sv, et) väljer text. */
const langBeta = ref(false);
const etUi = ref(false);
onMounted(() => {
  try {
    langBeta.value = localStorage.getItem("siiri-lang-beta") === "1";
    etUi.value = langBeta.value && localStorage.getItem("siiri-home-pending") === "et";
  } catch {
    /* privat läge o.d. */
  }
});
function setUiLang(et: boolean) {
  etUi.value = et;
  try {
    localStorage.setItem("siiri-home-pending", et ? "et" : "sv");
  } catch {
    /* privat läge o.d. */
  }
}
const w = (sv: string, et: string) => (etUi.value ? et : sv);

/* Supabase svarar på engelska - översätt det barn och föräldrar faktiskt kan råka ut för */
function swedish(e: unknown): Error {
  const m = e instanceof Error ? e.message : String(e);
  if (/invalid login credentials/i.test(m))
    return new Error(
      w(
        "Fel e-post eller lösenord. Har du bara loggat in med kod tidigare? Välj ”Logga in med kod i stället”.",
        "Vale e-post või parool. Kas oled varem sisse loginud ainult koodiga? Vali „Logi sisse koodiga”.",
      ),
    );
  if (/email not confirmed/i.test(m))
    return new Error(
      w(
        "Bekräfta din e-post först – klicka på länken i mejlet.",
        "Kinnita kõigepealt oma e-post – klõpsa e-kirjas olevat linki.",
      ),
    );
  if (/already registered|already been registered/i.test(m))
    return new Error(
      w(
        "Det finns redan ett konto med den e-posten. Logga in i stället.",
        "Selle e-postiga konto on juba olemas. Logi hoopis sisse.",
      ),
    );
  if (/rate limit|too many/i.test(m))
    return new Error(
      w(
        "För många försök på kort tid. Vänta en stund och prova igen.",
        "Liiga palju katseid lühikese ajaga. Oota natuke ja proovi uuesti.",
      ),
    );
  if (/password/i.test(m) && /characters|short|weak/i.test(m))
    return new Error(
      w(
        "Lösenordet är för kort eller för enkelt. Välj minst 8 tecken.",
        "Parool on liiga lühike või lihtne. Vali vähemalt 8 tähemärki.",
      ),
    );
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
    if (!emailOk.value)
      throw new Error(
        w("Skriv din e-post först, så skickar vi en länk.", "Kirjuta kõigepealt oma e-post, siis saadame lingi."),
      );
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
    if (!adultName.value.trim()) throw new Error(w("Skriv ditt namn.", "Kirjuta oma nimi."));
    if (!invite && !familyName.value.trim()) throw new Error(w("Skriv familjens namn.", "Kirjuta pere nimi."));
    if (password.value.length < 8)
      throw new Error(w("Välj ett lösenord på minst 8 tecken.", "Vali vähemalt 8 tähemärgi pikkune parool."));
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
    ? w(
        "Du är inbjuden till en familj. Logga in, eller skapa ett eget konto, så går du med.",
        "Sind on kutsutud perre. Logi sisse või loo oma konto, siis liitud.",
      )
    : w(
        "Lär dig estniska med igelkotten Siiri. Logga in, eller skapa ett konto för familjen.",
        "Õpi rootsi keelt siil Siiriga. Logi sisse või loo perele konto.",
      ),
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
      <!-- estniskt läge (beta): välkomstskärmens språk, följer med in i spelet -->
      <div v-if="langBeta" class="welcome__langs">
        <button type="button" :class="{ 'welcome__lang--on': !etUi }" class="welcome__lang" @click="setUiLang(false)">
          🇸🇪 Svenska
        </button>
        <button type="button" :class="{ 'welcome__lang--on': etUi }" class="welcome__lang" @click="setUiLang(true)">
          🇪🇪 Eesti
        </button>
      </div>
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
          {{ w("Logga in", "Logi sisse") }}
        </button>
        <button
          role="tab"
          :aria-selected="mode === 'create'"
          :class="{ 'welcome__tab--on': mode === 'create' }"
          class="welcome__tab"
          @click="setMode('create')"
        >
          {{ w("Skapa konto", "Loo konto") }}
        </button>
      </div>

      <!-- logga in -->
      <form v-if="mode === 'login' && !codeMode" class="welcome__form" @submit.prevent="login">
        <label class="welcome__label" for="w-email">E-post</label>
        <input id="w-email" v-model="email" class="welcome__field" type="email" autocomplete="email" required />
        <label class="welcome__label" for="w-pw">{{ w("Lösenord", "Parool") }}</label>
        <input
          id="w-pw"
          v-model="password"
          class="welcome__field"
          type="password"
          autocomplete="current-password"
          required
        />
        <button class="welcome__primary" type="submit" :disabled="busy || !emailOk || !password">
          {{ w("Logga in", "Logi sisse") }}
        </button>
        <div class="welcome__links">
          <button type="button" class="welcome__link" :disabled="busy" @click="forgot">
            {{ w("Glömt lösenordet?", "Unustasid parooli?") }}
          </button>
          <button type="button" class="welcome__link" @click="((codeMode = true), (msg = ''), (err = ''))">
            {{ w("Logga in med kod i stället", "Logi sisse koodiga") }}
          </button>
        </div>
      </form>

      <!-- logga in med kod i mejlet -->
      <form v-else-if="mode === 'login'" class="welcome__form" @submit.prevent="codeSent ? verifyCode() : sendCode()">
        <p class="welcome__hint">
          {{
            w(
              "Vi skickar en kod till din e-post. Efter inloggningen kan du välja ett lösenord under Familjen → Konto.",
              "Saadame koodi sinu e-postile. Pärast sisselogimist saad parooli valida: Perekond → Konto.",
            )
          }}
        </p>
        <label class="welcome__label" for="w-email2">E-post</label>
        <input id="w-email2" v-model="email" class="welcome__field" type="email" autocomplete="email" required />
        <template v-if="codeSent">
          <label class="welcome__label" for="w-code">{{ w("Kod från mejlet", "Kood e-kirjast") }}</label>
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
          {{ codeSent ? w("Logga in med koden", "Logi koodiga sisse") : w("Skicka kod", "Saada kood") }}
        </button>
        <div class="welcome__links">
          <button type="button" class="welcome__link" @click="((codeMode = false), (msg = ''), (err = ''))">
            {{ w("Logga in med lösenord", "Logi sisse parooliga") }}
          </button>
        </div>
      </form>

      <!-- skapa konto -->
      <form v-else class="welcome__form" @submit.prevent="create">
        <label class="welcome__label" for="w-name">{{ w("Ditt namn", "Sinu nimi") }}</label>
        <input
          id="w-name"
          v-model="adultName"
          class="welcome__field"
          type="text"
          maxlength="40"
          autocomplete="given-name"
          :placeholder="w('t.ex. Laura', 'nt Laura')"
          required
        />
        <template v-if="!invite">
          <label class="welcome__label" for="w-fam">{{ w("Familjens namn", "Pere nimi") }}</label>
          <input
            id="w-fam"
            v-model="familyName"
            class="welcome__field"
            type="text"
            maxlength="60"
            :placeholder="w('t.ex. Familjen Ek', 'nt Tamme pere')"
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
        <p v-if="invite" class="welcome__hint">{{ w("Minst 8 tecken.", "Vähemalt 8 tähemärki.") }}</p>
        <p v-else class="welcome__hint">
          {{
            w(
              "Minst 8 tecken. Barnen behöver inget konto – du lägger till dem i familjen, och de går in med familjekoden.",
              "Vähemalt 8 tähemärki. Lapsed ei vaja kontot – lisad nad perre ja nad sisenevad perekoodiga.",
            )
          }}
        </p>
        <button class="welcome__primary" type="submit" :disabled="busy || !emailOk">
          {{ w("Skapa konto", "Loo konto") }}
        </button>
      </form>

      <p v-if="msg" class="welcome__msg" role="status">{{ msg }}</p>
      <p v-if="err" class="welcome__err" role="alert">{{ err }}</p>

      <!-- barn -->
      <div v-if="!invite" class="welcome__child">
        <button v-if="!childOpen" type="button" class="welcome__link" @click="childOpen = true">
          {{
            w("🧒 Är du ett barn med en familjekod? Skriv den här", "🧒 Oled laps ja sul on perekood? Kirjuta see siia")
          }}
        </button>
        <form v-else class="welcome__child-form" @submit.prevent="goChild">
          <label class="welcome__label" for="w-child">{{ w("Familjekod", "Perekood") }}</label>
          <input
            id="w-child"
            v-model="childCode"
            class="welcome__field welcome__field--code"
            autocapitalize="characters"
            autocomplete="off"
            maxlength="7"
            placeholder="ABC-234"
          />
          <button class="welcome__secondary" type="submit" :disabled="!childCodeOk">
            {{ w("Fortsätt", "Jätka") }}
          </button>
        </form>
      </div>

      <template v-if="!invite">
        <div class="welcome__divider">
          <span>{{ w("eller", "või") }}</span>
        </div>
        <button type="button" class="welcome__secondary" @click="emit('local')">
          {{ etUi && localLabel === "Spela utan konto" ? "Mängi ilma kontota" : localLabel }}
        </button>
        <p class="welcome__hint welcome__hint--center">
          {{
            etUi && localLabel === "Spela utan konto"
              ? "Salvestatakse ainult selles seadmes. Mängu saab hiljem perekontoga siduda."
              : localHint
          }}
        </p>
      </template>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.welcome__langs {
  display: flex;
  justify-content: center;
  gap: $spacing-2;
  margin-bottom: $spacing-2;
}

.welcome__lang {
  border: $border-width solid var(--line);
  border-radius: $radius-pill;
  background: var(--card);
  color: var(--ink);
  font: inherit;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  @include focus-visible;

  &--on {
    border-color: var(--moss);
    box-shadow: 0 0 0 0.125rem var(--moss);
  }
}

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
      color: var(--on-accent);
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
    color: var(--on-accent);
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
