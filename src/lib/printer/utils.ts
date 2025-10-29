/*
 * Copyright (c) 2019-2025. Author Hubert Formin <hformin@gmail.com>
 * Adapted for CodeVille POS
 */
import { ipcMain } from "electron";
import { PaperSize, SizeOptions } from "./models";

/**
 * @function sendIpcMsg
 * @description Sends messages to the render process to render the data specified in the PostPrintDate interface and receives a status of true
 */
export function sendIpcMsg(
  channel: string,
  webContents: any,
  arg: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    ipcMain.once(`${channel}-reply`, (event, result) => {
      if (result.status) {
        resolve(result);
      } else {
        reject(result.error);
      }
    });
    webContents.send(channel, arg);
  });
}

/**
 * @function parsePaperSize
 * @description Converts paper size to pixel dimensions for BrowserWindow
 */
export function parsePaperSize(pageSize?: PaperSize | SizeOptions): {
  width: number;
  height: number;
} {
  let width = 219,
    height = 1200;

  if (typeof pageSize === "string") {
    switch (pageSize) {
      case "44mm":
        width = 166;
        break;
      case "57mm":
        width = 215;
        break;
      case "58mm":
        width = 219;
        break;
      case "76mm":
        width = 287;
        break;
      case "78mm":
        width = 295;
        break;
      case "80mm":
        width = 302;
        break;
    }
  } else if (typeof pageSize === "object" && pageSize) {
    width = pageSize.width;
    height = pageSize.height;
  }

  return {
    width,
    height
  };
}

/**
 * @function parsePaperSizeInMicrons
 * @description Converts paper size to microns for print API
 */
export function parsePaperSizeInMicrons(pageSize?: PaperSize | SizeOptions): {
  width: number;
  height: number;
} {
  let width = 58000,
    height = 10000; // in microns

  if (typeof pageSize === "string") {
    switch (pageSize) {
      case "44mm":
        width = Math.ceil(44 * 1000);
        break;
      case "57mm":
        width = Math.ceil(57 * 1000);
        break;
      case "58mm":
        width = Math.ceil(58 * 1000);
        break;
      case "76mm":
        width = Math.ceil(76 * 1000);
        break;
      case "78mm":
        width = Math.ceil(78 * 1000);
        break;
      case "80mm":
        width = Math.ceil(80 * 1000);
        break;
    }
  } else if (typeof pageSize === "object" && pageSize) {
    width = convertPixelsToMicrons(pageSize.width);
    height = convertPixelsToMicrons(pageSize.height);
  }

  return {
    width,
    height
  };
}

/**
 * @function convertPixelsToMicrons
 * @description Converts pixels to microns for print API
 */
export function convertPixelsToMicrons(pixels: number): number {
  return Math.ceil(pixels * 264.5833);
}

/**
 * @function validatePrintOptions
 * @description Validates print options and throws appropriate errors
 */
export function validatePrintOptions(options: any): void {
  // 1. Reject if printer name is not set in live mode
  if (!options.preview && !options.printerName && !options.silent) {
    throw new Error(
      "A printer name is required, if you don't want to specify a printer name, set silent to true"
    );
  }

  // 2. Reject if pageSize is object and pageSize.height or pageSize.width is not set
  if (typeof options.pageSize === "object" && options.pageSize) {
    if (!options.pageSize.height || !options.pageSize.width) {
      throw new Error(
        "height and width properties are required for options.pageSize"
      );
    }
  }
}

/**
 * @function calculateTimeout
 * @description Calculates timeout based on data length and options
 */
export function calculateTimeout(
  dataLength: number,
  timeOutPerLine?: number
): number {
  return timeOutPerLine
    ? timeOutPerLine * dataLength + 200
    : 400 * dataLength + 200;
}

/**
 * @function isBase64
 * @description Checks if a string is a valid base64 string
 */
export function isBase64(str: string): boolean {
  try {
    return Buffer.from(str, "base64").toString("base64") === str;
  } catch {
    return false;
  }
}

/**
 * @function isValidHttpUrl
 * @description Checks if a string is a valid HTTP URL
 */
export function isValidHttpUrl(url: string): boolean {
  let validURL;

  try {
    validURL = new URL(url);
  } catch (_) {
    return false;
  }

  return validURL.protocol === "http:" || validURL.protocol === "https:";
}
