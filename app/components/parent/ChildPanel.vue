<script setup lang="ts">
/* Ett barn i föräldraläget: framsteg, egna glosor, namn och figur, PIN, enheter och borttagning.
   De vuxna läser bara barnets spel – deras eget spel rörs aldrig. */
const props = defineProps<{ member: Member; familyId: string }>();
const emit = defineEmits<{ changed: [] }>();
const api = useParentApi();
const { busy, err, run } = useBusy();

const tab = ref<"" | "progress" | "lists" | "edit" | "pin" | "devices">("");
const toggle = (t: typeof tab.value, open?: () => Promise<void>) => {
  tab.value = tab.value === t ? "" : t;
  if (tab.value && open) run(open);
};

/* ---------- framsteg ---------- */
const progress = ref<ChildProgress | null>(null);
const schoolKnown = computed(() => progress.value?.school?.words.filter(w => w.known).length ?? 0);
/* texterna ligger i skriptet i stället för i mallen – långa uttryck i {{ }} bryts annars fel av Prettier */
const schoolDays = computed(() => {
  const d = progress.value?.school?.daysLeft ?? 0;
  return d > 0 ? `${d} dagar kvar` : "Listan har gått ut";
});
const openProgress = async () => {
  progress.value = await api.progress(props.member.id);
};

/* ---------- namn och figur (följer med in i spelet på barnets enheter) ---------- */
const editName = ref(props.member.name),
  editAvatar = ref(props.member.avatar);
const saveEdit = () =>
  run(async () => {
    if (!editName.value.trim()) throw new Error("Skriv barnets namn.");
    await api.updateMember(props.member.id, { name: editName.value.trim().slice(0, 40), avatar: editAvatar.value });
    emit("changed");
  });

/* ---------- PIN ---------- */
const pin = ref("");
const pinText = computed(() =>
  props.member.has_pin
    ? `${props.member.name} har en PIN-kod. Den behövs när ${props.member.name} väljs på en ny enhet.`
    : `${props.member.name} har ingen PIN-kod – den som har familjekoden kan välja ${props.member.name}.`,
);
const savePin = () =>
  run(async () => {
    if (!/^[0-9]{4,8}$/.test(pin.value)) throw new Error("PIN-koden ska vara 4–8 siffror.");
    await api.setChildPin(props.member.id, pin.value);
    pin.value = "";
    emit("changed");
  });
const removePin = () =>
  run(async () => {
    await api.setChildPin(props.member.id, null);
    emit("changed");
  });

/* ---------- enheter ---------- */
const devices = ref<Device[]>([]);
const openDevices = async () => {
  devices.value = await api.devices(props.member.id);
};
async function removeDevice(d: Device) {
  if (
    !confirm(
      `Ta bort ${props.member.name} från "${d.label || "enheten"}"? Spelet finns kvar där men sparas inte längre.`,
    )
  )
    return;
  await run(async () => {
    await api.removeDevice(d.session_id, props.member.id);
    await openDevices();
  });
}

/* ---------- barnet ---------- */
async function removeChild() {
  if (
    !confirm(
      `Ta bort ${props.member.name} och allt sparat i kontot (poäng, ord, glosor)? Spel som finns kvar på enheter påverkas inte.`,
    )
  )
    return;
  await run(async () => {
    await api.deleteChild(props.member.id);
    emit("changed");
  });
}
const lastSeen = computed(() =>
  new Date(props.member.updated_at).toLocaleDateString("sv-SE", { day: "numeric", month: "short" }),
);
</script>

<template>
  <div class="card">
    <div class="childhead">
      <span class="av">{{ member.avatar }}</span>
      <span>
        <b>{{ member.name }}</b>
        <small>⭐ {{ member.stars ?? 0 }} · senast sparat {{ lastSeen }}{{ member.has_pin ? " · 🔒 PIN" : "" }}</small>
      </span>
    </div>
    <div class="tabs">
      <button class="btn ghost" :class="{ green: tab === 'progress' }" @click="toggle('progress', openProgress)">
        📊 Framsteg
      </button>
      <button class="btn ghost" :class="{ green: tab === 'lists' }" @click="toggle('lists')">📝 Glosor</button>
      <button class="btn ghost" :class="{ green: tab === 'edit' }" @click="toggle('edit')">✏️ Ändra</button>
      <button class="btn ghost" :class="{ green: tab === 'pin' }" @click="toggle('pin')">🔒 PIN</button>
      <button class="btn ghost" :class="{ green: tab === 'devices' }" @click="toggle('devices', openDevices)">
        📱 Enheter
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
            Glosor: {{ progress.school.name }} – {{ schoolKnown }} av {{ progress.school.words.length }} sitter
          </p>
          <p class="qsub">{{ schoolDays }}</p>
          <ul class="wlist">
            <li v-for="w in progress.school.words" :key="w.et">
              {{ w.known ? "✅" : "⏳" }} <b lang="et">{{ w.et }}</b> = {{ w.sv }}
            </li>
          </ul>
        </template>
        <p v-if="progress.doneLists" class="qsub">{{ progress.doneLists }} tidigare glosor klara.</p>
        <template v-if="progress.hard.length">
          <p class="kicker" style="margin-top: 12px">Svårast just nu</p>
          <ul class="wlist">
            <li v-for="h in progress.hard" :key="h.et">
              <b lang="et">{{ h.et }}</b> <small class="qsub">{{ h.misses }} fel</small>
            </li>
          </ul>
        </template>
        <p v-if="!progress.words.practiced" class="qsub">
          {{ member.name }} har inte övat några ord än. Spelet syns här när {{ member.name }} har spelat på en enhet med
          familjekoden.
        </p>
      </template>
    </div>

    <!-- egna glosor -->
    <div v-if="tab === 'lists'" style="margin-top: 12px">
      <ParentWordListEditor :family-id="familyId" :member-id="member.id" :who="member.name" />
    </div>

    <!-- namn och figur -->
    <div v-if="tab === 'edit'" style="text-align: left; margin-top: 12px">
      <input v-model="editName" class="field" type="text" maxlength="40" placeholder="Barnets namn" />
      <AvatarPicker v-model="editAvatar" />
      <button class="btn green wide" :disabled="busy" @click="saveEdit">Spara</button>
      <p class="qsub">Det nya namnet och figuren syns i spelet nästa gång {{ member.name }}s enheter öppnar appen.</p>
    </div>

    <!-- PIN -->
    <div v-if="tab === 'pin'" style="text-align: left; margin-top: 12px">
      <p class="qsub">{{ pinText }}</p>
      <input
        v-model="pin"
        class="field code"
        type="password"
        inputmode="numeric"
        pattern="[0-9]*"
        autocomplete="new-password"
        maxlength="8"
        placeholder="4–8 siffror"
      />
      <button class="btn green wide" :disabled="busy || pin.length < 4" @click="savePin">
        {{ member.has_pin ? "Byt PIN-kod" : "Sätt PIN-kod" }}
      </button>
      <button v-if="member.has_pin" class="btn ghost wide" :disabled="busy" @click="removePin">
        Ta bort PIN-koden
      </button>
    </div>

    <!-- enheter -->
    <div v-if="tab === 'devices'" style="text-align: left; margin-top: 12px">
      <div v-for="d in devices" :key="d.session_id" class="devrow">
        <span>
          📱 {{ d.label || "Enhet" }}
          <small class="qsub">sedan {{ new Date(d.created_at).toLocaleDateString("sv-SE") }}</small>
        </span>
        <button class="btn ghost" :disabled="busy" @click="removeDevice(d)">Ta bort</button>
      </div>
      <p v-if="!devices.length" class="qsub">
        {{ member.name }} spelar inte på någon enhet än. Skriv familjekoden på enheten och välj {{ member.name }}.
      </p>
    </div>

    <p v-if="err" class="err">{{ err }}</p>
    <button v-if="tab" class="btn ghost wide" style="margin-top: 14px" :disabled="busy" @click="removeChild">
      Ta bort {{ member.name }} från familjen
    </button>
  </div>
</template>
