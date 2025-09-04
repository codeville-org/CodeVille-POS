import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { useElectronAPI } from "@/hooks/use-electron-api";
import { useNavigate } from "react-router-dom";

export const useDeleteProduct = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const api = useElectronAPI();

      const response = await api.products.delete(id);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to update product");
      }

      const data = response.data;
      return data;
    },
    onMutate: () => {
      toast.loading("Deleting Product...", { id: toastId });
      navigate("/products");
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product", {
        id: toastId
      });
    }
  });

  return mutation;
};
