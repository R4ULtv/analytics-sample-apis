import { Hono } from "hono";
import { cors } from "hono/cors";
import { faker } from "@faker-js/faker";

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Analytics Example API's - using faker.js");
});

/**
 * Click Analytics endpoint
 * Returns time-series click data for a specified interval
 * @param {string} interval - Time interval in format: <number>d|h|m (days, hours, months)
 * @returns {Array} Array of objects containing date and click count
 * Constraints:
 * - Minimum interval: 12 hours
 * - Maximum interval: 90 days or 3 months
 * - Returns 12 evenly spaced data points across the interval
 */
app.get("/analytics/clicks", async (c) => {
  const interval = c.req.query("interval") ?? "24h";
  const match = interval.match(/^(\d+)(d|h|m)$/);

  if (!match) {
    return c.json(
      {
        error:
          "Invalid interval format. Use format: <number>d or <number>h or <number>m",
      },
      400,
    );
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  if (unit === "h" && value < 12) {
    return c.json({ error: "Minimum interval is 12 hours" }, 400);
  }

  if (unit === "d" && value > 90) {
    return c.json({ error: "Maximum interval is 90 days" }, 400);
  }

  if (unit === "m" && value > 3) {
    return c.json({ error: "Maximum interval is 3 months" }, 400);
  }

  const intervalInHours =
    unit === "m" ? value * 30 * 24 : unit === "d" ? value * 24 : value;
  const stepSize = intervalInHours / 11; // 11 steps for 12 points

  const data = [...Array(12)].map((_, i) => {
    const hoursAgo = i * stepSize;
    const date = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    return {
      date: date.toISOString(),
      clicks: faker.number.int({ min: 0, max: 500 }),
    };
  });

  data.reverse();

  return c.json(data);
});

export default app;
