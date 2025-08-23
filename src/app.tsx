import { createRoot } from "react-dom/client";
import { Button } from "./components/ui/button";
import { Badge } from "@/components/ui/badge";

const root = createRoot(document.body);

root.render(
  <h2 className="text-2xl font-semibold text-cyan-600">
    <Badge>Hello</Badge> from React!
    <Button>Hello World</Button>
  </h2>
);
