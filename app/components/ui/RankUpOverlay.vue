<script setup lang="ts">
/* "Nytt märke upplåst!" - porterat från rutan i rankUp() i public/legacy/app.js (rad 2241-2286),
   med fanfar och konfetti. Visas när useRewards().addXp() ger ett nytt märke. */
const profile = useProfileStore();
const { rankUp, closeRankUp } = useRewards();
const { sndLvl } = useSiiriSound();
const { burst } = useConfetti();
const { L, tgt, nat, tgtLang, isEt } = useLang();

watch(rankUp, r => {
  if (!r) return;
  sndLvl();
  burst(190);
  setTimeout(() => burst(120), 450);
});

const climbed = computed(() =>
  rankUp.value
    ? L(
        `${profile.state.name || "Du"} har klättrat till märke ${rankUp.value.index + 1} av ${RANKS.length}.`,
        `${profile.state.name ? `${profile.state.name} on` : "Sa oled"} nüüd märgil ${rankUp.value.index + 1} / ${RANKS.length}.`,
      )
    : "",
);
</script>

<template>
  <!-- stängs bara med knappen, som i legacy -->
  <div v-if="rankUp" class="rank-up" role="dialog" aria-modal="true">
    <div class="rank-up__card">
      <p class="rank-up__kicker">{{ L("Nytt märke upplåst!", "Uus märk avatud!") }}</p>
      <UiMedalBadge class="rank-up__medal" :rank="rankUp.rank" :medal-style="rankUp.style" />
      <h3 :lang="tgtLang()">{{ tgt(rankUp.rank) }}</h3>
      <p>{{ nat(rankUp.rank) }} · {{ difficultyLabel(rankUp.style, isEt()) }}</p>
      <p class="rank-up__climbed">{{ climbed }}</p>
      <UiAppButton variant="primary" wide @click="closeRankUp">{{ L("Toppen! 🎉", "Super! 🎉") }}</UiAppButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rank-up {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-3;
  background: rgba(12, 28, 18, 0.72);

  &__card {
    background: var(--card);
    border: $border-width solid var(--honey);
    border-radius: $radius-card;
    padding: $spacing-4;
    max-width: 22rem; // 352px, som legacy .oc
    width: 100%;
    text-align: center;
    box-shadow: $shadow-3;
    perspective: 50rem; // 800px - ger medaljens rotateY-snurr riktigt djup, inte en platt klämning

    h3 {
      font-size: $font-size-xl;
      margin: $spacing-1 0;
    }

    p {
      margin: 0 0 $spacing-2;
    }
  }

  &__kicker {
    font-weight: 700;
  }

  &__medal {
    width: 7.5rem; // 120px
    height: auto;
    margin: 0 auto;
    animation: rank-up-flip 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  &__climbed {
    margin-top: $spacing-1;
  }
}

@keyframes rank-up-flip {
  0% {
    transform: rotateY(900deg) scale(0.4);
    opacity: 0;
  }

  55% {
    opacity: 1;
  }

  100% {
    transform: rotateY(0deg) scale(1);
    opacity: 1;
  }
}
</style>
