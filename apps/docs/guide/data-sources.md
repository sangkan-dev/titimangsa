# Data Sources

Titimangsa datasets are curated from publicly available official government
documents. Community calendars, blog posts, public Google Calendar entries, and
other third-party lists may be useful for comparison, but they are not the final
source of truth.

## Source Priority

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

## Source of Truth

Manual YAML files in `data/sources` are the source of truth. Generated JSON files
in `data/generated` are build artifacts created by `scripts/generate.ts`.

Do not edit generated JSON directly.

## Holiday Types

MVP supports two holiday types:

| Type               | Meaning                               | Workday impact                                   |
| ------------------ | ------------------------------------- | ------------------------------------------------ |
| `national_holiday` | Indonesian national holiday           | Not a workday                                    |
| `collective_leave` | Government-announced collective leave | Not a workday when `includeCollectiveLeave=true` |

Future-only types are reserved in the schema but not used in MVP data:

- `regional_holiday`
- `observance`
- `work_arrangement`

## Dataset Metadata

Each yearly source file includes:

- `year`
- `countryCode`
- `revision`
- `status`
- `expected`
- `sources`
- `holidays`

Use `revision` when a source document is corrected, a holiday date changes,
collective leave changes, or metadata is corrected after release.

## Current Public Sources

The 2025 and 2026 datasets reference public official sources from Kemenko PMK,
Sekretariat Negara, and JDIH Kemnaker where applicable. Source metadata is
available through:

```sh
curl "https://titimangsa.sangkan.dev/v1/sources?year=2026"
```
