import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { TEXTS } from "@/lib/language";
import { cn } from "@/lib/utils";
import { usePersistStore } from "@/lib/zustand/persist-store";
import { Language } from "@/shared/types/global";

type Props = {
  className?: string;
};

export function LanguageSelector({ className }: Props) {
  const { language, setLanguage } = usePersistStore();

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          className={cn(
            "bg-transparent text-foreground text-xs hover:bg-transparent cursor-pointer hover:underline",
            language === "si" ? "font-sinhala" : "font-sans",
            className
          )}
        >
          {TEXTS.language[language]}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSelectLanguage("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSelectLanguage("si")}
          className="font-sinhala"
        >
          සිංහල
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
