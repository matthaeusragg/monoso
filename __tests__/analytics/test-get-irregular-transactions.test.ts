// getIrregularTransactions.test.ts
import { irregularsTransactions } from "@/__mocks__/transactions";
import { getIrregularTransactions } from "@/functions/analytics";

describe("getIrregularTransactions", () => {
  const jan1 = new Date("2024-01-01T00:00:00.000Z").getTime();
  const jan15 = new Date("2024-01-15T00:00:00.000Z").getTime();

  test("returns only spread transactions", () => {
    const result = getIrregularTransactions({
      transactions: irregularsTransactions,
    });

    expect(result).toHaveLength(4);
    result.forEach(r =>
      expect(r.transaction.handling_type).toBe("spread")
    );
  });

  test("filters by time range", () => {
    const result = getIrregularTransactions({
      transactions: irregularsTransactions,
      starttime: jan1,
      endtime: jan15,
    });

    expect(result.every(r => {
      const ts = new Date(r.transaction.timestamp).getTime();
      return ts >= jan1 && ts < jan15;
    })).toBe(true);
  });

  test("filters expenses only", () => {
    const result = getIrregularTransactions({
      transactions: irregularsTransactions,
      type: "expenses",
    });

    expect(result.every(r => r.this_period_amount < 0)).toBe(true);
  });

  test("filters income only", () => {
    const result = getIrregularTransactions({
      transactions: irregularsTransactions,
      type: "income",
    });

    expect(result).toHaveLength(1);
    expect(result[0].transaction.name).toBe("Bonus");
  });

  test("filters by category", () => {
    const result = getIrregularTransactions({
      transactions: irregularsTransactions,
      categoryId: "insurance",
    });

    expect(result).toHaveLength(1);
    expect(result[0].transaction.name).toBe("Insurance");
  });

  test("includes only uncategorized when categoryId is 'uncategorized'", () => {
    const result = getIrregularTransactions({
      transactions: irregularsTransactions,
      categoryId: "uncategorized",
      categoryIdList: ["food", "insurance", "health", "salary"],
    });

    expect(result).toHaveLength(1);
    expect(result[0].transaction.category_id).toBeUndefined();
  });

  test("computes spread-adjusted amount", () => {
    const result = getIrregularTransactions({
      transactions: irregularsTransactions,
      starttime: jan1,
      endtime: jan15,
      categoryId: "insurance",
    });

    const entry = result[0];

    // Insurance: Jan 1 → Feb 1 (31 days)
    // Period: Jan 1 → Jan 15 (14 days)
    const expectedProportion = 14 / 31;

    expect(entry.this_period_amount).toBeCloseTo(-120 * expectedProportion);
  });

  test("sorts results by transaction timestamp", () => {
    const result = getIrregularTransactions({
      transactions: irregularsTransactions,
    });

    const timestamps = result.map(r =>
      new Date(r.transaction.timestamp).getTime()
    );

    expect(timestamps).toEqual([...timestamps].sort((a, b) => a - b));
  });
});
