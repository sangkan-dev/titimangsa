import { Hono } from "hono";
import { cors } from "hono/cors";
import { handleHealth } from "./routes/health.js";
import { holidaysRoute } from "./routes/holidays.js";
import { sourcesRoute } from "./routes/sources.js";
import { workdaysRoute } from "./routes/workdays.js";
import { handleApiError, notFoundError } from "./utils/errors.js";
import { cacheControlHeader } from "./utils/response.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.use("*", async (c, next) => {
  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }

  if (c.req.method !== "GET") {
    return handleApiError(
      c,
      notFoundError("Only GET and OPTIONS are supported."),
    );
  }

  await next();
});

app.use("/v1/*", async (c, next) => {
  await next();
  c.header("Cache-Control", cacheControlHeader);
});

app.get("/v1/health", handleHealth);
app.route("/v1/holidays", holidaysRoute);
app.route("/v1/workdays", workdaysRoute);
app.route("/v1/sources", sourcesRoute);

app.notFound((c) => handleApiError(c, notFoundError("Endpoint not found.")));
app.onError((error, c) => handleApiError(c, error));

export default app;
