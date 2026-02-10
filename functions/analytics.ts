import { Transaction } from "@/types/models";

/**
 * computes the proportion of the time span [transaction.spread_period_start, transaction.spread_period_end] that falls within [starttime, endtime]
 * @param transaction 
 * @param starttime start time in the format Date().getTime()
 * @param endtime end time in the format Date().getTime()
 * @returns returns described proportion (negative if endtime < starttime), or undefined if the spread period of the transaction cannot be computed
 */
export const computeSpreadProportion = (transaction : Transaction, starttime? : number, endtime?: number) : number | undefined => {
    const txstarttime = new Date(transaction.spread_period_start ?? "").getTime(); // this will be NaN if spread_period_start is invalid
    const txendtime = new Date(transaction.spread_period_end ?? "").getTime(); // this will be NaN if spread_period_end is invalid
    if(
        txstarttime && txendtime // check if any of them is NaN (note: 0 epoch is also falsy but unrealistic)
        && txendtime > txstarttime // is it sensible to spread?
    ) {
        const spreadstarttime = starttime ? Math.max(txstarttime, starttime) : txstarttime; 
        const spreadendtime = endtime ? Math.min(txendtime, endtime) : txendtime; 
        return (spreadendtime - spreadstarttime) / (txendtime - txstarttime);
    }
    else return undefined;
}

/**
 * computes the sum of transactions matching the category, whose timestamp is at least starttime and less than endtime, matching the given type
 * starttime, endtime and type are all optional. If not given, the corresponding condition is ignored/true
 * 
 * @param transactions list of transactions to filter
 * @param categoryId id of the relevant category. "uncategorized" for all transactions not assigned to a category, empty to include all categories
 * @param starttime start time of the period in the form Date.getTime()
 * @param endtime end time of the period in the form Date.getTime()
 * @param type consider only expenses or only income. Consider all if undefined
 * @param considerSpread set to true if the amount of transactions with handling_type==="spread" should be distributed uniformly across periods (depending on starttime, endtime, transaction.spread_period_start and transaction.spread_period_end)
 * @param categoryIdList only relevant if categoryId === "uncategorized". List of category id's to exclude
 * @returns the sum of transactions in this category between starttime and endtime
 */
export const categoryValue = (
    {
        transactions,
        categoryId,
        starttime,
        endtime,
        type,
        considerSpread = false,
        categoryIdList = []
    } : {
        transactions : Transaction[], 
        categoryId? : string, 
        starttime? : number, 
        endtime?: number, 
        type?: "expenses" | "income",
        considerSpread?: boolean,
        categoryIdList?: string[]
    }) : number => {            
        let catval = 0;
        for (const t of transactions) {
            // console.log(categoryId);
            const matchesCategory = !categoryId || (
                categoryId === "uncategorized" 
                // if "uncategorized", exclude all set categories
                ? (!t.category_id || !categoryIdList.includes(t.category_id))
                // else match category
                : (t.category_id && t.category_id === categoryId));
            const time = t.timestamp ? new Date(t.timestamp).getTime() : null;
            const isAfterStart = !starttime || (time && time >= starttime);
            const isBeforeEnd = !endtime || (time && time < endtime);
            const txvalue = parseFloat(t.amount);
            const matchesType =  txvalue && !( // observe that 0 is falsy
                (type === "expenses" && txvalue > 0) 
                || (type === "income" && txvalue < 0))

            if(
                matchesCategory
                && matchesType
            ) {
                if(considerSpread && t.handling_type === "spread") {
                    catval += (computeSpreadProportion(t, starttime, endtime) ?? 1) * txvalue;
                }
                else if(isAfterStart && isBeforeEnd) {
                    catval += txvalue;
                }
            }
        }
        return catval;
}

/**
 * computes a list of transactions for which handling_type === "spread", and the associated spread amounts
 * @param transactions a list of transactions to filter
 * @param starttime start time of the period in the form Date.getTime()
 * @param endtime end time of the period in the form Date.getTime()
 * @param type consider only expenses or only income. Consider all if undefined
 * @param categoryId if set, only transactions of this category are included
 * @returns a list of transactions with spread amounts. 
 * The list is sorted by transaction.timestamp.
 * The spread amount is the transaction.amount multiplied by the proportion of the period [transaction.spread_start_time, transaction.spread_end_time] that falls within [starttime, endtime]
 */
export const getIrregularTransactions = ({
    transactions, 
    starttime,
    endtime,
    type,
    categoryId,
    categoryIdList = []
} : {
    transactions: Transaction[], 
    starttime?: number,
    endtime?: number,
    type?: "expenses" | "income",
    categoryId?: string,
    categoryIdList?: string[]
}) : { transaction: Transaction, this_period_amount: number }[]  => {
    const irregularTransactions : { transaction: Transaction, this_period_amount: number }[] = [];
    
    for(const t of transactions) {
        const timestamptime = new Date(t.timestamp).getTime();
        const txvalue = parseFloat(t.amount);
        if(
            // after starttime
            (!starttime || timestamptime >= starttime)
            // before endtime
            && (!endtime || timestamptime < endtime)
            // nonzero existing value
            && txvalue
            // type matches the value
            && !((type === "expenses" && txvalue > 0) 
                || (type === "income" && txvalue < 0))
            // if category is unset, include all
            && (!categoryId || (
                categoryId === "uncategorized"
            // if category === "uncategorized", exclude all available categories
                ? !t.category_id || !categoryIdList.includes(t.category_id)
            // else match category exactly
                : t.category_id === categoryId))
            // it is a spread transaction
            && t.handling_type === "spread"
        ) {
            irregularTransactions.push({
                transaction: t,
                this_period_amount: (computeSpreadProportion(t, starttime, endtime) ?? 1) * txvalue
            })
        }
    }

    return irregularTransactions.sort((a,b) => new Date(a.transaction.timestamp).getTime() - new Date(b.transaction.timestamp).getTime());
}