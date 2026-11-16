<script setup lang="ts">
/* Barnens enheter: familjekod → "Vem spelar?" → PIN (om barnet har en). Spelet sparas sedan i
   familjekontot och glosorna från de vuxna kommer hit. Flera barn kan läggas till på samma enhet.
   En låst vuxen enhet ser familjens barn direkt, utan kod. */

const { L, isEt } = useLang();
useHead({ title: () => L("Familj · Siilikool", "Pere · Siilikool") });
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
  until
    ? new Date(until).toLocaleTimeString(L("sv-SE", "et-EE"), { hour: "2-digit", minute: "2-digit" })
    : L("en stund", "natuke");
/* i skriptet i stället för i mallen – långa uttryck i {{ }} bryts annars fel av Prettier */
const codeOk = computed(() => code.value.replace(/[^A-Za-z0-9]/g, "").length >= 6);
const taken = computed(() => new Set(Object.values(cloud.links).map(l => l.id)));
/* barnet som spelas nu behöver ingen PIN – alla andra med PIN gör det */
const playingNow = computed(() => cloud.link?.id);
const needsPin = (m: { id: string; has_pin: boolean }) => m.has_pin && m.id !== playingNow.value;
const tagText = (m: { id: string; has_pin: boolean }) =>
  m.id === playingNow.value
    ? L("spelar nu", "mängib praegu")
    : taken.value.has(m.id)
      ? L("på enheten", "seadmes")
      : m.has_pin
        ? "🔒 PIN"
        : "";

function lookupError(r: FamilyLookup) {
  return r.error === "locked"
    ? L(
        `För många fel försök. Vänta till ${untilText(r.until)}.`,
        `Liiga palju valesid katseid. Oota: ${untilText(r.until)}.`,
      )
    : L("Hittar ingen familj med den koden. Fråga en vuxen.", "Selle koodiga peret ei leitud. Küsi täiskasvanult.");
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
          ? L("Fel PIN-kod. Försök igen.", "Vale PIN-kood. Proovi uuesti.")
          : r.error === "locked"
            ? L(
                `För många fel försök. Vänta till ${untilText(r.until)}.`,
                `Liiga palju valesid katseid. Oota: ${untilText(r.until)}.`,
              )
            : L("Det gick inte. Fråga en vuxen.", "See ei õnnestunud. Küsi täiskasvanult."),
      );
    }
    needsChoice.value = false;
    done.value = m.name;
    /* till spelet; byttes spelare går addPlayer redan dit */
    if (r.key === profile.current) location.href = "/";
  });
}

onMounted(async () => {
  await cloud.init();
  if (cloud.isAdult) return;
  /* låst vuxen enhet: barnen direkt. Annars koden från QR-koden (?kod=…), eller familjen som enheten
     redan hör till. */
  const q = new URLSearchParams(location.search);
  const fromQr = q.get("kod");
  if (cloud.isLocked)
    await run(async () => {
      lookup.value = await cloud.familyChildren();
    });
  else if (fromQr) {
    code.value = fromQr;
    await findFamily(fromQr);
  } else if (cloud.family) await findFamily(cloud.family.code);
  /* barnets egen länk (?barn=<id>, från Familjen → Koder): direkt till barnet, utan "Vem spelar?" */
  const own = lookup.value?.members?.find(m => m.id === q.get("barn"));
  if (own) await choose(own);
});
</script>

<template>
  <div class="wrap page">
    <header class="pagehead">
      <a href="/" class="back">{{ L("← Till spelet", "← Mängu juurde") }}</a>
      <h1>{{ L("Familj", "Pere") }}</h1>
      <p>
        {{
          L(
            "Spela med familjen – spelet sparas och glosorna kommer hit",
            "Mängi perega – mäng salvestatakse ja koolisõnad tulevad siia",
          )
        }}
      </p>
    </header>

    <div v-if="!cloud.enabled" class="card">
      <h2 class="q">{{ L("Spelet fungerar utan familj", "Mäng töötab ka ilma pereta") }}</h2>
      <p class="qsub">
        {{
          L(
            "Den här versionen av Siilikool har inga familjekonton. Spela som vanligt – framstegen sparas på enheten.",
            "Selles Siilikooli versioonis perekontosid pole. Mängi nagu tavaliselt – edusammud salvestatakse seadmesse.",
          )
        }}
      </p>
      <a href="/" class="btn green wide">{{ L("Till spelet", "Mängu juurde") }}</a>
    </div>

    <LinkChoice v-else-if="needsChoice && chosen" :name="chosen.name" :busy="busy" @choose="c => choose(chosen!, c)" />

    <!-- inloggad vuxen (olåst): familjekoden är till för barnens enheter -->
    <div v-else-if="cloud.isAdult" class="card">
      <h2 class="q">{{ L("Du är inloggad som vuxen", "Oled sisse logitud täiskasvanuna") }}</h2>
      <p v-if="isEt()" class="qsub">
        Perekood on laste seadmete jaoks. Kas lapsed hakkavad siin mängima? Vali pere lehel <b>Anna lastele üle</b>,
        siis saavad nad valida, kes mängib. Kui tahad ise lapsena mängida: ava pere lehel laps ja vajuta <b>▶ Mängi</b>.
      </p>
      <p v-else class="qsub">
        Familjekoden är till för barnens enheter. Ska barnen spela här? Välj <b>Lämna över till barnen</b> i Familjen,
        så får de välja vem som spelar. Vill du själv spela som ett barn: öppna barnet i Familjen och välj
        <b>Spela som</b>.
      </p>
      <a href="/familj" class="btn green wide">{{ L("Till Familjen", "Pere lehele") }}</a>
    </div>

    <!-- vem spelar? -->
    <div v-else-if="lookup?.ok" class="card">
      <h2 class="q">{{ L("Vem spelar?", "Kes mängib?") }}</h2>
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
        {{
          L(
            "Familjen har inga barn än. En vuxen lägger till dem på sin enhet, under Familjen.",
            "Peres pole veel lapsi. Täiskasvanu lisab nad oma seadmes pere lehel.",
          )
        }}
      </p>
      <template v-if="chosen && needsPin(chosen)">
        <label class="flabel"
          >{{ L(`${chosen.name}s PIN-kod`, `PIN-kood: ${chosen.name}`) }}
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
        /></label>
        <button class="btn green wide" :disabled="busy || pin.length < 4" @click="choose(chosen)">
          {{ L("Spela", "Mängi") }}
        </button>
      </template>
      <p v-if="cloud.isLocked" class="qsub">
        {{ L("🔒 Enheten är låst av en vuxen.", "🔒 Täiskasvanu on seadme lukustanud.") }}
        <a href="/familj">{{ L("Lås upp", "Ava lukk") }}</a>
      </p>
    </div>

    <!-- familjekod -->
    <div v-else-if="!cloud.isLocked" class="card">
      <h2 class="q">{{ L("Skriv familjekoden", "Kirjuta perekood") }}</h2>
      <p class="qsub">
        {{ L("En vuxen hittar koden i Familjen → Koder.", "Täiskasvanu leiab koodi siit: Pere → Koodid.") }}
      </p>
      <label class="flabel"
        >{{ L("Familjekod", "Perekood") }}
        <input
          v-model="code"
          class="field code"
          maxlength="7"
          autocomplete="off"
          autocapitalize="characters"
          placeholder="ABC-234"
          @keydown.enter="findFamily()"
      /></label>
      <button class="btn green big wide" :disabled="busy || !codeOk" @click="findFamily()">
        {{ L("Fortsätt", "Jätka") }}
      </button>
    </div>

    <p v-if="err" class="err" role="alert">{{ err }}</p>
    <p v-if="done" class="ok" role="status">{{ L(`Klart! Nu spelar ${done}.`, `Valmis! Nüüd mängib: ${done}.`) }}</p>
  </div>
</template>
