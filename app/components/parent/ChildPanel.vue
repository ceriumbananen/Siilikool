<script setup lang="ts">
/* Ett barn i föräldraläget: framsteg, läxlistan, kopplade enheter och borttagning.
   Föräldern läser bara barnets spel – förälderns eget spel på enheten rörs aldrig. */

const props = defineProps<{ child: Child }>();
const emit = defineEmits<{ removed: [] }>();
const api = useParentApi();

const tab = ref<"" | "progress" | "lists" | "devices">("");
const err = ref("");
const busy = ref(false);

async function run(fn: () => Promise<void>) {
  err.value = "";
  busy.value = true;
  try {
    await fn();
  } catch (e) {
    err.value = e instanceof Error ? e.message : String(e);
  } finally {
    busy.value = false;
  }
}

/* ---------- framsteg ---------- */
const progress = ref<ChildProgress | null>(null);
const schoolKnown = computed(() => progress.value?.school?.words.filter(w => w.known).length ?? 0);
/* i skriptet i stället för i mallen – långa uttryck i {{ }} bryts annars fel av Prettier */
const schoolDays = computed(() => {
  const d = progress.value?.school?.daysLeft ?? 0;
  return d > 0 ? `${d} dagar kvar` : "Listan har gått ut";
});
async function openProgress() {
  tab.value = "progress";
  await run(async () => {
    progress.value = await api.progress(props.child.id);
  });
}

/* ---------- läxor ---------- */
const list = ref<SchoolList | null>(null);
const listName = ref(""),
  listText = ref(""),
  listDays = ref(14);
const parsed = computed(() => parseWordList(listText.value));
const daysLeft = computed(() => {
  if (!list.value) return 0;
  const added = Math.floor(new Date(list.value.created_at).getTime() / 86400000);
  return added + list.value.days - Math.floor(Date.now() / 86400000);
});
async function openLists() {
  tab.value = "lists";
  await run(async () => {
    list.value = await api.latestList(props.child.id);
  });
}
async function saveList() {
  await run(async () => {
    if (!parsed.value.words.length) throw new Error("Hittade inga ordpar. Skriv ett ord per rad: estniska = svenska.");
    await api.createList(
      props.child.id,
      listName.value,
      parsed.value.words,
      Math.max(3, Math.min(60, listDays.value || 14)),
    );
    listName.value = "";
    listText.value = "";
    list.value = await api.latestList(props.child.id);
  });
}
async function removeList() {
  if (
    !list.value ||
    !confirm(
      `Ta bort listan "${list.value.name}"? Den försvinner från ${props.child.name}s enhet nästa gång appen öppnas.`,
    )
  )
    return;
  await run(async () => {
    await api.deleteList(list.value!.id);
    list.value = await api.latestList(props.child.id);
  });
}

/* ---------- enheter ---------- */
const devices = ref<Device[]>([]);
const code = ref(""),
  codeUntil = ref(0),
  now = ref(Date.now());
const tick = setInterval(() => {
  now.value = Date.now();
}, 1000);
onUnmounted(() => clearInterval(tick));
const kopplaUrl = location.host + "/connect";
const codeLeft = computed(() => Math.max(0, Math.round((codeUntil.value - now.value) / 1000)));
/* i skriptet i stället för i mallen – långa uttryck i {{ }} bryts annars fel av Prettier */
const codeButton = computed(() => (code.value && codeLeft.value > 0 ? "Ny kod" : "Skapa kod för att koppla en enhet"));
async function openDevices() {
  tab.value = "devices";
  await run(async () => {
    devices.value = await api.devices(props.child.id);
  });
}
async function makeCode() {
  await run(async () => {
    code.value = await api.pairCode(props.child.id);
    codeUntil.value = Date.now() + 10 * 60 * 1000;
  });
}
async function removeDevice(d: Device) {
  if (!confirm(`Koppla bort "${d.label || "enheten"}"? Spelet finns kvar på enheten men sparas inte längre i kontot.`))
    return;
  await run(async () => {
    await api.removeDevice(d.device_user);
    devices.value = await api.devices(props.child.id);
  });
}

/* ---------- barnet ---------- */
async function removeChild() {
  if (
    !confirm(
      `Ta bort ${props.child.name} och allt sparat i kontot (poäng, ord, läxor)? Spel som finns kvar på enheter påverkas inte.`,
    )
  )
    return;
  await run(async () => {
    await api.deleteChild(props.child.id);
    emit("removed");
  });
}
const lastSeen = computed(() =>
  new Date(props.child.updated_at).toLocaleDateString("sv-SE", { day: "numeric", month: "short" }),
);
</script>

<template>
  <div class="card">
    <div class="childhead">
      <span class="av">{{ child.avatar }}</span>
      <span>
        <b>{{ child.name }}</b>
        <small>⭐ {{ child.stars ?? 0 }} · senast sparat {{ lastSeen }}</small>
      </span>
    </div>
    <div class="tabs">
      <button
        class="btn ghost"
        :class="{ green: tab === 'progress' }"
        @click="tab === 'progress' ? (tab = '') : openProgress()"
      >
        📊 Framsteg
      </button>
      <button class="btn ghost" :class="{ green: tab === 'lists' }" @click="tab === 'lists' ? (tab = '') : openLists()">
        📝 Läxor
      </button>
      <button
        class="btn ghost"
        :class="{ green: tab === 'devices' }"
        @click="tab === 'devices' ? (tab = '') : openDevices()"
      >
        🔗 Enheter
      </button>
    </div>

    <!-- framsteg (bara läsning) -->
    <div v-if="tab === 'progress'" style="text-align: left; margin-top: 12px">
      <p v-if="!progress" class="qsub">Hämtar …</p>
      <template v-else>
        <div class="stats">
          <div class="stat">
            <b>{{ progress.words.strong }}</b
            ><span>ord som sitter</span>
          </div>
          <div class="stat">
            <b>{{ progress.words.shaky }}</b
            ><span>ord som vacklar</span>
          </div>
          <div class="stat">
            <b>{{ progress.correct }}</b
            ><span>rätta svar</span>
          </div>
        </div>
        <p class="qsub">
          ⭐ {{ progress.stars }} stjärnor · {{ progress.xp }} poäng · {{ progress.lessons }} lektioner ·
          {{ progress.badges }} märken
        </p>

        <template v-if="progress.school">
          <p class="kicker" style="margin-top: 12px">
            Läxor: {{ progress.school.name }} – {{ schoolKnown }} av {{ progress.school.words.length }} sitter
          </p>
          <p class="qsub">{{ schoolDays }}</p>
          <ul class="wlist">
            <li v-for="w in progress.school.words" :key="w.et">
              {{ w.known ? "✅" : "⏳" }} <b lang="et">{{ w.et }}</b> = {{ w.sv }}
            </li>
          </ul>
        </template>
        <p v-if="progress.doneLists" class="qsub">{{ progress.doneLists }} tidigare läxlistor klara.</p>

        <template v-if="progress.hard.length">
          <p class="kicker" style="margin-top: 12px">Svårast just nu</p>
          <ul class="wlist">
            <li v-for="h in progress.hard" :key="h.et">
              <b lang="et">{{ h.et }}</b> <small class="qsub">{{ h.misses }} fel</small>
            </li>
          </ul>
        </template>

        <p v-if="!progress.words.practiced" class="qsub">
          {{ child.name }} har inte övat några ord än. Spelet syns här när {{ child.name }}s enhet är kopplad.
        </p>
      </template>
    </div>

    <!-- läxor -->
    <div v-if="tab === 'lists'" style="text-align: left; margin-top: 12px">
      <template v-if="list">
        <p class="kicker">Gäller nu: {{ list.name }}</p>
        <p class="qsub">{{ list.words.length }} ord · {{ daysLeft > 0 ? daysLeft + " dagar kvar" : "har gått ut" }}</p>
        <ul class="wlist">
          <li v-for="w in list.words" :key="w.et">
            <b lang="et">{{ w.et }}</b> = {{ w.sv }}
          </li>
        </ul>
        <button class="btn ghost" :disabled="busy" @click="removeList">Ta bort listan</button>
      </template>
      <p v-else class="qsub">Ingen läxlista just nu.</p>

      <p class="q" style="text-align: left; margin-top: 14px">Ny läxlista</p>
      <p class="qsub">
        Ett ord per rad: <b>estniska = svenska</b>. Den nya listan ersätter den gamla på {{ child.name }}s enhet.
      </p>
      <input v-model="listName" class="field" type="text" placeholder="Namn, t.ex. Vecka 41" maxlength="40" />
      <textarea
        v-model="listText"
        class="schooltext field"
        rows="7"
        placeholder="koer = hund&#10;maja = hus&#10;punane = röd"
      />
      <label class="qsub"
        >Gäller i
        <input
          v-model.number="listDays"
          class="field"
          type="number"
          min="3"
          max="60"
          style="width: 90px; display: inline-block"
        />
        dagar</label
      >
      <p class="qsub">
        {{ parsed.words.length }} ord<span v-if="parsed.bad.length">
          · {{ parsed.bad.length }} rader går inte att läsa</span
        >
      </p>
      <button class="btn green wide" :disabled="busy || !parsed.words.length" @click="saveList">
        Skicka till {{ child.name }}
      </button>
    </div>

    <!-- enheter -->
    <div v-if="tab === 'devices'" style="text-align: left; margin-top: 12px">
      <div v-for="d in devices" :key="d.device_user" class="devrow">
        <span
          >📱 {{ d.label || "Enhet" }}
          <small class="qsub">sedan {{ new Date(d.created_at).toLocaleDateString("sv-SE") }}</small></span
        >
        <button class="btn ghost" :disabled="busy" @click="removeDevice(d)">Koppla bort</button>
      </div>
      <p v-if="!devices.length" class="qsub">Ingen enhet kopplad än.</p>

      <template v-if="code && codeLeft > 0">
        <p class="qsub" style="margin-top: 12px">
          Skriv koden på {{ child.name }}s enhet: <b>Siilikool → Profil → Koppla till förälder</b> (eller gå till
          <b>{{ kopplaUrl }}</b
          >).
        </p>
        <div class="pair">{{ code }}</div>
        <p class="qsub" style="text-align: center">
          Gäller {{ Math.floor(codeLeft / 60) }}:{{ String(codeLeft % 60).padStart(2, "0") }} till, och bara en gång.
        </p>
      </template>
      <button class="btn green wide" :disabled="busy" @click="makeCode">
        {{ codeButton }}
      </button>
    </div>

    <p v-if="err" class="err">{{ err }}</p>
    <button v-if="tab" class="btn ghost wide" style="margin-top: 14px" :disabled="busy" @click="removeChild">
      Ta bort {{ child.name }} från kontot
    </button>
  </div>
</template>
