import { createRoot } from "react-dom/client";
import { Button } from "./components/ui/button";
import { Badge } from "@/components/ui/badge";
import { loadFonts } from "@/lib/fonts";

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
  <div className="p-8 space-y-4">
    <h2 className="text-2xl font-semibold text-cyan-600 font-sans">
      <Badge>Hello</Badge> from React with DM Sans!
      <Button>Hello World</Button>
    </h2>
    <h3 className="text-xl font-semibold text-purple-600 font-sinhala">
      සිංහල පාඨය Noto Sans සමඟ (Sinhala text with Noto Sans)
    </h3>
    <div className="space-y-2">
      <p className="font-sans">
        This is English text using DM Sans font family.
      </p>
      <p className="font-sinhala">
        මෙය සිංහල පාඨයකි Noto Sans අකුරු වර්ගය භාවිතා කරමින්.
      </p>
    </div>
  </div>
);
