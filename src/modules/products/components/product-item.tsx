import { BarcodeIcon, CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { SelectProductSchema } from "@/lib/zod/products.zod";
import ImageDisplay from "@/modules/image-manager/components/image-display";
import { ListingView } from "@/shared/types/global";

type Props = {
  view?: ListingView;
  product: SelectProductSchema;
};

export function ProductItem({ view = "list", product }: Props) {
  if (view === "grid") {
    return (
      <Link to={{ pathname: `/products/${product.id}` }}>
        <Card className="p-4 rounded-md shadow-xs hover:shadow-md transition-shadow group">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <ImageDisplay
                alt={product.name}
                filename={product.imageFilename}
                className="w-full h-full aspect-square rounded-md"
                fallbackClassName="w-full h-full aspect-square rounded-md"
              />
              <Badge
                variant="secondary"
                className="absolute top-3 left-3"
              >{`${product.category.name}`}</Badge>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                {product.name}
              </h3>

              <div className="my-2 flex items-center justify-between">
                <Badge variant="destructive">{`${formatPrice(product.price)}`}</Badge>
                <Badge
                  className={cn(
                    "bg-amber-500 text-white hover:bg-amber-600 hover:text-white dark:bg-amber-500/10 dark:text-amber-500 dark:hover:bg-amber-500/20",
                    product.stockQuantity < 3 && "animate-pulse"
                  )}
                >
                  {`Stock: ${product.stockQuantity}`}
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3" />
                <span>{formatDate(product.createdAt)}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      to={{ pathname: `/products/${product.id}` }}
      className="group flex items-center p-3 hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-b-0"
    >
      <div className="flex items-center gap-3 flex-1">
        <ImageDisplay
          alt={product.name}
          filename={product.imageFilename}
          className="w-12 h-12 rounded-md"
          fallbackClassName="w-12 h-12 rounded-md"
        />

        <div className="space-y-0.5">
          <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BarcodeIcon className="h-3 w-3" />
            <span>Barcode : {product.barcode}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary">{`${product.category.name}`}</Badge>
        <Badge variant="destructive">{`${formatPrice(product.price)}`}</Badge>
        <Badge
          className={cn(
            "bg-amber-500 text-white hover:bg-amber-600 hover:text-white dark:bg-amber-500/10 dark:text-amber-500 dark:hover:bg-amber-500/20",
            product.stockQuantity < 3 && "animate-pulse"
          )}
        >
          {`Stock: ${product.stockQuantity}`}
        </Badge>
      </div>
    </Link>
  );
}
