// csvParsing.ts
// Main high-level CSV parsing + transaction extraction

import { endingRegexPattern, FIELD_KEYWORDS, FIELD_KEYWORDS_KEYS } from "@/constants/csvImport/csvSemanticFieldKeywords";
import { REGEX_PATTERNS, REGEX_PATTERNS_KEYS } from "@/constants/csvImport/regexRules";
import { Transaction } from "@/types/models";

let id_counter = 0;

export function smartSplit(line: string): string[] {
  // Respect semicolons inside quotes
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === "\"") insideQuotes = !insideQuotes;
    else if (char === ";" && !insideQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length) result.push(current.trim());
  return result;
}

type Patterns = {
  [key in keyof Transaction]?: string;
}


export function regexSearch(columns : string[]) : Patterns {
  const patterns : Patterns = {};
  for(const key of REGEX_PATTERNS_KEYS) {
    patterns[key] = regexSearchForField(key, columns);
  }
  return patterns;
}

/**
 * Searches the columns for the pattern specified by "field" in the REGEX_PATTERNS json.
 * If found, return the match and modify the columns accordingly
 * @param field key of REGEX_PATTERNS to search
 * @param columns 
 * @returns 
 */
export function regexSearchForField(field : keyof typeof REGEX_PATTERNS, columns : string[]) {
  const regex_pattern = REGEX_PATTERNS[field];
  let result = regexSearchHelper(regex_pattern.regex, regex_pattern.parser, columns);
  if(!result && 'fallback_regex' in regex_pattern) { // fallback
    result = regexSearchHelper(regex_pattern.fallback_regex, regex_pattern.parser, columns);
  }
  return result;
}

/**
 * the for loop that appears in regexSearchForField twice
 * @param regex 
 * @param parser 
 * @param columns 
 * @returns 
 */
function regexSearchHelper(regex : RegExp, parser : (input : RegExpMatchArray) => string, columns : string[]) : string {
  let result = "";
  for(let i=0;i<columns.length;i++) {
    const match = columns[i].match(regex);
    if(match) {
      result = parser(match);
      const newCols = columns[i].split(match[0]).map((c : string) => c.trim()).filter((c : string) => c !== "");
      columns.splice(i,1, ...newCols);
      break;
    }
  }
  return result;
}

/**
 * loops over all keys of FIELD_KEYWORDS and calls keywordSearchForField (which modifies columns)
 * @param columns 
 * @returns 
 */
export function keywordSearch(columns : string[]) : Patterns {
  const patterns : Patterns = {};
  for(const key of FIELD_KEYWORDS_KEYS) {
    patterns[key] = keywordSearchForField(key, columns);
  }
  return patterns;
}

/**
 * searches the columns for expressions of the form 'keyword value'
 * If found, return the pattern and modify columns (splitting the relevant column in two if necessary)
 * If not found, returns "" and columns remains unmodified
 * @param field 
 * @param columns 
 * @returns 
 */
export function keywordSearchForField(field : keyof typeof FIELD_KEYWORDS, columns : string[]) : string {
  let pattern = "";

  let isFound = false;
  for (const keyword of FIELD_KEYWORDS[field]) {
    const regex = new RegExp(`${keyword} (.+?)(?=(${endingRegexPattern}))`,"i");
    for(let i=0; i < columns.length;i++) {
      const match = columns[i].match(regex);
      if(match) {
        pattern = match[1].trim();
        const newCols = columns[i].split(match[0]).map((c : string) => c.trim()).filter((c : string) => c !== "");
        columns.splice(i,1, ...newCols);
        isFound = true;
        break;
      }
    }
    if(isFound) break;
  }
  return pattern;
}

export function parseTransactionRow(row: string): Transaction | null {
  const columns = smartSplit(row); // tbh I don't need smartSplit here, but it doesn't hurt
  if (columns.length === 0) return null;

  const patterns : Patterns = regexSearch(columns);
  // merge regexSearch and keywordSearch ensuring undefined values don't overwrite
  Object.entries(keywordSearch(columns)).forEach(([key, value]) => {
    if (value !== undefined) {
      patterns[key as keyof Patterns] = value;
    }
  });

  // put everything remaining in further_information
  patterns.further_information = columns.join(";");

  // defaults to import date and amount=0 if missing
  const res : Transaction = {
      id: Date.now().toString() + "." + id_counter++,
      name: patterns.payment_reference || patterns.beneficiary || patterns.further_information || "Unknown",
      amount:"0",
      timestamp: new Date().toISOString(),
      handling_type: "regular", // regular or spread
  }
  // merge default Transaction above and patterns ensuring undefined values don't overwrite
  Object.entries(patterns).forEach(([key, value]) => { 
    if (value !== undefined) {
      res[key as keyof Transaction] = value;
    }
  })

  return res;
}

export function parseCsv(text: string): Transaction[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  return lines
    .map((line) => parseTransactionRow(line))
    .filter((x): x is Transaction => x !== null);
}
