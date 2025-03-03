import { fetchCategories } from "@/lib/data-fetch";
import { CategoryCard } from "../category-card";
import { unstable_cache as cache } from "next/cache";
import { Skeleton } from "@/components/ui/skeleton";

const cachedFetchCategories = cache(fetchCategories);

export async function CategoriesGrid() {
  const categories = await cachedFetchCategories();
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 justify-center">
      {categories.map((category) => (
        <div key={category.id} className="h-72 w-72 rounded-md">
          <CategoryCard category={category} />
        </div>
      ))}
    </div>
  );
}

export function CategoriesGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-72 w-72 rounded-md" />
      ))}
    </div>
  );
}
