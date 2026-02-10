// Centralized regex patterns for structured field detection

// const currency_regex = "(\\$|€|£|¥|₹|₽|₩|₺|¢|₡|₱|₲|₴|₸|₪|฿|₫)|([A-Z]{3})";
// const amount_number_regex = "([+-]?\\s*\\d{1,3}(?:[\\.,\\s]?\\d{3})*[\\.,\\s]\\d{2})";

// the keys of the regexPatterns object MUST be a subset of the keys 

import { Transaction } from "@/types/models";

type TransactionKeywordsConstraint = {
    [key in keyof Transaction]?: any;
}

// been just playing with type safety here, ensuring that each key of the FIELD_KEYWORDS object is also a key of Transactions (which I need to ensure it is also a key of Patterns in csvParsing.ts)
export const ensureUsingOnlyTransactionKeywords = <T extends TransactionKeywordsConstraint>(obj: T) => obj;

export const REGEX_PATTERNS = {
    currency: {
        regex: /^(?:(?:\$|€|£|¥|₹|₽|₩|₺|¢|₡|₱|₲|₴|₸|₪|฿|₫)|(?:[A-Z]{3}))$/,
        parser: (currency : RegExpMatchArray) : string => currency[0],
    },
    amount: {
        regex: /^[+-]?\s*\d{1,3}(?:[\.,\s]?\d{3})*[\.,]\d{2}$/,
        parser: parseAmount,
    },
    timestamp: {
        regex: /^(\d{2})[\.\/](\d{2})[\.\/](\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2})(?::(\d{3}))?)?)$/,
        fallback_regex: /^(\d{2})[\.\/](\d{2})[\.\/](\d{4})$/,
        parser: parseTimestamp,
    },
} as const;
export const REGEX_PATTERNS_KEYS = Object.keys(REGEX_PATTERNS) as (keyof typeof REGEX_PATTERNS)[];

/**
 * parses the match from the timestamp regex
 * @param datetime the match object
 */
export function parseTimestamp(datetime : RegExpMatchArray) : string {
    const [
        , // Full match at index 0 is ignored
        dayStr,
        monthStr,
        yearStr,
        hourStr = '00', // Default to 00 if time is absent
        minuteStr = '00',
        secondStr = '00',
        millisecondStr = '000'
    ] = datetime;

    // Convert strings to numbers
    const year = parseInt(yearStr, 10);
    // Month is 1-indexed in the string, but 0-indexed in JavaScript's Date object
    const month = parseInt(monthStr, 10) - 1; 
    const day = parseInt(dayStr, 10);
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const second = parseInt(secondStr, 10);
    const millisecond = parseInt(millisecondStr.padEnd(3, '0'), 10); // Handle 'mmm' being optional in the last group

    // 1. Create a Date object using the local time zone.
    // The Date constructor uses the local time zone when provided year, month, day, etc.
    const date = new Date(year, month, day, hour, minute, second, millisecond);

    return date.toISOString();
}

/**
 * convert German or British format numbers (with thousand separators) into a string that can be parsed to a number
 * @param amount 
 * @returns 
 */
export function parseAmount(amount : RegExpMatchArray) : string {
    let res = amount[0];
    const lastComma = res.lastIndexOf(',');
    const lastDot = res.lastIndexOf('.');
    if (lastComma > lastDot) {
      // German format: comma is decimal separator
      res = res.replace(/\./g, '').replace(',', '.');
    } else {
      // British format: dot is decimal separator
      res = res.replace(/,/g, '');
    }
    return res.replace(' ','');
};