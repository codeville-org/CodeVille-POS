import { MoonIcon, SunIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePersistStore } from "@/lib/zustand/persist-store";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";

type Props = {
  className?: string;
};

export function ThemeToggle({ className }: Props) {
  const { theme, setTheme } = usePersistStore();
  const { state } = useSidebar();

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (state === "expanded") {
    return (
      <div className="flex items-center justify-between w-full">
        <span className="flex items-center gap-2 text-xs normal-case">
          {theme === "dark" ? (
            <SunIcon className="size-4" />
          ) : (
            <MoonIcon className="size-4" />
          )}
          {`Theme`} {`(${theme})`}
        </span>

        <Switch
          id="theme"
          checked={theme === "dark"}
          onCheckedChange={handleToggleTheme}
        />
      </div>
    );
  }

  return (
    <Button
      size={"icon"}
      variant="ghost"
      className={cn("", className)}
      onClick={handleToggleTheme}
    >
      {theme === "dark" ? (
        <SunIcon className="size-4" />
      ) : (
        <MoonIcon className="size-4" />
      )}
    </Button>
  );
}
