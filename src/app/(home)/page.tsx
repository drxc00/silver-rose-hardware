import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { UnderPricesCard } from "@/components/front/under-prices-card";
import { Sparkles } from "lucide-react";
import { Suspense } from "react";
import {
  FeaturedProducts,
  FeaturedProductsLoading,
} from "@/components/front/home/featured-products";
import {
  Categories,
  CategoriesLoading,
} from "@/components/front/home/categories";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  return (
    <main className="flex flex-col bg-background mb-auto">
      <section className="relative w-full h-svh max-h-[500px] flex items-center justify-center">
        <Image
          src="/hero_image.jpg"
          alt="Hero background"
          fill
          priority
          className="object-cover"
          loading="eager"
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
          <Link href="/products" className="underline">
            View all products
          </Link>
        </div>
        <Suspense fallback={<FeaturedProductsLoading />}>
          <FeaturedProducts />
        </Suspense>
      </section>
      <section className="px-40 py-10 bg-background">
        <h1 className="text-3xl font-bold text-star mb-4">Categories</h1>
        <div className="w-full">
          <Suspense fallback={<CategoriesLoading />}>
            <Categories />
          </Suspense>
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
