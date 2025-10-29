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
        pixelRatio: 2, // Reduced from 3 for better compatibility
        backgroundColor: "#ffffff",
        cacheBust: true,
        width: 560, // Optimized for 80mm thermal printer
        height: receiptRef.current.scrollHeight,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left"
        }
      });

      // Save bill image
      const savedBillImage = await electronAPI.images.saveImageFromBase64(
        dataUrl,
        true,
        transactionData?.transactionNumber
      );

      // Print Receipt
      const res = await electronAPI.print.printReceipt(savedBillImage);

      console.log(res);

      if (res?.error || !res.data)
        throw new Error(res?.error || "Something went wrong");

      if (res.data) {
        toast.success(
          (res.data as any)?.message ||
            "Transaction Bill Printed Successfully  !"
        );
      }
    } catch (error) {
      console.error("Failed to generate receipt image:", error);
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
                className={`w-[560px] h-80 flex items-center justify-center`}
              >
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Loader className="size-6 animate-spin" />
                </div>
              </Card>
            ) : transactionData ? (
              <div
                className={
                  "w-[560px] min-h-[300px] relative overflow-hidden rounded-md"
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
                  className="w-[560px] p-6 bg-white font-sinhala box-border text-black"
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.3",
                    fontFamily: "monospace"
                  }}
                >
                  {/* Store Header */}
                  <div className="text-center mb-6">
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        marginBottom: "8px",
                        letterSpacing: "1px"
                      }}
                      className="font-sans"
                    >
                      Dewmali Super
                    </div>
                    <div style={{ fontSize: "16px", marginBottom: "4px" }}>
                      123 Main Street
                    </div>
                    <div style={{ fontSize: "16px", marginBottom: "4px" }}>
                      City, State 12576
                    </div>
                    <div style={{ fontSize: "16px", marginTop: "8px" }}>
                      Tel: (555) 123-4567
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: "2px solid #000",
                      margin: "16px 0",
                      width: "100%"
                    }}
                  ></div>

                  <div className="mt-4 space-y-3">
                    {transactionData?.items.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          fontSize: "14px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "8px",
                          flexWrap: "wrap"
                        }}
                      >
                        <span style={{ flex: "1", marginRight: "8px" }}>
                          {item.productName} - {item.quantity} x{" "}
                          {item.unitPrice}
                        </span>
                        <span style={{ fontWeight: "bold" }}>
                          {item.totalAmount}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      borderTop: "2px solid #000",
                      margin: "16px 0",
                      width: "100%"
                    }}
                  ></div>

                  <div className="text-center">
                    <h1
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        margin: "16px 0",
                        letterSpacing: "1px"
                      }}
                    >
                      එකතුව = රු.100.00
                    </h1>
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
