import { defineConfig } from "vite";
import solid from "@solidjs/vite-plugin";
import stylex from "@stylexjs/unplugin";

export default defineConfig({
  plugins: [stylex.vite({ useCSSLayers: true }), solid({ ssr: true })],
  build: { target: "es2022" },
});
