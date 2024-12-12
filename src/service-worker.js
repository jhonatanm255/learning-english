// const CACHE_NAME = "v2"; // Versión del cache
// const CACHE_URLS = [
//   "/",
//   "/index.html",
//   "/static/js/main.js",
//   "/static/css/main.css",
//   "/logo-ingles-light.png",
//   "/manifest.webmanifest",
// ];

// self.addEventListener("install", (event) => {
//   console.log("Service Worker: Install event triggered");
//   const newVersion = "v2"; // Define manualmente la versión nueva
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("Service Worker: Caching files");
//       return cache.addAll(CACHE_URLS).then(() => {
//         // Notificar a los clientes sobre la nueva versión
//         self.clients.matchAll().then((clients) => {
//           console.log(
//             "Service Worker: Sending UPDATE_READY message to clients"
//           );
//           clients.forEach((client) => {
//             client.postMessage({ type: "UPDATE_READY", newVersion });
//           });
//         });
//       });
//     })
//   );
// });

// self.addEventListener("message", (event) => {
//   if (event.data && event.data.type === "SKIP_WAITING") {
//     console.log("Service Worker: SKIP_WAITING received, skipping waiting");
//     self.skipWaiting(); // Ejecutar solo si el cliente lo solicita
//   }
// });

// self.addEventListener("activate", (event) => {
//   console.log("Service Worker: Activate event triggered");
//   // Borrar cachés antiguos si la versión del cache ha cambiado
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       console.log("Service Worker: Cleaning old caches");
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheName !== CACHE_NAME) {
//             console.log(`Service Worker: Deleting cache ${cacheName}`);
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// self.addEventListener("fetch", (event) => {
//   console.log(`Service Worker: Fetch event for ${event.request.url}`);
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       if (cachedResponse) {
//         console.log("Service Worker: Returning cached response");
//         return cachedResponse;
//       }
//       console.log("Service Worker: Fetching from network");
//       return fetch(event.request).then((response) => {
//         if (event.request.method === "GET") {
//           caches.open(CACHE_NAME).then((cache) => {
//             console.log(
//               `Service Worker: Caching new response for ${event.request.url}`
//             );
//             cache.put(event.request, response.clone());
//           });
//         }
//         return response;
//       });
//     })
//   );
// });



const CACHE_NAME = "v2"; // Versión del cache
const CACHE_URLS = [
  "/",
  "/index.html",
  "/static/js/main.js",
  "/static/css/main.css",
  "/logo-ingles-light.png",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  console.log("Service Worker: Install event triggered");
  const newVersion = "v2"; // Define manualmente la versión nueva
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching files");
      return cache.addAll(CACHE_URLS).then(() => {
        // Notificar a los clientes sobre la nueva versión
        self.clients.matchAll().then((clients) => {
          console.log(
            "Service Worker: Sending UPDATE_READY message to clients"
          );
          clients.forEach((client) => {
            client.postMessage({ type: "UPDATE_READY", newVersion });
          });
        });
      });
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("Service Worker: SKIP_WAITING received, skipping waiting");
    self.skipWaiting(); // Ejecutar solo si el cliente lo solicita
  }
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate event triggered");
  // Borrar cachés antiguos si la versión del cache ha cambiado
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log("Service Worker: Cleaning old caches");
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`Service Worker: Deleting cache ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log(`Service Worker: Fetch event for ${event.request.url}`);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("Service Worker: Returning cached response");
        return cachedResponse;
      }
      console.log("Service Worker: Fetching from network");
      return fetch(event.request).then((response) => {
        if (event.request.method === "GET") {
          caches.open(CACHE_NAME).then((cache) => {
            console.log(
              `Service Worker: Caching new response for ${event.request.url}`
            );
            cache.put(event.request, response.clone());
          });
        }
        return response;
      });
    })
  );
});