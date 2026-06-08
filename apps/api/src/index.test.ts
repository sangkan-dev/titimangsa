import { describe, expect, it } from "vitest";
import app from "./index.js";

async function getJson(path: string) {
  const response = await app.request(path);
  const json = (await response.json()) as {
    meta: Record<string, unknown>;
    data: any;
    error?: {
      code: string;
      details?: Record<string, unknown>;
    };
  };

  return { response, json };
}

describe("API MVP", () => {
  it("serves health endpoint", async () => {
    const { response, json } = await getJson("/v1/health");

    expect(response.status).toBe(200);
    expect(json).toMatchObject({
      meta: {
        version: "v1",
        countryCode: "ID",
      },
      data: {
        status: "ok",
        service: "titimangsa",
        version: "v1",
      },
    });
  });

  it("lists holidays using the default current year", async () => {
    const { json } = await getJson("/v1/holidays");

    expect(json.meta.year).toBe(2026);
    expect(json.meta.total).toBe(25);
    expect(json.data).toHaveLength(25);
  });

  it("lists holidays by year", async () => {
    const { json } = await getJson("/v1/holidays?year=2025");

    expect(json.meta).toMatchObject({
      year: 2025,
      total: 28,
    });
    expect(json.data).toHaveLength(28);
  });

  it("filters holidays by type", async () => {
    const { json } = await getJson(
      "/v1/holidays?year=2026&type=national_holiday",
    );

    expect(json.meta.total).toBe(17);
    expect(
      json.data.every(
        (holiday: { type: string }) => holiday.type === "national_holiday",
      ),
    ).toBe(true);
  });

  it("checks holidays", async () => {
    const { json } = await getJson("/v1/holidays/check?date=2026-03-20");

    expect(json).toMatchObject({
      meta: {
        year: 2026,
      },
      data: {
        date: "2026-03-20",
        isHoliday: true,
        holidays: [
          {
            type: "collective_leave",
          },
        ],
      },
    });
  });

  it("can include source metadata in holiday responses", async () => {
    const { json } = await getJson(
      "/v1/holidays/check?date=2026-03-20&includeSources=true",
    );

    expect(json.data.holidays[0].sources).toHaveLength(2);
    expect(json.data.holidays[0].sources[0]).toMatchObject({
      official: true,
    });
  });

  it("can exclude collective leave from holiday checks", async () => {
    const { json } = await getJson(
      "/v1/holidays/check?date=2026-03-20&includeCollectiveLeave=false",
    );

    expect(json.data).toMatchObject({
      isHoliday: false,
      holidays: [],
    });
  });

  it("checks workdays", async () => {
    const { json } = await getJson("/v1/workdays/check?date=2026-03-20");

    expect(json.data).toMatchObject({
      date: "2026-03-20",
      isWeekend: false,
      isHoliday: true,
      isWorkday: false,
      holidayTypes: ["collective_leave"],
    });
  });

  it("supports custom weekend query values", async () => {
    const { json } = await getJson(
      "/v1/workdays/check?date=2026-03-20&includeCollectiveLeave=false&weekend=fri,sat",
    );

    expect(json.data).toMatchObject({
      isWeekend: true,
      isHoliday: false,
      isWorkday: false,
    });
  });

  it("adds workdays", async () => {
    const { json } = await getJson("/v1/workdays/add?date=2026-03-18&days=5");

    expect(json.data).toMatchObject({
      startDate: "2026-03-18",
      days: 5,
      resultDate: "2026-03-31",
      options: {
        includeCollectiveLeave: true,
        weekend: ["sat", "sun"],
      },
    });
  });

  it("diffs workdays", async () => {
    const { json } = await getJson(
      "/v1/workdays/diff?start=2026-01-01&end=2026-01-05",
    );

    expect(json.data).toMatchObject({
      startDate: "2026-01-01",
      endDate: "2026-01-05",
      inclusive: true,
      workdayCount: 2,
      holidayCount: 1,
      weekendCount: 2,
    });
  });

  it("lists sources", async () => {
    const { json } = await getJson("/v1/sources?year=2026");

    expect(json.meta).toMatchObject({
      year: 2026,
      total: 2,
    });
    expect(json.data).toHaveLength(2);
  });

  it("returns 400 for invalid dates", async () => {
    const { response, json } = await getJson(
      "/v1/holidays/check?date=2026-02-30",
    );

    expect(response.status).toBe(400);
    expect(json.error).toMatchObject({
      code: "INVALID_DATE",
      details: {
        field: "date",
      },
    });
  });

  it("returns 400 for invalid holiday types", async () => {
    const { response, json } = await getJson("/v1/holidays?year=2026&type=foo");

    expect(response.status).toBe(400);
    expect(json.error).toMatchObject({
      code: "INVALID_TYPE",
      details: {
        field: "type",
        value: "foo",
      },
    });
  });

  it("returns 400 for unsupported query parameters", async () => {
    const { response, json } = await getJson(
      "/v1/workdays/check?date=2026-03-20&foo=bar",
    );

    expect(response.status).toBe(400);
    expect(json.error).toMatchObject({
      code: "INVALID_TYPE",
      message: "Query parameter is not supported.",
      details: {
        field: "foo",
      },
    });
  });

  it("returns 400 for invalid boolean query values", async () => {
    const { response, json } = await getJson(
      "/v1/holidays/check?date=2026-03-20&includeCollectiveLeave=yes",
    );

    expect(response.status).toBe(400);
    expect(json.error).toMatchObject({
      code: "INVALID_TYPE",
      message: "Value must be true or false.",
      details: {
        field: "includeCollectiveLeave",
        value: "yes",
      },
    });
  });

  it("returns 404 for missing datasets", async () => {
    const { response, json } = await getJson("/v1/holidays?year=2024");

    expect(response.status).toBe(404);
    expect(json.error).toMatchObject({
      code: "DATASET_NOT_FOUND",
    });
  });

  it("sets cache headers", async () => {
    const response = await app.request("/v1/holidays?year=2026");

    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=3600, s-maxage=86400",
    );
  });

  it("sets CORS headers", async () => {
    const response = await app.request("/v1/health");

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("handles CORS preflight", async () => {
    const response = await app.request("/v1/health", {
      method: "OPTIONS",
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
      "GET",
    );
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
      "OPTIONS",
    );
  });
});
