import { app } from "electron";
import * as fs from "node:fs/promises";
import path from "path";

class Logger {
  private logFilePath: string | null = null;
  private isInitialized = false;

  constructor() {
    // Initialize logger when app is ready
    this.initializeWhenReady();
  }

  private async initializeWhenReady() {
    if (app.isReady()) {
      await this.initialize();
    } else {
      app.whenReady().then(() => this.initialize());
    }
  }

  private async initialize() {
    if (this.isInitialized) return;

    try {
      let logDir: string;

      if (app.isPackaged) {
        // Use userData directory for packaged apps
        logDir = app.getPath("userData");
      } else {
        // Use current directory for development
        logDir = process.cwd();
      }

      const logsPath = path.join(logDir, "logs");
      await fs.mkdir(logsPath, { recursive: true });

      this.logFilePath = path.join(logsPath, "app.log");
      this.isInitialized = true;

      // Log initialization success
      await this.writeToFile(
        `[${new Date().toISOString()}] Logger initialized - Log file: ${this.logFilePath}`
      );
    } catch (error) {
      console.error("Failed to initialize logger:", error);
    }
  }

  private async writeToFile(message: string) {
    if (!this.logFilePath) return;

    try {
      await fs.appendFile(this.logFilePath, message + "\n");
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  }

  private formatMessage(
    level: string,
    message: string,
    ...args: any[]
  ): string {
    const timestamp = new Date().toISOString();
    const formattedArgs =
      args.length > 0
        ? " " +
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ")
        : "";
    return `[${timestamp}] [${level}] ${message}${formattedArgs}`;
  }

  async log(message: string, ...args: any[]) {
    const formatted = this.formatMessage("INFO", message, ...args);
    console.log(message, ...args);
    await this.writeToFile(formatted);
  }

  async error(message: string, ...args: any[]) {
    const formatted = this.formatMessage("ERROR", message, ...args);
    console.error(message, ...args);
    await this.writeToFile(formatted);
  }

  async warn(message: string, ...args: any[]) {
    const formatted = this.formatMessage("WARN", message, ...args);
    console.warn(message, ...args);
    await this.writeToFile(formatted);
  }

  async debug(message: string, ...args: any[]) {
    const formatted = this.formatMessage("DEBUG", message, ...args);
    console.log(message, ...args);
    await this.writeToFile(formatted);
  }

  getLogFilePath(): string | null {
    return this.logFilePath;
  }
}

// Create singleton instance
export const logger = new Logger();
export default logger;
