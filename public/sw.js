const CACHE_NAME = 'omra-palon-v1'

const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/favicon.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // Always bypass for non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Bypass cache for Supabase API or navigation (page loads) to avoid redirect errors
  if (
    event.request.url.includes('supabase') ||
    event.request.mode === 'navigate'
  ) {
    return
  }

  // Cache-first for static assets only
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        // Don't cache opaque or error responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }
        
        const responseClone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone)
        })
        return response
      })
    })
  )
})
