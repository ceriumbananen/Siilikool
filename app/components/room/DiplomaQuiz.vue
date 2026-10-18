<script setup lang="ts">
/* Diplomleken i Tuba - porterat från dipStart()/dipRound()/dipEnd() i public/legacy/app.js.
   Tio frågor på ett tema (var tredje lyssnar man bara), sedan ett diplom: 6 rätt = en stjärna,
   8 = två, 10 = tre. Bästa resultatet sparas och hänger på väggen i rummet. */
type Theme = { id: string; et: string; sv: string; words: WordItem[] };
const { theme } = defineProps<{
  /** Temat diplomet gäller (ett av THEMES). */
  theme: Theme;
}>();
const emit = defineEmits<{ room: [] }>();

const profile = useProfileStore();
const voice = useSiiriVoice();
const { sndOk, sndNo, fanfare } = useSiiriSound();
const { burst } = useConfetti();
const { addXp } = useRewards();

const ROUNDS = 10;
/* tio av temats ord (färre ord än tio: de upprepas) */
function pickWords(): WordItem[] {
  const pool = shuffle(theme.words);
  const q = pool.slice(0, Math.min(ROUNDS, pool.length));
  while (q.length < ROUNDS && pool.length) q.push(pool[q.length % pool.length]!);
  return q;
}

const words = ref(pickWords());
const index = ref(0);
const right = ref(0);
const answered = ref<string | null>(null); /* svaret barnet valde (sv), medan rätt svar visas */
const result = ref<{ seals: number; gain: number } | null>(null);

const word = computed(() => words.value[index.value]!);
const listen = computed(() => index.value % 3 === 2);
/* rätt svar + tre andra (olika betydelser) bland alla ord barnet möter */
const options = ref<string[]>([]);
function makeOptions() {
  const all = allWords(profile.state);
  const opts: WordItem[] = [word.value];
  for (let tries = 0; opts.length < 4 && tries < 120; tries++) {
    const c = all[(Math.random() * all.length) | 0]!;
    if (!opts.some(o => o.sv === c.sv)) opts.push(c);
  }
  options.value = shuffle(opts).map(o => o.sv);
  if (listen.value) voice.sayWord(word.value.et);
}
makeOptions();

function answer(sv: string) {
  if (answered.value) return;
  answered.value = sv;
  const ok = sv === word.value.sv;
  if (ok) {
    right.value++;
    sndOk();
  } else sndNo();
  wmemHit(profile.state, word.value.et, ok, "choose", word.value.sv);
  profile.save();
  voice.sayWord(word.value.et);
  setTimeout(() => {
    answered.value = null;
    if (index.value + 1 >= words.value.length) return finish();
    index.value++;
    makeOptions();
  }, 900);
}

function finish() {
  const r = right.value;
  const seals = r >= 10 ? 3 : r >= 8 ? 2 : r >= 6 ? 1 : 0;
  const s = profile.state;
  const diplomas = { ...((s.diplomas as Record<string, number> | undefined) || {}) };
  if (seals > (diplomas[theme.id] || 0)) diplomas[theme.id] = seals;
  s.diplomas = diplomas;
  profile.autoBackup("diplom");
  const gain = Math.round((40 + r * 8) * starMult(s.xp));
  s.stars += gain;
  profile.save();
  addXp(60);
  burst(180);
  fanfare(seals >= 2 ? 3 : 2);
  result.value = { seals, gain };
}

function again() {
  words.value = pickWords();
  index.value = 0;
  right.value = 0;
  result.value = null;
  makeOptions();
}

const diplomaSVG = computed(() => (result.value ? dipSVG(theme, result.value.seals, profile.state.name || "") : ""));
const optionClass = (sv: string) => {
  if (!answered.value) return "";
  if (sv === word.value.sv) return "diploma-quiz__opt--right";
  return sv === answered.value ? "diploma-quiz__opt--wrong" : "";
};
</script>

<template>
  <div class="diploma-quiz">
    <template v-if="!result">
      <div class="diploma-quiz__zone">
        <span
          >📜 <b>Diplom</b> · <span lang="et">{{ theme.et }}</span></span
        >
        <span>{{ index + 1 }} / {{ words.length }}</span>
      </div>
      <div class="diploma-quiz__dots" aria-hidden="true">
        <i
          v-for="(_, i) in words"
          :key="i"
          :class="{ 'diploma-quiz__dot--on': i < index, 'diploma-quiz__dot--now': i === index }"
        />
      </div>
      <UiAppCard>
        <template v-if="listen">
          <h2 class="diploma-quiz__q">Lyssna — vad betyder ordet?</h2>
          <div class="diploma-quiz__center">
            <button
              class="diploma-quiz__say diploma-quiz__say--big"
              aria-label="Hör ordet"
              @click="voice.sayWord(word.et)"
            >
              🔊
            </button>
          </div>
        </template>
        <template v-else>
          <h2 class="diploma-quiz__q">Vad betyder</h2>
          <div class="diploma-quiz__word" lang="et">{{ word.et }}</div>
          <div class="diploma-quiz__center">
            <button class="diploma-quiz__say" aria-label="Hör ordet" @click="voice.sayWord(word.et)">🔊</button>
          </div>
        </template>
        <div class="diploma-quiz__opts">
          <button
            v-for="sv in options"
            :key="sv"
            class="diploma-quiz__opt"
            :class="optionClass(sv)"
            :disabled="!!answered"
            @click="answer(sv)"
          >
            {{ sv }}
          </button>
        </div>
        <div class="diploma-quiz__feedback" aria-live="polite">
          <b v-if="answered && answered === word.sv" class="diploma-quiz__ok">Õige!</b>
          <b v-else-if="answered">{{ word.et }} = {{ word.sv }}</b>
        </div>
      </UiAppCard>
    </template>

    <UiAppCard v-else class="diploma-quiz__end">
      <p class="diploma-quiz__kicker">📜 Diplom</p>
      <div v-html="diplomaSVG" />
      <p class="diploma-quiz__sub">{{ right }} av 10 rätt · ⭐ +{{ result.gain }}</p>
      <p v-if="result.seals < 3" class="diploma-quiz__sub">Gör om det när du vill — bästa resultatet räknas.</p>
      <div class="diploma-quiz__row">
        <UiAppButton variant="primary" big @click="again">Gör om</UiAppButton>
        <UiAppButton variant="green" @click="emit('room')">Till rummet 🏠</UiAppButton>
      </div>
    </UiAppCard>
  </div>
</template>

<style lang="scss" scoped>
.diploma-quiz {
  &__zone {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-2;
    margin: $spacing-1 0 $spacing-2;
    border-radius: $radius-lg;
    padding: $spacing-3;
    color: #fff;
    box-shadow: $shadow-3;
    background: linear-gradient(140deg, var(--hero-amber-a), var(--hero-amber-b));
  }

  &__dots {
    display: flex;
    gap: 0.3125rem; // 5px
    justify-content: center;
    margin-bottom: $spacing-2;

    i {
      width: 0.5625rem; // 9px
      height: 0.5625rem;
      border-radius: 50%;
      background: var(--line);
    }
  }

  & &__dot--on {
    background: var(--moss);
  }

  & &__dot--now {
    background: var(--honey-deep);
    transform: scale(1.25);
  }

  &__q {
    text-align: center;
    font-size: $font-size-lg;
    font-weight: 600;
    margin: 0 0 0.25rem;
  }

  &__word {
    font-size: clamp(1.875rem, 9vw, 3.375rem); // 30-54px
    font-weight: 700;
    text-align: center;
    line-height: 1.1;
    margin: 0.25rem 0 0.125rem;
  }

  &__center {
    display: flex;
    justify-content: center;
    margin-top: 0.75rem;
  }

  &__say {
    background: var(--honey);
    color: #3a2708;
    border: none;
    border-radius: $radius-lg;
    width: 2.875rem; // 46px
    height: 2.875rem;
    font-size: $font-size-lg;
    cursor: pointer;
    box-shadow: 0 0.3125rem 0 var(--honey-deep);

    @include focus-visible;

    &:active {
      transform: translateY(0.25rem);
      box-shadow: 0 0.125rem 0 var(--honey-deep);
    }

    &--big {
      width: 4.625rem; // 74px
      height: 4.625rem;
      font-size: 2rem;
    }
  }

  &__opts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(clamp(7.5rem, 38vw, 11.25rem), 1fr)); // 120-180px
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  &__opt {
    background: var(--card);
    border: $border-width solid var(--line);
    border-radius: $radius-md;
    padding: 0.75rem 0.5rem;
    font: inherit;
    font-size: $font-size-lg;
    font-weight: 600;
    color: var(--ink);
    cursor: pointer;
    box-shadow: $shadow-2;
    min-height: 6rem; // 96px
    transition: transform 0.1s;

    @include focus-visible;

    &:active {
      transform: translateY(0.25rem);
    }

    &:disabled {
      cursor: default;
    }

    &--right {
      border-color: var(--moss);
      background: color-mix(in srgb, var(--moss) 16%, var(--card));
    }

    &--wrong {
      border-color: var(--berry);
      background: color-mix(in srgb, var(--berry) 14%, var(--card));
    }
  }

  &__feedback {
    text-align: center;
    font-size: $font-size-lg;
    margin-top: 0.75rem;
    min-height: 1.75rem;
  }

  &__ok {
    color: var(--moss);
  }

  &__end {
    text-align: center;
  }

  &__kicker {
    font-weight: 700;
    margin: 0 0 $spacing-2;
  }

  &__sub {
    color: var(--muted);
    margin: $spacing-1 0;
  }

  &__row {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: $spacing-2;
    margin-top: $spacing-3;
  }
}
</style>
