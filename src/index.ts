import { Hono } from "hono";
import { cors } from "hono/cors";
import { faker } from "@faker-js/faker";

// Define types
type TimeUnit = "d" | "h" | "m";

interface ClickData {
  date: string;
  clicks: number;
}

interface ErrorResponse {
  error: string;
}

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Analytics Example API's - using faker.js");
});

/**
 * Click Analytics endpoint
 * Returns time-series click data for a specified interval
 * @param {string} interval - Time interval in format: <number>d|h|m (days, hours, months)
 * @returns {Array<ClickData>} Array of objects containing date and click count
 * Constraints:
 * - Minimum interval: 12 hours
 * - Maximum interval: 90 days or 3 months
 * - Returns 12 evenly spaced data points across the interval
 */
app.get("/analytics/clicks", async (c) => {
  const interval: string = c.req.query("interval") ?? "24h";
  const match: RegExpMatchArray | null = interval.match(/^(\d+)(d|h|m)$/);

  if (!match) {
    const response: ErrorResponse = {
      error:
        "Invalid interval format. Use format: <number>d or <number>h or <number>m",
    };
    return c.json(response, 400);
  }

  const value: number = parseInt(match[1]);
  const unit: TimeUnit = match[2] as TimeUnit;

  // Validate constraints
  if (unit === "h" && value < 12) {
    const response: ErrorResponse = { error: "Minimum interval is 12 hours" };
    return c.json(response, 400);
  }

  if (unit === "d" && value > 90) {
    const response: ErrorResponse = { error: "Maximum interval is 90 days" };
    return c.json(response, 400);
  }

  if (unit === "m" && value > 3) {
    const response: ErrorResponse = { error: "Maximum interval is 3 months" };
    return c.json(response, 400);
  }

  // Calculate interval in hours
  const intervalInHours: number =
    unit === "m" ? value * 30 * 24 : unit === "d" ? value * 24 : value;

  const stepSize: number = intervalInHours / 11; // 11 steps for 12 points

  // Generate data points
  const data: ClickData[] = [...Array(12)].map((_, i) => {
    const hoursAgo: number = i * stepSize;
    const date: Date = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    return {
      date: date.toISOString(),
      clicks: faker.number.int({ min: 0, max: 500 }),
    };
  });

  data.reverse();
  return c.json(data);
});

export default app;
