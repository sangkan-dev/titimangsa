import type { Context } from "hono";

export const apiVersion = "v1";
export const countryCode = "ID";
export const cacheControlHeader = "public, max-age=3600, s-maxage=86400";

export type SuccessMeta = {
  year?: number;
  revision?: number;
  status?: string;
  total?: number;
  updatedAt?: string;
};

export function successResponse<TData>(
  c: Context,
  data: TData,
  meta: SuccessMeta = {},
) {
  return c.json({
    meta: {
      version: apiVersion,
      countryCode,
      ...meta,
    },
    data,
  });
}
