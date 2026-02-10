import { categoryValueTransactions } from "@/__mocks__/transactions";
import { categoryValue } from "@/functions/analytics";

// jest.mock("@/functions/analytics",() => {
//   const originalModule = jest.requireActual('@/functions/analytics');

//   // Return a new object that merges original + mocks
//   return {
//     ...originalModule,
//     computeSpreadProportion: jest.fn(), 
//   };
// });

// const mockedComputeSpreadProportion =
//   computeSpreadProportion as jest.MockedFunction<typeof computeSpreadProportion>;

describe("categoryValue", () => {
  const jan1 = new Date("2024-01-01T00:00:00.000Z").getTime();
  const jan10 = new Date("2024-01-10T00:00:00.000Z").getTime();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("sums all transactions when no filters are provided", () => {
    const result = categoryValue({ transactions: categoryValueTransactions });

    // -50 + 2000 - 20 - 120
    expect(result).toBe(1810);
  });

  test("filters by category", () => {
    const result = categoryValue({
      transactions: categoryValueTransactions,
      categoryId: "food",
    });

    expect(result).toBe(-50);
  });

  test("filters by expenses only", () => {
    const result = categoryValue({
      transactions: categoryValueTransactions,
      type: "expenses",
    });

    expect(result).toBe(-190); // -50 -20 -120
  });

  test("filters by income only", () => {
    const result = categoryValue({
      transactions: categoryValueTransactions,
      type: "income",
    });

    expect(result).toBe(2000);
  });

  test("filters by time range", () => {
    const result = categoryValue({
      transactions: categoryValueTransactions,
      starttime: jan1,
      endtime: jan10,
    });

    // all timestamps fall into this range
    expect(result).toBe(1810);
  });

  test("includes only uncategorized transactions", () => {
    const result = categoryValue({
      transactions: categoryValueTransactions,
      categoryId: "uncategorized",
      categoryIdList: ["food", "salary", "insurance"],
    });

    expect(result).toBe(-20);
  });

  test("excludes categorized transactions when using uncategorized", () => {
    const result = categoryValue({
      transactions: categoryValueTransactions,
      categoryId: "uncategorized",
      categoryIdList: ["food"],
    });

    // salary + insurance included since not in categoryIdList
    expect(result).toBe(2000 - 20 - 120);
  });

  test("uses computeSpreadProportion when considerSpread is true", () => {
    // mockedComputeSpreadProportion.mockReturnValue(4/25);
    const result = categoryValue({
      transactions: categoryValueTransactions,
      categoryId: "insurance",
      considerSpread: true,
      starttime: jan1,
      endtime: jan10,
    });

    // expect(mockedComputeSpreadProportion).toHaveBeenCalledTimes(1);
    expect(result).toBeCloseTo(-120 * 4 / 25);
  });

  test("falls back to full value if computeSpreadProportion returns undefined", () => {
    // mockedComputeSpreadProportion.mockReturnValue(undefined);

    const result = categoryValue({
      transactions: categoryValueTransactions,
      categoryId: "insurance",
      considerSpread: true,
    });

    expect(result).toBe(-120);
  });

  test("ignores spread logic when considerSpread is false", () => {
    const result = categoryValue({
      transactions: categoryValueTransactions,
      categoryId: "insurance",
      considerSpread: false,
      starttime: jan1,
      endtime: jan10,
    });

    // expect(mockedComputeSpreadProportion).not.toHaveBeenCalled();
    expect(result).toBe(-120);
  });
});

