/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async ({ command }) => ({
  plugins: [
    react(),
    command === "build" &&
      process.env.ANALYZE === "true" &&
      (await import("rollup-plugin-visualizer")).visualizer({
        filename: "node_modules/.cache/bundle-analysis/stats.html",
        template: "treemap",
        gzipSize: true,
        brotliSize: true,
        open: false,
      }),
  ],
  test: {
    // Typed import.meta.glob calls can reuse a stale Vite page list from disk.
    fsModuleCache: false,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
}));
