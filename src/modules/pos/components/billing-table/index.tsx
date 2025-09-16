import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect } from "react";

import { cn, formatPrice } from "@/lib/utils";
import { usePosStore } from "@/lib/zustand/pos-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { UninitializedTransactionItem } from "@/lib/zod/transactions.zod";

type Props = {
  className?: string;
};

export function BillingTable({ className }: Props) {
  const {
    setListingView,
    transactionItems,
    changeTransactionItemQuantity,
    removeTransactionItem,
    activeTransaction,
    setDiscountAmount,
    setTaxAmount
  } = usePosStore();

  useEffect(() => {
    // If active transaction got "null", set listing view to "listing"
    if (!activeTransaction) {
      setListingView("listing");
    }
  }, [activeTransaction]);

  const handleChangeQuantity = (
    item: UninitializedTransactionItem,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Check any characters except numbers in value
    const value = e.target.value;
    let newQuantity = isNaN(Number(value)) ? 1 : Number(value);
    if (newQuantity === 0) {
      newQuantity = 1;
    }

    changeTransactionItemQuantity(item.productId, newQuantity);
  };

  return (
    <div className={cn("flex-1 flex flex-col h-full", className)}>
      <div className="flex-1 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-secondary/50 dark:bg-secondary/30 text-sm text-foreground/60">
              <TableHead className="py-3 pl-5">Product</TableHead>
              <TableHead className="py-3">Unit Price</TableHead>
              <TableHead className="py-3">Quantity</TableHead>
              <TableHead className="py-3">Unit</TableHead>
              <TableHead className="py-3 text-right">Amount</TableHead>
              <TableHead className="py-3 text-right pr-5">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="flex-1 flex-shrink-0">
            {transactionItems.map((item) => (
              <TableRow key={item.productId} className="text-base">
                <TableCell className="py-3 pl-5">{item.productName}</TableCell>
                <TableCell className="py-3">
                  {formatPrice(item.unitPrice)}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-1">
                    <Button
                      className="p-1 rounded-sm size-7"
                      size="icon"
                      onClick={() =>
                        changeTransactionItemQuantity(
                          item.productId,
                          item.quantity - 1
                        )
                      }
                    >
                      <MinusIcon />
                    </Button>

                    <div className="w-14 h-full border-b border-dashed border-sidebar-border/90">
                      <input
                        value={item.quantity}
                        onChange={(e) => handleChangeQuantity(item, e)}
                        className="text-base w-full h-full text-center text-foreground"
                      />
                    </div>

                    <Button
                      className="p-1 rounded-sm size-7"
                      size="icon"
                      onClick={() =>
                        changeTransactionItemQuantity(
                          item.productId,
                          item.quantity + 1
                        )
                      }
                    >
                      <PlusIcon />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="py-3">{item.unit}</TableCell>
                <TableCell className="py-3 text-right font-semibold">
                  {formatPrice(item.totalAmount)}
                </TableCell>
                <TableCell className="py-3 text-right pr-5 flex items-center justify-end">
                  <Button
                    className="p-1 rounded-sm size-7 bg-red-500 text-white hover:bg-red-600/80 flex items-center justify-center"
                    size="icon"
                    onClick={() => removeTransactionItem(item.productId)}
                  >
                    <TrashIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Billing Footer */}
      <div className="flex-shrink-0 border-t border-border/20 bg-secondary/40 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-foreground/80">Discount Price</Label>
            <Input
              className="h-12"
              placeholder="Bill Discount"
              value={activeTransaction?.discountAmount || ""}
              onChange={(e) => {
                setDiscountAmount(Number(e.target.value));
              }}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-foreground/80">Tax Amount</Label>
            <Input
              className="h-12"
              placeholder="Tax Amount"
              value={activeTransaction?.taxAmount || ""}
              onChange={(e) => {
                setTaxAmount(Number(e.target.value));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
