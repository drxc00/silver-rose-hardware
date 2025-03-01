import { AdminHeader } from "@/components/admin/admin-header";
import { CategoryForm } from "@/components/admin/categories/category-form";
import { fetchCategories, fetchCategory } from "@/lib/data-fetch";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
  /*
   * Direct prisma ORM invocation since a category tree is not needed.
   * This will pre-render all category edit pages at build time regardless of the category tree.
   * Add generateStaticParams to pre-render all product pages at build time
   */
  const categories = await prisma.category.findMany({});
  return categories.map((category) => ({
    id: category.id || "",
  }));
}

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const urlParams = await params;
  const id = urlParams.id;

  const [category, categories] = await Promise.all([
    fetchCategory(id),
    fetchCategories(),
  ]);

  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader
        currentPage="Edit Category"
        crumbItems={[{ name: "Categories", href: "/admin/categories" }]}
      />
      <section className="p-4 max-w-4xl mx-auto">
        <CategoryForm category={category} categories={categories} />
      </section>
    </div>
  );
}
