# POS Printer Implementation - CodeVille POS

## Overview

This implementation brings the functionality of the `electron-pos-printer` library directly into your CodeVille POS project, adapted for your specific webpack and TypeScript configuration. This eliminates dependency issues and allows for direct troubleshooting.

## Features Implemented

✅ **Text Printing** - Basic text with HTML formatting and custom styling
✅ **Image Printing** - Base64 and URL-based images with positioning
✅ **Table Printing** - Header, body, footer with custom styling
❌ **Barcode Printing** - Skipped as requested
❌ **QR Code Printing** - Skipped as requested

## File Structure

```
src/lib/printer/
├── index.ts              # Main exports
├── models.ts             # TypeScript interfaces and types
├── pos-printer.ts        # Main PosPrinter class
├── utils.ts              # Utility functions
└── renderer-utils.ts     # HTML rendering utilities

assets/
└── print-template.html   # Print template for rendering

src/controllers/print.controller.ts   # Enhanced with POS functions
src/ipc/printer-handler.ts           # IPC handlers
src/shared/types/ipc.ts              # Updated IPC types
```

## Usage Examples

### 1. Basic Text Printing

```typescript
import { useElectronAPI } from "@/hooks/use-electron-api";
import { PosPrintData, PosPrintOptions } from "@/lib/printer/models";

const electronAPI = useElectronAPI();

const printBasicText = async () => {
  const data: PosPrintData[] = [
    {
      type: "text",
      value: "<center>STORE NAME</center>",
      style: { fontSize: "18px", fontWeight: "bold" }
    },
    {
      type: "text",
      value: "Receipt #12345",
      style: { marginBottom: "10px" }
    }
  ];

  const options: PosPrintOptions = {
    printerName: "XP-80C",
    pageSize: "80mm",
    preview: false,
    silent: false
  };

  const result = await electronAPI.print.printPOSData(data, options);
  console.log(result);
};
```

### 2. Table Printing

```typescript
const printTable = async () => {
  const data: PosPrintData[] = [
    {
      type: "table",
      tableHeader: ["Item", "Qty", "Price"],
      tableBody: [
        ["Product 1", "2", "$10.00"],
        ["Product 2", "1", "$5.50"]
      ],
      tableFooter: ["Total", "", "$15.50"],
      style: { width: "100%" }
    }
  ];

  const options: PosPrintOptions = {
    printerName: "XP-80C",
    pageSize: "80mm"
  };

  await electronAPI.print.printPOSData(data, options);
};
```

### 3. Image Printing

```typescript
const printWithImage = async () => {
  const data: PosPrintData[] = [
    {
      type: "image",
      url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...", // Base64 image
      width: "200px",
      height: "100px",
      position: "center"
    },
    {
      type: "text",
      value: "<center>Logo printed above</center>"
    }
  ];

  const options: PosPrintOptions = {
    printerName: "XP-80C",
    pageSize: "80mm"
  };

  await electronAPI.print.printPOSData(data, options);
};
```

## Available Methods

### electronAPI.print

- `printPOSData(data, options)` - Main printing method
- `validatePrinter(printerName)` - Check if printer is available
- `getAvailablePrinters()` - Get list of system printers
- `listPrinters()` - Legacy method (still available)
- `testPrint(printerName)` - Original test print method

## Paper Sizes Supported

- `44mm` - Very small receipts
- `57mm` - Small receipts
- `58mm` - Standard small
- `76mm` - Medium receipts
- `78mm` - Medium+ receipts
- `80mm` - Standard thermal (recommended for XP-80C)

## Print Options

```typescript
interface PosPrintOptions {
  printerName?: string; // Printer name (required for actual printing)
  pageSize?: PaperSize; // Paper size (default: "80mm")
  preview?: boolean; // Show preview window (default: false)
  silent?: boolean; // Print silently (default: false)
  copies?: number; // Number of copies (default: 1)
  timeOutPerLine?: number; // Timeout per line in ms (default: 400)
  margins?: object; // Custom margins
  // ... other Electron print options
}
```

## Testing

1. **Test Button Added**: A "Test POS Printer" button has been added to the POS page header for quick testing.

2. **Manual Testing**:

   ```typescript
   // Test printer connection
   const result = await electronAPI.print.validatePrinter("XP-80C");
   console.log(result.available); // true if connected

   // Preview mode (opens window instead of printing)
   const options = { printerName: "XP-80C", preview: true };
   await electronAPI.print.printPOSData(data, options);
   ```

## Troubleshooting Connection Issues

### Common Issues:

1. **"[TimedOutError] Make sure your printer is connected"**
   - Check USB/network connection
   - Verify printer is powered on
   - Test with `validatePrinter()` method
   - Try increasing `timeOutPerLine` option

2. **Printer not found**
   - Use `getAvailablePrinters()` to see available printers
   - Check exact printer name spelling
   - Ensure printer drivers are installed

3. **Permission Issues**
   - Run application as administrator (Windows)
   - Check printer sharing settings

### Debug Steps:

```typescript
// 1. List all available printers
const printers = await electronAPI.print.getAvailablePrinters();
console.log("Available printers:", printers);

// 2. Validate specific printer
const validation = await electronAPI.print.validatePrinter("XP-80C");
console.log("Printer available:", validation.available);

// 3. Test with preview mode first
const options = { printerName: "XP-80C", preview: true };
const result = await electronAPI.print.printPOSData(data, options);
```

## Extending Functionality

To add barcode/QR code support later:

1. Install dependencies: `npm install qrcode jsbarcode @types/qrcode`
2. Update `assets/print-template.html` to include the libraries
3. Implement rendering in `renderer-utils.ts`
4. Update the switch statement in the template's `renderDataToHTML` function

## Notes

- The implementation runs only in the main process (Electron's main thread)
- Print templates are rendered in a hidden BrowserWindow
- All styling uses CSS-in-JS format
- Images must be base64 encoded or accessible URLs (file paths work in main process only)

## Performance Tips

- Use `silent: true` for faster printing (no print dialog)
- Batch multiple print jobs with single data array
- Use appropriate `timeOutPerLine` values based on content complexity
- Preview mode is useful for testing without physical printing
