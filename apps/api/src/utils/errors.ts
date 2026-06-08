import { TitimangsaError } from "@sangkan-dev/titimangsa";
import type { Context } from "hono";

type ApiErrorCode =
  | "INVALID_DATE"
  | "INVALID_YEAR"
  | "INVALID_TYPE"
  | "DATASET_NOT_FOUND"
  | "INVALID_RANGE"
  | "INTERNAL_ERROR";

type ApiError = {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
};

class ApiHttpError extends Error implements ApiError {
  readonly code: ApiErrorCode;
  readonly details: Record<string, unknown>;

  constructor(
    code: ApiErrorCode,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiHttpError";
    this.code = code;
    this.details = details ?? {};
  }
}

const statusByCode = {
  INVALID_DATE: 400,
  INVALID_YEAR: 400,
  INVALID_TYPE: 400,
  DATASET_NOT_FOUND: 404,
  INVALID_RANGE: 400,
  INTERNAL_ERROR: 500,
} as const satisfies Record<ApiErrorCode, number>;

export function handleApiError(c: Context, error: unknown) {
  const apiError = toApiError(error);
  const status = statusByCode[apiError.code];

  return c.json(
    {
      error: {
        code: apiError.code,
        message: apiError.message,
        details: apiError.details ?? {},
      },
    },
    status,
  );
}

export function invalidDateError(field: string, value?: string): ApiError {
  return new ApiHttpError("INVALID_DATE", "Date must use YYYY-MM-DD format.", {
    field,
    value,
  });
}

export function invalidYearError(value?: string): ApiError {
  return new ApiHttpError("INVALID_YEAR", "Year must be a four-digit year.", {
    field: "year",
    value,
  });
}

export function invalidRangeError(field: string, value?: string): ApiError {
  return new ApiHttpError(
    "INVALID_RANGE",
    "Value must be a positive integer.",
    {
      field,
      value,
    },
  );
}

export function invalidBooleanError(field: string, value?: string): ApiError {
  return new ApiHttpError("INVALID_TYPE", "Value must be true or false.", {
    field,
    value,
  });
}

export function invalidQueryError(field: string): ApiError {
  return new ApiHttpError("INVALID_TYPE", "Query parameter is not supported.", {
    field,
  });
}

export function notFoundError(message: string): ApiError {
  return new ApiHttpError("DATASET_NOT_FOUND", message);
}

function toApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof TitimangsaError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  return {
    code: "INTERNAL_ERROR",
    message: "Internal error.",
  };
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}
