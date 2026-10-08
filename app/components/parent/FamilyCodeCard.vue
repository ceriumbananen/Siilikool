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

async function rotate() {
  if (
    !confirm("Byta familjekod? Enheter som redan valt ett barn påverkas inte, men nya enheter behöver den nya koden.")
  )
    return;
  await run(async () => {
    await api.rotateCode();
    emit("rotated");
  });
}
</script>

<template>
  <div class="card">
    <p class="q" style="text-align: left">Familjekod</p>
    <p class="qsub" style="text-align: left">
      På barnets enhet: <b>Profil → Familj</b>, skriv koden och välj vem som spelar. Eller skanna QR-koden.
    </p>
    <div class="pair">{{ pretty }}</div>
    <!-- SVG som QR-biblioteket ritar från appens egen adress -->
    <div class="qr" v-html="qr" />
    <button class="btn ghost wide" :disabled="busy" @click="rotate">Byt familjekod</button>
    <p v-if="err" class="err">{{ err }}</p>
  </div>
</template>
