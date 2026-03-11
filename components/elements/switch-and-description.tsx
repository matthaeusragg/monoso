import { className } from '@/constants/classNames';
import colors from '@/constants/nativewindColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Switch, Text, View } from 'react-native';

const SwitchAndDescription = ({value, setValue, description} : {value: boolean, setValue: React.Dispatch<React.SetStateAction<boolean>>, description: string}) => {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return (
    <View className="flex-row justify-between items-center pb-3">
            <View className="flex-1">
            <Text className={className.text.subheading}>
              {description}
            </Text>
            </View>
            <Switch
              trackColor={{
                true: colors[colorScheme].content.softAccent,
                false: colors[colorScheme].content.medium,
              }}
              thumbColor={value 
                ? colors[colorScheme].content.accent
                : colors[colorScheme].content.light
              }
              value={value} 
              onValueChange={(v) => setValue(v)}
            />
          </View>
  );
};

export default SwitchAndDescription;