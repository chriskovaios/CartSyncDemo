const CACHE_NAME ='cartsync-pwa-cache-v0.0.58';
const urlsToCache = [
  '/CartSyncDemo/',
  '/CartSyncDemo/index.html',
  '/CartSyncDemo/favicon.ico',
  '/CartSyncDemo/manifest.json',
  '/CartSyncDemo/logo192.png',
  '/CartSyncDemo/logo512.png',
  // Add more static assets like CSS, JS files as needed
];

// Install the service worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...');
  self.skipWaiting(); // Activate worker immediately
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
  event.waitUntil(self.clients.claim()); // Take control of all clients immediately
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
          }
        })
      );
    }).then(() => {
      // Force all clients to reload
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach(client => {
          client.navigate(client.url);
        });
      });
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
