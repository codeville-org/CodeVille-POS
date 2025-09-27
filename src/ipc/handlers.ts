import { BrowserWindow } from "electron";

import { categoriesHandler } from "./categories-handler";
import { customersHandler } from "./customers-handler";
import { imagesHandler } from "./images-handler";
import { productsHandler } from "./products-handler";
import { appSettingsHandler } from "./settings-handler";
import { transactionsHandler } from "./transactions-handler";
import { windowHandlers } from "./window-handler";

export function setupIPCHandlers(mainWindow: BrowserWindow) {
  // Window management
  windowHandlers.register(mainWindow);
  categoriesHandler.register();
  productsHandler.register();
  imagesHandler.register();
  customersHandler.register();
  transactionsHandler.register();
  appSettingsHandler.register();
}
