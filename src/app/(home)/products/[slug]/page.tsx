import {
  RelatedProducts,
  RelatedProductsSkeleton,
} from "@/components/front/products/related-products";
import { ProductPageCard } from "@/components/front/product-page-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchAllProducts, fetchProductUsingSlug } from "@/lib/data-fetch";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { unstable_cache as cache } from "next/cache";
import { Card, CardContent } from "@/components/ui/card";

const cachedFetchProductUsingSlug = cache(fetchProductUsingSlug, ["productPage"]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const urlParams = await params;
  const productSlug = urlParams.slug;
  const product = await fetchProductUsingSlug(productSlug);
  return {
    title: `${product?.name} | Silver Rose Hardware`,
    description: product?.description,
  };
}

// Add generateStaticParams to pre-render all product pages at build time
export async function generateStaticParams() {
  const products = await fetchAllProducts();

  return products.map((product) => ({
    slug: product.slug?.toString() || "",
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const productSlug = (await params).slug;
  const productData = await cachedFetchProductUsingSlug(productSlug);
  const product = JSON.parse(JSON.stringify(productData));
  return (
    <main className="p-6 md:px-10 lg:px-32 flex min-h-screen flex-col justify-start bg-muted">
      <Breadcrumb className="pb-8">
        <BreadcrumbList>
          {product?.category && product.category.parent ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/categories/${product.category.parent.slug}`}
                >
                  {product.category.parent.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/categories/${product.category.parent.slug}/${product.category.slug}`}
                >
                  {product.category.parent.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbLink href={`/categories/${product?.category.slug}`}>
                {product?.category.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="w-full">
        <Card className="rounded-sm shadow-none">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 items-center gap-6 w-full">
            <div className="w-full h-[400px] rounded-lg mx-auto p-2 items-center">
              <Image
                src={product?.image || ""}
                alt={product?.name || ""}
                width={600}
                height={400}
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
            <ProductPageCard product={product} />
          </CardContent>
        </Card>
      </section>
      <section className="pt-10">
        <div>
          <h2 className="text-2xl font-semibold">Description</h2>
          <p>{product?.description}</p>
        </div>
      </section>
      <section className="pt-10">
        <div>
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold py-4">Related Products</h2>
            <Link
              href={
                product?.category?.parent?.id
                  ? `/categories/${product?.category?.slug}/${product?.category?.parent?.slug}`
                  : `/categories/${product?.category?.slug}`
              }
            >
              <p className="text-primary underline">View All</p>
            </Link>
          </div>
          <Suspense fallback={<RelatedProductsSkeleton />}>
            <RelatedProducts categoryId={product?.category?.id} productId={product?.id} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
