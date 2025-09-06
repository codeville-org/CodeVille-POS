import { logger } from "@/lib/logger";
import { app, ipcMain } from "electron";

export const diagnosticsHandler = {
  register() {
    // Get log file path
    ipcMain.handle("diagnostics:getLogPath", async () => {
      return logger.getLogFilePath();
    });

    // Get app info for debugging
    ipcMain.handle("diagnostics:getAppInfo", async () => {
      return {
        isPackaged: app.isPackaged,
        isReady: app.isReady(),
        platform: process.platform,
        arch: process.arch,
        cwd: process.cwd(),
        userDataPath: app.isReady() ? app.getPath("userData") : "Not ready",
        documentsPath: app.isReady() ? app.getPath("documents") : "Not ready",
        tempPath: app.isReady() ? app.getPath("temp") : "Not ready"
      };
    });

    // Log a test message
    ipcMain.handle("diagnostics:testLog", async (_, message: string) => {
      await logger.log("Test message from renderer:", message);
      return "Log message sent";
    });
  }
};
