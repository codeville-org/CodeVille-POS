import { getBillsImageDirectory } from "@/controllers/images.controller";
import * as fs from "fs";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

type ALIGNMENT_OPTIONS = "left" | "center" | "right";

interface PrinterConfig {
  devicePath?: string; // e.g., '/dev/usb/lp0' on Linux, 'LPT1' on Windows
  printerName?: string; // Windows printer name
}

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  unit?: string; // e.g., 'ml', 'pcs', 'g', 'kg'
}

interface ReceiptData {
  storeName?: string;
  storeAddress?: string;
  logoPath?: string; // Path to logo image file
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  timestamp?: Date;
}

export class USBPrinter {
  private config: PrinterConfig;
  private platform: NodeJS.Platform;

  // ESC/POS Commands
  private readonly ESC = "\x1B";
  private readonly GS = "\x1D";

  // Text formatting
  private readonly INIT = `${this.ESC}@`; // Initialize printer
  private readonly BOLD_ON = `${this.ESC}E1`;
  private readonly BOLD_OFF = `${this.ESC}E0`;
  private readonly ALIGN_LEFT = `${this.ESC}a0`;
  private readonly ALIGN_CENTER = `${this.ESC}a1`;
  private readonly ALIGN_RIGHT = `${this.ESC}a2`;
  private readonly FONT_NORMAL = `${this.ESC}!0`;
  private readonly FONT_LARGE = `${this.ESC}!16`;
  private readonly FONT_SMALL = `${this.ESC}!1`;

  // Paper control
  private readonly CUT_PAPER = `${this.GS}V1`; // Partial cut
  private readonly FEED_LINE = "\n";
  private readonly FEED_LINES = (lines: number) =>
    `${this.ESC}d${String.fromCharCode(lines)}`;

  constructor(config: PrinterConfig) {
    this.config = config;
    this.platform = process.platform;
  }

  /**
   * Send raw data to USB printer
   */
  private async sendToPrinter(data: Buffer): Promise<void> {
    if (this.platform === "win32") {
      return this.sendToWindowsPrinter(data);
    } else {
      return this.sendToUnixPrinter(data);
    }
  }

  /**
   * Windows: Use printer name with raw printing
   */
  private async sendToWindowsPrinter(data: Buffer): Promise<void> {
    const { exec } = require("child_process");
    const { promisify } = require("util");
    const execAsync = promisify(exec);
    const os = require("os");
    const path = require("path");

    // Create temp file
    const tempFile = path.join(os.tmpdir(), `receipt_${Date.now()}.bin`);

    try {
      // Write data to temp file
      await writeFile(tempFile, data);

      // Print using Windows copy command to raw printer
      const printerName = this.config.printerName || "XP-80C"; // Default name
      const command = `copy /B "${tempFile}" "\\\\localhost\\${printerName}"`;

      await execAsync(command);

      // Clean up
      fs.unlinkSync(tempFile);
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
      throw new Error(
        `Windows printer error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Linux/Mac: Write directly to device path
   */
  private async sendToUnixPrinter(data: Buffer): Promise<void> {
    const devicePath = this.config.devicePath || "/dev/usb/lp0";

    try {
      // Write directly to device
      await writeFile(devicePath, data);
    } catch (error) {
      throw new Error(
        `USB printer error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Print a formatted receipt
   */
  async printReceipt(receipt: ReceiptData): Promise<void> {
    const buffer: string[] = [];

    // Initialize printer
    buffer.push(this.INIT);

    // Print logo if provided
    if (receipt.logoPath) {
      try {
        const imageData = await this.prepareImage(receipt.logoPath);
        console.log(imageData);

        buffer.push(this.ALIGN_CENTER);
        buffer.push(imageData);
        buffer.push(this.FEED_LINE);
      } catch (error) {
        console.error("Failed to print logo:", error);
        // Continue without logo
      }
    }

    // Header
    if (receipt.storeName) {
      buffer.push(this.ALIGN_CENTER);
      buffer.push(this.FONT_LARGE);
      buffer.push(this.BOLD_ON);
      buffer.push(receipt.storeName);
      buffer.push(this.FEED_LINE);
      buffer.push(this.BOLD_OFF);
      buffer.push(this.FONT_NORMAL);
    }

    if (receipt.storeAddress) {
      buffer.push(this.ALIGN_CENTER);
      buffer.push(this.FONT_SMALL);
      buffer.push(receipt.storeAddress);
      buffer.push(this.FEED_LINE);
      buffer.push(this.FONT_NORMAL);
    }

    // // Separator
    // buffer.push(this.ALIGN_LEFT);
    // buffer.push("-".repeat(48));
    // buffer.push(this.FEED_LINE);

    // Timestamp
    const timestamp = receipt.timestamp || new Date();
    buffer.push(`Date: ${timestamp.toLocaleDateString()}`);
    buffer.push(this.FEED_LINE);
    buffer.push(`Time: ${timestamp.toLocaleTimeString()}`);
    buffer.push(this.FEED_LINE);
    buffer.push("-".repeat(48));
    buffer.push(this.FEED_LINE);

    // Table Header
    buffer.push(this.BOLD_ON);
    buffer.push(this.formatTableHeader());
    buffer.push(this.FEED_LINE);
    buffer.push(this.BOLD_OFF);
    buffer.push("-".repeat(48));
    buffer.push(this.FEED_LINE);

    // Items in table format
    receipt.items.forEach((item, index) => {
      // Item name row (full width with index)
      buffer.push(this.BOLD_ON);
      buffer.push(`${index + 1}. ${item.name}`);
      buffer.push(this.BOLD_OFF);
      buffer.push(this.FEED_LINE);

      // Details row (qty, unit price, total)
      const detailsLine = this.formatItemDetailsRow(
        item.quantity,
        item.unit || "",
        item.price,
        item.quantity * item.price
      );
      buffer.push(detailsLine);
      buffer.push(this.FEED_LINE);
    });

    // Separator
    // buffer.push("-".repeat(48));
    // buffer.push(this.FEED_LINE);

    // Totals
    // buffer.push(this.formatTotalLine("Subtotal:", receipt.subtotal));
    // buffer.push(this.FEED_LINE);
    // buffer.push(this.formatTotalLine("Tax:", receipt.tax));
    // buffer.push(this.FEED_LINE);
    // buffer.push(this.BOLD_ON);
    // buffer.push(this.FONT_LARGE);
    // buffer.push(this.formatTotalLine("TOTAL:", receipt.total));
    // buffer.push(this.BOLD_OFF);
    // buffer.push(this.FONT_NORMAL);
    // buffer.push(this.FEED_LINE);

    // Footer
    buffer.push(this.ALIGN_CENTER);
    buffer.push(this.FEED_LINE);
    buffer.push("Thank you for your business!");
    buffer.push(this.FEED_LINE);

    // Feed and cut
    buffer.push(this.FEED_LINES(5));
    buffer.push(this.CUT_PAPER);

    // Convert to buffer and send
    const data = Buffer.from(buffer.join(""), "binary");
    await this.sendToPrinter(data);
  }

  /**
   * Print raw text
   */
  async printText(text: string, cut: boolean = true): Promise<void> {
    const buffer: string[] = [];

    buffer.push(this.INIT);
    buffer.push(text);
    buffer.push(this.FEED_LINE);

    if (cut) {
      buffer.push(this.FEED_LINES(3));
      buffer.push(this.CUT_PAPER);
    }

    const data = Buffer.from(buffer.join(""), "binary");
    await this.sendToPrinter(data);
  }

  /**
   * Test printer connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.printText("Test Print - Connection OK", true);
      return true;
    } catch (error) {
      console.error("Printer test failed:", error);
      return false;
    }
  }

  /**
   * Get list of available printers (Windows only)
   */
  static async getAvailablePrinters(): Promise<string[]> {
    if (process.platform !== "win32") {
      return [];
    }

    const { exec } = require("child_process");
    const { promisify } = require("util");
    const execAsync = promisify(exec);

    try {
      const { stdout } = await execAsync('cmd /c "wmic printer get name"');

      const printers = stdout
        .trim()
        .split("\n")
        .map((p: string) => p.trim())
        .splice(1)
        .filter(Boolean);

      return printers;
    } catch (error) {
      console.error("Failed to get printer list:", error);
      return [];
    }
  }

  /**
   * Format table header (Quantity | Unit Price | Total)
   */
  private formatTableHeader(): string {
    // Adjust column widths: 16 chars | 16 chars | 16 chars = 48 total
    const col1 = "Quantity".padEnd(16);
    const col2 = "Unit Price".padEnd(16);
    const col3 = "Total".padEnd(16);

    return `${col1}${col2}${col3}`;
  }

  /**
   * Format item details row (quantity with unit, unit price, total)
   */
  private formatItemDetailsRow(
    qty: number,
    unit: string,
    unitPrice: number,
    total: number
  ): string {
    // Format: "2 kg" or "1 pcs" etc.
    const qtyStr = `${qty} ${unit}`.padEnd(16);

    // Format prices with Rs. or currency symbol
    const priceStr = `Rs. ${unitPrice.toFixed(2)}`.padEnd(16);
    const totalStr = `Rs. ${total.toFixed(2)}`.padEnd(16);

    return `${qtyStr}${priceStr}${totalStr}`;
  }

  /**
   * Open cash drawer (if supported)
   */
  async openCashDrawer(): Promise<void> {
    const OPEN_DRAWER = `${this.ESC}p0\x19\xFA`; // Standard cash drawer command
    const data = Buffer.from(OPEN_DRAWER, "binary");
    await this.sendToPrinter(data);
  }

  /**
   * Prepare image for printing (converts to ESC/POS bitmap)
   */
  private async prepareImage(
    imagePath: string,
    maxWidth: number = 384,
    useDithering: boolean = true
  ): Promise<string> {
    try {
      // Read image file
      const imageBuffer = await readFile(imagePath);

      // Convert to bitmap using canvas
      const { createCanvas, loadImage } = require("canvas");

      const image = await loadImage(imageBuffer);

      // Calculate dimensions (maintain aspect ratio)
      let width = image.width;
      let height = image.height;

      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = Math.floor(height * ratio);
      }

      // Ensure dimensions are reasonable
      width = Math.max(1, Math.min(width, 576)); // Max thermal printer width
      height = Math.max(1, Math.min(height, 1000)); // Reasonable height limit

      // Create canvas with white background
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Fill with white background (important for transparency)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);

      // Set image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw image
      ctx.drawImage(image, 0, 0, width, height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, width, height);

      // Convert to monochrome bitmap
      return this.convertToBitmap(imageData.data, width, height, useDithering);
    } catch (error) {
      throw new Error(
        `Failed to prepare image: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Convert image data to ESC/POS bitmap format with optional dithering
   */
  private convertToBitmap(
    imageData: Uint8ClampedArray,
    width: number,
    height: number,
    useDithering: boolean = true
  ): string {
    const buffer: string[] = [];

    // ESC/POS raster image command: GS v 0
    // Format: GS v 0 m xL xH yL yH d1...dk
    buffer.push(this.GS);
    buffer.push("v");
    buffer.push("0");
    buffer.push("\x00"); // Normal mode

    // Width in bytes (8 pixels per byte)
    const widthBytes = Math.ceil(width / 8);
    buffer.push(String.fromCharCode(widthBytes & 0xff));
    buffer.push(String.fromCharCode((widthBytes >> 8) & 0xff));

    // Height
    buffer.push(String.fromCharCode(height & 0xff));
    buffer.push(String.fromCharCode((height >> 8) & 0xff));

    // Create a copy of image data for dithering
    const pixels = new Float32Array(width * height);

    // Convert to grayscale with alpha blending
    for (let i = 0; i < width * height; i++) {
      const index = i * 4;
      const r = imageData[index];
      const g = imageData[index + 1];
      const b = imageData[index + 2];
      const a = imageData[index + 3];

      // Convert to grayscale
      const gray = r * 0.299 + g * 0.587 + b * 0.114;

      // Apply alpha blending with white background
      pixels[i] = gray * (a / 255) + 255 * (1 - a / 255);
    }

    // Apply Floyd-Steinberg dithering if enabled
    if (useDithering) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = y * width + x;
          const oldPixel = pixels[index];
          const newPixel = oldPixel < 128 ? 0 : 255;
          pixels[index] = newPixel;

          const error = oldPixel - newPixel;

          // Distribute error to neighboring pixels
          if (x + 1 < width) {
            pixels[index + 1] += (error * 7) / 16;
          }
          if (y + 1 < height) {
            if (x > 0) {
              pixels[index + width - 1] += (error * 3) / 16;
            }
            pixels[index + width] += (error * 5) / 16;
            if (x + 1 < width) {
              pixels[index + width + 1] += (error * 1) / 16;
            }
          }
        }
      }
    }

    // Convert pixels to bitmap
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < widthBytes; x++) {
        let byte = 0;
        for (let bit = 0; bit < 8; bit++) {
          const pixelX = x * 8 + bit;
          if (pixelX < width) {
            const index = y * width + pixelX;
            const pixelValue = useDithering ? pixels[index] : pixels[index];

            // If pixel is dark (< 128), set bit to 1 (print black)
            if (pixelValue < 128) {
              byte |= 1 << (7 - bit);
            }
          }
        }
        buffer.push(String.fromCharCode(byte));
      }
    }

    return buffer.join("");
  }

  /**
   * Print an image file
   */
  async printImage(
    imagePath: string,
    align: ALIGNMENT_OPTIONS = "center",
    useDithering: boolean = true
  ): Promise<void> {
    const buffer: string[] = [];

    buffer.push(this.INIT);

    // Set alignment
    if (align === "center") {
      buffer.push(this.ALIGN_CENTER);
    } else if (align === "right") {
      buffer.push(this.ALIGN_RIGHT);
    } else {
      buffer.push(this.ALIGN_LEFT);
    }

    // Add image
    const imageData = await this.prepareImage(imagePath, 384, useDithering);
    buffer.push(imageData);
    buffer.push(this.FEED_LINE);

    const data = Buffer.from(buffer.join(""), "binary");
    await this.sendToPrinter(data);
  }

  /**
   * Print a complete bill image at full paper width (80mm thermal paper)
   * This function is specifically designed for printing full-width receipt images
   */
  async printImageBill(
    imagePath: string,
    useDithering: boolean = true
  ): Promise<void> {
    const buffer: string[] = [];

    buffer.push(this.INIT);
    buffer.push(this.ALIGN_LEFT); // Left align for full-width printing

    // Use full thermal printer width (576 pixels for 80mm paper at 180 DPI)
    // 80mm = ~3.15 inches, at 180 DPI = ~568 pixels, rounded to 576 for byte alignment
    const fullWidth = 576;

    const fullBillImagePath = getBillsImageDirectory() + "/" + imagePath;

    // Add image at full width
    const imageData = await this.prepareImage(
      fullBillImagePath,
      fullWidth,
      useDithering
    );

    buffer.push(imageData);

    // Add extra feed lines and cut paper
    buffer.push(this.FEED_LINES(3));
    buffer.push(this.CUT_PAPER);

    const data = Buffer.from(buffer.join(""), "binary");
    await this.sendToPrinter(data);
  }

  /**
   * Debug method to save processed image data as a test file
   */
  async debugImageProcessing(imagePath: string): Promise<void> {
    try {
      const imageBuffer = await readFile(imagePath);
      const { createCanvas, loadImage } = require("canvas");
      const image = await loadImage(imageBuffer);

      // Create debug canvas
      const canvas = createCanvas(
        384,
        Math.floor(image.height * (384 / image.width))
      );
      const ctx = canvas.getContext("2d");

      // Fill with white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Save debug image
      const debugPath = imagePath.replace(/\.[^/.]+$/, "_debug.png");
      const fs = require("fs");
      const stream = fs.createWriteStream(debugPath);
      const pngBuffer = canvas.toBuffer("image/png");
      stream.write(pngBuffer);
      stream.end();

      console.log(`Debug image saved to: ${debugPath}`);
    } catch (error) {
      console.error("Debug image processing failed:", error);
    }
  }
}

// Export types
export type { ALIGNMENT_OPTIONS, PrinterConfig, ReceiptData, ReceiptItem };
