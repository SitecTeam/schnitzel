// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
  }),

  vite: {
    plugins: [tailwindcss(), svgr()],
  },

  integrations: [react()],
});
