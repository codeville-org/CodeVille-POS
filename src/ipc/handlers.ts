import { BrowserWindow } from "electron";
import { categoriesHandler } from "./categories-handler";
import { productsHandler } from "./products-handler";
import { windowHandlers } from "./window-handler";

export function setupIPCHandlers(mainWindow: BrowserWindow) {
  // Window management
  windowHandlers.register(mainWindow);
  categoriesHandler.register();
  productsHandler.register();
}
