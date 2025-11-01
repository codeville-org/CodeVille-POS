import { toPng } from "html-to-image";
import { Loader, Loader2, PrinterIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useElectronAPI } from "@/hooks/use-electron-api";
import { SelectTransactionSchema } from "@/lib/zod/transactions.zod";
import { usePrinterStore } from "@/lib/zustand/printer-store";
import { useGetTransactionByID } from "@/modules/transactions/query/use-get-by-id";

type Props = {};

export function PrinterProvider({}: Props) {
  const electronAPI = useElectronAPI();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [transactionData, setTransactionData] =
    useState<SelectTransactionSchema | null>(null);
  const {
    currentItem,
    printerModalOpen,
    printerStatus,
    setPrinterModalOpen,
    setPrinterStatus
  } = usePrinterStore();
  const { mutateAsync: getTransactionByID } = useGetTransactionByID();

  useEffect(() => {
    if (currentItem && printerModalOpen) {
      handleFetchTransaction();
    }
  }, [currentItem, printerModalOpen]);

  const handleFetchTransaction = async () => {
    setIsFetching(true);

    await getTransactionByID(currentItem.transactionId, {
      onSuccess: (data) => {
        setTransactionData(data);
        setIsFetching(false);
      },
      onSettled: () => {
        setIsFetching(false);
      }
    });
  };

  const handlePrint = async (): Promise<void> => {
    if (receiptRef.current === null) {
      console.error("Receipt reference is not available.");
      return;
    }

    try {
      setPrinterStatus("printing");

      const dataUrl = await toPng(receiptRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        cacheBust: true,
        width: 576,
        height: receiptRef.current.scrollHeight
      });

      // Save bill image
      const savedBillImage = await electronAPI.images.saveImageFromBase64(
        dataUrl,
        true,
        transactionData?.transactionNumber
      );

      console.log("Saved bill image path:", savedBillImage);

      // Print bill image at full width (80mm thermal paper)
      console.log("Attempting to print bill image...");
      const printResult = await electronAPI.print.printImageBill(
        savedBillImage,
        true
      );
      console.log("Print result:", printResult);

      if (printResult.success) {
        toast.success("Transaction Bill Printed Successfully!");
      } else {
        console.error("Print failed:", printResult.error);
        toast.error(`Print failed: ${printResult.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to generate or print receipt image:", error);
      toast.error(
        `Print failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setPrinterStatus("idle");
    }
  };

  if (currentItem && printerModalOpen)
    return (
      <Dialog
        open={printerModalOpen}
        onOpenChange={(open) => setPrinterModalOpen(open)}
      >
        <DialogContent className="min-w-fit">
          <DialogHeader>
            <DialogTitle>Do you need a receipt?</DialogTitle>
            <DialogDescription>
              You can print a receipt from completed transaction or ignore.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full flex items-center justify-center">
            {isFetching ? (
              <Card
                className={`w-[576px] h-80 flex items-center justify-center`}
              >
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Loader className="size-6 animate-spin" />
                </div>
              </Card>
            ) : transactionData ? (
              <div
                className={
                  "w-[576px] min-h-[300px] relative overflow-hidden rounded-md"
                }
              >
                {printerStatus === "printing" && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-full z-40 bg-green-600/40 backdrop-blur-xs flex items-center justify-center">
                      <div className="p-5 w-fit h-fit rounded-full bg-amber-600/50 text-green-600">
                        <PrinterIcon className="size-12 animate-pulse" />
                      </div>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full z-50 flex items-center justify-center">
                      <Loader2 className=" size-28 animate-spin text-green-500" />
                    </div>
                  </>
                )}

                <div
                  ref={receiptRef}
                  className="w-[576px] p-4 bg-white font-sinhala box-border text-black"
                >
                  {/* Store Header */}
                  {/* <div className="text-center mb-6">
                    <div
                      style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        marginBottom: "10px"
                      }}
                      className="text-xl font-black mb-3 font-sans"
                    >
                      {`Dewmali Super`}
                    </div>
                    <div className="text-xl">123 Main Street</div>
                    <div className="text-xl">City, State 12576</div>
                    <div className="text-xl mt-2">Tel: (555) 123-4567</div>
                  </div>

                  <Separator />

                  <div className="mt-3 space-y-2">
                    {transactionData?.items.map((item, index) => (
                      <p className="text-sm" key={index}>
                        {item.productName} - {item.quantity} x {item.unitPrice}{" "}
                        = {item.totalAmount}
                      </p>
                    ))}
                  </div>

                  <Separator />

                  <h1 className="text-2xl font-semibold">එකතුව = රු.100.00</h1> */}

                  {/* Store Logo */}
                  <div className="w-full flex items-center justify-center h-fit">
                    <img
                      src={"./assets/store_logo.png"}
                      alt="Store Logo"
                      className="size-8 object-cover"
                    />

                    <div className="text-center">
                      <h1 className="text-lg font-semibold">
                        Dewmali Super |{" "}
                        <span className="font-sinhala">දෙව්මාලි සුපර්</span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-center text-sm text-muted-foreground">
                  No transaction data available.
                </p>
              </>
            )}
          </div>

          <DialogFooter className="flex items-center gap-3">
            <DialogClose asChild className="flex-1 w-full">
              <Button variant="outline">Skip</Button>
            </DialogClose>

            <Button
              variant="default"
              className="flex-1 w-full"
              onClick={handlePrint}
            >
              Print Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

  return null;
}
