# Titimangsa

[![Validate](https://github.com/sangkan-dev/titimangsa/actions/workflows/validate-data.yml/badge.svg)](https://github.com/sangkan-dev/titimangsa/actions/workflows/validate-data.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

API hari libur Indonesia dan perhitungan hari kerja, dikurasi dari sumber resmi
publik.

Titimangsa provides curated Indonesian national holiday, collective leave, and
business day calculation data for developer workflows such as payroll,
attendance, SLA, invoices, scheduling, and operational systems.

> Titimangsa is not an official government API. The dataset is curated from
> publicly available official government documents. Always refer to the original
> documents for legal or administrative certainty.

> Titimangsa bukan API resmi pemerintah. Dataset dikurasi dari dokumen resmi
> pemerintah yang tersedia untuk publik. Untuk kepastian hukum atau
> administratif, selalu rujuk dokumen sumber asli.

## Quick Start

Base URL:

```txt
https://titimangsa.sangkan.dev
```

Check service health:

```sh
curl "https://titimangsa.sangkan.dev/v1/health"
```

List Indonesian national holidays for 2026:

```sh
curl "https://titimangsa.sangkan.dev/v1/holidays?year=2026&type=national_holiday"
```

Check whether a date is a workday:

```sh
curl "https://titimangsa.sangkan.dev/v1/workdays/check?date=2026-03-20"
```

Add five workdays:

```sh
curl "https://titimangsa.sangkan.dev/v1/workdays/add?date=2026-03-18&days=5"
```

## Public API

Public endpoints live under `/v1`.

- `GET /v1/health`
- `GET /v1/holidays`
- `GET /v1/holidays/check`
- `GET /v1/workdays/check`
- `GET /v1/workdays/add`
- `GET /v1/workdays/diff`
- `GET /v1/sources`

Read-only responses are cacheable. Applications should cache responses on the
client or application side where possible because Cloudflare Workers Free is not
unlimited.

## Documentation

- Public docs: [docs.titimangsa.sangkan.dev](https://docs.titimangsa.sangkan.dev/)
- Local docs app: [apps/docs](./apps/docs)
- API contract: [API_CONTRACT.md](./API_CONTRACT.md)
- Dataset guide: [DATASET.md](./DATASET.md)

Production domain setup:

- API: `https://titimangsa.sangkan.dev`
- Docs: `https://docs.titimangsa.sangkan.dev`

If the project later needs the root domain as a product/docs landing page, keep
`https://titimangsa.sangkan.dev/v1` working and add
`https://api.titimangsa.sangkan.dev` as an API alias.

## Self-Hosting

Install dependencies and validate the dataset:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm validate:data
corepack pnpm generate:data
corepack pnpm test
```

Run the API locally:

```sh
corepack pnpm dev:api
```

Deploy the Cloudflare Worker:

```sh
corepack pnpm --filter @sangkan-dev/titimangsa-api deploy:dry-run
corepack pnpm deploy:api
```

Required Cloudflare deployment secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Data

The source of truth is manually curated YAML in `data/sources`. Generated JSON
in `data/generated` is produced by `scripts/generate.ts` and should not be
edited manually.

Current MVP datasets:

- Indonesia 2025
- Indonesia 2026

## Development

This repository uses pnpm workspaces.

```sh
corepack pnpm install
corepack pnpm test
corepack pnpm typecheck
corepack pnpm format:check
```

Project documents:

- [PRD.md](./PRD.md) - product requirements.
- [TASK.md](./TASK.md) - implementation backlog.
- [ARCHITECTURE.md](./ARCHITECTURE.md) - system architecture and boundaries.
- [DEVELOPMENT.md](./DEVELOPMENT.md) - local workflow and commands.
- [DECISIONS.md](./DECISIONS.md) - project-level decisions.
- [CONTRIBUTING.md](./CONTRIBUTING.md) - contribution rules.
- [SECURITY.md](./SECURITY.md) - security posture and reporting.

## License

MIT. The license covers the source code, dataset, and documentation.
