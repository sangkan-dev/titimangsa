import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Titimangsa",
  description:
    "Indonesia holiday and business day API, curated from official public sources.",
  base: process.env.BASE_PATH ?? "/",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "API", link: "/guide/api-reference" },
      { text: "Data", link: "/guide/data-sources" },
      { text: "GitHub", link: "https://github.com/sangkan-dev/titimangsa" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "API Reference", link: "/guide/api-reference" },
          { text: "Data Sources", link: "/guide/data-sources" },
          { text: "Contributing Data", link: "/guide/contributing-data" },
          { text: "Limitations", link: "/guide/limitations" },
          { text: "Changelog", link: "/guide/changelog" },
        ],
      },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/sangkan-dev/titimangsa",
      },
    ],
    footer: {
      message:
        "Titimangsa is not an official government API. Always refer to original public documents for legal or administrative certainty.",
      copyright: "Released under the MIT License.",
    },
    search: {
      provider: "local",
    },
  },
});
