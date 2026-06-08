# Contributing

Thanks for considering a contribution to Titimangsa.

## Data Contributions

Data changes must be traceable to official public sources. Community-maintained calendars, blogs, repositories, or public Google Calendar entries may be used only for comparison, not as the source of truth.

When adding or changing holiday data:

- Include an official/public government source URL.
- Explain what changed.
- Keep `national_holiday` and `collective_leave` distinct.
- Update generated JSON after source data changes.
- Run validation and tests before opening a pull request.

Expected commands:

```sh
corepack pnpm validate:data
corepack pnpm generate:data
corepack pnpm test
```

## Disclaimer

Titimangsa is not an official government API. Always refer to the original source documents for legal or administrative certainty.
