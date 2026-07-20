/* Életmódváltás Pro – service worker
   Stratégia:
   - index.html (navigáció): NETWORK-FIRST, cache-busting URL-lel → online mindig a legfrissebb,
     offline a legutóbb elmentett verzió.
   - version.json: NETWORK-ONLY (soha nem cache-elt) → a frissítés-ellenőrzés mindig igazat mond.
   - statikus fájlok (atlaszok, ikonok): STALE-WHILE-REVALIDATE → gyors indulás + háttérben frissül.
   Fontos: NEM a {cache:"no-store"} opcióra hagyatkozunk (iOS Safariban megbízhatatlan),
   hanem egyedi ?_sw= query paraméterrel kerüljük meg minden réteg gyorsítótárát. */
const VERSION="2026.07.20.1";
const CACHE_PREFIX="eletmodvaltas-pro-";
const CACHE=CACHE_PREFIX+VERSION;
const CORE=[
  "./","./index.html","./manifest.webmanifest",
  "./exercise-atlas.webp","./strength-atlas.webp","./skill-atlas.webp",
  "./icon-180.png","./icon-192.png","./icon-512.png"
];

function scoped(path){ return new URL(path,self.registration.scope); }
function bust(path){ const u=scoped(path); u.searchParams.set("_sw",Date.now().toString(36)); return u.href; }

self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await Promise.all(CORE.map(async path=>{
      try{
        const res=await fetch(bust(path),{cache:"no-store"});
        if(res&&(res.ok||res.type==="opaque")) await cache.put(new Request(scoped(path)),res);
      }catch(e){/* offline telepítéskor kihagyjuk */}
    }));
    // ne várjunk a régi worker leállására
    await self.skipWaiting();
  })());
});

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message",event=>{
  const data=event.data;
  if(data==="skipWaiting"||(data&&data.type==="SKIP_WAITING")) self.skipWaiting();
  if(data&&data.type==="GET_VERSION"&&event.source) event.source.postMessage({type:"SW_VERSION",version:VERSION});
  if(data&&data.type==="PURGE_CACHES"){
    event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).then(()=>{
      if(event.source) event.source.postMessage({type:"PURGED"});
    }));
  }
});

async function handleNavigation(){
  const cache=await caches.open(CACHE);
  const canonical=new Request(scoped("./index.html"));
  try{
    const res=await fetch(bust("./index.html"),{cache:"no-store"});
    if(res&&res.ok){ await cache.put(canonical,res.clone()); return res; }
    throw new Error("bad-response");
  }catch(e){
    const hit=await cache.match(canonical,{ignoreSearch:true});
    if(hit) return hit;
    const root=await cache.match(new Request(scoped("./")),{ignoreSearch:true});
    if(root) return root;
    throw e;
  }
}

async function staleWhileRevalidate(request,event){
  const cache=await caches.open(CACHE);
  const hit=await cache.match(request,{ignoreSearch:true});
  const fetching=fetch(request).then(res=>{
    if(res&&res.ok) cache.put(request,res.clone());
    return res;
  }).catch(()=>null);
  if(hit){ if(event&&event.waitUntil) event.waitUntil(fetching); return hit; }
  const net=await fetching;
  if(net) return net;
  return fetch(request);
}

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET") return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;

  // version.json → mindig friss, hálózatról, cache nélkül
  if(url.pathname.endsWith("version.json")){
    event.respondWith(
      fetch(bust("./version.json"),{cache:"no-store"})
        .catch(()=>new Response(JSON.stringify({version:VERSION,offline:true}),{headers:{"content-type":"application/json"}}))
    );
    return;
  }

  const isNav=request.mode==="navigate"||(request.headers.get("accept")||"").includes("text/html");
  if(isNav){ event.respondWith(handleNavigation()); return; }

  event.respondWith(staleWhileRevalidate(request,event));
});
