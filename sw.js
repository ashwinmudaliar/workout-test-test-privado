const CACHE = "amrap-v13";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./jokes.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./themes/rick/bust.jpg",
  "./themes/rick/mark.jpg",
  "./themes/morty/bust.jpg",
  "./themes/morty/mark.jpg",
  "./themes/beth/bust.jpg",
  "./themes/beth/mark.jpg",
  "./themes/space-beth/bust.jpg",
  "./themes/space-beth/mark.jpg",
  "./themes/scary-terry/bust.jpg",
  "./themes/scary-terry/mark.jpg",
  "./themes/birdperson/bust.jpg",
  "./themes/birdperson/mark.jpg",
  "./themes/evil-morty/bust.jpg",
  "./themes/evil-morty/mark.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        Promise.all(ASSETS.map((url) => cache.add(url).catch(() => undefined)))
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const live =
    request.mode === "navigate" ||
    url.pathname.endsWith("/") ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".json");

  if (live) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
