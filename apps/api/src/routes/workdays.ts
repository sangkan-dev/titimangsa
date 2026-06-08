import { Hono } from "hono";
import {
  getWorkdayAdd,
  getWorkdayCheck,
  getWorkdayDiff,
} from "../services/workday-service.js";
import {
  getOptionalBoolean,
  getRequiredDate,
  getRequiredPositiveInteger,
} from "../utils/date.js";
import { assertKnownQueryParams } from "../utils/query.js";
import { successResponse } from "../utils/response.js";

export const workdaysRoute = new Hono();

workdaysRoute.get("/check", (c) => {
  assertKnownQueryParams(c.req.query(), [
    "date",
    "includeCollectiveLeave",
    "weekend",
  ]);

  const date = getRequiredDate(c.req.query("date"), "date");
  const includeCollectiveLeave = getOptionalBoolean(
    c.req.query("includeCollectiveLeave"),
    true,
    "includeCollectiveLeave",
  );
  const weekend = c.req.query("weekend");
  const result = getWorkdayCheck({
    date,
    includeCollectiveLeave,
    ...(weekend ? { weekend } : {}),
  });

  return successResponse(c, result.data, result.meta);
});

workdaysRoute.get("/add", (c) => {
  assertKnownQueryParams(c.req.query(), [
    "date",
    "days",
    "includeCollectiveLeave",
    "weekend",
  ]);

  const date = getRequiredDate(c.req.query("date"), "date");
  const days = getRequiredPositiveInteger(c.req.query("days"), "days");
  const includeCollectiveLeave = getOptionalBoolean(
    c.req.query("includeCollectiveLeave"),
    true,
    "includeCollectiveLeave",
  );
  const weekend = c.req.query("weekend");
  const result = getWorkdayAdd({
    date,
    days,
    includeCollectiveLeave,
    ...(weekend ? { weekend } : {}),
  });

  return successResponse(c, result.data, result.meta);
});

workdaysRoute.get("/diff", (c) => {
  assertKnownQueryParams(c.req.query(), [
    "start",
    "end",
    "includeCollectiveLeave",
    "inclusive",
    "weekend",
  ]);

  const start = getRequiredDate(c.req.query("start"), "start");
  const end = getRequiredDate(c.req.query("end"), "end");
  const includeCollectiveLeave = getOptionalBoolean(
    c.req.query("includeCollectiveLeave"),
    true,
    "includeCollectiveLeave",
  );
  const inclusive = getOptionalBoolean(
    c.req.query("inclusive"),
    true,
    "inclusive",
  );
  const weekend = c.req.query("weekend");
  const result = getWorkdayDiff({
    start,
    end,
    includeCollectiveLeave,
    inclusive,
    ...(weekend ? { weekend } : {}),
  });

  return successResponse(c, result.data, result.meta);
});
