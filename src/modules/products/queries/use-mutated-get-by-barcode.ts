import { useMutation } from "@tanstack/react-query";

import { useElectronAPI } from "@/hooks/use-electron-api";

export const useGetProductByBarcodeMutated = () => {
  const mutation = useMutation({
    mutationFn: async (barcode: string) => {
      const api = useElectronAPI();

      const response = await api.products.getByBarcode(barcode);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to get product");
      }

      const data = response.data;
      return data;
    }
  });

  return mutation;
};
