import TransactionEditor from "@/components/groups/transaction-editor";
import { useTransactions } from "@/context/transaction-context";
import { Transaction } from "@/types/models";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import InputDialog from "./input-dialog";

export default function TransactionInputDialog({
  visible,
  onCancel,
  onSubmit,
} : {
  visible : boolean;
  onCancel: (...args: any[]) => any;
  onSubmit: (...args: any[]) => any;
}
) {

  const default_transaction = {
    id: "",
    name: "",
    amount: "",
    timestamp: new Date().toISOString(),
    category_id: "automatic",
    currency: "EUR",
    beneficiary: "",
    payment_reference: "",
    further_information: "",
    handling_type: "regular",
  }

  const [transaction, setTransaction] = useState<Transaction>(default_transaction);

  const {addTransactions} = useTransactions();

  const reset = () => {
    setTransaction(default_transaction);
  };

  return (
    <InputDialog 
      visible={visible} 
      title="Add transaction" 
      onCancel={() => { onCancel();reset(); }} 
      onSubmit={() => {
                if (!transaction.name.trim() // if name is empty
                  || !transaction.amount.trim() // or amount is empty
                  || !/^-?\d*(\.\d+)?$/.test(transaction.amount.trim())) // if amount is not typed correctly
                  return;
                addTransactions({ 
                  ...transaction,
                  id: Date.now().toString(),
                });
                onSubmit();
                reset();
              }}>
      <KeyboardAwareScrollView>
        <TransactionEditor
          transaction={transaction} 
          setTransaction={setTransaction}/>
      </KeyboardAwareScrollView>
    </InputDialog>
  );
}
