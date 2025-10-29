import {
  getDefaultPrinterController,
  listPrintersController,
  printPOSDataController,
  printReceiptController,
  testPrintController,
  validatePrinterController
} from "@/controllers/print.controller";
import { createHandler } from "./create-handler";

const handler = createHandler("print");

export const printerHandler = {
  register() {
    handler.handle("listPrinters", listPrintersController);
    handler.handle("printReceipt", printReceiptController);
    handler.handle("testPrint", testPrintController);
    handler.handle("printPOSData", printPOSDataController);
    handler.handle("validatePrinter", validatePrinterController);
    handler.handle("getAvailablePrinters", getDefaultPrinterController);
  }
};
