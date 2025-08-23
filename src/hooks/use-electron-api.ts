import { useEffect, useCallback } from "react";

export const useElectronAPI = () => {
  return window.electronAPI;
};
