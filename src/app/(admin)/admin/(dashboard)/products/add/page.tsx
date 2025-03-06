import { AdminHeader } from "@/components/admin/admin-header";
import { AddProductForm } from "@/components/admin/products/add/add-product-form";
import { fetchAttributes, fetchCategories } from "@/lib/data-fetch";

export default async function AddProductPage() {
  const [categories, attributes] = await Promise.all([
    fetchCategories(),
    fetchAttributes()
  ]);
  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader
        currentPage="Add Product"
        crumbItems={[{ name: "Products", href: "/admin/products" }]}
      />
      <section className="p-4 w-full mx-auto">
        <AddProductForm categories={categories} attributes={attributes} />
      </section>
    </div>
  );
}
