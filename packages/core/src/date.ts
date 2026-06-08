import { invalidDate } from "./errors.js";
import type { Weekday } from "./types.js";

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

export const weekdayKeys = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
] as const satisfies readonly Weekday[];

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = parseIsoDateUnchecked(value);

  return formatIsoDate(date) === value;
}

export function assertIsoDate(value: string, field = "date"): void {
  if (!isIsoDate(value)) {
    throw invalidDate(value, field);
  }
}

export function parseIsoDate(value: string, field = "date"): Date {
  assertIsoDate(value, field);

  return parseIsoDateUnchecked(value);
}

export function parseIsoDateUnchecked(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function formatIsoDate(date: Date): string {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function getYearFromIsoDate(value: string, field = "date"): number {
  return parseIsoDate(value, field).getUTCFullYear();
}

export function getDayName(value: string): string {
  return englishDays[parseIsoDate(value).getUTCDay()]!;
}

export function getLocalDayName(value: string): string {
  return indonesianDays[parseIsoDate(value).getUTCDay()]!;
}

export function getWeekday(value: string): Weekday {
  return weekdayKeys[parseIsoDate(value).getUTCDay()]!;
}

export function addCalendarDays(value: string, days: number): string {
  const date = parseIsoDate(value);
  date.setUTCDate(date.getUTCDate() + days);

  return formatIsoDate(date);
}
