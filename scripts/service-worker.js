// ============================
// Flare Service Worker
// ============================

const CACHE_NAME = "flare-cache-v1";

const FILES_TO_CACHE = [
  "/", 
  "/index.html",
  "/main.html",
  "/styles.css",
  "/Images/logo.png",

  // Add other assets you want cached:
  // "/games/game1.html",
  // "/Images/bg.png",
  // "/scripts/game.js",

  "/manifest.json",
];

// Install SW (caches all required files)
self.addEventListener("install", event => {
  console.log("[SW] Installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[SW] Caching files...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activate SW (cleanup old caches)
self.addEventListener("activate", event => {
  console.log("[SW] Activating...");

  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      );
    })
  );
});

// Serve files from cache when offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// ==========================
// Flare PWA Service Worker
// ==========================

const foldersToCache = ["/Images/", "/games/", "/scripts/"];

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Check if this request belongs to a folder you want cached
  const shouldCache = foldersToCache.some(folder =>
    url.pathname.startsWith(folder)
  );

  if (shouldCache) {
    event.respondWith(
      caches.open("flare-folder-cache").then(async (cache) => {
        // Serve from cache if available
        const cached = await cache.match(event.request);
        if (cached) return cached;

        // Otherwise fetch & save
        const fresh = await fetch(event.request);
        cache.put(event.request, fresh.clone());
        return fresh;
      })
    );
    return; // Stop here — no further fetch handling
  }

  // Default behavior for non-folder files
  event.respondWith(fetch(event.request));
});
