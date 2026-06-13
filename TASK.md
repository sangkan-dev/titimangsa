# TASK - Titimangsa

Dokumen ini menerjemahkan `PRD.md` menjadi backlog implementasi yang bisa dikerjakan bertahap. Urutan kerja mengikuti rekomendasi PRD: dataset first, API second, docs third.

## Status Legend

- `[ ]` Belum dikerjakan
- `[~]` Sedang dikerjakan
- `[x]` Selesai

## Prinsip Eksekusi

- Dataset harus traceable ke sumber resmi publik.
- Runtime API membaca generated JSON, bukan YAML mentah.
- Semua endpoint publik berada di bawah `/v1`.
- Semua response sukses dan error mengikuti format PRD.
- Core logic harus reusable di API, test, dan calon package npm.
- Tidak ada klaim bahwa Titimangsa adalah API resmi pemerintah.

## Phase 0 - Repository Setup

Tujuan: menyiapkan fondasi monorepo agar package core, API, docs, data, script, dan CI bisa dikembangkan konsisten.

### Tasks

- [x] Buat `package.json` root untuk workspace.
- [x] Buat `pnpm-workspace.yaml`.
- [x] Setup TypeScript config bersama.
- [x] Setup Vitest config.
- [x] Setup lint/format basic sesuai kebutuhan project.
- [x] Buat struktur folder:
  - [x] `apps/api`
  - [x] `apps/docs`
  - [x] `packages/core`
  - [x] `data/sources`
  - [x] `data/generated`
  - [x] `data/schemas`
  - [x] `scripts`
  - [x] `.github/workflows`
- [x] Tambahkan `README.md`.
- [x] Tambahkan `LICENSE`.
- [x] Tambahkan `CONTRIBUTING.md`.
- [x] Tambahkan `CODE_OF_CONDUCT.md`.
- [x] Tambahkan disclaimer unofficial di README.

### Acceptance Criteria

- [x] `pnpm install` berjalan.
- [x] `pnpm test` tersedia walaupun test awal masih minimal.
- [x] Struktur repo sesuai PRD.
- [x] README menjelaskan positioning, tagline, dan status unofficial.

## Phase 1 - Dataset Foundation

Tujuan: menyiapkan format data tahunan yang valid, mudah direview, dan bisa digenerate ke JSON.

### Schema & Format

- [x] Buat `data/schemas/source.schema.json`.
- [x] Buat `data/schemas/generated.schema.json`.
- [x] Definisikan enum holiday type MVP:
  - [x] `national_holiday`
  - [x] `collective_leave`
- [x] Definisikan enum status dataset:
  - [x] `draft`
  - [x] `verified`
  - [x] `archived`
  - [x] `deprecated`
- [x] Pastikan schema mendukung metadata:
  - [x] `year`
  - [x] `countryCode`
  - [x] `revision`
  - [x] `status`
  - [x] `expected`
  - [x] `sources`
  - [x] `holidays`

### Source Data

- [x] Buat `data/sources/2026.yaml`.
- [x] Input data libur nasional 2026 dari sumber resmi.
- [x] Input data cuti bersama 2026 dari sumber resmi.
- [x] Buat `data/sources/2025.yaml`.
- [x] Input data libur nasional 2025 dari sumber resmi.
- [x] Input data cuti bersama 2025 dari sumber resmi.
- [x] Pastikan setiap holiday memiliki `sourceIds`.
- [x] Pastikan minimal ada satu source dengan `official: true` untuk setiap tahun.
- [x] Pastikan `expected.nationalHolidayCount` sesuai data.
- [x] Pastikan `expected.collectiveLeaveCount` sesuai data.

### Validation Script

- [x] Buat `scripts/validate.ts`.
- [x] Validasi YAML dapat dibaca.
- [x] Validasi schema source dataset.
- [x] Validasi tanggal memakai format `YYYY-MM-DD`.
- [x] Validasi tahun pada tanggal sama dengan field `year`.
- [x] Validasi `countryCode` bernilai `ID`.
- [x] Validasi `type` berada dalam enum yang diizinkan.
- [x] Validasi tidak ada duplikasi `date + type + localName`.
- [x] Validasi semua `sourceIds` merujuk ke source yang ada.
- [x] Validasi minimal ada satu source official.
- [x] Validasi jumlah `national_holiday`.
- [x] Validasi jumlah `collective_leave`.
- [x] Validasi urutan holiday berdasarkan tanggal ascending.
- [x] Tambahkan script root `pnpm validate:data`.

### Generation Script

- [x] Buat `scripts/generate.ts`.
- [x] Generate `data/generated/id-2025.json`.
- [x] Generate `data/generated/id-2026.json`.
- [x] Generate `data/generated/id-latest.json`.
- [x] Tambahkan field hari:
  - [x] `day`
  - [x] `localDay`
- [x] Tambahkan boolean:
  - [x] `isNationalHoliday`
  - [x] `isCollectiveLeave`
- [x] Validasi generated JSON terhadap schema.
- [x] Tambahkan script root `pnpm generate:data`.

### Acceptance Criteria

- [x] `pnpm validate:data` berhasil.
- [x] `pnpm generate:data` berhasil.
- [x] Dataset 2025 dan 2026 tersedia.
- [x] Generated JSON tersedia dan valid.
- [x] Data bisa diverifikasi lewat metadata sumber resmi.

## Phase 2 - Core Package

Tujuan: membuat business-day engine reusable yang menjadi sumber logic utama untuk API.

### Package Setup

- [x] Setup `packages/core/package.json`.
- [x] Setup TypeScript build untuk `packages/core`.
- [x] Export public API dari `packages/core/src/index.ts`.
- [x] Definisikan tipe domain di `packages/core/src/types.ts`.

### Dataset Access

- [x] Implement loader dataset generated JSON.
- [x] Implement lookup dataset by year.
- [x] Implement error untuk dataset tidak tersedia.
- [x] Implement helper untuk filter holiday type.
- [x] Implement helper untuk include/exclude collective leave.

### Date Utilities

- [x] Implement validasi format ISO date.
- [x] Implement parsing date tanpa timezone drift.
- [x] Implement formatter date `YYYY-MM-DD`.
- [x] Implement weekday English.
- [x] Implement weekday lokal Indonesia.
- [x] Implement weekend parser dari string seperti `sat,sun`.

### Public Functions

- [x] Implement `getHolidays(year, options)`.
- [x] Implement `checkHoliday(date, options)`.
- [x] Implement `isWeekend(date, options)`.
- [x] Implement `isWorkday(date, options)`.
- [x] Implement `addWorkdays(date, days, options)`.
- [x] Implement `diffWorkdays(start, end, options)`.
- [x] Implement `getSources(year)`.

### Business Rules

- [x] Default weekend adalah `sat,sun`.
- [x] Default `includeCollectiveLeave` adalah `true`.
- [x] Tanggal awal pada `addWorkdays` tidak dihitung sebagai hari pertama.
- [x] `days` untuk MVP hanya wajib mendukung integer positif.
- [x] `diffWorkdays` default inclusive adalah `true`.
- [x] `isWorkday` mempertimbangkan weekend, libur nasional, dan cuti bersama sesuai opsi.

### Tests

- [x] Test `getHolidays`.
- [x] Test `checkHoliday`.
- [x] Test `isWeekend`.
- [x] Test `isWorkday`.
- [x] Test `addWorkdays`.
- [x] Test `diffWorkdays`.
- [x] Test opsi `includeCollectiveLeave`.
- [x] Test opsi custom `weekend`.
- [x] Test error invalid date.
- [x] Test error dataset tidak tersedia.

### Acceptance Criteria

- [x] Public functions sesuai PRD tersedia.
- [x] Core logic tidak bergantung pada Hono atau Cloudflare runtime.
- [x] Unit test core berjalan via `pnpm test`.
- [x] Edge case tanggal dan weekend tercakup test.

## Phase 3 - API MVP

Tujuan: mengekspos dataset dan core logic melalui Hono API yang siap dijalankan di Cloudflare Workers.

### API Setup

- [x] Setup `apps/api/package.json`.
- [x] Install dan konfigurasi Hono.
- [x] Buat `apps/api/src/index.ts`.
- [ ] Buat struktur routes:
  - [x] `health.ts`
  - [x] `holidays.ts`
  - [x] `workdays.ts`
  - [x] `sources.ts`
- [ ] Buat struktur services:
  - [x] `holiday-service.ts`
  - [x] `workday-service.ts`
  - [x] `source-service.ts`
- [ ] Buat utilities:
  - [x] `date.ts`
  - [x] `response.ts`
  - [x] `errors.ts`

### Middleware & Headers

- [x] Tambahkan CORS publik.
- [x] Batasi method ke `GET` dan `OPTIONS`.
- [x] Tambahkan `Cache-Control: public, max-age=3600, s-maxage=86400` untuk endpoint read-only.
- [x] Tambahkan JSON content type.
- [x] Tambahkan fallback 404.
- [x] Tambahkan global error handler.

### Response & Error Contract

- [x] Implement response success format dengan `meta` dan `data`.
- [x] Implement error format dengan `error.code`, `error.message`, dan `error.details`.
- [x] Implement error code:
  - [x] `INVALID_DATE`
  - [x] `INVALID_YEAR`
  - [x] `INVALID_TYPE`
  - [x] `DATASET_NOT_FOUND`
  - [x] `INVALID_RANGE`
  - [x] `INTERNAL_ERROR`

### Endpoints

- [x] Implement `GET /v1/health`.
- [x] Implement `GET /v1/holidays`.
- [x] Support query `year`.
- [x] Support query `type`.
- [x] Support query `includeSources`.
- [x] Implement `GET /v1/holidays/check`.
- [x] Support query `date`.
- [x] Support query `includeCollectiveLeave`.
- [x] Support query `includeSources`.
- [x] Implement `GET /v1/workdays/check`.
- [x] Support query `date`.
- [x] Support query `includeCollectiveLeave`.
- [x] Support query `weekend`.
- [x] Implement `GET /v1/workdays/add`.
- [x] Support query `date`.
- [x] Support query `days`.
- [x] Support query `includeCollectiveLeave`.
- [x] Support query `weekend`.
- [x] Implement `GET /v1/workdays/diff`.
- [x] Support query `start`.
- [x] Support query `end`.
- [x] Support query `includeCollectiveLeave`.
- [x] Support query `weekend`.
- [x] Support query `inclusive`.
- [x] Implement `GET /v1/sources`.
- [x] Support query `year`.

### API Tests

- [x] Test health endpoint.
- [x] Test list holidays default current year.
- [x] Test list holidays by year.
- [x] Test list holidays by type.
- [x] Test holiday check.
- [x] Test workday check.
- [x] Test add workdays.
- [x] Test diff workdays.
- [x] Test sources.
- [x] Test invalid date returns 400.
- [x] Test invalid type returns 400.
- [x] Test dataset not found returns 404.
- [x] Test response cache headers.
- [x] Test CORS headers.

### Acceptance Criteria

- [x] Semua endpoint MVP berjalan lokal.
- [x] Semua endpoint memakai `/v1`.
- [x] Response sesuai kontrak PRD.
- [x] Error response konsisten.
- [x] API memakai core package untuk business logic.

## Phase 4 - Cloudflare Deployment

Tujuan: membuat API bisa dideploy ke Cloudflare Workers dan siap dipasang ke domain produksi.

### Tasks

- [x] Buat `apps/api/wrangler.toml`.
- [x] Konfigurasi Worker name.
- [x] Konfigurasi compatibility date.
- [x] Pastikan generated JSON ikut terbundle.
- [x] Tambahkan script deploy API.
- [x] Buat workflow `.github/workflows/deploy-api.yml`.
- [x] Tambahkan environment/secret deployment sesuai kebutuhan Wrangler.
- [x] Deploy ke workers.dev sementara.
- [x] Konfigurasi custom domain `titimangsa.sangkan.dev`.
- [x] Test endpoint production.

### Acceptance Criteria

- [x] API tersedia di Cloudflare Workers.
- [x] `/v1/health` production mengembalikan status ok.
- [x] Endpoint MVP production mengembalikan data valid.
- [x] Cache header tersedia di production.

## Phase 5 - Documentation

Tujuan: menyediakan dokumentasi publik agar developer bisa integrasi cepat dan kontributor bisa memperbarui data dengan benar.

### Docs Setup

- [x] Setup `apps/docs/package.json`.
- [x] Setup VitePress.
- [x] Buat `.vitepress/config.ts`.
- [x] Tambahkan script docs dev/build.

### Pages

- [x] Buat `apps/docs/index.md`.
- [x] Buat `apps/docs/guide/getting-started.md`.
- [x] Buat `apps/docs/guide/api-reference.md`.
- [x] Buat `apps/docs/guide/data-sources.md`.
- [x] Buat `apps/docs/guide/contributing-data.md`.
- [x] Buat `apps/docs/guide/limitations.md`.
- [x] Buat `apps/docs/guide/changelog.md`.

### Required Content

- [x] Jelaskan apa itu Titimangsa.
- [x] Jelaskan status unofficial.
- [x] Jelaskan sumber data resmi publik.
- [x] Jelaskan cara menggunakan API.
- [x] Tambahkan contoh request/response.
- [x] Jelaskan cara kontribusi data.
- [x] Jelaskan cara menjalankan validasi dataset.
- [x] Jelaskan perbedaan `national_holiday` dan `collective_leave`.
- [x] Jelaskan opsi `includeCollectiveLeave`.
- [x] Jelaskan limitasi dan disclaimer.
- [x] Jelaskan Cloudflare Workers Free bukan unlimited.

### Deployment

- [x] Buat workflow `.github/workflows/deploy-docs.yml`.
- [x] Deploy docs.
- [x] Tautkan docs dari README.

### Acceptance Criteria

- [x] Docs bisa dijalankan lokal.
- [x] Docs bisa dibuild.
- [x] Docs publik tersedia.
- [x] Disclaimer tersedia dalam Bahasa Indonesia dan Inggris.

## Phase 6 - CI & Governance

Tujuan: memastikan perubahan data, core, API, dan docs tervalidasi sebelum merge.

### CI

- [x] Buat `.github/workflows/validate-data.yml`.
- [x] CI menjalankan `pnpm install`.
- [x] CI menjalankan `pnpm validate:data`.
- [x] CI menjalankan `pnpm generate:data`.
- [x] CI menjalankan `pnpm test`.
- [x] CI menjalankan build package core.
- [x] CI menjalankan build API.
- [x] CI menjalankan build docs.

### Governance

- [x] Buat issue templates.
- [x] Buat PR template.
- [x] Tambahkan checklist source official/public.
- [x] Tambahkan checklist generated JSON update.
- [x] Tambahkan checklist tests passed.
- [x] Tambahkan kontribusi data rules di `CONTRIBUTING.md`.
- [x] Tambahkan lisensi dataset/docs jika dipisahkan dari MIT.

### Acceptance Criteria

- [x] Pull request perubahan data gagal jika validasi gagal.
- [x] Pull request memiliki checklist kontribusi data.
- [x] Project memiliki panduan kontribusi yang jelas.

## Phase 7 - Public Launch

Tujuan: merapikan project untuk rilis open-source pertama.

### Tasks

- [x] Rapikan README.
- [x] Tambahkan badge CI.
- [x] Tambahkan badge license.
- [x] Tambahkan contoh usage API.
- [x] Tambahkan contoh self-hosting singkat.
- [x] Review semua disclaimer.
- [x] Buat changelog awal.
- [x] Buat release `v0.1.0`.
- [x] Buka issue untuk dataset tahun lain.
- [ ] Publish announcement.

### Acceptance Criteria

- [x] Release `v0.1.0` tersedia.
- [x] Project siap diumumkan sebagai open-source.
- [x] Developer bisa memahami dan mencoba API dari README/docs.

## Cross-Cutting Requirements

### Data Integrity

- [x] Tidak ada data final dari sumber komunitas sebagai source of truth.
- [x] Semua dataset menyimpan metadata sumber.
- [x] Revisi dataset menaikkan field `revision`.
- [x] Perubahan dataset terdokumentasi di changelog.

### API Quality

- [x] Endpoint hanya menerima parameter yang terdokumentasi.
- [x] Parameter boolean diparse konsisten.
- [x] Parameter weekend diparse konsisten.
- [x] Error message jelas dan stabil.
- [x] Response tidak membocorkan stack trace.

### Security & Abuse

- [x] Tidak ada secret di runtime client.
- [x] Tidak ada endpoint write publik.
- [x] CORS hanya membuka method yang diperlukan.
- [x] Dokumentasi menyarankan client-side caching.

### Compatibility

- [x] API response MVP stabil sebelum public launch.
- [x] Breaking change berikutnya harus memakai `/v2`.
- [x] Generated JSON mempertahankan shape yang terdokumentasi.

## MVP Definition of Done

MVP dianggap selesai jika semua item berikut terpenuhi:

- [x] Dataset 2025 dan 2026 tersedia.
- [x] Dataset 2025 dan 2026 memiliki source resmi publik.
- [x] `pnpm validate:data` berhasil di lokal dan CI.
- [x] `pnpm generate:data` berhasil di lokal dan CI.
- [x] Generated JSON tersedia.
- [x] Core workday logic memiliki unit test.
- [x] API `/v1/health` berjalan.
- [x] API `/v1/holidays` berjalan.
- [x] API `/v1/holidays/check` berjalan.
- [x] API `/v1/workdays/check` berjalan.
- [x] API `/v1/workdays/add` berjalan.
- [x] API `/v1/workdays/diff` berjalan.
- [x] API `/v1/sources` berjalan.
- [x] API deploy di Cloudflare Workers.
- [x] Docs VitePress tersedia.
- [x] README menjelaskan status unofficial.
- [x] Disclaimer tersedia di README dan docs.
- [x] Tidak ada klaim sebagai API resmi pemerintah.

## Phase 8 - npm Package Distribution

Tujuan: mendistribusikan reusable core package dengan artifact dan provenance
yang dapat diverifikasi.

### Tasks

- [x] Bundle package menjadi ESM dan CommonJS.
- [x] Generate TypeScript declarations.
- [x] Tambahkan package metadata, README, dan license.
- [x] Tambahkan `publint` ke validasi package.
- [x] Tambahkan workflow npm Trusted Publishing.
- [ ] Publish `@sangkan-dev/titimangsa@0.1.1`.
- [ ] Konfigurasi Trusted Publisher di npm setelah first publish.

### Acceptance Criteria

- [x] Tarball package hanya membawa artifact dan dokumentasi yang dibutuhkan.
- [x] Package lolos build, test, dan `publint`.
- [ ] Package dapat di-install dari npm.

## Phase 9 - Dataset Automation

Tujuan: mengurangi input manual tanpa mengizinkan automation mempublikasikan
data administratif tanpa review manusia.

### Safety Foundation

- [x] Pisahkan automation output ke `data/drafts`.
- [x] Tambahkan schema draft dengan `status: draft`.
- [x] Wajibkan `requiresReview: true`.
- [x] Tambahkan `pnpm automation:check`.
- [x] Dokumentasikan automation-assisted curation.

### Future Tasks

- [x] Implement manual official URL import.
- [x] Implement HTML extraction ke candidate draft.
- [x] Tambahkan manual GitHub Actions workflow untuk draft artifact.
- [ ] Implement text-based PDF extraction ke candidate draft.
- [ ] Implement official source allowlist dan discovery queries.
- [ ] Implement scheduled source watcher.
- [ ] Implement automated PR dengan validation report.
- [ ] Implement notification untuk kandidat revisi.

### Acceptance Criteria

- [x] Automation tidak menulis langsung ke `data/sources` atau `data/generated`.
- [x] Draft menyimpan confidence dan raw extraction text.
- [ ] Source watcher menghasilkan perubahan hanya melalui review-required PR.

## Suggested Implementation Order

1. Setup monorepo dan tooling dasar.
2. Lock schema dataset.
3. Input dataset 2026.
4. Buat validasi data.
5. Buat generator JSON.
6. Input dataset 2025.
7. Implement core date utilities.
8. Implement core holiday/workday functions.
9. Tambahkan unit test core.
10. Setup Hono API.
11. Implement semua endpoint MVP.
12. Tambahkan API tests.
13. Setup Wrangler dan deploy API.
14. Setup VitePress docs.
15. Setup CI/CD.
16. Rapikan README dan release `v0.1.0`.
