import { CategoryCard } from "@/components/front/category-card";
import { fetchCategories } from "@/lib/data-fetch";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Categories | Silver Rose Hardware",
}

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <main className="mx-auto p-20">
      <div>
        <h1 className="text-3xl font-bold text-center pb-10">Categories</h1>
        <div className="grid grid-cols-4 gap-10">
          {categories.map((category) => (
            <div className="h-72 w-72 rounded-md">
              <CategoryCard key={category.id} category={category} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
