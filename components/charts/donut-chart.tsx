import { className } from '@/constants/classNames';
import colors from '@/constants/nativewindColors';
import { useSettings } from '@/context/settings-context';
import { AnalyticsCategory } from '@/types/models';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { twMerge } from 'tailwind-merge';

interface DonutChartProps {
  data: AnalyticsCategory[];
  centerLabel?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ 
  data, 
  centerLabel 
}) => {
  const router = useRouter();
  const isDarkMode = useColorScheme() === 'dark';

  const { settings } = useSettings();

  const handleSlicePress = (item: AnalyticsCategory) => {
    if (item.id) {
      router.push(`/category/${item.id}`);
    }
  };

  // Transform data to include press handlers
  const chartData = data.map((item) => ({
    ...item,
    onPress: () => handleSlicePress(item),
  }));

  // Calculate total for center label
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View className="items-center justify-center p-4">
      <PieChart
        data={chartData}
        donut
        radius={120}
        innerRadius={70}
        innerCircleColor={isDarkMode ? colors.dark.surface.main : colors.light.surface.main}
        centerLabelComponent={() => (
          <View className="items-center justify-center">
            <Text className={className.text.heading2}>
              {centerLabel || `${settings.defaultCurrency} ${total.toLocaleString()}`}
            </Text>
            <Text className={className.text.note}>Total</Text>
          </View>
        )}
        strokeWidth={2}
        strokeColor={isDarkMode ? colors.dark.surface.main : colors.light.surface.main}
      />

      {/* Legend */}
      <View className="mt-6 w-full px-4">
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSlicePress(item)}
            className="flex-row items-center justify-between py-3 border-b border-light-outline-default dark:border-dark-outline-default"
          >
            <View className="flex-row items-center flex-1">
              <View
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: item.color }}
              />
              <Text className={twMerge(className.text.paragraph, "font-medium")}>
                {item.name || item.label}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className={twMerge(className.text.paragraph, "font-semibold mr-2")}>
                {settings.defaultCurrency} {item.value.toLocaleString()}
              </Text>
              <Text className={className.text.note}>
                ({((item.value / total) * 100).toFixed(1)}%)
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};