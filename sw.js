const CACHE="eletmodvaltas-pro-v6";
const CORE=["./","index.html","exercise-atlas.webp","strength-atlas.webp","skill-atlas.webp","icon-180.png","icon-512.png","manifest.webmanifest"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("message",event=>{ if(event.data==="skipWaiting") self.skipWaiting(); });
self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET"||new URL(req.url).origin!==location.origin)return;
  const isHTML = req.mode==="navigate" || (req.headers.get("accept")||"").indexOf("text/html")>=0;
  if(isHTML){
    event.respondWith(
      fetch(req).then(res=>{ const copy=res.clone(); caches.open(CACHE).then(c=>c.put("index.html",copy)); return res; })
        .catch(()=>caches.match(req).then(hit=>hit||caches.match("index.html")))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then(hit=> hit || fetch(req).then(res=>{ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return res; }).catch(()=>hit))
  );
});
