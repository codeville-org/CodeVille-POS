import { useElectronAPI } from "@/hooks/use-electron-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";

export const useDeleteCategory = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async () => {
      const api = useElectronAPI();

      const response = await api.categories.delete(id);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to delete category");
      }

      const data = response.data;
      return data;
    },
    onMutate: () => {
      toast.loading("Deleting Category...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category", {
        id: toastId
      });
    }
  });

  return mutation;
};
