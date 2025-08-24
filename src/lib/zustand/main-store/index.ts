import { create } from "zustand";
import { BearState } from "./types";

export const useMainStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by }))
}));
