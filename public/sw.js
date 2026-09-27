/* ZeroCRM service worker — installable app shell with an offline fallback.
 * Pages and data always come from the network (Neon is the source of truth);
 * only immutable build assets and icons are cached, so nothing goes stale. */
const VERSION = "zerocrm-v2";
const SHELL = ["/offline.html", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png", "/favicon.ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // server actions, sign-in, sync — never intercepted
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Pages: network first; offline → the offline screen.
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("/offline.html")));
    return;
  }

  // Hashed build output never changes: cache first.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone()));
            return res;
          }),
      ),
    );
    return;
  }

  // Icons, logo, fonts: serve cached, refresh in the background.
  if (/^\/(icons|logo|screenshots)\//.test(url.pathname) || url.pathname === "/favicon.ico") {
    event.respondWith(
      caches.match(req).then((hit) => {
        const fresh = fetch(req)
          .then((res) => {
            if (res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone()));
            return res;
          })
          .catch(() => hit);
        return hit || fresh;
      }),
    );
  }
});
