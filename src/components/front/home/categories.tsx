import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fetchCategories } from "@/lib/data-fetch";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryCard } from "../category-card";
import { Skeleton } from "@/components/ui/skeleton";
import { unstable_cache as cache } from "next/cache";

const getCategories = cache(() => fetchCategories(), ["categories"]);

export async function Categories() {
  const allCategories = await getCategories();
  return (
    <Carousel
      opts={{
        align: "center",
        dragFree: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
          <Link href="/categories">
            <Card className="h-full bg-gradient-to-b from-red-600 to-red-800 rounded-md">
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
            <CategoryCard category={category} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:block" />
      <CarouselNext className="hidden md:block" />
    </Carousel>
  );
}

export function CategoriesLoading() {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, i) => (
          <CarouselItem
            key={i}
            className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          >
            <div className="relative aspect-square">
              <Skeleton className="h-full w-full rounded-2xl" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
