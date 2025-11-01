import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  storeSettingsSchema,
  type StoreSettingsT
} from "@/lib/zod/settings.zod";
import { ImageUploader } from "@/modules/image-manager/components/image-uploader";
import { useGetSettings } from "../query/use-get";
import { useUpsertSettings } from "../query/use-upsert";

type Props = {
  className?: string;
};

export function StoreSettings({ className }: Props) {
  const { data, isFetching, error } = useGetSettings();
  const { mutate, isPending } = useUpsertSettings();

  const form = useForm<StoreSettingsT>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      storeName: "",
      storeLogo: "",
      address: "",
      contactPhone: ""
    }
  });

  useEffect(() => {
    if (data && !error) {
      form.reset({
        address: data.address,
        contactPhone: data.contactPhone,
        storeLogo: data.storeLogo,
        storeName: data.storeName
      });
    }
  }, [data, error]);

  const handleSubmit = (data: StoreSettingsT) => {
    mutate({ ...data });
  };

  if (isFetching) {
    return (
      <Skeleton className="w-full rounded-lg h-40 flex items-center justify-center">
        <Loader className="size-4 animate-spin text-foreground/80" />
      </Skeleton>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card className={cn("bg-secondary/30", className)}>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>
              Update your store information for billing and other activities.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex items-start gap-6">
            <div className="flex-1/4">
              <FormField
                control={form.control}
                name="storeLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Logo</FormLabel>
                    <FormControl>
                      {field.value ? (
                        <ImageUploader
                          initialFilename={field.value}
                          onUploaded={(filename) => field.onChange(filename)}
                        />
                      ) : (
                        <ImageUploader
                          onUploaded={(filename) => field.onChange(filename)}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6 w-full flex-3/4">
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white h-12 shadow-none"
                        placeholder="Store Name"
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
                    <FormLabel>Store Address</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white h-12 shadow-none"
                        placeholder="Store Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white h-12 shadow-none"
                        placeholder="Store contact number/s"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button loading={isPending} disabled={isPending} type="submit">
              Update Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
