import { loadFonts } from "@/lib/fonts";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Wrapper } from "./components/layouts/wrapper";
import { ThemeProvider } from "./components/providers/theme-provider";

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
    <BrowserRouter>
      <Wrapper />
    </BrowserRouter>
  </ThemeProvider>
);
