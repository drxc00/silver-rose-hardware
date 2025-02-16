import React from "react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { ProductsGrid } from "@/components/front/products-grid";
import { SerializedProductWithRelatedData } from "@/app/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const urlParams = await params;
  const slug = urlParams.slug;
  const category = await prisma.category.findUnique({
    where: { slug },
  });
  return {
    title: `${category?.name} | Silver Rose Hardware`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const urlParams = await params;
  const slug = urlParams.slug;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const allCategoryIds = [
    category.id,
    ...category.children.map((child) => child.id),
  ];

  const products = await prisma.product.findMany({
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
  });

  const serializedProducts = products.map((product) => ({
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      price: variant.price.toString(),
    })),
  }));

  return (
    <div className="px-8 w-full h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
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
      <ProductsGrid
        products={serializedProducts as SerializedProductWithRelatedData[]}
      />
    </div>
  );
}
