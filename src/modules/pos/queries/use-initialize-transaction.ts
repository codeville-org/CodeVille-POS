import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { useElectronAPI } from "@/hooks/use-electron-api";
import { usePosStore } from "@/lib/zustand/pos-store";

export const useInitializeTransaction = () => {
  const queryClient = useQueryClient();
  const toastId = useId();
  const { setActiveTransaction } = usePosStore();

  const mutation = useMutation({
    mutationFn: async () => {
      const api = useElectronAPI();

      const response = await api.transactions.initialize({});

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to create product");
      }

      const data = response.data;

      setActiveTransaction(data);

      return data;
    },
    onMutate: () => {
      toast.loading("Processing new Transaction...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("New Transaction Initialized !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to initialize transaction", {
        id: toastId
      });
    }
  });

  return mutation;
};
