import { BrowserWindow } from "electron";
import { categoriesHandler } from "./categories-handler";
import { imagesHandler } from "./images-handler";
import { productsHandler } from "./products-handler";
import { windowHandlers } from "./window-handler";

export function setupIPCHandlers(mainWindow: BrowserWindow) {
  // Window management
  windowHandlers.register(mainWindow);
  categoriesHandler.register();
  productsHandler.register();
  imagesHandler.register();
}
