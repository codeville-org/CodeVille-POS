/*
 * Copyright (c) 2019-2025. Author Hubert Formin <hformin@gmail.com>
 * Adapted for CodeVille POS - Text, Image, and Table rendering utilities
 */
import fs from "fs";
import path from "path";
import { PrintDataStyle } from "./models";
import { isBase64, isValidHttpUrl } from "./utils";

type PageElement = HTMLElement | HTMLDivElement | HTMLImageElement;

/**
 * @function generatePageText
 * @description Create HTML element for text type
 * @param arg Print data for text
 * @returns HTMLElement containing the text
 */
export function generatePageText(arg: any): HTMLElement {
  const text = arg.value;
  let div = document.createElement("div") as HTMLElement;
  div.innerHTML = text;
  div = applyElementStyles(div, arg.style) as HTMLElement;
  return div;
}

/**
 * @function generateTableCell
 * @description Create table cell element with content and styling
 * @param arg Print data for table cell
 * @param type Cell type - 'td' or 'th'
 * @returns HTMLElement for the table cell
 */
export function generateTableCell(
  arg: any,
  type: "td" | "th" = "td"
): HTMLElement {
  const text = arg.value;
  let cellElement: HTMLElement;

  cellElement = document.createElement(type);
  cellElement.innerHTML = text;
  cellElement = applyElementStyles(cellElement, {
    padding: "7px 2px",
    ...arg.style
  });

  return cellElement;
}

/**
 * @function renderImageToPage
 * @description Create HTML element for image type
 * @param arg Print data for image
 * @returns Promise<HTMLElement> containing the image
 */
export function renderImageToPage(arg: any): Promise<HTMLElement> {
  return new Promise(async (resolve, reject) => {
    let uri: string;
    let img_con = document.createElement("div");

    const image_format = [
      "apng",
      "bmp",
      "gif",
      "ico",
      "cur",
      "jpeg",
      "jpg",
      "jpeg",
      "jfif",
      "pjpeg",
      "pjp",
      "png",
      "svg",
      "tif",
      "tiff",
      "webp"
    ];

    img_con = applyElementStyles(img_con, {
      width: "100%",
      display: "flex",
      justifyContent: arg?.position || "left"
    }) as HTMLDivElement;

    if (arg.url) {
      const isImageBase64 = isBase64(arg.url);
      if (!isValidHttpUrl(arg.url) && !isImageBase64) {
        return reject(new Error(`Invalid url: ${arg.url}`));
      }
      if (isImageBase64) {
        uri = "data:image/png;base64," + arg.url;
      } else {
        uri = arg.url;
      }
    } else if (arg.path) {
      try {
        const data = fs.readFileSync(arg.path);
        let ext = path.extname(arg.path).slice(1);
        if (image_format.indexOf(ext) === -1) {
          reject(
            new Error(
              ext +
                " file type not supported, consider the types: " +
                image_format.join(", ")
            )
          );
          return;
        }
        if (ext === "svg") {
          ext = "svg+xml";
        }
        uri = "data:image/" + ext + ";base64," + data.toString("base64");
      } catch (e) {
        reject(e);
        return;
      }
    } else {
      reject(new Error("Image requires either a valid url or path property"));
      return;
    }

    if (!uri) {
      reject(new Error("Failed to generate image URI"));
      return;
    }

    let img = document.createElement("img") as HTMLImageElement;

    img = applyElementStyles(img, {
      height: arg.height,
      width: arg.width,
      ...arg.style
    }) as HTMLImageElement;

    img.src = uri;

    // Handle image loading
    img.onload = () => {
      img_con.appendChild(img);
      resolve(img_con);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
}

/**
 * @function applyElementStyles
 * @description Apply CSS styles to an HTML element
 * @param element The HTML element to style
 * @param style Style object containing CSS properties
 * @returns The styled element
 */
export function applyElementStyles(
  element: PageElement,
  style?: PrintDataStyle
): PageElement {
  if (!style || typeof style !== "object") {
    return element;
  }

  for (const styleProp of Object.keys(style)) {
    if (!style[styleProp as keyof PrintDataStyle]) {
      continue;
    }
    (element.style as any)[styleProp] =
      style[styleProp as keyof PrintDataStyle];
  }
  return element;
}

/**
 * @function createTableElement
 * @description Create a complete table with header, body, and footer
 * @param tableData Table configuration object
 * @param lineIndex Index for unique element IDs
 * @returns Promise<HTMLElement> containing the complete table
 */
export async function createTableElement(
  tableData: any,
  lineIndex: number
): Promise<HTMLElement> {
  return new Promise(async (resolve, reject) => {
    try {
      // Create table container
      let tableContainer = document.createElement("div");
      tableContainer.setAttribute("id", `table-container-${lineIndex}`);

      let table = document.createElement("table");
      table.setAttribute("id", `table${lineIndex}`);
      table = applyElementStyles(table, {
        ...tableData.style
      }) as HTMLTableElement;

      let tHeader = document.createElement("thead");
      tHeader = applyElementStyles(
        tHeader,
        tableData.tableHeaderStyle
      ) as HTMLTableSectionElement;

      let tBody = document.createElement("tbody");
      tBody = applyElementStyles(
        tBody,
        tableData.tableBodyStyle
      ) as HTMLTableSectionElement;

      let tFooter = document.createElement("tfoot");
      tFooter = applyElementStyles(
        tFooter,
        tableData.tableFooterStyle
      ) as HTMLTableSectionElement;

      // 1. Headers
      if (tableData.tableHeader) {
        for (const headerArg of tableData.tableHeader) {
          if (typeof headerArg === "object") {
            switch (headerArg.type) {
              case "image":
                try {
                  const img = await renderImageToPage(headerArg);
                  const th = document.createElement("th");
                  th.appendChild(img);
                  tHeader.appendChild(th);
                } catch (e) {
                  reject(e);
                  return;
                }
                break;
              case "text":
                tHeader.appendChild(generateTableCell(headerArg, "th"));
                break;
            }
          } else {
            const th = document.createElement("th");
            th.innerHTML = headerArg;
            tHeader.appendChild(th);
          }
        }
      }

      // 2. Body
      if (tableData.tableBody) {
        for (const bodyRow of tableData.tableBody) {
          const rowTr = document.createElement("tr");
          for (const colArg of bodyRow) {
            if (typeof colArg === "object") {
              switch (colArg.type) {
                case "image":
                  try {
                    const img = await renderImageToPage(colArg);
                    const td = document.createElement("td");
                    td.appendChild(img);
                    rowTr.appendChild(td);
                  } catch (e) {
                    reject(e);
                    return;
                  }
                  break;
                case "text":
                  rowTr.appendChild(generateTableCell(colArg, "td"));
                  break;
              }
            } else {
              const td = document.createElement("td");
              td.innerHTML = colArg;
              rowTr.appendChild(td);
            }
          }
          tBody.appendChild(rowTr);
        }
      }

      // 3. Footer
      if (tableData.tableFooter) {
        for (const footerArg of tableData.tableFooter) {
          if (typeof footerArg === "object") {
            switch (footerArg.type) {
              case "image":
                try {
                  const img = await renderImageToPage(footerArg);
                  const footerTh = document.createElement("th");
                  footerTh.appendChild(img);
                  tFooter.appendChild(footerTh);
                } catch (e) {
                  reject(e);
                  return;
                }
                break;
              case "text":
                tFooter.appendChild(generateTableCell(footerArg, "th"));
                break;
            }
          } else {
            const footerTh = document.createElement("th");
            footerTh.innerHTML = footerArg;
            tFooter.appendChild(footerTh);
          }
        }
      }

      // Assemble table
      table.appendChild(tHeader);
      table.appendChild(tBody);
      table.appendChild(tFooter);
      tableContainer.appendChild(table);

      resolve(tableContainer);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @function renderNotSupportedElement
 * @description Create element for unsupported print types (barcode, qrCode)
 * @param type The unsupported type
 * @returns HTMLElement with not supported message
 */
export function renderNotSupportedElement(type: string): HTMLElement {
  const div = document.createElement("div");
  div.innerHTML = `<p style="color: #666; font-style: italic;">[${type.toUpperCase()} - Not supported in this version]</p>`;
  return div;
}
