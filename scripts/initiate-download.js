// =====================================
// 🔥 Flare PWA Service Worker
// =====================================

// Cache name
const CACHE_NAME = "flare-cache-v1";

// Main files to pre-cache on install
const PRECACHE_FILES = [
  "/",               // root
  "/index.html",
  "/main.html",
  "/games.html",
  "/settings.html",
  "/styles.css",
  "/main.css",
  "/settings.css",
];

// Folders to auto-cache
const FOLDERS_TO_CACHE = [
  "/Images/",
  "/games/",
  "/scripts/"
];

// --------------------------------------------------
// INSTALL — Pre-cache important files
// --------------------------------------------------
self.addEventListener("install", (event) => {
  console.log("[SW] Install event");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Pre-caching main files…");
      return cache.addAll(PRECACHE_FILES);
    })
  );

  self.skipWaiting();
});

// --------------------------------------------------
// ACTIVATE — Clean old caches
// --------------------------------------------------
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate event");

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// --------------------------------------------------
// FETCH — Folder-level automatic caching + fallback
// --------------------------------------------------
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Check if the request matches any folder
  const isCachableFolder = FOLDERS_TO_CACHE.some(folder =>
    url.pathname.startsWith(folder)
  );

  // If it belongs to one of the folders → auto-cache it
  if (isCachableFolder) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {

        // Return cached if available
        const cached = await cache.match(event.request);
        if (cached) return cached;

        try {
          // Fetch and store
          const fresh = await fetch(event.request);
          cache.put(event.request, fresh.clone());
          return fresh;
        } catch (err) {
          console.warn("[SW] Failed to fetch folder resource:", url.pathname);
          return cached || Response.error();
        }
      })
    );
    return;
  }

  // Default behavior for other files
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
