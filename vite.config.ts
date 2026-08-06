import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ["@mathjax/src", "@mathjax/mathjax-newcm-font", "@mathjax/mathjax-mhchem-font-extension"],
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "index.html"),
        "service-worker": path.resolve(import.meta.dirname, "src/service-worker.ts"),
      },
      output: {
        entryFileNames: (chunk) => chunk.name === "service-worker" ? "sw.js" : "assets/[name]-[hash].js",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
