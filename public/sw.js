const CACHE = 'newsflash-v1';
const STATIC = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname === '/api/news' || url.pathname === '/api/health') {
    event.respondWith(cacheThenNetwork(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkThenCache(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached || fetch(request);
}

async function cacheThenNetwork(request) {
  const cached = await caches.match(request);
  try {
    const res = await fetch(request);
    if (res.ok) {
      const clone = res.clone();
      caches.open(CACHE).then((cache) => cache.put(request, clone));
    }
    return res;
  } catch {
    return cached || new Response(JSON.stringify({ articles: [], total: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function networkThenCache(request) {
  try {
    const res = await fetch(request);
    if (res.ok) {
      const clone = res.clone();
      caches.open(CACHE).then((cache) => cache.put(request, clone));
    }
    return res;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const root = await caches.match('/');
    return root || new Response('Offline', { status: 503 });
  }
}
