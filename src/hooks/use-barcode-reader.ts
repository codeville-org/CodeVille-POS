import { useCallback, useEffect, useRef, useState } from "react";

export interface BarcodeReaderOptions {
  onScan?: (barcode: string) => void;
  onError?: (error: string) => void;
  enabled?: boolean;
  minLength?: number;
  maxLength?: number;
  simulationEnabled?: boolean;
  simulationShortcut?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    key: string;
  };
  simulationBarcodes?: string[];
}

export interface BarcodeReaderState {
  isScanning: boolean;
  lastScannedBarcode: string | null;
  lastScanTime: number | null;
}

export function useBarcodeReader(options: BarcodeReaderOptions = {}) {
  const {
    onScan,
    onError,
    enabled = true,
    minLength = 3,
    maxLength = 50,
    simulationEnabled = false,
    simulationShortcut = { ctrl: true, shift: true, key: "B" },
    simulationBarcodes = [
      "1234567890123",
      "9876543210987",
      "5555555555555",
      "1111222233334",
      "9998887776665"
    ]
  } = options;

  const [state, setState] = useState<BarcodeReaderState>({
    isScanning: false,
    lastScannedBarcode: null,
    lastScanTime: null
  });

  // Barcode buffer and timing refs
  const barcodeBufferRef = useRef<string>("");
  const lastKeypressTimeRef = useRef<number>(0);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate barcode scan
  const simulateBarcodeScan = useCallback(() => {
    if (!simulationEnabled || !simulationBarcodes.length) return;

    const randomBarcode =
      simulationBarcodes[Math.floor(Math.random() * simulationBarcodes.length)];

    setState((prev) => ({ ...prev, isScanning: true }));

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isScanning: false,
        lastScannedBarcode: randomBarcode,
        lastScanTime: Date.now()
      }));

      onScan?.(randomBarcode);
    }, 200);
  }, [simulationEnabled, simulationBarcodes, onScan]);

  // Process scanned barcode
  const processScan = useCallback(
    (barcode: string) => {
      const trimmedBarcode = barcode.trim();

      if (
        trimmedBarcode.length < minLength ||
        trimmedBarcode.length > maxLength
      ) {
        onError?.(
          `Invalid barcode length: ${trimmedBarcode.length} characters`
        );
        return;
      }

      setState((prev) => ({
        ...prev,
        isScanning: false,
        lastScannedBarcode: trimmedBarcode,
        lastScanTime: Date.now()
      }));

      onScan?.(trimmedBarcode);
    },
    [minLength, maxLength, onScan, onError]
  );

  // Keyboard event handler
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for simulation shortcut
      if (simulationEnabled) {
        const shortcutMatch =
          (!simulationShortcut.ctrl || e.ctrlKey) &&
          (!simulationShortcut.shift || e.shiftKey) &&
          (!simulationShortcut.alt || e.altKey) &&
          (e.key === simulationShortcut.key ||
            e.code === `Key${simulationShortcut.key}`);

        if (shortcutMatch) {
          e.preventDefault();
          e.stopPropagation();
          simulateBarcodeScan();
          return;
        }
      }

      // Ignore if user is typing in form elements or interacting with UI controls
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.tagName === "BUTTON" ||
        target.isContentEditable ||
        // Check for form controls and interactive elements
        target.closest('[role="combobox"]') ||
        target.closest('[role="listbox"]') ||
        target.closest('[role="option"]') ||
        target.closest('[role="button"]') ||
        target.closest("[data-radix-collection-item]") ||
        target.closest("[data-radix-select-trigger]") ||
        target.closest("[data-radix-select-content]") ||
        target.closest("[data-radix-dropdown-menu]") ||
        target.closest("[tabindex]") ||
        // Check if target or any parent has focus/interactive attributes
        target.hasAttribute("tabindex") ||
        target.getAttribute("role") === "button" ||
        target.getAttribute("role") === "combobox" ||
        target.getAttribute("role") === "listbox"
      ) {
        return;
      }

      // Special handling for space key - often used for UI interactions
      if (e.key === " ") {
        // If any focusable element is currently focused, ignore space key
        const activeElement = document.activeElement as HTMLElement;
        if (
          activeElement &&
          (activeElement.tagName === "BUTTON" ||
            activeElement.hasAttribute("tabindex") ||
            activeElement.getAttribute("role") === "button" ||
            activeElement.getAttribute("role") === "combobox" ||
            activeElement.closest('[role="combobox"]') ||
            activeElement.closest("[data-radix-select-trigger]"))
        ) {
          return;
        }
      }

      // Ignore modifier keys and special keys
      if (
        e.key.length !== 1 ||
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        e.key === "Enter"
      ) {
        return;
      }

      const now = Date.now();
      const timeSinceLastKey = now - lastKeypressTimeRef.current;

      // If this is the start of a new scan (> 200ms since last key)
      if (timeSinceLastKey > 200) {
        barcodeBufferRef.current = "";
        setState((prev) => ({ ...prev, isScanning: true }));
      }

      lastKeypressTimeRef.current = now;

      // Clear existing timeout
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }

      // Add character to buffer
      barcodeBufferRef.current += e.key;

      // Process barcode after a short delay (typical for barcode scanners)
      scanTimeoutRef.current = setTimeout(() => {
        const barcode = barcodeBufferRef.current;
        if (barcode.length >= minLength) {
          processScan(barcode);
        } else {
          setState((prev) => ({ ...prev, isScanning: false }));
        }
        barcodeBufferRef.current = "";
      }, 50);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [
    enabled,
    simulationEnabled,
    simulationShortcut,
    simulateBarcodeScan,
    processScan,
    minLength
  ]);

  // Manual trigger for testing
  const triggerSimulation = useCallback(() => {
    if (simulationEnabled) {
      simulateBarcodeScan();
    }
  }, [simulationEnabled, simulateBarcodeScan]);

  // Clear last scanned barcode
  const clearLastScan = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lastScannedBarcode: null,
      lastScanTime: null
    }));
  }, []);

  return {
    ...state,
    triggerSimulation,
    clearLastScan,
    isEnabled: enabled
  };
}
