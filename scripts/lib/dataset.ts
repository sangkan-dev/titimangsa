import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

export type HolidayType =
  | "national_holiday"
  | "collective_leave"
  | "regional_holiday"
  | "observance"
  | "work_arrangement";

export type DatasetStatus = "draft" | "verified" | "archived" | "deprecated";

export type Source = {
  id: string;
  title: string;
  type: string;
  url: string;
  publisher: string;
  publishedAt: string;
  official: boolean;
};

export type SourceHoliday = {
  date: string;
  localName: string;
  name: string;
  type: HolidayType;
  sourceIds: string[];
};

export type SourceDataset = {
  year: number;
  countryCode: "ID";
  revision: number;
  status: DatasetStatus;
  updatedAt: string;
  expected: {
    nationalHolidayCount: number;
    collectiveLeaveCount: number;
  };
  sources: Source[];
  holidays: SourceHoliday[];
};

export type GeneratedHoliday = SourceHoliday & {
  day: string;
  localDay: string;
  isNationalHoliday: boolean;
  isCollectiveLeave: boolean;
};

export type GeneratedDataset = Omit<SourceDataset, "expected" | "holidays"> & {
  holidays: GeneratedHoliday[];
};

export const sourceDataDir = path.join(process.cwd(), "data", "sources");
export const generatedDataDir = path.join(process.cwd(), "data", "generated");
export const schemaDir = path.join(process.cwd(), "data", "schemas");

export const allowedMvpHolidayTypes = new Set<HolidayType>([
  "national_holiday",
  "collective_leave",
]);

const englishDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const indonesianDays = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

export async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

export async function listSourceFiles(): Promise<string[]> {
  const files = await readdir(sourceDataDir);

  return files
    .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => path.join(sourceDataDir, file));
}

export async function listGeneratedFiles(): Promise<string[]> {
  const files = await readdir(generatedDataDir);

  return files
    .filter((file) => file.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => path.join(generatedDataDir, file));
}

export async function readSourceDataset(
  filePath: string,
): Promise<SourceDataset> {
  return parse(await readFile(filePath, "utf8")) as SourceDataset;
}

export function toGeneratedDataset(
  sourceDataset: SourceDataset,
): GeneratedDataset {
  return {
    year: sourceDataset.year,
    countryCode: sourceDataset.countryCode,
    revision: sourceDataset.revision,
    status: sourceDataset.status,
    updatedAt: sourceDataset.updatedAt,
    sources: sourceDataset.sources,
    holidays: sourceDataset.holidays.map(toGeneratedHoliday),
  };
}

export function toGeneratedHoliday(holiday: SourceHoliday): GeneratedHoliday {
  return {
    ...holiday,
    day: getDayName(holiday.date),
    localDay: getLocalDayName(holiday.date),
    isNationalHoliday: holiday.type === "national_holiday",
    isCollectiveLeave: holiday.type === "collective_leave",
  };
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = parseIsoDate(value);

  return formatIsoDate(date) === value;
}

export function parseIsoDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function formatIsoDate(date: Date): string {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function getYearFromIsoDate(value: string): number {
  return Number(value.slice(0, 4));
}

export function getDayName(value: string): string {
  return englishDays[parseIsoDate(value).getUTCDay()]!;
}

export function getLocalDayName(value: string): string {
  return indonesianDays[parseIsoDate(value).getUTCDay()]!;
}
