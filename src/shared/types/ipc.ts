// Window management types
export interface WindowActions {
  minimize: () => Promise<void>;
  close: () => Promise<void>;
}

// Main IPC API interface
export interface ElectronAPI {
  window: WindowActions;
}
