import { className } from '@/constants/classNames';
import React, { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

type HeaderProps = PropsWithChildren<{
    name? : string;
}>

const CustomHeader = ({ children, name} : HeaderProps) => {
  return (
    <View className={className.header}>
        <Text className={className.text.heading1}>{name}</Text>
        <View className="flex-row mb-1">
          {children}
        </View>
      </View>
      );
};

export default CustomHeader;