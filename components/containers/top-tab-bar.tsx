import { className } from '@/constants/classNames';
import React from 'react';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface Tab<T extends string> {
    id: T,
    title: string,
    children?: React.ReactNode
  }

interface TopTabBarProps<T extends string> extends ViewProps {
  tabs: Tab<T>[],
  selected: T,
  setSelected: React.Dispatch<React.SetStateAction<T>>
}


/**
 * This component supports a top tab bar
 * that can be styled like a regular view
 * displaying only the children of the tab for which tab.id === selected
 * selected should be a state variable from the parent component
 * @param param0 
 * @returns 
 */
const TopTabBar = <T extends string>({tabs, selected, setSelected, ...props} : TopTabBarProps<T>) => {
  return (
    <View {...props}>
      <View className="flex-row">
        {tabs.map((tab) =>
          <TouchableOpacity
              key={tab.id}
              className={twMerge("flex-1 items-center justify-center py-1 mb-4", tab.id === selected ? "border-b-4 border-light-content-accent dark:border-dark-content-accent" : "border-b border-light-outline-default dark:border-dark-outline-default")}
              onPress={() => setSelected(tab.id)}        
            >
            <Text className={twMerge(className.text.strong2, tab.id === selected ? "" : "font-normal")}>{tab.title}</Text>
          </TouchableOpacity>
        )}
      </View>
      {tabs.find((tab) => tab.id === selected)?.children ?? <></>}
    </View>
  )
};

export default TopTabBar;