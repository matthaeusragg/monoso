import { IconSymbol } from "@/components/ui/icon-symbol"; // adjust path if needed
import colors from "@/constants/nativewindColors";
import { useRef, useState } from "react";
import { TextInput, TextInputProps, TouchableOpacity, useColorScheme, View } from "react-native";

interface CustomTextInputProps extends TextInputProps {}

export default function CustomTextInput({ value, onChangeText, ...props }: CustomTextInputProps) {
  const isDark = useColorScheme() === "dark";
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const hasValue = !!value;

  const enterEditMode = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const exitEditMode = () => {
    setIsEditing(false);
    inputRef.current?.blur();
  };

  return (
    <View className="flex-row items-center">
      <TouchableOpacity
        activeOpacity={1}
        onPress={enterEditMode}
        className="flex-1"
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={exitEditMode}
          onBlur={exitEditMode}
          returnKeyType="done"
          editable={isEditing}
          {...props}
          className={`
            p-3 rounded-xl mb-3 mt-1 
            text-light-content-primary dark:text-dark-content-primary
            ${(isEditing || !hasValue) ? "border border-light-content-primary dark:border-dark-content-primary" : "border-0"}
          `}
          placeholderTextColor={
            isDark
              ? colors.dark.content.tertiary
              : colors.light.content.tertiary
          }
        />
      </TouchableOpacity>

      {/* ICON AREA */}
      {hasValue && (
        <TouchableOpacity
          onPress={isEditing ? exitEditMode : enterEditMode}
          className="ml-2"
        >
          {isEditing ? (
            <IconSymbol
              size={22}
              name="done"
              color={
                isDark
                  ? colors.dark.content.accent
                  : colors.light.content.accent
              }
            />
          ) : (
            <IconSymbol
              size={22}
              name="edit"
              color={
                isDark
                  ? colors.dark.content.accent
                  : colors.light.content.accent
              }
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
