import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { useElectronAPI } from "@/hooks/use-electron-api";
import { PaymentMethod } from "@/lib/zod/transactions.zod";
import { usePosStore } from "@/lib/zustand/pos-store";

export const useCompleteTransaction = () => {
  const queryClient = useQueryClient();
  const toastId = useId();
  const {
    activeTransaction,
    transactionItems,
    setActiveTransaction,
    clearTransactionItems
  } = usePosStore();

  const mutation = useMutation({
    mutationFn: async () => {
      const api = useElectronAPI();

      const addedItems = await api.transactions.addItems(
        activeTransaction.id,
        transactionItems
      );

      if (!addedItems.success) {
        throw new Error(addedItems.error || "Failed to add transaction items");
      }

      const updatedTransaction = await api.transactions.update(
        activeTransaction.id,
        activeTransaction
      );

      if (!updatedTransaction.success) {
        throw new Error(
          updatedTransaction.error || "Failed to update transaction"
        );
      }

      // If Customer is selected & Payment method is credit,
      // Update customer balance
      if (
        activeTransaction.customerId &&
        activeTransaction.paymentMethod === PaymentMethod.LEND
      ) {
        const currentCustomer = await api.customers.getById(
          activeTransaction.customerId
        );

        if (currentCustomer.data) {
          const updatedCustomer = await api.customers.update(
            activeTransaction.customerId,
            {
              currentBalance:
                currentCustomer.data.currentBalance +
                activeTransaction.totalAmount
            }
          );

          if (!updatedCustomer.success) {
            toast.warning("Failed to update customer balance");
          }
        }
      }

      return updatedTransaction.data;
    },
    onMutate: () => {
      toast.loading("Completing Transaction...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Transaction Completed Successfully!", { id: toastId });

      setActiveTransaction(null);
      clearTransactionItems();

      //   TODO: Execute bill printing function here

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to complete transaction", {
        id: toastId
      });
    }
  });

  return mutation;
};
