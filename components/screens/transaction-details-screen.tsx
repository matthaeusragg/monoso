import { useTransactions } from "@/context/transaction-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import CustomHeader from "@/components/elements/custom-header";
import TransactionEditor from "@/components/groups/transaction-editor";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { className } from "@/constants/classNames";
import colors from "@/constants/nativewindColors";
import { isDeepEqual } from "@/functions/handling";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets(); // used to manually add space for the tabbar for short screens

  const { updateTransactions, removeTransaction, getTransaction } = useTransactions();

  const colorSchemeKey = useColorScheme() === 'dark' ? 'dark' : 'light';

  const [transaction, setTransaction] = useState(() =>
    getTransaction(id)
  );

  const hasChanges = !isDeepEqual(transaction, getTransaction(id));

  if (!transaction) return <Text>Transaction not found.</Text>;

  return (
    <>
    <Stack.Screen options={{title: `${transaction.name}`}}/>
    <ScrollView className="flex-1 pt-6 px-4">
      <CustomHeader name="Transaction Details">
        <TouchableOpacity
          className={className.button.secondary}
          onPress={() => {
            removeTransaction(id);
            router.back();
          }}
        >
          <View className="px-3 py-2">
          <IconSymbol
            name="delete"
            size={28}
            color={ colors[colorSchemeKey].content.negative}
          />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className={ hasChanges ? className.button.primary : className.button.secondary}
          onPress={() => {
            if (hasChanges && transaction) {
              if (!transaction.name.trim() // if name is empty
                  || !/^-?\d*(\.\d+)?$/.test(transaction.amount.trim())) // if amount is not typed correctly
                  return;
              updateTransactions(transaction);
            }
            router.back();
          }}
        >
          <View className="px-3 py-2">
          <IconSymbol
            name="done"
            size={28}
            color={ colors[colorSchemeKey].content.primary}
          />
          </View>
        </TouchableOpacity>
      </CustomHeader>

      <TransactionEditor style={{paddingBottom: insets.bottom+25}} transaction={transaction} setTransaction={setTransaction}/>
    </ScrollView>
    </>
  );
}
