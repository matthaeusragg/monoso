import { SelectableTransaction } from '@/types/models';
import React from 'react';
import {
  ScrollView,
  View
} from 'react-native';
import { TableRow } from './table-row';


const TransactionPreviewTable = ({ transactions, setTransactions } : {transactions : SelectableTransaction[], setTransactions : React.Dispatch<React.SetStateAction<SelectableTransaction[]>>}) => {
  
  // Helper function to toggle the 'selected' state of a transaction
  const handleSelect = (transactionId: string) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((item) =>
        item.transaction.id === transactionId
          ? { ...item, selected: !item.selected } // Toggle 'selected'
          : item
      )
    );
  };

  // Helper function to select/deselect ALL transactions
  const handleSelectAll = () => {
    const allSelected = transactions.every((item) => item.selected);
    setTransactions((prevTransactions) =>
      prevTransactions.map((item) => ({
        ...item,
        selected: !allSelected, // Toggle all to the opposite of current state
      }))
    );
  };

  return (
          <ScrollView horizontal>
            <View>
              {/* Table Header */}
              <TableRow header transactions={transactions} onToggle={handleSelectAll}/>

              {/* Rows */}
              <ScrollView>
                {transactions.map((tx, index) => (
                  <TableRow
                    key={index}
                    transaction={tx}
                    transactions={transactions}
                    onToggle={() => handleSelect(tx.transaction.id)}
                  />
                ))}
              </ScrollView>
            </View>
          </ScrollView>
  );
};

export default TransactionPreviewTable;