import { useElectronAPI } from "@/hooks/use-electron-api";
import { InsertCategorySchema } from "@/lib/zod/categories.zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: InsertCategorySchema) => {
      const api = useElectronAPI();

      const response = await api.categories.create({ name: values.name });

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to create category");
      }

      const data = response.data;
      return data;
    },
    onMutate: () => {
      toast.loading("Creating Category...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Category created successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category", {
        id: toastId
      });
    }
  });

  return mutation;
};
