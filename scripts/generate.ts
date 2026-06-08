import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { Ajv2020 as Ajv, type ErrorObject } from "ajv/dist/2020.js";
import { format } from "prettier";
import {
  generatedDataDir,
  listSourceFiles,
  readJsonFile,
  readSourceDataset,
  schemaDir,
  toGeneratedDataset,
  type GeneratedDataset,
} from "./lib/dataset.js";

const require = createRequire(import.meta.url);
const addFormats =
  require("ajv-formats") as typeof import("ajv-formats").default;

const ajv = new Ajv({
  allErrors: true,
  strict: true,
});

addFormats(ajv);

const generatedSchema = await readJsonFile<Record<string, unknown>>(
  path.join(schemaDir, "generated.schema.json"),
);
const validateGeneratedSchema = ajv.compile<GeneratedDataset>(generatedSchema);

const generatedDatasets: GeneratedDataset[] = [];

await mkdir(generatedDataDir, { recursive: true });

for (const filePath of await listSourceFiles()) {
  const sourceDataset = await readSourceDataset(filePath);
  const generatedDataset = toGeneratedDataset(sourceDataset);

  assertGeneratedDataset(generatedDataset);
  generatedDatasets.push(generatedDataset);

  await writeGeneratedDataset(
    path.join(generatedDataDir, `id-${generatedDataset.year}.json`),
    generatedDataset,
  );
}

const latestDataset = generatedDatasets.sort((a, b) => b.year - a.year)[0];

if (!latestDataset) {
  throw new Error("No source datasets found.");
}

await writeGeneratedDataset(
  path.join(generatedDataDir, "id-latest.json"),
  latestDataset,
);

console.log(
  `Generated ${generatedDatasets.length} dataset(s) and id-latest.json.`,
);

function assertGeneratedDataset(dataset: GeneratedDataset): void {
  const datasetYear = dataset.year;

  if (validateGeneratedSchema(dataset)) {
    return;
  }

  const errors = (validateGeneratedSchema.errors ?? [])
    .map(
      (error: ErrorObject) => `${error.instancePath || "/"} ${error.message}`,
    )
    .join("\n");

  throw new Error(`Generated dataset ${datasetYear} failed schema:\n${errors}`);
}

async function writeGeneratedDataset(
  filePath: string,
  dataset: GeneratedDataset,
): Promise<void> {
  const output = await format(JSON.stringify(dataset), {
    parser: "json",
  });

  await writeFile(filePath, output);
}
