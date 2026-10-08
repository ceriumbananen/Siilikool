<script setup lang="ts">
/* "Vem spelar?" ovanpå spelet, på enheter där barnen spelar (barnenhet eller låst vuxen enhet):
   när spelet startar och flera spelar på enheten, och när man byter spelare. Barn med PIN-kod
   behöver den – databasen kontrollerar den (för många fel → spärr). */
const cloud = useCloudStore();
const { busy, err, run } = useBusy();

const players = ref<DevicePlayer[]>([]);
const pinFor = ref<DevicePlayer | null>(null);
const pin = ref("");
const pinInput = ref<HTMLInputElement | null>(null);

/* spelarna läses när rutan öppnas (och igen när PIN-koderna hämtats) */
watch(
  () => [cloud.picker.open, cloud.links],
  () => {
    if (!cloud.picker.open) return;
    players.value = cloud.devicePlayers();
    const pre = cloud.picker.pinSlot;
    if (pre !== null && !pinFor.value) pinFor.value = players.value.find(p => p.slot === pre) || null;
  },
  { deep: true, immediate: true },
);

const canAdd = computed(() => cloud.freeSlot() !== null);
const title = computed(() => cloud.familyName || "Familjen");
const untilText = (until?: string) =>
  until ? new Date(until).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }) : "en stund";

async function pick(p: DevicePlayer) {
  err.value = "";
  pin.value = "";
  if (p.pin) {
    pinFor.value = p;
    await nextTick();
    pinInput.value?.focus();
    return;
  }
  pinFor.value = null;
  await play(p);
}

const play = (p: DevicePlayer) =>
  run(async () => {
    let r;
    try {
      r = await cloud.switchPlayer(p.slot, p.pin ? pin.value : null);
    } catch {
      throw new Error("PIN-koden kan bara kontrolleras när enheten har nät.");
    }
    pin.value = "";
    if (!r.ok)
      throw new Error(
        r.error === "wrong_pin"
          ? "Fel PIN-kod. Försök igen."
          : r.error === "locked"
            ? `För många fel försök. Vänta till ${untilText(r.until)}.`
            : "Det gick inte. Fråga en vuxen.",
      );
  });

function close() {
  pinFor.value = null;
  pin.value = "";
  err.value = "";
  cloud.closePicker();
}
</script>

<template>
  <div v-if="cloud.picker.open" class="overlay page whoplays">
    <div class="oc">
      <p class="kicker">👥 Vem spelar?</p>
      <p class="qsub">{{ title }}</p>
      <div class="slotgrid">
        <button
          v-for="p in players"
          :key="p.slot"
          class="slotbtn"
          :class="{ on: pinFor?.slot === p.slot }"
          :disabled="busy"
          @click="pick(p)"
        >
          <span class="sav">{{ p.avatar }}</span>
          <b>{{ p.name || "Namnlös" }}</b>
          <small>{{ p.pin ? "🔒 PIN" : p.current ? "spelade senast" : "" }}</small>
        </button>
        <a v-if="canAdd" class="slotbtn" href="/join">
          <span class="sav">➕</span>
          <b>Lägg till</b>
          <small>från familjen</small>
        </a>
      </div>
      <template v-if="pinFor">
        <p class="qsub" style="margin-top: 12px">{{ pinFor.name }}s PIN-kod</p>
        <input
          ref="pinInput"
          v-model="pin"
          class="field code"
          type="password"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="off"
          maxlength="8"
          placeholder="••••"
          @keydown.enter="play(pinFor)"
        />
        <button class="btn green wide" :disabled="busy || pin.length < 4" @click="play(pinFor)">Spela</button>
      </template>
      <p v-if="err" class="err">{{ err }}</p>
      <button v-if="!cloud.picker.mandatory" class="btn ghost wide" style="margin-top: 12px" @click="close">
        Stäng
      </button>
    </div>
  </div>
</template>
