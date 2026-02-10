import { className } from '@/constants/classNames';
import React from 'react';
import { FallbackProps } from "react-error-boundary";
import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const FallbackComponent = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <SafeAreaView className={`${className.container} justify-center px-8`} style={{paddingBottom: 25}}>
      <Text className={className.text.heading2}>
        Something went wrong
      </Text>
      <Text className={className.text.paragraph}>
            An unexpected error has been caught.
        </Text>
      {error instanceof Error ? (<>
        <ScrollView className="m-3 rounded-2xl flex-grow-0">
            <View className="p-2">
            <Text className={className.text.subheading}>{error.name}: {error.message}</Text>
            </View>
        </ScrollView>
        </>) : (
            <Text className={className.text.paragraph}>
                Failed to read the error.
            </Text>
        )
      }
      <TouchableOpacity className={`${className.button.end}`} onPress={resetErrorBoundary}>
        <Text className={className.text.subheading}>Retry</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FallbackComponent;

// 