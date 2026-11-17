const CACHE_NAME = "clock-pwa-v1";
const PRECACHE_ASSETS = [
    "/",
    "/about",
    "/static/styles.css",
    "/static/app.js",
    "/manifest.json",
    "/static/icons/icon-192.png",
    "/static/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn("Не все ресурсы закешированы:", err);
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
        event.respondWith(
            fetch(request).catch(() =>
                new Response(
                    JSON.stringify({ error: "Offline", offline: true }),
                    {
                        status: 503,
                        headers: { "Content-Type": "application/json" },
                    }
                )
            )
        );
        return;
    }
    if (request.mode === "navigate") {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request)
                    .then((resp) => {
                        const copy = resp.clone();
                        caches.open(CACHE_NAME).then((c) => c.put(request, copy));
                        return resp;
                    })
                    .catch(() => caches.match("/"));
            })
        );
        return;
    }
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((resp) => {
                if (resp.ok && request.method === "GET") {
                    const copy = resp.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(request, copy));
                }
                return resp;
            });
        })
    );
});