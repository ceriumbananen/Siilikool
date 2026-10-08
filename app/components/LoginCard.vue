<script setup lang="ts">
/* Logga in som vuxen med e-post: länk i mejlet, eller koden i samma mejl (behövs när appen körs
   från hemskärmen, där länken öppnas i webbläsaren). Länken leder tillbaka till sidan man står på. */
defineProps<{ title?: string; intro?: string }>();
const api = useParentApi();
const { busy, err, run } = useBusy();
const email = ref(""),
  code = ref(""),
  sent = ref(false);

const sendLink = () =>
  run(async () => {
    await api.sendLoginLink(email.value.trim());
    sent.value = true;
  });
const verify = () => run(() => api.verifyCode(email.value.trim(), code.value));
</script>

<template>
  <div class="card" style="text-align: left">
    <p class="q" style="text-align: left">{{ title || "Logga in" }}</p>
    <p class="qsub">{{ intro || "Skriv din e-post så skickar vi en inloggningslänk. Inget lösenord behövs." }}</p>
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
      <p class="ok">Mejlet är skickat till {{ email }}. Klicka på länken i mejlet så loggas du in.</p>
      <!-- koden finns bara i mejlet när mallen innehåller .Token (kräver egen SMTP i Supabase, se docs/konton.md) -->
      <p class="qsub">Har mejlet också en sexsiffrig kod kan du skriva den här i stället:</p>
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
    <p v-if="err" class="err">{{ err }}</p>
  </div>
</template>
