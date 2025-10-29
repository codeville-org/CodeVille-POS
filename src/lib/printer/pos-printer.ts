/*
 * Copyright (c) 2019-2025. Author Hubert Formin <hformin@gmail.com>
 * Adapted for CodeVille POS
 */
import { BrowserWindow } from "electron";
import { PosPrintData, PosPrintOptions, PrintJobStatus } from "./models";
import {
  calculateTimeout,
  convertPixelsToMicrons,
  parsePaperSize,
  parsePaperSizeInMicrons,
  sendIpcMsg,
  validatePrintOptions
} from "./utils";

// Ensure this runs only in main process
if ((process as any).type === "renderer") {
  throw new Error(
    "pos-printer: This module should only be used in the main process"
  );
}

/**
 * @class PosPrinter
 * POS Printer class for handling thermal receipt printing
 */
export class PosPrinter {
  /**
   * @method print
   * @description Main method to print data to POS printer
   * @param data Array of print data objects
   * @param options Print configuration options
   * @returns Promise resolving to print job status
   */
  public static print(
    data: PosPrintData[],
    options: PosPrintOptions
  ): Promise<PrintJobStatus> {
    return new Promise((resolve, reject) => {
      try {
        // Validate options
        validatePrintOptions(options);
      } catch (error) {
        reject(error);
        return;
      }

      let printedState = false; // Track if job has been printed
      let window_print_error: any = null; // Store print errors
      const timeOut = calculateTimeout(data.length, options.timeOutPerLine);

      /**
       * If in live mode (not preview) and not silent, set timeout to detect connection issues
       * This helps catch the "[TimedOutError] Make sure your printer is connected" scenario
       */
      if (!options.preview && !options.silent) {
        setTimeout(() => {
          if (!printedState) {
            const errorMsg =
              window_print_error ||
              "[TimedOutError] Make sure your printer is connected";
            reject(new Error(errorMsg));
            printedState = true;
          }
        }, timeOut);
      }

      /**
       * Create Browser window for rendering print content
       * This is where the HTML gets generated and converted to print format
       */
      let printWindow = new BrowserWindow({
        ...parsePaperSize(options.pageSize),
        show: !!options.preview,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });

      // Clean up window reference when closed
      printWindow.on("closed", () => {
        (printWindow as any) = null;
      });

      // Create HTML template directly (no external file needed)
      const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Print Preview</title>
                    <style>
                        @page {
                            margin: 0;
                            page-break-before: always;
                        }
                        body {
                            font-size: 12px;
                            margin: 0;
                            padding: 0;
                            font-family: monospace, 'Courier New', Courier;
                        }
                        .barcode-container::after {
                            content: '';
                            display: table;
                            clear: both;
                        }
                        .font {
                            font-size: 12px;
                            margin: 0 15px;
                        }
                        table {
                            width: 100%;
                            display: table;
                            border-collapse: collapse;
                            border-spacing: 0;
                            font-family: monospace, cursive;
                        }
                        table tbody {
                            border-top: 1px solid #999;
                        }
                        table th, table td {
                            padding: 7px 2px;
                        }
                        table tr {
                            border-bottom: 1px dotted #999;
                            padding: 5px 0;
                            text-align: center;
                        }
                        table img {
                            max-height: 40px;
                        }
                        .not-supported {
                            color: #666;
                            font-style: italic;
                            text-align: center;
                            padding: 10px;
                            border: 1px dashed #ccc;
                            margin: 5px 0;
                        }
                    </style>
                </head>
                <body>
                    <section id="main"></section>

                    <script>
                        // Renderer process script for handling print data
                        const { ipcRenderer } = require('electron');

                        const body = document.getElementById('main');

                        /**
                         * Initialize container in html view, by setting the width and margins specified in the PosPrinter options
                         */
                        ipcRenderer.on('body-init', function (event, arg) {
                            body.style.width = arg?.width || '100%';
                            body.style.margin = arg?.margin || 0;
                            event.sender.send('body-init-reply', {status: true, error: null});
                        });

                        /**
                         * Listen to render event from the main process,
                         * Once the main process sends line data, render this data in the web page
                         */
                        ipcRenderer.on('render-line', renderDataToHTML);

                        /**
                         * @function renderDataToHTML
                         * @param event IpcEvent
                         * @param arg Print data argument
                         * @description Render data as HTML to page
                         */
                        async function renderDataToHTML(event, arg) {
                            try {
                                switch (arg.line.type) {
                                    case 'text':
                                        body.appendChild(generatePageText(arg.line));
                                        event.sender.send('render-line-reply', {status: true, error: null});
                                        break;

                                    case 'image':
                                        const img = await renderImageToPage(arg.line);
                                        body.appendChild(img);
                                        event.sender.send('render-line-reply', {status: true, error: null});
                                        break;

                                    case 'table':
                                        const table = await createTableElement(arg.line, arg.lineIndex);
                                        body.appendChild(table);
                                        event.sender.send('render-line-reply', {status: true, error: null});
                                        break;

                                    case 'barCode':
                                    case 'qrCode':
                                        // Not supported in this version
                                        const notSupported = document.createElement('div');
                                        notSupported.className = 'not-supported';
                                        notSupported.innerHTML = \`[\${arg.line.type.toUpperCase()} - Not supported in this version]\`;
                                        body.appendChild(notSupported);
                                        event.sender.send('render-line-reply', {status: true, error: null});
                                        break;

                                    default:
                                        throw new Error(\`Unsupported print type: \${arg.line.type}\`);
                                }
                            } catch (e) {
                                event.sender.send('render-line-reply', {status: false, error: e.toString()});
                            }
                        }

                        /**
                         * Utility functions for rendering different elements
                         */
                        function generatePageText(arg) {
                            const text = arg.value;
                            let div = document.createElement("div");
                            div.innerHTML = text;
                            div = applyElementStyles(div, arg.style);
                            return div;
                        }

                        function generateTableCell(arg, type = "td") {
                            const text = arg.value;
                            let cellElement = document.createElement(type);
                            cellElement.innerHTML = text;
                            cellElement = applyElementStyles(cellElement, { padding: "7px 2px", ...arg.style });
                            return cellElement;
                        }

                        function renderImageToPage(arg) {
                            return new Promise((resolve, reject) => {
                                let uri;
                                let img_con = document.createElement("div");

                                img_con = applyElementStyles(img_con, {
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: arg?.position || "left",
                                });

                                if (arg.url) {
                                    const isImageBase64 = isBase64(arg.url);
                                    if (!isValidHttpUrl(arg.url) && !isImageBase64) {
                                        return reject(new Error(\`Invalid url: \${arg.url}\`));
                                    }
                                    if (isImageBase64) {
                                        uri = "data:image/png;base64," + arg.url;
                                    } else {
                                        uri = arg.url;
                                    }
                                } else if (arg.path) {
                                    // For browser context, we can't read files directly
                                    // This would need to be handled by the main process
                                    reject(new Error("File path images not supported in renderer, use URL or base64"));
                                    return;
                                } else {
                                    reject(new Error("Image requires either a valid url or base64 data"));
                                    return;
                                }

                                if (!uri) {
                                    reject(new Error("Failed to generate image URI"));
                                    return;
                                }

                                let img = document.createElement("img");
                                img = applyElementStyles(img, {
                                    height: arg.height,
                                    width: arg.width,
                                    ...arg.style,
                                });

                                img.onload = () => {
                                    img_con.appendChild(img);
                                    resolve(img_con);
                                };

                                img.onerror = () => {
                                    reject(new Error("Failed to load image"));
                                };

                                img.src = uri;
                            });
                        }

                        async function createTableElement(tableData, lineIndex) {
                            let tableContainer = document.createElement('div');
                            tableContainer.setAttribute('id', \`table-container-\${lineIndex}\`);

                            let table = document.createElement('table');
                            table.setAttribute('id', \`table\${lineIndex}\`);
                            table = applyElementStyles(table, { ...tableData.style });

                            let tHeader = document.createElement('thead');
                            tHeader = applyElementStyles(tHeader, tableData.tableHeaderStyle);

                            let tBody = document.createElement('tbody');
                            tBody = applyElementStyles(tBody, tableData.tableBodyStyle);

                            let tFooter = document.createElement('tfoot');
                            tFooter = applyElementStyles(tFooter, tableData.tableFooterStyle);

                            // Headers
                            if (tableData.tableHeader) {
                                for (const headerArg of tableData.tableHeader) {
                                    if (typeof headerArg === "object") {
                                        switch (headerArg.type) {
                                            case 'image':
                                                try {
                                                    const img = await renderImageToPage(headerArg);
                                                    const th = document.createElement('th');
                                                    th.appendChild(img);
                                                    tHeader.appendChild(th);
                                                } catch (e) {
                                                    throw e;
                                                }
                                                break;
                                            case 'text':
                                                tHeader.appendChild(generateTableCell(headerArg, 'th'));
                                                break;
                                        }
                                    } else {
                                        const th = document.createElement('th');
                                        th.innerHTML = headerArg;
                                        tHeader.appendChild(th);
                                    }
                                }
                            }

                            // Body
                            if (tableData.tableBody) {
                                for (const bodyRow of tableData.tableBody) {
                                    const rowTr = document.createElement('tr');
                                    for (const colArg of bodyRow) {
                                        if (typeof colArg === 'object') {
                                            switch (colArg.type) {
                                                case 'image':
                                                    try {
                                                        const img = await renderImageToPage(colArg);
                                                        const td = document.createElement('td');
                                                        td.appendChild(img);
                                                        rowTr.appendChild(td);
                                                    } catch (e) {
                                                        throw e;
                                                    }
                                                    break;
                                                case 'text':
                                                    rowTr.appendChild(generateTableCell(colArg, 'td'));
                                                    break;
                                            }
                                        } else {
                                            const td = document.createElement('td');
                                            td.innerHTML = colArg;
                                            rowTr.appendChild(td);
                                        }
                                    }
                                    tBody.appendChild(rowTr);
                                }
                            }

                            // Footer
                            if (tableData.tableFooter) {
                                for (const footerArg of tableData.tableFooter) {
                                    if (typeof footerArg === 'object') {
                                        switch (footerArg.type) {
                                            case 'image':
                                                try {
                                                    const img = await renderImageToPage(footerArg);
                                                    const footerTh = document.createElement('th');
                                                    footerTh.appendChild(img);
                                                    tFooter.appendChild(footerTh);
                                                } catch (e) {
                                                    throw e;
                                                }
                                                break;
                                            case 'text':
                                                tFooter.appendChild(generateTableCell(footerArg, 'th'));
                                                break;
                                        }
                                    } else {
                                        const footerTh = document.createElement('th');
                                        footerTh.innerHTML = footerArg;
                                        tFooter.appendChild(footerTh);
                                    }
                                }
                            }

                            table.appendChild(tHeader);
                            table.appendChild(tBody);
                            table.appendChild(tFooter);
                            tableContainer.appendChild(table);

                            return tableContainer;
                        }

                        function applyElementStyles(element, style) {
                            if (!style || typeof style !== "object") {
                                return element;
                            }

                            for (const styleProp of Object.keys(style)) {
                                if (!style[styleProp]) {
                                    continue;
                                }
                                element.style[styleProp] = style[styleProp];
                            }
                            return element;
                        }

                        function isBase64(str) {
                            try {
                                return btoa(atob(str)) === str;
                            } catch {
                                return false;
                            }
                        }

                        function isValidHttpUrl(url) {
                            try {
                                const validURL = new URL(url);
                                return validURL.protocol === "http:" || validURL.protocol === "https:";
                            } catch {
                                return false;
                            }
                        }
                    </script>
                </body>
                </html>
            `;

      // Load the HTML content directly instead of external file
      printWindow.loadURL(
        `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
      );

      printWindow.webContents.on("did-finish-load", async () => {
        try {
          // Initialize the print body with width and margin settings
          await sendIpcMsg("body-init", printWindow.webContents, options);

          /**
           * Render print data as HTML in the print window
           */
          await PosPrinter.renderPrintDocument(printWindow, data);

          // Calculate final dimensions in microns for printing
          let { width, height } = parsePaperSizeInMicrons(options.pageSize);

          // Get actual content height if using string-based page size
          if (typeof options.pageSize === "string") {
            const clientHeight =
              await printWindow.webContents.executeJavaScript(
                "document.body.clientHeight"
              );
            height = convertPixelsToMicrons(clientHeight);
          }

          if (!options.preview) {
            // Perform actual printing
            printWindow.webContents.print(
              {
                silent: !!options.silent,
                printBackground: !!options.printBackground,
                deviceName: options.printerName,
                copies: options?.copies || 1,
                pageSize: { width, height },
                ...(options.header && { header: options.header }),
                ...(options.footer && { footer: options.footer }),
                ...(options.color && { color: options.color }),
                ...(options.printBackground && {
                  printBackground: options.printBackground
                }),
                ...(options.margins && { margins: options.margins }),
                ...(options.landscape && { landscape: options.landscape }),
                ...(options.scaleFactor && {
                  scaleFactor: options.scaleFactor
                }),
                ...(options.pagesPerSheet && {
                  pagesPerSheet: options.pagesPerSheet
                }),
                ...(options.collate && { collate: options.collate }),
                ...(options.pageRanges && { pageRanges: options.pageRanges }),
                ...(options.duplexMode && { duplexMode: options.duplexMode }),
                ...(options.dpi && { dpi: options.dpi })
              },
              (success, errorType) => {
                if (errorType) {
                  window_print_error = errorType;
                  reject(new Error(errorType));
                } else if (!printedState) {
                  resolve({
                    success: true,
                    complete: success,
                    jobId: `print-${Date.now()}`
                  });
                  printedState = true;
                }
                printWindow.close();
              }
            );
          } else {
            // Preview mode - just resolve without printing
            resolve({
              success: true,
              complete: true,
              jobId: `preview-${Date.now()}`
            });
          }
        } catch (error) {
          reject(error);
        }
      });

      // Handle window load errors
      printWindow.webContents.on(
        "did-fail-load",
        (_event, _errorCode, errorDescription) => {
          reject(
            new Error(`Failed to load print template: ${errorDescription}`)
          );
        }
      );
    });
  }

  /**
   * @method renderPrintDocument
   * @description Renders print data as HTML in the print window
   * @param window BrowserWindow instance
   * @param data Array of print data to render
   * @returns Promise that resolves when rendering is complete
   */
  private static renderPrintDocument(
    window: BrowserWindow,
    data: PosPrintData[]
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        for (const [lineIndex, line] of data.entries()) {
          // Validation checks
          if (line.type === "image" && !line.path && !line.url) {
            window.close();
            reject(new Error("An Image url/path is required for type image"));
            return;
          }

          // Check for deprecated css property
          if ((line as any).css) {
            window.close();
            reject(
              new Error(
                `\`options.css\` in {css: ${(line as any).css.toString()}} is no longer supported. Please use \`options.style\` instead. Example: {style: {fontSize: 12}}`
              )
            );
            return;
          }

          // Validate style property format
          if (!!line.style && typeof line.style !== "object") {
            window.close();
            reject(
              new Error(
                `\`options.style\` at "${line.style}" should be an object. Example: {style: {fontSize: 12}}`
              )
            );
            return;
          }

          // Send each line to renderer process for HTML generation
          await sendIpcMsg("render-line", window.webContents, {
            line,
            lineIndex
          });
        }

        // All lines rendered successfully
        resolve();
      } catch (error) {
        window.close();
        reject(error);
      }
    });
  }

  /**
   * @method getAvailablePrinters
   * @description Get list of available printers on the system
   * @returns Array of printer information
   */
  public static async getAvailablePrinters(): Promise<Electron.PrinterInfo[]> {
    // We need to create a window to access getPrinters API
    const tempWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    const printers = await tempWindow.webContents.getPrintersAsync();
    tempWindow.close();
    return printers;
  }

  /**
   * @method validatePrinterConnection
   * @description Check if a specific printer is available and connected
   * @param printerName Name of the printer to check
   * @returns Boolean indicating if printer is available
   */
  public static async validatePrinterConnection(
    printerName: string
  ): Promise<boolean> {
    const printers = await this.getAvailablePrinters();
    return printers.some((printer) => printer.name === printerName);
  }
}
