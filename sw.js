// Only static application files are cached. Firebase API requests are never cached here.
// 科目管理版：啟用後清除舊版應用程式快取。
const CACHE='classroom-601-v4';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(path=>new Request(new URL(path,self.registration.scope).href,{cache:'reload'}))))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(key=>key.startsWith('classroom-601-')&&key!==CACHE).map(key=>caches.delete(key)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET') return;
 const url=new URL(event.request.url);
 const allowed=FILES.map(path=>new URL(path,self.registration.scope).href);
 if(url.origin!==self.location.origin || !allowed.includes(url.href)) return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok) { const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy))); }
  return response;
 }).catch(()=>caches.match(event.request).then(hit=>hit||Response.error())));
});
