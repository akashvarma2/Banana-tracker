const CACHE_NAME = 'pulp-pro-v1';
const ASSETS = [
  '/Pulp/',
  '/Pulp/index.html',
  '/Pulp/style.css',
  '/Pulp/main.js',
  '/Pulp/manifest.json',
  '/Pulp/edited-image.png',
  '/Pulp/banana.png',
  '/Pulp/mango.png',
  '/Pulp/avocado.png',
  '/Pulp/rotten.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate & Cleanup Old Caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch Strategy: Network First, Fallback to Cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
