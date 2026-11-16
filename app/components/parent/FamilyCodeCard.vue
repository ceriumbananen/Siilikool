<script setup lang="ts">
/* Familjekoden som barnen skriver (eller skannar) på sina enheter. Kan bytas; enheter som redan
   valt ett barn påverkas inte, men nya enheter behöver den nya koden. */
const props = defineProps<{ family: Family }>();
const emit = defineEmits<{ rotated: [] }>();
const api = useParentApi();
const { L, isEt } = useLang();
const { busy, err, run } = useBusy();

const pretty = computed(() => props.family.child_code.slice(0, 3) + "-" + props.family.child_code.slice(3));
const joinUrl = computed(() => `${location.origin}/join?kod=${props.family.child_code}`);
const qr = ref("");
watchEffect(async () => {
  qr.value = await QRCode.toString(joinUrl.value, { type: "svg", margin: 1, width: 180 });
});

const rotate = () =>
  run(async () => {
    await api.rotateCode();
    emit("rotated");
  });
</script>

<template>
  <div class="card">
    <h2 class="q">{{ L("Familjekod", "Perekood") }}</h2>
    <p v-if="isEt()" class="qsub">
      Lapse seadmes: vali avaekraanil <b>Oled laps ja sul on perekood?</b> (või <b>Profiil → Pere</b>), kirjuta kood ja
      vali, kes mängib. Või skanni QR-kood.
    </p>
    <p v-else class="qsub">
      På barnets enhet: välj <b>Är du ett barn med en familjekod?</b> på startskärmen (eller <b>Profil → Familj</b>),
      skriv koden och välj vem som spelar. Eller skanna QR-koden.
    </p>
    <div class="pair">{{ pretty }}</div>
    <!-- SVG som QR-biblioteket ritar från appens egen adress -->
    <div class="qr" v-html="qr" />
    <ConfirmAction
      :label="L('Byt familjekod', 'Vaheta perekood')"
      :question="
        L(
          'Enheter som redan valt ett barn påverkas inte, men nya enheter behöver den nya koden.',
          'See ei mõjuta seadmeid, kus laps on juba valitud, aga uued seadmed vajavad uut koodi.',
        )
      "
      :yes="L('Byt koden', 'Vaheta kood')"
      wide
      :busy="busy"
      @confirm="rotate"
    />
    <p v-if="err" class="err" role="alert">{{ err }}</p>
  </div>
</template>
