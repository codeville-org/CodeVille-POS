import { usePersistStore } from "@/lib/zustand/persist-store";
import { Theme } from "@/shared/types/global";
import React, { useEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "persist-store",
  ...props
}: ThemeProviderProps) {
  const { initializeTheme } = usePersistStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return <div {...props}>{children}</div>;
}
