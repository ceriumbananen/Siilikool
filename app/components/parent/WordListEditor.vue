<script setup lang="ts">
/* Glosor för ett barn (memberId) eller för alla barn (memberId null). Den senaste listan gäller;
   en ny lista ersätter den gamla nästa gång barnens enheter öppnar appen. */
const props = defineProps<{ familyId: string; memberId: string | null; who: string }>();
const api = useParentApi();
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
  return `${list.value.words.length} ord · ${left > 0 ? left + " dagar kvar" : "har gått ut"}`;
});
const badText = computed(() =>
  parsed.value.bad.length ? ` · ${parsed.value.bad.length} rader går inte att läsa` : "",
);

const load = () =>
  run(async () => {
    list.value = await api.latestList(props.memberId);
  });
const save = () =>
  run(async () => {
    if (!parsed.value.words.length) throw new Error("Hittade inga ordpar. Skriv ett ord per rad: estniska = svenska.");
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
      <h3 class="sub">Gäller nu: {{ list.name }}</h3>
      <p class="qsub">{{ daysText }}</p>
      <ul class="wlist">
        <li v-for="w in list.words" :key="w.et">
          <b lang="et">{{ w.et }}</b> = {{ w.sv }}
        </li>
      </ul>
      <ConfirmAction
        label="Ta bort listan"
        :question="`Ta bort ”${list.name}”? Den försvinner nästa gång appen öppnas.`"
        yes="Ja, ta bort"
        danger
        :busy="busy"
        @confirm="remove"
      />
    </template>
    <p v-else class="qsub">Inga glosor just nu.</p>

    <h3 class="sub">Nya glosor för {{ who }}</h3>
    <p class="qsub">Ett ord per rad: <b>estniska = svenska</b>. Den nya listan ersätter den gamla.</p>
    <label class="flabel"
      >Listans namn <input v-model="listName" class="field" type="text" placeholder="t.ex. Vecka 41" maxlength="40"
    /></label>
    <label class="flabel"
      >Glosor <textarea v-model="listText" class="schooltext field" rows="7" placeholder="koer = hund&#10;maja = hus" />
    </label>
    <label class="flabel inline">
      Gäller i
      <input v-model.number="listDays" class="field days" type="number" min="3" max="60" />
      dagar
    </label>
    <p class="qsub">{{ parsed.words.length }} ord{{ badText }}</p>
    <button class="btn green wide" :disabled="busy || !parsed.words.length" @click="save">Skicka till {{ who }}</button>
    <p v-if="err" class="err" role="alert">{{ err }}</p>
  </div>
</template>
