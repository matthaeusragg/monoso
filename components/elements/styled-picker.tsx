import colors from '@/constants/nativewindColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Picker, PickerProps } from '@react-native-picker/picker';
import React from 'react';

interface StyledPickerProps extends PickerProps {
  color?: string;
}

const StyledPicker = ({children, color = colors[useColorScheme() === 'dark' ? 'dark' : 'light'].content.primary, ...props}  : StyledPickerProps) => {
  return (
    <Picker
        style={{
            color: color,
        }}
        dropdownIconColor={color}
        {...props}
      >
        {children}
      </Picker>
  );
};

// this way, StyledPicker.Item is exactly the same as Picker.Item in files using StyledPicker
StyledPicker.Item = Picker.Item;

export default StyledPicker;