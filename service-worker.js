const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/geojson/dogparkGR.geojson',
  '/geojson/petgroomingGR.geojson',
  '/geojson/petshopGR.geojson',
  '/geojson/veterinaryGR.geojson',
  // Add more static assets like CSS, JS files as needed
];

// Install the service worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...');
  
  // Cache files during installation
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all assets');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate the service worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker...');
  
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event to serve cached files when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If found in cache, return the cached response
      if (response) {
        return response;
      }

      // If not found, fetch from the network
      return fetch(event.request).catch(() => {
        // Fallback message for failed network fetches (like when offline)
        return caches.match('/index.html');
      });
    })
  );
});
