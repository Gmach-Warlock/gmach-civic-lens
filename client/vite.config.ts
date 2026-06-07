import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 1. Move 'test' inside the config, but ensure it matches Vitest's expected structure
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/vitest.setup.js",
  },
  // 2. Keep server config as its own top-level property
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: "http://server:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
