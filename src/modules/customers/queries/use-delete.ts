import { useElectronAPI } from "@/hooks/use-electron-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";

export const useDeleteCustomer = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async () => {
      const api = useElectronAPI();

      const response = await api.customers.delete(id);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to delete customer");
      }

      const data = response.data;
      return data;
    },
    onMutate: () => {
      toast.loading("Deleting Customer...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Customer deleted successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete customer", {
        id: toastId
      });
    }
  });

  return mutation;
};
