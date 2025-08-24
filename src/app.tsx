import { createRoot } from "react-dom/client";
import { Button } from "./components/ui/button";
import { Badge } from "@/components/ui/badge";
import { loadFonts } from "@/lib/fonts";
import { Wrapper } from "./components/layouts/wrapper";

// Load fonts when the app starts
loadFonts()
  .then(() => {
    console.log("Fonts loaded successfully");
  })
  .catch((error) => {
    console.error("Failed to load fonts:", error);
  });

const root = createRoot(document.body);

root.render(<Wrapper />);
