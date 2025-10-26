import { create } from "zustand";
import { PrinterStatus, PrinterStoreInterface } from "./types";

export const usePrinterStore = create<PrinterStoreInterface>()((set) => ({
  // Modal State
  printerModalOpen: false,
  setPrinterModalOpen: (open: boolean) => set({ printerModalOpen: open }),

  // Printer Status State
  printerStatus: "idle",
  setPrinterStatus: (status: PrinterStatus) => set({ printerStatus: status }),

  // Bill Item State
  currentItem: null,
  setCurrentItem: (item) => set({ currentItem: item })
}));
