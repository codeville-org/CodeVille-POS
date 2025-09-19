import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { useElectronAPI } from "@/hooks/use-electron-api";

export const useDeleteTransaction = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async () => {
      const api = useElectronAPI();

      const response = await api.transactions.delete(id);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to update transaction");
      }

      const data = response.data;
      return data;
    },
    onMutate: () => {
      toast.loading("Deleting Transaction...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Transaction deleted successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete transaction", {
        id: toastId
      });
    }
  });

  return mutation;
};
