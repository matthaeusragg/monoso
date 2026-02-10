import { Transaction } from "@/types/models";

// worth putting this in a Transactions class? Or a class implementing the Transaction interface?
/**
 * returns true, if the amount and the timestamp align, because then the transactions are probably the same
 * @param a 
 * @param b 
 * @returns 
 */
const areSimilarTransactions = (a : Transaction, b : Transaction) : boolean => {
  return (parseFloat(a.amount) === parseFloat(b.amount)) && (new Date(a.timestamp).getTime() === new Date(b.timestamp).getTime());
}


/**
 * returns true, if transaction is similar to any tx in transactions
 * @param transaction 
 * @param transactions 
 * @returns 
 */
export const isExistingTransaction = (transaction : Transaction, transactions : Transaction[]) : boolean => {
    return transactions.every((tx) => !areSimilarTransactions(tx, transaction));
}