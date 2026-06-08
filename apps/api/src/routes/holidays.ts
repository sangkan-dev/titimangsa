import { Hono } from "hono";
import { getHolidayCheck, listHolidays } from "../services/holiday-service.js";
import {
  getOptionalBoolean,
  getOptionalYear,
  getRequiredDate,
} from "../utils/date.js";
import { successResponse } from "../utils/response.js";

export const holidaysRoute = new Hono();

holidaysRoute.get("/", (c) => {
  const year = getOptionalYear(c.req.query("year"));
  const includeSources = getOptionalBoolean(
    c.req.query("includeSources"),
    false,
    "includeSources",
  );
  const type = c.req.query("type");
  const result = listHolidays({
    year,
    includeSources,
    ...(type ? { type } : {}),
  });

  return successResponse(c, result.data, result.meta);
});

holidaysRoute.get("/check", (c) => {
  const date = getRequiredDate(c.req.query("date"), "date");
  const includeCollectiveLeave = getOptionalBoolean(
    c.req.query("includeCollectiveLeave"),
    true,
    "includeCollectiveLeave",
  );
  const includeSources = getOptionalBoolean(
    c.req.query("includeSources"),
    false,
    "includeSources",
  );
  const result = getHolidayCheck({
    date,
    includeCollectiveLeave,
    includeSources,
  });

  return successResponse(c, result.data, result.meta);
});
