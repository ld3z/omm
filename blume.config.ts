import sitemap from "@astrojs/sitemap";
import { defineConfig } from "blume";

export default defineConfig({
  title: "Oh My Mathpad",
  description: "Documentation for OMM",
  logo: "/favicon.svg",
  banner: {
    content: "This documentation is subject to change.",
    dismissible: true,
    id: "v1"
  },
  integrations: [sitemap()],
  lastModified: true,
  dateFormat: { dateStyle: "medium" },

  markdown: {
    imageZoom: true,
    code: {
      icons: true,
      wrap: false,
    },
    codeBlocks: {
      theme: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },

  seo: {
    og: { enabled: true },
    rss: { enabled: true, types: ["blog", "changelog"] },
    sitemap: true,
    robots: true,
    structuredData: true,
  },

  github: {
    owner: "ld3z",
    repo: "omm",
  },
  deployment: {
    output: "static",
    site: "https://omm-9lk.pages.dev"
  },
});
