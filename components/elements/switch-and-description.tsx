import { className } from '@/constants/classNames';
import colors from '@/constants/nativewindColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Switch, Text, View } from 'react-native';

const SwitchAndDescription = ({value, setValue, description} : {value: boolean, setValue: React.Dispatch<React.SetStateAction<boolean>>, description: string}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View className="flex-row justify-between items-center pb-3">
            <View className="flex-1">
            <Text className={className.text.subheading}>
              {description}
            </Text>
            </View>
            <Switch
              trackColor={{
                true: colors[isDarkMode ? 'dark' : 'light'].content.softAccent,
                false: colors[isDarkMode ? 'dark' : 'light'].content.medium,
              }}
              thumbColor={value 
                ? colors[isDarkMode ? 'dark' : 'light'].content.accent
                : colors[isDarkMode ? 'dark' : 'light'].content.light
              }
              value={value} 
              onValueChange={(v) => setValue(v)}
            />
          </View>
  );
};

export default SwitchAndDescription;