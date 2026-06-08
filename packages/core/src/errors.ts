import type { TitimangsaErrorCode, TitimangsaErrorDetails } from "./types.js";

export class TitimangsaError extends Error {
  readonly code: TitimangsaErrorCode;
  readonly details: TitimangsaErrorDetails;

  constructor(
    code: TitimangsaErrorCode,
    message: string,
    details: TitimangsaErrorDetails = {},
  ) {
    super(message);
    this.name = "TitimangsaError";
    this.code = code;
    this.details = details;
  }
}

export function invalidDate(date: string, field = "date"): TitimangsaError {
  return new TitimangsaError(
    "INVALID_DATE",
    "Date must use YYYY-MM-DD format.",
    {
      field,
      value: date,
    },
  );
}

export function invalidYear(year: number): TitimangsaError {
  return new TitimangsaError(
    "INVALID_YEAR",
    "Year must be a four-digit year.",
    {
      field: "year",
      value: year,
    },
  );
}

export function invalidType(value: string, field = "type"): TitimangsaError {
  return new TitimangsaError("INVALID_TYPE", "Value is not supported.", {
    field,
    value,
  });
}

export function invalidRange(message: string): TitimangsaError {
  return new TitimangsaError("INVALID_RANGE", message);
}

export function datasetNotFound(year: number): TitimangsaError {
  return new TitimangsaError(
    "DATASET_NOT_FOUND",
    `Dataset for year ${year} is not available.`,
    {
      field: "year",
      value: year,
    },
  );
}
