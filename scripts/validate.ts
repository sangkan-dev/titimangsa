import { Ajv2020 as Ajv } from "ajv/dist/2020.js";
import { createRequire } from "node:module";
import path from "node:path";
import {
  allowedMvpHolidayTypes,
  generatedDataDir,
  getYearFromIsoDate,
  isIsoDate,
  listGeneratedFiles,
  listSourceFiles,
  readJsonFile,
  readSourceDataset,
  schemaDir,
  type GeneratedDataset,
  type SourceDataset,
} from "./lib/dataset.js";

const require = createRequire(import.meta.url);
const addFormats =
  require("ajv-formats") as typeof import("ajv-formats").default;

type ValidationIssue = {
  file: string;
  message: string;
};

const issues: ValidationIssue[] = [];

const ajv = new Ajv({
  allErrors: true,
  strict: true,
});

addFormats(ajv);

const sourceSchema = await readJsonFile<Record<string, unknown>>(
  path.join(schemaDir, "source.schema.json"),
);
const generatedSchema = await readJsonFile<Record<string, unknown>>(
  path.join(schemaDir, "generated.schema.json"),
);

const validateSourceSchema = ajv.compile(sourceSchema);
const validateGeneratedSchema = ajv.compile(generatedSchema);

for (const filePath of await listSourceFiles()) {
  const dataset = await readSourceDataset(filePath);

  validateSchema(filePath, dataset, validateSourceSchema);
  validateSourceDataset(filePath, dataset);
}

for (const filePath of await listGeneratedFiles()) {
  const generatedDataset = await readJsonFile<GeneratedDataset>(filePath);

  validateSchema(filePath, generatedDataset, validateGeneratedSchema);
  validateGeneratedDataset(filePath, generatedDataset);
}

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`${issue.file}: ${issue.message}`);
  }

  process.exitCode = 1;
} else {
  console.log("Dataset validation passed.");
}

function validateSchema(
  filePath: string,
  data: unknown,
  validate: ReturnType<typeof ajv.compile>,
): void {
  if (validate(data)) {
    return;
  }

  for (const error of validate.errors ?? []) {
    addIssue(
      filePath,
      `schema ${error.instancePath || "/"} ${error.message ?? "is invalid"}`,
    );
  }
}

function validateSourceDataset(filePath: string, dataset: SourceDataset): void {
  validateSourceIds(filePath, dataset);
  validateOfficialSource(filePath, dataset);
  validateHolidayTypes(filePath, dataset);
  validateHolidayDates(filePath, dataset);
  validateDuplicateHolidays(filePath, dataset);
  validateExpectedCounts(filePath, dataset);
  validateHolidayOrder(filePath, dataset);
}

function validateGeneratedDataset(
  filePath: string,
  dataset: GeneratedDataset,
): void {
  validateHolidayOrder(filePath, dataset);
  validateHolidayDates(filePath, dataset);
}

function validateSourceIds(filePath: string, dataset: SourceDataset): void {
  const sourceIds = new Set(dataset.sources.map((source) => source.id));

  for (const holiday of dataset.holidays) {
    for (const sourceId of holiday.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        addIssue(
          filePath,
          `holiday ${holiday.date} references missing sourceId "${sourceId}"`,
        );
      }
    }
  }
}

function validateOfficialSource(
  filePath: string,
  dataset: SourceDataset,
): void {
  if (!dataset.sources.some((source) => source.official)) {
    addIssue(filePath, "dataset must contain at least one official source");
  }
}

function validateHolidayTypes(filePath: string, dataset: SourceDataset): void {
  for (const holiday of dataset.holidays) {
    if (!allowedMvpHolidayTypes.has(holiday.type)) {
      addIssue(
        filePath,
        `holiday ${holiday.date} uses non-MVP type "${holiday.type}"`,
      );
    }
  }
}

function validateHolidayDates(
  filePath: string,
  dataset: Pick<SourceDataset, "year" | "holidays">,
): void {
  for (const holiday of dataset.holidays) {
    if (!isIsoDate(holiday.date)) {
      addIssue(filePath, `holiday date "${holiday.date}" must be YYYY-MM-DD`);
      continue;
    }

    if (getYearFromIsoDate(holiday.date) !== dataset.year) {
      addIssue(
        filePath,
        `holiday date "${holiday.date}" does not match dataset year ${dataset.year}`,
      );
    }
  }
}

function validateDuplicateHolidays(
  filePath: string,
  dataset: SourceDataset,
): void {
  const seen = new Set<string>();

  for (const holiday of dataset.holidays) {
    const key = [holiday.date, holiday.type, holiday.localName].join("|");

    if (seen.has(key)) {
      addIssue(filePath, `duplicate holiday ${key}`);
    }

    seen.add(key);
  }
}

function validateExpectedCounts(
  filePath: string,
  dataset: SourceDataset,
): void {
  const nationalHolidayCount = dataset.holidays.filter(
    (holiday) => holiday.type === "national_holiday",
  ).length;
  const collectiveLeaveCount = dataset.holidays.filter(
    (holiday) => holiday.type === "collective_leave",
  ).length;

  if (nationalHolidayCount !== dataset.expected.nationalHolidayCount) {
    addIssue(
      filePath,
      `expected nationalHolidayCount ${dataset.expected.nationalHolidayCount}, got ${nationalHolidayCount}`,
    );
  }

  if (collectiveLeaveCount !== dataset.expected.collectiveLeaveCount) {
    addIssue(
      filePath,
      `expected collectiveLeaveCount ${dataset.expected.collectiveLeaveCount}, got ${collectiveLeaveCount}`,
    );
  }
}

function validateHolidayOrder(
  filePath: string,
  dataset: Pick<SourceDataset, "holidays">,
): void {
  for (let index = 1; index < dataset.holidays.length; index += 1) {
    const previous = dataset.holidays[index - 1]!;
    const current = dataset.holidays[index]!;

    if (previous.date > current.date) {
      addIssue(
        filePath,
        `holidays must be sorted by date ascending; ${current.date} appears after ${previous.date}`,
      );
    }
  }
}

function addIssue(filePath: string, message: string): void {
  issues.push({
    file: path.relative(process.cwd(), filePath),
    message,
  });
}
