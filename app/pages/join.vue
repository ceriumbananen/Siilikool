<script setup lang="ts">
/* Barnens enheter: familjekod → "Vem spelar?" → PIN (om barnet har en). Spelet sparas sedan i
   familjekontot och glosorna från de vuxna kommer hit. Flera barn kan läggas till på samma enhet.
   En låst vuxen enhet ser familjens barn direkt, utan kod. */

useHead({ title: "Familj · Siilikool" });
const cloud = useCloudStore();
const profile = useProfileStore();
const { busy, err, run } = useBusy();

const code = ref(""),
  done = ref("");
const lookup = ref<FamilyLookup | null>(null);
const chosen = ref<{ id: string; name: string; has_pin: boolean } | null>(null);
const pin = ref("");
const needsChoice = ref(false);

const untilText = (until?: string) =>
  until ? new Date(until).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }) : "en stund";
/* i skriptet i stället för i mallen – långa uttryck i {{ }} bryts annars fel av Prettier */
const codeOk = computed(() => code.value.replace(/[^A-Za-z0-9]/g, "").length >= 6);
const taken = computed(() => new Set(Object.values(cloud.links).map(l => l.id)));
/* barnet som spelas nu behöver ingen PIN – alla andra med PIN gör det */
const playingNow = computed(() => cloud.link?.id);
const needsPin = (m: { id: string; has_pin: boolean }) => m.has_pin && m.id !== playingNow.value;
const tagText = (m: { id: string; has_pin: boolean }) =>
  m.id === playingNow.value ? "spelar nu" : taken.value.has(m.id) ? "på enheten" : m.has_pin ? "🔒 PIN" : "";

function lookupError(r: FamilyLookup) {
  return r.error === "locked"
    ? `För många fel försök. Vänta till ${untilText(r.until)}.`
    : "Hittar ingen familj med den koden. Fråga en vuxen.";
}

const findFamily = (c = code.value) =>
  run(async () => {
    const r = await cloud.lookupFamily(c);
    if (!r.ok) throw new Error(lookupError(r));
    lookup.value = r;
  });

async function choose(m: { id: string; name: string; has_pin: boolean }, choice?: LinkChoice) {
  if (chosen.value?.id !== m.id) pin.value = "";
  chosen.value = m;
  if (needsPin(m) && !pin.value && !choice) return; /* visa PIN-rutan först */
  await run(async () => {
    const r = await cloud.addPlayer(m, needsPin(m) ? pin.value : null, choice);
    if (r === "needs-choice") {
      needsChoice.value = true;
      return;
    }
    if (!r.ok) {
      pin.value = "";
      throw new Error(
        r.error === "wrong_pin"
          ? "Fel PIN-kod. Försök igen."
          : r.error === "locked"
            ? `För många fel försök. Vänta till ${untilText(r.until)}.`
            : r.error === "full"
              ? "Den här enheten har redan tre spelare."
              : "Det gick inte. Fråga en vuxen.",
      );
    }
    needsChoice.value = false;
    done.value = m.name;
    /* till spelet; har en annan profilplats valts går addPlayer redan dit */
    if (r.slot === profile.slot) location.href = "/";
  });
}

onMounted(async () => {
  await cloud.init();
  if (cloud.isAdult) return;
  /* låst vuxen enhet: barnen direkt. Annars koden från QR-koden (?kod=…), eller familjen som enheten
     redan hör till. */
  const fromQr = new URLSearchParams(location.search).get("kod");
  if (cloud.isLocked)
    await run(async () => {
      lookup.value = await cloud.familyChildren();
    });
  else if (fromQr) {
    code.value = fromQr;
    await findFamily(fromQr);
  } else if (cloud.family) await findFamily(cloud.family.code);
});
</script>

<template>
  <div class="wrap page">
    <div class="zone me">
      <span class="zem">👨‍👩‍👧</span>
      <span><b>Familj</b><span>Spela med familjen – spelet sparas och glosorna kommer hit</span></span>
    </div>
    <a href="/" class="btn ghost">← Till spelet</a>

    <div v-if="!cloud.enabled" class="card">
      <p class="qsub">Konton är inte påslagna i den här versionen av Siilikool.</p>
    </div>

    <LinkChoice v-else-if="needsChoice && chosen" :name="chosen.name" :busy="busy" @choose="c => choose(chosen!, c)" />

    <!-- inloggad vuxen (olåst): familjekoden är till för barnens enheter -->
    <div v-else-if="cloud.isAdult" class="card" style="text-align: left">
      <p class="q" style="text-align: left">Du är inloggad som vuxen</p>
      <p class="qsub">
        Familjekoden är till för barnens enheter. Ska barnen spela här? Lås enheten i föräldraläget, så får de välja vem
        som spelar. Ditt eget spel sparar du under <b>Ditt eget spel</b> i föräldraläget.
      </p>
      <a href="/parent" class="btn green wide">Till föräldraläget</a>
    </div>

    <!-- vem spelar? -->
    <div v-else-if="lookup?.ok" class="card" style="text-align: left">
      <p class="q" style="text-align: left">Vem spelar?</p>
      <p class="qsub">{{ lookup.family_name }}</p>
      <div class="slotgrid">
        <button
          v-for="m in lookup.members"
          :key="m.id"
          class="slotbtn"
          :class="{ on: chosen?.id === m.id || m.id === playingNow }"
          :disabled="busy"
          @click="choose(m)"
        >
          <span class="sav">{{ m.avatar }}</span>
          <b>{{ m.name }}</b>
          <small>{{ tagText(m) }}</small>
        </button>
      </div>
      <p v-if="!lookup.members?.length" class="qsub">
        Familjen har inga barn än. En vuxen lägger till dem i föräldraläget.
      </p>
      <template v-if="chosen && needsPin(chosen)">
        <p class="qsub" style="margin-top: 12px">{{ chosen.name }}s PIN-kod</p>
        <input
          v-model="pin"
          class="field code"
          type="password"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="off"
          maxlength="8"
          placeholder="••••"
          @keydown.enter="choose(chosen)"
        />
        <button class="btn green wide" :disabled="busy || pin.length < 4" @click="choose(chosen)">Spela</button>
      </template>
      <p v-if="cloud.isLocked" class="qsub" style="margin-top: 12px">
        🔒 Enheten är låst av en vuxen. <a href="/parent">Lås upp</a>
      </p>
    </div>

    <!-- familjekod -->
    <div v-else-if="!cloud.isLocked" class="card" style="text-align: left">
      <p class="q" style="text-align: left">Skriv familjekoden</p>
      <p class="qsub">En vuxen hittar koden i föräldraläget.</p>
      <input
        v-model="code"
        class="field code"
        maxlength="7"
        autocomplete="off"
        autocapitalize="characters"
        placeholder="ABC-234"
        @keydown.enter="findFamily()"
      />
      <button class="btn green big wide" :disabled="busy || !codeOk" @click="findFamily()">Fortsätt</button>
    </div>

    <p v-if="err" class="err">{{ err }}</p>
    <p v-if="done" class="ok">Klart! Nu spelar {{ done }}.</p>
  </div>
</template>
