import { CheckCircle2Icon, PrinterIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  minimal?: boolean;
};

export function PrinterStatusBadge({ minimal }: Props) {
  const [status, setStatus] = useState<boolean>(false);

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-9 flex items-center gap-2 px-3 py-2 font-sans rounded-full",
        {
          "bg-amber-600/10 hover:bg-amber-600/20 border-amber-600/30 text-amber-600":
            status,
          "bg-zinc-600/10 hover:bg-zinc-600/20 text-zinc-600": !status
        }
      )}
      // TODO: Remove line below
      onClick={() => setStatus(!status)}
    >
      <div className="relative">
        <PrinterIcon className="size-5" />

        {status ? (
          <>
            <div className="absolute z-30 -bottom-1 -right-1 w-fit h-fit bg-amber-500 flex items-center justify-center rounded-full">
              <CheckCircle2Icon className="size-3 text-white" />
            </div>
            <div className="absolute z-10 rounded-full -bottom-[3px] -right-[3px] size-[10px] bg-amber-500 animate-ping" />
          </>
        ) : (
          <>
            <div className="absolute z-30 -bottom-1 -right-1 w-fit h-fit bg-red-500 flex items-center justify-center rounded-full">
              <XCircleIcon className="size-3 text-white" />
            </div>
            {/* <div className="absolute z-10 rounded-full -bottom-[3px] -right-[3px] size-[10px] bg-red-500 animate-ping" /> */}
          </>
        )}
      </div>

      {!minimal && (
        <span className="font-sans text-xs">
          {status ? "Printer Active" : "Printer Inactive"}
        </span>
      )}
    </Badge>
  );
}
