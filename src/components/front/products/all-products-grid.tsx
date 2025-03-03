import { fetchAllProducts, fetchCategories } from "@/lib/data-fetch";
import { prisma } from "@/lib/prisma";
import { Pagination } from "../products-pagination";
import { ProductsGrid } from "../products-grid";

export async function ProductsContent({
  currentPage,
  itemsPerPage,
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
            slug: true,
            name: true,
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
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
                    id: true,
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
    <div className="px-6">
      <ProductsGrid
        products={JSON.parse(JSON.stringify(products))}
        categories={categories}
      />
      <div className="mt-8 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
