import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { useElectronAPI } from "@/hooks/use-electron-api";
import { usePosStore } from "@/lib/zustand/pos-store";

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const toastId = useId();
  const { activeTransaction, setActiveTransaction } = usePosStore();

  const mutation = useMutation({
    mutationFn: async (customerId: string | null) => {
      const api = useElectronAPI();

      if (!activeTransaction) {
        throw new Error("No Active Transaction");
      }

      const response = await api.transactions.update(activeTransaction.id, {
        customerId: customerId
      });

      if (!response.data || response.error) {
        throw new Error(response.error || "Customer update failed");
      }

      const data = response.data;

      setActiveTransaction({ ...activeTransaction, customerId });

      return data;
    },
    onMutate: () => {
      toast.loading("Updating customer...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Customer updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update customer", {
        id: toastId
      });
    }
  });

  return mutation;
};
