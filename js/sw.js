const CACHE_NAME = 'sneaker-store-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/product.html',
  '/contacts.html',
  '/checkout.html',
  '/catalog.html',
  '/cart.html',
  '/about.html',
  '/css/style.css',
  '/js/main.js',
  '/images/sneakers.jpg',
  '/images/background.jpg',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});