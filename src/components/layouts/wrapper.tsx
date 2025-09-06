import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

import { CONSTANTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { usePersistStore } from "@/lib/zustand/persist-store";
import { LanguageSelector } from "../elements/language-selector";
import { AppSidebar } from "./dashboard/app-sidebar";
import { WindowActions } from "./dashboard/window-actions";
import { AppRouter } from "./router";

export function Wrapper() {
  const { language } = usePersistStore();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <main
      className={cn(
        "min-h-screen w-screen overflow-hidden",
        language === "si" && "font-sinhala"
      )}
    >
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-10 border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center h-full w-full gap-2 px-4">
              <SidebarTrigger className="-ml-1" />

              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />

              <div className="h-full w-full flex items-center justify-between">
                {/* NOTE: Add "app-dragger" if dragging feature needed */}
                <div className="flex-1 ">
                  <h2 className="font-semibold text-foreground/80 text-sm">
                    <span
                      className={cn(
                        language === "si" ? "font-sinhala text-xs" : "font-sans"
                      )}
                    >
                      {CONSTANTS.STORE_NAME[language]}
                    </span>

                    <span className="font-light text-xs">
                      {" - Point of Sales System"}
                    </span>
                  </h2>
                </div>

                <div className="flex items-center gap-2 h-full">
                  <LanguageSelector />

                  <Separator
                    className="mx-2 data-[orientation=vertical]:h-4"
                    orientation="vertical"
                  />

                  <WindowActions />
                </div>
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col h-[calc(100vh-2.5rem)] overflow-hidden">
            <AppRouter />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
