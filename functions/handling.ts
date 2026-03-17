import { Transaction } from "@/types/models";

/**
 * The following supports primitives, json objects, arrays of such and maybe more.
 * Note: Array order matters, json key order does not. 
 * @param a object to compare
 * @param b object to compare
 * @returns true if a and be are equal, false otherwise
 */
export const isDeepEqual = (a: any, b: any): boolean => {
  // 1. Check for strict equality (primitives & same reference)
  if (a === b) return true;

  // 2. Check types and null (typeof null is 'object', so we handle it explicitly)
  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  ) {
    return false;
  }

  // 3. Ensure distinct types don't match (e.g. Array vs Object)
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  // 4. Compare key counts
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  // 5. Recursively check all keys
  // Note: an array is treated like a json with keys "0", "1", "2", etc
  for (const key of keysA) {
    // Check if key exists in 'b' AND if values are equal
    if (!Object.prototype.hasOwnProperty.call(b, key) || !isDeepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
};

/**
 * isDeepEqual but with special handling for transactions: We want to parse the amount and analysis_amount strings to numbers before comparing, so that for example "1.00" and "1" are considered equal
 * @param a 
 * @param b 
 * @returns 
 */
export const isDeepEqualTransaction = (a: Transaction | undefined, b: Transaction | undefined): boolean => {
  if (a === undefined && b === undefined) return true;
  if (a === undefined || b === undefined) return false;
  const aWithParsedAmounts = {...a, amount: parseFloat(a.amount), analysis_amount: a.analysis_amount != null ? parseFloat(a.analysis_amount) : undefined};
  const bWithParsedAmounts = {...b, amount: parseFloat(b.amount), analysis_amount: b.analysis_amount != null ? parseFloat(b.analysis_amount) : undefined};
  return isDeepEqual(aWithParsedAmounts, bWithParsedAmounts);
}

/**
 * 
 * @param transaction 
 * @returns Whether or not the input is valid and can be parsed to a transaction. If isValid===false, the parent onSubmit call should exit early. message gives more details
 */
export const validateTransaction = (transaction: Transaction): { isValid: boolean, message?: string } => {
  const amountRegexVerifier = /^-?\d+(\.\d+)?$|^-?\.\d+$/; // this regex matches valid number inputs (including those starting with a dot, like .5 or -.5)

  // if name is empty
  if (!transaction.name.trim()) {
    return { isValid: false, message: "Transaction name cannot be empty." };
  }

  // or amount is empty
  if (!transaction.amount.trim()) {
    return { isValid: false, message: "Amount cannot be empty." };
  }

  // if amount is not typed correctly
  if (!amountRegexVerifier.test(transaction.amount.trim())) {
    return { isValid: false, message: "Amount must be a valid number." };
  }

  // if timestamp is not a valid date 
  if (isNaN(new Date(transaction.timestamp).getTime())) {
    return { isValid: false, message: "Transaction date is invalid." };
  }

  // if handling type is spread but the spread period is invalid
  if (transaction.handling_type === "spread" && (
    isNaN(new Date(transaction.spread_period_start ?? "").getTime()) || 
    isNaN(new Date(transaction.spread_period_end ?? "").getTime()) || 
    new Date(transaction.spread_period_start ?? "") > new Date(transaction.spread_period_end ?? "")
  )) {
    return { isValid: false, message: "Spread period must have valid start and end dates, and start must be before end." };
  }

  // if analysis amount is set but invalid
  if (transaction.analysis_amount != null) {
    // if analysis amount is empty
    if (!transaction.analysis_amount.trim()) {
      return { isValid: false, message: "Analysis amount cannot be empty if provided." };
    }
    // if analysis amount is not typed correctly
    if (!amountRegexVerifier.test(transaction.analysis_amount.trim())) {
      return { isValid: false, message: "Analysis amount must be a valid number." };
    }
  }

  return { isValid: true };
};

/**
 * unifies num.toFixed(2) (for number of decimal places) and num.toLocaleString() for thousand separators
 */
export const numberToFixedLocaleString = (
  num : number, 
  fractionDigits : number = 2,
  locale : string = 'en-UK'
) : string => {
  'worklet'; // this ensures numberToFixedLocaleString is available on the UI thread, which is needed to call it within react-native-reanimated's useDerivedValue in my line-chart component
  return num.toLocaleString(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  })
}