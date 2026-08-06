/// <reference lib="webworker" />

const worker = globalThis as unknown as ServiceWorkerGlobalScope;
const cacheName = "latexlive-shell-v3";
const appShell = [
  "/",
  "/docs",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/data/editor-input.json",
  "/data/autocomplete.json",
];

worker.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => Promise.allSettled(appShell.map((url) => cache.add(url)))),
  );
  void worker.skipWaiting();
});

worker.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key)))),
  );
  void worker.clients.claim();
});

worker.addEventListener("fetch", (event: FetchEvent) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== worker.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          void caches.open(cacheName).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => (await caches.match(request)) ?? (await caches.match("/")) ?? Response.error()),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          void caches.open(cacheName).then((cache) => cache.put(request, copy));
        }
        return response;
      });
      return cached ?? network;
    }),
  );
});

export {};
