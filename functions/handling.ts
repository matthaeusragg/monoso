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