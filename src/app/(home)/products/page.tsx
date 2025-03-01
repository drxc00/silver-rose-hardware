import { CategoryTree, ProductWithRelatedData } from "@/app/types";
import { ProductsGrid } from "@/components/front/products-grid";
import { fetchAllProducts, fetchCategories } from "@/lib/data-fetch";

export function generateMetadata() {
  return {
    title: "Products | Silver Rose Hardware",
  };
}

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    // Fetch all products
    // Select only the fields we need
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
    }),
  ]);

  return (
    <main className="mx-auto flex justify-center items-start py-10 px-20 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-center pb-10">All Products</h1>
        <div className="w-screen max-w-7xl">
          <ProductsGrid
            products={
              JSON.parse(JSON.stringify(products)) as ProductWithRelatedData[]
            }
            categories={categories as CategoryTree[]}
          />
        </div>
      </div>
    </main>
  );
}
