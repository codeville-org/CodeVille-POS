import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon, UserRoundPlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
  createCustomerSchema,
  type CreateCustomerSchema
} from "@/lib/zod/customers.zod";
import { usePersistStore } from "@/lib/zustand/persist-store";
import { useCreateCustomer } from "../queries/use-create";

type Props = {
  className?: string;
  triggerText?: string;
};

export function CreateCustomerForm({ className, triggerText }: Props) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { language } = usePersistStore();
  const { mutate, isPending } = useCreateCustomer();

  const form = useForm<CreateCustomerSchema>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      totalCreditLimit: 5000,
      currentBalance: 0,
      notes: "",
      isActive: true
    }
  });

  const handleSubmit = async (data: CreateCustomerSchema) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        setDialogOpen(false);
      }
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className={className}
          icon={<PlusCircleIcon />}
        >
          {triggerText || TEXTS.customers.addNew[language]}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/5 p-3">
                  <UserRoundPlusIcon className="size-5 text-primary" />
                </div>

                <div className="space-y-1">
                  <DialogTitle>{TEXTS.customers.addNew[language]}</DialogTitle>
                  <DialogDescription>
                    {TEXTS.customers.addNew.subtitle[language]}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Form */}
            <div className="my-6 flex flex-col gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {TEXTS.customers.addNew.form.name[language]}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          TEXTS.customers.addNew.form.name.placeholder[language]
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
                  control={form.control}
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
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {TEXTS.customers.addNew.form.address[language]}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            TEXTS.customers.addNew.form.address.placeholder[
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

              <FormField
                control={form.control}
                name="totalCreditLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {TEXTS.customers.addNew.form.totalCreditLimit[language]}
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
                control={form.control}
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
                type="submit"
                icon={<PlusCircleIcon />}
                loading={isPending}
              >
                {TEXTS.actions.create[language]}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
