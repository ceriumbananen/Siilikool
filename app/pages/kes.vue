<script setup lang="ts">
/* Kes ma olen? (Vem är jag?) - Siiri låtsas vara ett djur, barnet frågar sig fram på estniska.
   Datan (djur, frågor, svar) i app/utils/kes.ts. Startas från hemskärmens ruta (public/legacy/
   app.js, MODES "kes").

   Flödet: fråga ("Kas sa elad metsas?") → Siiri svarar med en hel mening och djuren som inte
   passar bleknar bort → "Ma tean!" → "Mida me teame?": välj det påstående som stämmer för varje
   svar ("Sa elad metsas." / "Sa ei ela metsas.") → gissa djuret. Fel gissning är inget straff:
   Siiri säger "Ei, ma ei ole kass." och man frågar vidare. */

useHead({ title: "Kes ma olen? · Siilikool" });
const profile = useProfileStore();
const s = profile.state;
const voice = useSiiriVoice();
const { tone, buzz, fanfare } = useSiiriSound();
const { burst } = useConfetti();
const { addXp } = useRewards();
const { mood, dance } = useSiiri();
/* estniskt läge (profile.state.home === "et"): det barnet lär sig är svenska - frågorna, Siiris
   svar och djurens namn visas och sägs på svenska, estniskan är den lilla hjälpraden */
const { L, tgt, nat, tgtLang, isEt } = useLang();
/* hjälpradens språk: inget lang-attribut i svenskt läge (som förut) */
const natLang = () => (isEt() ? "et" : undefined);
/* frågan som par: i estniskt läge med askSv ("Har du päls?") istället för förklaringen */
const askOf = (f: KesFeature) => (isEt() ? kesAsk(f) : f.ask);

type Phase = "ask" | "recap" | "guess" | "won";
const phase = ref<Phase>("ask");
const secret = ref<KesAnimal>(KES_ANIMALS[0]!);
/* frågorna barnet ställt, i ordning, och om de redan gåtts igenom i "Mida me teame?" */
const asked = ref<{ f: KesFeature; yes: boolean; recapped: boolean }[]>([]);
const wrongGuesses = ref<string[]>([]);
const said = ref<KesLine>(KES_INTRO);
const showSv = ref(s.diff === "latt");
const reward = ref(0);
/* på svår nivå bleknar djuren inte bort - där får barnet själv tänka ut vilka som passar */
const autoFade = s.diff !== "svar";

/* ---------- ljud ---------- */
async function sayLines(lines: string[]) {
  if (isEt()) return saySv(lines);
  const clips = (await Promise.all(lines.map(l => findWordClip(l)))).filter(Boolean).map(c => c!.src);
  if (clips.length) voice.say(clips);
  else if (lines[0]) voice.sayWord(lines[0]);
}
/* estniskt läge: Sofies svenska klipp; saknas något av dem läses allt av enhetens svenska röst
   (sayWord), så att ingen rad hoppas över */
async function saySv(lines: string[]) {
  const clips = await Promise.all(lines.map(l => findSvClip(l)));
  if (clips.length && clips.every(Boolean)) voice.say(clips.map(c => c!.src));
  else if (lines.length) voice.sayWord(lines.join(" "));
}
function show(line: KesLine, extra: string[] = []) {
  said.value = line;
  sayLines([...extra, tgt(line)]);
}

/* ---------- en ny runda ---------- */
function newRound() {
  const last = s.kesLast as string | undefined;
  const pool = KES_ANIMALS.filter(a => a.et !== last);
  secret.value = pool[Math.floor(Math.random() * pool.length)]!;
  s.kesLast = secret.value.et;
  profile.save();
  asked.value = [];
  wrongGuesses.value = [];
  recap.value = [];
  reward.value = 0;
  phase.value = "ask";
  mood("listen");
  show(KES_INTRO);
}
onMounted(newRound);

/* ---------- frågorna ---------- */
const open = computed(() => KES_FEATURES.filter(f => !asked.value.some(a => a.f.id === f.id)));
/* djuren som fortfarande passar alla svar (och inte redan gissats fel på) */
const fits = (a: KesAnimal) => asked.value.every(q => kesHas(a, q.f) === q.yes) && !wrongGuesses.value.includes(a.et);
const left = computed(() => KES_ANIMALS.filter(fits));

function ask(f: KesFeature) {
  if (phase.value !== "ask") return;
  const yes = kesHas(secret.value, f);
  const before = left.value.length;
  asked.value = [...asked.value, { f, yes, recapped: false }];
  const gone = before - left.value.length;
  tone(yes ? 660 : 440, 0.08, 0);
  tone(yes ? 880 : 330, 0.1, 0.08);
  if (gone) buzz(10);
  mood(yes ? "cheer" : "");
  /* barnets fråga och Siiris svar, i följd */
  show(yes ? f.yes : f.no, [tgt(askOf(f))]);
}

/* ---------- "Ma tean!" och "Mida me teame?" ---------- */
const canGuess = computed(() => asked.value.length >= 2 || left.value.length <= 1);
type RecapItem = { i: number; options: KesLine[]; right: KesLine; done: boolean; miss: number };
const recap = ref<RecapItem[]>([]);
const recapAt = computed(() => recap.value.find(r => !r.done) || null);

function iKnow() {
  if (!canGuess.value) return;
  tone(700, 0.07, 0);
  const todo = asked.value.map((q, i) => ({ q, i })).filter(x => !x.q.recapped);
  if (!todo.length) return startGuess();
  recap.value = todo.map(({ q, i }) => {
    const right = q.yes ? q.f.isTrue : q.f.isFalse;
    const options = Math.random() < 0.5 ? [q.f.isTrue, q.f.isFalse] : [q.f.isFalse, q.f.isTrue];
    return { i, options, right, done: false, miss: 0 };
  });
  phase.value = "recap";
  mood("think");
  show(KES_RECAP, [tgt(KES_I_KNOW)]);
}
const shake = ref("");
function pickRecap(r: RecapItem, o: KesLine) {
  if (r.done) return;
  if (o.et === r.right.et) {
    r.done = true;
    asked.value[r.i]!.recapped = true;
    tone(784, 0.08, 0);
    tone(1046, 0.12, 0.08);
    show(r.right);
    if (!recapAt.value) setTimeout(startGuess, 1400);
  } else {
    r.miss++;
    buzz(14);
    tone(300, 0.12, 0);
    shake.value = o.et;
    setTimeout(() => (shake.value = ""), 450);
    /* påminn om vad Siiri svarade */
    const q = asked.value[r.i]!;
    show(q.yes ? q.f.yes : q.f.no);
  }
}

function startGuess() {
  phase.value = "guess";
  mood("listen");
  show(KES_GUESS);
}

/* ---------- gissa ---------- */
function guess(a: KesAnimal) {
  if (phase.value !== "guess" || wrongGuesses.value.includes(a.et)) return;
  if (a.et === secret.value.et) return win();
  wrongGuesses.value = [...wrongGuesses.value, a.et];
  buzz(16);
  tone(330, 0.1, 0);
  tone(262, 0.14, 0.08);
  mood("oops");
  show(kesNotMe(a), []);
  setTimeout(() => {
    if (phase.value !== "guess") return;
    if (autoFade && left.value.length === 1) return; /* bara ett djur kvar - gissa igen direkt */
    phase.value = "ask";
    show(KES_MORE);
  }, 1800);
}

function win() {
  const a = secret.value;
  const firstTry = recap.value.length ? recap.value.filter(r => r.miss === 0).length : 0;
  reward.value = Math.round((10 + 2 * firstTry) * starMult(s.xp || 0));
  s.stars = (s.stars || 0) + reward.value;
  s.kesWins = ((s.kesWins as number | undefined) || 0) + 1;
  profile.save();
  phase.value = "won";
  mood("cheer");
  dance(true);
  burst(120);
  fanfare(2);
  show(kesReveal(a));
  setTimeout(() => addXp(15), 1800);
}
</script>

<template>
  <UiAppShell active="home">
    <main class="kes">
      <a class="kes__back" href="/">{{ L("← Tillbaka", "← Tagasi") }}</a>

      <!-- Siiri, det hon säger och det man vet: följer med när man scrollar, så att svaret syns
           även när man tryckt på en fråga längst ner på en telefon -->
      <div class="kes__head">
        <div class="kes__top">
          <UiSiiriPortrait size="small" class="kes__siiri" />
          <button class="kes__bubble" @click="show(said)">
            <b :lang="tgtLang()">{{ tgt(said) }}</b>
            <small v-if="showSv" :lang="natLang()">{{ nat(said) }}</small>
            <small v-else class="kes__hear">{{
              L("🔊 Tryck för att höra igen", "🔊 Vajuta, et uuesti kuulata")
            }}</small>
          </button>
        </div>

        <!-- hemliga kortet med det man vet hittills -->
        <div class="kes__secret" :class="{ 'kes__secret--won': phase === 'won' }">
          <div class="kes__card">
            <span v-if="phase === 'won'" class="kes__reveal" aria-hidden="true">{{ secret.em }}</span>
            <span v-else class="kes__q" aria-hidden="true">?</span>
          </div>
          <ul class="kes__facts" :aria-label="L('Det vi vet', 'Mida me teame')">
            <li v-if="!asked.length" class="kes__fact kes__fact--empty">
              {{ L("Fråga Siiri – svaren hamnar här", "Küsi Siirilt – vastused tulevad siia") }}
            </li>
            <li
              v-for="q in asked"
              :key="q.f.id"
              class="kes__fact"
              :class="q.yes ? 'kes__fact--yes' : 'kes__fact--no'"
              @click="show(q.yes ? q.f.yes : q.f.no)"
            >
              <span aria-hidden="true">{{ q.f.em }}</span
              >{{ q.yes ? "✓" : "✗" }}
            </li>
          </ul>
        </div>
      </div>

      <!-- vinst -->
      <UiAppCard v-if="phase === 'won'" class="kes__won">
        <h2>
          <span :lang="tgtLang()">{{ tgt(kesReveal(secret)) }}</span>
          <small :lang="natLang()">{{ nat(kesReveal(secret)) }}</small>
        </h2>
        <p v-if="isEt()">Arvasid ära {{ asked.length }} küsimusega!</p>
        <p v-else>Du klarade det med {{ asked.length }} {{ asked.length === 1 ? "fråga" : "frågor" }}.</p>
        <p class="kes__stars">+{{ reward }} ⭐</p>
        <div class="kes__row">
          <UiAppButton variant="green" big @click="newRound">{{
            L("🔄 Uus loom · Nytt djur", "🔄 Nytt djur · Uus loom")
          }}</UiAppButton>
          <UiAppButton variant="ghost" @click="() => navigateTo('/', { external: true })">{{
            L("Hem", "Koju")
          }}</UiAppButton>
        </div>
      </UiAppCard>

      <!-- Mida me teame? -->
      <UiAppCard v-else-if="phase === 'recap' && recapAt" class="kes__recap">
        <h2>
          <span :lang="tgtLang()">{{ tgt(KES_RECAP) }}</span> <small :lang="natLang()">{{ nat(KES_RECAP) }}</small>
        </h2>
        <p class="kes__sub">
          {{ L("Frågan var", "Küsimus oli") }} <b :lang="tgtLang()">{{ tgt(askOf(asked[recapAt.i]!.f)) }}</b>
          {{ L("Vad stämmer?", "Mis on õige?") }}
          <span class="kes__count">{{ recap.filter(r => r.done).length + 1 }} / {{ recap.length }}</span>
        </p>
        <div class="kes__options">
          <button
            v-for="o in recapAt.options"
            :key="o.et"
            class="kes__option"
            :class="{ 'kes__option--shake': shake === o.et }"
            @click="pickRecap(recapAt, o)"
          >
            <b :lang="tgtLang()">{{ tgt(o) }}</b>
            <small v-if="showSv" :lang="natLang()">{{ nat(o) }}</small>
          </button>
        </div>
      </UiAppCard>

      <!-- djuren -->
      <div v-if="phase !== 'recap'" class="kes__animals" :class="{ 'kes__animals--guess': phase === 'guess' }">
        <button
          v-for="a in KES_ANIMALS"
          :key="a.et"
          class="kes__animal"
          :class="{
            'kes__animal--out':
              (autoFade || wrongGuesses.includes(a.et) || phase === 'won') &&
              !fits(a) &&
              !(phase === 'won' && a.et === secret.et),
            'kes__animal--me': phase === 'won' && a.et === secret.et,
          }"
          :disabled="phase !== 'guess' || wrongGuesses.includes(a.et)"
          :aria-label="`${tgt(a)}, ${nat(a)}`"
          @click="guess(a)"
        >
          <span aria-hidden="true">{{ a.em }}</span>
          <small :lang="tgtLang()">{{ tgt(a) }}</small>
        </button>
      </div>
      <p v-if="phase === 'guess'" class="kes__hint">
        {{ L("Tryck på djuret du tror att Siiri är.", "Vajuta loomale, kes Siiri sinu arvates on.") }}
      </p>

      <!-- frågorna -->
      <template v-if="phase === 'ask'">
        <UiAppButton v-if="canGuess" variant="green" wide big class="kes__know" @click="iKnow">
          {{ L("💡 Ma tean! · Jag vet!", "💡 Jag vet! · Ma tean!") }}
        </UiAppButton>
        <p v-else class="kes__hint">
          {{ L("Ställ minst två frågor, sedan kan du gissa.", "Küsi vähemalt kaks küsimust, siis saad arvata.") }}
        </p>
        <div class="kes__questions">
          <button v-for="f in open" :key="f.id" class="kes__ask" @click="ask(f)">
            <span class="kes__ask-em" aria-hidden="true">{{ f.em }}</span>
            <span>
              <b :lang="tgtLang()">{{ tgt(askOf(f)) }}</b>
              <small v-if="showSv" :lang="natLang()">{{ nat(askOf(f)) }}</small>
            </span>
          </button>
        </div>
        <button v-if="!showSv" class="kes__sv" @click="showSv = true">
          {{ L("🇸🇪 Visa på svenska", "🇪🇪 Näita eesti keeles") }}
        </button>
      </template>
    </main>
  </UiAppShell>
</template>

<style lang="scss" scoped>
.kes {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
  padding-bottom: $spacing-5;

  &__back {
    color: var(--muted);
    font-weight: 700;
    text-decoration: none;
    font-size: $font-size-sm;
  }

  &__head {
    position: sticky;
    top: 0;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
    padding: $spacing-2 0;
    background: var(--bg);
  }

  &__top {
    display: flex;
    align-items: center;
    gap: $spacing-2;
  }

  &__siiri {
    flex: none;
  }

  &__bubble {
    flex: 1;
    position: relative;
    text-align: left;
    background: var(--card);
    color: var(--ink);
    border: $border-width solid var(--honey);
    border-radius: $radius-lg;
    padding: $spacing-2 $spacing-3;
    font: inherit;
    cursor: pointer;
    box-shadow: $shadow-2;
    @include focus-visible;

    b {
      display: block;
      font-size: $font-size-lg;
      color: var(--honey-deep);
    }

    small {
      display: block;
      font-size: $font-size-sm;
      color: var(--muted);
    }
  }

  &__secret {
    display: flex;
    align-items: center;
    gap: $spacing-3;
  }

  &__card {
    flex: none;
    width: 5.5rem;
    height: 5.5rem;
    border-radius: $radius-lg;
    border: $border-width dashed var(--honey);
    background: var(--bg2);
    display: grid;
    place-items: center;
    transition: transform 0.5s cubic-bezier(0.34, 1.5, 0.5, 1);
  }

  &__secret--won &__card {
    border-style: solid;
    background: var(--card);
    transform: scale(1.12) rotate(-4deg);
  }

  &__q {
    font-size: 3rem;
    font-weight: 700;
    color: var(--honey-deep);
    animation: kes-wobble 2.4s ease-in-out infinite;
  }

  &__reveal {
    font-size: 3.5rem;
    animation: kes-pop 0.6s cubic-bezier(0.34, 1.6, 0.5, 1);
  }

  &__facts {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__fact {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    padding: 0.25rem 0.5rem;
    border-radius: $radius-pill;
    border: $border-width solid var(--line);
    background: var(--card);
    font-weight: 700;
    cursor: pointer;
    animation: kes-pop 0.4s ease;

    &--yes {
      border-color: var(--moss);
      color: var(--moss);
    }

    &--no {
      border-color: var(--berry);
      color: var(--berry);
    }

    &--empty {
      border-style: dashed;
      color: var(--muted);
      font-weight: 500;
      font-size: $font-size-sm;
      cursor: default;
      animation: none;
    }
  }

  &__animals {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-2;

    @media (min-width: 40rem) {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  &__animal {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-2 0.25rem;
    border-radius: $radius-md;
    border: $border-width solid var(--line);
    background: var(--card);
    color: var(--ink);
    font: inherit;
    transition:
      opacity 0.5s ease,
      transform 0.5s ease,
      filter 0.5s ease;
    @include focus-visible;

    span {
      font-size: 2.25rem;
      line-height: 1.1;
    }

    small {
      font-size: $font-size-xs;
      font-weight: 700;
    }

    &:disabled {
      cursor: default;
    }

    &--out {
      opacity: 0.25;
      filter: grayscale(1);
      transform: scale(0.88);
    }

    &--me {
      border-color: var(--honey);
      transform: scale(1.1);
      box-shadow: 0 0 0 0.1875rem var(--honey);
    }
  }

  &__animals--guess &__animal:not(:disabled) {
    cursor: pointer;
    border-color: var(--honey);
    animation: kes-bob 1.6s ease-in-out infinite;

    &:nth-child(odd) {
      animation-delay: 0.3s;
    }
  }

  &__know {
    animation: kes-pop 0.4s ease;
  }

  &__questions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-2;

    @media (min-width: 40rem) {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  &__ask {
    display: flex;
    align-items: center;
    gap: $spacing-1;
    text-align: left;
    padding: $spacing-2;
    border-radius: $radius-md;
    border: $border-width solid var(--line);
    background: var(--card);
    color: var(--ink);
    font: inherit;
    cursor: pointer;
    box-shadow: $shadow-1;
    @include focus-visible;

    b {
      display: block;
      font-size: $font-size-sm;
      line-height: 1.3;
    }

    small {
      display: block;
      color: var(--muted);
      font-size: $font-size-xs;
    }

    &:active {
      transform: scale(0.98);
    }
  }

  &__ask-em {
    font-size: 1.25rem;
    flex: none;
  }

  &__hint,
  &__sub {
    margin: 0;
    font-size: $font-size-sm;
    color: var(--muted);
    text-align: center;
  }

  &__sub {
    text-align: left;
  }

  &__count {
    float: right;
    font-weight: 700;
  }

  &__sv {
    align-self: center;
    border: none;
    background: none;
    color: var(--muted);
    font: inherit;
    font-size: $font-size-sm;
    cursor: pointer;
    text-decoration: underline;
  }

  &__recap,
  &__won {
    h2 {
      margin: 0 0 $spacing-2;
      font-size: $font-size-xl;

      small {
        font-size: $font-size-md;
        color: var(--muted);
        font-weight: 500;
      }
    }
  }

  &__options {
    display: grid;
    gap: $spacing-2;
    margin-top: $spacing-3;
  }

  &__option {
    padding: $spacing-3;
    border-radius: $radius-md;
    border: $border-width solid var(--line);
    background: var(--bg2);
    color: var(--ink);
    font: inherit;
    cursor: pointer;
    text-align: center;
    @include focus-visible;

    b {
      display: block;
      font-size: $font-size-lg;
    }

    small {
      display: block;
      color: var(--muted);
    }

    &--shake {
      animation: kes-shake 0.4s ease;
      border-color: var(--berry);
    }
  }

  &__won {
    text-align: center;

    p {
      margin: 0 0 $spacing-2;
    }
  }

  &__stars {
    font-size: $font-size-lg;
    font-weight: 700;
  }

  &__row {
    display: flex;
    gap: $spacing-2;
    justify-content: center;
    flex-wrap: wrap;
  }
}

@keyframes kes-wobble {
  0%,
  100% {
    transform: rotate(-6deg);
  }
  50% {
    transform: rotate(6deg);
  }
}

@keyframes kes-pop {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
}

@keyframes kes-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.25rem);
  }
}

@keyframes kes-shake {
  0%,
  100% {
    translate: 0;
  }
  25% {
    translate: -0.375rem;
  }
  75% {
    translate: 0.375rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .kes__q,
  .kes__reveal,
  .kes__fact,
  .kes__know,
  .kes__animals--guess .kes__animal,
  .kes__option--shake {
    animation: none;
  }
}
</style>
