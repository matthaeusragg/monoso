import { className } from '@/constants/classNames';
import colors from '@/constants/nativewindColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

interface ExpandableRowProps extends React.PropsWithChildren<ViewProps> {
  title: string,
  expanded_initially?: boolean
}

const ExpandableRow = ({children, title, expanded_initially=false, ...props} : ExpandableRowProps) => {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [ expanded, setExpanded ] = useState(expanded_initially);
  return (
    <View {...props}>
        <TouchableOpacity
            className="flex-row items-center py-1 my-3 border-b border-light-outline-default dark:border-dark-outline-default"
            onPress={() => setExpanded(!expanded)}        
        >
            <Text className={className.text.paragraph}>{title}</Text>
            <IconSymbol size={28} name = {expanded ? "chevron.up" : "chevron.down"} color={colors[colorScheme].content.secondary}/>     
        </TouchableOpacity>
        {expanded && children}
    </View>
  )
};

export default ExpandableRow;