// computeSpreadProportion.test.ts
import { baseSpreadTransaction } from "@/__mocks__/transactions";
import { computeSpreadProportion } from "@/functions/analytics";

describe("computeSpreadProportion", () => {
  test("returns full proportion (1) when no starttime or endtime is given", () => {
    const result = computeSpreadProportion(baseSpreadTransaction);
    expect(result).toBe(1);
  });

  test("computes correct proportion for interval fully inside spread", () => {
    const start = new Date("2024-01-03T00:00:00.000Z").getTime();
    const end = new Date("2024-01-08T00:00:00.000Z").getTime(); // 5 days

    const result = computeSpreadProportion(baseSpreadTransaction, start, end);

    expect(result).toBeCloseTo(5 / 10);
  });

  test("clips interval to spread boundaries", () => {
    const start = new Date("2023-12-25T00:00:00.000Z").getTime();
    const end = new Date("2024-01-06T00:00:00.000Z").getTime(); // overlaps first 5 days

    const result = computeSpreadProportion(baseSpreadTransaction, start, end);

    expect(result).toBeCloseTo(5 / 10);
  });

  test("returns negative proportion if period endtime < starttime after clipping", () => {
    const start = new Date("2024-01-09T00:00:00.000Z").getTime();
    const end = new Date("2024-01-05T00:00:00.000Z").getTime();

    const result = computeSpreadProportion(baseSpreadTransaction, start, end);

    expect(result).toBeLessThan(0);
  });

  test("returns undefined if spread_period_start is missing", () => {
    const tx = {
      ...baseSpreadTransaction,
      spread_period_start: undefined,
    };

    const result = computeSpreadProportion(tx);

    expect(result).toBeUndefined();
  });

  test("returns undefined if spread_period_end is missing", () => {
    const tx = {
      ...baseSpreadTransaction,
      spread_period_end: undefined,
    };

    const result = computeSpreadProportion(tx);

    expect(result).toBeUndefined();
  });

  test("returns undefined if spread_period_end < spread_period_start", () => {
    const tx = {
      ...baseSpreadTransaction,
      spread_period_end: "2000-01-05T00:00:00.000Z",
    };

    const result = computeSpreadProportion(tx);

    expect(result).toBeUndefined();
  });

  test("returns undefined for invalid date strings", () => {
    const tx = {
      ...baseSpreadTransaction,
      spread_period_start: "not-a-date",
      spread_period_end: "also-not-a-date",
    };

    const result = computeSpreadProportion(tx);

    expect(result).toBeUndefined();
  });
  test("returns zero if intervals do not overlap", () => {
    const start = new Date("2023-01-25T00:00:00.000Z").getTime();
    const end = new Date("2023-12-26T00:00:00.000Z").getTime(); // does not overlap

    const result = computeSpreadProportion(baseSpreadTransaction, start, end);

    expect(result).toEqual(0);
  });

  test("returns 1 if spread_period_end === spread_period_start and within [starttime, endtime)", () => {
    const tx = {
      ...baseSpreadTransaction,
      spread_period_end: baseSpreadTransaction.spread_period_start,
    };

    const result = computeSpreadProportion(tx);

    expect(result).toEqual(1);
  });

  test("returns 0 if spread_period_end === spread_period_start and outside of [starttime, endtime)", () => {
    const tx = {
      ...baseSpreadTransaction,
      spread_period_end: baseSpreadTransaction.spread_period_start,
    };

    const result = computeSpreadProportion(tx, new Date("2026-01-05T00:00:00.000Z").getTime());

    expect(result).toEqual(0);
  });
});