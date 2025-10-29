/*
 * POS Printer Library - Main Export
 * Adapted for CodeVille POS
 */

export {
  PageSize,
  PaperSize,
  PosPrintData,
  PosPrintOptions,
  PosPrintPosition,
  PosPrintTableField,
  PosPrintType,
  PrintDataStyle,
  PrinterInfo,
  PrintJobStatus,
  SizeOptions
} from "./models";
export { PosPrinter } from "./pos-printer";
export {
  applyElementStyles,
  createTableElement,
  generatePageText,
  generateTableCell,
  renderImageToPage,
  renderNotSupportedElement
} from "./renderer-utils";
export {
  calculateTimeout,
  convertPixelsToMicrons,
  isBase64,
  isValidHttpUrl,
  parsePaperSize,
  parsePaperSizeInMicrons,
  sendIpcMsg,
  validatePrintOptions
} from "./utils";
