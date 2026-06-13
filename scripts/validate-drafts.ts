import { Ajv2020 as Ajv } from "ajv/dist/2020.js";
import { createRequire } from "node:module";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { getYearFromIsoDate, isIsoDate, readJsonFile } from "./lib/dataset.js";

type DraftHoliday = {
  date: string;
  localName: string;
  type: "national_holiday" | "collective_leave" | "unknown";
  confidence: number;
  rawText: string;
};

type AutomationDraft = {
  year: number;
  detectedAt: string;
  status: "draft";
  requiresReview: true;
  generator: string;
  source: {
    title: string;
    url: string;
    publisher: string;
    type: string;
    official: boolean;
    confidence: number;
    sha256?: string;
  };
  holidays: DraftHoliday[];
};

const require = createRequire(import.meta.url);
const addFormats =
  require("ajv-formats") as typeof import("ajv-formats").default;
const draftDir = path.join(process.cwd(), "data", "drafts");
const schemaPath = path.join(
  process.cwd(),
  "data",
  "schemas",
  "draft.schema.json",
);
const issues: string[] = [];
const ajv = new Ajv({ allErrors: true, strict: true });

addFormats(ajv);

const validateSchema = ajv.compile(
  await readJsonFile<Record<string, unknown>>(schemaPath),
);
const draftFiles = (await readdir(draftDir))
  .filter(
    (file) =>
      file.endsWith(".json") || file.endsWith(".yaml") || file.endsWith(".yml"),
  )
  .sort((a, b) => a.localeCompare(b));

for (const file of draftFiles) {
  const filePath = path.join(draftDir, file);
  const draft = await readDraft(filePath);

  if (!validateSchema(draft)) {
    for (const error of validateSchema.errors ?? []) {
      issues.push(
        `${file}: schema ${error.instancePath || "/"} ${error.message ?? "is invalid"}`,
      );
    }

    continue;
  }

  validateDraft(file, draft);
}

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(issue);
  }

  process.exitCode = 1;
} else {
  console.log(
    `Automation draft validation passed (${draftFiles.length} draft files).`,
  );
}

async function readDraft(filePath: string): Promise<AutomationDraft> {
  const contents = await readFile(filePath, "utf8");

  return (
    filePath.endsWith(".json") ? JSON.parse(contents) : parse(contents)
  ) as AutomationDraft;
}

function validateDraft(file: string, draft: AutomationDraft): void {
  if (draft.status !== "draft" || draft.requiresReview !== true) {
    issues.push(
      `${file}: automation output must remain a review-required draft`,
    );
  }

  for (const holiday of draft.holidays) {
    if (!isIsoDate(holiday.date)) {
      issues.push(`${file}: holiday date "${holiday.date}" must be YYYY-MM-DD`);
      continue;
    }

    if (getYearFromIsoDate(holiday.date) !== draft.year) {
      issues.push(
        `${file}: holiday date "${holiday.date}" does not match draft year ${draft.year}`,
      );
    }
  }
}
