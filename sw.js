const CACHE_NAME = 'pulp-pro-v3'; // Changed to v3 to force update
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './defects.json',
  './edited-image.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forces the new service worker to take over immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // Immediate control
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
