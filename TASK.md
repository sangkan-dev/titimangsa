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

- [ ] Setup `apps/api/package.json`.
- [ ] Install dan konfigurasi Hono.
- [ ] Buat `apps/api/src/index.ts`.
- [ ] Buat struktur routes:
  - [ ] `health.ts`
  - [ ] `holidays.ts`
  - [ ] `workdays.ts`
  - [ ] `sources.ts`
- [ ] Buat struktur services:
  - [ ] `holiday-service.ts`
  - [ ] `workday-service.ts`
  - [ ] `source-service.ts`
- [ ] Buat utilities:
  - [ ] `date.ts`
  - [ ] `response.ts`
  - [ ] `errors.ts`

### Middleware & Headers

- [ ] Tambahkan CORS publik.
- [ ] Batasi method ke `GET` dan `OPTIONS`.
- [ ] Tambahkan `Cache-Control: public, max-age=3600, s-maxage=86400` untuk endpoint read-only.
- [ ] Tambahkan JSON content type.
- [ ] Tambahkan fallback 404.
- [ ] Tambahkan global error handler.

### Response & Error Contract

- [ ] Implement response success format dengan `meta` dan `data`.
- [ ] Implement error format dengan `error.code`, `error.message`, dan `error.details`.
- [ ] Implement error code:
  - [ ] `INVALID_DATE`
  - [ ] `INVALID_YEAR`
  - [ ] `INVALID_TYPE`
  - [ ] `DATASET_NOT_FOUND`
  - [ ] `INVALID_RANGE`
  - [ ] `INTERNAL_ERROR`

### Endpoints

- [ ] Implement `GET /v1/health`.
- [ ] Implement `GET /v1/holidays`.
- [ ] Support query `year`.
- [ ] Support query `type`.
- [ ] Support query `includeSources`.
- [ ] Implement `GET /v1/holidays/check`.
- [ ] Support query `date`.
- [ ] Support query `includeCollectiveLeave`.
- [ ] Support query `includeSources`.
- [ ] Implement `GET /v1/workdays/check`.
- [ ] Support query `date`.
- [ ] Support query `includeCollectiveLeave`.
- [ ] Support query `weekend`.
- [ ] Implement `GET /v1/workdays/add`.
- [ ] Support query `date`.
- [ ] Support query `days`.
- [ ] Support query `includeCollectiveLeave`.
- [ ] Support query `weekend`.
- [ ] Implement `GET /v1/workdays/diff`.
- [ ] Support query `start`.
- [ ] Support query `end`.
- [ ] Support query `includeCollectiveLeave`.
- [ ] Support query `weekend`.
- [ ] Support query `inclusive`.
- [ ] Implement `GET /v1/sources`.
- [ ] Support query `year`.

### API Tests

- [ ] Test health endpoint.
- [ ] Test list holidays default current year.
- [ ] Test list holidays by year.
- [ ] Test list holidays by type.
- [ ] Test holiday check.
- [ ] Test workday check.
- [ ] Test add workdays.
- [ ] Test diff workdays.
- [ ] Test sources.
- [ ] Test invalid date returns 400.
- [ ] Test invalid type returns 400.
- [ ] Test dataset not found returns 404.
- [ ] Test response cache headers.
- [ ] Test CORS headers.

### Acceptance Criteria

- [ ] Semua endpoint MVP berjalan lokal.
- [ ] Semua endpoint memakai `/v1`.
- [ ] Response sesuai kontrak PRD.
- [ ] Error response konsisten.
- [ ] API memakai core package untuk business logic.

## Phase 4 - Cloudflare Deployment

Tujuan: membuat API bisa dideploy ke Cloudflare Workers dan siap dipasang ke domain produksi.

### Tasks

- [ ] Buat `apps/api/wrangler.toml`.
- [ ] Konfigurasi Worker name.
- [ ] Konfigurasi compatibility date.
- [ ] Pastikan generated JSON ikut terbundle.
- [ ] Tambahkan script deploy API.
- [ ] Buat workflow `.github/workflows/deploy-api.yml`.
- [ ] Tambahkan environment/secret deployment sesuai kebutuhan Wrangler.
- [ ] Deploy ke workers.dev sementara.
- [ ] Konfigurasi custom domain `titimangsa.sangkan.dev`.
- [ ] Test endpoint production.

### Acceptance Criteria

- [ ] API tersedia di Cloudflare Workers.
- [ ] `/v1/health` production mengembalikan status ok.
- [ ] Endpoint MVP production mengembalikan data valid.
- [ ] Cache header tersedia di production.

## Phase 5 - Documentation

Tujuan: menyediakan dokumentasi publik agar developer bisa integrasi cepat dan kontributor bisa memperbarui data dengan benar.

### Docs Setup

- [ ] Setup `apps/docs/package.json`.
- [ ] Setup VitePress.
- [ ] Buat `.vitepress/config.ts`.
- [ ] Tambahkan script docs dev/build.

### Pages

- [ ] Buat `apps/docs/index.md`.
- [ ] Buat `apps/docs/guide/getting-started.md`.
- [ ] Buat `apps/docs/guide/api-reference.md`.
- [ ] Buat `apps/docs/guide/data-sources.md`.
- [ ] Buat `apps/docs/guide/contributing-data.md`.
- [ ] Buat `apps/docs/guide/limitations.md`.
- [ ] Buat `apps/docs/guide/changelog.md`.

### Required Content

- [ ] Jelaskan apa itu Titimangsa.
- [ ] Jelaskan status unofficial.
- [ ] Jelaskan sumber data resmi publik.
- [ ] Jelaskan cara menggunakan API.
- [ ] Tambahkan contoh request/response.
- [ ] Jelaskan cara kontribusi data.
- [ ] Jelaskan cara menjalankan validasi dataset.
- [ ] Jelaskan perbedaan `national_holiday` dan `collective_leave`.
- [ ] Jelaskan opsi `includeCollectiveLeave`.
- [ ] Jelaskan limitasi dan disclaimer.
- [ ] Jelaskan Cloudflare Workers Free bukan unlimited.

### Deployment

- [ ] Buat workflow `.github/workflows/deploy-docs.yml`.
- [ ] Deploy docs.
- [ ] Tautkan docs dari README.

### Acceptance Criteria

- [ ] Docs bisa dijalankan lokal.
- [ ] Docs bisa dibuild.
- [ ] Docs publik tersedia.
- [ ] Disclaimer tersedia dalam Bahasa Indonesia dan Inggris.

## Phase 6 - CI & Governance

Tujuan: memastikan perubahan data, core, API, dan docs tervalidasi sebelum merge.

### CI

- [ ] Buat `.github/workflows/validate-data.yml`.
- [ ] CI menjalankan `pnpm install`.
- [ ] CI menjalankan `pnpm validate:data`.
- [ ] CI menjalankan `pnpm generate:data`.
- [ ] CI menjalankan `pnpm test`.
- [ ] CI menjalankan build package core.
- [ ] CI menjalankan build API.
- [ ] CI menjalankan build docs.

### Governance

- [ ] Buat issue templates.
- [ ] Buat PR template.
- [ ] Tambahkan checklist source official/public.
- [ ] Tambahkan checklist generated JSON update.
- [ ] Tambahkan checklist tests passed.
- [ ] Tambahkan kontribusi data rules di `CONTRIBUTING.md`.
- [ ] Tambahkan lisensi dataset/docs jika dipisahkan dari MIT.

### Acceptance Criteria

- [ ] Pull request perubahan data gagal jika validasi gagal.
- [ ] Pull request memiliki checklist kontribusi data.
- [ ] Project memiliki panduan kontribusi yang jelas.

## Phase 7 - Public Launch

Tujuan: merapikan project untuk rilis open-source pertama.

### Tasks

- [ ] Rapikan README.
- [ ] Tambahkan badge CI.
- [ ] Tambahkan badge license.
- [ ] Tambahkan contoh usage API.
- [ ] Tambahkan contoh self-hosting singkat.
- [ ] Review semua disclaimer.
- [ ] Buat changelog awal.
- [ ] Buat release `v0.1.0`.
- [ ] Buka issue untuk dataset tahun lain.
- [ ] Publish announcement.

### Acceptance Criteria

- [ ] Release `v0.1.0` tersedia.
- [ ] Project siap diumumkan sebagai open-source.
- [ ] Developer bisa memahami dan mencoba API dari README/docs.

## Cross-Cutting Requirements

### Data Integrity

- [ ] Tidak ada data final dari sumber komunitas sebagai source of truth.
- [ ] Semua dataset menyimpan metadata sumber.
- [ ] Revisi dataset menaikkan field `revision`.
- [ ] Perubahan dataset terdokumentasi di changelog.

### API Quality

- [ ] Endpoint hanya menerima parameter yang terdokumentasi.
- [ ] Parameter boolean diparse konsisten.
- [ ] Parameter weekend diparse konsisten.
- [ ] Error message jelas dan stabil.
- [ ] Response tidak membocorkan stack trace.

### Security & Abuse

- [ ] Tidak ada secret di runtime client.
- [ ] Tidak ada endpoint write publik.
- [ ] CORS hanya membuka method yang diperlukan.
- [ ] Dokumentasi menyarankan client-side caching.

### Compatibility

- [ ] API response MVP stabil sebelum public launch.
- [ ] Breaking change berikutnya harus memakai `/v2`.
- [ ] Generated JSON mempertahankan shape yang terdokumentasi.

## MVP Definition of Done

MVP dianggap selesai jika semua item berikut terpenuhi:

- [ ] Dataset 2025 dan 2026 tersedia.
- [ ] Dataset 2025 dan 2026 memiliki source resmi publik.
- [ ] `pnpm validate:data` berhasil di lokal dan CI.
- [ ] `pnpm generate:data` berhasil di lokal dan CI.
- [ ] Generated JSON tersedia.
- [ ] Core workday logic memiliki unit test.
- [ ] API `/v1/health` berjalan.
- [ ] API `/v1/holidays` berjalan.
- [ ] API `/v1/holidays/check` berjalan.
- [ ] API `/v1/workdays/check` berjalan.
- [ ] API `/v1/workdays/add` berjalan.
- [ ] API `/v1/workdays/diff` berjalan.
- [ ] API `/v1/sources` berjalan.
- [ ] API deploy di Cloudflare Workers.
- [ ] Docs VitePress tersedia.
- [ ] README menjelaskan status unofficial.
- [ ] Disclaimer tersedia di README dan docs.
- [ ] Tidak ada klaim sebagai API resmi pemerintah.

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
