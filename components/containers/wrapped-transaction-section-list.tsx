import { className } from "@/constants/classNames";
import colors from "@/constants/nativewindColors";
import { useCategories } from "@/context/category-context";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Transaction } from "@/types/models";
import React, { useMemo } from "react";
import { Text, TouchableOpacity } from "react-native";
import RenderItemTransactionContent from "../elements/render-item-transaction-content";
import WrappedUnifiedList, { WrappedUnifiedListProps } from "./wrapped-unified-list";

interface WrappedTransactionSectionListProps extends Omit<WrappedUnifiedListProps,"sectionListConfig"> {
    transactions: Transaction[], onPress: (transaction : Transaction) => void
}

export default function WrappedTransactionSectionList({ transactions, onPress, ...props}: WrappedTransactionSectionListProps ) {
    const { categories } = useCategories();
    const isDarkMode = useColorScheme() === "dark";


    /** GROUP TRANSACTIONS BY DATE */
    const sections = useMemo(() => {
        const sorted = [...transactions].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        const groups: Record<string, typeof sorted> = {};

        sorted.forEach((t) => {
        const date = new Date(t.timestamp).toLocaleDateString('en-US', 
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
    }, [transactions]);

    const renderItem = ({ item, index, section } : { item: Transaction, index: number, section: any }) => {
        const isFirst = index === 0;
        const isLast = index === section.data.length - 1;
        return (
        <TouchableOpacity
            className={`${isFirst ? "rounded-t-2xl" : ""} ${isLast ? "rounded-b-2xl" : ""} ${className.item}`}
            style={{
                backgroundColor:
                categories.find((c) => c.id === item.category_id)?.color ??
                (isDarkMode ? colors.dark.content.accent : colors.light.content.accent),
            }}
            onPress={() => onPress(item)}
        >
            <RenderItemTransactionContent
                nametext={item.name}
                amounttext={parseFloat(item.amount).toFixed(2) + (item.currency ? " " + item.currency : "")}
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
