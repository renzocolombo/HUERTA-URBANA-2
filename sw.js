const CACHE_NAME = 'huerta-urbana-static-v29';
const ASSETS = [
  './',
  './style.css?v=10.0',
  './script.js?v=10.0',
  './auth.js?v=6.0',
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

  // 1. Navegación e index.html: Network First (Priorizar red para frescura, fallback a caché para PWA)
  if (e.request.mode === 'navigate' || url.pathname.endsWith('index.html') || url.pathname === '/') {
    e.respondWith(
      fetch(e.request)
        .catch(() => {
          console.log('[SW] Modo offline: sirviendo desde caché');
          return caches.match('/', { ignoreSearch: true });
        })
    );
    return;
  }

  // 2. Precios: Network Only (Siempre red para datos críticos)
  if (url.pathname.includes('precios.json') || url.pathname.includes('getPreciosWeb')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // 3. Resto de assets: Cache First (Velocidad para CSS/JS/Iconos)
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((response) => {
      return response || fetch(e.request);
    })
  );
});
