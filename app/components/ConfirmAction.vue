<script setup lang="ts">
/* En knapp som frågar i kortet innan något tas bort eller byts – i stället för webbläsarens confirm()/prompt().
   Frågan visas precis där knappen var, med "Avbryt" först. Med `word` måste ordet skrivas för att bekräfta. */
const props = defineProps<{
  label: string /* knappen innan frågan */;
  question: string;
  yes: string /* bekräftelseknappen, t.ex. "Ja, ta bort" */;
  danger?: boolean;
  word?: string;
  busy?: boolean;
  wide?: boolean;
}>();
const emit = defineEmits<{ confirm: [] }>();
const open = ref(false),
  typed = ref("");
const box = ref<HTMLElement | null>(null);
const ok = computed(() => !props.word || typed.value.trim().toUpperCase() === props.word.toUpperCase());

async function ask() {
  open.value = true;
  typed.value = "";
  await nextTick();
  box.value?.querySelector<HTMLElement>("input,button")?.focus();
}
function confirm() {
  if (!ok.value) return;
  open.value = false;
  emit("confirm");
}
</script>

<template>
  <button v-if="!open" class="btn" :class="[danger ? 'danger-quiet' : 'ghost', { wide }]" :disabled="busy" @click="ask">
    {{ label }}
  </button>
  <div v-else ref="box" class="confirm" :class="{ danger }" role="group" :aria-label="label">
    <p>{{ question }}</p>
    <label v-if="word" class="flabel"
      >Skriv {{ word }} för att bekräfta
      <input
        v-model="typed"
        class="field"
        type="text"
        autocomplete="off"
        autocapitalize="characters"
        @keydown.enter="confirm"
    /></label>
    <div class="confirm-row">
      <button class="btn ghost" @click="open = false">Avbryt</button>
      <button class="btn" :class="danger ? 'danger' : 'green'" :disabled="busy || !ok" @click="confirm">
        {{ yes }}
      </button>
    </div>
  </div>
</template>
