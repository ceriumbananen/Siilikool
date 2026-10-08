<script setup lang="ts">
/* Den vuxnas eget spel: spelaren som spelas på den här enheten kan sparas i familjekontot, och följer
   då med till den vuxnas andra enheter. Barnen ser det inte. */
const cloud = useCloudStore();
const profile = useProfileStore();
const { busy, err, run } = useBusy();
const needsChoice = ref(false);

const playerName = computed(() => profile.state.name || "Spelaren utan namn");
const state = computed(() => (cloud.link?.kind === "adult" ? "mine" : cloud.link?.kind === "child" ? "child" : "free"));

const link = (choice?: LinkChoice) =>
  run(async () => {
    needsChoice.value = (await cloud.linkMyGame(choice)) === "needs-choice";
  });
</script>

<template>
  <LinkChoice v-if="needsChoice" :name="playerName" :busy="busy" @choose="link" />
  <div v-else class="card" style="text-align: left">
    <p class="q" style="text-align: left">Ditt eget spel</p>
    <p v-if="state === 'mine'" class="qsub">
      ☁️ Ditt spel ({{ playerName }}) sparas i familjekontot och följer med till dina andra enheter.
    </p>
    <p v-else-if="state === 'child'" class="qsub">
      Den här enheten spelar som <b>{{ cloud.link?.name }}</b> just nu. Byt till din egen spelare i spelet (Profil →
      Spelare) för att spara ditt spel här.
    </p>
    <template v-else>
      <p class="qsub">
        Spelaren på den här enheten är <b>{{ playerName }}</b
        >. Är det du? Spara spelet i familjekontot så följer det med till dina andra enheter.
      </p>
      <button class="btn green wide" :disabled="busy" @click="link()">Spara mitt spel i familjekontot</button>
    </template>
    <p v-if="err" class="err">{{ err }}</p>
  </div>
</template>
