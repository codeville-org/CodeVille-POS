import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";

import { AppSidebar } from "./dashboard/app-sidebar";
import { CONSTANTS } from "@/lib/constants";
import { WindowActions } from "./dashboard/window-actions";

export function Wrapper() {
  return (
    <main className="min-h-screen w-screen">
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
                    {CONSTANTS.STORE_NAME["en"]}
                    <span className="font-light text-xs">
                      {" - Point of Sales System"}
                    </span>
                  </h2>
                </div>

                <WindowActions />
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
