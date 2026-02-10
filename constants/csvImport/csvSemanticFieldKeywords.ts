// Keyword lists used to extract semantic fields from csv lines
// the keys of the FIELD_KEYWORDS object MUST be a subset of the keys 

import { ensureUsingOnlyTransactionKeywords } from "./regexRules";

// NOTE:
// keywords are not case-sensitive
// order matters, only the first keyword is used
export const FIELD_KEYWORDS = ensureUsingOnlyTransactionKeywords({
    beneficiary: [
        "payment recipient:",
        "original recipient:",
        "recipient:",
        "recipient iban:",
        "zahlungsempfänger:",
        "empfänger:",
        "payment recipient iban:",
        "recipient id:",
        "client:",
        "client iban:"
    ],
    payment_reference: [
        "purpose of use:",
        "payment reference:",
        "verwendungszweck:"
    ],
} as const); // according to Gemini, 'as const' is necessary for 'keyof typeof FIELD_KEYWORDS' to work, but I am not sure exactly why

// keywords marking the ending of a value that are not included above
const OTHER_ENDING_WORDS = [
    "payment recipient bic:",
    "recipient bic:",
    "client bic:",
    "mandate:",
    "card sequence no:",
    "client reference:"
];
// returns "recipient|empfänger|..."
export const endingRegexPattern =  OTHER_ENDING_WORDS.join("|") + "|" + Object.values(FIELD_KEYWORDS).flat().join("|");

// returns an iterable list of keys of the above json
export const FIELD_KEYWORDS_KEYS = Object.keys(FIELD_KEYWORDS) as (keyof typeof FIELD_KEYWORDS)[];
