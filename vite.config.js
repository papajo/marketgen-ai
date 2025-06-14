// vite.config.js
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        // This allows you to use '@/' as an alias for your project's root directory.
        // Useful for cleaner import paths, e.g., import Something from '@/components/Something';
        "@": path.resolve(__dirname, "."),
      },
    },
    plugins: [react()],
    // Optional: Server configuration
    server: {
      port: 3000,
      open: true,
    },
  };
});
