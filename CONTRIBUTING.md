# Contributing

Thanks for considering a contribution to Titimangsa.

Before opening a pull request, read:

- `PRD.md` for product scope and API behavior.
- `DATASET.md` for dataset structure and validation rules.
- `DEVELOPMENT.md` for local commands.
- `API_CONTRACT.md` when changing public API behavior.

Keep pull requests focused. Explain the user-facing or dataset impact and do
not mix unrelated refactors with data corrections.

## Data Contributions

Data changes must be traceable to official public sources. Community-maintained calendars, blogs, repositories, or public Google Calendar entries may be used only for comparison, not as the source of truth.

When adding or changing holiday data:

- Include an official/public government source URL.
- Add or update complete source metadata in the yearly YAML file.
- Explain what changed and why the official source supports it.
- Keep `national_holiday` and `collective_leave` distinct.
- Increment `revision` for corrections to already published data.
- Review expected national holiday and collective leave counts.
- Run `pnpm generate:data`; never edit generated JSON manually.
- Run validation and tests before opening a pull request.
- Treat files under `data/drafts` as unverified candidates only.
- Never promote automation output without comparing it to the original official
  document.

Expected commands:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm validate:data
corepack pnpm generate:data
corepack pnpm automation:check
corepack pnpm test
corepack pnpm typecheck
corepack pnpm format:check
```

Commit the updated files under both `data/sources` and `data/generated`.
CI rejects changes when generated JSON does not match the source YAML.

## Code And Documentation Contributions

- Keep core business logic independent from Hono and Cloudflare Workers.
- Preserve the public API response and error shapes documented in
  `API_CONTRACT.md`.
- Add or update tests for behavior changes.
- Update public docs when changing API behavior, data rules, or limitations.
- Preserve the unofficial API disclaimer in user-facing documentation.

## Pull Requests

All pull requests must pass the Validate workflow, which validates and
regenerates data, checks formatting and types, runs tests, and builds the core
package, API, and docs site.

Complete the pull request template. For data changes, the official source and
generated JSON checklist is required.

## License

By contributing, you agree that your contributions are licensed under the
repository's MIT License. The current MIT License covers the source code,
dataset, and documentation; they are not separately licensed.

## Disclaimer

Titimangsa is not an official government API. Always refer to the original source documents for legal or administrative certainty.
