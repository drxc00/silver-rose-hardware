import React from "react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { ProductsGrid } from "@/components/front/products-grid";
import { Pagination } from "@/components/front/products-pagination";
import { unstable_cache as cache } from "next/cache";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const slug = (await params).slug;
  const category = await prisma.category.findUnique({
    where: { slug },
  });
  return {
    title: `${category?.name} | Silver Rose Hardware`,
  };
}

const cachedCategoryChildren = cache(
  async (slug: string) => {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
      },
    });
  },
  ["categoryPage"],
  { revalidate: 3600 }
);

const cachedCategoryProducts = cache(
  async (
    currentPage: number,
    itemsPerPage: number,
    allCategoryIds: string[]
  ) => {
    const args = {
      where: {
        category: {
          id: {
            in: allCategoryIds,
          },
        },
      },
      include: {
        category: true,
        variants: {
          include: {
            attributes: {
              include: {
                attribute: true,
              },
            },
          },
        },
      },
    };
    return Promise.all([
      prisma.product.findMany({
        ...args,
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
        where: {
          status: "visible",
          category: {
            id: {
              in: allCategoryIds,
            },
          },
        },
      }),
      prisma.product.count({
        where: {
          category: {
            id: {
              in: allCategoryIds,
            },
          },
          status: "visible",
        },
      }),
    ]);
  },
  ["categoryPage"],
  { revalidate: 3600, tags: ["products"] }
);

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const [pageParams, pageSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const slug = pageParams.slug;
  const currentPage = Number(pageSearchParams?.page) || 1;
  const itemsPerPage = 20;

  const category = await cachedCategoryChildren(slug);

  if (!category) {
    throw new Error("Category not found");
  }

  const allCategoryIds = [
    category.id,
    ...category.children.map((child) => child.id),
  ];

  const [products, productsCount] = await cachedCategoryProducts(
    currentPage,
    itemsPerPage,
    allCategoryIds
  );

  const totalPages = Math.ceil(productsCount / itemsPerPage);

  return (
    <div className="px-0 md:px-8 w-full h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-gray-900">
          Categories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-900">{category.name}</span>
      </div>

      {/* Category Title */}
      <h1 className="text-3xl font-bold mb-4">{category.name}</h1>

      {/* Subcategories Grid */}
      {category.children.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {category.children.map((subcategory) => (
            <Link
              href={`/categories/${category.slug}/${subcategory.slug}`}
              key={subcategory.id}
              prefetch={true}
            >
              <Card className="relative h-48 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                {subcategory.image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={subcategory.image}
                      alt={subcategory.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gray-100" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-white text-xl font-semibold text-center px-4 z-10">
                    {subcategory.name}
                  </h2>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Products Grid */}
      <ProductsGrid products={JSON.parse(JSON.stringify(products))} />
      <div className="mt-8 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
