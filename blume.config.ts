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

  redirects: [{ from: "/chrome-install", to: "/installing/chrome", status: 301 },
  { from: "/brave-install", to: "/installing/brave", status: 301 },
  { from: "/vivaldi-install", to: "/installing/vivaldi", status: 301 },
  { from: "/safari-install", to: "/installing/safari", status: 301 },
  { from: "/edge-install", to: "/installing/edge", status: 301 },
  { from: "/opera-install", to: "/installing/opera", status: 301 },
  { from: "/firefox-install", to: "/installing/firefox", status: 301 }],

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
