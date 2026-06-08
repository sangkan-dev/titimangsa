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
```

Docs:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm dev:docs
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm build:docs
```

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
