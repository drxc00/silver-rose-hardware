import { Suspense } from "react";
import { ProductsGrid } from "@/components/front/products-grid";
import { prisma } from "@/lib/prisma";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/front/products-pagination";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const slug = (await params).subSlug;
  const category = await prisma.category.findUnique({
    where: { slug: slug },
  });
  return {
    title: `${category?.name} | Silver Rose Hardware`,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const subSlug = (await params).subSlug;
  const currentPage = Number((await searchParams)?.page) || 1;

  return (
    <Suspense fallback={<SubcategoryPageLoading />}>
      <SubcategoryContent subSlug={subSlug} currentPage={currentPage} />
    </Suspense>
  );
}

function SubcategoryPageLoading() {
  return (
    <div className="px-0 md:px-8 w-full h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-gray-900">
          Categories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <div className="w-24 h-5 bg-gray-200 animate-pulse rounded"></div>
        <ChevronRight className="h-4 w-4" />
        <div className="w-32 h-5 bg-gray-200 animate-pulse rounded"></div>
      </div>
      
      {/* Category Title */}
      <div className="w-64 h-9 bg-gray-200 animate-pulse rounded mb-6"></div>
      
      {/* Products Grid */}
      <ProductsGrid products={[]} isLoading />
    </div>
  );
}

async function SubcategoryContent({ 
  subSlug, 
  currentPage 
}: { 
  subSlug: string; 
  currentPage: number;
}) {
  const itemsPerPage = 20;

  const [category, products, productsCount] = await Promise.all([
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
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    }),
    prisma.product.count({
      where: {
        category: {
          slug: subSlug,
        },
      },
    })
  ]);

  const totalPages = Math.ceil(productsCount / itemsPerPage);

  return (
    <div className="px-0 md:px-8 w-full h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-gray-900">
          Categories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link 
          href={`/categories/${category?.parent?.slug}`} 
          className="font-medium text-gray-900 hover:underline"
        >
          {category?.parent?.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-900">{category?.name}</span>
      </div>
      {/* Category Title */}
      <h1 className="text-3xl font-bold mb-4">{category?.name}</h1>
      {/* Products Grid */}
      <ProductsGrid products={JSON.parse(JSON.stringify(products))} />
      <div className="mt-8 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}