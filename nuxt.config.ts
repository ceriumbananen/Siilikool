// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-10-07",
  /* SPA: appen körs helt i webbläsaren (localStorage, ljud, service worker) och
     byggs till statiska filer för Cloudflare Pages med `nuxt generate` */
  ssr: false,
  devtools: { enabled: false },
  /* Pinia: delad data mellan den gamla koden och Vue (app/stores/profile.ts)
     PWA: service workern byggs från app/service-worker/sw.ts till /sw.js */
  modules: ["@pinia/nuxt", "@vite-pwa/nuxt"],
  pwa: {
    strategies: "injectManifest",
    srcDir: "service-worker",
    filename: "sw.ts",
    /* manifestet finns redan i public/manifest.webmanifest, och registreringen sköts av app/plugins/sw.client.ts */
    manifest: false,
    injectRegister: false,
    client: { registerPlugin: false },
    injectManifest: {
      /* appens filer sparas i förväg; ljudet (≈18 MB) hämtas när det behövs */
      globPatterns: ["**/*.{js,css,html,png,webmanifest}"],
      /* byggmanifesten (_nuxt/builds) är till för att upptäcka nya versioner – de ska alltid hämtas från nätet */
      globIgnores: ["audio/**", "200.html", "404.html", "sw.js", "_nuxt/builds/**"],
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
    },
    devOptions: { enabled: false },
  },
  /* inga manuella importer i app/: Vue, stores (app/stores), composables, utils och typer
     (shared/types) importeras automatiskt av Nuxt – Supabase-biblioteket läggs till här */
  imports: {
    presets: [
      {
        from: "@supabase/supabase-js",
        imports: ["createClient", { name: "Session", type: true }, { name: "SupabaseClient", type: true }],
      },
      /* QR-koden för familjekoden i föräldraläget */
      { from: "qrcode", imports: [{ name: "default", as: "QRCode" }] },
    ],
  },
  /* föräldrasidornas stil (avgränsad till .page, så den inte påverkar spelet) */
  css: ["~/assets/css/konto.css"],
  /* föräldrakonton (Supabase): sätts med NUXT_PUBLIC_SUPABASE_URL och NUXT_PUBLIC_SUPABASE_KEY
     vid bygget (lokalt i .env, på Cloudflare Pages som miljövariabler). Tomma = inga konton. */
  runtimeConfig: {
    public: { supabaseUrl: "", supabaseKey: "" },
  },
  /* sidorna utöver spelet får egna filer, så att Cloudflare svarar 200 på dem direkt */
  nitro: {
    prerender: { routes: ["/parent", "/join", "/connect", "/invite"] },
  },
  /* ingen Nuxt-laddningsskärm – appen har sin egen bakgrund i style.css */
  spaLoadingTemplate: false,
  app: {
    head: {
      htmlAttrs: { lang: "sv" },
      title: "Siilikool – lär dig estniska",
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        {
          name: "theme-color",
          content: "#2E6B45",
        },
        {
          name: "apple-mobile-web-app-title",
          content: "Siilikool",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "default",
        },
        {
          name: "mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "description",
          content: "Lär dig estniska med igelkotten Siiri – ord, meningar, uttal och en resa genom Estland.",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/icons/icon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "64x64",
          href: "/icons/icon-64x64.png",
        },
        {
          rel: "apple-touch-icon",
          type: "image/png",
          sizes: "180x180",
          href: "/icons/apple-touch-icon.png",
        },
        {
          rel: "manifest",
          href: "/manifest.webmanifest",
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap",
        },
        {
          rel: "stylesheet",
          href: "/legacy/style.css",
        },
      ],
    },
  },
});
