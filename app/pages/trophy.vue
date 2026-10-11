<script setup lang="ts">
/* Skattkammaren - porterat från trophyScreen() i public/legacy/app.js (rad 14900-15026).
   Pilotskärmen för Vue-migreringen, se docs/vue-conventions.md och
   /Users/jonas/.claude/plans/smooth-foraging-boot.md.

   Medvetet utelämnat tills vidare: "Ord Siiri övar extra med dig" (hardWords() i legacy-
   koden) - den bygger på hela ordförrådet (THEMES/TRIP, 400+ ord), som fortfarande bara
   finns i app.js. Porteras hit när ordförrådet självt flyttas till Vue, inte innan. */

const profile = useProfileStore();

const ri = computed(() => rankIndex(profile.state.xp));
const nextRank = computed(() => RANKS[ri.value + 1]);

const quest = computed(() => useDailyQuest(profile.state.dayp || {}));

const duelRows = computed(() =>
  RIVALS.map(rival => ({
    rival,
    record: (profile.state.duels as Record<string, { w?: number; l?: number; best?: number }> | undefined)?.[rival.id],
  })).filter(row => row.record && (row.record.w || row.record.l)),
);

const badgeRows = computed(() =>
  BADGES.map(badge => ({
    badge,
    earned: (profile.state.badges as string[]).includes(badge.id),
    progress: badgeProgress(badge, profile.state as unknown as BadgeProfile),
  })),
);
</script>

<template>
  <main class="trophy-page">
    <header class="trophy-page__hero">
      <span class="trophy-page__hero-emoji" aria-hidden="true">🏆</span>
      <div>
        <h1>Aarded</h1>
        <p>Skattkammaren</p>
      </div>
    </header>

    <UiAppCard class="trophy-page__section">
      <p>
        {{ RANKS.length }} märken att samla, från bronsigelkotten till kungsigelkotten på 100 000 poäng. Medaljen ser
        olika ut beroende på vilken nivå du spelade när du tog den: 🍃 grönt löv, ⭐ rött band eller 🔥 lila stjärna.
      </p>
      <p>
        <b>{{ profile.state.xp.toLocaleString("sv-SE") }}</b> poäng ·
        <template v-if="nextRank"
          >nästa märke om <b>{{ (nextRank.xp - profile.state.xp).toLocaleString("sv-SE") }}</b> poäng</template
        >
        <template v-else>du har alla märken!</template>
      </p>
      <ul class="trophy-page__medals">
        <li
          v-for="(rank, i) in RANKS"
          :key="rank.id"
          class="trophy-page__medal"
          :class="{ 'trophy-page__medal--locked': i > ri, 'trophy-page__medal--current': i === ri }"
        >
          <UiMedalBadge :rank="rank" :locked="i > ri" :medal-style="medalStyleOf(profile.state.mstyle, rank.id)" />
          <b lang="et">{{ rank.et }}</b>
          <span>{{ rank.sv }}</span>
          <span>{{ i > ri ? `${rank.xp} poäng` : difficultyLabel(medalStyleOf(profile.state.mstyle, rank.id)) }}</span>
        </li>
      </ul>
    </UiAppCard>

    <UiAppCard class="trophy-page__section">
      <h2>{{ quest.quest.em }} Dagens utmaning</h2>
      <p>{{ quest.quest.sv }} – {{ quest.value }} av {{ quest.quest.goal }}{{ quest.done ? " ✓ klar!" : "" }}</p>
      <div
        class="trophy-page__quest-bar"
        role="progressbar"
        :aria-valuenow="quest.value"
        :aria-valuemin="0"
        :aria-valuemax="quest.quest.goal"
      >
        <i :style="{ width: `${Math.round((quest.value / quest.quest.goal) * 100)}%` }" />
      </div>
    </UiAppCard>

    <UiAppCard v-if="duelRows.length" class="trophy-page__section">
      <h2>⚔️ Duellhyllan</h2>
      <ul class="trophy-page__duels">
        <li v-for="row in duelRows" :key="row.rival.id" class="trophy-page__duel">
          <span class="trophy-page__duel-emoji" aria-hidden="true">
            {{ row.rival.em }}
            <span v-if="(row.record?.w || 0) >= 5" class="trophy-page__duel-cup" aria-hidden="true">🏆</span>
          </span>
          <span>
            <b lang="et">{{ row.rival.et }}</b>
            <small>
              {{ row.record?.w || 0 }} vinster · {{ row.record?.l || 0 }} förluster
              <template v-if="row.record?.best">· bästa {{ starRating(row.record.best) }}</template>
            </small>
          </span>
        </li>
      </ul>
    </UiAppCard>

    <UiAppCard class="trophy-page__section">
      <h2>{{ profile.state.name ? `${profile.state.name}s bragder` : "Dina bragder" }}</h2>
      <UiBadgeChip
        v-for="row in badgeRows"
        :key="row.badge.id"
        :badge="row.badge"
        :earned="row.earned"
        :progress="row.progress"
      />
      <p class="trophy-page__stats">
        ⭐ {{ profile.state.stars }} stjärnor · {{ profile.state.correct }} rätta svar · 🔥 bästa kombo:
        {{ profile.state.bestcombo || 0 }} i rad
      </p>
    </UiAppCard>
  </main>
</template>

<style lang="scss" scoped>
.trophy-page {
  @include content-width;

  &__hero {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    margin: $spacing-1 0 $spacing-2;
    border-radius: $radius-lg;
    padding: $spacing-3;
    color: #fff;
    box-shadow: $shadow-3;
    background: linear-gradient(140deg, #d8a32a, #8a6008);

    h1 {
      font-size: $font-size-xl;
      line-height: 1.1;
      margin: 0;
    }

    p {
      font-size: $font-size-sm;
      opacity: 0.9;
      font-weight: 500;
      margin: 0;
    }
  }

  &__hero-emoji {
    font-size: 34px;
    line-height: 1;
  }

  &__section {
    margin-top: $spacing-3;

    h2 {
      font-size: $font-size-lg;
      margin: 0 0 $spacing-1;
      text-align: left;
    }

    p {
      text-align: left;
      margin: 0 0 $spacing-1;
    }
  }

  &__medals {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(clamp(96px, 25vw, 130px), 1fr));
    gap: 12px;
    margin: 4px 0 0;
    padding: 0;
    list-style: none;
  }

  &__medal {
    background: var(--card);
    border: $border-width solid var(--line);
    border-radius: $radius-card;
    padding: 8px;
    text-align: center;
    box-shadow: $shadow-2;

    b {
      display: block;
      font-size: $font-size-md;
      margin-top: 4px;
      line-height: 1.15;
    }

    span {
      display: block;
      font-size: $font-size-xs;
      color: var(--muted);
    }

    &--locked {
      opacity: 0.45;
      filter: grayscale(0.85);
    }

    &--current {
      border-color: var(--honey);
      box-shadow:
        0 0 0 4px color-mix(in srgb, var(--honey) 35%, transparent),
        $shadow-2;
    }
  }

  &__quest-bar {
    display: block;
    width: 100%;
    height: 14px;
    border-radius: $radius-lg;
    background: var(--line);
    margin-top: 8px;
    overflow: hidden;

    i {
      display: block;
      height: 100%;
      background: var(--moss);
    }
  }

  &__duels {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__duel {
    display: flex;
    gap: $spacing-2;
    align-items: center;
    padding: 8px 0;
    border-bottom: 2px dotted var(--line);
    text-align: left;

    &:last-child {
      border-bottom: none;
    }

    b {
      display: block;
      font-size: $font-size-md;
    }

    small {
      display: block;
      font-size: $font-size-xs;
      color: var(--muted);
    }
  }

  &__duel-emoji {
    font-size: 30px;
    position: relative;
  }

  &__duel-cup {
    position: absolute;
    right: -8px;
    bottom: -4px;
    font-size: 16px;
  }

  &__stats {
    margin-top: 12px;
  }
}
</style>
