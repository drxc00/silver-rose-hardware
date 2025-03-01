import { CategoryTree, ProductWithRelatedData } from "@/app/types";
import { ProductsGrid } from "@/components/front/products-grid";
import { fetchAllProducts, fetchCategories } from "@/lib/data-fetch";
import { prisma } from "@/lib/prisma";
import { Pagination } from "@/components/front/products-pagination";
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
          <Suspense fallback={<ProductsGrid products={[]} categories={[]} isLoading />}>
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

// This component does the data fetching
async function ProductsContent({ 
  currentPage, 
  itemsPerPage 
}: { 
  currentPage: number; 
  itemsPerPage: number;
}) {
  const [categories, products, totalProducts] = await Promise.all([
    fetchCategories(),
    fetchAllProducts({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        description: true,
        hasVariant: true,
        category: {
          select: {
            id: true,
            name: true,
            parent: true,
          },
        },
        variants: {
          select: {
            id: true,
            price: true,
            attributes: {
              select: {
                attribute: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    }),
    prisma.product.count(), // Get total product count
  ]);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return (
    <>
      <ProductsGrid
        products={JSON.parse(JSON.stringify(products)) as ProductWithRelatedData[]}
        categories={categories as CategoryTree[]}
      />
      <div className="mt-8 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
}