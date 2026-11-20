import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  // The CSP has no data: in font-src, so a font file must never be inlined into the CSS.
  build: { assetsInlineLimit: (file) => (/\.woff2?$/.test(file) ? false : undefined) },
  plugins: [react(), cloudflare()],
  css: {
    preprocessorOptions: {
      less: { paths: [resolve(import.meta.dirname, "src/styles")] },
    },
  },
});
