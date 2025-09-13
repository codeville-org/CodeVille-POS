import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { useElectronAPI } from "@/hooks/use-electron-api";
import { CreateTransactionSchema } from "@/lib/zod/transactions.zod";

export const useInitializeTransaction = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (body: CreateTransactionSchema) => {
      const api = useElectronAPI();

      const response = await api.transactions.initialize(body);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to create transaction");
      }

      const data = response.data;
      return data;
    },
    onMutate: () => {
      toast.loading("Initializing new Transaction...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Transaction initialized successfully!", {
        id: toastId
      });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create transaction", {
        id: toastId
      });
    }
  });

  return mutation;
};
