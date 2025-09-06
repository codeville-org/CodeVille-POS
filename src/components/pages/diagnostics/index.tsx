import { DiagnosticsPanel } from "@/components/diagnostics/diagnostics-panel";

export function DiagnosticsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
        <h1 className="text-2xl font-bold mb-4">System Diagnostics</h1>
        <p className="text-muted-foreground mb-6">
          This panel helps you debug issues and get system information,
          especially useful for troubleshooting packaged applications.
        </p>
        <DiagnosticsPanel />
      </div>
    </div>
  );
}
