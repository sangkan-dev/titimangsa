import {
  addCalendarDays,
  getDayName,
  getLocalDayName,
  getYearFromIsoDate,
} from "./date.js";
import { findHolidaysByDate } from "./dataset.js";
import { invalidRange } from "./errors.js";
import { defaultWeekend, isWeekend, parseWeekend } from "./weekend.js";
import type {
  HolidayCheckOptions,
  HolidayCheckResult,
  HolidayType,
  ResolvedWorkdayOptions,
  WorkdayAddResult,
  WorkdayCheckResult,
  WorkdayDiffOptions,
  WorkdayDiffResult,
  WorkdayOptions,
} from "./types.js";

export { TitimangsaError } from "./errors.js";
export {
  addCalendarDays,
  assertIsoDate,
  formatIsoDate,
  getDayName,
  getLocalDayName,
  getWeekday,
  getYearFromIsoDate,
  isIsoDate,
  parseIsoDate,
} from "./date.js";
export {
  filterHolidays,
  findHolidaysByDate,
  getAvailableYears,
  getDataset,
  getHolidays,
  getSources,
  hasDataset,
} from "./dataset.js";
export { defaultWeekend, isWeekend, parseWeekend } from "./weekend.js";
export type {
  CountryCode,
  Dataset,
  DatasetStatus,
  Holiday,
  HolidayCheckOptions,
  HolidayCheckResult,
  HolidayOptions,
  HolidayType,
  ResolvedWorkdayOptions,
  Source,
  TitimangsaErrorCode,
  TitimangsaErrorDetails,
  Weekday,
  WeekendOptions,
  WorkdayAddResult,
  WorkdayCheckResult,
  WorkdayDiffOptions,
  WorkdayDiffResult,
  WorkdayOptions,
} from "./types.js";

export function checkHoliday(
  date: string,
  options: HolidayCheckOptions = {},
): HolidayCheckResult {
  const year = getYearFromIsoDate(date);
  const holidays = findHolidaysByDate(year, date, {
    includeCollectiveLeave: options.includeCollectiveLeave ?? true,
  });

  return {
    date,
    day: getDayName(date),
    localDay: getLocalDayName(date),
    isHoliday: holidays.length > 0,
    holidays,
  };
}

export function isWorkday(date: string, options: WorkdayOptions = {}): boolean {
  return checkWorkday(date, options).isWorkday;
}

export function checkWorkday(
  date: string,
  options: WorkdayOptions = {},
): WorkdayCheckResult {
  const weekend = isWeekend(date, options);
  const holidayCheck = checkHoliday(date, options);
  const holidayTypes = uniqueHolidayTypes(
    holidayCheck.holidays.map((holiday) => holiday.type),
  );

  return {
    date,
    day: holidayCheck.day,
    localDay: holidayCheck.localDay,
    isWeekend: weekend,
    isHoliday: holidayCheck.isHoliday,
    isWorkday: !weekend && !holidayCheck.isHoliday,
    holidayTypes,
  };
}

export function addWorkdays(
  date: string,
  days: number,
  options: WorkdayOptions = {},
): WorkdayAddResult {
  if (!Number.isInteger(days) || days <= 0) {
    throw invalidRange("Days must be a positive integer.");
  }

  const resolvedOptions = resolveWorkdayOptions(options);
  let remainingDays = days;
  let currentDate = date;

  getYearFromIsoDate(date);

  while (remainingDays > 0) {
    currentDate = addCalendarDays(currentDate, 1);

    if (isWorkday(currentDate, resolvedOptions)) {
      remainingDays -= 1;
    }
  }

  return {
    startDate: date,
    days,
    resultDate: currentDate,
    options: resolvedOptions,
  };
}

export function diffWorkdays(
  start: string,
  end: string,
  options: WorkdayDiffOptions = {},
): WorkdayDiffResult {
  getYearFromIsoDate(start, "start");
  getYearFromIsoDate(end, "end");

  if (start > end) {
    throw invalidRange("Start date must be before or equal to end date.");
  }

  const inclusive = options.inclusive ?? true;
  const resolvedOptions = resolveWorkdayOptions(options);
  let currentDate = inclusive ? start : addCalendarDays(start, 1);
  const lastDate = inclusive ? end : addCalendarDays(end, -1);
  let workdayCount = 0;
  let holidayCount = 0;
  let weekendCount = 0;

  if (!inclusive && currentDate > lastDate) {
    return {
      startDate: start,
      endDate: end,
      inclusive,
      workdayCount,
      holidayCount,
      weekendCount,
      options: resolvedOptions,
    };
  }

  while (currentDate <= lastDate) {
    const workday = checkWorkday(currentDate, resolvedOptions);

    if (workday.isWeekend) {
      weekendCount += 1;
    }

    if (workday.isHoliday) {
      holidayCount += 1;
    }

    if (workday.isWorkday) {
      workdayCount += 1;
    }

    currentDate = addCalendarDays(currentDate, 1);
  }

  return {
    startDate: start,
    endDate: end,
    inclusive,
    workdayCount,
    holidayCount,
    weekendCount,
    options: resolvedOptions,
  };
}

function resolveWorkdayOptions(
  options: WorkdayOptions = {},
): ResolvedWorkdayOptions {
  return {
    includeCollectiveLeave: options.includeCollectiveLeave ?? true,
    weekend: parseWeekend(options.weekend ?? defaultWeekend),
  };
}

function uniqueHolidayTypes(types: HolidayType[]): HolidayType[] {
  return [...new Set(types)];
}
