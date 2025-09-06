import { useElectronAPI } from "@/hooks/use-electron-api";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomerByID = (id: string) => {
  const query = useQuery({
    queryKey: ["customers", { id }],
    queryFn: async () => {
      const api = useElectronAPI();

      const response = await api.customers.getById(id);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to fetch customer");
      }

      return response.data;
    }
  });

  return query;
};
