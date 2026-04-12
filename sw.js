const CACHE = 'huerta-urbana-v1'
const ARCHIVOS = ['/', '/index.html', '/style.css', '/script.js', '/img/favicon.png']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)))
})

self.addEventListener('activate', e => {
  // Limpiar caches viejas al activar nueva versión
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  )
})
