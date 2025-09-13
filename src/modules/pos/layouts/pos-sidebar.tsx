import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { SelectCustomer } from "@/lib/zod/customers.zod";
import { usePosStore } from "@/lib/zustand/pos-store";
import { CustomersDropdown } from "@/modules/customers/components/customer-dropdown";

type Props = {};

export function PosSidebar({}: Props) {
  const { activeTransaction } = usePosStore();
  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectCustomer | null>(null);

  const handleResetAndInitializeTransaction = () => {};

  return (
    <div className="w-full h-full flex-1 flex flex-col bg-sidebar/50 dark:bg-sidebar/40 border-l border-sidebar-border">
      <div className="space-y-2 p-3 bg-sidebar border-b border-sidebar-border/30">
        <p className="text-sm font-semibold text-foreground/70">Customer</p>

        <CustomersDropdown
          onSelect={(customer) => setSelectedCustomer(customer)}
        />

        {selectedCustomer && (
          <p className="text-xs text-foreground/70">
            {selectedCustomer.name} - Current Balance{" "}
            <span className="font-semibold text-green-600">
              {formatPrice(selectedCustomer.currentBalance)}
            </span>
          </p>
        )}
      </div>

      <div className="flex-1 w-full">
        Cart Items
        {!activeTransaction && (
          <Button variant="outline">Start Transaction</Button>
        )}
      </div>

      <div className="border-t border-sidebar-border/30 bg-sidebar p-3">
        <div className="space-y-1">
          <p className="text-xs">Subtotal :</p>
          <p className="text-xs">Discount :</p>
          <p className="text-xs">Tax :</p>
        </div>

        <Separator className="my-3" />

        <p className="text-lg font-semibold">Total :</p>

        <div className="mt-2 space-y-1">
          <h2 className="text-xs font-semibold text-foreground/70">
            Payment Method
          </h2>
          <div className="w-full flex items-center gap-2">
            <Button className="flex-1 shadow-none" variant="outline">
              Cash
            </Button>
            <Button className="flex-1 shadow-none" variant="outline">
              Card
            </Button>
            <Button className="flex-1 shadow-none" variant="outline">
              Credit
            </Button>
          </div>
        </div>

        <Button className="w-full mt-3">Complete Payment</Button>
      </div>
    </div>
  );
}
