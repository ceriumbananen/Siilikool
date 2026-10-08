<script setup lang="ts">
/* Dagens app (public/legacy) körs här oförändrad, tills skärmarna flyttats till Vue en i taget.
   Den behöver att markupen nedan finns i DOM:en innan skripten körs, och sköter sedan själv
   allt innehåll. Vue ritar markupen en gång (v-pre) och rör den sedan inte. */
const scripts = ["/legacy/data.js", "/legacy/app.js"];

function load(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Kunde inte ladda " + src));
    document.body.appendChild(s);
  });
}

onMounted(async () => {
  const w = window as unknown as { __siiriLegacy?: boolean };
  if (w.__siiriLegacy) return; /* bara en gång, även om komponenten monteras om i dev */
  w.__siiriLegacy = true;
  /* hämta barnets spel och läxor från föräldrakontot först (högst 2,5 s – annars startar spelet
     med det som finns på enheten och synkar när svaret kommer) */
  await useCloudStore().whenReady(2500);
  for (const src of scripts) await load(src); /* i ordning: app.js behöver datan */
});
</script>

<template>
  <div class="legacy" v-pre>
    <canvas id="fx"></canvas>
    <div class="wrap">
      <div class="topbar">
        <button class="iconbtn" id="back" hidden aria-label="Tillbaka">←</button>
        <button class="mechip" id="mechip" aria-label="Öppna din profil">
          <i id="meav">🦔</i><b id="mename">Profil</b>
        </button>
        <button class="rankchip" id="rankchip" aria-label="Öppna skattkammaren"><span id="rankmini"></span></button>
        <span class="chip">⭐ <b id="stars">0</b></span>
        <span class="spacer"></span>
        <button class="iconbtn" id="sound" aria-label="Ljud på eller av" hidden>🔊</button>
        <button class="iconbtn" id="theme" aria-label="Byt mellan ljust och mörkt" hidden>🌙</button>
        <button class="iconbtn" id="starchip" aria-label="Öppna garderoben">⭐</button>
      </div>
      <div class="meter">
        <div class="meter-top"><span id="lvltext">Nivå 1</span><span id="xptext">0 / 100</span></div>
        <div class="band"><i id="bandfill"></i></div>
      </div>
      <main id="app"></main>
    </div>
    <svg id="siiridefs" width="0" height="0" style="position: absolute" aria-hidden="true">
      <defs></defs>
    </svg>
    <nav class="navbar" id="nav" hidden>
      <button data-nav="home">
        <span class="nem"
          ><svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 4.5l13 7.5-13 7.5z" fill="currentColor" /></svg></span
        ><b>Mängi</b><small>Spela</small>
      </button>
      <button data-nav="trip">
        <span class="nem"
          ><svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2z" fill="currentColor" opacity=".55" />
            <path d="M9 3v16l6 2V5z" fill="currentColor" /></svg></span
        ><b>Teekond</b><small>Resan</small>
      </button>
      <button data-nav="words">
        <span class="nem"
          ><svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5.5A2.5 2.5 0 016.5 3H11v17H6.5A2.5 2.5 0 014 17.5z" fill="currentColor" opacity=".55" />
            <path d="M20 5.5A2.5 2.5 0 0017.5 3H13v17h4.5a2.5 2.5 0 002.5-2.5z" fill="currentColor" /></svg></span
        ><b>Sõnastik</b><small>Ordlistan</small>
      </button>
      <button data-nav="shop">
        <span class="nem"
          ><svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 8l2-4h14l2 4z" fill="currentColor" opacity=".55" />
            <path d="M4 9h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2z" fill="currentColor" /></svg></span
        ><b>Laat</b><small>Marknaden</small>
      </button>
      <button data-nav="room">
        <span class="nem"
          ><svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3l9 8h-3v9H6v-9H3z" fill="currentColor" /></svg></span
        ><b>Tuba</b><small>Rummet</small>
      </button>
      <button data-nav="me">
        <span class="nem"
          ><svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path d="M4 21a8 8 0 0116 0z" fill="currentColor" opacity=".6" /></svg></span
        ><b>Profiil</b><small>Profil</small>
      </button>
    </nav>
  </div>
</template>
