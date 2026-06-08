import id2025 from "../../../data/generated/id-2025.json" with { type: "json" };
import id2026 from "../../../data/generated/id-2026.json" with { type: "json" };
import { datasetNotFound, invalidType, invalidYear } from "./errors.js";
import type {
  Dataset,
  Holiday,
  HolidayOptions,
  HolidayType,
  Source,
} from "./types.js";

const datasets: Dataset[] = [id2025 as Dataset, id2026 as Dataset];
const datasetsByYear = new Map(
  datasets.map((dataset) => [dataset.year, dataset]),
);
const holidayTypes = new Set<HolidayType>([
  "national_holiday",
  "collective_leave",
  "regional_holiday",
  "observance",
  "work_arrangement",
]);

export function getDataset(year: number): Dataset {
  return cloneDataset(getDatasetInternal(year));
}

function getDatasetInternal(year: number): Dataset {
  assertYear(year);

  const dataset = datasetsByYear.get(year);

  if (!dataset) {
    throw datasetNotFound(year);
  }

  return dataset;
}

export function hasDataset(year: number): boolean {
  return datasetsByYear.has(year);
}

export function getAvailableYears(): number[] {
  return [...datasetsByYear.keys()].sort((a, b) => a - b);
}

export function getSources(year: number): Source[] {
  return getDatasetInternal(year).sources.map(cloneSource);
}

export function getHolidays(
  year: number,
  options: HolidayOptions = {},
): Holiday[] {
  return filterHolidays(getDatasetInternal(year).holidays, options).map(
    cloneHoliday,
  );
}

export function filterHolidays(
  holidays: readonly Holiday[],
  options: HolidayOptions = {},
): Holiday[] {
  const allowedTypes = normalizeHolidayTypeFilter(options.type);
  const includeCollectiveLeave = options.includeCollectiveLeave ?? true;

  return holidays.filter((holiday) => {
    if (!includeCollectiveLeave && holiday.type === "collective_leave") {
      return false;
    }

    return allowedTypes.size === 0 || allowedTypes.has(holiday.type);
  });
}

export function findHolidaysByDate(
  year: number,
  date: string,
  options: HolidayOptions = {},
): Holiday[] {
  return filterHolidays(getDatasetInternal(year).holidays, options)
    .filter((holiday) => holiday.date === date)
    .map(cloneHoliday);
}

function normalizeHolidayTypeFilter(
  type: HolidayOptions["type"],
): Set<HolidayType> {
  if (!type) {
    return new Set();
  }

  const types = Array.isArray(type) ? type : [type];

  for (const value of types) {
    if (!holidayTypes.has(value)) {
      throw invalidType(String(value));
    }
  }

  return new Set(types);
}

function assertYear(year: number): void {
  if (!Number.isInteger(year) || year < 1900 || year > 9999) {
    throw invalidYear(year);
  }
}

function cloneSource(source: Source): Source {
  return { ...source };
}

function cloneDataset(dataset: Dataset): Dataset {
  return {
    ...dataset,
    sources: dataset.sources.map(cloneSource),
    holidays: dataset.holidays.map(cloneHoliday),
  };
}

function cloneHoliday(holiday: Holiday): Holiday {
  return {
    ...holiday,
    sourceIds: [...holiday.sourceIds],
  };
}
