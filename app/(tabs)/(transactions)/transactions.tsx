import WrappedTransactionSectionList from "@/components/containers/wrapped-transaction-section-list";
import CustomHeader from "@/components/elements/custom-header";
import CsvUploadModal from "@/components/input-dialogs/csv-upload-dialog";
import TransactionInputDialog from "@/components/input-dialogs/transaction-input-dialog";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { className } from "@/constants/classNames";
import colors from "@/constants/nativewindColors";
import { useCategories } from "@/context/category-context";
import { useTransactions } from "@/context/transaction-context";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionsTab() {
  const router = useRouter();

  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);

  const { transactions, addTransactions, matchedCategory } = useTransactions();
  const { categories } = useCategories();

  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaView
      className={className.container}
      // style={{ paddingBottom: insets.bottom }}
    >
      <CustomHeader name="Transactions">
        <TouchableOpacity
          className={className.button.secondary}
          onPress={() => setAddDialogVisible(true)}
        >
          <Text className="px-5 text-5xl text-light-content-primary dark:text-dark-content-primary">
            +
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={className.button.secondary}
          onPress={() => setImportModalVisible(true)}
        >
          <View className="px-5">
          <IconSymbol size={28} name="import" color={ isDarkMode ? colors.dark.content.primary : colors.light.content.primary}/>
          </View>
        </TouchableOpacity>
      </CustomHeader>

      {/** the component below also works as is with a regular TransactionsSectionList */}
      {transactions.length >0 ? (
        <WrappedTransactionSectionList
        transactions={transactions}
        onPress={(transaction) => router.push(`/transaction/${transaction.id}`)}
        />
      )
        : (
          <Text className={className.text.paragraph}>
            Add transactions first to see them listed here!
          </Text>
        )}

      <TransactionInputDialog
        visible={addDialogVisible}
        onCancel={() => setAddDialogVisible(false)}
        onSubmit={() => setAddDialogVisible(false)}
      />

      <CsvUploadModal
        visible={importModalVisible}
        onCancel={() => {
          setImportModalVisible(false);
        }}
        onImport={() => {
          setImportModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}
