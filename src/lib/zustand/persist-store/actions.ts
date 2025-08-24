import { Theme } from "@/shared/types/global";

// Electron Storage Functionality for Zustand Storage
export const electronStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("Failed to get item from localStorage: ", key);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("Failed to set item in localStorage:", error);
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to remove item from localStorage:", error);
    }
  }
};

// Theme Action Functions
export const applyTheme = (theme: Theme) => {
  const root = window.document.documentElement;

  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};
