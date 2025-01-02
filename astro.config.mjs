import { defineConfig } from "astro/config";
import path from "path";
import rehypeExternalLinks from "rehype-external-links";
import { fileURLToPath } from "url";

import mdx from "@astrojs/mdx";

import playformCompress from "@playform/compress";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

import partytown from "@astrojs/partytown";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
  site: "https://defguard.net",
  trailingSlash: "ignore",
  prefetch: true,
  integrations: [
    react(),
    mdx(),
    playformCompress(),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
        },
      },
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["nofollow", "noopener", "noreferrer"],
        },
      ],
    ],
  },
  vite: {
    resolve: {
      alias: {
        "@/": `${path.resolve(__dirname, "src")}/`,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
          additionalData: `@use "@/styles/mixins" as *;`,
        },
      },
    },
  },
  experimental: {
    responsiveImages: true,
  },
});
