import { ListTodoIcon, ShoppingCartIcon } from "lucide-react";
import { useState } from "react";

import { Label } from "@/components/ui/label";
import { cn, formatPrice } from "@/lib/utils";
import { SelectCustomer } from "@/lib/zod/customers.zod";
import { usePosStore } from "@/lib/zustand/pos-store";
import { CustomersDropdown } from "@/modules/customers/components/customer-dropdown";
import { InitializeTransaction } from "../components/initialize-transaction";
import { SidebarTransactionItem } from "../components/sidebar-transaction-item";
import { useUpdateCustomer } from "../queries/use-update-customer";

type Props = {};

export function PosSidebar({}: Props) {
  const { transactionItems, activeTransaction, listingView, setListingView } =
    usePosStore();
  const { mutate: mutateCustomerUpdate, isPending: customerUpdating } =
    useUpdateCustomer();

  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectCustomer | null>(null);

  return (
    <div className="w-full h-full flex flex-col bg-secondary/30 border-l border-sidebar-border overflow-hidden">
      {/* Customer Selection - Fixed */}
      <div className="flex-shrink-0 space-y-3 p-4 bg-sidebar border-b border-sidebar-border/30">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-foreground/70">
              Customer
            </Label>
            {selectedCustomer && (
              <Label
                className="text-xs font-light text-foreground/60 hover:text-foreground/80 underline cursor-pointer"
                onClick={() => {
                  setSelectedCustomer(null);
                  mutateCustomerUpdate(null);
                }}
              >
                Clear Selection
              </Label>
            )}
          </div>
          <CustomersDropdown
            defaultSelected={selectedCustomer}
            onSelect={(customer) => {
              setSelectedCustomer(customer);
              mutateCustomerUpdate(customer ? customer.id : null);
            }}
            loading={customerUpdating}
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
      <div className="flex-1 h-full overflow-hidden">
        {!activeTransaction ? (
          <div className="flex-1 h-full shrink-0 flex items-center justify-center p-6">
            <div className="text-center w-full flex items-center justify-center flex-col gap-3">
              <div className="p-3 rounded-full bg-secondary/20 mx-auto w-fit">
                <ShoppingCartIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  No Active Transaction
                </p>
                <p className="text-xs text-muted-foreground">
                  Initialize new Transaction here
                </p>
              </div>

              <InitializeTransaction variant="outline" />
            </div>
          </div>
        ) : transactionItems.length < 1 ? (
          <div className="flex-1 h-full shrink-0 flex items-center justify-center p-6">
            <div className="text-center space-y-3">
              <div className="p-3 rounded-full bg-secondary/20 mx-auto w-fit">
                <ShoppingCartIcon className="w-8 h-8 text-muted-foreground" />
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
          <div className="flex flex-col gap-3 p-3">
            <div className="w-full flex items-center justify-between">
              <Label className="text-base font-semibold">Cart Items</Label>
              {listingView === "listing" && (
                <Label
                  onClick={() => setListingView("billing")}
                  className="cursor-pointer text-xs text-foreground/80 hover:text-foreground"
                >
                  <ListTodoIcon className="size-4" /> Table View
                </Label>
              )}
            </div>

            <div className="space-y-2">
              {transactionItems.map((item) => (
                <SidebarTransactionItem key={item.productId} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
