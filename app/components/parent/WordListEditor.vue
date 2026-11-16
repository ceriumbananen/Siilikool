<script setup lang="ts">
/* Glosor för ett barn (memberId) eller för alla barn (memberId null). Den senaste listan gäller;
   en ny lista ersätter den gamla nästa gång barnens enheter öppnar appen. */
const props = defineProps<{ familyId: string; memberId: string | null; who: string }>();
const api = useParentApi();
const { L, isEt } = useLang();
const { busy, err, run } = useBusy();

const list = ref<WordList | null>(null);
const listName = ref(""),
  listText = ref(""),
  listDays = ref(14);
const parsed = computed(() => parseWordList(listText.value));

/* i skriptet i stället för i mallen – långa uttryck i {{ }} bryts annars fel av Prettier */
const daysText = computed(() => {
  if (!list.value) return "";
  const added = Math.floor(new Date(list.value.created_at).getTime() / 86400000);
  const left = added + list.value.days - Math.floor(Date.now() / 86400000);
  return isEt()
    ? `${list.value.words.length} sõna · ${left > 0 ? left + " päeva jäänud" : "aegunud"}`
    : `${list.value.words.length} ord · ${left > 0 ? left + " dagar kvar" : "har gått ut"}`;
});
const badText = computed(() =>
  parsed.value.bad.length
    ? L(` · ${parsed.value.bad.length} rader går inte att läsa`, ` · loetamatuid ridu: ${parsed.value.bad.length}`)
    : "",
);

const load = () =>
  run(async () => {
    list.value = await api.latestList(props.memberId);
  });
const save = () =>
  run(async () => {
    if (!parsed.value.words.length)
      throw new Error(
        L(
          "Hittade inga ordpar. Skriv ett ord per rad: estniska = svenska.",
          "Sõnapaare ei leitud. Kirjuta üks sõnapaar rea kohta: eesti keeles = rootsi keeles.",
        ),
      );
    await api.createList(
      props.familyId,
      props.memberId,
      listName.value,
      parsed.value.words,
      Math.max(3, Math.min(60, listDays.value || 14)),
    );
    listName.value = "";
    listText.value = "";
    list.value = await api.latestList(props.memberId);
  });
const remove = () =>
  run(async () => {
    if (!list.value) return;
    await api.deleteList(list.value.id);
    list.value = await api.latestList(props.memberId);
  });
onMounted(load);
</script>

<template>
  <div>
    <template v-if="list">
      <h3 class="sub">{{ L("Gäller nu:", "Praegu kehtib:") }} {{ list.name }}</h3>
      <p class="qsub">{{ daysText }}</p>
      <ul class="wlist">
        <li v-for="w in list.words" :key="w.et">
          <b lang="et">{{ w.et }}</b> = {{ w.sv }}
        </li>
      </ul>
      <ConfirmAction
        :label="L('Ta bort listan', 'Kustuta loend')"
        :question="
          L(
            `Ta bort ”${list.name}”? Den försvinner nästa gång appen öppnas.`,
            `Kas kustutada „${list.name}”? See kaob, kui äpp järgmine kord avatakse.`,
          )
        "
        :yes="L('Ja, ta bort', 'Jah, kustuta')"
        danger
        :busy="busy"
        @confirm="remove"
      />
    </template>
    <p v-else class="qsub">{{ L("Inga glosor just nu.", "Praegu koolisõnu pole.") }}</p>

    <h3 class="sub">{{ L(`Nya glosor för ${who}`, `Uued koolisõnad – ${who}`) }}</h3>
    <p v-if="isEt()" class="qsub">
      Üks sõnapaar rea kohta: <b>eesti keeles = rootsi keeles</b>. Laps õpib rootsikeelset sõna, eestikeelne on
      tähendus. Uus loend asendab vana.
    </p>
    <p v-else class="qsub">Ett ord per rad: <b>estniska = svenska</b>. Den nya listan ersätter den gamla.</p>
    <label class="flabel"
      >{{ L("Listans namn", "Loendi nimi") }}
      <input
        v-model="listName"
        class="field"
        type="text"
        :placeholder="L('t.ex. Vecka 41', 'nt Nädal 41')"
        maxlength="40"
    /></label>
    <label class="flabel"
      >{{ L("Glosor", "Koolisõnad") }}
      <textarea v-model="listText" class="schooltext field" rows="7" placeholder="koer = hund&#10;maja = hus" />
    </label>
    <label class="flabel inline">
      {{ L("Gäller i", "Kehtib") }}
      <input v-model.number="listDays" class="field days" type="number" min="3" max="60" />
      {{ L("dagar", "päeva") }}
    </label>
    <p class="qsub">{{ parsed.words.length }} {{ L("ord", "sõna") }}{{ badText }}</p>
    <button class="btn green wide" :disabled="busy || !parsed.words.length" @click="save">
      {{ L(`Skicka till ${who}`, `Saada: ${who}`) }}
    </button>
    <p v-if="err" class="err" role="alert">{{ err }}</p>
  </div>
</template>
