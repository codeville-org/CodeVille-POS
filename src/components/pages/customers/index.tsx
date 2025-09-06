import PageContainer from "@/components/layouts/dashboard/page-container";
import { AppPageShell } from "@/components/layouts/dashboard/page-shell";
import { Separator } from "@/components/ui/separator";
import { TEXTS } from "@/lib/language";
import { usePersistStore } from "@/lib/zustand/persist-store";
import { CreateCustomerForm } from "@/modules/customers/components/create-customer";
import { CustomersListing } from "@/modules/customers/components/customers-listing";

type Props = {};

export function CustomersPage({}: Props) {
  const { language } = usePersistStore();

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-col w-full h-full gap-4">
        <AppPageShell
          title={TEXTS.customers.title[language]}
          description={TEXTS.customers.subtitle[language]}
          actionComponent={<CreateCustomerForm />}
        />

        <Separator />

        <CustomersListing className="flex-1" />
      </div>
    </PageContainer>
  );
}
