import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "../product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { unstable_cache as cache } from "next/cache";

const getFeaturedProducts = cache(() =>
  prisma.product.findMany({
    where: {
      isFeatured: true,
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
  })
);

export async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts();
  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: {
          desktop: 5,
          tablet: 3,
          mobile: 1,
        } as any,
      }}
      className="w-full"
    >
      <CarouselContent className="h-full">
        {featuredProducts.map((product) => (
          <CarouselItem
            key={product.id}
            className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          >
            <div className="h-full">
              <ProductCard product={JSON.parse(JSON.stringify(product))} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

// Skeleton
export function FeaturedProductsLoading() {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, i) => (
          <CarouselItem
            key={i}
            className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          >
            <Card>
              <CardContent className="p-4">
                <div className="h-full space-y-6">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full p-6" />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
