import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Language, Theme } from "@/shared/types/global";
import { applyTheme, electronStorage } from "./actions";
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
      },

      storeSettings: {
        storeName: "",
        storeLogo: "",
        contactPhone: "",
        address: ""
      },
      setStoreSettings: (settings) => {
        set({ storeSettings: settings });
      }
    }),
    {
      name: "persist-store",
      storage: createJSONStorage(() => electronStorage)
    }
  )
);
