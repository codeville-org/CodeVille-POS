import { useElectronAPI } from "@/hooks/use-electron-api";
import { useQuery } from "@tanstack/react-query";

export const useListPrinters = () => {
  const query = useQuery({
    queryKey: ["printers"],
    queryFn: async () => {
      const api = useElectronAPI();

      const response = await api.print.getAvailablePrinters();

      if (!response?.data && response.error) {
        throw new Error(response.error);
      }

      return response.data.printers;
    }
  });

  return query;
};
