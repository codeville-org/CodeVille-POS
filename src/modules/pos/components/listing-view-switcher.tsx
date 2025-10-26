import { ListIcon, ReceiptIcon } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { usePosStore } from "@/lib/zustand/pos-store";

type Props = {};

export function ListingViewSwitcher({}: Props) {
  const { activeTransaction, setListingView, listingView } = usePosStore();

  useEffect(() => {
    if (!activeTransaction) {
      setListingView("listing");
    }
  }, [activeTransaction]);

  const handleToggleView = () => {
    setListingView(listingView === "listing" ? "billing" : "listing");
  };

  return (
    <Button
      onClick={handleToggleView}
      variant="secondary"
      icon={listingView !== "billing" ? <ReceiptIcon /> : <ListIcon />}
      className="rounded-full"
      autoBlur
    >
      {listingView === "listing"
        ? "Switch to Billing View"
        : "Switch to Listing View"}
    </Button>
  );
}
