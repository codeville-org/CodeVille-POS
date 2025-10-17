import { CheckCircleIcon, ScanBarcodeIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePosStore } from "@/lib/zustand/pos-store";

type Props = {
  className?: string;
};

export function ProductSearchInput({ className }: Props) {
  const {
    searchMode,
    setSearchMode,
    searchTerm,
    setSearchTerm,
    lastScannedProduct,
    setLastScannedProduct
  } = usePosStore();

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    // Clear the last scanned product when user starts typing manually
    if (e.target.value && lastScannedProduct) {
      setLastScannedProduct(null);
    }
  };

  const handleModeToggle = () => {
    if (searchMode === "barcode") {
      setSearchMode("manual");
      // Clear scanned product when switching to manual mode
      if (lastScannedProduct) {
        setLastScannedProduct(null);
      }
    } else {
      setSearchMode("barcode");
    }
  };

  // Display scanned product name when in barcode mode and product was scanned
  const displayValue =
    searchMode === "barcode" && lastScannedProduct && !searchTerm
      ? lastScannedProduct.name
      : searchTerm || "";

  const isShowingScannedProduct =
    searchMode === "barcode" && lastScannedProduct && !searchTerm;

  // Dynamic placeholder based on mode and state
  const getPlaceholder = () => {
    if (isShowingScannedProduct) {
      return "Scanned product - start typing to search manually";
    }
    if (searchMode === "barcode") {
      return "Scan barcode or press Ctrl+Shift+S to simulate";
    }
    return "Search by product name...";
  };

  return (
    <div
      className={cn(
        "h-14 border border-foreground/5 rounded-md bg-secondary/30 flex items-center justify-between overflow-hidden transition-all duration-200",
        {
          "border-green-500/30 bg-green-50 dark:bg-green-900/10":
            isShowingScannedProduct
        },
        className
      )}
    >
      <div className="h-full w-14 flex items-center justify-center">
        {isShowingScannedProduct ? (
          <CheckCircleIcon className="size-7 text-green-600" />
        ) : (
          <SearchIcon className="size-7 text-foreground/30" />
        )}
      </div>
      <input
        placeholder={getPlaceholder()}
        className={cn(
          "border-none h-full w-full flex-1 bg-transparent transition-colors duration-200",
          {
            "text-green-700 dark:text-green-400 font-medium":
              isShowingScannedProduct
          }
        )}
        value={displayValue}
        onChange={handleSearchTermChange}
        autoFocus
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
          onClick={handleModeToggle}
        >
          <ScanBarcodeIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}
