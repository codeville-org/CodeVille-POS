import { CircleDollarSignIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePosStore } from "@/lib/zustand/pos-store";

type Props = {
  className?: string;
};

export function InitializeTransaction({ className }: Props) {
  const { activeTransaction } = usePosStore();

  const handleInitialize = () => {};

  if (activeTransaction) return null;

  return (
    <Button
      onClick={handleInitialize}
      icon={<CircleDollarSignIcon />}
      className={cn(className, "rounded-full shadow-none")}
    >
      New Transaction
    </Button>
  );
}
