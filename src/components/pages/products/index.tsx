import PageContainer from "@/components/layouts/dashboard/page-container";
import { AppPageShell } from "@/components/layouts/dashboard/page-shell";
import { Separator } from "@/components/ui/separator";
import { TEXTS } from "@/lib/language";
import { usePersistStore } from "@/lib/zustand/persist-store";
import { ProductsListing } from "@/modules/products/components/products-listing";

type Props = {};

export function ProductsInventoryPage({}: Props) {
  const { language } = usePersistStore();

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-col w-full h-full gap-4">
        <AppPageShell
          title={TEXTS.products.title[language]}
          description={TEXTS.products.subtitle[language]}
          actionComponent={undefined}
        />

        <Separator />

        <ProductsListing className="flex-1" />
      </div>
    </PageContainer>
  );
}
