<script setup lang="ts">
/* Spelaren utan konto på den här enheten: vad hen kan, skolans glosor (som vuxna annars lägger in i
   Familjen) och en säkerhetskopia av spelet som kod. Ersätter "För vuxna" i den gamla appen för
   spel som inte sparas i familjekontot. */
const profile = useProfileStore();
const progress = computed(() => summarizeProgress(toRaw(profile.state)));
const name = computed(() => profile.state.name || "spelaren");

/* skolans glosor: inklistringen finns kvar i den gamla appen */
function toSchool() {
  markLegacyScreen("schoolimport");
  location.href = "/";
}
const schoolText = computed(() =>
  profile.state.school
    ? `${profile.state.school.name} – ändra eller ta bort listan`
    : "Klistra in veckans ord så övar Siiri dem",
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
    msg.value = "Koden är kopierad. Spara den i ett mejl till dig själv.";
  } catch {
    msg.value = "Markera och kopiera koden. Spara den i ett mejl till dig själv.";
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
      <h2 class="q">{{ profile.state.name || "Spelaren" }} just nu</h2>
      <ParentProgressView
        :progress="progress"
        :name="name"
        empty-text="Inga ord övade än – det fylls på när spelet kommer igång."
      />
    </div>

    <a class="card dpanel__school" href="/" @click.prevent="toSchool">
      <span aria-hidden="true">📝</span>
      <span>
        <b>Skolans glosor</b>
        <small>{{ schoolText }}</small>
      </span>
      <span aria-hidden="true">›</span>
    </a>

    <div class="card">
      <h2 class="q">Säkerhetskopia</h2>
      <p class="qsub">
        Spelet sparas bara i den här webbläsaren. Spara en kod om du byter enhet eller rensar webbläsaren – eller gå med
        i ett familjekonto, så sparas det där.
      </p>
      <button class="btn ghost wide" @click="copyCode">📋 Kopiera spelets kod</button>
      <template v-if="code">
        <label class="flabel"
          >Spelets kod
          <textarea
            class="field dpanel__code"
            :value="code"
            readonly
            @focus="($event.target as HTMLTextAreaElement).select()"
          />
        </label>
      </template>
      <p v-if="msg" class="ok" role="status">{{ msg }}</p>
      <button v-if="!restoreOpen" class="btn ghost wide" @click="restoreOpen = true">📥 Återställ från kod</button>
      <template v-else>
        <label class="flabel"
          >Klistra in koden – {{ profile.state.name || "spelaren" }}s spel skrivs över
          <textarea v-model="restoreCode" class="field dpanel__code" @input="bad = false" />
        </label>
        <p v-if="bad" class="err" role="alert">Koden känns inte igen.</p>
        <button class="btn green wide" :disabled="!restoreCode.trim()" @click="restore">Återställ</button>
        <button class="btn ghost wide" @click="restoreOpen = false">Avbryt</button>
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
