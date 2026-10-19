<script setup lang="ts">
/* Medlemssidan i Familjen: "Spela som", framsteg och – för barn – glosor, PIN, enheter, namn och
   figur. Framstegen läses ur spelet som medlemmen senast sparade; allt som spelas med "Spela som"
   räknas på medlemmen. En vuxen ändrar sitt eget namn och sin figur här, men inte någon annan vuxens. */
const props = defineProps<{ member: Member; familyId: string; me: boolean; here: "" | "now" | "device" }>();
const emit = defineEmits<{ changed: []; back: [] }>();
const cloud = useCloudStore();
const api = useParentApi();
const { busy, err, run } = useBusy();

const isChild = computed(() => props.member.kind === "child");
const name = computed(() => props.member.name || "Vuxen");

type Tab = "progress" | "lists" | "pin" | "devices" | "edit";
const tabs = computed(() =>
  (
    [
      { id: "progress", label: "Framsteg" },
      { id: "lists", label: "Glosor", child: true },
      { id: "pin", label: "PIN", child: true },
      { id: "devices", label: "Enheter", child: true },
      { id: "edit", label: "Ändra", own: true },
    ] as { id: Tab; label: string; child?: boolean; own?: boolean }[]
  ).filter(t => (t.child ? isChild.value : t.own ? isChild.value || props.me : true)),
);
const tab = ref<Tab>("progress");
function show(t: Tab) {
  tab.value = t;
  if (t === "progress") run(openProgress);
  if (t === "devices") run(openDevices);
}
onMounted(() => show("progress"));

/* ---------- spela som ---------- */
const playLabel = computed(() =>
  props.here === "now" ? "▶ Till spelet" : props.me ? "▶ Spela mitt spel" : `▶ Spela som ${name.value}`,
);
const playNote = computed(() =>
  props.here === "now"
    ? `Enheten spelar som ${name.value} just nu.`
    : props.me
      ? "Enheten byter till ditt eget spel."
      : `Enheten byter till ${name.value}s spel – det som spelas räknas på ${name.value}. Du byter tillbaka under Profil → Spelare.`,
);
const play = () =>
  run(async () => {
    if (props.here === "now") location.href = "/";
    else await cloud.playAs(props.member);
  });

/* ---------- framsteg ---------- */
const progress = ref<ChildProgress | null>(null);
const openProgress = async () => {
  progress.value = await api.progress(props.member.id);
};
const notPlayed = computed(() =>
  isChild.value
    ? `${name.value} har inte övat några ord än. Spelet syns här när ${name.value} har spelat på en enhet med familjekoden, eller när du spelar som ${name.value}.`
    : `${name.value} har inte övat några ord än.`,
);

/* ---------- namn och figur (följer med in i spelet på medlemmens enheter) ---------- */
const editName = ref(props.member.name),
  editAvatar = ref(props.member.avatar);
const saveEdit = () =>
  run(async () => {
    if (!editName.value.trim()) throw new Error("Skriv ett namn.");
    await api.updateMember(props.member.id, { name: editName.value.trim().slice(0, 40), avatar: editAvatar.value });
    emit("changed");
  });

/* ---------- PIN ---------- */
const pin = ref("");
const pinText = computed(() =>
  props.member.has_pin
    ? `${name.value} har en PIN-kod. Den behövs när ${name.value} väljs på en barnenhet eller en överlämnad enhet.`
    : `${name.value} har ingen PIN-kod – den som har familjekoden kan välja ${name.value}.`,
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
const removeDevice = (d: Device) =>
  run(async () => {
    await api.removeDevice(d.session_id, props.member.id);
    await openDevices();
  });
const deviceQuestion = (d: Device) =>
  `Ta bort ${name.value} från ”${d.label || "enheten"}”? Spelet finns kvar där men sparas inte längre.`;

/* ---------- ta bort barnet ---------- */
const removeChild = () =>
  run(async () => {
    await api.deleteChild(props.member.id);
    emit("changed");
    emit("back");
  });
const removeQuestion = computed(
  () =>
    `Ta bort ${name.value} och allt sparat i kontot (poäng, ord, glosor)? Spel som finns kvar på enheter påverkas inte.`,
);
</script>

<template>
  <div>
    <button class="back mdetail__back" @click="$emit('back')">← Familjen</button>
    <div class="card">
      <div class="childhead">
        <span class="av">{{ member.avatar }}</span>
        <span>
          <b>{{ name }}</b>
          <small>{{ me ? "Du · vuxen" : isChild ? "Barn" : "Vuxen" }}{{ member.has_pin ? " · 🔒 PIN" : "" }}</small>
        </span>
      </div>
      <button v-if="isChild || me" class="btn green wide mdetail__play" :disabled="busy" @click="play">
        {{ playLabel }}
      </button>
      <p v-if="isChild || me" class="qsub">{{ playNote }}</p>

      <div class="tabs" role="tablist" :aria-label="`${name}: visa`">
        <button
          v-for="t in tabs"
          :key="t.id"
          class="tab"
          role="tab"
          :class="{ on: tab === t.id }"
          :aria-selected="tab === t.id"
          @click="show(t.id)"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- framsteg (bara läsning) -->
      <div v-if="tab === 'progress'" class="tabbody">
        <p v-if="!progress" class="qsub">Hämtar …</p>
        <ParentProgressView v-else :progress="progress" :name="name" :empty-text="notPlayed" />
      </div>

      <!-- egna glosor -->
      <div v-if="tab === 'lists'" class="tabbody">
        <ParentWordListEditor :family-id="familyId" :member-id="member.id" :who="name" />
      </div>

      <!-- PIN -->
      <div v-if="tab === 'pin'" class="tabbody">
        <p class="qsub">{{ pinText }}</p>
        <label class="flabel"
          >Ny PIN-kod (4–8 siffror)
          <input
            v-model="pin"
            class="field code"
            type="password"
            inputmode="numeric"
            pattern="[0-9]*"
            autocomplete="new-password"
            maxlength="8"
        /></label>
        <button class="btn green wide" :disabled="busy || pin.length < 4" @click="savePin">
          {{ member.has_pin ? "Byt PIN-kod" : "Sätt PIN-kod" }}
        </button>
        <button v-if="member.has_pin" class="btn ghost wide" :disabled="busy" @click="removePin">
          Ta bort PIN-koden
        </button>
      </div>

      <!-- enheter -->
      <div v-if="tab === 'devices'" class="tabbody">
        <div v-for="d in devices" :key="d.session_id" class="devrow">
          <span>
            📱 {{ d.label || "Enhet" }}
            <small class="qsub">sedan {{ new Date(d.created_at).toLocaleDateString("sv-SE") }}</small>
          </span>
          <ConfirmAction
            label="Ta bort"
            :question="deviceQuestion(d)"
            yes="Ja, ta bort"
            danger
            :busy="busy"
            @confirm="removeDevice(d)"
          />
        </div>
        <p v-if="!devices.length" class="qsub">
          {{ name }} spelar inte på någon enhet än. Skriv familjekoden på enheten och välj {{ name }}, eller skicka
          {{ name }}s egen länk (Koder).
        </p>
      </div>

      <!-- namn och figur -->
      <div v-if="tab === 'edit'" class="tabbody">
        <label class="flabel">Namn <input v-model="editName" class="field" type="text" maxlength="40" /></label>
        <AvatarPicker v-model="editAvatar" />
        <button class="btn green wide" :disabled="busy" @click="saveEdit">Spara</button>
        <p v-if="isChild" class="qsub">
          Det nya namnet och figuren syns i spelet nästa gång {{ name }}s enheter öppnar appen.
        </p>
        <div v-if="isChild" class="dangerzone">
          <ConfirmAction
            :label="`Ta bort ${name} från familjen`"
            :question="removeQuestion"
            yes="Ja, ta bort"
            danger
            wide
            :busy="busy"
            @confirm="removeChild"
          />
        </div>
      </div>

      <p v-if="err" class="err" role="alert">{{ err }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mdetail {
  &__back {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    margin-top: $spacing-2;
    padding: 0;
    border: none;
    background: none;
    color: var(--muted);
    font: inherit;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      color: var(--ink);
    }
  }

  &__play {
    margin-top: $spacing-3;
  }
}
</style>
