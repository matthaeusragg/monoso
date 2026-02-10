import { className } from "@/constants/classNames";
import colors from "@/constants/nativewindColors";
import { useAnalytics } from "@/context/analytics-context";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { twMerge } from "tailwind-merge";

type PeriodNavigatorProps = {
  periods?: Date[];
  index?: number;
  onChange?: (newIndex: number) => void;
  formatLabel?: (start: Date | null, end: Date | null) => string;
};

// thought about using React.useMemo here, but it seems like this is unnecessary
export function getPeriodDates(periods: Date[], index: number) {
  return(
    {
      start: index >= 1 ? periods[index - 1] : null,
      end: index < periods.length ? periods[index] : null,
    }
  );
}

export function PeriodNavigator({
  periods = useAnalytics().periods,
  index = useAnalytics().periodsIndex,
  onChange = useAnalytics().setPeriodsIndex,
  formatLabel = (start, end) =>
    `${start ? start.toDateString() : ""} – ${end ? end.toDateString() : ""}`,
}: PeriodNavigatorProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const hasPrev = index > 1;
  const hasNext = index < periods.length - 1;

  const {start, end} = getPeriodDates(periods, index);

  const goPrev = () => {
    if (hasPrev) onChange(index - 1);
  };

  const goNext = () => {
    if (hasNext) onChange(index + 1);
  };

  return (
      <View className="flex-row items-center justify-between px-2">
        <TouchableOpacity
          onPress={goPrev}
          disabled={!hasPrev}
          className={`p-2 ${!hasPrev ? "opacity-30" : ""}`}
        >
          <Ionicons name="chevron-back" size={24} color={isDarkMode ? colors.dark.content.primary : colors.light.content.primary}/>
        </TouchableOpacity>

        <Text className={twMerge(className.text.paragraph, "text-base font-medium text-center")}>
          {formatLabel(start, end)}
        </Text>

        <TouchableOpacity
          onPress={goNext}
          disabled={!hasNext}
          className={`p-2 ${!hasNext ? "opacity-30" : ""}`}
        >
          <Ionicons name="chevron-forward" size={24} color={isDarkMode ? colors.dark.content.primary : colors.light.content.primary} />
        </TouchableOpacity>
      </View>
  );
}
