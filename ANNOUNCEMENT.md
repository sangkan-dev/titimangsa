# Announcement Draft

Titimangsa v0.1.0 is available.

Titimangsa is an open-source API hari libur Indonesia and business-day
calculation project under `sangkan-dev`. It provides curated Indonesian national
holidays, collective leave data, source metadata, and workday utilities for
payroll, attendance, SLA, invoices, scheduling, and operational systems.

Public API:

```txt
https://titimangsa.sangkan.dev
```

Docs:

```txt
https://sangkan-dev.github.io/titimangsa/
```

Example:

```sh
curl "https://titimangsa.sangkan.dev/v1/holidays?year=2026&type=national_holiday"
```

Important disclaimer:

Titimangsa is not an official government API. The dataset is curated from
publicly available official government documents. Always refer to the original
documents for legal or administrative certainty.
