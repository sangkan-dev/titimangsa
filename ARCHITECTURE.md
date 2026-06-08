# Architecture

This document describes the intended MVP architecture for Titimangsa. For product
requirements, read `PRD.md`. For execution order, read `TASK.md`.

## Overview

Titimangsa is designed as a small read-only data API.

```txt
Official public sources
        |
        v
Manual YAML dataset
        |
        v
Validation scripts
        |
        v
Generated JSON
        |
        v
Core package
        |
        v
Hono API on Cloudflare Workers
        |
        v
Public API and docs
```

The main architectural principle is: keep data curation, business logic, and HTTP
transport separate.

## Runtime Architecture

```txt
Client request
    |
    v
apps/api Hono route
    |
    v
API query validation
    |
    v
packages/core function
    |
    v
Generated dataset lookup
    |
    v
Normalized response helper
```

The API must not duplicate date or business-day logic. It should call
`packages/core` for reusable behavior.

## Data Build Architecture

```txt
data/sources/{year}.yaml
    |
    v
scripts/validate.ts
    |
    v
scripts/generate.ts
    |
    v
data/generated/id-{year}.json
data/generated/id-latest.json
```

YAML files are human-curated and reviewable. JSON files are generated artifacts
for runtime use.

## Package Boundaries

### `packages/core`

Owns reusable domain logic:

- dataset lookup
- holiday filtering
- holiday checking
- weekend checking
- workday checking
- add workdays
- diff workdays
- source lookup

Must not depend on:

- Hono
- Cloudflare Workers runtime APIs
- request/response helpers
- docs tooling

### `apps/api`

Owns HTTP concerns:

- Hono routes
- query parsing
- response formatting
- error mapping
- CORS
- cache headers
- Cloudflare Workers entrypoint

Must not own core business-day algorithms.

### `apps/docs`

Owns public documentation:

- getting started
- API reference
- data source explanation
- contribution guide
- limitations and disclaimer

### `data`

Owns curated and generated data:

- `data/sources`: manually curated source YAML
- `data/generated`: generated JSON
- `data/schemas`: validation schemas

### `scripts`

Owns repository automation:

- dataset validation
- dataset generation
- consistency checks

## Dependency Direction

Allowed dependency direction:

```txt
apps/api       -> packages/core
scripts        -> packages/core when useful
tests          -> packages/core and apps/api
apps/docs      -> generated examples or static docs
packages/core  -> data/generated
```

Avoid reverse dependencies. `packages/core` should remain the most reusable
module.

## API Versioning

All public MVP endpoints live under `/v1`.

Breaking response or behavior changes must use a new version path such as `/v2`.
Internal package changes do not require API version changes unless they alter
public behavior.

## Caching

MVP endpoints are read-only and should use:

```http
Cache-Control: public, max-age=3600, s-maxage=86400
```

Data updates happen through new deployments after source YAML changes and
generated JSON is refreshed.

## Deployment Target

The MVP target is Cloudflare Workers.

Cloudflare Workers is chosen because the API is read-heavy, small, and suitable
for edge runtime deployment. The project must not claim the free tier is
unlimited.

## Non-Goals For MVP

Do not add these without an explicit later task:

- database runtime
- API key system
- admin dashboard
- regional holiday support
- multi-country support
- Google Calendar integration
- `.ics` export
- user authentication

## Known Constraints

- Source data can change after government revisions.
- Collective leave may be interpreted differently across sectors.
- The project is unofficial and must keep that disclaimer visible.
- Generated JSON shape should remain stable once MVP API is public.
