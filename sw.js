<<<<<<< HEAD
// Service worker minimal — sin caché
self.addEventListener('install', () => self.skipWaiting())
=======
const CACHE_NAME = 'huerta-urbana-1776032966454'
const ARCHIVOS_CACHE = ['/style.css', '/script.js', '/img/favicon.png']

self.addEventListener('install', e => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ARCHIVOS_CACHE))
  )
})

>>>>>>> 6228cb29868d55b2910eb5a74b0f0a2a718892e1
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  )
  self.clients.claim()
})
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request))
})
