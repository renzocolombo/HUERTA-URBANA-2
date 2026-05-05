const CACHE_NAME = 'huerta-urbana-static-v77';
const ASSETS = [
  './',
  './style.css?v=54.0',
  './script.js?v=54.0',
  './auth.js?v=51.0',
  './img/favicon.png',
  './manifest.json',
  './img/icon-maskable-192.png',
  './img/icon-maskable-512.png'
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

  // 1. Datos externos y Precios: Network Only (Siempre red, nunca caché)
  if (url.pathname.includes('precios.json') || url.hostname.includes('script.google.com')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // 2. Archivos críticos: Network First (Priorizar red para frescura, fallback a caché si offline)
  const isNetworkFirst = 
    e.request.mode === 'navigate' || 
    url.pathname.endsWith('index.html') || 
    url.pathname === '/' ||
    url.pathname.includes('script.js') ||
    url.pathname.includes('style.css') ||
    url.pathname.includes('auth.js');

  if (isNetworkFirst) {
    e.respondWith(
      fetch(e.request)
        .catch(() => {
          console.log('[SW] Modo offline: sirviendo desde caché', url.pathname);
          return caches.match(e.request, { ignoreSearch: true });
        })
    );
    return;
  }

  // 3. Resto de assets: Cache First (Velocidad para imágenes/iconos)
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((response) => {
      return response || fetch(e.request);
    })
  );
});
