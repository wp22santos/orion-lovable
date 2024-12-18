const CACHE_NAME = 'police-app-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './og-image.png',
  './placeholder.svg',
  './logo192.png',
  './logo512.png'
];

// Instalação e cache inicial
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(ASSETS);
      })
  );
  self.skipWaiting();
});

// Limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Estratégia offline-first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Retorna do cache se disponível
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-approaches') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implementação da sincronização
  console.log('Sincronizando dados...');
}