import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, TrashIcon, UserPenIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TEXTS } from "@/lib/language";
import {
  SelectCustomer,
  updateCustomerSchema,
  UpdateCustomerSchema
} from "@/lib/zod/customers.zod";
import { usePersistStore } from "@/lib/zustand/persist-store";
import { ListingView } from "@/shared/types/global";
import { useDeleteCustomer } from "../queries/use-delete";
import { useUpdateCustomer } from "../queries/use-update";

type Props = {
  view?: ListingView;
  customer: SelectCustomer;
};

export function CustomerActions({ view = "list", customer }: Props) {
  const { language } = usePersistStore();
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const { mutate: mutateUpdate, isPending: isUpdating } = useUpdateCustomer(
    customer.id
  );

  const { mutateAsync: mutateDelete, isPending: isDeleting } =
    useDeleteCustomer(customer.id);

  const updateForm = useForm<UpdateCustomerSchema>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      name: customer.name,
      address: customer.address,
      currentBalance: customer.currentBalance,
      isActive: customer.isActive,
      notes: customer.notes,
      phone: customer.phone,
      totalCreditLimit: customer.totalCreditLimit
    }
  });

  const handleDelete = async () => {
    await mutateDelete();
    setIsDeleteOpen(false);
  };

  const handleUpdate = (data: UpdateCustomerSchema) => {
    if (data.currentBalance > customer.totalCreditLimit) {
      toast.warning("Current balance exceeds total credit limit");
      return;
    }

    mutateUpdate(
      { ...data },
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
            <DialogContent className="sm:max-w-[500px] flex flex-col">
              <Form {...updateForm}>
                <form>
                  <DialogHeader>
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/5 p-3">
                        <UserPenIcon className="size-5 text-primary" />
                      </div>

                      <div className="space-y-1">
                        <DialogTitle>
                          {TEXTS.customers.update.title[language]}
                        </DialogTitle>
                        <DialogDescription>
                          {TEXTS.customers.update.description[language]}
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="my-6 flex flex-col gap-5">
                    <FormField
                      control={updateForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {TEXTS.customers.addNew.form.name[language]}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                TEXTS.customers.addNew.form.name.placeholder[
                                  language
                                ]
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={updateForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {TEXTS.customers.addNew.form.phone[language]}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  TEXTS.customers.addNew.form.phone.placeholder[
                                    language
                                  ]
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {TEXTS.customers.addNew.form.address[language]}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  TEXTS.customers.addNew.form.address
                                    .placeholder[language]
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={updateForm.control}
                      name="currentBalance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {
                              TEXTS.customers.addNew.form.currentBalance[
                                language
                              ]
                            }
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                TEXTS.customers.addNew.form.currentBalance
                                  .placeholder[language]
                              }
                              {...field}
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={updateForm.control}
                      name="totalCreditLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {
                              TEXTS.customers.addNew.form.totalCreditLimit[
                                language
                              ]
                            }
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                TEXTS.customers.addNew.form.totalCreditLimit
                                  .placeholder[language]
                              }
                              {...field}
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={updateForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {TEXTS.customers.addNew.form.notes[language]}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="h-16"
                              placeholder={
                                TEXTS.customers.addNew.form.notes.placeholder[
                                  language
                                ]
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">
                        {TEXTS.actions.cancel[language]}
                      </Button>
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
                </form>
              </Form>
            </DialogContent>
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
                <AlertDialogCancel>
                  {TEXTS.actions.cancel[language]}
                </AlertDialogCancel>
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
