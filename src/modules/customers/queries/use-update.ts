import { useElectronAPI } from "@/hooks/use-electron-api";
import { UpdateCustomerSchema } from "@/lib/zod/customers.zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";

export const useUpdateCustomer = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: UpdateCustomerSchema) => {
      const api = useElectronAPI();

      const response = await api.customers.update(id, values);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to update customer");
      }

      const data = response.data;
      return data;
    },
    onMutate: () => {
      toast.loading("Updating Customer...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Customer updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update customer", {
        id: toastId
      });
    }
  });

  return mutation;
};
