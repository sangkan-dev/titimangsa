# Limitations

## Unofficial Status

Titimangsa is not an official government API. The dataset is curated from
publicly available official government documents. Always refer to the original
documents for legal or administrative certainty.

Titimangsa bukan API resmi pemerintah. Dataset dikurasi dari dokumen resmi
pemerintah yang tersedia untuk publik. Untuk kepastian hukum atau administratif,
selalu rujuk dokumen sumber asli.

## MVP Scope

The MVP does not cover:

- Regional holiday per province or city.
- Full Javanese calendar support.
- Full Hijri calendar support.
- Google Calendar integration.
- `.ics` export.
- Admin dashboard.
- API keys.
- User-specific rate limits.
- Runtime database.
- Authentication.
- Multi-country holiday data.

## Collective Leave Behavior

`includeCollectiveLeave` defaults to `true`.

When it is `true`, collective leave is treated as a holiday and non-workday.
When it is `false`, collective leave is ignored by holiday and workday checks.

## Weekend Behavior

The default weekend is `sat,sun`. Custom weekend values can be supplied as a
comma-separated string such as `fri,sat`.

## Cloudflare Workers Free Tier

The public API is deployed on Cloudflare Workers. Cloudflare Workers Free is not
unlimited, and platform limits can change. Treat the hosted API as a convenient
public endpoint, not a guaranteed unlimited service.
