import { create } from "zustand";

import { loginHandler } from "./actions";
import type { SecurityStoreInterface } from "./types";

export const useSecurityStore = create<SecurityStoreInterface>()(
  (set, get) => ({
    isAuthenticated: false,
    latestLoginFootprint: null,

    validateAuth: () => {
      // If not authenticated
      if (!get().isAuthenticated) {
        return {
          success: false,
          message: "Not Authenticated"
        };
      }

      // If Authenticated & latestLoginFootprint is null or exceeding 24 hours, logout
      const latestLoginFootprint = get().latestLoginFootprint;

      if (
        !latestLoginFootprint ||
        new Date().getTime() - latestLoginFootprint.getTime() >
          24 * 60 * 60 * 1000
      ) {
        set({ isAuthenticated: false, latestLoginFootprint: null });
      }

      return { success: true, message: "Authenticated" };
    },

    login: async (password) => {
      const handlerResponse = await loginHandler(password);

      if (handlerResponse !== null) {
        set({ isAuthenticated: true, latestLoginFootprint: new Date() });

        return {
          success: true,
          message: "Login Successful"
        };
      }

      return {
        success: false,
        message: "Sorry, Password is Incorrect !"
      };
    },

    logout: () => {
      set({ isAuthenticated: false, latestLoginFootprint: null });

      return {
        success: true,
        message: "Logout Successful"
      };
    }
  })
);
