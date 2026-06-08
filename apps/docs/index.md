---
layout: home

hero:
  name: "Titimangsa"
  text: "Indonesia holiday and business day API"
  tagline: "Curated from official public sources for Indonesian national holidays, collective leave, and workday calculations."
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /guide/api-reference

features:
  - title: Traceable Data
    details: Yearly datasets keep source metadata so dates can be reviewed against public official documents.
  - title: Business Day Logic
    details: Check workdays, add workdays, and count workdays with weekend and collective leave options.
  - title: Edge Ready
    details: The public API runs on Cloudflare Workers and returns cacheable read-only responses.
---

## Unofficial Disclaimer

Titimangsa is not an official government API. The dataset is curated from
publicly available official government documents. Always refer to the original
documents for legal or administrative certainty.

Titimangsa bukan API resmi pemerintah. Dataset dikurasi dari dokumen resmi
pemerintah yang tersedia untuk publik. Untuk kepastian hukum atau administratif,
selalu rujuk dokumen sumber asli.

## Live API

```txt
https://titimangsa.sangkan.dev
```

Example:

```sh
curl "https://titimangsa.sangkan.dev/v1/health"
```

## Main Endpoints

- `GET /v1/health`
- `GET /v1/holidays`
- `GET /v1/holidays/check`
- `GET /v1/workdays/check`
- `GET /v1/workdays/add`
- `GET /v1/workdays/diff`
- `GET /v1/sources`
