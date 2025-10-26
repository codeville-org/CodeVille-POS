import PageContainer from "@/components/layouts/dashboard/page-container";
import { AppPageShell } from "@/components/layouts/dashboard/page-shell";
import { Separator } from "@/components/ui/separator";
import { usePersistStore } from "@/lib/zustand/persist-store";
import { PasswordSection } from "@/modules/settings/components/password-section";
import { PrinterTest } from "@/modules/settings/components/printer-test";

type Props = {};

export function SettingsPage({}: Props) {
  const {} = usePersistStore();

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-col w-full h-full gap-4">
        <AppPageShell
          title={"Settings"}
          description={"Manage your application settings"}
          actionComponent={undefined}
        />

        <Separator />

        <PasswordSection />

        <PrinterTest />
      </div>
    </PageContainer>
  );
}
