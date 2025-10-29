import { BarcodeReaderStatusBadge } from "@/components/elements/barcode-reader-status-badge";
import { PrinterStatusBadge } from "@/components/elements/printer-status-badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useElectronAPI } from "@/hooks/use-electron-api";
import { PosPrintData, PosPrintOptions } from "@/lib/printer/models";
import { usePosStore } from "@/lib/zustand/pos-store";
import { toast } from "sonner";
import { BillingTable } from "../components/billing-table";
import { CategoriesBar } from "../components/categories-bar";
import { InitializeTransaction } from "../components/initialize-transaction";
import { ListingViewSwitcher } from "../components/listing-view-switcher";
import { PrinterProvider } from "../components/printer-provider";
import { ProductSearchInput } from "../components/product-search";
import { PosProductsListing } from "./pos-products-listing";
import { PosSidebar } from "./pos-sidebar";

type Props = {};

export function PosScreenLayout({}: Props) {
  const { listingView, activeTransaction } = usePosStore();
  const electronAPI = useElectronAPI();

  // Test function for POS printer
  const testPOSPrinter = async () => {
    try {
      // Sample test data
      const data: PosPrintData[] = [
        {
          type: "text",
          value: "<center>CODEVILLE POS TEST</center>",
          style: { fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }
        },
        {
          type: "text",
          value: "<center>XPrinter Test</center>",
          style: { fontSize: "14px", marginBottom: "10px" }
        },
        {
          type: "text",
          value: "Date: " + new Date().toLocaleDateString(),
          style: { marginBottom: "5px" }
        },
        {
          type: "text",
          value: "Time: " + new Date().toLocaleTimeString(),
          style: { marginBottom: "10px" }
        },
        {
          type: "text",
          value: "<center>Printer connection test successful!</center>",
          style: { fontWeight: "bold" }
        }
      ];

      const options: PosPrintOptions = {
        printerName: "XP-80C",
        pageSize: "80mm",
        preview: false,
        silent: false,
        copies: 1,
        timeOutPerLine: 400
      };

      toast.promise(electronAPI.print.printPOSData(data, options), {
        loading: "Printing test receipt...",
        success: "Test receipt printed successfully!",
        error: (err) => `Print failed: ${err.error || err.message}`
      });
    } catch (error) {
      toast.error("Test print error: " + (error as Error).message);
    }
  };

  return (
    <div className="flex h-[calc(100vh-48px)] max-h-[calc(100vh-48px)] overflow-hidden">
      <PrinterProvider />

      {/* Left Panel - Products */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 pb-2 shadow-none">
          <div className="flex items-center justify-between mb-6">
            {/* Store Name / Logo */}
            <div>
              <h1 className="font-black font-sans text-primary text-2xl">
                Dewmali Super
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={testPOSPrinter} size="sm" variant="outline">
                Test POS Printer
              </Button>
              <BarcodeReaderStatusBadge minimal />
              <PrinterStatusBadge minimal />
              {activeTransaction && <ListingViewSwitcher />}
              <InitializeTransaction />
            </div>
          </div>

          <ProductSearchInput />
        </div>

        {listingView === "listing" && (
          <>
            {/* Categories Bar - Fixed */}
            <div className="flex-shrink-0">
              <CategoriesBar />
              <Separator className="opacity-50" />
            </div>

            {/* Products Listing - Scrollable */}
            <div className="flex-1 overflow-hidden">
              <PosProductsListing />
            </div>
          </>
        )}

        {listingView === "billing" && (
          <BillingTable className="flex-shrink-0 flex-1 overflow-hidden mt-5" />
        )}
      </div>

      {/* Right Panel - Cart/Sidebar - Fixed width */}
      <div className="w-96 h-full flex-shrink-0">
        <PosSidebar />
      </div>
    </div>
  );
}
