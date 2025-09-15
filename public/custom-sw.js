// custom-sw.js

// Install event
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...', event);
  // Force the waiting service worker to become the active service worker
  event.waitUntil(self.skipWaiting());
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker...', event);
  // Takes control of the currently open pages
  event.waitUntil(clients.claim());
});

// Cache CSS files
self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('.css')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open('css-cache').then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});

// Push event listener
// self.addEventListener('push', (event) => {
//   console.log('[Service Worker] Push Received.');

//   const data = event.data ? event.data.json() : { title: 'Hello!', body: 'Uri says Hello!', icon: '👋' };
//   console.log('Push message data:', data);

//   const options = {
//     title: data.title,
//     body: data.body,
//     icon: data.icon,
//   };

//   event.waitUntil(self.registration.showNotification(data.title, options));
//   console.log('Notification Sent: ', data.title);
// });

// Notification click event listener
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.', event.notification.data);

  event.notification.close();

  // Perform an action, like navigating to a URL
  event.waitUntil(clients.openWindow('https://uricreative.com/dashboard')); // Replace with your own URL
});

// Handle FCM messages when the app is in the foreground
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message Received:', event.data);

  // Handle the FCM message payload here
  const data = event.data.json();
  console.log('FCM Message Payload:', data);

  // You can update your UI or display a notification for foreground messages here
});
