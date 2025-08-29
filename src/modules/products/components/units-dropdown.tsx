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
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { CONSTANTS } from "@/lib/constants";
import { usePersistStore } from "@/lib/zustand/persist-store";

const unitsList = CONSTANTS.PRODUCT_UNITS;

type Props = {
  onSelect: (value: string) => void;
};

export function UnitsDropdown({ onSelect }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const { language } = usePersistStore();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-12 flex items-center justify-between bg-white"
        >
          {value
            ? unitsList.find((unit) => unit.value === value)?.label[language]
            : "Select unit..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search unit..." className="h-9" />
          <CommandList>
            <CommandEmpty>No unit found.</CommandEmpty>
            <CommandGroup>
              {unitsList.map((unit) => (
                <CommandItem
                  key={unit.value}
                  value={unit.value}
                  onSelect={(currentValue) => {
                    onSelect(currentValue); // This is onSelect Prop
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {unit.label[language]}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === unit.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
