import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { UninitializedTransactionItem } from "@/lib/zod/transactions.zod";
import { usePosStore } from "@/lib/zustand/pos-store";

type Props = {
  item: UninitializedTransactionItem;
};

export function SidebarTransactionItem({ item }: Props) {
  const { removeTransactionItem } = usePosStore();
  const { changeTransactionItemQuantity } = usePosStore();

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check any characters except numbers in value
    const value = e.target.value;
    let newQuantity = isNaN(Number(value)) ? 1 : Number(value);
    if (newQuantity === 0) {
      newQuantity = 1;
    }

    changeTransactionItemQuantity(item.productId, newQuantity);
  };

  return (
    <Card className="px-2 py-3 bg-sidebar/60 dark:bg-secondary/60 flex flex-col gap-3 shadow-none rounded-md">
      <div className="w-full flex items-center justify-between">
        <p className="text-xs whitespace-nowrap truncate">{item.productName}</p>
        <Button
          className="p-1 rounded-full size-6 bg-transparent text-red-500 hover:bg-red-500 hover:text-white"
          size="icon"
          onClick={() => removeTransactionItem(item.productId)}
        >
          <TrashIcon />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            className="p-1 rounded-full size-5"
            size="icon"
            onClick={() =>
              changeTransactionItemQuantity(item.productId, item.quantity - 1)
            }
          >
            <MinusIcon />
          </Button>

          <input
            value={item.quantity}
            onChange={handleChangeQuantity}
            className="text-sm w-10 text-center text-foreground"
          />

          <Button
            className="p-1 rounded-full size-5"
            size="icon"
            onClick={() =>
              changeTransactionItemQuantity(item.productId, item.quantity + 1)
            }
          >
            <PlusIcon />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <p>
            <span className="text-sm text-red-500 font-semibold">
              {formatPrice(item.totalAmount)}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}
