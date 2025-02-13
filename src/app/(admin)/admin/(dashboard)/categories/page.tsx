import { CategoryTree } from "@/app/types";
import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { fetchCategories } from "@/lib/data-fetch";
import { AdminHeader } from "@/components/admin/admin-header";
import { categoryColumns } from "@/components/admin/categories/columns";
import { DataTable } from "@/components/admin/categories/data-table";

export default async function CategoriesPage() {
  // Fetch the category tree
  const categoryTree = await fetchCategories();
  return (
    <div className="min-h-screen bg-muted w-vh ">
      <AdminHeader currentPage="Categories" />
      <div></div>
      <div className="p-6">
        <DataTable columns={categoryColumns} data={categoryTree} />
      </div>
    </div>
  );
}
