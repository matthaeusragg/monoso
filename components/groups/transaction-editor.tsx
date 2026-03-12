import { className } from "@/constants/classNames";
import { useCategories } from "@/context/category-context";
import { useTransactions } from "@/context/transaction-context";
import { Transaction } from "@/types/models";
import React, { useEffect, useState } from "react";
import { Text, View, ViewProps } from "react-native";
import ExpandableRow from "../containers/expandable-row";
import TopTabBar from "../containers/top-tab-bar";
import CustomTextInput from "../elements/custom-text-input";
import DateTimePickerComponent from "../elements/date-time-picker-component";
import StyledPicker from "../elements/styled-picker";
import SwitchAndDescription from "../elements/switch-and-description";


interface Field {
  title: string,
  transactionKey: keyof Transaction
}

interface TransactionEditorProps extends ViewProps {
  transaction: Transaction;
  setTransaction: React.Dispatch<React.SetStateAction<Transaction>>;
};

type TopTabBarOptions = "expense" | "income";

const setAmountSign = (amount: string, type: TopTabBarOptions) : string => {
  if(!parseFloat(amount)) return amount; // prevent converting to "NaN"
  else return `${(type === "expense" ? -1 : 1) * Math.abs(parseFloat(amount))}`;
}

const absOfString = (amount: string) : string => {
  if(!parseFloat(amount)) return amount; // prevent converting to "NaN"
  else return `${Math.abs(parseFloat(amount))}`;
}

export default function TransactionEditor({ transaction, setTransaction, ...props }: TransactionEditorProps) {
  const { matchedCategory } = useTransactions();
  const { categories } = useCategories();
  const [ selected, setSelected ] = useState<TopTabBarOptions>(parseFloat(transaction.amount) > 0 ? "income" : "expense"); // For empty string, NaN > 0 is false so default is "expense"

  const [ txDisplayAmount, setTxDisplayAmount ] = useState(absOfString(transaction.amount));
  const [ txDisplayAnalysisAmount, setTxDisplayAnalysisAmount ] = useState<string | undefined>(transaction.analysis_amount ? absOfString(transaction.analysis_amount) : undefined);

  useEffect(() => {
    handleChange("amount", setAmountSign(transaction.amount, selected));
    if(transaction.analysis_amount != null) handleChange("analysis_amount", setAmountSign(transaction.analysis_amount, selected));
  }, [selected])

  /**
   * 
   * @param key 
   * @param value This should NEVER be undefined for compulsory keys of Transaction
   */
  const handleChange = (key: keyof Transaction, value: string | undefined) => {
    setTransaction(prev => {
      const next = value === undefined 
        ? ((prev: Transaction, key: keyof Transaction) => {const {[key]: _, ...rest} = prev; return rest as Transaction;})(prev, key)
        : {...prev, [key]: value };
      if (next.category_id === "automatic") {
        const matched_category = matchedCategory(next, categories);
        if(matched_category) {
          next.category_id = matched_category;
        }
      }
      return next;
    });
  };

  const optional_fields : Field[] = [
    { title: "Currency", transactionKey: "currency" },
    { title: "Beneficiary", transactionKey: "beneficiary" },
    { title: "Payment reference", transactionKey: "payment_reference" }
  ]

  return (
    <View {...props}>
      <TopTabBar<TopTabBarOptions>
        tabs={[
          {
            id: "expense",
            title: "Expense",
          },
          {
            id: "income",
            title: "Income"
          }
        ]}
        selected={selected}
        setSelected={setSelected}
        className="mb-1"
        ></TopTabBar>
      <Text className={className.text.subheading}>
        Name *
      </Text>
      <CustomTextInput
        placeholder="Name"
        value={transaction.name}
        onChangeText={(val) => handleChange("name", val)}
      />

      <Text className={className.text.subheading}>
        Amount *
      </Text>
      <CustomTextInput
        placeholder="Amount"
        value={txDisplayAmount}
        inputMode="decimal"
        onChangeText={(val) => {
          val = val.replace(/(?<=\..*)\.|[^0-9.]/g, ''); // this removes all non-digit characters except for the first "."
          setTxDisplayAmount(val);
          handleChange("amount", setAmountSign(val, selected));
        }}
      />
      <Text className={className.text.subheading}>
        Date and time *
      </Text>
      <DateTimePickerComponent
        timestamp={transaction.timestamp}
        setTimestamp={(val) => handleChange("timestamp", val)}
      />

      <Text className={className.text.subheading}>
        Category
      </Text>
      <StyledPicker
        selectedValue={transaction.category_id}
        onValueChange={(val) => handleChange("category_id", val)}
      >
        <StyledPicker.Item label="No category" value={null} />
        <StyledPicker.Item label="Automatic" value={"automatic"} />
        {categories.map((c) => (
          <StyledPicker.Item key={c.id} label={c.name} value={c.id} />
        ))}
      </StyledPicker>

      <ExpandableRow title="More options">
        {optional_fields.map((field) => (
          <View key={field.transactionKey}>
          <Text className={className.text.subheading}>
            {field.title}
          </Text>
          <CustomTextInput
            key={field.transactionKey}
            placeholder={field.title}
            value={transaction[field.transactionKey]}
            onChangeText={(val) => handleChange(field.transactionKey, val)}
          />
          </View>  
        ))}


        <Text className={className.text.subheading}>
          Further information  
        </Text>
        <CustomTextInput
          placeholder="Further Information"
          value={transaction.further_information}
          multiline
          textAlignVertical="top" // required on Android to avoid centered text
          onChangeText={(val) => handleChange("further_information", val)}
        />

        {/* Spreading transaction */}
        <SwitchAndDescription 
          value={transaction.handling_type === "spread"}
          setValue={(val) => handleChange("handling_type", val ? "spread" : "regular")}
          description="Spread transaction across period?"
        />

        {transaction.handling_type === "spread" && (
          <>
            <Text className={className.text.subheading}>
              Start date and time of the spread period
            </Text>
            <DateTimePickerComponent
              timestamp={transaction.spread_period_start ?? new Date(new Date(transaction.timestamp).setHours(0,0,0,0)).toISOString()}
              setTimestamp={(val) => handleChange("spread_period_start", val)}
            />

            <Text className={className.text.subheading}>
              End date and time of the spread period
            </Text>
            <DateTimePickerComponent
              timestamp={transaction.spread_period_end ?? new Date(new Date(transaction.timestamp).setHours(23,59,59,999)).toISOString()}
              setTimestamp={(val) => handleChange("spread_period_end", val)}
            />
        </>
        )}

        {/* Analysis amount */}
        <SwitchAndDescription
          value={transaction.analysis_amount == null} // note: using == instead of === allows for undefined AND null but no other falsy values, since null == undefined is true, but null === undefined is false
          setValue={(val) => {
            const setval = val ? undefined : "0";
            setTxDisplayAnalysisAmount(setval);
            handleChange("analysis_amount", setval)}
          }
          description="Fully include in analysis?"
        />

        {transaction.analysis_amount != null // note: using != instead of !== allows for null and undefined but no other falsy values
        && (<>
          <Text className={className.text.subheading}>
            Amount included in analysis
          </Text>
          <CustomTextInput
            placeholder="Analysis amount"
            value={txDisplayAnalysisAmount}
            inputMode="decimal"
            onChangeText={(val) => {
              val = val.replace(/(?<=\..*)\.|[^0-9.]/g, ''); // this removes all non-digit characters except for the first "."
              setTxDisplayAnalysisAmount(val);
              handleChange("analysis_amount", setAmountSign(val, selected));
            }}
          />
        </>)}
      </ExpandableRow>
    </View>
  );
}

/**
 * 
 * @param transaction 
 * @returns Whether or not the input is valid and can be parsed to a transaction. If false, the parent onSubmit call should exit early
 */
export const validateTransactionInput = (transaction : Transaction) : boolean => {
  if (!transaction.name.trim() // if name is empty
      || !transaction.amount.trim() // or amount is empty
      || !/^-?\d+(\.\d+)?$|^-?\.\d+$/.test(transaction.amount.trim())) // if amount is not typed correctly
      return false;
  return true;
}