import { useEffect, useState } from "react";

import { SelectCustomer } from "@/lib/zod/customers.zod";

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
import { useGetAllCustomers } from "../queries/get-all";

type Props = {
  defaultSelected?: SelectCustomer | null;
  onSelect: (custmer: SelectCustomer) => void;
  maxItems?: number;
  loading?: boolean;
};

export function CustomersDropdown({
  defaultSelected,
  onSelect,
  maxItems,
  loading = false
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<SelectCustomer | null>(null);
  const [open, setOpen] = useState(false);
  const { data, isFetching, error } = useGetAllCustomers({
    limit: maxItems ? maxItems.toString() : undefined,
    search: searchTerm
  });

  useEffect(() => {
    if (defaultSelected) {
      setSelected(defaultSelected);
    } else setSelected(null);
  }, [defaultSelected]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={loading}
          aria-expanded={open}
          className="w-full h-12 flex items-center justify-between bg-white shadow-none"
        >
          {isFetching || loading ? (
            <Loader className="size-4 animate-spin" />
          ) : selected && selected?.name ? (
            data.data.find((customer) => customer.name === selected.name)?.name
          ) : (
            "Walk-in Customer"
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search customer..."
            onValueChange={(e) => setSearchTerm(e)}
          />
          <CommandList>
            <CommandEmpty>No customer found.</CommandEmpty>

            <CommandGroup>
              {isFetching ? (
                <CommandItem>
                  <Loader className="size-4 animate-spin" />
                </CommandItem>
              ) : error ? (
                <CommandItem>{error.message}</CommandItem>
              ) : (
                data.data.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={customer.name}
                    onSelect={() => {
                      if (selected?.id === customer.id) {
                        onSelect(null);
                        setSelected(null);
                        setOpen(false);
                      } else {
                        onSelect(customer);
                        setSelected(customer);
                        setOpen(false);
                      }
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected?.name === customer.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {customer.name}
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
