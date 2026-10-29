<script setup lang="ts">
/* Buggrapport: "barnen vill ha en preview på saker man kan köpa så man ser saken bra innan
   man köper den" - idag syns bara en liten emoji (plagg) eller ingenting alls (möbler) i
   butikshyllan. Den här rutan visar grejen stort INNAN man betalar:
   - plagg: Siiri själv, precis som hon skulle se ut med det på (samma wearSVG-teckningar som
     när man faktiskt äger och bär det - UiSiiriPortrait tar emot previewWear/previewOwned för
     det, rör aldrig den riktiga S.wear/S.owned).
   - möbler: hela rummet, med bara den här platsen bytt ut mot det man tittar på (roomSVG tar
     redan furnOf som en callback, så vi skickar in en version som svarar med det förhandsvisade
     id:t för just den platsen, och det riktiga för alla andra - samma teknik, inget nytt API). */
const props = defineProps<{
  kind: "wear" | "furn";
  /** kind === "wear" */
  wearItem?: ShopItem;
  /** Record<string, string | null> i sidorna (S.wear kan ha null), men wearSVG/UiSiiriPortrait
   * vill ha Wear (string | undefined) - samma falsy-värde åt båda hållen, bara TS-formen skiljer. */
  wear?: Record<string, string | null>;
  ownedIds?: string[];
  owns?: boolean;
  worn?: boolean;
  /** kind === "furn" */
  furnItem?: FurnItem;
  furnOf?: (slot: string) => string | null;
  diplomas?: Record<string, number>;
  tripDone?: number;
  own?: boolean;
  on?: boolean;
  cant?: boolean;
  /** gemensamt */
  stars: number;
}>();
const emit = defineEmits<{ close: []; buy: [] }>();
const voice = useSiiriVoice();

const title = computed(() => (props.kind === "wear" ? props.wearItem! : props.furnItem!));
const em = computed(() => (props.kind === "wear" ? props.wearItem!.em : null));

/* vissa saker har en egen kulturell/historisk historia (ROOM_LORE i app/utils/room-lore.ts) -
   visa den redan här, innan man köper, inte bara när man råkar trycka på den sen i rummet. */
const lore = computed(() => ROOM_LORE[title.value.id] || null);
const loreShowEt = ref(true);

/* ---------- plagg: Siiri med det på, utan att röra profilen ---------- */
const previewWear = computed<Wear>(
  () => ({ ...(props.wear || {}), [props.wearItem!.slot]: props.wearItem!.id }) as unknown as Wear,
);
const previewOwnedIds = computed(() => [...(props.ownedIds || []), props.wearItem!.id]);

/* ---------- möbel: rummet med bara den här platsen utbytt ---------- */
const previewRoomHtml = computed(() =>
  roomSVG({
    furnOf: slot => (slot === props.furnItem!.slot ? props.furnItem!.id : (props.furnOf?.(slot) ?? null)),
    diplomas: props.diplomas || {},
    tripDone: props.tripDone || 0,
  }),
);

/* ---------- köp-knappen: samma text/låsningar som ShopCell/butikens möbelrader ---------- */
const afford = computed(() => props.stars >= title.value.price);
const buyLabel = computed(() => {
  if (props.kind === "wear") {
    if (props.owns) return props.worn ? "Ta av" : "Ta på";
    if (afford.value) return `Köp för ⭐ ${props.wearItem!.price.toLocaleString("sv-SE")}`;
    return `🔒 ⭐ ${(props.wearItem!.price - props.stars).toLocaleString("sv-SE")} kvar`;
  }
  if (props.own) return props.on ? "Insatt ✓" : "Sätt in";
  if (!props.cant) return `Köp för ⭐ ${props.furnItem!.price.toLocaleString("sv-SE")}`;
  return `🔒 ⭐ ${(props.furnItem!.price - props.stars).toLocaleString("sv-SE")} kvar`;
});
const buyDisabled = computed(() => (props.kind === "wear" ? !props.owns && !afford.value : !props.own && !!props.cant));
</script>

<template>
  <div class="shop-preview" role="dialog" aria-modal="true">
    <div class="shop-preview__card">
      <button class="shop-preview__close" aria-label="Stäng förhandsgranskningen" @click="emit('close')">✕</button>
      <p class="shop-preview__kicker">Förhandsgranskning</p>
      <div v-if="kind === 'wear'" class="shop-preview__wear">
        <UiSiiriPortrait size="big" :preview-wear="previewWear" :preview-owned="previewOwnedIds" />
      </div>
      <div v-else class="shop-preview__room" v-html="previewRoomHtml" />
      <span v-if="em" class="shop-preview__em" aria-hidden="true">{{ em }}</span>
      <h3 lang="et">{{ title.et }}</h3>
      <p>{{ title.sv }}</p>
      <button v-if="kind === 'wear'" class="shop-preview__say" aria-label="Hör ordet" @click="voice.sayWord(title.et)">
        🔊
      </button>
      <div v-if="lore" class="shop-preview__lore">
        <p :lang="loreShowEt ? 'et' : 'sv'">{{ loreShowEt ? lore.factEt : lore.fact }}</p>
        <button class="shop-preview__lore-toggle" @click="loreShowEt = !loreShowEt">
          {{ loreShowEt ? "🇸🇪 På svenska" : "🇪🇪 Eesti keeles" }}
        </button>
      </div>
      <div class="shop-preview__actions">
        <UiAppButton variant="ghost" @click="emit('close')">Stäng</UiAppButton>
        <UiAppButton variant="primary" :disabled="buyDisabled" @click="emit('buy')">{{ buyLabel }}</UiAppButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shop-preview {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-3;
  background: rgba(12, 28, 18, 0.72);

  &__card {
    position: relative;
    background: var(--card);
    border: $border-width solid var(--line);
    border-radius: $radius-card;
    padding: $spacing-4;
    max-width: 22rem; // 352px
    width: 100%;
    text-align: center;
    box-shadow: $shadow-3;

    h3 {
      font-size: $font-size-xl;
      margin: $spacing-1 0 0;
    }

    p {
      margin: 0 0 $spacing-2;
      color: var(--muted);
    }
  }

  &__close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 2.25rem; // 36px
    height: 2.25rem;
    border-radius: 50%;
    border: none;
    background: var(--line);
    color: var(--ink);
    cursor: pointer;

    @include focus-visible;
  }

  &__kicker {
    font-size: $font-size-xs;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--muted);
    margin: 0 0 $spacing-1 !important;
  }

  &__wear {
    margin: 0 auto;
  }

  /* rummets egna animationer (eld, glöd m.m.) finns i public/legacy/style.css (.roomsvg) -
     samma deep-genomslag som room.vue använder för den riktiga, levande scenen. */
  &__room {
    border-radius: $radius-md;
    overflow: hidden;
    margin: 0 auto $spacing-2;
    line-height: 0;

    :deep(.roomsvg) {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  &__em {
    font-size: 2.5rem; // 40px
    line-height: 1.1;
    display: block;
  }

  &__say {
    width: 2.75rem; // 44px
    height: 2.75rem;
    border-radius: 50%;
    border: none;
    background: var(--honey);
    font-size: $font-size-lg;
    cursor: pointer;
    box-shadow: $shadow-2;
    margin-bottom: $spacing-2;

    @include focus-visible;
  }

  &__lore {
    background: var(--bg);
    border: $border-width solid var(--line);
    border-radius: $radius-md;
    padding: $spacing-2;
    margin: 0 0 $spacing-2;
    text-align: left;

    p {
      margin: 0 0 $spacing-1;
      color: var(--ink);
      font-size: $font-size-sm;
    }
  }

  &__lore-toggle {
    border: none;
    background: none;
    color: var(--muted);
    font-size: $font-size-xs;
    font-weight: 700;
    cursor: pointer;
    padding: 0;

    @include focus-visible;
  }

  &__actions {
    display: flex;
    gap: $spacing-2;
    justify-content: center;
    margin-top: $spacing-2;

    :deep(.app-button) {
      flex: 1;
    }

    :deep(.app-button:disabled) {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }
}
</style>
