<script setup lang="ts">
/* En egen länk (och QR-kod) per barn: öppnas den på barnets enhet hoppar den över "Vem spelar?" och
   går direkt till barnet – PIN-koden behövs fortfarande om barnet har en. */
const props = defineProps<{ family: Family; children: Member[] }>();
const open = ref<string | null>(null),
  qr = ref(""),
  copied = ref<string | null>(null);

const urlFor = (m: Member) => `${location.origin}/join?kod=${props.family.child_code}&barn=${m.id}`;
async function toggle(m: Member) {
  open.value = open.value === m.id ? null : m.id;
  if (open.value) qr.value = await QRCode.toString(urlFor(m), { type: "svg", margin: 1, width: 160 });
}
async function copy(m: Member) {
  try {
    await navigator.clipboard.writeText(urlFor(m));
    copied.value = m.id;
  } catch {
    /* QR-koden fungerar ändå */
  }
}
</script>

<template>
  <div class="card">
    <h2 class="q">Barnens egna länkar</h2>
    <p class="qsub">
      Öppna länken på barnets enhet (eller skanna QR-koden) så spelar barnet direkt – utan att skriva familjekoden.
    </p>
    <div v-for="m in children" :key="m.id" class="clinks__row">
      <div class="devrow">
        <span>{{ m.avatar }} {{ m.name }}</span>
        <span class="clinks__btns">
          <button class="btn ghost" @click="copy(m)">{{ copied === m.id ? "Kopierad ✓" : "Kopiera" }}</button>
          <button class="btn ghost" :aria-expanded="open === m.id" @click="toggle(m)">QR</button>
        </span>
      </div>
      <!-- SVG som QR-biblioteket ritar från appens egen adress -->
      <div v-if="open === m.id" class="qr" v-html="qr" />
    </div>
    <p v-if="!children.length" class="qsub">Lägg till ett barn först.</p>
  </div>
</template>

<style lang="scss" scoped>
.clinks {
  &__btns {
    display: flex;
    gap: $spacing-1;
  }
}
</style>
