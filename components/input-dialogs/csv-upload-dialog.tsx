import { className } from "@/constants/classNames";
import { useCategories } from "@/context/category-context";
import { useTransactions } from "@/context/transaction-context";
import { parseCsv } from "@/functions/csvParsing";
import { isExistingTransaction } from "@/functions/mergeTransactions";
import { SelectableTransaction } from "@/types/models";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";
import TransactionPreviewTable from "../elements/data-table/transaction-preview-table";
import InputDialog from "./input-dialog";


export default function CsvUploadModal({ visible, onCancel, onImport } : {visible : boolean, onCancel : () => void, onImport: () => void }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [newTransactions, setNewTransactions] = useState<SelectableTransaction[]>([]);
  const { transactions, addTransactions, matchedCategory } = useTransactions();
  const {categories } = useCategories();

  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({
        type: ["text/*", "application/*"],
        copyToCacheDirectory: true,
    });

    if (!res.canceled && res.assets && res.assets.length > 0) {
        const file = res.assets[0];

        if (!file.name.toLowerCase().endsWith(".csv")) {
        alert("Please select a CSV file");
        return;
        }

        setFileName(file.name);
        onFileSelected?.(file);
      }
      else {
        alert("Failed to import file.");
      }
    };

  const onFileSelected = async (file : DocumentPicker.DocumentPickerAsset) => {
    try {
      const response = await fetch(file.uri);
      const csvString = await response.text();
      try {
        const transactionsArray = parseCsv(csvString);
        setNewTransactions(
          transactionsArray.map((t) => ({
            selected : isExistingTransaction(t, transactions), 
            transaction : t
          }))
        );
      } catch (error) {
        console.error('Error parsing the csv:', error);
        alert('Failed to parse the csv.');
      }
    } catch (error) {
      console.error('Error reading file content:', error);
      alert('Failed to read the file content.');
    }
  }

  return (
    <InputDialog 
    visible={visible} 
    title="Upload CSV File"
    onCancel={() => {
              setNewTransactions([]);
              setFileName(null);
              onCancel();
            }}
    onSubmit={
      () => {
              addTransactions(
                  newTransactions
                      .filter((t) => t.selected)
                      .map((t)=> t.transaction)
                      .map((t) => ({...t, category_id: t.category_id ??  matchedCategory(t, categories) ?? "automatic"}))
                );
              onImport();
              setNewTransactions([]);
              setFileName(null);
            }}
    submitName="Confirm"
    >

          <TouchableOpacity
            onPress={pickFile}
            className={twMerge(className.button.primary, "py-4 mb-3")}
          >
            <Text className={className.text.onAccent}>{!fileName ? "Select CSV File" : "Change CSV File"} </Text>
          </TouchableOpacity>

          {fileName && (
            <Text className={twMerge(className.text.note, "mb-4")}>Selected file: {fileName}</Text>
          )}

          {fileName && newTransactions.length === 0 && (
            <Text className={twMerge(className.text.paragraph, "mb-4")}>Parsing transactions...</Text>
          )}
          
          {newTransactions.length > 0 && (
            <>
              <Text className={twMerge(className.text.note, "mb-4")}>Please select which transactions you want to import. Previously imported transactions are unselected by default.</Text>
              <TransactionPreviewTable transactions = {newTransactions} setTransactions={setNewTransactions}/>
            </>
          )}
    </InputDialog>
  );
}
