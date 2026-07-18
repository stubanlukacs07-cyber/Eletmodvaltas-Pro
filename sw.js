const VERSION="2026.07.18.11";
const CACHE_PREFIX="eletmodvaltas-pro-";
const CACHE=CACHE_PREFIX+VERSION;
const CORE=[
  "./","./index.html","./version.json","./manifest.webmanifest",
  "./exercise-atlas.webp","./strength-atlas.webp","./skill-atlas.webp",
  "./icon-180.png","./icon-192.png","./icon-512.png"
];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE.map(url=>new Request(new URL(url,self.registration.scope),{cache:"reload"})))));
});

self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener("message",event=>{
  const data=event.data;
  if(data==="skipWaiting"||(data&&data.type==="SKIP_WAITING"))self.skipWaiting();
  if(data&&data.type==="GET_VERSION"&&event.source)event.source.postMessage({type:"SW_VERSION",version:VERSION});
});

async function networkFirst(request,isNavigation){
  const cache=await caches.open(CACHE);
  const url=new URL(request.url);
  const canonical=isNavigation
    ? new Request(new URL("./index.html",self.registration.scope))
    : (url.pathname.endsWith("/version.json")
      ? new Request(new URL("./version.json",self.registration.scope))
      : request);
  try{
    const response=await fetch(request,{cache:"no-store"});
    if(response&&response.ok){
      await cache.put(canonical,response.clone());
    }
    return response;
  }catch(error){
    const hit=await cache.match(canonical,{ignoreSearch:true});
    if(hit)return hit;
    throw error;
  }
}

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  const isNavigation=request.mode==="navigate"||(request.headers.get("accept")||"").includes("text/html");
  event.respondWith(networkFirst(request,isNavigation));
});
