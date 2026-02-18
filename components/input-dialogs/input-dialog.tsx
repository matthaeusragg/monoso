import { className } from "@/constants/classNames";
import colors from "@/constants/nativewindColors";
import React, { PropsWithChildren } from "react";
import { Modal, Pressable, Text, useColorScheme, View } from "react-native";
import { twMerge } from "tailwind-merge";
import CancelSubmitButtons from "../elements/cancel-submit-buttons";

type DialogProps = PropsWithChildren<{
    visible : boolean;
    title? : string;
    onCancel: (...args: any[]) => any;
    onSubmit: (...args: any[]) => any;
    cancelName? : string;
    submitName? : string;
}>

export default function InputDialog({ 
  children,
  visible,
  title,
  onCancel,
  ...props
} : DialogProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <Modal visible={visible} transparent onRequestClose={onCancel} animationType="fade">
      <View className="flex-1 justify-center items-center px-4">
        {/* Background overlay */}
        <Pressable
          className="absolute inset-0 bg-light-surface-transparent dark:bg-dark-surface-transparent"
          onPress={onCancel}
        />
        {/* Dialog */}
        <View
          className="w-[85%] max-h-[90%] rounded-2xl p-6"
          style={{
            backgroundColor: isDark
              ? colors.dark.surface.elevated
              : colors.light.surface.elevated,
          }}
        >
            {title && (<Text className={twMerge(className.text.heading3, "mb-4")}>
                {title}
            </Text>)}
            
            {children}

        
          <CancelSubmitButtons onCancel={onCancel} {...props}/>
        </View>
      </View>
    </Modal>
  );
}
