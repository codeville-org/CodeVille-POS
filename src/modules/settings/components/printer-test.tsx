import { Loader } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useElectronAPI } from "@/hooks/use-electron-api";
import { PrinterInfo } from "@/lib/zod/printers.zod";
import { useListPrinters } from "@/modules/print/queries/use-list-printers";

export function PrinterTest() {
  const api = useElectronAPI();

  const [selectedPrinter, setSelectedPrinter] = useState<PrinterInfo | null>(
    null
  );

  const { data, error, isPending } = useListPrinters();

  const onClickPrintTest = async () => {
    if (!selectedPrinter) return;

    const result = await api.print.testPrint(selectedPrinter.name);

    console.log("Test Print Result:", result);
  };

  return (
    <Card className="bg-secondary/30">
      <CardHeader>
        <CardTitle>Print Settings</CardTitle>
        <CardDescription>
          Update your printer settings and test print functionality.
        </CardDescription>
      </CardHeader>

      {isPending ? (
        <div className="flex items-center justify-center h-20 w-full">
          <Loader className="size-4 animate-spin" />
        </div>
      ) : error ? (
        <CardContent>
          <p className="text-red-500">Error: {error.message}</p>
        </CardContent>
      ) : (
        <CardContent>
          <Select
            value={selectedPrinter?.name || ""}
            onValueChange={(value) => {
              const printer =
                data?.printers.find((p) => p.name === value) || null;
              setSelectedPrinter(printer);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select POS Printer" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Available Printers</SelectLabel>
                {data?.printers.map((printer) => (
                  <SelectItem value={printer.name} key={printer.name}>
                    {printer.displayName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      )}

      <CardFooter className="flex items-center gap-3">
        <Button disabled={!selectedPrinter}>Set as Default</Button>
        <Button
          disabled={!selectedPrinter}
          variant="secondary"
          onClick={onClickPrintTest}
        >
          Test Print
        </Button>
      </CardFooter>
    </Card>
  );
}
