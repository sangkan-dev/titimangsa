# Dataset Automation

Titimangsa uses automation-assisted curation. Automation may discover sources,
download or inspect documents, and produce candidate dates, but it must never
publish or promote data to `verified` without human review.

## Safety Boundary

```txt
Official source candidate
        |
        v
Automated extraction
        |
        v
data/drafts/* (status: draft, requiresReview: true)
        |
        v
Human review against the original document
        |
        v
Manual update to data/sources/{year}.yaml
        |
        v
Validation, generated JSON, merge, and deployment
```

Automation must not write directly to `data/sources` or `data/generated`.

## Current Foundation

- Candidate output belongs in `data/drafts`.
- Drafts must match `data/schemas/draft.schema.json`.
- Every draft must use `status: draft` and `requiresReview: true`.
- Candidate dates may use `type: unknown` when classification is uncertain.
- Raw extraction text and confidence belong in drafts, not verified datasets.
- `pnpm automation:check` validates all committed draft files.
- `pnpm import:official-html` accepts a manually selected official HTML URL and
  produces a draft.
- The `Import Official HTML Draft` GitHub workflow runs the importer manually
  and uploads the draft as an artifact without modifying the repository.

Example:

```sh
pnpm import:official-html -- \
  --year 2027 \
  --url "https://example.go.id/official-holiday-page" \
  --publisher "Official Publisher"

pnpm automation:check
```

The current importer accepts HTTPS pages on Indonesian `.go.id` domains. It
classifies a candidate as `collective_leave` only when nearby source text
explicitly says "cuti bersama"; all other dates remain `unknown`. Some official
news pages contain only aggregate counts and may produce an empty candidate
list; use the underlying detailed HTML document or future PDF importer when
available.

## Recommended Rollout

### Phase A - Manual Source Import

Accept an official URL or local document, extract candidate dates, and write a
review-required draft. HTML is supported first; text-based PDF documents remain
future work.

### Phase B - Source Discovery

Monitor a small allowlist of official publishers and produce source candidate
metadata. Discovery results remain drafts and must not alter final data.

### Phase C - Automated Pull Requests

Run discovery and extraction on a schedule. Open a pull request only when the
candidate diff changes. The pull request must include source links, confidence,
validation output, and an explicit human-review warning.

### Phase D - Notifications

Optionally open an issue or discussion when an official source appears to
change. Do not auto-merge data changes.

## Required Review

Reviewers must compare candidates with the original official document, verify
the distinction between `national_holiday` and `collective_leave`, check whether
the document is a revision, and update the final dataset revision when needed.

Titimangsa is not an official government API. The dataset is curated from
publicly available official government documents. Always refer to the original
documents for legal or administrative certainty.
