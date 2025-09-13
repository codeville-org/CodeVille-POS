import { ScanBarcodeIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePosStore } from "@/lib/zustand/pos-store";

type Props = {
  className?: string;
};

export function ProductSearchInput({ className }: Props) {
  const { searchMode, setSearchMode, searchTerm, setSearchTerm } =
    usePosStore();

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div
      className={cn(
        "h-14 border border-foreground/5 rounded-md bg-secondary/30 flex items-center justify-between overflow-hidden",
        className
      )}
    >
      <div className="h-full w-14 flex items-center justify-center">
        <SearchIcon className="size-7 text-foreground/30" />
      </div>
      <input
        placeholder="Ex: 323435634234 (Barcode) / Product Name"
        className="border-none h-full w-full flex-1"
        value={searchTerm}
        onChange={handleSearchTermChange}
      />

      <div className="w-14 h-full flex items-center justify-center">
        <Button
          size="icon"
          className={cn("shadow-none", {
            "bg-blue-600 hover:bg-blue-700 text-white":
              searchMode === "barcode",
            "bg-blue-600/10 hover:bg-blue-600/20 text-blue-600":
              searchMode === "manual"
          })}
          onClick={() => {
            if (searchMode === "barcode") setSearchMode("manual");
            if (searchMode === "manual") setSearchMode("barcode");
          }}
        >
          <ScanBarcodeIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}
