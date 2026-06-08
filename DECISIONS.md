# Decisions

This is a lightweight decision log. Add new entries when a project-level choice
will affect future implementation.

## 0001 - Use pnpm Workspaces

Status: accepted

Titimangsa uses pnpm workspaces for `apps/*` and `packages/*`.

Reasoning:

- matches the PRD
- keeps API, docs, and core package separated
- supports future npm package publishing

## 0002 - Use Cloudflare Workers And Hono For API

Status: accepted

The API targets Cloudflare Workers and uses Hono.

Reasoning:

- API is read-heavy
- dataset is small
- Hono is lightweight and edge-friendly
- Cloudflare Workers deployment is simple for MVP

## 0003 - Use Manual YAML As Dataset Source Of Truth

Status: accepted

Holiday data is manually curated into YAML files under `data/sources`.

Reasoning:

- official sources are usually yearly documents
- manual review is safer than scraping PDF/HTML at runtime
- data changes rarely
- source metadata remains auditable

## 0004 - Generate JSON For Runtime

Status: accepted

Runtime API reads generated JSON, not YAML.

Reasoning:

- faster runtime
- simpler Cloudflare Workers bundle
- validation can happen in CI
- YAML parsing is not needed in production

## 0005 - Keep Core Logic Framework-Independent

Status: accepted

Business-day logic belongs in `packages/core`.

Reasoning:

- API, scripts, tests, and future npm package can reuse it
- avoids duplicating date logic in Hono routes
- makes unit testing easier

## 0006 - Use Public Read-Only API For MVP

Status: accepted

MVP has no authentication, user accounts, write endpoints, or API keys.

Reasoning:

- dataset is public
- API is read-only
- simpler security posture
- easier open-source adoption
