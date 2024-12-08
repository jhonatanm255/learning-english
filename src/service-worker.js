// const CACHE_NAME = "v1"; // Versión del cache
// const CACHE_URLS = [
//   "/",
//   "/index.html",
//   "/static/js/main.js",
//   "/static/css/main.css",
//   "/logo-ingles-light.png",
//   "/manifest.webmanifest",
// ];

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(CACHE_URLS);
//     })
//   );
// });

// self.addEventListener("activate", (event) => {
//   // Borrar cachés antiguos si la versión del cache ha cambiado
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheName !== CACHE_NAME) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       // Si encontramos una respuesta en el cache, la usamos
//       if (cachedResponse) {
//         return cachedResponse;
//       }
//       // Si no, la buscamos en la red
//       return fetch(event.request).then((response) => {
//         // Cachear la nueva respuesta si es una solicitud de tipo GET
//         if (event.request.method === "GET") {
//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(event.request, response.clone());
//           });
//         }
//         return response;
//       });
//     })
//   );
// });


const CACHE_NAME = "v2"; // Incrementa la versión del cache
const CACHE_URLS = [
  "/",
  "/index.html",
  "/static/js/main.js",
  "/static/css/main.css",
  "/logo-ingles-light.png",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS);
    })
  );
});

// Activar el nuevo Service Worker y eliminar cachés antiguos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Tomar control inmediatamente
});

// Manejar solicitudes de red con cache-first
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        if (event.request.method === "GET") {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      });
    })
  );
});

// Escuchar mensajes del frontend
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting(); // Activar el nuevo Service Worker
  }
});

// Notificar al frontend sobre nuevas versiones disponibles
self.addEventListener("install", () => {
  if (self.skipWaiting) {
    self.skipWaiting(); // Preparar la nueva versión
  }
});

self.addEventListener("activate", () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage({ type: "UPDATE_READY" }));
  });
});
