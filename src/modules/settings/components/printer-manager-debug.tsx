import { useElectronAPI } from "@/hooks/use-electron-api";
import { PrinterInfo } from "@/lib/zod/printers.zod";
import React, { useEffect, useState } from "react";

interface PrinterSettings {
  printerName?: string; // Windows
  devicePath?: string; // Linux/Mac
}

export const PrinterManager: React.FC = () => {
  const api = useElectronAPI();
  const [platform, setPlatform] = useState<string>("");
  const [availablePrinters, setAvailablePrinters] = useState<PrinterInfo[]>([]);
  const [settings, setSettings] = useState<PrinterSettings>({
    printerName: "",
    devicePath: "/dev/usb/lp0"
  });
  const [logoPath, setLogoPath] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [testing, setTesting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlatformAndPrinters();
  }, []);

  const loadPlatformAndPrinters = async () => {
    try {
      const platformName = await api.print.getPlatform();
      setPlatform(platformName);

      if (platformName === "win32") {
        const { data, error, success } = await api.print.getAvailablePrinters();

        if (error || !success || !data) throw new Error(error);

        setAvailablePrinters(data.printers);

        if (data.printers.length > 0) {
          setSettings({ ...settings, printerName: data.printers[0].name });
        }
      }
    } catch (error) {
      console.error("Failed to load platform/printers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setStatus("Testing printer connection...");

    try {
      const result = await api.print.testPrinter(settings);

      if (result) {
        setStatus(
          "✓ Printer connected successfully! A test page should have printed."
        );
      } else {
        setStatus("✗ Printer connection failed. Check your printer settings.");
      }
    } catch (error) {
      setStatus(
        `✗ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setTesting(false);
    }
  };

  const handlePrintSample = async () => {
    setStatus("Printing sample receipt...");

    const sampleReceipt = {
      storeName: "Dewmali Super",
      storeAddress: "123 Main Street, City, State 12345",
      logoPath: logoPath || undefined,
      items: [
        {
          name: "Elephant House - Chocolate Ice Cream (500ml)",
          quantity: 1,
          price: 375.0,
          unit: "ml"
        },
        { name: "Maliban Tempo Snack", quantity: 1, price: 100.0, unit: "pcs" }
      ],
      subtotal: 4405.0,
      tax: 100.0,
      total: 4505.0,
      timestamp: new Date()
    };

    try {
      await api.print.printReceipt(sampleReceipt);

      setStatus("✓ Receipt printed successfully!");
    } catch (error) {
      setStatus(
        `✗ Print failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleSelectLogo = async () => {
    try {
      const path = await api.print.selectImageFile();

      if (path) {
        setLogoPath(path);
        setStatus(`✓ Logo selected: ${path.split(/[\\/]/).pop()}`);
      }
    } catch (error) {
      setStatus(
        `✗ Failed to select image: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handlePrintLogo = async () => {
    if (!logoPath) {
      setStatus("✗ Please select a logo first");
      return;
    }

    setStatus("Printing logo...");
    try {
      // Try with dithering first (usually better for thermal printers)
      await api.print.printImage(logoPath, "center", true);

      setStatus("✓ Logo printed successfully!");
    } catch (error) {
      setStatus(
        `✗ Failed to print logo: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handlePrintLogoBill = async () => {
    if (!logoPath) {
      setStatus("✗ Please select a logo first");
      return;
    }

    setStatus("Printing logo as full-width bill...");
    try {
      // Print image at full paper width (80mm)
      await api.print.printImageBill(logoPath, true);

      setStatus("✓ Logo bill printed successfully!");
    } catch (error) {
      setStatus(
        `✗ Failed to print logo bill: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleOpenCashDrawer = async () => {
    setStatus("Opening cash drawer...");
    try {
      await api.print.openCashDrawer();

      setStatus("✓ Cash drawer opened!");
    } catch (error) {
      setStatus(
        `✗ Failed to open cash drawer: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleRefreshPrinters = async () => {
    setLoading(true);
    await loadPlatformAndPrinters();
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>Loading printer configuration...</div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>USB Printer Configuration</h2>

      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px"
        }}
      >
        <strong>Platform:</strong>{" "}
        {platform === "win32"
          ? "Windows"
          : platform === "darwin"
            ? "macOS"
            : "Linux"}
      </div>

      {platform === "win32" ? (
        // Windows printer selection
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            <strong>Select Printer:</strong>
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <select
              value={settings.printerName || ""}
              onChange={(e) =>
                setSettings({ ...settings, printerName: e.target.value })
              }
              style={{ padding: "8px", flex: 1, fontSize: "14px" }}
            >
              {availablePrinters.length === 0 ? (
                <option value="">No printers found</option>
              ) : (
                availablePrinters.map((printer, index) => (
                  <option key={index} value={printer.name}>
                    {printer.name}
                  </option>
                ))
              )}
            </select>
            <button
              onClick={handleRefreshPrinters}
              style={{ padding: "8px 16px" }}
            >
              Refresh
            </button>
          </div>
          {availablePrinters.length === 0 && (
            <div
              style={{ marginTop: "10px", fontSize: "13px", color: "#d9534f" }}
            >
              ⚠️ No printers detected. Make sure your USB printer is connected
              and installed.
            </div>
          )}
        </div>
      ) : (
        // Linux/Mac device path
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            <strong>Device Path:</strong>
          </label>
          <input
            type="text"
            value={settings.devicePath || ""}
            onChange={(e) =>
              setSettings({ ...settings, devicePath: e.target.value })
            }
            placeholder="/dev/usb/lp0"
            style={{ padding: "8px", width: "100%", fontSize: "14px" }}
          />
          <div style={{ marginTop: "5px", fontSize: "12px", color: "#666" }}>
            Common paths: /dev/usb/lp0, /dev/usb/lp1, /dev/ttyUSB0
          </div>
        </div>
      )}

      {/* Logo Selection */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px"
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: "16px" }}>
          Logo / Image Printing
        </h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button
            onClick={handleSelectLogo}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Select Logo
          </button>
          {logoPath && (
            <>
              <button
                onClick={handlePrintLogo}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Print Logo Only
              </button>
              <button
                onClick={handlePrintLogoBill}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Print as Full Bill
              </button>
            </>
          )}
        </div>
        {logoPath && (
          <div style={{ fontSize: "13px", color: "#666" }}>
            Selected: {logoPath.split(/[\\/]/).pop()}
          </div>
        )}
        <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
          Supported formats: PNG, JPG, BMP (will be converted to monochrome)
          <br />
          <strong>Print Logo Only:</strong> Centered, smaller size for receipts
          <br />
          <strong>Print as Full Bill:</strong> Full paper width (80mm) for
          complete bills
        </div>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap"
        }}
      >
        <button
          onClick={handleTest}
          disabled={testing || (platform === "win32" && !settings.printerName)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: testing ? "not-allowed" : "pointer",
            opacity: testing ? 0.6 : 1
          }}
        >
          {testing ? "Testing..." : "Test Connection"}
        </button>

        <button
          onClick={handlePrintSample}
          disabled={platform === "win32" && !settings.printerName}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Print Sample Receipt
        </button>

        <button
          onClick={handleOpenCashDrawer}
          disabled={platform === "win32" && !settings.printerName}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ffc107",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Open Cash Drawer
        </button>
      </div>

      {status && (
        <div
          style={{
            marginTop: "15px",
            padding: "12px",
            backgroundColor: status.startsWith("✓") ? "#d4edda" : "#f8d7da",
            border: `1px solid ${status.startsWith("✓") ? "#c3e6cb" : "#f5c6cb"}`,
            borderRadius: "4px",
            color: status.startsWith("✓") ? "#155724" : "#721c24"
          }}
        >
          {status}
        </div>
      )}

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#e7f3ff",
          borderRadius: "4px"
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: "16px" }}>Setup Instructions:</h3>
        {platform === "win32" ? (
          <ul
            style={{ marginBottom: 0, paddingLeft: "20px", fontSize: "14px" }}
          >
            <li>Connect your USB receipt printer</li>
            <li>Install printer drivers if needed</li>
            <li>
              Make sure the printer appears in Windows "Devices and Printers"
            </li>
            <li>Click "Refresh" to update the printer list</li>
            <li>Select your printer and click "Test Connection"</li>
          </ul>
        ) : (
          <ul
            style={{ marginBottom: 0, paddingLeft: "20px", fontSize: "14px" }}
          >
            <li>Connect your USB receipt printer</li>
            <li>Find the device path (usually /dev/usb/lp0 or /dev/usb/lp1)</li>
            <li>
              You may need permissions: <code>sudo chmod 666 /dev/usb/lp0</code>
            </li>
            <li>
              Or add your user to the lp group:{" "}
              <code>sudo usermod -a -G lp $USER</code>
            </li>
            <li>Enter the device path and click "Test Connection"</li>
          </ul>
        )}
      </div>
    </div>
  );
};
