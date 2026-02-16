import { Text, View } from 'react-native';

import { CardProps } from '@/components/containers/card';
import CardMasonry from '@/components/containers/card-masonry';
import RecentTransactionsList from '@/components/containers/recent-transactions-list';
import CustomHeader from '@/components/elements/custom-header';
import CsvUploadModal from '@/components/input-dialogs/csv-upload-dialog';
import TransactionInputDialog from '@/components/input-dialogs/transaction-input-dialog';
import { getPeriodDates } from '@/components/navigation/period-navigator';
import { className } from '@/constants/classNames';
import { useAnalytics } from '@/context/analytics-context';
import { useSettings } from '@/context/settings-context';
import { useTransactions } from '@/context/transaction-context';
import { categoryValue } from '@/functions/analytics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

export default function HomeScreen() {
  const router = useRouter();
  const [addTransactionDialogVisible, setAddTransactionDialogVisible] = useState(false);
  const [importTransactionsDialogVisible, setImportTransactionsDialogVisible] = useState(false);

  const comparisonFormatter = Intl.NumberFormat('en-GB', {
    signDisplay : "always", 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const {transactions} = useTransactions();
  const {periods} = useAnalytics();
  const {settings} = useSettings();

  const CARDS : CardProps[] = [];
    // ADD TRANSACTION
    CARDS.push(
      { 
        id: 'addTransaction', 
        onPress: () => setAddTransactionDialogVisible(true), 
        children: <><Text className={className.text.strong
        }>Add transaction</Text></> 
    });

    // IMPORT TRANSACTIONS (only if transactions array is empty)
    if(transactions.length === 0) {
      CARDS.push(
        {
          id: 'importTransactions',
          onPress: () => setImportTransactionsDialogVisible(true), 
          children: <><Text className={className.text.strong}>Import transactions</Text></> 
        }
      )
    }

    // THREE RECENT TRANSACTIONS
    if(transactions.length > 0) {
      CARDS.push(
        { 
          id: 'recentTransactions', 
          onPress: () => {router.push(`/transactions`)}, 
          children: <>
            <Text className={`${className.text.subheading2} pt-1 pb-3 text-center`}>Recent transactions</Text>
            <RecentTransactionsList/>
          </>,
          className: 'p-[5px]'
      });
    }

    // BALANCE CHANGE OF LAST PERIOD TO CURRENT DATE COMPARED TO AVERAGE PERIOD
    if(periods.length >= 2) {
      // computations for balance comparison
      const {start, end} = getPeriodDates(periods, periods.length-1); 

      const periodTimePassedFactor = (start && end) ? Math.min(1, Math.max(0, (Date.now() - start.getTime()) / (end.getTime() - start.getTime()))) : 1;

      const periodsBalanceChange : {amount: number}[] = [];
      for(let i=1;i<periods.length;i++) {
          const {start: start_i, end: end_i} = getPeriodDates(periods, i);
          periodsBalanceChange.push({
              amount: Math.abs(categoryValue({
                transactions, 
                starttime: start_i?.getTime(), 
                endtime: (start_i && end_i) ? (1-periodTimePassedFactor) * start_i.getTime() + periodTimePassedFactor * end_i.getTime() : undefined, 
                type: "expenses", 
                considerSpread: settings.spreadIrregularTransactions
              }))
          });
      }

      const lastMinusAverage = periodsBalanceChange[periodsBalanceChange.length-1].amount
        - (periodsBalanceChange.length > 1 
          ? periodsBalanceChange.slice(0,-1).reduce((sum, item) => sum + item.amount, 0) / (periodsBalanceChange.length-1)
          : 0);

      // BALANCE CHANGE CARD
      CARDS.push(
      { 
        id: 'balanceComparison', 
        onPress: () => {router.push(`/analysis`)}, 
        children: <>
        <Text className={twMerge(className.text.subheading2, "pt-1")}>Expenses comparison</Text>
        <Text className={twMerge(className.text.footnote, "pb-2 text-left")}>
            of most recent period to date, compared to the average across all ({periodsBalanceChange.length-1}) prior periods.
          </Text>
        <Text className={twMerge(className.text.strong, "text-right")}>{periodsBalanceChange[periodsBalanceChange.length-1].amount.toFixed(2)}</Text>
        <Text className={twMerge(className.text.strong2, lastMinusAverage < 0 ? "text-light-content-positive dark:text-dark-content-positive" : "text-light-content-negative dark:text-dark-content-negative", "text-right")}>
          {comparisonFormatter.format(lastMinusAverage)}
          {/* <Text className="font-extralight text-light-content-primary dark:text-dark-content-primary">
            {" *"}
          </Text> */}
        </Text>
        </>
    });
    }

  return (
    <SafeAreaView
      className={className.container}>
      <CustomHeader name={transactions.length === 0 ? "Welcome to the monoso app! " : "Welcome"}></CustomHeader>

      {transactions.length === 0 && (<>
        <View className="p-4">      
          <Text className={`${className.text.paragraph} text-base mb-3`}>
            With monoso you can track your expenses by
          </Text>

          <View className="ml-2 mb-4">
            <Text className={`${className.text.paragraph} mb-1`}>
              {'\u2022'} grouping your transactions into customizable categories
            </Text>
            <Text className={`${className.text.paragraph} mb-1`}>
              {'\u2022'} comparing your expenses across different customizable time periods
            </Text>
            <Text className={`${className.text.paragraph} mb-1`}>
              {'\u2022'} marking transactions as "irregular" (e.g. yearly bills)
            </Text>
          </View>

          <Text className={`${className.text.paragraph} font-semibold mt-2`}>
            Start by adding or importing transactions!
          </Text>
        </View>
      </>)}

      <CardMasonry data = {CARDS}/>

      {transactions.length === 0 && (<>
        <Text className={className.text.paragraph}>Disclaimer: </Text>
        <Text className={className.text.paragraph}>This app was developed as a learning project and with personal requirements in mind. No guarantees on functionality.</Text>
      </>)}

      <TransactionInputDialog
        visible={addTransactionDialogVisible}
        onCancel={() => setAddTransactionDialogVisible(false)}
        onSubmit={() => setAddTransactionDialogVisible(false)}
      />

      {transactions.length === 0 && (
        <CsvUploadModal
                visible={importTransactionsDialogVisible}
                onCancel={() => {
                  setImportTransactionsDialogVisible(false);
                }}
                onImport={() => {
                  setImportTransactionsDialogVisible(false);
                }}
              />
      )}
    </SafeAreaView>
  );
}