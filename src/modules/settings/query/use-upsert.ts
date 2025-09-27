import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { useElectronAPI } from "@/hooks/use-electron-api";
import { AppSettingsMapInsertT } from "@/lib/zod/settings.zod";

export const useUpsertSettings = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (payload: AppSettingsMapInsertT) => {
      const api = useElectronAPI();

      const response = await api.settings.upsert(payload);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to update settings");
      }

      const data = response.data;
      return data;
    },
    onMutate: () => {
      toast.loading("Updating settings...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Settings updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update settings", {
        id: toastId
      });
    }
  });

  return mutation;
};
