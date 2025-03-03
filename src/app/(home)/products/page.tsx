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
  searchParams?: Promise<{ page?: string }>;
}) {
  const currentPage = Number((await searchParams)?.page) || 1;
  const itemsPerPage = 20; // Number of products per page
  return (
    <main className="mx-auto flex justify-center items-start py-10 px-20 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-center pb-10">All Products</h1>
        <div className="w-screen max-w-7xl">
          <Suspense
            fallback={<ProductsGrid products={[]} categories={[]} isLoading />}
          >
            <ProductsContent
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}