import { BrowserWindow } from "electron";
import { windowHandlers } from "./window-handler";

export function setupIPCHandlers(mainWindow: BrowserWindow) {
  // Window management
  windowHandlers.register(mainWindow);
}
