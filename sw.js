const CACHE_NAME = 'huerta-urbana-static-v1';
const ASSETS = [
  '/',
  '/style.css',
  '/script.js',
  '/img/favicon.png',
  '/manifest.json',
  '/img/icon-192.png',
  '/img/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando assets estáticos');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Borrando caché viejo:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // 1. Navegación e index.html: Siempre red
  if (e.request.mode === 'navigate' || url.pathname.endsWith('index.html')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // 2. Precios: Siempre red
  if (url.pathname.includes('precios.json')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // 3. Resto: Cache-first, luego red
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
