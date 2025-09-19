import { BanknoteArrowDown, CalendarIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";
import { SelectTransactionSchema } from "@/lib/zod/transactions.zod";
import { TransactionActions } from "./transaction-actions";

type Props = {
  transaction: SelectTransactionSchema;
};

export function TransactionItem({ transaction }: Props) {
  return (
    <div className="group flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <BanknoteArrowDown className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
            #{transaction.transactionNumber}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarIcon className="h-3 w-3" />
            <span>{formatDate(transaction.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="">
          <Badge variant="destructive">
            {formatPrice(transaction.totalAmount)}
          </Badge>
        </div>
        <TransactionActions transaction={transaction} />
      </div>
    </div>
  );
}
