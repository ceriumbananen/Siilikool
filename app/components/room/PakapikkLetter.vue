<script setup lang="ts">
/* Päkapiku kirjad: själva brevet (och lappen mellan stegen, och dagens sak när jakten är klar).
   Ett gammaldags brev på krämvitt papper med rött sigill; varje rad går att trycka på för att
   höra den igen. Svenskan är dold bakom 🇸🇪 utom på lätt nivå. Logiken i usePakapikk.ts. */
const pak = usePakapikk();

const open = computed(() => ["letter", "note", "done"].includes(pak.mode.value) && !!pak.current.value);
const lines = computed(() =>
  pak.mode.value === "note" && pak.target.value ? [PAK_WELL_DONE, pak.target.value.ask] : pak.letterLines(),
);
const askEt = computed(() => pak.target.value?.ask.et);
const hatItem = computed(() => SHOP.find(it => it.id === PAK_FINAL_ITEM));
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="pak-letter" role="dialog" aria-modal="true" @click.self="pak.close()">
      <!-- dagens sak -->
      <div v-if="pak.mode.value === 'done'" class="pak-letter__paper pak-letter__paper--gift">
        <p class="pak-letter__date">{{ pak.current.value!.day }}. detsember</p>
        <button class="pak-letter__gift" @click="pak.readAloud()">
          <span aria-hidden="true">{{ pak.current.value!.gift.em }}</span>
          <b lang="et">{{ pak.current.value!.gift.et }}</b>
          <small>{{ pak.current.value!.gift.sv }}</small>
        </button>
        <p v-if="pak.reward.value?.hat" class="pak-letter__hat">
          {{ hatItem?.em }} Nissen lämnade också en <b>{{ hatItem?.sv.toLowerCase() }}</b> till Siiri! Den finns under
          Kläder.
        </p>
        <p v-if="pak.testing.value" class="pak-letter__hat">
          🧪 Testläge – inga stjärnor{{ pak.current.value!.day === PAK_DAYS ? " och ingen tomteluva" : "" }} sparas.
        </p>
        <p v-if="pak.reward.value?.stars" class="pak-letter__stars">+{{ pak.reward.value.stars }} ⭐</p>
        <p class="pak-letter__next">
          <template v-if="pak.waiting.value">Det väntar ett brev till i rummet ✉️</template>
          <template v-else-if="pak.current.value!.day < PAK_DAYS">Nytt brev i rummet i morgon!</template>
          <template v-else>Häid jõule! God jul från nissen 🎄</template>
        </p>
        <UiAppButton variant="green" wide big @click="pak.close()">Aitäh! · Tack!</UiAppButton>
      </div>

      <!-- brevet eller lappen -->
      <div v-else class="pak-letter__paper" :class="{ 'pak-letter__paper--note': pak.mode.value === 'note' }">
        <span class="pak-letter__seal" aria-hidden="true" />
        <p v-if="pak.mode.value === 'letter'" class="pak-letter__date">{{ pak.current.value!.day }}. detsember</p>
        <button
          v-for="(l, i) in lines"
          :key="i"
          class="pak-letter__line"
          :class="{
            'pak-letter__line--ask': l.et === askEt,
            'pak-letter__line--sign': l === PAK_SIGNOFF,
          }"
          @click="pak.sayLine(l.et)"
        >
          <b lang="et">{{ l.et }}</b>
          <small v-if="pak.showSv.value">{{ l.sv }}</small>
        </button>
        <div class="pak-letter__tools">
          <button class="pak-letter__tool" @click="pak.readAloud()">🔊 Loe ette</button>
          <button v-if="!pak.showSv.value" class="pak-letter__tool" @click="pak.showSv.value = true">
            🇸🇪 Vad står det?
          </button>
        </div>
        <UiAppButton v-if="pak.reread.value" variant="ghost" wide @click="pak.close()">Stäng</UiAppButton>
        <UiAppButton v-else variant="green" wide big @click="pak.startSearch()">🔍 Ma otsin! · Jag letar!</UiAppButton>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.pak-letter {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 28, 18, 0.55);
  padding: $spacing-3;

  &__paper {
    position: relative;
    width: 100%;
    max-width: 22rem;
    background: repeating-linear-gradient(transparent 0 2.1rem, rgba(185, 169, 143, 0.28) 2.1rem 2.17rem), #fffaf0;
    color: #3a2a20;
    border-radius: $radius-sm;
    padding: $spacing-4 $spacing-4 $spacing-3;
    box-shadow:
      $shadow-3,
      inset 0 0 0 0.375rem #fffaf0,
      inset 0 0 0 0.5rem #c8352e;
    transform: rotate(-1deg);
    animation: pak-unfold 0.45s cubic-bezier(0.34, 1.4, 0.4, 1);

    &--note {
      max-width: 18rem;
      transform: rotate(1.5deg);
    }

    &--gift {
      text-align: center;
      transform: none;
    }
  }

  &__seal {
    position: absolute;
    top: -0.875rem;
    right: 1.25rem;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, #e0574d, #a0261f 70%);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
  }

  &__date {
    margin: 0 0 $spacing-2;
    font-size: $font-size-xs;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #a0261f;
  }

  &__line {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 0.3125rem 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
    border-radius: $radius-sm;
    @include focus-visible;

    b {
      display: block;
      font-size: $font-size-lg;
      font-weight: 600;
    }

    small {
      display: block;
      font-size: $font-size-sm;
      color: #7a6a58;
    }

    &--ask b {
      font-size: $font-size-xl;
      font-weight: 700;
      color: #a0261f;
    }

    &--sign {
      text-align: right;
      margin-top: $spacing-1;

      b {
        font-style: italic;
        font-size: $font-size-md;
      }
    }

    &:active b {
      transform: scale(0.98);
    }
  }

  &__tools {
    display: flex;
    gap: $spacing-2;
    flex-wrap: wrap;
    margin: $spacing-2 0 $spacing-3;
  }

  &__tool {
    border: $border-width solid #d9cfbf;
    background: #fff;
    color: #3a2a20;
    border-radius: $radius-pill;
    padding: 0.375rem 0.75rem;
    font: inherit;
    font-size: $font-size-sm;
    font-weight: 600;
    cursor: pointer;
    @include focus-visible;
  }

  &__gift {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    padding: 0;
    margin-bottom: $spacing-2;

    span {
      font-size: 4.5rem;
      line-height: 1.1;
      animation: pak-bounce 0.9s cubic-bezier(0.34, 1.6, 0.5, 1);
    }

    b {
      font-size: $font-size-2xl;
      color: #a0261f;
    }

    small {
      font-size: $font-size-md;
      color: #7a6a58;
    }
  }

  &__hat {
    background: rgba(200, 53, 46, 0.1);
    border-radius: $radius-md;
    padding: $spacing-2;
    margin: 0 0 $spacing-2;
    font-size: $font-size-sm;
  }

  &__stars {
    font-size: $font-size-lg;
    font-weight: 700;
    margin: 0 0 $spacing-1;
  }

  &__next {
    font-size: $font-size-sm;
    color: #7a6a58;
    margin: 0 0 $spacing-3;
  }
}

/* surfplatta/dator: ett större brev - 22rem blev ett frimärke mitt på en iPad-skärm */
@media (min-width: 40rem) {
  .pak-letter {
    &__paper {
      max-width: 30rem;
      padding: $spacing-5 $spacing-5 $spacing-4;

      &--note {
        max-width: 24rem;
      }
    }

    &__line {
      padding: 0.4375rem 0;

      b {
        font-size: 1.5rem;
      }

      small {
        font-size: $font-size-md;
      }

      &--ask b {
        font-size: 1.875rem;
      }

      &--sign b {
        font-size: $font-size-lg;
      }
    }

    &__tool {
      font-size: $font-size-md;
      padding: 0.5rem 1rem;
    }

    &__gift span {
      font-size: 6rem;
    }
  }
}

@keyframes pak-unfold {
  from {
    opacity: 0;
    transform: translateY(1.5rem) scale(0.9) rotate(-4deg);
  }
}

@keyframes pak-bounce {
  0% {
    transform: scale(0.2) rotate(-20deg);
  }
  60% {
    transform: scale(1.15) rotate(6deg);
  }
  100% {
    transform: scale(1) rotate(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pak-letter__paper,
  .pak-letter__gift span {
    animation: none;
  }
}
</style>
