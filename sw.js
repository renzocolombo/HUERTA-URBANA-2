const CACHE = 'huerta-urbana-v1'

self.addEventListener('install', e => {
  self.skipWaiting() // Activar inmediatamente
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key))) // Borrar todo el caché viejo
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  // Para el index.html — siempre buscar la versión nueva de la red
  if (e.request.url.includes('index.html') || e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request))
    return
  }
  // Para otros archivos — usar caché
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  )
})
