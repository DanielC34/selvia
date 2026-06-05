const CACHE_VERSION = 'v2_20260605';
const CACHE_NAME = `selvia-cache-${CACHE_VERSION}`;

const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/selvia_logo.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching core static assets:', ASSETS_TO_CACHE);
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => {
      console.error('[Service Worker] Install pre-cache failed:', err);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating & cleaning up older caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name.startsWith('selvia-') && name !== CACHE_NAME) {
            console.log('[Service Worker] Deleting obsolete cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-first for critical HTML/Document or navigation requests so index.html isn't aggressively cached.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Dynamically cache a copy of index.html for offline fallback
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If offline, attempt to serve the cached index.html / navigation page
          return caches.match(event.request) || caches.match('/');
        })
    );
    return;
  }

  // Cache-first falling back to Network strategy for static assets, scripts, and stylesheets
  // Avoid aggressively caching third-party or chrome-extensions
  const isLocalAsset = url.origin === self.location.origin;
  const isStatic = isLocalAsset && (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.json') ||
    url.pathname.includes('/assets/')
  );

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        }).catch((err) => {
          // Fallback image if offline
          if (event.request.destination === 'image') {
            return caches.match('/selvia_logo.png');
          }
          throw err;
        });
      })
    );
  } else {
    // Other requests use standard network fetch
    event.respondWith(
      fetch(event.request).catch(() => {
        if (event.request.destination === 'image') {
          return caches.match('/selvia_logo.png');
        }
      })
    );
  }
});
