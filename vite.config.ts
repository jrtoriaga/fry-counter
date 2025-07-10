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
      manifest: {
        name: "Fry Counter",
        short_name: "FCounter",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        start_url: ".",
        display: "standalone",
        theme_color: "#ffffff",
      },
      devOptions: {enabled: true}
    }),
  ],
});
