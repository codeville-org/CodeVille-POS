import * as Electron from "electron";
import {
  PosPrinter,
  type PosPrintData,
  type PosPrintOptions
} from "electron-pos-printer";
import path from "path";

import {
  ListPrintersResponseT,
  PrintReceiptResponseT,
  TestPrintResponseT
} from "@/lib/zod/printers.zod";

// ================= Printer Controller =================
export async function listPrintersController(): Promise<ListPrintersResponseT> {
  try {
    const window = Electron.BrowserWindow;

    const printWindow = window.getFocusedWindow();
    const printersList = await printWindow.webContents.getPrintersAsync();

    const printers = printersList.map((printer) => ({
      name: printer.name,
      description: printer.description,
      displayName: printer.displayName
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
  transactionId: string
): Promise<PrintReceiptResponseT> {
  try {
    console.log(transactionId);
  } catch (error) {
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
    const options: PosPrintOptions = {
      preview: false,
      margin: "0 0 0 0",
      copies: 1,
      printerName: printerName || "XP-80C",
      timeOutPerLine: 400,
      pageSize: "80mm",
      boolean: ""
    };

    const data: PosPrintData[] = [
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "HEADER",
        style: { fontSize: "18px", textAlign: "center" }
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: "Secondary text",
        style: {
          textDecoration: "underline",
          fontSize: "10px",
          textAlign: "center",
          color: "red"
        }
      },
      {
        type: "image",
        path: path.join(__dirname, "assets/img_test.png"), // file path
        position: "center", // position of image: 'left' | 'center' | 'right'
        width: "auto", // width of image in px; default: auto
        height: "60px" // width of image in px; default: 50 or '50px'
      },
      {
        type: "table",
        // style the table
        style: { border: "1px solid #ddd" },
        // list of the columns to be rendered in the table header
        tableHeader: ["Animal", "Age"],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: [
          ["Cat", "2"],
          ["Dog", "4"],
          ["Horse", "12"],
          ["Pig", "4"]
        ],
        // list of columns to be rendered in the table footer
        tableFooter: ["Animal", "Age"],
        // custom style for the table header
        tableHeaderStyle: { backgroundColor: "#000", color: "white" },
        // custom style for the table body
        tableBodyStyle: { border: "0.5px solid #ddd" },
        // custom style for the table footer
        tableFooterStyle: { backgroundColor: "#000", color: "white" }
      },
      {
        type: "barCode",
        value: "023456789010",
        height: "40", // height of barcode, applicable only to bar and QR codes
        width: "2", // width of barcode, applicable only to bar and QR codes
        displayValue: true, // Display value below barcode
        fontsize: 12
      },
      {
        type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "************************",
        style: { fontSize: "10px", textAlign: "center", marginBottom: "10px" }
      }
    ];

    if (printerName != "") {
      PosPrinter.print(data, options)
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
    }
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
      success: false
    };
  }
}
