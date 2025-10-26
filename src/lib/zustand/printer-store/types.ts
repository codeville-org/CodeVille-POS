export type PrinterStatus = "idle" | "printing";

export type BillItem = {
  transactionId: string;
};

export interface PrinterStoreInterface {
  // Bill Receipt Modal
  printerModalOpen: boolean;
  setPrinterModalOpen: (open: boolean) => void;

  // Printer Status
  printerStatus: PrinterStatus;
  setPrinterStatus: (status: PrinterStatus) => void;

  // Bill Queue (mostly - Only 1 Item for queue)
  currentItem: BillItem | null;
  setCurrentItem: (item: BillItem | null) => void;
}
