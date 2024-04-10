import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [solidPlugin(), viteSingleFile()],
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    // polyfillDynamicImport: false,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      // inlineDynamicImports: true,
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  server: {
    fs: {
      strict: false,
      // Allow serving files from one level up to the project root
      allow: [".."],
    },
  },
});
