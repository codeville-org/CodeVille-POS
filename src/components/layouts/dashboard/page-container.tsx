import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-5px)] ">
          <div className="flex flex-1 p-6">{children}</div>
        </ScrollArea>
      ) : (
        <div className="flex flex-1 max-h-[calc(100dvh-5px)] p-6 overflow-hidden">
          {children}
        </div>
      )}
    </>
  );
}
