import {
  BanknoteIcon,
  CreditCardIcon,
  EraserIcon,
  HandCoinsIcon,
  PrinterCheckIcon,
  TrashIcon
} from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice } from "@/lib/utils";
import { PaymentMethod } from "@/lib/zod/transactions.zod";
import { usePosStore } from "@/lib/zustand/pos-store";
import { useCompleteTransaction } from "../queries/use-complete-transaction";

type Props = {
  className?: string;
};

export function PosSidebarFooter({ className }: Props) {
  const [isClearModalOpen, setClearModalOpen] = useState<boolean>(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState<boolean>(false);

  const { mutate: completePurchase, isPending: completingPurchase } =
    useCompleteTransaction();
  const {
    getTransactionAmountOverview,
    activeTransaction,
    clearTransactionItems,
    setActiveTransaction
  } = usePosStore();
  const amountOverview = getTransactionAmountOverview();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );
  const [cashGiven, setCashGiven] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);

  const handleCashGivenChange = (value: number | null) => {
    setCashGiven(value);
    if (value !== null) {
      setChange(value - amountOverview.total);
    }
  };

  const handleCompletePurchase = () => {
    // First, Update zustand store with payment method, cash given etc.
    setActiveTransaction({
      ...activeTransaction,
      paymentMethod: paymentMethod,
      cashReceived: cashGiven,
      changeGiven: change,
      subtotalAmount: amountOverview.subtotal,
      taxAmount: amountOverview.tax,
      totalAmount: amountOverview.total,
      discountAmount: amountOverview.discount
    });

    // Then, call mutate to complete the transaction
    completePurchase();
  };

  return (
    <div>
      <div
        className={cn(
          "space-y-2 z-40 shadow-[0px_-6px_12px_-10px_rgba(0,_0,_0,_0.1)]",
          className
        )}
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <small>Subtotal</small>
            <small>{formatPrice(amountOverview.subtotal)}</small>
          </div>
          <div className="flex items-center justify-between">
            <small>Tax</small>
            <small>{formatPrice(amountOverview.tax)}</small>
          </div>
          <div className="flex items-center justify-between">
            <small>Discount</small>
            <small className="text-green-600">
              - {formatPrice(amountOverview.discount)}
            </small>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">Total</h4>
          <h4 className="text-lg font-semibold">
            {formatPrice(amountOverview.total)}
          </h4>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-1">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={
                paymentMethod === PaymentMethod.CASH ? "default" : "outline"
              }
              onClick={() => setPaymentMethod(PaymentMethod.CASH)}
              icon={<BanknoteIcon />}
              className={cn("hover:text-foreground shadow-none", {
                "bg-green-700 text-white hover:bg-green-800":
                  paymentMethod === PaymentMethod.CASH
              })}
              autoBlur
            >
              Cash
            </Button>
            <Button
              variant={
                paymentMethod === PaymentMethod.CARD ? "default" : "outline"
              }
              onClick={() => setPaymentMethod(PaymentMethod.CARD)}
              icon={<CreditCardIcon />}
              className={cn("hover:text-foreground shadow-none", {
                "bg-blue-700 text-white hover:bg-blue-800":
                  paymentMethod === PaymentMethod.CARD
              })}
              autoBlur
            >
              Card
            </Button>
            <Button
              disabled={!activeTransaction.customerId}
              variant={
                paymentMethod === PaymentMethod.LEND ? "default" : "outline"
              }
              onClick={() => setPaymentMethod(PaymentMethod.LEND)}
              icon={<HandCoinsIcon />}
              className={cn("hover:text-foreground shadow-none", {
                "bg-yellow-700 text-white hover:bg-yellow-800":
                  paymentMethod === PaymentMethod.LEND
              })}
              autoBlur
            >
              Credit
            </Button>
          </div>

          {paymentMethod === PaymentMethod.CASH && (
            <div className="flex items-center justify-between gap-3 mt-4 pb-1">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium text-foreground/80">
                  Cash Given
                </Label>
                <Input
                  type="number"
                  placeholder="Cash Given"
                  value={cashGiven ?? ""}
                  onChange={(e) =>
                    handleCashGivenChange(Number(e.target.value))
                  }
                  // Execute complete purchase on Enter key press
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCompletePurchase();
                    }
                  }}
                />
              </div>
              <div className="space-y-0.5">
                <Label className="text-xs font-medium text-foreground/80">
                  Change
                </Label>
                <Input
                  type="number"
                  placeholder="Change"
                  value={change ?? ""}
                  disabled
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button
            size="lg"
            className="w-full text-base"
            icon={<PrinterCheckIcon />}
            disabled={
              !activeTransaction ||
              amountOverview.total <= 0 ||
              (paymentMethod === PaymentMethod.CASH &&
                (!cashGiven || cashGiven < amountOverview.total))
            }
            onClick={handleCompletePurchase}
            loading={completingPurchase}
            autoBlur
          >
            Complete Purchase
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 shadow-none"
              icon={<EraserIcon />}
              onClick={() => setClearModalOpen(true)}
              autoBlur
            >
              Clear
            </Button>
            <Button
              variant="outline"
              className="flex-1 shadow-none"
              icon={<TrashIcon />}
              onClick={() => setCancelModalOpen(true)}
              autoBlur
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Clear Alert */}
      <AlertDialog open={isClearModalOpen} onOpenChange={setClearModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will clear all items in the cart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearTransactionItems();
                // Auto-blur to prevent barcode scanner interference
                setTimeout(() => {
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                }, 100);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Modal */}
      <AlertDialog open={isCancelModalOpen} onOpenChange={setCancelModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will reset the current transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setActiveTransaction(null);
                clearTransactionItems();
                // Auto-blur to prevent barcode scanner interference
                setTimeout(() => {
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                }, 100);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
