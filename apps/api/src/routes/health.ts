import type { Context } from "hono";
import { assertKnownQueryParams } from "../utils/query.js";
import { successResponse } from "../utils/response.js";

export function handleHealth(c: Context) {
  assertKnownQueryParams(c.req.query(), []);

  return successResponse(c, {
    status: "ok",
    service: "titimangsa",
    version: "v1",
  });
}
