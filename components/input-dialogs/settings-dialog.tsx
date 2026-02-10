import { className } from "@/constants/classNames";
import { useSettings } from "@/context/settings-context";
import { periodLengths } from "@/types/models";
import { useState } from "react";
import { Text } from "react-native";
import CustomTextInput from "../elements/custom-text-input";
import DateTimePickerComponent from "../elements/date-time-picker-component";
import StyledPicker from "../elements/styled-picker";
import SwitchAndDescription from "../elements/switch-and-description";
import InputDialog from "./input-dialog";

export default function SettingsDialog({
  visible,
  title,
  onCancel,
  onSubmit,
}: {
  visible: boolean;
  title: string;
  onCancel: (...args: any[]) => any;
  onSubmit: (...args: any[]) => any;
}) {
  const { settings, setStartDate, setPeriodLength, setAnalyseIncomeInstead, setSpreadIrregularTransactions, setDefaultCurrency } = useSettings();
  const [startDate, setLocalDate] = useState(settings.startDate);
  const [periodLength, setLocalPeriodLength ] = useState(settings.periodLength);
  const [defaultCurrency, setLocalDefaultCurrency] = useState(settings.defaultCurrency);
  const [analyseIncomeInstead, setLocalAnalyseIncomeInstead] = useState(settings.analyseIncomeInstead);
  const [spreadIrregularTransactions, setLocalSpreadIrregularTransactions] = useState(settings.spreadIrregularTransactions);

  const handleSubmit = () => {
    setStartDate(startDate);
    setPeriodLength(periodLength);
    setDefaultCurrency(defaultCurrency);
    setAnalyseIncomeInstead(analyseIncomeInstead);
    setSpreadIrregularTransactions(spreadIrregularTransactions);
    onSubmit();
  };

  return (
    <InputDialog 
      visible={visible}
      title={title}
      onCancel={onCancel}
      onSubmit={handleSubmit}
    >

      <Text className={className.text.subheading}>
        Start date and time for one analysis period
      </Text>
      <DateTimePickerComponent
          timestamp={startDate}
          setTimestamp={(val) => setLocalDate(val)}
        />

      <Text className={className.text.subheading}>
        Length of one analysis period
      </Text>

      <StyledPicker
        selectedValue={periodLength}
        onValueChange={(val) => setLocalPeriodLength(val)}
      >
        {periodLengths.map((c) => (
          <StyledPicker.Item key={c} label={c} value={c} />
        ))}
      </StyledPicker>

      <SwitchAndDescription
        value={analyseIncomeInstead}
        setValue={setLocalAnalyseIncomeInstead}
        description="Analyse income instead?"
        />

      <SwitchAndDescription
        value={spreadIrregularTransactions}
        setValue={setLocalSpreadIrregularTransactions}
        description="Spread irregular transactions across time period?"
        />

      <Text className={className.text.subheading}>
        Default currency symbol
      </Text>
      <CustomTextInput
        placeholder="Default currency symbol"
        value={defaultCurrency}
        onChangeText={setLocalDefaultCurrency}
        />
    </InputDialog>
  );
}