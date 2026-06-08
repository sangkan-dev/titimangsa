# Development

This document covers local development workflow. For architecture, read
`ARCHITECTURE.md`.

## Prerequisites

- Node.js
- Corepack
- pnpm through Corepack

Use pnpm through Corepack instead of assuming a global `pnpm` binary exists.

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm install
```

The `XDG_DATA_HOME` fallback keeps Corepack and pnpm writable in restricted
environments.

## Common Commands

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm test
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm typecheck
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm format:check
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm format
```

API:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm dev:api
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm --filter @sangkan-dev/titimangsa-api deploy:dry-run
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm deploy:api
```

API deployment uses Cloudflare Wrangler with `apps/api/wrangler.toml`.

Required deployment secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

For GitHub Actions, add those secrets to the `production` environment used by
`.github/workflows/deploy-api.yml`.

Docs:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm dev:docs
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm build:docs
```

Production docs builds use `BASE_PATH` and `SITE_URL` to generate asset paths,
canonical URLs, and the sitemap. The GitHub Actions workflows read optional
repository variables named `DOCS_BASE_PATH` and `DOCS_SITE_URL`.

For the production docs deployment, set `DOCS_BASE_PATH` to `/` and
`DOCS_SITE_URL` to `https://docs.titimangsa.sangkan.dev`. The repository also
includes `apps/docs/public/CNAME` so GitHub Pages keeps the custom domain when
deploying through Actions.

If the custom domain is removed, the fallback values are `/titimangsa/` and
`https://sangkan-dev.github.io/titimangsa`.

Data commands will become active in Phase 1:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm validate:data
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm generate:data
```

## Adding Dependencies

Use pnpm CLI commands.

Root dev dependency:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm add -Dw <package>
```

Workspace dependency:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm --filter <workspace> add <package>
```

Examples:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm --filter @sangkan-dev/titimangsa-api add hono
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm --filter @sangkan-dev/titimangsa add date-fns
```

Avoid manually editing dependency versions in `package.json` unless the package
manager command cannot express the change.

## Formatting And Hooks

Prettier is the formatter.

Husky runs `lint-staged` before commit. The pre-commit hook checks staged files
with Prettier.

Manual check:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm lint-staged
```

## Verification Matrix

For broad setup changes, run:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm install
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm test
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm typecheck
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm format:check
```

For core logic changes, run:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm test
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm typecheck
```

For data changes, run:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm validate:data
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm generate:data
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm test
```

## Continuous Integration

The Validate workflow runs for every pull request and push to `main`. It:

- installs dependencies from the lockfile
- validates source data
- regenerates data and rejects uncommitted generated JSON changes
- checks formatting and types
- runs tests
- builds the core package, API dry run, and docs site

Repository maintainers should configure the `Validate Data, Packages, API, and
Docs` job as a required status check for the `main` branch.

## Troubleshooting

If `pnpm` is not found, use:

```sh
corepack pnpm --version
```

If pnpm tries to write to a read-only global location, set:

```sh
export XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}"
```

If dependency lifecycle scripts are blocked by a sandbox, request approval for
the exact pnpm command instead of bypassing dependency installation.
