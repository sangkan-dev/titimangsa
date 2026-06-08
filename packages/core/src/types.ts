export type CountryCode = "ID";

export type HolidayType =
  | "national_holiday"
  | "collective_leave"
  | "regional_holiday"
  | "observance"
  | "work_arrangement";

export type DatasetStatus = "draft" | "verified" | "archived" | "deprecated";

export type Weekday = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export type Source = {
  id: string;
  title: string;
  type: string;
  url: string;
  publisher: string;
  publishedAt: string;
  official: boolean;
};

export type Holiday = {
  date: string;
  day: string;
  localDay: string;
  localName: string;
  name: string;
  type: HolidayType;
  isNationalHoliday: boolean;
  isCollectiveLeave: boolean;
  sourceIds: string[];
};

export type Dataset = {
  year: number;
  countryCode: CountryCode;
  revision: number;
  status: DatasetStatus;
  updatedAt: string;
  sources: Source[];
  holidays: Holiday[];
};

export type HolidayOptions = {
  type?: HolidayType | HolidayType[];
  includeCollectiveLeave?: boolean;
};

export type HolidayCheckOptions = {
  includeCollectiveLeave?: boolean;
};

export type WeekendOptions = {
  weekend?: string | Weekday[];
};

export type WorkdayOptions = HolidayCheckOptions & WeekendOptions;

export type WorkdayDiffOptions = WorkdayOptions & {
  inclusive?: boolean;
};

export type HolidayCheckResult = {
  date: string;
  day: string;
  localDay: string;
  isHoliday: boolean;
  holidays: Holiday[];
};

export type WorkdayCheckResult = {
  date: string;
  day: string;
  localDay: string;
  isWeekend: boolean;
  isHoliday: boolean;
  isWorkday: boolean;
  holidayTypes: HolidayType[];
};

export type WorkdayAddResult = {
  startDate: string;
  days: number;
  resultDate: string;
  options: ResolvedWorkdayOptions;
};

export type WorkdayDiffResult = {
  startDate: string;
  endDate: string;
  inclusive: boolean;
  workdayCount: number;
  holidayCount: number;
  weekendCount: number;
  options: ResolvedWorkdayOptions;
};

export type ResolvedWorkdayOptions = {
  includeCollectiveLeave: boolean;
  weekend: Weekday[];
};

export type TitimangsaErrorCode =
  | "INVALID_DATE"
  | "INVALID_YEAR"
  | "INVALID_TYPE"
  | "DATASET_NOT_FOUND"
  | "INVALID_RANGE";

export type TitimangsaErrorDetails = Record<string, unknown>;
