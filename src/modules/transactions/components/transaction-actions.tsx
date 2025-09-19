import {
  Banknote,
  ClockIcon,
  EyeIcon,
  Printer,
  TrashIcon,
  UserIcon
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { TEXTS } from "@/lib/language";
import { formatPrice } from "@/lib/utils";
import {
  PaymentMethod,
  SelectTransactionSchema
} from "@/lib/zod/transactions.zod";
import { usePersistStore } from "@/lib/zustand/persist-store";
import { useDeleteTransaction } from "../query/use-delete";

type Props = {
  transaction: SelectTransactionSchema;
};

export function TransactionActions({ transaction }: Props) {
  const { language } = usePersistStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate: mutateDelete, isPending: deleting } = useDeleteTransaction(
    transaction.id
  );

  const handleDelete = () => {
    if (deleting) return;

    mutateDelete(undefined, {
      onSuccess: () => setIsOpen(false)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Badge
          className="p-1.5 cursor-pointer rounded-md text-teal-600 bg-teal-600/10 "
          onClick={() => setIsOpen(true)}
        >
          <EyeIcon className={"size-6"} />
          <span>{TEXTS.actions.view[language]}</span>
        </Badge>
      </DialogTrigger>

      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Transaction #{transaction.transactionNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 rounded-lg border border-secondary overflow-hidden">
          {transaction.items.length === 0 ? (
            <div className="w-full h-40 flex items-center justify-center bg-muted text-sm text-muted-foreground">
              No items in this transaction.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full">
                {transaction.items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-secondary/20">
                    <TableCell className="py-4 font-medium">
                      {item.productName}
                    </TableCell>
                    <TableCell className="py-4 ">{item.quantity}</TableCell>
                    <TableCell className="py-4 ">{item.unit}</TableCell>
                    <TableCell className="py-4 text-right">
                      {formatPrice(item.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow className="w-full h-1"></TableRow>

                <TableRow className="py-3 bg-muted">
                  <TableCell colSpan={3} className="text-left font-medium">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right font-medium ">
                    {formatPrice(transaction.subtotalAmount || 0)}
                  </TableCell>
                </TableRow>
                <TableRow className="py-3 bg-muted">
                  <TableCell colSpan={3} className="text-left font-medium">
                    Discount
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    + {formatPrice(transaction.discountAmount || 0)}
                  </TableCell>
                </TableRow>
                <TableRow className="py-3 bg-muted">
                  <TableCell colSpan={3} className="text-left font-medium">
                    Tax Amount
                  </TableCell>
                  <TableCell className="text-right font-medium text-amber-500">
                    - {formatPrice(transaction.taxAmount || 0)}
                  </TableCell>
                </TableRow>
                <TableRow className="py-3 bg-muted">
                  <TableCell colSpan={3} className="text-left font-medium">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-semibold text-base text-red-600">
                    {formatPrice(transaction.totalAmount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-muted py-2 px-4 rounded-md border border-muted-foreground/50">
            <UserIcon className="size-6 text-muted-foreground" />

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Customer</span>
              <span className="text-base">
                {transaction.customer
                  ? transaction.customer.name
                  : "Walk-in Customer"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-muted py-2 px-4 rounded-md border border-muted-foreground/50">
            <ClockIcon className="size-6 text-muted-foreground" />

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">{`Date & Time`}</span>
              <span className="text-base">
                {new Date(transaction.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-muted py-2 px-4 rounded-md border border-muted-foreground/50">
            <Banknote className="size-6 text-muted-foreground" />

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                {transaction.paymentMethod === PaymentMethod.CASH
                  ? `Recived Cash`
                  : transaction.paymentMethod === PaymentMethod.LEND
                    ? `Credit Balance`
                    : `Payment Method`}
              </span>
              <span className="text-base">
                {transaction.paymentMethod === PaymentMethod.CASH
                  ? formatPrice(transaction.cashReceived)
                  : transaction.paymentMethod === PaymentMethod.LEND
                    ? `+ ${formatPrice(transaction.totalAmount)}`
                    : `Card`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="w-full flex-1 h-full bg-amber-600 hover:bg-amber-700 text-white hover:text-white"
              icon={<Printer />}
            >
              Print Bill
            </Button>
            <Button
              className="w-full flex-1 h-full bg-red-600 hover:bg-red-700 text-white hover:text-white"
              icon={<TrashIcon />}
              onClick={handleDelete}
              loading={deleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
