import sitemap from "@astrojs/sitemap";
import { defineConfig } from "blume";

export default defineConfig({
  title: "Oh My Mathpad",
  description: "Documentation for OMM",
  logo: "/favicon.svg",
  banner: {
    content: "This documentation is subject to change.",
    dismissible: true,
    id: "v1",
  },

  integrations: [sitemap()],

  lastModified: "git",
  dateFormat: { dateStyle: "medium" },

  markdown: {
    imageZoom: true,
    externalLinks: true,
    code: {
      icons: true,
      wrap: false,
      theme: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },

  image: {
    domains: ["docs.scriptcat.org"],
    remotePatterns: [{ protocol: "https", hostname: "**.scriptcat.org" }],
  },

  agents: {
    llmsTxt: true,
    catalog: true,
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
    site: "https://omm-9lk.pages.dev",
  },
});
