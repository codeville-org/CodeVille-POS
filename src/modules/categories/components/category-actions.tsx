import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TEXTS } from "@/lib/language";
import {
  SelectCategory,
  updateCategorySchema,
  UpdateCategorySchema
} from "@/lib/zod/categories.zod";
import { usePersistStore } from "@/lib/zustand/persist-store";
import { ListingView } from "@/shared/types/global";
import { useDeleteCategory } from "../queries/use-delete";
import { useUpdateCategory } from "../queries/use-update";

type Props = {
  view?: ListingView;
  category: SelectCategory;
};

export function CategoryActions({ view = "list", category }: Props) {
  const { language } = usePersistStore();
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const { mutate: mutateUpdate, isPending: isUpdating } = useUpdateCategory(
    category.id
  );

  const { mutateAsync: mutateDelete, isPending: isDeleting } =
    useDeleteCategory(category.id);

  const updateForm = useForm<UpdateCategorySchema>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name,
      updatedAt: new Date()
    }
  });

  const handleDelete = async () => {
    await mutateDelete();
    setIsDeleteOpen(false);
  };

  const handleUpdate = (data: UpdateCategorySchema) => {
    mutateUpdate(
      { name: data.name },
      {
        onSuccess: () => setIsUpdateOpen(false)
      }
    );
  };

  return (
    <div className="">
      <div className="">
        {isUpdateOpen && (
          <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
            <Form {...updateForm}>
              <form>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {TEXTS.categories.update.title[language]}
                    </DialogTitle>
                    <DialogDescription>
                      {TEXTS.categories.update.description[language]}
                    </DialogDescription>
                  </DialogHeader>

                  <FormField
                    control={updateForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl className="flex-1 h-full">
                          <Input
                            className="h-10"
                            placeholder="Bevarages, Dairy ..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      loading={isUpdating}
                      type="submit"
                      className="rounded-md"
                      onClick={updateForm.handleSubmit(handleUpdate)}
                      icon={<EditIcon />}
                    >
                      {TEXTS.actions.edit[language]}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Form>
          </Dialog>
        )}

        {isDeleteOpen && (
          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will delete the category permanently.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    loading={isDeleting}
                    icon={<TrashIcon />}
                  >
                    {TEXTS.actions.delete[language]}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Badge
          className="p-1.5 cursor-pointer rounded-md text-amber-500 bg-amber-500/10 "
          onClick={() => setIsUpdateOpen(true)}
        >
          <EditIcon className={view === "grid" ? "size-4" : "size-6"} />
          {view === "list" && <span>{TEXTS.actions.edit[language]}</span>}
        </Badge>

        <Badge
          className="p-1.5 cursor-pointer rounded-md text-red-500 bg-red-500/10 "
          onClick={() => setIsDeleteOpen(true)}
        >
          <TrashIcon className={view === "grid" ? "size-4" : "size-6"} />
          {view === "list" && <span>{TEXTS.actions.delete[language]}</span>}
        </Badge>
      </div>
    </div>
  );
}
