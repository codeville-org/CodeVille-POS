import { useEffect, useState } from "react";

import { SelectCategory } from "@/lib/zod/categories.zod";

import { CheckIcon, ChevronsUpDownIcon, Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useGetAllCategories } from "../queries/use-get-all";

type Props = {
  defaultSelected?: SelectCategory | null;
  onSelect: (category: SelectCategory) => void;
  maxItems?: number;
};

export function CategoryDropdown({
  defaultSelected,
  onSelect,
  maxItems
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<SelectCategory | null>(null);
  const [open, setOpen] = useState(false);
  const { data, isFetching, error } = useGetAllCategories({
    limit: maxItems ? maxItems.toString() : undefined,
    search: searchTerm
  });

  useEffect(() => {
    if (defaultSelected) {
      setSelected(defaultSelected);
    }
  }, [defaultSelected]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-12 flex items-center justify-between bg-white shadow-none"
        >
          {isFetching ? (
            <Loader className="size-4 animate-spin" />
          ) : selected && selected?.name ? (
            data.data.find((category) => category.name === selected.name)?.name
          ) : (
            "Select category..."
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search category..."
            onValueChange={(e) => setSearchTerm(e)}
          />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>

            <CommandGroup>
              {isFetching ? (
                <CommandItem>
                  <Loader className="size-4 animate-spin" />
                </CommandItem>
              ) : error ? (
                <CommandItem>{error.message}</CommandItem>
              ) : (
                data.data.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => {
                      onSelect(category);
                      setSelected(category);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected?.name === category.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
