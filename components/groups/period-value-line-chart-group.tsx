import { className } from '@/constants/classNames';
import colors from '@/constants/nativewindColors';
import { getPeriodsIndexClosestTo } from '@/context/analytics-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AnalyticsPeriod } from '@/types/models';
import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { CustomLineChart } from '../charts/line-chart';
import StyledPicker from '../elements/styled-picker';

interface PeriodValueLineChartGroupProps {
  data: AnalyticsPeriod[];
  periods: Date[];
  lineColor?: string;
  avgLineColor?: string;
  initialPeriodsToShow?: number;
}

/**
 * 
 * @param data An analyticsPeriod array mainly used for creating the chart. It is required that data[i].starttime corresponds to periods[i] and data[i].endtime corresponds to periods[i+1];
 * @param periods The original periods array 
 * @returns 
 */
export const PeriodValueLineChartGroup: React.FC<PeriodValueLineChartGroupProps> = ({
  data,
  periods,
  lineColor = useColorScheme() === 'dark'? '#60A5FA' : '#2563EB',
  avgLineColor = useColorScheme() === 'dark'? '#F87171' : '#DC2626',
  initialPeriodsToShow = 6,
}) => {
  // Picker state
  const [pickerValue, setPickerValue] = useState<string>(`previous-${initialPeriodsToShow}`);
  // Find index of current period
  const currentIdx = getPeriodsIndexClosestTo(periods, new Date()); 
  // Compute available period options
  const periodOptions = useMemo(() => {
    const options = [{ label: 'all', value: 'all' }];
    for (let i = 2; i <= currentIdx; i++) {
      options.push({ label: `previous ${i}`, value: `previous-${i}` });
    }
    return options;
  }, [data.length]);

  // const spacing = Math.max(30,0.85*Dimensions.get('window').width/periodsToShow);

  const chartData = useMemo(() => {
    let slicedData: AnalyticsPeriod[] = [];
    if (pickerValue === 'all') {
      slicedData = data;
    } else if (pickerValue.startsWith('previous-')) {
      const num = parseInt(pickerValue.replace('previous-', ''));
      // Slice num periods prior to and including current period
      slicedData = data.slice(Math.max(0, currentIdx - num), currentIdx); // analyticsPeriods is 1 period behind periods
    }
    const total = slicedData.reduce((sum, item) => sum + item.amount, 0);
    const average = slicedData.length > 0 ? total / slicedData.length : 0;
    return slicedData.map((item) => ({
      x: item.label,
      y1: item.amount,
      y2: average,
    }));
  }, [data, pickerValue, currentIdx]);

  return (
    <View className="p-4 bg-light-surface-elevated dark:bg-dark-surface-elevated rounded-xl">
      {/* Number of periods Picker */}
      <View className="flex-row items-center mb-4 gap-x-2">
        <Text className={twMerge(className.text.paragraph, "text-lg")}>Show </Text>
        <View className="rounded-xl min-w-[12em] border border-light-outline-default dark:border-dark-outline-default">
          {/* Use custom StyledPicker */}
          <StyledPicker
            selectedValue={pickerValue}
            onValueChange={setPickerValue}
            color={colors[useColorScheme() === 'dark' ? 'dark' : 'light'].content.secondary}
          >
            {periodOptions.map(opt => (
              <StyledPicker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </StyledPicker>
        </View>
        <Text className={twMerge(className.text.paragraph, "text-lg")}> periods</Text>
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
