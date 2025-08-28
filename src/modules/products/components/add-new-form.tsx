import { PlusCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function AddNewProductForm({ className }: Props) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col h-full rounded-md bg-secondary/20 border border-foreground/5",
        className
      )}
    >
      <div className="flex-1 h-full">
        <ScrollArea className="h-[calc(100dvh-260px)]"></ScrollArea>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-foreground/5 flex-shrink-0">
        <Button variant="outline">Reset Form</Button>
        <Button icon={<PlusCircleIcon />}>Create Product</Button>
      </div>
    </div>
  );
}
