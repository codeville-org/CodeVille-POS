import { useQuery } from "@tanstack/react-query";

import { useElectronAPI } from "@/hooks/use-electron-api";

export const useGetProductByBarcode = (barcode: string) => {
  const query = useQuery({
    queryKey: ["products", { barcode }],
    queryFn: async () => {
      const api = useElectronAPI();

      const response = await api.products.getByBarcode(barcode);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to fetch product");
      }

      return response.data;
    }
  });

  return query;
};
