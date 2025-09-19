import PageContainer from "@/components/layouts/dashboard/page-container";
import { AppPageShell } from "@/components/layouts/dashboard/page-shell";
import { Separator } from "@/components/ui/separator";
import { TEXTS } from "@/lib/language";
import { usePersistStore } from "@/lib/zustand/persist-store";
import { TransactionListing } from "@/modules/transactions/components/transaction-listing";

type Props = {};

export function TransactionsPage({}: Props) {
  const { language } = usePersistStore();

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-col w-full h-full gap-4">
        <AppPageShell
          title={TEXTS.transactions.title[language]}
          description={TEXTS.transactions.subtitle[language]}
          actionComponent={undefined}
        />

        <Separator />

        <TransactionListing className="flex-1" />
      </div>
    </PageContainer>
  );
}
