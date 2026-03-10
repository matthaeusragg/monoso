import { className } from "@/constants/classNames";
import colors from "@/constants/nativewindColors";
import { useCategories } from "@/context/category-context";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Transaction } from "@/types/models";
import React, { useMemo } from "react";
import { Text, TouchableOpacity } from "react-native";
import RenderItemTransactionContent from "../elements/render-item-transaction-content";
import WrappedUnifiedList, { WrappedUnifiedListProps } from "./wrapped-unified-list";

import { numberToFixedLocaleString } from "@/functions/handling";

interface WrappedTransactionSectionListProps extends Omit<WrappedUnifiedListProps,"sectionListConfig"> {
    flexibleTransactions: { transaction: Transaction, override_amount?: number }[], onPress: (transaction : Transaction) => void
}

export default function WrappedTransactionSectionList({ flexibleTransactions, onPress, ...props}: WrappedTransactionSectionListProps ) {
    const { categories } = useCategories();
    const isDarkMode = useColorScheme() === "dark";


    /** GROUP TRANSACTIONS BY DATE */
    const sections = useMemo(() => {
        const sorted = [...flexibleTransactions].sort(
        (a, b) => new Date(b.transaction.timestamp).getTime() - new Date(a.transaction.timestamp).getTime()
        );

        const groups: Record<string, typeof sorted> = {};

        sorted.forEach((t) => {
        const date = new Date(t.transaction.timestamp).toLocaleDateString('en-US', 
            {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            }
        );
        // const date = new Date(t.timestamp).toISOString().split("T")[0]; // YYYY-MM-DD
        if (!groups[date]) groups[date] = [];
        groups[date].push(t);
        });

        return Object.keys(groups).map((date) => ({
        title: date,
        data: groups[date],
        }));
    }, [flexibleTransactions]);

    const renderItem = ({ item, index, section } : { item: { transaction: Transaction, override_amount?: number }, index: number, section: any }) => {
        const isFirst = index === 0;
        const isLast = index === section.data.length - 1;
        return (
        <TouchableOpacity
            className={`${isFirst ? "rounded-t-2xl" : ""} ${isLast ? "rounded-b-2xl" : ""} ${className.item}`}
            style={{
                backgroundColor:
                categories.find((c) => c.id === item.transaction.category_id)?.color ??
                (isDarkMode ? colors.dark.content.accent : colors.light.content.accent),
            }}
            onPress={() => onPress(item.transaction)}
        >
            <RenderItemTransactionContent
                nametext={item.transaction.name}
                amounttext={numberToFixedLocaleString(item.override_amount ?? parseFloat(item.transaction.amount)) + (item.transaction.currency ? " " + item.transaction.currency : "")}
            />
        </TouchableOpacity>
    )};

  const renderSectionHeader = ({ section: { title } } : { section: { title : string}}) => (
      <Text className="px-4 pt-4 pb-2 text-xl font-bold text-light-content-primary dark:text-dark-content-primary">
        {title}
      </Text>
    );

  return (
    <WrappedUnifiedList
        sectionListConfig={{
          sections: sections,
          renderItem: renderItem,
          renderSectionHeader: renderSectionHeader,
          keyExtractor: (item) => item.id
        }}
        className="rounded-2xl"
        {...props}
        />
  );
}
