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
    <Card className="px-2 py-3 bg-white dark:bg-secondary/60 flex flex-col gap-3 shadow-none rounded-md">
      <div className="w-full flex items-center justify-between">
        <p className="text-[13px] font-semibold whitespace-nowrap truncate">
          {item.productName}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            className="p-1 rounded-full size-6 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
            size="icon"
            onClick={() => removeTransactionItem(item.productId)}
          >
            <TrashIcon />
          </Button>

          <div className="bg-secondary/40 flex items-center h-7">
            <button
              className="size-7 bg-secondary text-secondary-foreground flex items-center justify-center rounded-l-md hover:bg-secondary-foreground/30 cursor-pointer"
              onClick={() =>
                changeTransactionItemQuantity(item.productId, item.quantity - 1)
              }
            >
              <MinusIcon className="size-3" />
            </button>

            <input
              value={item.quantity}
              onChange={handleChangeQuantity}
              className="text-sm h-7 w-10 text-center text-foreground bg-secondary/40 focus:outline-none"
            />

            <div className="size-7 text-sm bg-secondary/40 text-secondary-foreground flex items-center justify-center">
              {item.unit}
            </div>

            <button
              className="size-7 bg-secondary text-secondary-foreground flex items-center justify-center rounded-r-md hover:bg-secondary-foreground/30 cursor-pointer"
              onClick={() =>
                changeTransactionItemQuantity(item.productId, item.quantity + 1)
              }
            >
              <PlusIcon className="size-3" />
            </button>
          </div>
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
