import { useQuery } from "@tanstack/react-query";

import { useElectronAPI } from "@/hooks/use-electron-api";

export const useGetProductById = (id: string) => {
  const query = useQuery({
    queryKey: ["products", { id }],
    queryFn: async () => {
      const api = useElectronAPI();

      const response = await api.products.getById(id);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to fetch product");
      }

      return response.data;
    }
  });

  return query;
};
