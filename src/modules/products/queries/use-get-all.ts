import { useElectronAPI } from "@/hooks/use-electron-api";
import { ProductsQueryParamsSchema } from "@/lib/zod/helpers";
import { useQuery } from "@tanstack/react-query";

export const useGetAllProducts = (queryParams: ProductsQueryParamsSchema) => {
  const query = useQuery({
    queryKey: ["products", { ...queryParams }],
    queryFn: async () => {
      const {
        page = "1",
        limit = "10",
        search = "",
        sort = "desc",
        category = null,
        featured = null
      } = queryParams;

      const api = useElectronAPI();

      const response = await api.products.getAll({
        page,
        limit,
        search,
        sort,
        category,
        featured
      });

      if (!response.data || response.error) {
        throw new Error(response.error || "Failed to fetch products");
      }

      return response.data;
    }
  });

  return query;
};
