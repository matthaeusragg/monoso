import { CATEGORY_COLORS } from "@/constants/categoryColors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

interface ColorPickerProps {
  selectedColor?: string;
  onSelectColor: (color: string) => void;
}

export default function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(selectedColor || undefined);

  const isDarkMode = useColorScheme() === "dark";
  const handleSelect = (color: string) => {
    setCurrentColor(color);
    onSelectColor(color);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 mb-2">
      {CATEGORY_COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => handleSelect(color)}
          style={{
            backgroundColor: color,
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: currentColor === color ? 3 : 0,
            borderColor: "#000",
          }}
        >
          {currentColor === color && (
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: "#fff",
              }}
            />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}