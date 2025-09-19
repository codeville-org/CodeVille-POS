import { useElectronAPI } from "@/hooks/use-electron-api";
import { TransactionsQueryParamsSchema } from "@/lib/zod/helpers";
import { useQuery } from "@tanstack/react-query";

export const useGetAllTransactions = (
  queryParams: TransactionsQueryParamsSchema
) => {
  const query = useQuery({
    queryKey: ["transactions", { ...queryParams }],
    queryFn: async () => {
      const {
        page = "1",
        limit = "10",
        search = "",
        sort = "desc",
        customer = ""
      } = queryParams;

      const api = useElectronAPI();

      const response = await api.transactions.getAll({
        page,
        limit,
        search,
        sort,
        customer
      });

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to fetch transactions");
      }

      return response.data;
    }
  });

  return query;
};
