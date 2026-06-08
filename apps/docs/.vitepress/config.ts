import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { defineConfig } from "vitepress";

const base = process.env.BASE_PATH ?? "/";
const siteUrl = (
  process.env.SITE_URL ?? "https://sangkan-dev.github.io/titimangsa"
).replace(/\/$/, "");
const site = new URL(siteUrl);
const sitePath = site.pathname.replace(/\/$/, "");
const description =
  "API hari libur Indonesia dan perhitungan hari kerja, dikurasi dari sumber resmi publik.";

export default defineConfig({
  lang: "id-ID",
  title: "Titimangsa",
  titleTemplate: ":title | API Hari Libur Indonesia",
  description,
  base,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: site.origin,
    transformItems(items) {
      return items.map((item) => ({
        ...item,
        url:
          sitePath && !item.url.startsWith(sitePath)
            ? `${sitePath}${item.url.startsWith("/") ? "" : "/"}${item.url}`
            : item.url,
      }));
    },
  },
  head: [
    ["meta", { name: "theme-color", content: "#3451b2" }],
    ["link", { rel: "sitemap", href: `${siteUrl}/sitemap.xml` }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "API hari libur Indonesia, kalender libur Indonesia, cuti bersama, hari kerja Indonesia, public holiday API",
      },
    ],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Titimangsa" }],
    ["meta", { property: "og:locale", content: "id_ID" }],
    [
      "meta",
      {
        property: "og:title",
        content: "Titimangsa - API Hari Libur Indonesia",
      },
    ],
    ["meta", { property: "og:description", content: description }],
    ["meta", { property: "og:url", content: siteUrl }],
    ["meta", { name: "twitter:card", content: "summary" }],
    [
      "meta",
      {
        name: "twitter:title",
        content: "Titimangsa - API Hari Libur Indonesia",
      },
    ],
    ["meta", { name: "twitter:description", content: description }],
    [
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebAPI",
        name: "Titimangsa",
        description,
        url: siteUrl,
        documentation: siteUrl,
        provider: {
          "@type": "Organization",
          name: "sangkan-dev",
          url: "https://github.com/sangkan-dev",
        },
        areaServed: {
          "@type": "Country",
          name: "Indonesia",
        },
        termsOfService: `${siteUrl}/guide/limitations`,
      }),
    ],
  ],
  transformHead({ pageData }) {
    const pagePath =
      pageData.relativePath === "index.md"
        ? ""
        : pageData.relativePath.replace(/\.md$/, "");

    return [["link", { rel: "canonical", href: `${siteUrl}/${pagePath}` }]];
  },
  async buildEnd({ outDir }) {
    await writeFile(
      resolve(outDir, "robots.txt"),
      `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
    );
  },
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
