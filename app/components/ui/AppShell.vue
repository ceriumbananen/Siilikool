<script setup lang="ts">
/* Samma toppfält (profil/märke/stjärnor), nivåmätare och bottennavigering som spelets egna
 * skärmar har (LegacyApp.vue) - för Nuxt-sidor som migrerats ut ur app.js. Länkarna går till
 * hela sidladdningar (inte NuxtLink) eftersom den gamla appen bara kan starta en gång per
 * sidladdning (samma konvention som redan finns i app/app.vue). Profil- och märke-chipen samt
 * "Profiil"-fliken länkar till riktiga Nuxt-sidor (/profile, /trophy) - de andra flikarna
 * landar fortfarande på hemskärmen tills deras skärmar också flyttas ut ur app.js. */
const { active = null } = defineProps<{
  /** Vilken av de fem flikarna som ska visas som vald. Ingen flik representerar den här
   * sidan specifikt förrän spelet har en riktig router för sina skärmar, så standard är
   * att ingen är vald. */
  active?: "home" | "trip" | "shop" | "room" | "me" | null;
}>();

const profile = useProfileStore();
const ri = computed(() => rankIndex(profile.state.xp));
const rank = computed(() => RANKS[ri.value]!);
const nextRank = computed(() => RANKS[ri.value + 1]);
const xpPct = computed(() => {
  const next = nextRank.value;
  if (!next) return 100;
  return Math.max(0, Math.min(100, Math.round(((profile.state.xp - rank.value.xp) / (next.xp - rank.value.xp)) * 100)));
});
</script>

<template>
  <div class="app-shell">
    <div class="app-shell__content">
      <div class="app-shell__topbar">
        <a class="app-shell__iconbtn" href="/" aria-label="Till startskärmen">←</a>
        <a class="app-shell__chip app-shell__chip--me" href="/profile" aria-label="Öppna din profil">
          <i aria-hidden="true">{{ profile.state.avatar || "🦔" }}</i>
          <b>{{ profile.state.name || "Profil" }}</b>
        </a>
        <a class="app-shell__chip app-shell__chip--rank" href="/trophy" aria-label="Öppna skattkammaren">
          <UiMedalBadge :rank="rank" :locked="false" :medal-style="medalStyleOf(profile.state.mstyle, rank.id)" />
        </a>
        <a class="app-shell__chip" href="/" aria-label="Dina stjärnor – öppna marknaden">
          ⭐ <b>{{ profile.state.stars.toLocaleString("sv-SE") }}</b>
        </a>
        <span class="app-shell__spacer" />
      </div>
      <div class="app-shell__meter">
        <div class="app-shell__meter-top">
          <span>{{ nextRank ? `Nästa märke: ${nextRank.et} · ${nextRank.sv}` : `Högsta märket! ${rank.et}` }}</span>
          <span>
            {{
              nextRank
                ? `${(profile.state.xp - rank.xp).toLocaleString("sv-SE")} / ${(nextRank.xp - rank.xp).toLocaleString("sv-SE")}`
                : profile.state.xp.toLocaleString("sv-SE")
            }}
          </span>
        </div>
        <div class="app-shell__band" role="progressbar" :aria-valuenow="xpPct" :aria-valuemin="0" :aria-valuemax="100">
          <i :style="{ width: `${xpPct}%` }" />
        </div>
      </div>
      <slot />
    </div>
    <nav class="app-shell__nav">
      <a href="/" :class="{ 'app-shell__nav-btn--on': active === 'home' }" class="app-shell__nav-btn">
        <span class="app-shell__nav-emoji" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 4.5l13 7.5-13 7.5z" fill="currentColor" /></svg>
        </span>
        <b>Mängi</b><small>Spela</small>
      </a>
      <a href="/" :class="{ 'app-shell__nav-btn--on': active === 'trip' }" class="app-shell__nav-btn">
        <span class="app-shell__nav-emoji" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2z" fill="currentColor" opacity=".55" />
            <path d="M9 3v16l6 2V5z" fill="currentColor" />
          </svg>
        </span>
        <b>Teekond</b><small>Resan</small>
      </a>
      <a href="/" :class="{ 'app-shell__nav-btn--on': active === 'shop' }" class="app-shell__nav-btn">
        <span class="app-shell__nav-emoji" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M3 8l2-4h14l2 4z" fill="currentColor" opacity=".55" />
            <path d="M4 9h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2z" fill="currentColor" />
          </svg>
        </span>
        <b>Laat</b><small>Marknaden</small>
      </a>
      <a href="/" :class="{ 'app-shell__nav-btn--on': active === 'room' }" class="app-shell__nav-btn">
        <span class="app-shell__nav-emoji" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 3l9 8h-3v9H6v-9H3z" fill="currentColor" /></svg>
        </span>
        <b>Tuba</b><small>Rummet</small>
      </a>
      <a href="/profile" :class="{ 'app-shell__nav-btn--on': active === 'me' }" class="app-shell__nav-btn">
        <span class="app-shell__nav-emoji" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path d="M4 21a8 8 0 0116 0z" fill="currentColor" opacity=".6" />
          </svg>
        </span>
        <b>Profiil</b><small>Profil</small>
      </a>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.app-shell {
  &__content {
    @include content-width;
  }

  &__topbar {
    display: flex;
    align-items: center;
    gap: 0.5rem; // 8px
    row-gap: 0.25rem; // 4px
    padding: 0.5rem 0 0.25rem; // 8px, 4px
    flex-wrap: wrap;
  }

  &__iconbtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--card);
    border: $border-width solid var(--line);
    border-radius: $radius-lg;
    width: 2.875rem; // 46px
    height: 2.875rem;
    font-size: $font-size-lg;
    text-decoration: none;
    color: var(--ink);
    box-shadow: $shadow-3;
    @include focus-visible;
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem; // 4px
    background: var(--card);
    border: $border-width solid var(--line);
    border-radius: $radius-lg;
    padding: 0.25rem 0.75rem; // 4px, 12px
    font-weight: 600;
    font-size: $font-size-md;
    color: var(--ink);
    text-decoration: none;
    min-height: 2.75rem; // 44px
    box-shadow: $shadow-3;
    @include focus-visible;

    b {
      font-weight: 700;
    }

    i {
      font-style: normal;
      font-size: $font-size-lg;
    }

    &--me {
      padding-left: 0.5rem; // 8px

      b {
        max-width: 11ch;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &--rank {
      padding: 0.25rem 0.75rem 0.25rem 0.25rem; // 4px, 12px, 4px, 4px

      :deep(.medal-badge) {
        width: 1.875rem; // 30px
      }
    }
  }

  &__spacer {
    flex: 1;
  }

  &__meter {
    margin: 0.5rem 0 0.125rem; // 8px, 2px
  }

  &__meter-top {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-sm;
    color: var(--muted);
    font-weight: 500;
    margin-bottom: 0.25rem; // 4px
  }

  &__band {
    height: 1.125rem; // 18px
    border: $border-width solid var(--line);
    border-radius: $radius-lg;
    background: var(--card);
    overflow: hidden;
    position: relative;

    i {
      display: block;
      height: 100%;
      width: 0%;
      background: repeating-linear-gradient(
        135deg,
        var(--moss) 0 0.5625rem,
        color-mix(in srgb, var(--moss) 65%, white) 0.5625rem 1.125rem
      ); // 9px, 18px
      transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
  }

  &__nav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    max-width: 100vw;
    z-index: 40;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    background: color-mix(in srgb, var(--card) 92%, transparent);
    backdrop-filter: blur(10px);
    border-top: $border-width solid var(--line);
    padding-bottom: env(safe-area-inset-bottom, 0px);

    @media (min-width: 62.5rem) {
      // 1000px
      max-width: 56.25rem; // 900px
      margin: 0 auto;
      border-radius: $radius-lg $radius-lg 0 0;
    }

    @media (min-width: 87.5rem) {
      // 1400px
      max-width: 68.75rem; // 1100px
    }

    @media (min-width: 112.5rem) {
      // 1800px
      max-width: 82.5rem; // 1320px
    }
  }

  &__nav-btn {
    background: none;
    border: none;
    padding: 0.5rem 0.125rem 0.5rem; // 8px, 2px
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.125rem; // 2px
    color: var(--muted);
    font-weight: 600;
    text-decoration: none;
    @include focus-visible;

    small {
      font-size: clamp(0.6875rem, 1.9vw, 0.75rem); // 11-12px
      font-weight: 500;
      opacity: 0.85;
    }

    &--on {
      color: var(--blue);

      .app-shell__nav-emoji {
        transform: scale(1.12);
      }
    }
  }

  &__nav-emoji {
    font-size: $font-size-xl;
    line-height: 1.1;

    svg {
      width: 1.625rem; // 26px
      height: 1.625rem;
    }
  }
}
</style>
