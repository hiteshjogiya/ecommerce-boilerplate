self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Offline strategy placeholder for Phase 14:
// add runtime caching and offline fallbacks as needed.
self.addEventListener("fetch", () => {});
