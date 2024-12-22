// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { VitePWA } from "vite-plugin-pwa";
// import { readFileSync } from "fs";

// // Leer la versión desde package.json
// const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

// export default defineConfig({
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: "autoUpdate",
//       workbox: {
//         // Opciones de caché y otros ajustes de workbox
//       },
//       manifest: {
//         name: "Learning English",
//         short_name: "Learning English",
//         description: "Una app para el parendizaje y la practica del ingles",
//         start_url: ".",
//         display: "standalone", // Esto le da a la app un aspecto de "aplicación nativa"
//         background_color: "#ffffff",
//         theme_color: "#ffffff",
//         icons: [
//           {
//             src: "/logo2.png",
//             sizes: "192x192",
//             type: "image/png",
//           },
//           {
//             src: "/logo2.png",
//             sizes: "512x512",
//             type: "image/png",
//           },
//         ],
//       },
//     }),
//   ],
//   define: {
//     __APP_VERSION__: JSON.stringify(pkg.version), // Exponer la versión como una constante global
//   },
// });






import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync } from "fs";

// Leer la versión desde package.json
const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document", // O cualquier patrón que quieras interceptar
            handler: "NetworkFirst", // Asegúrate de usar NetworkFirst en este caso
            options: {
              networkTimeoutSeconds: 10, // Timeout en segundos
              cacheName: "pages-cache",
              expiration: {
                maxEntries: 10, // Limitar el número de entradas en el cache
                maxAgeSeconds: 86400, // Cuánto tiempo deben permanecer las páginas en cache
              },
            },
          },
        ],
      },
      manifest: {
        name: "Learning English",
        short_name: "Learning English",
        description: "Una app para el aprendizaje y la práctica del inglés",
        start_url: ".",
        display: "standalone", // Esto le da a la app un aspecto de "aplicación nativa"
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/logo2.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo2.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version), // Exponer la versión como una constante global
  },
});
