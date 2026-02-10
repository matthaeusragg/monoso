import { DonutChart } from '@/components/charts/donut-chart';
import CustomHeader from '@/components/elements/custom-header';
import SettingsDialog from '@/components/input-dialogs/settings-dialog';
import { getPeriodDates, PeriodNavigator } from '@/components/navigation/period-navigator';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { className } from '@/constants/classNames';
import colors from '@/constants/nativewindColors';
import { useAnalytics } from '@/context/analytics-context';
import { useCategories } from '@/context/category-context';
import { useSettings } from '@/context/settings-context';
import { useTransactions } from '@/context/transaction-context';
import { categoryValue } from '@/functions/analytics';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AnalyticsCategory } from '@/types/models';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

export default function AnalysisTab () {
  const isDarkMode = useColorScheme() === 'dark';
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const {settings} = useSettings();
  const {periods, periodsIndex} = useAnalytics();
  const {categories} = useCategories();
  const {transactions} = useTransactions();
  const {start, end} = getPeriodDates(periods, periodsIndex);

  const analyticsCategories : AnalyticsCategory[] = [
    // categories
    ...categories.map((c) => ({
      ...c,
      value: Math.abs(categoryValue({
        transactions, 
        categoryId: c.id, 
        starttime: start?.getTime(), 
        endtime: end?.getTime(), 
        type: settings.analyseIncomeInstead? "income" : "expenses", 
        considerSpread: settings.spreadIrregularTransactions
      })),
      color: c.color ?? (isDarkMode ? colors.dark.content.accent : colors.light.content.accent)
    })),
    // uncategorized entry
    {
      value: Math.abs(categoryValue({
        transactions, 
        categoryId: "uncategorized", 
        starttime: start?.getTime(), 
        endtime: end?.getTime(), 
        type: settings.analyseIncomeInstead? "income" : "expenses", 
        considerSpread: settings.spreadIrregularTransactions, 
        categoryIdList: categories.map((c) => c.id) 
      })),
      id: "uncategorized",
      name: "Uncategorized",
      color: (isDarkMode ? colors.dark.content.accent : colors.light.content.accent) 
    }
  ].filter((ac) => ac.value !== 0);

  return (
    <SafeAreaView className={className.container}> 
    {/* manual extra padding for tabbar */}
      <CustomHeader name="Analysis">
        <TouchableOpacity className={className.button.secondary}
          onPress = {() => setSettingsModalVisible(true)}>
          <Text className="px-5 text-5xl text-center">
            {<IconSymbol size={28} name="settings" color={(isDarkMode ? colors.dark.content.primary : colors.light.content.primary)} />}
          </Text>
        </TouchableOpacity>
      </CustomHeader>

      {
        transactions.length > 0 
        ? (
          <>
          <PeriodNavigator/>

          <ScrollView>
          { 
            analyticsCategories.length > 0 
            ? (<DonutChart data={analyticsCategories} />)
            : (<Text className={twMerge(className.text.subheading, "text-center p-5")}>
              There are no recorded {settings.analyseIncomeInstead ? "incoming transactions" : "expenses"} in this period. 
            </Text>)
          }
          <Text className={className.text.footnote}>
            Note: Categories whose value is zero are not displayed
          </Text>
          </ScrollView>
          </>
        )
        : (
          <>
          <Text className={className.text.paragraph}>
            Before analysing, add a transaction first via the transactions tab!
          </Text>
          </>
        )
      }

      <SettingsDialog visible={settingsModalVisible}
            title="Settings"
            onCancel = {() => setSettingsModalVisible(false)}
            onSubmit = {() => setSettingsModalVisible(false)}
            />
    </SafeAreaView>
  );
};