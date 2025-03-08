import { CategoryTree } from "@/app/types";
import { AdminHeader } from "@/components/admin/admin-header";
import { EditProductForm } from "@/components/admin/products/edit/edit-product-form";
import {
  fetchAllProducts,
  fetchAttributes,
  fetchCategories,
  fetchProduct,
} from "@/lib/data-fetch";

// Add generateStaticParams to pre-render all product pages at build time
export async function generateStaticParams() {
  const products = await fetchAllProducts();

  return products.map((product) => ({
    id: product.id.toString() || "",
  }));
}

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
      <section className="p-4 mx-auto">
        <EditProductForm
          product={JSON.parse(JSON.stringify(product))}
          categories={categories as CategoryTree[]}
          attributes={attributes}
        />
      </section>
    </div>
  );
}
