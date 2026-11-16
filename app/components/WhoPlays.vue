<script setup lang="ts">
/* "Vem spelar?" ovanpå spelet, på enheter där barnen spelar (barnenhet eller låst vuxen enhet):
   när spelet startar och flera spelar på enheten, och när man byter spelare. Barn med PIN-kod
   behöver den – databasen kontrollerar den (för många fel → spärr). */
const cloud = useCloudStore();
const { L } = useLang();
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
    const pre = cloud.picker.pinKey;
    if (pre !== null && !pinFor.value) pinFor.value = players.value.find(p => p.key === pre) || null;
  },
  { deep: true, immediate: true },
);

const title = computed(() => cloud.familyName || L("Familjen", "Pere"));
const untilText = (until?: string) =>
  until
    ? new Date(until).toLocaleTimeString(L("sv-SE", "et-EE"), { hour: "2-digit", minute: "2-digit" })
    : L("en stund", "natuke");

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
      r = await cloud.switchPlayer(p.key, p.pin ? pin.value : null);
    } catch {
      throw new Error(
        L(
          "PIN-koden kan bara kontrolleras när enheten har nät.",
          "PIN-koodi saab kontrollida ainult siis, kui seadmel on internet.",
        ),
      );
    }
    pin.value = "";
    if (!r.ok)
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
      <p class="kicker">{{ L("👥 Vem spelar?", "👥 Kes mängib?") }}</p>
      <p class="qsub">{{ title }}</p>
      <div class="slotgrid">
        <button
          v-for="p in players"
          :key="p.key"
          class="slotbtn"
          :class="{ on: pinFor?.key === p.key }"
          :disabled="busy"
          @click="pick(p)"
        >
          <span class="sav">{{ p.avatar }}</span>
          <b>{{ p.name || L("Namnlös", "Nimetu") }}</b>
          <small>{{ p.pin ? "🔒 PIN" : p.current ? L("spelade senast", "mängis viimati") : "" }}</small>
        </button>
        <a class="slotbtn" href="/join">
          <span class="sav">➕</span>
          <b>{{ L("Lägg till", "Lisa") }}</b>
          <small>{{ L("från familjen", "perest") }}</small>
        </a>
      </div>
      <template v-if="pinFor">
        <label class="flabel"
          >{{ L(`${pinFor.name}s PIN-kod`, `PIN-kood: ${pinFor.name}`) }}
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
        /></label>
        <button class="btn green wide" :disabled="busy || pin.length < 4" @click="play(pinFor)">
          {{ L("Spela", "Mängi") }}
        </button>
      </template>
      <p v-if="err" class="err">{{ err }}</p>
      <button v-if="!cloud.picker.mandatory" class="btn ghost wide closebtn" @click="close">
        {{ L("Stäng", "Sulge") }}
      </button>
    </div>
  </div>
</template>
