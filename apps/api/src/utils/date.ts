import {
  invalidDateError,
  invalidRangeError,
  invalidYearError,
} from "./errors.js";

export function getCurrentYear(): number {
  return new Date().getUTCFullYear();
}

export function getOptionalYear(value: string | undefined): number {
  if (!value) {
    return getCurrentYear();
  }

  if (!/^\d{4}$/.test(value)) {
    throw invalidYearError(value);
  }

  return Number(value);
}

export function getRequiredDate(
  value: string | undefined,
  field: string,
): string {
  if (!value) {
    throw invalidDateError(field, value);
  }

  return value;
}

export function getRequiredPositiveInteger(
  value: string | undefined,
  field: string,
): number {
  if (!value || !/^\d+$/.test(value)) {
    throw invalidRangeError(field, value);
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw invalidRangeError(field, value);
  }

  return parsed;
}

export function getOptionalBoolean(
  value: string | undefined,
  defaultValue: boolean,
  field: string,
): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw invalidRangeError(field, value);
}
