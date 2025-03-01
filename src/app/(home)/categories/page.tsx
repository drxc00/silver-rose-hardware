import { CategoryCard } from "@/components/front/category-card";
import { fetchCategories } from "@/lib/data-fetch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | Silver Rose Hardware",
};

export const revalidate = 3600; // Revalidate every hour

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <main className="mx-auto h-full py-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center pb-10">Categories</h1>
        <div className="grid grid-cols-4 gap-10 justify-center">
          {categories.map((category) => (
            <div key={category.id} className="h-72 w-72 rounded-md">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
