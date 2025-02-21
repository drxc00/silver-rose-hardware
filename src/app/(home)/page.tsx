import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/front/product-card";
import { CategoryTree, ProductWithRelatedData } from "../types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { fetchCategories } from "@/lib/data-fetch";
import { CategoryCard } from "@/components/front/category-card";
import { UnderPricesCard } from "@/components/front/under-prices-card";
import { Sparkles } from "lucide-react";
import { unstable_cache as cache } from "next/cache";

const getHomePageData = cache(async () => {
  const [featuredProducts, allCategories] = await Promise.all([
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
    }),
    fetchCategories(),
  ]);

  return {
    featuredProducts,
    allCategories,
  };
});

export default async function Home() {
  const { featuredProducts, allCategories } = await getHomePageData();
  return (
    <main className="flex flex-col bg-background mb-auto">
      <section className="relative w-full h-svh max-h-[500px] flex items-center justify-center">
        <Image
          src="/hero_image.jpg"
          alt="Hero background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-4 max-w-5xl">
            Get the <span className="text-primary">Best Price</span> for your
            Hardware Needs
          </h1>
          <Link href="/products">
            <Button size="lg">Shop Now</Button>
          </Link>
        </div>
      </section>
      <section className="px-40 py-10">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold text-star mb-4">
            Featured Products
          </h1>
          <Link href="/" className="underline">
            View all products
          </Link>
        </div>
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
            {(featuredProducts).map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <div className="h-full">
                  <ProductCard product={JSON.parse(JSON.stringify(product)) as ProductWithRelatedData} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
      <section className="px-40 py-10 bg-background">
        <h1 className="text-3xl font-bold text-star mb-4">Categories</h1>
        <div className="w-full">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="">
              <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <Link href="/categories">
                  <Card className="h-full bg-gradient-to-b from-red-600 to-red-800 rounded-2xl">
                    <CardContent className="p-0 flex items-center justify-center h-full">
                      <h1 className="font-bold text-2xl max-w-xs text-primary-foreground">
                        All Categories
                      </h1>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
              {allCategories.map((category) => (
                <CarouselItem
                  key={category.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <CategoryCard category={category as CategoryTree} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="flex gap-4 pt-28">
          <UnderPricesCard
            headerText="Price under ₱ 500"
            image={"/under_500.jpg"}
            href="/products?maxPrice=500"
          />
          <UnderPricesCard
            headerText="Price under ₱ 1000"
            image={"/under_1000.jpg"}
            href="/products?maxPrice=1000"
          />
          <UnderPricesCard
            headerText="Price under ₱ 1500"
            image={"/under_1500.jpg"}
            href="/products?maxPrice=1500"
          />
        </div>
      </section>
      <section className="flex justify-center h-52 pb-8">
        <div className="flex flex-col justify-center max-w-lg gap-4">
          <h1 className="text-3xl font-bold text-center">
            Not sure what you are looking for?
          </h1>
          <p className="text-muted-foreground text-center text-sm">
            Describe what you are looking for and our AI will recommend the best
            product
          </p>
          <Button>
            <Sparkles />
            <span>Ask AI</span>
          </Button>
        </div>
      </section>
    </main>
  );
}
