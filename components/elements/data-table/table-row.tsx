import { SelectableTransaction, Transaction } from "@/types/models";
import { Text, View } from "react-native";
import { Checkbox } from "react-native-paper";

interface RowProps {
  header?: boolean;
  transactions?: SelectableTransaction[];
  transaction?: SelectableTransaction;
  onToggle?: () => void;
}

interface Column {
  title: string,
  transactionKey: keyof Transaction,
  width: string,
  maxWidth: string
}

export const TableRow: React.FC<RowProps> = ({
  header,
  transactions,
  transaction,
  onToggle,
}) => {
  // Determine if all transactions are selected for the header checkbox
  const isAllSelected = transactions!.length > 0 && transactions!.every((item) => item.selected);
  const isSomeSelected = transactions!.some((item) => item.selected) && !isAllSelected;
  
  // Define the column structure
  const columns : Column[] = [
    { title: 'Name', transactionKey: 'name', width: "w-48", maxWidth: "max-w-[200px]" },
    { title: 'Amount', transactionKey: 'amount', width: "w-32", maxWidth: "" },
    { title: 'Currency', transactionKey: 'currency', width: "w-28", maxWidth: "" },
    { title: 'Timestamp', transactionKey: 'timestamp', width: "w-40", maxWidth: "max-w-[180px]" },
    { title: 'Beneficiary', transactionKey: 'beneficiary', width: "w-48", maxWidth: "max-w-[220px]" },
    { title: 'Reference', transactionKey: 'payment_reference', width: "w-56", maxWidth: "max-w-[260px]" },
    { title: 'Further information', transactionKey: 'further_information', width: "w-64", maxWidth: "max-w-[300px]"},
    // You can add more columns here
  ];

  return (
    <View
      className={`flex-row items-center border-b border-light-outline-default dark:border-dark-outline-default ${
        header ? "bg-light-surface-sunken dark:bg-dark-surface-sunken" : "bg-light-surface-main dark:bg-dark-surface-main"
      }`}
    >
      {/* Selected */}
      <Cell width="w-16">
        {header ? (
          <Checkbox
            status={isAllSelected ? 'checked' : isSomeSelected ? 'indeterminate' : 'unchecked'}
            onPress={onToggle}
          />
        ) : (
          <Checkbox
            status={transaction!.selected ? 'checked' : 'unchecked'}
            onPress={onToggle}
          />
        )}
      </Cell>


      {columns.map((column) => (
        <Cell 
        key={column.transactionKey} 
        width={column.width} 
        maxWidth={column.maxWidth}
        >
          <Text 
          numberOfLines={1} 
          className={header ? "font-semibold text-light-content-primary dark:text-dark-content-primary" : "text-light-content-secondary dark:text-dark-content-secondary"}
          >
            {header 
            ? column.title 
            : transaction!.transaction[column.transactionKey] ?? "—"}
          </Text>
        </Cell>  
      ))}
    </View>
  );
};

interface CellProps {
  children: React.ReactNode;
  width?: string;
  maxWidth?: string;
}

const Cell: React.FC<CellProps> = ({
  children,
  width = "w-32",
  maxWidth,
}) => {
  return (
    <View
      className={`px-2 py-3 justify-center ${width} ${
        maxWidth ?? ""
      }`}
    >
      {children}
    </View>
  );
};