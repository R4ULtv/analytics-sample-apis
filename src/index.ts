import { Hono } from "hono";
import { cors } from "hono/cors";
import { faker } from "@faker-js/faker";

interface ClickData {
  date: string;
  clicks: number;
}

interface DeviceData {
  device?: string;
  browser?: string;
  os?: string;
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
 * Returns time-series click data for a date range
 * @param {string} from - Start date in ISO format
 * @param {string} to - End date in ISO format
 * @returns {Array<ClickData>} Array of objects containing date and click count
 * Constraints:
 * - Maximum range of 90 days
 * - Minimum range of 12 hours
 * - Returns 12 evenly spaced data points across the period
 */
app.get("/analytics/clicks", async (c) => {
  let fromDate = c.req.query("from");
  let toDate = c.req.query("to");

  // Set default 12 hour range if dates not provided
  if (!fromDate || !toDate) {
    const now = new Date();
    toDate = now.toISOString();
    fromDate = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString();
  }

  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    const response: ErrorResponse = {
      error: "Invalid date format. Use ISO date format",
    };
    return c.json(response, 400);
  }

  const diffInDays =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

  if (diffInDays > 90) {
    const response: ErrorResponse = {
      error: "Date range cannot exceed 90 days",
    };
    return c.json(response, 400);
  }

  if (diffInDays < 0.5) {
    const response: ErrorResponse = {
      error: "Minimum interval is 12 hours",
    };
    return c.json(response, 400);
  }

  const totalHours =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const stepSize = totalHours / 11; // 11 steps for 12 points

  // Generate data points
  const data: ClickData[] = [...Array(12)].map((_, i) => {
    const timePoint = new Date(
      startDate.getTime() + i * stepSize * 60 * 60 * 1000,
    );
    return {
      date: timePoint.toISOString(),
      clicks: faker.number.int({ min: 0, max: 500 }),
    };
  });

  return c.json(data);
});

/**
 * Device Analytics endpoint
 * Returns click data by device type for a date range
 * @param {string} from - Start date in ISO format
 * @param {string} to - End date in ISO format
 * @returns {Array<DeviceData>} Array of objects containing device type and click count
 */
app.get("/analytics/devices/:category", async (c) => {
  const category = c.req.param("category");
  let fromDate = c.req.query("from");
  let toDate = c.req.query("to");

  // Set default 12 hour range if dates not provided
  if (!fromDate || !toDate) {
    const now = new Date();
    toDate = now.toISOString();
    fromDate = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString();
  }

  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    const response: ErrorResponse = {
      error: "Invalid date format. Use ISO date format",
    };
    return c.json(response, 400);
  }

  const diffInDays =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

  if (diffInDays > 90) {
    const response: ErrorResponse = {
      error: "Date range cannot exceed 90 days",
    };
    return c.json(response, 400);
  }

  if (diffInDays < 0.5) {
    const response: ErrorResponse = {
      error: "Minimum interval is 12 hours",
    };
    return c.json(response, 400);
  }

  let devices: DeviceData[] = [];

  switch (category) {
    case "device":
      devices = [
        {
          device: "Desktop",
          clicks: faker.number.int({ min: 100, max: 1000 }),
        },
        {
          device: "Mobile",
          clicks: faker.number.int({ min: 100, max: 1000 }),
        },
        {
          device: "Tablet",
          clicks: faker.number.int({ min: 50, max: 500 }),
        },
      ].sort((a, b) => b.clicks - a.clicks);
      break;
    case "browser":
      devices = [
        {
          browser: "Chrome",
          clicks: faker.number.int({ min: 100, max: 1000 }),
        },
        {
          browser: "Firefox",
          clicks: faker.number.int({ min: 50, max: 800 }),
        },
        {
          browser: "Safari",
          clicks: faker.number.int({ min: 50, max: 700 }),
        },
        {
          browser: "Edge",
          clicks: faker.number.int({ min: 20, max: 500 }),
        },
      ].sort((a, b) => b.clicks - a.clicks);
      break;
    case "os":
      devices = [
        {
          os: "Windows",
          clicks: faker.number.int({ min: 100, max: 1000 }),
        },
        {
          os: "MacOS",
          clicks: faker.number.int({ min: 50, max: 800 }),
        },
        {
          os: "Android",
          clicks: faker.number.int({ min: 50, max: 700 }),
        },
        {
          os: "iOS",
          clicks: faker.number.int({ min: 40, max: 600 }),
        },
        {
          os: "Linux",
          clicks: faker.number.int({ min: 10, max: 300 }),
        },
      ].sort((a, b) => b.clicks - a.clicks);
      break;
    default:
      return c.json(
        { error: "Invalid category. Use device, browser, or os" },
        400,
      );
  }

  return c.json(devices);
});

export default app;
