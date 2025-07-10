import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "icons/*"],
      manifest: {
        name: "Fry Counter",
        short_name: "FCounter",
        icons: [
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
      },
      devOptions: { enabled: true },
      workbox: {
        maximumFileSizeToCacheInBytes: 5_000_000,
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              ["document", "script", "style", "image", "font"].includes(
                request.destination
              ),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "assets-cache",
              expiration: { maxEntries: 100 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    allowedHosts: ["17502b832d80.ngrok-free.app"],
  },
});
