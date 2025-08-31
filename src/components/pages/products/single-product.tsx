import { ArrowLeftCircle, Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import PageContainer from "@/components/layouts/dashboard/page-container";
import { AppPageShell } from "@/components/layouts/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductForm } from "@/modules/products/components/product-form";
import { useGetProductById } from "@/modules/products/queries/use-get-by-id";

type Props = {};

export function SingleProductPage({}: Props) {
  const params = useParams<{ id: string }>();
  const { data, error, isPending } = useGetProductById(params.id);

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="p-2 rounded-full bg-secondary">
          <Loader className="animate-spin size-5 text-secondary-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-col w-full h-full gap-4">
        <AppPageShell
          title={data.name}
          description={data.description || data.barcode}
          actionComponent={
            <Button asChild icon={<ArrowLeftCircle />}>
              <Link to={{ pathname: "/products" }}>Back to Products</Link>
            </Button>
          }
        />

        <Separator />

        <ProductForm mode="edit" productId={data.id} className="flex-1" />
      </div>
    </PageContainer>
  );
}
