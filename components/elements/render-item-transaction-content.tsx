import { className } from '@/constants/classNames';
import React from 'react';
import { Text, View } from 'react-native';

const RenderItemTransactionContent = ({nametext, amounttext} : {nametext : string, amounttext : string}) => {
  return (
    <View className="flex-row justify-between w-full">
        <Text 
            className={`flex-1 ${className.text.item}`}
            numberOfLines={1}
            ellipsizeMode="tail"
        >
            {nametext}
        </Text>
        <Text className={`ml-2 ${className.text.item}`}>
            {amounttext}
        </Text>
    </View>
  );
};

export default RenderItemTransactionContent;