import { ProductsGrid } from "@/components/front/products-grid";
import { prisma } from "@/lib/prisma";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const urlParams = await params;
  const slug = urlParams.subSlug;
  const category = await prisma.category.findUnique({
    where: { slug: slug },
  });
  return {
    title: `${category?.name} | Silver Rose Hardware`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const urlParams = await params;
  const subSlug = urlParams.subSlug;
  const [category, products] = await Promise.all([
    prisma.category.findUnique({
      where: {
        slug: subSlug,
      },
      include: {
        parent: true,
      },
    }),
    prisma.product.findMany({
      where: {
        category: {
          slug: subSlug,
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
    }),
  ]);

  return (
    <div className="px-8 w-full h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-gray-900">
          Categories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-900">
          {category?.parent?.name}
        </span>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-900">{category?.name}</span>
      </div>
      {/* Category Title */}
      <h1 className="text-3xl font-bold mb-4">{category?.name}</h1>
      {/* Products Grid */}
      <ProductsGrid products={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}
