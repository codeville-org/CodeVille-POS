import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

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
import { PrinterInfo } from "@/lib/zod/printers.zod";
import { useListPrinters } from "@/modules/printer/queries/use-list-printers";
import { toast } from "sonner";
import { useUpsertSettings } from "../query/use-upsert";

export function PrinterManagement() {
  const [defaultPrinterName, setDefaultPrinterName] = useState<string | null>(
    null
  );
  const { data, error, isPending } = useListPrinters();
  const { mutate: upsertSettings, isPending: updatingSettings } =
    useUpsertSettings();

  const [selectedPrinter, setSelectedPrinter] = useState<PrinterInfo | null>(
    null
  );

  useEffect(() => {
    if (data) {
      const defaultP = data.filter((p) => p.isDefault);

      if (defaultP.length > 0) setDefaultPrinterName(defaultP[0].name);
    }
  }, [data]);

  const handleSetDefault = () => {
    if (selectedPrinter) {
      upsertSettings({ defaultPrinter: selectedPrinter.name });

      toast.success("Default printer updated !");
    }
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
            defaultValue={defaultPrinterName}
            value={selectedPrinter?.name || defaultPrinterName || ""}
            onValueChange={(value) => {
              const printer = data?.find((p) => p.name === value) || null;
              setSelectedPrinter(printer);
            }}
            disabled={updatingSettings}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select POS Printer" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Available Printers</SelectLabel>
                {data?.map((printer) => (
                  <SelectItem value={printer.name} key={printer.name}>
                    {printer.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      )}

      <CardFooter className="flex items-center gap-3">
        <Button
          disabled={!selectedPrinter || updatingSettings}
          onClick={handleSetDefault}
          loading={updatingSettings}
        >
          Set as Default
        </Button>
      </CardFooter>
    </Card>
  );
}
