import { ipcRenderer } from "electron";
import { ElectronAPI } from "../types/ipc";

export function createInvoker<T extends keyof ElectronAPI>(channel: T) {
  return <K extends keyof ElectronAPI[T]>(
    method: K
  ): ElectronAPI[T][K] extends (...args: any[]) => any
    ? ElectronAPI[T][K]
    : never => {
    return ((...args: any[]) => {
      return ipcRenderer.invoke(`${channel}:${String(method)}`, ...args);
    }) as any;
  };
}
