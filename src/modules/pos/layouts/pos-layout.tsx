import { BarcodeReaderStatusBadge } from "@/components/elements/barcode-reader-status-badge";
import { PrinterStatusBadge } from "@/components/elements/printer-status-badge";
import { Separator } from "@/components/ui/separator";
import { usePosStore } from "@/lib/zustand/pos-store";
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
