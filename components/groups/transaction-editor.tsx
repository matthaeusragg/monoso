import { className } from "@/constants/classNames";
import { useCategories } from "@/context/category-context";
import { useTransactions } from "@/context/transaction-context";
import { Transaction } from "@/types/models";
import React from "react";
import { Text, View, ViewProps } from "react-native";
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

export default function TransactionEditor({ transaction, setTransaction, ...props }: TransactionEditorProps) {
  const { matchedCategory } = useTransactions();
  const { categories } = useCategories();

  const handleChange = (key: keyof Transaction, value: string) => {
    setTransaction(prev => {
      const next = {...prev, [key]: value };
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
        value={transaction.amount}
        keyboardType="numeric"
        onChangeText={(val) => handleChange("amount", val)}
      />
      <Text className={className.text.subheading}>
        Date and time *
      </Text>
      <DateTimePickerComponent
        timestamp={transaction.timestamp}
        setTimestamp={(val) => handleChange("timestamp", val)}
      />

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
            timestamp={transaction.spread_period_start ?? transaction.timestamp}
            setTimestamp={(val) => handleChange("spread_period_start", val)}
          />

          <Text className={className.text.subheading}>
            End date and time of the spread period
          </Text>
          <DateTimePickerComponent
            timestamp={transaction.spread_period_end ?? transaction.timestamp}
            setTimestamp={(val) => handleChange("spread_period_end", val)}
          />
      </>
      )}
    </View>
  );
}
