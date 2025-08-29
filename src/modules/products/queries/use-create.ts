import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { useElectronAPI } from "@/hooks/use-electron-api";
import { InsertProductSchema } from "@/lib/zod/products.zod";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: InsertProductSchema) => {
      const api = useElectronAPI();

      const response = await api.products.create(values);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to create product");
      }

      const data = response.data;
      return data;
    },
    onMutate: () => {
      toast.loading("Creating new Product...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("New Product created successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product", {
        id: toastId
      });
    }
  });

  return mutation;
};
