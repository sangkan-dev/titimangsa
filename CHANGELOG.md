# Changelog

All notable public changes to Titimangsa are documented in this file.

## 0.1.0 - 2026-06-08

Initial MVP release candidate.

### Added

- Curated Indonesia holiday datasets for 2025 and 2026.
- Official public source metadata for every dataset.
- Dataset validation and JSON generation scripts.
- Framework-independent core package for holiday and business-day logic.
- Hono API for Cloudflare Workers under `/v1`.
- Public endpoints for health, holidays, holiday checks, workday checks,
  workday addition, workday diffs, and source metadata.
- VitePress documentation site.
- GitHub Actions workflows for API deploy, docs deploy, and validation.
- Governance templates for issues and pull requests.

### Notes

- Titimangsa is not an official government API.
- API response shape is considered stable for MVP `/v1`.
- Breaking changes after public launch should use `/v2`.
