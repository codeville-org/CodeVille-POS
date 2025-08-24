import { BrowserWindow } from "electron";
import { createHandler } from "./create-handler";

let mainWindow: BrowserWindow;

const handler = createHandler("window");

export const windowHandlers = {
  register(window: BrowserWindow) {
    mainWindow = window;

    handler.handle("minimize", async () => {
      mainWindow.minimize();
    });

    handler.handle("close", async () => {
      mainWindow.close();
    });
  }
};
