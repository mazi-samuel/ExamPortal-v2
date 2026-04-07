// =============================================
// Service Worker — Offline-first caching
// =============================================
const CACHE_NAME = 'examportal-v3';
const STATIC_ASSETS = [
  '/login.html',
  '/css/portal.css',
  '/js/supabase-config.js',
  '/js/api.js',
  '/manifest.json'
];

// Install — pre-cache static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache API calls or Supabase requests
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetching = fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetching;
    })
  );
});

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const payload = event.data.json();
  event.waitUntil(
    self.registration.showNotification(payload.title || 'ExamPortal', {
      body: payload.body || '',
      icon: '/public/icon-192.png',
      badge: '/public/icon-192.png',
      data: payload.data || {}
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : '/student-dashboard.html';
  event.waitUntil(clients.openWindow(url));
});
