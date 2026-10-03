// Cache sederhana supaya aplikasi bisa dibuka tanpa internet setelah dibuka sekali.
// Naikkan angka VERSI setiap kali index.html diganti supaya HP memuat versi baru.
const VERSI = 'susun-pattern-v1';
const FILE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSI).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(r => {
      if (r && r.ok && new URL(e.request.url).origin === location.origin) { const k = r.clone(); caches.open(VERSI).then(c => c.put(e.request, k)); }
      return r;
    }).catch(() => caches.match('index.html')))
  );
});
