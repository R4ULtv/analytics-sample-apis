# Analytics Sample APIs

A simple analytics API built with Hono.js that generates sample time-series click data using Faker.js.

## Overview

This project provides a mock analytics API endpoint that generates synthetic click data over specified time intervals. It's useful for testing and development of analytics dashboards and visualization tools.

## API Endpoints

### Click Analytics
```
GET /analytics/clicks?interval={value}
```

Generates time-series click data for a specified time interval.

#### Query Parameters

- `interval`: Time interval in the format `<number><unit>` where:
  - `<number>`: A positive integer
  - `<unit>`: One of:
    - `h` (hours)
    - `d` (days)
    - `m` (months)

#### Constraints

- Minimum interval: 12 hours
- Maximum intervals:
  - 90 days
  - 3 months

#### Response Format

Returns an array of 12 evenly spaced data points across the specified interval.

```json
[
  {
    "date": "2024-01-01T00:00:00.000Z",
    "clicks": 123
  },
  ...
]
```

#### Example Usage

```bash
# Get click data for last 24 hours
GET /analytics/clicks?interval=24h

# Get click data for last 7 days
GET /analytics/clicks?interval=7d

# Get click data for last 2 months
GET /analytics/clicks?interval=2m
```

#### Error Responses

The API will return a 400 status code with an error message for:
- Invalid interval format
- Intervals below minimum threshold
- Intervals exceeding maximum threshold

## Technologies Used

- [Hono.js](https://hono.dev/) - Fast, Lightweight, Web-standards API Framework
- [Faker.js](https://fakerjs.dev/) - Generate realistic test data
- CORS enabled for cross-origin requests

## Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

## License

This project is open-source and available under the MIT License.
