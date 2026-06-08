# AGENTS.md

Instructions for AI agents and contributors working in this repository.

## Project Context

Titimangsa is an open-source Indonesia holiday and business day API under `sangkan-dev`.

It provides curated Indonesian national holidays, collective leave data, and business day calculation. The project is not an official government API. Always preserve this disclaimer in user-facing docs and copy:

> Titimangsa is not an official government API. The dataset is curated from publicly available official government documents. Always refer to the original documents for legal or administrative certainty.

Before making product or architecture decisions, read:

- `PRD.md` for product requirements and contracts.
- `TASK.md` for execution order and current checklist state.
- `ARCHITECTURE.md` for system boundaries and dependency direction.
- `API_CONTRACT.md` for public API shape.
- `DATASET.md` for data authoring rules.
- `DEVELOPMENT.md` for local workflow and command conventions.
- `DECISIONS.md` for accepted project-level decisions.

## Current Stack

- Package manager: pnpm via Corepack.
- Runtime target: Cloudflare Workers.
- API framework: Hono.
- Language: TypeScript.
- Docs: VitePress.
- Tests: Vitest.
- Formatting: Prettier.
- Git hooks: Husky + lint-staged.

Use these commands from the repository root:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm install
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm test
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm typecheck
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm format:check
```

The `XDG_DATA_HOME` fallback avoids pnpm/Corepack trying to write to a read-only global location in restricted environments.

## CLI-First Setup Rule

Prefer official CLI/package-manager commands for scaffolding, dependency installation, and generated framework files.

Examples:

- Use `corepack pnpm add ...` for dependencies.
- Use `corepack pnpm create hono ...` for Hono scaffolding.
- Use `corepack pnpm exec tsc --init ...` for TypeScript config when applicable.
- Use framework CLIs for docs/API scaffolding when they work in the current environment.

Manual file creation is acceptable for project-specific content and files that do not have a useful generator, such as:

- `AGENTS.md`
- `README.md`
- `CONTRIBUTING.md`
- `TASK.md`
- `pnpm-workspace.yaml`
- dataset YAML
- validation scripts
- source metadata

When a CLI fails because of the environment, keep the fallback minimal and explain the reason in the final response.

## Repository Layout

Expected structure:

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

Keep changes scoped to the relevant package or app. Do not introduce new top-level architecture unless the PRD or TASK file calls for it.

## Dataset Rules

Dataset integrity is the highest priority.

- Source of truth is manually curated YAML in `data/sources`.
- Generated JSON in `data/generated` must be produced by scripts, not edited directly.
- Official public government documents are required for final data.
- Community calendars, blog posts, GitHub repos, and public Google Calendar entries may only be used for comparison.
- Every holiday entry must reference existing `sourceIds`.
- Keep `national_holiday` and `collective_leave` distinct.
- Preserve dataset metadata: `year`, `countryCode`, `revision`, `status`, `expected`, `sources`, and `holidays`.
- Use `revision` for source/data corrections.

Required data commands once Phase 1 exists:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm validate:data
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm generate:data
```

## Core Package Rules

Core logic belongs in `packages/core`.

- Keep core independent from Hono, Cloudflare Workers, and request/response concerns.
- Avoid timezone drift when parsing `YYYY-MM-DD` dates.
- Default weekend is `sat,sun`.
- Default `includeCollectiveLeave` is `true`.
- `addWorkdays` does not count the start date as day one.
- MVP `days` support only needs positive integers.
- `diffWorkdays` defaults to inclusive counting.

API, scripts, and tests should reuse core logic instead of duplicating date/business-day behavior.

## API Rules

API code belongs in `apps/api`.

- All public endpoints must live under `/v1`.
- Use Hono.
- Target Cloudflare Workers.
- Public API is read-only.
- Allow only `GET` and `OPTIONS` for MVP.
- Use consistent success response shape:

```json
{
  "meta": {
    "version": "v1",
    "countryCode": "ID"
  },
  "data": []
}
```

- Use consistent error response shape:

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

- Use documented error codes from `PRD.md`.
- Add cache headers for read-only endpoints:

```http
Cache-Control: public, max-age=3600, s-maxage=86400
```

- Keep CORS public and explicit for MVP:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Docs Rules

Docs code belongs in `apps/docs`.

Docs must explain:

- Titimangsa is unofficial.
- Data is curated from official public sources.
- The distinction between `national_holiday` and `collective_leave`.
- How `includeCollectiveLeave` affects results.
- How to contribute and validate data.
- Cloudflare Workers Free is not unlimited.

Do not describe the project as an official government API.

## Testing And Verification

Before handing off implementation work, run the smallest relevant verification and report the result.

For setup or broad changes:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm install
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm test
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm typecheck
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm format:check
```

For data changes, also run:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm validate:data
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm generate:data
```

## Git Rules

- Do not overwrite user changes.
- Do not amend or rewrite commits unless explicitly requested.
- Keep commits scoped and descriptive.
- Husky pre-commit runs lint-staged with Prettier check.
- If a command needs to write to `.git` in a restricted environment, request approval instead of working around it.

## Task Tracking

When completing items from `TASK.md`, update the relevant checklist entries in the same change.

Do not mark later phases complete unless the acceptance criteria for that phase were actually verified.
