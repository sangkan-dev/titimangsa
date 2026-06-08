import { describe, expect, it } from "vitest";
import {
  TitimangsaError,
  addWorkdays,
  checkHoliday,
  checkWorkday,
  diffWorkdays,
  formatIsoDate,
  getAvailableYears,
  getDataset,
  getDayName,
  getHolidays,
  getLocalDayName,
  getSources,
  isIsoDate,
  isWeekend,
  isWorkday,
  parseIsoDate,
  parseWeekend,
} from "./index.js";

describe("dataset access", () => {
  it("loads available generated datasets", () => {
    expect(getAvailableYears()).toEqual([2025, 2026]);
    expect(getDataset(2026)).toMatchObject({
      year: 2026,
      countryCode: "ID",
      revision: 1,
      status: "verified",
    });
  });

  it("returns sources for a dataset year", () => {
    const sources = getSources(2026);

    expect(sources).toHaveLength(2);
    expect(sources.every((source) => source.official)).toBe(true);
  });

  it("throws DATASET_NOT_FOUND for unavailable years", () => {
    expect(() => getHolidays(2024)).toThrow(TitimangsaError);

    try {
      getHolidays(2024);
    } catch (error) {
      expect(error).toMatchObject({
        code: "DATASET_NOT_FOUND",
        details: {
          field: "year",
          value: 2024,
        },
      });
    }
  });
});

describe("date utilities", () => {
  it("validates and formats ISO dates without timezone drift", () => {
    expect(isIsoDate("2026-03-20")).toBe(true);
    expect(isIsoDate("2026-02-30")).toBe(false);
    expect(formatIsoDate(parseIsoDate("2026-03-20"))).toBe("2026-03-20");
    expect(getDayName("2026-03-20")).toBe("Friday");
    expect(getLocalDayName("2026-03-20")).toBe("Jumat");
  });

  it("throws INVALID_DATE for invalid date input", () => {
    expect(() => checkHoliday("2026-02-30")).toThrow(TitimangsaError);

    try {
      checkHoliday("2026-02-30");
    } catch (error) {
      expect(error).toMatchObject({
        code: "INVALID_DATE",
        details: {
          field: "date",
          value: "2026-02-30",
        },
      });
    }
  });
});

describe("holiday lookup", () => {
  it("returns holidays and filters by type", () => {
    expect(getHolidays(2026)).toHaveLength(25);
    expect(getHolidays(2026, { type: "national_holiday" })).toHaveLength(17);
    expect(getHolidays(2026, { type: "collective_leave" })).toHaveLength(8);
    expect(getHolidays(2026, { includeCollectiveLeave: false })).toHaveLength(
      17,
    );
  });

  it("checks a holiday date with collective leave enabled by default", () => {
    expect(checkHoliday("2026-03-20")).toMatchObject({
      date: "2026-03-20",
      day: "Friday",
      localDay: "Jumat",
      isHoliday: true,
      holidays: [
        {
          type: "collective_leave",
        },
      ],
    });
  });

  it("can exclude collective leave from holiday checks", () => {
    expect(
      checkHoliday("2026-03-20", { includeCollectiveLeave: false }),
    ).toMatchObject({
      isHoliday: false,
      holidays: [],
    });
  });
});

describe("weekend and workday logic", () => {
  it("uses Saturday and Sunday as the default weekend", () => {
    expect(parseWeekend()).toEqual(["sat", "sun"]);
    expect(isWeekend("2026-03-21")).toBe(true);
    expect(isWeekend("2026-03-20")).toBe(false);
  });

  it("supports custom weekend strings", () => {
    expect(parseWeekend("fri,sat")).toEqual(["fri", "sat"]);
    expect(isWeekend("2026-03-20", { weekend: "fri,sat" })).toBe(true);
  });

  it("checks workdays using weekend and holiday rules", () => {
    expect(isWorkday("2026-03-20")).toBe(false);
    expect(isWorkday("2026-03-20", { includeCollectiveLeave: false })).toBe(
      true,
    );
    expect(
      isWorkday("2026-03-20", {
        includeCollectiveLeave: false,
        weekend: "fri,sat",
      }),
    ).toBe(false);
  });

  it("returns detailed workday check metadata", () => {
    expect(checkWorkday("2026-03-20")).toMatchObject({
      date: "2026-03-20",
      isWeekend: false,
      isHoliday: true,
      isWorkday: false,
      holidayTypes: ["collective_leave"],
    });
  });
});

describe("workday arithmetic", () => {
  it("adds positive workdays without counting the start date", () => {
    expect(addWorkdays("2026-01-02", 1).resultDate).toBe("2026-01-05");
    expect(addWorkdays("2026-03-18", 5).resultDate).toBe("2026-03-31");
  });

  it("rejects non-positive day counts", () => {
    expect(() => addWorkdays("2026-01-02", 0)).toThrow(TitimangsaError);
    expect(() => addWorkdays("2026-01-02", -1)).toThrow(TitimangsaError);
  });

  it("diffs workdays inclusively by default", () => {
    expect(diffWorkdays("2026-01-01", "2026-01-05")).toMatchObject({
      startDate: "2026-01-01",
      endDate: "2026-01-05",
      inclusive: true,
      workdayCount: 2,
      holidayCount: 1,
      weekendCount: 2,
      options: {
        includeCollectiveLeave: true,
        weekend: ["sat", "sun"],
      },
    });
  });

  it("rejects invalid ranges", () => {
    expect(() => diffWorkdays("2026-01-05", "2026-01-01")).toThrow(
      TitimangsaError,
    );
  });
});
