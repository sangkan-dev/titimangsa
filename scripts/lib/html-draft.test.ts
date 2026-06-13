import { describe, expect, it } from "vitest";
import { extractHolidayCandidates, extractHtmlMetadata } from "./html-draft.js";

describe("official HTML draft extraction", () => {
  it("extracts cautious candidates and classifies only explicit collective leave", () => {
    const html = `
      <html>
        <head><title>SKB Libur 2027</title></head>
        <body>
          <p>Hari libur ditetapkan pada 1 Januari 2027 Tahun Baru.</p>
          <p>Cuti bersama ditetapkan pada 2 Januari 2027.</p>
          <script>const ignored = "3 Januari 2027";</script>
        </body>
      </html>
    `;
    const metadata = extractHtmlMetadata(html);

    expect(metadata.title).toBe("SKB Libur 2027");
    expect(metadata.sha256).toMatch(/^[a-f0-9]{64}$/u);
    expect(extractHolidayCandidates(metadata.text, 2027)).toMatchObject([
      {
        date: "2027-01-01",
        type: "unknown",
        confidence: 0.4,
      },
      {
        date: "2027-01-02",
        type: "collective_leave",
        confidence: 0.65,
      },
    ]);
  });

  it("ignores invalid dates and dates outside the requested year", () => {
    expect(
      extractHolidayCandidates("31 Februari 2027 dan 1 Januari 2026", 2027),
    ).toEqual([]);
  });
});
