# Contributing Data

Data integrity is the highest priority. Every holiday entry must be traceable to
an official public source.

## Workflow

1. Update or add a YAML file in `data/sources`.
2. Reference official source metadata in `sources`.
3. Add holiday entries in date order.
4. Set `expected.nationalHolidayCount` and `expected.collectiveLeaveCount`.
5. Run validation and generation commands.
6. Commit both source YAML and generated JSON.

## Required Commands

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm validate:data
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm generate:data
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm test
```

For broader changes, also run:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm typecheck
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm format:check
```

## Data Rules

- Official public government documents are required for final data.
- Every holiday entry must reference existing `sourceIds`.
- Keep `national_holiday` and `collective_leave` distinct.
- Keep holidays sorted by date ascending.
- Do not edit `data/generated` manually.
- Do not introduce future-only types in MVP data unless scope changes.

## Naming

Use Indonesian official wording where possible for `localName`. Use a clear
English equivalent for `name`.

Do not over-normalize religious or official event names if the official source
uses specific wording.
