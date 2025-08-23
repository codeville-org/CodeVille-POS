import { ipcMain } from "electron";
import { ElectronAPI } from "@/shared/types/ipc";

// Helper function for type-safe IPC handler registration
export function createHandler<T extends keyof ElectronAPI>(channel: T) {
  return {
    handle<K extends keyof ElectronAPI[T]>(
      method: K,
      handler: ElectronAPI[T][K]
    ) {
      const channelName = `${channel}:${String(method)}`;
      ipcMain.handle(channelName, async (event, ...args: any[]) => {
        try {
          // @ts-ignore - TypeScript can't infer the complex handler type
          return await handler(...args);
        } catch (error) {
          console.error(`Error in ${channelName}:`, error);
          throw error;
        }
      });
    }
  };
}
