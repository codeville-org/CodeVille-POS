import {
  listPrintersController,
  printReceiptController,
  testPrintController
} from "@/controllers/print.controller";
import { createHandler } from "./create-handler";

const handler = createHandler("print");

export const printerHandler = {
  register() {
    handler.handle("listPrinters", listPrintersController);
    handler.handle("printReceipt", printReceiptController);
    handler.handle("testPrint", testPrintController);
  }
};
