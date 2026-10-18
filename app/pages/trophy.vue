<script setup lang="ts">
/* Skattkammaren - porterat från trophyScreen() i public/legacy/app.js (rad 14900-15026).
   Pilotskärmen för Vue-migreringen, se docs/vue-conventions.md och
   /Users/jonas/.claude/plans/smooth-foraging-boot.md.

   Medvetet utelämnat tills vidare: "Ord Siiri övar extra med dig" (hardWords() i legacy-
   koden) - den bygger på hela ordförrådet (THEMES/TRIP, 400+ ord), som fortfarande bara
   finns i app.js. Porteras hit när ordförrådet självt flyttas till Vue, inte innan.

   UiAppShell ger samma toppfält/nivåmätare/bottennav som spelets egna skärmar (annars
   fullständigt frånvarande på en fristående Nuxt-sida, se app/components/ui/AppShell.vue).
   "me" markerad som vald flik - Skattkammaren nås oftast via profilen, och ingen av de
   fem flikarna representerar den här sidan mer exakt förrän spelet har en riktig router. */

const profile = useProfileStore();

const ri = computed(() => rankIndex(profile.state.xp));
const nextRank = computed(() => RANKS[ri.value + 1]);

const quest = computed(() =>
  useDailyQuest(profile.state.dayp || {}, profile.state.questPick as { day: string; id: string } | null | undefined),
);

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
  <UiAppShell active="me">
    <main class="trophy-page">
      <UiPageHero emoji="🏆" title="Aarded" subtitle="Skattkammaren" tone="gold" />

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
            <span>{{
              i > ri ? `${rank.xp} poäng` : difficultyLabel(medalStyleOf(profile.state.mstyle, rank.id))
            }}</span>
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
              <img v-if="row.rival.img" :src="row.rival.img" alt="" class="trophy-page__duel-img" />
              <template v-else>{{ row.rival.em }}</template>
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
        <section class="trophy-page__badges">
          <UiBadgeChip
            v-for="row in badgeRows"
            :key="row.badge.id"
            :badge="row.badge"
            :earned="row.earned"
            :progress="row.progress"
          />
        </section>
        <p class="trophy-page__stats">
          ⭐ {{ profile.state.stars }} stjärnor · {{ profile.state.correct }} rätta svar · 🔥 bästa kombo:
          {{ profile.state.bestcombo || 0 }} i rad
        </p>
      </UiAppCard>
    </main>
  </UiAppShell>
</template>

<style lang="scss" scoped>
// Bredd-begränsningen kommer från UiAppShell:s __content-omslag, inte härifrån.
.trophy-page {
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
    grid-template-columns: repeat(auto-fill, minmax(clamp(6rem, 25vw, 8.125rem), 1fr)); // 96px, 130px
    gap: 0.75rem; // 12px
    margin: 0.25rem 0 0; // 4px
    padding: 0;
    list-style: none;
  }

  &__medal {
    background: var(--card);
    border: $border-width solid var(--line);
    border-radius: $radius-card;
    padding: 0.5rem; // 8px
    text-align: center;
    box-shadow: $shadow-2;

    b {
      display: block;
      font-size: $font-size-md;
      margin-top: 0.25rem; // 4px
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
        0 0 0 0.25rem color-mix(in srgb, var(--honey) 35%, transparent),
        $shadow-2;
    }
  }

  &__quest-bar {
    display: block;
    width: 100%;
    height: 0.875rem; // 14px
    border-radius: $radius-lg;
    background: var(--line);
    margin-top: 0.5rem; // 8px
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
    padding: 0.5rem 0; // 8px
    border-bottom: 0.125rem dotted var(--line); // 2px
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
    font-size: 1.875rem; // 30px
    position: relative;
  }

  &__duel-img {
    width: 1.875rem; // 30px
    height: 1.875rem;
    object-fit: contain;
    vertical-align: middle;
  }

  &__duel-cup {
    position: absolute;
    right: -0.5rem; // -8px
    bottom: -0.25rem; // -4px
    font-size: 1rem; // 16px
  }

  &__stats {
    margin-top: 0.75rem; // 12px
  }
}
</style>
