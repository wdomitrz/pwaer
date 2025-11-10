function getUrl() {
  return window.location.href.replace("/create.html?", "/pwa.html?");
}
function getId(url) {
  return btoa(encodeURIComponent(getUrl()));
}
const CACHE = getId(null);
const FILES = [
  "./",
  "./create.html",
  "./index.html",
  "./manifest.js",
  "./pwa.html",
  "./style.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
