import type { ElectronAPI } from "./src/shared/types/ipc";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    // electronEvents: {
    //   on<K extends keyof IPCEvents>(
    //     event: K,
    //     callback: (data: IPCEvents[K]) => void
    //   ): () => void;
    //   once<K extends keyof IPCEvents>(
    //     event: K,
    //     callback: (data: IPCEvents[K]) => void
    //   ): void;
    // };
  }
}
