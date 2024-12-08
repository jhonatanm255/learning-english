import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Configura el service worker para que se registre automáticamente
      workbox: {
        // Opciones de caché y otros ajustes de workbox
      },
      manifest: {
        name: "Traductor de Idiomas",
        short_name: "Traductor",
        description: "Una app de traducción de idiomas",
        start_url: ".",
        display: "standalone", // Esto le da a la app un aspecto de "aplicación nativa"
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/logo-ingles-light.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo-english.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
