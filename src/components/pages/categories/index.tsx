import PageContainer from "@/components/layouts/dashboard/page-container";
import { AppPageShell } from "@/components/layouts/dashboard/page-shell";
import { Separator } from "@/components/ui/separator";
import { TEXTS } from "@/lib/language";
import { usePersistStore } from "@/lib/zustand/persist-store";
import { CategoryListing } from "@/modules/categories/components/category-listing";
import { CreateCategoryForm } from "@/modules/categories/components/create-category";

type Props = {};

export function CategoriesPage({}: Props) {
  const { language } = usePersistStore();

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-col w-full h-full gap-4">
        <AppPageShell
          title={TEXTS.categories.title[language]}
          description={TEXTS.categories.subtitle[language]}
          actionComponent={undefined}
        />

        <Separator />

        <CreateCategoryForm />

        <CategoryListing className="flex-1" />
      </div>
    </PageContainer>
  );
}
