# Dataset Automation

Titimangsa uses automation-assisted curation. Automation can discover official
sources and extract candidate dates, but it must never publish verified data
without human review.

## Review Flow

```txt
Official source candidate
        |
        v
Automated extraction
        |
        v
Review-required draft
        |
        v
Human verification against the original document
        |
        v
Curated source YAML, generated JSON, and API deployment
```

Automation output belongs in `data/drafts`. It must use `status: draft` and
`requiresReview: true`. Run:

```sh
pnpm automation:check
```

Import a manually selected official HTML page:

```sh
pnpm import:official-html -- \
  --year 2027 \
  --url "https://example.go.id/official-holiday-page" \
  --publisher "Official Publisher"
```

The manual `Import Official HTML Draft` GitHub Actions workflow runs the same
importer and uploads a review artifact. It does not commit or publish data.

Candidate dates may remain `unknown` when classification is uncertain. A
maintainer must verify whether each date is a national holiday, collective
leave, or a different work arrangement before updating final data.

The project will add PDF extraction, source discovery, and automated pull
requests incrementally. Automatic merge or direct publication of extracted
dates is intentionally out of scope.

Titimangsa is not an official government API. Always refer to the original
documents for legal or administrative certainty.
