import { invalidQueryError } from "./errors.js";

export function assertKnownQueryParams(
  query: Record<string, string>,
  allowedParams: readonly string[],
): void {
  const allowed = new Set(allowedParams);

  for (const param of Object.keys(query)) {
    if (!allowed.has(param)) {
      throw invalidQueryError(param);
    }
  }
}
