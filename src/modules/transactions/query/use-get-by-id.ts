import { useMutation } from "@tanstack/react-query";

import { useElectronAPI } from "@/hooks/use-electron-api";

export const useGetTransactionByID = () => {
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const api = useElectronAPI();

      const response = await api.transactions.getByID(id);

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to fetch transaction");
      }

      const data = response.data;

      return data;
    }
  });

  return mutation;
};
