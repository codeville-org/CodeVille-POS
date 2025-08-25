import { PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

import PageContainer from "@/components/layouts/dashboard/page-container";
import { AppPageShell } from "@/components/layouts/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useElectronAPI } from "@/hooks/use-electron-api";

type Props = {};

export function CategoriesPage({}: Props) {
  const api = useElectronAPI();
  const [categoryName, setCategoryName] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    handleFetchCategories();
  }, [loading]);

  const handleFetchCategories = async () => {
    try {
      setFetching(true);
      const res = await api.categories.getAll({
        page: "1",
        limit: "1000",
        // search: "",
        sort: "asc"
      });

      if (res.error) throw new Error(res.error);

      console.log(res);

      setAllCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      setLoading(true);

      const res = await api.categories.create({ name: categoryName });
      if (res.error) throw new Error(res.error);

      setCategoryName("");
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage Categories"
          description={`Manage all categories listed on the platform`}
          actionComponent={
            <Button asChild variant={"outline"} icon={<PlusCircleIcon />}>
              Create new Category
            </Button>
          }
        />

        <Separator />

        {/* Dummy Category Create Form */}
        <div className="flex items-center gap-3">
          <Input
            placeholder="Category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Button
            onClick={handleCreateCategory}
            disabled={!categoryName}
            loading={loading}
          >
            Create Category
          </Button>
        </div>

        {/* Dummy Category Listing */}
        {fetching && <div>Loading categories...</div>}
        <div className="flex flex-col space-y-2">
          {allCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between"
            >
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
