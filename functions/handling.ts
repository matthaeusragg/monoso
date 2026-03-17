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