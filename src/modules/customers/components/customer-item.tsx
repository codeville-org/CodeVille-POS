import { PhoneIcon, User2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { SelectCustomer } from "@/lib/zod/customers.zod";
import { ListingView } from "@/shared/types/global";
import { CustomerActions } from "./customer-actions";

type Props = {
  view?: ListingView;
  customer: SelectCustomer;
};

export function CustomerItem({ view = "list", customer }: Props) {
  if (view === "grid") {
    return (
      <Card className="p-4 rounded-md shadow-none hover:shadow-md transition-shadow group bg-secondary/10">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <User2Icon className="h-5 w-5" />
            </div>

            <CustomerActions view={view} customer={customer} />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
              {customer.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <PhoneIcon className="h-3 w-3" />
              <span>
                {customer.phone || customer.address || (
                  <span className="text-muted-foreground text-xs">
                    No contact information
                  </span>
                )}
              </span>
            </div>
          </div>

          <Separator />

          <div className="">
            <Badge
              variant="outline"
              className="p-1.5 px-3"
            >{`Balance: ${formatPrice(customer.currentBalance)}`}</Badge>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="group flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <User2Icon className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
            {customer.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <PhoneIcon className="h-3 w-3" />
            <span>
              {customer.phone || customer.address || (
                <span className="text-muted-foreground text-xs">
                  No contact information
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="gap-3 flex items-center">
        <Badge
          variant="outline"
          className="p-1.5 px-3"
        >{`Loan Balance: ${formatPrice(customer.currentBalance)}`}</Badge>
        <CustomerActions view={view} customer={customer} />
      </div>
    </div>
  );
}
