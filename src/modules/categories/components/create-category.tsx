import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { TEXTS } from "@/lib/language";
import { cn } from "@/lib/utils";
import {
  insertCategorySchema,
  type InsertCategorySchema
} from "@/lib/zod/categories.zod";
import { usePersistStore } from "@/lib/zustand/persist-store";
import { useCreateCategory } from "../queries/use-create";

type Props = {
  className?: string;
};

export function CreateCategoryForm({ className }: Props) {
  const { language } = usePersistStore();
  const { mutate, isPending } = useCreateCategory();

  const form = useForm<InsertCategorySchema>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: ""
    }
  });

  const handleSubmitForm = (data: InsertCategorySchema) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className={cn(className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="p-2 group flex items-center rounded-md bg-secondary/50 border border-foreground/10">
                <FormControl className="flex-1 h-full">
                  <input
                    className="w-full h-full pl-3 text-base"
                    placeholder="Bevarages, Dairy ..."
                    {...field}
                  />
                </FormControl>
                <Button
                  disabled={field.value.trim().length === 0}
                  loading={isPending}
                  type="submit"
                  className="rounded-md"
                  icon={<PlusIcon />}
                >
                  {TEXTS.categories.addNew[language]}
                </Button>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
