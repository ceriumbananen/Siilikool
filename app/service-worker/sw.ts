/// <reference lib="webworker" />
/* Siilikool – offline (byggs av @vite-pwa/nuxt till /sw.js, samma adress som förut).

   - Appens filer (Nuxt-bygget, den gamla appen i /legacy/, ikoner, manifest) listas av bygget
     med en version per fil. Ändras något hämtas den nya versionen i bakgrunden och gamla filer
     städas bort – inget cachenamn behöver bytas för hand. Ny version gäller nästa gång appen öppnas.
   - Ljudklippen ändras aldrig och tas från cachen först. Hela teman hämtas i förväg när appen
     ber om det (meddelandet "precache" från app.js), och glosornas uttal lägger app.js själv
     i samma cache – därför heter den fortfarande "siilikool".
   - Safari hämtar ljud i bitar ("Range: bytes=0-1") och spelar bara upp om svaret är 206. */
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { RangeRequestsPlugin } from "workbox-range-requests";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { clientsClaim } from "workbox-core";

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<{ url: string; revision: string | null }> };

const AUDIO = "siilikool"; /* ljudklipp + glosornas uttal (namnet används också i app.js) */
const PARTS = "siilikool-ljuddelar"; /* audio/*.js: listor med ord → klipp */

self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

/* varje sidvisning får startsidan ur cachen (bygget listar den som "/") – också /index.html,
   som Cloudflare skickar vidare till / och som därför aldrig ska hämtas som egen fil */
registerRoute(new NavigationRoute(createHandlerBoundToURL("/")));

/* ljudklipp: cachen först, och bitar (206) ur hela filen när Safari ber om det */
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.includes("/audio/clips/"),
  new CacheFirst({
    cacheName: AUDIO,
    plugins: [new CacheableResponsePlugin({ statuses: [200] }), new RangeRequestsPlugin()],
  }),
);

/* ljuddelarna kan få nya ord: nätet först, cachen offline eller om nätet är segt */
registerRoute(
  ({ url }) => url.origin === self.location.origin && /\/audio\/[^/]+\.js$/.test(url.pathname),
  new NetworkFirst({ cacheName: PARTS, networkTimeoutSeconds: 3 }),
);

/* appen skickar en lista med klipp när en ljuddel laddas – hämta de som saknas, fyra åt gången */
self.addEventListener("message", (e: ExtendableMessageEvent) => {
  const d = e.data;
  if (!d || d.type !== "precache" || !Array.isArray(d.urls)) return;
  const urls: string[] = d.urls
    .map((u: string) => new URL(u, self.registration.scope).href)
    .filter((u: string) => new URL(u).origin === self.location.origin);
  e.waitUntil(
    caches.open(AUDIO).then(c => {
      let i = 0;
      const next = async (): Promise<void> => {
        while (i < urls.length) {
          const u = urls[i++]!;
          if (!(await c.match(u)))
            await c.add(u).catch(() => {
              /* hoppa över klipp som inte går att hämta */
            });
        }
      };
      return Promise.all([next(), next(), next(), next()]);
    }),
  );
});

/* städar bort det som den handskrivna service workern lämnade: caches med tidsstämpel i namnet,
   och appfiler/ljuddelar i "siilikool" (där ska bara ljudklipp ligga nu) */
self.addEventListener("activate", e => {
  e.waitUntil(
    (async () => {
      for (const k of await caches.keys()) if (/^siilikool-\d{12}$/.test(k)) await caches.delete(k);
      const c = await caches.open(AUDIO);
      for (const r of await c.keys()) if (!new URL(r.url).pathname.includes("/audio/clips/")) await c.delete(r);
    })(),
  );
});
