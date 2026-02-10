import ColorPicker from "@/components/elements/color-picker";
import { useState } from "react";
import CustomTextInput from "../elements/custom-text-input";
import InputDialog from "./input-dialog";

export default function CategoryInputDialog({
  visible,
  title,
  onCancel,
  onSubmit,
  showColorPicker = false,
}: {
  visible: boolean;
  title: string;
  onCancel: (...args: any[]) => any;
  onSubmit: (...args: any[]) => any;
  showColorPicker?: boolean;
}) {
  const [value, setValue] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  const handleSubmit = () => {
    if(!value.trim()) return;
    onSubmit(value, showColorPicker ? selectedColor : undefined);
    setValue("");
    if (showColorPicker) setSelectedColor(undefined);
  };

  return (
    <InputDialog 
      visible={visible}
      title={title}
      onCancel={onCancel}
      onSubmit={handleSubmit}
    >

    <CustomTextInput
      placeholder="Name"
      value={value}
      onChangeText={setValue}
      autoFocus={true}
    />

    {showColorPicker && (
      <ColorPicker
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />
    )}
    </InputDialog>
  );
}