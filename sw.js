/* Siilikool – offline.
   Appens filer hämtas från nätet först (så att alla får nya versionen direkt) och
   från cachen när man är offline. Ljudklippen ändras aldrig och tas från cachen först.
   Cachenamnet behöver därför inte bytas vid nya versioner. */
var CACHE = "siilikool";
var SHELL = ["./", "./index.html", "./app.js", "./style.css"];
var TIMEOUT = 3000;   /* så länge väntar vi på nätet innan cachen får svara */

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL).catch(function () { }) }));
});
self.addEventListener("activate", function (e) {
  /* rensar bort gamla cacher med tidsstämpel i namnet */
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k) }));
  }).then(function () { return self.clients.claim() }));
});

/* appen skickar en lista med klipp när en ljuddel laddas – hämta de som saknas, några åt gången */
self.addEventListener("message", function (e) {
  var d = e.data;
  if (!d || d.type !== "precache" || !Array.isArray(d.urls)) return;
  var urls = d.urls.map(function (u) { return new URL(u, self.registration.scope).href })
    .filter(function (u) { return new URL(u).origin === location.origin });
  e.waitUntil(caches.open(CACHE).then(function (c) {
    var i = 0;
    function next() {
      if (i >= urls.length) return;
      var u = urls[i++];
      return c.match(u).then(function (hit) { return hit || c.add(u).catch(function () { }) }).then(next);
    }
    return Promise.all([next(), next(), next(), next()]);
  }));
});

function store(req, res) {
  if (res && res.status === 200) {
    var copy = res.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copy) });
  }
  return res;
}

/* Safari hämtar ljud i bitar ("Range: bytes=0-1") och spelar inte upp om svaret
   är hela filen – skär därför ut den bit som efterfrågas och svara med 206 */
function partial(req, res) {
  var range = req.headers.get("range");
  if (!range || !res || res.status !== 200) return res;
  return res.arrayBuffer().then(function (buf) {
    var size = buf.byteLength, m = /bytes=(\d*)-(\d*)/.exec(range), start, end;
    if (!m) return new Response(buf, { status: 200, headers: res.headers });
    if (m[1] === "") { start = Math.max(0, size - parseInt(m[2], 10)); end = size - 1 }
    else { start = parseInt(m[1], 10); end = m[2] ? Math.min(parseInt(m[2], 10), size - 1) : size - 1 }
    if (start >= size || start > end) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + size } });
    return new Response(buf.slice(start, end + 1), {
      status: 206, statusText: "Partial Content",
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "audio/mpeg",
        "Content-Range": "bytes " + start + "-" + end + "/" + size,
        "Content-Length": String(end - start + 1),
        "Accept-Ranges": "bytes"
      }
    });
  });
}

/* ljudklipp: cachen först, annars hela filen från nätet (och spara) */
function cacheFirst(req) {
  return caches.match(req.url).then(function (hit) {
    return hit || fetch(req.url, { credentials: "same-origin" }).then(function (res) { return store(req.url, res) });
  }).then(function (res) { return partial(req, res) });
}

/* appens filer: nätet först; offline eller segt nät -> cachen */
function networkFirst(req) {
  var key = req.url;
  var net = fetch(key, { cache: "no-cache", credentials: "same-origin" })
    .then(function (res) { return store(key, res) });
  var fromCache = function () {
    return caches.match(key).then(function (hit) {
      if (hit) return hit;
      if (req.mode === "navigate") return caches.match("./index.html");
    });
  };
  return new Promise(function (resolve) {
    var done = false;
    function finish(res) { if (!done && res) { done = true; resolve(res) } }
    /* nätet svarade inte i tid: ta cachen om den finns, annars fortsätt vänta */
    var t = setTimeout(function () { fromCache().then(finish) }, TIMEOUT);
    net.then(function (res) { clearTimeout(t); finish(res) }, function () {
      clearTimeout(t);
      fromCache().then(function (hit) { finish(hit || Response.error()) });
    });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.indexOf("/audio/clips/") >= 0) e.respondWith(cacheFirst(req));
  else e.respondWith(networkFirst(req));
});
