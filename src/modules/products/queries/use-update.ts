import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { useElectronAPI } from "@/hooks/use-electron-api";
import { UpdateProductSchema } from "@/lib/zod/products.zod";

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: UpdateProductSchema) => {
      const api = useElectronAPI();

      const response = await api.products.update(id, values);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to update product");
      }

      const data = response.data;
      return data;
    },
    onMutate: () => {
      toast.loading("Updating Product...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Product updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product", {
        id: toastId
      });
    }
  });

  return mutation;
};
