import { useElectronAPI } from "@/hooks/use-electron-api";
import { InsertCategorySchema } from "@/lib/zod/categories.zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";

export const useUpdateCategory = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: InsertCategorySchema) => {
      const api = useElectronAPI();

      const response = await api.categories.update(id, {
        name: values.name,
        updatedAt: new Date()
      });

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to update category");
      }

      const data = response.data;
      return data;
    },
    onMutate: () => {
      toast.loading("Updating Category...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Category updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category", {
        id: toastId
      });
    }
  });

  return mutation;
};
