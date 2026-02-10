import colors from "@/constants/nativewindColors";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { IconSymbol } from "../ui/icon-symbol";




const DateTimePickerComponent = ({timestamp, setTimestamp} : {timestamp : string, setTimestamp : (val: string) => void}) => {
    // const [selectedTimestamp, setTimestamp] = useState(timestamp);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    
    const isDark = useColorScheme() === "dark";

    const setDate = (date : Date | undefined) => {
    setShowDatePicker(false);
    if(!date) return;
    setTimestamp(dayjs(timestamp)
      .year(date.getFullYear())
      .month(date.getMonth())
      .date(date.getDate())
      .toISOString())
  }

  const setTime = (time : Date | undefined) => {
    setShowTimePicker(false);
    if(!time) return;
    setTimestamp(
    dayjs(timestamp)
    .hour(time.getHours())
    .minute(time.getMinutes())
    .second(0)
    .toISOString())
  }
  return (

    <View className="flex-row justify-between">
        <TouchableOpacity className="flex-row p-2 my-3 rounded-xl items-center justify-center" 
            onPress={() => setShowDatePicker(true)}>
            <Text className="text-xl text-light-content-primary dark:text-dark-content-primary">
            {dayjs(timestamp).format('DD/MM/YYYY')}
            </Text>
            <View className="pl-2">
            <IconSymbol
                name="edit"
                size={22}
                color={isDark ? colors.dark.content.accent : colors.light.content.accent}
              />
            </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row p-2 my-2 rounded-xl items-center justify-center"
            onPress={() => setShowTimePicker(true)}>
            <Text className="text-xl text-light-content-primary dark:text-dark-content-primary">
            {dayjs(timestamp).format('HH:mm')}
            </Text>
            <View className="pl-2">
            <IconSymbol
                name="edit"
                size={22}
                color={isDark ? colors.dark.content.accent : colors.light.content.accent}
              />
            </View>
        </TouchableOpacity>
        {showDatePicker && 
          <DateTimePicker
            value={new Date(timestamp)}
            mode="date"
            display="default"
            onChange={(_, date) => setDate(date)}
          />}

          {showTimePicker && 
          <DateTimePicker
            value={new Date(timestamp)}
            mode="time"
            display="default"
            onChange={(_, time) => setTime(time)}
          />}
    </View>
  );
};

export default DateTimePickerComponent;