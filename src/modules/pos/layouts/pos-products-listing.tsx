import { Loader, XIcon } from "lucide-react";
import { useState } from "react";

import { Pagination } from "@/components/layouts/dashboard/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePosStore } from "@/lib/zustand/pos-store";
import { ProductItem } from "@/modules/products/components/product-item";
import { useGetAllProducts } from "@/modules/products/queries/use-get-all";

type Props = { className?: string };

export function PosProductsListing({ className }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { filter, searchMode, searchTerm } = usePosStore();

  const filterCategory = typeof filter === "string" ? null : filter.id;

  const { data, isLoading, error } = useGetAllProducts({
    search: searchMode === "manual" ? searchTerm : undefined,
    featured: filter === "featured",
    category: filterCategory
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div
      className={cn(
        "flex-1 flex flex-col h-full bg-secondary/25 dark:bg-secondary/20 border-b border-foreground/5",
        className
      )}
    >
      <div className="flex-1 h-full">
        <ScrollArea className="h-[calc(100dvh-310px)]">
          <div
            className={cn(
              "h-full grid grid-cols-4 gap-4 p-4",
              isLoading && "flex items-center justify-center min-h-[400px]",
              error && "flex items-center justify-center min-h-[400px]"
            )}
          >
            {isLoading && (
              <div className="p-2 rounded-full bg-secondary/20 text-secondary-foreground">
                <Loader className="animate-spin size-6" />
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center flex-col gap-2">
                <div className="p-2 rounded-full bg-destructive/20 text-destructive">
                  <XIcon className="size-6" />
                </div>

                <div className="text-sm text-center">{error.message}</div>
              </div>
            )}

            {data &&
              data.data.map((item) => (
                <ProductItem
                  key={item.id}
                  product={item}
                  view={"grid"}
                  page="pos"
                  onClick={() => console.log(item)}
                />
              ))}
          </div>
        </ScrollArea>
      </div>

      {/* Pagination Bar */}
      {data && (
        <Pagination
          entityName="Products"
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalCount={data.meta.totalCount}
          totalPages={data.meta.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
