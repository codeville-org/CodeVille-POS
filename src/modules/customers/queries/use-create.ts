import { useElectronAPI } from "@/hooks/use-electron-api";
import { type CreateCustomerSchema } from "@/lib/zod/customers.zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: CreateCustomerSchema) => {
      const api = useElectronAPI();

      const response = await api.customers.create({ ...values });

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to create customer");
      }

      const data = response.data;
      return data;
    },
    onMutate: () => {
      toast.loading("Creating new customer...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("New customer created successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create customer", {
        id: toastId
      });
    }
  });

  return mutation;
};
