import { CalendarIcon, ShoppingBasketIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { SelectCategory } from "@/lib/zod/categories.zod";
import { ListingView } from "@/shared/types/global";
import { CategoryActions } from "./category-actions";

type Props = {
  view?: ListingView;
  category: SelectCategory;
};

export function CategoryItem({ view = "list", category }: Props) {
  if (view === "grid") {
    return (
      <Card className="p-4 rounded-md shadow-none hover:shadow-md transition-shadow group bg-secondary/10">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <ShoppingBasketIcon className="h-5 w-5" />
            </div>

            <CategoryActions view={view} category={category} />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              <span>{formatDate(category.createdAt)}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="group flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <ShoppingBasketIcon className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarIcon className="h-3 w-3" />
            <span>{formatDate(category.createdAt)}</span>
          </div>
        </div>
      </div>
      <CategoryActions view={view} category={category} />
    </div>
  );
}
