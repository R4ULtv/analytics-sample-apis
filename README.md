# Analytics Sample APIs

A simple analytics API that provides mock data for click analytics and device statistics using Faker.js.

## API Endpoints

### Click Analytics
```http
GET /analytics/clicks?from={value}&to={value}
```
Returns time-series click data for a specified date range.

#### Query Parameters
- `from` (optional): Start date in ISO format
- `to` (optional): End date in ISO format

#### Constraints
- Minimum date range: 12 hours
- Maximum date range: 90 days
- Returns 12 evenly spaced data points across the period
- If dates are not provided, defaults to last 12 hours

#### Response Format
```json
[
  {
    "date": "2024-01-01T00:00:00.000Z",
    "clicks": 250
  }
]
```

### Device Analytics
```http
GET /analytics/devices/:category
```
Returns click distribution data by device category.

#### Path Parameters
- `category`: One of the following values:
  - `device`: Device type distribution
  - `browser`: Browser distribution
  - `os`: Operating system distribution

#### Query Parameters
- `from` (optional): Start date in ISO format
- `to` (optional): End date in ISO format

#### Constraints
- Maximum date range: 90 days
- Minimum date range: 12 hours
- If dates are not provided, defaults to last 12 hours

#### Response Format
Based on category:

Device category:
```json
[
  {
    "device": "Desktop",
    "clicks": 750
  }
]
```

Browser category:
```json
[
  {
    "browser": "Chrome",
    "clicks": 850
  }
]
```

OS category:
```json
[
  {
    "os": "Windows",
    "clicks": 920
  }
]
```

## Error Responses
The API returns appropriate error messages with 400 status code for:
- Invalid date formats
- Date range exceeding 90 days
- Date range less than 12 hours
- Invalid device category

Error response format:
```json
{
  "error": "Error message here"
}
```

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
