# Vue-konventioner

Gäller all ny kod under `app/`. Syftet: en komponent ska se likadan ut oavsett vem som
skrev den, och samma utseende (avstånd, typsnitt, radier) ska komma från samma källa
överallt, inte återuppfinnas per skärm.

Det här är inte en engångsstädning - det är den standard som `public/legacy/app.js`
(17 000+ rader vanilla JS) gradvis migreras mot, en skärm i taget. Se
`/Users/jonas/.claude/plans/smooth-foraging-boot.md` för själva migreringsplanen.

## Komponentens anatomi

```vue
<script setup lang="ts">
// 1. script
</script>

<template>
  <!-- 2. template -->
</template>

<style lang="scss" scoped>
// 3. style
</style>
```

Alltid i den ordningen. Alltid `<script setup lang="ts">` (aldrig Options API).

## Imports

- **Importera aldrig** Vue-funktioner (`ref`, `computed`, `watch`, ...), Pinia-stores
  (`app/stores/*`), composables (`app/composables/*`) eller utils (`app/utils/*`) manuellt.
  Nuxt auto-importerar allt detta redan - det är den etablerade konventionen i `app/`
  (se kommentaren ovanför `imports.presets` i `nuxt.config.ts`).
- **Importera aldrig** egna komponenter i template - de är PascalCase och auto-importeras
  av Nuxt utifrån filnamnet. En komponent direkt i `app/components/` blir sitt eget namn
  (`ConfirmAction.vue` → `<ConfirmAction>`); en komponent i en undermapp får mappnamnet
  som prefix (`app/components/parent/LockCard.vue` → `<ParentLockCard>`, `app/components/
ui/AppButton.vue` → `<UiAppButton>`) - det är Nuxts standardbeteende och redan etablerat
  av `parent/`-komponenterna, så nya undermappar följer samma mönster istället för att
  stänga av det.
- `imports.presets` i `nuxt.config.ts` är bara till för externa bibliotek som inte är
  Nuxt-medvetna (Supabase, qrcode) - lägg till fler där vid behov, rör inte annars.

## Props

```ts
/** Vilken variant knappen har. "primary" är standard och syns tydligast. */
const { variant = "primary", wide = false } = defineProps<{
  variant?: "primary" | "ghost" | "danger";
  wide?: boolean;
}>();
```

- `defineProps<{ ... }>()` med destrukturerade defaults (Vue 3.5+, `reactiveProps`-
  destrukturering - inget behov av `withDefaults`).
- Varje icke-obligatorisk prop har ett default-värde.
- `type`, aldrig `interface`, för propens typ.
- En `/** ... */`-kommentar per prop som förklarar VAD den styr, inte bara typen.
- Undvik `any`.

## Styles: tokens, inte hårdkodade värden

- **Skala** (typsnitt, avstånd, radier, skuggor, kantbredd) kommer från SCSS-variabler i
  `app/assets/scss/_tokens.scss` - `$font-size-*`, `$spacing-*`, `$radius-*`, `$shadow-*`,
  `$border-width`. Tillgängliga automatiskt i varje `<style lang="scss">`, ingen `@use`
  behövs.
- **Färg** kommer från CSS custom properties i `public/legacy/style.css` (`var(--ink)`,
  `var(--moss)`, `var(--berry)`, ...) - **aldrig** från SCSS-variabler eller hårdkodade
  hex-koder. Appen växlar de här färgerna i realtid för dark mode och färgteman; en
  SCSS-variabel är fixerad vid kompilering och skulle tysta förstöra det.
- Inga hårdkodade pixelvärden för avstånd/typsnitt/radier - hitta rätt token i
  `_tokens.scss` eller lägg till en ny där om skalan verkligen saknar den.
- **`rem`, inte `px`**, så långt det går - även för engångsvärden som inte har en egen token
  (t.ex. ett specifikt mått i en enda komponent). `rem` skalar med användarens egen
  textstorlek, `px` gör det inte. Undantag: SVG-koordinater (viewBox, path, cx/cy/r - de är
  enhetslösa ritenheter, inte CSS-mått) och `$radius-pill` (ett "garanterat större än allt"-
  värde för en fullständig pil-form, inte ett verkligt mått - se kommentaren i
  `_tokens.scss`).

## BEM i `<style scoped>`

Komponentens rotklass är blocket. En klass per del, modifierare med `--`:

```vue
<template>
  <button class="app-button" :class="{ 'app-button--ghost': variant === 'ghost', 'app-button--wide': wide }">
    <span class="app-button__label"><slot /></span>
  </button>
</template>

<style lang="scss" scoped>
.app-button {
  // ...
  &--ghost {
    /* ... */
  }
  &--wide {
    width: 100%;
  }
  &__label {
    /* ... */
  }
}
</style>
```

## Semantisk HTML och tillgänglighet

- Riktiga rubriker (`<h1>`-`<h3>`) för rubriker, inte `<p class="...">`.
- `<button>` för handlingar, `<a>` för navigation - aldrig en `<div>` med klickhanterare.
- `<label for="...">` på alla formulärfält.
- Dekorativa ikoner/SVG:er: `aria-hidden="true"`. Dekorativa bilder: `alt=""` (aldrig
  `alt="ikon"` eller liknande redundant text, och aldrig utan `alt` alls).
- Fokusindikator via `@include focus-visible` (i `_mixins.scss`, auto-tillgänglig) - skriv
  inte en egen `:focus-visible`-regel i komponenten.

## Vad som INTE gäller här

Projektet har inget Storybook och inget planerat - inga story-filer behövs för nya
komponenter.
