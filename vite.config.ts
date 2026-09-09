import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@myt/shared": path.resolve(__dirname, "./src/vendor/myt-shared/index.ts"),
    },
  },
  server: {
    port: 5173,
  },
});
