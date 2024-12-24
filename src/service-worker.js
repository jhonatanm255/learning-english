// const CACHE_NAME = "v2"; // Versión del cache
// const CACHE_URLS = [
//   "/",
//   "/index.html",
//   "/static/js/main.js",
//   "/static/css/main.css",
//   "/logo2.png",
//   "/manifest.webmanifest",
// ];

// // Instalar y cachear archivos estáticos
// self.addEventListener("install", (event) => {
//   console.log("Service Worker: Install event triggered");
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("Service Worker: Caching files");
//       return cache.addAll(CACHE_URLS);
//     })
//   );

//   // Notificar a los clientes que hay una nueva versión disponible
//   self.clients.matchAll().then((clients) => {
//     clients.forEach((client) => {
//       client.postMessage({ type: "UPDATE_AVAILABLE" });
//     });
//   });
// });

// // Activar el Service Worker y limpiar cachés antiguos
// self.addEventListener("activate", (event) => {
//   console.log("Service Worker: Activate event triggered");
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheName !== CACHE_NAME) {
//             console.log(`Service Worker: Deleting cache ${cacheName}`);
//             return caches.delete(cacheName);
//           }
//         })
//       )
//     )
//   );

//   // Mantener el control solo si es solicitado explícitamente
//   // self.clients.claim() ha sido removido para evitar que el Service Worker tome control automáticamente
// });

// // Escuchar mensajes desde el cliente
// self.addEventListener("message", (event) => {
//   if (event.data && event.data.type === "SKIP_WAITING") {
//     console.log("Service Worker: SKIP_WAITING received, skipping waiting");
//     self.skipWaiting(); // Salta la espera cuando el cliente lo solicite
//   }
// });

// // Interceptar solicitudes de red y usar el caché
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       if (cachedResponse) {
//         return cachedResponse;
//       }
//       return fetch(event.request).then((response) => {
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







const CACHE_NAME = "v2";
const CACHE_URLS = [
  "/",
  "/index.html",
  "/static/js/main.js",
  "/static/css/main.css",
  "/logo2.png",
  "/manifest.webmanifest",
];

// Instalar y cachear archivos estáticos
self.addEventListener("install", (event) => {
  console.log("Service Worker: Install event triggered");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching files");
      return cache.addAll(CACHE_URLS);
    })
  );
  // No activa automáticamente el nuevo Service Worker
  self.skipWaiting(); // Opcional: activa directamente
});

// Activar el Service Worker y limpiar cachés antiguos
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate event triggered");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`Service Worker: Deleting cache ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim(); // Asegura el control inmediato
});

// Interceptar solicitudes de red y usar el caché
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

// Escuchar mensajes desde el cliente
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log(
      "Service Worker: SKIP_WAITING received, activating new version"
    );
    self.skipWaiting();
  }
});

// Notificar a los clientes cuando haya una nueva versión disponible
self.addEventListener("install", () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "UPDATE_AVAILABLE" });
    });
  });
});
