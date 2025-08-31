import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  insertProductSchema,
  InsertProductSchema,
  SelectProductSchema
} from "@/lib/zod/products.zod";
import { CategoryDropdown } from "@/modules/categories/components/category-dropdown";
import { ImageUploader } from "@/modules/image-manager/components/image-uploader";
import { useCreateProduct } from "../queries/use-create";
import { useGetProductByIdMutated } from "../queries/use-mutated-get-by-id";
import { useUpdateProduct } from "../queries/use-update";
import { UnitsDropdown } from "./units-dropdown";

type FormMode = "create" | "edit";

type Props = {
  className?: string;
  mode: FormMode;
  productId?: string;
};

export function ProductForm({ className, mode, productId }: Props) {
  const [formMode, setFormMode] = useState<FormMode>(mode);
  const [currentProduct, setCurrentProduct] =
    useState<SelectProductSchema | null>(null);

  const { mutateAsync: createProduct, isPending: creatingProduct } =
    useCreateProduct();
  const { mutateAsync: updateProduct, isPending: updatingProduct } =
    useUpdateProduct(productId || currentProduct?.id || "");
  const { mutateAsync: getProductById, isPending: fetchingProduct } =
    useGetProductByIdMutated();

  const form = useForm<InsertProductSchema>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      barcode: "",
      description: "",
      price: 0,
      discountedPrice: 0,
      stockQuantity: 0,
      unit: "",
      imageFilename: "",
      isActive: true
    }
  });

  useEffect(() => {
    if (formMode === "edit") {
      if (productId) {
        handleFetchProduct(productId);
      }
    }
  }, [formMode, productId]);

  useEffect(() => {
    if (formMode === "edit" && currentProduct) {
      form.reset({
        ...currentProduct,
        categoryId: currentProduct.category.id
      });
    }
  }, [formMode, currentProduct, form]);

  // Listen to form -> price value and update discounted price value simultanously
  const priceValue = form.watch("price");

  useEffect(() => {
    // const discountedPrice = priceValue ? priceValue * 0.8 : 0;
    const discountedPrice = priceValue;
    form.setValue("discountedPrice", discountedPrice);
  }, [priceValue, form]);

  const handleFetchProduct = async (id: string) => {
    const product = await getProductById(id);
    setCurrentProduct(product);
  };

  const handleCreateProduct = async (data: InsertProductSchema) => {
    await createProduct(data, {
      onSuccess: ({ id }) => {
        handleFetchProduct(id);
        setFormMode("edit");
      }
    });
  };

  const handleUpdateProduct = async (data: InsertProductSchema) => {
    await updateProduct(data);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            formMode === "create" ? handleCreateProduct : handleUpdateProduct
          )}
        >
          <div
            className={cn(
              "flex-1 flex flex-col h-full rounded-md bg-secondary/40 dark:bg-secondary/20 border border-foreground/5",
              className
            )}
          >
            <div className="flex-1 h-full">
              <ScrollArea className="h-[calc(100dvh-260px)]">
                <div className="px-6 py-8 flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{`Product Name`}</FormLabel>
                        <FormControl className="flex-1 h-full">
                          <div>
                            {fetchingProduct ? (
                              <Skeleton className="w-full h-12" />
                            ) : (
                              <Input
                                className="w-full h-12 bg-white shadow-none"
                                placeholder="Elephant House - Strawberry Ice Cream (500ml)"
                                {...field}
                              />
                            )}
                          </div>
                        </FormControl>
                        {/* <FormDescription>
                          Enter your product name in english or sinhala
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Category</FormLabel>
                          <FormControl className="flex-1 h-full">
                            <div>
                              {fetchingProduct ? (
                                <Skeleton className="w-full h-12" />
                              ) : (
                                <CategoryDropdown
                                  defaultSelected={
                                    formMode === "edit"
                                      ? currentProduct?.category || null
                                      : null
                                  }
                                  onSelect={(category) => {
                                    field.onChange(category.id);
                                  }}
                                  maxItems={6}
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Select your Product Category
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Barcode</FormLabel>
                          <FormControl className="flex-1 h-full">
                            <div>
                              {fetchingProduct ? (
                                <Skeleton className="w-full h-12" />
                              ) : (
                                <Input
                                  className="w-full h-12 bg-white shadow-none"
                                  placeholder="Ex: 4212230126191"
                                  {...field}
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Use barcode reader to scan product barcode
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{`Description (Optional)`}</FormLabel>
                        <FormControl className="flex-1 h-full">
                          <div>
                            {fetchingProduct ? (
                              <Skeleton className="w-full h-18" />
                            ) : (
                              <Textarea
                                className="w-full h-18 bg-white shadow-none"
                                placeholder="Write something about new product..."
                                {...field}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Price</FormLabel>
                          <FormControl className="flex-1 h-full">
                            <div>
                              {fetchingProduct ? (
                                <Skeleton className="w-full h-12" />
                              ) : (
                                <Input
                                  className="w-full h-12 bg-white shadow-none"
                                  type="number"
                                  placeholder="Ex: 1000.00"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(parseFloat(e.target.value));
                                  }}
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Product labeled price
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discountedPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Discounted Price</FormLabel>
                          <FormControl className="flex-1 h-full">
                            <div>
                              {fetchingProduct ? (
                                <Skeleton className="w-full h-12" />
                              ) : (
                                <Input
                                  className="w-full h-12 bg-white shadow-none"
                                  type="number"
                                  placeholder="Ex: 1000.00"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(parseFloat(e.target.value));
                                  }}
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Discounted price of your shop
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="stockQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Stock Quantity</FormLabel>
                          <FormControl className="flex-1 h-full">
                            <div>
                              {fetchingProduct ? (
                                <Skeleton className="w-full h-12" />
                              ) : (
                                <Input
                                  className="w-full h-12 bg-white shadow-none"
                                  type="number"
                                  placeholder="Ex: 10"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(parseInt(e.target.value));
                                  }}
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Unit</FormLabel>
                          <FormControl className="flex-1 h-full">
                            <div>
                              {fetchingProduct ? (
                                <Skeleton className="w-full h-12" />
                              ) : (
                                <UnitsDropdown
                                  defaultValue={field.value}
                                  onSelect={(value) => {
                                    field.onChange(value);
                                  }}
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="imageFilename"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Image</FormLabel>
                        <FormControl className="flex-1 h-full">
                          <div>
                            {fetchingProduct ? (
                              <Skeleton className="w-full h-12" />
                            ) : formMode === "edit" && field.value !== "" ? (
                              <ImageUploader
                                initialFilename={field.value}
                                onUploaded={(filename) =>
                                  field.onChange(filename)
                                }
                              />
                            ) : (
                              <ImageUploader
                                onUploaded={(filename) =>
                                  field.onChange(filename)
                                }
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>
            </div>

            <div className="flex items-center justify-between p-4 border-t border-foreground/5 flex-shrink-0">
              <Button
                variant="outline"
                type="button"
                onClick={() => form.reset()}
              >
                Reset Form
              </Button>
              <Button
                loading={creatingProduct || updatingProduct}
                type="submit"
                icon={formMode === "create" ? <PlusCircleIcon /> : <EditIcon />}
              >
                {formMode === "create" ? "Create Product" : "Edit Product"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
