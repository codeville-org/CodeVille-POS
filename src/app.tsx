import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";

import { loadFonts } from "@/lib/fonts";
import { Wrapper } from "./components/layouts/wrapper";
import { QueryProvider } from "./components/providers/query-provider";
import { ThemeProvider } from "./components/providers/theme-provider";
import { Toaster } from "./components/ui/sonner";

// Load fonts when the app starts
loadFonts()
  .then(() => {
    console.log("Fonts loaded successfully");
  })
  .catch((error) => {
    console.error("Failed to load fonts:", error);
  });

const root = createRoot(document.body);

root.render(
  <ThemeProvider defaultTheme="system">
    <QueryProvider>
      <MemoryRouter initialEntries={["/"]} initialIndex={0}>
        <Wrapper />

        <Toaster position="bottom-center" />
      </MemoryRouter>
    </QueryProvider>
  </ThemeProvider>
);
