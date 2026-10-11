<script setup lang="ts">
const {
  rank,
  locked = false,
  medalStyle = "lagom",
} = defineProps<{
  /** Nivån medaljen gäller - styr dess färger (rank.c1/c2/ring) och emoji. */
  rank: Rank;
  /** Olåsta märken visar rank.em mitt i; låsta visar ett hänglås istället. */
  locked?: boolean;
  /** Vilken svårighet medaljen togs på - styr bandets och strålkransens form. */
  medalStyle?: MedalStyle;
}>();

/* unika id:n per instans så flera medaljer på samma sida inte delar <defs> */
const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
const gradientId = `medal-gradient-${uid}`;
const clipId = `medal-clip-${uid}`;
</script>

<template>
  <svg class="medal-badge" viewBox="0 0 120 150" role="img" :aria-label="rank.sv">
    <defs>
      <radialGradient :id="gradientId" cx="35%" cy="28%" r="85%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".75" />
        <stop offset="22%" :stop-color="rank.c1" />
        <stop offset="62%" :stop-color="rank.c2" />
        <stop offset="100%" :stop-color="rank.ring" />
      </radialGradient>
      <clipPath :id="clipId"><circle cx="60" cy="88" r="40" /></clipPath>
    </defs>

    <!-- bandet bakom medaljen: formen beror på vilken svårighet den togs på -->
    <g v-if="medalStyle === 'latt'">
      <path d="M40 8 L56 8 L50 56 L32 50 Z" fill="#7FB08C" />
      <path d="M80 8 L64 8 L70 56 L88 50 Z" fill="#5C8F6C" />
    </g>
    <g v-else-if="medalStyle === 'svar'">
      <path d="M34 4 L54 4 L46 58 L24 50 Z" fill="#7B3BE0" />
      <path d="M86 4 L66 4 L74 58 L96 50 Z" fill="#4C1FA8" />
    </g>
    <g v-else>
      <path d="M34 6 L54 6 L46 58 L26 52 Z" fill="#C8305A" />
      <path d="M86 6 L66 6 L74 58 L94 52 Z" fill="#9E1F42" />
    </g>

    <!-- ramen: strålkrans på svår, enkel ring annars -->
    <g v-if="medalStyle === 'svar'">
      <path
        v-for="i in 12"
        :key="i"
        d="M60 88 L64 34 L56 34 Z"
        :fill="(i - 1) % 2 ? rank.c2 : rank.c1"
        :transform="`rotate(${(i - 1) * 30} 60 88)`"
        opacity=".8"
      />
      <circle cx="60" cy="88" r="43" :fill="rank.ring" />
    </g>
    <circle v-else-if="medalStyle === 'latt'" cx="60" cy="88" r="44" :fill="rank.ring" opacity=".85" />
    <circle v-else cx="60" cy="88" r="46" :fill="rank.ring" />

    <circle cx="60" cy="88" r="40" :fill="`url(#${gradientId})`" />
    <ellipse cx="48" cy="72" rx="17" ry="11" fill="#fff" opacity=".28" />

    <!-- dekoren runt mitten: löv på lätt, stjärnglans på svår, prickad ring annars -->
    <g v-if="medalStyle === 'latt'" opacity=".9">
      <path d="M22 96 Q16 84 24 76 Q32 84 27 96 Z" fill="#4E9A68" />
      <path d="M98 96 Q104 84 96 76 Q88 84 93 96 Z" fill="#4E9A68" />
    </g>
    <g v-else-if="medalStyle === 'svar'">
      <circle cx="60" cy="88" r="36" fill="none" stroke="#FFF3B0" stroke-width="2" />
      <path d="M60 46 l4 8 8 1 -6 6 2 8 -8 -4 -8 4 2 -8 -6 -6 8 -1 Z" fill="#FFF3B0" />
    </g>
    <circle
      v-else
      cx="60"
      cy="88"
      r="33"
      fill="none"
      stroke="rgba(255,255,255,.45)"
      stroke-width="2.5"
      stroke-dasharray="5 7"
    />

    <text v-if="locked" x="60" y="100" font-size="34" text-anchor="middle" aria-hidden="true">🔒</text>
    <template v-else>
      <text x="60" y="101" font-size="38" text-anchor="middle" aria-hidden="true">{{ rank.em }}</text>
      <g :clip-path="`url(#${clipId})`">
        <rect
          class="medal-badge__shine"
          x="-40"
          y="42"
          width="26"
          height="92"
          fill="rgba(255,255,255,.55)"
          transform="rotate(18 60 88)"
        />
      </g>
    </template>
  </svg>
</template>

<style lang="scss" scoped>
.medal-badge {
  width: 100%;
  max-width: 96px;
}
</style>
