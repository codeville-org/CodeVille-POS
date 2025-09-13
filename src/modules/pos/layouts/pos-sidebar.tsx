import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn, formatPrice } from "@/lib/utils";
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
        Cart Items
        {!activeTransaction && (
          <Button variant="outline">Start Transaction</Button>
        )}
      </div>
    </div>
  );
}
