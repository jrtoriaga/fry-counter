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
            src: "/web-app-manifest-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/web-app-manifest-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/web-app-manifest-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/web-app-manifest-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/web-app-manifest-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/web-app-manifest-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/web-app-manifest-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/web-app-manifest-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        theme_color: "#9FEB97",
        background_color: "#9FEB97",
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
    allowedHosts: ["d43d77c16c5d.ngrok-free.app"],
  },
});
