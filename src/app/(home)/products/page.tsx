import { ProductsGrid } from "@/components/front/products-grid";
import { ProductsContent } from "@/components/front/products/all-products-grid";
import { Suspense } from "react";

export function generateMetadata() {
  return {
    title: "Products | Silver Rose Hardware",
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    name?: string;
  }>;
}) {
  const params = await searchParams || {};
  const { page, category, minPrice, maxPrice, name } = params;
  const currentPage = Number(page) || 1;
  const itemsPerPage = 20; // Number of products per page
  return (
    <main className="mx-auto flex justify-center items-start py-10 px-20 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-center pb-10">All Products</h1>
        <div className="w-screen max-w-7xl">
          <Suspense
            fallback={
              <div className="px-6">
                <ProductsGrid products={[]} categories={[]} isLoading />
              </div>
            }
          >
            <ProductsContent
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              categorySlugFilter={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              name={name}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
