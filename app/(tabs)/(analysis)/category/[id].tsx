import WrappedTransactionSectionList from "@/components/containers/wrapped-transaction-section-list";
import RenderItemTransactionContent from "@/components/elements/render-item-transaction-content";
import { PeriodValueLineChartGroup } from "@/components/groups/period-value-line-chart-group";
import { getPeriodDates, PeriodNavigator } from "@/components/navigation/period-navigator";
import { className } from "@/constants/classNames";
import colors from "@/constants/nativewindColors";
import { useAnalytics } from "@/context/analytics-context";
import { useCategories } from "@/context/category-context";
import { useSettings } from "@/context/settings-context";
import { useTransactions } from "@/context/transaction-context";
import { categoryValue, getIrregularTransactions } from "@/functions/analytics";
import { AnalyticsPeriod, Transaction } from "@/types/models";
import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function CategoryAnalysisScreen() {
    // this page supports thisCategoryId === "uncategorized" as a special case, taking all transactions that are not equal to any category
    const { id : thisCategoryId } = useLocalSearchParams<{ id: string }>();
    const {periods, periodsIndex} = useAnalytics();
    const { start, end } = getPeriodDates(periods, periodsIndex);
    const {transactions} = useTransactions();
    const {settings} = useSettings();
    const isDarkMode = useColorScheme() === 'dark';
    const {categories} = useCategories();

    const getThisCategory = () => {
      if(thisCategoryId === "uncategorized") {
        return null;
      }
      return categories.filter(c => c.id === thisCategoryId)[0];
    }
    
    const analyticsPeriods : AnalyticsPeriod[] = [];
    for(let i=1;i<periods.length;i++) {
        const {start: start_i, end: end_i} = getPeriodDates(periods, i);
        analyticsPeriods.push({
            label: start_i?.toLocaleDateString("en-US", {month:"short", day: "numeric"}) + " - "+end_i?.toLocaleDateString("en-US", {month:"short", day: "numeric"}),
            startTime: start_i,
            endTime: end_i,
            amount: Math.abs(categoryValue({
                transactions, 
                categoryId: thisCategoryId, 
                starttime: start_i?.getTime(), 
                endtime: end_i?.getTime(), 
                type: settings.analyseIncomeInstead? "income" : "expenses", 
                considerSpread: settings.spreadIrregularTransactions, 
                categoryIdList: thisCategoryId === "uncategorized" ? categories.map((c) => c.id) : []
            }))
        });
    }

    // regularTransactions only excludes spread transactions if settings.spreadIrregularTransactions is set to true
    const regularTransactions = useMemo(() => { 
        return(transactions
            .filter((tx) => {
                const timestamptime = new Date(tx.timestamp).getTime();
                let txvalue = parseFloat(tx.amount);
                return(
                    thisCategoryId ==="uncategorized" 
                    // if "uncategorized", exclude all categories
                    ? !tx.category_id || !categories.map((c) => c.id).includes(tx.category_id)
                    // else matches category
                    : tx.category_id === thisCategoryId
                    // timestamp within period
                    && (!start || timestamptime >= start.getTime())
                    && (!end || timestamptime < end.getTime())
                    // only include expenses or income
                    && txvalue && !(settings.analyseIncomeInstead ? txvalue < 0 : txvalue > 0)
                    // exclude irregular transactions if applicable
                    && (!settings.spreadIrregularTransactions || tx.handling_type !== "spread")
                )
            }))}, [transactions, settings, start, end]);
    
    const irregularTransactions = useMemo(() => {
        return(
            getIrregularTransactions({
                transactions, 
                starttime: start?.getTime(), 
                endtime: end?.getTime(), 
                type: settings.analyseIncomeInstead ? "income" : "expenses", 
                categoryId: thisCategoryId, 
                categoryIdList: thisCategoryId === "uncategorized" ? categories.map((c) => c.id) : []
            })
    )}, [transactions, settings, start, end]);

    const renderIrregularTransactionItem = ({ item, index }: { item: {transaction : Transaction, this_period_amount: number}, index: number }) => {
        const isFirst = index === 0;
        const isLast = index === irregularTransactions.length - 1;
        return (
        <TouchableOpacity
            className={`${isFirst ? "rounded-t-2xl" : ""} ${isLast ? "rounded-b-2xl" : ""} ${className.item}`}
            style={{backgroundColor: getThisCategory()?.color ?? (isDarkMode ? colors.dark.content.accent : colors.light.content.accent)}}
            // onPress={() => router.push(`/category/${item.id}`)}
        >
            <RenderItemTransactionContent
                nametext={item.transaction.name}
                amounttext={item.this_period_amount + (item.transaction.currency ? " " + item.transaction.currency : "")}
            />
        </TouchableOpacity>)
    };

    const categoryDescriptionInHeaders = thisCategoryId === "uncategorized" 
                        ? `not assigned to any category`
                        : `in "${categories.filter(c => c.id === thisCategoryId)[0].name}"`;

    return (
        <>
        <Stack.Screen options={{title: `${thisCategoryId === "uncategorized" ? "Other categories" : categories.filter(c => c.id === thisCategoryId)[0].name}`}}/>
        <View className={className.container}>        
            <WrappedTransactionSectionList
                transactions={regularTransactions}
                onPress={(transaction) => {}}
                headers={[
                    { component: <PeriodValueLineChartGroup
                        data={analyticsPeriods}
                        lineColor="#3b82f6"
                        avgLineColor="#ef4444"
                        initialPeriodsToShow={6}
                    />, sticky: false},
                    { component: <PeriodNavigator/>, sticky: false},
                    { component: regularTransactions.length > 0 && (
                    <Text className={`pt-3 pb-2 ${className.text.subheading}`}>
                        {`${settings.spreadIrregularTransactions ? "Regular" : "All"} transactions ${categoryDescriptionInHeaders} and in the selected period`}
                    </Text>
                    ), sticky: false }
                ]}
                flatListConfig={{
                    header: irregularTransactions.length > 0 && (
                    <Text className={`pt-7 pb-2 ${className.text.subheading}`}>
                        {`Irregular transactions ${categoryDescriptionInHeaders} and their contribution to this period`}
                    </Text>),
                    data: irregularTransactions,
                    keyExtractor: (item : { transaction: Transaction; this_period_amount: number; }) => item.transaction.id,
                    renderItem: renderIrregularTransactionItem
                }}
            />
            </View>
        </>
        );
}