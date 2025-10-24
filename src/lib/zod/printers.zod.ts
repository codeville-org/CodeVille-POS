import { z } from "zod";
import { getBaseReturnSchema } from "./helpers";

export const printerInfoSchema = z.object({
  name: z.string(),
  description: z.string(),
  displayName: z.string()
});

export type PrinterInfo = z.infer<typeof printerInfoSchema>;

export const listPrintersSchema = z.object({
  printers: z.array(printerInfoSchema)
});

export const printReceiptSchema = z.object({
  // no need any values here, only needs success and error from the base return schema
});

// End-to-end Schema
export const listPrintersResponseSchema =
  getBaseReturnSchema(listPrintersSchema);

export type ListPrintersResponseT = z.infer<typeof listPrintersResponseSchema>;

export const printReceiptResponseSchema =
  getBaseReturnSchema(printReceiptSchema);

export type PrintReceiptResponseT = z.infer<typeof printReceiptResponseSchema>;
export type TestPrintResponseT = z.infer<typeof printReceiptResponseSchema>;
