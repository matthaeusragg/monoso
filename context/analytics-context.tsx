import { createContext, useContext, useEffect, useState } from "react";
import { useSettings } from "./settings-context";
import { useTransactions } from "./transaction-context";


type AnalyticsContextType = {
  periods: Date[];
  periodsIndex: number;
  setPeriodsIndex: React.Dispatch<React.SetStateAction<number>>
};

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export function AnalyticsProvider({ children } : {children : React.ReactNode}) {
  const { settings } = useSettings();
  const [periods, setPeriods] = useState<Date[]>([]);
  const [periodsIndex, setPeriodsIndex] = useState<number>(0);
  const { transactions } = useTransactions();

  type UnitOptions = "day" | "month" | "year";
  /**
   * Helper for getPeriods: generates a sorted array of Dates to mark the period starts
   * @param earliest Format: Date().getTime()
   * @param latest Format: Date().getTime()
   * @param breakpoint Format: Date()
   * @param amount The number of days, months or years
   * @param unit Which unit (day, month or year) amount refers to
   * @returns 
   */
  const generatePeriodsArray = (earliest : number, latest: number, breakpoint: Date, amount: number, unit: UnitOptions) => {
    const array : Set<Date> = new Set();
    
    array.add(breakpoint);
    
    // this is needed for the month to ensure that "February 31st" doesn't overflow into March
    const startingDay = breakpoint.getDate();

    for(const direction of [-1,1]) {
      let current = new Date(breakpoint);
      while ((direction < 0 
        ? (current.getTime() > earliest) 
        : (current.getTime() <= latest))) {
        switch(unit) {
          case "day":
            current.setDate(current.getDate() + direction*amount);
            break;
          case "month":
            current.setMonth(current.getMonth() + direction*amount, 1);
            const lastDayOfMonth = new Date(current.getFullYear(),current.getMonth()+1,0).getDate();
            current.setDate(Math.min(startingDay, lastDayOfMonth));
            break;
          case "year":
            current.setFullYear(current.getFullYear() + direction*amount);
            break;
        }
        array.add(new Date(current));
      }
    }
    
    return Array.from(array)
      .sort((a, b) => a.getTime() - b.getTime())
      .filter((_,index,arr) => (
        (arr[index+1] === undefined || arr[index+1].getTime() > earliest) 
        && (arr[index-1] === undefined || arr[index-1].getTime() <= latest)
      ));
  }

  /**
   * returns a sorted array of dates marking the period starts
   * @returns 
   */
  const recomputePeriods = () => {
    let unit : UnitOptions = "day";
    let amount = 1;
    switch(settings.periodLength) {
      case "daily":
        unit = "day";
        amount = 1;
        break;
      case "weekly":
        unit = "day";
        amount = 7;
        break;
      case "bi-weekly":
        unit = "day";
        amount = 14;
        break;
      case "monthly":
        unit = "month";
        amount = 1;
        break;
      case "quarter-yearly":
        unit = "month";
        amount = 3;
        break;
      case "half-yearly":
        unit = "month";
        amount = 6;
        break;
      case "yearly":
        unit = "year";
        amount = 1;
        break;
    }

    // all timestamps 
    // Note: including timestamps from spread transactions means that the earliest or latest period could have no transactions to show
    const regulartx_times = transactions.map(tx => new Date(tx.timestamp).getTime());
    // all truthy timestamps in tx.spread_period_start and tx.spread_period_end for spread transactions
    const spreadtx_times = transactions
      .filter(tx => tx.handling_type === "spread")
      .flatMap(tx => [tx.spread_period_start,tx.spread_period_end].flatMap(period_timestamp => period_timestamp ? [new Date(period_timestamp).getTime()] : []));
    const times = [...regulartx_times, ...spreadtx_times];
    const earliest = Math.min(...times);
    const latest = Math.max(...times);
    const breakpoint = new Date(settings.startDate);

    const periodsArray = generatePeriodsArray(earliest, latest, breakpoint, amount, unit);
    setPeriods(periodsArray);
    setPeriodsIndex(periodsArray.length-1);
}

  // this effect updates periods every time transactions or settings update
  useEffect(() => {
    recomputePeriods();
  }, [transactions, settings]);

  return (
    <AnalyticsContext.Provider value={{ periods, periodsIndex, setPeriodsIndex }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error("useSettings must be inside <SettingsProvider>");
  return ctx;
}