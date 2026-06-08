import {
  checkHoliday,
  getDataset,
  getHolidays,
  getSources,
  type Holiday,
  type HolidayOptions,
  type HolidayType,
  type Source,
} from "@sangkan-dev/titimangsa";

export type HolidayListOptions = {
  year: number;
  type?: string;
  includeSources: boolean;
};

export type HolidayCheckQuery = {
  date: string;
  includeCollectiveLeave: boolean;
  includeSources: boolean;
};

export function listHolidays(options: HolidayListOptions) {
  const dataset = getDataset(options.year);
  const holidayOptions: HolidayOptions = options.type
    ? { type: options.type as HolidayType }
    : {};
  const holidays = getHolidays(options.year, holidayOptions);
  const sources = options.includeSources ? getSources(options.year) : [];

  return {
    meta: {
      year: dataset.year,
      revision: dataset.revision,
      status: dataset.status,
      total: holidays.length,
      updatedAt: dataset.updatedAt,
    },
    data: holidays.map((holiday) => serializeHoliday(holiday, sources)),
  };
}

export function getHolidayCheck(options: HolidayCheckQuery) {
  const result = checkHoliday(options.date, {
    includeCollectiveLeave: options.includeCollectiveLeave,
  });
  const sources = options.includeSources
    ? getSources(Number(options.date.slice(0, 4)))
    : [];

  return {
    meta: {
      year: Number(options.date.slice(0, 4)),
    },
    data: {
      ...result,
      holidays: result.holidays.map((holiday) =>
        serializeHoliday(holiday, sources),
      ),
    },
  };
}

function serializeHoliday(holiday: Holiday, sources: Source[]) {
  const { sourceIds, ...data } = holiday;

  if (sources.length === 0) {
    return data;
  }

  return {
    ...data,
    sources: sources.filter((source) => sourceIds.includes(source.id)),
  };
}
