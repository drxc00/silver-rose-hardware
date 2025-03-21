import { AdminHeader } from "@/components/admin/admin-header";
import { CategoryForm } from "@/components/admin/categories/category-form";
import { fetchCategories } from "@/lib/data-fetch";

export default async function AddCategoryPage() {
  // Fetch the categories
  const categories = await fetchCategories();
  return (
    <div className="min-h-screen bg-muted w-vh ">
      <AdminHeader
        currentPage="Add Category"
        crumbItems={[{ name: "Categories", href: "/admin/categories" }]}
      />
      <section className="p-4 mx-auto ">
        <CategoryForm categories={categories} />
      </section>
    </div>
  );
}
