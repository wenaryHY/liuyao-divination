/* Service Worker for LiuYao PWA */
const CACHE_NAME = 'liuyao-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js',
  'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.asm.js',
  'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.asm.wasm',
  'https://cdn.jsdelivr.net/npm/lunar-javascript@latest/dist/lunar.esm.js'
];

// Install: 缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Cache First 策略
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 仅缓存同源或白名单 CDN
  const isAllowed = url.origin === location.origin ||
    url.hostname === 'cdn.jsdelivr.net';

  if (!isAllowed) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});