import ESCPOSPrinter, { type PrinterInfo } from "@mixgeeker/node-escpos-win";
import { BrowserWindow } from "electron";
import * as fs from "fs/promises";
import path from "path";
import sharp from "sharp";

import {
  ListPrintersResponseT,
  PrintReceiptResponseT,
  TestPrintResponseT
} from "@/lib/zod/printers.zod";
import { getBillsImageDirectory } from "./images.controller";

// ================= Printer Controller =================
export async function listPrintersController(): Promise<ListPrintersResponseT> {
  try {
    const node_printers: PrinterInfo[] = ESCPOSPrinter.getPrinterList();

    const printers = node_printers.map((printer) => ({
      name: printer.name,
      description: printer.description,
      displayName: printer.name,
      isDefault: printer.isDefault
    }));

    return {
      data: {
        printers
      },
      error: null,
      success: true
    };
  } catch (error) {
    console.log(error);

    return {
      data: null,
      error: (error as Error).message,
      success: false
    };
  }
}

export async function printReceiptController(
  imageName: string
): Promise<PrintReceiptResponseT> {
  try {
    // TODO: Get default printer from settings
    const printerName = "XP-80C";

    const printers = await listPrintersController();
    const printerInfo = printers.data?.printers.find(
      (p) => p.name === printerName
    );

    if (!printerInfo) {
      throw new Error(`Printer not found: ${printerName}`);
    }

    const billsPath = getBillsImageDirectory();
    const fullPath = path.join(billsPath, imageName);

    // -------------------------------------------------
    let printWindow: BrowserWindow | null = null;

    printWindow = new BrowserWindow({
      show: false, // Keep hidden
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        offscreen: true
      }
    });

    const imageData = await fs.readFile(fullPath, { encoding: "base64" });

    // Get actual image dimensions for better quality
    const imageBuffer = await fs.readFile(fullPath);
    const metadata = await sharp(imageBuffer).metadata();
    const imageHeight = metadata.height || 800;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @page {
              size: 80mm ${imageHeight}px;
              margin: 0mm;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            html, body {
              width: 80mm;
              margin: 0;
              padding: 0;
              background: white;
            }
            img {
              width: 80mm;
              height: auto;
              display: block;
              image-rendering: -webkit-optimize-contrast;
              image-rendering: crisp-edges;
              image-rendering: pixelated;
            }
          </style>
        </head>
        <body>
          <img src="data:image/png;base64,${imageData}" alt="Receipt" />
        </body>
        </html>
      `;

    await printWindow.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
    );

    // Wait longer for content to fully load and render
    await new Promise((r) => setTimeout(r, 1000));

    // Print with high quality settings
    await new Promise<void>((resolve, reject) => {
      printWindow!.webContents.print(
        {
          silent: true,
          printBackground: true,
          color: false, // Black and white for thermal
          deviceName: printerName,
          margins: {
            marginType: "none"
          },
          pageSize: {
            width: 80000, // 80mm in microns
            height: imageHeight * 264.58 // Convert pixels to microns (1px ≈ 264.58 microns at 96 DPI)
          },
          dpi: {
            horizontal: 203, // Thermal printer DPI (203 or 300)
            vertical: 203
          },
          scaleFactor: 100 // No scaling
        },
        (success, errorType) => {
          if (printWindow) {
            printWindow.close();
            printWindow = null;
          }

          if (success) {
            resolve();
          } else {
            console.error("Print failed:", errorType);
            reject(new Error(`Print failed: ${errorType}`));
          }
        }
      );
    });

    return {
      data: { message: "Receipt printed successfully" },
      error: null,
      success: true
    };
  } catch (error) {
    console.log("Printer Error: ", error);
    return {
      data: null,
      error: (error as Error).message,
      success: false
    };
  }
}

export async function testPrintController(
  printerName: string
): Promise<TestPrintResponseT> {
  try {
    const printers = await listPrintersController();
    const printerInfo = printers.data?.printers.find(
      (p) => p.name === printerName
    );

    if (!printerInfo) {
      throw new Error(`Printer not found: ${printerName}`);
    }

    const printer = new ESCPOSPrinter(printerInfo.name);

    // Sample grocery store data
    const storeInfo = {
      name: "FRESH MART GROCERY",
      address: "123 Main Street",
      city: "New York, NY 10001",
      phone: "(555) 123-4567"
    };

    const receiptNumber = "R" + Date.now().toString().slice(-6);
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString();
    const timeStr = currentDate.toLocaleTimeString();

    // Sample grocery items
    const groceryItems = [
      { name: "Bananas (2 lbs)", price: 2.98, qty: 2 },
      { name: "Bread - Whole Wheat", price: 3.49, qty: 1 },
      { name: "Milk - 2% Gallon", price: 4.29, qty: 1 },
      { name: "Eggs - Dozen", price: 3.99, qty: 3 },
      { name: "Apples - Gala (3 lbs)", price: 4.97, qty: 1 },
      { name: "Orange Juice - 64oz", price: 4.79, qty: 2 },
      { name: "Chicken Breast (2 lbs)", price: 8.99, qty: 1 },
      { name: "Tomatoes (1 lb)", price: 2.49, qty: 4 }
    ];

    // Calculate totals
    const subtotal = groceryItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // Helper function to format currency
    const formatPrice = (price: number) => "$" + price.toFixed(2);

    // Helper function to pad strings for alignment (80mm printer ~48 chars)
    const padString = (str: string, width: number) => {
      if (str.length >= width) return str.substring(0, width);
      return str + " ".repeat(width - str.length);
    };

    // Helper function to format item line for full width
    const formatItemLine = (name: string, price: number, qty = 1) => {
      const priceStr = formatPrice(price * qty);
      const maxNameWidth = 48 - priceStr.length - 1; // -1 for space
      const paddedName = padString(name, maxNameWidth);
      return `${paddedName} ${priceStr}`;
    };

    // Helper function to format two-row item display
    const formatTwoRowItem = (item: any) => {
      const itemName = item.name + "\n";
      const amount = item.price * item.qty;

      // Create three columns: Qty, Price, Amount
      const qtyCol = `Qty: ${item.qty}`;
      const priceCol = `@ ${formatPrice(item.price)}`;
      const amountCol = formatPrice(amount);

      // Calculate column widths (total 48 chars)
      const col1Width = 12; // "Qty: X"
      const col2Width = 18; // "@ $XX.XX"
      const col3Width = 18; // "$XX.XX"

      const qtyPadded = padString(qtyCol, col1Width);
      const pricePadded = padString(priceCol, col2Width);
      const amountPadded = padString(amountCol, col3Width);

      const detailsLine = `${qtyPadded}${pricePadded}${amountPadded}\n`;

      return itemName + detailsLine;
    };

    const printData = Buffer.concat([
      // Initialize printer
      ESCPOSPrinter.commands.INIT,

      // Store Header
      ESCPOSPrinter.commands.ALIGN_CENTER,
      ESCPOSPrinter.commands.BOLD_ON,
      ESCPOSPrinter.commands.TEXT_DOUBLE_SIZE,
      printer.textToBuffer(storeInfo.name + "\n", "ASCII"),
      ESCPOSPrinter.commands.TEXT_NORMAL,
      ESCPOSPrinter.commands.BOLD_OFF,
      printer.textToBuffer(storeInfo.address + "\n", "ASCII"),
      printer.textToBuffer(storeInfo.city + "\n", "ASCII"),
      printer.textToBuffer(storeInfo.phone + "\n", "ASCII"),
      ESCPOSPrinter.commands.LF,

      // Separator line
      printer.textToBuffer(
        "================================================\n",
        "ASCII"
      ),
      ESCPOSPrinter.commands.LF,

      // Receipt info
      ESCPOSPrinter.commands.ALIGN_LEFT,
      printer.textToBuffer(`Receipt #: ${receiptNumber}\n`, "ASCII"),
      printer.textToBuffer(`Date: ${dateStr}\n`, "ASCII"),
      printer.textToBuffer(`Time: ${timeStr}\n`, "ASCII"),
      ESCPOSPrinter.commands.LF,

      // Items header
      printer.textToBuffer("ITEMS PURCHASED:\n", "ASCII"),
      printer.textToBuffer(
        "------------------------------------------------\n",
        "ASCII"
      ),

      // Print each grocery item in two rows (name + qty/price/amount)
      ...groceryItems.flatMap((item) =>
        formatTwoRowItem(item)
          .split("\n")
          .filter((line) => line.trim() !== "")
          .map((line) => printer.textToBuffer(line + "\n", "ASCII"))
      ),

      // Subtotal section
      printer.textToBuffer(
        "------------------------------------------------\n",
        "ASCII"
      ),
      printer.textToBuffer(
        formatItemLine("Subtotal:", subtotal) + "\n",
        "ASCII"
      ),
      printer.textToBuffer(formatItemLine("Tax (8%):", tax) + "\n", "ASCII"),
      printer.textToBuffer(
        "================================================\n",
        "ASCII"
      ),

      // Total
      ESCPOSPrinter.commands.BOLD_ON,
      ESCPOSPrinter.commands.TEXT_DOUBLE_HEIGHT,
      printer.textToBuffer(formatItemLine("TOTAL:", total) + "\n", "ASCII"),
      ESCPOSPrinter.commands.TEXT_NORMAL,
      ESCPOSPrinter.commands.BOLD_OFF,

      printer.textToBuffer(
        "================================================\n",
        "ASCII"
      ),
      ESCPOSPrinter.commands.LF,

      // Cut paper
      ESCPOSPrinter.commands.CUT
    ]);

    // Print the data
    console.log("Printing receipt...");
    const printResult = printer.print(printData);

    if (printResult) {
      console.log("Receipt printed successfully!");
    } else {
      console.log(
        "Failed to print receipt. Check if printer is connected and ready."
      );
    }

    // Wait a moment before closing the connection to ensure print job completes
    setTimeout(() => {
      printer.close();
      console.log("Printer connection closed.");
    }, 2000);

    return {
      data: { message: "Test receipt printed successfully" },
      error: null,
      success: true
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: (error as Error).message,
      success: false
    };
  }
}
