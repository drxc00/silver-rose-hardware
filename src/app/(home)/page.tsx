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
      {/* Hero Section - Responsive height and text sizing */}
      <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-svh max-h-[500px] flex items-center justify-center">
        <Image
          src="/hero_image.jpg"
          alt="Hero background"
          fill
          priority
          className="object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-full sm:max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight">
            Get the <span className="text-primary">Best Price</span> for your
            Hardware Needs
          </h1>
          <Link href="/products">
            <Button size="lg" className="mt-2 sm:mt-4 rounded-sm">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products Section - Better padding for small screens */}
      <section className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-star">
            Featured Products
          </h1>
          <Link href="/products" className="underline text-sm sm:text-base">
            View all products
          </Link>
        </div>
        <Suspense fallback={<FeaturedProductsLoading />}>
          <FeaturedProducts />
        </Suspense>
      </section>

      {/* Categories Section - Improved spacing */}
      <section className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 sm:py-10 bg-background">
        <h1 className="text-2xl sm:text-3xl font-bold text-star mb-4">
          Categories
        </h1>
        <div className="w-full">
          <Suspense fallback={<CategoriesLoading />}>
            <Categories />
          </Suspense>
        </div>

        {/* Price Cards - Now responsive grid for all screen sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-10 sm:pt-16 md:pt-20">
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

      {/* AI Help Section - Better padding and responsive height */}
      <section className="flex justify-center py-8 sm:py-12 px-4">
        <div className="flex flex-col justify-center max-w-lg gap-3 sm:gap-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Not sure what you are looking for?
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Describe what you are looking for and our AI will recommend the best
            product
          </p>
          <Link href="/ask">
            <Button className="mx-auto">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Ask AI</span>
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
