import { Input } from "@/components/ui/input";
import { useBarcodeReader } from "@/hooks/use-barcode-reader";
import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

export interface BarcodeInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onScan?: (barcode: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  enableScanning?: boolean;
  enableSimulation?: boolean;
  simulationShortcut?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    key: string;
  };
  showScanButton?: boolean;
  showStatusIndicator?: boolean;
}

export function BarcodeInput({
  value = "",
  onChange,
  onScan,
  placeholder = "Enter or scan barcode...",
  className,
  disabled = false,
  enableScanning = true,
  enableSimulation = true,
  simulationShortcut = { ctrl: true, shift: true, key: "B" },
  showStatusIndicator = true
}: BarcodeInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [recentlyScanned, setRecentlyScanned] = useState(false);

  const { isScanning, lastScannedBarcode } = useBarcodeReader({
    enabled: enableScanning && !disabled,
    simulationEnabled: enableSimulation,
    simulationShortcut,
    onScan: (barcode) => {
      onChange?.(barcode);
      onScan?.(barcode);
      setRecentlyScanned(true);

      // Clear the "recently scanned" state after 3 seconds
      setTimeout(() => setRecentlyScanned(false), 3000);
    },
    onError: (error) => {
      console.warn("Barcode scan error:", error);
    }
  });

  // Update input when barcode is scanned
  useEffect(() => {
    if (lastScannedBarcode && enableScanning) {
      onChange?.(lastScannedBarcode);
    }
  }, [lastScannedBarcode, enableScanning, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
    setRecentlyScanned(false);
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative space-x-2 flex items-center rounded-md border transition-all duration-200",
          {
            "border-blue-500 ring-2 ring-blue-500/20":
              isFocused && !isScanning && !recentlyScanned,
            "border-orange-500 ring-2 ring-orange-500/20 bg-orange-50 dark:bg-orange-900/10":
              isScanning,
            "border-green-500 ring-2 ring-green-500/20 bg-green-50 dark:bg-green-900/10":
              recentlyScanned,
            "border-input": !isFocused && !isScanning && !recentlyScanned,
            "opacity-50 cursor-not-allowed": disabled
          }
        )}
      >
        <Input
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={
            isScanning
              ? "Scanning..."
              : recentlyScanned
                ? "Barcode scanned successfully!"
                : placeholder
          }
          disabled={disabled}
          className={cn(
            "border-0 w-full h-12 bg-white shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
            {
              "text-orange-700 dark:text-orange-300": isScanning,
              "text-green-700 dark:text-green-300": recentlyScanned
            }
          )}
        />

        <div className="flex items-center gap-1 pr-2">
          {/* Status Indicator */}
          {showStatusIndicator && (
            <div className="flex items-center">
              {isScanning && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-xs text-orange-600 dark:text-orange-400">
                    Scanning
                  </span>
                </div>
              )}
              {recentlyScanned && (
                <div className="flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Scanned
                  </span>
                </div>
              )}
              {!isScanning && !recentlyScanned && enableScanning && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-muted-foreground">Ready</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
