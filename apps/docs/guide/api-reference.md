# API Reference

All public endpoints live under `/v1`. The API is read-only and supports `GET`
and `OPTIONS`.

Endpoints reject query parameters that are not documented for that endpoint.

## Headers

Read-only responses include:

```http
Cache-Control: public, max-age=3600, s-maxage=86400
Access-Control-Allow-Origin: *
```

## `GET /v1/health`

Returns service health.

```sh
curl "https://titimangsa.sangkan.dev/v1/health"
```

## `GET /v1/holidays`

Query parameters:

| Param            | Required | Default      | Description                              |
| ---------------- | -------: | ------------ | ---------------------------------------- |
| `year`           |       No | current year | Dataset year                             |
| `type`           |       No | all          | `national_holiday` or `collective_leave` |
| `includeSources` |       No | `false`      | Include source metadata                  |

Example:

```sh
curl "https://titimangsa.sangkan.dev/v1/holidays?year=2026&type=national_holiday"
```

Response excerpt:

```json
{
  "meta": {
    "version": "v1",
    "countryCode": "ID",
    "year": 2026,
    "revision": 1,
    "status": "verified",
    "total": 17
  },
  "data": [
    {
      "date": "2026-01-01",
      "day": "Thursday",
      "localDay": "Kamis",
      "localName": "Tahun Baru 2026 Masehi",
      "name": "New Year's Day 2026",
      "type": "national_holiday",
      "isNationalHoliday": true,
      "isCollectiveLeave": false
    }
  ]
}
```

## `GET /v1/holidays/check`

Query parameters:

| Param                    | Required | Default | Description                       |
| ------------------------ | -------: | ------- | --------------------------------- |
| `date`                   |      Yes | none    | Date in `YYYY-MM-DD`              |
| `includeCollectiveLeave` |       No | `true`  | Count collective leave as holiday |
| `includeSources`         |       No | `false` | Include source metadata           |

Example:

```sh
curl "https://titimangsa.sangkan.dev/v1/holidays/check?date=2026-03-20"
```

## `GET /v1/workdays/check`

Query parameters:

| Param                    | Required | Default   | Description                           |
| ------------------------ | -------: | --------- | ------------------------------------- |
| `date`                   |      Yes | none      | Date in `YYYY-MM-DD`                  |
| `includeCollectiveLeave` |       No | `true`    | Count collective leave as non-workday |
| `weekend`                |       No | `sat,sun` | Comma-separated weekend days          |

Example:

```sh
curl "https://titimangsa.sangkan.dev/v1/workdays/check?date=2026-03-20"
```

## `GET /v1/workdays/add`

Query parameters:

| Param                    | Required | Default   | Description                           |
| ------------------------ | -------: | --------- | ------------------------------------- |
| `date`                   |      Yes | none      | Start date                            |
| `days`                   |      Yes | none      | Positive integer                      |
| `includeCollectiveLeave` |       No | `true`    | Count collective leave as non-workday |
| `weekend`                |       No | `sat,sun` | Comma-separated weekend days          |

Example:

```sh
curl "https://titimangsa.sangkan.dev/v1/workdays/add?date=2026-03-18&days=5"
```

## `GET /v1/workdays/diff`

Query parameters:

| Param                    | Required | Default   | Description                           |
| ------------------------ | -------: | --------- | ------------------------------------- |
| `start`                  |      Yes | none      | Start date                            |
| `end`                    |      Yes | none      | End date                              |
| `includeCollectiveLeave` |       No | `true`    | Count collective leave as non-workday |
| `weekend`                |       No | `sat,sun` | Comma-separated weekend days          |
| `inclusive`              |       No | `true`    | Include boundary dates                |

Example:

```sh
curl "https://titimangsa.sangkan.dev/v1/workdays/diff?start=2026-01-01&end=2026-01-05"
```

## `GET /v1/sources`

Query parameters:

| Param  | Required | Default      | Description  |
| ------ | -------: | ------------ | ------------ |
| `year` |       No | current year | Dataset year |

Example:

```sh
curl "https://titimangsa.sangkan.dev/v1/sources?year=2026"
```

## Error Codes

| Code                | HTTP | Description                                 |
| ------------------- | ---: | ------------------------------------------- |
| `INVALID_DATE`      |  400 | Date format is invalid                      |
| `INVALID_YEAR`      |  400 | Year is invalid                             |
| `INVALID_TYPE`      |  400 | Query value or holiday type is unsupported  |
| `DATASET_NOT_FOUND` |  404 | Dataset for requested year is not available |
| `INVALID_RANGE`     |  400 | Date range is invalid                       |
| `INTERNAL_ERROR`    |  500 | Internal error                              |
