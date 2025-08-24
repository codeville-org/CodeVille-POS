import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { applyTheme, electronStorage } from "./actions";
import type { Language, Theme } from "@/shared/types/global";
import type { PersistStoreState } from "./types";

export const usePersistStore = create<PersistStoreState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: "system",

      setTheme: (theme: Theme) => {
        set({ theme });
        applyTheme(theme);
      },

      initializeTheme: () => {
        const { theme } = get();
        applyTheme(theme);
      },

      // Language
      language: "en",

      setLanguage: (language: Language) => {
        set({ language });
      },

      initializeLanguage: () => {
        const { language } = get();
        set({ language });
      }
    }),
    {
      name: "persist-store",
      storage: createJSONStorage(() => electronStorage)
    }
  )
);
