# Dataset Guide

This document describes how dataset files should be authored and validated.

## Source Priority

Use this priority order:

```txt
Primary official source
        |
        v
Secondary official source
        |
        v
Official announcement/reference
        |
        v
Community reference for comparison only
```

Community references must not become the final source of truth.

## Source Of Truth

Manual YAML files in `data/sources` are the source of truth.

Generated JSON files in `data/generated` are build artifacts and must be created
by `scripts/generate.ts`.

Do not edit generated JSON directly.

## Expected Source File Shape

```yaml
year: 2026
countryCode: ID
revision: 1
status: verified

expected:
  nationalHolidayCount: 17
  collectiveLeaveCount: 8

sources:
  - id: skb-3-menteri-2026
    title: "SKB 3 Menteri Libur Nasional dan Cuti Bersama Tahun 2026"
    type: "SKB"
    url: "https://example.go.id/source"
    publisher: "Government Publisher"
    publishedAt: "2025-09-19"
    official: true

holidays:
  - date: "2026-01-01"
    localName: "Tahun Baru 2026 Masehi"
    name: "New Year's Day 2026"
    type: "national_holiday"
    sourceIds:
      - skb-3-menteri-2026
```

## Holiday Types

MVP supports:

- `national_holiday`
- `collective_leave`

Future-only types:

- `regional_holiday`
- `observance`
- `work_arrangement`

Do not introduce future-only types in MVP data unless the task explicitly
changes scope.

## Dataset Status

Allowed statuses:

- `draft`
- `verified`
- `archived`
- `deprecated`

Use `verified` only after the data has been checked against official public
sources.

## Validation Rules

Validation must check:

- YAML can be parsed.
- Dates use `YYYY-MM-DD`.
- Holiday dates match the file `year`.
- `countryCode` is `ID`.
- `type` is allowed.
- No duplicate `date + type + localName`.
- Every `sourceIds` entry points to an existing source.
- At least one source is official.
- `national_holiday` count matches `expected.nationalHolidayCount`.
- `collective_leave` count matches `expected.collectiveLeaveCount`.
- Holidays are sorted by date ascending.
- Generated JSON matches schema.

## Naming Rules

- `localName` should use Indonesian names from official source language where
  possible.
- `name` should be a clear English equivalent.
- Do not over-normalize religious or official event names if the official source
  uses specific wording.

## Revisions

Increment `revision` when:

- a source document is corrected
- holiday dates change
- collective leave dates change
- naming or metadata is corrected after release

Archive or document old data when a public release has already consumed it.

## Required Commands

Once Phase 1 scripts exist:

```sh
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm validate:data
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm generate:data
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.cache}" corepack pnpm test
```
