/* Siilikool – offline. Cachar appen och ljuddelarna allt eftersom de används. */
var CACHE="siilikool-202610040935";
self.addEventListener("install",function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(["./","./index.html"]).catch(function(){}) }));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ if(k!==CACHE)return caches.delete(k) }));
  }).then(function(){ return self.clients.claim() }));
});
self.addEventListener("fetch",function(e){
  var req=e.request;
  if(req.method!=="GET")return;
  var url=new URL(req.url);
  if(url.origin!==location.origin)return;
  e.respondWith(
    caches.match(req).then(function(hit){
      if(hit)return hit;
      return fetch(req).then(function(res){
        if(res&&res.status===200){
          var copy=res.clone();
          caches.open(CACHE).then(function(c){ c.put(req,copy) });
        }
        return res;
      }).catch(function(){
        return caches.match("./index.html");
      });
    })
  );
});
