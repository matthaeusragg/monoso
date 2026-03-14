import colors from '@/constants/nativewindColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Picker, PickerProps } from '@react-native-picker/picker';
import React from 'react';

const StyledPicker = ({children, ...props}  : PickerProps) => {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return (
    <Picker
        style={{
            color: colors[colorScheme].content.primary,
        }}
        dropdownIconColor={ colors[colorScheme].content.primary}
        {...props}
      >
        {children}
      </Picker>
  );
};

// this way, StyledPicker.Item is exactly the same as Picker.Item in files using StyledPicker
StyledPicker.Item = Picker.Item;

export default StyledPicker;