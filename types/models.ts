export interface Transaction {
  id: string;
  name: string;
  amount: string;
  timestamp: string;

  category_id?: string;
  currency?: string;
  beneficiary?: string;
  payment_reference?: string;
  further_information?: string;

  handling_type: string; // "regular" or "spread"
  spread_period_start?: string;
  spread_period_end?: string;
}

export interface SelectableTransaction {
  selected : boolean;
  transaction : Transaction;
}

export interface AnalyticsCategory {
  id: string;
  name: string;
  value: number;
  color: string;
  label?: string;
}

export interface AnalyticsPeriod {
  label: string;
  startTime: Date | null;
  endTime: Date | null;
  amount: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  keywords: {id: string, word: string}[];
}

export interface Keyword {
    id: string;
    word: string;
}

export const periodLengths = [
  "daily", 
  "weekly", 
  "bi-weekly", 
  "monthly", 
  "quarter-yearly", 
  "half-yearly", 
  "yearly"
] as const;

type PeriodLengthType = (typeof periodLengths)[number];

export interface Settings {
  startDate: string;
  periodLength: PeriodLengthType;
  analyseIncomeInstead: boolean;
  spreadIrregularTransactions: boolean;
  defaultCurrency: string;
}