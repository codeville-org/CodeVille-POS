import PageContainer from "@/components/layouts/dashboard/page-container";
import { AppPageShell } from "@/components/layouts/dashboard/page-shell";
import { Separator } from "@/components/ui/separator";
import { TEXTS } from "@/lib/language";
import { usePersistStore } from "@/lib/zustand/persist-store";
import { ProductForm } from "@/modules/products/components/product-form";

type Props = {};

export function NewProductPage({}: Props) {
  const { language } = usePersistStore();

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-col w-full h-full gap-4">
        <AppPageShell
          title={TEXTS.products.addNew.title[language]}
          description={TEXTS.products.addNew.description[language]}
          actionComponent={undefined}
        />

        <Separator />

        <ProductForm mode="create" />
      </div>
    </PageContainer>
  );
}
