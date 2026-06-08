# Titimangsa

Indonesia holiday and business day API, curated from official public sources.

Titimangsa is an open-source project under `sangkan-dev` that provides curated Indonesian national holiday, collective leave, and business day calculation data for developer workflows such as payroll, attendance, SLA, invoices, scheduling, and operational systems.

## Status

This project is in early development. The current repository setup follows the MVP direction described in [PRD.md](./PRD.md) and the execution backlog in [TASK.md](./TASK.md).

## Unofficial Disclaimer

Titimangsa is not an official government API. The dataset is curated from publicly available official government documents. Always refer to the original documents for legal or administrative certainty.

Titimangsa bukan API resmi pemerintah. Dataset dikurasi dari dokumen resmi pemerintah yang tersedia untuk publik. Untuk kepastian hukum atau administratif, selalu rujuk dokumen sumber asli.

## Planned API

All public endpoints are planned under `/v1`.

- `GET /v1/health`
- `GET /v1/holidays`
- `GET /v1/holidays/check`
- `GET /v1/workdays/check`
- `GET /v1/workdays/add`
- `GET /v1/workdays/diff`
- `GET /v1/sources`

## Development

This repository uses pnpm workspaces.

```sh
corepack pnpm install
corepack pnpm test
```

In this environment, pnpm is configured to use a local writable store through `.npmrc`.

## Repository Layout

```txt
apps/
  api/
  docs/
packages/
  core/
data/
  sources/
  generated/
  schemas/
scripts/
```

## License

MIT.
