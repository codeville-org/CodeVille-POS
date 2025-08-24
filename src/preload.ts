// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from "electron";
import type { ElectronAPI } from "./shared/types/ipc";
import { createInvoker } from "./shared/utils/ipc-invoker";

const windowInvoker = createInvoker("window");

const electronAPI: ElectronAPI = {
  window: {
    close: windowInvoker("close"),
    minimize: windowInvoker("minimize")
  }
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
