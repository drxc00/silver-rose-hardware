import { CategorySidebar } from "@/components/front/category-sidebar";
import { fetchCategories } from "@/lib/data-fetch";
import { unstable_cache as cache } from "next/cache";

const cachedFetchCategories = cache(fetchCategories, ["categories"]);

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await cachedFetchCategories();
  return (
    <main className="p-10 md:flex h-full">
      <div className="pb-4 md:p-0">
        <CategorySidebar categories={categories} />
      </div>
      {children}
    </main>
  );
}
