import {
  ProductWithRelatedData,
  SerializedProductWithRelatedData,
} from "@/app/types";
import { ProductCard } from "@/components/front/product-card";
import { ProductPageCard } from "@/components/front/product-page-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchAllProducts, fetchProductUsingSlug, fetchRelatedProducts } from "@/lib/data-fetch";
import Image from "next/image";
import Link from "next/link";

// Static generation
// Add revalidate to the page
export const revalidate = 3600; // Revalidate every hour

// Add generateStaticParams to pre-render all product pages at build time
export async function generateStaticParams() {
  const products = await fetchAllProducts();

  return products.map((product) => ({
    slug: product.slug,
  }));
}

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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const urlParams = await params;
  const productSlug = urlParams.slug;
  const product = (await fetchProductUsingSlug(productSlug).then(
    (product: ProductWithRelatedData) => ({
      ...product,
      variants: product.variants.map((variant) => ({
        ...variant,
        price: variant.price.toNumber(),
      })),
    })
  )) as SerializedProductWithRelatedData;
  const relatedProducts = await fetchRelatedProducts(
    product?.category.id || ""
  );
  return (
    <main className="p-10 lg:px-32 xl:px-48 flex min-h-screen flex-col justify-start bg-muted">
      <Breadcrumb className="pb-8">
        <BreadcrumbList>
          {product?.category && product.category.parent ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/category/${product.category.parent.slug}`}
                >
                  {product.category.parent.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/category/${product.category.parent.slug}/${product.category.slug}`}
                >
                  {product.category.parent.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${product?.category.slug}`}>
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
      <section className="grid grid-cols-2 gap-6 w-full">
        <div className="w-full h-[400px] rounded-lg border mx-auto bg-white p-2 items-center">
          <Image
            src={product?.image || ""}
            alt={product?.name || ""}
            width={600}
            height={400}
            className="w-full h-full object-contain"
          />
        </div>
        <ProductPageCard
          product={product as SerializedProductWithRelatedData}
        />
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
          <div className="grid grid-cols-4 gap-4">
            {relatedProducts.map(
              (relatedProduct) =>
                // This ensures that the current product is not displayed
                relatedProduct.id !== product?.id && (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct as ProductWithRelatedData}
                  />
                )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
