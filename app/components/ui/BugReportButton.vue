<script setup lang="ts">
/* Samma buggrapport som öppna BugReport() i public/legacy/app.js (🐛-knappen i LegacyApp.vue),
   fast Vue-native - så att den finns på alla sidor som använder AppShell (rummet, marknaden,
   skattkammaren, profilen), inte bara på de skärmar som fortfarande renderas av app.js. Skickar
   via samma window.SiiriBugReport-bro (app/plugins/bug-report.client.ts) och återanvänder de
   globala .oc/.bugcard/.bugcats-stilarna (public/legacy/style.css) för att se likadan ut. */
const BUG_CATS = [
  { cat: "confused", em: "😕", lbl: "Konstigt" },
  { cat: "sound", em: "🔇", lbl: "Ljudet" },
  { cat: "image", em: "🖼️", lbl: "Bilden" },
  { cat: "stuck", em: "🐌", lbl: "Fastnade" },
  { cat: "other", em: "✏️", lbl: "Annat" },
];
const open = ref(false);
const chosen = ref<string | null>(null);
const note = ref("");
const sending = ref(false);
const result = ref<"ok" | "fail" | null>(null);

function openDialog() {
  open.value = true;
  chosen.value = null;
  note.value = "";
  result.value = null;
}
function close() {
  open.value = false;
}
async function send() {
  sending.value = true;
  const bridge = (window as unknown as { SiiriBugReport?: { enabled: boolean; send: (c: string, n: string) => Promise<boolean> } })
    .SiiriBugReport;
  const ok = bridge?.enabled ? await bridge.send(chosen.value || "other", note.value) : false;
  sending.value = false;
  result.value = ok ? "ok" : "fail";
}
</script>

<template>
  <button class="app-shell__iconbtn" aria-label="Rapportera något konstigt" @click="openDialog">🐛</button>
  <div v-if="open" class="overlay" @click.self="close">
    <div v-if="!result" class="oc bugcard">
      <p class="kicker">🐛 Något som inte stämmer?</p>
      <div class="bugcats">
        <button
          v-for="c in BUG_CATS"
          :key="c.cat"
          type="button"
          class="bugcat"
          :class="{ on: chosen === c.cat }"
          @click="chosen = c.cat"
        >
          {{ c.em }}<span>{{ c.lbl }}</span>
        </button>
      </div>
      <textarea v-model="note" class="bugnote" maxlength="2000" placeholder="Skriv gärna lite mer, om du vill" />
      <button class="btn green wide" type="button" :disabled="sending" @click="send">
        {{ sending ? "Skickar …" : "Skicka" }}
      </button>
      <button class="btn ghost wide" type="button" style="margin-top: 8px" @click="close">Avbryt</button>
    </div>
    <div v-else class="oc bugcard" style="text-align: center">
      <p class="kicker">🐛 {{ result === "ok" ? "Tack!" : "Hoppsan" }}</p>
      <p>{{ result === "ok" ? "Nu vet vi om det." : "Det gick inte att skicka just nu. Testa igen senare." }}</p>
      <button class="btn ghost wide" type="button" @click="close">Okej</button>
    </div>
  </div>
</template>
