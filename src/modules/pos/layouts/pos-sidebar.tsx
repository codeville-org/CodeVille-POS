import { Minus, Plus, Receipt, ShoppingCart, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice } from "@/lib/utils";
import { PaymentMethod } from "@/lib/zod/transactions.zod";
import { usePosStore } from "@/lib/zustand/pos-store";
import { CustomersDropdown } from "@/modules/customers/components/customer-dropdown";

type Props = {};

export function PosSidebar({}: Props) {
  const {
    selectedCustomer,
    setSelectedCustomer,
    transactionItems,
    updateTransactionItem,
    removeTransactionItem,
    clearTransactionItems,
    paymentMethod,
    setPaymentMethod,
    cashReceived,
    setCashReceived,
    discountAmount,
    setDiscountAmount,
    taxRate,
    setTaxRate,
    getSubtotal,
    getTaxAmount,
    getTotal,
    getChangeAmount
  } = usePosStore();

  const subtotal = getSubtotal();
  const taxAmount = getTaxAmount();
  const total = getTotal();
  const changeAmount = getChangeAmount();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeTransactionItem(productId);
    } else {
      const item = transactionItems.find(
        (item) => item.productId === productId
      );
      if (item) {
        updateTransactionItem(productId, { quantity: newQuantity });
      }
    }
  };

  const handleCompletePayment = () => {
    // TODO: Implement transaction completion
    console.log("Complete payment", {
      items: transactionItems,
      customer: selectedCustomer,
      paymentMethod,
      cashReceived,
      total,
      changeAmount
    });
  };

  const isPaymentValid = () => {
    if (transactionItems.length === 0) return false;
    if (paymentMethod === PaymentMethod.CASH && cashReceived < total)
      return false;
    if (paymentMethod === PaymentMethod.LEND && !selectedCustomer) return false;
    return true;
  };

  return (
    <div className="w-full h-full flex flex-col bg-sidebar/50 dark:bg-sidebar/40 border-l border-sidebar-border overflow-hidden">
      {/* Customer Selection - Fixed */}
      <div className="flex-shrink-0 space-y-3 p-4 bg-sidebar border-b border-sidebar-border/30">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground/70">
            Customer
          </Label>
          <CustomersDropdown
            defaultSelected={selectedCustomer}
            onSelect={setSelectedCustomer}
          />
          {selectedCustomer && (
            <p className="text-xs text-foreground/70">
              {selectedCustomer.name} • Balance:{" "}
              <span
                className={cn(
                  "font-semibold",
                  selectedCustomer.currentBalance >= 0
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {formatPrice(selectedCustomer.currentBalance)}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Cart Items - Scrollable */}
      <div className="flex-1 overflow-hidden">
        {transactionItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center space-y-3">
              <div className="p-3 rounded-full bg-secondary/20 mx-auto w-fit">
                <ShoppingCart className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cart is empty
                </p>
                <p className="text-xs text-muted-foreground">
                  Add products to start a transaction
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {transactionItems.map((item) => (
                <Card
                  key={item.productId}
                  className="shadow-none border-border/50"
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Item Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {item.productName}
                          </h4>
                          {item.productBarcode && (
                            <p className="text-xs text-muted-foreground">
                              {item.productBarcode}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeTransactionItem(item.productId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {formatPrice(item.unitPrice)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {formatPrice(item.totalAmount)}
                        </Badge>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium min-w-[3ch] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Totals and Payment - Fixed */}
      <div className="flex-shrink-0 border-t border-sidebar-border/30 bg-sidebar">
        <div className="p-4 space-y-4">
          {/* Discount and Tax Inputs */}
          {transactionItems.length > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="discount" className="text-xs">
                    Discount
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    value={discountAmount}
                    onChange={(e) =>
                      setDiscountAmount(Number(e.target.value) || 0)
                    }
                    className="h-8 text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tax" className="text-xs">
                    Tax %
                  </Label>
                  <Input
                    id="tax"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                    className="h-8 text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {transactionItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Discount:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              {taxAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tax ({taxRate}%):</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          )}

          {/* Payment Method */}
          {transactionItems.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground/70">
                Payment Method
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={
                    paymentMethod === PaymentMethod.CASH ? "default" : "outline"
                  }
                  size="sm"
                  className="text-xs"
                  onClick={() => setPaymentMethod(PaymentMethod.CASH)}
                >
                  Cash
                </Button>
                <Button
                  variant={
                    paymentMethod === PaymentMethod.LEND ? "default" : "outline"
                  }
                  size="sm"
                  className="text-xs"
                  onClick={() => setPaymentMethod(PaymentMethod.LEND)}
                >
                  Credit
                </Button>
              </div>
              {paymentMethod === PaymentMethod.LEND && !selectedCustomer && (
                <p className="text-xs text-red-600">
                  Please select a customer for credit payment
                </p>
              )}
            </div>
          )}

          {/* Cash Payment Input */}
          {paymentMethod === PaymentMethod.CASH &&
            transactionItems.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="cashReceived" className="text-xs">
                  Cash Received
                </Label>
                <Input
                  id="cashReceived"
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(Number(e.target.value) || 0)}
                  className="h-9"
                  placeholder={formatPrice(total)}
                />
                {cashReceived > total && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Change:</span>
                    <span>{formatPrice(changeAmount)}</span>
                  </div>
                )}
              </div>
            )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {transactionItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={clearTransactionItems}
              >
                Clear Cart
              </Button>
            )}
            <Button
              className="w-full"
              disabled={!isPaymentValid()}
              onClick={handleCompletePayment}
            >
              <Receipt className="w-4 h-4 mr-2" />
              Complete Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
