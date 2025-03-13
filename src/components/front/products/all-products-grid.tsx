import { fetchAllProducts, fetchCategories } from "@/lib/data-fetch";
import { prisma } from "@/lib/prisma";
import { Pagination } from "../products-pagination";
import { ProductsGrid } from "../products-grid";
import { unstable_cache as cache } from "next/cache";
import { CategoryTree } from "@/app/types";

const fetchedData = cache(
  async (
    currentPage: number,
    itemsPerPage: number,
    categorySlugFilter?: string,
    minPrice?: number,
    maxPrice?: number,
    name?: string
  ) => {
    const categories = await fetchCategories();
    
    // Build the where condition for products
    const whereCondition: any = {
      status: "visible",
    };
    
    // Add name filtering if provided
    if (name) {
      whereCondition.name = {
        contains: name,
        mode: 'insensitive'
      };
    }
    
    // Add category filtering if provided and not 'all'
    if (categorySlugFilter && categorySlugFilter !== "all") {
      whereCondition.OR = [
        {
          category: {
            slug: categorySlugFilter,
          },
        },
        {
          category: {
            parent: {
              slug: categorySlugFilter,
            },
          },
        },
      ];
    }
    
    // Add price filtering if provided
    if (minPrice !== undefined) {
      whereCondition.variants = {
        some: {
          price: {
            gte: minPrice,
          },
        },
      };
    }
    
    if (maxPrice !== undefined) {
      // If we already have a variants filter, append to it
      if (whereCondition.variants) {
        whereCondition.variants.some.price = {
          ...whereCondition.variants.some.price,
          lte: maxPrice,
        };
      } else {
        whereCondition.variants = {
          some: {
            price: {
              lte: maxPrice,
            },
          },
        };
      }
    }
    
    const products = await fetchAllProducts({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        description: true,
        hasVariant: true,
        status: true,
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
      where: whereCondition,
    });
    
    // Count products with the same filtering conditions to get accurate total
    const totalProducts = await prisma.product.count({
      where: whereCondition,
    });
    
    return [categories, products, totalProducts];
  },
  ["productsPage"],
  {
    revalidate: 3600, // 1 hour
    tags: ["products", "categories"],
  }
);

export async function ProductsContent({
  currentPage,
  itemsPerPage,
  categorySlugFilter = "all",
  minPrice,
  maxPrice,
  name,
}: {
  currentPage: number;
  itemsPerPage: number;
  categorySlugFilter?: string;
  minPrice?: number;
  maxPrice?: number;
  name?: string;
}) {
  const [categories, products, totalProducts] = await fetchedData(
    currentPage,
    itemsPerPage,
    categorySlugFilter,
    minPrice,
    maxPrice,
    name
  );

  const totalPages = Math.ceil(Number(totalProducts) / itemsPerPage);

  return (
    <div className="px-6">
      <ProductsGrid
        products={JSON.parse(JSON.stringify(products))}
        categories={categories as CategoryTree[]}
      />
      <div className="mt-8 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}