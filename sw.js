const CACHE_NAME = 'huerta-urbana-1776031128476'
const ARCHIVOS_CACHE = ['/style.css', '/script.js', '/img/favicon.png']

self.addEventListener('install', e => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ARCHIVOS_CACHE))
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  // index.html — SIEMPRE desde la red, nunca desde caché
  if (e.request.mode === 'navigate' || e.request.url.endsWith('index.html') || e.request.url.endsWith('/')) {
    e.respondWith(fetch(e.request))
    return
  }
  // Otros archivos — desde caché
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  )
})
