// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";

const SITE = "https://www.submit-api.com";
const stylesDir = fileURLToPath(new URL("./src/styles", import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: SITE,
  i18n: {
    defaultLocale: "de",
    locales: ["de", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    preact(),
    sitemap({
      i18n: {
        defaultLocale: "de",
        locales: {
          de: "de",
          en: "en",
        },
      },
    }),
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [stylesDir],
          additionalData: `@use "variables" as *;\n@use "mixins" as *;\n`,
        },
      },
    },
  },
});
