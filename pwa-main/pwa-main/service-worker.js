const CACHE_NAME = 'estore-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/js/app.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Serve from cache if available
      if (cachedResponse) return cachedResponse;

      // Try fetching from network
      return fetch(event.request).catch(() => {
        // Fallback only for navigation (HTML page loads)
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});

// Push Notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  const title = data.title || 'New Notification';
  const options = {
    body: data.body,
    icon: 'icons/web-app-manifest-192x192.png',
    badge: 'icons/web-app-manifest-512x512.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Background Sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCartData());
  }
});

// Function to sync cart data (for example, when user adds items to the cart offline)
function syncCartData() {
  // Logic for syncing cart data with the server
  // Example: Sending a POST request to sync the cart when the network is available
  return fetch('/sync-cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cart: getCartData() })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Cart synced successfully', data);
  })
  .catch(err => {
    console.error('Sync failed', err);
  });
}

// Function to get cart data (this is a placeholder)
function getCartData() {
  // You can retrieve the cart data from IndexedDB or LocalStorage
  return { items: ['item1', 'item2'] };  // Example cart data
}
