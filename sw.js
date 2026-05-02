const CACHE_NAME = 'pulp-pro-v1';
const ASSETS = [
  'index.html',
  'style.css',
  'js/master-logic.js',
  'edited-image.png',
  'banana.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
