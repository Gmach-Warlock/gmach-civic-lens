import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This is the same as --host 0.0.0.0
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // Necessary for Windows/Docker volume syncing
    },
    proxy: {
      // Change 'localhost' to 'server' (your docker service name)
      "/api": {
        target: "http://server:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
