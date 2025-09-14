import { ZapIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectCategory } from "@/lib/zod/categories.zod";
import { usePosStore } from "@/lib/zustand/pos-store";
import { useGetAllCategories } from "@/modules/categories/queries/use-get-all";

type Props = {};

export function CategoriesBar({}: Props) {
  const { filter, setFilter } = usePosStore();

  const { data, isPending, error } = useGetAllCategories({
    page: "1",
    limit: "5"
  });

  if (error) return <></>;

  if (isPending) {
    return (
      <div className="flex items-center gap-2 p-4">
        {Array(5)
          .fill("_")
          .map((_, index) => (
            <Skeleton className="w-36 h-10 rounded-full" key={index} />
          ))}
      </div>
    );
  }

  return (
    <ScrollArea className="flex items-center whitespace-nowrap w-full">
      <div className="flex items-center gap-2 p-4">
        <Badge
          variant={filter === "featured" ? "default" : "secondary"}
          className="rounded-full hover:shadow hover:-translate-y-0.5 ease-in-out h-10 px-4 text-sm transition-all duration-150 cursor-pointer"
          onClick={() =>
            filter === "featured" ? setFilter("all") : setFilter("featured")
          }
        >
          <ZapIcon fill="#fff" />
          Quick Access
        </Badge>

        {data.data.map((category) => (
          <Badge
            key={category.id}
            variant={
              (filter as SelectCategory).id === category.id
                ? "default"
                : "secondary"
            }
            className="rounded-full hover:shadow hover:-translate-y-0.5 ease-in-out h-10 px-4 text-sm transition-all duration-150 cursor-pointer"
            onClick={() =>
              (filter as SelectCategory).id === category.id
                ? setFilter("all")
                : setFilter(category)
            }
          >
            {category.name}
          </Badge>
        ))}
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
