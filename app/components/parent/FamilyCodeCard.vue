<script setup lang="ts">
/* Familjekoden som barnen skriver (eller skannar) på sina enheter. Kan bytas; enheter som redan
   valt ett barn påverkas inte, men nya enheter behöver den nya koden. */
const props = defineProps<{ family: Family }>();
const emit = defineEmits<{ rotated: [] }>();
const api = useParentApi();
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
    <h2 class="q">Familjekod</h2>
    <p class="qsub">
      På barnets enhet: välj <b>Är du ett barn med en familjekod?</b> på startskärmen (eller <b>Profil → Familj</b>),
      skriv koden och välj vem som spelar. Eller skanna QR-koden.
    </p>
    <div class="pair">{{ pretty }}</div>
    <!-- SVG som QR-biblioteket ritar från appens egen adress -->
    <div class="qr" v-html="qr" />
    <ConfirmAction
      label="Byt familjekod"
      question="Enheter som redan valt ett barn påverkas inte, men nya enheter behöver den nya koden."
      yes="Byt koden"
      wide
      :busy="busy"
      @confirm="rotate"
    />
    <p v-if="err" class="err" role="alert">{{ err }}</p>
  </div>
</template>
