import { useElectronAPI } from "@/hooks/use-electron-api";
import { useQuery } from "@tanstack/react-query";

export const useGetSettings = () => {
  const query = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const api = useElectronAPI();

      const response = await api.settings.get();

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to fetch settings");
      }

      return response.data;
    }
  });

  return query;
};
