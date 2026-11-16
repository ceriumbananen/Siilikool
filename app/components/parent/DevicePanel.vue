<script setup lang="ts">
/* Spelaren utan konto på den här enheten: vad hen kan, skolans glosor (som vuxna annars lägger in i
   Familjen) och en säkerhetskopia av spelet som kod. Ersätter "För vuxna" i den gamla appen för
   spel som inte sparas i familjekontot. */
const profile = useProfileStore();
const { L, isEt } = useLang();
const progress = computed(() => summarizeProgress(toRaw(profile.state)));
const name = computed(() => profile.state.name || L("spelaren", "mängija"));

/* skolans glosor: inklistringen finns kvar i den gamla appen */
function toSchool() {
  markLegacyScreen("schoolimport");
  location.href = "/";
}
const schoolText = computed(() =>
  profile.state.school
    ? L(
        `${profile.state.school.name} – ändra eller ta bort listan`,
        `${profile.state.school.name} – muuda või kustuta loend`,
      )
    : L("Klistra in veckans ord så övar Siiri dem", "Kleebi siia nädala sõnad, siis harjutab Siiri neid"),
);

/* ---------- säkerhetskopia ---------- */
const code = ref(""),
  restoreOpen = ref(false),
  restoreCode = ref(""),
  msg = ref(""),
  bad = ref(false);
async function copyCode() {
  code.value = profile.exportCode();
  msg.value = "";
  try {
    await navigator.clipboard.writeText(code.value);
    msg.value = L(
      "Koden är kopierad. Spara den i ett mejl till dig själv.",
      "Kood on kopeeritud. Salvesta see e-kirjaga iseendale.",
    );
  } catch {
    msg.value = L(
      "Markera och kopiera koden. Spara den i ett mejl till dig själv.",
      "Märgista ja kopeeri kood. Salvesta see e-kirjaga iseendale.",
    );
  }
}
function restore() {
  if (profile.importCode(restoreCode.value)) location.href = "/";
  else bad.value = true;
}
</script>

<template>
  <div>
    <div class="card">
      <h2 class="q">
        {{ L(`${profile.state.name || "Spelaren"} just nu`, `${profile.state.name || "Mängija"} praegu`) }}
      </h2>
      <ParentProgressView
        :progress="progress"
        :name="name"
        :empty-text="
          L(
            'Inga ord övade än – det fylls på när spelet kommer igång.',
            'Veel pole ühtegi sõna harjutatud – see täitub, kui mäng läheb käima.',
          )
        "
      />
    </div>

    <a class="card dpanel__school" href="/" @click.prevent="toSchool">
      <span aria-hidden="true">📝</span>
      <span>
        <b>{{ L("Skolans glosor", "Koolisõnad") }}</b>
        <small>{{ schoolText }}</small>
      </span>
      <span aria-hidden="true">›</span>
    </a>

    <div class="card">
      <h2 class="q">{{ L("Säkerhetskopia", "Varukoopia") }}</h2>
      <p class="qsub">
        {{
          L(
            "Spelet sparas bara i den här webbläsaren. Spara en kod om du byter enhet eller rensar webbläsaren – eller gå med i ett familjekonto, så sparas det där.",
            "Mäng salvestatakse ainult selles brauseris. Salvesta kood, kui vahetad seadet või tühjendad brauseri – või liitu perekontoga, siis salvestatakse mäng seal.",
          )
        }}
      </p>
      <button class="btn ghost wide" @click="copyCode">
        {{ L("📋 Kopiera spelets kod", "📋 Kopeeri mängu kood") }}
      </button>
      <template v-if="code">
        <label class="flabel"
          >{{ L("Spelets kod", "Mängu kood") }}
          <textarea
            class="field dpanel__code"
            :value="code"
            readonly
            @focus="($event.target as HTMLTextAreaElement).select()"
          />
        </label>
      </template>
      <p v-if="msg" class="ok" role="status">{{ msg }}</p>
      <button v-if="!restoreOpen" class="btn ghost wide" @click="restoreOpen = true">
        {{ L("📥 Återställ från kod", "📥 Taasta koodist") }}
      </button>
      <template v-else>
        <label class="flabel"
          >{{
            isEt()
              ? `Kleebi kood siia – praegune mäng kirjutatakse üle (${profile.state.name || "mängija"})`
              : `Klistra in koden – ${profile.state.name || "spelaren"}s spel skrivs över`
          }}
          <textarea v-model="restoreCode" class="field dpanel__code" @input="bad = false" />
        </label>
        <p v-if="bad" class="err" role="alert">{{ L("Koden känns inte igen.", "Koodi ei tuntud ära.") }}</p>
        <button class="btn green wide" :disabled="!restoreCode.trim()" @click="restore">
          {{ L("Återställ", "Taasta") }}
        </button>
        <button class="btn ghost wide" @click="restoreOpen = false">{{ L("Avbryt", "Loobu") }}</button>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dpanel {
  &__school {
    display: flex;
    align-items: center;
    gap: $spacing-3;
    color: var(--ink);
    text-decoration: none;

    > span:first-child {
      font-size: 2rem;
    }

    > span:nth-child(2) {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    small {
      color: var(--muted);
    }
  }

  &__code {
    min-height: 6.5rem;
    font-size: $font-size-xs;
    font-family: ui-monospace, monospace;
  }
}
</style>
