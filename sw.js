const CACHE_NAME = 'huerta-urbana-dummy-cache-v1';

// Service worker minimal — dummy, no real caching
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Always fetch from network to ensure prices are always updated
  e.respondWith(fetch(e.request));
});
