# PRD — Titimangsa

> Indonesia holiday and business day API, curated from official public sources.

## 1. Ringkasan Produk

**Titimangsa** adalah proyek open-source di bawah `sangkan-dev` untuk menyediakan dataset dan API hari libur Indonesia, cuti bersama, serta kalkulasi hari kerja.

Project ini tidak diposisikan sebagai API resmi pemerintah. Titimangsa adalah API komunitas yang datanya dikurasi dari dokumen resmi pemerintah yang tersedia untuk publik, seperti SKB 3 Menteri, rilis Kemenko PMK, Setneg, JDIH, dan dokumen pendukung lain yang relevan.

Fokus utama Titimangsa bukan hanya menyediakan daftar tanggal merah, tetapi juga membantu aplikasi menghitung hari kerja secara praktis untuk kebutuhan sistem nyata seperti payroll, absensi, cuti, SLA, invoice due date, project management, delivery schedule, dan workflow operasional.

## 2. Identitas Project

### 2.1 Nama

**Titimangsa**

Makna: tanggal, waktu, masa, atau penanggalan.

Nama ini dipilih karena memiliki nuansa lokal/Nusantara yang selaras dengan identitas Sangkan, namun tetap relevan dengan domain produk yaitu kalender, hari libur, dan hari kerja.

### 2.2 Repository

```txt
https://github.com/sangkan-dev/titimangsa
```

### 2.3 Tagline

```txt
Indonesia holiday and business day API, curated from official public sources.
```

Versi Indonesia:

```txt
API hari libur dan hari kerja Indonesia, dikurasi dari sumber resmi publik.
```

### 2.4 Positioning

Titimangsa adalah:

- Open-source Indonesia holiday API.
- Open dataset untuk hari libur nasional dan cuti bersama.
- Business day calculation engine.
- Dataset yang traceable ke sumber resmi publik.
- API ringan yang cocok dijalankan di Cloudflare Workers.

Titimangsa bukan:

- API resmi pemerintah.
- Pengganti dokumen hukum/administratif resmi.
- Sistem kalender semua negara.
- Kalender Jawa/Hijriah lengkap.
- Sistem HR/payroll penuh.

## 3. Latar Belakang Masalah

Saat membangun aplikasi operasional di Indonesia, developer sering membutuhkan data seperti:

- Apakah hari ini hari libur nasional?
- Apakah tanggal tertentu termasuk cuti bersama?
- Apakah tanggal ini termasuk hari kerja?
- Jika invoice jatuh tempo dalam 5 hari kerja, tanggal akhirnya kapan?
- Berapa jumlah hari kerja antara dua tanggal?
- Apakah SLA harus dihitung melewati Sabtu, Minggu, libur nasional, atau cuti bersama?

Masalahnya, data resmi hari libur nasional Indonesia umumnya dipublikasikan dalam bentuk dokumen seperti PDF SKB 3 Menteri, berita pemerintah, atau halaman pengumuman. Format tersebut sah secara administratif, tetapi kurang ramah untuk aplikasi karena tidak langsung machine-readable.

Di sisi lain, beberapa API komunitas sudah ada, tetapi sering memiliki keterbatasan:

- Tidak selalu jelas sumber datanya.
- Tidak selalu menyimpan metadata dokumen resmi.
- Tidak selalu membedakan libur nasional dan cuti bersama dengan rapi.
- Tidak selalu menyediakan business day calculation.
- Tidak selalu memiliki proses validasi dataset yang jelas.
- Tidak selalu cocok untuk digunakan sebagai dependency sistem production.

Titimangsa hadir untuk mengisi gap tersebut dengan pendekatan:

```txt
Official public source → Curated dataset → Validated JSON → API → Docs
```

## 4. Tujuan Produk

### 4.1 Tujuan Utama

Menyediakan API dan dataset open-source untuk data hari libur nasional, cuti bersama, dan kalkulasi hari kerja Indonesia yang:

- Mudah digunakan developer.
- Mudah diverifikasi dari sumber resmi publik.
- Stabil untuk integrasi aplikasi.
- Ringan untuk dijalankan di edge runtime.
- Mudah dikontribusikan oleh komunitas.

### 4.2 Tujuan MVP

MVP Titimangsa harus mampu:

1. Menyediakan dataset hari libur nasional Indonesia.
2. Menyediakan dataset cuti bersama Indonesia.
3. Menggunakan dokumen resmi publik sebagai sumber utama.
4. Menyediakan API untuk list hari libur berdasarkan tahun.
5. Menyediakan API untuk cek tanggal tertentu.
6. Menyediakan API untuk cek hari kerja.
7. Menyediakan API untuk menambah N hari kerja dari tanggal tertentu.
8. Menyediakan API untuk menghitung jumlah hari kerja antar tanggal.
9. Menyediakan dokumentasi publik.
10. Memiliki validasi dataset di CI.

### 4.3 Non-goals MVP

MVP tidak mencakup:

- Regional holiday per provinsi/kota.
- Kalender Jawa lengkap.
- Kalender Hijriah lengkap.
- Integrasi Google Calendar.
- Export `.ics`.
- Dashboard admin.
- API key.
- Rate limit custom berbasis user.
- Database runtime.
- User authentication.
- Multi-country holiday API.

Fitur-fitur tersebut bisa dipertimbangkan setelah fondasi dataset, API, dan docs stabil.

## 5. Target Pengguna

### 5.1 Developer Backend

Butuh endpoint sederhana untuk menentukan apakah tanggal tertentu termasuk hari libur atau hari kerja.

Contoh kebutuhan:

- Payroll.
- Absensi.
- Invoice due date.
- Ticketing SLA.
- Workflow approval.
- Booking system.

### 5.2 Developer Frontend

Butuh data kalender untuk menandai tanggal merah/cuti bersama di UI.

Contoh kebutuhan:

- Date picker.
- Kalender dashboard.
- Jadwal operasional.
- Reminder.

### 5.3 Tim HR/Operasional

Menggunakan aplikasi internal yang perlu menghitung:

- Hari kerja efektif.
- Jadwal cuti.
- Hari operasional kantor.
- Libur nasional/cuti bersama.

### 5.4 Open-source Contributor

Developer yang ingin membantu menambah data tahun baru, memperbaiki typo, menambah sumber, atau memperbaiki validasi.

## 6. Use Case Utama

### 6.1 List Hari Libur per Tahun

Sebagai developer, saya ingin mengambil daftar hari libur nasional dan cuti bersama pada tahun tertentu agar aplikasi saya bisa menampilkan kalender libur.

Endpoint:

```http
GET /v1/holidays?year=2026
```

### 6.2 Cek Apakah Tanggal Adalah Hari Libur

Sebagai developer, saya ingin mengecek apakah tanggal tertentu adalah hari libur agar sistem bisa menyesuaikan jadwal operasional.

Endpoint:

```http
GET /v1/holidays/check?date=2026-03-20
```

### 6.3 Cek Apakah Tanggal Adalah Hari Kerja

Sebagai developer, saya ingin mengecek apakah tanggal tertentu adalah hari kerja dengan mempertimbangkan weekend, libur nasional, dan cuti bersama.

Endpoint:

```http
GET /v1/workdays/check?date=2026-03-20
```

### 6.4 Tambah N Hari Kerja

Sebagai developer, saya ingin menambahkan N hari kerja dari tanggal tertentu untuk menghitung due date.

Endpoint:

```http
GET /v1/workdays/add?date=2026-03-18&days=5
```

### 6.5 Hitung Jumlah Hari Kerja

Sebagai developer, saya ingin menghitung jumlah hari kerja antara dua tanggal untuk kebutuhan SLA, cuti, payroll, atau laporan operasional.

Endpoint:

```http
GET /v1/workdays/diff?start=2026-03-01&end=2026-03-31
```

### 6.6 Lihat Sumber Data

Sebagai pengguna API, saya ingin melihat sumber resmi dataset agar bisa memverifikasi asal data.

Endpoint:

```http
GET /v1/sources?year=2026
```

## 7. Sumber Data

### 7.1 Prinsip Sumber Data

Titimangsa menggunakan prinsip source priority:

```txt
Primary official source
        ↓
Secondary official source
        ↓
Official announcement/reference
        ↓
Community reference for comparison only
```

Data tidak boleh diambil dari sumber komunitas sebagai source of truth utama.

### 7.2 Primary Source

Primary source untuk libur nasional dan cuti bersama Indonesia:

```txt
SKB 3 Menteri tentang Hari Libur Nasional dan Cuti Bersama
```

Biasanya melibatkan:

- Menteri Agama.
- Menteri Ketenagakerjaan.
- Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi.

Contoh source 2026:

- Kemenko PMK — Pemerintah Tetapkan 17 Hari Libur Nasional dan 8 Cuti Bersama Tahun 2026
  - https://www.kemenkopmk.go.id/pemerintah-tetapkan-17-hari-libur-nasional-dan-8-cuti-bersama-tahun-2026
- Setneg — Inilah SKB 3 Menteri Libur Nasional dan Cuti Bersama 2026
  - https://www.setneg.go.id/baca/index/inilah_skb_3_menteri_libur_nasional_dan_cuti_bersama_2026

### 7.3 Secondary Source

Secondary source digunakan untuk cross-check, bukan menggantikan SKB utama.

Contoh:

- Setneg.
- Kemenko PMK.
- JDIH Setneg.
- KemenPAN-RB.
- Kemnaker.
- Kemenag.
- Keputusan Presiden terkait cuti bersama ASN jika relevan.

### 7.4 Community Source

Community source hanya boleh dipakai sebagai pembanding, bukan sumber final.

Contoh kategori:

- API komunitas hari libur.
- Repository GitHub.
- Google Calendar publik.
- Artikel blog.
- Website kalender.

Jika terdapat perbedaan antara community source dan dokumen resmi, dokumen resmi harus diprioritaskan.

## 8. Strategi Data

### 8.1 Alur Data

```txt
Dokumen resmi publik
        ↓
Input manual ke YAML
        ↓
Validasi schema
        ↓
Cross-check jumlah dan tanggal
        ↓
Generate JSON
        ↓
API runtime membaca generated JSON
```

### 8.2 Kenapa Manual-curated?

Karena data libur nasional berubah sangat jarang dan dirilis tahunan. Scraping realtime dari PDF pemerintah tidak efisien dan rawan error.

Pendekatan manual-curated memberi keuntungan:

- Lebih mudah direview lewat pull request.
- Lebih stabil.
- Bisa menyimpan metadata sumber.
- Tidak bergantung pada struktur HTML/PDF yang berubah.
- Runtime API lebih cepat.
- Lebih mudah diaudit.

### 8.3 Struktur Folder Data

```txt
data/
  sources/
    2025.yaml
    2026.yaml

  generated/
    id-2025.json
    id-2026.json
    id-latest.json

  schemas/
    source.schema.json
    generated.schema.json
```

### 8.4 Format YAML Dataset

Contoh:

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
    url: "https://www.kemenkopmk.go.id/pemerintah-tetapkan-17-hari-libur-nasional-dan-8-cuti-bersama-tahun-2026"
    publisher: "Kemenko PMK"
    publishedAt: "2025-09-19"
    official: true

holidays:
  - date: "2026-01-01"
    localName: "Tahun Baru 2026 Masehi"
    name: "New Year's Day 2026"
    type: "national_holiday"
    sourceIds:
      - skb-3-menteri-2026

  - date: "2026-03-20"
    localName: "Cuti Bersama Idulfitri 1447 Hijriah"
    name: "Collective Leave for Eid al-Fitr 1447 H"
    type: "collective_leave"
    sourceIds:
      - skb-3-menteri-2026
```

### 8.5 Tipe Hari

MVP hanya wajib mendukung:

```txt
national_holiday
collective_leave
```

Tipe yang disiapkan untuk masa depan:

```txt
regional_holiday
observance
work_arrangement
```

Penjelasan:

| Type | Keterangan | MVP |
|---|---|---|
| `national_holiday` | Hari libur nasional | Ya |
| `collective_leave` | Cuti bersama | Ya |
| `regional_holiday` | Libur daerah tertentu | Tidak |
| `observance` | Hari peringatan, bukan libur | Tidak |
| `work_arrangement` | Pengaturan kerja khusus seperti WFA | Tidak |

### 8.6 Status Dataset

Setiap dataset tahunan memiliki status:

| Status | Keterangan |
|---|---|
| `draft` | Sedang disusun, belum valid |
| `verified` | Sudah diverifikasi dari sumber resmi |
| `archived` | Versi lama setelah ada revisi |
| `deprecated` | Tidak direkomendasikan dipakai |

## 9. Validasi Data

### 9.1 Validasi Wajib

Script validasi harus mengecek:

- File YAML valid.
- Semua tanggal memakai format ISO `YYYY-MM-DD`.
- Tahun tanggal sesuai dengan field `year`.
- `countryCode` valid.
- `type` berada dalam enum yang diizinkan.
- Tidak ada duplikasi `date + type + localName`.
- Semua `sourceIds` merujuk ke source yang ada.
- Minimal ada satu source official.
- Jumlah `national_holiday` sesuai `expected.nationalHolidayCount`.
- Jumlah `collective_leave` sesuai `expected.collectiveLeaveCount`.
- Generated JSON valid terhadap schema.
- Urutan data berdasarkan tanggal ascending.

### 9.2 Validasi Opsional

Validasi opsional:

- Cek weekday dari tanggal.
- Cek nama hari lokal.
- Cek source URL dapat diakses.
- Cek apakah ada tanggal ganda yang masuk dua tipe berbeda.
- Cek konsistensi penamaan `localName`.

### 9.3 CI Requirement

Pull request yang mengubah data wajib menjalankan:

```txt
pnpm validate:data
pnpm generate:data
pnpm test
```

Jika validasi gagal, PR tidak boleh merge.

## 10. API Design

### 10.1 Base URL

Production target:

```txt
https://titimangsa.sangkan.dev
```

Alternatif sementara:

```txt
https://titimangsa.<cloudflare-workers-subdomain>.workers.dev
```

### 10.2 API Versioning

Semua endpoint publik harus berada di bawah `/v1`.

```txt
/v1/...
```

Breaking change harus masuk `/v2`.

### 10.3 Response Format Umum

Success response:

```json
{
  "meta": {
    "version": "v1",
    "countryCode": "ID"
  },
  "data": []
}
```

Error response:

```json
{
  "error": {
    "code": "INVALID_DATE",
    "message": "Date must use YYYY-MM-DD format.",
    "details": {
      "field": "date"
    }
  }
}
```

### 10.4 Endpoint: Health Check

```http
GET /v1/health
```

Response:

```json
{
  "status": "ok",
  "service": "titimangsa",
  "version": "v1"
}
```

### 10.5 Endpoint: List Holidays

```http
GET /v1/holidays?year=2026
```

Query params:

| Param | Type | Required | Default | Description |
|---|---|---:|---|---|
| `year` | number | No | current year | Tahun dataset |
| `type` | string | No | all | Filter tipe holiday |
| `includeSources` | boolean | No | false | Sertakan metadata sumber |

Example:

```http
GET /v1/holidays?year=2026&type=national_holiday
```

Response:

```json
{
  "meta": {
    "version": "v1",
    "countryCode": "ID",
    "year": 2026,
    "revision": 1,
    "status": "verified",
    "total": 17
  },
  "data": [
    {
      "date": "2026-01-01",
      "day": "Thursday",
      "localDay": "Kamis",
      "localName": "Tahun Baru 2026 Masehi",
      "name": "New Year's Day 2026",
      "type": "national_holiday",
      "isNationalHoliday": true,
      "isCollectiveLeave": false
    }
  ]
}
```

### 10.6 Endpoint: Check Holiday

```http
GET /v1/holidays/check?date=2026-03-20
```

Query params:

| Param | Type | Required | Default |
|---|---|---:|---|
| `date` | string | Yes | - |
| `includeCollectiveLeave` | boolean | No | true |
| `includeSources` | boolean | No | false |

Response:

```json
{
  "meta": {
    "version": "v1",
    "countryCode": "ID",
    "year": 2026
  },
  "data": {
    "date": "2026-03-20",
    "day": "Friday",
    "localDay": "Jumat",
    "isHoliday": true,
    "holidays": [
      {
        "date": "2026-03-20",
        "localName": "Cuti Bersama Idulfitri 1447 Hijriah",
        "name": "Collective Leave for Eid al-Fitr 1447 H",
        "type": "collective_leave"
      }
    ]
  }
}
```

### 10.7 Endpoint: Check Workday

```http
GET /v1/workdays/check?date=2026-03-20
```

Query params:

| Param | Type | Required | Default |
|---|---|---:|---|
| `date` | string | Yes | - |
| `includeCollectiveLeave` | boolean | No | true |
| `weekend` | string | No | `sat,sun` |

Response:

```json
{
  "meta": {
    "version": "v1",
    "countryCode": "ID",
    "year": 2026
  },
  "data": {
    "date": "2026-03-20",
    "day": "Friday",
    "localDay": "Jumat",
    "isWeekend": false,
    "isHoliday": true,
    "isWorkday": false,
    "holidayTypes": [
      "collective_leave"
    ]
  }
}
```

### 10.8 Endpoint: Add Workdays

```http
GET /v1/workdays/add?date=2026-03-18&days=5
```

Query params:

| Param | Type | Required | Default |
|---|---|---:|---|
| `date` | string | Yes | - |
| `days` | number | Yes | - |
| `includeCollectiveLeave` | boolean | No | true |
| `weekend` | string | No | `sat,sun` |

Rules:

- `days` harus integer.
- `days` boleh positif.
- Dukungan `days` negatif bisa ditunda setelah MVP.
- Tanggal awal tidak dihitung sebagai hari pertama, kecuali nanti ditambah opsi `includeStartDate`.

Response:

```json
{
  "meta": {
    "version": "v1",
    "countryCode": "ID"
  },
  "data": {
    "startDate": "2026-03-18",
    "days": 5,
    "resultDate": "2026-03-30",
    "options": {
      "includeCollectiveLeave": true,
      "weekend": [
        "sat",
        "sun"
      ]
    }
  }
}
```

### 10.9 Endpoint: Diff Workdays

```http
GET /v1/workdays/diff?start=2026-03-01&end=2026-03-31
```

Query params:

| Param | Type | Required | Default |
|---|---|---:|---|
| `start` | string | Yes | - |
| `end` | string | Yes | - |
| `includeCollectiveLeave` | boolean | No | true |
| `weekend` | string | No | `sat,sun` |
| `inclusive` | boolean | No | true |

Response:

```json
{
  "meta": {
    "version": "v1",
    "countryCode": "ID"
  },
  "data": {
    "startDate": "2026-03-01",
    "endDate": "2026-03-31",
    "inclusive": true,
    "workdayCount": 16,
    "holidayCount": 7,
    "weekendCount": 9,
    "options": {
      "includeCollectiveLeave": true,
      "weekend": [
        "sat",
        "sun"
      ]
    }
  }
}
```

### 10.10 Endpoint: Sources

```http
GET /v1/sources?year=2026
```

Response:

```json
{
  "meta": {
    "version": "v1",
    "countryCode": "ID",
    "year": 2026
  },
  "data": [
    {
      "id": "skb-3-menteri-2026",
      "title": "SKB 3 Menteri Libur Nasional dan Cuti Bersama Tahun 2026",
      "type": "SKB",
      "url": "https://www.kemenkopmk.go.id/pemerintah-tetapkan-17-hari-libur-nasional-dan-8-cuti-bersama-tahun-2026",
      "publisher": "Kemenko PMK",
      "publishedAt": "2025-09-19",
      "official": true
    }
  ]
}
```

## 11. Error Handling

### 11.1 Error Codes

| Code | HTTP | Description |
|---|---:|---|
| `INVALID_DATE` | 400 | Format tanggal salah |
| `INVALID_YEAR` | 400 | Tahun tidak valid |
| `INVALID_TYPE` | 400 | Type tidak dikenal |
| `DATASET_NOT_FOUND` | 404 | Dataset tahun tidak tersedia |
| `INVALID_RANGE` | 400 | Range tanggal tidak valid |
| `INTERNAL_ERROR` | 500 | Error internal |

### 11.2 Format Error

```json
{
  "error": {
    "code": "DATASET_NOT_FOUND",
    "message": "Dataset for year 2024 is not available.",
    "details": {
      "year": 2024
    }
  }
}
```

## 12. Teknologi

### 12.1 Stack MVP

| Area | Pilihan |
|---|---|
| Runtime | Cloudflare Workers |
| Web framework | Hono |
| Language | TypeScript |
| Package manager | pnpm |
| Dataset source | YAML |
| Generated data | JSON |
| Docs | VitePress |
| Testing | Vitest |
| Validation | Zod / JSON Schema |
| CI/CD | GitHub Actions |
| Deployment | Wrangler |
| Repo owner | `sangkan-dev` |

### 12.2 Kenapa Hono?

Hono dipilih karena:

- Ringan.
- Cocok untuk edge runtime.
- Mendukung Cloudflare Workers.
- API ergonomis.
- TypeScript-friendly.
- Cukup matang untuk API kecil sampai menengah.

### 12.3 Kenapa Cloudflare Workers?

Cloudflare Workers dipilih karena:

- Cocok untuk API read-heavy.
- Deploy sederhana.
- Global edge network.
- Tidak perlu manage server.
- Free tier cukup besar untuk MVP open-source.
- Cocok dengan Hono.

Catatan: Cloudflare Workers Free bukan unlimited. Saat PRD ini dibuat, Free plan memiliki limit 100.000 requests per hari per akun, reset pada 00:00 UTC. Ini tetap cukup besar untuk MVP, tetapi dokumentasi project tidak boleh mengklaim "unlimited".

### 12.4 Kenapa Belum Pakai Database?

Untuk MVP, database runtime belum diperlukan karena:

- Data kecil.
- Update jarang.
- Query sederhana.
- Bisa dibundle sebagai generated JSON.
- Lebih cepat.
- Lebih murah.
- Lebih mudah dimaintain.

Database seperti Cloudflare D1 baru dipertimbangkan jika nanti ada:

- Admin dashboard.
- API key.
- Usage analytics.
- Audit trail dinamis.
- Kontribusi data via UI.
- Dataset regional kompleks.

## 13. Arsitektur Sistem

### 13.1 Arsitektur MVP

```txt
GitHub Repository
      ↓
YAML Dataset
      ↓
Validation Script
      ↓
Generated JSON
      ↓
Hono API
      ↓
Cloudflare Workers
      ↓
Public API
```

### 13.2 Runtime Flow

```txt
Request /v1/holidays?year=2026
      ↓
Validate query params
      ↓
Load generated dataset by year
      ↓
Filter data
      ↓
Build response
      ↓
Return JSON + cache headers
```

### 13.3 Data Build Flow

```txt
data/sources/2026.yaml
      ↓
pnpm validate:data
      ↓
pnpm generate:data
      ↓
data/generated/id-2026.json
      ↓
API import generated JSON
```

## 14. Struktur Repository

```txt
titimangsa/
  apps/
    api/
      src/
        index.ts
        routes/
          holidays.ts
          workdays.ts
          sources.ts
          health.ts
        services/
          holiday-service.ts
          workday-service.ts
          source-service.ts
        utils/
          date.ts
          response.ts
          errors.ts
      wrangler.toml
      package.json

    docs/
      .vitepress/
        config.ts
      index.md
      guide/
        getting-started.md
        data-sources.md
        api-reference.md
        contributing-data.md
        limitations.md
      package.json

  packages/
    core/
      src/
        types.ts
        holiday.ts
        workday.ts
        calendar.ts
        dataset.ts
      package.json

  data/
    sources/
      2025.yaml
      2026.yaml
    generated/
      id-2025.json
      id-2026.json
      id-latest.json
    schemas/
      source.schema.json
      generated.schema.json

  scripts/
    generate.ts
    validate.ts
    check-duplicates.ts
    check-weekday.ts

  .github/
    workflows/
      validate-data.yml
      deploy-api.yml
      deploy-docs.yml

  README.md
  PRD.md
  CONTRIBUTING.md
  CODE_OF_CONDUCT.md
  LICENSE
  pnpm-workspace.yaml
  package.json
```

## 15. Core Package

Core package berisi logic reusable yang bisa dipakai oleh API, test, dan kemungkinan package npm.

Target package:

```txt
@sangkan-dev/titimangsa
```

### 15.1 Public Functions

```ts
getHolidays(year: number, options?: HolidayOptions): Holiday[]

checkHoliday(date: string, options?: HolidayCheckOptions): HolidayCheckResult

isWeekend(date: string, options?: WeekendOptions): boolean

isWorkday(date: string, options?: WorkdayOptions): boolean

addWorkdays(date: string, days: number, options?: WorkdayOptions): WorkdayAddResult

diffWorkdays(start: string, end: string, options?: WorkdayDiffOptions): WorkdayDiffResult

getSources(year: number): Source[]
```

### 15.2 Default Options

```ts
const defaultWorkdayOptions = {
  countryCode: 'ID',
  weekend: ['sat', 'sun'],
  includeCollectiveLeave: true
}
```

## 16. Caching Strategy

### 16.1 API Cache Header

Untuk endpoint read-only:

```http
Cache-Control: public, max-age=3600, s-maxage=86400
```

Rationale:

- Browser/proxy cache 1 jam.
- CDN/shared cache 1 hari.
- Data jarang berubah.

### 16.2 Dataset Revision

Jika ada revisi data, deploy baru akan memperbarui generated JSON.

Response metadata harus menampilkan:

```json
{
  "revision": 1,
  "status": "verified",
  "updatedAt": "2026-01-01"
}
```

## 17. Security & Abuse Considerations

MVP API bersifat publik dan read-only.

Risiko:

- Abuse request.
- Scraping berlebihan.
- Penggunaan sebagai dependency production tanpa cache.
- Salah tafsir sebagai API resmi pemerintah.

Mitigasi:

- Cache-Control.
- Dokumentasi rate/usage notes.
- Disclaimer jelas.
- Response ringan.
- Tidak ada endpoint write publik.
- Tidak ada secret di client/runtime.
- Batasi method hanya GET/OPTIONS.
- CORS eksplisit.

## 18. CORS

MVP boleh membuka CORS untuk publik:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Karena API ini read-only dan tidak memproses data sensitif.

## 19. Dokumentasi

Dokumentasi menggunakan VitePress.

### 19.1 Struktur Docs

```txt
Introduction
Getting Started
API Reference
Data Sources
Contributing Data
Limitations
Changelog
```

### 19.2 Konten Wajib Docs

Docs wajib menjelaskan:

- Apa itu Titimangsa.
- Status unofficial.
- Sumber data resmi publik.
- Cara menggunakan API.
- Contoh request/response.
- Cara kontribusi data.
- Cara validasi dataset.
- Perbedaan `national_holiday` dan `collective_leave`.
- Cara kerja `includeCollectiveLeave`.
- Limitasi dan disclaimer.

### 19.3 Disclaimer

Versi Inggris:

```txt
Titimangsa is not an official government API. The dataset is curated from publicly available official government documents. Always refer to the original documents for legal or administrative certainty.
```

Versi Indonesia:

```txt
Titimangsa bukan API resmi pemerintah. Dataset dikurasi dari dokumen resmi pemerintah yang tersedia untuk publik. Untuk kepastian hukum atau administratif, selalu rujuk dokumen sumber asli.
```

## 20. Open-source Governance

### 20.1 License

Rekomendasi:

- Code: MIT License.
- Dataset/docs: CC BY 4.0 atau ODC-BY.

Jika ingin sederhana untuk awal, gunakan MIT untuk seluruh repo, lalu pisahkan lisensi dataset setelah project mulai matang.

### 20.2 Contribution Rules

Kontributor yang menambah/mengubah data wajib:

1. Menyertakan source URL resmi.
2. Menjelaskan perubahan di PR.
3. Menjalankan validasi.
4. Tidak mengambil data final dari sumber komunitas tanpa cross-check.
5. Menjaga format penamaan konsisten.

### 20.3 PR Template

PR data minimal berisi:

```md
## Summary

## Source Documents

## Changes

## Checklist
- [ ] Source is official/public government source.
- [ ] Data has been validated.
- [ ] Generated JSON has been updated.
- [ ] Tests passed.
```

## 21. Roadmap

### Phase 0 — Repository Setup

Target:

- Buat repo `sangkan-dev/titimangsa`.
- Setup pnpm workspace.
- Setup TypeScript.
- Setup lint/test basic.
- Tambahkan README, LICENSE, CONTRIBUTING, PRD.

Deliverable:

```txt
Repo skeleton siap dikembangkan.
```

### Phase 1 — Dataset Foundation

Target:

- Buat schema YAML.
- Input data 2025 dan 2026.
- Buat script validate.
- Buat script generate JSON.
- Setup GitHub Actions untuk validasi data.

Deliverable:

```txt
Dataset verified + generated JSON.
```

### Phase 2 — Core Package

Target:

- Implement `getHolidays`.
- Implement `checkHoliday`.
- Implement `isWeekend`.
- Implement `isWorkday`.
- Implement `addWorkdays`.
- Implement `diffWorkdays`.
- Unit test core logic.

Deliverable:

```txt
Core business-day engine reusable.
```

### Phase 3 — API MVP

Target:

- Setup Hono.
- Implement route health.
- Implement route holidays.
- Implement route holiday check.
- Implement route workday check.
- Implement route workday add.
- Implement route workday diff.
- Implement route sources.
- Tambahkan CORS.
- Tambahkan cache header.
- Tambahkan error format.

Deliverable:

```txt
Public API berjalan lokal dan siap deploy.
```

### Phase 4 — Cloudflare Deployment

Target:

- Setup Wrangler.
- Deploy ke Cloudflare Workers.
- Setup custom domain.
- Setup GitHub Actions deploy.
- Test production endpoint.

Deliverable:

```txt
API production online.
```

### Phase 5 — Documentation

Target:

- Setup VitePress.
- Buat Getting Started.
- Buat API Reference.
- Buat Data Sources.
- Buat Contributing Data.
- Buat Limitations.
- Deploy docs.

Deliverable:

```txt
Dokumentasi publik tersedia.
```

### Phase 6 — Public Launch

Target:

- Rapikan README.
- Tambahkan badge.
- Tambahkan contoh usage.
- Buat release `v0.1.0`.
- Publish announcement.
- Buka issue untuk data tahun lain.

Deliverable:

```txt
Project siap diumumkan sebagai open-source.
```

## 22. Future Enhancements

Fitur setelah MVP:

- Export `.ics`.
- Endpoint calendar per bulan.
- Dataset regional holiday.
- NPM package resmi.
- OpenAPI spec.
- SDK JavaScript.
- GitHub Action untuk update dataset tahunan.
- API usage analytics.
- Cloudflare KV/R2 jika dataset membesar.
- Admin UI internal.
- Support timezone eksplisit.
- Support custom weekend configuration.
- Support holiday groups per sector.
- Support observance days.
- Support work arrangement/advisory data.

## 23. Acceptance Criteria MVP

MVP dianggap selesai jika:

- Repo public tersedia di `sangkan-dev/titimangsa`.
- Dataset minimal 2025 dan 2026 tersedia.
- Dataset memiliki source resmi.
- Validasi data berjalan di CI.
- Generated JSON tersedia.
- Core workday logic memiliki unit test.
- API `/v1/holidays` berjalan.
- API `/v1/holidays/check` berjalan.
- API `/v1/workdays/check` berjalan.
- API `/v1/workdays/add` berjalan.
- API `/v1/workdays/diff` berjalan.
- API `/v1/sources` berjalan.
- API deploy di Cloudflare Workers.
- Docs VitePress tersedia.
- README menjelaskan status unofficial.
- Disclaimer tersedia.
- Tidak ada klaim sebagai API resmi pemerintah.

## 24. Risks

### 24.1 Data Bisa Berubah

Risiko:

- Pemerintah dapat merevisi cuti bersama atau kebijakan tertentu.

Mitigasi:

- Gunakan revision field.
- Simpan source metadata.
- Archive revision lama.
- Dokumentasikan changelog.

### 24.2 Salah Tafsir Cuti Bersama

Risiko:

- Cuti bersama bisa diterapkan berbeda antara ASN, swasta, dan sektor tertentu.

Mitigasi:

- Bedakan `national_holiday` dan `collective_leave`.
- Sediakan opsi `includeCollectiveLeave`.
- Tambahkan disclaimer.

### 24.3 Dianggap API Resmi

Risiko:

- Pengguna mengira Titimangsa adalah API pemerintah.

Mitigasi:

- Disclaimer di README, docs, dan response metadata jika perlu.
- Gunakan phrasing "curated from official public sources", bukan "official API".

### 24.4 Ketergantungan ke Free Tier

Risiko:

- Batas request Cloudflare Workers Free bisa tercapai jika API populer.

Mitigasi:

- Cache header.
- Encouraging client-side caching.
- Static JSON mirror.
- Upgrade plan jika diperlukan.
- Sediakan self-hosting guide.

## 25. Success Metrics

### 25.1 Technical Metrics

- API p95 latency rendah.
- Error rate rendah.
- CI validation stabil.
- Dataset yearly update mudah.
- Test coverage core logic memadai.

### 25.2 Open-source Metrics

- Repo punya README jelas.
- Issue/PR contribution aktif.
- Dataset bertambah lintas tahun.
- Dipakai di project internal/komunitas.
- Star/fork bukan metric utama, tapi bisa jadi sinyal adoption.

### 25.3 Product Metrics

- Developer bisa integrasi dalam kurang dari 10 menit.
- Data source mudah diverifikasi.
- Business-day calculation mengurangi logic custom di aplikasi pengguna.

## 26. Initial Implementation Checklist

```txt
[ ] Create repository sangkan-dev/titimangsa
[ ] Setup pnpm workspace
[ ] Setup apps/api with Hono
[ ] Setup apps/docs with VitePress
[ ] Setup packages/core
[ ] Create data/sources/2026.yaml
[ ] Create data/sources/2025.yaml
[ ] Create schema for dataset
[ ] Create validation script
[ ] Create generation script
[ ] Implement core date utilities
[ ] Implement holiday service
[ ] Implement workday service
[ ] Implement Hono routes
[ ] Add CORS
[ ] Add cache headers
[ ] Add error response helper
[ ] Add unit tests
[ ] Add GitHub Actions validate-data
[ ] Add Cloudflare Wrangler config
[ ] Deploy API
[ ] Deploy docs
[ ] Add README
[ ] Add CONTRIBUTING
[ ] Add disclaimer
[ ] Create first release v0.1.0
```

## 27. References

Primary references to start from:

- Kemenko PMK — Pemerintah Tetapkan 17 Hari Libur Nasional dan 8 Cuti Bersama Tahun 2026  
  https://www.kemenkopmk.go.id/pemerintah-tetapkan-17-hari-libur-nasional-dan-8-cuti-bersama-tahun-2026

- Setneg — Inilah SKB 3 Menteri Libur Nasional dan Cuti Bersama 2026  
  https://www.setneg.go.id/baca/index/inilah_skb_3_menteri_libur_nasional_dan_cuti_bersama_2026

- Cloudflare Workers Limits  
  https://developers.cloudflare.com/workers/platform/limits/

- Cloudflare Workers + Hono Guide  
  https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/hono/

- Hono Cloudflare Workers Getting Started  
  https://hono.dev/docs/getting-started/cloudflare-workers

## 28. Final Recommendation

Eksekusi awal yang paling aman:

```txt
Dataset first, API second, docs third.
```

Urutan kerja:

```txt
1. Lock schema dataset
2. Input data 2026
3. Validate + generate JSON
4. Implement core workday logic
5. Expose via Hono API
6. Deploy Cloudflare Workers
7. Publish docs VitePress
```

Dengan pendekatan ini, Titimangsa tidak hanya menjadi "API tanggal merah", tetapi menjadi fondasi open-source yang lebih serius untuk kebutuhan hari libur dan hari kerja Indonesia.
