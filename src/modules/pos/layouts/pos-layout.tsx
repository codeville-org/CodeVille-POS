import { Separator } from "@/components/ui/separator";
import { BarcodeReaderStatusBadge } from "../components/barcode-reader-status-badge";
import { CategoriesBar } from "../components/categories-bar";
import { RealtimeClock } from "../components/clock";
import { PrinterStatusBadge } from "../components/printer-status-badge";
import { ProductSearchInput } from "../components/product-search";
import { PosProductsListing } from "./pos-products-listing";
import { PosSidebar } from "./pos-sidebar";

type Props = {};

export function PosScreenLayout({}: Props) {
  return (
    <div className="flex h-full max-h-[calc(100vh-48px)]">
      <div className="flex-1 w-full h-full flex flex-col">
        {/* Header */}
        <div className="p-4 pb-2 shadow-none flex flex-col gap-6">
          <div className="flex items-center justify-between">
            {/* Store Name / Logo */}
            <div className="">
              <h1 className="font-black font-sans text-primary text-2xl">
                Dewmali Super
              </h1>
            </div>

            {/* Real-time Clock and Other Indicators */}
            <div className="flex items-center gap-2">
              <BarcodeReaderStatusBadge />
              <PrinterStatusBadge />
              <RealtimeClock />
            </div>
          </div>

          <ProductSearchInput />
        </div>

        <CategoriesBar />

        <Separator className="opacity-50" />

        <PosProductsListing />
      </div>

      <div className="w-96 h-full">
        <PosSidebar />
      </div>
    </div>
  );
}
