import { Language, Theme } from "@/shared/types/global";

export interface PersistStoreState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;

  // Language
  language: Language;
  setLanguage: (language: Language) => void;
  initializeLanguage: () => void;
}
