import { Category, Transaction } from "@/types/models";
import { createContext, useContext, useEffect } from "react";
import { useAsyncStorageState } from "../hooks/use-async-storage-state";

type TransactionContextType = {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addTransactions: (transactions: Transaction | Transaction[]) => void;
  updateTransactions: (transaction: Transaction | Transaction[]) => void;
  removeTransaction: (id: string) => void;
  getTransaction: (id: string) => Transaction | undefined;
  matchedCategory: (transaction: Transaction, categories: Category[]) => string | undefined;
  transactionsHydrated: boolean;
};

const TransactionContext = createContext<TransactionContextType | null>(null);

import default_transactions from '@/data/default_transactions.json';
import { useCategories } from "./category-context";
const DEFAULT_TRANSACTIONS = default_transactions.transactions;
const transactionsKey = "transactions";

export function TransactionProvider({ children } : {children : React.ReactNode}) {
  const [transactions, setTransactions, transactionsHydrated] =
    useAsyncStorageState<Transaction[]>(transactionsKey, DEFAULT_TRANSACTIONS);

  const {categories} = useCategories();
  const addTransactions = (transactions : Transaction | Transaction[]) => {
    setTransactions(prev => [...prev, ...(Array.isArray(transactions) ? transactions : [transactions]) ]);
  };

  const updateTransactions = (updated: Transaction | Transaction[]) => {
  setTransactions(prev =>
    prev.map(tx => {
      return (Array.isArray(updated) ? updated : [updated])
      .find(u => u.id === tx.id) 
      ?? tx;
    })
  );
};

  const removeTransaction = (id: string) => {
    setTransactions(prev => [...prev.filter(c => c.id !== id)]);
  };

  const getTransaction = (id: string) => {
    return transactions.find((x) => x.id === id);
  }

  /**
   * returns the id of the (first found) category 
   * for which one of its keywords is contained in any string value of the transaction. 
   * Returns null if no such category is found.
   * Not case sensitive.
   * @param transaction 
   * @param categories 
   * @returns 
   */
  const matchedCategory = (transaction: Transaction, categories : Category[]) => {
    const search_array = Object.values(transaction).filter((field) : field is string => (typeof field === "string" && field.length > 0));
    const matched_category_id = categories.find((category) => 
      category.keywords.some((keyword) => 
        search_array.some((field) => 
          field.toLowerCase().includes(keyword.word.toLowerCase())
        )
      )
    )
    ?.id;
    // updateTransactions({...transaction, category_id : matched_category_id});
    return matched_category_id;
  }

  // this effect updates transactions every time categories update
  // do not update if transactions are not properly loaded from storage yet to prevent data loss
  useEffect(() => {
    if(categories.length > 0 && transactionsHydrated) {
      updateTransactions(
            transactions
            .filter((t) => t.category_id === "automatic")
            .map((t) => {
              return {...t, category_id: matchedCategory(t, categories) ?? t.category_id};
            })
          )
    }
  }, [categories]);

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions, addTransactions, updateTransactions, removeTransaction, getTransaction, matchedCategory, transactionsHydrated }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be inside <TransactionProvider>");
  return ctx;
}