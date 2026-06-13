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

## 0007 - Keep API Stable And Put Docs On A Dedicated Subdomain

Status: accepted

For the MVP launch, keep the public API at `https://titimangsa.sangkan.dev` and
serve docs from GitHub Pages until a custom docs domain is configured.

Recommended custom domain setup:

- API: `https://titimangsa.sangkan.dev`
- Docs: `https://docs.titimangsa.sangkan.dev`

If the root `titimangsa.sangkan.dev` later becomes a product/docs landing page,
keep `https://titimangsa.sangkan.dev/v1` working as a backwards-compatible API
entrypoint and add `https://api.titimangsa.sangkan.dev` as an API alias.

Reasoning:

- the current API base URL is already deployed and should remain stable
- docs need a crawlable canonical URL for search engines
- a dedicated docs subdomain avoids mixing GitHub Pages and Worker routing on
  one host
- an API alias can be introduced later without breaking existing clients

## 0008 - Use Automation-Assisted Curation

Status: accepted

Automation may discover official sources and extract candidate dates into
`data/drafts`, but it must never publish or promote data to `verified`
automatically.

Reasoning:

- official documents and revisions are not consistently structured
- automated classification can confuse holidays, collective leave, and work
  arrangements
- draft metadata, raw text, and confidence make review auditable
- human approval preserves trust before generated JSON and API deployment

## 0009 - Publish The Core Package Through npm Trusted Publishing

Status: accepted

The reusable core package will be published as `@sangkan-dev/titimangsa` from
a tagged GitHub release using npm Trusted Publishing and provenance after its
authenticated first publish.

Reasoning:

- consumers receive built JavaScript and TypeScript declarations
- trusted publishing avoids a long-lived npm token in repository secrets
- provenance links published artifacts to the GitHub Actions workflow
- tags and package versions remain traceable
