import { useMutation } from "@tanstack/react-query";

import { useElectronAPI } from "@/hooks/use-electron-api";

export const useGetProductByIdMutated = () => {
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const api = useElectronAPI();

      const response = await api.products.getById(id);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to get product");
      }

      const data = response.data;
      return data;
    }
  });

  return mutation;
};
