# Getting Started

Titimangsa provides a read-only API for Indonesian national holidays, collective
leave, and business day calculations.

Base URL:

```txt
https://titimangsa.sangkan.dev
```

## Check Service Health

```sh
curl "https://titimangsa.sangkan.dev/v1/health"
```

Response:

```json
{
  "meta": {
    "version": "v1",
    "countryCode": "ID"
  },
  "data": {
    "status": "ok",
    "service": "titimangsa",
    "version": "v1"
  }
}
```

## List Holidays

```sh
curl "https://titimangsa.sangkan.dev/v1/holidays?year=2026"
```

Use `type=national_holiday` or `type=collective_leave` to filter entries.

## Check a Date

```sh
curl "https://titimangsa.sangkan.dev/v1/holidays/check?date=2026-03-20"
```

## Check a Workday

```sh
curl "https://titimangsa.sangkan.dev/v1/workdays/check?date=2026-03-20"
```

By default, `includeCollectiveLeave=true` and weekend is `sat,sun`.

## Add Workdays

```sh
curl "https://titimangsa.sangkan.dev/v1/workdays/add?date=2026-03-18&days=5"
```

The start date is not counted as the first workday.

## Count Workdays

```sh
curl "https://titimangsa.sangkan.dev/v1/workdays/diff?start=2026-01-01&end=2026-01-05"
```

The `inclusive` option defaults to `true`.

## Response Shape

Successful responses use:

```json
{
  "meta": {
    "version": "v1",
    "countryCode": "ID"
  },
  "data": {}
}
```

Errors use:

```json
{
  "error": {
    "code": "INVALID_DATE",
    "message": "Date must use YYYY-MM-DD format.",
    "details": {
      "field": "date"
    }
  }
}
```
