import { createHash } from "node:crypto";
import { load } from "cheerio";

export type DraftHolidayCandidate = {
  date: string;
  localName: string;
  type: "collective_leave" | "unknown";
  confidence: number;
  rawText: string;
};

const months: Record<string, number> = {
  januari: 1,
  februari: 2,
  maret: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  agustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  desember: 12,
};

const datePattern =
  /\b(\d{1,2})\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+(\d{4})\b/giu;

export function extractHtmlMetadata(html: string): {
  title: string;
  text: string;
  sha256: string;
} {
  const document = load(html);

  document("script, style, noscript, svg").remove();

  return {
    title: normalizeWhitespace(document("title").first().text()),
    text: normalizeWhitespace(document("body").text()),
    sha256: createHash("sha256").update(html).digest("hex"),
  };
}

export function extractHolidayCandidates(
  text: string,
  expectedYear: number,
): DraftHolidayCandidate[] {
  const candidates: DraftHolidayCandidate[] = [];
  const seen = new Set<string>();

  for (const match of text.matchAll(datePattern)) {
    const day = Number(match[1]);
    const month = months[match[2]!.toLowerCase()]!;
    const year = Number(match[3]);

    if (year !== expectedYear || !isValidDate(year, month, day)) {
      continue;
    }

    const date = [
      year,
      String(month).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");
    const rawText = sentenceAroundMatch(text, match.index, match[0].length);
    const collectiveLeave = /cuti bersama/iu.test(rawText);
    const key = `${date}|${collectiveLeave ? "collective_leave" : "unknown"}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    candidates.push({
      date,
      localName: candidateLabel(rawText, match[0]),
      type: collectiveLeave ? "collective_leave" : "unknown",
      confidence: collectiveLeave ? 0.65 : 0.4,
      rawText,
    });
  }

  return candidates.sort((left, right) => left.date.localeCompare(right.date));
}

function candidateLabel(rawText: string, dateText: string): string {
  const afterDate = rawText.split(dateText, 2)[1]?.trim();

  return (afterDate || rawText).slice(0, 160);
}

function sentenceAroundMatch(
  text: string,
  matchIndex: number,
  matchLength: number,
): string {
  const previousBoundary = Math.max(
    text.lastIndexOf(".", matchIndex - 1),
    text.lastIndexOf(";", matchIndex - 1),
  );
  const nextPeriod = text.indexOf(".", matchIndex + matchLength);
  const nextSemicolon = text.indexOf(";", matchIndex + matchLength);
  const nextBoundaries = [nextPeriod, nextSemicolon].filter(
    (value) => value >= 0,
  );
  const nextBoundary =
    nextBoundaries.length > 0 ? Math.min(...nextBoundaries) : text.length;
  const start = Math.max(previousBoundary + 1, matchIndex - 120);
  const end = Math.min(nextBoundary + 1, matchIndex + matchLength + 220);

  return text.slice(start, end).trim();
}

function isValidDate(year: number, month: number, day: number): boolean {
  const value = new Date(Date.UTC(year, month - 1, day));

  return (
    value.getUTCFullYear() === year &&
    value.getUTCMonth() === month - 1 &&
    value.getUTCDate() === day
  );
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}
