# API Contract

This document captures the MVP public API contract. `PRD.md` remains the source
of complete product requirements.

## Base Rules

- Public endpoints live under `/v1`.
- MVP API is read-only.
- Supported methods are `GET` and `OPTIONS`.
- Endpoints reject query parameters that are not documented for that endpoint.
- Runtime target is Cloudflare Workers.
- API framework is Hono.
- Country code is `ID`.

## Success Response

All successful responses should use:

```json
{
  "meta": {
    "version": "v1",
    "countryCode": "ID"
  },
  "data": []
}
```

Endpoint-specific metadata may add fields such as:

- `year`
- `revision`
- `status`
- `total`
- `updatedAt`

## Error Response

All errors should use:

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

## Error Codes

| Code                | HTTP | Description                                 |
| ------------------- | ---: | ------------------------------------------- |
| `INVALID_DATE`      |  400 | Date format is invalid                      |
| `INVALID_YEAR`      |  400 | Year is invalid                             |
| `INVALID_TYPE`      |  400 | Query value or holiday type is unsupported  |
| `DATASET_NOT_FOUND` |  404 | Dataset for requested year is not available |
| `INVALID_RANGE`     |  400 | Date range is invalid                       |
| `INTERNAL_ERROR`    |  500 | Internal error                              |

## Cache Headers

Read-only endpoints should return:

```http
Cache-Control: public, max-age=3600, s-maxage=86400
```

## CORS

MVP CORS:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Endpoints

### `GET /v1/health`

Returns service health.

Expected data:

```json
{
  "status": "ok",
  "service": "titimangsa",
  "version": "v1"
}
```

### `GET /v1/holidays`

Query params:

| Param            | Required | Default      | Description             |
| ---------------- | -------: | ------------ | ----------------------- |
| `year`           |       No | current year | Dataset year            |
| `type`           |       No | all          | Holiday type filter     |
| `includeSources` |       No | false        | Include source metadata |

### `GET /v1/holidays/check`

Query params:

| Param                    | Required | Default | Description                       |
| ------------------------ | -------: | ------- | --------------------------------- |
| `date`                   |      Yes | none    | Date in `YYYY-MM-DD`              |
| `includeCollectiveLeave` |       No | true    | Count collective leave as holiday |
| `includeSources`         |       No | false   | Include source metadata           |

### `GET /v1/workdays/check`

Query params:

| Param                    | Required | Default   | Description                           |
| ------------------------ | -------: | --------- | ------------------------------------- |
| `date`                   |      Yes | none      | Date in `YYYY-MM-DD`                  |
| `includeCollectiveLeave` |       No | true      | Count collective leave as non-workday |
| `weekend`                |       No | `sat,sun` | Weekend days                          |

### `GET /v1/workdays/add`

Query params:

| Param                    | Required | Default   | Description                           |
| ------------------------ | -------: | --------- | ------------------------------------- |
| `date`                   |      Yes | none      | Start date                            |
| `days`                   |      Yes | none      | Positive integer                      |
| `includeCollectiveLeave` |       No | true      | Count collective leave as non-workday |
| `weekend`                |       No | `sat,sun` | Weekend days                          |

Rules:

- `days` must be an integer.
- MVP only needs positive `days`.
- Start date is not counted as the first workday.

### `GET /v1/workdays/diff`

Query params:

| Param                    | Required | Default   | Description                           |
| ------------------------ | -------: | --------- | ------------------------------------- |
| `start`                  |      Yes | none      | Start date                            |
| `end`                    |      Yes | none      | End date                              |
| `includeCollectiveLeave` |       No | true      | Count collective leave as non-workday |
| `weekend`                |       No | `sat,sun` | Weekend days                          |
| `inclusive`              |       No | true      | Include boundary dates                |

### `GET /v1/sources`

Query params:

| Param  | Required | Default      | Description  |
| ------ | -------: | ------------ | ------------ |
| `year` |       No | current year | Dataset year |

## Stability Rule

Once MVP is public, changing response shape or business behavior requires either:

- a backwards-compatible extension, or
- a new version path such as `/v2`.
