import React from 'react';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';

interface CancelSubmitButtonsProps extends ViewProps {
  cancelName?: string;
  submitName?: string;
  onCancel: () => void;
  onSubmit: () => void;
};

const CancelSubmitButtons = ({
    cancelName = 'Cancel',
    submitName = 'Submit',
    onCancel,
    onSubmit,
    ...props
} : CancelSubmitButtonsProps) => {
  return (
   <View className="flex-row justify-between mt-4" {...props}>
        <TouchableOpacity className="flex-1 mx-1 p-1 rounded-md items-center justify-center" onPress={onCancel}>
            <Text className="text-xl text-light-content-primary dark:text-dark-content-primary">
            {cancelName}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 mx-1 p-1 rounded-md items-center justify-center"
            onPress={onSubmit}
        >
            <Text className="text-xl font-bold text-light-content-primary dark:text-dark-content-primary">
            {submitName}
            </Text>
        </TouchableOpacity>
    </View>
  );
};

export default CancelSubmitButtons;