# Copilot Instructions

Follow the repository rules in `AGENTS.md`.

Read these when relevant:

- `ARCHITECTURE.md` for package boundaries.
- `API_CONTRACT.md` for endpoint contracts.
- `DATASET.md` for dataset rules.
- `DEVELOPMENT.md` for commands and workflow.
- `DECISIONS.md` for accepted project decisions.

Project summary:

- Titimangsa is an unofficial Indonesia holiday and business day API.
- Source data must be curated from official public government documents.
- Use pnpm through Corepack.
- Prefer CLI/package-manager scaffolding over manually recreating framework files.
- Keep core business-day logic in `packages/core`.
- Keep Hono/Cloudflare Workers API code in `apps/api`.
- Keep docs in `apps/docs`.
- Do not edit generated JSON directly.
- Do not claim this project is an official government API.

Recommended verification:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm test
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm typecheck
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm format:check
```
