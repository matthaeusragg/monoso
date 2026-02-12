import { className } from '@/constants/classNames';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AnalyticsPeriod } from '@/types/models';
import React, { useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { CustomLineChart } from '../charts/line-chart';

interface PeriodValueLineChartGroupProps {
  data: AnalyticsPeriod[];
  lineColor?: string;
  avgLineColor?: string;
  initialPeriodsToShow?: number;
}

export const PeriodValueLineChartGroup: React.FC<PeriodValueLineChartGroupProps> = ({
  data,
  lineColor = useColorScheme() === 'dark'? '#60A5FA' : '#2563EB',
  avgLineColor = useColorScheme() === 'dark'? '#F87171' : '#DC2626',
  initialPeriodsToShow = 6,
}) => {
  const [periodsToShow, setPeriodsToShow] = useState(
    Math.min(initialPeriodsToShow, data.length)
  );
  const [inputValue, setInputValue] = useState(periodsToShow.toString());

  // const spacing = Math.max(30,0.85*Dimensions.get('window').width/periodsToShow);

  const chartData = useMemo(() => {
    const slicedData = data.slice(-periodsToShow);
    const total = slicedData.reduce((sum, item) => sum + item.amount, 0);
    const average = slicedData.length > 0 ? total / slicedData.length : 0;

    const formattedData = slicedData.map((item) => ({
      x: item.label,
      y1: item.amount,
      y2: average,
    }));

    return formattedData;
  }, [data, periodsToShow]);

  const handleApplyPeriods = () => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num) && num > 0 && num <= data.length) {
      setPeriodsToShow(num);
    } else {
      setInputValue(periodsToShow.toString());
    }
  };

  return (
    <View className="p-4 bg-light-surface-elevated dark:bg-dark-surface-elevated rounded-xl">
      {/* Number of periods Selector */}
      <View className="flex-row items-center mb-4 gap-2">
        <Text className={className.text.paragraph}>Show last</Text>
        <TextInput
          className={twMerge(className.text.paragraph, "border border-light-outline-default dark:border-dark-outline-default rounded-xl px-2 py-2 w-16 text-center")}
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="number-pad"
          onSubmitEditing={handleApplyPeriods}
        />
        <Text className={className.text.paragraph}>
          of {data.length} periods
        </Text>
        <TouchableOpacity
          className={twMerge(className.button.primary,"px-4 py-2 ml-auto")}
          onPress={handleApplyPeriods}
        >
          <Text className="text-light-content-onAccent dark:text-dark-content-onAccent font-semibold">Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Chart */}
      {/* <View 
        // horizontal 
        // showsHorizontalScrollIndicator={true}
        onLayout={(event) => { // I use this to pass the ScrollView's width to the chart as a dynamic width to stretch to
          const { width } = event.nativeEvent.layout;
          setScrollViewWidth(width);
        }}
      > */}
      <View className="items-center pt-4">
        {chartData.length > 0 ? (
          <CustomLineChart 
          chartData={chartData}
          color1={lineColor}
          color2={avgLineColor}
          yAxisLabelSymbol='€'
          />
        ) : (
          <Text className="text-light-content-primary dark:text-dark-content-primary py-8">No data to display</Text>
        )}
      </View>

      {/* Legend */}
      <View className="flex-row justify-center gap-6 mt-2">
        <View className="flex-row items-center gap-2">
          <View
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: lineColor }}
          />
          <Text className="text-xs text-light-content-secondary dark:text-dark-content-secondary">Actual Values</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            className="w-4 h-1"
            style={{ backgroundColor: avgLineColor }}
          />
          <Text className="text-xs text-light-content-secondary dark:text-dark-content-secondary">Average</Text>
        </View>
      </View>
    </View>
  );
};
