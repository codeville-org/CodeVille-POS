import { Loader, XIcon } from "lucide-react";
import { useState } from "react";

import { Pagination } from "@/components/layouts/dashboard/pagination";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPrice } from "@/lib/utils";
import type { SelectProductSchema } from "@/lib/zod/products.zod";
import { usePosStore } from "@/lib/zustand/pos-store";
import { useGetAllProducts } from "@/modules/products/queries/use-get-all";

type Props = { className?: string };

export function PosProductsListing({ className }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const { filter, searchMode, searchTerm, addTransactionItem } = usePosStore();

  const filterCategory = typeof filter === "string" ? null : filter.id;

  const { data, isLoading, error } = useGetAllProducts({
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
    search: searchMode === "manual" ? searchTerm || "" : undefined,
    featured: filter === "featured",
    category: filterCategory
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddToCart = (product: SelectProductSchema) => {
    // Check if product is in stock
    if (product.stockQuantity <= 0) {
      // Could show a toast notification here
      return;
    }

    const item = {
      productId: product.id,
      productName: product.name,
      productBarcode: product.barcode || "",
      unitPrice:
        product.discountedPrice > 0 ? product.discountedPrice : product.price,
      quantity: 1,
      totalAmount:
        product.discountedPrice > 0 ? product.discountedPrice : product.price,
      discountAmount: 0
    };

    addTransactionItem(item);
  };

  return (
    <div
      className={cn(
        "flex-1 flex flex-col h-full bg-secondary/10 dark:bg-secondary/5",
        className
      )}
    >
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {isLoading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="p-3 rounded-full bg-secondary/20 text-secondary-foreground">
                  <Loader className="animate-spin size-8" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center flex-col gap-3 min-h-[400px]">
                <div className="p-3 rounded-full bg-destructive/20 text-destructive">
                  <XIcon className="size-8" />
                </div>
                <div className="text-sm text-center text-muted-foreground">
                  {error.message}
                </div>
              </div>
            )}

            {data && data.data.length === 0 && (
              <div className="flex items-center justify-center flex-col gap-3 min-h-[400px]">
                <div className="text-lg font-medium text-muted-foreground">
                  No products found
                </div>
                <div className="text-sm text-center text-muted-foreground">
                  Try adjusting your search or filter criteria
                </div>
              </div>
            )}

            {data && data.data.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {data.data.map((product) => (
                  <Card
                    key={product.id}
                    className="p-3 rounded-md shadow-xs hover:shadow-md transition-shadow group cursor-pointer"
                    onClick={() => handleAddToCart(product)}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="relative">
                        <div className="aspect-square bg-secondary/30 rounded-md flex items-center justify-center overflow-hidden">
                          {product.imageFilename ? (
                            <img
                              src={`images/${product.imageFilename}`}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <div className="text-4xl font-bold text-muted-foreground/30">
                              {product.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className="absolute top-2 left-2 text-xs"
                        >
                          {product.category?.name || "Uncategorized"}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-2 flex-wrap">
                          {product.discountedPrice > 0 ? (
                            <>
                              <Badge variant="destructive" className="text-xs">
                                {formatPrice(product.discountedPrice)}
                              </Badge>
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              {formatPrice(product.price)}
                            </Badge>
                          )}
                          <Badge
                            className={cn(
                              "bg-amber-500 text-white hover:bg-amber-600 hover:text-white dark:bg-amber-500/10 dark:text-amber-500 dark:hover:bg-amber-500/20 text-xs",
                              product.stockQuantity < 3 && "animate-pulse",
                              product.stockQuantity <= 0 &&
                                "bg-red-500 dark:bg-red-500/10 dark:text-red-500"
                            )}
                          >
                            {product.stockQuantity > 0
                              ? `Stock: ${product.stockQuantity}`
                              : "Out of Stock"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Pagination Bar */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex-shrink-0 border-t border-border/20">
          <Pagination
            entityName="Products"
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalCount={data.meta.totalCount}
            totalPages={data.meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
