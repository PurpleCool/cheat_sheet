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
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
}));
