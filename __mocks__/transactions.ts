import { Transaction } from "@/types/models";

export const baseSpreadTransaction: Transaction = {
  id: "tx-1",
  name: "computeSpreadProportion",
  amount: "100",
  timestamp: new Date("2024-01-01").toISOString(),
  handling_type: "spread",
  spread_period_start: "2024-01-01T00:00:00.000Z",
  spread_period_end: "2024-01-11T00:00:00.000Z", // 10 days
};

export const categoryValueTransactions: Transaction[] = [
  // food expense
  {
    id: "1",
    name: "Groceries",
    amount: "-50",
    timestamp: "2024-01-05T00:00:00.000Z",
    category_id: "food",
    handling_type: "regular",
  },
  // salary income
  {
    id: "2",
    name: "Salary",
    amount: "2000",
    timestamp: "2024-01-03T00:00:00.000Z",
    category_id: "salary",
    handling_type: "regular",
  },
  // uncategorized expense
  {
    id: "3",
    name: "Cash",
    amount: "-20",
    timestamp: "2024-01-04T00:00:00.000Z",
    handling_type: "regular",
  },
  // spread expense
  {
    id: "4",
    name: "Insurance",
    amount: "-120",
    timestamp: "2024-01-01T00:00:00.000Z",
    category_id: "insurance",
    handling_type: "spread",
    spread_period_start: "2024-01-06T00:00:00.000Z",
    spread_period_end: "2024-01-31T00:00:00.000Z",
  },
];


export const irregularsTransactions: Transaction[] = [
  // txRegularExpense
  {
    id: "1",
    name: "Groceries",
    amount: "-50",
    timestamp: "2024-01-05T00:00:00.000Z",
    category_id: "food",
    handling_type: "regular",
  },
  // txSpreadExpenseLate
  {
    id: "3",
    name: "Gym",
    amount: "-60",
    timestamp: "2024-01-10T00:00:00.000Z",
    category_id: "health",
    handling_type: "spread",
    spread_period_start: "2024-01-01T00:00:00.000Z",
    spread_period_end: "2024-01-31T00:00:00.000Z",
  },
  // txSpreadIncome
  {
    id: "4",
    name: "Bonus",
    amount: "300",
    timestamp: "2024-01-07T00:00:00.000Z",
    category_id: "salary",
    handling_type: "spread",
    spread_period_start: "2024-01-01T00:00:00.000Z",
    spread_period_end: "2024-02-01T00:00:00.000Z",
  },
  // txSpreadUncategorized
  {
    id: "5",
    name: "Misc",
    amount: "-40",
    timestamp: "2024-01-06T00:00:00.000Z",
    handling_type: "spread",
    spread_period_start: "2024-01-01T00:00:00.000Z",
    spread_period_end: "2024-01-21T00:00:00.000Z",
  },
  // txSpreadExpenseEarly
  {
    id: "2",
    name: "Insurance",
    amount: "-120",
    timestamp: "2024-01-02T00:00:00.000Z",
    category_id: "insurance",
    handling_type: "spread",
    spread_period_start: "2024-01-01T00:00:00.000Z",
    spread_period_end: "2024-02-01T00:00:00.000Z",
  },
];


const trickySpreadTransactions : Transaction[] = [
  {
    id: "2",
    name: "Test",
    amount: "-100",
    timestamp: "2026-01-02T00:00:00.000Z",
    category_id: undefined,
    handling_type: "spread",
    spread_period_start: "2025-07-01T00:00:00.000Z",
    spread_period_end: "2025-08-01T00:00:00.000Z",
  }
]
