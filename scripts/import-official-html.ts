import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { stringify } from "yaml";
import {
  extractHolidayCandidates,
  extractHtmlMetadata,
} from "./lib/html-draft.js";

const args = process.argv.slice(2);

if (args[0] === "--") {
  args.shift();
}

const { values } = parseArgs({
  args,
  options: {
    year: { type: "string" },
    url: { type: "string" },
    publisher: { type: "string" },
    title: { type: "string" },
    output: { type: "string" },
  },
  strict: true,
});

const year = Number(values.year);
const url = required(values.url, "--url");
const publisher = required(values.publisher, "--publisher");

if (!Number.isInteger(year) || year < 1900 || year > 9999) {
  throw new Error("--year must be a four-digit year.");
}

const sourceUrl = new URL(url);

if (sourceUrl.protocol !== "https:" || !sourceUrl.hostname.endsWith(".go.id")) {
  throw new Error("--url must be an HTTPS URL on an Indonesian .go.id domain.");
}

const response = await fetch(sourceUrl, {
  headers: {
    accept: "text/html",
    "user-agent":
      "titimangsa-source-review/0.1 (+https://github.com/sangkan-dev/titimangsa)",
  },
  redirect: "follow",
});

if (!response.ok) {
  throw new Error(`Source request failed with HTTP ${response.status}.`);
}

const contentType = response.headers.get("content-type") ?? "";

if (!contentType.includes("text/html")) {
  throw new Error(
    `Source returned "${contentType || "unknown"}"; this importer supports HTML only.`,
  );
}

const html = await response.text();
const metadata = extractHtmlMetadata(html);
const holidays = extractHolidayCandidates(metadata.text, year);
const output = path.resolve(
  values.output ??
    path.join(
      "data",
      "drafts",
      `${year}-${sourceUrl.hostname.replaceAll(".", "-")}.generated.yaml`,
    ),
);
const draft = {
  year,
  detectedAt: new Date().toISOString(),
  status: "draft",
  requiresReview: true,
  generator: "official-html-importer",
  source: {
    title: values.title || metadata.title || sourceUrl.toString(),
    url: sourceUrl.toString(),
    publisher,
    type: "HTML",
    official: true,
    confidence: 0.8,
    sha256: metadata.sha256,
  },
  holidays,
};

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, stringify(draft), "utf8");

if (holidays.length === 0) {
  console.warn(
    "No explicit full-date candidates were found; review whether the source links to a detailed document.",
  );
}

console.log(
  `Wrote ${holidays.length} review-required candidates to ${path.relative(process.cwd(), output)}.`,
);

function required(value: string | undefined, option: string): string {
  if (!value) {
    throw new Error(`${option} is required.`);
  }

  return value;
}
