import { invalidType } from "./errors.js";
import { getWeekday, weekdayKeys } from "./date.js";
import type { Weekday, WeekendOptions } from "./types.js";

export const defaultWeekend: Weekday[] = ["sat", "sun"];

const weekdaySet = new Set<Weekday>(weekdayKeys);

export function parseWeekend(weekend?: WeekendOptions["weekend"]): Weekday[] {
  if (!weekend) {
    return [...defaultWeekend];
  }

  const values = Array.isArray(weekend)
    ? weekend
    : weekend
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);

  if (values.length === 0) {
    throw invalidType(String(weekend), "weekend");
  }

  const parsed: Weekday[] = [];

  for (const value of values) {
    if (!weekdaySet.has(value as Weekday)) {
      throw invalidType(String(value), "weekend");
    }

    if (!parsed.includes(value as Weekday)) {
      parsed.push(value as Weekday);
    }
  }

  return parsed;
}

export function isWeekend(date: string, options: WeekendOptions = {}): boolean {
  return parseWeekend(options.weekend).includes(getWeekday(date));
}
