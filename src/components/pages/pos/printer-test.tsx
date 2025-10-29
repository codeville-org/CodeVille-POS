import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useElectronAPI } from "@/hooks/use-electron-api";
import { PosPrintData, PosPrintOptions } from "@/lib/printer/models";
import React, { useState } from "react";
import { toast } from "sonner";

export function POSPrinterTest() {
  const electronAPI = useElectronAPI();
  const [printers, setPrinters] = useState<any[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>("");
  const [printData, setPrintData] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [paperSize, setPaperSize] = useState<string>("80mm");

  // Load available printers
  const loadPrinters = async () => {
    try {
      const result = await electronAPI.print.getAvailablePrinters();
      if (result.success) {
        setPrinters(result.printers);
        if (result.printers.length > 0) {
          // Auto-select XP-80C if available, otherwise first printer
          const xprinter = result.printers.find((p) =>
            p.name.includes("XP-80C")
          );
          setSelectedPrinter(xprinter?.name || result.printers[0].name);
        }
        toast.success(`Found ${result.printers.length} printer(s)`);
      } else {
        toast.error(result.error || "Failed to load printers");
      }
    } catch (error) {
      toast.error("Error loading printers: " + (error as Error).message);
    }
  };

  // Test print with sample data
  const testPrint = async () => {
    if (!selectedPrinter) {
      toast.error("Please select a printer");
      return;
    }

    setIsLoading(true);

    try {
      // Sample print data
      const data: PosPrintData[] = [
        {
          type: "text",
          value: "<center>CODEVILLE POS</center>",
          style: { fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }
        },
        {
          type: "text",
          value: "<center>Test Receipt</center>",
          style: { fontSize: "14px", marginBottom: "10px" }
        },
        {
          type: "text",
          value: "================================",
          style: { textAlign: "center", marginBottom: "10px" }
        },
        {
          type: "text",
          value: "Date: " + new Date().toLocaleDateString(),
          style: { marginBottom: "5px" }
        },
        {
          type: "text",
          value: "Time: " + new Date().toLocaleTimeString(),
          style: { marginBottom: "10px" }
        },
        {
          type: "text",
          value: "Items:",
          style: { fontWeight: "bold", marginBottom: "5px" }
        },
        {
          type: "table",
          tableHeader: ["Item", "Qty", "Price"],
          tableBody: [
            ["Test Item 1", "2", "$10.00"],
            ["Test Item 2", "1", "$5.50"],
            ["Test Item 3", "3", "$15.75"]
          ],
          tableFooter: ["Total", "", "$31.25"],
          style: { width: "100%", marginBottom: "10px" }
        },
        {
          type: "text",
          value: "================================",
          style: { textAlign: "center", marginBottom: "10px" }
        },
        {
          type: "text",
          value: "<center>Thank you!</center>",
          style: { fontSize: "14px", fontWeight: "bold" }
        }
      ];

      const options: PosPrintOptions = {
        printerName: selectedPrinter,
        pageSize: paperSize as any,
        preview: false,
        silent: false,
        copies: 1,
        timeOutPerLine: 400
      };

      const result = await electronAPI.print.printPOSData(data, options);

      if (result.success) {
        toast.success("Print job completed successfully!");
      } else {
        toast.error(result.error || "Print job failed");
      }
    } catch (error) {
      toast.error("Print error: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Preview print
  const previewPrint = async () => {
    if (!selectedPrinter) {
      toast.error("Please select a printer");
      return;
    }

    setIsLoading(true);

    try {
      let data: PosPrintData[] = [];

      if (printData.trim()) {
        // Parse custom print data if provided
        try {
          data = JSON.parse(printData);
        } catch {
          // If not valid JSON, treat as plain text
          data = [
            {
              type: "text",
              value: printData,
              style: {}
            }
          ];
        }
      } else {
        // Use sample data
        data = [
          {
            type: "text",
            value: "<center>PREVIEW MODE</center>",
            style: {
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px"
            }
          },
          {
            type: "text",
            value: "This is a preview of your print job.",
            style: { marginBottom: "10px" }
          }
        ];
      }

      const options: PosPrintOptions = {
        printerName: selectedPrinter,
        pageSize: paperSize as any,
        preview: true, // Enable preview mode
        silent: false,
        copies: 1
      };

      const result = await electronAPI.print.printPOSData(data, options);

      if (result.success) {
        toast.success("Preview opened successfully!");
      } else {
        toast.error(result.error || "Preview failed");
      }
    } catch (error) {
      toast.error("Preview error: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate printer connection
  const validatePrinter = async () => {
    if (!selectedPrinter) {
      toast.error("Please select a printer");
      return;
    }

    try {
      const result = await electronAPI.print.validatePrinter(selectedPrinter);
      if (result.success) {
        if (result.available) {
          toast.success("Printer is connected and available");
        } else {
          toast.warning("Printer is not available or not connected");
        }
      } else {
        toast.error(result.error || "Validation failed");
      }
    } catch (error) {
      toast.error("Validation error: " + (error as Error).message);
    }
  };

  React.useEffect(() => {
    loadPrinters();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>POS Printer Test</CardTitle>
          <CardDescription>
            Test the new POS printer functionality with your XPrinter XP-80C
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="printer">Select Printer</Label>
              <Select
                value={selectedPrinter}
                onValueChange={setSelectedPrinter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a printer" />
                </SelectTrigger>
                <SelectContent>
                  {printers.map((printer) => (
                    <SelectItem key={printer.name} value={printer.name}>
                      {printer.name} {printer.isDefault ? "(Default)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paperSize">Paper Size</Label>
              <Select value={paperSize} onValueChange={setPaperSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="44mm">44mm</SelectItem>
                  <SelectItem value="57mm">57mm</SelectItem>
                  <SelectItem value="58mm">58mm</SelectItem>
                  <SelectItem value="76mm">76mm</SelectItem>
                  <SelectItem value="78mm">78mm</SelectItem>
                  <SelectItem value="80mm">80mm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="printData">Custom Print Data (JSON format)</Label>
            <Textarea
              id="printData"
              placeholder="Leave empty to use sample data, or enter custom JSON print data..."
              value={printData}
              onChange={(e) => setPrintData(e.target.value)}
              rows={6}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={loadPrinters} variant="outline">
              Refresh Printers
            </Button>
            <Button onClick={validatePrinter} variant="outline">
              Test Connection
            </Button>
            <Button
              onClick={previewPrint}
              variant="outline"
              disabled={isLoading}
            >
              Preview
            </Button>
            <Button
              onClick={testPrint}
              disabled={isLoading || !selectedPrinter}
            >
              {isLoading ? "Printing..." : "Print Test"}
            </Button>
          </div>

          {printers.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Available Printers:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {printers.map((printer) => (
                  <li key={printer.name} className="flex justify-between">
                    <span>{printer.name}</span>
                    <span>{printer.description || "No description"}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
