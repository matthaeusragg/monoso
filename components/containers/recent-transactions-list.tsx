import { className } from "@/constants/classNames";
import colors from "@/constants/nativewindColors";
import { useCategories } from "@/context/category-context";
import { useTransactions } from "@/context/transaction-context";
import { Transaction } from "@/types/models";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import { useColorScheme, View } from "react-native";
import RenderItemTransactionContent from "../elements/render-item-transaction-content";

interface RecentTransactionsListProps extends Omit<FlashListProps<Transaction>,'data' | 'renderItem' | 'keyExtractor'> {
    numberOfTransactions?: number;
}

export default function RecentTransactionsList({numberOfTransactions=3, ...props} : RecentTransactionsListProps) {
    const { categories } = useCategories(); 
    const isDarkMode = useColorScheme() === "dark";
    const {transactions} = useTransactions();

    const renderItem = ({ item } : { item: Transaction }) => {
        return (
        <View
            className={className.item}
            style={{
                backgroundColor:
                categories.find((c) => c.id === item.category_id)?.color ??
                (isDarkMode ? colors.dark.content.accent : colors.light.content.accent),
            }}
        >
            <RenderItemTransactionContent
                nametext={item.name}
                amounttext={item.amount}
            />
        </View>
    )};


    const data = transactions
        .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0,numberOfTransactions);

    return(
        <FlashList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            className={`rounded-2xl`}
            {...props}
        />
    );
}