const CACHE="eletmodvaltas-pro-v5";
const CORE=["./","index.html","exercise-atlas.webp","strength-atlas.webp","skill-atlas.webp","icon-180.png","icon-512.png","manifest.webmanifest"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET"||new URL(req.url).origin!==location.origin)return;
  event.respondWith(
    caches.match(req).then(hit=>hit||fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));return res;}).catch(()=>{ if(req.mode==="navigate") return caches.match("index.html"); }))
  );
});
