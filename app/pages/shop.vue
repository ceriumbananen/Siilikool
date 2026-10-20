<script setup lang="ts">
/* Laat (marknaden) - porterat från shopScreen()/shopCells()/buyOrWear()/furnShopHtml()/furnBuy()
   i public/legacy/app.js. Kläder till Siiri (hyllor per plats, säsongs- och högtidsvaror, svår
   nivå, drömmar) och möbler till hennes rum. Köpen firas som förut: fanfar, konfetti, dans och
   Siiri som säger plaggets namn. Rummet (Tuba) är app/pages/room.vue. */

useHead({ title: "Laat · Siilikool" });
const profile = useProfileStore();
const voice = useSiiriVoice();
const { tone, fanfare } = useSiiriSound();
const { burst, petals } = useConfetti();
const { dance, mood } = useSiiri();

const owned = computed(() => (profile.state.owned as string[] | undefined) || []);
const wear = computed(() => (profile.state.wear as Record<string, string | null> | undefined) || {});
const stars = computed(() => profile.state.stars || 0);
const hardWins = computed(() => (profile.state.hardWins as number | undefined) || 0);
const owns = (id: string) => owned.value.includes(id);
const wearing = (slot: string) => wear.value[slot] || null;
const available = (it: ShopItem) => itemAvailable(it, owned.value, hardWins.value);

/* hyllan för svår nivå: bara det som inte redan köpts */
const hardList = computed(() => SHOP.filter(it => it.hard && !owns(it.id) && available(it)));
const hardLocked = computed(() => SHOP.filter(it => it.hard && !owns(it.id) && !available(it)).length);
/* säsongs- och högtidsvaror som går att köpa nu */
const limitedList = computed(() => SHOP.filter(it => isLimited(it) && !it.hard && available(it) && !owns(it.id)));
const holiday = holidayNow();
const season = seasonNow();
const limitedTitle = holiday
  ? `${holiday.em} Bara idag: ${holiday.sv}`
  : `${season.em} Bara den här årstiden: ${season.sv}`;
/* vanliga hyllor, en per plats på Siiri */
const shelves = computed(() =>
  WEAR_SLOTS.map(slot => ({
    slot,
    items: SHOP.filter(it => it.slot === slot.id && !it.dream && !it.hard && available(it)),
  })).filter(s => s.items.length),
);
/* drömmarna, billigast (närmast) överst */
const dreams = computed(() =>
  SHOP.filter(it => it.dream)
    .slice()
    .sort((a, b) => a.price - b.price)
    .map(it => {
      const pct = Math.min(100, Math.round((stars.value / it.price) * 100));
      const have = owns(it.id);
      const status = have
        ? wearing(it.slot) === it.id
          ? "Du bär den ✓"
          : "I lådan – tryck för att ta på"
        : `${stars.value.toLocaleString("sv-SE")} av ${it.price.toLocaleString("sv-SE")} (${pct}%)`;
      return { it, pct, status };
    }),
);
const left = computed(() => SHOP.filter(it => !owns(it.id)).length);

/* ---------- rummets möbler ---------- */
const furnOwnedIds = computed(() => profile.state.furnOwned as string[] | undefined);
const room = computed(() => profile.state.room as Record<string, string> | undefined);
const furnShelves = computed(() =>
  FURN_SLOTS.map(([id, sv, em]) => ({
    id,
    title: `${em} ${sv}`,
    items: FURN.filter(f => f.slot === id && !f.def).map(f => {
      const own = furnOwned(f.id, furnOwnedIds.value);
      const on = furnOf(id, room.value, furnOwnedIds.value) === f.id;
      /* som plaggen: det man inte har råd med är grått och visar hur mycket som fattas */
      const cant = !own && stars.value < f.price;
      const label = own
        ? on
          ? "bärs nu"
          : "ägd — sätt in"
        : cant
          ? `🔒 ⭐ ${(f.price - stars.value).toLocaleString("sv-SE")} kvar`
          : `⭐ ${f.price}`;
      return { f, own, on, cant, label };
    }),
  })).filter(s => s.items.length),
);

/* ---------- köpa och klä på ---------- */
const bought = ref<{ item: ShopItem; tier: 1 | 2 | 3 } | null>(null);
const tooExpensive = ref<{ n: number; key: number } | null>(null);
let tooTimer: ReturnType<typeof setTimeout> | undefined;

/* bakgrunden byts på hela sidan (app/plugins/appearance.client.ts) - en liten studs markerar det */
function scenePop(ms: number) {
  document.body.classList.add("scenepop");
  setTimeout(() => document.body.classList.remove("scenepop"), ms);
}

/* "⭐ 120 kvar" en kort stund, och ett mjukt nej */
function notEnough(price: number) {
  clearTimeout(tooTimer);
  tooExpensive.value = { n: price - stars.value, key: Date.now() };
  tooTimer = setTimeout(() => (tooExpensive.value = null), 900);
  tone(300, 0.16, 0, "triangle");
  tone(210, 0.22, 0.13, "triangle");
}

function buyOrWear(it: ShopItem) {
  const s = profile.state;
  if (!owns(it.id)) {
    if (stars.value < it.price) return notEnough(it.price);
    s.stars -= it.price;
    s.owned = [...owned.value, it.id];
    s.wear = { ...wear.value, [it.slot]: it.id };
    profile.save();
    setTimeout(() => dance(it.price >= 1000), 500);
    const tier: 1 | 2 | 3 = it.price >= 2000 ? 3 : it.price >= 500 ? 2 : 1;
    fanfare(tier);
    burst(120 + tier * 90);
    if (tier >= 2) setTimeout(() => burst(140), 380);
    if (tier >= 3) {
      setTimeout(() => {
        burst(180);
        petals(70, ["#FFD45E", "#FFF3C4", "#FFE9A8"]);
      }, 760);
      setTimeout(() => burst(160), 1150);
    }
    mood("cheer");
    if (it.slot === "scene") scenePop(1200);
    setTimeout(() => voice.sayWord(it.et), tier >= 3 ? 1500 : 520);
    setTimeout(() => (bought.value = { item: it, tier }), 200);
    return;
  }
  const on = wearing(it.slot) === it.id;
  s.wear = { ...wear.value, [it.slot]: on ? null : it.id };
  profile.save();
  tone(on ? 520 : 760, 0.1, 0);
  if (!on && it.slot === "scene") {
    scenePop(1100);
    burst(90);
  }
  if (!on) voice.sayWord(it.et);
}

function furnBuy(f: FurnItem) {
  const s = profile.state;
  const setRoom = () => (s.room = { ...(room.value || {}), [f.slot]: f.id });
  if (furnOwned(f.id, furnOwnedIds.value)) {
    setRoom();
    profile.save();
    voice.sayWord(f.et);
    return;
  }
  if (stars.value < f.price) return notEnough(f.price);
  s.stars -= f.price;
  s.furnOwned = [...(furnOwnedIds.value || []), f.id];
  setRoom();
  profile.save();
  burst(120);
  fanfare(2);
  voice.sayWord(f.et);
  setTimeout(() => dance(f.price >= 600), 400);
}

function toRoom() {
  voice.sayWord("Siiri tuba");
  location.href = "/room";
}
</script>

<template>
  <UiAppShell active="shop">
    <main class="shop-page">
      <UiPageHero emoji="🎪" title="Laat" subtitle="Marknaden — som Mardilaat och Märtsilaat i Estland" tone="amber" />

      <UiAppCard class="shop-page__siiri">
        <p>
          Du har <b>⭐ {{ stars.toLocaleString("sv-SE") }}</b> stjärnor. Tryck för att köpa, tryck igen för att ta av.
        </p>
        <UiSiiriPortrait />
      </UiAppCard>

      <UiAppButton variant="primary" wide class="shop-page__to-room" @click="toRoom"
        >🏠 Siiri tuba · klä Siiri och möblera rummet</UiAppButton
      >

      <!-- möbler till rummet -->
      <UiAppCard class="shop-page__section">
        <h2 class="shop-page__kicker">🛋️ Tuba · Rummet</h2>
        <p class="shop-page__sub">Möbler, färger och saker till Siiris rum. Du byter fritt mellan det du äger.</p>
        <template v-for="shelf in furnShelves" :key="shelf.id">
          <h3 class="shop-page__furn-title">{{ shelf.title }}</h3>
          <div
            v-for="row in shelf.items"
            :key="row.f.id"
            class="shop-page__furn"
            :class="{
              'shop-page__furn--owned': row.own,
              'shop-page__furn--on': row.on,
              'shop-page__furn--cant': row.cant,
            }"
            @click="furnBuy(row.f)"
          >
            <button class="shop-page__say" aria-label="Hör namnet på estniska" @click.stop="voice.sayWord(row.f.et)">
              🔊
            </button>
            <button class="shop-page__furn-text" :aria-disabled="row.cant">
              <b lang="et">{{ row.f.et }}</b
              ><span>{{ row.f.sv }}</span>
            </button>
            <span class="shop-page__furn-price">{{ row.label }}</span>
          </div>
        </template>
      </UiAppCard>

      <!-- hyllan för svår nivå -->
      <UiAppCard v-if="hardList.length" class="shop-page__section shop-page__section--hard">
        <h2 class="shop-page__slot shop-page__slot--hard">🔥 Bara för svår nivå</h2>
        <p class="shop-page__sub">Du har klarat ett tema på svår — de här tre finns bara för dig.</p>
        <div class="shop-page__grid">
          <ShopCell
            v-for="it in hardList"
            :key="it.id"
            :item="it"
            :owned="owns(it.id)"
            :worn="wearing(it.slot) === it.id"
            :stars="stars"
            @click="buyOrWear(it)"
          />
        </div>
      </UiAppCard>
      <UiAppCard v-else-if="hardLocked" class="shop-page__section shop-page__section--locked">
        <h2 class="shop-page__slot">🔒 Tre plagg är låsta</h2>
        <p class="shop-page__sub">
          Eldkrona, blixtar och drakvingar öppnas när du klarar ett tema på <b>🔥 svår nivå</b>. Där finns också två
          hemligheter som inte går att hitta någon annanstans.
        </p>
      </UiAppCard>

      <!-- säsongshyllan -->
      <UiAppCard v-if="limitedList.length" class="shop-page__section shop-page__section--season">
        <h2 class="shop-page__slot shop-page__slot--season">{{ limitedTitle }}</h2>
        <p class="shop-page__sub">
          De här försvinner ur butiken när årstiden byts – men det du köpt får du behålla för alltid.
        </p>
        <div class="shop-page__grid">
          <ShopCell
            v-for="it in limitedList"
            :key="it.id"
            :item="it"
            :owned="owns(it.id)"
            :worn="wearing(it.slot) === it.id"
            :stars="stars"
            @click="buyOrWear(it)"
          />
        </div>
      </UiAppCard>

      <!-- vanliga hyllor -->
      <UiAppCard v-for="shelf in shelves" :key="shelf.slot.id" class="shop-page__section">
        <h2 class="shop-page__slot">{{ shelf.slot.sv }}</h2>
        <div class="shop-page__grid">
          <ShopCell
            v-for="it in shelf.items"
            :key="it.id"
            :item="it"
            :owned="owns(it.id)"
            :worn="wearing(it.slot) === it.id"
            :stars="stars"
            @click="buyOrWear(it)"
          />
        </div>
      </UiAppCard>

      <!-- drömmarna -->
      <section class="shop-page__dreams">
        <h2 class="shop-page__slot shop-page__slot--dream">🌠 Drömmar</h2>
        <p class="shop-page__sub shop-page__sub--dream">Långa sparmål. De tar tid – men tänk vad fint det blir.</p>
        <button v-for="d in dreams" :key="d.it.id" class="shop-page__dream" @click="buyOrWear(d.it)">
          <span class="shop-page__dream-em" aria-hidden="true">{{ d.it.em }}</span>
          <span class="shop-page__dream-text">
            <b lang="et">{{ d.it.et }}</b>
            <small>{{ d.it.sv }} · ⭐ {{ d.it.price.toLocaleString("sv-SE") }}</small>
            <span class="shop-page__dream-bar"><i :style="{ width: `${d.pct}%` }" /></span>
            <small>{{ d.status }}</small>
          </span>
        </button>
      </section>

      <p class="shop-page__note">
        <template v-if="left">
          {{ left }} saker kvar att spara till, varav några bara går att köpa vissa månader. Stjärnor får du för varje
          rätt svar – tre i rad ger dubbelt, fem i rad tredubbelt.
        </template>
        <template v-else>Du har köpt allt på marknaden! Siiri är världens finaste igelkott.</template>
      </p>
    </main>

    <!-- "⭐ 120 kvar" när det inte räcker -->
    <div v-if="tooExpensive" :key="tooExpensive.key" class="shop-page__too-expensive" aria-live="polite">
      ⭐ {{ tooExpensive.n }} kvar
    </div>
    <ShopBuyOverlay v-if="bought" :item="bought.item" :tier="bought.tier" @close="bought = null" />
  </UiAppShell>
</template>

<style lang="scss" scoped>
.shop-page {
  &__siiri {
    text-align: center;

    p {
      color: var(--muted);
      font-size: $font-size-sm;
      margin: 0 0 $spacing-2;
    }
  }

  &__to-room {
    margin: $spacing-3 0;
  }

  &__section {
    margin-top: $spacing-3;

    &--hard {
      border-color: var(--berry);
    }

    &--locked {
      opacity: 0.9;
    }

    &--season {
      border-color: var(--honey);
    }
  }

  &__kicker {
    font-size: $font-size-sm;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--muted);
    margin: 0;
  }

  &__slot {
    font-weight: 600;
    margin: 0 0 0.125rem;
    font-size: $font-size-md;
    color: var(--muted);

    &--hard {
      color: var(--berry);
    }

    &--season {
      color: var(--honey-deep);
    }

    &--dream {
      color: #e9deff;
    }
  }

  &__sub {
    color: var(--muted);
    font-size: $font-size-sm;
    margin: $spacing-1 0;

    &--dream {
      color: #c9bcef;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(clamp(5.75rem, 24vw, 7.75rem), 1fr)); // 92-124px
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  &__furn-title {
    font-size: $font-size-md;
    font-weight: 600;
    margin: $spacing-2 0 $spacing-1;
  }

  /* platta rader, inte kort-i-kort (varje rad hade förut egen bakgrund+ram som upprepade
     sektionskortets runtom - nu bara en delare mellan raderna, status syns som tonad
     bakgrund istället för en till inramning) */
  &__furn {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    border-bottom: $border-width solid var(--line);
    padding: $spacing-2 0.25rem;
    cursor: pointer;

    &:last-of-type {
      border-bottom: none;
    }

    &:active {
      transform: translateY(0.125rem);
    }

    &--owned {
      background: color-mix(in srgb, var(--moss) 8%, transparent);
    }

    &--on {
      background: color-mix(in srgb, var(--moss) 16%, transparent);
    }

    /* som plaggrutorna (ShopCell): grått och "inte nu" - 🔊 går fortfarande att trycka på */
    &--cant {
      cursor: not-allowed;

      > :not(.shop-page__say) {
        opacity: 0.55;
        filter: grayscale(0.85);
      }

      .shop-page__furn-text {
        cursor: not-allowed;
      }

      .shop-page__furn-price {
        color: var(--berry);
      }
    }
  }

  &__furn-text {
    flex: 1;
    min-width: 0;
    text-align: left;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    color: var(--ink);
    cursor: pointer;

    @include focus-visible;

    b {
      display: block;
      font-size: $font-size-md;
    }

    span {
      display: block;
      font-size: $font-size-xs;
      color: var(--muted);
    }
  }

  &__furn-price {
    font-weight: 800;
    font-size: $font-size-sm;
    white-space: nowrap;
  }

  &__say {
    width: 2.5rem; // 40px
    height: 2.5rem;
    flex: none;
    border-radius: 50%;
    border: none;
    background: var(--honey);
    cursor: pointer;
    box-shadow: $shadow-1;

    @include focus-visible;
  }

  &__dreams {
    margin-top: $spacing-3;
    background: linear-gradient(150deg, #2b2250, #150f30);
    border: $border-width solid #3d3170;
    border-radius: $radius-card;
    padding: $spacing-4;
    color: #fff;
    box-shadow: $shadow-3;
  }

  &__dream {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    width: 100%;
    text-align: left;
    background: rgba(255, 255, 255, 0.07);
    border: $border-width solid rgba(255, 255, 255, 0.18);
    border-radius: $radius-md;
    padding: 0.5rem 0.75rem;
    margin-top: 0.5rem;
    cursor: pointer;
    color: #fff;
    font: inherit;

    @include focus-visible;

    &:active {
      transform: translateY(0.125rem);
    }

    b {
      display: block;
      font-size: $font-size-md;
    }

    small {
      display: block;
      font-size: $font-size-xs;
      color: #c9bcef;
    }
  }

  &__dream-em {
    font-size: $font-size-2xl;
  }

  &__dream-text {
    flex: 1;
  }

  &__dream-bar {
    display: block;
    width: 100%;
    height: 0.625rem; // 10px
    margin: 0.25rem 0;
    border-radius: $radius-pill;
    background: rgba(255, 255, 255, 0.2);
    overflow: hidden;

    i {
      display: block;
      height: 100%;
      background: var(--honey);
    }
  }

  &__note {
    font-size: $font-size-sm;
    color: var(--muted);
    text-align: center;
    margin-top: 1.125rem; // 18px
    line-height: 1.5;
  }

  &__too-expensive {
    position: fixed;
    left: 50%;
    top: 22%;
    transform: translateX(-50%);
    z-index: 55;
    pointer-events: none;
    font-size: $font-size-2xl;
    font-weight: 700;
    color: var(--berry);
    text-shadow: 0 0.1875rem 0 rgba(0, 0, 0, 0.25);
    animation: shop-too-expensive 0.9s ease forwards;
  }
}

@keyframes shop-too-expensive {
  0% {
    opacity: 0;
    transform: translate(-50%, 0.5rem) scale(0.8);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, 0) scale(1.08);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -1.5rem) scale(1);
  }
}
</style>
