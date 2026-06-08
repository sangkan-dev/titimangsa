import { Hono } from "hono";
import { listSources } from "../services/source-service.js";
import { getOptionalYear } from "../utils/date.js";
import { assertKnownQueryParams } from "../utils/query.js";
import { successResponse } from "../utils/response.js";

export const sourcesRoute = new Hono();

sourcesRoute.get("/", (c) => {
  assertKnownQueryParams(c.req.query(), ["year"]);

  const year = getOptionalYear(c.req.query("year"));
  const result = listSources(year);

  return successResponse(c, result.data, result.meta);
});
