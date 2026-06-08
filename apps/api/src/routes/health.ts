import type { Context } from "hono";
import { successResponse } from "../utils/response.js";

export function handleHealth(c: Context) {
  return successResponse(c, {
    status: "ok",
    service: "titimangsa",
    version: "v1",
  });
}
