import ESCPOSPrinter, { type PrinterInfo } from "@mixgeeker/node-escpos-win";
import path from "path";

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

    const printer = new ESCPOSPrinter(printerInfo.name);

    const billsPath = getBillsImageDirectory();
    const fullPath = path.join(billsPath, imageName);

    // 打印标题
    printer.print(
      Buffer.concat([
        ESCPOSPrinter.commands.INIT,
        ESCPOSPrinter.commands.ALIGN_CENTER,
        ESCPOSPrinter.commands.CHINESE_MODE,
        ESCPOSPrinter.commands.BOLD_ON,
        ESCPOSPrinter.commands.TEXT_DOUBLE_SIZE,
        printer.textToBuffer("图片打印测试\n", "GBK"),
        ESCPOSPrinter.commands.TEXT_NORMAL,
        ESCPOSPrinter.commands.BOLD_OFF,
        ESCPOSPrinter.commands.LF
      ])
    );

    console.log("正在处理图片...");

    await printer.printImage(fullPath, {
      width: 576
    });

    printer.print(
      Buffer.concat([
        ESCPOSPrinter.commands.LF,
        ESCPOSPrinter.commands.ALIGN_CENTER,
        printer.textToBuffer("测试完成\n", "GBK"),
        ESCPOSPrinter.commands.LF,
        ESCPOSPrinter.commands.CUT
      ])
    );

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
