import { CategoryTree } from "@/app/types";
import { AdminHeader } from "@/components/admin/admin-header";
import { EditProductForm } from "@/components/admin/products/edit/edit-product-form";
import {
  fetchAttributes,
  fetchCategories,
  fetchProduct,
} from "@/lib/data-fetch";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const urlParams = await params;
  const id = urlParams.id;
  // Fetch all information for the form
  const [product, categories, attributes] = await Promise.all([
    fetchProduct(id),
    fetchCategories(),
    fetchAttributes(),
  ]);

  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader
        currentPage="Edit Product"
        crumbItems={[{ name: "Products", href: "/admin/products" }]}
      />
      <section className="p-4 max-w-4xl mx-auto">
        <EditProductForm
          product={JSON.parse(JSON.stringify(product))}
          categories={categories as CategoryTree[]}
          attributes={attributes}
        />
      </section>
    </div>
  );
}
