import { fetchCategories } from "@/lib/data-fetch";
import { AdminHeader } from "@/components/admin/admin-header";
import { categoryColumns } from "@/components/admin/categories/columns";
import { DataTable } from "@/components/admin/categories/data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function CategoriesPage() {
  // Fetch the category tree
  const categoryTree = await fetchCategories();
  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader currentPage="Cateogries" />
      <main className="p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Categories</h1>
          <Link href="/admin/products/add">
            <Button>
              <Plus />
              <span>Add Category</span>
            </Button>
          </Link>
        </div>
        <div>
          <DataTable columns={categoryColumns} data={categoryTree} />
        </div>
      </main>
    </div>
  );
}
