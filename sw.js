const CACHE_NAME = 'pulp-pro-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './defects.json',
  './edited-image.png'
];

// Install event: Caches basic files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch event: Required by Chrome for the "Install" button to appear
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
