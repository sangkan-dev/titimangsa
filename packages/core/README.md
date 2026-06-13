# @sangkan-dev/titimangsa

Indonesia holiday data and business day utilities curated from official public
sources.

> Titimangsa is not an official government API. The dataset is curated from
> publicly available official government documents. Always refer to the original
> documents for legal or administrative certainty.

## Install

```sh
pnpm add @sangkan-dev/titimangsa
```

## Usage

```ts
import {
  addWorkdays,
  checkWorkday,
  getHolidays,
} from "@sangkan-dev/titimangsa";

const holidays = getHolidays(2026, { type: "national_holiday" });
const workday = checkWorkday("2026-03-20");
const dueDate = addWorkdays("2026-03-18", 5);
```

Collective leave is included by default. Pass
`{ includeCollectiveLeave: false }` to exclude it from holiday and workday
calculations.

Available datasets and behavior are documented at
[docs.titimangsa.sangkan.dev](https://docs.titimangsa.sangkan.dev/).
