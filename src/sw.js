const CACHE_NAME = "storyapp-v1";
const API_URL = "https://story-api.dicoding.dev/v1/stories";

const urlsToCache = [
  "/",
  "/index.html",
  "/app.bundle.js",
  "/manifest.json",
  "/favicon.png",
  "/images/logo.png",
];

let lastNotificationId = null;

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching App Shell assets");
      return Promise.all(
        urlsToCache.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("Gagal cache:", url, err);
          })
        )
      );
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.url.startsWith(API_URL)) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ stories: [], error: "offline" }), {
          headers: { "Content-Type": "application/json" },
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "Pesan Baru Story App";
  const options = {
    body: data.message || "Anda punya notifikasi baru dari Story App.",
    icon: "/images/logo.png",
    data: {
      url: data.url || "#/home",
      id: data.id || Date.now(),
    },
  };

  if (options.data.id === lastNotificationId) {
    console.log("Notifikasi sudah ditampilkan, skip.");
    return;
  }

  lastNotificationId = options.data.id;

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
