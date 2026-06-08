## Summary

Describe the change and why it is needed.

## Verification

- [ ] `pnpm validate:data`
- [ ] `pnpm generate:data`
- [ ] `pnpm test`
- [ ] `pnpm typecheck`
- [ ] Relevant packages/apps build successfully

## Data Contribution Checklist

Complete this section for changes under `data/`. Mark non-applicable items as N/A in the summary.

- [ ] Every data change is supported by an official public government source.
- [ ] Official source URLs and source metadata are included or updated.
- [ ] `national_holiday` and `collective_leave` remain distinct.
- [ ] Generated JSON was updated with `pnpm generate:data` and was not edited manually.
- [ ] Expected holiday counts and dataset revision were reviewed.
- [ ] The unofficial API disclaimer remains accurate.

## Documentation And Contract

- [ ] Public API or behavior changes are reflected in the relevant docs.
- [ ] No unrelated generated files or formatting changes are included.
