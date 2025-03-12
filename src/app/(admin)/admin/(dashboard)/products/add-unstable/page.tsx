import { AdminHeader } from "@/components/admin/admin-header";
import { AddProductForm } from "@/components/admin/products/add/add-product-form";
import { AddProductFormUnstable } from "@/components/admin/products/add/add-product-form-unstable";
import { fetchAttributes, fetchCategories } from "@/lib/data-fetch";

export default async function AddProductPageUnstable() {
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
        <AddProductFormUnstable categories={categories} attributes={attributes} />
      </section>
    </div>
  );
}
